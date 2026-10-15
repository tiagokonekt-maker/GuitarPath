// Groply — fretboard/LecteurDiagramme.jsx
// Bouton « écouter / arrêter » des diagrammes de leçon et barre qui le place
// en haut à droite du cadre. L'état de lecture vient de useLecteurDiagramme.js.
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { TAP } from "../design/tokens.js";

const FONT = '"Josefin Sans", "Roboto", sans-serif';

/**
 * Bouton rond « écouter / arrêter » (44 px), ou pilule texte (variante
 * secondaire, ex. « Arpège »).
 * @param joue      cette action est en cours (chargement compris)
 * @param charge    les échantillons se chargent
 * @param label     nom accessible au repos (« Écouter l'accord de La mineur »)
 * @param texte     si fourni : pilule avec ce texte au lieu de l'icône seule
 */
export function BoutonEcoute({ joue, charge, label, labelArret = "Arrêter", texte, onClick, style }) {
  const C = useC();
  const fond = joue ? (C.primaryBtn || C.primary) : C.surface;
  const encre = joue ? (C.onPrimaryBtn || "#fff") : (C.primaryInk || C.primary);
  const icone = charge ? "loader" : joue ? "player-stop-filled" : "player-play-filled";
  return (
    <button
      type="button"
      className="gr-focus"
      onClick={onClick}
      aria-label={joue ? `${labelArret}${texte ? ` (${texte.toLowerCase()})` : ""}` : label}
      aria-pressed={joue}
      aria-busy={charge || undefined}
      title={joue ? labelArret : label}
      style={{
        minWidth: TAP.min, height: TAP.min,
        padding: texte ? "0 14px 0 12px" : 0,
        borderRadius: TAP.min / 2,
        border: `1.5px solid ${joue ? fond : (C.primaryBorder || C.border)}`,
        background: fond, color: encre,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        cursor: "pointer", flexShrink: 0,
        fontFamily: FONT, fontSize: 13, fontWeight: 700,
        WebkitTapHighlightColor: "transparent",
        transition: "background .15s, color .15s, border-color .15s",
        ...style,
      }}
    >
      <Ti name={icone} size={texte ? 16 : 20} color={encre}
        style={charge ? { animation: "gr-spin 0.9s linear infinite" } : undefined} />
      {texte && <span aria-hidden="true">{texte}</span>}
    </button>
  );
}

/**
 * Barre d'actions d'un diagramme : en haut à droite du cadre, toujours au
 * même endroit. `children` = un ou plusieurs BoutonEcoute.
 */
export function BarreEcoute({ children, gauche }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
      padding: "8px 8px 0",
    }}>
      {gauche && <div style={{ flex: 1, minWidth: 0 }}>{gauche}</div>}
      {children}
    </div>
  );
}
