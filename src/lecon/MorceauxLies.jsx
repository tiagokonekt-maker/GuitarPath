// Groply — src/lecon/MorceauxLies.jsx
// « Joue-le maintenant » : en fin de leçon, les morceaux d'Outils › Morceaux
// qui mettent en pratique ce qu'elle vient d'enseigner (liens dans
// src/content/liens-morceaux.js). Une carte par morceau : titre, niveau,
// type ; un appui ouvre directement le morceau dans Outils.
//
// Utilisé par la carte Récap des leçons en cartes (LeconCartes.jsx) et à la
// fin de l'article (LessonView, screens/CoursesScreen.jsx). Rien n'est
// affiché sans `onJouer` (rendu de contrôle, aperçu sans navigation) ni
// sans morceau lié.
import { FONTS, R, T, TAP } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { morceauxDeLecon } from "../content/liens-morceaux.js";
import { morceauParId } from "../morceaux/catalogue.js";
import { NIVEAUX, TYPES } from "../morceaux/morceaux.js";

const ICONE_TYPE = { melodie: "music", riff: "bolt", accords: "guitar-pick" };

export function MorceauxLies({ lessonId, onJouer, style }) {
  const C = useC();
  const morceaux = morceauxDeLecon(lessonId).map(morceauParId).filter(Boolean);
  if (!onJouer || morceaux.length === 0) return null;

  return (
    <section aria-label="Joue-le maintenant" style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: T.micro, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: C.primaryInk || C.primaryD, fontFamily: FONTS.ui }}>
        <Ti name="headphones" size={14} color={C.primaryInk || C.primaryD} />
        Joue-le maintenant
      </div>
      {morceaux.map(m => (
        <button key={m.id} type="button" onClick={() => onJouer(m.id)} className="gr-focus"
          aria-label={`Jouer « ${m.titre} » dans Outils, Morceaux · ${NIVEAUX[m.niveau] || ""}`}
          style={{
            width: "100%", boxSizing: "border-box", minHeight: TAP.comfy, display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
            borderRadius: R.lg, border: `1.5px solid ${C.primaryBorder}`, background: C.primaryL,
            cursor: "pointer", fontFamily: FONTS.ui, textAlign: "left",
          }}>
          <span aria-hidden="true" style={{ width: 36, height: 36, flexShrink: 0, borderRadius: R.md, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name={ICONE_TYPE[m.type] || "music"} size={18} color={C.primaryInk || C.primaryD} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: T.body, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{m.titre}</span>
            <span style={{ display: "block", fontSize: T.small, color: C.text2, marginTop: 2 }}>
              {[NIVEAUX[m.niveau], TYPES[m.type], m.tonalite].filter(Boolean).join(" · ")}
            </span>
          </span>
          <Ti name="player-play" size={18} color={C.primaryInk || C.primaryD} />
        </button>
      ))}
    </section>
  );
}
