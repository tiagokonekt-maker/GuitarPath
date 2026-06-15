// Groply — src/design/Gropi.jsx  v3
// Mascotte officielle (taureau mariachi) — système complet
// ───────────────────────────────────────────────────────────────────────────
// 8 poses  :  happy · wave · celebrate · think · rocker · idea · pride · listen
// Anims    :  bob (flottement) · pop (apparition) · wiggle (salut) · cheer (joie)
// Composants:
//   <Gropi pose size anim/>                      → l'image animée
//   <GropiTip pose tint eyebrow onClose>…        → bulle de conseil (statique)
//   <GropiCoach variant="tip|ref|note">…         → intervention inline en leçon
//   <GropiBubble pose eyebrow tint>…             → mascotte tappable + bulle toggle
// ───────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { C, FONTS, R } from "./tokens.js";

// ── Fichiers SVG (dans le dossier public) ────────────────────────────────────
const POSE_SRC = {
  happy:     "/mascotte-happy.svg",
  wave:      "/mascotte-wave.svg",
  celebrate: "/mascotte-celebrate.svg",
  think:     "/mascotte-think.svg",
  rocker:    "/mascotte-rocker.svg",
  idea:      "/mascotte-idea.svg",
  pride:     "/mascotte-pride.svg",
  listen:    "/mascotte-listen.svg",
  // alias de repli
  plead:     "/mascotte-think.svg",
};

// ── Injection unique des keyframes (idempotent, respecte reduce-motion) ───────
if (typeof document !== "undefined" && !document.getElementById("gropi-anim-styles")) {
  const s = document.createElement("style");
  s.id = "gropi-anim-styles";
  s.textContent = `
    @keyframes gropi-bob    { 0%,100%{transform:translateY(0)}      50%{transform:translateY(-6px)} }
    @keyframes gropi-pop    { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
    @keyframes gropi-wiggle { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-8deg)} 60%{transform:rotate(8deg)} }
    @keyframes gropi-cheer  { 0%{transform:scale(.5) translateY(22px);opacity:0} 50%{transform:scale(1.12) translateY(-8px)} 72%{transform:scale(.97)} 100%{transform:scale(1) translateY(0);opacity:1} }
    @keyframes gropi-bubble-in { 0%{transform:scale(.92) translateY(4px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
    .gropi-anim { will-change: transform; }
    @media (prefers-reduced-motion: reduce) { .gropi-anim { animation: none !important; } }
  `;
  document.head.appendChild(s);
}

const ANIM = {
  none:   {},
  bob:    { animation: "gropi-bob 2.8s ease-in-out infinite" },
  pop:    { animation: "gropi-pop .42s ease-out both" },
  wiggle: { animation: "gropi-wiggle 2.4s ease-in-out infinite", transformOrigin: "bottom center" },
  cheer:  { animation: "gropi-cheer .62s cubic-bezier(.2,.8,.3,1.2) both" },
};

// ── Composant image ───────────────────────────────────────────────────────────
export function Gropi({ pose = "happy", size = 80, anim = "none", style, onClick }) {
  const src = POSE_SRC[pose] || POSE_SRC.happy;
  return (
    <img
      src={src}
      alt=""
      width={size}
      draggable={false}
      onClick={onClick}
      className={anim !== "none" ? "gropi-anim" : undefined}
      style={{
        display: "block", height: "auto", flexShrink: 0, userSelect: "none",
        cursor: onClick ? "pointer" : undefined,
        ...(ANIM[anim] || {}),
        ...style,
      }}
    />
  );
}

// ── Résolution d'une teinte du thème ──────────────────────────────────────────
function tintColors(tint) {
  return {
    light:  C[tint + "L"]      || C.primaryL,
    border: C[tint + "Border"] || C[tint + "B"] || C.primaryBorder,
    deep:   C[tint + "D"]      || C.primaryD,
  };
}

