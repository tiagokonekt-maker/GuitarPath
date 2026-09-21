// Groply — design/Ti.jsx
// Composant icône, rendu en SVG inline.
//
// ── Ce qui change ─────────────────────────────────────────────────────────
// Avant, ce composant rendait `<i class="ti ti-nom">` et comptait sur une
// webfont chargée depuis cdn.jsdelivr.net. Si cette feuille de style ne
// chargeait pas — CDN injoignable, politique de sécurité, cache du service
// worker, bloqueur de contenu, réseau filtrant — toutes les icônes de
// l'application disparaissaient d'un coup : boutons ronds vides, barre de
// navigation muette. C'est exactement ce qui s'est produit.
//
// Les tracés sont désormais embarqués (design/icons.js) : disponibles au
// premier octet, fonctionnels hors-ligne, et aucun tiers ne reçoit l'adresse
// IP de l'utilisateur.
//
// L'API ne change pas : <Ti name="home" size={20} color={C.text} /> continue
// de fonctionner partout, y compris avec un nom calculé.
import { ICONS } from "./icons.js";

/**
 * @param name    nom Tabler, avec ou sans préfixe "ti-"
 * @param size    côté du carré, en pixels
 * @param color   couleur du tracé (ou du remplissage pour les icônes pleines)
 * @param label   si fourni, l'icône est annoncée par les lecteurs d'écran ;
 *                sinon elle est traitée comme décorative
 * @param stroke  épaisseur du trait — 2 convient de 14 à 24 px ; en dessous
 *                de 14 px, 1.75 évite l'effet « pâté »
 */
export function Ti({ name, size = 16, color = "currentColor", style, label, stroke }) {
  // Les données de contenu stockent parfois "ti-music" plutôt que "music".
  const cle = String(name || "").replace(/^ti-/, "");
  const icone = ICONS[cle];

  const commun = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    // `block` évite l'espace fantôme sous les éléments en ligne, qui
    // désalignait les icônes dans les boutons.
    style: { display: "block", flexShrink: 0, ...style },
    "aria-hidden": label ? undefined : "true",
    role: label ? "img" : undefined,
    "aria-label": label || undefined,
  };

  // Nom inconnu : on rend un carré discret plutôt que rien. Une icône
  // manquante devient ainsi visible pendant le développement, au lieu de
  // laisser un bouton vide sans que personne ne le remarque — c'est ce qui
  // avait laissé passer "tuning-fork", qui n'existe pas chez Tabler.
  if (!icone) {
    if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
      console.warn(`[Ti] icône inconnue : "${cle}"`);
    }
    return (
      <svg {...commun} fill="none" stroke={color} strokeWidth={1.5} opacity={0.45}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    );
  }

  const [plein, tracés] = icone;

  // Les icônes pleines se rendent avec `fill`, les icônes au trait avec
  // `stroke`. Les mélanger donnait des formes noires ou invisibles.
  const props = plein
    ? { fill: color, stroke: "none" }
    : {
        fill: "none",
        stroke: color,
        strokeWidth: stroke ?? (size < 14 ? 1.75 : 2),
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };

  return (
    <svg
      {...commun}
      {...props}
      // Les tracés viennent d'un fichier local généré depuis le paquet
      // officiel Tabler : aucune donnée utilisateur ne transite ici.
      dangerouslySetInnerHTML={{ __html: tracés }}
    />
  );
}

export default Ti;
