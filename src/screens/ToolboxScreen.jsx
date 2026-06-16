// Groply — src/screens/ToolboxScreen.jsx
// Boîte à outils : Métronome (Tone.js) + Accordeur (micro, autocorrélation)
import { useState, useRef, useEffect, useCallback } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi, GropiTip } from "../design/Gropi.jsx";
import * as Tone from "tone";

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

// Autocorrélation (ACF2+) — optimisée pour la guitare acoustique
// fftSize 8192 pour les cordes graves (Mi2 = 82 Hz)
function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;

  // RMS — seuil bas pour capter les cordes acoustiques tenues à distance
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.003) return -1;   // silence (réduit de 0.01 → 0.003)

  // Clipping léger (seuil réduit pour préserver les cordes graves)
  let r1 = 0, r2 = SIZE - 1, thres = 0.1;  // 0.2 → 0.1
  for (let i = 0; i < SIZE/2; i++) if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  for (let i = 1; i < SIZE/2; i++) if (Math.abs(buf[SIZE-i]) < thres) { r2 = SIZE - i; break; }
  const b = buf.slice(r1, r2);
  const L = b.length;
  if (L < 2) return -1;

  // Autocorrélation
  const c = new Array(L).fill(0);
  for (let i = 0; i < L; i++)
    for (let j = 0; j < L - i; j++) c[i] += b[j] * b[j+i];

  // Trouver le premier minimum local puis le maximum suivant
  let d = 0;
  while (d < L - 1 && c[d] > c[d+1]) d++;
  let maxval = -1, maxpos = -1;
  for (let i = d; i < L; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }
  if (maxpos < 1) return -1;

  // Vérifier que la corrélation est suffisamment forte (évite les faux positifs)
  if (c[maxpos] / c[0] < 0.3) return -1;   // nouveau : filtre les sons non périodiques

  // Interpolation parabolique pour plus de précision
  let T0 = maxpos;
  const x1 = c[T0-1] || 0, x2 = c[T0] || 0, x3 = c[T0+1] || 0;
  const a = (x1 + x3 - 2*x2) / 2, bb = (x3 - x1) / 2;
  if (a) T0 = T0 - bb / (2*a);

  // Limiter aux fréquences de guitare (Mi2 = 82 Hz → Mi4 = 330 Hz + harmoniques)
  const freq = sampleRate / T0;
  if (freq < 60 || freq > 1400) return -1;  // nouveau : filtre hors plage guitare

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
  const freqHistRef = useRef([]);  // historique pour lissage

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (ctxRef.current && ctxRef.current.state !== "closed") ctxRef.current.close();
    ctxRef.current = analyser.current = streamRef.current = null;
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

      const tick = () => {
        an.getFloatTimeDomainData(bufRef.current);
        const f = autoCorrelate(bufRef.current, ctx.sampleRate);
        if (f > 0) {
          // Lissage : garder les 4 dernières fréquences valides
          const hist = freqHistRef.current;
          hist.push(f);
          if (hist.length > 4) hist.shift();
          // Médiane pour éviter les sauts
          const sorted = [...hist].sort((a,b)=>a-b);
          const median = sorted[Math.floor(sorted.length/2)];
          setFreq(median);
          setNote(freqToNote(median));
        } else {
          // Silence détecté → vider l'historique progressivement
          const hist = freqHistRef.current;
          if (hist.length > 0) hist.shift();
          if (hist.length === 0) { setFreq(0); setNote(null); }
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
            Joue une corde à vide, Gropi écoute et te dit si tu es juste. 🎧
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
          <div style={{ position:"relative", height:64, margin:"14px 0 8px" }}>
            <div style={{ position:"absolute", left:0, right:0, top:30, height:3, background:C.border, borderRadius:2 }}/>
            {/* zone juste */}
            <div style={{ position:"absolute", left:"calc(50% - 18px)", width:36, top:26, height:11, background:`${C.green}33`, borderRadius:6 }}/>
            {/* repère central */}
            <div style={{ position:"absolute", left:"50%", top:18, width:2, height:27, background:C.green, transform:"translateX(-50%)" }}/>
            {/* aiguille */}
            <div style={{
              position:"absolute", top:8,
              left:`${50 + Math.max(-50, Math.min(50, cents))}%`,
              transform:"translateX(-50%)", transition:"left .1s ease",
            }}>
              <div style={{
                width:0, height:0, margin:"0 auto",
                borderLeft:"7px solid transparent", borderRight:"7px solid transparent",
                borderTop:`14px solid ${inTune ? C.green : Math.abs(cents) < 20 ? C.amber : C.pink}`,
              }}/>
              <div style={{ fontSize:11, fontWeight:700, textAlign:"center", marginTop:2,
                color: inTune ? C.green : Math.abs(cents) < 20 ? C.amber : C.pink }}>
                {note ? (cents > 0 ? `+${cents}` : cents) : ""}
              </div>
            </div>
            {/* libellés trop bas/trop haut */}
            <div style={{ position:"absolute", left:0, top:46, fontSize:9.5, color:C.text3, fontWeight:600 }}>♭ trop bas</div>
            <div style={{ position:"absolute", right:0, top:46, fontSize:9.5, color:C.text3, fontWeight:600 }}>trop haut ♯</div>
          </div>

          {inTune && (
            <div style={{ textAlign:"center", fontSize:13, fontWeight:700, color:C.green, marginBottom:8 }}>
              ✓ Juste !
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
function ToolboxScreen({ onBack }) {
  const C = useC();
  const [tab, setTab] = useState("metronome");

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Header */}
      <div style={{
        backgroundImage:"url('/sunrise.jpg')", backgroundSize:"cover", backgroundPosition:"center 40%",
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
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1, padding:"10px 0", borderRadius:R.lg, cursor:"pointer", fontFamily:FONTS.ui,
            border:`1.5px solid ${tab===t.id?C.primary:C.border}`,
            background: tab===t.id?C.primaryL:C.surface,
            color: tab===t.id?C.primaryD:C.text2, fontWeight:700, fontSize:13,
            display:"flex", alignItems:"center", justifyContent:"center", gap:7,
          }}>
            <Ti name={t.icon} size={15} color={tab===t.id?C.primary:C.text3}/>
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ padding:"18px 20px 0" }}>
        {tab === "metronome" ? <Metronome/> : <Tuner/>}
      </div>
    </div>
  );
}

export { ToolboxScreen };
