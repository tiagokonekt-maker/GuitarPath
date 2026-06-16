// Groply — tokens.js  v5 — dual theme (light + dark)
// ─────────────────────────────────────────────────────────────────────────────
// Conventions :
//   bg          fond de page
//   surface     cartes / panneaux
//   surface2    surfaces secondaires (chips inactifs, inputs)
//   border      bordure standard
//   borderSoft  séparateurs fins, tirets
//   text        texte principal
//   text2       secondaire / labels
//   text3       tertiaire / placeholders
//   Pour chaque couleur sémantique :
//     <color>     accent (bouton, icône)
//     <color>L    fond teinté (badges, encarts)
//     <color>B    bordure tintée  (alias borderXxx)
//     <color>D    texte sur fond teinté
// ─────────────────────────────────────────────────────────────────────────────

const shared = {
  // Polices & rayons — identiques dans les deux thèmes
  primary:       "#E85D1A",
  primaryBorder: "#F5C4A8",

  amber:         "#C97B1A",
  amberBorder:   "#F5D4A0",

  green:         "#1A8C52",
  greenBorder:   "#A8DEC0",

  purple:        "#6B4FCC",
  purpleBorder:  "#C4B8F0",

  pink:          "#C4306A",
  pinkBorder:    "#F0B0CC",
  coral:         "#C4306A",
  coralBorder:   "#F0B0CC",

  blue:          "#1E62C7",
  blueBorder:    "#A8C8F0",

  teal:          "#1A8276",
  tealBorder:    "#A0DED8",

  danger:        "#B83030",
};

export const LIGHT = {
  ...shared,

  // ── Fonds ─────────────────────────────────────────────
  bg:            "#FFE8CF",
  surface:       "#FFFFFF",
  surface2:      "#F9DFC0",
  border:        "#E8C9A0",
  borderSoft:    "#F0D5B0",

  // ── Textes ────────────────────────────────────────────
  text:          "#18130F",
  text2:         "#7A736A",
  text3:         "#A09890",

  // ── Primaire ──────────────────────────────────────────
  primaryL:      "#FFF0E8",
  primaryD:      "#B84010",

  // ── Amber ─────────────────────────────────────────────
  amberL:        "#FFF0D9",
  amberD:        "#7A4B00",

  // ── Green ─────────────────────────────────────────────
  greenL:        "#DCF5E8",
  greenD:        "#0C3D22",

  // ── Purple ────────────────────────────────────────────
  purpleL:       "#EDE8FC",
  purpleD:       "#2D1A7A",

  // ── Pink / Coral ──────────────────────────────────────
  pinkL:         "#FCE8F0",
  pinkD:         "#6B0830",
  coralL:        "#FCE8F0",
  coralD:        "#6B0830",

  // ── Blue ──────────────────────────────────────────────
  blueL:         "#E2EFFE",
  blueD:         "#0A2E6E",

  // ── Teal ──────────────────────────────────────────────
  tealL:         "#DFF6F2",
  tealD:         "#0C3D38",

  // ── États ─────────────────────────────────────────────
  dangerL:       "#FCEAEA",
  success:       "#1A8C52",
  successL:      "#DCF5E8",
};

export const DARK = {
  ...shared,

  // ── Fonds ─────────────────────────────────────────────
  bg:            "#1A1008",   // brun très sombre, chaud (pas gris froid)
  surface:       "#26180A",   // cartes brun foncé
  surface2:      "#321F0D",   // surfaces secondaires
  border:        "#4A2E14",   // bordure visible mais pas criarde
  borderSoft:    "#3A2410",   // séparateurs

  // ── Textes ────────────────────────────────────────────
  text:          "#F5E8D8",   // crème chaud (pas blanc pur)
  text2:         "#C0A882",   // secondaire doré
  text3:         "#8A7260",   // tertiaire / placeholders

  // ── Primaire ──────────────────────────────────────────
  primaryL:      "#3D1E08",   // fond orange sombre
  primaryD:      "#FFAA78",   // texte orange clair sur fond sombre

  // ── Amber ─────────────────────────────────────────────
  amberL:        "#3A2508",
  amberD:        "#FFCC88",

  // ── Green ─────────────────────────────────────────────
  greenL:        "#0A2518",
  greenD:        "#6ADBA0",

  // ── Purple ────────────────────────────────────────────
  purpleL:       "#1A1038",
  purpleD:       "#C4B4F8",

  // ── Pink / Coral ──────────────────────────────────────
  pinkL:         "#2A0818",
  pinkD:         "#F4A0C8",
  coralL:        "#2A0818",
  coralD:        "#F4A0C8",

  // ── Blue ──────────────────────────────────────────────
  blueL:         "#081830",
  blueD:         "#90C4F8",

  // ── Teal ──────────────────────────────────────────────
  tealL:         "#081E1A",
  tealD:         "#80D8D0",

  // ── États ─────────────────────────────────────────────
  dangerL:       "#280808",
  success:       "#1A8C52",
  successL:      "#0A2518",
};

// Alias legacy — C pointe sur LIGHT par défaut (pour les fichiers non encore migrés)
// Les composants migrés utilisent useC() depuis ThemeContext.js
export const C = LIGHT;

export const FONTS = {
  title: '"Poppins", -apple-system, sans-serif',
  body:  '"Poppins", -apple-system, sans-serif',
  ui:    '"Poppins", -apple-system, sans-serif',
};

export const R = {
  sm:   10,
  md:   14,
  lg:   18,
  xl:   20,
  pill: 999,
};

export const MODULE = {
  neck:    { icon: "map-2",     color: "amber",  label: "Manche"   },
  scales:  { icon: "music",     color: "green",  label: "Gammes"   },
  harmony: { icon: "stack-2",   color: "purple", label: "Harmonie" },
  impro:   { icon: "wand",      color: "pink",   label: "Impro"    },
  rhythm:  { icon: "metronome", color: "blue",   label: "Rythme"   },
  ear:     { icon: "ear",       color: "teal",   label: "Oreille"  },
};
