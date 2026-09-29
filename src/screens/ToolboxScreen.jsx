// Groply — src/screens/ToolboxScreen.jsx
// Boîte à outils : métronome, accordeur, lecteur d'accords, manche,
// éditeur de tablature, et accès à Jam Session / Ear Training.
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi, GropiTip } from "../design/Gropi.jsx";
import * as Tone from "tone";
import { playProgression, playTab, stopAll, unlockAudio } from "../audioEngine.js";
import { CHORD_TYPES } from "../fretboardUtils.js";
import { FretboardExplorer } from "./FretboardExplorer.jsx";
import { parseTab } from "../tab/tabParser.js";
import {
  grilleVide, lireCase, ecrireCase, derniereColonne, nbColsVisibles, nbMesuresUtilisees,
  compatibleCroches, saisirChiffre, poserFret, grilleVersEvenements, evenementsVersGrille,
  grilleExemple, grilleValide, PAS_PAR_MESURE,
} from "../tab/tabGrid.js";

// ═══════════════════════════════════════════════════════════════════════════
// MÉTRONOME
// ═══════════════════════════════════════════════════════════════════════════
function Metronome() {
  const C = useC();
  const pillBtn = {
    minWidth:42, height:42, borderRadius:12, border:`1.5px solid ${C.border}`,
    background:C.surface, color:C.text2, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:FONTS.ui,
  };
  const [bpm, setBpm]         = useState(90);
  const [playing, setPlaying] = useState(false);
  const [beats, setBeats]     = useState(4);     // signature (temps par mesure)
  const [current, setCurrent] = useState(-1);    // temps en cours (pour le visuel)

  // ── Timbres du métronome ────────────────────────────────────────────────
  // L'ancien son était un MembraneSynth jouant Do5 / Sol4 : une membrane de
  // percussion, donc quelque chose de rond et « boomy ». Pour un métronome
  // c'est le contraire de ce qu'on veut — il faut une attaque sèche et courte,
  // qui perce le son de la guitare sans la masquer.
  //
  // Trois timbres, parce que « plus naturel » est un jugement d'oreille et
  // qu'il vaut mieux te laisser choisir :
  //
  //   bois       un claquement de bloc de bois. Attaque très brève, bande
  //              passante autour de 1,8 kHz — la zone où l'oreille situe le
  //              mieux une attaque. C'est le son des métronomes de studio, et
  //              c'est le plus précis pour travailler.
  //   mecanique  le métronome à balancier : tic sec sur les temps faibles,
  //              cloche sur le premier temps. Le plus musical des trois.
  //   batterie   grosse caisse sur le 1, charleston sur les autres. Utile pour
  //              jouer « dans » un groove plutôt que sur une grille abstraite.
  const [timbre, setTimbre] = useState("bois");
  const TIMBRES = [
    { id: "bois",      label: "Bois" },
    { id: "mecanique", label: "Mécanique" },
    { id: "batterie",  label: "Batterie" },
  ];

  const voixRef  = useRef(null);   // { fort(), faible(), dispose() }
  const loopRef  = useRef(null);
  const beatRef  = useRef(0);
  // Miroir mutable de `beats`, sur le même principe que `voixRef` pour le
  // timbre. Voir plus bas pourquoi c'est nécessaire.
  const beatsRef = useRef(beats);

  /** Libère les nœuds audio du timbre courant. */
  const libererVoix = useCallback(() => {
    try { voixRef.current?.dispose?.(); } catch { /* noop */ }
    voixRef.current = null;
  }, []);

  /**
   * Construit les deux voix du timbre demandé.
   * Chaque timbre expose `fort(time)` (premier temps) et `faible(time)`.
   */
  const construireVoix = useCallback((id) => {
    // -- Bois : bruit filtré très court. Un bloc de bois, c'est une attaque
    //    large bande immédiatement étouffée par une résonance étroite.
    if (id === "bois") {
      const filtre = new Tone.Filter({ type: "bandpass", frequency: 1800, Q: 2.2 }).toDestination();
      const corps  = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.0005, decay: 0.028, sustain: 0 },
      }).connect(filtre);
      corps.volume.value = -8;
      return {
        fort:   (t) => { filtre.frequency.setValueAtTime(2600, t); corps.triggerAttackRelease(0.02, t, 1); },
        faible: (t) => { filtre.frequency.setValueAtTime(1500, t); corps.triggerAttackRelease(0.02, t, 0.55); },
        dispose: () => { corps.dispose(); filtre.dispose(); },
      };
    }

    // -- Mécanique : tic de bois sur les temps faibles, cloche sur le premier.
    if (id === "mecanique") {
      const filtre = new Tone.Filter({ type: "bandpass", frequency: 1400, Q: 3 }).toDestination();
      const tic = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.0005, decay: 0.022, sustain: 0 },
      }).connect(filtre);
      tic.volume.value = -11;
      // La cloche d'un métronome à balancier sonne vers 2 kHz avec une
      // décroissance longue et des partiels inharmoniques : c'est exactement
      // ce que MetalSynth produit.
      const cloche = new Tone.MetalSynth({
        harmonicity: 5.1, modulationIndex: 16, resonance: 3000, octaves: 1.2,
        envelope: { attack: 0.001, decay: 0.42, release: 0.12 },
      }).toDestination();
      cloche.volume.value = -22;
      return {
        fort:   (t) => cloche.triggerAttackRelease("C6", 0.12, t),
        faible: (t) => tic.triggerAttackRelease(0.02, t, 0.7),
        dispose: () => { tic.dispose(); filtre.dispose(); cloche.dispose(); },
      };
    }

    // -- Batterie : grosse caisse sur le 1, charleston sur les autres temps.
    const grosse = new Tone.MembraneSynth({
      pitchDecay: 0.035, octaves: 5,
      envelope: { attack: 0.001, decay: 0.22, sustain: 0 },
    }).toDestination();
    grosse.volume.value = -7;
    const passeHaut = new Tone.Filter({ type: "highpass", frequency: 7500 }).toDestination();
    const charley = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.026, sustain: 0 },
    }).connect(passeHaut);
    charley.volume.value = -17;
    return {
      fort:   (t) => grosse.triggerAttackRelease("C1", "8n", t),
      faible: (t) => charley.triggerAttackRelease(0.02, t, 0.6),
      dispose: () => { grosse.dispose(); charley.dispose(); passeHaut.dispose(); },
    };
  }, []);

  const ensureClick = useCallback(async () => {
    await Tone.start();
    if (!voixRef.current) voixRef.current = construireVoix(timbre);
  }, [timbre, construireVoix]);

  const stop = useCallback(() => {
    if (loopRef.current) { loopRef.current.stop(); loopRef.current.dispose(); loopRef.current = null; }
    Tone.getTransport().stop();
    setPlaying(false);
    setCurrent(-1);
    beatRef.current = 0;
  }, []);

  const start = useCallback(async () => {
    await ensureClick();
    beatRef.current = 0;
    const transport = Tone.getTransport();
    transport.bpm.value = bpm;
    loopRef.current = new Tone.Loop((time) => {
      // beatsRef.current et non `beats` : voir le commentaire sur beatsRef.
      const b = beatRef.current % beatsRef.current;
      const strong = b === 0;
      const voix = voixRef.current;
      if (voix) (strong ? voix.fort : voix.faible)(time);
      // visuel synchronisé
      Tone.getDraw().schedule(() => setCurrent(b), time);
      beatRef.current += 1;
    }, "4n").start(0);
    transport.start();
    setPlaying(true);
  }, [bpm, beats, ensureClick]);

  // BPM live
  useEffect(() => { Tone.getTransport().bpm.value = bpm; }, [bpm]);

  // Changement de timbre : on reconstruit les voix sans interrompre la mesure.
  // La boucle lit voixRef à chaque temps, donc le nouveau timbre s'applique
  // dès le temps suivant.
  useEffect(() => {
    if (!voixRef.current) return;
    libererVoix();
    voixRef.current = construireVoix(timbre);
  }, [timbre, construireVoix, libererVoix]);

  // Changement de signature (nombre de temps par mesure) EN COURS DE LECTURE.
  //
  // Le bug corrigé : `start()` créait la Tone.Loop avec `beats` capturé dans
  // sa fermeture au moment de l'appui sur play. Changer la signature ensuite
  // déclenchait bien un nouveau rendu (les pastilles à l'écran suivaient),
  // mais la boucle audio DÉJÀ EN COURS gardait l'ancienne valeur pour de bon
  // — elle ne relit jamais son environnement, seulement ce qu'elle a capturé
  // à sa création. Le son n'avait donc plus aucun rapport avec ce qui était
  // affiché.
  //
  // Le timbre n'avait pas ce problème parce qu'il passe déjà par une
  // référence mutable (`voixRef`), relue à chaque battement plutôt que
  // capturée une fois. `beatsRef` applique exactement le même principe :
  // dès qu'on change la mesure, cet effet met à jour la référence, et le
  // battement suivant — quel qu'il soit, immédiatement après le changement —
  // en tient compte.
  useEffect(() => { beatsRef.current = beats; }, [beats]);

  // Nettoyage : arrêter la boucle ET libérer les nœuds audio. L'ancienne
  // version ne libérait jamais le synthé, qui restait connecté à la sortie.
  useEffect(() => () => { stop(); libererVoix(); }, [stop, libererVoix]);

  const toggle = () => (playing ? stop() : start());
  const nudge  = (d) => setBpm(v => Math.min(240, Math.max(40, v + d)));

  // ── Tap tempo ───────────────────────────────────────────────────────────
  // Ce qui n'allait pas : rien ne protégeait d'un double déclenchement. Sur
  // mobile, un bouton peut émettre `touchend` PUIS `click` — deux appuis
  // séparés de quelques millisecondes. L'écart devenait quasi nul, donc le
  // tempo énorme, plafonné à 240. Et une fois à 240, chaque nouvel appui
  // recalculait un tempo ≥ 240 : le curseur semblait bloqué, il fallait le
  // remettre à la main. C'est exactement le comportement que tu décris.
  //
  // Trois garde-fous, plus une moyenne plus robuste :
  //   • écart minimum de 200 ms (soit 300 bpm) : en dessous, ce n'est pas un
  //     appui humain, c'est un doublon d'événement — on l'ignore ;
  //   • au-delà de 2 s sans appui, on repart de zéro plutôt que de mélanger
  //     deux séries de frappes ;
  //   • MÉDIANE et non moyenne : un seul appui décalé ne fausse plus tout,
  //     alors qu'une moyenne se laisse tirer par une valeur aberrante.
  const ECART_MIN_MS = 200;      // 300 bpm — au-delà, c'est un doublon
  const ECART_MAX_MS = 2000;     // 30 bpm — au-delà, nouvelle série
  const TAPS_MAX = 8;            // fenêtre glissante

  const tapsRef = useRef([]);
  const [tapCount, setTapCount] = useState(0);

  const tapTempo = () => {
    const now = performance.now();
    const taps = tapsRef.current;
    const dernier = taps[taps.length - 1];

    if (dernier !== undefined) {
      const ecart = now - dernier;
      // Doublon d'événement : on ne l'enregistre même pas.
      if (ecart < ECART_MIN_MS) return;
      // Trop de temps écoulé : nouvelle série.
      if (ecart > ECART_MAX_MS) {
        tapsRef.current = [now];
        setTapCount(1);
        return;
      }
    }

    tapsRef.current = [...taps, now].slice(-TAPS_MAX);
    setTapCount(tapsRef.current.length);

    if (tapsRef.current.length < 2) return;

    const ecarts = [];
    for (let i = 1; i < tapsRef.current.length; i++) {
      ecarts.push(tapsRef.current[i] - tapsRef.current[i - 1]);
    }
    ecarts.sort((a, b) => a - b);
    const milieu = Math.floor(ecarts.length / 2);
    const median = ecarts.length % 2
      ? ecarts[milieu]
      : (ecarts[milieu - 1] + ecarts[milieu]) / 2;

    setBpm(Math.min(240, Math.max(40, Math.round(60000 / median))));
  };

  // Message d'aide contextuel : le tap tempo n'est évident que pour qui le
  // connaît déjà. Un appui ne suffit pas à déduire un tempo — il faut au moins
  // deux appuis pour mesurer un intervalle —, et rien ne le disait.
  const aideTap =
    tapCount === 0 ? "Tape le tempo au doigt, au moins deux fois."
    : tapCount === 1 ? "Continue : il faut un second appui pour mesurer."
    : `Tempo mesuré sur ${tapCount - 1} intervalle${tapCount > 2 ? "s" : ""}.`;

  const tempoLabel =
    bpm < 60 ? "Largo" : bpm < 76 ? "Adagio" : bpm < 108 ? "Andante" :
    bpm < 120 ? "Moderato" : bpm < 156 ? "Allegro" : bpm < 176 ? "Vivace" : "Presto";

  return (
    <div>
      {/* ── Pastilles de temps ──────────────────────────────────────────────
          Le tremblement de la page venait d'ici. Les pastilles passaient de
          16 à 22 px de LARGEUR et de HAUTEUR à chaque temps : la boîte
          changeait donc de taille, et tout ce qui suit — le BPM géant, le
          curseur, les boutons — se décalait verticalement 100 fois par minute.

          Correctif : la boîte garde une taille FIXE de 24 px, et
          l'agrandissement passe par `transform: scale()`. Une transformation
          est purement visuelle : elle ne participe pas au calcul de mise en
          page, donc rien ne bouge autour. C'est aussi moins coûteux, le
          navigateur n'a ni à recalculer la mise en page ni à repeindre — il
          se contente de composer. */}
      <div style={{
        display:"flex", justifyContent:"center", alignItems:"center",
        gap:10, margin:"8px 0 22px",
        height:24,          // hauteur figée : plus de décalage vertical
      }}>
        {Array.from({ length: beats }).map((_, i) => {
          const on = current === i;
          const strong = i === 0;
          const teinte = strong ? C.primary : C.amber;
          return (
            <div key={i} style={{
              width:24, height:24,           // taille de boîte constante
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0,
            }}>
              <div style={{
                width:16, height:16, borderRadius:"50%",
                background: on ? teinte : C.border,
                transform: on ? "scale(1.35)" : "scale(1)",
                boxShadow: on ? `0 0 0 4px ${teinte}22` : "none",
                // On ne transitionne QUE transform et les couleurs — jamais
                // `all`, qui embarquerait aussi les propriétés de mise en page.
                transition:"transform .08s ease, background-color .08s ease, box-shadow .08s ease",
                willChange:"transform",
              }}/>
            </div>
          );
        })}
      </div>

      {/* BPM géant */}
      <div style={{ textAlign:"center", marginBottom:6 }}>
        <div style={{ fontSize:64, fontWeight:800, color:C.text, letterSpacing:"-2px", lineHeight:1, fontFamily:FONTS.title }}>
          {bpm}
        </div>
        <div style={{ fontSize:12, fontWeight:700, color:C.primary, textTransform:"uppercase", letterSpacing:".1em", marginTop:2 }}>
          BPM · {tempoLabel}
        </div>
      </div>

      {/* Slider */}
      <input type="range" min="40" max="240" value={bpm}
        aria-label="Tempo" aria-valuetext={`${bpm} battements par minute, ${tempoLabel}`}
        onChange={e => setBpm(+e.target.value)}
        style={{ width:"100%", margin:"16px 0 6px", accentColor:C.primary }}/>

      {/* -/+ */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:20 }}>
        {[-5,-1].map(d=>(
          <button key={d} onClick={()=>nudge(d)} aria-label={`Ralentir de ${-d}`} className="gr-focus" style={pillBtn}>{d}</button>
        ))}
        <button onClick={toggle} aria-label={playing ? "Arrêter le métronome" : "Démarrer le métronome"} className="gr-focus" style={{
          width:72, height:72, borderRadius:"50%", border:"none", cursor:"pointer",
          background:`linear-gradient(135deg,#FF9155,${C.primary})`,
          color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 6px 20px ${C.primary}55`,
        }}>
          <Ti name={playing ? "player-pause" : "player-play"} size={30} color="#fff"/>
        </button>
        {[1,5].map(d=>(
          <button key={d} onClick={()=>nudge(d)} aria-label={`Accélérer de ${d}`} className="gr-focus" style={pillBtn}>+{d}</button>
        ))}
      </div>

      {/* Timbre du son */}
      <div style={{
        background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg,
        padding:"10px 12px", marginBottom:10,
      }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:".07em", textTransform:"uppercase", color:C.text2, marginBottom:8 }}>
          Son
        </div>
        <div role="radiogroup" aria-label="Timbre du métronome" style={{ display:"flex", gap:6 }}>
          {TIMBRES.map(t => {
            const actif = timbre === t.id;
            return (
              <button
                key={t.id}
                role="radio"
                aria-checked={actif}
                onClick={() => setTimbre(t.id)}
                className="gr-focus"
                style={{
                  flex:1, padding:"11px 6px", borderRadius:R.md, minHeight:44,
                  border:`1.5px solid ${actif ? C.primary : C.border}`,
                  background: actif ? C.primaryL : C.surface,
                  color: actif ? C.primaryD : C.text2,
                  fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:FONTS.ui,
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Signature + tap */}
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1, background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:"10px 12px" }}>
          <div style={{ fontSize:9.5, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:".06em", marginBottom:7 }}>Mesure</div>
          <div style={{ display:"flex", gap:6 }}>
            {[2,3,4,6].map(n=>(
              <button key={n} onClick={()=>setBeats(n)} aria-pressed={beats===n} aria-label={`${n} temps par mesure`} className="gr-focus" style={{
                flex:1, minHeight:40, padding:"7px 0", borderRadius:8, cursor:"pointer",
                border:`1.5px solid ${beats===n?C.primary:C.border}`,
                background:beats===n?C.primaryL:C.surface,
                color:beats===n?C.primaryD:C.text2, fontWeight:700, fontSize:13, fontFamily:FONTS.ui,
              }}>{n}</button>
            ))}
          </div>
        </div>
        <button
          onClick={tapTempo}
          className="gr-focus"
          aria-label={tapCount > 0 ? `Tap tempo, ${tapCount} appuis comptés` : "Tap tempo"}
          style={{
          width:96, background:C.amberL, border:`1.5px solid ${C.amberBorder}`, borderRadius:R.lg,
          color:C.amberD, fontWeight:700, fontSize:13, fontFamily:FONTS.ui, cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
        }}>
          <Ti name="hand-finger-down" size={18} color={C.amber}/>
          <span style={{ whiteSpace:"nowrap" }}>Tap tempo</span>

          {/* Retour visuel des appuis, sous forme de points et non de chiffre.
              Mon premier essai affichait « Tap tempo · 2 » : le texte passait à
              la ligne dans un bouton de 96 px et donnait l'impression d'un
              défaut d'affichage — sans expliquer ce que valait ce « 2 ».

              Des points se comprennent sans légende (« il compte mes appuis »),
              tiennent sur une ligne, et la zone garde une HAUTEUR FIXE pour ne
              pas décaler la mise en page quand ils apparaissent. */}
          <div aria-hidden="true" style={{
            height:6, display:"flex", gap:3, alignItems:"center", justifyContent:"center",
          }}>
            {Array.from({ length: TAPS_MAX }).map((_, i) => (
              <div key={i} style={{
                width:4, height:4, borderRadius:"50%",
                background: i < tapCount ? C.amber : "transparent",
                transition:"background-color .1s ease",
              }}/>
            ))}
          </div>
        </button>
      </div>

      {/* Aide du tap tempo. `aria-live` pour qu'un lecteur d'écran annonce la
          progression de la mesure ; `minHeight` pour que l'apparition du
          message ne décale pas la mise en page. */}
      <div role="status" aria-live="polite" style={{
        minHeight:18, marginTop:8, textAlign:"center",
        fontSize:11, color:C.text2, fontFamily:FONTS.ui, lineHeight:1.5,
      }}>
        {aideTap}
      </div>
    </div>
  );
}

// pillBtn défini dans Metronome

// ═══════════════════════════════════════════════════════════════════════════
// ACCORDEUR (micro + autocorrélation)
// ═══════════════════════════════════════════════════════════════════════════
const NOTE_NAMES = ["Do","Do#","Ré","Ré#","Mi","Fa","Fa#","Sol","Sol#","La","La#","Si"];

// note (nom FR + octave) -> fréquence (La4 = 440 Hz, tempérament égal)
function noteToHz(name, oct) {
  const idx = NOTE_NAMES.indexOf(name);
  const midi = (oct + 1) * 12 + idx;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Catalogue d'accordages. Chaque accordage = liste de "chœurs" (courses).
// Un chœur = 1 note (corde simple) ou 2 notes (paire, ex. 12 cordes / guitare portugaise).
const TUNINGS = [
  // ── 6 cordes ──────────────────────────────────────────────
  { id:"standard", group:"6 cordes", label:"Standard (Mi)",
    courses:[ [["Mi",2]],[["La",2]],[["Ré",3]],[["Sol",3]],[["Si",3]],[["Mi",4]] ] },
  { id:"dropd", group:"6 cordes", label:"Drop D",
    courses:[ [["Ré",2]],[["La",2]],[["Ré",3]],[["Sol",3]],[["Si",3]],[["Mi",4]] ] },
  { id:"halfstep", group:"6 cordes", label:"Demi-ton plus bas (Mi♭)",
    courses:[ [["Ré#",2]],[["Sol#",2]],[["Do#",3]],[["Fa#",3]],[["La#",3]],[["Ré#",4]] ] },
  { id:"dadgad", group:"6 cordes", label:"DADGAD",
    courses:[ [["Ré",2]],[["La",2]],[["Ré",3]],[["Sol",3]],[["La",3]],[["Ré",4]] ] },
  { id:"openg", group:"6 cordes", label:"Open G",
    courses:[ [["Ré",2]],[["Sol",2]],[["Ré",3]],[["Sol",3]],[["Si",3]],[["Ré",4]] ] },
  { id:"opend", group:"6 cordes", label:"Open D",
    courses:[ [["Ré",2]],[["La",2]],[["Ré",3]],[["Fa#",3]],[["La",3]],[["Ré",4]] ] },
  { id:"opene", group:"6 cordes", label:"Open E",
    courses:[ [["Mi",2]],[["Si",2]],[["Mi",3]],[["Sol#",3]],[["Si",3]],[["Mi",4]] ] },
  // ── 12 cordes ─────────────────────────────────────────────
  { id:"twelve", group:"12 cordes", label:"12 cordes (standard)",
    courses:[ [["Mi",2],["Mi",3]],[["La",2],["La",3]],[["Ré",3],["Ré",4]],
              [["Sol",3],["Sol",4]],[["Si",3],["Si",3]],[["Mi",4],["Mi",4]] ] },
  // ── Guitare portugaise (fado) — notes fournies par l'utilisateur ──
  { id:"fado", group:"Guitare portugaise", label:"Guitare portugaise (fado)",
    courses:[ [["Ré",4],["Ré",3]],[["La",4],["La",3]],[["Si",4],["Si",3]],
              [["Mi",4],["Mi",4]],[["La",4],["La",4]],[["Si",4],["Si",4]] ] },
];

// Construit la liste des notes cibles {name,oct,hz,course} pour un accordage
function buildTargets(tuning) {
  const targets = [];
  tuning.courses.forEach((course, ci) => {
    course.forEach(([name, oct]) => {
      targets.push({ name, oct, hz: noteToHz(name, oct), course: ci });
    });
  });
  return targets;
}

function freqToNote(freq) {
  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  const refFreq = 440 * Math.pow(2, (midi - 69) / 12);
  const cents = Math.round(1200 * Math.log2(freq / refFreq));
  return { name: NOTE_NAMES[(midi % 12 + 12) % 12], octave: Math.floor(midi / 12) - 1, cents };
}

// ─────────────────────────────────────────────────────────────────────────
// DÉTECTION DE HAUTEUR
// Plage utile réelle des accordages du catalogue : Ré2 (73 Hz) au plus grave,
// Si4 (494 Hz) au plus aigu (guitare portugaise). On garde de la marge de
// part et d'autre pour les cordes très désaccordées.
// ─────────────────────────────────────────────────────────────────────────
const PITCH_MIN_HZ = 60;
const PITCH_MAX_HZ = 700;

// NSDF normalisée sur un écart donné, à la résolution demandée.
function nsdfAt(x, N, lag) {
  let acf = 0, energy = 0;
  const n = N - lag;
  for (let i = 0; i < n; i++) {
    const a = x[i], b = x[i + lag];
    acf += a * b;
    energy += a * a + b * b;
  }
  return energy > 0 ? (2 * acf) / energy : 0;
}

function detectPitch(buf, sampleRate) {
  // ── Décimation par 2 ──────────────────────────────────────────────────
  // Le graphe audio coupe déjà tout au-dessus de 1400 Hz, donc diviser par
  // deux la fréquence d'échantillonnage ne crée aucun repliement, et divise
  // par quatre le coût de la recherche (moitié moins d'écarts à tester, sur
  // moitié moins d'échantillons).
  const R = 2;
  const rate = sampleRate / R;
  const minLag = Math.max(2, Math.floor(rate / PITCH_MAX_HZ));
  const maxLag = Math.ceil(rate / PITCH_MIN_HZ);
  // Trois périodes de la note la plus grave suffisent pour une mesure stable :
  // inutile de balayer les 8192 échantillons de la fenêtre entière.
  const N = Math.min(Math.floor(buf.length / R), maxLag * 3);
  if (N < maxLag + 2) return -1;

  const x = new Float32Array(N);
  for (let i = 0; i < N; i++) x[i] = buf[i * R];

  // ── Seuil de niveau ───────────────────────────────────────────────────
  let e0 = 0;
  for (let i = 0; i < N; i++) e0 += x[i] * x[i];
  if (Math.sqrt(e0 / N) < 0.0012) return -1;

  // ── Recherche grossière sur le signal décimé ──────────────────────────
  // Version NORMALISÉE (entre -1 et 1) : contrairement à une autocorrélation
  // brute dont l'amplitude dépend du volume joué, un seuil de confiance
  // devient ici réellement comparable d'une note à l'autre.
  const nsdf = new Float32Array(maxLag + 2);
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    const v = nsdfAt(x, N, lag);
    nsdf[lag] = v;
    if (v > best) best = v;
  }
  if (best < 0.35) return -1;   // non périodique : bruit, souffle, larsen

  // ── Premier pic franc, PAS le maximum global ──────────────────────────
  // Une corde de guitare est riche en harmoniques : le maximum global tombe
  // fréquemment une octave en dessous (ou au-dessus) du vrai fondamental.
  // Retenir le premier pic atteignant 85 % du meilleur évite ces erreurs
  // d'octave, qui sont le défaut classique d'un accordeur de ce type.
  const thresh = best * 0.85;
  let coarse = -1;
  for (let i = minLag + 1; i < maxLag; i++) {
    if (nsdf[i] >= thresh && nsdf[i] >= nsdf[i-1] && nsdf[i] >= nsdf[i+1]) { coarse = i; break; }
  }
  if (coarse < 0) return -1;

  // ── Affinage à la résolution complète ─────────────────────────────────
  // La recherche décimée ne donne l'écart qu'à 2 échantillons près. Sans cet
  // affinage la précision serait trop grossière sur les cordes aiguës : vers
  // 330 Hz, un seul échantillon d'écart représente déjà ~25 cents.
  const center = coarse * R;
  const lo = Math.max(2, center - R - 1);
  const hi = Math.min(Math.floor(buf.length / 3) - 1, center + R + 1);
  const NF = Math.min(buf.length, hi * 3);
  let bestLag = center, bestVal = -Infinity;
  const vals = {};
  for (let l = lo; l <= hi; l++) {
    const v = nsdfAt(buf, NF, l);
    vals[l] = v;
    if (v > bestVal) { bestVal = v; bestLag = l; }
  }

  // Interpolation parabolique pour descendre sous l'échantillon (~1 cent).
  let T0 = bestLag;
  const y1 = vals[bestLag - 1], y2 = vals[bestLag], y3 = vals[bestLag + 1];
  if (y1 !== undefined && y3 !== undefined) {
    const a = (y1 + y3 - 2 * y2) / 2, b = (y3 - y1) / 2;
    if (a !== 0) {
      const shift = -b / (2 * a);
      if (Math.abs(shift) <= 1) T0 = bestLag + shift;
    }
  }

  const freq = sampleRate / T0;
  if (freq < PITCH_MIN_HZ || freq > PITCH_MAX_HZ) return -1;
  return freq;
}

// Sélecteur d'accordage (groupé par catégorie)
function TuningPicker({ tuningId, setTuningId, compact = false }) {
  const C = useC();
  const groups = [...new Set(TUNINGS.map(t => t.group))];
  return (
    <select
      value={tuningId}
      onChange={e => setTuningId(e.target.value)}
      style={{
        width: compact ? "100%" : "auto",
        maxWidth: "100%",
        appearance: "none", WebkitAppearance: "none",
        background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg,
        padding: compact ? "10px 14px" : "11px 38px 11px 16px",
        fontSize: 13.5, fontWeight: 700, color: C.text, fontFamily: FONTS.ui, cursor: "pointer",
        textAlign: "center", textAlignLast: "center",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23${C.text3.replace('#','')}' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
    >
      {groups.map(g => (
        <optgroup key={g} label={g}>
          {TUNINGS.filter(t => t.group === g).map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function Tuner() {
  const C = useC();
  const [active, setActive]   = useState(false);
  const [freq, setFreq]       = useState(0);
  const [note, setNote]       = useState(null);
  const [error, setError]     = useState(null);
  const [tuningId, setTuningId] = useState("standard");

  const tuning  = TUNINGS.find(t => t.id === tuningId) || TUNINGS[0];
  const targets = buildTargets(tuning);

  const ctxRef    = useRef(null);
  const analyser  = useRef(null);
  const streamRef = useRef(null);
  const rafRef    = useRef(null);
  const bufRef    = useRef(null);
  const freqHistRef  = useRef([]);  // historique pour lissage
  const holdTimer    = useRef(null); // timer pour tenir la note après silence
  const lastNoteRef  = useRef(null); // dernière note valide
  // Animation de l'aiguille : on écrit directement dans le DOM à chaque
  // image, sans passer par un état React. Un setState 60 fois par seconde
  // relancerait tout le rendu de l'écran pour déplacer un triangle, ce qui
  // est précisément ce qui rend une jauge saccadée.
  const needleRef      = useRef(null);
  const needleLabelRef = useRef(null);
  const centsTargetRef = useRef(0);   // dernière valeur détectée
  const centsShownRef  = useRef(0);   // valeur affichée, lissée vers la cible
  const hasSignalRef   = useRef(false);

  const stop = useCallback(() => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (ctxRef.current && ctxRef.current.state !== "closed") ctxRef.current.close();
    ctxRef.current = analyser.current = streamRef.current = null;
    centsTargetRef.current = 0;
    centsShownRef.current = 0;
    hasSignalRef.current = false;
    freqHistRef.current = [];
    setActive(false); setFreq(0); setNote(null);
  }, []);

  const start = useCallback(async () => {
    try {
      // Mobile : certains navigateurs ignorent les contraintes → fallback
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation:false, autoGainControl:false, noiseSuppression:false, latency:0 },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') await ctx.resume();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);

      // Filtre passe-bande guitare (70–1400 Hz) + gain x4 pour mobile
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass'; hp.frequency.value = 70; hp.Q.value = 0.5;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1400; lp.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.value = 4.0;

      const an = ctx.createAnalyser();
      an.fftSize = 8192;
      an.smoothingTimeConstant = 0;
      src.connect(hp); hp.connect(lp); lp.connect(gain); gain.connect(an);
      analyser.current = an;
      bufRef.current = new Float32Array(an.fftSize);
      freqHistRef.current = [];
      setActive(true); setError(null);

      let frame = 0;
      const tick = () => {
        frame++;

        // ── Détection : une image sur deux (~30 Hz) ────────────────────
        // Largement suffisant pour suivre une corde, et ça libère le temps
        // de calcul nécessaire pour animer l'aiguille à 60 images/sec.
        if (frame % 2 === 0) {
          an.getFloatTimeDomainData(bufRef.current);
          const f = detectPitch(bufRef.current, ctx.sampleRate);
          if (f > 0) {
            const hist = freqHistRef.current;
            hist.push(f);
            if (hist.length > 5) hist.shift();
            const sorted = [...hist].sort((a,b)=>a-b);
            const median = sorted[Math.floor(sorted.length/2)];
            if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
            lastNoteRef.current = median;
            const n = freqToNote(median);
            centsTargetRef.current = Math.max(-50, Math.min(50, n.cents));
            hasSignalRef.current = true;
            // On ne relance le rendu React que si la note affichée change
            // vraiment : le déplacement de l'aiguille, lui, est géré hors
            // React juste en dessous.
            setNote(prev =>
              (prev && prev.name === n.name && prev.octave === n.octave && Math.abs(prev.cents - n.cents) < 3)
                ? prev : n
            );
            if (frame % 12 === 0) setFreq(median);
          } else {
            const hist = freqHistRef.current;
            if (hist.length > 0) hist.shift();
            if (hist.length === 0 && !holdTimer.current) {
              holdTimer.current = setTimeout(() => {
                setFreq(0);
                setNote(null);
                lastNoteRef.current = null;
                holdTimer.current = null;
                hasSignalRef.current = false;
                centsTargetRef.current = 0;
              }, 1500);
            }
          }
        }

        // ── Aiguille : à chaque image, sans repasser par React ─────────
        // Lissage exponentiel vers la dernière valeur détectée : l'aiguille
        // glisse au lieu de sauter d'une position à l'autre. Le facteur est
        // un compromis — assez réactif pour suivre l'oreille, assez lent
        // pour absorber les micro-variations d'une corde qui vibre.
        const target = centsTargetRef.current;
        const next = centsShownRef.current + (target - centsShownRef.current) * 0.16;
        centsShownRef.current = next;
        if (needleRef.current) {
          // translateX en pourcentage sur un élément large de 100 % : le
          // décalage vaut donc un pourcentage de la piste, et reste une
          // transformation pure (accélérée, sans recalcul de mise en page).
          needleRef.current.style.transform = `translateX(${next}%)`;
        }
        if (needleLabelRef.current) {
          const shown = Math.round(next);
          needleLabelRef.current.textContent =
            hasSignalRef.current ? (shown > 0 ? `+${shown}` : `${shown}`) : "";
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      setError("Micro inaccessible. Autorise l'accès au microphone dans ton navigateur.");
      setActive(false);
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const cents = note?.cents ?? 0;
  const inTune = active && note && Math.abs(cents) <= 5;
  const needleColor = inTune ? C.green : Math.abs(cents) < 20 ? C.amber : C.pink;
  // chœur le plus proche (compare à toutes les notes cibles, paires incluses)
  const nearestCourse = freq > 0
    ? targets.reduce((best, t) => {
        const d = Math.abs(1200 * Math.log2(freq / t.hz));
        return d < best.d ? { course: t.course, d } : best;
      }, { course:-1, d:Infinity }).course
    : -1;

  return (
    <div>
      {!active ? (
        <div style={{ textAlign:"center", padding:"10px 0 4px" }}>
          <Gropi pose="listen" size={120} anim="bob" style={{ margin:"0 auto 6px" }}/>
          <p style={{ fontSize:13, color:C.text2, lineHeight:1.55, maxWidth:260, margin:"0 auto 16px" }}>
            Joue une corde à vide, Gropi écoute et te dit si tu es juste.
          </p>

          {/* Sélecteur d'accordage */}
          <TuningPicker tuningId={tuningId} setTuningId={setTuningId} />

          <button onClick={start} className="gr-focus" style={{
            background:`linear-gradient(135deg,#FF9155,${C.primary})`, color:"#fff", border:"none",
            borderRadius:R.lg, padding:"13px 28px", fontSize:14, fontWeight:700, fontFamily:FONTS.ui,
            cursor:"pointer", boxShadow:`0 4px 16px ${C.primary}44`, marginTop:18,
            display:"inline-flex", alignItems:"center", gap:8,
          }}>
            <Ti name="microphone" size={16} color="#fff"/> Activer l'accordeur
          </button>
          {error && <p style={{ fontSize:12, color:C.pink, marginTop:14, lineHeight:1.5 }}>{error}</p>}
        </div>
      ) : (
        <div>
          {/* Note détectée */}
          <div style={{ textAlign:"center", marginBottom:6 }}>
            <div style={{
              fontSize:72, fontWeight:800, lineHeight:1, letterSpacing:"-2px", fontFamily:FONTS.title,
              color: inTune ? C.green : C.text,
              transition:"color .15s",
            }}>
              {note ? note.name : "—"}
              {note && <span style={{ fontSize:28, fontWeight:700, color:C.text3 }}>{note.octave}</span>}
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:C.text3, marginTop:2 }}>
              {freq > 0 ? `${freq.toFixed(1)} Hz` : "Joue une corde…"}
            </div>
          </div>

          {/* Aiguille de justesse (-50 … +50 cents) */}
          <div style={{ position:"relative", height:64, margin:"14px 0 8px", overflow:"hidden" }}>
            <div style={{ position:"absolute", left:0, right:0, top:30, height:3, background:C.border, borderRadius:2 }}/>
            {/* zone juste */}
            <div style={{ position:"absolute", left:"45%", width:"10%", top:26, height:11, background:`${C.green}33`, borderRadius:6 }}/>
            {/* repère central */}
            <div style={{ position:"absolute", left:"50%", top:18, width:2, height:27, background:C.green, transform:"translateX(-50%)" }}/>
            {/* aiguille — piste large de 100 %, déplacée par transformation
                pure : le pourcentage de translateX se rapporte alors à la
                largeur de la piste, et rien ne recalcule la mise en page. */}
            <div style={{ position:"absolute", left:0, right:0, top:8, pointerEvents:"none" }}>
              <div ref={needleRef} style={{ width:"100%", transform:"translateX(0%)", willChange:"transform" }}>
                <div style={{
                  width:0, height:0, margin:"0 auto",
                  borderLeft:"7px solid transparent", borderRight:"7px solid transparent",
                  borderTop:`14px solid ${needleColor}`,
                  transition:"border-top-color .18s",
                }}/>
                <div ref={needleLabelRef} style={{
                  fontSize:11, fontWeight:700, textAlign:"center", marginTop:2,
                  color: needleColor, transition:"color .18s",
                }}/>
              </div>
            </div>
            {/* libellés trop bas/trop haut */}
            <div style={{ position:"absolute", left:0, top:46, fontSize:9.5, color:C.text3, fontWeight:600 }}>♭ trop bas</div>
            <div style={{ position:"absolute", right:0, top:46, fontSize:9.5, color:C.text3, fontWeight:600 }}>trop haut ♯</div>
          </div>

          <div aria-hidden={!inTune} style={{ height:22, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, fontWeight:700, color:C.green, marginBottom:8, visibility: inTune ? "visible" : "hidden" }}>
            <Ti name="check" size={15} color={C.green} /> Juste !
          </div>

          {/* Accordage actif + chœurs de référence */}
          <div style={{ fontSize:10, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:".07em", textAlign:"center", marginTop:8 }}>
            {tuning.label}
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:6, margin:"8px 0 18px", flexWrap:"wrap" }}>
            {tuning.courses.map((course, ci) => {
              const on = nearestCourse === ci;
              return (
                <div key={ci} style={{
                  minWidth:42, textAlign:"center", padding:"7px 8px", borderRadius:10,
                  border:`1.5px solid ${on ? C.primary : C.border}`,
                  background: on ? C.primaryL : C.surface,
                  transition:"all .12s",
                }}>
                  {course.map(([name, oct], k) => (
                    <div key={k} style={{ lineHeight:1.15 }}>
                      <span style={{ fontSize:13, fontWeight:800, color: on ? C.primaryD : C.text }}>{name}</span>
                      <span style={{ fontSize:9, color:C.text3, fontWeight:600 }}>{oct}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Changer d'accordage en cours */}
          <div style={{ marginBottom:14 }}>
            <TuningPicker tuningId={tuningId} setTuningId={setTuningId} compact />
          </div>

          <button onClick={stop} className="gr-focus" style={{
            width:"100%", padding:12, borderRadius:R.lg, border:`1.5px solid ${C.border}`,
            background:C.surface, color:C.text2, fontWeight:700, fontSize:13, fontFamily:FONTS.ui, cursor:"pointer",
          }}>
            Arrêter l'accordeur
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ÉCRAN
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// LECTEUR D'ACCORDS — construis une suite d'accords, écoute-la jouée avec
// le vrai son de guitare (même moteur que le reste de l'app).
// ═══════════════════════════════════════════════════════════════════════════
const CHORD_ROOTS = [
  ["C","Do"],["C#","Do#"],["D","Ré"],["D#","Ré#"],["E","Mi"],["F","Fa"],
  ["F#","Fa#"],["G","Sol"],["G#","Sol#"],["A","La"],["A#","La#"],["B","Si"],
];
// Qualités groupées par famille : à plat, 29 pastilles seraient illisibles
// sur un écran de téléphone. On sélectionne d'abord la famille, ce qui garde
// des zones tactiles confortables.
const CHORD_FAMILIES = [
  { id:"base",   label:"Base",    keys:["maj","min","dim","aug","sus2","sus4"] },
  { id:"sept",   label:"7e / 6e", keys:["dom7","maj7","min7","min7b5","dim7","minMaj7","dom7sus4","maj6","min6"] },
  { id:"neuf",   label:"9e",      keys:["dom9","maj9","min9","add9"] },
  { id:"ext",    label:"11e / 13e", keys:["dom11","min11","maj7s11","dom13","min13","maj13"] },
  { id:"alt",    label:"Altérés", keys:["dom7b9","dom7s9","dom7b5","dom7s5"] },
];
const SPEED_PRESETS = [
  { id:"lent",   label:"Lent",   secs:2.2 },
  { id:"normal", label:"Normal", secs:1.4 },
  { id:"rapide", label:"Rapide", secs:0.8 },
];
const MAX_CHORDS = 12;

function ChordPlayer() {
  const C = useC();
  const [root, setRoot]     = useState("C");
  const [family, setFamily] = useState("base");
  const [quality, setQuality] = useState("maj");
  const [sequence, setSequence] = useState([]); // [{root, type, label}]
  const [playing, setPlaying]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [speed, setSpeed] = useState("normal");
  // « Vider » était une suppression sans retour, derrière un bouton minuscule :
  // on garde la suite effacée quelques secondes pour pouvoir l'annuler.
  const [suiteVidee, setSuiteVidee] = useState(null);
  const timerViderRef = useRef(null);
  useEffect(() => () => clearTimeout(timerViderRef.current), []);

  const stop = useCallback(() => {
    // stopAll() et non stopProgression() : le second n'annulait que les
    // accords À VENIR, celui en cours continuait de résonner 1,6 s.
    stopAll();
    setPlaying(false);
    setActiveIdx(-1);
  }, []);

  // Nettoyage : si on quitte l'onglet en cours de lecture, on arrête —
  // sinon la progression continuerait à jouer en fond, ou entrerait en
  // conflit avec le métronome qui partage le même transport audio.
  useEffect(() => () => stopAll(), []);

  const addChord = () => {
    if (sequence.length >= MAX_CHORDS) return;
    const rootFr = CHORD_ROOTS.find(r => r[0] === root)?.[1] || root;
    // Symbole conventionnel plutôt que le nom en clair : un guitariste lit
    // "Do7♯9" immédiatement, là où "Do 7 dièse 9" demande un décodage.
    const label = `${rootFr}${CHORD_TYPES[quality]?.sym ?? ""}`;
    setSequence(s => [...s, { root, type: quality, label }]);
  };
  const removeChord = (i) => {
    setSequence(s => s.filter((_, idx) => idx !== i));
  };
  const clearAll = () => {
    stop();
    setSuiteVidee(sequence);
    setSequence([]);
    clearTimeout(timerViderRef.current);
    timerViderRef.current = setTimeout(() => setSuiteVidee(null), 6000);
  };
  const annulerVider = () => { if (suiteVidee) setSequence(suiteVidee); setSuiteVidee(null); clearTimeout(timerViderRef.current); };

  const play = async () => {
    if (sequence.length === 0) return;
    const secs = SPEED_PRESETS.find(p => p.id === speed)?.secs || 1.4;
    setPlaying(true);
    // playProgression signale la fin par onStep(-1). L'écran ne s'en servait
    // que pour éteindre le surlignage, jamais pour remettre le bouton en
    // « Écouter la suite » : il restait donc bloqué sur « Arrêter » une fois
    // la séquence terminée.
    await playProgression(sequence, secs, (idx) => {
      setActiveIdx(idx);
      if (idx === -1) setPlaying(false);
    });
  };

  const toggle = () => (playing ? stop() : play());

  const chip = {
    padding:"8px 10px", borderRadius:10, border:`1.5px solid ${C.border}`,
    background:C.surface, color:C.text2, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:FONTS.ui,
  };

  return (
    <div>
      {/* Choix de l'accord à ajouter */}
      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.text3, marginBottom:9, fontFamily:FONTS.ui }}>Fondamentale</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:6, marginBottom:14 }}>
          {CHORD_ROOTS.map(([code, fr]) => (
            <button key={code} onClick={() => setRoot(code)} aria-pressed={root===code} className="gr-focus" style={{
              ...chip, padding:"9px 0",
              border:`1.5px solid ${root===code ? C.primary : C.border}`,
              background: root===code ? C.primaryL : C.surface,
              color: root===code ? C.primaryD : C.text2,
            }}>
              {fr}
            </button>
          ))}
        </div>

        <div style={{ fontSize:12, fontWeight:700, color:C.text3, marginBottom:9, fontFamily:FONTS.ui }}>Famille</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
          {CHORD_FAMILIES.map(f => (
            <button key={f.id} aria-pressed={family===f.id} className="gr-focus" onClick={() => {
              setFamily(f.id);
              // On bascule sur la première qualité de la famille, pour ne
              // jamais laisser une sélection invisible dans un autre onglet.
              setQuality(f.keys[0]);
            }} style={{
              ...chip, padding:"7px 10px", fontSize:12,
              border:`1.5px solid ${family===f.id ? C.primary : C.border}`,
              background: family===f.id ? C.primaryL : C.surface,
              color: family===f.id ? C.primaryD : C.text2,
            }}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize:12, fontWeight:700, color:C.text3, marginBottom:9, fontFamily:FONTS.ui }}>Qualité</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
          {(CHORD_FAMILIES.find(f => f.id === family)?.keys || []).map(key => (
            <button key={key} onClick={() => setQuality(key)} aria-pressed={quality===key} aria-label={CHORD_TYPES[key]?.name || key} className="gr-focus" style={{
              ...chip,
              border:`1.5px solid ${quality===key ? C.primary : C.border}`,
              background: quality===key ? C.primaryL : C.surface,
              color: quality===key ? C.primaryD : C.text2,
            }}>
              {CHORD_TYPES[key]?.sym || CHORD_TYPES[key]?.name || key}
            </button>
          ))}
        </div>

        <div style={{ fontSize:11.5, color:C.text3, marginBottom:12, fontFamily:FONTS.ui, minHeight:16 }}>
          {CHORD_TYPES[quality]?.name}
        </div>

        <button onClick={addChord} disabled={sequence.length >= MAX_CHORDS} className="gr-focus" style={{
          width:"100%", padding:"11px 0", borderRadius:R.md, border:"none",
          background: sequence.length >= MAX_CHORDS ? C.border : C.primary,
          color:"#fff", fontWeight:700, fontSize:13.5, fontFamily:FONTS.ui,
          cursor: sequence.length >= MAX_CHORDS ? "default" : "pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        }}>
          <Ti name="plus" size={15} color="#fff"/>
          Ajouter à la suite
        </button>
      </div>

      {/* Suite d'accords construite */}
      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:16, marginTop:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text3, fontFamily:FONTS.ui }}>
            Ta suite ({sequence.length}/{MAX_CHORDS})
          </div>
          {sequence.length > 0 && (
            <button onClick={clearAll} className="gr-focus" style={{
              background:"none", border:"none", color:C.coral, fontSize:12.5, fontWeight:700,
              fontFamily:FONTS.ui, cursor:"pointer", padding:"8px 10px", margin:"-8px -10px", minHeight:36,
            }}>
              Vider
            </button>
          )}
        </div>

        {sequence.length === 0 ? (
          <div role="status" style={{ textAlign:"center", padding:"18px 0", color:C.text3, fontSize:13, fontFamily:FONTS.ui }}>
            {suiteVidee ? (
              <>Suite vidée.{" "}
                <button onClick={annulerVider} className="gr-focus" style={{ background:"none", border:"none", padding:"6px 4px", color:C.primaryD, fontWeight:800, fontSize:13, fontFamily:FONTS.ui, cursor:"pointer", textDecoration:"underline" }}>Annuler</button>
              </>
            ) : "Ajoute des accords ci-dessus pour construire ta suite."}
          </div>
        ) : (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
            {sequence.map((c, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:6, padding:"8px 6px 8px 12px",
                borderRadius:10, fontFamily:FONTS.ui, fontWeight:700, fontSize:13,
                border:`1.5px solid ${activeIdx===i && playing ? C.primary : C.border}`,
                background: activeIdx===i && playing ? C.primaryL : C.surface2,
                color: activeIdx===i && playing ? C.primaryD : C.text,
                transition:"all 0.15s",
              }}>
                {c.label}
                <button onClick={() => removeChord(i)} aria-label={`Retirer ${c.label}`} className="gr-focus" style={{
                  background:"none", border:"none", cursor:"pointer", padding:0,
                  width:32, height:32, margin:"-8px -4px -8px 0", borderRadius:8,
                  display:"flex", alignItems:"center", justifyContent:"center", color:C.text3,
                }}>
                  <Ti name="x" size={13} color={C.text3}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Vitesse */}
        <div style={{ display:"flex", gap:6, marginBottom:14 }}>
          {SPEED_PRESETS.map(p => (
            <button key={p.id} onClick={() => setSpeed(p.id)} disabled={playing} aria-pressed={speed===p.id} className="gr-focus" style={{
              flex:1, padding:"8px 0", borderRadius:R.sm, fontFamily:FONTS.ui,
              border:`1.5px solid ${speed===p.id ? C.primary : C.border}`,
              background: speed===p.id ? C.primaryL : C.surface,
              color: speed===p.id ? C.primaryD : C.text2,
              fontWeight:700, fontSize:12.5, cursor: playing ? "default" : "pointer",
              opacity: playing ? 0.6 : 1,
            }}>
              {p.label}
            </button>
          ))}
        </div>

        <button onClick={toggle} disabled={sequence.length === 0} className="gr-focus" style={{
          width:"100%", padding:"13px 0", borderRadius:R.md, border:"none",
          background: sequence.length === 0 ? C.border : (playing ? C.coral : C.primary),
          color:"#fff", fontWeight:800, fontSize:14, fontFamily:FONTS.ui,
          cursor: sequence.length === 0 ? "default" : "pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:7,
        }}>
          <Ti name={playing ? "player-pause" : "player-play"} size={16} color="#fff"/>
          {playing ? "Arrêter" : "Écouter la suite"}
        </button>
      </div>
    </div>
  );
}

// ══ Éditeur de tablature ════════════════════════════════════════════════
// On touche une case de la tab (corde × temps), puis on choisit la case du
// manche dans la grille 0-24 dessous. Une seule surface : l'aperçu alphaTab
// a été retiré, il doublait la grille sans permettre d'éditer. Toute la
// logique (modèle, conversions) vit dans tab/tabGrid.js, testée à part.
//
// Principes d'UX appliqués :
//   • manipulation directe — on touche la note là où elle est ;
//   • un appui par note : la case du manche se choisit dans une grille,
//     pas en tapant deux chiffres dans un délai invisible ;
//   • tout est réversible (« Annuler ») plutôt que protégé par des
//     confirmations ; les actions secondaires vivent dans un menu « ⋯ » ;
//   • une ligne d'aide contextuelle dit quoi faire, au lieu d'un mode
//     d'emploi à lire avant de commencer ;
//   • lecture et tempo en bas, dans la zone du pouce.
const CORDES_LABELS = ["e", "B", "G", "D", "A", "E"];   // corde 1 en haut, comme à l'écrit
const CELL_H = 34;
const HAUT_ENTETE = 16;                          // bande des numéros de mesure
const LARGEUR_CASE = { 2: 38, 1: 32 };           // croches : une mesure tient à l'écran
const STOCKAGE_TAB = "groply:tab-brouillon";
const HISTORIQUE_MAX = 60;
const DELAI_DEUX_CHIFFRES = 900;                 // clavier physique uniquement
const REPERES_SIMPLES = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const REPERES_DOUBLES = new Set([12, 24]);

function styleTouche(C, actif, extra = {}) {
  return {
    height: 40, borderRadius: R.sm, cursor: "pointer", fontFamily: FONTS.ui,
    border: `1.5px solid ${actif ? C.primary : C.border}`,
    background: actif ? C.primaryL : C.surface, color: actif ? C.primaryD : C.text,
    fontWeight: 800, fontSize: 14, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 2, padding: 0, ...extra,
  };
}

function GrilleTab({ grille, evenements, res, selection, onSelect, colLecture, C }) {
  const scrollRef = useRef(null);
  const nbCols = nbColsVisibles(grille);
  const cellW = LARGEUR_CASE[res];
  const nbCases = nbCols / res;
  const casesParMesure = PAS_PAR_MESURE / res;
  const casesParTemps = 4 / res;
  const vide = derniereColonne(grille) < 0;
  const liaisons = evenements.filter(e => e.toCol != null);
  const origines = new Set(liaisons.map(e => `${e.string}-${e.col}`));

  // Garde visible la case active : la sélection quand on édite, la tête de
  // lecture (à ~30 % du bord, pour voir venir la suite) quand on écoute.
  // Si le focus clavier est dans la grille, il suit la sélection (déplacée
  // aux flèches) — sinon il resterait sur une case qui n'est plus active.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !el.contains(document.activeElement)) return;
    el.querySelector(`[data-case="${selection.corde}-${selection.col}"]`)?.focus({ preventScroll: true });
  }, [selection]);

  const colSuivie = colLecture ?? selection.col;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const x = (colSuivie / res) * cellW;
    const horsVue = x < el.scrollLeft + 8 || x + cellW > el.scrollLeft + el.clientWidth - 8;
    if (colLecture != null || horsVue) el.scrollTo({ left: Math.max(0, x - el.clientWidth * 0.3), behavior: "smooth" });
  }, [colSuivie, colLecture, res, cellW]);

  return (
    <div style={{ position: "relative", display: "flex", border: `1.5px solid ${C.border}`, borderRadius: R.md, background: C.surface, overflow: "hidden" }}>
      {/* Noms de corde, fixes ; la corde sélectionnée est mise en avant */}
      <div aria-hidden="true" style={{ flexShrink: 0, width: 24, background: C.surface2, borderRight: `1.5px solid ${C.border}`, paddingTop: HAUT_ENTETE }}>
        {CORDES_LABELS.map((l, i) => (
          <div key={l + i} style={{ height: CELL_H, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 800, color: selection.corde === i + 1 ? C.primary : C.text3 }}>{l}</div>
        ))}
      </div>

      <div ref={scrollRef} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", flex: 1 }}>
        <div style={{ position: "relative", width: nbCases * cellW, height: HAUT_ENTETE + CELL_H * 6 }}>
          {/* Un temps sur deux légèrement teinté : on lit le rythme d'un coup d'œil */}
          {Array.from({ length: nbCols / 4 }, (_, t) => t % 2 === 1 ? (
            <div key={"t" + t} style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: t * casesParTemps * cellW, width: casesParTemps * cellW, background: C.surface2, opacity: .55 }} />
          ) : null)}

          {/* Colonne sélectionnée, puis tête de lecture */}
          <div style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: (selection.col / res) * cellW, width: cellW, background: C.primaryL, opacity: .6 }} />
          {colLecture != null && (
            <div style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: (colLecture / res) * cellW, width: cellW, background: C.primary, opacity: .22 }} />
          )}

          {/* Numéros et barres de mesure */}
          {Array.from({ length: nbCols / PAS_PAR_MESURE }, (_, m) => (
            <div key={"n" + m} style={{ position: "absolute", top: 1, left: m * casesParMesure * cellW + 5, fontSize: 10, fontWeight: 700, color: C.text3 }}>{m + 1}</div>
          ))}
          {Array.from({ length: nbCols / PAS_PAR_MESURE }, (_, m) => m > 0 ? (
            <div key={"b" + m} style={{ position: "absolute", top: HAUT_ENTETE + CELL_H / 2, height: CELL_H * 5, left: m * casesParMesure * cellW - 1, width: 2, background: C.text3 }} />
          ) : null)}

          {/* Les 6 cordes et leurs cases */}
          {CORDES_LABELS.map((label, idx) => {
            const corde = idx + 1;
            return (
              <div key={corde} style={{ position: "absolute", top: HAUT_ENTETE + idx * CELL_H, left: 0, height: CELL_H, width: "100%", display: "flex" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: CELL_H / 2, height: 1.5, background: C.border }} />
                {Array.from({ length: nbCases }, (_, d) => {
                  const col = d * res;
                  const cell = lireCase(grille, corde, col);
                  const sel = selection.corde === corde && selection.col === col;
                  const enAttente = cell && (cell.lie || cell.slide) && !origines.has(`${corde}-${col}`);
                  const repere = cell?.bend === 2 ? "full" : cell?.bend === 1 ? "½" : enAttente ? (cell.slide ? "sl…" : "h/p…") : "";
                  return (
                    <button key={col} onClick={() => onSelect({ corde, col })} className="gr-focus"
                      data-case={`${corde}-${col}`}
                      tabIndex={sel ? 0 : -1}
                      aria-current={sel ? "true" : undefined}
                      aria-label={`Corde ${label}, mesure ${Math.floor(col / PAS_PAR_MESURE) + 1}, temps ${Math.floor((col % PAS_PAR_MESURE) / 4) + 1}${cell ? (cell.mute ? ", note étouffée" : `, case ${cell.fret}`) : ", vide"}`}
                      style={{ position: "relative", width: cellW, height: CELL_H, flexShrink: 0, padding: 0, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {cell ? (
                        <span style={{
                          position: "relative", zIndex: 1, minWidth: 18, padding: "1px 3px", borderRadius: 4,
                          fontFamily: "monospace", fontWeight: 800, fontSize: 13.5, lineHeight: "18px",
                          background: sel ? C.primary : C.surface, color: sel ? "#fff" : C.text,
                        }}>{cell.mute ? "x" : cell.fret}</span>
                      ) : sel ? (
                        <span style={{ position: "relative", zIndex: 1, width: 20, height: 20, borderRadius: 5, border: `2px solid ${C.primary}`, background: C.surface }} />
                      ) : null}
                      {repere && (
                        <span style={{ position: "absolute", top: -1, right: 1, zIndex: 2, fontSize: 9.5, fontWeight: 800, color: enAttente ? C.text3 : C.primary }}>{repere}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Liaisons, dessinées comme sur une tab imprimée */}
          {liaisons.map((e, i) => {
            const x1 = (e.col / res) * cellW + cellW / 2;
            const x2 = (e.toCol / res) * cellW + cellW / 2;
            const y = HAUT_ENTETE + (e.string - 1) * CELL_H;
            if (e.type === "hammer" || e.type === "pull") {
              return (
                <div key={"l" + i} aria-hidden="true" style={{ pointerEvents: "none" }}>
                  <div style={{ position: "absolute", zIndex: 3, left: x1 + 5, width: Math.max(6, x2 - x1 - 10), top: y + 3, height: 8, border: `1.5px solid ${C.primary}`, borderBottom: "none", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
                  <div style={{ position: "absolute", zIndex: 4, left: (x1 + x2) / 2 - 4, top: y - 3, fontSize: 9, fontWeight: 800, lineHeight: "10px", color: C.primary, background: C.surface, padding: "0 1px" }}>{e.type === "hammer" ? "h" : "p"}</div>
                </div>
              );
            }
            return (
              <div key={"l" + i} aria-hidden="true" style={{ position: "absolute", zIndex: 3, pointerEvents: "none", left: (x1 + x2) / 2 - 5, top: y + CELL_H / 2 - 9, fontSize: 14, fontWeight: 800, color: C.primary, lineHeight: "16px" }}>
                {e.type === "slide_up" ? "/" : "\\"}
              </div>
            );
          })}
        </div>
      </div>

      {vide && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text2, background: C.surface, padding: "6px 10px", borderRadius: R.sm, border: `1px solid ${C.border}` }}>
            Touche une case pour placer ta première note
          </div>
        </div>
      )}
    </div>
  );
}

/** Grille 0-24, avec les repères de touche d'un vrai manche (3, 5, 7, 9, 12…). */
function ClavierManche({ cell, onFret, onMute, onEffacer, C }) {
  const fretActif = cell && !cell.mute ? cell.fret : null;
  const point = (k) => <span key={k} style={{ width: 4, height: 4, borderRadius: 2, background: C.text3 }} />;
  return (
    <div role="group" aria-label="Case du manche" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
      {Array.from({ length: 25 }, (_, f) => (
        <button key={f} onClick={() => onFret(f)} aria-pressed={fretActif === f} className="gr-focus" style={styleTouche(C, fretActif === f)}>
          <span style={{ lineHeight: "16px" }}>{f}</span>
          <span aria-hidden="true" style={{ display: "flex", gap: 3, height: 4 }}>
            {REPERES_DOUBLES.has(f) ? [point(1), point(2)] : REPERES_SIMPLES.has(f) ? [point(1)] : null}
          </span>
        </button>
      ))}
      <button onClick={onMute} aria-pressed={!!cell?.mute} aria-label="Note étouffée" className="gr-focus" style={styleTouche(C, !!cell?.mute)}>x</button>
      <button onClick={onEffacer} disabled={!cell} className="gr-focus"
        style={styleTouche(C, false, { gridColumn: "span 2", fontSize: 12.5, opacity: cell ? 1 : .4, cursor: cell ? "pointer" : "default" })}>
        Effacer
      </button>
    </div>
  );
}

function TechniquesNote({ cell, onLie, onSlide, onBend, C }) {
  const aNote = !!cell && !cell.mute && typeof cell.fret === "number";
  const bouton = (label, actif, onClick) => (
    <button onClick={onClick} disabled={!aNote} aria-pressed={actif} className="gr-focus"
      style={styleTouche(C, actif, { flex: 1, fontSize: 12.5, opacity: aNote ? 1 : .4, cursor: aNote ? "pointer" : "default" })}>
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Technique de la note" style={{ display: "flex", gap: 5, marginTop: 5 }}>
      {bouton("Liaison h/p", !!cell?.lie, onLie)}
      {bouton("Slide", !!cell?.slide, onSlide)}
      {bouton(cell?.bend === 2 ? "Bend · 1 ton" : cell?.bend === 1 ? "Bend · ½ ton" : "Bend", !!cell?.bend, onBend)}
    </div>
  );
}

function initialiserEditeur() {
  let grille = null;
  try {
    const brut = localStorage.getItem(STOCKAGE_TAB);
    if (brut) {
      const g = JSON.parse(brut);
      if (grilleValide(g)) grille = { notes: g.notes };
    }
  } catch { /* stockage indisponible ou corrompu : on repart de l'exemple */ }
  return grille || grilleExemple();
}

function TabEditor() {
  const C = useC();
  const initRef = useRef(null);
  if (!initRef.current) initRef.current = initialiserEditeur();

  // Grille + historique dans un même état, mis à jour par des fonctions
  // PURES : React (mode strict) peut les exécuter deux fois sans doubler
  // une entrée d'historique.
  const [edit, setEdit] = useState(() => ({ grille: initRef.current, passe: [] }));
  const grille = edit.grille;
  const [res, setRes] = useState(() => (compatibleCroches(initRef.current) ? 2 : 1));
  const [selection, setSelection] = useState({ corde: 3, col: 0 });
  const [bpm, setBpm] = useState(80);
  const [boucle, setBoucle] = useState(false);
  const [jouant, setJouant] = useState(false);
  const [colLecture, setColLecture] = useState(null);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [importOuvert, setImportOuvert] = useState(false);
  const [texteImport, setTexteImport] = useState("");
  const [erreurImport, setErreurImport] = useState(null);
  const [message, setMessage] = useState(null);

  const enLectureRef = useRef(false);
  const timerBoucleRef = useRef(null);
  const boucleRef = useRef(boucle);  boucleRef.current = boucle;
  const bpmRef = useRef(bpm);        bpmRef.current = bpm;
  const derniereSaisieRef = useRef(null);
  const menuRef = useRef(null);
  const timerMessageRef = useRef(null);

  const evenements = useMemo(() => grilleVersEvenements(grille), [grille]);
  const origines = useMemo(() => new Set(evenements.filter(e => e.toCol != null).map(e => `${e.string}-${e.col}`)), [evenements]);
  const cellSel = lireCase(grille, selection.corde, selection.col);

  // Brouillon conservé entre deux visites (même appareil).
  useEffect(() => {
    try { localStorage.setItem(STOCKAGE_TAB, JSON.stringify(grille)); } catch { /* noop */ }
  }, [grille]);

  // Une tab importée (ou restaurée par « Annuler ») peut contenir des
  // doubles-croches : la vue croches les cacherait, on bascule donc seul.
  useEffect(() => { if (res === 2 && !compatibleCroches(grille)) setRes(1); }, [grille, res]);
  useEffect(() => {
    const max = nbColsVisibles(grille) - res;
    if (selection.col > max) setSelection(s => ({ ...s, col: max }));
  }, [grille, res, selection.col]);

  const annoncer = useCallback((txt) => {
    setMessage(txt);
    clearTimeout(timerMessageRef.current);
    timerMessageRef.current = setTimeout(() => setMessage(null), 3500);
  }, []);
  const effacerMessage = useCallback(() => { setMessage(null); clearTimeout(timerMessageRef.current); }, []);

  const modifier = useCallback((fn) => {
    setEdit(e => {
      const n = fn(e.grille);
      if (n === e.grille) return e;
      return { grille: n, passe: [...e.passe.slice(-(HISTORIQUE_MAX - 1)), e.grille] };
    });
  }, []);
  const modifierSelection = useCallback((fn) => {
    const { corde, col } = selection;
    effacerMessage();
    modifier(g => {
      const avant = lireCase(g, corde, col);
      const apres = fn(avant);
      return apres === avant ? g : ecrireCase(g, corde, col, apres);
    });
  }, [selection, modifier, effacerMessage]);

  const annuler = useCallback(() => {
    effacerMessage();
    setEdit(e => e.passe.length ? { grille: e.passe[e.passe.length - 1], passe: e.passe.slice(0, -1) } : e);
  }, [effacerMessage]);

  const onFret = useCallback((f) => { derniereSaisieRef.current = null; modifierSelection(c => poserFret(c, f)); }, [modifierSelection]);
  const onMute = useCallback(() => modifierSelection(c => (c?.mute ? null : { mute: true })), [modifierSelection]);
  const onEffacer = useCallback(() => { derniereSaisieRef.current = null; modifierSelection(() => null); }, [modifierSelection]);
  const basculer = useCallback((champ) => modifierSelection(c => {
    if (!c || c.mute || typeof c.fret !== "number") return c;
    return { fret: c.fret, [champ]: c[champ] ? undefined : true };
  }), [modifierSelection]);
  const onLie = useCallback(() => basculer("lie"), [basculer]);
  const onSlide = useCallback(() => basculer("slide"), [basculer]);
  // bend : aucun → ton entier (le plus courant) → demi-ton → aucun
  const onBend = useCallback(() => modifierSelection(c => {
    if (!c || c.mute || typeof c.fret !== "number") return c;
    return { fret: c.fret, bend: c.bend === 2 ? 1 : c.bend === 1 ? undefined : 2 };
  }), [modifierSelection]);

  const deplacer = useCallback((dCase, dCorde) => {
    derniereSaisieRef.current = null;
    effacerMessage();
    setSelection(s => ({
      corde: Math.max(1, Math.min(6, s.corde + dCorde)),
      col: Math.max(0, Math.min(nbColsVisibles(grille) - res, s.col + dCase * res)),
    }));
  }, [grille, res, effacerMessage]);

  const choisirResolution = (r) => {
    if (r === 2 && !compatibleCroches(grille)) {
      annoncer("Cette tab contient des doubles-croches : la vue croches en cacherait certaines.");
      return;
    }
    setRes(r);
    setSelection(s => ({ ...s, col: s.col - (s.col % r) }));
  };

  // ── Lecture ──
  const arreter = useCallback(() => {
    enLectureRef.current = false;
    clearTimeout(timerBoucleRef.current); timerBoucleRef.current = null;
    stopAll();
    setJouant(false); setColLecture(null);
  }, []);

  const lancerRef = useRef(null);
  const lancer = useCallback(async (bpmLecture) => {
    const evs = grilleVersEvenements(grille);
    if (evs.length === 0) return;
    await unlockAudio();
    enLectureRef.current = true;
    setJouant(true);
    clearTimeout(timerBoucleRef.current); timerBoucleRef.current = null;
    playTab(evs, {
      bpm: bpmLecture,
      onEvent: (ev) => { if (enLectureRef.current) setColLecture(ev.col); },
      onDone: () => {
        if (!enLectureRef.current) return;
        if (boucleRef.current) { if (!timerBoucleRef.current) lancerRef.current?.(bpmRef.current); return; }
        arreter();
      },
    });
    // En boucle, on repart à la fin de la DERNIÈRE MESURE, pas de la
    // dernière note : la boucle reste calée sur la pulsation.
    if (boucleRef.current) {
      const secParPas = (60 / bpmLecture) / 4;
      const dureeMs = nbMesuresUtilisees(grille) * PAS_PAR_MESURE * secParPas * 1000;
      timerBoucleRef.current = setTimeout(() => {
        timerBoucleRef.current = null;
        if (enLectureRef.current) lancerRef.current?.(bpmRef.current);
      }, dureeMs);
    }
  }, [grille, arreter]);
  lancerRef.current = lancer;   // la boucle relit la grille à jour : on peut corriger en jouant

  const basculerLecture = useCallback(() => { if (jouant) arreter(); else lancer(bpm); }, [jouant, arreter, lancer, bpm]);

  const changerTempo = (delta) => {
    const nb = Math.max(30, Math.min(240, bpm + delta));
    setBpm(nb); bpmRef.current = nb;
    if (jouant) lancer(nb);   // appliqué tout de suite, pas au tour suivant
  };
  const basculerBoucle = () => {
    const suivant = !boucle;
    setBoucle(suivant); boucleRef.current = suivant;
    if (!suivant) { clearTimeout(timerBoucleRef.current); timerBoucleRef.current = null; }
  };

  useEffect(() => () => { enLectureRef.current = false; clearTimeout(timerBoucleRef.current); clearTimeout(timerMessageRef.current); stopAll(); }, []);

  // ── Clavier physique (ordinateur) ──
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (e.key === "Escape") { setMenuOuvert(false); setImportOuvert(false); return; }
      if (tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT") return;
      if ((e.key === " " || e.key === "Enter") && tag === "BUTTON") return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { annuler(); e.preventDefault(); return; }
      if (/^[0-9]$/.test(e.key)) {
        const now = Date.now(), d = Number(e.key), der = derniereSaisieRef.current;
        const enchainer = !!der && der.corde === selection.corde && der.col === selection.col && now - der.t < DELAI_DEUX_CHIFFRES;
        const c = lireCase(grille, selection.corde, selection.col);
        const combine = enchainer && c && !c.mute && typeof c.fret === "number" && c.fret * 10 + d <= 24;
        modifierSelection(cell => saisirChiffre(cell, d, enchainer));
        derniereSaisieRef.current = combine ? null : { corde: selection.corde, col: selection.col, t: now };
        e.preventDefault(); return;
      }
      const actions = {
        ArrowLeft: () => deplacer(-1, 0), ArrowRight: () => deplacer(1, 0),
        ArrowUp: () => deplacer(0, -1), ArrowDown: () => deplacer(0, 1),
        Backspace: onEffacer, Delete: onEffacer, " ": basculerLecture,
        x: onMute, h: onLie, s: onSlide, b: onBend,
      };
      const a = actions[e.key];
      if (a) { a(); e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grille, selection, modifierSelection, annuler, deplacer, onEffacer, basculerLecture, onMute, onLie, onSlide, onBend]);

  // Menu « ⋯ » : se ferme au premier appui en dehors.
  useEffect(() => {
    if (!menuOuvert) return;
    const fermer = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOuvert(false); };
    document.addEventListener("pointerdown", fermer);
    return () => document.removeEventListener("pointerdown", fermer);
  }, [menuOuvert]);

  const importer = () => {
    const { evenements: ev, erreur } = parseTab(texteImport);
    if (erreur) { setErreurImport(erreur); return; }
    modifier(() => evenementsVersGrille(ev));
    setSelection({ corde: 1, col: 0 });
    setErreurImport(null); setTexteImport(""); setImportOuvert(false);
    annoncer("Tab importée. « Annuler » revient à la version précédente.");
  };

  // Ligne d'aide : un message ponctuel d'abord, sinon ce qu'il faut faire
  // pour la case sélectionnée. Hauteur fixe : rien ne saute à l'écran.
  const cle = `${selection.corde}-${selection.col}`;
  const nomCorde = CORDES_LABELS[selection.corde - 1];
  const aide = message
    || (!cellSel ? `Choisis la case du manche pour la corde ${nomCorde}.`
      : cellSel.mute ? "Note étouffée : jouée sans hauteur, pour le rythme."
      : (cellSel.lie || cellSel.slide) && !origines.has(cle)
        ? (cellSel.slide ? "Place une note plus loin sur cette corde pour terminer le slide."
                         : "Place une note plus loin sur cette corde : hammer-on si elle monte, pull-off si elle descend.")
      : cellSel.bend ? `Case ${cellSel.fret}, tirée d'${cellSel.bend === 2 ? "un ton" : "un demi-ton"}.`
      : `Corde ${nomCorde}, case ${cellSel.fret}.`);

  const itemMenu = (icon, label, onClick, danger) => (
    <button role="menuitem" onClick={() => { setMenuOuvert(false); onClick(); }} className="gr-focus" style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 12px", border: "none",
      background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, textAlign: "left",
      color: danger ? C.primaryD : C.text, fontFamily: FONTS.ui,
    }}>
      <Ti name={icon} size={16} color={danger ? C.primary : C.text2} />{label}
    </button>
  );
  const boutonCarre = { width: 40, height: 40, borderRadius: R.sm, border: `1.5px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.text2, fontWeight: 800, fontFamily: FONTS.ui, padding: 0 };

  return (
    <div>
      {/* ── Barre d'édition : densité, annuler, menu ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div role="group" aria-label="Densité de la grille" style={{ display: "flex", background: C.surface2, borderRadius: R.sm, padding: 3 }}>
          {[[2, "Croches"], [1, "Doubles"]].map(([r, label]) => (
            <button key={r} onClick={() => choisirResolution(r)} aria-pressed={res === r} className="gr-focus" style={{
              padding: "7px 11px", borderRadius: R.sm - 2, border: "none", cursor: "pointer", fontFamily: FONTS.ui,
              fontSize: 12, fontWeight: 800, background: res === r ? C.surface : "transparent",
              color: res === r ? C.text : C.text3, boxShadow: res === r ? `0 0 0 1.5px ${C.border}` : "none",
            }}>{label}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={annuler} disabled={edit.passe.length === 0} className="gr-focus" style={{
          ...boutonCarre, width: "auto", padding: "0 12px", fontSize: 12.5,
          opacity: edit.passe.length ? 1 : .4, cursor: edit.passe.length ? "pointer" : "default",
        }}>Annuler</button>
        <div ref={menuRef} style={{ position: "relative" }}>
          <button onClick={() => setMenuOuvert(o => !o)} aria-haspopup="menu" aria-expanded={menuOuvert} aria-label="Plus d'actions" className="gr-focus" style={{ ...boutonCarre, fontSize: 18 }}>⋯</button>
          {menuOuvert && (
            <div role="menu" style={{ position: "absolute", right: 0, top: 44, zIndex: 20, minWidth: 220, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.md, boxShadow: "0 8px 24px rgba(0,0,0,.18)", overflow: "hidden" }}>
              {itemMenu("clipboard-check", "Importer une tab texte", () => setImportOuvert(true))}
              {itemMenu("sparkles", "Repartir de l'exemple", () => { modifier(() => grilleExemple()); annoncer("Exemple rechargé. « Annuler » pour revenir."); })}
              {itemMenu("trash", "Tout effacer", () => { modifier(() => grilleVide()); annoncer("Tab effacée. « Annuler » la fait revenir."); }, true)}
            </div>
          )}
        </div>
      </div>

      {importOuvert && (
        <div style={{ marginBottom: 10, padding: 10, borderRadius: R.md, background: C.surface2 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 6 }}>Colle une tab au format texte (6 lignes, une par corde)</div>
          <textarea value={texteImport} onChange={e => setTexteImport(e.target.value)} spellCheck={false} rows={6}
            placeholder={"e|--0---2---3h5---|\nB|----------------|\n…"}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.5, padding: "10px 12px", borderRadius: R.md, border: `1.5px solid ${erreurImport ? C.primary : C.border}`, background: C.surface, color: C.text, resize: "vertical" }} />
          {erreurImport && <div style={{ fontSize: 12, color: C.primaryD, marginTop: 4 }}>{erreurImport}</div>}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <button onClick={importer} className="gr-focus" style={{ flex: 1, height: 40, borderRadius: R.sm, border: "none", background: C.primaryBtn, color: "#fff", fontWeight: 800, cursor: "pointer", fontFamily: FONTS.ui }}>Importer</button>
            <button onClick={() => { setImportOuvert(false); setErreurImport(null); }} className="gr-focus" style={{ ...boutonCarre, width: "auto", padding: "0 14px", fontSize: 12.5 }}>Fermer</button>
          </div>
        </div>
      )}

      <GrilleTab grille={grille} evenements={evenements} res={res} selection={selection}
        onSelect={(s) => { setSelection(s); derniereSaisieRef.current = null; effacerMessage(); }} colLecture={colLecture} C={C} />

      <div role="status" aria-live="polite" style={{ minHeight: 34, display: "flex", alignItems: "center", fontSize: 12, lineHeight: 1.35, color: message ? C.primaryD : C.text2, fontWeight: message ? 700 : 500, padding: "4px 2px" }}>
        {aide}
      </div>

      <ClavierManche cell={cellSel} onFret={onFret} onMute={onMute} onEffacer={onEffacer} C={C} />
      <TechniquesNote cell={cellSel} onLie={onLie} onSlide={onSlide} onBend={onBend} C={C} />

      {/* ── Lecture, dans la zone du pouce ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
        <button onClick={basculerLecture} disabled={!jouant && evenements.length === 0} className="gr-focus" style={{
          flex: 1, height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          borderRadius: R.lg, border: "none", background: jouant ? C.surface2 : C.primaryBtn,
          color: jouant ? C.text : "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: FONTS.ui,
          opacity: (!jouant && evenements.length === 0) ? .5 : 1,
        }}>
          <Ti name={jouant ? "player-pause" : "player-play"} size={17} color={jouant ? C.text : "#fff"} />
          {jouant ? "Arrêter" : "Écouter"}
        </button>
        <div role="group" aria-label="Tempo" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => changerTempo(-5)} aria-label="Ralentir" className="gr-focus" style={{ ...boutonCarre, width: 36 }}>−</button>
          <div style={{ minWidth: 44, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1 }}>{bpm}</div>
            <div style={{ fontSize: 9, color: C.text3, marginTop: 2 }}>BPM</div>
          </div>
          <button onClick={() => changerTempo(5)} aria-label="Accélérer" className="gr-focus" style={{ ...boutonCarre, width: 36 }}>+</button>
        </div>
        <button onClick={basculerBoucle} aria-pressed={boucle} aria-label="Lecture en boucle" className="gr-focus" style={{
          ...boutonCarre, width: 52, height: 44, flexDirection: "column", gap: 1,
          border: `1.5px solid ${boucle ? C.primary : C.border}`, background: boucle ? C.primaryL : C.surface,
        }}>
          <Ti name="refresh" size={15} color={boucle ? C.primary : C.text2} />
          <span style={{ fontSize: 9.5, fontWeight: 800, color: boucle ? C.primaryD : C.text3 }}>Boucle</span>
        </button>
      </div>
    </div>
  );
}

const ONGLETS_OUTILS = [
  { id:"metronome", label:"Métronome",    icon:"clock" },
  { id:"tuner",     label:"Accordeur",    icon:"microphone" },
  { id:"chords",    label:"Accords",      icon:"music" },
  { id:"neck",      label:"Manche",       icon:"guitar-pick" },
  { id:"tablature", label:"Tablature",    icon:"notebook" },
  { id:"jam",       label:"Jam Session",  icon:"music-plus", externe:true },
  { id:"ear",       label:"Ear Training", icon:"ear",        externe:true },
];
const OUTILS_INTERNES = new Set(ONGLETS_OUTILS.filter(t => !t.externe).map(t => t.id));

function ToolboxScreen({ onBack, navigate }) {
  const C = useC();
  // L'outil actif est mémorisé : revenir dans Outils ramène là où on était
  // (au milieu d'une tab, par exemple), pas systématiquement au métronome.
  const [tab, setTabBrut] = useState(() => {
    try { const t = localStorage.getItem("groply:outil-actif"); if (OUTILS_INTERNES.has(t)) return t; } catch { /* noop */ }
    return "metronome";
  });
  const setTab = (t) => { setTabBrut(t); try { localStorage.setItem("groply:outil-actif", t); } catch { /* noop */ } };
  // Sur mobile, la barre de défilement horizontale est masquée par le
  // système : rien n'indiquait qu'il y avait d'autres outils à droite. Un
  // fondu + une flèche le signalent, et disparaissent une fois au bout.
  const ongletsRef = useRef(null);
  const [finOnglets, setFinOnglets] = useState(false);
  const majFinOnglets = useCallback(() => {
    const el = ongletsRef.current;
    if (el) setFinOnglets(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);
  useEffect(() => {
    // Un outil restauré peut se trouver hors de la vue (Tablature, à droite).
    ongletsRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    majFinOnglets();
    window.addEventListener("resize", majFinOnglets);
    return () => window.removeEventListener("resize", majFinOnglets);
  }, [majFinOnglets]);

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Header */}
      <div style={{
        backgroundColor:"#b7a0c8", backgroundImage:"url('/sunrise.jpg')", backgroundSize:"cover", backgroundPosition:"center 40%",
        padding:"26px 20px 20px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(160,55,0,.5)" }}/>
        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12 }}>
          {onBack && (
            <button onClick={onBack} aria-label="Retour" className="gr-focus" style={{
              background:"rgba(255,255,255,.85)", border:"none", borderRadius:R.sm,
              width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            }}>
              <Ti name="arrow-left" size={17} color={C.primaryD}/>
            </button>
          )}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Boîte à outils</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", marginTop:1 }}>Tout ce qu'il faut pour pratiquer</div>
          </div>
        </div>
      </div>

      {/* Onglets — en défilement horizontal, pas en répartition égale :
          à 6 entrées, flex:1 chacun serait devenu trop étroit pour que le
          libellé tienne proprement sur mobile. Jam Session et Ear Training
          appellent `navigate` (elles quittent l'écran) au lieu de `setTab`
          (qui change juste le contenu affiché) — mêmes onglets, deux
          comportements au clic, comme n'importe quel onglet qui mène vers
          une page à part ailleurs dans l'app. */}
      <div style={{ position:"relative" }}>
      <div ref={ongletsRef} onScroll={majFinOnglets} style={{ overflowX:"auto", WebkitOverflowScrolling:"touch", padding:"14px 20px 0" }}>
        <div role="tablist" aria-label="Outils" style={{ display:"flex", gap:8, width:"max-content", alignItems:"stretch" }}>
          {ONGLETS_OUTILS.map((t, i) => {
            const actif = tab === t.id;
            // Jam Session et Ear Training ouvrent une autre page : un petit
            // séparateur et une flèche ↗ le signalent avant l'appui, sans
            // les sortir de la rangée (où tu voulais les voir).
            const premierExterne = t.externe && !ONGLETS_OUTILS[i - 1]?.externe;
            return (
              <div key={t.id} style={{ display:"flex", alignItems:"stretch", gap:8 }}>
                {premierExterne && <div aria-hidden="true" style={{ width:1.5, background:C.border, margin:"6px 0" }}/>}
                <button
                  role={t.externe ? undefined : "tab"}
                  aria-selected={t.externe ? undefined : actif}
                  aria-label={t.externe ? `${t.label} (ouvre une autre page)` : undefined}
                  onClick={()=> t.externe ? navigate(t.id) : setTab(t.id)}
                  className="gr-focus"
                  style={{
                    position:"relative", flexShrink:0, width:82, padding:"10px 4px", borderRadius:R.lg, cursor:"pointer", fontFamily:FONTS.ui,
                    border:`1.5px solid ${actif?C.primary:C.border}`,
                    background: actif?C.primaryL:C.surface,
                    color: actif?C.primaryD:C.text2, fontWeight:700, fontSize:10.5,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
                    textAlign:"center", lineHeight:1.2,
                  }}>
                  {t.externe && <span aria-hidden="true" style={{ position:"absolute", top:3, right:6, fontSize:10, color:C.text3 }}>↗</span>}
                  <Ti name={t.icon} size={15} color={actif?C.primary:C.text3}/>
                  {t.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {!finOnglets && (
        <div aria-hidden="true" style={{
          position:"absolute", top:14, right:0, bottom:0, width:56, pointerEvents:"none",
          background:`linear-gradient(to right, transparent, ${C.bg} 70%)`,
          display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:6,
        }}>
          <Ti name="chevron-right" size={18} color={C.text2}/>
        </div>
      )}
      </div>

      {/* Contenu */}
      <div role="tabpanel" aria-label={ONGLETS_OUTILS.find(t => t.id === tab)?.label} style={{ padding:"18px 20px 0" }}>
        {tab === "metronome" ? <Metronome/>
         : tab === "tuner"     ? <Tuner/>
         : tab === "chords"    ? <ChordPlayer/>
         : tab === "tablature" ? <TabEditor/>
         : <FretboardExplorer embedded />}
      </div>

    </div>
  );
}

export { ToolboxScreen };
