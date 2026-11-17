// Groply — design/hooks.js
// Hooks et petites fonctions du design system (séparés de ui.jsx pour ne pas
// mélanger composants et non-composants dans un même module).
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useC } from "./ThemeContext.jsx";

// ── Teintes ──────────────────────────────────────────────────────────────────
// Une « teinte » est une famille de la palette : primary, amber, green,
// purple, pink, coral, blue, teal, danger — plus "neutral".
//   c      accent (icône, aplat décoratif)
//   ink    la même couleur utilisable comme texte
//   l      fond teinté
//   b      bordure teintée
//   d      texte sur fond teinté
//   solid  aplat de bouton plein (texte C.onPrimaryBtn dessus)
//   edge   tranche (relief) sous l'aplat plein
const ALIAS = { success: "green", error: "danger", orange: "primary" };

export function toneOf(C, tone = "primary") {
  if (tone === "neutral") {
    return { c: C.text2, ink: C.text, l: C.surface2, b: C.border, d: C.text, solid: C.text, edge: C.borderStrong };
  }
  const t = C[ALIAS[tone] || tone] ? (ALIAS[tone] || tone) : "primary";
  const solid = t === "primary" ? C.primaryBtn : (C[t + "Ink"] || C[t]);
  return {
    c: C[t],
    ink: C[t + "Ink"] || C[t],
    l: C[t + "L"],
    b: C[t + "Border"],
    d: C[t + "D"],
    solid,
    edge: t === "primary" ? C.primaryEdge : `color-mix(in srgb, ${solid} 72%, #000)`,
  };
}

export function useTone(tone) {
  return toneOf(useC(), tone);
}

/**
 * Variables de relief à étaler dans `style` d'un élément portant la classe
 * `gr-press` : <div className="gr-press" style={{ ...relief(C.edge, 3) }} />
 */
export const relief = (edge, depth = 4) => ({ "--edge": edge, "--depth": `${depth}px` });

// ── Mouvement réduit ─────────────────────────────────────────────────────────
const REQ = "(prefers-reduced-motion: reduce)";
const abonner = (cb) => {
  const mq = window.matchMedia?.(REQ);
  mq?.addEventListener?.("change", cb);
  return () => mq?.removeEventListener?.("change", cb);
};
const lire = () => !!window.matchMedia?.(REQ)?.matches;

/** Vrai si la personne a demandé moins d'animations (réglage système). */
export function useReducedMotion() {
  return useSyncExternalStore(abonner, lire, () => false);
}

// ── Compteur animé ───────────────────────────────────────────────────────────
/**
 * Fait défiler un nombre de sa valeur précédente à la nouvelle.
 * Au premier affichage, part de `from` (0 par défaut).
 */
export function useCountUp(value, { duration = 700, from = 0 } = {}) {
  const cible = Number(value) || 0;
  const reduit = useReducedMotion();
  const [affiche, setAffiche] = useState(reduit ? cible : from);
  const depart = useRef(reduit ? cible : from);

  useEffect(() => {
    if (reduit || typeof requestAnimationFrame !== "function") {
      depart.current = cible;
      return;
    }
    const de = depart.current;
    if (de === cible) return;
    const t0 = performance.now();
    let raf = 0;
    const pas = (t) => {
      const k = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      const v = Math.round(de + (cible - de) * e);
      depart.current = v;
      setAffiche(v);
      if (k < 1) raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [cible, duration, reduit]);

  return reduit ? cible : affiche;
}

const sansAbonnement = () => () => {};
/** Faux au rendu serveur et au tout premier rendu, vrai ensuite (portails). */
export function useEstMonte() {
  return useSyncExternalStore(sansAbonnement, () => true, () => false);
}

/** Retour haptique discret (Android) ; sans effet ailleurs. */
export function vibrer(motif = 8) {
  try { navigator.vibrate?.(motif); } catch { /* non supporté */ }
}
