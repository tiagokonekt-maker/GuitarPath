// Groply — design/tokens.js  v6 — dual theme, contrastes vérifiés
// ─────────────────────────────────────────────────────────────────────────────
// Conventions :
//   bg          fond de page
//   surface     cartes / panneaux
//   surface2    surfaces secondaires (chips inactifs, inputs)
//   border      bordure décorative (faible contraste, purement esthétique)
//   borderStrong bordure de CONTRÔLE (champ, bouton) — ≥ 3:1, exigence WCAG 1.4.11
//   text        texte principal
//   text2       secondaire / labels        — ≥ 4.5:1 sur bg ET surface
//   text3       tertiaire / placeholders   — ≥ 4.5:1 sur bg ET surface
//   Pour chaque couleur sémantique :
//     <color>     accent (icône, décor, aplat)
//     <color>Ink  MÊME couleur utilisable comme TEXTE (≥ 4.5:1)
//     <color>L    fond teinté
//     <color>B    bordure teintée (alias borderXxx)
//     <color>D    texte sur fond teinté <color>L
//
// ── Ce qui change (audit §6.1) ───────────────────────────────────────────────
// L'ancienne version plaçait les couleurs sémantiques (blue, purple, teal,
// green, danger, primary) dans un objet `shared`, donc IDENTIQUES en clair et
// en sombre. Elles avaient été choisies pour un fond clair, d'où :
//     DARK blue    / surface : 2,98:1  ❌
//     DARK purple  / surface : 2,97:1  ❌
//     DARK danger  / surface : 2,88:1  ❌
//     LIGHT text3  / surface : 2,84:1  ❌
//     blanc sur primary (TOUS les CTA) : 3,49:1  ❌ pour du texte 13-15 px
// Chaque thème a maintenant ses propres accents, et l'orange se décline en
// trois valeurs selon l'usage (décor / aplat de bouton / texte).
// Tous les ratios en commentaire ont été calculés, pas estimés.

// Rayons et polices : communs aux deux thèmes.
const shape = {};

export const LIGHT = {
  ...shape,

  // ── Fonds ─────────────────────────────────────────────
  bg:            "#FFE8CF",
  surface:       "#FFFFFF",
  surface2:      "#F9DFC0",
  border:        "#E8C9A0",   // décor uniquement (1,3:1) — jamais seule sur un contrôle
  borderStrong:  "#9E7238",   // 3,60:1 sur bg · 4,27:1 sur surface
  borderSoft:    "#F0D5B0",

  // ── Textes ────────────────────────────────────────────
  text:          "#18130F",   // 15,54:1 sur bg
  text2:         "#6E6760",   //  4,69:1 sur bg ·  5,57:1 sur surface
  text3:         "#6B645B",   //  4,92:1 sur bg ·  5,83:1 sur surface
                              // (text3 reste plus clair que text2 à l'œil grâce
                              //  à sa taille d'emploi, sans descendre sous AA)

  // ── Primaire (orange) ─────────────────────────────────
  primary:       "#E85D1A",   // décor, aplats, icônes ≥ 24 px
  primaryBtn:    "#C64E12",   //  4,67:1 avec du blanc → fond de CTA
  primaryInk:    "#B8430E",   //  4,60:1 sur bg · 5,46:1 sur surface → texte/lien
  primaryBorder: "#F5C4A8",
  primaryL:      "#FFF0E8",
  primaryD:      "#9C360A",   //  texte sur primaryL

  // ── Amber ─────────────────────────────────────────────
  amber:         "#C97B1A",
  amberInk:      "#8A5200",   //  6,39:1 sur surface
  amberBorder:   "#F5D4A0",
  amberL:        "#FFF0D9",
  amberD:        "#6B3F00",

  // ── Green ─────────────────────────────────────────────
  green:         "#1A8C52",
  greenInk:      "#0F7343",   //  5,91:1 sur surface
  greenBorder:   "#A8DEC0",
  greenL:        "#DCF5E8",
  greenD:        "#0C3D22",

  // ── Purple ────────────────────────────────────────────
  purple:        "#6B4FCC",
  purpleInk:     "#5B3FBB",   //  7,31:1 sur surface
  purpleBorder:  "#C4B8F0",
  purpleL:       "#EDE8FC",
  purpleD:       "#2D1A7A",

  // ── Pink / Coral ──────────────────────────────────────
  pink:          "#C430A5",
  pinkInk:       "#A82A8E",
  pinkBorder:    "#F0B0E6",
  pinkL:         "#FCE8F8",
  pinkD:         "#6B0858",
  coral:         "#C4306A",
  coralInk:      "#A82859",
  coralBorder:   "#F0B0CC",
  coralL:        "#FCE8F0",
  coralD:        "#6B0830",

  // ── Blue ──────────────────────────────────────────────
  blue:          "#1E62C7",
  blueInk:       "#1B58B2",
  blueBorder:    "#A8C8F0",
  blueL:         "#E2EFFE",
  blueD:         "#0A2E6E",

  // ── Teal ──────────────────────────────────────────────
  teal:          "#1A8276",
  tealInk:       "#0E6E63",   //  6,12:1 sur surface
  tealBorder:    "#A0DED8",
  tealL:         "#DFF6F2",
  tealD:         "#0C3D38",

  // ── États ─────────────────────────────────────────────
  danger:        "#B83030",   //  5,99:1 sur surface
  dangerInk:     "#A02828",
  dangerBorder:  "#EBB4B4",
  dangerL:       "#FCEAEA",
  dangerD:       "#7A1414",
  success:       "#0F7343",
  successL:      "#DCF5E8",

  // ── Focus (WCAG 2.4.7 / 2.4.11) ───────────────────────
  focus:         "#0A4FB0",
};

