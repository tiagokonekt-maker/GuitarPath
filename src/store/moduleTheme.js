// GuitarPath — store/moduleTheme.js
// Thèmes visuels par module

import { C } from "../design/tokens.js";

const MODULE_THEME = {
  neck:    { icon: "ti-map-2",     color: C.amber,   colorL: C.amberL,   colorD: C.amberD },
  scales:  { icon: "ti-music",     color: C.green,   colorL: C.greenL,   colorD: C.greenD },
  harmony: { icon: "ti-stack-2",   color: C.primary, colorL: C.primaryL, colorD: C.primaryD },
  rhythm:  { icon: "ti-metronome", color: C.coral,   colorL: C.coralL,   colorD: C.coralD },
  impro:   { icon: "ti-wand",      color: C.pink,    colorL: C.pinkL,    colorD: "#85304E" },
};

export { MODULE_THEME };
