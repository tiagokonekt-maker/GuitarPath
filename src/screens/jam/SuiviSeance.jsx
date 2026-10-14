// GuitarPath -- screens/jam/SuiviSeance.jsx
// Séance de pratique : on voit ce qu'il reste pour qu'elle compte. Seul ce
// bloc se re-rend chaque seconde (abonné au chrono), pas l'écran entier.
import { FONTS, R } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Ti } from "../../design/Ti.jsx";
import { useSecondesJouees } from "./chrono.js";
import { SEUIL_SESSION, fmtDuree } from "./reglages.js";

export function SuiviSeance({ chrono, sessionComptee, couleur }) {
  const C = useC();
  const secondesJouees = useSecondesJouees(chrono);
  if (!(secondesJouees > 0 || sessionComptee)) return null;

  return (
    <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: R.md, background: sessionComptee ? C.greenL : C.surface, border: `1px solid ${sessionComptee ? C.greenBorder : C.border}` }}>
      {sessionComptee ? (
        <>
          <Ti name="check" size={16} color={C.greenD} />
          <div style={{ fontSize: 12.5, color: C.greenD, fontFamily: FONTS.ui, lineHeight: 1.4 }}>
            <b>Séance comptée</b> dans ta série et tes objectifs
            {sessionComptee.xp > 0 ? ` · +${sessionComptee.xp} XP` : sessionComptee.xp === 0 ? " · XP de pratique du jour déjà au maximum" : ""}
          </div>
        </>
      ) : (
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui }}>
            Encore <b>{fmtDuree(SEUIL_SESSION - secondesJouees)}</b> de jeu pour que la séance compte
          </div>
          <div aria-hidden="true" style={{ height: 4, borderRadius: 2, background: C.border, marginTop: 6, overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, (secondesJouees / SEUIL_SESSION) * 100)}%`, height: "100%", background: couleur, transition: "width 1s linear" }} />
          </div>
        </div>
      )}
    </div>
  );
}
