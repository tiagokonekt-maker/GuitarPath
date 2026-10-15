// GuitarPath -- screens/JamSession.jsx
// Outil interactif d'improvisation : gamme active, notes cibles, contraintes + backing track
import { useState, useMemo, useEffect, useEffectEvent, useRef, useCallback } from "react";
import { useWakeLock } from "../hooks/useWakeLock.js";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { BackButton } from "../design/ui.jsx";
import { Fretboard } from "../Fretboard.jsx";
import { getScaleNotes, normalizeNote, SCALES } from "../fretboardUtils.js";
import { nomsGamme } from "../music/orthographe.js";
import { createComper } from "../music/compRhythm.js";
import { companionSwing, swingBeat } from "../jam/music/groove.js";
import { activerSessionAudio } from "../audioEngine.js";
import * as Tone from "tone";
// Sous-modules de l'écran (src/screens/jam) : données et fonctions pures,
// et les blocs qui suivent le temps de jeu chaque seconde.
import { makeContexts, appliquerChoix, feelLabel } from "./jam/contextes.js";
import { MIXAGE } from "./jam/mixage.js";
import {
  ROOTS_FR, CHROMATIC, transposeNote, nomsNotesAccord, nomAccord, nomTonique,
  getVoicedChord, getBassPattern, getDrumPattern, getStyle,
} from "./jam/harmonie.js";
import { creerChrono } from "./jam/chrono.js";
import { SEUIL_SESSION, BPM_MIN, BPM_MAX } from "./jam/reglages.js";
import { SuiviSeance } from "./jam/SuiviSeance.jsx";
import { CarteContrainte } from "./jam/CarteContrainte.jsx";

// ── Moteur de groove (src/jam) ─────────────────────────────────────────
// L'horloge reste Tone.Transport, partagée avec les accords et la basse :
// une seule horloge, donc aucune dérive possible entre instruments. De
// src/jam on n'utilise que la partie générative, en JavaScript pur :
// planner (forme longue) + director (décisions de phrase) + generateDrumBar
// (grille → évènements). Elle est appelée dans la boucle par mesure (le
// `Tone.Sequence` plus bas) ; le chargement et la lecture des échantillons
// (`playDrum`) restent ceux de cet écran.
import { createPlanner, createDirector } from "../jam/arrangement/arranger.js";
import { generateDrumBar } from "../jam/generators/drums.js";

import BLUES_SHUFFLE_PACK from "../jam/packs/blues-shuffle.json";
import FUNK_16_PACK from "../jam/packs/funk-16.json";
import ROCK_8_PACK from "../jam/packs/rock-8.json";
import JAZZ_SWING_PACK from "../jam/packs/jazz-swing.json";
import BOSSA_NOVA_PACK from "../jam/packs/bossa-nova.json";
import BALLADE_POP_PACK from "../jam/packs/ballade-pop.json";
import { packPourStyle, bassStylePour, compStylePour, ambiancePour } from "../jam/styles.js";

// Chaque style a son pack (src/jam/styles.js fait la correspondance) : la
// batterie, mais aussi la BASSE (`bassStyle`) et l'ACCOMPAGNEMENT
// (`compStyle`) en sont tirés. Un style sans pack retomberait sur le motif
// de batterie statique et la walking bass, plus bas.
const PACKS = [BLUES_SHUFFLE_PACK, FUNK_16_PACK, ROCK_8_PACK, JAZZ_SWING_PACK, BOSSA_NOVA_PACK, BALLADE_POP_PACK];

