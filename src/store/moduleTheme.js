// GuitarPath — store/moduleTheme.js
// Thèmes visuels par module

import { C } from "../design/tokens.js";

const MODULE_THEME = {
  neck:    { icon: "ti-map-2",     color: C.amber,   colorL: C.amberL,   colorD: C.amberD },
  scales:  { icon: "ti-music",     color: C.green,   colorL: C.greenL,   colorD: C.greenD },
  harmony: { icon: "ti-stack-2",   color: C.purple,  colorL: C.purpleL,  colorD: C.purpleD  },
  rhythm:  { icon: "ti-metronome", color: C.blue,    colorL: C.blueL,    colorD: C.blueD   },
  impro:   { icon: "ti-wand",      color: C.pink,    colorL: C.pinkL,    colorD: "#85304E" },
};

export { MODULE_THEME };
