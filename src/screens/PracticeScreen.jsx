// GuitarPath — screens/PracticeScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { KEYS, MODES, TEMPOS, CONSTRAINTS } from "../store/challenges.js";

function PracticeScreen({ state, dispatch }) {
  const C = useC();
  const [tab, setTab] = useState("impro");
  const [current, setCurrent] = useState(null);
  const [pop, setPop] = useState(false);

  const generateImpro = () => {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)];
    const mode = MODES[Math.floor(Math.random() * MODES.length)];
    const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const constraint = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setCurrent({ type: "impro", title: `${key} ${mode} · ${tempo} BPM`, sub: constraint, time: 10 });
  };
  const generateNeck = () => {
    const challenges = [
      "trouve toutes les notes Do sur le manche en 30 secondes",
      "joue la pentatonique Am en 5 positions enchaînées",
      "trouve la triade de Fa majeur sur cordes 1-2-3 dans 3 positions",
      "joue Cmaj7 dans les 5 formes CAGED",
    ];
    setCurrent({ type: "neck", title: "Défi manche", sub: challenges[Math.floor(Math.random() * challenges.length)], time: 5 });
  };
  const generateRhythm = () => {
    const t = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const subs = ["noires", "croches", "doubles-croches", "triolets"][Math.floor(Math.random() * 4)];
    setCurrent({ type: "rhythm", title: `Métronome ${t} BPM`, sub: `Joue uniquement en ${subs} pendant 5 minutes`, time: 5 });
  };

  const finish = () => {
    setPop(true);
    setTimeout(() => {
      setPop(false);
      dispatch({ type: "PRACTICE_DONE", minutes: current?.time || 5 });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
      setCurrent(null);
    }, 1000);
  };

  return (
    <div style={{ padding: "18px 16px 0" }}>
      {pop && <XPPop amount={50} onDone={() => {}} />}
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Practice libre</h1>
      <p style={{ fontSize: 13, color: C.text2, margin: "3px 0 14px", fontFamily: FONTS.ui }}>Défis générés à l'infini. Jamais 2 fois pareil.</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[{ id: "impro", label: "Impro" }, { id: "neck", label: "Manche" }, { id: "rhythm", label: "Rythme" }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setCurrent(null); }} style={{
            flex: 1, padding: "10px", borderRadius: R.sm,
            border: `1px solid ${tab === t.id ? C.primary : C.border}`,
            background: tab === t.id ? C.primary : C.surface,
            color: tab === t.id ? "#fff" : C.text2,
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
          }}>{t.label}</button>
        ))}
      </div>

      {!current ? (
        <div style={{ background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.lg, padding: 20, textAlign: "center" }}>
          <Ti name="dice-5" size={36} color={C.coral} />
          <div style={{ fontSize: 17, fontWeight: 700, color: C.coralD, marginTop: 10, marginBottom: 6, fontFamily: FONTS.title }}>Génère ton défi</div>
          <div style={{ fontSize: 13, color: C.coralD, marginBottom: 14, lineHeight: 1.55, fontFamily: FONTS.ui }}>
            {tab === "impro" && "Tonalité, mode, tempo et contrainte tirés au sort."}
            {tab === "neck" && "Un défi de visualisation du manche."}
            {tab === "rhythm" && "Un défi de métronome à un tempo donné."}
          </div>
          <button onClick={tab === "impro" ? generateImpro : tab === "neck" ? generateNeck : generateRhythm} style={{
            width: "100%", padding: "14px", borderRadius: R.md, border: "none",
            background: C.coral, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>Générer un défi <Ti name="dice-5" size={16} /></button>
        </div>
      ) : (
        <div>
          <div style={{ background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: R.lg, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: C.primaryD, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: FONTS.ui }}>
              Défi en cours
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.primaryD, marginBottom: 8, fontFamily: FONTS.title }}>{current.title}</div>
            <div style={{ fontSize: 14, color: C.primaryD, lineHeight: 1.55, fontFamily: FONTS.title }}>{current.sub}</div>
            <div style={{ fontSize: 11, color: C.primaryD, marginTop: 12, opacity: 0.7, fontFamily: FONTS.ui }}>Durée : {current.time} min</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => setCurrent(null)} style={{
              padding: "12px", borderRadius: R.md, border: `1px solid ${C.border}`,
              background: C.surface, color: C.text, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>Autre défi <Ti name="dice-5" size={14} /></button>
            <button onClick={finish} style={{
              padding: "12px", borderRadius: R.md, border: "none",
              background: C.green, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>Terminé · +50 XP</button>
          </div>
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGE (Défi du jour)
// ═══════════════════════════════════════════════════════════════════════════

export { PracticeScreen };
