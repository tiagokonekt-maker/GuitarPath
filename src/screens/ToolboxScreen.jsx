// Groply — src/screens/ToolboxScreen.jsx
// Boîte à outils : Métronome (Tone.js) + Accordeur (micro, autocorrélation)
import { useState, useRef, useEffect, useCallback } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi, GropiTip } from "../design/Gropi.jsx";
import * as Tone from "tone";
import { playProgression, stopProgression } from "../audioEngine.js";
import { CHORD_TYPES } from "../fretboardUtils.js";
import { FretboardExplorer } from "./FretboardExplorer.jsx";

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

  const clickRef = useRef(null);
  const loopRef  = useRef(null);
  const beatRef  = useRef(0);

  // Crée les sons de clic (aigu = temps fort, grave = temps faibles)
  const ensureClick = useCallback(async () => {
    if (clickRef.current) return;
    await Tone.start();
    clickRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.008, octaves: 2,
      envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
    }).toDestination();
    clickRef.current.volume.value = -6;
  }, []);

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
      const b = beatRef.current % beats;
      const strong = b === 0;
      clickRef.current.triggerAttackRelease(strong ? "C5" : "G4", "16n", time);
      // visuel synchronisé
      Tone.getDraw().schedule(() => setCurrent(b), time);
      beatRef.current += 1;
    }, "4n").start(0);
    transport.start();
    setPlaying(true);
  }, [bpm, beats, ensureClick]);

  // BPM live
  useEffect(() => { Tone.getTransport().bpm.value = bpm; }, [bpm]);
  // cleanup
  useEffect(() => () => stop(), [stop]);

  const toggle = () => (playing ? stop() : start());
  const nudge  = (d) => setBpm(v => Math.min(240, Math.max(40, v + d)));

  // Tap tempo
  const tapsRef = useRef([]);
  const tapTempo = () => {
    const now = performance.now();
    tapsRef.current = [...tapsRef.current.filter(t => now - t < 2000), now];
    if (tapsRef.current.length >= 2) {
      const gaps = [];
      for (let i = 1; i < tapsRef.current.length; i++) gaps.push(tapsRef.current[i] - tapsRef.current[i-1]);
      const avg = gaps.reduce((a,b)=>a+b,0) / gaps.length;
      setBpm(Math.min(240, Math.max(40, Math.round(60000 / avg))));
    }
  };

  const tempoLabel =
    bpm < 60 ? "Largo" : bpm < 76 ? "Adagio" : bpm < 108 ? "Andante" :
    bpm < 120 ? "Moderato" : bpm < 156 ? "Allegro" : bpm < 176 ? "Vivace" : "Presto";

  return (
    <div>
      {/* Pastilles de temps */}
      <div style={{ display:"flex", justifyContent:"center", gap:10, margin:"8px 0 22px" }}>
        {Array.from({ length: beats }).map((_, i) => {
          const on = current === i;
          const strong = i === 0;
          return (
            <div key={i} style={{
              width: on ? 22 : 16, height: on ? 22 : 16, borderRadius:"50%",
              background: on ? (strong ? C.primary : C.amber) : C.border,
              transition:"all .08s ease",
              boxShadow: on ? `0 0 0 5px ${(strong?C.primary:C.amber)}22` : "none",
            }}/>
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
        onChange={e => setBpm(+e.target.value)}
        style={{ width:"100%", margin:"16px 0 6px", accentColor:C.primary }}/>

      {/* -/+ */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:20 }}>
        {[-5,-1].map(d=>(
          <button key={d} onClick={()=>nudge(d)} style={pillBtn}>{d}</button>
        ))}
        <button onClick={toggle} style={{
          width:72, height:72, borderRadius:"50%", border:"none", cursor:"pointer",
          background:`linear-gradient(135deg,#FF9155,${C.primary})`,
          color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 6px 20px ${C.primary}55`,
        }}>
          <Ti name={playing ? "player-pause" : "player-play"} size={30} color="#fff"/>
        </button>
        {[1,5].map(d=>(
          <button key={d} onClick={()=>nudge(d)} style={pillBtn}>+{d}</button>
        ))}
      </div>

      {/* Signature + tap */}
      <div style={{ display:"flex", gap:10 }}>
        <div style={{ flex:1, background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:"10px 12px" }}>
          <div style={{ fontSize:9.5, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:".06em", marginBottom:7 }}>Mesure</div>
          <div style={{ display:"flex", gap:6 }}>
            {[2,3,4,6].map(n=>(
              <button key={n} onClick={()=>setBeats(n)} style={{
                flex:1, padding:"7px 0", borderRadius:8, cursor:"pointer",
                border:`1.5px solid ${beats===n?C.primary:C.border}`,
                background:beats===n?C.primaryL:C.surface,
                color:beats===n?C.primaryD:C.text2, fontWeight:700, fontSize:13, fontFamily:FONTS.ui,
              }}>{n}</button>
            ))}
          </div>
        </div>
        <button onClick={tapTempo} style={{
          width:96, background:C.amberL, border:`1.5px solid ${C.amberBorder}`, borderRadius:R.lg,
          color:C.amberD, fontWeight:700, fontSize:13, fontFamily:FONTS.ui, cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
        }}>
          <Ti name="hand-finger-down" size={18} color={C.amber}/>
          Tap tempo
        </button>
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

          <button onClick={start} style={{
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
            <div style={{ position:"absolute", left:"calc(50% - 18px)", width:36, top:26, height:11, background:`${C.green}33`, borderRadius:6 }}/>
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

          {inTune && (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontSize:13, fontWeight:700, color:C.green, marginBottom:8 }}>
              <Ti name="check" size={15} color={C.green} /> Juste !
            </div>
          )}

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

          <button onClick={stop} style={{
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
// LECTEUR D'ACCORDS — construis une suite d'accords, écoute-la jouée en
// boucle avec le vrai son de guitare (même moteur que le reste de l'app).
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

  const stop = useCallback(() => {
    stopProgression();
    setPlaying(false);
    setActiveIdx(-1);
  }, []);

  // Nettoyage : si on quitte l'onglet en cours de lecture, on arrête —
  // sinon la progression continuerait à jouer en fond, ou entrerait en
  // conflit avec le métronome qui partage le même transport audio.
  useEffect(() => () => stopProgression(), []);

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
  const clearAll = () => { stop(); setSequence([]); };

  const play = async () => {
    if (sequence.length === 0) return;
    const secs = SPEED_PRESETS.find(p => p.id === speed)?.secs || 1.4;
    setPlaying(true);
    await playProgression(sequence, secs, (idx) => setActiveIdx(idx));
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
            <button key={code} onClick={() => setRoot(code)} style={{
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
            <button key={f.id} onClick={() => {
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
            <button key={key} onClick={() => setQuality(key)} style={{
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

        <button onClick={addChord} disabled={sequence.length >= MAX_CHORDS} style={{
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
            <button onClick={clearAll} style={{
              background:"none", border:"none", color:C.coral, fontSize:12, fontWeight:700,
              fontFamily:FONTS.ui, cursor:"pointer", padding:0,
            }}>
              Vider
            </button>
          )}
        </div>

        {sequence.length === 0 ? (
          <div style={{ textAlign:"center", padding:"18px 0", color:C.text3, fontSize:13, fontFamily:FONTS.ui }}>
            Ajoute des accords ci-dessus pour construire ta suite.
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
                <button onClick={() => removeChord(i)} style={{
                  background:"none", border:"none", cursor:"pointer", padding:2,
                  display:"flex", color:C.text3,
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
            <button key={p.id} onClick={() => setSpeed(p.id)} disabled={playing} style={{
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

        <button onClick={toggle} disabled={sequence.length === 0} style={{
          width:"100%", padding:"13px 0", borderRadius:R.md, border:"none",
          background: sequence.length === 0 ? C.border : (playing ? C.coral : C.primary),
          color:"#fff", fontWeight:800, fontSize:14, fontFamily:FONTS.ui,
          cursor: sequence.length === 0 ? "default" : "pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:7,
        }}>
          <Ti name={playing ? "player-stop" : "player-play"} size={16} color="#fff"/>
          {playing ? "Arrêter" : "Écouter la suite"}
        </button>
      </div>
    </div>
  );
}

function ToolboxScreen({ onBack }) {
  const C = useC();
  const [tab, setTab] = useState("metronome");

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
            <button onClick={onBack} style={{
              background:"rgba(255,255,255,.85)", border:"none", borderRadius:R.sm,
              width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            }}>
              <Ti name="arrow-left" size={17} color={C.primaryD}/>
            </button>
          )}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Boîte à outils</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", marginTop:1 }}>Métronome & accordeur</div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div style={{ display:"flex", gap:8, padding:"14px 20px 0" }}>
        {[
          { id:"metronome", label:"Métronome", icon:"clock" },
          { id:"tuner",     label:"Accordeur", icon:"microphone" },
          { id:"chords",    label:"Accords",   icon:"music" },
          { id:"neck",      label:"Manche",    icon:"guitar-pick" },
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1, padding:"10px 0", borderRadius:R.lg, cursor:"pointer", fontFamily:FONTS.ui,
            border:`1.5px solid ${tab===t.id?C.primary:C.border}`,
            background: tab===t.id?C.primaryL:C.surface,
            color: tab===t.id?C.primaryD:C.text2, fontWeight:700, fontSize:11.5,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
          }}>
            <Ti name={t.icon} size={15} color={tab===t.id?C.primary:C.text3}/>
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ padding:"18px 20px 0" }}>
        {tab === "metronome" ? <Metronome/>
         : tab === "tuner"     ? <Tuner/>
         : tab === "chords"    ? <ChordPlayer/>
         : <FretboardExplorer embedded />}
      </div>
    </div>
  );
}

export { ToolboxScreen };
