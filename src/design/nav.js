// Groply — design/nav.js
// Onglets de la navigation principale.
//
// L'id "home" reste l'identifiant interne de route (navigate("home"),
// case "home"…) ; seul le libellé affiché dit « Parcours ».
export const TABS = [
  { id: "home",      label: "Parcours", icon: "route" },
  { id: "toolbox",   label: "Outils",   icon: "guitar-pick" },
  { id: "training",  label: "Pratique", icon: "target-arrow" },
  { id: "progress",  label: "Progrès",  icon: "chart-bar" },
];

export const NAV_HEIGHT = 66;
