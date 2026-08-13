// Groply — design/ui.jsx
// Composants UI réutilisables.
//
// ── Ce qui change (audit §6.3) ────────────────────────────────────────────
// Les toasts et les gains d'XP n'avaient aucun rôle ARIA : un lecteur d'écran
// n'annonçait ni le gain d'XP, ni le déblocage d'un badge, ni le message
// d'erreur. Ils portent maintenant role="status" + aria-live="polite".
// La barre de progression expose sa valeur (role="progressbar").
import { useEffect, useRef } from "react";
import { FONTS, T } from "./tokens.js";
import { useC } from "./ThemeContext.jsx";

export function ProgressBar({ pct, color, h = 6, label }) {
  const C = useC();
  const valeur = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return (
    <div
      role="progressbar"
      aria-valuenow={valeur}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || "Progression"}
      style={{ background: C.border, borderRadius: 999, overflow: "hidden", height: h }}
    >
      <div style={{
        width: `${valeur}%`, height: "100%",
        background: color || C.primary, borderRadius: 999,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

export function XPPop({ amount, onDone }) {
  const C = useC();
  // `onDone` dans les deps relançait le minuteur à chaque rendu quand
  // l'appelant passait une fonction anonyme (ce que font tous les écrans :
  // `onDone={() => {}}`). Une ref fige la callback.
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => doneRef.current?.(), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!amount || amount <= 0) return null;

  return (
    <div role="status" aria-live="polite" style={{
      position: "fixed", bottom: 92, left: "50%", transform: "translateX(-50%)",
      background: C.primaryBtn, color: "#fff", padding: "9px 18px", borderRadius: 999,
      fontSize: T.body, fontWeight: 700, fontFamily: FONTS.ui, zIndex: 200,
      pointerEvents: "none", animation: "fadeUp 1.4s ease forwards",
      boxShadow: "0 6px 20px rgba(0,0,0,.18)",
    }}>
      +{amount} XP
    </div>
  );
}

export function Toast({ msg, onClose, duration = 3500 }) {
  const C = useC();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const t = setTimeout(() => closeRef.current?.(), duration);
    return () => clearTimeout(t);
  }, [duration]);

  return (
    <div
      role="status" aria-live="polite"
      onClick={() => closeRef.current?.()}
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 14px)",
        left: 12, right: 12, maxWidth: 380, margin: "0 auto",
        background: C.surface, border: `1.5px solid ${C.borderStrong}`,
        borderRadius: 14, padding: "12px 16px",
        fontSize: T.small, color: C.text, fontFamily: FONTS.ui,
        zIndex: 300, boxShadow: "0 8px 28px rgba(0,0,0,.14)",
        cursor: "pointer", textAlign: "center",
        animation: "gr-slide-in .22s ease both",
      }}
    >
      {msg}
    </div>
  );
}

/**
 * Boîte de confirmation maison, en remplacement de `window.confirm`.
 * L'ancienne version utilisait le dialogue système — hors design system,
 * parfois en anglais selon l'appareil — pour les actions les plus
 * irréversibles de l'app (réinitialiser la progression, supprimer le contenu).
 *
 * `motDeConfirmation` exige une saisie active : à réserver aux destructions
 * réellement définitives.
 */
export function ConfirmDialog({
  titre, message, confirmLabel = "Confirmer", cancelLabel = "Annuler",
  danger = false, motDeConfirmation = null, onConfirm, onCancel, saisie, onSaisie,
}) {
  const C = useC();
  const pret = !motDeConfirmation || (saisie || "").trim().toUpperCase() === motDeConfirmation.toUpperCase();

  useEffect(() => {
    const auClavier = (e) => { if (e.key === "Escape") onCancel?.(); };
    document.addEventListener("keydown", auClavier);
    return () => document.removeEventListener("keydown", auClavier);
  }, [onCancel]);

  return (
    <div
      role="dialog" aria-modal="true" aria-label={titre}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        background: "rgba(20,14,8,.55)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div style={{
        background: C.surface, borderRadius: 20, padding: 22,
        maxWidth: 340, width: "100%",
        border: `1.5px solid ${C.border}`, fontFamily: FONTS.ui,
        boxShadow: "0 20px 60px rgba(0,0,0,.3)",
      }}>
        <div style={{ fontSize: T.h3, fontWeight: 800, color: C.text, marginBottom: 8 }}>{titre}</div>
        <p style={{ fontSize: T.small, color: C.text2, lineHeight: 1.6, margin: "0 0 16px" }}>{message}</p>

        {motDeConfirmation && (
          <>
            <label htmlFor="confirm-word" style={{ fontSize: 12, color: C.text2, display: "block", marginBottom: 6 }}>
              Tape <strong style={{ color: C.text }}>{motDeConfirmation}</strong> pour confirmer
            </label>
            <input
              id="confirm-word" value={saisie || ""} onChange={(e) => onSaisie?.(e.target.value)}
              autoComplete="off" autoCapitalize="characters" className="gr-focus"
              style={{
                width: "100%", boxSizing: "border-box", padding: "12px 14px",
                borderRadius: 12, border: `1.5px solid ${C.borderStrong}`,
                fontSize: 16, background: C.surface2, color: C.text,
                fontFamily: FONTS.ui, marginBottom: 16,
              }}
            />
          </>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => pret && onConfirm?.()} disabled={!pret}
            className="gr-focus"
            style={{
              padding: "14px", borderRadius: 12, border: "none", minHeight: 48,
              background: !pret ? C.surface2 : danger ? C.danger : C.primaryBtn,
              color: !pret ? C.text3 : "#fff",
              fontWeight: 700, fontSize: T.body, fontFamily: FONTS.ui,
              cursor: pret ? "pointer" : "not-allowed",
            }}
          >{confirmLabel}</button>
          <button
            onClick={() => onCancel?.()} className="gr-focus"
            style={{
              padding: "14px", borderRadius: 12, minHeight: 48,
              background: "none", border: `1.5px solid ${C.border}`,
              color: C.text, fontWeight: 600, fontSize: T.body,
              fontFamily: FONTS.ui, cursor: "pointer",
            }}
          >{cancelLabel}</button>
        </div>
      </div>
    </div>
  );
}
