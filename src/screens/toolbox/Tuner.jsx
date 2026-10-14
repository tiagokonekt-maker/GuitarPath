// Groply — src/screens/toolbox/Tuner.jsx
// Accordeur de la boîte à outils (chargé à la demande par ToolboxScreen).
import { useState, useRef, useEffect, useCallback } from "react";
import { FONTS, R } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Ti } from "../../design/Ti.jsx";
import { Gropi } from "../../design/Gropi.jsx";
import { detectPitch } from "../../music/pitch.js";

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

export function Tuner() {
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
  // Démarrage asynchrone (getUserMedia, puis resume du contexte audio) :
  // l'utilisateur peut changer d'onglet ou appuyer deux fois pendant l'attente.
  // Chaque démarrage reçoit un numéro de génération ; `stop()` (y compris au
  // démontage) l'incrémente. Après chaque `await`, un numéro périmé veut dire
  // « annulé » : on libère alors le micro qu'on vient d'obtenir au lieu de
  // l'installer — sinon il restait allumé, l'écran déjà fermé.
  const generationRef = useRef(0);
  const demarrageRef  = useRef(false);   // verrou synchrone (double appui)
  const [demarrage, setDemarrage] = useState(false);   // pour l'affichage

  const stop = useCallback(() => {
    generationRef.current += 1;   // annule un démarrage en cours
    demarrageRef.current = false;
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (ctxRef.current && ctxRef.current.state !== "closed") ctxRef.current.close();
    ctxRef.current = analyser.current = streamRef.current = null;
    centsTargetRef.current = 0;
    centsShownRef.current = 0;
    hasSignalRef.current = false;
    freqHistRef.current = [];
    setActive(false); setFreq(0); setNote(null); setDemarrage(false);
  }, []);

  const start = useCallback(async () => {
    // Un seul démarrage à la fois : un double appui ouvrait deux flux micro,
    // dont un que plus rien ne pouvait arrêter.
    if (demarrageRef.current) return;
    demarrageRef.current = true;
    setDemarrage(true);
    const gen = ++generationRef.current;
    const annule = () => gen !== generationRef.current;
    let stream = null, ctx = null;
    // Libère ce que CE démarrage a obtenu (flux micro, contexte audio).
    const abandonner = () => {
      stream?.getTracks().forEach(t => t.stop());
      if (ctx && ctx.state !== "closed") ctx.close().catch(() => { /* noop */ });
    };
    try {
      // Mobile : certains navigateurs ignorent les contraintes → fallback
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation:false, autoGainControl:false, noiseSuppression:false, latency:0 },
        });
      } catch {
        if (annule()) return;
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      if (annule()) { abandonner(); return; }
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') await ctx.resume();
      if (annule()) { abandonner(); return; }
      streamRef.current = stream;
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
    } catch {
      // Échec (ou annulation) : rien ne doit rester ouvert derrière nous.
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      abandonner();
      if (streamRef.current === stream) streamRef.current = null;
      if (ctxRef.current === ctx) ctxRef.current = analyser.current = null;
      if (annule()) return;
      setError("Micro inaccessible. Autorise l'accès au microphone dans ton navigateur.");
      setActive(false);
    } finally {
      if (!annule()) { demarrageRef.current = false; setDemarrage(false); }
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

          <button onClick={start} disabled={demarrage} aria-busy={demarrage} className="gr-focus" style={{
            background:`linear-gradient(135deg,#FF9155,${C.primary})`, color:C.onPrimaryBtn, border:"none",
            borderRadius:R.lg, padding:"13px 28px", fontSize:14, fontWeight:700, fontFamily:FONTS.ui,
            cursor: demarrage ? "progress" : "pointer", opacity: demarrage ? .7 : 1,
            boxShadow:`0 4px 16px ${C.primary}44`, marginTop:18,
            display:"inline-flex", alignItems:"center", gap:8,
          }}>
            <Ti name="microphone" size={16} color={C.onPrimaryBtn}/> {demarrage ? "Activation…" : "Activer l'accordeur"}
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