// ── Bulle de conseil statique (compat : API inchangée) ────────────────────────
export function GropiTip({ pose = "wave", tint = "primary", eyebrow = "Conseil de Gropi", onClose, children }) {
  const { light, border, deep } = tintColors(tint);
  return (
    <div style={{
      display: "flex", gap: 11, alignItems: "flex-start", position: "relative",
      background: C.surface, border: `1.5px solid ${border}`, borderRadius: R.xl, padding: 12,
    }}>
      <Gropi pose={pose} size={56} anim="bob" />
      <div style={{ position: "relative", flex: 1, background: light, borderRadius: R.lg, padding: "9px 11px" }}>
        <span style={{
          position: "absolute", left: -7, top: 16, width: 0, height: 0,
          borderTop: "7px solid transparent", borderBottom: "7px solid transparent",
          borderRight: `7px solid ${light}`,
        }} />
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: deep, fontFamily: FONTS.ui }}>{eyebrow}</div>
        <p style={{ margin: "3px 0 0", fontSize: 12.5, lineHeight: 1.5, fontWeight: 500, color: C.text, fontFamily: FONTS.body }}>{children}</p>
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Fermer" style={{
          position: "absolute", top: 8, right: 11, background: "none", border: 0,
          cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.text3, padding: 2,
        }}>✕</button>
      )}
    </div>
  );
}

// ── Coach inline dans les leçons (remplace les blocs tip / ref) ───────────────
// variant: "tip" (astuce, ampoule)  ·  "ref" (écoute, listen)  ·  "note" (info)
const COACH = {
  tip:  { pose: "idea",   tint: "amber",   eyebrow: "Le conseil de Gropi" },
  ref:  { pose: "listen", tint: "primary", eyebrow: "Gropi te fait écouter" },
  note: { pose: "think",  tint: "green",   eyebrow: "Gropi précise" },
};

export function GropiCoach({ variant = "tip", eyebrow, children }) {
  const cfg = COACH[variant] || COACH.tip;
  const { light, border, deep } = tintColors(cfg.tint);
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-end", margin: "2px 0" }}>
      <Gropi pose={cfg.pose} size={54} anim="bob" style={{ marginBottom: 2 }} />
      <div style={{
        position: "relative", flex: 1,
        background: light, border: `1.5px solid ${border}`,
        borderRadius: R.lg, borderBottomLeftRadius: 4, padding: "10px 13px",
      }}>
        <span style={{
          position: "absolute", left: -7, bottom: 13, width: 0, height: 0,
          borderTop: "7px solid transparent", borderBottom: "7px solid transparent",
          borderRight: `7px solid ${light}`,
        }} />
        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: deep, fontFamily: FONTS.ui, marginBottom: 3 }}>
          {eyebrow || cfg.eyebrow}
        </div>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: C.text, fontFamily: FONTS.body }}>{children}</p>
      </div>
    </div>
  );
}

// ── Mascotte tappable + bulle (roadmap, points d'aide) ────────────────────────
export function GropiBubble({
  pose = "wave", size = 74, tint = "primary",
  eyebrow = "Gropi", side = "right", children, defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { light, border, deep } = tintColors(tint);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: side === "right" ? "flex-start" : "flex-end" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Parler à Gropi"
        aria-expanded={open}
        style={{ background: "none", border: 0, padding: 0, cursor: "pointer", lineHeight: 0 }}
      >
        <Gropi pose={pose} size={size} anim={open ? "none" : "bob"} />
      </button>

      {open && (
        <div style={{
          marginTop: 8, maxWidth: 270,
          background: C.surface, border: `1.5px solid ${border}`,
          borderRadius: R.lg, padding: "11px 13px",
          boxShadow: `0 6px 20px ${deep}22`,
          animation: "gropi-bubble-in .22s ease both",
        }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: deep, fontFamily: FONTS.ui, marginBottom: 3 }}>
            {eyebrow}
          </div>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: C.text, fontFamily: FONTS.body }}>{children}</p>
        </div>
      )}
    </div>
  );
}
