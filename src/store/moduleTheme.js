// Groply — store/moduleTheme.js
// Thèmes visuels par module — getModuleTheme(C) pour le dark mode
import { LIGHT } from "../design/tokens.js";

// Construit les thèmes à partir d'un objet C (LIGHT ou DARK)
function buildModuleTheme(C) {
  return {
    neck:    { icon: "ti-map-2",     color: C.amber,   colorL: C.amberL,   colorD: C.amberD,   colorBorder: C.amberBorder },
    scales:  { icon: "ti-music",     color: C.green,   colorL: C.greenL,   colorD: C.greenD,   colorBorder: C.greenBorder },
    harmony: { icon: "ti-stack-2",   color: C.purple,  colorL: C.purpleL,  colorD: C.purpleD,  colorBorder: C.purpleBorder },
    rhythm:  { icon: "ti-metronome", color: C.blue,    colorL: C.blueL,    colorD: C.blueD,    colorBorder: C.blueBorder },
    impro:   { icon: "ti-wand",      color: C.pink,    colorL: C.pinkL,    colorD: C.pinkD,    colorBorder: C.pinkBorder },
  };
}

// Alias legacy (light) — pour les fichiers non encore migrés
const MODULE_THEME = buildModuleTheme(LIGHT);

export { MODULE_THEME, buildModuleTheme };