// Assombrit une couleur hex d'une quantité fixe, quel que soit le thème.
// Les boutons de lecture utilisaient `colorD` (celui de `context`, ou
// `C.primaryD`) comme second point de dégradé — or ce token est une couleur
// de TEXTE, claire en thème sombre pour rester lisible sur un fond teinté,
// pas une couleur de fond de bouton. Résultat en thème sombre : un dégradé
// qui allait vers une teinte pâle, avec l'icône blanche presque invisible
// dessus. `shade()` assombrit toujours PAR RAPPORT à la couleur de base,
// donc le résultat reste correct dans les deux thèmes.
function shade(hex, amount) {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + amount, g = ((num >> 8) & 0xff) + amount, b = (num & 0xff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

// ── Échantillons décodés, gardés d'un lancement à l'autre ─────────────────
// Chaque lecture, et chaque changement de style, recréait Sampler et Players :
// toutes les mp3 étaient re-décodées (plusieurs secondes sur mobile, et autant
// de mémoire tant que l'ancien décodage n'était pas libéré). Les buffers
// décodés sont gardés ici, par instrument ; seuls les nœuds légers qui les
// lisent sont recréés. Un chargement qui échoue ou dépasse son délai est
// libéré et retiré du cache : le suivant repart de zéro.
const cacheEchantillons = new Map();   // clé → { ctx, promesse }

function chargerEchantillons(cle, urls, baseUrl, delaiMs) {
  const ctx = Tone.getContext();
  const enCache = cacheEchantillons.get(cle);
  // Des buffers décodés pour un autre contexte audio ne sont pas réutilisés.
  if (enCache && enCache.ctx === ctx) return enCache.promesse;
  const promesse = new Promise((resolve, reject) => {
    let buffers = null, fini = false, minuteur = null;
    const echec = (e) => {
      if (fini) return;
      fini = true;
      clearTimeout(minuteur);
      try { buffers?.dispose(); } catch { /* déjà libéré */ }
      reject(e instanceof Error ? e : new Error(String(e)));
    };
    minuteur = setTimeout(() => echec(new Error("délai dépassé")), delaiMs);
    buffers = new Tone.ToneAudioBuffers({
      urls, baseUrl,
      onload: () => {
        if (fini) return;
        fini = true;
        clearTimeout(minuteur);
        resolve(buffers);
      },
      onerror: echec,
    });
  });
  const entree = { ctx, promesse };
  cacheEchantillons.set(cle, entree);
  promesse.catch(() => { if (cacheEchantillons.get(cle) === entree) cacheEchantillons.delete(cle); });
  return promesse;
}

/** { "C2": "C2.mp3"… } + buffers chargés → { "C2": ToneAudioBuffer… } pour un Sampler. */
const urlsDepuisBuffers = (buffers, urls) =>
  Object.fromEntries(Object.keys(urls).map(n => [n, buffers.get(n)]));

/**
 * Batterie lue depuis les buffers partagés : une source par frappe, avec
 * SA dynamique (gain de la source). Les charlestons passent par leur propre
 * sortie (panoramique).
 */
function creerKitBatterie(buffers, sortie, sortieCharleston) {
  const voix = new Set();
  return {
    jouer(cle, time, db) {
      const src = new Tone.ToneBufferSource(buffers.get(cle));
      src.connect(sortieCharleston && cle.startsWith("hihat") ? sortieCharleston : sortie);
      voix.add(src);
      // Tone libère lui-même la source une fois `onended` appelé.
      src.onended = () => voix.delete(src);
      src.start(time, 0, undefined, Tone.dbToGain(db));
    },
    // Les frappes déjà planifiées pour la mesure en cours sont coupées.
    dispose() {
      for (const s of voix) { try { s.stop(); s.disconnect(); } catch { /* déjà terminée */ } }
      voix.clear();
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// BACKING TRACK PLAYER — Version Pro
// Samples FatBoy guitare steel + basse compressée + batterie procédurale
// Chaîne audio : instruments -> reverb/delay -> compresseur master
// ─────────────────────────────────────────────────────────────────────────
function BackingTrackPlayer({ context, root, bpm, onBpmChange, onChord, onSecondeJouee, onLecture }) {
  const C = useC();
  const [playing, setPlaying]       = useState(false);
  const [compte, setCompte]         = useState(null);   // décompte 1-2-3-4 avant l'entrée
  const [rampe, setRampe]           = useState(false);  // +5 BPM toutes les 2 grilles
  // Le « groupe » se dirige : intensité (1 calme → 5 intense) et mixage.
  // Les trois moteurs acceptaient déjà une intensité, mais recevaient
  // toujours 3 en dur. Couper un instrument sert à travailler avec moins
  // de soutien (sans basse, on doit faire entendre l'harmonie soi-même).
  const [energie, setEnergie]       = useState(3);
  const [coupes, setCoupes]         = useState({ accords: false, basse: false, batterie: false });
  const [reglagesOuverts, setReglagesOuverts] = useState(false);
  // L'écran reste allumé pendant qu'on joue : guitare en main, on ne
  // touche pas le téléphone, et il se mettait en veille en pleine session.
  useWakeLock(playing);
  const [beat, setBeat]             = useState(0);
  const [currentChord, setCurrentChord] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [playError, setPlayError]   = useState(null);
  // Vrai quand le système a coupé le son en pleine lecture (appel entrant,
  // autre app, écran verrouillé sur iOS) : la lecture est arrêtée et le
  // bandeau propose de reprendre.
  const [interrompu, setInterrompu] = useState(false);

  // Refs instruments
  const samplerRef  = useRef(null); // guitare steel samples
  const bassRef     = useRef(null); // basse synthétique
  const kickRef     = useRef(null); // grosse caisse
  const snareRef    = useRef(null); // caisse claire
  const hihatRef    = useRef(null); // charleston
  const seqRef      = useRef(null); // séquenceur principal
  const beatSeqRef  = useRef(null); // séquenceur batterie
  const bassFilterRef  = useRef(null);
  const bassCompRef    = useRef(null);
  const kickCompRef    = useRef(null);
  const snareFilterRef = useRef(null);
  const comperRef      = useRef(null);
  const drumsRef       = useRef(null);
  const drumsLoadedRef = useRef(false);
  const drumRRRef      = useRef({});   // dernier échantillon joué par élément
  const plannerRef     = useRef(null); // forme longue (src/jam) — actif uniquement si un pack existe pour ce style
  const directorRef    = useRef(null); // décisions de phrase (src/jam)
  // Refs master chain
  const reverbRef   = useRef(null);
  const delayRef    = useRef(null);
  const compRef     = useRef(null);
  const mixRef      = useRef([]);   // éléments de mixage à libérer à l'arrêt
  // Annulation du lancement. Le lancement attend 6 chargements (démarrage
  // audio, réverbération, piano, basse, batterie…) : quitter l'écran ou
  // changer de style PENDANT ce temps lançait quand même la musique, sans
  // plus personne pour l'arrêter. Chaque lancement a un numéro ; l'arrêt le
  // change ; un lancement périmé libère ce qu'il a créé et ne joue rien.
  const generationRef = useRef(0);
  const demarrageRef  = useRef(null);

  // La tonalité et le tempo sont RELUS à chaque mesure (refs) au lieu d'être
  // figés au démarrage : changer de tonalité ou de tempo en jouant s'entend
  // dès la mesure suivante, sans couper la musique.
  const rootRef    = useRef(root);   rootRef.current = root;
  const rampeRef   = useRef(rampe);  rampeRef.current = rampe;
  const onChordRef = useRef(onChord); onChordRef.current = onChord;
  const onBpmRef   = useRef(onBpmChange); onBpmRef.current = onBpmChange;
  const playingRef = useRef(false);  playingRef.current = playing;
  const energieRef = useRef(energie); energieRef.current = energie;
  const coupesRef  = useRef(coupes);  coupesRef.current = coupes;
  const mesureRef  = useRef(0);       // dernière mesure jouée, pour ajuster le plan en direct
  const onSecondeRef = useRef(onSecondeJouee); onSecondeRef.current = onSecondeJouee;
  const onLectureRef = useRef(onLecture); onLectureRef.current = onLecture;
  useEffect(() => { onLectureRef.current?.(playing); }, [playing]);

  // Temps de jeu réel, décompte exclu : c'est lui qui fera compter la
  // session dans la série et l'XP (voir JamSession).
  useEffect(() => {
    if (!playing || compte != null) return;
    const t = setInterval(() => onSecondeRef.current?.(), 1000);
    return () => clearInterval(t);
  }, [playing, compte]);
  useEffect(() => { try { Tone.getTransport().bpm.value = bpm; } catch { /* noop */ } }, [bpm]);

  // Changer de STYLE en jouant change la grille, le son et la batterie :
  // on relance aussitôt, plutôt que de s'arrêter en silence.
  // Effect Events : relisent la version courante de start/stopBacking sans
  // figurer dans les dépendances — l'effet ne se redéclenche QUE sur un
  // changement de style, jamais à cause d'un simple re-rendu.
  const relancerSiJoue = useEffectEvent(() => {
    if (playingRef.current) { stopBacking(); startBacking(); }
  });
  const arreterAuDemontage = useEffectEvent(() => stopBacking());
  // Changer de GRILLE (rock I–IV–V → vi–IV–I–V…) relance aussi.
  const cleContexte = `${context.id}:${context.grilleId ?? ""}`;
  const contexteRef = useRef(cleContexte);
  useEffect(() => {
    if (contexteRef.current === cleContexte) return;
    contexteRef.current = cleContexte;
    relancerSiJoue();
  }, [cleContexte]);
  useEffect(() => () => arreterAuDemontage(), []);

  // ── Coupure par le système ──────────────────────────────────────────────
  // iOS suspend (« interrupted ») le contexte audio lors d'un appel, d'une
  // alarme, du passage d'une autre app au premier plan. Le Transport se fige
  // alors en silence, et l'écran affichait toujours « en cours » — avec un
  // bouton pause qui ne correspondait plus à rien. On arrête proprement et
  // on propose de reprendre : la reprise passe par un toucher, seul geste
  // qui permette à iOS de relancer l'audio.
  const surCoupureSysteme = useEffectEvent(() => {
    if (!playingRef.current) return;
    stopBacking();
    setInterrompu(true);
    setPlayError("Le son a été coupé par le système (appel, autre application…).");
  });
  useEffect(() => {
    if (!playing) return;
    const ctx = Tone.getContext();
    const surChangement = () => {
      const etat = ctx.state;
      if (etat === "interrupted" || etat === "suspended") surCoupureSysteme();
    };
    ctx.on("statechange", surChangement);
    return () => { ctx.off("statechange", surChangement); };
  }, [playing]);

  /**
   * Joue un élément de batterie.
   * Choisit l'échantillon selon la dynamique, en évitant de rejouer le même
   * que la fois précédente : c'est ce round-robin qui empêche deux frappes
   * successives de sonner rigoureusement identiques.
   */
  function playDrum(type, time, velocity = 0.8) {
    const COUNTS = { kick: 3, snare: 2, hihat: 3, hihatOpen: 2, ride: 2, crash: 2, tomLow: 1, tomMid: 1 };
    if (drumsLoadedRef.current && drumsRef.current) {
      const n = COUNTS[type] || 1;
      // La dynamique choisit la zone d'échantillons, le round-robin choisit
      // lequel dans cette zone.
      let idx = Math.min(n - 1, Math.floor(velocity * n));
      const last = drumRRRef.current[type];
      if (n > 1 && idx === last) idx = (idx + 1) % n;
      drumRRRef.current[type] = idx;
      // Dynamique PAR FRAPPE : changer le volume du lecteur partagé, comme
      // avant, modifiait aussi les cymbales qui résonnaient encore.
      try { drumsRef.current.jouer(`${type}${idx}`, time, -6 + (velocity - 0.8) * 12); }
      catch { /* échantillon absent : on saute */ }
      return;
    }
    // Repli synthétique
    if (type === "kick")  kickRef.current?.triggerAttackRelease("C1", "8n", time);
    if (type === "snare") snareRef.current?.triggerAttackRelease("8n", time);
    if (type === "hihat") hihatRef.current?.triggerAttackRelease("32n", time);
  }

  // ── Démarrage du backing ────────────────────────────────────────────────
  // Un nouveau lancement attend que le précédent se soit retiré avant de
  // toucher aux instruments : deux lancements ne se disputent jamais les mêmes.
  function startBacking() {
    // Dans le geste lui-même, AVANT tout await : iOS n'autorise la reprise
    // du contexte audio que dans la pile d'appel du toucher. Et le son passe
    // en catégorie « lecture » : le bouton silencieux ne le coupe plus.
    activerSessionAudio();
    try { if (Tone.getContext().state !== "running") Tone.getContext().resume().catch(() => {}); } catch { /* noop */ }
    setInterrompu(false);
    const moi = ++generationRef.current;
    const precedent = demarrageRef.current;
    const lancement = (async () => {
      if (precedent) { try { await precedent; } catch { /* noop */ } }
      if (moi !== generationRef.current) return;
      await demarrerBacking(moi);
    })();
    demarrageRef.current = lancement;
    return lancement;
  }

  async function demarrerBacking(moi) {
    const perime = () => moi !== generationRef.current;
    setLoading(true);
    setPlayError(null);
    try {
      await Tone.start();
      await Tone.getContext().resume();
      if (perime()) { libererAudio(); return; }
      Tone.getTransport().bpm.value = bpm;
      Tone.getTransport().cancel();

      // ── Chaîne master ─────────────────────────────────────────────────
      const limiteur = new Tone.Limiter(MIXAGE.limiteurDb).toDestination();
      mixRef.current.push(limiteur);
      compRef.current = new Tone.Compressor({
        threshold: -18, ratio: 4, attack: 0.003, release: 0.25,
      }).connect(limiteur);

      // Ambiance du style (src/jam/styles.js) : pièce plus grande et écho
      // discret pour le jazz et la ballade, plus sèche pour le rock.
      const style    = getStyle(context.id);
      const ambiance = ambiancePour(style);
      reverbRef.current = new Tone.Reverb({
        decay: ambiance.decay,
        wet: ambiance.wet,
        preDelay: 0.02,
      });
      await reverbRef.current.generate();
      if (perime()) { libererAudio(); return; }
      reverbRef.current.connect(compRef.current);

      // Delay subtil (jazz, ballade)
      if (ambiance.delay) {
        delayRef.current = new Tone.FeedbackDelay({
          delayTime: "8n.", feedback: 0.15, wet: 0.08,
        });
        delayRef.current.connect(reverbRef.current);
      }

      const masterOut = delayRef.current || reverbRef.current;

      // ── Sampler guitare steel (accords) ───────────────────────────────
      const SAMPLE_URLS_LOCAL = {
        "A2":"A2.mp3","A3":"A3.mp3","A4":"A4.mp3",
        "B2":"B2.mp3","B3":"B3.mp3","B4":"B4.mp3",
        "C3":"C3.mp3","C4":"C4.mp3","D3":"D3.mp3","D4":"D4.mp3",
        "E2":"E2.mp3","E3":"E3.mp3","E4":"E4.mp3",
        "F3":"F3.mp3","F4":"F4.mp3","G3":"G3.mp3","G4":"G4.mp3",
        "Ab2":"Ab2.mp3","Ab3":"Ab3.mp3","Ab4":"Ab4.mp3",
        "Bb2":"Bb2.mp3","Bb3":"Bb3.mp3","Bb4":"Bb4.mp3",
        "Db3":"Db3.mp3","Db4":"Db4.mp3","Eb3":"Eb3.mp3","Eb4":"Eb4.mp3",
        "Gb3":"Gb3.mp3","Gb4":"Gb4.mp3",
      };

      // ── Accompagnement : piano électrique (Rhodes) ────────────────────
      // La guitare échantillonnée sonnait artificielle, et c'est structurel :
      // un accord de guitare est un GESTE (le médiator traverse les cordes,
      // chaque corde a une pression et un étouffement propres). Aucun
      // échantillonnage note à note ne le restitue vraiment.
      //
      // Un clavier, lui, frappe chaque note indépendamment — il n'y a aucun
      // geste à simuler, donc un Rhodes échantillonné sonne juste tout de
      // suite. C'est en plus le son classique de l'accompagnement blues,
      // jazz et funk, et son timbre laisse de la place à la guitare solo au
      // lieu de lui disputer la même bande de fréquences.
      //
      // Source : jRhodes de Jeff Learman, licence CC0 (déclarée dans le
      // fichier d'origine).
      // Piano ACOUSTIQUE, pas électrique.
      // Le Rhodes était une erreur de ma part : c'est un instrument
      // électromécanique, il sonne électronique par nature. Pour un rendu
      // naturel il faut un piano à cordes.
      // Source : Salamander Grand Piano V2, Alexander Holm, licence CC-BY
      // (attribution obligatoire — à créditer dans les mentions de l'app).
      const RHODES_SAMPLES = {
        "C2": "C2.mp3", "Gb2": "Gb2.mp3", "A2": "A2.mp3",
        "Eb3": "Eb3.mp3", "A3": "A3.mp3", "C4": "C4.mp3",
        "Gb4": "Gb4.mp3", "C5": "C5.mp3",
      };

      // Les buffers décodés viennent du cache (chargerEchantillons) : seul
      // le Sampler, léger, est recréé à chaque lancement.
      try {
        const buffers = await chargerEchantillons("piano", RHODES_SAMPLES, "/audio/piano/", 6000);
        if (perime()) { libererAudio(); return; }
        samplerRef.current = new Tone.Sampler({
          urls: urlsDepuisBuffers(buffers, RHODES_SAMPLES),
          release: 1.4,
          // L'accompagnement se tient DERRIÈRE. Il pose l'harmonie et le rythme,
          // il ne doit jamais attirer l'oreille : c'est le guitariste le soliste.
          volume: ambiance.pianoDb,
        });
      } catch {
        if (perime()) { libererAudio(); return; }
        // Repli sur la guitare si le piano n'est pas disponible — en
        // attendant VRAIMENT son chargement : un Sampler pas encore chargé
        // ignore les notes, l'accompagnement restait muet sans erreur.
        try {
          const buffers = await chargerEchantillons("guitare", SAMPLE_URLS_LOCAL, "/audio/guitar/", 8000);
          if (perime()) { libererAudio(); return; }
          samplerRef.current = new Tone.Sampler({
            urls: urlsDepuisBuffers(buffers, SAMPLE_URLS_LOCAL),
            release: 2.0,
            volume: style === "jazz" ? -8 : -10,
          });
        } catch {
          // Ni piano ni guitare : on joue sans accompagnement plutôt que pas du tout.
          samplerRef.current = null;
        }
      }
      if (perime()) { libererAudio(); return; }
      if (samplerRef.current) {
        const pianoPasseHaut = new Tone.Filter({ type: "highpass", frequency: MIXAGE.pianoPasseHaut, rolloff: -12 });
        const pianoPan = new Tone.Panner(MIXAGE.pianoPan);
        mixRef.current.push(pianoPasseHaut, pianoPan);
        samplerRef.current.chain(pianoPasseHaut, pianoPan, masterOut);
      }

      // ── Basse échantillonnée ──────────────────────────────────────────
      // La version précédente était un Tone.Synth en dents de scie : c'est
      // littéralement un synthétiseur soustractif, aucun filtrage ne peut
      // le faire passer pour une basse électrique.
      //
      // Contrairement à la batterie, la basse est TRÈS bien servie par
      // l'échantillonnage : elle est monophonique, son timbre est homogène
      // sur toute la tessiture, et surtout elle est presque toujours
      // enregistrée en direct — donc pas de pièce, pas d'overheads, pas de
      // diaphonie entre micros à recréer. C'est le problème de réalisme le
      // plus facile à résoudre du trio batterie/basse/accompagnement.
      // Notes réellement échantillonnées, tous les 6 demi-tons.
      // Correspondances relevées dans le fichier SFZ d'origine (Killer Bass
      // de Karoryfer, CC0) : les noms de fichiers du pack utilisaient une
      // convention d'octave décalée, ceux-ci sont convertis en notation
      // Tone.js (do central = C4). Tone.Sampler interpole entre ces points.
      const BASS_SAMPLES = {
        "C1": "C1.mp3", "Gb1": "Gb1.mp3",
        "C2": "C2.mp3", "Gb2": "Gb2.mp3",
        "C3": "C3.mp3", "Gb3": "Gb3.mp3",
        "C4": "C4.mp3", "Gb4": "Gb4.mp3",
        "A4": "A4.mp3",
      };

      let bassLoaded = false;
      try {
        // Filet de sécurité (délai de 6 s) : si le chargement ne répond pas,
        // on n'attend pas indéfiniment, on bascule sur le repli.
        const buffers = await chargerEchantillons("basse", BASS_SAMPLES, "/audio/bass/", 6000);
        if (perime()) { libererAudio(); return; }
        bassRef.current = new Tone.Sampler({
          urls: urlsDepuisBuffers(buffers, BASS_SAMPLES),
          release: 0.9,
          volume: -9,
        });
        bassLoaded = true;
      } catch {
        if (perime()) { libererAudio(); return; }
        // Repli : synthé, mais réglé pour être le moins désagréable possible
        // (onde triangulaire plutôt que dents de scie — beaucoup moins de
        // harmoniques agressives, plus proche d'une basse assourdie).
        bassRef.current = new Tone.Synth({
          oscillator: { type: "triangle" },
          envelope: { attack: 0.012, decay: 0.2, sustain: 0.55, release: 0.5 },
          volume: -14,
        });
      }

      // Le filtrage précédent coupait à 280 Hz : bien trop bas. Toute la
      // définition d'une basse — l'attaque du doigt ou du médiator, la
      // corde qui parle — vit entre 700 Hz et 2,5 kHz. Couper à 280 Hz
      // supprimait exactement ce qui la rend reconnaissable, et ne laissait
      // qu'un bourdon sourd.
      const bassFilter = new Tone.Filter({
        frequency: bassLoaded ? 3500 : 900,
        type: "lowpass",
        rolloff: -12,
      });
      const bassComp = new Tone.Compressor({ threshold: -18, ratio: 4, attack: 0.008, release: 0.12 });
      bassFilterRef.current = bassFilter;
      bassCompRef.current = bassComp;
      const basseSub = new Tone.Filter({ type: "highpass", frequency: MIXAGE.bassePasseHaut, rolloff: -12 });
      mixRef.current.push(basseSub);
      bassRef.current.chain(basseSub, bassFilter, bassComp, compRef.current);

      // ── Batterie échantillonnée ───────────────────────────────────
      // Remplace MembraneSynth / NoiseSynth : c'était de la synthèse pure,
      // le dernier instrument artificiel du trio. Une batterie de synthèse
      // sonne comme une boîte à rythmes, pas comme un batteur.
      //
      // Plusieurs échantillons par élément, choisis selon la dynamique ET
      // en évitant de rejouer le même deux fois de suite : sans ça, deux
      // frappes successives sont rigoureusement identiques, ce que l'oreille
      // repère immédiatement comme mécanique.
      const DRUM_FILES = {
        kick:      ["kick1.mp3", "kick2.mp3", "kick3.mp3"],
        snare:     ["snare1.mp3", "snare2.mp3"],
        hihat:     ["hihat1.mp3", "hihat2.mp3", "hihat3.mp3"],
        hihatOpen: ["hihatOpen1.mp3", "hihatOpen2.mp3"],
        ride:      ["ride1.mp3", "ride2.mp3"],
        crash:     ["crash1.mp3", "crash2.mp3"],
        tomLow:    ["tomLow1.mp3"],
        tomMid:    ["tomMid1.mp3"],
      };

      if (perime()) { libererAudio(); return; }
      const drumUrls = {};
      for (const [inst, files] of Object.entries(DRUM_FILES)) {
        files.forEach((f, i) => { drumUrls[`${inst}${i}`] = f; });
      }

      let drumsLoaded = false;
      let drumBuffers = null;
      try {
        drumBuffers = await chargerEchantillons("batterie", drumUrls, "/audio/drums/", 8000);
        drumsLoaded = true;
      } catch {
        drumsRef.current = null;
      }
      if (perime()) { libererAudio(); return; }
      if (drumsLoaded) {
        // Bus de la batterie : compresseur master + envoi de réverbération.
        const busBatterie = new Tone.Gain(1).connect(compRef.current);
        mixRef.current.push(busBatterie);
        // Mixage HORS du chargement : un souci de mixage ne doit jamais faire
        // basculer la vraie batterie sur le synthé de secours. Au pire, elle
        // reste simplement sèche et centrée.
        try {
          const envoiBatterie = new Tone.Gain(MIXAGE.batterieReverb);
          busBatterie.connect(envoiBatterie);
          envoiBatterie.connect(reverbRef.current);
          mixRef.current.push(envoiBatterie);
        } catch { /* batterie sans réverbération */ }
        // Charlestons (fermée et ouverte) : panoramique propre, sans envoi
        // de réverbération — comme avant.
        let panCharleston = null;
        try {
          panCharleston = new Tone.Panner(MIXAGE.charlestonPan).connect(compRef.current);
          mixRef.current.push(panCharleston);
        } catch { panCharleston = null; /* le charleston reste au centre */ }
        drumsRef.current = creerKitBatterie(drumBuffers, busBatterie, panCharleston);
      }
      drumsLoadedRef.current = drumsLoaded;

      // Repli synthétique, uniquement si les échantillons sont absents.
      if (!drumsLoaded) {
        kickRef.current = new Tone.MembraneSynth({
          pitchDecay: 0.08, octaves: 6,
          envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.1 },
          volume: -8,
        });
        const kickComp = new Tone.Compressor({ threshold: -12, ratio: 8 });
        kickCompRef.current = kickComp;
        kickRef.current.chain(kickComp, compRef.current);

        snareRef.current = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
          volume: -18,
        });
        const snareFilter = new Tone.Filter({ frequency: 1800, type: "highpass" });
        snareFilterRef.current = snareFilter;
        snareRef.current.chain(snareFilter, reverbRef.current);

        hihatRef.current = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
          volume: -26,
        }).connect(compRef.current);
      }

      // ── Séquenceur principal (accords + basse) ────────────────────────
      const pack       = packPourStyle(style, PACKS);
      // Basse et accompagnement DU PACK : walking bass pour le jazz, croches
      // rock, fondamentale-quinte de bossa, rondes de ballade ; comping
      // Charleston, croches étouffées, batida, arpèges…
      const bassStyle  = bassStylePour(pack, style);
      const compStyle  = compStylePour(pack, style);
      // Un contexte peut imposer sa disposition (mixolydien : accords
      // pleins, pas de power chords qui effaceraient la b7).
      const disposition = { voicing: context.compVoicing || compStyle.voicing, floor: compStyle.floor };
      if (pack) {
        plannerRef.current  = createPlanner({ baseEnergy: energieRef.current });
        directorRef.current = createDirector(pack);
      }
      const progression = context.chords;
      let barMap = [];
      for (const chord of progression) {
        for (let b = 0; b < chord.bars; b++) barMap.push(chord);
      }
      const totalBars = barMap.length;

      // Accompagnateur avec mémoire : sans elle, le tirage aléatoire
      // répéterait le même motif plusieurs mesures de suite.
      comperRef.current = createComper(compStyle.rhythm);

      seqRef.current = new Tone.Sequence((time, barIdx) => {
        const chord     = barMap[barIdx % totalBars];
        const rootNow   = rootRef.current;
        const chordRoot = transposeNote(rootNow, chord.degree);
        const voiced    = getVoicedChord(chordRoot, chord.quality, style, disposition);
        // L'accord SUIVANT est indispensable : c'est lui qui détermine la
        // note d'approche du 4e temps, le geste qui fait qu'une walking bass
        // avance au lieu de tourner en rond.
        const nextChord = barMap[(barIdx + 1) % totalBars];
        const nextRoot  = transposeNote(rootNow, nextChord.degree);
        mesureRef.current = barIdx;
        // Intensité : celle du plan (qui ajoute les respirations d'une vraie
        // forme — intro, montée, relâche) quand un pack existe, sinon celle
        // choisie par la personne.
        let section = null;
        if (pack && plannerRef.current) {
          plannerRef.current.ensurePlannedUpTo(barIdx + 24);
          section = plannerRef.current.sectionAt(barIdx);
        }
        const energieMesure = section?.energy ?? energieRef.current;
        const coupe = coupesRef.current;
        const bassPattern = getBassPattern(chordRoot, chord.quality, style, nextRoot, barIdx, energieMesure, bassStyle);

        // ── Accompagnement rythmé ──────────────────────────────────
        // Avant : un seul accord tenu sur la mesure entière ("1m"). C'est
        // ce qui restait de plus "amateur" — un accompagnateur ne tient
        // pas un accord quatre temps durant, il place des accents et il
        // laisse du silence. C'est aussi ce qui rend un playback jouable :
        // le soliste a besoin de repères rythmiques.
        const compHits = coupe.accords ? [] : (comperRef.current?.nextBar(barIdx, energieMesure) || []);
        // L'anticipation joue l'accord de la mesure SUIVANTE une croche
        // avant : le geste le plus caractéristique du comping.
        const nextVoiced = getVoicedChord(nextRoot, nextChord.quality, style, disposition);
        // Même swing que la batterie (src/jam/music/groove.js) : sans lui,
        // le Transport étant à swing 0 avec un pack, les croches faibles de
        // l'accompagnement et de la basse tombaient droites pendant que la
        // charleston swinguait — un « flam » audible sur chaque contretemps.
        const bpmMesure = Tone.getTransport().bpm.value;
        const secParTemps = 60 / bpmMesure;
        const sw = pack ? companionSwing(pack, bpmMesure) : { ratio: 0.5, stepsPerBeat: 2 };
        const instant = (beatPos) => time + swingBeat(beatPos, sw.ratio, sw.stepsPerBeat) * secParTemps;
        for (const hit of compHits) {
          const humanize = (Math.random() - 0.5) * 0.008;
          const accordJoue = hit.anticipate ? nextVoiced : voiced;
          if (!accordJoue.length) continue;
          // Arpège : une seule note du voicing (indice `voice`, grave → aigu).
          const notes = hit.voice != null ? [accordJoue[hit.voice % accordJoue.length]] : accordJoue;
          const t0 = instant(hit.beat) + humanize;
          if (compStyle.strumMs > 0 && notes.length > 1) {
            // Accord gratté (rock) : les notes s'égrènent du grave à l'aigu.
            notes.forEach((n, i) => samplerRef.current?.triggerAttackRelease(
              n, hit.dur, t0 + i * compStyle.strumMs / 1000, hit.velocity * (1 - i * 0.04)
            ));
          } else {
            samplerRef.current?.triggerAttackRelease(notes, hit.dur, t0, hit.velocity);
          }
        }

        // Basse walking — la dynamique compte autant que les notes : une
        // fondamentale s'appuie, une note d'approche reste discrète, une
        // ghost note est presque inaudible. Sans ça, toutes les notes
        // sortent au même niveau et la ligne redevient mécanique.
        if (!coupe.basse) bassPattern.forEach(({ note, beat: b, dur, velocity }) => {
          bassRef.current?.triggerAttackRelease(
            note, dur,
            instant(b),
            velocity ?? 0.8
          );
        });

        // ── Batterie vivante (src/jam), uniquement si un pack existe ──
        // Remplace le motif statique : forme longue (planner) + décision
        // de phrase (director) + grille → évènements (generateDrumBar),
        // rejoués par la MÊME fonction playDrum() qu'avant — mêmes
        // échantillons, même round-robin, seule la source des évènements
        // change. Le temps renvoyé par generateDrumBar est déjà une valeur
        // absolue compatible avec `time` (le même repère que Tone.js utilise
        // ici), donc aucune conversion n'est nécessaire.
        if (pack && section && directorRef.current && !coupe.batterie) {
          const decision = directorRef.current.decideBar(barIdx, section, section.energy);
          const bpmNow = Tone.getTransport().bpm.value;
          const events = generateDrumBar(pack, decision, {
            barStartTime: time,
            secPerBeat: 60 / bpmNow,
            beatsPerBar: 4,
            bpm: bpmNow,
            energy: section.energy,
          });
          for (const ev of events) playDrum(ev.instrument, ev.time, ev.velocity);
        }

        // Montée de tempo progressive : +5 BPM toutes les deux grilles,
        // appliquée pile au début de la mesure.
        if (rampeRef.current && barIdx > 0 && barIdx % (totalBars * 2) === 0) {
          const nb = Math.min(BPM_MAX, Math.round(Tone.getTransport().bpm.value) + 5);
          Tone.getTransport().bpm.setValueAtTime(nb, time);
          Tone.getDraw().schedule(() => onBpmRef.current?.(nb), time);
        }

        Tone.getDraw().schedule(() => {
          // Affichage déjà programmé par une lecture qu'on vient de remplacer
          // (changement de grille, de style) : il porterait l'index de
          // l'ANCIENNE grille.
          if (perime()) return;
          setBeat(barIdx % totalBars);
          const chordIdx = progression.reduce((acc, c, i) => {
            const start = progression.slice(0, i).reduce((s, x) => s + x.bars, 0);
            return (barIdx % totalBars) >= start ? i : acc;
          }, 0);
          setCurrentChord(chordIdx);
          onChordRef.current?.(chordIdx);
        }, time);

      }, Array.from({ length: totalBars }, (_, i) => i), "1m");

      // ── Séquenceur batterie — SEULEMENT si aucun pack n'existe pour ce
      // style (repli : tous les styles actuels ont un pack). Sinon la
      // batterie est déjà générée ci-dessus, bar par bar, dans la boucle
      // principale.
      let beatPart = null;
      if (!pack) {
        const drumPattern = getDrumPattern(style);
        beatPart = new Tone.Part((time, event) => {
          if (coupesRef.current.batterie) return;
          playDrum(event.type, time, event.velocity ?? 0.8);
        }, [
          ...drumPattern.kick.map(t  => ({ time: t, type: "kick"  })),
          ...drumPattern.snare.map(t => ({ time: t, type: "snare" })),
          ...drumPattern.hihat.map(t => ({ time: t, type: "hihat" })),
        ]);
        beatPart.loop = true;
        beatPart.loopEnd = "1m";
        beatSeqRef.current = beatPart;

        // Shuffle pour blues — uniquement pertinent pour l'ancien système :
        // le nouveau applique déjà son propre swing (pack.feel.swing),
        // directement sur le temps de chaque frappe. Appliquer le swing du
        // Transport EN PLUS aurait doublé l'effet.
        if (drumPattern.shuffle) {
          Tone.getTransport().swing     = 0.5;
          Tone.getTransport().swingSubdivision = "8n";
        } else {
          Tone.getTransport().swing = 0;
        }
      } else {
        Tone.getTransport().swing = 0;
      }

      // Décompte : 4 clics sur la première mesure, affichés en grand, puis
      // tout entre ensemble sur le 1. Sans lui, on devait rentrer « au vol ».
      const transport = Tone.getTransport();
      for (let i = 0; i < 4; i++) {
        transport.schedule((t) => {
          playDrum("hihat", t, i === 0 ? 0.95 : 0.7);
          Tone.getDraw().schedule(() => setCompte(i + 1), t);
        }, `0:${i}:0`);
      }
      transport.schedule((t) => Tone.getDraw().schedule(() => setCompte(null), t), "1m");
      seqRef.current.start("1m");
      if (beatPart) beatPart.start("1m");
      // Le décompte est en cours DÈS le lancement : sans ça, le temps de
      // jeu (qui ne tourne que hors décompte) partait avant le premier clic.
      setCompte(1);
      transport.start();
      setPlaying(true);

    } catch (e) {
      if (perime()) { libererAudio(); return; }
      console.warn("[BackingTrackPlayer] Erreur:", e);
      setPlayError(e?.message || "Le lecteur n'a pas pu démarrer.");
    }
    if (!perime()) setLoading(false);
  }

  // ── Arrêt propre ────────────────────────────────────────────────────────
  function stopBacking() {
    generationRef.current++;   // tout lancement en cours devient périmé
    libererAudio();
    setPlaying(false);
    setCompte(null);
    setBeat(0);
    setCurrentChord(0);
    onChordRef.current?.(null);
  }

  // Libère tous les éléments audio. Sans effet d'affichage : un lancement
  // périmé l'appelle aussi, alors qu'un autre lancement peut être en cours.
  function libererAudio() {
    [seqRef, beatSeqRef].forEach(r => {
      try { r.current?.stop(); r.current?.dispose(); r.current = null; } catch { /* déjà arrêté ou libéré */ }
    });
    [samplerRef, bassRef, kickRef, snareRef, hihatRef, drumsRef, reverbRef, delayRef, compRef,
     bassFilterRef, bassCompRef, kickCompRef, snareFilterRef].forEach(r => {
      try { r.current?.releaseAll?.(); r.current?.dispose(); r.current = null; } catch { /* déjà libéré */ }
    });
    for (const n of mixRef.current) { try { n.dispose(); } catch { /* déjà libéré */ } }
    mixRef.current = [];
    try { Tone.getTransport().stop(); Tone.getTransport().cancel(); } catch { /* transport déjà arrêté */ }
    plannerRef.current = null;
    directorRef.current = null;
  }

  const toggle = () => playing ? stopBacking() : startBacking();

  const progression = context.chords;
  const totalBars   = progression.reduce((s, c) => s + c.bars, 0);

  // ── Mode scène ──────────────────────────────────────────────────────────
  // On joue guitare en main, téléphone posé à un mètre : l'accord en cours
  // doit se lire de loin (grand), l'accord suivant doit s'anticiper, et les
  // mesures restantes dans l'accord doivent se voir d'un coup d'œil.
  // Ramené dans la grille : en changeant de grille pendant la lecture, l'index
  // de l'ancienne (plus longue) restait affiché un instant et pointait hors de
  // la nouvelle → accord indéfini → l'écran plantait (« reading 'degree' »).
  const idx       = playing && currentChord < progression.length ? currentChord : 0;
  const accord    = progression[idx];
  const suivant   = progression[(idx + 1) % progression.length];
  const debutAcc  = progression.slice(0, idx).reduce((s, c) => s + c.bars, 0);
  const mesureDansAccord = playing && compte == null ? beat - debutAcc : -1;
  const changerTempo = (d) => onBpmChange?.(Math.max(BPM_MIN, Math.min(BPM_MAX, bpm + d)));
  const changerEnergie = (d) => {
    const n = Math.max(1, Math.min(5, energie + d));
    if (n === energie) return;
    setEnergie(n);
    // Le plan à venir est recalculé : l'effet s'entend dans les 2 mesures.
    plannerRef.current?.nudgeEnergy(n - energie, mesureRef.current);
  };
  const LIBELLE_ENERGIE = ["", "Très calme", "Calme", "Normal", "Soutenu", "Intense"];
  const carre = { width: 40, height: 40, borderRadius: R.sm, border: `1.5px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.text2, fontWeight: 800, fontSize: 16, fontFamily: FONTS.ui, padding: 0 };

  return (
    <div style={{
      background: C.surface,
      border: `1.5px solid ${playing ? context.color : C.border}`,
      borderRadius: R.lg, padding: "14px 14px 12px",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxShadow: playing ? `0 0 20px ${context.color}22` : "none",
    }}>

      {/* Accord en cours (grand) + accord suivant + bouton lecture */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }} aria-live="polite">
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {compte != null ? "Prépare-toi" : playing ? "Maintenant" : "Premier accord"}
          </div>
          <div style={{ fontSize: compte != null ? 46 : 40, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1px", fontFamily: FONTS.title, color: playing ? context.colorD : C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {compte != null ? `${compte}…` : nomAccord(root, accord, context.scale)}
          </div>
          {/* Une pastille par mesure de l'accord en cours : on voit combien il en reste */}
          <div aria-hidden="true" style={{ display: "flex", gap: 4, marginTop: 6, height: 6 }}>
            {Array.from({ length: accord.bars }, (_, b) => (
              <div key={b} style={{ width: 18, height: 6, borderRadius: 3, background: b <= mesureDansAccord ? context.color : C.border, transition: "background .08s" }} />
            ))}
          </div>
          <div style={{ fontSize: 13, color: C.text2, fontFamily: FONTS.ui, marginTop: 7 }}>
            Ensuite : <b style={{ color: C.text }}>{nomAccord(root, suivant, context.scale)}</b>
          </div>
        </div>

        <button onClick={toggle} disabled={loading} className="gr-focus"
          aria-label={loading ? "Chargement des sons" : playing ? "Arrêter le backing track" : "Lancer le backing track"}
          style={{
            width: 64, height: 64, borderRadius: "50%", border: "none", flexShrink: 0,
            background: loading ? C.surface2 : playing
              ? `linear-gradient(135deg, ${context.color}, ${shade(context.color, -45)})`
              : `linear-gradient(135deg, ${C.primary}, ${shade(C.primary, -45)})`,
            cursor: loading ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: loading ? "none" : `0 4px 16px ${(playing ? context.color : C.primary)}55`,
            transition: "background 0.2s, box-shadow 0.2s",
          }}>
          {loading
            ? <Ti name="loader" size={24} color={C.text3} />
            : <Ti name={playing ? "player-pause" : "player-play"} size={26} color={C.onPrimaryBtn} />}
        </button>
      </div>

      {playError && (
        <div role="alert" style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 10,
          padding: "9px 12px", borderRadius: R.md,
          background: C.coralL, border: `1px solid ${C.coral}`,
        }}>
          <Ti name="alert-circle" size={15} color={C.coralD} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.coralD, fontFamily: FONTS.ui, lineHeight: 1.4, flex: 1 }}>
            {playError}
          </span>
          <button onClick={startBacking} className="gr-focus" style={{
            background: "none", border: "none", color: C.coralD, fontWeight: 700, padding: "6px 4px",
            fontSize: 12, fontFamily: FONTS.ui, cursor: "pointer", flexShrink: 0, textDecoration: "underline",
          }}>
            {interrompu ? "Reprendre" : "Réessayer"}
          </button>
        </div>
      )}

      {/* La grille complète, l'accord en cours mis en avant */}
      <div style={{ display: "flex", gap: 3, margin: "14px 0 8px" }} aria-hidden="true">
        {Array.from({ length: totalBars }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 3,
            background: playing && compte == null && i === beat ? context.color
              : playing && compte == null && i < beat ? `${context.color}44` : C.border,
            transition: "background 0.08s",
          }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {progression.map((chord, i) => {
          const isActive = playing && compte == null && i === currentChord;
          return (
            <div key={i} style={{
              padding: "5px 11px", borderRadius: R.pill,
              background: isActive ? context.colorL : C.bg,
              border: `1.5px solid ${isActive ? context.color : C.border}`,
              fontSize: 12.5, fontWeight: isActive ? 800 : 500,
              color: isActive ? context.colorD : C.text2,
              fontFamily: FONTS.ui, transition: "background 0.12s, border-color 0.12s",
            }}>
              {nomAccord(root, chord, context.scale)}
              <span style={{ fontSize: 11, color: isActive ? context.color : C.text3, marginLeft: 4 }}>
                ×{chord.bars}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tempo : réglable, y compris en jouant, et montée progressive */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <div role="group" aria-label="Tempo" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => changerTempo(-5)} aria-label="Ralentir de 5" className="gr-focus" style={carre}>−</button>
          <div style={{ minWidth: 52, textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1, fontFamily: FONTS.ui }}>{bpm}</div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 2, fontFamily: FONTS.ui }}>BPM</div>
          </div>
          <button onClick={() => changerTempo(5)} aria-label="Accélérer de 5" className="gr-focus" style={carre}>+</button>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setRampe(r => !r)} aria-pressed={rampe} className="gr-focus" style={{
          height: 40, padding: "0 12px", borderRadius: R.sm, cursor: "pointer", fontFamily: FONTS.ui,
          border: `1.5px solid ${rampe ? context.color : C.border}`,
          background: rampe ? context.colorL : C.surface,
          color: rampe ? context.colorD : C.text2, fontWeight: 700, fontSize: 12, textAlign: "left", lineHeight: 1.2,
        }}>
          Accélération
          <div style={{ fontSize: 11, fontWeight: 600, color: rampe ? context.colorD : C.text3 }}>+5 toutes les 2 grilles</div>
        </button>
      </div>

      {/* Réglages du groupe : repliés par défaut, pour garder la scène lisible */}
      <button onClick={() => setReglagesOuverts(o => !o)} aria-expanded={reglagesOuverts} className="gr-focus" style={{
        display: "flex", alignItems: "center", gap: 6, width: "100%", marginTop: 10, padding: "8px 2px",
        background: "none", border: "none", cursor: "pointer", fontFamily: FONTS.ui,
        fontSize: 12, fontWeight: 700, color: C.text2, textAlign: "left",
      }}>
        <span aria-hidden="true" style={{ display: "inline-block", transform: reglagesOuverts ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
        Régler le groupe
        <span style={{ fontWeight: 500, color: C.text3 }}>
          · {LIBELLE_ENERGIE[energie].toLowerCase()}{Object.values(coupes).some(Boolean) ? ` · sans ${Object.entries(coupes).filter(([, v]) => v).map(([k]) => k).join(", ")}` : ""}
        </span>
      </button>
      {reglagesOuverts && (
        <div style={{ paddingTop: 4 }}>
          <div role="group" aria-label="Intensité du groupe" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui, width: 64 }}>Intensité</span>
            <button onClick={() => changerEnergie(-1)} aria-label="Plus calme" disabled={energie === 1} className="gr-focus" style={{ ...carre, opacity: energie === 1 ? .4 : 1 }}>−</button>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div aria-hidden="true" style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map(n => <span key={n} style={{ width: 16, height: 8, borderRadius: 4, background: n <= energie ? context.color : C.border }} />)}
              </div>
              <div style={{ fontSize: 11, color: C.text2, marginTop: 3, fontFamily: FONTS.ui }}>{LIBELLE_ENERGIE[energie]}</div>
            </div>
            <button onClick={() => changerEnergie(1)} aria-label="Plus intense" disabled={energie === 5} className="gr-focus" style={{ ...carre, opacity: energie === 5 ? .4 : 1 }}>+</button>
          </div>
          <div role="group" aria-label="Instruments" style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {[["accords", "Accords"], ["basse", "Basse"], ["batterie", "Batterie"]].map(([k, label]) => (
              <button key={k} onClick={() => setCoupes(c => ({ ...c, [k]: !c[k] }))} aria-pressed={!coupes[k]} className="gr-focus" style={{
                flex: 1, height: 40, borderRadius: R.sm, cursor: "pointer", fontFamily: FONTS.ui, fontSize: 12, fontWeight: 700,
                border: `1.5px ${coupes[k] ? "dashed" : "solid"} ${coupes[k] ? C.border : context.color}`,
                background: coupes[k] ? C.surface : context.colorL,
                color: coupes[k] ? C.text3 : context.colorD, textDecoration: coupes[k] ? "line-through" : "none",
              }}>{label}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: C.text3, marginTop: 6, fontFamily: FONTS.ui }}>
            Coupe la basse pour faire entendre l'harmonie toi-même.
          </div>
        </div>
      )}

    </div>
  );
}

/** Rangée de pastilles à choix unique (grille, gamme, tonalité d'un style). */
function ChoixPastilles({ C, ctx, titre, options, valeur, onChoix }) {
  return (
    <div role="group" aria-label={titre} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.06em", minWidth: 62 }}>{titre}</span>
      {options.map(o => {
        const actif = o.id === valeur;
        return (
          <button key={o.id} onClick={() => onChoix(o.id)} aria-pressed={actif} className="gr-focus" style={{
            minHeight: 32, padding: "5px 10px", borderRadius: R.pill, cursor: "pointer", fontFamily: FONTS.ui,
            fontSize: 12, fontWeight: actif ? 700 : 500,
            border: `1.5px solid ${actif ? ctx.color : ctx.colorB}`,
            background: actif ? C.surface : "transparent",
            color: actif ? ctx.colorD : C.text2,
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────
export function JamSession({ onBack, dispatch, state }) {
  const C = useC();
  // Les couleurs des contextes ne dépendent que du thème : même objet `ctx`
  // d'un rendu à l'autre tant que le thème ne change pas.
  const CONTEXTS = useMemo(() => makeContexts(C), [C]);
  const [contextId, setContextId] = useState("blues_minor");
  const [root, setRoot]           = useState("A");
  const [displayMode, setDisplayMode] = useState("notes");
  const [showRootPicker, setShowRootPicker] = useState(false);
  const [bpm, setBpm] = useState(CONTEXTS[0].bpm);
  const [accordIdx, setAccordIdx] = useState(null);   // accord en cours de lecture (null = arrêt)
  const [enLecture, setEnLecture] = useState(false);

  // Temps de jeu réel : compteur hors état React (voir jam/chrono.js). Cet
  // écran ne se re-rend plus chaque seconde ; seuls SuiviSeance et
  // CarteContrainte, abonnés, le font.
  const [chrono] = useState(creerChrono);

  // ── La pratique compte ──────────────────────────────────────────────────
  // 3 minutes de jeu réel (décompte exclu) comptent comme une séance de
  // pratique libre : mêmes actions que l'écran Pratique (PRACTICE_DONE,
  // MARK_STREAK, UPDATE_WEEKLY). L'XP reste soumise au plafond quotidien du
  // reducer : on affiche donc ce qui a VRAIMENT été crédité, pas un chiffre
  // promis. Une séance au plus par visite de l'écran.
  const [sessionComptee, setSessionComptee] = useState(null);   // null | { xp } — xp null = en attente du reducer
  const sessionCompteeRef = useRef(false);
  // Appelé par le lecteur à chaque seconde jouée (hors rendu) : le seuil est
  // vérifié ici, au lieu d'un effet qui dépendait d'un état mis à jour chaque seconde.
  const unSecondeDePlus = () => {
    chrono.tic();
    const secondes = chrono.lire();
    if (sessionCompteeRef.current || secondes < SEUIL_SESSION || !dispatch) return;
    sessionCompteeRef.current = true;
    setSessionComptee({ xp: null });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
    dispatch({ type: "JAM_PROGRES", seance: true });
    // En dernier : lastGain décrit la dernière action traitée.
    dispatch({ type: "PRACTICE_DONE", minutes: Math.round(secondes / 60) });
  };
  // XP réellement créditée : lue sur le premier `lastGain` de pratique qui
  // suit le comptage. Ajustement pendant le rendu (motif React « état
  // dérivé d'une prop qui change ») plutôt qu'un setState dans un effet.
  const [gainVu, setGainVu] = useState(state?.lastGain);
  if (state?.lastGain !== gainVu) {
    setGainVu(state?.lastGain);
    if (sessionComptee?.xp === null && state?.lastGain?.kind === "practice") {
      setSessionComptee({ xp: state.lastGain.xp || 0 });
    }
  }

  // Temps de jeu total (badges « heures de jam »). Accumulé localement, et
  // enregistré quand la lecture s'arrête, quand on quitte l'écran ou quand
  // l'app passe en arrière-plan — pas une écriture de sauvegarde par seconde.
  // `dispatch` est stable (useCallback dans App) : l'effet ne se réabonne pas.
  const dejaEnregistreRef = useRef(0);
  const enregistrerTemps = useCallback(() => {
    const total = chrono.lire();
    const delta = total - dejaEnregistreRef.current;
    if (delta <= 0 || !dispatch) return;
    dejaEnregistreRef.current = total;
    dispatch({ type: "JAM_PROGRES", secondes: delta });
  }, [chrono, dispatch]);
  useEffect(() => {
    const auMasquage = () => { if (document.visibilityState === "hidden") enregistrerTemps(); };
    document.addEventListener("visibilitychange", auMasquage);
    return () => { document.removeEventListener("visibilitychange", auMasquage); enregistrerTemps(); };
  }, [enregistrerTemps]);
  const surLecture = (joue) => { setEnLecture(joue); if (!joue) enregistrerTemps(); };

  // Grille et gamme choisies pour les styles qui en proposent plusieurs
  // (null = celles par défaut du style).
  const [grilleId, setGrilleId] = useState(null);
  const [gammeChoisie, setGammeChoisie] = useState(null);
  const ctxBase = CONTEXTS.find(c => c.id === contextId);
  const ctx    = useMemo(() => appliquerChoix(ctxBase, grilleId, gammeChoisie), [ctxBase, grilleId, gammeChoisie]);
  const packDuStyle = packPourStyle(getStyle(ctx.id), PACKS);
  // Tonique et gamme orthographiées pour l'affichage (Sib, pas La#) ; les
  // notes internes (dièses) restent celles qu'on compare et qu'on joue.
  const rootFr = nomTonique(root, ctx.scale);
  const activeNotes = useMemo(() => getScaleNotes(root, ctx.scale), [root, ctx.scale]);
  const nomsActifs = useMemo(() => nomsGamme(root, ctx.scale), [root, ctx.scale]);

  // ── Le manche suit les accords ──────────────────────────────────────────
  // Pendant la lecture, les notes de l'accord en cours s'allument sur la
  // gamme : c'est la compétence « jouer les changements » (leçon impro-04),
  // pratiquée au lieu d'être seulement décrite. Le manche n'allume que les
  // notes présentes dans la gamme affichée ; celles qui en sortent (la
  // tierce majeure du IV7 sur un blues, par exemple) sont signalées à part,
  // parce que c'est justement là que se joue le changement.
  // Même garde : l'index peut venir de la grille précédente.
  const accordEnCours = accordIdx != null ? (ctx.chords[accordIdx] ?? null) : null;
  const notesAccordAffichees = useMemo(
    () => (accordEnCours ? nomsNotesAccord(root, accordEnCours, ctx.scale) : []),
    [accordEnCours, root, ctx.scale]
  );
  const notesDeLAccord = useMemo(() => notesAccordAffichees.map(x => x.note), [notesAccordAffichees]);
  const dansLaGamme = (n) => activeNotes.some(g => normalizeNote(g) === normalizeNote(n));
  const choisirContexte = (c) => { setContextId(c.id); setBpm(c.bpm); setGrilleId(null); setGammeChoisie(null); };
  // Une grille peut proposer sa gamme (vi–IV–I–V → penta majeure) : on
  // reprend alors celle-ci plutôt qu'un choix fait sur la grille précédente.
  const choisirGrille = (g) => { setGrilleId(g.id); setGammeChoisie(null); };

  const transposeSemitone = (dir) => {
    const idx = CHROMATIC.indexOf(root);
    setRoot(CHROMATIC[(idx + dir + 12) % 12]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* Header */}
      <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <BackButton onClick={onBack} label="Retour aux outils" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>Jam Session</div>
          <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{rootFr} - {ctx.label}</div>
        </div>
        <Gropi pose="rocker" size={46} anim="wiggle" />
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingBottom: 32 }}>

        {/* Selecteur contexte */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {CONTEXTS.map(c => (
              <button key={c.id} onClick={() => choisirContexte(c)} aria-pressed={contextId === c.id} className="gr-focus" style={{
                flexShrink: 0, padding: "10px 14px", borderRadius: R.pill,
                border: `1.5px solid ${contextId === c.id ? c.color : C.border}`,
                background: contextId === c.id ? c.colorL : C.surface,
                color: contextId === c.id ? c.colorD : C.text2,
                fontSize: 12, fontWeight: contextId === c.id ? 600 : 400,
                cursor: "pointer", fontFamily: FONTS.ui, whiteSpace: "nowrap",
              }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description + fiche du style : tempo conseillé, feel, grilles,
            gammes et tonalités proposées */}
        <div style={{ background: ctx.colorL, border: `1px solid ${ctx.colorB}`, borderRadius: R.lg, padding: "10px 14px" }}>
          <div style={{ fontSize: 12, color: ctx.colorD, fontFamily: FONTS.title, lineHeight: 1.5 }}>{ctx.desc}</div>
          {packDuStyle && (
            <div style={{ fontSize: 11, color: ctx.colorD, fontFamily: FONTS.ui, marginTop: 6, opacity: 0.85 }}>
              {feelLabel(packDuStyle)} · tempo conseillé {packDuStyle.tempoRange[0]}–{packDuStyle.tempoRange[1]} BPM
            </div>
          )}
          {ctxBase.grilles?.length > 1 && (
            <ChoixPastilles C={C} ctx={ctx} titre="Grille" valeur={ctx.grilleId}
              options={ctxBase.grilles.map(g => ({ id: g.id, label: g.label }))}
              onChoix={(id) => choisirGrille(ctxBase.grilles.find(g => g.id === id))} />
          )}
          {ctxBase.gammes?.length > 1 && (
            <ChoixPastilles C={C} ctx={ctx} titre="Gamme" valeur={ctx.scale}
              options={[...new Set([...ctxBase.gammes, ctx.scale])].map(k => ({ id: k, label: SCALES[k]?.name ?? k }))}
              onChoix={setGammeChoisie} />
          )}
          {ctxBase.tonalites?.length > 0 && (
            <ChoixPastilles C={C} ctx={ctx} titre="Tonalité" valeur={root}
              options={ctxBase.tonalites.map(t => ({ id: t, label: nomTonique(t, ctx.scale) }))}
              onChoix={setRoot} />
          )}
        </div>

        {/* Backing track player */}
        <BackingTrackPlayer context={ctx} root={root} bpm={bpm} onBpmChange={setBpm} onChord={setAccordIdx} onSecondeJouee={unSecondeDePlus} onLecture={surLecture} />

        {/* Séance de pratique : on voit ce qu'il reste pour qu'elle compte */}
        <SuiviSeance chrono={chrono} sessionComptee={sessionComptee} couleur={ctx.color} />

        {/* Tonique */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }}>Tonique</div>
          <button onClick={() => transposeSemitone(-1)} aria-label="Un demi-ton plus bas" className="gr-focus" style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-left" size={16} color={C.text2} />
          </button>
          <button onClick={() => setShowRootPicker(!showRootPicker)} aria-expanded={showRootPicker} aria-label={`Tonique : ${rootFr}. Choisir une autre tonique`} className="gr-focus" style={{ flex: 1, height: 40, borderRadius: 10, border: `1.5px solid ${ctx.color}`, background: ctx.colorL, cursor: "pointer", fontSize: 16, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui }}>
            {rootFr}
          </button>
          <button onClick={() => transposeSemitone(1)} aria-label="Un demi-ton plus haut" className="gr-focus" style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-right" size={16} color={C.text2} />
          </button>
        </div>

        {/* Picker tonique */}
        {showRootPicker && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 10 }}>
            {ROOTS_FR.map(r => (
              <button key={r.en} onClick={() => { setRoot(r.en); setShowRootPicker(false); }} aria-pressed={root === r.en} className="gr-focus" style={{
                minHeight: 40, padding: "8px 4px", borderRadius: 8,
                border: `1px solid ${root === r.en ? ctx.color : C.border}`,
                background: root === r.en ? ctx.colorL : C.bg,
                color: root === r.en ? ctx.colorD : C.text,
                fontSize: 12, fontWeight: root === r.en ? 700 : 400,
                cursor: "pointer", fontFamily: FONTS.ui,
              }}>{nomTonique(r.en, ctx.scale)}</button>
            ))}
          </div>
        )}

        {/* Affichage manche */}
        <div style={{ display: "flex", gap: 6 }}>
          {[{ key: "notes", label: "Notes" }, { key: "intervals", label: "Intervalles" }, { key: "degrees", label: "Degrés" }].map(m => (
            <button key={m.key} onClick={() => setDisplayMode(m.key)} aria-pressed={displayMode === m.key} className="gr-focus" style={{
              flex: 1, minHeight: 40, padding: "7px 0", borderRadius: 8,
              border: `1px solid ${displayMode === m.key ? ctx.color : C.border}`,
              background: displayMode === m.key ? ctx.colorL : C.surface,
              color: displayMode === m.key ? ctx.colorD : C.text3,
              fontSize: 11, fontWeight: displayMode === m.key ? 600 : 400,
              cursor: "pointer", fontFamily: FONTS.ui,
            }}>{m.label}</button>
          ))}
        </div>

        {/* Manche */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: "hidden" }}>
          <div style={{ padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Fretboard mode="scale" root={root} scale={ctx.scale} displayMode={displayMode} lang="fr" compact={true}
              flashNotes={notesDeLAccord.length ? notesDeLAccord : null} />
          </div>
          <div style={{ padding: "8px 12px 10px", borderTop: `1px solid ${C.border}`, minHeight: 44, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }} aria-live="polite">
            {accordEnCours ? (
              <>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, marginRight: 2 }}>
                  Notes de {nomAccord(root, accordEnCours, ctx.scale)} :
                </span>
                {notesAccordAffichees.map(({ note: n, nom }) => {
                  const dedans = dansLaGamme(n);
                  return (
                    <span key={n} title={dedans ? "Dans ta gamme" : "Hors de ta gamme : c'est la note qui fait entendre le changement"} style={{
                      padding: "3px 8px", borderRadius: R.pill, fontSize: 12, fontWeight: 800, fontFamily: FONTS.ui,
                      background: dedans ? ctx.colorL : C.surface,
                      border: `1.5px ${dedans ? "solid" : "dashed"} ${dedans ? ctx.color : C.text3}`,
                      color: dedans ? ctx.colorD : C.text,
                    }}>{nom}{dedans ? "" : " *"}</span>
                  );
                })}
                {notesDeLAccord.some(n => !dansLaGamme(n)) && (
                  <span style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, width: "100%" }}>
                    * hors de ta gamme : c'est elle qui fait entendre le changement d'accord.
                  </span>
                )}
              </>
            ) : (
              <span style={{ fontSize: 12, color: C.text3, fontFamily: FONTS.ui }}>
                Lance le backing : les notes de chaque accord s'allumeront sur le manche.
              </span>
            )}
          </div>
        </div>

        {/* Notes + cibles */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Gamme</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {activeNotes.map((note, i) => (
                <div key={note} style={{ padding: "4px 8px", borderRadius: R.pill, background: i === 0 ? ctx.colorL : C.bg, border: `1px solid ${i === 0 ? ctx.color : C.border}`, fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? ctx.colorD : C.text2, fontFamily: FONTS.ui }}>
                  {nomsActifs[i] ?? note}{i === 0 ? " R" : ""}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, background: ctx.colorL, border: `1px solid ${ctx.colorB}`, borderRadius: R.lg, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Cibles</div>
            <div style={{ fontSize: 11, color: ctx.colorD, fontFamily: FONTS.ui, lineHeight: 1.5 }}>{ctx.targetDesc}</div>
          </div>
        </div>

        {/* Contrainte : adaptée au style et au niveau, chronométrée */}
        <CarteContrainte chrono={chrono} enLecture={enLecture} contextId={contextId} niveauApp={state?.level} dispatch={dispatch} />

        {/* Rappels */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Rappels</div>
          {["Silence = note. Utilise-le.", "Arrive sur une note de l'accord sur les temps forts.", "Une bonne phrase monte puis descend.", "Le sommet d'un solo se place vers les deux tiers, pas à la fin."].map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 3 ? 6 : 0 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: ctx.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui, lineHeight: 1.5 }}>{tip}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
