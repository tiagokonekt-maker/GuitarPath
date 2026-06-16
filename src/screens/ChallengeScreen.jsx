// GuitarPath — screens/ChallengeScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { DAILY_CHALLENGES, KEYS, MODES, TEMPOS, CONSTRAINTS } from "../store/challenges.js";

function ChallengeScreen({ state, dispatch, navigate }) {
  const C = useC();
  const ch = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];
  const done = state.dailyChallengeDone;
  const [pop, setPop] = useState(false);

  const finish = () => {
    setPop(true);
    setTimeout(() => {
      setPop(false);
      dispatch({ type: "DAILY_CHALLENGE_DONE" });
      dispatch({ type: "MARK_STREAK" });
    }, 1000);
  };

  return (
    <div style={{ padding: "14px 16px 0" }}>
      {pop && <XPPop amount={80} onDone={() => {}} />}
      <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="chevron-left" size={16} /> RETOUR
      </button>
      <h1 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Défi du jour</h1>

      <div style={{
        background: done ? C.greenL : C.amberL,
        borderRadius: R.lg, padding: 20, marginBottom: 14,
        border: `1px solid ${done ? C.greenBorder : C.amberBorder}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Ti name={done ? "trophy" : "bolt"} size={16} color={done ? C.green : C.amber} />
          <div style={{ fontSize: 10, fontWeight: 500, color: done ? C.greenD : C.amberD, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: FONTS.ui }}>
            {done ? "Défi complété" : "Aujourd'hui"}
          </div>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 500, color: done ? C.greenD : C.amberD, lineHeight: 1.55, fontFamily: FONTS.title }}>{ch}</p>
        <div style={{ fontSize: 12, color: done ? C.greenD : C.amberD, opacity: 0.7, fontFamily: FONTS.ui }}>Récompense : +80 XP</div>
      </div>

      {!done ? (
        <button onClick={finish} style={{
          width: "100%", padding: "14px", borderRadius: R.md, border: "none",
          background: C.amber, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>Défi relevé <Ti name="check" size={16} /></button>
      ) : (
        <div style={{ background: C.greenL, borderRadius: R.md, padding: 18, textAlign: "center", border: `1px solid ${C.greenBorder}` }}>
          <Ti name="trophy" size={32} color={C.green} />
          <div style={{ fontWeight: 700, color: C.greenD, fontSize: 16, fontFamily: FONTS.title, marginTop: 8 }}>Défi complété !</div>
          <div style={{ fontSize: 12, color: C.green, marginTop: 4, fontFamily: FONTS.ui }}>Reviens demain.</div>
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════════════

export { ChallengeScreen };
