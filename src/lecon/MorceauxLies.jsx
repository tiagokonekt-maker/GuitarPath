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
import { T, TAP } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Card, Eyebrow, IconTile } from "../design/ui.jsx";
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
      <Eyebrow style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Ti name="headphones" size={14} color="currentColor" />
        Joue-le maintenant
      </Eyebrow>
      {morceaux.map(m => (
        <Card key={m.id} onClick={() => onJouer(m.id)} tone="primary" soft pad="10px 12px"
          aria-label={`Jouer « ${m.titre} » dans Outils, Morceaux · ${NIVEAUX[m.niveau] || ""}`}
          style={{ minHeight: TAP.comfy, display: "flex", alignItems: "center", gap: 12 }}>
          <IconTile icon={ICONE_TYPE[m.type] || "music"} tone="primary" size={36} style={{ background: C.surface }} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: T.body, fontWeight: 800, color: C.text, lineHeight: 1.3 }}>{m.titre}</span>
            <span style={{ display: "block", fontSize: T.small, color: C.text2, marginTop: 2 }}>
              {[NIVEAUX[m.niveau], TYPES[m.type], m.tonalite].filter(Boolean).join(" · ")}
            </span>
          </span>
          <Ti name="player-play" size={18} color={C.primaryInk} />
        </Card>
      ))}
    </section>
  );
}
