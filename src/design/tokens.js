// GuitarPath — design/tokens.js
// Design system v4 — thème chaleureux Headspace-inspired
// Polices : Poppins (SemiBold titres, Medium sous-titres, Regular texte)

export const C = {
  // ── Fonds ─────────────────────────────────────────────────────────────
  bg:           "#FAF8F5",   // crème chaud — jamais blanc froid
  surface:      "#FFFFFF",
  surface2:     "#F5F1EC",   // surfaces secondaires (chips inactifs, etc.)
  border:       "#EDE9E3",
  borderSoft:   "#F5F1EC",

  // ── Textes ────────────────────────────────────────────────────────────
  text:         "#18130F",   // quasi-noir chaud
  text2:        "#7A736A",   // secondaire
  text3:        "#A09890",   // tertiaire / placeholders

  // ── Primaire — orange sunset (CTA, actif, XP) ─────────────────────────
  primary:      "#E85D1A",
  primaryL:     "#FFF0E8",
  primaryBorder:"#F5C4A8",
  primaryD:     "#B84010",

  // ── Amber — module Manche ─────────────────────────────────────────────
  amber:        "#C97B1A",
  amberL:       "#FFF0D9",
  amberBorder:  "#F5D4A0",
  amberD:       "#7A4B00",

  // ── Green — module Gammes & Modes ─────────────────────────────────────
  green:        "#1A8C52",
  greenL:       "#DCF5E8",
  greenBorder:  "#A8DEC0",
  greenD:       "#0C3D22",

  // ── Purple — module Harmonie ──────────────────────────────────────────
  purple:       "#6B4FCC",
  purpleL:      "#EDE8FC",
  purpleBorder: "#C4B8F0",
  purpleD:      "#2D1A7A",

  // ── Rose — module Improvisation ───────────────────────────────────────
  pink:         "#C4306A",
  pinkL:        "#FCE8F0",
  pinkBorder:   "#F0B0CC",
  pinkD:        "#6B0830",

  // ── Blue — module Rythme ──────────────────────────────────────────────
  blue:         "#1E62C7",
  blueL:        "#E2EFFE",
  blueBorder:   "#A8C8F0",
  blueD:        "#0A2E6E",

  // ── Teal — Oreille musicale / EarTraining ─────────────────────────────
  teal:         "#1A8276",
  tealL:        "#DFF6F2",
  tealBorder:   "#A0DED8",
  tealD:        "#0C3D38",

  // ── Coral — Rythme (alias legacy) / erreurs ───────────────────────────
  coral:        "#C4306A",   // alias → pink pour compatibilité
  coralL:       "#FCE8F0",
  coralBorder:  "#F0B0CC",
  coralD:       "#6B0830",

  // ── États ─────────────────────────────────────────────────────────────
  danger:       "#B83030",
  dangerL:      "#FCEAEA",
  success:      "#1A8C52",
  successL:     "#DCF5E8",
};

export const FONTS = {
  // Poppins — chaud, rond, lisible, moderne
  title: '"Poppins", -apple-system, sans-serif',
  body:  '"Poppins", -apple-system, sans-serif',
  ui:    '"Poppins", -apple-system, sans-serif',
};

// Rayons — cohérence stricte dans tous les composants
export const R = {
  sm:   10,
  md:   14,
  lg:   18,
  xl:   20,
  pill: 999,
};

// ── Thèmes des modules (icône + couleurs) ─────────────────────────────────
// Utilisé par : ModuleCard, CoursesScreen, moduleTheme.js, badges
export const MODULE = {
  neck:    { icon: "map-2",     color: "amber",  label: "Manche"     },
  scales:  { icon: "music",     color: "green",  label: "Gammes"     },
  harmony: { icon: "stack-2",   color: "purple", label: "Harmonie"   },
  impro:   { icon: "wand",      color: "pink",   label: "Impro"      },
  rhythm:  { icon: "metronome", color: "blue",   label: "Rythme"     },
  ear:     { icon: "ear",       color: "teal",   label: "Oreille"    },
};
