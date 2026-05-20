// GuitarPath — design/ui.jsx
// Composants UI réutilisables
import { useEffect } from "react";
import { C, FONTS } from "./tokens.js";
import { Ti } from "./Ti.jsx";

export function ProgressBar({ pct, color = C.primary, h = 6 }) {
  return (
    <div style={{ background: C.border, borderRadius: 999, overflow: "hidden", height: h }}>
      <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.4s ease" }} />
    </div>
  );
}

export function XPPop({ amount, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: C.primary, color: "#fff", padding: "8px 18px", borderRadius: 999, fontSize: 14, fontWeight: 700, fontFamily: C.ui, zIndex: 200, pointerEvents: "none", animation: "fadeUp 1.4s ease forwards" }}>
      +{amount} XP
    </div>
  );
}

export function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 13, color: C.text, fontFamily: FONTS.title, zIndex: 300, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", cursor: "pointer", maxWidth: 320, textAlign: "center" }}>
      {msg}
    </div>
  );
}