export const DARK = {
  ...shape,

  // ── Fonds ─────────────────────────────────────────────
  bg:            "#1A1008",   // brun très sombre, chaud (pas gris froid)
  surface:       "#26180A",
  surface2:      "#321F0D",
  border:        "#4A2E14",   // décor
  borderStrong:  "#8B6636",   // 3,33:1 sur surface — contrôle
  borderSoft:    "#3A2410",

  // ── Textes ────────────────────────────────────────────
  text:          "#F5E8D8",
  text2:         "#C0A882",   //  8,17:1 sur bg
  text3:         "#A08A74",   //  5,24:1 sur surface (l'ancien #8A7260 : 3,82 ❌)

  // ── Primaire ──────────────────────────────────────────
  // En sombre, l'orange d'origine passe (4,94:1 sur surface) : on le garde
  // comme accent, et le bouton reste lisible avec un texte foncé.
  primary:       "#F2762F",
  primaryBtn:    "#E85D1A",
  primaryInk:    "#FFAA78",
  primaryBorder: "#7A3A12",
  primaryL:      "#3D1E08",
  primaryD:      "#FFAA78",

  // ── Accents propres au thème sombre ───────────────────
  // Tous ≥ 6,9:1 sur surface — c'est ce qui manquait totalement avant.
  amber:         "#F0AE55",   // 8,95:1
  amberInk:      "#F0AE55",
  amberBorder:   "#5A3D12",
  amberL:        "#3A2508",
  amberD:        "#FFCC88",

  green:         "#5FD494",   // 9,31:1
  greenInk:      "#5FD494",
  greenBorder:   "#1E5638",
  greenL:        "#0A2518",
  greenD:        "#6ADBA0",

  purple:        "#B49CF5",   // 7,40:1
  purpleInk:     "#B49CF5",
  purpleBorder:  "#3A2A78",
  purpleL:       "#1A1038",
  purpleD:       "#C4B4F8",

  pink:          "#F07ADA",   // 6,98:1
  pinkInk:       "#F07ADA",
  pinkBorder:    "#5A1A4E",
  pinkL:         "#2A0826",
  pinkD:         "#F4A0EA",
  coral:         "#F07AA0",   // 6,57:1
  coralInk:      "#F07AA0",
  coralBorder:   "#5A1A32",
  coralL:        "#2A0818",
  coralD:        "#F4A0C8",

  blue:          "#6FA8F0",   // 7,01:1
  blueInk:       "#6FA8F0",
  blueBorder:    "#1E3C6E",
  blueL:         "#081830",
  blueD:         "#90C4F8",

  teal:          "#5CCBBE",   // 8,82:1
  tealInk:       "#5CCBBE",
  tealBorder:    "#154A44",
  tealL:         "#081E1A",
  tealD:         "#80D8D0",

  // ── États ─────────────────────────────────────────────
  danger:        "#FF8A8A",   // 7,60:1 (l'ancien #B83030 : 2,88 ❌)
  dangerInk:     "#FF8A8A",
  dangerBorder:  "#5E1C1C",
  dangerL:       "#280808",
  dangerD:       "#FFB0B0",
  success:       "#5FD494",
  successL:      "#0A2518",

  focus:         "#8CBCF5",
};

// Alias legacy — C pointe sur LIGHT (fichiers non encore migrés vers useC()).
export const C = LIGHT;

export const FONTS = {
  title: '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif',
  body:  '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif',
  ui:    '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif',
};

export const R = {
  sm:   10,
  md:   14,
  lg:   18,
  xl:   20,
  pill: 999,
};

// ── Échelle typographique ────────────────────────────────────────────────────
// Les tailles relevées dans le code allaient jusqu'à 8 px (numéros de case du
// manche) et 8,5 px (les intitulés « LE CONSEIL DE GROPI » en majuscules
// espacées). Illisible avec une guitare dans les mains, au soleil, téléphone
// posé sur un pied. Plancher fixé à 11 px pour le méta-texte, 15 px pour tout
// texte de leçon.
export const T = {
  micro: 11,   // labels de navigation, numéros de case, intitulés
  small: 13,   // méta-texte, légendes
  body:  15,   // texte courant, réponses de quiz
  lead:  17,   // chapô
  h3:    19,
  h2:    23,
  h1:    27,
};

// ── Cibles tactiles ─────────────────────────────────────────────────────────
// WCAG 2.2 SC 2.5.8 (AA) impose 24 px ; Apple recommande 44 pt et Material
// 48 dp. On s'aligne sur 44 pour tout ce qui est tapé en situation de jeu.
export const TAP = {
  min:    44,
  comfy:  48,
  fret:   44,   // hauteur de corde en mode quiz/exercice (était 28)
  fretW:  42,   // largeur de case (était 36)
};

export const MODULE = {
  neck:    { icon: "map-2",     color: "amber",  label: "Manche"   },
  scales:  { icon: "music",     color: "green",  label: "Gammes"   },
  harmony: { icon: "stack-2",   color: "purple", label: "Harmonie" },
  impro:   { icon: "wand",      color: "pink",   label: "Impro"    },
  rhythm:  { icon: "metronome", color: "blue",   label: "Rythme"   },
  ear:     { icon: "ear",       color: "teal",   label: "Oreille"  },
};
