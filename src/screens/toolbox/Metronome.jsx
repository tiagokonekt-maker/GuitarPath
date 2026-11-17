// Groply — src/screens/toolbox/Metronome.jsx
// Métronome de la boîte à outils (chargé à la demande par ToolboxScreen).
import { useState, useRef, useEffect, useCallback } from "react";
import * as Tone from "tone";
import { R, T } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Ti } from "../../design/Ti.jsx";
import { relief } from "../../design/hooks.js";
import { Button, Card, Chip, Eyebrow } from "../../design/ui.jsx";

// Boutons « −5 / −1 / +1 / +5 » : carrés, ils se partagent la largeur autour
// du bouton de lecture et rétrécissent sur un petit écran.
const STYLE_PAS = { flex: "1 1 44px", minWidth: 0, maxWidth: 54, padding: 0 };

// ═══════════════════════════════════════════════════════════════════════════
// MÉTRONOME
// ═══════════════════════════════════════════════════════════════════════════
export function Metronome() {
  const C = useC();
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
  }, [bpm, ensureClick]);

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
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── Pastilles de temps──────────────────────────────────────────────
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
      <Card style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 10, margin: "2px 0 18px",
          height: 24,          // hauteur figée : plus de décalage vertical
        }}>
          {Array.from({ length: beats }).map((_, i) => {
            const on = current === i;
            const strong = i === 0;
            const teinte = strong ? C.primary : C.amber;
            return (
              <div key={i} style={{
                width: 24, height: 24,           // taille de boîte constante
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: R.pill,
                  background: on ? teinte : C.border,
                  transform: on ? "scale(1.35)" : "scale(1)",
                  boxShadow: on ? `0 0 0 4px color-mix(in srgb, ${teinte} 22%, transparent)` : "none",
                  // On ne transitionne QUE transform et les couleurs — jamais
                  // `all`, qui embarquerait aussi les propriétés de mise en page.
                  transition: "transform var(--gr-dur-press) var(--gr-ease-out), background-color var(--gr-dur-press) ease, box-shadow var(--gr-dur-press) ease",
                  willChange: "transform",
                }} />
              </div>
            );
          })}
        </div>

        {/* BPM géant : chiffres à chasse fixe, pour que le nombre ne danse
            pas quand on fait glisser le curseur. */}
        <div style={{ fontSize: 64, fontWeight: 800, color: C.text, letterSpacing: "-2px", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {bpm}
        </div>
        <Eyebrow style={{ marginTop: 4 }}>BPM · {tempoLabel}</Eyebrow>

        <input type="range" min="40" max="240" value={bpm}
          aria-label="Tempo" aria-valuetext={`${bpm} battements par minute, ${tempoLabel}`}
          onChange={e => setBpm(+e.target.value)}
          className="gr-focus"
          style={{ width: "100%", margin: "16px 0 14px", accentColor: C.primary }} />

        {/* Ralentir · lecture · accélérer. Le bouton rond est LE bouton de
            l'écran : aplat primaire, tranche épaisse. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
          {[-5, -1].map(d => (
            <Button key={d} variant="secondary" onClick={() => nudge(d)} aria-label={`Ralentir de ${-d}`} style={STYLE_PAS}>{d}</Button>
          ))}
          <button type="button" onClick={toggle} aria-label={playing ? "Arrêter le métronome" : "Démarrer le métronome"}
            className="gr-press gr-focus" style={{
              ...relief(C.primaryEdge, 5),
              width: 72, height: 72, flexShrink: 0, padding: 0, marginLeft: 4, marginRight: 4,
              borderRadius: R.pill, border: "none",
              background: C.primaryBtn, color: C.onPrimaryBtn,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <Ti name={playing ? "player-pause" : "player-play"} size={30} color="currentColor" />
          </button>
          {[1, 5].map(d => (
            <Button key={d} variant="secondary" onClick={() => nudge(d)} aria-label={`Accélérer de ${d}`} style={STYLE_PAS}>+{d}</Button>
          ))}
        </div>
      </Card>

      {/* Timbre du son */}
      <Card pad="12px 14px">
        <Eyebrow style={{ marginBottom: 8 }}>Son</Eyebrow>
        <div role="radiogroup" aria-label="Timbre du métronome" style={{ display: "flex", gap: 6 }}>
          {TIMBRES.map(t => {
            const actif = timbre === t.id;
            return (
              // Bouton radio : `aria-checked` porte l'état, pas `aria-pressed`.
              <Chip
                key={t.id}
                role="radio"
                aria-checked={actif}
                aria-pressed={undefined}
                selected={actif}
                onClick={() => setTimbre(t.id)}
                style={{ flex: 1, minWidth: 0, minHeight: 44, padding: "0 4px" }}>
                {t.label}
              </Chip>
            );
          })}
        </div>
      </Card>

      {/* Signature + tap */}
      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
        <Card pad="12px 14px" style={{ flex: 1, minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 8 }}>Mesure</Eyebrow>
          <div style={{ display: "flex", gap: 6 }}>
            {[2, 3, 4, 6].map(n => (
              <Chip key={n} selected={beats === n} onClick={() => setBeats(n)} aria-label={`${n} temps par mesure`}
                style={{ flex: 1, minWidth: 0, minHeight: 44, padding: 0 }}>{n}</Chip>
            ))}
          </div>
        </Card>
        <button
          type="button"
          onClick={tapTempo}
          className="gr-press gr-focus"
          aria-label={tapCount > 0 ? `Tap tempo, ${tapCount} appuis comptés` : "Tap tempo"}
          style={{
            ...relief(C.amberBorder, 3),
            width: 96, flexShrink: 0, padding: "8px 4px",
            background: C.amberL, border: `2px solid ${C.amberBorder}`, borderRadius: R.lg,
            color: C.amberD, fontFamily: "inherit", fontWeight: 700, fontSize: T.small,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
          }}>
          <Ti name="hand-finger-down" size={18} color={C.amber} />
          <span style={{ whiteSpace: "nowrap" }}>Tap tempo</span>

          {/* Retour visuel des appuis, sous forme de points et non de chiffre.
              Mon premier essai affichait « Tap tempo · 2 » : le texte passait à
              la ligne dans un bouton de 96 px et donnait l'impression d'un
              défaut d'affichage — sans expliquer ce que valait ce « 2 ».

              Des points se comprennent sans légende (« il compte mes appuis »),
              tiennent sur une ligne, et la zone garde une HAUTEUR FIXE pour ne
              pas décaler la mise en page quand ils apparaissent. */}
          <div aria-hidden="true" style={{
            height: 6, display: "flex", gap: 3, alignItems: "center", justifyContent: "center",
          }}>
            {Array.from({ length: TAPS_MAX }).map((_, i) => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: R.pill,
                background: i < tapCount ? C.amber : "transparent",
                transition: "background-color var(--gr-dur-fast) ease",
              }} />
            ))}
          </div>
        </button>
      </div>

      {/* Aide du tap tempo. `aria-live` pour qu'un lecteur d'écran annonce la
          progression de la mesure ; `minHeight` pour que l'apparition du
          message ne décale pas la mise en page. */}
      <div role="status" aria-live="polite" style={{
        minHeight: 18, textAlign: "center",
        fontSize: 12, color: C.text2, lineHeight: 1.5,
      }}>
        {aideTap}
      </div>
    </div>
  );
}
