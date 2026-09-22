var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// stub:tone-stub
var tone_stub_exports = {};
__export(tone_stub_exports, {
  Compressor: () => Compressor,
  Draw: () => Draw,
  FeedbackDelay: () => FeedbackDelay,
  Filter: () => Filter,
  Gain: () => Gain,
  Loop: () => Loop,
  MembraneSynth: () => MembraneSynth,
  MetalSynth: () => MetalSynth,
  NoiseSynth: () => NoiseSynth,
  Part: () => Part,
  Players: () => Players,
  Reverb: () => Reverb,
  Sampler: () => Sampler,
  Sequence: () => Sequence,
  Synth: () => Synth,
  Time: () => Time,
  context: () => context,
  getContext: () => getContext,
  getDraw: () => getDraw,
  getTransport: () => getTransport,
  now: () => now,
  start: () => start
});
async function start() {
}
function getTransport() {
  return { start() {
  }, stop() {
  }, cancel() {
  } };
}
var now, context, Draw, Sampler, Reverb, getContext, getDraw, Time, Compressor, FeedbackDelay, Synth, Filter, Players, MembraneSynth, NoiseSynth, Sequence, Part, Loop, FauxParam, Gain, MetalSynth;
var init_tone_stub = __esm({
  "stub:tone-stub"() {
    now = () => 0;
    context = { state: "running", rawContext: { resume() {
    }, suspend() {
    } } };
    Draw = { schedule() {
    } };
    Sampler = class {
      constructor(o) {
        o?.onload?.();
      }
      connect() {
        return this;
      }
      toDestination() {
        return this;
      }
      triggerAttackRelease() {
      }
      releaseAll() {
      }
      dispose() {
      }
    };
    Reverb = class {
      toDestination() {
        return this;
      }
      connect() {
        return this;
      }
    };
    getContext = () => ({ resume: async () => {
    }, state: "running" });
    getDraw = () => ({ schedule() {
    } });
    Time = () => 0;
    Compressor = class {
      constructor() {
      }
      toDestination() {
        return this;
      }
      connect() {
        return this;
      }
      dispose() {
      }
    };
    FeedbackDelay = class {
      constructor() {
      }
      toDestination() {
        return this;
      }
      connect() {
        return this;
      }
      dispose() {
      }
    };
    Synth = class {
      constructor() {
        this.volume = { value: 0 };
      }
      connect() {
        return this;
      }
      toDestination() {
        return this;
      }
      triggerAttackRelease() {
      }
      dispose() {
      }
    };
    Filter = class {
      constructor() {
        this.frequency = { value: 0, setValueAtTime() {
        } };
      }
      connect() {
        return this;
      }
      toDestination() {
        return this;
      }
      dispose() {
      }
    };
    Players = class {
      constructor(o) {
        o?.onload?.();
      }
      connect() {
        return this;
      }
      toDestination() {
        return this;
      }
      player() {
        return { start() {
        }, stop() {
        } };
      }
      has() {
        return false;
      }
      dispose() {
      }
    };
    MembraneSynth = class {
      constructor() {
        this.volume = { value: 0 };
      }
      connect() {
        return this;
      }
      toDestination() {
        return this;
      }
      triggerAttackRelease() {
      }
      dispose() {
      }
    };
    NoiseSynth = class {
      constructor() {
        this.volume = { value: 0 };
      }
      connect() {
        return this;
      }
      toDestination() {
        return this;
      }
      triggerAttackRelease() {
      }
      dispose() {
      }
    };
    Sequence = class {
      constructor() {
      }
      start() {
        return this;
      }
      stop() {
        return this;
      }
      dispose() {
      }
      set loop(v) {
      }
    };
    Part = class {
      constructor() {
      }
      start() {
        return this;
      }
      stop() {
        return this;
      }
      dispose() {
      }
    };
    Loop = class {
      constructor() {
      }
      start() {
        return this;
      }
      stop() {
        return this;
      }
      dispose() {
      }
    };
    FauxParam = class {
      constructor(v) {
        this.value = v;
      }
      cancelScheduledValues() {
        return this;
      }
      setValueAtTime(v) {
        this.value = v;
        return this;
      }
      linearRampToValueAtTime(v) {
        this.value = v;
        return this;
      }
    };
    Gain = class {
      constructor(v) {
        this.gain = new FauxParam(v ?? 1);
      }
      toDestination() {
        return this;
      }
      connect() {
        return this;
      }
      dispose() {
      }
    };
    MetalSynth = class {
      constructor() {
        this.volume = new FauxParam(0);
      }
      toDestination() {
        return this;
      }
      connect() {
        return this;
      }
      triggerAttackRelease() {
      }
      dispose() {
      }
    };
  }
});

// src/screens/CoursesScreen.jsx
var CoursesScreen_exports = {};
__export(CoursesScreen_exports, {
  CoursesScreen: () => CoursesScreen,
  LessonView: () => LessonView
});
import { useState as useState4, useMemo, useEffect as useEffect3, useRef as useRef3 } from "react";

// src/design/tokens.js
var shape = {};
var LIGHT = {
  ...shape,
  // ── Fonds ─────────────────────────────────────────────
  bg: "#FFE8CF",
  surface: "#FFFFFF",
  surface2: "#F9DFC0",
  border: "#E8C9A0",
  // décor uniquement (1,3:1) — jamais seule sur un contrôle
  borderStrong: "#9E7238",
  // 3,60:1 sur bg · 4,27:1 sur surface
  borderSoft: "#F0D5B0",
  // ── Textes ────────────────────────────────────────────
  text: "#18130F",
  // 15,54:1 sur bg
  text2: "#6E6760",
  //  4,69:1 sur bg ·  5,57:1 sur surface
  text3: "#6B645B",
  //  4,92:1 sur bg ·  5,83:1 sur surface
  // (text3 reste plus clair que text2 à l'œil grâce
  //  à sa taille d'emploi, sans descendre sous AA)
  // ── Primaire (orange) ─────────────────────────────────
  primary: "#E85D1A",
  // décor, aplats, icônes ≥ 24 px
  primaryBtn: "#C64E12",
  //  4,67:1 avec du blanc → fond de CTA
  primaryInk: "#B8430E",
  //  4,60:1 sur bg · 5,46:1 sur surface → texte/lien
  primaryBorder: "#F5C4A8",
  primaryL: "#FFF0E8",
  primaryD: "#9C360A",
  //  texte sur primaryL
  // ── Amber ─────────────────────────────────────────────
  amber: "#C97B1A",
  amberInk: "#8A5200",
  //  6,39:1 sur surface
  amberBorder: "#F5D4A0",
  amberL: "#FFF0D9",
  amberD: "#6B3F00",
  // ── Green ─────────────────────────────────────────────
  green: "#1A8C52",
  greenInk: "#0F7343",
  //  5,91:1 sur surface
  greenBorder: "#A8DEC0",
  greenL: "#DCF5E8",
  greenD: "#0C3D22",
  // ── Purple ────────────────────────────────────────────
  purple: "#6B4FCC",
  purpleInk: "#5B3FBB",
  //  7,31:1 sur surface
  purpleBorder: "#C4B8F0",
  purpleL: "#EDE8FC",
  purpleD: "#2D1A7A",
  // ── Pink / Coral ──────────────────────────────────────
  pink: "#C430A5",
  pinkInk: "#A82A8E",
  pinkBorder: "#F0B0E6",
  pinkL: "#FCE8F8",
  pinkD: "#6B0858",
  coral: "#C4306A",
  coralInk: "#A82859",
  coralBorder: "#F0B0CC",
  coralL: "#FCE8F0",
  coralD: "#6B0830",
  // ── Blue ──────────────────────────────────────────────
  blue: "#1E62C7",
  blueInk: "#1B58B2",
  blueBorder: "#A8C8F0",
  blueL: "#E2EFFE",
  blueD: "#0A2E6E",
  // ── Teal ──────────────────────────────────────────────
  teal: "#1A8276",
  tealInk: "#0E6E63",
  //  6,12:1 sur surface
  tealBorder: "#A0DED8",
  tealL: "#DFF6F2",
  tealD: "#0C3D38",
  // ── États ─────────────────────────────────────────────
  danger: "#B83030",
  //  5,99:1 sur surface
  dangerInk: "#A02828",
  dangerBorder: "#EBB4B4",
  dangerL: "#FCEAEA",
  dangerD: "#7A1414",
  success: "#0F7343",
  successL: "#DCF5E8",
  // ── Focus (WCAG 2.4.7 / 2.4.11) ───────────────────────
  focus: "#0A4FB0"
};
var DARK = {
  ...shape,
  // ── Fonds ─────────────────────────────────────────────
  bg: "#1A1008",
  // brun très sombre, chaud (pas gris froid)
  surface: "#26180A",
  surface2: "#321F0D",
  border: "#4A2E14",
  // décor
  borderStrong: "#8B6636",
  // 3,33:1 sur surface — contrôle
  borderSoft: "#3A2410",
  // ── Textes ────────────────────────────────────────────
  text: "#F5E8D8",
  text2: "#C0A882",
  //  8,17:1 sur bg
  text3: "#A08A74",
  //  5,24:1 sur surface (l'ancien #8A7260 : 3,82 ❌)
  // ── Primaire ──────────────────────────────────────────
  // En sombre, l'orange d'origine passe (4,94:1 sur surface) : on le garde
  // comme accent, et le bouton reste lisible avec un texte foncé.
  primary: "#F2762F",
  primaryBtn: "#E85D1A",
  primaryInk: "#FFAA78",
  primaryBorder: "#7A3A12",
  primaryL: "#3D1E08",
  primaryD: "#FFAA78",
  // ── Accents propres au thème sombre ───────────────────
  // Tous ≥ 6,9:1 sur surface — c'est ce qui manquait totalement avant.
  amber: "#F0AE55",
  // 8,95:1
  amberInk: "#F0AE55",
  amberBorder: "#5A3D12",
  amberL: "#3A2508",
  amberD: "#FFCC88",
  green: "#5FD494",
  // 9,31:1
  greenInk: "#5FD494",
  greenBorder: "#1E5638",
  greenL: "#0A2518",
  greenD: "#6ADBA0",
  purple: "#B49CF5",
  // 7,40:1
  purpleInk: "#B49CF5",
  purpleBorder: "#3A2A78",
  purpleL: "#1A1038",
  purpleD: "#C4B4F8",
  pink: "#F07ADA",
  // 6,98:1
  pinkInk: "#F07ADA",
  pinkBorder: "#5A1A4E",
  pinkL: "#2A0826",
  pinkD: "#F4A0EA",
  coral: "#F07AA0",
  // 6,57:1
  coralInk: "#F07AA0",
  coralBorder: "#5A1A32",
  coralL: "#2A0818",
  coralD: "#F4A0C8",
  blue: "#6FA8F0",
  // 7,01:1
  blueInk: "#6FA8F0",
  blueBorder: "#1E3C6E",
  blueL: "#081830",
  blueD: "#90C4F8",
  teal: "#5CCBBE",
  // 8,82:1
  tealInk: "#5CCBBE",
  tealBorder: "#154A44",
  tealL: "#081E1A",
  tealD: "#80D8D0",
  // ── États ─────────────────────────────────────────────
  danger: "#FF8A8A",
  // 7,60:1 (l'ancien #B83030 : 2,88 ❌)
  dangerInk: "#FF8A8A",
  dangerBorder: "#5E1C1C",
  dangerL: "#280808",
  dangerD: "#FFB0B0",
  success: "#5FD494",
  successL: "#0A2518",
  focus: "#8CBCF5"
};
var FONTS = {
  title: '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif',
  body: '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif',
  ui: '"Poppins", system-ui, -apple-system, "Segoe UI", sans-serif'
};
var R = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
  pill: 999
};
var T = {
  micro: 11,
  // labels de navigation, numéros de case, intitulés
  small: 13,
  // méta-texte, légendes
  body: 15,
  // texte courant, réponses de quiz
  lead: 17,
  // chapô
  h3: 19,
  h2: 23,
  h1: 27
};
var TAP = {
  min: 44,
  comfy: 48,
  fret: 44,
  // hauteur de corde en mode quiz/exercice (était 28)
  fretW: 42
  // largeur de case (était 36)
};
var MODULE = {
  neck: { icon: "map-2", color: "amber", label: "Manche" },
  scales: { icon: "music", color: "green", label: "Gammes" },
  harmony: { icon: "stack-2", color: "purple", label: "Harmonie" },
  impro: { icon: "wand", color: "pink", label: "Impro" },
  rhythm: { icon: "metronome", color: "blue", label: "Rythme" },
  ear: { icon: "ear", color: "teal", label: "Oreille" }
};

// src/design/ThemeContext.jsx
var ThemeContext_exports = {};
__export(ThemeContext_exports, {
  ThemeContext: () => ThemeContext,
  ThemeProvider: () => ThemeProvider,
  useC: () => useC,
  useTheme: () => useTheme
});
import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
var ThemeContext = createContext({ C: LIGHT, theme: "light", resolvedTheme: "light" });
function ThemeProvider({ children, theme = "auto" }) {
  const [sysDark, setSysDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSysDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const resolvedTheme = theme === "auto" ? sysDark ? "dark" : "light" : theme;
  const C = resolvedTheme === "dark" ? DARK : LIGHT;
  useEffect(() => {
    document.documentElement.style.background = C.bg;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [C.bg, resolvedTheme]);
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value: { C, theme, resolvedTheme }, children });
}
function useC() {
  return useContext(ThemeContext).C;
}
function useTheme() {
  return useContext(ThemeContext);
}

// src/design/icons.js
var ICONS = {
  "tuning-fork": [0, '<path d="M9 3v7a3 3 0 0 0 6 0v-7" /> <path d="M12 13v8" /> <path d="M8 3h2" /> <path d="M14 3h2" />'],
  "alert-circle": [0, '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M12 8v4" /> <path d="M12 16h.01" />'],
  "alert-triangle": [0, '<path d="M12 9v4" /> <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /> <path d="M12 16h.01" />'],
  "arrow-left": [0, '<path d="M5 12l14 0" /> <path d="M5 12l6 6" /> <path d="M5 12l6 -6" />'],
  "arrow-narrow-right": [0, '<path d="M5 12l14 0" /> <path d="M15 16l4 -4" /> <path d="M15 8l4 4" />'],
  "arrow-right": [0, '<path d="M5 12l14 0" /> <path d="M13 18l6 -6" /> <path d="M13 6l6 6" />'],
  "arrows-up-down": [0, '<path d="M7 3l0 18" /> <path d="M10 6l-3 -3l-3 3" /> <path d="M20 18l-3 3l-3 -3" /> <path d="M17 21l0 -18" />'],
  "baby-carriage": [0, '<path d="M8 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M18 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M2 5h2.5l1.632 4.897a6 6 0 0 0 5.693 4.103h2.675a5.5 5.5 0 0 0 0 -11h-.5v6" /> <path d="M6 9h14" /> <path d="M9 17l1 -3" /> <path d="M16 14l1 3" />'],
  "bolt": [0, '<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" />'],
  "book-2": [0, '<path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z" /> <path d="M19 16h-12a2 2 0 0 0 -2 2" /> <path d="M9 8h6" />'],
  "books": [0, '<path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /> <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /> <path d="M5 8h4" /> <path d="M9 16h4" /> <path d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z" /> <path d="M14 9l4 -1" /> <path d="M16 16l3.923 -.98" />'],
  "bulb": [0, '<path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" /> <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" /> <path d="M9.7 17l4.6 0" />'],
  "calendar-check": [0, '<path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6" /> <path d="M16 3v4" /> <path d="M8 3v4" /> <path d="M4 11h16" /> <path d="M15 19l2 2l4 -4" />'],
  "campfire": [0, '<path d="M4 21l16 -4" /> <path d="M20 21l-16 -4" /> <path d="M12 15a4 4 0 0 0 4 -4c0 -3 -2 -3 -2 -8c-4 2 -6 5 -6 8a4 4 0 0 0 4 4z" />'],
  "chart-bar": [0, '<path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /> <path d="M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /> <path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /> <path d="M4 20h14" />'],
  "check": [0, '<path d="M5 12l5 5l10 -10" />'],
  "chevron-down": [0, '<path d="M6 9l6 6l6 -6" />'],
  "chevron-left": [0, '<path d="M15 6l-6 6l6 6" />'],
  "chevron-right": [0, '<path d="M9 6l6 6l-6 6" />'],
  "chevron-up": [0, '<path d="M6 15l6 -6l6 6" />'],
  "circle-check": [0, '<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /> <path d="M9 12l2 2l4 -4" />'],
  "circle-check-filled": [1, '<path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />'],
  "clipboard-check": [0, '<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /> <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /> <path d="M9 14l2 2l4 -4" />'],
  "clock": [0, '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M12 7v5l3 3" />'],
  "crown": [0, '<path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />'],
  "device-desktop": [0, '<path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z" /> <path d="M7 20h10" /> <path d="M9 16v4" /> <path d="M15 16v4" />'],
  "dice-5": [0, '<path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /> <circle cx="8.5" cy="8.5" r=".5" fill="currentColor" /> <circle cx="15.5" cy="8.5" r=".5" fill="currentColor" /> <circle cx="15.5" cy="15.5" r=".5" fill="currentColor" /> <circle cx="8.5" cy="15.5" r=".5" fill="currentColor" /> <circle cx="12" cy="12" r=".5" fill="currentColor" />'],
  "download": [0, '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /> <path d="M7 11l5 5l5 -5" /> <path d="M12 4l0 12" />'],
  "ear": [0, '<path d="M6 10a7 7 0 1 1 13 3.6a10 10 0 0 1 -2 2a8 8 0 0 0 -2 3a4.5 4.5 0 0 1 -6.8 1.4" /> <path d="M10 10a3 3 0 1 1 5 2.2" />'],
  "eye": [0, '<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /> <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />'],
  "eye-off": [0, '<path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /> <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /> <path d="M3 3l18 18" />'],
  "flag": [0, '<path d="M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1 -7 0a5 5 0 0 0 -7 0v-9z" /> <path d="M5 21v-7" />'],
  "flame": [0, '<path d="M12 12c2 -2.96 0 -7 -1 -8c0 3.038 -1.773 4.741 -3 6c-1.226 1.26 -2 3.24 -2 5a6 6 0 1 0 12 0c0 -1.532 -1.056 -3.94 -2 -5c-1.786 3 -2.791 3 -4 2z" />'],
  "guitar-pick": [0, '<path d="M16 18.5c2 -2.5 4 -6.5 4 -10.5c0 -2.946 -2.084 -4.157 -4.204 -4.654c-.864 -.23 -2.13 -.346 -3.796 -.346c-1.667 0 -2.932 .115 -3.796 .346c-2.12 .497 -4.204 1.708 -4.204 4.654c0 3.312 2 8 4 10.5c.297 .37 .618 .731 .963 1.081l.354 .347a3.9 3.9 0 0 0 5.364 0a14.05 14.05 0 0 0 1.319 -1.428z" />'],
  "hand-finger-down": [0, '<path d="M8 12v8.5a1.5 1.5 0 0 0 3 0v-7.5" /> <path d="M11 13.5v2a1.5 1.5 0 0 0 3 0v-2.5" /> <path d="M14 14.5a1.5 1.5 0 0 0 3 0v-1.5" /> <path d="M17 13.5a1.5 1.5 0 0 0 3 0v-4.5a6 6 0 0 0 -6 -6h-2h.208a6 6 0 0 0 -5.012 2.7l-.196 .3q -.468 .718 -3.286 5.728a1.5 1.5 0 0 0 .536 2.022c.734 .44 1.674 .325 2.28 -.28l1.47 -1.47" />'],
  "headphones": [0, '<path d="M4 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" /> <path d="M15 13m0 2a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2z" /> <path d="M4 15v-3a8 8 0 0 1 16 0v3" />'],
  "help-circle": [0, '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M12 16v.01" /> <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />'],
  "history": [0, '<path d="M12 8l0 4l2 2" /> <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />'],
  "home": [0, '<path d="M5 12l-2 0l9 -9l9 9l-2 0" /> <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /> <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />'],
  "info-circle": [0, '<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /> <path d="M12 9h.01" /> <path d="M11 12h1v4h1" />'],
  "list-numbers": [0, '<path d="M11 6h9" /> <path d="M11 12h9" /> <path d="M12 18h8" /> <path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" /> <path d="M6 10v-6l-2 2" />'],
  "loader": [0, '<path d="M12 6l0 -3" /> <path d="M16.25 7.75l2.15 -2.15" /> <path d="M18 12l3 0" /> <path d="M16.25 16.25l2.15 2.15" /> <path d="M12 18l0 3" /> <path d="M7.75 16.25l-2.15 2.15" /> <path d="M6 12l-3 0" /> <path d="M7.75 7.75l-2.15 -2.15" />'],
  "lock": [0, '<path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" /> <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /> <path d="M8 11v-4a4 4 0 1 1 8 0v4" />'],
  "logout": [0, '<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /> <path d="M9 12h12l-3 -3" /> <path d="M18 15l3 -3" />'],
  "map-2": [0, '<path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5" /> <path d="M9 4v13" /> <path d="M15 7v5.5" /> <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" /> <path d="M19 18v.01" />'],
  "medal": [0, '<path d="M12 4v3m-4 -3v6m8 -6v6" /> <path d="M12 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z" />'],
  "metronome": [0, '<path d="M14.153 8.188l-.72 -3.236a2.493 2.493 0 0 0 -4.867 0l-3.025 13.614a2 2 0 0 0 1.952 2.434h7.014a2 2 0 0 0 1.952 -2.434l-.524 -2.357m-4.935 1.791l9 -13" /> <path d="M20 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />'],
  "microphone": [0, '<path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" /> <path d="M5 10a7 7 0 0 0 14 0" /> <path d="M8 21l8 0" /> <path d="M12 17l0 4" />'],
  "minus": [0, '<path d="M5 12l14 0" />'],
  "moon": [0, '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />'],
  "mountain": [0, '<path d="M3 20h18l-6.921 -14.612a2.3 2.3 0 0 0 -4.158 0l-6.921 14.612z" /> <path d="M7.5 11l2 2.5l2.5 -2.5l2 3l2.5 -2" />'],
  "music": [0, '<path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /> <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /> <path d="M9 17v-13h10v13" /> <path d="M9 8h10" />'],
  "music-plus": [0, '<path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /> <path d="M9 17v-13h10v8" /> <path d="M9 8h10" /> <path d="M16 19h6" /> <path d="M19 16v6" />'],
  "notebook": [0, '<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" /> <path d="M13 8l2 0" /> <path d="M13 12l2 0" />'],
  "player-pause": [0, '<path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /> <path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />'],
  "player-pause-filled": [1, '<path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /> <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />'],
  "player-play": [0, '<path d="M7 4v16l13 -8z" />'],
  "player-play-filled": [1, '<path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />'],
  "player-stop": [0, '<path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />'],
  "player-stop-filled": [1, '<path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" />'],
  "plus": [0, '<path d="M12 5l0 14" /> <path d="M5 12l14 0" />'],
  "refresh": [0, '<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /> <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />'],
  "route": [0, '<path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /> <path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4z" /> <path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" />'],
  "settings": [0, '<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /> <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />'],
  "sparkles": [0, '<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />'],
  "stack-2": [0, '<path d="M12 4l-8 4l8 4l8 -4l-8 -4" /> <path d="M4 12l8 4l8 -4" /> <path d="M4 16l8 4l8 -4" />'],
  "stairs": [0, '<path d="M22 5h-5v5h-5v5h-5v5h-5" />'],
  "star": [0, '<path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />'],
  "star-filled": [1, '<path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />'],
  "sun": [0, '<path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /> <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />'],
  "sword": [0, '<path d="M20 4v5l-9 7l-4 4l-3 -3l4 -4l7 -9z" /> <path d="M6.5 11.5l6 6" />'],
  "target": [0, '<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /> <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" /> <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />'],
  "target-arrow": [0, '<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /> <path d="M12 7a5 5 0 1 0 5 5" /> <path d="M13 3.055a9 9 0 1 0 7.941 7.945" /> <path d="M15 6v3h3l3 -3h-3v-3z" /> <path d="M15 9l-3 3" />'],
  "trash": [0, '<path d="M4 7l16 0" /> <path d="M10 11l0 6" /> <path d="M14 11l0 6" /> <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /> <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />'],
  "trending-up": [0, '<path d="M3 17l6 -6l4 4l8 -8" /> <path d="M14 7l7 0l0 7" />'],
  "trophy": [0, '<path d="M8 21l8 0" /> <path d="M12 17l0 4" /> <path d="M7 4l10 0" /> <path d="M17 4v8a5 5 0 0 1 -10 0v-8" /> <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /> <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />'],
  "upload": [0, '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /> <path d="M7 9l5 -5l5 5" /> <path d="M12 4l0 12" />'],
  "volume": [0, '<path d="M15 8a5 5 0 0 1 0 8" /> <path d="M17.7 5a9 9 0 0 1 0 14" /> <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />'],
  "wand": [0, '<path d="M6 21l15 -15l-3 -3l-15 15l3 3" /> <path d="M15 6l3 3" /> <path d="M9 3a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" /> <path d="M19 13a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />'],
  "x": [0, '<path d="M18 6l-12 12" /> <path d="M6 6l12 12" />']
};
var ICON_COUNT = Object.keys(ICONS).length;

// src/design/Ti.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Ti({ name, size = 16, color = "currentColor", style, label, stroke }) {
  const cle = String(name || "").replace(/^ti-/, "");
  const icone = ICONS[cle];
  const commun = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    // `block` évite l'espace fantôme sous les éléments en ligne, qui
    // désalignait les icônes dans les boutons.
    style: { display: "block", flexShrink: 0, ...style },
    "aria-hidden": label ? void 0 : "true",
    role: label ? "img" : void 0,
    "aria-label": label || void 0
  };
  if (!icone) {
    if (typeof import.meta !== "undefined" && false) {
      console.warn(`[Ti] ic\xF4ne inconnue : "${cle}"`);
    }
    return /* @__PURE__ */ jsx2("svg", { ...commun, fill: "none", stroke: color, strokeWidth: 1.5, opacity: 0.45, children: /* @__PURE__ */ jsx2("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3" }) });
  }
  const [plein, trac\u00E9s] = icone;
  const props = plein ? { fill: color, stroke: "none" } : {
    fill: "none",
    stroke: color,
    strokeWidth: stroke ?? (size < 14 ? 1.75 : 2),
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  return /* @__PURE__ */ jsx2(
    "svg",
    {
      ...commun,
      ...props,
      dangerouslySetInnerHTML: { __html: trac\u00E9s }
    }
  );
}

// src/design/ui.jsx
import { useEffect as useEffect2, useRef } from "react";
import { Fragment, jsx as jsx3, jsxs } from "react/jsx-runtime";
function ProgressBar({ pct, color, h = 6, label }) {
  const C = useC();
  const valeur = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
  return /* @__PURE__ */ jsx3(
    "div",
    {
      role: "progressbar",
      "aria-valuenow": valeur,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-label": label || "Progression",
      style: { background: C.border, borderRadius: 999, overflow: "hidden", height: h },
      children: /* @__PURE__ */ jsx3("div", { style: {
        width: `${valeur}%`,
        height: "100%",
        background: color || C.primary,
        borderRadius: 999,
        transition: "width 0.4s ease"
      } })
    }
  );
}
function XPPop({ amount, onDone }) {
  const C = useC();
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect2(() => {
    const t = setTimeout(() => doneRef.current?.(), 1400);
    return () => clearTimeout(t);
  }, []);
  if (!amount || amount <= 0) return null;
  return /* @__PURE__ */ jsxs("div", { role: "status", "aria-live": "polite", style: {
    position: "fixed",
    bottom: 92,
    left: "50%",
    transform: "translateX(-50%)",
    background: C.primaryBtn,
    color: "#fff",
    padding: "9px 18px",
    borderRadius: 999,
    fontSize: T.body,
    fontWeight: 700,
    fontFamily: FONTS.ui,
    zIndex: 200,
    pointerEvents: "none",
    animation: "fadeUp 1.4s ease forwards",
    boxShadow: "0 6px 20px rgba(0,0,0,.18)"
  }, children: [
    "+",
    amount,
    " XP"
  ] });
}
function ConfirmDialog({
  titre,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
  motDeConfirmation = null,
  onConfirm,
  onCancel,
  saisie,
  onSaisie
}) {
  const C = useC();
  const pret = !motDeConfirmation || (saisie || "").trim().toUpperCase() === motDeConfirmation.toUpperCase();
  useEffect2(() => {
    const auClavier = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", auClavier);
    return () => document.removeEventListener("keydown", auClavier);
  }, [onCancel]);
  return /* @__PURE__ */ jsx3(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": titre,
      onClick: (e) => {
        if (e.target === e.currentTarget) onCancel?.();
      },
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "rgba(20,14,8,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      },
      children: /* @__PURE__ */ jsxs("div", { style: {
        background: C.surface,
        borderRadius: 20,
        padding: 22,
        maxWidth: 340,
        width: "100%",
        border: `1.5px solid ${C.border}`,
        fontFamily: FONTS.ui,
        boxShadow: "0 20px 60px rgba(0,0,0,.3)"
      }, children: [
        /* @__PURE__ */ jsx3("div", { style: { fontSize: T.h3, fontWeight: 800, color: C.text, marginBottom: 8 }, children: titre }),
        /* @__PURE__ */ jsx3("p", { style: { fontSize: T.small, color: C.text2, lineHeight: 1.6, margin: "0 0 16px" }, children: message }),
        motDeConfirmation && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "confirm-word", style: { fontSize: 12, color: C.text2, display: "block", marginBottom: 6 }, children: [
            "Tape ",
            /* @__PURE__ */ jsx3("strong", { style: { color: C.text }, children: motDeConfirmation }),
            " pour confirmer"
          ] }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              id: "confirm-word",
              value: saisie || "",
              onChange: (e) => onSaisie?.(e.target.value),
              autoComplete: "off",
              autoCapitalize: "characters",
              className: "gr-focus",
              style: {
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                borderRadius: 12,
                border: `1.5px solid ${C.borderStrong}`,
                fontSize: 16,
                background: C.surface2,
                color: C.text,
                fontFamily: FONTS.ui,
                marginBottom: 16
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: () => pret && onConfirm?.(),
              disabled: !pret,
              className: "gr-focus",
              style: {
                padding: "14px",
                borderRadius: 12,
                border: "none",
                minHeight: 48,
                background: !pret ? C.surface2 : danger ? C.danger : C.primaryBtn,
                color: !pret ? C.text3 : "#fff",
                fontWeight: 700,
                fontSize: T.body,
                fontFamily: FONTS.ui,
                cursor: pret ? "pointer" : "not-allowed"
              },
              children: confirmLabel
            }
          ),
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: () => onCancel?.(),
              className: "gr-focus",
              style: {
                padding: "14px",
                borderRadius: 12,
                minHeight: 48,
                background: "none",
                border: `1.5px solid ${C.border}`,
                color: C.text,
                fontWeight: 600,
                fontSize: T.body,
                fontFamily: FONTS.ui,
                cursor: "pointer"
              },
              children: cancelLabel
            }
          )
        ] })
      ] })
    }
  );
}

// src/store/moduleTheme.js
function buildModuleTheme(C) {
  return {
    neck: { icon: "ti-map-2", color: C.amber, colorL: C.amberL, colorD: C.amberD, colorBorder: C.amberBorder },
    scales: { icon: "ti-music", color: C.green, colorL: C.greenL, colorD: C.greenD, colorBorder: C.greenBorder },
    harmony: { icon: "ti-stack-2", color: C.purple, colorL: C.purpleL, colorD: C.purpleD, colorBorder: C.purpleBorder },
    rhythm: { icon: "ti-metronome", color: C.blue, colorL: C.blueL, colorD: C.blueD, colorBorder: C.blueBorder },
    impro: { icon: "ti-wand", color: C.pink, colorL: C.pinkL, colorD: C.pinkD, colorBorder: C.pinkBorder },
    // Thème neutre pour une unité-palier : elle mélange plusieurs
    // disciplines, aucune couleur de module ne lui appartient en propre.
    palier: { icon: "ti-stairs", color: C.primary, colorL: C.primaryL, colorD: C.primaryD, colorBorder: C.primaryBorder }
  };
}
var MODULE_THEME = buildModuleTheme(LIGHT);

// src/store/pathEngine.js
var UNIT_CHECK_PASS_PCT = 70;
var MODULE_ORDER = ["neck", "scales", "harmony", "rhythm", "impro"];
var MAX_LEVEL = 9;
var SPLIT_THRESHOLD = 8;
var TARGET_UNIT_SIZE = 6;
var UNIT_BONUS_PER_LESSON = 10;
var unitBonusXp = (lessonCount) => Math.max(20, Math.min(150, Math.round((lessonCount || 0) * UNIT_BONUS_PER_LESSON)));
var UNIT_BONUS_XP = 40;
var unitCheckSize = (lessonCount) => Math.max(4, Math.min(14, Math.round(4 + (lessonCount || 0) / 2)));
var UNIT_CHECK_MAX_QUESTIONS = 14;
var TIER_HEADSTART = { A1: 0, A2: 1, B1: 2, B2: 3 };
function moduleOrderFor(state) {
  const ob = state?.onboarding || {};
  const head = [];
  for (const m of [ob.weakestModule, ob.preferredModule]) {
    if (m && MODULE_ORDER.includes(m) && !head.includes(m)) head.push(m);
  }
  return [...head, ...MODULE_ORDER.filter((m) => !head.includes(m))];
}
function chunkEvenly(list, threshold = SPLIT_THRESHOLD, target = TARGET_UNIT_SIZE) {
  if (list.length <= threshold) return [list];
  const parts = Math.max(2, Math.ceil(list.length / target));
  const size = Math.ceil(list.length / parts);
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  if (out.length > 1 && out[out.length - 1].length === 1) {
    out[out.length - 2] = [...out[out.length - 2], ...out.pop()];
  }
  return out;
}
function buildUnits(courses = [], state = null) {
  const order = moduleOrderFor(state);
  const allLessons = courses.flatMap(
    (c) => (c.lessons || []).map((l) => ({ ...l, courseId: c.id, courseTitle: c.title }))
  );
  for (const l of allLessons) if (l.level == null) l.level = MAX_LEVEL;
  const units = [];
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const lessons = allLessons.filter((l) => l.level === level);
    if (lessons.length === 0) continue;
    const rank = (id) => {
      const i = order.indexOf(id);
      return i === -1 ? order.length : i;
    };
    lessons.sort((a, b) => rank(a.courseId) - rank(b.courseId));
    const chunks = chunkEvenly(lessons);
    chunks.forEach((chunk, partIdx) => {
      const stock = new Set(chunk.flatMap((l) => l.quiz || [])).size;
      const checkSize = Math.max(3, Math.min(unitCheckSize(chunk.length), stock || 3));
      units.push({
        id: chunks.length > 1 ? `palier-${level}-${partIdx + 1}` : `palier-${level}`,
        level,
        part: chunks.length > 1 ? partIdx + 1 : null,
        parts: chunks.length,
        title: chunks.length > 1 ? `Palier ${level} \xB7 partie ${partIdx + 1}` : `Palier ${level}`,
        courseIds: [...new Set(chunk.map((l) => l.courseId))],
        lessons: chunk,
        bonusXp: unitBonusXp(chunk.length),
        checkSize,
        quizPoolSize: stock
      });
    });
  }
  return units;
}
function buildPath(content, state, priorityModules = null) {
  const completed = state?.completedLessons || {};
  const claimed = state?.claimedUnits || {};
  const checks = state?.unitChecks || {};
  const units = buildUnits(content?.courses || [], state);
  const tier = state?.onboarding?.overallTier;
  const headstartCount = state?.onboarding?.done ? TIER_HEADSTART[tier] ?? 0 : 0;
  let prevPassable = true;
  let currentAssigned = false;
  return units.map((u, i) => {
    const done = u.lessons.filter((l) => completed[l.id]).length;
    const total = u.lessons.length;
    const lessonsComplete = total > 0 && done === total;
    const check = checks[u.id] || null;
    const checkPassed = !!check?.passed;
    const complete = lessonsComplete && checkPassed;
    const needsCheck = lessonsComplete && !checkPassed;
    const headstart = i < headstartCount;
    const unlocked = i === 0 || prevPassable || done > 0 || headstart;
    const isCurrent = unlocked && !complete && !currentAssigned && (!headstart || done > 0);
    if (isCurrent) currentAssigned = true;
    prevPassable = complete || headstart;
    return {
      ...u,
      index: i,
      done,
      total,
      complete,
      unlocked,
      isCurrent,
      lessonsComplete,
      needsCheck,
      check,
      headstart,
      bonusClaimable: complete && !claimed[u.id],
      bonusClaimed: !!claimed[u.id]
    };
  });
}
function getUnitQuizPool(unit, allQuiz = null, completedLessons = null) {
  const seen = /* @__PURE__ */ new Set();
  const core = [];
  for (const lesson of unit?.lessons || []) {
    for (const qid of lesson.quiz || []) {
      if (!seen.has(qid)) {
        seen.add(qid);
        core.push(qid);
      }
    }
  }
  if (!Array.isArray(allQuiz) || allQuiz.length === 0) {
    return Object.assign([...core], { core, extra: [] });
  }
  const modules = new Set(unit?.courseIds || []);
  const lessonIds = new Set((unit?.lessons || []).map((l) => l.id));
  const extra = [];
  for (const q of allQuiz) {
    if (seen.has(q.id)) continue;
    if (!modules.has(q.courseId)) continue;
    if (q.lessonId && !lessonIds.has(q.lessonId) && !completedLessons?.[q.lessonId]) continue;
    seen.add(q.id);
    extra.push(q.id);
  }
  return Object.assign([...core, ...extra], { core, extra });
}
function getNextLesson(content, state) {
  const completed = state?.completedLessons || {};
  const path = buildPath(content, state);
  let pendingCheckUnit = null;
  const ordered = [...path.filter((u) => u.isCurrent), ...path];
  const seen = /* @__PURE__ */ new Set();
  for (const u of ordered) {
    if (!u.unlocked || seen.has(u.id)) continue;
    seen.add(u.id);
    if (u.needsCheck && !pendingCheckUnit) pendingCheckUnit = u;
    for (const lesson of u.lessons) {
      if (!completed[lesson.id]) {
        const course = (content?.courses || []).find((c) => c.id === lesson.courseId);
        return { course, lesson, unit: u };
      }
    }
  }
  if (pendingCheckUnit) return { course: null, lesson: null, unit: pendingCheckUnit, needsCheck: true };
  return null;
}
function getPathStats(content, state) {
  const path = buildPath(content, state);
  const totalLessons = path.reduce((a, u) => a + u.total, 0);
  const doneLessons = path.reduce((a, u) => a + u.done, 0);
  const currentUnit = path.find((u) => u.isCurrent) || null;
  return {
    units: path.length,
    completedUnits: path.filter((u) => u.complete).length,
    totalLessons,
    doneLessons,
    pct: totalLessons > 0 ? Math.round(doneLessons / totalLessons * 100) : 0,
    currentUnit
  };
}

// src/screens/UnitCheckScreen.jsx
var UnitCheckScreen_exports = {};
__export(UnitCheckScreen_exports, {
  UnitCheckScreen: () => UnitCheckScreen
});
import { useState as useState3, useRef as useRef2 } from "react";

// src/design/Gropi.jsx
import { useState as useState2 } from "react";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var POSE_SRC = {
  happy: "/mascotte-happy.svg",
  wave: "/mascotte-wave.svg",
  celebrate: "/mascotte-celebrate.svg",
  think: "/mascotte-think.svg",
  rocker: "/mascotte-rocker.svg",
  idea: "/mascotte-idea.svg",
  pride: "/mascotte-pride.svg",
  listen: "/mascotte-listen.svg",
  zen: "/mascotte-zen.svg",
  mystere: "/mascotte-mystere.svg",
  choix: "/mascotte-choix.svg",
  histoire: "/mascotte-histoire.svg",
  // alias de repli
  plead: "/mascotte-think.svg"
};
if (typeof document !== "undefined" && !document.getElementById("gropi-anim-styles")) {
  const s = document.createElement("style");
  s.id = "gropi-anim-styles";
  s.textContent = `
    @keyframes gropi-bob    { 0%,100%{transform:translateY(0)}      50%{transform:translateY(-6px)} }
    @keyframes gropi-pop    { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
    @keyframes gropi-wiggle { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-8deg)} 60%{transform:rotate(8deg)} }
    @keyframes gropi-cheer  { 0%{transform:scale(.5) translateY(22px);opacity:0} 50%{transform:scale(1.12) translateY(-8px)} 72%{transform:scale(.97)} 100%{transform:scale(1) translateY(0);opacity:1} }
    @keyframes gropi-bubble-in { 0%{transform:scale(.92) translateY(4px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
    .gropi-anim { will-change: transform; }
    @media (prefers-reduced-motion: reduce) { .gropi-anim { animation: none !important; } }
  `;
  document.head.appendChild(s);
}
var ANIM = {
  none: {},
  bob: { animation: "gropi-bob 2.8s ease-in-out infinite" },
  pop: { animation: "gropi-pop .42s ease-out both" },
  wiggle: { animation: "gropi-wiggle 2.4s ease-in-out infinite", transformOrigin: "bottom center" },
  cheer: { animation: "gropi-cheer .62s cubic-bezier(.2,.8,.3,1.2) both" }
};
function Gropi({ pose = "happy", size = 80, anim = "none", style, onClick }) {
  const C = useC();
  const src = POSE_SRC[pose] || POSE_SRC.happy;
  return /* @__PURE__ */ jsx4(
    "img",
    {
      src,
      alt: "",
      draggable: false,
      onClick,
      className: anim !== "none" ? "gropi-anim" : void 0,
      style: {
        display: "block",
        width: size,
        height: "auto",
        // Garde-fou : si un fichier a un ratio inattendu (trop haut), il
        // ne peut plus faire déborder la mise en page — object-fit:contain
        // garantit que l'image se réduit proportionnellement plutôt que
        // de se déformer si ce plafond se déclenche.
        maxHeight: size * 1.6,
        objectFit: "contain",
        flexShrink: 0,
        userSelect: "none",
        cursor: onClick ? "pointer" : void 0,
        ...ANIM[anim] || {},
        ...style
      }
    }
  );
}
function useTintColors(tint) {
  const C = useC();
  return {
    light: C[tint + "L"] || C.primaryL,
    border: C[tint + "Border"] || C[tint + "B"] || C.primaryBorder,
    deep: C[tint + "D"] || C.primaryD
  };
}
function GropiTip({ pose = "wave", tint = "primary", eyebrow = "Conseil de Gropi", onClose, children }) {
  const C = useC();
  const { light, border, deep } = useTintColors(tint);
  return /* @__PURE__ */ jsxs2("div", { style: {
    display: "flex",
    gap: 11,
    alignItems: "flex-start",
    position: "relative",
    background: C.surface,
    border: `1.5px solid ${border}`,
    borderRadius: R.xl,
    padding: 12
  }, children: [
    /* @__PURE__ */ jsx4(Gropi, { pose, size: 56, anim: "bob" }),
    /* @__PURE__ */ jsxs2("div", { style: { position: "relative", flex: 1, background: light, borderRadius: R.lg, padding: "9px 11px" }, children: [
      /* @__PURE__ */ jsx4("span", { style: {
        position: "absolute",
        left: -7,
        top: 16,
        width: 0,
        height: 0,
        borderTop: "7px solid transparent",
        borderBottom: "7px solid transparent",
        borderRight: `7px solid ${light}`
      } }),
      /* @__PURE__ */ jsx4("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: deep, fontFamily: FONTS.ui }, children: eyebrow }),
      /* @__PURE__ */ jsx4("p", { style: { margin: "3px 0 0", fontSize: 14, lineHeight: 1.55, fontWeight: 500, color: C.text, fontFamily: FONTS.body }, children })
    ] }),
    onClose && /* @__PURE__ */ jsx4("button", { onClick: onClose, "aria-label": "Fermer", style: {
      position: "absolute",
      top: 2,
      right: 2,
      background: "none",
      border: 0,
      cursor: "pointer",
      fontSize: 15,
      fontWeight: 600,
      color: C.text2,
      width: 44,
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12
    }, className: "gr-focus", children: "\u2715" })
  ] });
}
var COACH = {
  tip: { pose: "idea", tint: "amber", eyebrow: "Le conseil de Gropi" },
  ref: { pose: "listen", tint: "primary", eyebrow: "Gropi te fait \xE9couter" },
  note: { pose: "think", tint: "green", eyebrow: "Gropi pr\xE9cise" }
};
function GropiCoach({ variant = "tip", eyebrow, children }) {
  const C = useC();
  const cfg = COACH[variant] || COACH.tip;
  const { light, border, deep } = useTintColors(cfg.tint);
  return /* @__PURE__ */ jsxs2("div", { style: { display: "flex", gap: 9, alignItems: "flex-end", margin: "2px 0" }, children: [
    /* @__PURE__ */ jsx4(Gropi, { pose: cfg.pose, size: 54, anim: "bob", style: { marginBottom: 2 } }),
    /* @__PURE__ */ jsxs2("div", { style: {
      position: "relative",
      flex: 1,
      background: light,
      border: `1.5px solid ${border}`,
      borderRadius: R.lg,
      borderBottomLeftRadius: 4,
      padding: "10px 13px"
    }, children: [
      /* @__PURE__ */ jsx4("span", { style: {
        position: "absolute",
        left: -7,
        bottom: 13,
        width: 0,
        height: 0,
        borderTop: "7px solid transparent",
        borderBottom: "7px solid transparent",
        borderRight: `7px solid ${light}`
      } }),
      /* @__PURE__ */ jsx4("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: deep, fontFamily: FONTS.ui, marginBottom: 3 }, children: eyebrow || cfg.eyebrow }),
      /* @__PURE__ */ jsx4("p", { style: { margin: 0, fontSize: 14, lineHeight: 1.6, color: C.text, fontFamily: FONTS.body }, children })
    ] })
  ] });
}
function GropiBubble({
  pose = "wave",
  size = 74,
  tint = "primary",
  eyebrow = "Gropi",
  side = "right",
  children,
  defaultOpen = false
}) {
  const C = useC();
  const [open, setOpen] = useState2(defaultOpen);
  const { light, border, deep } = useTintColors(tint);
  return /* @__PURE__ */ jsxs2("div", { style: { display: "flex", flexDirection: "column", alignItems: side === "right" ? "flex-start" : "flex-end" }, children: [
    /* @__PURE__ */ jsx4(
      "button",
      {
        onClick: () => setOpen((o) => !o),
        "aria-label": "Parler \xE0 Gropi",
        "aria-expanded": open,
        style: { background: "none", border: 0, padding: 0, cursor: "pointer", lineHeight: 0 },
        children: /* @__PURE__ */ jsx4(Gropi, { pose, size, anim: open ? "none" : "bob" })
      }
    ),
    open && /* @__PURE__ */ jsxs2("div", { style: {
      marginTop: 8,
      maxWidth: 270,
      background: C.surface,
      border: `1.5px solid ${border}`,
      borderRadius: R.lg,
      padding: "11px 13px",
      boxShadow: `0 6px 20px ${deep}22`,
      animation: "gropi-bubble-in .22s ease both"
    }, children: [
      /* @__PURE__ */ jsx4("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: deep, fontFamily: FONTS.ui, marginBottom: 3 }, children: eyebrow }),
      /* @__PURE__ */ jsx4("p", { style: { margin: 0, fontSize: 14, lineHeight: 1.6, color: C.text, fontFamily: FONTS.body }, children })
    ] })
  ] });
}

// src/screens/UnitCheckScreen.jsx
import { Fragment as Fragment2, jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildSample(unit, content, completedLessons, dejaVues = []) {
  const pool = getUnitQuizPool(unit, content.quiz, completedLessons);
  const parId = new Map(content.quiz.map((q) => [q.id, q]));
  const utilisable = (q) => q && q.type !== "fretboard" && Array.isArray(q.o) && q.o.length >= 2 && typeof q.a === "number" && q.a >= 0 && q.a < q.o.length;
  const resoudre = (ids) => ids.map((id) => parId.get(id)).filter(utilisable);
  const taille = Math.min(
    unit.checkSize ?? UNIT_CHECK_MAX_QUESTIONS,
    pool.length || 1
  );
  const core = resoudre(pool.core ?? pool);
  const extra = resoudre(pool.extra ?? []);
  const ecarte = new Set(dejaVues);
  const parPriorite = (liste) => [
    ...shuffle(liste.filter((q) => !ecarte.has(q.id))),
    ...shuffle(liste.filter((q) => ecarte.has(q.id)))
  ];
  const filesCore = parPriorite(core);
  const filesExtra = parPriorite(extra);
  const cibleCore = Math.max(1, Math.min(
    Math.round(taille * 0.65),
    Math.ceil(core.length / 2)
  ));
  const choisies = [];
  const prises = /* @__PURE__ */ new Set();
  const ajouter = (q) => {
    if (!q || prises.has(q.id) || choisies.length >= taille) return;
    prises.add(q.id);
    choisies.push(q);
  };
  for (const q of filesCore) {
    if (choisies.length >= cibleCore) break;
    ajouter(q);
  }
  for (const q of filesExtra) {
    if (choisies.length >= taille) break;
    ajouter(q);
  }
  for (const q of filesCore) {
    if (choisies.length >= taille) break;
    ajouter(q);
  }
  return shuffle(choisies);
}
function melangerOptions(q) {
  if (!Array.isArray(q?.o) || q.o.length < 2) return q;
  const indices = shuffle(q.o.map((_, i) => i));
  return {
    ...q,
    o: indices.map((i) => q.o[i]),
    a: indices.indexOf(q.a)
  };
}
function UnitCheckScreen({ unit, content, dispatch, onDone, state }) {
  const C = useC();
  const completedLessons = state?.completedLessons ?? {};
  const derniereTentative = useRef2([]);
  const [questions, setQuestions] = useState3(() => buildSample(unit, content, completedLessons).map(melangerOptions));
  const [idx, setIdx] = useState3(0);
  const [sel, setSel] = useState3(null);
  const [score, setScore] = useState3(0);
  const [wrongIds, setWrongIds] = useState3([]);
  const [finished, setFinished] = useState3(false);
  if (questions.length === 0) {
    dispatch({ type: "SUBMIT_UNIT_CHECK", unitId: unit.id, pct: 100, passPct: UNIT_CHECK_PASS_PCT, wrongIds: [] });
    onDone();
    return null;
  }
  const q = questions[idx];
  const answered = sel !== null;
  const choose = (i) => {
    if (answered) return;
    setSel(i);
    if (i === q.a) setScore((s) => s + 1);
    else setWrongIds((w) => [...w, q.id]);
  };
  const next = () => {
    if (idx + 1 >= questions.length) {
      const pct = Math.round(score / questions.length * 100);
      dispatch({ type: "SUBMIT_UNIT_CHECK", unitId: unit.id, pct, passPct: UNIT_CHECK_PASS_PCT, wrongIds });
      setFinished(true);
    } else {
      setSel(null);
      setIdx((i) => i + 1);
    }
  };
  const retry = () => {
    derniereTentative.current = questions.map((q2) => q2.id);
    setQuestions(buildSample(unit, content, completedLessons, derniereTentative.current).map(melangerOptions));
    setIdx(0);
    setSel(null);
    setScore(0);
    setWrongIds([]);
    setFinished(false);
  };
  if (finished) {
    const pct = Math.round(score / questions.length * 100);
    const passed = pct >= UNIT_CHECK_PASS_PCT;
    const lessonsToReview = [...new Set(
      wrongIds.map((id) => questions.find((qq) => qq.id === id)?.lessonId).filter(Boolean)
    )].map((lid) => unit.lessons.find((l) => l.id === lid)).filter(Boolean);
    return /* @__PURE__ */ jsxs3("div", { style: { padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx5(Gropi, { pose: passed ? "celebrate" : "think", size: 110, anim: passed ? "cheer" : "pop" }),
      /* @__PURE__ */ jsx5("h1", { style: { margin: "14px 0 4px", fontSize: 21, fontWeight: 800, color: C.text, fontFamily: FONTS.title }, children: passed ? "Unit\xE9 valid\xE9e !" : "Pas encore tout \xE0 fait" }),
      /* @__PURE__ */ jsx5("p", { style: { margin: "0 0 16px", fontSize: 13, color: C.text2, lineHeight: 1.5, maxWidth: 300 }, children: passed ? "Le coffre de cette unit\xE9 est maintenant \xE0 toi." : `Il faut ${UNIT_CHECK_PASS_PCT}% pour valider l'unit\xE9. Tu peux r\xE9essayer, aucune limite de tentatives.` }),
      /* @__PURE__ */ jsxs3("div", { style: { width: "100%", maxWidth: 280 }, children: [
        /* @__PURE__ */ jsxs3("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 }, children: [
          /* @__PURE__ */ jsx5("span", { style: { fontSize: 11, color: C.text3 }, children: "Score" }),
          /* @__PURE__ */ jsxs3("span", { style: { fontSize: 11, fontWeight: 700, color: C.text2 }, children: [
            score,
            "/",
            questions.length,
            " \xB7 ",
            pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx5("div", { style: { height: 7, background: C.border, borderRadius: 99, overflow: "hidden" }, children: /* @__PURE__ */ jsx5("div", { style: { width: `${pct}%`, height: "100%", borderRadius: 99, background: passed ? C.green : C.coral, transition: "width .5s ease" } }) })
      ] }),
      !passed && lessonsToReview.length > 0 && /* @__PURE__ */ jsxs3("div", { style: { width: "100%", maxWidth: 280, marginTop: 18, textAlign: "left" }, children: [
        /* @__PURE__ */ jsx5("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }, children: "\xC0 revoir en priorit\xE9" }),
        lessonsToReview.map((l) => /* @__PURE__ */ jsxs3("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md, marginBottom: 6 }, children: [
          /* @__PURE__ */ jsx5(Ti, { name: "book-2", size: 14, color: C.text3 }),
          /* @__PURE__ */ jsx5("span", { style: { fontSize: 12.5, color: C.text, fontWeight: 600 }, children: l.title })
        ] }, l.id))
      ] }),
      /* @__PURE__ */ jsx5("button", { onClick: onDone, style: {
        width: "100%",
        maxWidth: 280,
        marginTop: 20,
        padding: 14,
        borderRadius: R.lg,
        border: "none",
        background: passed ? `linear-gradient(135deg,#FF9155,${C.primary})` : C.surface2,
        color: passed ? "#fff" : C.text2,
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONTS.ui
      }, children: passed ? "R\xE9clamer le coffre" : "Revoir les le\xE7ons" }),
      !passed && /* @__PURE__ */ jsx5("button", { onClick: retry, style: {
        width: "100%",
        maxWidth: 280,
        marginTop: 10,
        padding: 12,
        borderRadius: R.lg,
        border: `1.5px solid ${C.border}`,
        background: "transparent",
        color: C.text2,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: FONTS.ui
      }, children: "R\xE9essayer maintenant" })
    ] });
  }
  return /* @__PURE__ */ jsxs3("div", { style: { padding: "14px 20px 0" }, children: [
    /* @__PURE__ */ jsxs3("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
      /* @__PURE__ */ jsx5("button", { onClick: onDone, style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.sm, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }, children: /* @__PURE__ */ jsx5(Ti, { name: "x", size: 16, color: C.text2 }) }),
      /* @__PURE__ */ jsx5("div", { style: { flex: 1, display: "flex", gap: 4 }, children: questions.map((_, i) => /* @__PURE__ */ jsx5("div", { style: { height: 4, flex: 1, borderRadius: 2, background: i < idx ? C.green : i === idx ? C.primary : C.border, transition: "background .2s" } }, i)) }),
      /* @__PURE__ */ jsxs3("span", { style: { fontSize: 12, fontWeight: 700, color: C.text3, flexShrink: 0 }, children: [
        idx + 1,
        "/",
        questions.length
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { style: { fontSize: 10, color: C.text3, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }, children: [
      "V\xE9rification \xB7 ",
      unit.title
    ] }),
    /* @__PURE__ */ jsx5("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16, marginBottom: 10 }, children: /* @__PURE__ */ jsx5("p", { style: { margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.55, color: C.text, fontFamily: FONTS.title }, children: q.q }) }),
    q.o.map((opt, i) => {
      let bg = C.surface, border = `1.5px solid ${C.border}`, col = C.text, badgeBg = C.surface2, badgeFg = C.text2, ic = ["A", "B", "C", "D"][i];
      if (answered) {
        if (i === q.a) {
          bg = C.greenL;
          border = `1.5px solid ${C.green}`;
          col = C.greenD;
          badgeBg = C.greenBorder;
          badgeFg = C.greenD;
          ic = /* @__PURE__ */ jsx5(Ti, { name: "check", size: 12, color: C.greenD });
        } else if (i === sel) {
          bg = C.coralL;
          border = `1.5px solid ${C.coral}`;
          col = C.coralD;
          badgeBg = C.coralBorder;
          badgeFg = C.coralD;
          ic = /* @__PURE__ */ jsx5(Ti, { name: "x", size: 12, color: C.coralD });
        }
      }
      return /* @__PURE__ */ jsxs3("button", { onClick: () => choose(i), disabled: answered, style: { display: "flex", alignItems: "center", gap: 10, background: bg, border, borderRadius: R.md, padding: "12px 14px", cursor: answered ? "default" : "pointer", textAlign: "left", width: "100%", marginBottom: 7, fontFamily: FONTS.title }, children: [
        /* @__PURE__ */ jsx5("div", { style: { width: 26, height: 26, borderRadius: 8, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }, children: ic }),
        /* @__PURE__ */ jsx5("span", { style: { fontSize: 13, color: col, lineHeight: 1.45, fontWeight: answered && i === q.a ? 700 : 500 }, children: opt })
      ] }, i);
    }),
    answered && /* @__PURE__ */ jsxs3(Fragment2, { children: [
      /* @__PURE__ */ jsxs3("div", { style: { background: sel === q.a ? C.greenL : C.coralL, borderRadius: R.md, padding: "12px 14px", marginBottom: 12, border: `1.5px solid ${sel === q.a ? C.greenBorder : C.coralBorder}` }, children: [
        /* @__PURE__ */ jsxs3("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: [
          /* @__PURE__ */ jsx5(Ti, { name: sel === q.a ? "check" : "alert-circle", size: 14, color: sel === q.a ? C.green : C.coral }),
          /* @__PURE__ */ jsx5("div", { style: { fontSize: 12, fontWeight: 700, color: sel === q.a ? C.greenD : C.coralD }, children: sel === q.a ? "CORRECT" : "PAS TOUT \xC0 FAIT" })
        ] }),
        q.exp && /* @__PURE__ */ jsx5("p", { style: { margin: 0, fontSize: 12.5, color: C.text2, lineHeight: 1.5 }, children: q.exp })
      ] }),
      /* @__PURE__ */ jsx5("button", { onClick: next, style: {
        width: "100%",
        padding: 13,
        borderRadius: R.lg,
        border: "none",
        background: C.primary,
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONTS.ui
      }, children: idx + 1 >= questions.length ? "Voir le r\xE9sultat" : "Continuer" })
    ] }),
    /* @__PURE__ */ jsx5("div", { style: { height: 24 } })
  ] });
}

// src/renderers.jsx
var renderers_exports = {};
__export(renderers_exports, {
  RenderersContext: () => RenderersContext,
  RenderersProvider: () => RenderersProvider,
  useRenderers: () => useRenderers
});
import { createContext as createContext2, useContext as useContext2 } from "react";
var RenderersContext = createContext2({
  renderDiagramBlock: null,
  FretboardLesson: null,
  FretboardQuizQuestion: null,
  FretboardExercise: null
});
var useRenderers = () => useContext2(RenderersContext);
var RenderersProvider = RenderersContext.Provider;

// src/fretboardUtils.js
var CHROMATIC_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var ENHARMONICS = {
  "Db": "C#",
  "Eb": "D#",
  "Fb": "E",
  "Gb": "F#",
  "Ab": "G#",
  "Bb": "A#",
  "Cb": "B"
};
var NOTES_FR = {
  "C": "Do",
  "C#": "Do#",
  "D": "R\xE9",
  "D#": "R\xE9#",
  "E": "Mi",
  "F": "Fa",
  "F#": "Fa#",
  "G": "Sol",
  "G#": "Sol#",
  "A": "La",
  "A#": "La#",
  "B": "Si"
};
var OPEN_STRINGS = {
  1: "E",
  // Mi aigu
  2: "B",
  // Si
  3: "G",
  // Sol
  4: "D",
  // Ré
  5: "A",
  // La
  6: "E"
  // Mi grave
};
var MARKER_FRETS = [3, 5, 7, 9];
var DOUBLE_MARKER_FRETS = [12];
var SCALES = {
  // Gammes majeures / mineures
  "major": { name: "Majeure", intervals: [0, 2, 4, 5, 7, 9, 11] },
  "natural_minor": { name: "Mineure naturelle", intervals: [0, 2, 3, 5, 7, 8, 10] },
  "harmonic_minor": { name: "Mineure harmonique", intervals: [0, 2, 3, 5, 7, 8, 11] },
  "melodic_minor": { name: "Mineure m\xE9lodique", intervals: [0, 2, 3, 5, 7, 9, 11] },
  // Pentatoniques
  "pentatonic_major": { name: "Pentatonique majeure", intervals: [0, 2, 4, 7, 9] },
  "pentatonic_minor": { name: "Pentatonique mineure", intervals: [0, 3, 5, 7, 10] },
  "blues": { name: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
  // Modes de la gamme majeure
  "dorian": { name: "Dorien", intervals: [0, 2, 3, 5, 7, 9, 10] },
  "phrygian": { name: "Phrygien", intervals: [0, 1, 3, 5, 7, 8, 10] },
  "lydian": { name: "Lydien", intervals: [0, 2, 4, 6, 7, 9, 11] },
  "mixolydian": { name: "Mixolydien", intervals: [0, 2, 4, 5, 7, 9, 10] },
  "locrian": { name: "Locrien", intervals: [0, 1, 3, 5, 6, 8, 10] },
  // Gammes exotiques utiles
  "whole_tone": { name: "Tons entiers", intervals: [0, 2, 4, 6, 8, 10] },
  "diminished": { name: "Diminu\xE9e (T-ST)", intervals: [0, 2, 3, 5, 6, 8, 9, 11] }
};
var CHORD_TYPES = {
  // Triades
  "maj": { name: "Majeur", sym: "", intervals: [0, 4, 7] },
  "min": { name: "Mineur", sym: "m", intervals: [0, 3, 7] },
  "dim": { name: "Diminu\xE9", sym: "dim", intervals: [0, 3, 6] },
  "aug": { name: "Augment\xE9", sym: "aug", intervals: [0, 4, 8] },
  "sus2": { name: "Sus2", sym: "sus2", intervals: [0, 2, 7] },
  "sus4": { name: "Sus4", sym: "sus4", intervals: [0, 5, 7] },
  // Sixtes
  "maj6": { name: "Sixte", sym: "6", intervals: [0, 4, 7, 9] },
  "min6": { name: "Mineur 6", sym: "m6", intervals: [0, 3, 7, 9] },
  // Tétrades
  "maj7": { name: "Maj7", sym: "maj7", intervals: [0, 4, 7, 11] },
  "min7": { name: "Mineur 7", sym: "m7", intervals: [0, 3, 7, 10] },
  "dom7": { name: "Dominante 7", sym: "7", intervals: [0, 4, 7, 10] },
  "min7b5": { name: "Mi-diminu\xE9 (\xF8)", sym: "m7\u266D5", intervals: [0, 3, 6, 10] },
  "dim7": { name: "Diminu\xE9 7", sym: "dim7", intervals: [0, 3, 6, 9] },
  "minMaj7": { name: "Mineur Maj7", sym: "mMaj7", intervals: [0, 3, 7, 11] },
  "dom7sus4": { name: "7 sus4", sym: "7sus4", intervals: [0, 5, 7, 10] },
  // Neuvièmes
  "dom9": { name: "Neuvi\xE8me", sym: "9", intervals: [0, 4, 7, 10, 14] },
  "maj9": { name: "Maj9", sym: "maj9", intervals: [0, 4, 7, 11, 14] },
  "min9": { name: "Mineur 9", sym: "m9", intervals: [0, 3, 7, 10, 14] },
  "add9": { name: "Add9", sym: "add9", intervals: [0, 4, 7, 14] },
  // Altérés (dominantes tendues)
  "dom7b9": { name: "7 \u266D9", sym: "7\u266D9", intervals: [0, 4, 7, 10, 13] },
  "dom7s9": { name: "7 \u266F9", sym: "7\u266F9", intervals: [0, 4, 7, 10, 15] },
  "dom7b5": { name: "7 \u266D5", sym: "7\u266D5", intervals: [0, 4, 6, 10] },
  "dom7s5": { name: "7 \u266F5", sym: "7\u266F5", intervals: [0, 4, 8, 10] },
  // Onzièmes et treizièmes
  // Sur un 11 de dominante, la tierce majeure est omise par convention :
  // elle formerait une neuvième mineure avec la onzième, intervalle très dur.
  "dom11": { name: "Onzi\xE8me", sym: "11", intervals: [0, 7, 10, 14, 17] },
  "min11": { name: "Mineur 11", sym: "m11", intervals: [0, 3, 7, 10, 14, 17] },
  "maj7s11": { name: "Maj7 \u266F11", sym: "maj7\u266F11", intervals: [0, 4, 7, 11, 18] },
  "dom13": { name: "Treizi\xE8me", sym: "13", intervals: [0, 4, 7, 10, 14, 21] },
  "min13": { name: "Mineur 13", sym: "m13", intervals: [0, 3, 7, 10, 14, 21] },
  "maj13": { name: "Maj13", sym: "maj13", intervals: [0, 4, 7, 11, 14, 21] }
};
var INTERVAL_NAMES = {
  0: { short: "R", name: "Fondamentale", fr: "Fondamentale" },
  1: { short: "b2", name: "Minor 2nd", fr: "Seconde mineure" },
  2: { short: "2", name: "Major 2nd", fr: "Seconde majeure" },
  3: { short: "b3", name: "Minor 3rd", fr: "Tierce mineure" },
  4: { short: "3", name: "Major 3rd", fr: "Tierce majeure" },
  5: { short: "4", name: "Perfect 4th", fr: "Quarte juste" },
  6: { short: "b5", name: "Dim 5th", fr: "Triton" },
  7: { short: "5", name: "Perfect 5th", fr: "Quinte juste" },
  8: { short: "b6", name: "Minor 6th", fr: "Sixte mineure" },
  9: { short: "6", name: "Major 6th", fr: "Sixte majeure" },
  10: { short: "b7", name: "Minor 7th", fr: "Septi\xE8me mineure" },
  11: { short: "7", name: "Major 7th", fr: "Septi\xE8me majeure" },
  12: { short: "8", name: "Octave", fr: "Octave" },
  14: { short: "9", name: "Major 9th", fr: "Neuvi\xE8me majeure" }
};
function normalizeNote(note) {
  if (!note) return null;
  const frToEn = Object.fromEntries(Object.entries(NOTES_FR).map(([en, fr]) => [fr, en]));
  if (frToEn[note]) return frToEn[note];
  if (ENHARMONICS[note]) return ENHARMONICS[note];
  return note;
}
function getNoteAtPosition(string, fret) {
  const openNote = OPEN_STRINGS[string];
  if (!openNote) return null;
  const openIdx = CHROMATIC_NOTES.indexOf(openNote);
  return CHROMATIC_NOTES[(openIdx + fret) % 12];
}
function getPositionsOfNote(note, maxFret = 12, strings = [1, 2, 3, 4, 5, 6]) {
  const target = normalizeNote(note);
  const positions = [];
  for (const s of strings) {
    for (let f = 0; f <= maxFret; f++) {
      if (getNoteAtPosition(s, f) === target) {
        positions.push({ string: s, fret: f });
      }
    }
  }
  return positions;
}
function getScaleNotes(root, scaleKey) {
  const scale = SCALES[scaleKey];
  if (!scale) return [];
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);
  if (rootIdx === -1) return [];
  return scale.intervals.map((interval) => CHROMATIC_NOTES[(rootIdx + interval) % 12]);
}
function getChordNotes(root, chordType) {
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);
  if (rootIdx === -1) return [];
  return chord.intervals.map((interval) => CHROMATIC_NOTES[(rootIdx + interval) % 12]);
}
function getScalePositions(root, scaleKey, maxFret = 12) {
  const scale = SCALES[scaleKey];
  if (!scale) return [];
  const scaleNotes = getScaleNotes(root, scaleKey);
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);
  const positions = [];
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const note = getNoteAtPosition(s, f);
      const noteIdx = CHROMATIC_NOTES.indexOf(note);
      if (scaleNotes.includes(note)) {
        const semitones = (noteIdx - rootIdx + 12) % 12;
        let degreeIdx = scale.intervals.indexOf(semitones);
        let actualInterval = semitones;
        if (degreeIdx === -1) {
          degreeIdx = scale.intervals.indexOf(semitones + 12);
          if (degreeIdx !== -1) actualInterval = semitones + 12;
        }
        positions.push({
          string: s,
          fret: f,
          note,
          interval: actualInterval,
          // Degré dans la gamme (1-based), ex: 1 = fondamentale, 5 = quinte
          degree: degreeIdx + 1,
          isRoot: note === rootNorm
        });
      }
    }
  }
  return positions;
}
function getChordPositions(root, chordType, maxFret = 12) {
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  const chordNotes = getChordNotes(root, chordType);
  const rootNorm = normalizeNote(root);
  const rootIdx = CHROMATIC_NOTES.indexOf(rootNorm);
  const positions = [];
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const note = getNoteAtPosition(s, f);
      const noteIdx = CHROMATIC_NOTES.indexOf(note);
      if (chordNotes.includes(note)) {
        const semitones = (noteIdx - rootIdx + 12) % 12;
        let degreeIdx = chord.intervals.indexOf(semitones);
        let actualInterval = semitones;
        if (degreeIdx === -1) {
          degreeIdx = chord.intervals.indexOf(semitones + 12);
          if (degreeIdx !== -1) actualInterval = semitones + 12;
        }
        positions.push({
          string: s,
          fret: f,
          note,
          interval: actualInterval,
          degree: degreeIdx + 1,
          isRoot: note === rootNorm
        });
      }
    }
  }
  return positions;
}
function getInterval(from, to) {
  const a = CHROMATIC_NOTES.indexOf(normalizeNote(from));
  const b = CHROMATIC_NOTES.indexOf(normalizeNote(to));
  if (a === -1 || b === -1) return null;
  return (b - a + 12) % 12;
}
function noteToFr(note) {
  return NOTES_FR[normalizeNote(note)] || note;
}
function getHighlightPositions(notes, maxFret = 12) {
  if (!notes || notes.length === 0) return [];
  const normalized = notes.map(normalizeNote);
  const positions = [];
  for (let s = 1; s <= 6; s++) {
    for (let f = 0; f <= maxFret; f++) {
      const note = getNoteAtPosition(s, f);
      if (normalized.includes(note)) {
        positions.push({
          string: s,
          fret: f,
          note,
          isRoot: f === 0 ? false : void 0
          // le caller peut surcharger
        });
      }
    }
  }
  return positions;
}
function getQuizTargetPositions(targetNote, maxFret = 12) {
  return getPositionsOfNote(targetNote, maxFret);
}
function isCorrectPosition(clickedString, clickedFret, correctPositions) {
  return correctPositions.some((p) => p.string === clickedString && p.fret === clickedFret);
}
function checkQuizCompletion(selected, correct) {
  const hits = selected.filter((s) => isCorrectPosition(s.string, s.fret, correct));
  const extras = selected.length - hits.length;
  return {
    complete: hits.length === correct.length && extras === 0,
    found: hits.length,
    total: correct.length,
    misses: correct.length - hits.length,
    extras
  };
}

// src/audioEngine.js
var Tone = null;
var tonePromise = null;
async function chargerTone() {
  if (Tone) return Tone;
  if (!tonePromise) tonePromise = Promise.resolve().then(() => (init_tone_stub(), tone_stub_exports)).then((m) => {
    Tone = m;
    return m;
  });
  return tonePromise;
}
var SAMPLE_URLS = {
  "A2": "A2.mp3",
  "A3": "A3.mp3",
  "A4": "A4.mp3",
  "B2": "B2.mp3",
  "B3": "B3.mp3",
  "B4": "B4.mp3",
  "C2": "C2.mp3",
  "C3": "C3.mp3",
  "C4": "C4.mp3",
  "D2": "D2.mp3",
  "D3": "D3.mp3",
  "D4": "D4.mp3",
  "E2": "E2.mp3",
  "E3": "E3.mp3",
  "E4": "E4.mp3",
  "F2": "F2.mp3",
  "F3": "F3.mp3",
  "F4": "F4.mp3",
  "G2": "G2.mp3",
  "G3": "G3.mp3",
  "G4": "G4.mp3",
  "Ab2": "Ab2.mp3",
  "Ab3": "Ab3.mp3",
  "Ab4": "Ab4.mp3",
  "Bb2": "Bb2.mp3",
  "Bb3": "Bb3.mp3",
  "Bb4": "Bb4.mp3",
  "Db2": "Db2.mp3",
  "Db3": "Db3.mp3",
  "Db4": "Db4.mp3",
  "Eb2": "Eb2.mp3",
  "Eb3": "Eb3.mp3",
  "Eb4": "Eb4.mp3",
  "Gb2": "Gb2.mp3",
  "Gb3": "Gb3.mp3",
  "Gb4": "Gb4.mp3"
};
var BASE_URL = "/audio/guitar/";
var RELEASE = 1.6;
var QUEUE_AUDIBLE_MS = Math.round(RELEASE * 1e3);
var DUREE_NOTE = { "1n": 2, "2n": 1, "4n": 0.5, "8n": 0.25, "16n": 0.125 };
var secondes = (v) => typeof v === "number" ? v : DUREE_NOTE[v] ?? 1;
var listSampleUrls = () => Object.values(SAMPLE_URLS).map((f) => BASE_URL + f);
var SAMPLE_COUNT = Object.keys(SAMPLE_URLS).length;
var SHARP_TO_FLAT = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb"
};
function toToneNote(note, octave) {
  const flat = SHARP_TO_FLAT[note];
  return `${flat || note}${octave}`;
}
var CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function midiOf(name, octave) {
  return CHROMATIC.indexOf(name) + 12 * (octave + 1);
}
function fromMidi(midi) {
  return toToneNote(CHROMATIC[(midi % 12 + 12) % 12], Math.floor(midi / 12) - 1);
}
function buildVoicingFromIntervals(rootName, intervals, voices) {
  if (!intervals?.length) return [];
  let degrees = [...new Set(intervals)].sort((a, b) => a - b);
  if (degrees.length > 5) degrees = degrees.filter((d) => d !== 7);
  const target = Math.min(6, Math.max(5, degrees.length + 1));
  const LOW = midiOf("C", 2), HIGH = midiOf("B", 4);
  const bass = midiOf(rootName, 2);
  const span = Math.max(...degrees);
  const bump = bass + span + 12 <= HIGH ? 12 : 0;
  const rel = /* @__PURE__ */ new Set([0]);
  let i = 0, guard = 0;
  while (rel.size < target && guard < 60) {
    const off = degrees[i % degrees.length];
    const val = off + bump + 12 * Math.floor(i / degrees.length);
    if (bass + val <= HIGH) rel.add(val);
    i++;
    guard++;
  }
  return [...rel].sort((a, b) => a - b).map((r) => bass + r).filter((m) => m >= LOW && m <= HIGH).map(fromMidi);
}
function strumInto(notes, duration, when, direction = "down", spread = 0.026) {
  const ordered = direction === "down" ? notes : [...notes].reverse();
  const n = ordered.length;
  ordered.forEach((note, i) => {
    const curve = Math.sin((i + 0.6) / n * Math.PI);
    const velocity = Math.max(0.35, Math.min(1, 0.55 + curve * 0.35 + (Math.random() - 0.5) * 0.07));
    const jitter = (Math.random() - 0.5) * spread * 0.35;
    const t = when + i * spread + jitter;
    try {
      sampler.triggerAttackRelease(note, duration, t, velocity);
    } catch {
    }
  });
}
var DEV = typeof import.meta !== "undefined" && false;
var warn = (...a) => {
  if (DEV) console.warn("[audioEngine]", ...a);
};
var sortieMaitre = null;
var enAttente = [];
function differer(fn, ms) {
  if (ms <= 0) {
    fn();
    return;
  }
  const id = setTimeout(() => {
    enAttente = enAttente.filter((x) => x !== id);
    fn();
  }, ms);
  enAttente.push(id);
  return id;
}
function annulerEnAttente() {
  for (const id of enAttente) clearTimeout(id);
  enAttente = [];
}
var restaurationTimer = null;
function reveillerSortie() {
  if (restaurationTimer) {
    clearTimeout(restaurationTimer);
    restaurationTimer = null;
  }
  if (!sortieMaitre || !Tone) return;
  try {
    sortieMaitre.gain.cancelScheduledValues(Tone.now());
    sortieMaitre.gain.value = 1;
  } catch {
  }
  try {
    if (sampler) sampler.release = RELEASE;
  } catch {
  }
}
var sampler = null;
var loadPromise = null;
var isLoaded = false;
var loadError = null;
function isAudioLoaded() {
  return isLoaded;
}
function loadAudio() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    await chargerTone();
    return new Promise((resolve, reject) => {
      try {
        sortieMaitre = new Tone.Gain(1).toDestination();
        const reverb = new Tone.Reverb({ decay: 1.9, wet: 0.19 });
        reverb.connect(sortieMaitre);
        sampler = new Tone.Sampler({
          urls: SAMPLE_URLS,
          baseUrl: BASE_URL,
          release: 1.6,
          onload: () => {
            isLoaded = true;
            resolve(true);
          },
          onerror: (err) => {
            loadError = err;
            warn("Erreur samples:", err);
            reject(err);
          }
        }).connect(reverb);
      } catch (err) {
        loadError = err;
        reject(err);
      }
    });
  })();
  loadPromise.catch(() => {
    loadPromise = null;
    isLoaded = false;
  });
  return loadPromise;
}
async function unlockAudio() {
  try {
    await chargerTone();
    if (Tone.context.state !== "running") await Tone.start();
    return Tone.context.state === "running";
  } catch {
    return false;
  }
}
async function ensureLoaded() {
  try {
    await chargerTone();
  } catch {
    return false;
  }
  const etat = Tone.context.state;
  if (etat !== "running") {
    try {
      await Tone.start();
      if (Tone.context.state !== "running") await Tone.context.rawContext?.resume?.();
    } catch {
    }
  }
  if (!isLoaded) {
    try {
      await loadAudio();
    } catch {
      return false;
    }
  }
  return isLoaded;
}
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!Tone) return;
    if (document.visibilityState !== "hidden") return;
    try {
      stopProgression();
      sampler?.releaseAll?.();
    } catch {
    }
  });
}
async function playNote(note, duration = "4n") {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  try {
    sampler.triggerAttackRelease(note, duration, Tone.now());
  } catch (e) {
    warn("playNote:", e);
  }
}
async function playChord(notes, duration = "2n", opts = {}) {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  const { strum = true, direction = "down", spread = 0.026 } = opts;
  try {
    if (!strum) {
      sampler.triggerAttackRelease(notes, duration);
      return;
    }
    strumInto(notes, duration, Tone.now(), direction, spread);
  } catch (e) {
    warn("playChord:", e);
  }
}
async function playScale(notes, bpm = 80, onStep) {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  const spb = 60 / bpm;
  try {
    notes.forEach((note, i) => {
      differer(() => {
        try {
          sampler.triggerAttackRelease(note, spb * 0.85, Tone.now());
        } catch {
        }
        onStep?.(i, note);
      }, i * spb * 1e3);
    });
    differer(() => onStep?.(-1, null), notes.length * spb * 1e3);
  } catch (e) {
    warn("playScale:", e);
  }
}
var ECART_INTERVALLE_MS = 650;
async function playInterval(note1, note2, mode = "ascending") {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  try {
    if (mode === "harmonic") {
      sampler.triggerAttackRelease([note1, note2], "2n", Tone.now());
      return;
    }
    const [premiere, seconde] = mode === "descending" ? [note2, note1] : [note1, note2];
    sampler.triggerAttackRelease(premiere, "4n", Tone.now());
    differer(() => {
      try {
        sampler.triggerAttackRelease(seconde, "4n", Tone.now());
      } catch {
      }
    }, ECART_INTERVALLE_MS);
  } catch (e) {
    warn("playInterval:", e);
  }
}
async function playScaleFromRoot(root, scaleKey, bpm = 80, onStep) {
  const notes = getScaleNotes(root, scaleKey);
  if (!notes.length) return;
  const toneNotes = notes.map((note, i) => toToneNote(note, i < 5 ? 3 : 4));
  await playScale(toneNotes, bpm, onStep ? (i) => onStep(i, notes[i] ?? null) : void 0);
  return notes;
}
async function playArpeggioFromRoot(root, chordType, bpm = 132, onStep) {
  const names = getChordNotes(root, chordType);
  if (!names.length) return;
  const toneNotes = names.map((n, i) => toToneNote(n, i < 3 ? 3 : 4));
  await playScale(toneNotes, bpm, onStep ? (i) => onStep(i, names[i] ?? null) : void 0);
  return names;
}
async function playChordFromRoot(root, chordType, onStep) {
  const intervals = CHORD_TYPES[chordType]?.intervals;
  if (!intervals) return;
  const voiced = buildVoicingFromIntervals(normalizeNote(root), intervals);
  await playChord(voiced, "2n");
  if (onStep) {
    const names = getChordNotes(root, chordType);
    onStep(0, names);
    setTimeout(() => onStep(-1, null), 1400);
  }
}
var progressionTimers = [];
var progressionTimer = null;
async function playProgression(chords, secondsPerChord = 1.5, onStep) {
  if (!await ensureLoaded()) return;
  stopAll();
  reveillerSortie();
  const voicedChords = chords.map(
    ({ root, type }) => buildVoicingFromIntervals(normalizeNote(root), CHORD_TYPES[type]?.intervals || [])
  );
  voicedChords.forEach((voiced, idx) => {
    const jouer = () => {
      const direction = idx % 2 === 0 ? "down" : "up";
      const humanize = (Math.random() - 0.5) * 0.012;
      strumInto(voiced, secondsPerChord * 0.9, Tone.now() + 0.02 + humanize, direction);
      onStep?.(idx);
    };
    if (idx === 0) jouer();
    else progressionTimers.push(setTimeout(jouer, idx * secondsPerChord * 1e3));
  });
  const totalMs = voicedChords.length * secondsPerChord * 1e3 + 200;
  progressionTimer = setTimeout(() => {
    progressionTimer = null;
    onStep?.(-1);
  }, totalMs);
}
function stopProgression() {
  for (const t of progressionTimers) clearTimeout(t);
  progressionTimers = [];
  if (progressionTimer) {
    clearTimeout(progressionTimer);
    progressionTimer = null;
  }
}
function fioriture(notes, { gap = 0.055, duration = "8n", from = 0.62, to = 0.3 } = {}) {
  if (!isLoaded || !sampler || !Tone) return false;
  const now2 = Tone.now() + 0.01;
  notes.forEach((note, i) => {
    const t = notes.length === 1 ? 0 : i / (notes.length - 1);
    const velocity = from + (to - from) * t;
    try {
      sampler.triggerAttackRelease(note, duration, now2 + i * gap, velocity);
    } catch {
    }
  });
  return true;
}
function playLessonComplete() {
  return fioriture(["C4", "E4", "G4", "D4"], { gap: 0.052, duration: "8n" });
}
function playChestOpen() {
  return fioriture(["G3", "D4"], { gap: 0.1, duration: "2n", from: 0.55, to: 0.45 });
}
function stopAll() {
  annulerEnAttente();
  progressionTimers.forEach(clearTimeout);
  progressionTimers = [];
  if (progressionTimer) {
    clearTimeout(progressionTimer);
    progressionTimer = null;
  }
  if (!Tone || !sampler) return;
  try {
    const maintenant = Tone.now();
    if (sortieMaitre) {
      sortieMaitre.gain.cancelScheduledValues(maintenant);
      sortieMaitre.gain.setValueAtTime(sortieMaitre.gain.value, maintenant);
      sortieMaitre.gain.linearRampToValueAtTime(0, maintenant + 8e-3);
    }
    sampler.release = 0.02;
    sampler.releaseAll();
    if (restaurationTimer) clearTimeout(restaurationTimer);
    restaurationTimer = setTimeout(() => {
      restaurationTimer = null;
      try {
        sampler.releaseAll();
        sampler.release = RELEASE;
        if (sortieMaitre) {
          const t = Tone.now();
          sortieMaitre.gain.cancelScheduledValues(t);
          sortieMaitre.gain.setValueAtTime(0, t);
          sortieMaitre.gain.linearRampToValueAtTime(1, t + 0.01);
        }
      } catch {
      }
    }, 380);
  } catch {
  }
}
var dureeMs = (finDerniereAttaque, dureeNote) => Math.round((finDerniereAttaque + secondes(dureeNote)) * 1e3) + QUEUE_AUDIBLE_MS;
function generateEarTrainingQuestion(type = "interval") {
  const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const INTERVAL_NAMES2 = {
    3: "Tierce mineure",
    4: "Tierce majeure",
    5: "Quarte juste",
    7: "Quinte juste",
    9: "Sixte majeure",
    10: "Septi\xE8me mineure",
    12: "Octave"
  };
  if (type === "interval") {
    const intervals = [3, 4, 5, 7, 9, 10, 12];
    const semitones = intervals[Math.floor(Math.random() * intervals.length)];
    const rootIdx = Math.floor(Math.random() * 12);
    const root = NOTES[rootIdx];
    const topIdx = (rootIdx + semitones) % 12;
    const top = NOTES[topIdx];
    const octaveTop = rootIdx + semitones >= 12 ? 4 : 3;
    const note1 = toToneNote(root, 3);
    const note2 = toToneNote(top, octaveTop);
    const distractors = intervals.filter((i) => i !== semitones).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [semitones, ...distractors].sort(() => Math.random() - 0.5).map((i) => ({ semitones: i, label: INTERVAL_NAMES2[i] }));
    return {
      type: "interval",
      note1,
      note2,
      answer: semitones,
      options,
      play: () => playInterval(note1, note2, "ascending"),
      // La 2e note attaque à 0,65 s, elle dure "4n" (0,5 s au tempo par défaut).
      durationMs: dureeMs(0.65, "4n")
    };
  }
  if (type === "chord_quality") {
    const qualities = [
      { key: "maj", label: "Major", intervals: [0, 4, 7] },
      { key: "min", label: "Minor", intervals: [0, 3, 7] },
      { key: "dom7", label: "Dom7", intervals: [0, 4, 7, 10] },
      { key: "min7", label: "Minor 7", intervals: [0, 3, 7, 10] }
    ];
    const rootIdx = Math.floor(Math.random() * 12);
    const root = NOTES[rootIdx];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const notes = quality.intervals.map((i, idx) => {
      return toToneNote(NOTES[(rootIdx + i) % 12], idx === 0 ? 2 : 3);
    });
    return {
      type: "chord_quality",
      notes,
      answer: quality.key,
      options: qualities.map((q) => ({ key: q.key, label: q.label })),
      play: () => playChord(notes, "2n", { spread: 0.065 }),
      // Grattage étalé : la dernière corde attaque à (n-1) × 0,065 s.
      durationMs: dureeMs((notes.length - 1) * 0.065, "2n")
    };
  }
  if (type === "chord_full") {
    const qualities = [
      { key: "maj", suffix: "", intervals: [0, 4, 7] },
      { key: "min", suffix: "m", intervals: [0, 3, 7] },
      { key: "dom7", suffix: "7", intervals: [0, 4, 7, 10] },
      { key: "min7", suffix: "m7", intervals: [0, 3, 7, 10] }
    ];
    const rootIdx = Math.floor(Math.random() * 12);
    const root = NOTES[rootIdx];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];
    const notes = quality.intervals.map(
      (i, idx) => toToneNote(NOTES[(rootIdx + i) % 12], idx === 0 ? 2 : 3)
    );
    const answerKey = root + "|" + quality.key;
    const candidates = [];
    for (const q of qualities) {
      if (q.key !== quality.key) candidates.push({ root, quality: q });
    }
    for (const shift of [2, 5, 7, 9]) {
      const r = NOTES[(rootIdx + shift) % 12];
      candidates.push({ root: r, quality });
    }
    const distractors = candidates.sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [{ root, quality }, ...distractors].sort(() => Math.random() - 0.5).map((c) => ({
      key: c.root + "|" + c.quality.key,
      label: c.root + c.quality.suffix || c.root
    }));
    const referenceNote = toToneNote("C", 3);
    return {
      type: "chord_full",
      notes,
      root,
      answer: answerKey,
      options,
      // Action principale : l'accord, directement.
      play: () => playChord(notes, "2n", { spread: 0.065 }),
      durationMs: dureeMs((notes.length - 1) * 0.065, "2n"),
      // Aide optionnelle, declenchee par un bouton distinct.
      playReference: () => playNote(referenceNote, "2n"),
      referenceDurationMs: dureeMs(0, "2n"),
      referenceLabel: "C"
    };
  }
  if (type === "progression") {
    const SEC_PAR_ACCORD = 1.6;
    const progressions = [
      { key: "I-V-vi-IV", label: "I - V - vi - IV", degrees: [[0, "maj"], [7, "maj"], [9, "min"], [5, "maj"]] },
      { key: "ii-V-I", label: "ii - V - I", degrees: [[2, "min7"], [7, "dom7"], [0, "maj7"]] },
      { key: "I-IV-V", label: "I - IV - V", degrees: [[0, "maj"], [5, "maj"], [7, "maj"]] },
      { key: "i-iv-v", label: "i - iv - v (mineur)", degrees: [[0, "min"], [5, "min"], [7, "min"]] },
      { key: "I-vi-IV-V", label: "I - vi - IV - V", degrees: [[0, "maj"], [9, "min"], [5, "maj"], [7, "maj"]] },
      // i - VI - III - VII : la suite "epique" (Zeppelin, metal, folk nordique).
      // En contexte mineur ces degres s'ecrivent en bemols (Abm, Eb, Bb en
      // Do mineur), mais l'affichage se fait en chiffres romains — donc
      // aucune ambiguite d'ecriture pour l'utilisateur.
      { key: "i-VI-III-VII", label: "i - VI - III - VII", degrees: [[0, "min"], [8, "maj"], [3, "maj"], [10, "maj"]] },
      // Deux suites ajoutees pour equilibrer les groupes : il faut au moins
      // 4 suites de MEME longueur pour pouvoir proposer 4 options qui ont
      // toutes le meme nombre d'accords que ce qui a ete joue.
      { key: "I-vi-ii-V", label: "I - vi - ii - V", degrees: [[0, "maj"], [9, "min"], [2, "min7"], [7, "dom7"]] },
      { key: "vi-IV-I", label: "vi - IV - I", degrees: [[9, "min"], [5, "maj"], [0, "maj"]] }
    ];
    const rootIdx = Math.floor(Math.random() * 12);
    const chosen = progressions[Math.floor(Math.random() * progressions.length)];
    const chords = chosen.degrees.map(([semi, type2]) => ({
      root: NOTES[(rootIdx + semi) % 12],
      type: type2
    }));
    const sameLength = progressions.filter(
      (p) => p.key !== chosen.key && p.degrees.length === chosen.degrees.length
    );
    const distractors = sameLength.sort(() => Math.random() - 0.5).slice(0, 3);
    const SUFFIX = { maj: "", min: "m", dom7: "7", maj7: "maj7", min7: "m7" };
    const nameProg = (p) => p.degrees.map(([semi, t]) => NOTES[(rootIdx + semi) % 12] + SUFFIX[t]).join(" - ");
    const options = [chosen, ...distractors].sort(() => Math.random() - 0.5).map((p) => ({ key: p.key, label: nameProg(p), roman: p.label }));
    return {
      type: "progression",
      chords,
      tonic: NOTES[rootIdx],
      tonicFr: NOTES[rootIdx],
      roman: chosen.label,
      answer: chosen.key,
      options,
      // 1,6 s par accord : assez pour entendre chaque couleur sans perdre
      // le fil de la suite. Plus lent, la coherence harmonique se dissout.
      play: (onStep) => playProgression(chords, SEC_PAR_ACCORD, onStep),
      // Le dernier accord attaque à (n-1) × 1,6 s et sonne 90 % de l'intervalle.
      // L'ancien calcul de l'écran (n × 1600 + 400) ignorait la queue de
      // relâchement : le bouton repassait en « play » avec du son encore
      // audible, et on ne pouvait plus l'arrêter.
      durationMs: dureeMs(
        (chords.length - 1) * SEC_PAR_ACCORD + SEC_PAR_ACCORD * 0.9,
        0
      )
    };
  }
  return null;
}
function makeEarQuizQuestion(mode = "interval") {
  const ear = generateEarTrainingQuestion(mode);
  if (!ear) return null;
  if (mode === "interval") {
    const labels2 = ear.options.map((o) => String(o.label));
    const answerIdx2 = ear.options.findIndex((o) => o.semitones === ear.answer);
    if (answerIdx2 < 0) return null;
    return {
      id: `ear-int-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
      type: "ear",
      courseId: "scales",
      lvl: 2,
      q: "Quel intervalle entends-tu ?",
      o: labels2,
      a: answerIdx2,
      exp: "\xC9coute la distance entre les deux notes : c'est elle qui d\xE9finit l'intervalle.",
      play: ear.play
    };
  }
  const labels = ear.options.map((o) => o.label);
  const answerIdx = ear.options.findIndex((o) => o.key === ear.answer);
  if (answerIdx < 0) return null;
  return {
    id: `ear-chord-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    type: "ear",
    courseId: "harmony",
    lvl: 2,
    q: "Quelle est la couleur de cet accord ?",
    o: labels,
    a: answerIdx,
    exp: "La tierce d\xE9cide du caract\xE8re majeur ou mineur ; la septi\xE8me ajoute la tension.",
    play: ear.play
  };
}

// src/screens/CoursesScreen.jsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var PULSE_CSS = `
  @keyframes gropi-pulse {
    0%   { transform:scale(.88); opacity:.9; }
    100% { transform:scale(1.28); opacity:0; }
  }
  @keyframes gropi-unlock {
    0%   { transform:scale(.7); opacity:0; }
    60%  { transform:scale(1.12); }
    100% { transform:scale(1); opacity:1; }
  }
  @keyframes chest-bounce {
    0%, 100% { transform:translateY(0); }
    50%      { transform:translateY(-5px); }
  }
`;
function hashId(str) {
  let h = 2166136261;
  for (let i = 0; i < String(str).length; i++) {
    h ^= String(str).charCodeAt(i);
    h = h * 16777619 >>> 0;
  }
  return h;
}
var AMPLITUDES = [6, 40, 18, 46, 12, 32, 24];
function nodeLayout(lessonId, unitId, index) {
  const h = hashId(`${unitId}:${lessonId}`);
  const side = index % 2 === 0 ? "left" : "right";
  const inset = AMPLITUDES[(h + index) % AMPLITUDES.length];
  return { side, inset };
}
function sideToX(side, inset) {
  const pct = (inset + 30) / 400 * 100;
  if (side === "left") return Math.max(8, Math.min(50, pct));
  if (side === "right") return Math.min(92, Math.max(50, 100 - pct));
  return 50;
}
function PathNode({ lesson, index, state, th, onSelect, isCurrent, isLocked, gropiTip, layout }) {
  const C = useC();
  const done = !!state.completedLessons[lesson.id];
  const { side, inset } = layout;
  const textSide = side;
  let bg, border, iconEl;
  if (done) {
    bg = th.colorL;
    border = th.color;
    iconEl = /* @__PURE__ */ jsx6(Ti, { name: "check", size: isCurrent ? 22 : 18, color: th.color });
  } else if (isCurrent) {
    bg = C.primaryL;
    border = C.primary;
    iconEl = /* @__PURE__ */ jsx6(Ti, { name: "player-play", size: 22, color: C.primary });
  } else if (isLocked) {
    bg = C.surface2;
    border = C.border;
    iconEl = /* @__PURE__ */ jsx6(Ti, { name: "lock", size: 16, color: C.text3 });
  } else {
    bg = C.surface;
    border = th.color;
    iconEl = /* @__PURE__ */ jsx6(Ti, { name: "book-2", size: 17, color: th.color });
  }
  const sz = isCurrent ? 64 : 54;
  return /* @__PURE__ */ jsxs4("div", { style: {
    display: "flex",
    flexDirection: "column",
    alignItems: side === "left" ? "flex-start" : "flex-end",
    width: "100%",
    // Le retrait varie d'un nœud à l'autre : c'est lui qui fait serpenter
    // le chemin. Borné à 46 px, ce qui laisse toujours la place de la carte
    // de titre (186 px) sur un écran de 390 px.
    paddingLeft: side === "left" ? inset : 0,
    paddingRight: side === "right" ? inset : 0,
    marginBottom: 4
  }, children: [
    /* @__PURE__ */ jsxs4(
      "button",
      {
        onClick: () => !isLocked && onSelect(lesson),
        disabled: isLocked,
        style: {
          width: sz,
          height: sz,
          borderRadius: "50%",
          background: bg,
          border: `${isCurrent ? "3px" : "2px"} solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isLocked ? "default" : "pointer",
          position: "relative",
          boxShadow: isCurrent ? `0 6px 22px ${C.primary}44` : "none",
          animation: !done && !isCurrent && !isLocked ? "gropi-unlock .35s ease" : "none"
        },
        children: [
          iconEl,
          done && /* @__PURE__ */ jsx6("div", { style: {
            position: "absolute",
            top: -4,
            right: -4,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: th.color,
            border: `2px solid ${C.bg}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }, children: /* @__PURE__ */ jsx6(Ti, { name: "check", size: 9, color: "#fff" }) }),
          isCurrent && /* @__PURE__ */ jsx6("div", { style: {
            position: "absolute",
            inset: -9,
            borderRadius: "50%",
            border: `2px solid ${C.primaryBorder}`,
            animation: "gropi-pulse 2s ease-out infinite"
          } })
        ]
      }
    ),
    !isLocked && /* @__PURE__ */ jsxs4(
      "div",
      {
        onClick: isCurrent ? () => onSelect(lesson) : void 0,
        style: {
          marginTop: 6,
          background: isCurrent ? C.primaryL : C.surface,
          border: `1.5px solid ${isCurrent ? C.primaryBorder : C.border}`,
          borderRadius: R.md,
          padding: "9px 12px",
          maxWidth: 186,
          alignSelf: textSide === "left" ? "flex-start" : "flex-end",
          boxShadow: isCurrent ? `0 4px 14px ${C.primary}22` : "none",
          cursor: isCurrent ? "pointer" : "default"
        },
        children: [
          isCurrent && /* @__PURE__ */ jsx6("div", { style: { fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.primary, marginBottom: 3 }, children: "En cours" }),
          /* @__PURE__ */ jsx6("div", { style: { fontSize: 12.5, fontWeight: 700, color: done ? th.colorD : isCurrent ? C.primaryD : C.text, lineHeight: 1.3 }, children: lesson.title }),
          /* @__PURE__ */ jsxs4("div", { style: { fontSize: 10, color: C.text3, marginTop: 3 }, children: [
            lesson.duration,
            " min"
          ] }),
          isCurrent && /* @__PURE__ */ jsx6("div", { style: {
            display: "inline-block",
            marginTop: 8,
            background: C.primary,
            color: "#fff",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            boxShadow: `0 3px 10px ${C.primary}44`
          }, children: "Commencer" })
        ]
      }
    ),
    isCurrent && /* @__PURE__ */ jsx6(
      "div",
      {
        onClick: () => onSelect(lesson),
        style: { marginTop: 10, alignSelf: textSide === "left" ? "flex-start" : "flex-end", cursor: "pointer" },
        children: /* @__PURE__ */ jsx6(
          GropiBubble,
          {
            pose: "wave",
            size: 68,
            tint: "primary",
            eyebrow: `Gropi \xB7 ${lesson.title}`,
            side: textSide,
            children: gropiTip
          }
        )
      }
    )
  ] });
}
function UnitChest({ unit, th, onClaim, onCheck }) {
  const C = useC();
  const { complete, bonusClaimable, bonusClaimed, needsCheck, check, done, total, unlocked } = unit;
  let bg, border, icon, iconColor, label, anim = "none", clickable = false, action = null;
  if (bonusClaimed) {
    bg = C.greenL;
    border = C.greenBorder;
    icon = "check";
    iconColor = C.green;
    label = `Coffre ouvert \xB7 +${UNIT_BONUS_XP} XP`;
  } else if (bonusClaimable) {
    bg = C.amberL;
    border = C.amber;
    icon = "gift";
    iconColor = C.amber;
    label = `Ouvre ton coffre \xB7 +${UNIT_BONUS_XP} XP`;
    anim = "chest-bounce 1.2s ease-in-out infinite";
    clickable = true;
    action = () => onClaim(unit);
  } else if (needsCheck) {
    bg = C.primaryL;
    border = C.primary;
    icon = "clipboard-check";
    iconColor = C.primary;
    label = check?.attempts ? `Retenter la v\xE9rification (${check.score}%)` : "V\xE9rifier l'unit\xE9";
    anim = "chest-bounce 1.2s ease-in-out infinite";
    clickable = true;
    action = () => onCheck(unit);
  } else if (unlocked) {
    bg = C.surface;
    border = C.border;
    icon = "gift";
    iconColor = C.text3;
    label = `Coffre \xB7 ${done}/${total} le\xE7ons`;
  } else {
    bg = C.surface2;
    border = C.border;
    icon = "lock";
    iconColor = C.text3;
    label = "Coffre verrouill\xE9";
  }
  return /* @__PURE__ */ jsxs4("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", margin: "14px 0 8px" }, children: [
    /* @__PURE__ */ jsx6(
      "button",
      {
        onClick: () => clickable && action?.(),
        disabled: !clickable,
        "aria-label": label,
        style: {
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: bg,
          border: `2px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: clickable ? "pointer" : "default",
          opacity: !unlocked ? 0.55 : 1,
          boxShadow: bonusClaimable || needsCheck ? `0 6px 20px ${border}44` : "none",
          animation: anim
        },
        children: /* @__PURE__ */ jsx6(Ti, { name: icon, size: 26, color: iconColor })
      }
    ),
    /* @__PURE__ */ jsx6("div", { style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: bonusClaimable || needsCheck ? C.primaryD || C.primary : C.text3,
      fontFamily: FONTS.ui,
      marginTop: 7,
      textAlign: "center"
    }, children: label })
  ] });
}
function PathConnector({ from, to, done }) {
  const C = useC();
  const stroke = done ? C.green : C.border;
  const x1 = sideToX(from.side, from.inset);
  const x2 = sideToX(to.side, to.inset);
  const ecart = Math.abs(x2 - x1);
  const h = ecart < 12 ? 26 : ecart < 40 ? 34 : 42;
  const d = `M ${x1} 0 C ${x1} ${h * 0.55}, ${x2} ${h * 0.45}, ${x2} ${h}`;
  return /* @__PURE__ */ jsx6("div", { style: { position: "relative", height: h, overflow: "visible" }, "aria-hidden": "true", children: /* @__PURE__ */ jsx6(
    "svg",
    {
      viewBox: `0 0 100 ${h}`,
      preserveAspectRatio: "none",
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" },
      children: /* @__PURE__ */ jsx6(
        "path",
        {
          d,
          fill: "none",
          stroke,
          strokeWidth: "2.5",
          strokeDasharray: "6 8",
          strokeLinecap: "round",
          vectorEffect: "non-scaling-stroke"
        }
      )
    }
  ) });
}
function CurrentUnitBanner({ stats, MODULE_THEME: MODULE_THEME2 }) {
  const C = useC();
  const u = stats.currentUnit;
  const th = u ? MODULE_THEME2.palier : null;
  return /* @__PURE__ */ jsxs4("div", { style: {
    background: `${C.surface}CC`,
    borderRadius: R.lg,
    padding: "13px 15px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: `1px solid ${th ? `${th.color}22` : C.border}`,
    boxShadow: th ? `0 4px 16px ${th.color}18` : "none"
  }, children: [
    /* @__PURE__ */ jsx6("div", { style: {
      width: 42,
      height: 42,
      borderRadius: R.md,
      background: th ? th.colorL : C.greenL,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: `1.5px solid ${th ? `${th.color}44` : C.greenBorder}`
    }, children: /* @__PURE__ */ jsx6(Ti, { name: th ? th.icon.replace("ti-", "") : "trophy", size: 20, color: th ? th.color : C.green }) }),
    /* @__PURE__ */ jsxs4("div", { style: { flex: 1 }, children: [
      /* @__PURE__ */ jsx6("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: th ? th.colorD : C.greenD, fontFamily: FONTS.ui }, children: u ? `Unit\xE9 ${u.index + 1} sur ${stats.units}` : "Parcours" }),
      /* @__PURE__ */ jsx6("div", { style: { fontSize: 15, fontWeight: 800, color: th ? th.colorD : C.greenD, letterSpacing: "-.2px", marginTop: 2 }, children: u ? `${u.title} \xB7 ${u.done}/${u.total} le\xE7ons` : "Parcours termin\xE9 ! \u{1F389}" }),
      /* @__PURE__ */ jsxs4("div", { style: { display: "flex", alignItems: "center", gap: 9, marginTop: 7 }, children: [
        /* @__PURE__ */ jsx6("div", { style: { flex: 1, height: 5, background: "rgba(0,0,0,.08)", borderRadius: 99, overflow: "hidden" }, children: /* @__PURE__ */ jsx6("div", { style: { width: `${stats.pct}%`, height: "100%", background: th ? th.color : C.green, borderRadius: 99, transition: "width .4s ease" } }) }),
        /* @__PURE__ */ jsxs4("span", { style: { fontSize: 11, fontWeight: 700, color: th ? th.colorD : C.greenD }, children: [
          stats.doneLessons,
          " / ",
          stats.totalLessons
        ] })
      ] })
    ] })
  ] });
}
function UnitHeader({ unit, th }) {
  const C = useC();
  return /* @__PURE__ */ jsxs4("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: unit.index === 0 ? "4px 0 16px" : "26px 0 16px"
  }, children: [
    /* @__PURE__ */ jsx6("div", { style: { flex: 1, height: 1.5, background: unit.unlocked ? `${th.color}44` : C.border } }),
    /* @__PURE__ */ jsxs4("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      background: unit.unlocked ? th.colorL : C.surface2,
      border: `1.5px solid ${unit.unlocked ? `${th.color}44` : C.border}`,
      borderRadius: 999,
      padding: "6px 14px"
    }, children: [
      /* @__PURE__ */ jsx6(Ti, { name: unit.unlocked ? th.icon.replace("ti-", "") : "lock", size: 13, color: unit.unlocked ? th.color : C.text3 }),
      /* @__PURE__ */ jsx6("span", { style: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        color: unit.unlocked ? th.colorD : C.text3,
        fontFamily: FONTS.ui
      }, children: unit.title })
    ] }),
    /* @__PURE__ */ jsx6("div", { style: { flex: 1, height: 1.5, background: unit.unlocked ? `${th.color}44` : C.border } })
  ] });
}
function CoursesScreen({ state, dispatch, content }) {
  const C = useC();
  const MODULE_THEME2 = buildModuleTheme(C);
  const [activeLesson, setActiveLesson] = useState4(null);
  const [checkingUnit, setCheckingUnit] = useState4(null);
  const [chestPop, setChestPop] = useState4(false);
  const currentRef = useRef3(null);
  const scrolledTo = useRef3(null);
  const path = useMemo(
    () => buildPath(content, state),
    [content, state.completedLessons, state.claimedUnits, state.unitChecks]
  );
  const stats = useMemo(
    () => getPathStats(content, state),
    [content, state.completedLessons, state.claimedUnits, state.unitChecks]
  );
  const unitLayouts = useMemo(() => {
    const out = {};
    for (const unit of path) {
      out[unit.id] = unit.lessons.map((l, i) => nodeLayout(l.id, unit.id, i));
    }
    return out;
  }, [path]);
  const focus = useMemo(() => {
    const aVerifier = path.find((u2) => u2.unlocked && u2.needsCheck);
    if (aVerifier) return { type: "chest", id: aVerifier.id, key: `chest:${aVerifier.id}` };
    const aOuvrir = path.find((u2) => u2.bonusClaimable);
    if (aOuvrir) return { type: "chest", id: aOuvrir.id, key: `chest:${aOuvrir.id}` };
    const u = path.find((x) => x.isCurrent);
    const lid = u ? u.lessons.find((l) => !state.completedLessons[l.id])?.id ?? null : null;
    return lid ? { type: "lesson", id: lid, key: `lesson:${lid}` } : null;
  }, [path, state.completedLessons]);
  useEffect3(() => {
    if (activeLesson || checkingUnit) return;
    if (!focus) return;
    if (scrolledTo.current === focus.key) return;
    const t = setTimeout(() => {
      currentRef.current?.scrollIntoView({
        behavior: scrolledTo.current === null ? "auto" : "smooth",
        block: "center"
      });
      scrolledTo.current = focus.key;
    }, 140);
    return () => clearTimeout(t);
  }, [activeLesson, checkingUnit, focus]);
  const claimChest = (unit) => {
    try {
      playChestOpen();
    } catch {
    }
    try {
      navigator.vibrate?.([15, 50, 25, 50, 35]);
    } catch {
    }
    dispatch({
      type: "CLAIM_UNIT_BONUS",
      unitId: unit.id,
      xp: unit.bonusXp ?? UNIT_BONUS_XP,
      title: `Coffre \u2014 ${unit.title}`
    });
    setChestPop(true);
    setTimeout(() => setChestPop(false), 1400);
  };
  if (activeLesson) return /* @__PURE__ */ jsx6(
    LessonView,
    {
      lesson: activeLesson,
      state,
      dispatch,
      onBack: () => setActiveLesson(null)
    }
  );
  if (checkingUnit) return /* @__PURE__ */ jsx6(
    UnitCheckScreen,
    {
      unit: checkingUnit,
      content,
      dispatch,
      state,
      onDone: () => setCheckingUnit(null)
    }
  );
  return /* @__PURE__ */ jsxs4("div", { children: [
    /* @__PURE__ */ jsx6("style", { children: PULSE_CSS }),
    chestPop && /* @__PURE__ */ jsx6(XPPop, { amount: UNIT_BONUS_XP, onDone: () => {
    } }),
    /* @__PURE__ */ jsxs4("div", { style: {
      backgroundColor: "#613878",
      backgroundImage: "url('/lavender.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 60%",
      padding: "26px 20px 18px",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx6("div", { style: { position: "absolute", inset: 0, background: "rgba(60,20,100,.52)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs4("div", { style: { position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsx6("div", { style: { fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }, children: "Parcours" }),
        /* @__PURE__ */ jsxs4("div", { style: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.78)", marginTop: 2, marginBottom: 14 }, children: [
          stats.units,
          " unit\xE9s \xB7 ",
          stats.totalLessons,
          " le\xE7ons \xB7 ",
          stats.pct,
          "%"
        ] }),
        /* @__PURE__ */ jsx6(CurrentUnitBanner, { stats, MODULE_THEME: MODULE_THEME2 })
      ] })
    ] }),
    /* @__PURE__ */ jsx6("div", { style: { display: "flex", gap: 14, padding: "12px 20px 4px", flexWrap: "wrap" }, children: [
      { color: C.primary, label: "En cours" },
      { color: C.primary, label: "\xC0 v\xE9rifier" },
      { color: C.green, label: "Compl\xE9t\xE9e" },
      { color: C.amber, label: "Coffre" },
      { color: C.text3, label: "Verrouill\xE9e" }
    ].map(({ color, label }) => /* @__PURE__ */ jsxs4("span", { style: { display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: C.text3 }, children: [
      /* @__PURE__ */ jsx6("span", { style: { width: 9, height: 9, borderRadius: "50%", background: color, display: "inline-block" } }),
      label
    ] }, label)) }),
    /* @__PURE__ */ jsxs4("div", { style: { padding: "8px 20px 40px" }, children: [
      path.map((unit) => {
        const th = MODULE_THEME2.palier;
        const currentLessonId = unit.isCurrent ? unit.lessons.find((l) => !state.completedLessons[l.id])?.id ?? null : null;
        return /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx6(UnitHeader, { unit, th }),
          unit.lessons.map((lesson, li) => {
            const isCurrent = lesson.id === currentLessonId;
            const lay = unitLayouts[unit.id][li];
            const prevLay = li === 0 ? null : unitLayouts[unit.id][li - 1];
            let gropiTip = null;
            if (isCurrent) {
              if (lesson.gropiTip) {
                gropiTip = lesson.gropiTip;
              } else {
                const remaining = unit.total - unit.done;
                gropiTip = remaining > 1 ? `Plus que ${remaining} le\xE7ons avant la v\xE9rification de l'unit\xE9 ${unit.index + 1}. Tu peux les faire dans l'ordre que tu veux.` : `Derni\xE8re le\xE7on de l'unit\xE9. La v\xE9rification t'attend juste apr\xE8s, tu es pr\xEAt.`;
              }
            }
            return /* @__PURE__ */ jsxs4(
              "div",
              {
                ref: focus?.type === "lesson" && focus.id === lesson.id ? currentRef : null,
                children: [
                  li > 0 && /* @__PURE__ */ jsx6(
                    PathConnector,
                    {
                      from: prevLay,
                      to: lay,
                      done: !!state.completedLessons[unit.lessons[li - 1].id]
                    }
                  ),
                  /* @__PURE__ */ jsx6(
                    PathNode,
                    {
                      lesson,
                      index: li,
                      state,
                      th,
                      onSelect: setActiveLesson,
                      isCurrent,
                      isLocked: !unit.unlocked,
                      gropiTip,
                      layout: lay
                    }
                  )
                ]
              },
              lesson.id
            );
          }),
          /* @__PURE__ */ jsx6(
            PathConnector,
            {
              from: unitLayouts[unit.id][unit.lessons.length - 1],
              to: { side: "center", inset: 0 },
              done: unit.complete
            }
          ),
          /* @__PURE__ */ jsx6("div", { ref: focus?.type === "chest" && focus.id === unit.id ? currentRef : null, children: /* @__PURE__ */ jsx6(UnitChest, { unit, th, onClaim: claimChest, onCheck: setCheckingUnit }) })
        ] }, unit.id);
      }),
      stats.pct === 100 && /* @__PURE__ */ jsxs4("div", { style: { textAlign: "center", marginTop: 20 }, children: [
        /* @__PURE__ */ jsx6(Gropi, { pose: "celebrate", size: 130, anim: "cheer", style: { margin: "0 auto" } }),
        /* @__PURE__ */ jsx6("div", { style: { fontSize: 17, fontWeight: 800, color: C.greenD, marginTop: 8, letterSpacing: "-.2px" }, children: "Parcours compl\xE9t\xE9 ! \u{1F389}" }),
        /* @__PURE__ */ jsx6("div", { style: { fontSize: 12, color: C.text2, marginTop: 4 }, children: "Continue avec les r\xE9visions, la Jam et les d\xE9fis pour entretenir tout \xE7a." })
      ] })
    ] })
  ] });
}
function LessonView({ lesson, state, dispatch, onBack }) {
  const { renderDiagramBlock, FretboardLesson: FretboardLesson2 } = useRenderers();
  const C = useC();
  const [done, setDone] = useState4(!!state.completedLessons[lesson.id]);
  const [pop, setPop] = useState4(false);
  const popTimerRef = useRef3(null);
  useEffect3(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [lesson.id]);
  useEffect3(() => () => {
    if (popTimerRef.current) clearTimeout(popTimerRef.current);
  }, []);
  const finish = () => {
    if (!done) {
      setPop(true);
      try {
        playLessonComplete();
      } catch {
      }
      try {
        navigator.vibrate?.([12, 40, 18]);
      } catch {
      }
      dispatch({ type: "COMPLETE_LESSON", id: lesson.id, title: lesson.title });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
      setDone(true);
      popTimerRef.current = setTimeout(() => setPop(false), 1e3);
    }
  };
  return /* @__PURE__ */ jsxs4("div", { children: [
    pop && /* @__PURE__ */ jsx6(XPPop, { amount: 30, onDone: () => {
    } }),
    /* @__PURE__ */ jsxs4("div", { style: { padding: "14px 20px 0", display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsx6("button", { onClick: onBack, style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.sm, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }, children: /* @__PURE__ */ jsx6(Ti, { name: "arrow-left", size: 17, color: C.text }) }),
      /* @__PURE__ */ jsx6("span", { style: { fontSize: 13, fontWeight: 600, color: C.text2, fontFamily: FONTS.ui }, children: "Retour au parcours" })
    ] }),
    /* @__PURE__ */ jsxs4("div", { style: { padding: "16px 20px 0" }, children: [
      /* @__PURE__ */ jsx6("h1", { style: { margin: "0 0 6px", fontSize: 22, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-.3px", color: C.text }, children: lesson.title }),
      /* @__PURE__ */ jsxs4("p", { style: { fontSize: 11, color: C.text3, margin: "0 0 20px", letterSpacing: ".05em", textTransform: "uppercase", fontWeight: 600 }, children: [
        lesson.duration,
        " MIN \xB7 ",
        (lesson.quiz || []).length,
        " QUESTIONS"
      ] }),
      /* @__PURE__ */ jsx6("div", { style: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }, children: lesson.content.map((b, i) => {
        if (b.type === "h") return /* @__PURE__ */ jsx6("h3", { style: { margin: "8px 0 0", fontSize: 17, fontWeight: 800, color: C.primary, letterSpacing: "-.2px" }, children: b.text }, i);
        if (b.type === "tip") return /* @__PURE__ */ jsx6(GropiCoach, { variant: "tip", children: b.text }, i);
        if (b.type === "img") return /* @__PURE__ */ jsxs4("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsx6("img", { src: b.src, alt: b.alt || "", style: { maxWidth: "56%", maxHeight: 150, width: "auto", height: "auto", margin: "0 auto", display: "block" } }),
          b.caption && /* @__PURE__ */ jsx6("p", { style: { fontSize: 12, color: C.text3, marginTop: 8, fontStyle: "italic" }, children: b.caption })
        ] }, i);
        if (b.type === "ref") return /* @__PURE__ */ jsx6(GropiCoach, { variant: "ref", children: b.text }, i);
        const diagram = renderDiagramBlock ? renderDiagramBlock(b, i) : null;
        if (diagram) return diagram;
        if (b.type === "fretboard_interactive" && FretboardLesson2) return /* @__PURE__ */ jsx6("div", { children: /* @__PURE__ */ jsx6(FretboardLesson2, { block: b }) }, i);
        if (b.img) return /* @__PURE__ */ jsxs4("div", { style: { overflow: "hidden" }, children: [
          /* @__PURE__ */ jsx6("img", { src: b.img, alt: b.imgAlt || "", style: {
            float: b.imgSide === "left" ? "left" : "right",
            width: "34%",
            maxWidth: 124,
            height: "auto",
            margin: b.imgSide === "left" ? "0 14px 4px 0" : "0 0 4px 14px"
          } }),
          /* @__PURE__ */ jsx6("p", { style: { margin: 0, fontSize: 15, lineHeight: 1.7, color: C.text }, children: b.text })
        ] }, i);
        return /* @__PURE__ */ jsx6("p", { style: { margin: 0, fontSize: 15, lineHeight: 1.7, color: C.text }, children: b.text }, i);
      }) }),
      (lesson.quiz || []).length > 0 && /* @__PURE__ */ jsxs4("div", { style: { background: C.primaryL, border: `1.5px solid ${C.primaryBorder}`, borderRadius: R.md, padding: "11px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }, children: [
        /* @__PURE__ */ jsx6(Ti, { name: "notebook", size: 16, color: C.primary }),
        /* @__PURE__ */ jsxs4("p", { style: { margin: 0, fontSize: 12, color: C.primaryD }, children: [
          "Cette le\xE7on est associ\xE9e \xE0 ",
          (lesson.quiz || []).length,
          " question",
          (lesson.quiz || []).length > 1 ? "s" : "",
          " de quiz."
        ] })
      ] }),
      done ? /* @__PURE__ */ jsxs4("div", { style: { background: C.greenL, borderRadius: R.xl, padding: "22px 20px", textAlign: "center", border: `1.5px solid ${C.greenBorder}`, marginBottom: 8 }, children: [
        /* @__PURE__ */ jsx6(Gropi, { pose: "celebrate", size: 120, anim: "cheer", style: { margin: "0 auto" } }),
        /* @__PURE__ */ jsx6("div", { style: { fontSize: 20, fontWeight: 800, color: C.greenD, letterSpacing: "-.3px", marginTop: 8 }, children: "Le\xE7on compl\xE9t\xE9e !" }),
        /* @__PURE__ */ jsx6("div", { style: { fontSize: 13, color: C.green, marginTop: 4 }, children: "+30 XP \xB7 Continue sur ta lanc\xE9e" }),
        /* @__PURE__ */ jsx6("button", { onClick: onBack, style: { marginTop: 16, padding: "12px 32px", borderRadius: R.lg, border: "none", background: C.green, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui, boxShadow: `0 4px 14px ${C.green}44` }, children: "Retour au parcours" })
      ] }) : /* @__PURE__ */ jsx6("button", { onClick: finish, style: {
        width: "100%",
        padding: 14,
        borderRadius: R.lg,
        border: "none",
        background: C.primary,
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONTS.ui,
        letterSpacing: ".01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        boxShadow: `0 4px 16px ${C.primary}44`
      }, children: "Terminer la le\xE7on \xB7 +30 XP" }),
      /* @__PURE__ */ jsx6("div", { style: { height: 24 } })
    ] })
  ] });
}

// src/screens/QuizScreen.jsx
var QuizScreen_exports = {};
__export(QuizScreen_exports, {
  QuizPlayer: () => QuizPlayer,
  QuizScreen: () => QuizScreen
});
import { useState as useState5, useMemo as useMemo2 } from "react";

// src/music/chordShapes.js
var CHROMATIC2 = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var OPEN_STRINGS2 = ["E", "A", "D", "G", "B", "E"];
var SHAPES = {
  maj: [
    { id: "E", label: "Forme Mi", rootString: 0, offsets: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1], barre: true },
    { id: "A", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 2, 2, 0], fingers: [0, 1, 3, 4, 2, 1], barre: true },
    { id: "C", label: "Forme Do", rootString: 1, offsets: [null, 0, -1, -3, -2, -3], fingers: [0, 3, 2, 0, 1, 0] },
    { id: "D", label: "Forme R\xE9", rootString: 2, offsets: [null, null, 0, 2, 3, 2], fingers: [0, 0, 1, 2, 4, 3] },
    { id: "G", label: "Forme Sol", rootString: 0, offsets: [0, -1, -3, -3, -3, 0], fingers: [2, 1, 0, 0, 0, 3] }
  ],
  min: [
    { id: "Em", label: "Forme Mim", rootString: 0, offsets: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1], barre: true },
    { id: "Am", label: "Forme Lam", rootString: 1, offsets: [null, 0, 2, 2, 1, 0], fingers: [0, 1, 3, 4, 2, 1], barre: true },
    { id: "Dm", label: "Forme R\xE9m", rootString: 2, offsets: [null, null, 0, 2, 3, 1], fingers: [0, 0, 1, 3, 4, 2] }
  ],
  dom7: [
    { id: "E7", label: "Forme Mi7", rootString: 0, offsets: [0, 2, 0, 1, 0, 0], fingers: [1, 3, 1, 2, 1, 1], barre: true },
    { id: "A7", label: "Forme La7", rootString: 1, offsets: [null, 0, 2, 0, 2, 0], fingers: [0, 1, 3, 1, 4, 1], barre: true },
    { id: "D7", label: "Forme R\xE97", rootString: 2, offsets: [null, null, 0, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4] }
  ],
  maj7: [
    { id: "Emaj7", label: "Forme Mi", rootString: 0, offsets: [0, null, 1, 1, 0, null], fingers: [1, 0, 3, 4, 2, 0] },
    { id: "Amaj7", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 1, 2, 0], fingers: [0, 1, 3, 2, 4, 1] },
    { id: "Dmaj7", label: "Forme R\xE9", rootString: 2, offsets: [null, null, 0, 2, 2, 2], fingers: [0, 0, 1, 2, 3, 4] }
  ],
  min7: [
    { id: "Em7", label: "Forme Mim7", rootString: 0, offsets: [0, 2, 0, 0, 0, 0], fingers: [1, 3, 1, 1, 1, 1], barre: true },
    { id: "Am7", label: "Forme Lam7", rootString: 1, offsets: [null, 0, 2, 0, 1, 0], fingers: [0, 1, 3, 1, 2, 1], barre: true },
    { id: "Dm7", label: "Forme R\xE9m7", rootString: 2, offsets: [null, null, 0, 2, 1, 1], fingers: [0, 0, 1, 3, 2, 2] }
  ],
  min7b5: [
    { id: "Am7b5", label: "Forme La", rootString: 1, offsets: [null, 0, 1, 0, 1, null], fingers: [0, 2, 3, 1, 4, 0] },
    { id: "Em7b5", label: "Forme Mi", rootString: 0, offsets: [0, 1, 0, 0, null, null], fingers: [1, 3, 2, 2, 0, 0] }
  ],
  dim7: [
    { id: "Ddim7", label: "Forme R\xE9", rootString: 2, offsets: [null, null, 0, 1, 0, 1], fingers: [0, 0, 1, 3, 2, 4] },
    { id: "Adim7", label: "Forme La", rootString: 1, offsets: [null, 0, 1, 2, 1, null], fingers: [0, 1, 2, 4, 3, 0] }
  ],
  maj6: [
    { id: "A6", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 2, 2, 2], fingers: [0, 1, 2, 3, 3, 3] },
    { id: "E6", label: "Forme Mi", rootString: 0, offsets: [0, 2, 1, 1, 2, null], fingers: [1, 3, 1, 1, 4, 0] }
  ],
  sus4: [
    { id: "Asus4", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 2, 3, 0], fingers: [0, 1, 2, 3, 4, 1], barre: true },
    { id: "Esus4", label: "Forme Mi", rootString: 0, offsets: [0, 2, 2, 2, 0, 0], fingers: [1, 2, 3, 4, 1, 1], barre: true }
  ],
  add9: [
    { id: "Cadd9", label: "Forme Do", rootString: 1, offsets: [null, 0, -1, -3, 0, -3] },
    { id: "Aadd9", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 4, 2, 0] },
    { id: "Eadd9", label: "Forme Mi", rootString: 0, offsets: [0, 2, 1, 1, 0, 2] }
  ],
  dom9: [
    { id: "A9", label: "Forme La", rootString: 1, offsets: [null, 0, 1, 0, 2, 0], fingers: [0, 2, 3, 1, 4, 1] },
    { id: "E9", label: "Forme Mi", rootString: 0, offsets: [0, 2, 0, 1, 0, 2], fingers: [1, 3, 1, 2, 1, 4] }
  ]
};
function computeFingers(frets, isBarre) {
  const fingers = [0, 0, 0, 0, 0, 0];
  const fretted = frets.map((f, s) => ({ f, s })).filter((x) => x.f > 0).sort((a, b) => a.f - b.f || a.s - b.s);
  if (!fretted.length) return fingers;
  const minFret = fretted[0].f;
  const atMin = fretted.filter((x) => x.f === minFret);
  let next = 1;
  if (isBarre && atMin.length >= 2) {
    for (const x of atMin) fingers[x.s] = 1;
    next = 2;
  }
  for (const x of fretted) {
    if (fingers[x.s] !== 0) continue;
    fingers[x.s] = Math.min(4, next);
    next++;
  }
  return fingers;
}
function fretForNote(stringIdx, noteName) {
  const open = CHROMATIC2.indexOf(OPEN_STRINGS2[stringIdx]);
  const target = CHROMATIC2.indexOf(noteName);
  if (open < 0 || target < 0) return -1;
  return (target - open + 12) % 12;
}
function getChordShapes(rootName, quality, maxFret = 10, chordIntervals = null) {
  const shapes = SHAPES[quality];
  if (!shapes) return [];
  const rootIdx = CHROMATIC2.indexOf(rootName);
  const allowed = chordIntervals ? new Set(chordIntervals.map((i) => CHROMATIC2[(rootIdx + i) % 12])) : null;
  const out = [];
  for (const shape2 of shapes) {
    let rootFret = fretForNote(shape2.rootString, rootName);
    if (rootFret < 0) continue;
    const frets = shape2.offsets.map((o) => o === null ? null : rootFret + o);
    const played = frets.filter((f) => f !== null);
    if (!played.length) continue;
    const highest = Math.max(...played);
    if (highest > maxFret) continue;
    if (played.some((f) => f < 0)) continue;
    if (allowed) {
      const notes = frets.map((f, s) => f === null || f < 0 ? null : CHROMATIC2[(CHROMATIC2.indexOf(OPEN_STRINGS2[s]) + f) % 12]);
      if (notes.some((n) => n && !allowed.has(n))) continue;
    }
    const fretted = played.filter((f) => f > 0);
    if (fretted.length && Math.max(...fretted) - Math.min(...fretted) > 3) continue;
    const startFret = fretted.length ? Math.min(...fretted) : 1;
    const isOpen = frets.some((f) => f === 0);
    out.push({
      name: rootName,
      label: shape2.label,
      // <ChordDiagram> attend -1 pour une corde étouffée, 0 pour une corde
      // à vide, et des cases absolues sinon.
      frets: frets.map((f) => f === null ? -1 : f),
      // Doigté DÉRIVÉ des cases, jamais celui écrit dans la forme : ce
      // dernier ne vaut que pour la position barrée.
      fingers: computeFingers(frets.map((f) => f === null ? -1 : f), !!shape2.barre && !isOpen),
      // Un accord ouvert s'affiche depuis le SILLET (startFret 1), avec les
      // cordes à vide en cercles au-dessus — c'est la représentation
      // classique, celle de tous les recueils d'accords. Prendre la plus
      // basse case frettée décalerait la grille et rendrait le doigté
      // méconnaissable.
      startFret: isOpen ? 1 : startFret,
      // Pas d'indicateur de barré sur un accord ouvert : le sillet joue ce
      // rôle, et afficher un barré case 0 serait trompeur.
      barre: shape2.barre && !isOpen ? startFret : void 0,
      rootFret,
      isOpen
    });
  }
  out.sort((a, b) => b.isOpen - a.isOpen || a.rootFret - b.rootFret);
  return out;
}

// src/music/shapeQuestions.js
var COMMON_ROOTS = ["E", "A", "D", "G", "C"];
var EXTENDED_ROOTS = ["E", "A", "D", "G", "C", "F", "B", "F#"];
var LEVEL_SPEC = {
  1: { roots: COMMON_ROOTS, qualities: ["maj", "min"], openOnly: true, xp: 45 },
  2: { roots: COMMON_ROOTS, qualities: ["maj", "min"], barreOnly: true, xp: 50 },
  3: { roots: COMMON_ROOTS, qualities: ["maj", "min", "dom7"], notOpen: true, xp: 55 },
  4: { roots: EXTENDED_ROOTS, qualities: ["dom7", "min7", "maj7", "add9"], xp: 60 }
};
function shapeToPositions(shape2) {
  return shape2.frets.map((fret, i) => ({ string: 6 - i, fret })).filter((p) => p.fret > 0);
}
function shapeToOpenPositions(shape2) {
  return shape2.frets.map((fret, i) => ({ string: 6 - i, fret })).filter((p) => p.fret === 0);
}
function makeShapeQuestion(level = 1, rng = Math.random) {
  const spec = LEVEL_SPEC[Math.max(1, Math.min(4, level))] || LEVEL_SPEC[1];
  for (let attempt = 0; attempt < 24; attempt++) {
    const root = spec.roots[Math.floor(rng() * spec.roots.length)];
    const quality = spec.qualities[Math.floor(rng() * spec.qualities.length)];
    const all = getChordShapes(root, quality, 10, CHORD_TYPES[quality]?.intervals || null);
    if (!all.length) continue;
    let pool = all;
    if (spec.openOnly) pool = all.filter((s) => s.isOpen);
    if (spec.barreOnly) pool = all.filter((s) => s.barre);
    if (spec.notOpen) pool = all.filter((s) => !s.isOpen);
    if (!pool.length) continue;
    const shape2 = pool[Math.floor(rng() * pool.length)];
    const positions = shapeToPositions(shape2);
    const openPositions = shapeToOpenPositions(shape2);
    if (positions.length < 2) continue;
    const rootFr = noteToFr(root);
    const sym = CHORD_TYPES[quality]?.sym ?? "";
    const chordName = `${rootFr}${sym}`;
    let q, hint;
    if (spec.openOnly) {
      q = `Montre la forme de ${chordName} en position ouverte`;
      const oc = openPositions.map((p) => p.string);
      hint = oc.length === 0 ? `Place uniquement les doigts n\xE9cessaires.` : oc.length === 1 ? `Place uniquement les doigts. La corde ${oc[0]} sonne \xE0 vide, tu n'as pas \xE0 la s\xE9lectionner.` : `Place uniquement les doigts. Les cordes ${oc.join(", ")} sonnent \xE0 vide, tu n'as pas \xE0 les s\xE9lectionner.`;
    } else if (spec.barreOnly) {
      q = `Montre ${chordName} en barr\xE9, ${shape2.label.toLowerCase()}`;
      hint = `L'index barre la case ${shape2.startFret}.`;
    } else if (spec.notOpen) {
      q = `Montre ${chordName} ailleurs qu'en position ouverte`;
      hint = `Indice CAGED : cherche la ${shape2.label.toLowerCase()}, vers la case ${shape2.startFret}.`;
    } else {
      q = `Montre ${chordName} \u2014 ${shape2.label.toLowerCase()}`;
      hint = `Autour de la case ${shape2.startFret}.`;
    }
    return {
      id: `shape-${root}-${quality}-${shape2.label.replace(/\s+/g, "")}-${Math.floor(rng() * 1e4)}`,
      type: "fretboard",
      courseId: "harmony",
      lvl: Math.min(3, level),
      // le Parcours n'expose que 3 niveaux
      q,
      hint,
      concept: { type: "find_shape", positions, neutralPositions: openPositions },
      // Mode "all" : toutes les positions attendues, aucune de trop — c'est
      // exactement la validation d'une forme. ("exact" n'est pas un mode
      // reconnu du validateur, il retomberait sur "all" sans le dire.)
      selectionRules: { mode: "all" },
      display: { showNotes: false },
      fretRange: [Math.max(0, shape2.startFret - 1), Math.min(12, shape2.startFret + 4)],
      xp: spec.xp,
      exp: `${chordName} \xB7 ${shape2.label} \xB7 case ${shape2.startFret}. \xC0 presser : ${positions.map((p) => `corde ${p.string} case ${p.fret}`).join(", ")}.` + (openPositions.length === 0 ? "" : openPositions.length === 1 ? ` La corde ${openPositions[0].string} sonne \xE0 vide : rien \xE0 y placer.` : ` Les cordes ${openPositions.map((p) => p.string).join(", ")} sonnent \xE0 vide : rien \xE0 y placer.`)
    };
  }
  return null;
}

// src/store/dates.js
var dayStr = (date = /* @__PURE__ */ new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const j = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${j}`;
};
var todayStr = () => dayStr();
var daysBetween = (a, b) => {
  if (!a || !b) return null;
  const pa = a.split("-").map(Number), pb = b.split("-").map(Number);
  if (pa.length !== 3 || pb.length !== 3) return null;
  const ta = Date.UTC(pa[0], pa[1] - 1, pa[2]);
  const tb = Date.UTC(pb[0], pb[1] - 1, pb[2]);
  return Math.round((tb - ta) / 864e5);
};
var weekStr = (date = /* @__PURE__ */ new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

// src/store/reviewEngine.js
var EASE_MIN = 1.3;
var EASE_MAX = 2.7;
var EASE_START = 2.2;
var INTERVAL_MAX = 180;
var QUALITY = { AGAIN: "again", HARD: "hard", GOOD: "good", EASY: "easy" };
var qualityFromBool = (correct) => correct ? QUALITY.GOOD : QUALITY.AGAIN;
var EASE_DELTA = { again: -0.3, hard: -0.15, good: 0, easy: 0.15 };
var clampEase = (e) => Math.max(EASE_MIN, Math.min(EASE_MAX, Number(e) || EASE_START));
function nextInterval(prev, quality) {
  const streak = prev?.streak || 0;
  const ease = clampEase(prev?.ease);
  const interval = prev?.interval || 0;
  if (quality === QUALITY.AGAIN) return 0;
  if (streak === 0) return quality === QUALITY.EASY ? 2 : 1;
  if (streak === 1) return quality === QUALITY.HARD ? 2 : quality === QUALITY.EASY ? 6 : 4;
  const factor = quality === QUALITY.HARD ? 1.2 : quality === QUALITY.EASY ? ease * 1.3 : ease;
  return Math.min(INTERVAL_MAX, Math.max(1, Math.round((interval || 4) * factor)));
}
var NEW_SCORE = -1;
function getPriorityScore(itemId, history, completedLessons, today = todayStr()) {
  const h = history?.[itemId];
  if (!h) return NEW_SCORE;
  const { attempts = 0, successes = 0, lastSeen = "", streak = 0 } = h;
  const interval = h.interval != null ? h.interval : [0, 1, 4, 10, 30][Math.min(streak, 4)];
  const daysSince = lastSeen ? daysBetween(lastSeen, today) ?? 999 : 999;
  if (daysSince < interval && streak > 0) return 0;
  const successRate = attempts > 0 ? successes / attempts : 0;
  const failurePriority = (1 - successRate) * 50;
  const overdue = Math.min((daysSince - interval) * 3, 30);
  const neverSucceeded = successes === 0 && attempts > 0 ? 20 : 0;
  const hardItem = clampEase(h.ease) <= 1.6 ? 10 : 0;
  return Math.max(1, Math.round(failurePriority + overdue + neverSucceeded + hardItem));
}
var isNew = (itemId, history) => !history?.[itemId];
function isEligible(item, completedLessons) {
  const lessonId = item.lessonId ?? item.courseLink ?? null;
  const courseId = item.courseId ?? item.mod ?? null;
  if (lessonId && !completedLessons?.[lessonId]) return false;
  if (!lessonId && courseId) {
    const coursePrefix = courseId + "-";
    const hasCourseLesson = Object.keys(completedLessons || {}).some((id) => id.startsWith(coursePrefix));
    if (!hasCourseLesson) return false;
  }
  return true;
}
function buildReviewSession(allQuestions, reviewHistory, completedLessons, options = {}) {
  const {
    targetCount = 12,
    maxFretboard = 5,
    today = todayStr(),
    maxNew = 5,
    // plafond de NOUVEAUX items dans la session
    lookaheadQuestions = null
  } = options;
  const eligible = (allQuestions || []).filter((q) => isEligible(q, completedLessons));
  if (eligible.length === 0) return { questions: [], reason: "no_lessons_completed", stats: emptyStats() };
  const scored = [], fresh = [];
  for (const q of eligible) {
    const score = getPriorityScore(q.id, reviewHistory, completedLessons, today);
    if (score === NEW_SCORE) fresh.push(q);
    else if (score > 0) scored.push({ question: q, score });
  }
  scored.sort((a, b) => b.score - a.score || Math.random() - 0.5);
  const session = [];
  let fretboardCount = 0;
  const canAdd = (q) => {
    if (session.length >= targetCount) return false;
    const isFret = q.type === "fretboard";
    if (isFret) {
      if (fretboardCount >= maxFretboard) return false;
      const lastTwo = session.slice(-2);
      if (lastTwo.length === 2 && lastTwo.every((x) => x.type === "fretboard")) return false;
    }
    if (session.some((x) => x.id === q.id)) return false;
    return true;
  };
  const add = (q) => {
    session.push(q);
    if (q.type === "fretboard") fretboardCount++;
  };
  const dueBudget = Math.max(1, Math.floor(targetCount * 0.7));
  for (const { question } of scored) {
    if (session.length >= dueBudget) break;
    if (canAdd(question)) add(question);
  }
  let added = 0;
  for (const q of fresh) {
    if (added >= maxNew) break;
    if (canAdd(q)) {
      add(q);
      added++;
    }
  }
  for (const { question } of scored) {
    if (session.length >= targetCount) break;
    if (canAdd(question)) add(question);
  }
  for (const q of fresh) {
    if (session.length >= targetCount) break;
    if (canAdd(q)) add(q);
  }
  if (session.length < targetCount) {
    const notDue = eligible.filter((q) => !session.some((s) => s.id === q.id)).map((q) => ({ q, lastSeen: reviewHistory?.[q.id]?.lastSeen || "2000-01-01" })).sort((a, b) => a.lastSeen.localeCompare(b.lastSeen));
    for (const { q } of notDue) {
      if (!canAdd(q)) break;
      add(q);
    }
  }
  if (session.length < targetCount && Array.isArray(lookaheadQuestions)) {
    for (const q of lookaheadQuestions) {
      if (!canAdd(q)) continue;
      add(q);
    }
  }
  return {
    questions: session,
    reason: scored.length === 0 && fresh.length === 0 ? "all_recent" : "normal",
    stats: {
      total: session.length,
      fretboard: fretboardCount,
      mcq: session.length - fretboardCount,
      dueCount: scored.length,
      newCount: fresh.length,
      newInSession: session.filter((q) => isNew(q.id, reviewHistory)).length
    }
  };
}
var emptyStats = () => ({ total: 0, fretboard: 0, mcq: 0, dueCount: 0, newCount: 0, newInSession: 0 });
function updateReviewHistory(history, itemId, correct, today = todayStr()) {
  const quality = typeof correct === "string" ? correct : qualityFromBool(correct);
  const ok = quality !== QUALITY.AGAIN;
  const prev = history?.[itemId] || { attempts: 0, successes: 0, streak: 0, lastSeen: "", ease: EASE_START, interval: 0 };
  const ease = clampEase((prev.ease ?? EASE_START) + (EASE_DELTA[quality] ?? 0));
  const streak = ok ? (prev.streak || 0) + 1 : 0;
  const interval = nextInterval({ ...prev, streak: prev.streak || 0 }, quality);
  return {
    ...history,
    [itemId]: {
      attempts: (prev.attempts || 0) + 1,
      successes: (prev.successes || 0) + (ok ? 1 : 0),
      streak,
      lastSeen: today,
      ease,
      interval,
      due: interval > 0 ? dayStr(new Date((/* @__PURE__ */ new Date(`${today}T12:00:00`)).getTime() + interval * 864e5)) : today,
      quality
    }
  };
}
function getReviewStats(allQuestions, reviewHistory, completedLessons) {
  const today = todayStr();
  const eligible = (allQuestions || []).filter((q) => isEligible(q, completedLessons));
  let toReview = 0, neverSeen = 0, mastered = 0;
  for (const q of eligible) {
    const score = getPriorityScore(q.id, reviewHistory, completedLessons, today);
    if (score === NEW_SCORE) neverSeen++;
    else if (score > 0) toReview++;
    if ((reviewHistory?.[q.id]?.interval || 0) >= 30) mastered++;
  }
  return {
    eligible: eligible.length,
    toReview,
    // plus de plafond artificiel à 99
    neverSeen,
    mastered,
    pctMastered: eligible.length > 0 ? Math.round(mastered / eligible.length * 100) : 0
  };
}

// src/screens/QuizScreen.jsx
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var makeModules = (C) => [
  { id: "neck", label: "Manche", icon: "map-2", color: C.amber, colorL: C.amberL, colorD: C.amberD, border: C.amberBorder },
  { id: "scales", label: "Gammes", icon: "music", color: C.green, colorL: C.greenL, colorD: C.greenD, border: C.greenBorder },
  { id: "harmony", label: "Harmonie", icon: "stack-2", color: C.purple, colorL: C.purpleL, colorD: C.purpleD, border: C.purpleBorder },
  { id: "rhythm", label: "Rythme", icon: "metronome", color: C.blue, colorL: C.blueL, colorD: C.blueD, border: C.blueBorder },
  { id: "impro", label: "Impro", icon: "wand", color: C.pink, colorL: C.pinkL, colorD: C.pinkD, border: C.pinkBorder }
];
function unlockedQuizLvl(state, content, courseId) {
  const course = content.courses.find((c) => c.id === courseId);
  if (!course || !course.lessons.length) return 1;
  const done = course.lessons.filter((l) => state.completedLessons[l.id]).length;
  const frac = done / course.lessons.length;
  if (frac < 0.3) return 1;
  if (frac < 0.65) return 2;
  return 3;
}
function QuizScreen({ state, dispatch, content, embedded = false }) {
  const C = useC();
  const [showModules, setShowModules] = useState5(false);
  const MODULES = makeModules(C);
  const [mode, setMode] = useState5(null);
  const totalAnswered = Object.keys(state.quizResults).length;
  const totalQ = content.quiz.length;
  const pctDone = totalQ ? Math.round(totalAnswered / totalQ * 100) : 0;
  const wrongCount = state.wrongQuiz.length;
  const unlockedLvl = {};
  MODULES.forEach((m) => {
    unlockedLvl[m.id] = unlockedQuizLvl(state, content, m.id);
  });
  const isUnlocked = (q) => (q.lvl ?? 1) <= (unlockedLvl[q.courseId] ?? 3);
  const pools = {
    // Avant : les 3 premières questions ratées (dans l'ordre du tableau,
    // pas par urgence) + 4 fraîches au hasard. Ça ne tenait jamais compte
    // du VRAI calendrier de révision espacée (streak, intervalle 1/4/10/30
    // jours) déjà calculé ailleurs pour l'affichage — juste ignoré ici.
    // Maintenant : le moteur SM-2 choisit vraiment, priorité par urgence.
    daily: () => {
      const eligible = content.quiz.filter(isUnlocked);
      const lookahead = content.quiz.filter((q) => {
        const cap = unlockedLvl[q.courseId] ?? 3;
        const lvl = q.lvl ?? 1;
        return lvl === cap + 1;
      });
      const { questions } = buildReviewSession(eligible, state.reviewHistory, state.completedLessons, {
        targetCount: 7,
        lookaheadQuestions: lookahead
      });
      return questions;
    }
  };
  MODULES.forEach((m) => {
    pools[m.id] = () => content.quiz.filter((q) => q.courseId === m.id && isUnlocked(q)).sort(() => Math.random() - 0.5).slice(0, 7);
  });
  const launch = (id, label) => setMode({ id, label, pool: pools[id]() });
  if (mode) return /* @__PURE__ */ jsx7(QuizPlayer, { pool: mode.pool, title: mode.label, state, dispatch, content, onDone: () => setMode(null) });
  return /* @__PURE__ */ jsxs5("div", { children: [
    !embedded && /* @__PURE__ */ jsxs5("div", { style: {
      backgroundColor: "#36b3d7",
      backgroundImage: "url('/ocean.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
      padding: "24px 20px 20px",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx7("div", { style: { position: "absolute", inset: 0, background: "rgba(0,60,80,.50)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs5("div", { style: { position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsx7("div", { style: { fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }, children: "Quiz" }),
        /* @__PURE__ */ jsxs5("div", { style: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.8)", marginTop: 2, marginBottom: 14 }, children: [
          totalAnswered,
          " / ",
          totalQ,
          " questions r\xE9pondues"
        ] }),
        /* @__PURE__ */ jsxs5("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 }, children: [
          /* @__PURE__ */ jsxs5("span", { style: { fontSize: 12, fontWeight: 700, color: "#fff" }, children: [
            pctDone,
            "% ma\xEEtris\xE9"
          ] }),
          wrongCount > 0 && /* @__PURE__ */ jsxs5("span", { style: { fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.85)" }, children: [
            wrongCount,
            " \xE0 r\xE9viser"
          ] })
        ] }),
        /* @__PURE__ */ jsx7(ProgressBar, { pct: pctDone, color: C.teal, h: 7 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("div", { style: { padding: embedded ? "4px 20px 0" : "16px 20px 0" }, children: [
      /* @__PURE__ */ jsx7("div", { style: { fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 10 }, children: "Aujourd'hui" }),
      /* @__PURE__ */ jsxs5("button", { onClick: () => launch("daily", "Quiz du jour"), style: {
        width: "100%",
        background: `linear-gradient(135deg, ${C.primaryL}, ${C.surface})`,
        border: `2px solid ${C.primaryBorder}`,
        borderRadius: R.xl,
        padding: 16,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: FONTS.title,
        marginBottom: 10,
        display: "flex",
        gap: 14,
        alignItems: "center"
      }, children: [
        /* @__PURE__ */ jsx7("div", { style: { width: 52, height: 52, borderRadius: R.lg, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${C.primaryBorder}` }, children: /* @__PURE__ */ jsx7(Ti, { name: "star", size: 24, color: "#fff" }) }),
        /* @__PURE__ */ jsxs5("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 10, fontWeight: 700, color: C.primary, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 3 }, children: "Recommand\xE9 \xB7 7 questions" }),
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }, children: "Quiz du jour" }),
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 12, color: C.text3, marginTop: 2 }, children: "Adapt\xE9 \xE0 ta progression \xB7 ~5 min" })
        ] }),
        /* @__PURE__ */ jsx7(Ti, { name: "arrow-right", size: 18, color: C.primary })
      ] }),
      /* @__PURE__ */ jsxs5(
        "button",
        {
          onClick: () => setShowModules((v) => !v),
          style: {
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 0 10px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: FONTS.ui,
            textAlign: "left"
          },
          children: [
            /* @__PURE__ */ jsx7(Ti, { name: showModules ? "chevron-down" : "chevron-right", size: 15, color: C.text3 }),
            /* @__PURE__ */ jsx7("span", { style: { fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: ".07em", textTransform: "uppercase" }, children: "Cibler un module" })
          ]
        }
      ),
      showModules && /* @__PURE__ */ jsx7("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }, children: MODULES.map((m) => {
        const total = content.quiz.filter((q) => q.courseId === m.id && isUnlocked(q)).length;
        if (total === 0) return null;
        return /* @__PURE__ */ jsxs5("button", { onClick: () => launch(m.id, m.label), style: {
          background: C.surface,
          border: `1.5px solid ${C.border}`,
          borderRadius: R.md,
          padding: "11px 12px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: FONTS.ui
        }, children: [
          /* @__PURE__ */ jsx7(Ti, { name: m.icon, size: 17, color: m.color }),
          /* @__PURE__ */ jsx7("span", { style: { fontSize: 13, fontWeight: 700, color: C.text }, children: m.label })
        ] }, m.id);
      }) }),
      /* @__PURE__ */ jsx7("div", { style: { height: 24 } })
    ] })
  ] });
}
function QuizPlayer({ pool, title, state, dispatch, content, onDone }) {
  const { FretboardQuizQuestion: FretboardQuizQuestion2 } = useRenderers();
  const C = useC();
  const [questions] = useState5(() => {
    const base = [...pool];
    if (base.length < 3) return base;
    const harmonyLvl = unlockedQuizLvl(state, content, "harmony");
    const harmonyDone = content.courses.find((c) => c.id === "harmony")?.lessons.filter((l) => state.completedLessons[l.id]).length ?? 0;
    const harmonyTotal = content.courses.find((c) => c.id === "harmony")?.lessons.length || 1;
    const shapeLevel = harmonyLvl < 3 ? harmonyLvl : harmonyDone / harmonyTotal > 0.85 ? 4 : 3;
    const ears = [
      makeEarQuizQuestion("interval"),
      makeEarQuizQuestion("chord_quality"),
      makeShapeQuestion(shapeLevel)
    ].filter(Boolean);
    for (const e of ears) {
      const at = 1 + Math.floor(Math.random() * base.length);
      base.splice(at, 0, e);
    }
    return base;
  });
  const [idx, setIdx] = useState5(0);
  const [sel, setSel] = useState5(null);
  const [fretAnswered, setFretAnswered] = useState5(false);
  const [fretCorrect, setFretCorrect] = useState5(null);
  const [score, setScore] = useState5(0);
  const [finished, setFinished] = useState5(false);
  if (questions.length === 0) return /* @__PURE__ */ jsxs5("div", { style: { padding: "32px 20px", textAlign: "center", color: C.text2, fontFamily: FONTS.title }, children: [
    "Aucune question disponible.",
    /* @__PURE__ */ jsx7("br", {}),
    /* @__PURE__ */ jsx7("button", { onClick: onDone, style: { marginTop: 16, padding: "10px 20px", border: "none", borderRadius: R.sm, background: C.primary, color: "#fff", cursor: "pointer", fontFamily: FONTS.ui, fontSize: 13, fontWeight: 600 }, children: "Retour" })
  ] });
  const q = questions[idx];
  const isFretQ = q.type === "fretboard";
  const answered = isFretQ ? fretAnswered : sel !== null;
  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const ok = i === q.a;
    if (ok) setScore((s) => s + 1);
    dispatch({ type: "QUIZ_ANSWER", id: q.id, correct: ok, xp: q.xp || 30 });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
  };
  const handleFretComplete = (result) => {
    const ok = result.complete;
    setFretAnswered(true);
    setFretCorrect(ok);
    if (ok) setScore((s) => s + 1);
    dispatch({ type: "QUIZ_ANSWER", id: q.id, correct: ok, xp: q.xp || 40 });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
  };
  const next = () => {
    if (idx + 1 >= questions.length) {
      setFinished(true);
      dispatch({ type: "QUIZ_SESSION_DONE", id: title, title, xp: score * 30, score: `${score}/${questions.length}` });
    } else {
      setSel(null);
      setFretAnswered(false);
      setFretCorrect(null);
      setIdx((i) => i + 1);
    }
  };
  if (finished) {
    const pct = Math.round(score / questions.length * 100);
    const isPerfect = score === questions.length;
    const isGood = pct >= 60;
    const isReview = /révision/i.test(title);
    const redeemed = isReview && isGood;
    const pose = redeemed ? "pride" : isPerfect ? "celebrate" : isGood ? "happy" : "think";
    const anim = redeemed || isPerfect ? "cheer" : "pop";
    const heading = redeemed ? "Tu as enfin r\xE9ussi !" : isPerfect ? "Parfait !" : isGood ? "Tr\xE8s bien !" : "Continue !";
    const subtitle = redeemed ? "Ces questions te r\xE9sistaient, et tu les as enfin eues. Gropi est fier de toi." : isPerfect ? "Toutes les r\xE9ponses correctes. Gropi est fier de toi." : isGood ? "Bon travail ! Les questions rat\xE9es reviendront en r\xE9vision." : "Pas de panique, les erreurs repassent dans la r\xE9vision intelligente.";
    const xpEarned = score * 30;
    return /* @__PURE__ */ jsxs5("div", { style: { padding: "28px 20px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }, children: [
      /* @__PURE__ */ jsx7(Gropi, { pose, size: isPerfect || redeemed ? 160 : 120, anim }),
      /* @__PURE__ */ jsx7("div", { style: { fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: "-.4px", marginTop: isPerfect || redeemed ? 6 : 10, textAlign: "center" }, children: heading }),
      /* @__PURE__ */ jsx7("div", { style: { fontSize: 13, fontWeight: 500, color: C.text2, marginTop: 6, textAlign: "center", lineHeight: 1.5, maxWidth: 260 }, children: subtitle }),
      /* @__PURE__ */ jsxs5("div", { style: {
        display: "flex",
        gap: 16,
        margin: "18px 0 0",
        background: C.surface,
        border: `1.5px solid ${C.border}`,
        borderRadius: R.xl,
        padding: "14px 24px"
      }, children: [
        /* @__PURE__ */ jsxs5("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 26, fontWeight: 800, color: C.green }, children: score }),
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".06em" }, children: "Correctes" })
        ] }),
        /* @__PURE__ */ jsx7("div", { style: { width: 1, background: C.border } }),
        /* @__PURE__ */ jsxs5("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 26, fontWeight: 800, color: C.text2 }, children: questions.length - score }),
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".06em" }, children: "\xC0 revoir" })
        ] }),
        /* @__PURE__ */ jsx7("div", { style: { width: 1, background: C.border } }),
        /* @__PURE__ */ jsxs5("div", { style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxs5("div", { style: { fontSize: 26, fontWeight: 800, color: C.primary }, children: [
            "+",
            xpEarned
          ] }),
          /* @__PURE__ */ jsx7("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".06em" }, children: "XP" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("div", { style: { width: "100%", marginTop: 14 }, children: [
        /* @__PURE__ */ jsxs5("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 }, children: [
          /* @__PURE__ */ jsx7("span", { style: { fontSize: 11, color: C.text3 }, children: "Score" }),
          /* @__PURE__ */ jsxs5("span", { style: { fontSize: 11, fontWeight: 700, color: C.text2 }, children: [
            pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx7("div", { style: { height: 7, background: C.border, borderRadius: 99, overflow: "hidden" }, children: /* @__PURE__ */ jsx7("div", { style: {
          width: `${pct}%`,
          height: "100%",
          borderRadius: 99,
          transition: "width .5s ease",
          background: isPerfect ? C.green : isGood ? C.primary : C.pink
        } }) })
      ] }),
      /* @__PURE__ */ jsx7("button", { onClick: onDone, style: {
        width: "100%",
        marginTop: 20,
        padding: 14,
        borderRadius: R.lg,
        border: "none",
        background: `linear-gradient(135deg,#FF9155,${C.primary})`,
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONTS.ui,
        boxShadow: `0 4px 16px ${C.primary}44`
      }, children: "Retour" })
    ] });
  }
  const linkedLesson = q.lessonId ? content.courses.flatMap((c) => c.lessons).find((l) => l.id === q.lessonId) : null;
  const linkedCourse = q.courseId ? content.courses.find((c) => c.id === q.courseId) : null;
  return /* @__PURE__ */ jsxs5("div", { style: { padding: "14px 20px 0" }, children: [
    /* @__PURE__ */ jsxs5("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
      /* @__PURE__ */ jsx7("button", { onClick: onDone, style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.sm, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }, children: /* @__PURE__ */ jsx7(Ti, { name: "x", size: 16, color: C.text2 }) }),
      /* @__PURE__ */ jsx7("div", { style: { flex: 1, display: "flex", gap: 4 }, children: questions.map((_, i) => /* @__PURE__ */ jsx7("div", { style: { height: 4, flex: 1, borderRadius: 2, background: i < idx ? C.green : i === idx ? C.primary : C.border, transition: "background .2s" } }, i)) }),
      /* @__PURE__ */ jsxs5("span", { style: { fontSize: 12, fontWeight: 700, color: C.text3, flexShrink: 0 }, children: [
        idx + 1,
        "/",
        questions.length
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("div", { style: { fontSize: 10, color: C.text3, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }, children: [
      linkedCourse?.title,
      " \xB7 Niv. ",
      q.lvl,
      isFretQ && /* @__PURE__ */ jsx7("span", { style: { marginLeft: 6, color: C.amber, fontWeight: 700 }, children: "\xB7 Manche" })
    ] }),
    /* @__PURE__ */ jsx7("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16, marginBottom: 10 }, children: /* @__PURE__ */ jsx7("p", { style: { margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.55, color: C.text, fontFamily: FONTS.title }, children: q.q }) }),
    q.type === "ear" && /* @__PURE__ */ jsxs5(
      "button",
      {
        onClick: async () => {
          await loadAudio();
          q.play?.();
        },
        style: {
          width: "100%",
          padding: "14px 0",
          marginBottom: 10,
          borderRadius: R.lg,
          border: `1.5px solid ${C.primary}`,
          background: C.primaryL,
          color: C.primaryD,
          fontWeight: 800,
          fontSize: 14,
          fontFamily: FONTS.ui,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8
        },
        children: [
          /* @__PURE__ */ jsx7(Ti, { name: "volume", size: 18, color: C.primary }),
          "\xC9couter"
        ]
      }
    ),
    isFretQ ? /* @__PURE__ */ jsxs5(Fragment3, { children: [
      FretboardQuizQuestion2 && /* @__PURE__ */ jsx7(FretboardQuizQuestion2, { question: q, onComplete: handleFretComplete, answered: fretAnswered }),
      fretAnswered && /* @__PURE__ */ jsxs5(Fragment3, { children: [
        /* @__PURE__ */ jsx7(FeedbackBox, { ok: fretCorrect, xp: q.xp || 40, exp: q.exp, lesson: null }),
        /* @__PURE__ */ jsx7(NextBtn, { onClick: next, last: idx + 1 >= questions.length })
      ] })
    ] }) : /* @__PURE__ */ jsxs5(Fragment3, { children: [
      q.o.map((opt, i) => {
        let bg = C.surface, border = `1.5px solid ${C.border}`, col = C.text, badgeBg = C.surface2, badgeFg = C.text2, ic = ["A", "B", "C", "D"][i];
        if (answered) {
          if (i === q.a) {
            bg = C.greenL;
            border = `1.5px solid ${C.green}`;
            col = C.greenD;
            badgeBg = C.greenBorder;
            badgeFg = C.greenD;
            ic = /* @__PURE__ */ jsx7(Ti, { name: "check", size: 12, color: C.greenD });
          } else if (i === sel) {
            bg = C.coralL;
            border = `1.5px solid ${C.coral}`;
            col = C.coralD;
            badgeBg = C.coralBorder;
            badgeFg = C.coralD;
            ic = /* @__PURE__ */ jsx7(Ti, { name: "x", size: 12, color: C.coralD });
          }
        }
        return /* @__PURE__ */ jsxs5("button", { onClick: () => choose(i), disabled: answered, style: { display: "flex", alignItems: "center", gap: 10, background: bg, border, borderRadius: R.md, padding: "12px 14px", cursor: answered ? "default" : "pointer", textAlign: "left", width: "100%", marginBottom: 7, fontFamily: FONTS.title }, children: [
          /* @__PURE__ */ jsx7("div", { style: { width: 26, height: 26, borderRadius: 8, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }, children: ic }),
          /* @__PURE__ */ jsx7("span", { style: { fontSize: 13, color: col, lineHeight: 1.45, fontWeight: answered && i === q.a ? 700 : 500 }, children: opt })
        ] }, i);
      }),
      answered && /* @__PURE__ */ jsxs5(Fragment3, { children: [
        /* @__PURE__ */ jsx7(FeedbackBox, { ok: sel === q.a, xp: q.xp || 30, exp: q.exp || q.x, lesson: linkedLesson }),
        /* @__PURE__ */ jsx7(NextBtn, { onClick: next, last: idx + 1 >= questions.length })
      ] })
    ] }),
    /* @__PURE__ */ jsx7("div", { style: { height: 24 } })
  ] });
}
function FeedbackBox({ ok, xp, exp, lesson }) {
  const C = useC();
  return /* @__PURE__ */ jsxs5("div", { style: { background: ok ? C.greenL : C.coralL, borderRadius: R.md, padding: "12px 14px", marginBottom: 12, border: `1.5px solid ${ok ? C.greenBorder : C.coralBorder}` }, children: [
    /* @__PURE__ */ jsxs5("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: [
      /* @__PURE__ */ jsx7(Ti, { name: ok ? "check" : "alert-circle", size: 14, color: ok ? C.green : C.coral }),
      /* @__PURE__ */ jsx7("div", { style: { fontSize: 12, fontWeight: 700, color: ok ? C.greenD : C.coralD }, children: ok ? `CORRECT \xB7 +${xp} XP` : "PAS TOUT \xC0 FAIT\u2026" })
    ] }),
    /* @__PURE__ */ jsx7("div", { style: { fontSize: 12, color: ok ? C.greenD : C.coralD, lineHeight: 1.55 }, children: exp }),
    lesson && /* @__PURE__ */ jsxs5("div", { style: { fontSize: 11, color: C.primary, marginTop: 6 }, children: [
      "Pour approfondir : ",
      /* @__PURE__ */ jsx7("em", { children: lesson.title })
    ] })
  ] });
}
function NextBtn({ onClick, last }) {
  const C = useC();
  return /* @__PURE__ */ jsx7("button", { onClick, style: { width: "100%", padding: 14, borderRadius: R.lg, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }, children: last ? "Voir les r\xE9sultats" : "Suivant \u2192" });
}

// src/screens/ReviewSession.jsx
var ReviewSession_exports = {};
__export(ReviewSession_exports, {
  ReviewSession: () => ReviewSession
});
import { useState as useState6, useCallback } from "react";
import { Fragment as Fragment4, jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
function ReviewSession({ questions, state, dispatch, onDone }) {
  const { FretboardQuizQuestion: FretboardQuizQuestion2 } = useRenderers();
  const C = useC();
  const [idx, setIdx] = useState6(0);
  const [sel, setSel] = useState6(null);
  const [fretAnswered, setFretAnswered] = useState6(false);
  const [fretCorrect, setFretCorrect] = useState6(null);
  const [results, setResults] = useState6([]);
  const [finished, setFinished] = useState6(false);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const q = questions[idx];
  const isFret = q?.type === "fretboard";
  const answered = isFret ? fretAnswered : sel !== null;
  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const correct = i === q.a;
    recordAnswer(correct);
  };
  const handleFretComplete = (result) => {
    setFretAnswered(true);
    setFretCorrect(result.complete);
    recordAnswer(result.complete);
  };
  const recordAnswer = (correct) => {
    const newHistory = updateReviewHistory(
      state.reviewHistory || {},
      q.id,
      correct,
      today
    );
    dispatch({ type: "REVIEW_ANSWER", questionId: q.id, correct, history: newHistory, xp: correct ? q.xp || 30 : 0 });
    setResults((prev) => [...prev, { id: q.id, correct }]);
  };
  const next = () => {
    const currentCorrect = results.filter((r) => r.correct).length;
    if (idx + 1 >= questions.length) {
      dispatch({ type: "REVIEW_SESSION_DONE", xp: currentCorrect * 20, score: `${currentCorrect}/${questions.length}` });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
      setFinished(true);
    } else {
      setSel(null);
      setFretAnswered(false);
      setFretCorrect(null);
      setIdx((i) => i + 1);
    }
  };
  if (finished) {
    const correct = results.filter((r) => r.correct).length;
    const incorrect = questions.length - correct;
    const pct = Math.round(correct / questions.length * 100);
    const xpEarned = correct * 20;
    const title = pct >= 80 ? "Excellent !" : pct >= 50 ? "Bien joue !" : "Continue !";
    const wrongItems = results.filter((r) => !r.correct).map((r) => questions.find((q2) => q2.id === r.id)).filter(Boolean);
    return /* @__PURE__ */ jsxs6("div", { style: { padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxs6("div", { style: { textAlign: "center", padding: "16px 0 8px" }, children: [
        /* @__PURE__ */ jsx8(
          Gropi,
          {
            pose: pct >= 80 ? "celebrate" : pct >= 50 ? "pride" : "think",
            size: pct >= 80 ? 150 : 110,
            anim: pct >= 50 ? "cheer" : "pop",
            style: { margin: "0 auto" }
          }
        ),
        /* @__PURE__ */ jsx8("div", { style: { fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONTS.title, marginTop: 8 }, children: title }),
        /* @__PURE__ */ jsx8("div", { style: { fontSize: 13, color: C.text2, fontFamily: FONTS.ui, marginTop: 4 }, children: pct >= 80 ? "Excellente r\xE9vision, ta m\xE9moire se renforce." : pct >= 50 ? "Bon travail ! Les questions rat\xE9es reviennent bient\xF4t." : "Les erreurs sont normales, c'est comme \xE7a qu'on progresse." })
      ] }),
      /* @__PURE__ */ jsxs6("div", { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "16px 14px" }, children: [
        /* @__PURE__ */ jsxs6("div", { style: { display: "flex", justifyContent: "space-around" }, children: [
          /* @__PURE__ */ jsxs6("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsx8("div", { style: { fontSize: 28, fontWeight: 700, color: C.green, fontFamily: FONTS.title }, children: correct }),
            /* @__PURE__ */ jsx8("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }, children: "Correctes" })
          ] }),
          /* @__PURE__ */ jsx8("div", { style: { width: 1, background: C.border } }),
          /* @__PURE__ */ jsxs6("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsx8("div", { style: { fontSize: 28, fontWeight: 700, color: incorrect > 0 ? C.coral : C.text3, fontFamily: FONTS.title }, children: incorrect }),
            /* @__PURE__ */ jsx8("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }, children: "A revoir" })
          ] }),
          /* @__PURE__ */ jsx8("div", { style: { width: 1, background: C.border } }),
          /* @__PURE__ */ jsxs6("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxs6("div", { style: { fontSize: 28, fontWeight: 700, color: C.primary, fontFamily: FONTS.title }, children: [
              "+",
              xpEarned
            ] }),
            /* @__PURE__ */ jsx8("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }, children: "XP" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs6("div", { style: { marginTop: 14 }, children: [
          /* @__PURE__ */ jsxs6("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 4 }, children: [
            /* @__PURE__ */ jsx8("span", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: "Score" }),
            /* @__PURE__ */ jsxs6("span", { style: { fontSize: 11, fontWeight: 600, color: C.text2, fontFamily: FONTS.ui }, children: [
              pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx8("div", { style: { height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }, children: /* @__PURE__ */ jsx8("div", { style: { height: "100%", width: `${pct}%`, background: pct >= 80 ? C.green : pct >= 50 ? C.primary : C.coral, borderRadius: 3, transition: "width 0.5s ease" } }) })
        ] })
      ] }),
      wrongItems.length > 0 && /* @__PURE__ */ jsxs6("div", { style: { background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.lg, padding: "12px 14px" }, children: [
        /* @__PURE__ */ jsxs6("div", { style: { fontSize: 11, fontWeight: 700, color: C.coralD, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }, children: [
          "A retravailler (",
          wrongItems.length,
          ")"
        ] }),
        wrongItems.map((q2, i) => /* @__PURE__ */ jsxs6("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < wrongItems.length - 1 ? 8 : 0 }, children: [
          /* @__PURE__ */ jsx8("div", { style: { width: 18, height: 18, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }, children: /* @__PURE__ */ jsx8(Ti, { name: "x", size: 10, color: "#fff" }) }),
          /* @__PURE__ */ jsxs6("div", { style: { fontSize: 12, color: C.coralD, fontFamily: FONTS.ui, lineHeight: 1.45 }, children: [
            q2.q?.substring(0, 80),
            q2.q?.length > 80 ? "..." : ""
          ] })
        ] }, q2.id)),
        /* @__PURE__ */ jsx8("div", { style: { fontSize: 11, color: C.coral, fontFamily: FONTS.ui, marginTop: 8, fontStyle: "italic" }, children: "Ces questions auront une priorite elevee lors de ta prochaine session." })
      ] }),
      pct >= 80 && /* @__PURE__ */ jsx8("div", { style: { background: C.greenL, border: `1px solid ${C.greenBorder}`, borderRadius: R.lg, padding: "12px 14px", fontSize: 12, color: C.greenD, fontFamily: FONTS.ui, lineHeight: 1.5 }, children: "Bien joue ! Les questions reussies ont ete reportees. Tu les reverras moins souvent." }),
      /* @__PURE__ */ jsx8("button", { onClick: onDone, style: {
        width: "100%",
        padding: "14px",
        borderRadius: R.md,
        border: "none",
        background: C.primary,
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONTS.ui,
        marginTop: 4
      }, children: "Retour a l'accueil" })
    ] });
  }
  if (!q) return null;
  const isCorrect = isFret ? fretCorrect : sel === q.a;
  return /* @__PURE__ */ jsxs6("div", { style: { padding: "14px 16px 0" }, children: [
    /* @__PURE__ */ jsxs6("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }, children: [
      /* @__PURE__ */ jsx8("button", { onClick: onDone, style: { background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0 }, children: /* @__PURE__ */ jsx8(Ti, { name: "x", size: 18 }) }),
      /* @__PURE__ */ jsx8("div", { style: { flex: 1 }, children: /* @__PURE__ */ jsx8("div", { style: { display: "flex", gap: 3 }, children: questions.map((_, i) => /* @__PURE__ */ jsx8("div", { style: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        background: i < idx ? C.green : i === idx ? C.primary : C.border,
        transition: "background 0.3s"
      } }, i)) }) }),
      /* @__PURE__ */ jsxs6("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui, flexShrink: 0 }, children: [
        idx + 1,
        "/",
        questions.length
      ] })
    ] }),
    /* @__PURE__ */ jsx8("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }, children: /* @__PURE__ */ jsxs6("div", { style: {
      padding: "3px 8px",
      borderRadius: R.pill,
      fontSize: 10,
      fontWeight: 700,
      fontFamily: FONTS.ui,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      background: isFret ? C.amberL : C.primaryL,
      color: isFret ? C.amberD : C.primaryD
    }, children: [
      isFret ? "Manche" : "QCM",
      " \xB7 Niv. ",
      q.lvl
    ] }) }),
    /* @__PURE__ */ jsx8("div", { style: {
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.lg,
      padding: 16,
      marginBottom: 12
    }, children: /* @__PURE__ */ jsx8("p", { style: { margin: 0, fontSize: 15, fontWeight: 500, lineHeight: 1.5, color: C.text, fontFamily: FONTS.title }, children: q.q }) }),
    isFret ? /* @__PURE__ */ jsxs6(Fragment4, { children: [
      FretboardQuizQuestion2 && /* @__PURE__ */ jsx8(
        FretboardQuizQuestion2,
        {
          question: q,
          onComplete: handleFretComplete,
          answered: fretAnswered
        }
      ),
      fretAnswered && /* @__PURE__ */ jsxs6(Fragment4, { children: [
        /* @__PURE__ */ jsxs6("div", { style: {
          background: isCorrect ? C.greenL : C.coralL,
          borderRadius: R.md,
          padding: "12px 14px",
          marginTop: 10,
          marginBottom: 12,
          border: `1px solid ${isCorrect ? C.greenBorder : C.coralBorder}`
        }, children: [
          /* @__PURE__ */ jsxs6("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: [
            /* @__PURE__ */ jsx8(Ti, { name: isCorrect ? "check" : "alert-circle", size: 14, color: isCorrect ? C.green : C.coral }),
            /* @__PURE__ */ jsx8("div", { style: { fontSize: 12, fontWeight: 500, color: isCorrect ? C.greenD : C.coralD, fontFamily: FONTS.ui }, children: isCorrect ? `Correct \xB7 +${q.xp || 40} XP` : "Pas tout a fait..." })
          ] }),
          q.exp && /* @__PURE__ */ jsx8("div", { style: { fontSize: 12, color: isCorrect ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }, children: q.exp })
        ] }),
        /* @__PURE__ */ jsx8("button", { onClick: next, style: { width: "100%", padding: "14px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }, children: idx + 1 >= questions.length ? "Voir les resultats" : "Suivant" })
      ] })
    ] }) : (
      /* QCM */
      /* @__PURE__ */ jsxs6(Fragment4, { children: [
        q.o.map((opt, i) => {
          let bg = C.surface, border = `1px solid ${C.border}`, col = C.text;
          let badgeBg = C.surface2, badgeFg = C.text2, ic = ["A", "B", "C", "D"][i];
          if (answered) {
            if (i === q.a) {
              bg = C.greenL;
              border = `1px solid ${C.green}`;
              col = C.greenD;
              badgeBg = C.greenBorder;
              badgeFg = C.greenD;
              ic = "\u2713";
            } else if (i === sel) {
              bg = C.coralL;
              border = `1px solid ${C.coral}`;
              col = C.coralD;
              badgeBg = C.coralBorder;
              badgeFg = C.coralD;
              ic = "\u2717";
            }
          }
          return /* @__PURE__ */ jsxs6("button", { onClick: () => choose(i), disabled: answered, style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: bg,
            border,
            borderRadius: 11,
            padding: "11px 13px",
            cursor: answered ? "default" : "pointer",
            textAlign: "left",
            width: "100%",
            marginBottom: 7,
            fontFamily: FONTS.title
          }, children: [
            /* @__PURE__ */ jsx8("div", { style: { width: 24, height: 24, borderRadius: 7, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, flexShrink: 0, fontFamily: FONTS.ui }, children: ic }),
            /* @__PURE__ */ jsx8("span", { style: { fontSize: 13, color: col, lineHeight: 1.4, fontFamily: FONTS.title, fontWeight: answered && i === q.a ? 500 : 400 }, children: opt })
          ] }, i);
        }),
        answered && /* @__PURE__ */ jsxs6(Fragment4, { children: [
          /* @__PURE__ */ jsxs6("div", { style: {
            background: isCorrect ? C.greenL : C.coralL,
            borderRadius: R.md,
            padding: "12px 14px",
            marginTop: 4,
            marginBottom: 12,
            border: `1px solid ${isCorrect ? C.greenBorder : C.coralBorder}`
          }, children: [
            /* @__PURE__ */ jsxs6("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }, children: [
              /* @__PURE__ */ jsx8(Ti, { name: isCorrect ? "check" : "alert-circle", size: 14, color: isCorrect ? C.green : C.coral }),
              /* @__PURE__ */ jsx8("div", { style: { fontSize: 12, fontWeight: 500, color: isCorrect ? C.greenD : C.coralD, fontFamily: FONTS.ui }, children: isCorrect ? `Correct \xB7 +${q.xp || 30} XP` : "Pas tout a fait..." })
            ] }),
            (q.exp || q.x) && /* @__PURE__ */ jsx8("div", { style: { fontSize: 12, color: isCorrect ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }, children: q.exp || q.x })
          ] }),
          /* @__PURE__ */ jsx8("button", { onClick: next, style: { width: "100%", padding: "14px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }, children: idx + 1 >= questions.length ? "Voir les resultats" : "Suivant" })
        ] })
      ] })
    ),
    /* @__PURE__ */ jsx8("div", { style: { height: 16 } })
  ] });
}

// src/screens/ExercisesScreen.jsx
var ExercisesScreen_exports = {};
__export(ExercisesScreen_exports, {
  ExerciseDetail: () => ExerciseDetail,
  ExercisesScreen: () => ExercisesScreen
});
import { useState as useState7, useEffect as useEffect4, useRef as useRef4, useMemo as useMemo3 } from "react";
import { Fragment as Fragment5, jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
var LEVEL_LABELS = { 1: "Fondamentaux", 2: "Interm\xE9diaire", 3: "Avanc\xE9" };
var makeLevelColors = (C) => ({ 1: { bg: C.greenL, border: C.greenBorder, text: C.greenD, dot: C.green }, 2: { bg: C.amberL, border: C.amberBorder, text: C.amberD, dot: C.amber }, 3: { bg: C.pinkL, border: C.pinkBorder, text: C.pinkD, dot: C.pink } });
var DIFF_STARS = { 1: "\u2605\u2606\u2606", 2: "\u2605\u2605\u2606", 3: "\u2605\u2605\u2605" };
function ExercisesScreen({ state, dispatch, content, embedded = false }) {
  const [showFilters, setShowFilters] = useState7(false);
  const C = useC();
  const MODULE_THEME2 = buildModuleTheme(C);
  const LEVEL_COLORS = makeLevelColors(C);
  const [filter, setFilter] = useState7("all");
  const [active, setActive] = useState7(null);
  const cats = [
    { id: "all", label: "Tous" },
    { id: "neck", label: "Manche" },
    { id: "scales", label: "Gammes" },
    { id: "harmony", label: "Harmonie" },
    { id: "rhythm", label: "Rythme" },
    { id: "impro", label: "Impro" }
  ];
  const allEx = content.exercises;
  const totalDone = useMemo3(() => allEx.filter((e) => state.completedExercises[e.id]).length, [state.completedExercises, allEx]);
  const totalXP = useMemo3(() => allEx.reduce((s, e) => s + (state.completedExercises[e.id] ? e.xp : 0), 0), [state.completedExercises, allEx]);
  const pctGlobal = allEx.length ? Math.round(totalDone / allEx.length * 100) : 0;
  const recommended = useMemo3(() => {
    const sorted = [...allEx].sort((a, b) => (a.lvl || 1) - (b.lvl || 1));
    return sorted.find((e) => !state.completedExercises[e.id] && (filter === "all" || e.mod === filter));
  }, [allEx, state.completedExercises, filter]);
  const byLevel = useMemo3(() => {
    const filtered = allEx.filter((e) => filter === "all" || e.mod === filter);
    const groups = {};
    filtered.forEach((e) => {
      const l = e.lvl || 1;
      if (!groups[l]) groups[l] = [];
      groups[l].push(e);
    });
    return groups;
  }, [allEx, filter]);
  if (active) return /* @__PURE__ */ jsx9(ExerciseDetail, { ex: active, state, dispatch, onBack: () => setActive(null), content });
  return /* @__PURE__ */ jsxs7("div", { children: [
    !embedded && /* @__PURE__ */ jsxs7("div", { style: {
      backgroundColor: "#e6af6d",
      backgroundImage: "url('/beach.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 55%",
      padding: "24px 20px 20px",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx9("div", { style: { position: "absolute", inset: 0, background: "rgba(20,60,120,.45)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs7("div", { style: { position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsx9("div", { style: { fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }, children: "Exercices" }),
        /* @__PURE__ */ jsxs7("div", { style: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.8)", marginTop: 2, marginBottom: 14 }, children: [
          totalDone,
          " / ",
          allEx.length,
          " compl\xE9t\xE9s \xB7 ",
          totalXP,
          " XP gagn\xE9s"
        ] }),
        /* @__PURE__ */ jsxs7("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 }, children: [
          /* @__PURE__ */ jsxs7("span", { style: { fontSize: 12, fontWeight: 700, color: "#fff" }, children: [
            pctGlobal,
            "% termin\xE9"
          ] }),
          /* @__PURE__ */ jsxs7("span", { style: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.8)" }, children: [
            allEx.length - totalDone,
            " restants"
          ] })
        ] }),
        /* @__PURE__ */ jsx9(ProgressBar, { pct: pctGlobal, color: C.amber, h: 7 })
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { style: { padding: "0 20px" }, children: [
      /* @__PURE__ */ jsxs7(
        "button",
        {
          onClick: () => setShowFilters((v) => !v),
          style: {
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 0 10px",
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontFamily: FONTS.ui,
            textAlign: "left"
          },
          children: [
            /* @__PURE__ */ jsx9(Ti, { name: showFilters ? "chevron-down" : "chevron-right", size: 15, color: C.text3 }),
            /* @__PURE__ */ jsx9("span", { style: { fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: ".07em", textTransform: "uppercase" }, children: filter === "all" ? "Cibler une mati\xE8re" : `Filtr\xE9 : ${cats.find((c) => c.id === filter)?.label}` })
          ]
        }
      ),
      showFilters && /* @__PURE__ */ jsx9("div", { style: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12 }, children: cats.map((c) => /* @__PURE__ */ jsx9("button", { onClick: () => setFilter(c.id), style: {
        padding: "7px 14px",
        borderRadius: 99,
        border: `1.5px solid ${filter === c.id ? C.primary : C.border}`,
        background: filter === c.id ? C.primary : C.surface,
        color: filter === c.id ? "#fff" : C.text2,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
        fontFamily: FONTS.ui
      }, children: c.label }, c.id)) }),
      recommended && /* @__PURE__ */ jsxs7(Fragment5, { children: [
        /* @__PURE__ */ jsx9("div", { style: { fontSize: 11, fontWeight: 700, color: C.text3, letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 10 }, children: "Recommand\xE9 pour toi" }),
        /* @__PURE__ */ jsxs7("button", { onClick: () => setActive(recommended), style: {
          width: "100%",
          background: `linear-gradient(135deg, ${C.primaryL}, ${C.surface})`,
          border: `2px solid ${C.primaryBorder}`,
          borderRadius: R.xl,
          padding: "16px",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: FONTS.title,
          marginBottom: 20,
          display: "flex",
          gap: 14,
          alignItems: "center"
        }, children: [
          /* @__PURE__ */ jsx9("div", { style: { width: 52, height: 52, borderRadius: R.lg, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${C.primaryBorder}` }, children: /* @__PURE__ */ jsx9(Ti, { name: "player-play", size: 24, color: "#fff" }) }),
          /* @__PURE__ */ jsxs7("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxs7("div", { style: { fontSize: 10, fontWeight: 700, color: C.primary, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 3 }, children: [
              LEVEL_LABELS[recommended.lvl || 1],
              " \xB7 ",
              DIFF_STARS[recommended.lvl || 1]
            ] }),
            /* @__PURE__ */ jsx9("div", { style: { fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }, children: recommended.title }),
            /* @__PURE__ */ jsxs7("div", { style: { display: "flex", gap: 8, marginTop: 4, alignItems: "center" }, children: [
              /* @__PURE__ */ jsxs7("span", { style: { fontSize: 11, color: C.text3, fontWeight: 500 }, children: [
                recommended.dur,
                " min"
              ] }),
              recommended.bpm && /* @__PURE__ */ jsxs7("span", { style: { fontSize: 11, color: C.text3 }, children: [
                "\u2669 ",
                recommended.bpm
              ] }),
              /* @__PURE__ */ jsxs7("span", { style: { fontSize: 11, fontWeight: 700, color: C.primary, background: C.primaryL, borderRadius: 99, padding: "2px 8px" }, children: [
                "+",
                recommended.xp,
                " XP"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx9(Ti, { name: "arrow-right", size: 18, color: C.primary })
        ] })
      ] }),
      [1, 2, 3].map((lvl) => {
        const exos = byLevel[lvl];
        if (!exos || exos.length === 0) return null;
        const lvlDone = exos.filter((e) => state.completedExercises[e.id]).length;
        const lvlPct = Math.round(lvlDone / exos.length * 100);
        const lc = LEVEL_COLORS[lvl];
        return /* @__PURE__ */ jsxs7("div", { style: { marginBottom: 20 }, children: [
          /* @__PURE__ */ jsxs7("div", { style: {
            background: lc.bg,
            border: `1.5px solid ${lc.border}`,
            borderRadius: R.lg,
            padding: "12px 14px",
            marginBottom: 10
          }, children: [
            /* @__PURE__ */ jsxs7("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }, children: [
              /* @__PURE__ */ jsxs7("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsx9("div", { style: { width: 8, height: 8, borderRadius: "50%", background: lc.dot } }),
                /* @__PURE__ */ jsx9("span", { style: { fontSize: 13, fontWeight: 800, color: lc.text }, children: LEVEL_LABELS[lvl] }),
                /* @__PURE__ */ jsx9("span", { style: { fontSize: 11, color: lc.text, opacity: 0.7 }, children: DIFF_STARS[lvl] })
              ] }),
              /* @__PURE__ */ jsxs7("span", { style: { fontSize: 12, fontWeight: 700, color: lc.dot }, children: [
                lvlDone,
                "/",
                exos.length
              ] })
            ] }),
            /* @__PURE__ */ jsx9(ProgressBar, { pct: lvlPct, color: lc.dot, h: 4 })
          ] }),
          exos.map((ex) => {
            const done = !!state.completedExercises[ex.id];
            const inProgress = (state.exerciseProgress[ex.id]?.length || 0) > 0;
            const th = MODULE_THEME2[ex.mod] || MODULE_THEME2.neck;
            const count = state.completedExercises[ex.id]?.count || 0;
            return /* @__PURE__ */ jsxs7("button", { onClick: () => setActive(ex), style: {
              background: C.surface,
              border: `1.5px solid ${done ? C.greenBorder : inProgress ? C.amberBorder : C.border}`,
              borderRadius: R.lg,
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              marginBottom: 8,
              fontFamily: FONTS.title
            }, children: [
              /* @__PURE__ */ jsxs7("div", { style: {
                width: 44,
                height: 44,
                borderRadius: R.md,
                flexShrink: 0,
                background: done ? C.greenL : inProgress ? C.amberL : th.colorL,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }, children: [
                done ? /* @__PURE__ */ jsx9(Ti, { name: "check", size: 20, color: C.green }) : inProgress ? /* @__PURE__ */ jsx9(Ti, { name: "player-pause", size: 20, color: C.amber }) : /* @__PURE__ */ jsx9(Ti, { name: "guitar-pick", size: 20, color: th.color }),
                count > 1 && /* @__PURE__ */ jsx9("div", { style: { position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx9("span", { style: { fontSize: 8, fontWeight: 800, color: "#fff" }, children: count }) })
              ] }),
              /* @__PURE__ */ jsxs7("div", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsx9("div", { style: { fontSize: 13.5, fontWeight: 700, color: done ? C.text2 : C.text, letterSpacing: "-.1px", textDecoration: done ? "line-through" : "none" }, children: ex.title }),
                /* @__PURE__ */ jsxs7("div", { style: { display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap", alignItems: "center" }, children: [
                  /* @__PURE__ */ jsxs7("span", { style: { fontSize: 11, fontWeight: 500, color: C.text3 }, children: [
                    ex.dur,
                    " min"
                  ] }),
                  ex.bpm && /* @__PURE__ */ jsxs7("span", { style: { fontSize: 11, color: C.text3 }, children: [
                    "\u2669",
                    ex.bpm
                  ] }),
                  /* @__PURE__ */ jsx9("span", { style: {
                    fontSize: 11,
                    fontWeight: 700,
                    color: done ? C.green : C.primary,
                    background: done ? C.greenL : C.primaryL,
                    borderRadius: 99,
                    padding: "1px 7px"
                  }, children: done ? `\u2713 ${ex.xp} XP` : `+${ex.xp} XP` }),
                  inProgress && !done && /* @__PURE__ */ jsx9("span", { style: { fontSize: 11, fontWeight: 600, color: C.amber }, children: "En cours" })
                ] })
              ] }),
              /* @__PURE__ */ jsx9(Ti, { name: "chevron-right", size: 15, color: C.text3 })
            ] }, ex.id);
          })
        ] }, lvl);
      }),
      /* @__PURE__ */ jsx9("div", { style: { height: 24 } })
    ] })
  ] });
}
function ExerciseDetail({ ex, state, dispatch, onBack, content }) {
  const { FretboardExercise: FretboardExercise2 } = useRenderers();
  const C = useC();
  const MODULE_THEME2 = buildModuleTheme(C);
  const LEVEL_COLORS = makeLevelColors(C);
  const saved = state.exerciseProgress[ex.id] || [];
  const [checked, setChecked] = useState7(saved);
  const [done, setDone] = useState7(false);
  const [pop, setPop] = useState7(false);
  const popTimerRef = useRef4(null);
  useEffect4(() => () => {
    if (popTimerRef.current) clearTimeout(popTimerRef.current);
  }, []);
  const theme = MODULE_THEME2[ex.mod] || MODULE_THEME2.neck;
  const lc = LEVEL_COLORS[ex.lvl || 1];
  function BackBtn() {
    return /* @__PURE__ */ jsxs7("div", { style: { padding: "14px 20px 0", display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }, children: [
      /* @__PURE__ */ jsx9("button", { onClick: onBack, style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.sm, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }, children: /* @__PURE__ */ jsx9(Ti, { name: "arrow-left", size: 17, color: C.text }) }),
      /* @__PURE__ */ jsx9("span", { style: { fontSize: 13, fontWeight: 600, color: C.text2, fontFamily: FONTS.ui }, children: "Retour" })
    ] });
  }
  if (ex.type === "fretboard_exercise") {
    const finishFretboard = ({ totalXp, stages }) => {
      dispatch({ type: "COMPLETE_EXERCISE", id: ex.id, title: ex.title, xp: totalXp || ex.xp });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "exercises" });
      const total = stages?.length || 1;
      const passed = stages?.filter((s) => s.result?.complete && !s.skipped).length || 0;
      const correct = passed / total >= 0.7;
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const newHistory = updateReviewHistory(state.exerciseHistory, ex.id, correct, today);
      dispatch({ type: "EXERCISE_MASTERY_ANSWER", history: newHistory });
    };
    const linkedLesson2 = ex.courseLink ? content.courses.flatMap((c) => c.lessons).find((l) => l.id === ex.courseLink) : null;
    return /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsx9(BackBtn, {}),
      /* @__PURE__ */ jsxs7("div", { style: { padding: "0 20px" }, children: [
        /* @__PURE__ */ jsx9(ExHeader, { ex, theme, lc }),
        linkedLesson2 && /* @__PURE__ */ jsx9(LinkedLesson, { lesson: linkedLesson2 }),
        FretboardExercise2 && /* @__PURE__ */ jsx9(FretboardExercise2, { ex, onComplete: finishFretboard, dispatch }),
        ex.tip && /* @__PURE__ */ jsx9(Tip, { text: ex.tip }),
        /* @__PURE__ */ jsx9("div", { style: { height: 24 } })
      ] })
    ] });
  }
  const allDone = checked.length === (ex.steps || []).length;
  useEffect4(() => {
    if (checked.length > 0 && !done) dispatch({ type: "SAVE_EXERCISE_PROGRESS", id: ex.id, checkedSteps: checked });
  }, [checked]);
  const toggle = (i) => setChecked((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  const finish = () => {
    setPop(true);
    dispatch({ type: "COMPLETE_EXERCISE", id: ex.id, title: ex.title, xp: ex.xp });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "exercises" });
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const newHistory = updateReviewHistory(state.exerciseHistory, ex.id, true, today);
    dispatch({ type: "EXERCISE_MASTERY_ANSWER", history: newHistory });
    setDone(true);
    popTimerRef.current = setTimeout(() => setPop(false), 1200);
  };
  const linkedLesson = ex.courseLink ? content.courses.flatMap((c) => c.lessons).find((l) => l.id === ex.courseLink) : null;
  return /* @__PURE__ */ jsxs7("div", { children: [
    pop && /* @__PURE__ */ jsx9(XPPop, { amount: ex.xp, onDone: () => {
    } }),
    /* @__PURE__ */ jsx9(BackBtn, {}),
    /* @__PURE__ */ jsxs7("div", { style: { padding: "0 20px" }, children: [
      /* @__PURE__ */ jsx9(ExHeader, { ex, theme, lc }),
      linkedLesson && /* @__PURE__ */ jsx9(LinkedLesson, { lesson: linkedLesson }),
      /* @__PURE__ */ jsxs7("div", { style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxs7("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 }, children: [
          /* @__PURE__ */ jsx9("span", { style: { fontSize: 12, fontWeight: 600, color: C.text2 }, children: "\xC9tapes" }),
          /* @__PURE__ */ jsxs7("span", { style: { fontSize: 12, fontWeight: 700, color: C.green }, children: [
            checked.length,
            "/",
            (ex.steps || []).length
          ] })
        ] }),
        /* @__PURE__ */ jsx9(ProgressBar, { pct: checked.length / (ex.steps || [1]).length * 100, color: C.green, h: 5 })
      ] }),
      !done ? /* @__PURE__ */ jsxs7(Fragment5, { children: [
        (ex.steps || []).map((s, i) => {
          const ck = checked.includes(i);
          return /* @__PURE__ */ jsxs7("button", { onClick: () => toggle(i), style: {
            display: "flex",
            alignItems: "flex-start",
            gap: 11,
            background: ck ? C.greenL : C.surface,
            border: `1.5px solid ${ck ? C.greenBorder : C.border}`,
            borderRadius: R.md,
            padding: "12px 13px",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            marginBottom: 7
          }, children: [
            /* @__PURE__ */ jsx9("div", { style: { width: 22, height: 22, borderRadius: "50%", border: `2px solid ${ck ? C.green : C.border}`, background: ck ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }, children: ck && /* @__PURE__ */ jsx9(Ti, { name: "check", size: 12, color: "#fff" }) }),
            /* @__PURE__ */ jsx9("p", { style: { margin: 0, fontSize: 14, lineHeight: 1.55, color: ck ? C.greenD : C.text, fontWeight: ck ? 600 : 500, fontFamily: FONTS.title }, children: s })
          ] }, i);
        }),
        ex.tip && /* @__PURE__ */ jsx9(Tip, { text: ex.tip }),
        /* @__PURE__ */ jsx9("button", { onClick: finish, disabled: !allDone, style: {
          width: "100%",
          padding: 14,
          borderRadius: R.lg,
          border: "none",
          background: allDone ? C.green : C.surface2,
          color: allDone ? "#fff" : C.text3,
          fontSize: 14,
          fontWeight: 700,
          cursor: allDone ? "pointer" : "default",
          fontFamily: FONTS.ui,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6
        }, children: allDone ? /* @__PURE__ */ jsxs7(Fragment5, { children: [
          /* @__PURE__ */ jsx9(Ti, { name: "check", size: 16, color: "#fff" }),
          " Exercice termin\xE9 \xB7 +",
          ex.xp,
          " XP"
        ] }) : `${checked.length} / ${(ex.steps || []).length} \xE9tapes compl\xE9t\xE9es` })
      ] }) : /* @__PURE__ */ jsxs7("div", { style: { background: C.greenL, borderRadius: R.xl, padding: "24px 20px", textAlign: "center", border: `1.5px solid ${C.greenBorder}` }, children: [
        /* @__PURE__ */ jsx9(Gropi, { pose: "celebrate", size: 130, anim: "cheer", style: { margin: "0 auto" } }),
        /* @__PURE__ */ jsx9("div", { style: { fontSize: 22, fontWeight: 800, color: C.greenD, letterSpacing: "-.3px", marginTop: 8 }, children: "Bien jou\xE9 !" }),
        /* @__PURE__ */ jsxs7("div", { style: { fontSize: 13, fontWeight: 500, color: C.green, marginTop: 4 }, children: [
          "+",
          ex.xp,
          " XP gagn\xE9s"
        ] }),
        /* @__PURE__ */ jsx9("div", { style: { fontSize: 12, color: C.greenD, opacity: 0.7, marginTop: 6, lineHeight: 1.5 }, children: "Gropi a tout entendu depuis ici. Continue comme \xE7a. \u{1F3B8}" }),
        /* @__PURE__ */ jsx9("button", { onClick: onBack, style: { marginTop: 18, padding: "12px 32px", borderRadius: R.lg, border: "none", background: C.green, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui, boxShadow: `0 4px 14px ${C.green}44` }, children: "Retour" })
      ] }),
      /* @__PURE__ */ jsx9("div", { style: { height: 24 } })
    ] })
  ] });
}
function ExHeader({ ex, theme, lc }) {
  const C = useC();
  return /* @__PURE__ */ jsx9("div", { style: { background: lc.bg, border: `1.5px solid ${lc.border}`, borderRadius: R.lg, padding: "14px 16px", marginBottom: 14 }, children: /* @__PURE__ */ jsxs7("div", { style: { display: "flex", alignItems: "center", gap: 12 }, children: [
    /* @__PURE__ */ jsx9("div", { style: { width: 48, height: 48, borderRadius: R.md, background: theme.colorL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsx9(Ti, { name: "guitar-pick", size: 22, color: theme.color }) }),
    /* @__PURE__ */ jsxs7("div", { children: [
      /* @__PURE__ */ jsxs7("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }, children: [
        /* @__PURE__ */ jsx9("span", { style: { fontSize: 10, fontWeight: 700, color: lc.dot, background: lc.bg, border: `1px solid ${lc.border}`, borderRadius: 99, padding: "1px 7px", textTransform: "uppercase", letterSpacing: ".06em" }, children: LEVEL_LABELS[ex.lvl || 1] }),
        /* @__PURE__ */ jsx9("span", { style: { fontSize: 11, color: lc.dot }, children: DIFF_STARS[ex.lvl || 1] })
      ] }),
      /* @__PURE__ */ jsx9("div", { style: { fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }, children: ex.title }),
      /* @__PURE__ */ jsxs7("div", { style: { fontSize: 11, color: C.text3, marginTop: 2 }, children: [
        ex.dur,
        " min",
        ex.bpm ? ` \xB7 \u2669 ${ex.bpm} BPM` : "",
        " \xB7 +",
        ex.xp,
        " XP"
      ] })
    ] })
  ] }) });
}
function LinkedLesson({ lesson }) {
  const C = useC();
  return /* @__PURE__ */ jsxs7("div", { style: { background: C.primaryL, border: `1.5px solid ${C.primaryBorder}`, borderRadius: R.md, padding: "9px 13px", marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }, children: [
    /* @__PURE__ */ jsx9(Ti, { name: "book-2", size: 14, color: C.primary }),
    /* @__PURE__ */ jsxs7("div", { style: { fontSize: 12, color: C.primaryD }, children: [
      "Li\xE9 \xE0 la le\xE7on : ",
      /* @__PURE__ */ jsx9("strong", { children: lesson.title })
    ] })
  ] });
}
function Tip({ text }) {
  const C = useC();
  return /* @__PURE__ */ jsxs7("div", { style: { background: C.amberL, borderRadius: R.md, padding: "11px 13px", marginBottom: 12, border: `1.5px solid ${C.amberBorder}`, display: "flex", gap: 8, alignItems: "flex-start" }, children: [
    /* @__PURE__ */ jsx9(Ti, { name: "bulb", size: 15, color: C.amber }),
    /* @__PURE__ */ jsx9("p", { style: { margin: 0, fontSize: 13, color: C.amberD, lineHeight: 1.55, fontFamily: FONTS.title }, children: text })
  ] });
}

// src/screens/EarTraining.jsx
var EarTraining_exports = {};
__export(EarTraining_exports, {
  EarTraining: () => EarTraining
});
import { useState as useState8, useEffect as useEffect5, useRef as useRef5 } from "react";
import { Fragment as Fragment6, jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
var MODES = [
  { key: "interval", label: "Intervalles", icon: "arrows-up-down", desc: "Identifie l'ecart entre deux notes" },
  { key: "chord_quality", label: "Qualite d'accord", icon: "music", desc: "Majeur, mineur, dominant..." },
  { key: "chord_full", label: "Accord complet", icon: "music-plus", desc: "Nomme l'accord : La mineur, Do7..." },
  { key: "progression", label: "Suites d'accords", icon: "list-numbers", desc: "Nomme la suite entiere" }
];
function shade(hex, amount) {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + amount, g = (num >> 8 & 255) + amount, b = (num & 255) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + (r << 16 | g << 8 | b).toString(16).padStart(6, "0");
}
function EarTraining({ onBack, dispatch }) {
  const C = useC();
  const [audioReady, setAudioReady] = useState8(isAudioLoaded());
  const [audioError, setAudioError] = useState8(false);
  const [mode, setMode] = useState8("interval");
  const [question, setQuestion] = useState8(null);
  const [selected, setSelected] = useState8(null);
  const [isPlaying, setIsPlaying] = useState8(false);
  const [score, setScore] = useState8({ correct: 0, total: 0 });
  const [sessionDone, setSessionDone] = useState8(false);
  const [answers, setAnswers] = useState8([]);
  const finTimerRef = useRef5(null);
  const SESSION_LENGTH = 8;
  const annulerFinTimer = () => {
    if (finTimerRef.current) {
      clearTimeout(finTimerRef.current);
      finTimerRef.current = null;
    }
  };
  useEffect5(() => {
    if (!isAudioLoaded()) {
      loadAudio().then(() => setAudioReady(true)).catch(() => setAudioError(true));
    }
  }, []);
  useEffect5(() => {
    if (audioReady && !question) nextQuestion();
  }, [audioReady, mode]);
  useEffect5(() => () => {
    annulerFinTimer();
    try {
      stopAll();
    } catch {
    }
  }, []);
  const nextQuestion = () => {
    annulerFinTimer();
    try {
      stopAll();
    } catch {
    }
    setIsPlaying(false);
    setSelected(null);
    setQuestion(generateEarTrainingQuestion(mode));
  };
  const playQuestion = async () => {
    if (!question || isPlaying) return;
    annulerFinTimer();
    setIsPlaying(true);
    try {
      await unlockAudio();
    } catch {
    }
    try {
      await question.play();
    } catch {
    }
    const duree = question.durationMs ?? 2e3;
    finTimerRef.current = setTimeout(() => {
      finTimerRef.current = null;
      setIsPlaying(false);
    }, duree);
  };
  const stopPlayback = () => {
    annulerFinTimer();
    try {
      stopAll();
    } catch {
    }
    setIsPlaying(false);
  };
  const playRef = async () => {
    if (!question?.playReference) return;
    try {
      await unlockAudio();
    } catch {
    }
    try {
      await question.playReference();
    } catch {
    }
  };
  const handleAnswer = (option) => {
    if (selected !== null) return;
    const key = mode === "interval" ? option.semitones : option.key;
    const correct = key === question.answer;
    setSelected(key);
    const newScore = { correct: score.correct + (correct ? 1 : 0), total: score.total + 1 };
    setScore(newScore);
    setAnswers((prev) => [...prev, { question: question.options.find((o) => (mode === "interval" ? o.semitones : o.key) === question.answer)?.label, correct }]);
    dispatch?.({ type: "REVIEW_ANSWER", questionId: `ear-${Date.now()}`, correct, history: {}, xp: correct ? 25 : 0 });
    if (newScore.total >= SESSION_LENGTH) {
      setTimeout(() => setSessionDone(true), 1200);
    }
  };
  const changeMode = (m) => {
    annulerFinTimer();
    try {
      stopAll();
    } catch {
    }
    setIsPlaying(false);
    setMode(m);
    setQuestion(null);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setAnswers([]);
    setSessionDone(false);
  };
  if (sessionDone) {
    const pct = Math.round(score.correct / score.total * 100);
    return /* @__PURE__ */ jsxs8("div", { style: { padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }, children: [
      /* @__PURE__ */ jsxs8("div", { style: { textAlign: "center", padding: "20px 0" }, children: [
        /* @__PURE__ */ jsx10("div", { style: { marginBottom: 10 }, children: /* @__PURE__ */ jsx10(Ti, { name: pct >= 75 ? "headphones" : pct >= 50 ? "ear" : "book-2", size: 44, color: pct >= 75 ? C.green : pct >= 50 ? C.amber : C.text3 }) }),
        /* @__PURE__ */ jsx10("div", { style: { fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONTS.title }, children: pct >= 75 ? "Belle oreille !" : pct >= 50 ? "Bon travail !" : "Continue l'entrainement !" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "16px" }, children: [
        /* @__PURE__ */ jsxs8("div", { style: { display: "flex", justifyContent: "space-around" }, children: [
          /* @__PURE__ */ jsxs8("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsx10("div", { style: { fontSize: 28, fontWeight: 700, color: C.green }, children: score.correct }),
            /* @__PURE__ */ jsx10("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: "Correctes" })
          ] }),
          /* @__PURE__ */ jsx10("div", { style: { width: 1, background: C.border } }),
          /* @__PURE__ */ jsxs8("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsx10("div", { style: { fontSize: 28, fontWeight: 700, color: C.coral }, children: score.total - score.correct }),
            /* @__PURE__ */ jsx10("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: "Ratees" })
          ] }),
          /* @__PURE__ */ jsx10("div", { style: { width: 1, background: C.border } }),
          /* @__PURE__ */ jsxs8("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxs8("div", { style: { fontSize: 28, fontWeight: 700, color: C.primary }, children: [
              "+",
              score.correct * 25
            ] }),
            /* @__PURE__ */ jsx10("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: "XP" })
          ] })
        ] }),
        /* @__PURE__ */ jsx10("div", { style: { marginTop: 14, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }, children: /* @__PURE__ */ jsx10("div", { style: { height: "100%", width: `${pct}%`, background: pct >= 75 ? C.green : pct >= 50 ? C.primary : C.coral, borderRadius: 3 } }) })
      ] }),
      /* @__PURE__ */ jsxs8("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ jsx10("button", { onClick: () => {
          setScore({ correct: 0, total: 0 });
          setAnswers([]);
          setSessionDone(false);
          nextQuestion();
        }, style: { flex: 1, padding: "13px", borderRadius: R.md, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONTS.ui }, children: "Recommencer" }),
        /* @__PURE__ */ jsx10("button", { onClick: onBack, style: { flex: 1, padding: "13px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }, children: "Retour" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs8("div", { style: { display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }, children: [
    /* @__PURE__ */ jsxs8("div", { style: { padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }, children: [
      /* @__PURE__ */ jsx10("button", { onClick: onBack, style: { background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0 }, children: /* @__PURE__ */ jsx10(Ti, { name: "chevron-left", size: 22 }) }),
      /* @__PURE__ */ jsxs8("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsx10("div", { style: { fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }, children: "Ear Training" }),
        /* @__PURE__ */ jsxs8("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: [
          score.total,
          "/",
          SESSION_LENGTH,
          " \xB7 ",
          score.correct,
          " correctes"
        ] })
      ] }),
      /* @__PURE__ */ jsx10(Gropi, { pose: "listen", size: 46, anim: "bob" }),
      /* @__PURE__ */ jsx10("div", { style: { fontSize: 13, fontWeight: 600, color: C.primary, fontFamily: FONTS.ui }, children: score.total > 0 ? `${Math.round(score.correct / score.total * 100)}%` : "" })
    ] }),
    /* @__PURE__ */ jsxs8("div", { style: { padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }, children: [
      /* @__PURE__ */ jsx10("div", { style: { display: "flex", gap: 3 }, children: Array.from({ length: SESSION_LENGTH }).map((_, i) => {
        const ans = answers[i];
        return /* @__PURE__ */ jsx10("div", { style: { flex: 1, height: 5, borderRadius: 3, background: ans ? ans.correct ? C.green : C.coral : i === score.total ? C.primary : C.border, transition: "background 0.3s" } }, i);
      }) }),
      /* @__PURE__ */ jsx10("div", { style: { display: "flex", background: C.surface2, borderRadius: R.lg, padding: 3, gap: 2 }, children: MODES.map((m) => /* @__PURE__ */ jsx10("button", { onClick: () => changeMode(m.key), style: { flex: 1, padding: "8px 10px", borderRadius: R.md, border: "none", cursor: "pointer", fontFamily: FONTS.ui, background: mode === m.key ? C.surface : "transparent", boxShadow: mode === m.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none", color: mode === m.key ? C.text : C.text3, fontSize: 12, fontWeight: mode === m.key ? 600 : 400 }, children: m.label }, m.key)) }),
      audioError && /* @__PURE__ */ jsx10("div", { style: { background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.md, padding: "12px 14px", fontSize: 12, color: C.coralD, fontFamily: FONTS.ui }, children: "Les samples audio n'ont pas ete trouves. Verifie que les fichiers .mp3 sont dans public/audio/guitar/" }),
      !audioReady && !audioError && /* @__PURE__ */ jsx10("div", { style: { background: C.amberL, border: `1px solid ${C.amberBorder}`, borderRadius: R.md, padding: "12px 14px", fontSize: 12, color: C.amberD, fontFamily: FONTS.ui }, children: "Chargement des samples audio..." }),
      audioReady && question && /* @__PURE__ */ jsxs8(Fragment6, { children: [
        /* @__PURE__ */ jsxs8("div", { style: { textAlign: "center", padding: "16px 0 8px" }, children: [
          /* @__PURE__ */ jsx10("button", { onClick: isPlaying ? stopPlayback : playQuestion, style: {
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "none",
            background: `linear-gradient(135deg, ${C.primary}, ${shade(C.primary, -45)})`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            boxShadow: "0 4px 20px rgba(232,93,26,0.4)",
            transition: "all 0.2s"
          }, children: /* @__PURE__ */ jsx10(Ti, { name: isPlaying ? "player-stop" : "player-play", size: 28, color: "#fff" }) }),
          /* @__PURE__ */ jsx10("div", { style: { fontSize: 12, color: C.text3, fontFamily: FONTS.ui, marginTop: 10 }, children: mode === "interval" ? "Ecoute l'intervalle" : mode === "progression" ? "Ecoute la suite d'accords" : "Ecoute l'accord" }),
          question.playReference && selected === null && /* @__PURE__ */ jsxs8("button", { onClick: playRef, style: {
            marginTop: 12,
            padding: "7px 14px",
            borderRadius: 999,
            border: `1.5px solid ${C.border}`,
            background: C.surface,
            color: C.text2,
            fontSize: 11.5,
            fontWeight: 700,
            fontFamily: FONTS.ui,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6
          }, children: [
            /* @__PURE__ */ jsx10(Ti, { name: "tuning-fork", size: 13, color: C.text3 }),
            "Entendre le ",
            question.referenceLabel,
            " de r\xE9f\xE9rence"
          ] }),
          selected === null && /* @__PURE__ */ jsx10("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 4, fontStyle: "italic" }, children: "Tu peux r\xE9\xE9couter autant de fois que tu veux" })
        ] }),
        /* @__PURE__ */ jsx10("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: question.options.map((opt, i) => {
          const key = mode === "interval" ? opt.semitones : opt.key;
          const isAnswer = key === question.answer;
          const isSelected = key === selected;
          let bg = C.surface, border = `1px solid ${C.border}`, col = C.text;
          if (selected !== null) {
            if (isAnswer) {
              bg = C.greenL;
              border = `1px solid ${C.green}`;
              col = C.greenD;
            } else if (isSelected) {
              bg = C.coralL;
              border = `1px solid ${C.coral}`;
              col = C.coralD;
            }
          }
          return /* @__PURE__ */ jsxs8("button", { onClick: () => handleAnswer(opt), disabled: selected !== null, style: { padding: "14px 16px", borderRadius: 12, border, background: bg, cursor: selected !== null ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FONTS.title }, children: [
            /* @__PURE__ */ jsx10("span", { style: { fontSize: 14, fontWeight: 500, color: col }, children: opt.label }),
            selected !== null && isAnswer && /* @__PURE__ */ jsx10(Ti, { name: "check", size: 18, color: C.green }),
            selected !== null && isSelected && !isAnswer && /* @__PURE__ */ jsx10(Ti, { name: "x", size: 18, color: C.coral })
          ] }, i);
        }) }),
        selected !== null && /* @__PURE__ */ jsxs8("div", { style: { marginTop: 4 }, children: [
          /* @__PURE__ */ jsx10("div", { style: { background: selected === question.answer ? C.greenL : C.coralL, border: `1px solid ${selected === question.answer ? C.greenBorder : C.coralBorder}`, borderRadius: R.md, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: selected === question.answer ? C.greenD : C.coralD, fontFamily: FONTS.ui, lineHeight: 1.5 }, children: selected === question.answer ? "Correct ! +25 XP" : `La bonne reponse etait : ${question.options.find((o) => (mode === "interval" ? o.semitones : o.key) === question.answer)?.label}` }),
          score.total < SESSION_LENGTH && /* @__PURE__ */ jsx10("button", { onClick: nextQuestion, style: { width: "100%", padding: "13px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }, children: "Question suivante" })
        ] })
      ] })
    ] })
  ] });
}

// src/screens/JamSession.jsx
var JamSession_exports = {};
__export(JamSession_exports, {
  JamSession: () => JamSession
});
import { useState as useState10, useMemo as useMemo5, useEffect as useEffect7, useRef as useRef6 } from "react";

// src/Fretboard.jsx
var Fretboard_exports = {};
__export(Fretboard_exports, {
  Fretboard: () => Fretboard,
  FretboardExercise: () => FretboardExercise,
  FretboardLesson: () => FretboardLesson,
  FretboardQuizQuestion: () => FretboardQuizQuestion
});
import { useState as useState9, useMemo as useMemo4, useCallback as useCallback2, useEffect as useEffect6 } from "react";

// src/fretboardValidator.js
var RESOLVERS = {
  find_note: (concept, opts) => {
    const { root, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const strings = Array.from({ length: maxStr - minStr + 1 }, (_, i) => minStr + i);
    return getPositionsOfNote(root, maxFret, strings).filter((p) => p.fret >= minFret);
  },
  find_roots: (concept, opts) => {
    return RESOLVERS.find_note(concept, opts);
  },
  /**
   * Forme d'accord précise.
   *
   * Contrairement aux autres types, qui demandent TOUTES les occurrences
   * d'une note ou d'un accord, celui-ci attend un doigté exact : la forme Mi
   * de La majeur, c'est 5-7-7-6-5-5, pas « tous les La, Do# et Mi du
   * manche ». Les positions viennent donc directement du concept.
   *
   * concept.positions : [{ string, fret }] — les cases à presser.
   *   Les cordes à vide (case 0) et les cordes étouffées ne sont PAS
   *   attendues : on ne peut pas « sélectionner » l'absence de doigt, et
   *   demander de cliquer une corde à vide n'aurait pas de sens sur un
   *   manche tactile.
   */
  find_shape: (concept) => {
    const { positions = [] } = concept;
    return positions.filter((p) => p && Number.isInteger(p.string) && Number.isInteger(p.fret) && p.fret > 0).map((p) => ({ string: p.string, fret: p.fret }));
  },
  find_chord: (concept, opts) => {
    const { root, quality, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const all = getChordPositions(root, quality, maxFret);
    return all.filter(
      (p) => p.fret >= minFret && p.string >= minStr && p.string <= maxStr
    );
  },
  find_scale: (concept, opts) => {
    const { root, quality, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const all = getScalePositions(root, quality, maxFret);
    return all.filter(
      (p) => p.fret >= minFret && p.string >= minStr && p.string <= maxStr
    );
  },
  find_interval: (concept, opts) => {
    const { root, interval, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const rootNorm = normalizeNote(root);
    const positions = [];
    for (let s = minStr; s <= maxStr; s++) {
      for (let f = minFret; f <= maxFret; f++) {
        const note = getNoteAtPosition(s, f);
        const iv = getInterval(rootNorm, note);
        if (iv === interval) {
          positions.push({ string: s, fret: f, note, interval: iv });
        }
      }
    }
    return positions;
  }
};
var MATCH_STRATEGIES = {
  // L'utilisateur doit trouver TOUTES les positions correctes
  all: (selected, correct) => {
    const hits = selected.filter((s) => correct.some((c) => c.string === s.string && c.fret === s.fret));
    const extras = selected.filter((s) => !correct.some((c) => c.string === s.string && c.fret === s.fret));
    const missed = correct.filter((c) => !selected.some((s) => s.string === c.string && s.fret === c.fret));
    return {
      complete: hits.length === correct.length && extras.length === 0,
      hits: hits.length,
      total: correct.length,
      extras: extras.length,
      missed: missed.length,
      missedPositions: missed,
      score: Math.max(0, hits.length - extras.length)
    };
  },
  // L'utilisateur doit trouver au moins N positions correctes
  any_n: (selected, correct, n = 1) => {
    const hits = selected.filter((s) => correct.some((c) => c.string === s.string && c.fret === s.fret));
    const extras = selected.filter((s) => !correct.some((c) => c.string === s.string && c.fret === s.fret));
    return {
      complete: hits.length >= n && extras.length === 0,
      hits: hits.length,
      total: n,
      extras: extras.length,
      missed: Math.max(0, n - hits.length),
      missedPositions: [],
      score: Math.min(hits.length, n)
    };
  },
  // L'utilisateur doit sélectionner exactement les notes d'un accord (positions libres)
  chord_build: (selected, correct) => {
    const correctNotes = [...new Set(correct.map((p) => p.note))];
    const selectedNotes = [...new Set(selected.map((s) => getNoteAtPosition(s.string, s.fret)))];
    const foundNotes = correctNotes.filter((n) => selectedNotes.includes(n));
    const extraNotes = selectedNotes.filter((n) => !correctNotes.includes(n));
    return {
      complete: foundNotes.length === correctNotes.length && extraNotes.length === 0,
      hits: foundNotes.length,
      total: correctNotes.length,
      extras: extraNotes.length,
      missed: correctNotes.length - foundNotes.length,
      missedPositions: [],
      foundNotes,
      missingNotes: correctNotes.filter((n) => !selectedNotes.includes(n)),
      score: Math.max(0, foundNotes.length - extraNotes.length)
    };
  }
};
function validate(concept, selected, selectionRules = {}, opts = {}) {
  const { type } = concept;
  const { mode = "all", minSelections = 1 } = selectionRules;
  const resolver = RESOLVERS[type];
  if (!resolver) {
    console.warn(`[fretboardValidator] Type inconnu : "${type}"`);
    return { complete: false, hits: 0, total: 0, extras: 0, missed: 0, score: 0, feedback: "Type de challenge inconnu." };
  }
  const fretRange = opts.fretRange || [0, 12];
  const stringRange = opts.stringRange || [1, 6];
  const correct = resolver(concept, { fretRange, stringRange });
  const neutral = concept.neutralPositions || [];
  const effectiveSelected = selected.filter(
    (s) => !neutral.some((n) => n.string === s.string && n.fret === s.fret)
  );
  let result;
  if (mode === "chord_build") {
    result = MATCH_STRATEGIES.chord_build(effectiveSelected, correct);
  } else if (mode === "any_n") {
    result = MATCH_STRATEGIES.any_n(effectiveSelected, correct, minSelections);
  } else {
    result = MATCH_STRATEGIES.all(effectiveSelected, correct);
  }
  result.feedback = generateFeedback(result, concept, mode);
  result.correctPositions = correct;
  return result;
}
function getTargetPositions(concept, opts = {}) {
  const { type } = concept;
  const resolver = RESOLVERS[type];
  if (!resolver) return [];
  const fretRange = opts.fretRange || [0, 12];
  const stringRange = opts.stringRange || [1, 6];
  return resolver(concept, { fretRange, stringRange });
}
function generateFeedback(result, concept, mode) {
  if (result.complete) {
    return "Parfait \u2014 toutes les positions trouv\xE9es !";
  }
  const parts = [];
  if (result.missed > 0) {
    parts.push(`${result.missed} position${result.missed > 1 ? "s" : ""} manquante${result.missed > 1 ? "s" : ""}`);
  }
  if (result.extras > 0) {
    parts.push(`${result.extras} erreur${result.extras > 1 ? "s" : ""}`);
  }
  return `${parts.join(" \xB7 ")} \u2014 en orange = manqu\xE9, en rouge = erreur.`;
}

// src/Fretboard.jsx
import { Fragment as Fragment7, jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
var vibrer = (ms = 8) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
  }
};
var labelCase = (corde, fret, note) => fret === 0 ? `Corde ${corde} \xE0 vide, ${note || ""}`.trim() : `Corde ${corde}, case ${fret}${note ? `, ${note}` : ""}`;
var FONTS2 = {
  title: '"Clarendon LT", "Clarendon", "Playfair Display", Georgia, serif',
  ui: '"Inter", "Helvetica Neue", -apple-system, sans-serif',
  body: 'Georgia, "Times New Roman", serif'
};
function getNoteColors(C) {
  return {
    root: { bg: C.amber, text: "#fff", border: C.amberD },
    third: { bg: C.primary, text: "#fff", border: C.primaryD },
    fifth: { bg: C.green, text: "#fff", border: C.greenD },
    seventh: { bg: C.coral, text: "#fff", border: C.coralD },
    other: { bg: C.blue, text: "#fff", border: C.blueD },
    selected: { bg: C.primary, text: "#fff", border: C.primaryD },
    correct: { bg: C.green, text: "#fff", border: C.greenD },
    wrong: { bg: C.coral, text: "#fff", border: C.coralD },
    missed: { bg: C.amber, text: "#fff", border: C.amberD }
  };
}
function colorForDegree(degree, isRoot, NOTE_COLORS) {
  if (isRoot) return NOTE_COLORS.root;
  const map = {
    2: NOTE_COLORS.other,
    3: NOTE_COLORS.third,
    4: NOTE_COLORS.other,
    5: NOTE_COLORS.fifth,
    6: NOTE_COLORS.other,
    7: NOTE_COLORS.seventh
  };
  return map[degree] || NOTE_COLORS.other;
}
function getNoteLabel(note, interval, degree, displayMode, lang = "fr") {
  switch (displayMode) {
    case "notes":
      return lang === "fr" ? noteToFr(note) : note;
    case "intervals":
      return INTERVAL_NAMES[interval]?.short ?? "?";
    case "degrees":
      if (degree != null && degree > 0) return String(degree);
      if (interval != null) return INTERVAL_NAMES[interval]?.short ?? "?";
      return "?";
    default:
      return lang === "fr" ? noteToFr(note) : note;
  }
}
function NoteMarker({ label, color, size = 28, style = {} }) {
  return /* @__PURE__ */ jsx11("div", { style: {
    width: size,
    height: size,
    borderRadius: "50%",
    background: color.bg,
    border: `2px solid ${color.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size <= 24 ? 8 : size <= 30 ? 9 : 11,
    fontWeight: 700,
    color: color.text,
    fontFamily: FONTS2.ui,
    letterSpacing: "-0.02em",
    flexShrink: 0,
    userSelect: "none",
    boxShadow: `0 2px 4px ${color.border}40`,
    transition: "transform 0.1s ease",
    ...style
  }, children: label });
}
function FretMarker({ fret, isDouble }) {
  const C = useC();
  return /* @__PURE__ */ jsx11("div", { style: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: isDouble ? 6 : 0,
    height: 10,
    marginTop: 2
  }, children: isDouble ? /* @__PURE__ */ jsxs9(Fragment7, { children: [
    /* @__PURE__ */ jsx11("div", { style: { width: 6, height: 6, borderRadius: "50%", background: C.border } }),
    /* @__PURE__ */ jsx11("div", { style: { width: 6, height: 6, borderRadius: "50%", background: C.border } })
  ] }) : /* @__PURE__ */ jsx11("div", { style: { width: 6, height: 6, borderRadius: "50%", background: C.border } }) });
}
function Fretboard({
  // Données
  mode = "blank",
  root,
  scale,
  chord,
  highlightedNotes,
  // Affichage
  displayMode = "notes",
  lang = "fr",
  startFret = 0,
  endFret = 12,
  showOpenStrings = true,
  showStringNames = true,
  showFretNumbers = true,
  compact = false,
  // Quiz
  quizTarget,
  onQuizComplete,
  onQuizProgress,
  // Callbacks libres
  onNoteClick,
  selectedPositions: externalSelected,
  // Illumination pendant la lecture : nom de note ("Do") ou tableau de noms
  // pour un accord. Toutes les positions de ces notes s'allument, ce qui
  // rend audible ET visible le lien entre le son et le manche.
  flashNotes = null
}) {
  const C = useC();
  const NOTE_COLORS = useMemo4(() => getNoteColors(C), [C]);
  const [quizSelected, setQuizSelected] = useState9([]);
  const [quizRevealed, setQuizRevealed] = useState9(false);
  const activePositions = useMemo4(() => {
    if (mode === "scale" && root && scale) {
      return getScalePositions(root, scale, endFret);
    }
    if (mode === "chord" && root && chord) {
      return getChordPositions(root, chord, endFret);
    }
    if (mode === "highlight" && highlightedNotes?.length) {
      return getHighlightPositions(highlightedNotes, endFret);
    }
    if (mode === "quiz" && quizTarget) {
      return getQuizTargetPositions(quizTarget, endFret);
    }
    return [];
  }, [mode, root, scale, chord, highlightedNotes, quizTarget, endFret]);
  const positionMap = useMemo4(() => {
    const map = {};
    for (const p of activePositions) {
      map[`${p.string}-${p.fret}`] = p;
    }
    return map;
  }, [activePositions]);
  const handleCellClick = useCallback2((string, fret) => {
    const note = getNoteAtPosition(string, fret);
    if (mode === "quiz" && !quizRevealed) {
      setQuizSelected((prev) => {
        const already = prev.some((p) => p.string === string && p.fret === fret);
        const next = already ? prev.filter((p) => !(p.string === string && p.fret === fret)) : [...prev, { string, fret }];
        onQuizProgress?.({ selected: next, correct: activePositions });
        const result = checkQuizCompletion(next, activePositions);
        if (result.complete) onQuizComplete?.(result);
        return next;
      });
      return;
    }
    onNoteClick?.({ string, fret, note });
  }, [mode, quizRevealed, activePositions, onNoteClick, onQuizProgress, onQuizComplete]);
  const fretRange = [];
  for (let f = startFret; f <= endFret; f++) fretRange.push(f);
  const strings = [1, 2, 3, 4, 5, 6];
  const cellW = compact ? TAP.fretW : 48;
  const cellH = compact ? TAP.fret : TAP.comfy;
  const dotSz = compact ? 26 : 30;
  const openW = compact ? 34 : 38;
  const labelW = compact ? 26 : 30;
  const stringNameStyle = {
    width: labelW,
    height: cellH,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: T.micro,
    // 11 px : plancher de lisibilité (était 9)
    fontWeight: 700,
    color: C.text3,
    fontFamily: FONTS2.ui,
    flexShrink: 0
  };
  const STRING_LABELS2 = { 6: "E\u2082", 5: "A\u2082", 4: "D\u2083", 3: "G\u2083", 2: "B\u2083", 1: "E\u2084" };
  return /* @__PURE__ */ jsxs9("div", { style: { width: "100%", userSelect: "none" }, children: [
    /* @__PURE__ */ jsx11("div", { className: "gr-hscroll-wrap", children: /* @__PURE__ */ jsx11("div", { className: "gr-hscroll", role: "group", "aria-label": "Manche de guitare, d\xE9file horizontalement", children: /* @__PURE__ */ jsxs9("div", { style: { minWidth: "fit-content", paddingBottom: 2 }, children: [
      showFretNumbers && /* @__PURE__ */ jsxs9("div", { style: { display: "flex", marginBottom: 2 }, children: [
        showStringNames && /* @__PURE__ */ jsx11("div", { style: { width: labelW, flexShrink: 0 } }),
        showOpenStrings && /* @__PURE__ */ jsx11("div", { style: { width: openW, flexShrink: 0 } }),
        fretRange.filter((f) => f > 0).map((f) => /* @__PURE__ */ jsx11("div", { style: {
          width: cellW,
          height: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          color: C.text3,
          fontFamily: FONTS2.ui,
          fontWeight: f % 12 === 0 ? 700 : 400,
          flexShrink: 0
        }, children: f }, f))
      ] }),
      strings.map((s, sIdx) => /* @__PURE__ */ jsxs9("div", { style: { display: "flex", alignItems: "center", position: "relative" }, children: [
        showStringNames && /* @__PURE__ */ jsx11("div", { style: stringNameStyle, children: STRING_LABELS2[s] }),
        showOpenStrings && /* @__PURE__ */ jsxs9(
          "div",
          {
            onClick: () => {
              vibrer();
              handleCellClick(s, 0);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                vibrer();
                handleCellClick(s, 0);
              }
            },
            role: "button",
            tabIndex: 0,
            "aria-label": labelCase(s, 0, getNoteAtPosition(s, 0)),
            style: {
              width: openW,
              height: cellH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              position: "relative",
              cursor: mode === "quiz" || onNoteClick ? "pointer" : "default"
            },
            onMouseEnter: (e) => {
              if (mode === "quiz" || onNoteClick) {
                e.currentTarget.style.background = `${C.primary}08`;
              }
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "transparent";
            },
            children: [
              /* @__PURE__ */ jsx11("div", { style: {
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: getStringThickness(s),
                background: C.border,
                transform: "translateY(-50%)"
              } }),
              /* @__PURE__ */ jsx11("div", { style: { position: "relative", zIndex: 2 }, children: renderCell(s, 0) })
            ]
          }
        ),
        fretRange.filter((f) => f > 0).map((f, fIdx) => {
          const isFirstFret = fIdx === 0;
          const isLastFret = f === endFret;
          return /* @__PURE__ */ jsxs9(
            "div",
            {
              onClick: () => {
                vibrer();
                handleCellClick(s, f);
              },
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  vibrer();
                  handleCellClick(s, f);
                }
              },
              role: "button",
              tabIndex: 0,
              "aria-label": labelCase(s, f, getNoteAtPosition(s, f)),
              style: {
                width: cellW,
                height: cellH,
                position: "relative",
                flexShrink: 0,
                cursor: mode === "quiz" || onNoteClick ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: [
                /* @__PURE__ */ jsx11("div", { style: {
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: isFirstFret ? 3 : 1,
                  background: isFirstFret ? C.text : C.border
                } }),
                /* @__PURE__ */ jsx11("div", { style: {
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: getStringThickness(s),
                  background: C.border,
                  transform: "translateY(-50%)",
                  zIndex: 0
                } }),
                /* @__PURE__ */ jsx11(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      inset: 0,
                      zIndex: 1
                    },
                    onMouseEnter: (e) => {
                      if (mode === "quiz" || onNoteClick) {
                        e.currentTarget.style.background = `${C.primary}08`;
                      }
                    },
                    onMouseLeave: (e) => {
                      e.currentTarget.style.background = "transparent";
                    }
                  }
                ),
                /* @__PURE__ */ jsx11("div", { style: { position: "relative", zIndex: 2 }, children: renderCell(s, f) })
              ]
            },
            f
          );
        })
      ] }, s)),
      /* @__PURE__ */ jsxs9("div", { style: { display: "flex", marginTop: 0 }, children: [
        showStringNames && /* @__PURE__ */ jsx11("div", { style: { width: labelW, flexShrink: 0 } }),
        showOpenStrings && /* @__PURE__ */ jsx11("div", { style: { width: openW, flexShrink: 0 } }),
        fretRange.filter((f) => f > 0).map((f) => /* @__PURE__ */ jsxs9("div", { style: { width: cellW, flexShrink: 0 }, children: [
          MARKER_FRETS.includes(f) && /* @__PURE__ */ jsx11(FretMarker, { fret: f, isDouble: false }),
          DOUBLE_MARKER_FRETS.includes(f) && /* @__PURE__ */ jsx11(FretMarker, { fret: f, isDouble: true })
        ] }, f))
      ] })
    ] }) }) }),
    mode === "quiz" && /* @__PURE__ */ jsx11(
      QuizControls,
      {
        selected: quizSelected,
        correct: activePositions,
        revealed: quizRevealed,
        target: quizTarget,
        lang,
        onReveal: () => setQuizRevealed(true),
        onReset: () => {
          setQuizSelected([]);
          setQuizRevealed(false);
        }
      }
    )
  ] });
  function renderCell(s, f) {
    const key = `${s}-${f}`;
    const pos = positionMap[key];
    if (mode === "quiz") {
      const isSelected = quizSelected.some((p) => p.string === s && p.fret === f);
      const isCorrect = isCorrectPosition(s, f, activePositions);
      if (quizRevealed) {
        if (isCorrect && isSelected) {
          const note = getNoteAtPosition(s, f);
          return /* @__PURE__ */ jsx11(NoteMarker, { label: lang === "fr" ? noteToFr(note) : note, color: NOTE_COLORS.correct, size: dotSz });
        }
        if (isCorrect && !isSelected) {
          const note = getNoteAtPosition(s, f);
          return /* @__PURE__ */ jsx11(NoteMarker, { label: lang === "fr" ? noteToFr(note) : note, color: NOTE_COLORS.missed, size: dotSz });
        }
        if (!isCorrect && isSelected) {
          const note = getNoteAtPosition(s, f);
          return /* @__PURE__ */ jsx11(NoteMarker, { label: lang === "fr" ? noteToFr(note) : note, color: NOTE_COLORS.wrong, size: dotSz });
        }
        return null;
      }
      if (isSelected) {
        const note = getNoteAtPosition(s, f);
        return /* @__PURE__ */ jsx11(NoteMarker, { label: lang === "fr" ? noteToFr(note) : note, color: NOTE_COLORS.selected, size: dotSz });
      }
      return null;
    }
    if (externalSelected) {
      const isExt = externalSelected.some((p) => p.string === s && p.fret === f);
      if (isExt) {
        const note = getNoteAtPosition(s, f);
        return /* @__PURE__ */ jsx11(NoteMarker, { label: lang === "fr" ? noteToFr(note) : note, color: NOTE_COLORS.selected, size: dotSz });
      }
    }
    if (!pos) return null;
    const label = getNoteLabel(pos.note, pos.interval, pos.degree, displayMode, lang);
    const baseColor = pos.isRoot ? NOTE_COLORS.root : colorForDegree(pos.degree, false, NOTE_COLORS);
    const flashList = flashNotes == null ? [] : Array.isArray(flashNotes) ? flashNotes : [flashNotes];
    const isFlashing = flashList.some((n) => n && normalizeNote(n) === normalizeNote(pos.note));
    return /* @__PURE__ */ jsx11(
      NoteMarker,
      {
        label,
        color: baseColor,
        size: isFlashing ? Math.round(dotSz * 1.32) : dotSz,
        style: {
          ...onNoteClick ? { cursor: "pointer" } : {},
          ...isFlashing ? {
            boxShadow: `0 0 0 3px ${C.bg}, 0 0 14px 4px ${baseColor.bg}`,
            zIndex: 5
          } : {},
          transition: "width .12s, height .12s, box-shadow .12s"
        }
      }
    );
  }
}
function getStringThickness(string) {
  const thicknesses = { 6: 3, 5: 2.5, 4: 2, 3: 1.5, 2: 1.5, 1: 1 };
  return thicknesses[string] || 1.5;
}
function QuizControls({ selected, correct, revealed, target, lang, onReveal, onReset }) {
  const C = useC();
  const result = checkQuizCompletion(selected, correct);
  const label = lang === "fr" ? noteToFr(target) : target;
  return /* @__PURE__ */ jsxs9("div", { style: {
    marginTop: 12,
    padding: "12px 14px",
    background: C.surface2,
    borderRadius: 12,
    border: `1px solid ${C.border}`
  }, children: [
    /* @__PURE__ */ jsxs9("div", { style: {
      fontSize: 13,
      fontWeight: 600,
      color: C.text,
      fontFamily: FONTS2.ui,
      marginBottom: 8
    }, children: [
      "\u{1F3AF} Trouve tous les ",
      /* @__PURE__ */ jsx11("strong", { children: label })
    ] }),
    /* @__PURE__ */ jsxs9("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
      /* @__PURE__ */ jsx11("div", { style: {
        fontSize: 12,
        color: C.text3,
        fontFamily: FONTS2.ui,
        flex: 1
      }, children: revealed ? `${result.found}/${result.total} trouv\xE9${result.found > 1 ? "s" : ""} \xB7 ${result.extras} fausse${result.extras > 1 ? "s" : ""} note${result.extras > 1 ? "s" : ""}` : `${selected.length} s\xE9lectionn\xE9${selected.length > 1 ? "s" : ""}` }),
      !revealed && /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: onReveal,
          style: {
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            background: C.primary,
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONTS2.ui
          },
          children: "V\xE9rifier"
        }
      ),
      /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: onReset,
          style: {
            padding: "7px 14px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: C.bg,
            color: C.text3,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: FONTS2.ui
          },
          children: "Reset"
        }
      )
    ] }),
    revealed && /* @__PURE__ */ jsx11("div", { style: {
      marginTop: 10,
      padding: "8px 10px",
      borderRadius: 8,
      background: result.complete ? C.greenL : C.amberL,
      fontSize: 12,
      color: result.complete ? C.greenD : C.amberD,
      fontFamily: FONTS2.body,
      lineHeight: 1.5
    }, children: result.complete ? "\u2705 Parfait ! Tu as trouv\xE9 toutes les positions." : `\u{1F7E1} ${result.misses} position${result.misses > 1 ? "s" : ""} manquante${result.misses > 1 ? "s" : ""} (en orange). ${result.extras > 0 ? `${result.extras} erreur${result.extras > 1 ? "s" : ""} (en rouge).` : ""}` })
  ] });
}
function FretboardLesson({ block }) {
  const C = useC();
  const defaultDisplay = block.mode === "highlight" || block.mode === "quiz" ? "notes" : block.displayMode || "notes";
  const [displayMode, setDisplayMode] = useState9(defaultDisplay);
  const [quizDone, setQuizDone] = useState9(false);
  const modeMap = {
    "scale": { mode: "scale", root: block.root, scale: block.scale },
    "chord": { mode: "chord", root: block.root, chord: block.chord },
    "highlight": { mode: "highlight", highlightedNotes: block.notes },
    "quiz": { mode: "quiz", quizTarget: block.quizTarget }
  };
  const props = modeMap[block.mode] || { mode: "blank" };
  const modeLabel = {
    "scale": block.scale ? SCALES[block.scale]?.name ?? block.scale : "",
    "chord": block.chord ? CHORD_TYPES[block.chord]?.name ?? block.chord : "",
    "highlight": "",
    "quiz": ""
  }[block.mode] ?? "";
  const rootLabel = block.root ? block.lang === "en" ? block.root : noteToFr(block.root) : "";
  return /* @__PURE__ */ jsxs9("div", { style: {
    background: C.surface2,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    overflow: "hidden",
    marginBottom: 0
  }, children: [
    /* @__PURE__ */ jsxs9("div", { style: {
      padding: "10px 14px 8px",
      borderBottom: `1px solid ${C.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      flexWrap: "wrap"
    }, children: [
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsxs9("div", { style: {
          fontSize: 11,
          fontWeight: 700,
          color: C.text3,
          fontFamily: FONTS2.ui,
          letterSpacing: "0.08em",
          textTransform: "uppercase"
        }, children: [
          "\u{1F3B8} ",
          rootLabel,
          " ",
          modeLabel
        ] }),
        block.caption && /* @__PURE__ */ jsx11("div", { style: {
          fontSize: 13,
          fontWeight: 600,
          color: C.text,
          fontFamily: FONTS2.ui,
          marginTop: 2
        }, children: block.caption })
      ] }),
      block.mode !== "quiz" && block.mode !== "highlight" && /* @__PURE__ */ jsx11("div", { style: { display: "flex", gap: 4 }, children: [
        { key: "notes", label: "Notes" },
        { key: "intervals", label: "Intervalles" },
        { key: "degrees", label: "Degr\xE9s" }
      ].map((m) => /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: () => setDisplayMode(m.key),
          style: {
            padding: "4px 8px",
            borderRadius: 6,
            border: `1px solid ${displayMode === m.key ? C.primary : C.border}`,
            background: displayMode === m.key ? C.primaryL : C.bg,
            color: displayMode === m.key ? C.primaryD : C.text3,
            fontSize: 10,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: FONTS2.ui
          },
          children: m.label
        },
        m.key
      )) })
    ] }),
    /* @__PURE__ */ jsx11("div", { style: { padding: "10px 8px" }, children: /* @__PURE__ */ jsx11(
      Fretboard,
      {
        ...props,
        displayMode,
        lang: block.lang || "fr",
        compact: block.compact ?? true,
        onQuizComplete: block.mode === "quiz" ? () => setQuizDone(true) : void 0
      }
    ) }),
    quizDone && /* @__PURE__ */ jsx11("div", { style: {
      padding: "8px 14px 12px",
      textAlign: "center",
      fontSize: 13,
      color: C.greenD,
      fontFamily: FONTS2.body
    }, children: "\u{1F3C6} Toutes les positions trouv\xE9es ! +XP" })
  ] });
}
function FretboardQuizQuestion({ question, onComplete, answered, forceReveal }) {
  const C = useC();
  const [quizSelected, setQuizSelected] = useState9([]);
  const [revealed, setRevealed] = useState9(false);
  const [showHint, setShowHint] = useState9(false);
  const questionKey = question.id;
  const [lastKey, setLastKey] = useState9(questionKey);
  if (lastKey !== questionKey) {
    setQuizSelected([]);
    setRevealed(false);
    setShowHint(false);
    setLastKey(questionKey);
  }
  const targetPositions = useMemo4(() => {
    const fretMode = question.fretMode || question.concept?.type;
    const target = question.target || question.concept?.root;
    const root = question.root || question.concept?.root;
    const { scale, chord } = question;
    if ((fretMode === "find_note" || fretMode === "find_root" || fretMode === "find_chord" || fretMode === "find_scale_root") && (target || root)) {
      return getQuizTargetPositions(target || root);
    }
    if (fretMode === "find_shape" && Array.isArray(question.concept?.positions)) {
      return question.concept.positions.filter((p) => p && p.fret > 0);
    }
    return [];
  }, [question.id]);
  const contextPositions = useMemo4(() => {
    const fretMode = question.fretMode || question.concept?.type;
    const root = question.root || question.concept?.root;
    const { scale, chord } = question;
    if (fretMode === "find_chord" && root && chord) {
      return getChordPositions(root, chord, 12);
    }
    if (fretMode === "find_scale_root" && root && scale) {
      return getScalePositions(root, scale, 12);
    }
    return [];
  }, [question.id]);
  const handleCellClick = (string, fret) => {
    if (revealed || answered) return;
    setQuizSelected((prev) => {
      const already = prev.some((p) => p.string === string && p.fret === fret);
      return already ? prev.filter((p) => !(p.string === string && p.fret === fret)) : [...prev, { string, fret }];
    });
  };
  const neutralPositions = question.concept?.neutralPositions || [];
  const stripNeutral = (sel) => sel.filter(
    (s) => !neutralPositions.some((n) => n.string === s.string && n.fret === s.fret)
  );
  const verify = () => {
    if (revealed) return;
    setRevealed(true);
    const result2 = checkQuizCompletion(stripNeutral(quizSelected), targetPositions);
    onComplete(result2);
  };
  useEffect6(() => {
    if (forceReveal && !revealed) verify();
  }, [forceReveal]);
  const result = revealed ? checkQuizCompletion(stripNeutral(quizSelected), targetPositions) : null;
  return /* @__PURE__ */ jsxs9("div", { style: { background: C.surface2, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsxs9("div", { style: { padding: "8px 14px 6px", borderBottom: `1px solid ${C.border}` }, children: [
      /* @__PURE__ */ jsx11("div", { style: { fontSize: 10, fontWeight: 700, color: C.amber, fontFamily: FONTS2.ui, letterSpacing: "0.1em", textTransform: "uppercase" }, children: "Manche interactif" }),
      question.hint && (revealed || showHint) && /* @__PURE__ */ jsx11("div", { style: { fontSize: 11, color: C.text3, marginTop: 2, fontFamily: FONTS2.ui }, children: question.hint }),
      question.hint && !revealed && !showHint && /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: () => setShowHint(true),
          style: {
            marginTop: 3,
            padding: 0,
            border: "none",
            background: "none",
            fontSize: 11,
            color: C.primary,
            fontWeight: 600,
            fontFamily: FONTS2.ui,
            cursor: "pointer",
            textDecoration: "underline"
          },
          children: "Afficher un indice"
        }
      )
    ] }),
    /* @__PURE__ */ jsx11("div", { style: { padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsx11(
      FretboardQuizCanvas,
      {
        targetPositions,
        contextPositions,
        selected: quizSelected,
        revealed,
        onCellClick: handleCellClick,
        compact: true,
        question
      }
    ) }),
    !answered && /* @__PURE__ */ jsxs9("div", { style: { padding: "6px 12px 10px", display: "flex", alignItems: "center", gap: 8 }, children: [
      /* @__PURE__ */ jsx11("div", { style: { flex: 1, fontSize: 11, color: C.text3, fontFamily: FONTS2.ui }, children: revealed ? `${result.found}/${result.total} correct${result.extras > 0 ? ` \xB7 ${result.extras} erreur${result.extras > 1 ? "s" : ""}` : ""}` : `${quizSelected.length} s\xE9lectionn\xE9${quizSelected.length > 1 ? "s" : ""}` }),
      !revealed && /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: verify,
          style: {
            padding: "7px 14px",
            borderRadius: 8,
            border: "none",
            background: quizSelected.length > 0 ? C.primary : C.surface2,
            color: quizSelected.length > 0 ? "#fff" : C.text3,
            fontSize: 11,
            fontWeight: 700,
            cursor: quizSelected.length > 0 ? "pointer" : "default",
            fontFamily: FONTS2.ui
          },
          children: "V\xE9rifier"
        }
      ),
      !revealed && /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: () => setQuizSelected([]),
          style: {
            padding: "7px 10px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: C.bg,
            color: C.text3,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: FONTS2.ui
          },
          children: "Reset"
        }
      )
    ] })
  ] });
}
function FretboardQuizCanvas({ targetPositions, contextPositions, selected, revealed, onCellClick, compact, question }) {
  const C = useC();
  const NOTE_COLORS = useMemo4(() => getNoteColors(C), [C]);
  const CW = TAP.fretW, CH = TAP.fret, OW = 34, LW = 26, DOT = 26;
  const strings = [1, 2, 3, 4, 5, 6];
  const MAX_F = 12;
  const SLABELS = { 6: "E\u2082", 5: "A\u2082", 4: "D\u2083", 3: "G\u2083", 2: "B\u2083", 1: "E\u2084" };
  const MARKERS = [3, 5, 7, 9];
  const targetMap = useMemo4(() => {
    const m = {};
    targetPositions.forEach((p) => {
      m[`${p.string}-${p.fret}`] = true;
    });
    return m;
  }, [targetPositions]);
  const contextMap = useMemo4(() => {
    const m = {};
    contextPositions.forEach((p) => {
      m[`${p.string}-${p.fret}`] = p;
    });
    return m;
  }, [contextPositions]);
  function renderDot(s, f) {
    const key = `${s}-${f}`;
    const isSelected = selected.some((p) => p.string === s && p.fret === f);
    const isTarget = targetMap[key];
    const ctx = contextMap[key];
    if (revealed) {
      if (isTarget && isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.correct, DOT);
      if (isTarget && !isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.missed, DOT);
      if (!isTarget && isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.wrong, DOT);
      if (ctx && !isTarget) {
        return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.other, DOT);
      }
      return null;
    }
    if (isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.selected, DOT);
    if (ctx && !isTarget) {
      return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.other, DOT);
    }
    return null;
  }
  function mkDot(lbl, col, sz) {
    return /* @__PURE__ */ jsx11("div", { style: {
      width: sz,
      height: sz,
      borderRadius: "50%",
      background: col.bg,
      border: `1.5px solid ${col.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 7,
      fontWeight: 700,
      color: col.text,
      fontFamily: FONTS2.ui,
      position: "relative",
      zIndex: 2,
      userSelect: "none"
    }, children: lbl });
  }
  const frets = Array.from({ length: MAX_F }, (_, i) => i + 1);
  return /* @__PURE__ */ jsxs9("div", { style: { display: "flex", flexDirection: "column", minWidth: "fit-content" }, children: [
    /* @__PURE__ */ jsxs9("div", { style: { display: "flex", marginBottom: 1 }, children: [
      /* @__PURE__ */ jsx11("div", { style: { width: LW, flexShrink: 0 } }),
      /* @__PURE__ */ jsx11("div", { style: { width: OW, flexShrink: 0 } }),
      frets.map((f) => /* @__PURE__ */ jsx11("div", { style: { width: CW, flexShrink: 0, textAlign: "center", fontSize: T.micro, color: C.text3, height: 16, lineHeight: "16px", fontFamily: FONTS2.ui, fontWeight: f === 12 ? 700 : 400 }, children: f }, f))
    ] }),
    strings.map((s) => /* @__PURE__ */ jsxs9("div", { style: { display: "flex", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx11("div", { style: { width: LW, flexShrink: 0, textAlign: "center", fontSize: T.micro, fontWeight: 700, color: C.text3, fontFamily: FONTS2.ui }, children: SLABELS[s] }),
      /* @__PURE__ */ jsxs9(
        "div",
        {
          onClick: () => {
            vibrer();
            onCellClick(s, 0);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              vibrer();
              onCellClick(s, 0);
            }
          },
          role: "button",
          tabIndex: 0,
          "aria-label": labelCase(s, 0, getNoteAtPosition(s, 0)),
          style: { width: OW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" },
          onMouseEnter: (e) => {
            if (!revealed) e.currentTarget.style.background = `${C.primary}0A`;
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          },
          children: [
            /* @__PURE__ */ jsx11("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: getStringThickness(s), background: C.border, transform: "translateY(-50%)" } }),
            /* @__PURE__ */ jsx11("div", { style: { position: "relative", zIndex: 2 }, children: renderDot(s, 0) })
          ]
        }
      ),
      frets.map((f, fi) => /* @__PURE__ */ jsxs9(
        "div",
        {
          onClick: () => {
            vibrer();
            onCellClick(s, f);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              vibrer();
              onCellClick(s, f);
            }
          },
          role: "button",
          tabIndex: 0,
          "aria-label": labelCase(s, f, getNoteAtPosition(s, f)),
          style: { width: CW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" },
          onMouseEnter: (e) => {
            if (!revealed) e.currentTarget.style.background = `${C.primary}0A`;
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          },
          children: [
            /* @__PURE__ */ jsx11("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: fi === 0 ? 2 : 0.5, background: fi === 0 ? C.text : C.border } }),
            /* @__PURE__ */ jsx11("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: getStringThickness(s), background: C.border, transform: "translateY(-50%)", zIndex: 0 } }),
            /* @__PURE__ */ jsx11("div", { style: { position: "relative", zIndex: 2 }, children: renderDot(s, f) })
          ]
        },
        f
      ))
    ] }, s)),
    /* @__PURE__ */ jsxs9("div", { style: { display: "flex", marginTop: 1 }, children: [
      /* @__PURE__ */ jsx11("div", { style: { width: LW, flexShrink: 0 } }),
      /* @__PURE__ */ jsx11("div", { style: { width: OW, flexShrink: 0 } }),
      frets.map((f) => /* @__PURE__ */ jsxs9("div", { style: { width: CW, flexShrink: 0 }, children: [
        MARKERS.includes(f) && /* @__PURE__ */ jsx11("div", { style: { width: 5, height: 5, borderRadius: "50%", background: C.border, margin: "2px auto 0" } }),
        f === 12 && /* @__PURE__ */ jsxs9("div", { style: { display: "flex", gap: 4, justifyContent: "center", marginTop: 2 }, children: [
          /* @__PURE__ */ jsx11("div", { style: { width: 5, height: 5, borderRadius: "50%", background: C.border } }),
          /* @__PURE__ */ jsx11("div", { style: { width: 5, height: 5, borderRadius: "50%", background: C.border } })
        ] })
      ] }, f))
    ] })
  ] });
}
function FretboardExercise({ ex, onComplete, dispatch }) {
  const C = useC();
  const [stageIdx, setStageIdx] = useState9(0);
  const [stageSelected, setStageSelected] = useState9([]);
  const [stageRevealed, setStageRevealed] = useState9(false);
  const [stageResult, setStageResult] = useState9(null);
  const [totalXp, setTotalXp] = useState9(0);
  const [completedStages, setCompletedStages] = useState9([]);
  const [allDone, setAllDone] = useState9(false);
  const stage = ex.stages[stageIdx];
  const isLast = stageIdx === ex.stages.length - 1;
  const targetPositions = useMemo4(() => {
    if (!stage) return [];
    return getTargetPositions(stage.concept, {
      fretRange: stage.fretRange || [0, 12],
      stringRange: stage.stringRange || [1, 6]
    });
  }, [stageIdx, ex.id]);
  const targetMap = useMemo4(() => {
    const m = {};
    targetPositions.forEach((p) => {
      m[`${p.string}-${p.fret}`] = p;
    });
    return m;
  }, [targetPositions]);
  const handleCellClick = useCallback2((string, fret) => {
    if (stageRevealed) return;
    const already = stageSelected.some((p) => p.string === string && p.fret === fret);
    setStageSelected(
      (prev) => already ? prev.filter((p) => !(p.string === string && p.fret === fret)) : [...prev, { string, fret }]
    );
  }, [stageRevealed, stageSelected]);
  const handleVerify = () => {
    const result = validate(
      stage.concept,
      stageSelected,
      stage.selectionRules || { mode: "all" },
      {
        fretRange: stage.fretRange || [0, 12],
        stringRange: stage.stringRange || [1, 6]
      }
    );
    setStageResult(result);
    setStageRevealed(true);
    if (result.complete) {
      const xp = stage.xp || 15;
      setTotalXp((prev) => prev + xp);
      dispatch?.({ type: "ADD_XP", amount: xp });
    }
  };
  const handleNext = () => {
    const updatedStages = [...completedStages, { stageIdx, result: stageResult }];
    setCompletedStages(updatedStages);
    if (isLast) {
      setAllDone(true);
      onComplete?.({ totalXp, stages: updatedStages });
    } else {
      setStageIdx((i) => i + 1);
      setStageSelected([]);
      setStageRevealed(false);
      setStageResult(null);
    }
  };
  const handleSkip = () => {
    const updatedStages = [...completedStages, { stageIdx, result: null, skipped: true }];
    setCompletedStages(updatedStages);
    if (isLast) {
      setAllDone(true);
      onComplete?.({ totalXp, stages: updatedStages });
    } else {
      setStageIdx((i) => i + 1);
      setStageSelected([]);
      setStageRevealed(false);
      setStageResult(null);
    }
  };
  if (allDone) {
    return /* @__PURE__ */ jsxs9("div", { style: { textAlign: "center", padding: "24px 16px", background: C.greenL, borderRadius: 14, border: `1px solid ${C.border}` }, children: [
      /* @__PURE__ */ jsx11(Ti, { name: "trophy", size: 32, color: C.green, style: { marginBottom: 8 } }),
      /* @__PURE__ */ jsx11("div", { style: { fontSize: 18, fontWeight: 700, color: C.greenD, fontFamily: FONTS2.ui }, children: "Exercice termin\xE9 !" }),
      /* @__PURE__ */ jsxs9("div", { style: { fontSize: 13, color: C.green, marginTop: 4, fontFamily: FONTS2.ui }, children: [
        "+",
        totalXp,
        " XP gagn\xE9s"
      ] }),
      /* @__PURE__ */ jsxs9("div", { style: { fontSize: 12, color: C.text3, marginTop: 8, fontFamily: FONTS2.ui }, children: [
        completedStages.filter((s) => s.result?.complete).length,
        "/",
        ex.stages.length,
        " stages r\xE9ussis"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs9("div", { style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
    /* @__PURE__ */ jsx11("div", { style: { display: "flex", gap: 4 }, children: ex.stages.map((_, i) => /* @__PURE__ */ jsx11("div", { style: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      background: i < stageIdx ? C.green : i === stageIdx ? C.primary : C.border,
      transition: "background 0.3s"
    } }, i)) }),
    /* @__PURE__ */ jsxs9("div", { style: { background: C.surface2, borderRadius: 12, border: `1px solid ${C.border}`, padding: "10px 14px" }, children: [
      /* @__PURE__ */ jsxs9("div", { style: { fontSize: 10, fontWeight: 700, color: C.amber, fontFamily: FONTS2.ui, letterSpacing: "0.08em", textTransform: "uppercase" }, children: [
        "\u{1F3B8} \xC9tape ",
        stageIdx + 1,
        " / ",
        ex.stages.length
      ] }),
      /* @__PURE__ */ jsx11("div", { style: { fontSize: 14, fontWeight: 600, color: C.text, fontFamily: FONTS2.ui, marginTop: 4, lineHeight: 1.4 }, children: stage.instruction }),
      stage.hint && !stageRevealed && /* @__PURE__ */ jsxs9("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS2.ui, marginTop: 4, fontStyle: "italic" }, children: [
        "\u{1F4A1} ",
        stage.hint
      ] }),
      /* @__PURE__ */ jsxs9("div", { style: { fontSize: 11, color: C.primary, fontFamily: FONTS2.ui, marginTop: 4, fontWeight: 600 }, children: [
        "+",
        stage.xp || 15,
        " XP"
      ] })
    ] }),
    /* @__PURE__ */ jsx11("div", { style: { background: C.surface2, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }, children: /* @__PURE__ */ jsx11("div", { style: { padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsx11(
      ExerciseCanvas,
      {
        stage,
        targetPositions,
        targetMap,
        selected: stageSelected,
        revealed: stageRevealed,
        onCellClick: handleCellClick
      }
    ) }) }),
    stageRevealed && stageResult && /* @__PURE__ */ jsxs9("div", { style: {
      padding: "10px 14px",
      borderRadius: 10,
      background: stageResult.complete ? C.greenL : C.amberL,
      border: `1px solid ${stageResult.complete ? C.border : C.border}`,
      fontSize: 12,
      color: stageResult.complete ? C.greenD : C.amberD,
      fontFamily: FONTS2.ui,
      lineHeight: 1.5
    }, children: [
      stageResult.feedback,
      stage.exp && /* @__PURE__ */ jsx11("div", { style: { marginTop: 4, opacity: 0.85 }, children: stage.exp })
    ] }),
    /* @__PURE__ */ jsx11("div", { style: { display: "flex", gap: 8 }, children: !stageRevealed ? /* @__PURE__ */ jsxs9(Fragment7, { children: [
      /* @__PURE__ */ jsxs9(
        "button",
        {
          onClick: handleVerify,
          disabled: stageSelected.length === 0,
          style: {
            flex: 1,
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: stageSelected.length > 0 ? C.primary : C.surface2,
            color: stageSelected.length > 0 ? "#fff" : C.text3,
            fontSize: 13,
            fontWeight: 700,
            cursor: stageSelected.length > 0 ? "pointer" : "default",
            fontFamily: FONTS2.ui
          },
          children: [
            "V\xE9rifier \xB7 ",
            stageSelected.length,
            " s\xE9lectionn\xE9",
            stageSelected.length > 1 ? "s" : ""
          ]
        }
      ),
      /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: () => setStageSelected([]),
          style: {
            padding: "12px 14px",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: C.bg,
            color: C.text3,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: FONTS2.ui
          },
          children: "Reset"
        }
      ),
      /* @__PURE__ */ jsx11(
        "button",
        {
          onClick: handleSkip,
          style: {
            padding: "12px 14px",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: C.bg,
            color: C.text3,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: FONTS2.ui
          },
          children: "Passer"
        }
      )
    ] }) : /* @__PURE__ */ jsx11(
      "button",
      {
        onClick: handleNext,
        style: {
          flex: 1,
          padding: "12px",
          borderRadius: 10,
          border: "none",
          background: C.primary,
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: FONTS2.ui
        },
        children: isLast ? "Terminer l'exercice" : "\xC9tape suivante \u2192"
      }
    ) })
  ] });
}
function ExerciseCanvas({ stage, targetPositions, targetMap, selected, revealed, onCellClick }) {
  const C = useC();
  const NOTE_COLORS = useMemo4(() => getNoteColors(C), [C]);
  const CW = TAP.fretW, CH = TAP.fret, OW = 34, LW = 26, DOT = 26;
  const strings = [1, 2, 3, 4, 5, 6];
  const MAX_F = (stage.fretRange || [0, 12])[1];
  const MIN_F = (stage.fretRange || [0, 12])[0];
  const SLABELS = { 6: "E\u2082", 5: "A\u2082", 4: "D\u2083", 3: "G\u2083", 2: "B\u2083", 1: "E\u2084" };
  const MARKERS = [3, 5, 7, 9];
  const contextPositions = useMemo4(() => {
    if (!stage.display?.showContext) return [];
    const ctx = stage.display.showContext;
    return getTargetPositions(ctx, {
      fretRange: stage.fretRange || [0, 12],
      stringRange: stage.stringRange || [1, 6]
    });
  }, [stage]);
  const contextMap = useMemo4(() => {
    const m = {};
    contextPositions.forEach((p) => {
      m[`${p.string}-${p.fret}`] = p;
    });
    return m;
  }, [contextPositions]);
  function getStringThicknessLocal(s) {
    return [null, 1, 1.5, 2, 2.5, 2.5, 3][s] || 1.5;
  }
  function renderDot(s, f) {
    const key = `${s}-${f}`;
    const note = getNoteAtPosition(s, f);
    const isSelected = selected.some((p) => p.string === s && p.fret === f);
    const isTarget = !!targetMap[key];
    const isContext = !!contextMap[key];
    const { showNotes, showIntervals, showDegrees } = stage.display || {};
    const getLabel = (pos) => {
      if (showNotes) return noteToFr(note);
      if (showIntervals && pos?.interval != null) return INTERVAL_NAMES[pos.interval]?.short ?? "";
      if (showDegrees && pos?.degree) return String(pos.degree);
      return noteToFr(note);
    };
    if (revealed) {
      const tPos = targetMap[key];
      if (isTarget && isSelected) return mkDot(getLabel(tPos), NOTE_COLORS.correct, DOT);
      if (isTarget && !isSelected) return mkDot(getLabel(tPos), NOTE_COLORS.missed, DOT);
      if (!isTarget && isSelected) return mkDot(noteToFr(note), NOTE_COLORS.wrong, DOT);
      if (isContext) return mkDot(getLabel(contextMap[key]), NOTE_COLORS.other, DOT, 0.4);
      return null;
    }
    if (isSelected) return mkDot(noteToFr(note), NOTE_COLORS.selected, DOT);
    if (isContext && !isTarget) return mkDot(getLabel(contextMap[key]), NOTE_COLORS.other, DOT, 0.5);
    if (showNotes) {
      return mkDot(noteToFr(note), { bg: C.surface2, text: C.text3, border: C.border }, DOT);
    }
    return null;
  }
  function mkDot(lbl, col, sz, opacity = 1) {
    return /* @__PURE__ */ jsx11("div", { style: {
      width: sz,
      height: sz,
      borderRadius: "50%",
      background: col.bg,
      border: `1.5px solid ${col.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 7,
      fontWeight: 700,
      color: col.text,
      fontFamily: FONTS2.ui,
      position: "relative",
      zIndex: 2,
      userSelect: "none",
      opacity
    }, children: lbl });
  }
  const frets = Array.from({ length: MAX_F - MIN_F }, (_, i) => MIN_F + i + 1);
  return /* @__PURE__ */ jsxs9("div", { style: { display: "flex", flexDirection: "column", minWidth: "fit-content" }, children: [
    /* @__PURE__ */ jsxs9("div", { style: { display: "flex", marginBottom: 1 }, children: [
      /* @__PURE__ */ jsx11("div", { style: { width: LW, flexShrink: 0 } }),
      /* @__PURE__ */ jsx11("div", { style: { width: OW, flexShrink: 0 } }),
      frets.map((f) => /* @__PURE__ */ jsx11("div", { style: { width: CW, flexShrink: 0, textAlign: "center", fontSize: T.micro, color: C.text3, height: 16, lineHeight: "16px", fontFamily: FONTS2.ui, fontWeight: f === 12 ? 700 : 400 }, children: f }, f))
    ] }),
    strings.map((s) => /* @__PURE__ */ jsxs9("div", { style: { display: "flex", alignItems: "center" }, children: [
      /* @__PURE__ */ jsx11("div", { style: { width: LW, flexShrink: 0, textAlign: "center", fontSize: T.micro, fontWeight: 700, color: C.text3, fontFamily: FONTS2.ui }, children: SLABELS[s] }),
      MIN_F === 0 && /* @__PURE__ */ jsxs9(
        "div",
        {
          onClick: () => {
            vibrer();
            onCellClick(s, 0);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              vibrer();
              onCellClick(s, 0);
            }
          },
          role: "button",
          tabIndex: 0,
          "aria-label": labelCase(s, 0, getNoteAtPosition(s, 0)),
          style: { width: OW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" },
          onMouseEnter: (e) => {
            if (!revealed) e.currentTarget.style.background = `${C.primary}0A`;
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          },
          children: [
            /* @__PURE__ */ jsx11("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: getStringThicknessLocal(s), background: C.border, transform: "translateY(-50%)" } }),
            /* @__PURE__ */ jsx11("div", { style: { position: "relative", zIndex: 2 }, children: renderDot(s, 0) })
          ]
        }
      ),
      frets.map((f, fi) => /* @__PURE__ */ jsxs9(
        "div",
        {
          onClick: () => {
            vibrer();
            onCellClick(s, f);
          },
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              vibrer();
              onCellClick(s, f);
            }
          },
          role: "button",
          tabIndex: 0,
          "aria-label": labelCase(s, f, getNoteAtPosition(s, f)),
          style: { width: CW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" },
          onMouseEnter: (e) => {
            if (!revealed) e.currentTarget.style.background = `${C.primary}0A`;
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          },
          children: [
            /* @__PURE__ */ jsx11("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: MIN_F === 0 && fi === 0 || fi === 0 ? 2 : 0.5, background: fi === 0 ? C.text : C.border } }),
            /* @__PURE__ */ jsx11("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", height: getStringThicknessLocal(s), background: C.border, transform: "translateY(-50%)", zIndex: 0 } }),
            /* @__PURE__ */ jsx11("div", { style: { position: "relative", zIndex: 2 }, children: renderDot(s, f) })
          ]
        },
        f
      ))
    ] }, s)),
    /* @__PURE__ */ jsxs9("div", { style: { display: "flex", marginTop: 1 }, children: [
      /* @__PURE__ */ jsx11("div", { style: { width: LW, flexShrink: 0 } }),
      MIN_F === 0 && /* @__PURE__ */ jsx11("div", { style: { width: OW, flexShrink: 0 } }),
      frets.map((f) => /* @__PURE__ */ jsxs9("div", { style: { width: CW, flexShrink: 0 }, children: [
        MARKERS.includes(f) && /* @__PURE__ */ jsx11("div", { style: { width: 5, height: 5, borderRadius: "50%", background: C.border, margin: "2px auto 0" } }),
        f === 12 && /* @__PURE__ */ jsxs9("div", { style: { display: "flex", gap: 4, justifyContent: "center", marginTop: 2 }, children: [
          /* @__PURE__ */ jsx11("div", { style: { width: 5, height: 5, borderRadius: "50%", background: C.border } }),
          /* @__PURE__ */ jsx11("div", { style: { width: 5, height: 5, borderRadius: "50%", background: C.border } })
        ] })
      ] }, f))
    ] })
  ] });
}

// src/music/walkingBass.js
var CHROMATIC3 = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var midiOf2 = (name, oct) => CHROMATIC3.indexOf(name) + 12 * (oct + 1);
var nameOfMidi = (m) => CHROMATIC3[(m % 12 + 12) % 12];
var octOfMidi = (m) => Math.floor(m / 12) - 1;
var CHORD_TONES = {
  maj: [0, 4, 7],
  min: [0, 3, 7],
  dom7: [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  min7b5: [0, 3, 6, 10],
  dim7: [0, 3, 6, 9]
};
var BASS_LOW = 28;
var BASS_HIGH = 48;
function clampToBass(midi) {
  while (midi < BASS_LOW) midi += 12;
  while (midi > BASS_HIGH) midi -= 12;
  return midi;
}
function approachNote(targetMidi, style, rng) {
  const r = rng();
  if (style === "blues") {
    return r < 0.7 ? targetMidi - 1 : targetMidi + 1;
  }
  if (r < 0.45) return targetMidi - 1;
  if (r < 0.7) return targetMidi + 1;
  return targetMidi - 5;
}
function generateWalkingBar(opts) {
  const {
    rootName,
    quality = "dom7",
    nextRoot = rootName,
    style = "jazz",
    barIndex = 0,
    energy = 3,
    rng = Math.random
  } = opts;
  const tones = CHORD_TONES[quality] || CHORD_TONES.dom7;
  const rootIdx = CHROMATIC3.indexOf(rootName);
  if (rootIdx < 0) return [];
  const rootMidi = clampToBass(midiOf2(rootName, 1));
  const nextRootMidi = clampToBass(midiOf2(nextRoot, 1));
  const ascending = barIndex % 2 === 0 ? rng() < 0.7 : rng() < 0.3;
  const notes = [];
  let first = rootMidi;
  if (rng() < 0.12 && energy >= 3) {
    first = clampToBass(rootMidi + 7);
  }
  notes.push({ beat: 0, midi: first, dur: "4n", velocity: 0.82 });
  const available = tones.map((t) => clampToBass(rootMidi + t)).filter((m) => m !== first);
  const sorted = [...new Set(available)].sort((a, b) => ascending ? a - b : b - a);
  const pick2 = sorted[Math.floor(rng() * Math.min(2, sorted.length))] ?? clampToBass(rootMidi + 7);
  notes.push({ beat: 1, midi: pick2, dur: "4n", velocity: 0.74 });
  const rest = sorted.filter((m) => m !== pick2);
  const pick3 = rest[Math.floor(rng() * Math.min(2, rest.length))] ?? clampToBass(rootMidi + 10);
  notes.push({ beat: 2, midi: pick3, dur: "4n", velocity: 0.78 });
  const approach = clampToBass(approachNote(nextRootMidi, style, rng));
  notes.push({ beat: 3, midi: approach, dur: "4n", velocity: 0.8, approach: true });
  if (energy >= 3 && rng() < 0.18 + energy * 0.04) {
    const between = Math.floor(rng() * 3);
    const from = notes[between].midi, to = notes[between + 1].midi;
    if (Math.abs(to - from) > 2) {
      const passing = from + Math.sign(to - from) * (Math.abs(to - from) > 3 ? 2 : 1);
      notes.push({
        beat: between + 0.5,
        midi: clampToBass(passing),
        dur: "8n",
        velocity: 0.55,
        passing: true
      });
    }
  }
  if (energy >= 4 && rng() < 0.15) {
    notes.push({ beat: 3.5, midi: clampToBass(rootMidi - 12), dur: "16n", velocity: 0.22, ghost: true });
  }
  notes.sort((a, b) => a.beat - b.beat);
  return notes;
}
function toToneNote2(midi) {
  const SHARP_TO_FLAT2 = { "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb" };
  const n = nameOfMidi(midi);
  return `${SHARP_TO_FLAT2[n] || n}${octOfMidi(midi)}`;
}
function toToneTime(beat) {
  const whole = Math.floor(beat);
  const sixteenths = Math.round((beat - whole) * 4);
  return `0:${whole}:${sixteenths}`;
}

// src/music/compRhythm.js
var COMP_PATTERNS = {
  jazz: [
    { id: "charleston", weight: 0.28, hits: [
      { beat: 0, dur: "8n", vel: 0.72 },
      { beat: 1.5, dur: "4n", vel: 0.62 }
    ] },
    { id: "anticipe", weight: 0.24, hits: [
      { beat: 0, dur: "4n", vel: 0.7 },
      { beat: 2, dur: "8n", vel: 0.58 },
      { beat: 3.5, dur: "8n", vel: 0.66, anticipate: true }
    ] },
    { id: "sparse", weight: 0.2, hits: [
      { beat: 1, dur: "4n", vel: 0.6 },
      { beat: 3, dur: "4n", vel: 0.64 }
    ] },
    { id: "deuxquatre", weight: 0.16, hits: [
      { beat: 1, dur: "8n", vel: 0.66 },
      { beat: 2.5, dur: "8n", vel: 0.55 },
      { beat: 3, dur: "4n", vel: 0.62 }
    ] },
    { id: "respire", weight: 0.12, hits: [
      { beat: 0, dur: "2n", vel: 0.66 }
    ] }
  ],
  blues: [
    { id: "shuffle-stab", weight: 0.3, hits: [
      { beat: 0, dur: "8n", vel: 0.7 },
      { beat: 1, dur: "8n", vel: 0.58 },
      { beat: 2, dur: "8n", vel: 0.66 },
      { beat: 3, dur: "8n", vel: 0.58 }
    ] },
    { id: "backbeat", weight: 0.26, hits: [
      { beat: 1, dur: "4n", vel: 0.7 },
      { beat: 3, dur: "4n", vel: 0.7 }
    ] },
    { id: "charleston", weight: 0.22, hits: [
      { beat: 0, dur: "8n", vel: 0.72 },
      { beat: 1.5, dur: "4n", vel: 0.6 }
    ] },
    { id: "anticipe", weight: 0.14, hits: [
      { beat: 0, dur: "4n", vel: 0.68 },
      { beat: 2, dur: "8n", vel: 0.56 },
      { beat: 3.5, dur: "8n", vel: 0.64, anticipate: true }
    ] },
    { id: "respire", weight: 0.08, hits: [
      { beat: 0, dur: "2n", vel: 0.64 }
    ] }
  ]
};
function weightedPick(items, exclude, rng) {
  const pool = items.filter((i) => i.id !== exclude);
  const list = pool.length ? pool : items;
  const total = list.reduce((s, i) => s + i.weight, 0);
  let r = rng() * total;
  for (const i of list) {
    r -= i.weight;
    if (r <= 0) return i;
  }
  return list[list.length - 1];
}
function createComper(style = "jazz", rng = Math.random) {
  const vocab = COMP_PATTERNS[style] || COMP_PATTERNS.jazz;
  let lastId = null;
  let barsSinceBreath = 0;
  return {
    /**
     * Rythme d'accompagnement pour une mesure.
     * @param barIndex  index de mesure (les phrases font 4 mesures)
     * @param energy    1..5 — densité
     * @returns [{ beat, dur, velocity, anticipate }]
     */
    nextBar(barIndex, energy = 3) {
      barsSinceBreath++;
      const forceBreath = barsSinceBreath >= 8;
      let pattern;
      if (forceBreath) {
        pattern = vocab.find((p) => p.id === "respire") || vocab[vocab.length - 1];
      } else {
        const dense = vocab.filter((p) => p.id !== "respire");
        pattern = weightedPick(dense, lastId, rng);
      }
      if (pattern.id === "respire") barsSinceBreath = 0;
      lastId = pattern.id;
      const threshold = energy <= 2 ? 0.6 : 0;
      const hits = pattern.hits.filter((h) => h.vel >= threshold);
      return hits.map((h) => ({
        beat: h.beat,
        dur: h.dur,
        // Dynamique : facteur d'énergie + variation humaine légère.
        velocity: Math.max(0.15, Math.min(
          1,
          h.vel * (0.72 + energy * 0.07) + (rng() - 0.5) * 0.07
        )),
        anticipate: !!h.anticipate
      }));
    },
    reset() {
      lastId = null;
      barsSinceBreath = 0;
    }
  };
}
function beatToToneTime(beat) {
  const whole = Math.floor(beat);
  const sixteenths = Math.round((beat - whole) * 4);
  return `0:${whole}:${sixteenths}`;
}

// src/screens/JamSession.jsx
init_tone_stub();
import { Fragment as Fragment8, jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
function shade2(hex, amount) {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + amount, g = (num >> 8 & 255) + amount, b = (num & 255) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + (r << 16 | g << 8 | b).toString(16).padStart(6, "0");
}
var makeContexts = (C) => [
  {
    id: "blues_minor",
    label: "Blues mineur",
    color: C.amber,
    colorL: C.amberL,
    colorD: C.amberD,
    colorB: C.amberBorder,
    scale: "pentatonic_minor",
    desc: "Le terrain de jeu du rock et du blues. La pentatonique mineure sonne sur tout.",
    targetDesc: "Fondamentale, tierce mineure, quinte",
    bpm: 80,
    // Vraie grille de blues mineur, pas un accord en boucle : le IVm et le
    // V7 sont ce qui donne des points de résolution à travailler.
    chords: [
      { degree: 0, quality: "min7", bars: 4 },
      { degree: 5, quality: "min7", bars: 2 },
      { degree: 0, quality: "min7", bars: 2 },
      { degree: 7, quality: "dom7", bars: 2 },
      { degree: 0, quality: "min7", bars: 2 }
    ]
  },
  {
    id: "blues_12",
    label: "Blues 12 mesures",
    color: C.primary,
    colorL: C.primaryL,
    colorD: C.primaryD,
    colorB: C.primaryBorder,
    scale: "blues",
    desc: "La note bleue (b5) est ta couleur signature.",
    targetDesc: "Fondamentale, tierce mineure, note bleue",
    bpm: 80,
    // Progression blues 12 mesures : I7-I7-I7-I7-IV7-IV7-I7-I7-V7-IV7-I7-V7
    chords: [
      { degree: 0, quality: "dom7", bars: 4 },
      { degree: 5, quality: "dom7", bars: 2 },
      { degree: 0, quality: "dom7", bars: 2 },
      { degree: 7, quality: "dom7", bars: 1 },
      { degree: 5, quality: "dom7", bars: 1 },
      { degree: 0, quality: "dom7", bars: 1 },
      { degree: 7, quality: "dom7", bars: 1 }
    ]
  },
  {
    id: "jazz_251",
    label: "Jazz ii-V-I",
    color: C.green,
    colorL: C.greenL,
    colorD: C.greenD,
    colorB: C.greenBorder,
    scale: "major",
    desc: "Cible les guide tones (3e et 7e) de chaque accord sur les temps forts.",
    targetDesc: "3e (couleur), 7e majeure ou mineure (tension)",
    bpm: 120,
    // ii-V-I : Dm7 (2 bars) - G7 (2 bars) - Cmaj7 (4 bars)
    chords: [
      { degree: 2, quality: "min7", bars: 2 },
      { degree: 7, quality: "dom7", bars: 2 },
      { degree: 0, quality: "maj7", bars: 4 }
    ]
  },
  {
    id: "modal_dorian",
    label: "Modal Dorien",
    color: "#185FA5",
    colorL: "#E6F1FB",
    colorD: "#042C53",
    colorB: "#A0BFE0",
    scale: "dorian",
    desc: "La 6te majeure est ta note caracteristique. Evite de resoudre trop tot.",
    targetDesc: "Fondamentale, 6te majeure (couleur dorien), tierce mineure",
    bpm: 90,
    // Im7 - IV7 : c'est ce va-et-vient qui FAIT entendre le dorien.
    // Un Im7 seul en boucle ne révèle rien — la 6te majeure, qui est la
    // note caractéristique du mode, ne s'entend que par contraste avec le
    // IV majeur. Un seul accord ne donne rien à travailler.
    chords: [
      { degree: 0, quality: "min7", bars: 2 },
      { degree: 5, quality: "dom7", bars: 2 }
    ]
  },
  {
    id: "modal_mixo",
    label: "Modal Mixolydien",
    color: C.coral,
    colorL: C.coralL,
    colorD: C.coralD,
    colorB: C.coralBorder,
    scale: "mixolydian",
    desc: "Son rock/funk. La b7 naturelle donne la couleur dominante.",
    targetDesc: "Fondamentale, tierce majeure, 7e mineure (couleur)",
    bpm: 100,
    // I7 - bVII : la cadence qui signe le mixolydien. Le bVII majeur est ce
    // qui distingue le mode d'un simple accord de dominante tenu.
    chords: [
      { degree: 0, quality: "dom7", bars: 2 },
      { degree: 10, quality: "maj", bars: 2 }
    ]
  }
];
var ROOTS_FR = [
  { en: "A", fr: "La" },
  { en: "B", fr: "Si" },
  { en: "C", fr: "Do" },
  { en: "D", fr: "Re" },
  { en: "E", fr: "Mi" },
  { en: "F", fr: "Fa" },
  { en: "G", fr: "Sol" },
  { en: "C#", fr: "Do#" },
  { en: "D#", fr: "Re#" },
  { en: "F#", fr: "Fa#" },
  { en: "G#", fr: "Sol#" },
  { en: "A#", fr: "La#" }
];
var CHROMATIC4 = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function transposeNote(root, semitones) {
  const idx = CHROMATIC4.indexOf(root);
  return CHROMATIC4[(idx + semitones) % 12];
}
var CONSTRAINTS = [
  { text: "Joue UNIQUEMENT des notes longues. Zero doubles-croches.", level: "Facile" },
  { text: "Chaque phrase doit finir sur une note de l'accord (chord tone).", level: "Facile" },
  { text: "Maximum 4 notes par phrase. Silence entre chaque phrase.", level: "Facile" },
  { text: "Joue une phrase de 2 mesures, silence 2 mesures. Call & response.", level: "Facile" },
  { text: "Reste dans les 3 premieres cordes (aigues) uniquement.", level: "Moyen" },
  { text: "Commence chaque phrase sur un temps fort (temps 1 ou 3).", level: "Moyen" },
  { text: "Utilise le silence pendant au moins 50% du temps.", level: "Moyen" },
  { text: "Monte progressivement en intensite pendant 2 minutes, puis redescends.", level: "Moyen" },
  { text: "Chaque phrase doit contenir exactement une note chromatique (hors gamme).", level: "Difficile" },
  { text: "Cible uniquement les guide tones (3e et 7e) sur les temps 1 et 3.", level: "Difficile" },
  { text: "Construis un solo en 3 actes : calme (1 min) -> montee (2 min) -> climax (30s).", level: "Difficile" },
  { text: "Joue les yeux fermes. Sens le manche, ne le regarde pas.", level: "Difficile" }
];
var makeLevelColor = (C) => ({ "Facile": C.green, "Moyen": C.amber, "Difficile": C.coral });
function BackingTrackPlayer({ context: context2, root, bpm }) {
  const C = useC();
  const [playing, setPlaying] = useState10(false);
  const [beat, setBeat] = useState10(0);
  const [currentChord, setCurrentChord] = useState10(0);
  const [loading, setLoading] = useState10(false);
  const [playError, setPlayError] = useState10(null);
  const samplerRef = useRef6(null);
  const bassRef = useRef6(null);
  const kickRef = useRef6(null);
  const snareRef = useRef6(null);
  const hihatRef = useRef6(null);
  const seqRef = useRef6(null);
  const beatSeqRef = useRef6(null);
  const bassFilterRef = useRef6(null);
  const bassCompRef = useRef6(null);
  const kickCompRef = useRef6(null);
  const snareFilterRef = useRef6(null);
  const comperRef = useRef6(null);
  const drumsRef = useRef6(null);
  const drumsLoadedRef = useRef6(false);
  const drumRRRef = useRef6({});
  const reverbRef = useRef6(null);
  const delayRef = useRef6(null);
  const compRef = useRef6(null);
  useEffect7(() => {
    if (playing) stopBacking();
  }, [context2.id, root]);
  useEffect7(() => () => stopBacking(), []);
  const VOICINGS = {
    // Voicing jazz : root basse, 3e, 5e, 7e en ordre montant
    min7: { intervals: [0, 10, 15, 19], desc: "x-R-b7-3-5" },
    maj7: { intervals: [0, 11, 16, 19], desc: "x-R-7-3-5" },
    dom7: { intervals: [0, 10, 16, 19], desc: "x-R-b7-3-5" },
    // Pour le blues : accords ouverts plus puissants
    dom7b: { intervals: [0, 7, 10, 16], desc: "R-5-b7-3" }
  };
  function getVoicedChord(rootNote, quality, style = "jazz") {
    const iBlues = style === "blues" || style === "blues12";
    const voicing = iBlues && quality === "dom7" ? VOICINGS.dom7b : VOICINGS[quality] || VOICINGS.min7;
    const rootIdx = CHROMATIC4.indexOf(rootNote);
    if (rootIdx < 0) return [];
    const rootless = voicing.intervals.filter((i) => i % 12 !== 0);
    const degrees = rootless.length ? rootless : voicing.intervals;
    const COMP_MIN_MIDI = 52;
    const lowestDegree = Math.min(...degrees);
    let base = 36 + rootIdx;
    while (base + lowestDegree < COMP_MIN_MIDI) base += 12;
    while (base + lowestDegree >= COMP_MIN_MIDI + 12) base -= 12;
    const SHARP_TO_FLAT2 = { "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb" };
    return degrees.map((interval) => {
      const midi = base + interval;
      const name = CHROMATIC4[(midi % 12 + 12) % 12];
      const oct = Math.floor(midi / 12) - 1;
      return `${SHARP_TO_FLAT2[name] || name}${oct}`;
    });
  }
  function getBassPattern(rootNote, quality, style, nextRoot, barIdx) {
    const bluesy = style === "blues" || style === "blues12";
    const notes = generateWalkingBar({
      rootName: normalizeNote(rootNote),
      quality: quality || "dom7",
      nextRoot: normalizeNote(nextRoot || rootNote),
      style: bluesy ? "blues" : "jazz",
      barIndex: barIdx || 0,
      energy: 3
    });
    return notes.map((n) => ({
      note: toToneNote2(n.midi),
      time: toToneTime(n.beat),
      dur: n.dur,
      velocity: n.velocity
    }));
  }
  function getDrumPattern(style) {
    if (style === "blues" || style === "blues12") {
      return {
        kick: ["0:0:0", "0:2:0"],
        snare: ["0:1:0", "0:3:0"],
        hihat: ["0:0:0", "0:0:2", "0:1:0", "0:1:2", "0:2:0", "0:2:2", "0:3:0", "0:3:2"],
        shuffle: true
      };
    }
    if (style === "jazz") {
      return {
        kick: ["0:0:0", "0:2:2"],
        snare: ["0:1:0", "0:3:0"],
        hihat: ["0:0:0", "0:0:3", "0:1:2", "0:2:0", "0:2:3", "0:3:2"],
        shuffle: false
      };
    }
    if (style === "funk") {
      return {
        kick: ["0:0:0", "0:0:3", "0:2:0", "0:2:2"],
        snare: ["0:1:0", "0:3:0", "0:3:2"],
        hihat: ["0:0:0", "0:0:1", "0:0:2", "0:0:3", "0:1:0", "0:1:1", "0:1:2", "0:1:3", "0:2:0", "0:2:1", "0:2:2", "0:2:3", "0:3:0", "0:3:1", "0:3:2", "0:3:3"],
        shuffle: false
      };
    }
    return {
      kick: ["0:0:0", "0:0:2", "0:2:0"],
      snare: ["0:1:0", "0:3:0"],
      hihat: ["0:0:0", "0:0:2", "0:1:0", "0:1:2", "0:2:0", "0:2:2", "0:3:0", "0:3:2"],
      shuffle: false
    };
  }
  function getStyle(contextId) {
    const map = {
      blues_minor: "blues",
      blues_12: "blues12",
      jazz_251: "jazz",
      modal_dorian: "funk",
      modal_mixo: "rock"
    };
    return map[contextId] || "rock";
  }
  function playDrum(type, time, velocity = 0.8) {
    const COUNTS = { kick: 3, snare: 2, hihat: 3, hihatOpen: 2, ride: 2, crash: 2, tomLow: 1, tomMid: 1 };
    if (drumsLoadedRef.current && drumsRef.current) {
      const n = COUNTS[type] || 1;
      let idx = Math.min(n - 1, Math.floor(velocity * n));
      const last = drumRRRef.current[type];
      if (n > 1 && idx === last) idx = (idx + 1) % n;
      drumRRRef.current[type] = idx;
      try {
        const player = drumsRef.current.player(`${type}${idx}`);
        player.volume.value = -6 + (velocity - 0.8) * 12;
        player.start(time);
      } catch {
      }
      return;
    }
    if (type === "kick") kickRef.current?.triggerAttackRelease("C1", "8n", time);
    if (type === "snare") snareRef.current?.triggerAttackRelease("8n", time);
    if (type === "hihat") hihatRef.current?.triggerAttackRelease("32n", time);
  }
  async function startBacking() {
    setLoading(true);
    setPlayError(null);
    try {
      await start();
      await getContext().resume();
      getTransport().bpm.value = bpm;
      getTransport().cancel();
      compRef.current = new Compressor({
        threshold: -18,
        ratio: 4,
        attack: 3e-3,
        release: 0.25
      }).toDestination();
      reverbRef.current = new Reverb({
        decay: context2.id === "jazz_251" ? 2.5 : 1.8,
        wet: context2.id === "jazz_251" ? 0.18 : 0.12,
        preDelay: 0.02
      });
      await reverbRef.current.generate();
      reverbRef.current.connect(compRef.current);
      if (context2.id === "jazz_251") {
        delayRef.current = new FeedbackDelay({
          delayTime: "8n.",
          feedback: 0.15,
          wet: 0.08
        });
        delayRef.current.connect(reverbRef.current);
      }
      const masterOut = delayRef.current || reverbRef.current;
      const SAMPLE_URLS_LOCAL = {
        "A2": "A2.mp3",
        "A3": "A3.mp3",
        "A4": "A4.mp3",
        "B2": "B2.mp3",
        "B3": "B3.mp3",
        "B4": "B4.mp3",
        "C3": "C3.mp3",
        "C4": "C4.mp3",
        "D3": "D3.mp3",
        "D4": "D4.mp3",
        "E2": "E2.mp3",
        "E3": "E3.mp3",
        "E4": "E4.mp3",
        "F3": "F3.mp3",
        "F4": "F4.mp3",
        "G3": "G3.mp3",
        "G4": "G4.mp3",
        "Ab2": "Ab2.mp3",
        "Ab3": "Ab3.mp3",
        "Ab4": "Ab4.mp3",
        "Bb2": "Bb2.mp3",
        "Bb3": "Bb3.mp3",
        "Bb4": "Bb4.mp3",
        "Db3": "Db3.mp3",
        "Db4": "Db4.mp3",
        "Eb3": "Eb3.mp3",
        "Eb4": "Eb4.mp3",
        "Gb3": "Gb3.mp3",
        "Gb4": "Gb4.mp3"
      };
      const RHODES_SAMPLES = {
        "C2": "C2.mp3",
        "Gb2": "Gb2.mp3",
        "A2": "A2.mp3",
        "Eb3": "Eb3.mp3",
        "A3": "A3.mp3",
        "C4": "C4.mp3",
        "Gb4": "Gb4.mp3",
        "C5": "C5.mp3"
      };
      try {
        samplerRef.current = await new Promise((resolve, reject) => {
          const s = new Sampler({
            urls: RHODES_SAMPLES,
            baseUrl: "/audio/piano/",
            release: 1.4,
            // L'accompagnement se tient DERRIÈRE. Il pose l'harmonie et le rythme,
            // il ne doit jamais attirer l'oreille : c'est le guitariste le soliste.
            volume: context2.id === "jazz_251" ? -22 : -25,
            onload: () => resolve(s),
            onerror: (e) => reject(e)
          });
          setTimeout(() => reject(new Error("d\xE9lai d\xE9pass\xE9")), 6e3);
        });
      } catch {
        samplerRef.current = new Sampler({
          urls: SAMPLE_URLS_LOCAL,
          baseUrl: "/audio/guitar/",
          release: 2,
          volume: context2.id === "jazz_251" ? -8 : -10
        });
      }
      samplerRef.current.connect(masterOut);
      const BASS_SAMPLES = {
        "C1": "C1.mp3",
        "Gb1": "Gb1.mp3",
        "C2": "C2.mp3",
        "Gb2": "Gb2.mp3",
        "C3": "C3.mp3",
        "Gb3": "Gb3.mp3",
        "C4": "C4.mp3",
        "Gb4": "Gb4.mp3",
        "A4": "A4.mp3"
      };
      let bassLoaded = false;
      try {
        bassRef.current = await new Promise((resolve, reject) => {
          const s = new Sampler({
            urls: BASS_SAMPLES,
            baseUrl: "/audio/bass/",
            release: 0.9,
            volume: -9,
            onload: () => resolve(s),
            onerror: (e) => reject(e)
          });
          setTimeout(() => reject(new Error("d\xE9lai d\xE9pass\xE9")), 6e3);
        });
        bassLoaded = true;
      } catch {
        bassRef.current = new Synth({
          oscillator: { type: "triangle" },
          envelope: { attack: 0.012, decay: 0.2, sustain: 0.55, release: 0.5 },
          volume: -14
        });
      }
      const bassFilter = new Filter({
        frequency: bassLoaded ? 3500 : 900,
        type: "lowpass",
        rolloff: -12
      });
      const bassComp = new Compressor({ threshold: -18, ratio: 4, attack: 8e-3, release: 0.12 });
      bassFilterRef.current = bassFilter;
      bassCompRef.current = bassComp;
      bassRef.current.chain(bassFilter, bassComp, compRef.current);
      const DRUM_FILES = {
        kick: ["kick1.mp3", "kick2.mp3", "kick3.mp3"],
        snare: ["snare1.mp3", "snare2.mp3"],
        hihat: ["hihat1.mp3", "hihat2.mp3", "hihat3.mp3"],
        hihatOpen: ["hihatOpen1.mp3", "hihatOpen2.mp3"],
        ride: ["ride1.mp3", "ride2.mp3"],
        crash: ["crash1.mp3", "crash2.mp3"],
        tomLow: ["tomLow1.mp3"],
        tomMid: ["tomMid1.mp3"]
      };
      const drumUrls = {};
      for (const [inst, files] of Object.entries(DRUM_FILES)) {
        files.forEach((f, i) => {
          drumUrls[`${inst}${i}`] = f;
        });
      }
      let drumsLoaded = false;
      try {
        drumsRef.current = await new Promise((resolve, reject) => {
          const p = new Players({
            urls: drumUrls,
            baseUrl: "/audio/drums/",
            onload: () => resolve(p),
            onerror: (e) => reject(e)
          });
          setTimeout(() => reject(new Error("d\xE9lai d\xE9pass\xE9")), 8e3);
        });
        drumsRef.current.connect(compRef.current);
        drumsLoaded = true;
      } catch {
        drumsRef.current = null;
      }
      drumsLoadedRef.current = drumsLoaded;
      if (!drumsLoaded) {
        kickRef.current = new MembraneSynth({
          pitchDecay: 0.08,
          octaves: 6,
          envelope: { attack: 1e-3, decay: 0.35, sustain: 0, release: 0.1 },
          volume: -8
        });
        const kickComp = new Compressor({ threshold: -12, ratio: 8 });
        kickCompRef.current = kickComp;
        kickRef.current.chain(kickComp, compRef.current);
        snareRef.current = new NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 1e-3, decay: 0.18, sustain: 0, release: 0.05 },
          volume: -18
        });
        const snareFilter = new Filter({ frequency: 1800, type: "highpass" });
        snareFilterRef.current = snareFilter;
        snareRef.current.chain(snareFilter, reverbRef.current);
        hihatRef.current = new NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 1e-3, decay: 0.04, sustain: 0, release: 0.02 },
          volume: -26
        }).connect(compRef.current);
      }
      const style = getStyle(context2.id);
      const progression2 = context2.chords;
      let barMap = [];
      for (const chord of progression2) {
        for (let b = 0; b < chord.bars; b++) barMap.push(chord);
      }
      const totalBars2 = barMap.length;
      comperRef.current = createComper(
        style === "blues" || style === "blues12" ? "blues" : "jazz"
      );
      seqRef.current = new Sequence((time, barIdx) => {
        const chord = barMap[barIdx % totalBars2];
        const chordRoot = transposeNote(root, chord.degree);
        const voiced = getVoicedChord(chordRoot, chord.quality, style);
        const nextChord = barMap[(barIdx + 1) % totalBars2];
        const nextRoot = transposeNote(root, nextChord.degree);
        const bassPattern = getBassPattern(chordRoot, chord.quality, style, nextRoot, barIdx);
        const compHits = comperRef.current?.nextBar(barIdx, 3) || [];
        const nextVoiced = getVoicedChord(nextRoot, nextChord.quality, style);
        for (const hit of compHits) {
          const humanize = (Math.random() - 0.5) * 8e-3;
          samplerRef.current?.triggerAttackRelease(
            hit.anticipate ? nextVoiced : voiced,
            hit.dur,
            Time(time) + Time(beatToToneTime(hit.beat)) + humanize,
            hit.velocity
          );
        }
        bassPattern.forEach(({ note, time: t, dur, velocity }) => {
          bassRef.current?.triggerAttackRelease(
            note,
            dur,
            Time(time) + Time(t),
            velocity ?? 0.8
          );
        });
        getDraw().schedule(() => {
          setBeat(barIdx % totalBars2);
          const chordIdx = progression2.reduce((acc, c, i) => {
            const start2 = progression2.slice(0, i).reduce((s, x) => s + x.bars, 0);
            return barIdx % totalBars2 >= start2 ? i : acc;
          }, 0);
          setCurrentChord(chordIdx);
        }, time);
      }, Array.from({ length: totalBars2 }, (_, i) => i), "1m");
      const drumPattern = getDrumPattern(style);
      const beatPart = new Part((time, event) => {
        playDrum(event.type, time, event.velocity ?? 0.8);
      }, [
        ...drumPattern.kick.map((t) => ({ time: t, type: "kick" })),
        ...drumPattern.snare.map((t) => ({ time: t, type: "snare" })),
        ...drumPattern.hihat.map((t) => ({ time: t, type: "hihat" }))
      ]);
      beatPart.loop = true;
      beatPart.loopEnd = "1m";
      beatSeqRef.current = beatPart;
      if (drumPattern.shuffle) {
        getTransport().swing = 0.5;
        getTransport().swingSubdivision = "8n";
      } else {
        getTransport().swing = 0;
      }
      seqRef.current.start(0);
      beatPart.start(0);
      getTransport().start();
      setPlaying(true);
    } catch (e) {
      console.warn("[BackingTrackPlayer] Erreur:", e);
      setPlayError(e?.message || "Le lecteur n'a pas pu d\xE9marrer.");
    }
    setLoading(false);
  }
  function stopBacking() {
    [seqRef, beatSeqRef].forEach((r) => {
      try {
        r.current?.stop();
        r.current?.dispose();
        r.current = null;
      } catch {
      }
    });
    [
      samplerRef,
      bassRef,
      kickRef,
      snareRef,
      hihatRef,
      drumsRef,
      reverbRef,
      delayRef,
      compRef,
      bassFilterRef,
      bassCompRef,
      kickCompRef,
      snareFilterRef
    ].forEach((r) => {
      try {
        r.current?.releaseAll?.();
        r.current?.dispose();
        r.current = null;
      } catch {
      }
    });
    try {
      getTransport().stop();
      getTransport().cancel();
    } catch {
    }
    setPlaying(false);
    setBeat(0);
    setCurrentChord(0);
  }
  const toggle = () => playing ? stopBacking() : startBacking();
  const progression = context2.chords;
  const totalBars = progression.reduce((s, c) => s + c.bars, 0);
  return /* @__PURE__ */ jsxs10("div", { style: {
    background: C.surface,
    border: `1.5px solid ${playing ? context2.color : C.border}`,
    borderRadius: R.lg,
    padding: "14px 14px 12px",
    transition: "border-color 0.3s, box-shadow 0.3s",
    boxShadow: playing ? `0 0 20px ${context2.color}22` : "none"
  }, children: [
    /* @__PURE__ */ jsxs10("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }, children: [
      /* @__PURE__ */ jsxs10("div", { children: [
        /* @__PURE__ */ jsx12("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }, children: "Backing Track" }),
        /* @__PURE__ */ jsxs10("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 3 }, children: [
          /* @__PURE__ */ jsxs10("span", { style: { fontSize: 13, fontWeight: 600, color: playing ? context2.colorD : C.text2, fontFamily: FONTS.ui }, children: [
            bpm,
            " BPM"
          ] }),
          playing && /* @__PURE__ */ jsx12("span", { style: { fontSize: 10, color: context2.color, fontFamily: FONTS.ui, fontWeight: 600 }, children: "EN COURS" })
        ] })
      ] }),
      /* @__PURE__ */ jsx12("button", { onClick: toggle, disabled: loading, style: {
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: "none",
        background: loading ? C.surface2 : playing ? `linear-gradient(135deg, ${context2.color}, ${shade2(context2.color, -45)})` : `linear-gradient(135deg, ${C.primary}, ${shade2(C.primary, -45)})`,
        cursor: loading ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: playing ? `0 4px 18px ${context2.color}66` : loading ? "none" : "0 4px 14px rgba(76,66,200,0.35)",
        transition: "all 0.2s"
      }, children: loading ? /* @__PURE__ */ jsx12(Ti, { name: "loader", size: 22, color: C.text3 }) : /* @__PURE__ */ jsx12(Ti, { name: playing ? "player-stop" : "player-play", size: 22, color: "#fff" }) })
    ] }),
    playError && /* @__PURE__ */ jsxs10("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
      padding: "9px 12px",
      borderRadius: R.md,
      background: C.coralL,
      border: `1px solid ${C.coral}`
    }, children: [
      /* @__PURE__ */ jsx12(Ti, { name: "alert-circle", size: 15, color: C.coralD, style: { flexShrink: 0 } }),
      /* @__PURE__ */ jsx12("span", { style: { fontSize: 12, color: C.coralD, fontFamily: FONTS.ui, lineHeight: 1.4, flex: 1 }, children: playError }),
      /* @__PURE__ */ jsx12("button", { onClick: startBacking, style: {
        background: "none",
        border: "none",
        color: C.coralD,
        fontWeight: 700,
        fontSize: 12,
        fontFamily: FONTS.ui,
        cursor: "pointer",
        flexShrink: 0,
        textDecoration: "underline"
      }, children: "R\xE9essayer" })
    ] }),
    /* @__PURE__ */ jsx12("div", { style: { display: "flex", gap: 3, marginBottom: 10 }, children: Array.from({ length: totalBars }).map((_, i) => /* @__PURE__ */ jsx12("div", { style: {
      flex: 1,
      height: 5,
      borderRadius: 3,
      background: playing && i === beat ? context2.color : playing && i < beat ? `${context2.color}44` : C.border,
      transition: "background 0.08s"
    } }, i)) }),
    /* @__PURE__ */ jsx12("div", { style: { display: "flex", gap: 5, flexWrap: "wrap" }, children: progression.map((chord, i) => {
      const chordRoot = transposeNote(root, chord.degree);
      const chordRootFr = ROOTS_FR.find((r) => r.en === chordRoot)?.fr ?? chordRoot;
      const qualLabel = { maj7: "maj7", min7: "m7", dom7: "7" }[chord.quality];
      const isActive = playing && i === currentChord;
      return /* @__PURE__ */ jsxs10("div", { style: {
        padding: "5px 11px",
        borderRadius: R.pill,
        background: isActive ? context2.colorL : C.bg,
        border: `1.5px solid ${isActive ? context2.color : C.border}`,
        fontSize: 12,
        fontWeight: isActive ? 700 : 400,
        color: isActive ? context2.colorD : C.text2,
        fontFamily: FONTS.ui,
        transition: "all 0.12s",
        boxShadow: isActive ? `0 2px 8px ${context2.color}33` : "none"
      }, children: [
        chordRootFr,
        qualLabel,
        /* @__PURE__ */ jsxs10("span", { style: { fontSize: 9, color: isActive ? context2.color : C.text3, marginLeft: 4 }, children: [
          "x",
          chord.bars
        ] })
      ] }, i);
    }) })
  ] });
}
function JamSession({ onBack }) {
  const C = useC();
  const LEVEL_COLOR = makeLevelColor(C);
  const CONTEXTS = makeContexts(C);
  const [contextId, setContextId] = useState10("blues_minor");
  const [root, setRoot] = useState10("A");
  const [displayMode, setDisplayMode] = useState10("notes");
  const [constraint, setConstraint] = useState10(null);
  const [showRootPicker, setShowRootPicker] = useState10(false);
  const ctx = CONTEXTS.find((c) => c.id === contextId);
  const rootFr = ROOTS_FR.find((r) => r.en === root)?.fr ?? root;
  const activeNotes = useMemo5(() => getScaleNotes(root, ctx.scale), [root, ctx.scale]);
  const randomConstraint = () => {
    const next = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setConstraint(next);
  };
  const transposeSemitone = (dir) => {
    const idx = CHROMATIC4.indexOf(root);
    setRoot(CHROMATIC4[(idx + dir + 12) % 12]);
  };
  return /* @__PURE__ */ jsxs10("div", { style: { display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }, children: [
    /* @__PURE__ */ jsxs10("div", { style: { padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }, children: [
      /* @__PURE__ */ jsx12("button", { onClick: onBack, style: { background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0 }, children: /* @__PURE__ */ jsx12(Ti, { name: "chevron-left", size: 22 }) }),
      /* @__PURE__ */ jsxs10("div", { style: { flex: 1 }, children: [
        /* @__PURE__ */ jsx12("div", { style: { fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }, children: "Jam Session" }),
        /* @__PURE__ */ jsxs10("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: [
          rootFr,
          " - ",
          ctx.label
        ] })
      ] }),
      /* @__PURE__ */ jsx12(Gropi, { pose: "rocker", size: 46, anim: "wiggle" })
    ] }),
    /* @__PURE__ */ jsxs10("div", { style: { padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingBottom: 32 }, children: [
      /* @__PURE__ */ jsx12("div", { style: { overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsx12("div", { style: { display: "flex", gap: 8, paddingBottom: 4 }, children: CONTEXTS.map((c) => /* @__PURE__ */ jsx12("button", { onClick: () => setContextId(c.id), style: {
        flexShrink: 0,
        padding: "8px 14px",
        borderRadius: R.pill,
        border: `1.5px solid ${contextId === c.id ? c.color : C.border}`,
        background: contextId === c.id ? c.colorL : C.surface,
        color: contextId === c.id ? c.colorD : C.text2,
        fontSize: 12,
        fontWeight: contextId === c.id ? 600 : 400,
        cursor: "pointer",
        fontFamily: FONTS.ui,
        whiteSpace: "nowrap"
      }, children: c.label }, c.id)) }) }),
      /* @__PURE__ */ jsx12("div", { style: { background: ctx.colorL, border: `1px solid ${ctx.colorB}`, borderRadius: R.lg, padding: "10px 14px" }, children: /* @__PURE__ */ jsx12("div", { style: { fontSize: 12, color: ctx.colorD, fontFamily: FONTS.title, lineHeight: 1.5 }, children: ctx.desc }) }),
      /* @__PURE__ */ jsx12(BackingTrackPlayer, { context: ctx, root, bpm: ctx.bpm }),
      /* @__PURE__ */ jsxs10("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx12("div", { style: { fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }, children: "Tonique" }),
        /* @__PURE__ */ jsx12("button", { onClick: () => transposeSemitone(-1), style: { width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx12(Ti, { name: "chevron-left", size: 16, color: C.text2 }) }),
        /* @__PURE__ */ jsx12("button", { onClick: () => setShowRootPicker(!showRootPicker), style: { flex: 1, height: 34, borderRadius: 10, border: `1.5px solid ${ctx.color}`, background: ctx.colorL, cursor: "pointer", fontSize: 16, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui }, children: rootFr }),
        /* @__PURE__ */ jsx12("button", { onClick: () => transposeSemitone(1), style: { width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx12(Ti, { name: "chevron-right", size: 16, color: C.text2 }) })
      ] }),
      showRootPicker && /* @__PURE__ */ jsx12("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 10 }, children: ROOTS_FR.map((r) => /* @__PURE__ */ jsx12("button", { onClick: () => {
        setRoot(r.en);
        setShowRootPicker(false);
      }, style: {
        padding: "8px 4px",
        borderRadius: 8,
        border: `1px solid ${root === r.en ? ctx.color : C.border}`,
        background: root === r.en ? ctx.colorL : C.bg,
        color: root === r.en ? ctx.colorD : C.text,
        fontSize: 12,
        fontWeight: root === r.en ? 700 : 400,
        cursor: "pointer",
        fontFamily: FONTS.ui
      }, children: r.fr }, r.en)) }),
      /* @__PURE__ */ jsx12("div", { style: { display: "flex", gap: 6 }, children: [{ key: "notes", label: "Notes" }, { key: "intervals", label: "Intervalles" }, { key: "degrees", label: "Degres" }].map((m) => /* @__PURE__ */ jsx12("button", { onClick: () => setDisplayMode(m.key), style: {
        flex: 1,
        padding: "7px 0",
        borderRadius: 8,
        border: `1px solid ${displayMode === m.key ? ctx.color : C.border}`,
        background: displayMode === m.key ? ctx.colorL : C.surface,
        color: displayMode === m.key ? ctx.colorD : C.text3,
        fontSize: 11,
        fontWeight: displayMode === m.key ? 600 : 400,
        cursor: "pointer",
        fontFamily: FONTS.ui
      }, children: m.label }, m.key)) }),
      /* @__PURE__ */ jsx12("div", { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: "hidden" }, children: /* @__PURE__ */ jsx12("div", { style: { padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsx12(Fretboard, { mode: "scale", root, scale: ctx.scale, displayMode, lang: "fr", compact: true }) }) }),
      /* @__PURE__ */ jsxs10("div", { style: { display: "flex", gap: 10 }, children: [
        /* @__PURE__ */ jsxs10("div", { style: { flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "10px 12px" }, children: [
          /* @__PURE__ */ jsx12("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }, children: "Gamme" }),
          /* @__PURE__ */ jsx12("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: activeNotes.map((note, i) => /* @__PURE__ */ jsxs10("div", { style: { padding: "4px 8px", borderRadius: R.pill, background: i === 0 ? ctx.colorL : C.bg, border: `1px solid ${i === 0 ? ctx.color : C.border}`, fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? ctx.colorD : C.text2, fontFamily: FONTS.ui }, children: [
            noteToFr(note),
            i === 0 ? " R" : ""
          ] }, note)) })
        ] }),
        /* @__PURE__ */ jsxs10("div", { style: { flex: 1, background: ctx.colorL, border: `1px solid ${ctx.colorB}`, borderRadius: R.lg, padding: "10px 12px" }, children: [
          /* @__PURE__ */ jsx12("div", { style: { fontSize: 10, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }, children: "Cibles" }),
          /* @__PURE__ */ jsx12("div", { style: { fontSize: 11, color: ctx.colorD, fontFamily: FONTS.ui, lineHeight: 1.5 }, children: ctx.targetDesc })
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { style: { background: constraint ? C.amberL : C.surface, border: `1px solid ${constraint ? C.amberBorder : C.border}`, borderRadius: R.lg, padding: "12px 14px" }, children: [
        /* @__PURE__ */ jsxs10("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: constraint ? 8 : 0 }, children: [
          /* @__PURE__ */ jsx12("div", { style: { fontSize: 10, fontWeight: 700, color: constraint ? C.amberD : C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }, children: "Contrainte du moment" }),
          /* @__PURE__ */ jsx12("button", { onClick: randomConstraint, style: { padding: "5px 12px", borderRadius: R.pill, border: `1px solid ${C.amber}`, background: C.amber, color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }, children: constraint ? "Nouvelle" : "Tirer" })
        ] }),
        constraint ? /* @__PURE__ */ jsxs10(Fragment8, { children: [
          /* @__PURE__ */ jsx12("div", { style: { fontSize: 13, color: C.amberD, fontFamily: FONTS.title, lineHeight: 1.55, fontWeight: 500 }, children: constraint.text }),
          /* @__PURE__ */ jsx12("div", { style: { fontSize: 10, fontFamily: FONTS.ui, marginTop: 4, color: LEVEL_COLOR[constraint.level] }, children: constraint.level })
        ] }) : /* @__PURE__ */ jsx12("div", { style: { fontSize: 12, color: C.text3, fontFamily: FONTS.ui }, children: "Tire une contrainte pour booster ta creativite" })
      ] }),
      /* @__PURE__ */ jsxs10("div", { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px" }, children: [
        /* @__PURE__ */ jsx12("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }, children: "Rappels" }),
        ["Silence = note. Utilise-le.", "Arrive sur une chord tone sur les temps forts.", "Une bonne phrase monte puis descend.", "Le climax aux 2/3 du solo, pas a la fin."].map((tip, i) => /* @__PURE__ */ jsxs10("div", { style: { display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 3 ? 6 : 0 }, children: [
          /* @__PURE__ */ jsx12("div", { style: { width: 4, height: 4, borderRadius: "50%", background: ctx.color, marginTop: 6, flexShrink: 0 } }),
          /* @__PURE__ */ jsx12("div", { style: { fontSize: 12, color: C.text2, fontFamily: FONTS.ui, lineHeight: 1.5 }, children: tip })
        ] }, i))
      ] })
    ] })
  ] });
}

// src/screens/HomeScreen.jsx
var HomeScreen_exports = {};
__export(HomeScreen_exports, {
  HomeScreen: () => HomeScreen
});
import { useState as useState11, useMemo as useMemo6, useEffect as useEffect8 } from "react";

// src/store/leveling.js
var BASE = 120;
var STEP = 40;
var CAP = 500;
var MAX_LEVEL2 = 60;
function xpNeededForLevel(n) {
  const lvl = Math.max(1, Math.min(MAX_LEVEL2, Math.floor(Number(n) || 1)));
  return Math.min(BASE + (lvl - 1) * STEP, CAP);
}
function totalXpForLevel(n) {
  const target = Math.max(1, Math.min(MAX_LEVEL2, Math.floor(Number(n) || 1)));
  let total = 0;
  for (let i = 1; i < target; i++) total += xpNeededForLevel(i);
  return total;
}
function levelFromXp(xp) {
  const raw = Number(xp);
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const safe = Math.min(raw, totalXpForLevel(MAX_LEVEL2));
  let level = 1;
  let remaining = safe;
  while (level < MAX_LEVEL2 && remaining >= xpNeededForLevel(level)) {
    remaining -= xpNeededForLevel(level);
    level += 1;
  }
  return level;
}
function sanitizeXp(xp) {
  const raw = Number(xp);
  if (!Number.isFinite(raw) || raw < 0) return 0;
  return Math.min(Math.round(raw), totalXpForLevel(MAX_LEVEL2));
}
function levelProgress(xp) {
  const safe = sanitizeXp(xp);
  const level = levelFromXp(safe);
  const floor = totalXpForLevel(level);
  const xpNeeded = xpNeededForLevel(level);
  const xpInLevel = safe - floor;
  const isMax = level >= MAX_LEVEL2;
  return {
    level,
    xpInLevel,
    xpNeeded,
    xpToNext: isMax ? 0 : xpNeeded - xpInLevel,
    pct: isMax ? 100 : Math.max(0, Math.min(100, Math.round(xpInLevel / xpNeeded * 100))),
    totalForNext: floor + xpNeeded,
    isMax
  };
}

// src/screens/HomeScreen.jsx
import { Fragment as Fragment9, jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
var GROPI_TIPS = [
  // ── Contextuel (prioritaire, condition spécifique à l'état du joueur) ──────
  { type: "progress", cond: (s, rs) => rs.toReview >= 10, text: (_, rs) => `Tu as ${rs.toReview} questions qui attendent d'\xEAtre revues. La m\xE9moire s'efface vite, c'est le bon moment pour les reprendre.` },
  { type: "progress", cond: (s) => s.streak === 0 && Object.keys(s.completedLessons || {}).length > 0, text: () => "Ta s\xE9rie est retomb\xE9e \xE0 z\xE9ro. Tu es l\xE0, c'est d\xE9j\xE0 l'essentiel : rallume-la aujourd'hui." },
  { type: "progress", cond: (s) => s.streak >= 7, text: (s) => `${s.streak} jours d'affil\xE9e. La r\xE9gularit\xE9, c'est 80 % du chemin, continue comme \xE7a.` },
  { type: "progress", cond: (s) => s.streak >= 3, text: (s) => `S\xE9rie de ${s.streak} jours. Tu construis une vraie habitude, ne la casse pas maintenant.` },
  { type: "progress", cond: (s) => s.level >= 3 && levelProgress(s.xp).xpInLevel < 30, text: () => "Tu viens de passer un niveau. C'est le bon moment pour tenter quelque chose de nouveau." },
  { type: "progress", cond: (s) => Object.keys(s.completedLessons || {}).length === 0, text: () => "Commence par une le\xE7on : 10 minutes aujourd'hui valent mieux qu'une heure dimanche." },
  { type: "tip", cond: () => (/* @__PURE__ */ new Date()).getDay() === 1, text: () => "Lundi est un bon jour pour revoir la semaine pass\xE9e avant d'avancer." },
  { type: "tip", cond: () => (/* @__PURE__ */ new Date()).getDay() === 5, text: () => "Vendredi soir et guitare, \xE7a marche bien ensemble. 15 minutes de Jam pour finir la semaine sur une bonne note." },
  // ── Rappels de progression (toujours éligibles, piochent dans les vraies stats) ──
  { type: "progress", cond: (s) => Object.keys(s.completedLessons || {}).length >= 1, text: (s) => `${Object.keys(s.completedLessons).length} le\xE7on${Object.keys(s.completedLessons).length > 1 ? "s" : ""} d\xE9j\xE0 compl\xE9t\xE9e${Object.keys(s.completedLessons).length > 1 ? "s" : ""}. Chaque le\xE7on ajoute une pierre \xE0 l'\xE9difice, m\xEAme les plus courtes.` },
  { type: "progress", cond: (s) => (s.unlockedBadges || []).length >= 1, text: (s) => `${s.unlockedBadges.length} badge${s.unlockedBadges.length > 1 ? "s" : ""} d\xE9bloqu\xE9${s.unlockedBadges.length > 1 ? "s" : ""}. Va voir ta collection dans l'onglet Progr\xE8s, \xE7a fait toujours plaisir.` },
  { type: "progress", cond: (s) => (s.dailyChallengeCount || 0) >= 3, text: (s) => `${s.dailyChallengeCount} d\xE9fis du jour relev\xE9s. C'est ce genre de petite r\xE9gularit\xE9 qui construit une vraie oreille.` },
  // ── Conseils pratiques (toujours éligibles) ──────────────────────────────
  { type: "tip", cond: () => true, text: () => "Accorde-toi avant de jouer. 30 secondes qui \xE9vitent de fausser toute la session." },
  { type: "tip", cond: () => true, text: () => "Entre cordes 3 et 2, le d\xE9calage est de 4 cases, pas 5. C'est la cassure du manche, un rep\xE8re \xE0 retenir par c\u0153ur." },
  { type: "tip", cond: () => true, text: () => "Vise la tierce de chaque accord quand tu improvises : c'est elle qui raconte l'histoire." },
  { type: "tip", cond: () => true, text: () => "Le silence fait partie de la musique. Laisser respirer une phrase la rend souvent plus puissante." },
  { type: "tip", cond: () => true, text: () => "Joue lentement, puis acc\xE9l\xE8re. Un tempo lent parfait vaut mieux qu'un tempo rapide rat\xE9." },
  { type: "tip", cond: () => true, text: () => "La pentatonique mineure position 1 fonctionne sur 90 % des jams en mineur. Ma\xEEtrise-la d'abord." },
  { type: "tip", cond: () => true, text: () => "Le mode dorien est un mineur naturel avec une 6te majeure. C'est la gamme de Santana ou de Daft Punk, \xE9coute-les diff\xE9remment." },
  // ── Anecdotes musicales (faits historiques vérifiables, jamais de paroles) ──
  { type: "anecdote", cond: () => true, text: () => "Le riff de 'Smoke on the Water' (Deep Purple) est n\xE9 d'un incendie bien r\xE9el : un concert de Frank Zappa \xE0 Montreux qui a pris feu en 1971, sous les yeux du groupe." },
  { type: "anecdote", cond: () => true, text: () => "Jimi Hendrix \xE9tait gaucher, mais jouait souvent sur une Stratocaster de droitier simplement retourn\xE9e, cordes replac\xE9es \xE0 l'envers." },
  { type: "anecdote", cond: () => true, text: () => "Le riff d'intro de 'Stairway to Heaven' est tellement rejou\xE9 en magasin de musique qu'il a inspir\xE9 une sc\xE8ne culte de 'Wayne's World' o\xF9 un panneau l'interdit carr\xE9ment." },
  { type: "anecdote", cond: () => true, text: () => "B.B. King a appel\xE9 toutes ses guitares 'Lucille', en souvenir d'un incendie qu'il a fui de justesse pendant un concert." },
  { type: "anecdote", cond: () => true, text: () => "Eddie Van Halen a popularis\xE9 le tapping \xE0 deux mains sur 'Eruption' \u2014 une technique que tr\xE8s peu de guitaristes utilisaient avant lui \xE0 ce niveau." },
  { type: "anecdote", cond: () => true, text: () => "La gamme pentatonique n'est pas n\xE9e en Occident : on la retrouve, invent\xE9e ind\xE9pendamment, dans les musiques traditionnelles chinoise, africaine et am\xE9rindienne." },
  { type: "anecdote", cond: () => true, text: () => "Keith Richards joue une bonne partie des riffs des Rolling Stones en accordage ouvert de Sol, sur une guitare \xE0 seulement 5 cordes (sans le Mi grave)." },
  { type: "anecdote", cond: () => true, text: () => "Brian May (Queen) a construit sa guitare l\xE9gendaire, la 'Red Special', avec son p\xE8re \u2014 en partie \xE0 partir de bois de chemin\xE9e r\xE9cup\xE9r\xE9." },
  { type: "anecdote", cond: () => true, text: () => "Le blues \xE0 12 mesures est la structure la plus reprise de l'histoire du rock : des milliers de morceaux, du blues au rock'n'roll, s'appuient sur elle." },
  { type: "anecdote", cond: () => true, text: () => "Slash a enregistr\xE9 le riff de 'Sweet Child O' Mine' sur une copie de Gibson Les Paul, avant m\xEAme de pouvoir s'offrir une vraie." }
];
var TIP_LABELS = { tip: "Conseil de Gropi", anecdote: "Anecdote musicale", progress: "Ta progression" };
function pickTip(state, rs) {
  const dayIdx = (/* @__PURE__ */ new Date()).getDate();
  const contextual = GROPI_TIPS.filter((t) => t.cond(state, rs));
  if (contextual.length === 0) return { type: "tip", text: "Gropi est l\xE0 pour toi." };
  const picked = contextual[dayIdx % contextual.length];
  return { type: picked.type, text: picked.text(state, rs) };
}
function GropiWave({ size = 80 }) {
  const C = useC();
  return /* @__PURE__ */ jsx13(Gropi, { pose: "wave", size, anim: "wiggle" });
}
function GropiBlock({ state, dispatch, navigate, reviewStats, nextLesson }) {
  const C = useC();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const dismissed = state.gropiTipDate === today;
  const tip = useMemo6(
    () => pickTip(state, reviewStats),
    [
      state.xp,
      state.streak,
      state.level,
      reviewStats.toReview,
      Object.keys(state.completedLessons || {}).length,
      (state.unlockedBadges || []).length,
      state.dailyChallengeCount
    ]
  );
  const steps = useMemo6(() => {
    const s = [];
    if (reviewStats.toReview > 0) s.push({
      icon: "refresh",
      color: C.pink,
      label: "R\xE9vision intelligente",
      sub: `${reviewStats.toReview} question${reviewStats.toReview > 1 ? "s" : ""} \xE0 revoir`,
      dur: "5 min",
      action: "review"
    });
    if (nextLesson?.lesson) s.push({
      icon: "book-2",
      color: C.green,
      label: nextLesson.lesson.title,
      sub: nextLesson.course.title,
      dur: `${nextLesson.lesson.duration} min`,
      action: "courses"
    });
    else if (nextLesson?.needsCheck) s.push({
      icon: "clipboard-check",
      color: C.primary,
      label: "V\xE9rifier ton unit\xE9",
      sub: "Toutes les le\xE7ons sont vues, il ne reste que le contr\xF4le",
      dur: "5 min",
      action: "courses"
    });
    s.push(state.dailyChallengeDone ? {
      icon: "trophy",
      color: C.green,
      label: "D\xE9fi du jour termin\xE9",
      sub: "Reviens demain pour le suivant",
      dur: "\u2713",
      action: "challenge",
      done: true
    } : {
      icon: "bolt",
      color: C.amber,
      label: "D\xE9fi du jour",
      sub: "Un exercice court, tir\xE9 au hasard",
      dur: "3 min",
      action: "challenge"
    });
    if (s.length === 0) s.push({
      icon: "music",
      color: C.pink,
      label: "Jam Session libre",
      sub: "Improvise, explore, d\xE9tends-toi",
      dur: "\u221E",
      action: "jam"
    });
    return s;
  }, [reviewStats.toReview, nextLesson, state.dailyChallengeDone]);
  const totalMin = steps.filter((s) => !s.done).reduce((a, s) => a + (parseInt(s.dur) || 5), 0);
  const mainAction = (steps.find((s) => !s.done) || steps[0])?.action || "jam";
  return /* @__PURE__ */ jsxs11("div", { style: {
    margin: "14px 16px 0",
    background: C.surface,
    border: `1.5px solid ${C.primaryBorder}`,
    borderRadius: 22,
    overflow: "hidden",
    boxShadow: `0 4px 20px ${C.primary}18`
  }, children: [
    !dismissed && /* @__PURE__ */ jsxs11(Fragment9, { children: [
      /* @__PURE__ */ jsxs11("div", { style: { display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 14px 12px" }, children: [
        /* @__PURE__ */ jsx13(GropiWave, { size: 76 }),
        /* @__PURE__ */ jsxs11("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs11("div", { style: {
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: C.primaryD,
            fontFamily: FONTS.ui,
            marginBottom: 5
          }, children: [
            TIP_LABELS[tip.type] || "Conseil de Gropi",
            " \xB7 aujourd'hui"
          ] }),
          /* @__PURE__ */ jsx13("p", { style: {
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.55,
            fontWeight: 500,
            color: C.text,
            fontFamily: FONTS.body
          }, children: tip.text })
        ] }),
        /* @__PURE__ */ jsx13(
          "button",
          {
            onClick: () => dispatch({ type: "DISMISS_GROPI_TIP" }),
            "aria-label": "Fermer le conseil du jour",
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              color: C.text3,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: FONTS.ui,
              padding: "0 2px",
              flexShrink: 0,
              lineHeight: 1
            },
            children: "\u2715"
          }
        )
      ] }),
      /* @__PURE__ */ jsx13("div", { style: { borderTop: `1px dashed ${C.primaryBorder}`, margin: "0 14px" } })
    ] }),
    /* @__PURE__ */ jsxs11("div", { style: { padding: "11px 14px 14px" }, children: [
      /* @__PURE__ */ jsxs11("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }, children: [
        /* @__PURE__ */ jsx13("span", { style: { fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.primaryD, fontFamily: FONTS.ui }, children: "Ta session du jour" }),
        /* @__PURE__ */ jsxs11("span", { style: {
          fontSize: 9.5,
          fontWeight: 700,
          background: C.primaryL,
          border: `1px solid ${C.primaryBorder}`,
          color: C.primary,
          borderRadius: 999,
          padding: "3px 9px",
          fontFamily: FONTS.ui,
          letterSpacing: ".05em",
          textTransform: "uppercase"
        }, children: [
          "\u2248 ",
          totalMin,
          " min"
        ] })
      ] }),
      steps.map((step, i) => /* @__PURE__ */ jsxs11("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderTop: i > 0 ? `1px dashed ${C.borderSoft}` : "none"
      }, children: [
        /* @__PURE__ */ jsx13("div", { style: {
          width: 32,
          height: 32,
          borderRadius: 10,
          background: step.done ? C.greenL : C.surface2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }, children: /* @__PURE__ */ jsx13(Ti, { name: step.icon, size: 15, color: step.color }) }),
        /* @__PURE__ */ jsxs11("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx13("div", { style: {
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-.1px",
            color: step.done ? C.text3 : C.text
          }, children: step.label }),
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 10.5, color: C.text3, marginTop: 1 }, children: step.sub })
        ] }),
        /* @__PURE__ */ jsx13("span", { style: { fontSize: 11, fontWeight: 700, color: C.text2, flexShrink: 0 }, children: step.dur })
      ] }, i)),
      /* @__PURE__ */ jsxs11(
        "button",
        {
          onClick: () => navigate(mainAction),
          style: {
            width: "100%",
            marginTop: 11,
            background: `linear-gradient(135deg,#FF9155 0%,${C.primary} 100%)`,
            color: "#fff",
            border: "none",
            borderRadius: R.lg,
            padding: "13px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 13.5,
            fontWeight: 700,
            fontFamily: FONTS.ui,
            letterSpacing: ".02em",
            boxShadow: `0 4px 16px ${C.primary}44`
          },
          children: [
            /* @__PURE__ */ jsx13(Ti, { name: "player-play", size: 14, color: "#fff" }),
            "Commencer la session"
          ]
        }
      )
    ] })
  ] });
}
function QuickCard({ icon, iconBg, iconColor, label, onClick, done = false }) {
  const C = useC();
  return /* @__PURE__ */ jsxs11("button", { onClick, style: {
    background: C.surface,
    border: `1.5px solid ${done ? C.greenBorder : C.border}`,
    borderRadius: R.lg,
    padding: 14,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: FONTS.title,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    transition: "transform .1s"
  }, children: [
    /* @__PURE__ */ jsx13("div", { style: {
      width: 40,
      height: 40,
      borderRadius: R.md,
      background: iconBg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: /* @__PURE__ */ jsx13(Ti, { name: icon, size: 18, color: iconColor }) }),
    /* @__PURE__ */ jsx13("div", { style: { fontSize: 12.5, fontWeight: 700, color: C.text, lineHeight: 1.3 }, children: label })
  ] });
}
var WEEKLY_TARGETS = { sessions: 5, exercises: 8, quizzes: 12 };
function WeeklyGoals({ state }) {
  const C = useC();
  const currentWeek = weekStr();
  const g = state.weeklyGoals?.week === currentWeek ? state.weeklyGoals : { sessions: 0, exercises: 0, quizzes: 0 };
  const rows = [
    { key: "sessions", label: "Sessions de pratique", icon: "player-play", color: C.primary },
    { key: "exercises", label: "Exercices", icon: "guitar-pick", color: C.green },
    { key: "quizzes", label: "Quiz", icon: "help-circle", color: C.amber }
  ];
  const allDone = rows.every((r) => (g[r.key] || 0) >= WEEKLY_TARGETS[r.key]);
  return /* @__PURE__ */ jsxs11("div", { style: { margin: "16px 16px 0" }, children: [
    /* @__PURE__ */ jsxs11("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }, children: [
      /* @__PURE__ */ jsx13("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }, children: "Objectifs de la semaine" }),
      allDone && /* @__PURE__ */ jsx13("span", { style: { fontSize: 10, fontWeight: 700, color: C.green, fontFamily: FONTS.ui }, children: "Semaine r\xE9ussie" })
    ] }),
    /* @__PURE__ */ jsx13("div", { style: {
      background: C.surface,
      border: `1.5px solid ${allDone ? C.greenBorder : C.border}`,
      borderRadius: R.lg,
      padding: "12px 14px"
    }, children: rows.map((r, i) => {
      const done = g[r.key] || 0;
      const target = WEEKLY_TARGETS[r.key];
      const hit = done >= target;
      return /* @__PURE__ */ jsxs11("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: i > 0 ? "9px 0 0" : "0",
        marginTop: i > 0 ? 9 : 0,
        borderTop: i > 0 ? `1px dashed ${C.border}` : "none"
      }, children: [
        /* @__PURE__ */ jsx13(Ti, { name: hit ? "circle-check" : r.icon, size: 15, color: hit ? C.green : r.color }),
        /* @__PURE__ */ jsx13("span", { style: { flex: 1, fontSize: 12.5, fontWeight: 600, color: C.text }, children: r.label }),
        /* @__PURE__ */ jsx13("div", { style: { width: 72 }, children: /* @__PURE__ */ jsx13(ProgressBar, { pct: Math.min(100, done / target * 100), color: hit ? C.green : r.color, h: 5 }) }),
        /* @__PURE__ */ jsxs11("span", { style: { fontSize: 11.5, fontWeight: 700, color: hit ? C.green : C.text2, minWidth: 36, textAlign: "right" }, children: [
          Math.min(done, target),
          "/",
          target
        ] })
      ] }, r.key);
    }) })
  ] });
}
function HomeScreen({ state, dispatch, navigate, content }) {
  const C = useC();
  const { xpInLevel, xpNeeded, pct: lvlPct, xpToNext } = levelProgress(state.xp);
  const reviewStats = useMemo6(() => {
    if (!content.quiz) return { toReview: 0, eligible: 0, pctMastered: 0, mastered: 0 };
    return getReviewStats(content.quiz, state.reviewHistory || {}, state.completedLessons);
  }, [content.quiz, state.reviewHistory, state.completedLessons]);
  const nextLesson = useMemo6(
    () => (
      // Suit l'ordre du Parcours (unités débloquées) — cohérent avec l'onglet Parcours
      getNextLesson(content, state)
    ),
    [content, state.completedLessons, state.claimedUnits]
  );
  const dateStr = (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return /* @__PURE__ */ jsxs11("div", { children: [
    /* @__PURE__ */ jsxs11("div", { style: {
      backgroundColor: "#995a36",
      backgroundImage: "url('/alhambra.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
      padding: "56px 20px 22px",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx13("div", { style: { position: "absolute", inset: 0, background: "rgba(160,55,0,.5)", pointerEvents: "none", zIndex: 0 } }),
      /* @__PURE__ */ jsx13("div", { style: { position: "absolute", top: -30, right: -35, width: 130, height: 130, background: "rgba(255,255,255,.08)", borderRadius: "50%", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs11("div", { style: { position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", alignItems: "center", gap: 9 }, children: [
        /* @__PURE__ */ jsx13("img", { src: "/logo.svg", alt: "Groply", style: { height: 40, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.95 } }),
        /* @__PURE__ */ jsx13("span", { style: { fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.3px", opacity: 0.95, fontFamily: "'Nunito',sans-serif" }, children: "Groply" })
      ] }),
      /* @__PURE__ */ jsx13(Gropi, { pose: "celebrate", size: 196, anim: "bob", style: {
        position: "absolute",
        right: -4,
        bottom: 0,
        zIndex: 1,
        filter: "drop-shadow(0 10px 18px rgba(120,40,0,.38))",
        pointerEvents: "none"
      } }),
      /* @__PURE__ */ jsx13("div", { style: { display: "flex", alignItems: "flex-end", position: "relative", zIndex: 2 }, children: /* @__PURE__ */ jsxs11("div", { style: { flex: "0 0 58%", maxWidth: "58%" }, children: [
        /* @__PURE__ */ jsx13("div", { style: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.75)", marginBottom: 2 }, children: dateStr }),
        /* @__PURE__ */ jsx13("div", { style: { fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 18, letterSpacing: "-.3px" }, children: "Bonjour" }),
        nextLesson?.lesson ? /* @__PURE__ */ jsxs11("button", { onClick: () => navigate("courses"), style: {
          width: "100%",
          background: "rgba(255,255,255,.18)",
          border: "1.5px solid rgba(255,255,255,.28)",
          borderRadius: R.lg,
          padding: "14px 16px",
          backdropFilter: "blur(6px)",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: FONTS.title
        }, children: [
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.7)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 3 }, children: "Prochain objectif" }),
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-.2px", marginBottom: 4 }, children: nextLesson.lesson.title }),
          /* @__PURE__ */ jsxs11("div", { style: { fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.7)", marginBottom: 12 }, children: [
            nextLesson.course.title,
            " \xB7 ",
            nextLesson.lesson.duration,
            " min"
          ] }),
          /* @__PURE__ */ jsxs11("span", { style: { display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: C.primary, borderRadius: 99, padding: "8px 16px", fontSize: 13, fontWeight: 700 }, children: [
            /* @__PURE__ */ jsx13(Ti, { name: "player-play", size: 13, color: C.primary }),
            "Continuer"
          ] })
        ] }) : nextLesson?.needsCheck ? /* @__PURE__ */ jsxs11("button", { onClick: () => navigate("courses"), style: {
          width: "100%",
          background: "rgba(255,255,255,.18)",
          border: "1.5px solid rgba(255,255,255,.28)",
          borderRadius: R.lg,
          padding: "14px 16px",
          backdropFilter: "blur(6px)",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: FONTS.title
        }, children: [
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.7)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 3 }, children: "Prochain objectif" }),
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-.2px", marginBottom: 4 }, children: "V\xE9rifier ton unit\xE9" }),
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.7)", marginBottom: 12 }, children: "Toutes les le\xE7ons sont vues, il ne reste que le contr\xF4le" }),
          /* @__PURE__ */ jsxs11("span", { style: { display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: C.primary, borderRadius: 99, padding: "8px 16px", fontSize: 13, fontWeight: 700 }, children: [
            /* @__PURE__ */ jsx13(Ti, { name: "clipboard-check", size: 13, color: C.primary }),
            "Continuer"
          ] })
        ] }) : /* @__PURE__ */ jsxs11("div", { style: { background: "rgba(255,255,255,.18)", border: "1.5px solid rgba(255,255,255,.28)", borderRadius: R.lg, padding: "16px 18px", backdropFilter: "blur(6px)" }, children: [
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 16, fontWeight: 800, color: "#fff" }, children: "Tout est compl\xE9t\xE9" }),
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 3 }, children: "Reviens demain pour de nouveaux d\xE9fis." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx13("div", { style: { display: "flex", gap: 8, overflowX: "auto", padding: "14px 16px 0", scrollbarWidth: "none" }, children: [
      { v: `Niv. ${state.level}`, l: "Niveau", color: C.primaryD },
      { v: Object.keys(state.completedLessons).length, l: "Le\xE7ons" },
      { v: Object.keys(state.quizResults || {}).length, l: "Quiz" },
      { v: Object.keys(state.completedExercises).length, l: "Exercices" },
      { v: `${state.streak}\u{1F525}`, l: (state.streakFreezes || 0) > 0 ? `S\xE9rie \xB7 ${state.streakFreezes}\u2744\uFE0F` : "S\xE9rie", color: C.primaryD }
    ].map((s, i) => /* @__PURE__ */ jsxs11("div", { style: { flexShrink: 0, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.md, padding: "10px 14px", minWidth: 68, textAlign: "center" }, children: [
      /* @__PURE__ */ jsx13("div", { style: { fontSize: 17, fontWeight: 800, color: s.color || C.text, letterSpacing: "-.3px" }, children: s.v }),
      /* @__PURE__ */ jsx13("div", { style: { fontSize: 9.5, fontWeight: 600, color: C.text3, textTransform: "uppercase", letterSpacing: ".05em", marginTop: 1 }, children: s.l })
    ] }, i)) }),
    /* @__PURE__ */ jsxs11("div", { style: { margin: "14px 16px 0" }, children: [
      /* @__PURE__ */ jsxs11("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 }, children: [
        /* @__PURE__ */ jsxs11("span", { style: { fontSize: 13, fontWeight: 700, color: C.text }, children: [
          "Niveau ",
          state.level
        ] }),
        /* @__PURE__ */ jsxs11("span", { style: { fontSize: 12, fontWeight: 600, color: C.primary }, children: [
          xpInLevel,
          " / ",
          xpNeeded,
          " XP"
        ] })
      ] }),
      /* @__PURE__ */ jsx13("div", { style: { height: 8, background: C.border, borderRadius: 99, overflow: "hidden" }, children: /* @__PURE__ */ jsx13("div", { style: { width: `${lvlPct}%`, height: "100%", background: `linear-gradient(90deg,#FF9155,${C.primary})`, borderRadius: 99, transition: "width .4s ease" } }) }),
      /* @__PURE__ */ jsxs11("div", { style: { fontSize: 11, color: C.text3, marginTop: 4 }, children: [
        xpToNext,
        " XP pour le niveau ",
        state.level + 1
      ] })
    ] }),
    /* @__PURE__ */ jsx13(WeeklyGoals, { state }),
    /* @__PURE__ */ jsx13(
      GropiBlock,
      {
        state,
        dispatch,
        navigate,
        reviewStats,
        nextLesson
      }
    ),
    /* @__PURE__ */ jsxs11("div", { style: { padding: "20px 16px 0" }, children: [
      /* @__PURE__ */ jsx13("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, marginBottom: 10 }, children: "Acc\xE8s rapide" }),
      /* @__PURE__ */ jsxs11("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }, children: [
        /* @__PURE__ */ jsx13(QuickCard, { icon: "music", iconBg: C.pinkL, iconColor: C.pink, label: "Jam Session", onClick: () => navigate("jam") }),
        /* @__PURE__ */ jsx13(QuickCard, { icon: "ear", iconBg: C.greenL, iconColor: C.green, label: "Ear Training", onClick: () => navigate("ear") })
      ] })
    ] }),
    state.sessionHistory?.length > 0 && /* @__PURE__ */ jsxs11("div", { style: { padding: "0 16px" }, children: [
      /* @__PURE__ */ jsx13("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, marginBottom: 10 }, children: "Derni\xE8res sessions" }),
      state.sessionHistory.slice(0, 3).map((sess, i) => /* @__PURE__ */ jsxs11("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }, children: [
        /* @__PURE__ */ jsx13("div", { style: { width: 38, height: 38, borderRadius: R.md, background: C.greenL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: /* @__PURE__ */ jsx13(Ti, { name: "check", size: 16, color: C.green }) }),
        /* @__PURE__ */ jsxs11("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx13("div", { style: { fontSize: 13, fontWeight: 700, color: C.text }, children: sess.title }),
          /* @__PURE__ */ jsxs11("div", { style: { fontSize: 11, color: C.text3, marginTop: 1 }, children: [
            sess.score ? `${sess.score} \xB7 ` : "",
            " +",
            sess.xp,
            " XP"
          ] })
        ] })
      ] }, i))
    ] }),
    /* @__PURE__ */ jsx13("div", { style: { height: 28 } })
  ] });
}

// src/screens/ProgressScreen.jsx
var ProgressScreen_exports = {};
__export(ProgressScreen_exports, {
  ProgressScreen: () => ProgressScreen
});
import { useState as useState12, useMemo as useMemo7 } from "react";

// src/store/mastery.js
var MASTERY = {
  LOCKED: 0,
  // pas encore ouverte
  SEEN: 1,
  // lue
  UNDERSTOOD: 2,
  // questions réussies
  ANCHORED: 3
  // questions retenues dans la durée
};
var MASTERY_LABELS = {
  0: "\xC0 d\xE9couvrir",
  1: "Vu",
  2: "Compris",
  3: "Ancr\xE9"
};
var MASTERY_HINTS = {
  0: "Ouvre la le\xE7on pour commencer",
  1: "R\xE9ussis ses questions pour passer \xE0 \xAB compris \xBB",
  2: "Reviens la r\xE9viser dans les semaines qui viennent pour l'ancrer",
  3: "Retenu dans la dur\xE9e"
};
var ANCHOR_DAYS = 21;
var ANCHOR_RATIO = 0.8;
var quizRequisPourAncrer = (n) => Math.max(1, Math.ceil(n * ANCHOR_RATIO));
var questionReussie = (state, quizId) => !!state?.quizResults?.[quizId]?.correct;
function questionAncree(state, quizId) {
  const h = state?.reviewHistory?.[quizId];
  if (!h) return false;
  if ((h.interval || 0) < ANCHOR_DAYS) return false;
  return (h.successes || 0) > 0;
}
function lessonMastery(lesson, state, quizIndex = null) {
  const completee = !!state?.completedLessons?.[lesson?.id];
  const ids = (lesson?.quiz || []).filter((id) => !quizIndex || quizIndex.has(id));
  const total = ids.length;
  const reussies = ids.filter((id) => questionReussie(state, id)).length;
  const ancrees = ids.filter((id) => questionAncree(state, id)).length;
  const requis = quizRequisPourAncrer(total);
  const masterable = total > 0;
  let level = MASTERY.LOCKED;
  if (completee) level = MASTERY.SEEN;
  if (completee && masterable && reussies === total) level = MASTERY.UNDERSTOOD;
  if (completee && masterable && reussies === total && ancrees >= requis) level = MASTERY.ANCHORED;
  let pct = 0;
  if (completee) {
    pct = 33;
    if (masterable) {
      pct += Math.round(33 * (total ? reussies / total : 0));
      pct += Math.round(34 * (requis ? Math.min(1, ancrees / requis) : 0));
    } else {
      pct = 33;
    }
  }
  return {
    level,
    label: MASTERY_LABELS[level],
    hint: MASTERY_HINTS[level],
    masterable,
    total,
    reussies,
    ancrees,
    requisPourAncrer: requis,
    pct: Math.min(100, pct)
  };
}
function masteryStats(content, state, moduleId = null) {
  const quizIndex = new Map((content?.quiz || []).map((q) => [q.id, q]));
  const lecons = (content?.courses || []).filter((c) => !moduleId || c.id === moduleId).flatMap((c) => (c.lessons || []).map((l) => ({ ...l, courseId: c.id })));
  const paliers = [0, 0, 0, 0];
  let masterables = 0, sansQuiz = 0, sommePct = 0;
  for (const l of lecons) {
    const m = lessonMastery(l, state, quizIndex);
    paliers[m.level]++;
    if (m.masterable) masterables++;
    else sansQuiz++;
    sommePct += m.pct;
  }
  const total = lecons.length;
  return {
    total,
    sansQuiz,
    // Une leçon sans question ne compte que pour un palier (vu).
    objectifs: masterables * 3 + sansQuiz,
    atteints: paliers[1] + paliers[2] * 2 + paliers[3] * 3,
    aDecouvrir: paliers[0],
    vues: paliers[1],
    comprises: paliers[2],
    ancrees: paliers[3],
    pctMoyen: total ? Math.round(sommePct / total) : 0
  };
}
function prochainesAAncrer(content, state, limite = 5) {
  const quizIndex = new Map((content?.quiz || []).map((q) => [q.id, q]));
  const lecons = (content?.courses || []).flatMap((c) => (c.lessons || []).map((l) => ({ ...l, courseId: c.id })));
  return lecons.map((l) => ({ lesson: l, m: lessonMastery(l, state, quizIndex) })).filter((x) => x.m.level === MASTERY.UNDERSTOOD && x.m.masterable).map((x) => ({ ...x, reste: x.m.requisPourAncrer - x.m.ancrees })).sort((a, b) => a.reste - b.reste || b.m.ancrees - a.m.ancrees).slice(0, limite);
}

// src/store/grades.js
var GRADES = [
  {
    id: "bebe_rockeur",
    minLevel: 1,
    label: "B\xE9b\xE9 rockeur",
    blurb: "Tu poses les bases, un accord \xE0 la fois.",
    rarity: "commun",
    tint: "amber",
    icon: "ti-baby-carriage"
  },
  {
    id: "gratteur_dimanche",
    minLevel: 5,
    label: "Gratteur du dimanche",
    blurb: "Tu tiens un rythme de pratique r\xE9gulier.",
    rarity: "commun",
    tint: "green",
    icon: "ti-guitar-pick"
  },
  {
    id: "campeur_feu_camp",
    minLevel: 10,
    label: "Guitariste de feu de camp",
    blurb: "Assez solide pour animer un moment autour d'un feu de camp.",
    rarity: "rare",
    tint: "coral",
    icon: "ti-campfire"
  },
  {
    id: "chevalier_riffs",
    minLevel: 15,
    label: "Chevalier des riffs",
    blurb: "La technique tient la route, riffs compris.",
    rarity: "rare",
    tint: "primary",
    icon: "ti-sword"
  },
  {
    id: "seigneur_solo",
    minLevel: 20,
    label: "Seigneur du solo",
    blurb: "Tu improvises avec de vraies intentions musicales.",
    rarity: "epique",
    tint: "pink",
    icon: "ti-crown"
  },
  {
    id: "star_legendaire",
    minLevel: 30,
    label: "Star l\xE9gendaire",
    blurb: "Niveau de jeu et d'oreille au sommet du Parcours.",
    rarity: "legend",
    tint: "primary",
    icon: "ti-trophy"
  }
];
function gradeForLevel(level) {
  let current = GRADES[0];
  for (const g of GRADES) {
    if (level >= g.minLevel) current = g;
  }
  return current;
}

// src/store/badges.js
var buildBadgeTints = (C) => ({
  primary: { bg: C.primaryL, border: C.primaryBorder, icon: C.primary, text: C.primaryD },
  green: { bg: C.greenL, border: C.greenBorder, icon: C.green, text: C.greenD },
  amber: { bg: C.amberL, border: C.amberBorder, icon: C.amber, text: C.amberD },
  coral: { bg: C.coralL, border: C.coralBorder, icon: C.coral, text: C.coralD },
  pink: { bg: C.pinkL, border: "#EFC4D5", icon: C.pink, text: "#85304E" },
  blue: { bg: C.blueL, border: C.blueBorder, icon: C.blue, text: C.blueD }
});
var buildBadgeRarities = (C) => ({
  commun: { label: "commun", bg: "#E5E3DC", fg: "#5F5E5A" },
  rare: { label: "rare", bg: "#D8D3F6", fg: C.primaryD },
  epique: { label: "\xE9pique", bg: C.coralBorder, fg: C.coralD },
  legend: { label: "l\xE9gend.", bg: C.primary, fg: "#FFFFFF" }
});
var BADGE_TINTS = buildBadgeTints(LIGHT);
var BADGE_RARITIES = buildBadgeRarities(LIGHT);
var skillMastery = (state, content, courseId) => {
  const exs = content.exercises.filter((e) => e.mod === courseId);
  const qzs = content.quiz.filter((q) => q.courseId === courseId);
  if (exs.length === 0 && qzs.length === 0) return 0;
  const exDone = exs.length > 0 ? exs.filter((e) => state.completedExercises[e.id]).length / exs.length : null;
  const qzOk = qzs.length > 0 ? qzs.filter((q) => state.quizResults[q.id]?.correct).length / qzs.length : null;
  if (exDone !== null && qzOk !== null) return Math.round((exDone * 0.6 + qzOk * 0.4) * 100);
  return Math.round((exDone ?? qzOk) * 100);
};
var allModulesMastered = (state, content) => content.courses.every((c) => {
  const total = c.lessons.length;
  const done = c.lessons.filter((l) => state.completedLessons[l.id]).length;
  return total > 0 && done === total;
});
var perfectQuizCount = (state) => Object.values(state.quizResults).filter((r) => r.correct && r.attempts === 1).length;
var GRADE_BADGES = GRADES.map((g) => ({
  id: `grade_${g.id}`,
  cat: "Grade",
  tint: g.tint,
  rarity: g.rarity,
  icon: g.icon,
  label: g.label,
  cond: (s) => s.level >= g.minLevel
}));
var BADGES = [
  // ── Premiers pas
  { id: "first_lesson", cat: "Premiers pas", tint: "primary", rarity: "commun", icon: "ti-flag", label: "Premi\xE8re le\xE7on", cond: (s) => Object.keys(s.completedLessons).length >= 1 },
  { id: "first_exercise", cat: "Premiers pas", tint: "green", rarity: "commun", icon: "ti-guitar-pick", label: "Premier exercice", cond: (s) => Object.keys(s.completedExercises).length >= 1 },
  { id: "first_quiz", cat: "Premiers pas", tint: "amber", rarity: "commun", icon: "ti-help-circle", label: "Premier quiz", cond: (s) => Object.keys(s.quizResults).length >= 1 },
  // ── Streak
  { id: "streak_3", cat: "Streak", tint: "amber", rarity: "commun", icon: "ti-flame", label: "3 jours", cond: (s) => s.streak >= 3 },
  { id: "streak_7", cat: "Streak", tint: "coral", rarity: "rare", icon: "ti-flame", label: "7 jours", cond: (s) => s.streak >= 7 },
  { id: "streak_30", cat: "Streak", tint: "coral", rarity: "epique", icon: "ti-flame", label: "30 jours", cond: (s) => s.streak >= 30 },
  // ── Expérience
  { id: "xp_500", cat: "Exp\xE9rience", tint: "primary", rarity: "commun", icon: "ti-star", label: "500 XP", cond: (s) => s.xp >= 500 },
  { id: "xp_2000", cat: "Exp\xE9rience", tint: "primary", rarity: "rare", icon: "ti-bolt", label: "2 000 XP", cond: (s) => s.xp >= 2e3 },
  { id: "xp_5000", cat: "Exp\xE9rience", tint: "primary", rarity: "legend", icon: "ti-trophy", label: "5 000 XP", cond: (s) => s.xp >= 5e3 },
  // ── Maîtrise exercices
  { id: "ex_10", cat: "Ma\xEEtrise", tint: "green", rarity: "commun", icon: "ti-circle-check", label: "10 exercices", cond: (s) => Object.keys(s.completedExercises).length >= 10 },
  { id: "ex_25", cat: "Ma\xEEtrise", tint: "green", rarity: "rare", icon: "ti-target-arrow", label: "25 exercices", cond: (s) => Object.keys(s.completedExercises).length >= 25 },
  { id: "ex_100", cat: "Ma\xEEtrise", tint: "green", rarity: "legend", icon: "ti-medal", label: "100 exercices", cond: (s) => Object.keys(s.completedExercises).length >= 100 },
  // ── Skill (par module)
  { id: "skill_neck", cat: "Skill", tint: "amber", rarity: "rare", icon: "ti-map-2", label: "Manche ma\xEEtris\xE9", cond: (s, ctx) => skillMastery(s, ctx, "neck") >= 80 },
  { id: "skill_scales", cat: "Skill", tint: "green", rarity: "rare", icon: "ti-music", label: "Modes ma\xEEtris\xE9s", cond: (s, ctx) => skillMastery(s, ctx, "scales") >= 80 },
  { id: "skill_harmony", cat: "Skill", tint: "primary", rarity: "rare", icon: "ti-stack-2", label: "Harmonie pro", cond: (s, ctx) => skillMastery(s, ctx, "harmony") >= 80 },
  { id: "skill_rhythm", cat: "Skill", tint: "blue", rarity: "rare", icon: "ti-metronome", label: "Rythme solide", cond: (s, ctx) => skillMastery(s, ctx, "rhythm") >= 80 },
  { id: "skill_impro", cat: "Skill", tint: "pink", rarity: "rare", icon: "ti-wand", label: "Improvisateur", cond: (s, ctx) => skillMastery(s, ctx, "impro") >= 80 },
  // ── Quiz
  { id: "quiz_perfect", cat: "Quiz", tint: "amber", rarity: "commun", icon: "ti-circle-check", label: "Quiz parfait", cond: (s) => perfectQuizCount(s) >= 1 },
  { id: "quiz_50", cat: "Quiz", tint: "amber", rarity: "rare", icon: "ti-target", label: "50 quiz r\xE9ussis", cond: (s) => Object.values(s.quizResults).filter((r) => r.correct).length >= 50 },
  { id: "quiz_100", cat: "Quiz", tint: "amber", rarity: "epique", icon: "ti-crown", label: "100 quiz r\xE9ussis", cond: (s) => Object.values(s.quizResults).filter((r) => r.correct).length >= 100 },
  // ── Leçons
  { id: "lessons_25", cat: "Le\xE7ons", tint: "primary", rarity: "commun", icon: "ti-book-2", label: "25 le\xE7ons", cond: (s) => Object.keys(s.completedLessons).length >= 25 },
  { id: "lessons_50", cat: "Le\xE7ons", tint: "primary", rarity: "rare", icon: "ti-books", label: "50 le\xE7ons", cond: (s) => Object.keys(s.completedLessons).length >= 50 },
  // ── Pratique
  { id: "practice_10", cat: "Pratique", tint: "coral", rarity: "rare", icon: "ti-dice-5", label: "10 d\xE9fis libres", cond: (s) => (s.practiceLibre?.count || 0) >= 10 },
  { id: "daily_30", cat: "Pratique", tint: "coral", rarity: "epique", icon: "ti-bolt", label: "30 d\xE9fis du jour", cond: (s) => (s.dailyChallengeCount || 0) >= 30 },
  { id: "all_modules", cat: "Pratique", tint: "green", rarity: "legend", icon: "ti-mountain", label: "5 modules finis", cond: (s, ctx) => allModulesMastered(s, ctx) },
  // ── Régularité
  { id: "full_week", cat: "R\xE9gularit\xE9", tint: "pink", rarity: "rare", icon: "ti-calendar-check", label: "Semaine pleine", cond: (s) => s.streak >= 7 && (s.weeklyGoals?.sessions || 0) >= 7 },
  // ── Maîtrise (paliers) ──────────────────────────────────────────────────
  // Le palier « ancré » ne s'obtient qu'en revenant sur une leçon plusieurs
  // fois sur plusieurs semaines : c'est le seul indicateur de l'app qu'on ne
  // peut pas obtenir en une soirée. Sans badge dédié, cet effort resterait
  // invisible — noyé dans le total d'XP, indiscernable d'une leçon lue une
  // seule fois.
  { id: "anchor_1", cat: "Ma\xEEtrise", tint: "green", rarity: "commun", icon: "ti-anchor", label: "Premier ancrage", cond: (s, ctx) => anchoredCount(s, ctx) >= 1 },
  { id: "anchor_10", cat: "Ma\xEEtrise", tint: "green", rarity: "rare", icon: "ti-anchor", label: "10 le\xE7ons ancr\xE9es", cond: (s, ctx) => anchoredCount(s, ctx) >= 10 },
  { id: "anchor_30", cat: "Ma\xEEtrise", tint: "green", rarity: "epique", icon: "ti-anchor", label: "30 le\xE7ons ancr\xE9es", cond: (s, ctx) => anchoredCount(s, ctx) >= 30 },
  // ── Grade (généré depuis grades.js)
  ...GRADE_BADGES
];
var _cacheEtat = null;
var _cacheValeur = 0;
function anchoredCount(state, content) {
  if (state === _cacheEtat) return _cacheValeur;
  _cacheEtat = state;
  _cacheValeur = masteryStats(content, state).ancrees;
  return _cacheValeur;
}

// src/screens/ProgressScreen.jsx
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
function ProgressScreen({ state, content, onOpenSettings }) {
  const C = useC();
  const MODULE_THEME2 = buildModuleTheme(C);
  const BADGE_TINTS2 = buildBadgeTints(C);
  const BADGE_RARITIES2 = buildBadgeRarities(C);
  const { xpInLevel, xpNeeded, xpToNext, pct: lvlPct, totalForNext } = levelProgress(state.xp);
  const grade = gradeForLevel(state.level);
  const maitrise = useMemo7(
    () => masteryStats(content, state),
    [content, state.completedLessons, state.quizResults, state.reviewHistory]
  );
  const aAncrer = useMemo7(
    () => prochainesAAncrer(content, state, 3),
    [content, state.completedLessons, state.quizResults, state.reviewHistory]
  );
  const skills = useMemo7(() => [
    { label: "Manche", id: "neck", color: C.amber, colorD: C.amberD },
    { label: "Gammes", id: "scales", color: C.green, colorD: C.greenD },
    { label: "Harmonie", id: "harmony", color: C.purple, colorD: C.purpleD },
    { label: "Rythme", id: "rhythm", color: C.blue, colorD: C.blueD },
    { label: "Impro", id: "impro", color: C.pink, colorD: C.pinkD }
  ].map((s) => ({ ...s, pct: skillMastery(state, content, s.id) })), [state, content]);
  const badgesByCategory = useMemo7(() => {
    const map = {};
    BADGES.forEach((b) => {
      if (!map[b.cat]) map[b.cat] = [];
      map[b.cat].push(b);
    });
    return map;
  }, []);
  return /* @__PURE__ */ jsxs12("div", { children: [
    /* @__PURE__ */ jsxs12("div", { style: {
      backgroundColor: "#b7a0c8",
      backgroundImage: "url('/sunrise.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      padding: "24px 20px 20px",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx14("div", { style: { position: "absolute", inset: 0, background: "rgba(120,50,10,.48)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs12("div", { style: { position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsxs12("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, children: [
          /* @__PURE__ */ jsx14("div", { style: { fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }, children: "Progression" }),
          /* @__PURE__ */ jsxs12("button", { onClick: onOpenSettings, style: {
            background: "rgba(255,255,255,.18)",
            border: "1.5px solid rgba(255,255,255,.3)",
            borderRadius: R.sm,
            padding: "7px 12px",
            fontSize: 12,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
            fontFamily: FONTS.ui,
            display: "flex",
            alignItems: "center",
            gap: 5,
            backdropFilter: "blur(4px)"
          }, children: [
            /* @__PURE__ */ jsx14(Ti, { name: "settings", size: 13, color: "#fff" }),
            " R\xE9glages"
          ] })
        ] }),
        /* @__PURE__ */ jsxs12("div", { style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }, children: [
          /* @__PURE__ */ jsx14(Ti, { name: grade.icon.replace("ti-", ""), size: 19, color: "#fff" }),
          /* @__PURE__ */ jsx14("span", { style: { fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-.2px" }, children: grade.label })
        ] }),
        /* @__PURE__ */ jsxs12("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxs12("div", { style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,.2)",
            border: "1.5px solid rgba(255,255,255,.35)",
            borderRadius: R.md,
            padding: "8px 16px",
            backdropFilter: "blur(4px)"
          }, children: [
            /* @__PURE__ */ jsx14("span", { style: { fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-.5px" }, children: state.level }),
            /* @__PURE__ */ jsx14("span", { style: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.8)" }, children: "Niveau" })
          ] }),
          /* @__PURE__ */ jsxs12("div", { style: {
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(255,255,255,.18)",
            border: "1.5px solid rgba(255,255,255,.3)",
            borderRadius: 99,
            padding: "7px 13px",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            backdropFilter: "blur(4px)"
          }, children: [
            /* @__PURE__ */ jsx14(Ti, { name: "flame", size: 14, color: "#fff" }),
            state.streak,
            " jours",
            (state.streakFreezes || 0) > 0 && /* @__PURE__ */ jsxs12("span", { style: { fontSize: 11, fontWeight: 700, opacity: 0.85 }, children: [
              "\xB7 ",
              state.streakFreezes,
              " gel",
              state.streakFreezes > 1 ? "s" : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs12("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 5 }, children: [
          /* @__PURE__ */ jsxs12("span", { style: { fontSize: 13, fontWeight: 700, color: "#fff" }, children: [
            state.xp,
            " XP total"
          ] }),
          /* @__PURE__ */ jsxs12("span", { style: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.8)" }, children: [
            "Niv. ",
            state.level + 1,
            " \u2192 ",
            totalForNext,
            " XP"
          ] })
        ] }),
        /* @__PURE__ */ jsx14("div", { style: { height: 8, background: "rgba(255,255,255,.25)", borderRadius: 99, overflow: "hidden" }, children: /* @__PURE__ */ jsx14("div", { style: { width: `${lvlPct}%`, height: "100%", background: `linear-gradient(90deg,#FF9155,${C.primary})`, borderRadius: 99, transition: "width .4s ease" } }) }),
        /* @__PURE__ */ jsxs12("div", { style: { fontSize: 11, color: "rgba(255,255,255,.65)", marginTop: 4 }, children: [
          xpToNext,
          " XP pour le niveau ",
          state.level + 1
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs12("div", { style: { padding: "16px 20px 0" }, children: [
      /* @__PURE__ */ jsx14("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }, children: [
        { ic: "flame", v: `${state.streak}j`, l: "S\xE9rie", bg: C.amberL, ic_c: C.amber, v_c: C.amberD },
        { ic: "circle-check", v: Object.keys(state.completedExercises).length, l: "Exercices", bg: C.greenL, ic_c: C.green, v_c: C.greenD },
        { ic: "book-2", v: Object.keys(state.completedLessons).length, l: "Le\xE7ons", bg: C.primaryL, ic_c: C.primary, v_c: C.primaryD }
      ].map((s) => /* @__PURE__ */ jsxs12("div", { style: {
        background: s.bg,
        borderRadius: R.lg,
        padding: "12px 8px",
        textAlign: "center",
        border: `1.5px solid ${s.bg === C.amberL ? C.amberBorder : s.bg === C.greenL ? C.greenBorder : C.primaryBorder}`
      }, children: [
        /* @__PURE__ */ jsx14(Ti, { name: s.ic, size: 18, color: s.ic_c }),
        /* @__PURE__ */ jsx14("div", { style: { fontSize: 20, fontWeight: 800, color: s.v_c, letterSpacing: "-.5px", marginTop: 4, lineHeight: 1 }, children: s.v }),
        /* @__PURE__ */ jsx14("div", { style: { fontSize: 10, color: s.v_c, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".05em", marginTop: 3, opacity: 0.7 }, children: s.l })
      ] }, s.l)) }),
      /* @__PURE__ */ jsx14("div", { style: { marginBottom: 20 }, children: /* @__PURE__ */ jsx14(
        GropiTip,
        {
          pose: state.streak >= 7 ? "rocker" : state.streak >= 3 ? "happy" : state.streak === 0 ? "pride" : "wave",
          tint: state.streak >= 7 ? "green" : state.streak === 0 ? "primary" : "primary",
          eyebrow: "Gropi te parle",
          children: state.streak >= 7 ? `${state.streak} jours d'affil\xE9e. Tu tiens une vraie habitude, continue.` : state.streak >= 3 ? `S\xE9rie de ${state.streak} jours. La r\xE9gularit\xE9, c'est 80 % du chemin.` : state.streak === 0 ? "Ta s\xE9rie est retomb\xE9e \xE0 z\xE9ro. Une seule session suffit pour en relancer une." : "Chaque session compte. Reviens demain pour continuer ta progression."
        }
      ) }),
      /* @__PURE__ */ jsx14("div", { style: { fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 12, letterSpacing: "-.2px" }, children: "Ma\xEEtrise" }),
      /* @__PURE__ */ jsxs12("div", { style: {
        background: C.surface,
        border: `1.5px solid ${C.border}`,
        borderRadius: R.lg,
        padding: "14px 16px",
        marginBottom: 20
      }, children: [
        /* @__PURE__ */ jsxs12("div", { style: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }, children: [
          /* @__PURE__ */ jsx14("span", { style: { fontSize: 26, fontWeight: 800, color: C.text, letterSpacing: "-.5px", lineHeight: 1 }, children: maitrise.atteints }),
          /* @__PURE__ */ jsxs12("span", { style: { fontSize: 13, color: C.text2, fontWeight: 600 }, children: [
            "/ ",
            maitrise.objectifs,
            " objectifs"
          ] })
        ] }),
        /* @__PURE__ */ jsx14("div", { style: { fontSize: 11.5, color: C.text2, marginBottom: 12, lineHeight: 1.5 }, children: "Chaque le\xE7on vaut trois paliers : la voir, la comprendre, l'ancrer." }),
        /* @__PURE__ */ jsx14(
          ProgressBar,
          {
            pct: maitrise.objectifs ? Math.round(maitrise.atteints / maitrise.objectifs * 100) : 0,
            color: C.primary,
            h: 7,
            label: "Ma\xEEtrise globale"
          }
        ),
        /* @__PURE__ */ jsx14("div", { style: { display: "flex", gap: 8, marginTop: 14 }, children: [
          { n: maitrise.vues, l: MASTERY_LABELS[1], c: C.text2 },
          { n: maitrise.comprises, l: MASTERY_LABELS[2], c: C.blueInk ?? C.blue },
          { n: maitrise.ancrees, l: MASTERY_LABELS[3], c: C.greenInk ?? C.green }
        ].map((x) => /* @__PURE__ */ jsxs12("div", { style: {
          flex: 1,
          textAlign: "center",
          padding: "9px 4px",
          background: C.surface2,
          borderRadius: R.md
        }, children: [
          /* @__PURE__ */ jsx14("div", { style: { fontSize: 19, fontWeight: 800, color: x.c, lineHeight: 1 }, children: x.n }),
          /* @__PURE__ */ jsx14("div", { style: { fontSize: 10.5, color: C.text2, fontWeight: 600, marginTop: 3 }, children: x.l })
        ] }, x.l)) }),
        aAncrer.length > 0 && /* @__PURE__ */ jsxs12("div", { style: { marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }, children: [
          /* @__PURE__ */ jsx14("div", { style: {
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: ".07em",
            textTransform: "uppercase",
            color: C.text2,
            marginBottom: 8
          }, children: "Bient\xF4t ancr\xE9es" }),
          aAncrer.map(({ lesson, reste }) => /* @__PURE__ */ jsxs12("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            padding: "6px 0"
          }, children: [
            /* @__PURE__ */ jsx14("span", { style: { fontSize: 12.5, color: C.text, flex: 1, lineHeight: 1.4 }, children: lesson.title }),
            /* @__PURE__ */ jsxs12("span", { style: { fontSize: 11, color: C.text2, whiteSpace: "nowrap", fontWeight: 600 }, children: [
              reste,
              " question",
              reste > 1 ? "s" : ""
            ] })
          ] }, lesson.id))
        ] })
      ] }),
      /* @__PURE__ */ jsx14("div", { style: { fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 12, letterSpacing: "-.2px" }, children: "Comp\xE9tences" }),
      skills.map((sk) => {
        const th = MODULE_THEME2[sk.id] || {};
        return /* @__PURE__ */ jsxs12("div", { style: {
          background: C.surface,
          border: `1.5px solid ${C.border}`,
          borderRadius: R.lg,
          padding: "13px 16px",
          marginBottom: 8
        }, children: [
          /* @__PURE__ */ jsxs12("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }, children: [
            /* @__PURE__ */ jsx14("div", { style: {
              width: 34,
              height: 34,
              borderRadius: R.sm,
              background: th.colorL || C.primaryL,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }, children: /* @__PURE__ */ jsx14(Ti, { name: (th.icon || "music").replace("ti-", ""), size: 15, color: sk.color }) }),
            /* @__PURE__ */ jsx14("span", { style: { fontSize: 13.5, fontWeight: 700, color: C.text, flex: 1 }, children: sk.label }),
            /* @__PURE__ */ jsxs12("span", { style: { fontSize: 13, fontWeight: 800, color: sk.pct > 0 ? sk.color : C.text3 }, children: [
              sk.pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx14(ProgressBar, { pct: sk.pct, color: sk.color, h: 5 })
        ] }, sk.label);
      }),
      /* @__PURE__ */ jsxs12("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "20px 0 10px" }, children: [
        /* @__PURE__ */ jsx14("div", { style: { fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }, children: "Badges" }),
        /* @__PURE__ */ jsxs12("div", { style: { fontSize: 12, fontWeight: 600, color: C.text3 }, children: [
          state.unlockedBadges.length,
          " / ",
          BADGES.length
        ] })
      ] }),
      Object.entries(badgesByCategory).map(([cat, badges]) => /* @__PURE__ */ jsxs12("div", { children: [
        /* @__PURE__ */ jsx14("div", { style: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: C.text3, margin: "8px 0 8px" }, children: cat }),
        /* @__PURE__ */ jsx14("div", { style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 8 }, children: badges.map((b) => {
          const ok = state.unlockedBadges.includes(b.id);
          const tint = BADGE_TINTS2[b.tint];
          const rarity = BADGE_RARITIES2[b.rarity];
          return /* @__PURE__ */ jsxs12("div", { style: {
            borderRadius: R.md,
            padding: "10px 6px",
            textAlign: "center",
            border: `1.5px solid ${tint.border}`,
            background: tint.bg,
            position: "relative",
            opacity: ok ? 1 : 0.3,
            filter: ok ? "none" : "grayscale(.5)"
          }, children: [
            /* @__PURE__ */ jsx14("span", { style: {
              position: "absolute",
              top: 4,
              right: 4,
              fontSize: 7,
              fontWeight: 700,
              padding: "1px 4px",
              borderRadius: 3,
              letterSpacing: ".05em",
              textTransform: "uppercase",
              background: rarity.bg,
              color: rarity.fg
            }, children: rarity.label }),
            /* @__PURE__ */ jsx14(Ti, { name: b.icon.replace("ti-", ""), size: 22, color: tint.icon }),
            /* @__PURE__ */ jsx14("div", { style: { fontSize: 9.5, fontWeight: 600, lineHeight: 1.25, marginTop: 5, color: tint.text }, children: b.label })
          ] }, b.id);
        }) })
      ] }, cat)),
      /* @__PURE__ */ jsx14("div", { style: { height: 28 } })
    ] })
  ] });
}

// src/screens/SettingsScreen.jsx
var SettingsScreen_exports = {};
__export(SettingsScreen_exports, {
  SettingsScreen: () => SettingsScreen
});
import { useState as useState13 } from "react";
import { jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
function SettingsSection({ title, children }) {
  const C = useC();
  return /* @__PURE__ */ jsxs13("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, marginBottom: 10, overflow: "hidden" }, children: [
    /* @__PURE__ */ jsx15("div", { style: { padding: "12px 16px 0", fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: C.text2 }, children: title }),
    /* @__PURE__ */ jsx15("div", { style: { marginTop: 8 }, children })
  ] });
}
function SettingsRow({ label, value, last }) {
  const C = useC();
  return /* @__PURE__ */ jsxs13("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderBottom: last ? "none" : `1px solid ${C.borderSoft}` }, children: [
    /* @__PURE__ */ jsx15("span", { style: { fontSize: T.small, fontWeight: 600, color: C.text }, children: label }),
    /* @__PURE__ */ jsx15("span", { style: { fontSize: T.small, fontWeight: 600, color: C.text2 }, children: value })
  ] });
}
function SettingsScreen({ state, dispatch, content, onClose, onImported, user, onSignOut, onDeleteAccount }) {
  const C = useC();
  const [importStatus, setImportStatus] = useState13(null);
  const [confirmation, setConfirmation] = useState13(null);
  const [saisie, setSaisie] = useState13("");
  const [audioOffline, setAudioOffline] = useState13(null);
  const fermerConfirmation = () => {
    setConfirmation(null);
    setSaisie("");
  };
  const faireResetProgress = () => {
    dispatch({ type: "RESET" });
    setImportStatus({ ok: true, msg: "Progression r\xE9initialis\xE9e. Cette remise \xE0 z\xE9ro sera propag\xE9e \xE0 tes autres appareils." });
    fermerConfirmation();
  };
  const faireSuppressionCompte = async () => {
    fermerConfirmation();
    setImportStatus({ ok: true, msg: "Suppression en cours\u2026" });
    const res = await onDeleteAccount?.();
    if (!res?.ok) {
      setImportStatus({ ok: false, msg: `La suppression a \xE9chou\xE9 : ${res?.error || "erreur inconnue"}. R\xE9essaie ou \xE9cris-nous.` });
    }
  };
  const activerAudioOffline = () => {
    if (!("serviceWorker" in navigator)) {
      setAudioOffline({ ok: false, msg: "Ton navigateur ne g\xE8re pas le mode hors-ligne." });
      return;
    }
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg?.active) {
        setAudioOffline({ ok: false, msg: "Mode hors-ligne indisponible pour l'instant. Recharge l'app et r\xE9essaie." });
        return;
      }
      setAudioOffline({ ok: true, msg: `T\xE9l\xE9chargement des ${SAMPLE_COUNT} sons\u2026` });
      const auMessage = (e) => {
        if (e.data?.type !== "AUDIO_CACHED") return;
        navigator.serviceWorker.removeEventListener("message", auMessage);
        setAudioOffline(e.data.count === e.data.total ? { ok: true, msg: `Les ${e.data.count} sons sont disponibles hors-ligne.` } : { ok: false, msg: `${e.data.count} sons sur ${e.data.total} enregistr\xE9s. R\xE9essaie avec une meilleure connexion.` });
      };
      navigator.serviceWorker.addEventListener("message", auMessage);
      reg.active.postMessage({ type: "PRECACHE_AUDIO", urls: listSampleUrls() });
    });
  };
  const exportProgress = () => {
    const payload = { exportedAt: (/* @__PURE__ */ new Date()).toISOString(), app: "Groply", version: 4, state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groply-progression-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportStatus({ ok: true, msg: "Progression export\xE9e." });
  };
  const btn = (color, border) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: R.md,
    fontSize: T.small,
    fontWeight: 700,
    minHeight: 48,
    cursor: "pointer",
    fontFamily: FONTS.ui,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
    background: C.surface,
    color,
    border: `1.5px solid ${border || color}`
  });
  return /* @__PURE__ */ jsxs13("div", { children: [
    /* @__PURE__ */ jsxs13("div", { style: {
      backgroundColor: "#4a4a4a",
      backgroundImage: "url('/atelier.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 60%",
      padding: "22px 20px 18px",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx15("div", { style: { position: "absolute", inset: 0, background: "rgba(20,18,16,.6)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsx15("button", { onClick: onClose, style: { position: "relative", zIndex: 1, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.sm, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 14 }, children: /* @__PURE__ */ jsx15(Ti, { name: "arrow-left", size: 17, color: C.text }) }),
      /* @__PURE__ */ jsx15("div", { style: { position: "relative", zIndex: 1, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }, children: "R\xE9glages" })
    ] }),
    /* @__PURE__ */ jsxs13("div", { style: { padding: "14px 20px 0" }, children: [
      /* @__PURE__ */ jsx15(SettingsSection, { title: "Apparence", children: /* @__PURE__ */ jsxs13("div", { style: { padding: "12px 16px 14px" }, children: [
        /* @__PURE__ */ jsx15("div", { style: { fontSize: 12, color: C.text2, marginBottom: 10 }, children: "Th\xE8me de l'application" }),
        /* @__PURE__ */ jsx15("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
          { val: "auto", label: "Auto", icon: "device-desktop", desc: "Suit le syst\xE8me" },
          { val: "light", label: "Clair", icon: "sun", desc: "Toujours clair" },
          { val: "dark", label: "Sombre", icon: "moon", desc: "Toujours sombre" }
        ].map((opt) => {
          const active = (state.theme || "auto") === opt.val;
          return /* @__PURE__ */ jsxs13(
            "button",
            {
              onClick: () => dispatch({ type: "SET_THEME", theme: opt.val }),
              className: "gr-focus",
              "aria-pressed": active,
              style: {
                width: "100%",
                padding: "13px 14px",
                borderRadius: R.md,
                cursor: "pointer",
                fontFamily: FONTS.ui,
                textAlign: "left",
                minHeight: 48,
                border: `1.5px solid ${active ? C.primary : C.borderStrong}`,
                background: active ? C.primaryL : C.surface,
                display: "flex",
                alignItems: "center",
                gap: 12
              },
              children: [
                /* @__PURE__ */ jsx15(Ti, { name: opt.icon, size: 20, color: active ? C.primaryInk : C.text2 }),
                /* @__PURE__ */ jsxs13("span", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ jsx15("span", { style: { display: "block", fontSize: T.small, fontWeight: 700, color: active ? C.primaryD : C.text }, children: opt.label }),
                  /* @__PURE__ */ jsx15("span", { style: { display: "block", fontSize: T.micro, color: C.text2, lineHeight: 1.4 }, children: opt.desc })
                ] }),
                active && /* @__PURE__ */ jsx15(Ti, { name: "check", size: 18, color: C.primaryInk })
              ]
            },
            opt.val
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsx15(SettingsSection, { title: "Compte", children: /* @__PURE__ */ jsx15(SettingsRow, { label: "Email", value: user?.email || "\u2014", last: true }) }),
      /* @__PURE__ */ jsxs13("button", { onClick: onSignOut, className: "gr-focus", style: btn(C.text2, C.borderStrong), children: [
        /* @__PURE__ */ jsx15(Ti, { name: "logout", size: 16, color: C.text2 }),
        " Se d\xE9connecter"
      ] }),
      /* @__PURE__ */ jsxs13(SettingsSection, { title: "Contenu p\xE9dagogique", children: [
        /* @__PURE__ */ jsx15(SettingsRow, { label: "Modules", value: content.courses.length }),
        /* @__PURE__ */ jsx15(SettingsRow, { label: "Quiz", value: `${content.quiz.length} questions` }),
        /* @__PURE__ */ jsx15(SettingsRow, { label: "Exercices", value: content.exercises.length, last: true })
      ] }),
      /* @__PURE__ */ jsxs13(SettingsSection, { title: "Ma progression", children: [
        /* @__PURE__ */ jsx15(SettingsRow, { label: "XP total", value: `${state.xp ?? 0} XP` }),
        /* @__PURE__ */ jsx15(SettingsRow, { label: "Grade", value: gradeForLevel(state.level).label }),
        /* @__PURE__ */ jsx15(SettingsRow, { label: "Niveau actuel", value: state.level }),
        /* @__PURE__ */ jsx15(SettingsRow, { label: "Badges d\xE9bloqu\xE9s", value: `${state.unlockedBadges.length} / ${BADGES.length}`, last: true })
      ] }),
      /* @__PURE__ */ jsxs13("button", { onClick: exportProgress, className: "gr-focus", style: btn(C.text2, C.borderStrong), children: [
        /* @__PURE__ */ jsx15(Ti, { name: "download", size: 14, color: C.text2 }),
        " Exporter ma progression (JSON)"
      ] }),
      /* @__PURE__ */ jsxs13("button", { onClick: () => setConfirmation("resetProgress"), className: "gr-focus", style: btn(C.danger), children: [
        /* @__PURE__ */ jsx15(Ti, { name: "refresh", size: 14, color: C.danger }),
        " R\xE9initialiser ma progression"
      ] }),
      /* @__PURE__ */ jsx15(SettingsSection, { title: "Audio", children: /* @__PURE__ */ jsxs13("div", { style: { padding: "4px 16px 14px" }, children: [
        /* @__PURE__ */ jsx15("p", { style: { margin: "0 0 12px", fontSize: T.small, color: C.text2, lineHeight: 1.6 }, children: "Les sons de guitare sont t\xE9l\xE9charg\xE9s \xE0 la premi\xE8re \xE9coute. Tu peux les enregistrer maintenant pour qu'ils fonctionnent sans connexion \u2014 compte quelques m\xE9gaoctets, \xE0 faire de pr\xE9f\xE9rence en Wi-Fi." }),
        /* @__PURE__ */ jsxs13("button", { onClick: activerAudioOffline, className: "gr-focus", style: { ...btn(C.text2, C.borderStrong), marginBottom: 0 }, children: [
          /* @__PURE__ */ jsx15(Ti, { name: "download", size: 16, color: C.text2 }),
          " Rendre l'audio disponible hors-ligne"
        ] }),
        audioOffline && /* @__PURE__ */ jsx15("p", { role: "status", style: {
          margin: "10px 0 0",
          fontSize: T.micro,
          lineHeight: 1.5,
          color: audioOffline.ok ? C.greenD : C.dangerInk
        }, children: audioOffline.msg })
      ] }) }),
      /* @__PURE__ */ jsxs13("div", { style: {
        border: `1.5px solid ${C.danger}`,
        borderRadius: R.lg,
        padding: "14px 16px",
        marginTop: 18,
        marginBottom: 10,
        background: C.surface
      }, children: [
        /* @__PURE__ */ jsx15("div", { style: { fontSize: T.micro, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: C.dangerInk, marginBottom: 10 }, children: "Zone irr\xE9versible" }),
        /* @__PURE__ */ jsx15("p", { style: { margin: "0 0 12px", fontSize: T.small, color: C.text2, lineHeight: 1.6 }, children: "La suppression de compte efface d\xE9finitivement ton email, ta progression et ton historique de nos serveurs. Aucune sauvegarde n'est conserv\xE9e. Pense \xE0 exporter ta progression avant, si tu veux en garder une copie." }),
        /* @__PURE__ */ jsxs13(
          "button",
          {
            onClick: () => setConfirmation("deleteAccount"),
            className: "gr-focus",
            style: { ...btn(C.dangerInk, C.danger), marginBottom: 0 },
            children: [
              /* @__PURE__ */ jsx15(Ti, { name: "trash", size: 16, color: C.dangerInk }),
              " Supprimer mon compte et mes donn\xE9es"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs13("div", { style: { display: "flex", gap: 14, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsx15("a", { href: "/cgu.html", style: { fontSize: T.micro, color: C.text2 }, children: "Conditions d'utilisation" }),
        /* @__PURE__ */ jsx15("a", { href: "/confidentialite.html", style: { fontSize: T.micro, color: C.text2 }, children: "Confidentialit\xE9" })
      ] }),
      importStatus && /* @__PURE__ */ jsxs13("div", { style: {
        background: importStatus.ok ? C.greenL : C.dangerL,
        border: `1.5px solid ${importStatus.ok ? C.greenBorder : C.dangerBorder}`,
        borderRadius: R.md,
        padding: "11px 14px",
        marginTop: 12,
        display: "flex",
        gap: 8,
        alignItems: "flex-start"
      }, role: "status", children: [
        /* @__PURE__ */ jsx15(Ti, { name: importStatus.ok ? "check" : "alert-circle", size: 16, color: importStatus.ok ? C.greenD : C.dangerInk }),
        /* @__PURE__ */ jsx15("p", { style: { margin: 0, fontSize: T.small, color: importStatus.ok ? C.greenD : C.text, lineHeight: 1.5 }, children: importStatus.msg })
      ] }),
      /* @__PURE__ */ jsx15("div", { style: { height: 28 } })
    ] }),
    confirmation === "resetProgress" && /* @__PURE__ */ jsx15(
      ConfirmDialog,
      {
        danger: true,
        titre: "R\xE9initialiser ta progression ?",
        message: "XP, niveau, badges, s\xE9ries, historique de r\xE9vision : tout repart de z\xE9ro, sur cet appareil comme sur les autres. Ton objectif et ton temps disponible sont conserv\xE9s. Cette action est d\xE9finitive.",
        confirmLabel: "Tout r\xE9initialiser",
        motDeConfirmation: "EFFACER",
        saisie,
        onSaisie: setSaisie,
        onConfirm: faireResetProgress,
        onCancel: fermerConfirmation
      }
    ),
    confirmation === "deleteAccount" && /* @__PURE__ */ jsx15(
      ConfirmDialog,
      {
        danger: true,
        titre: "Supprimer ton compte ?",
        message: `Le compte ${user?.email || ""} et toutes ses donn\xE9es seront effac\xE9s de nos serveurs, sans possibilit\xE9 de r\xE9cup\xE9ration. Tu seras d\xE9connect\xE9 imm\xE9diatement.`,
        confirmLabel: "Supprimer d\xE9finitivement",
        motDeConfirmation: "SUPPRIMER",
        saisie,
        onSaisie: setSaisie,
        onConfirm: faireSuppressionCompte,
        onCancel: fermerConfirmation
      }
    )
  ] });
}

// src/screens/ToolboxScreen.jsx
var ToolboxScreen_exports = {};
__export(ToolboxScreen_exports, {
  ToolboxScreen: () => ToolboxScreen
});
import { useState as useState15, useRef as useRef8, useEffect as useEffect10, useCallback as useCallback3 } from "react";
init_tone_stub();

// src/screens/FretboardExplorer.jsx
var FretboardExplorer_exports = {};
__export(FretboardExplorer_exports, {
  FretboardExplorer: () => FretboardExplorer
});
import { useState as useState14, useMemo as useMemo9, useRef as useRef7, useEffect as useEffect9 } from "react";

// src/diagrams.jsx
import { useMemo as useMemo8 } from "react";
import { jsx as jsx16, jsxs as jsxs14 } from "react/jsx-runtime";
var FONT = '"Josefin Sans", "Roboto", sans-serif';
function DiagramCard({ caption, children, accent }) {
  const DC = useC();
  const dotColor = accent || DC.primary;
  return /* @__PURE__ */ jsxs14("div", { style: {
    background: DC.surface,
    borderRadius: 14,
    border: `1px solid ${DC.border}`,
    overflow: "hidden",
    marginBottom: 0
  }, children: [
    /* @__PURE__ */ jsx16("div", { style: { overflowX: "auto", WebkitOverflowScrolling: "touch" }, children }),
    caption && /* @__PURE__ */ jsxs14("div", { style: {
      padding: "8px 14px 10px",
      fontSize: 11,
      color: DC.text2,
      fontFamily: FONT,
      fontWeight: 500,
      letterSpacing: "0.02em",
      borderTop: `1px solid ${DC.border}`,
      display: "flex",
      alignItems: "center",
      gap: 6
    }, children: [
      /* @__PURE__ */ jsx16("span", { style: { width: 6, height: 6, borderRadius: "50%", background: dotColor, flexShrink: 0 } }),
      caption
    ] })
  ] });
}
var STRING_LABELS = ["Mi", "La", "R\xE9", "Sol", "Si", "Mi"];
function ChordDiagram({ data, caption }) {
  const DC = useC();
  const { name = "", frets = [], fingers = [], startFret = 1, barre } = data;
  const STRINGS = 6;
  const FRET_ROWS = 4;
  const COL_W = 32;
  const ROW_H = 30;
  const LEFT_PAD = 16;
  const TOP_PAD = 38;
  const BOT_PAD = 24;
  const NOTE_R = 10;
  const svgW = LEFT_PAD + (STRINGS - 1) * COL_W + 16;
  const svgH = TOP_PAD + FRET_ROWS * ROW_H + BOT_PAD;
  const sx = (i) => LEFT_PAD + i * COL_W;
  const fy = (f) => TOP_PAD + (f - startFret + 0.5) * ROW_H;
  return /* @__PURE__ */ jsx16(DiagramCard, { caption: caption || name, accent: DC.primary, children: /* @__PURE__ */ jsxs14(
    "svg",
    {
      width: "100%",
      viewBox: `0 0 ${svgW} ${svgH}`,
      style: { display: "block", maxWidth: 200, margin: "0 auto" },
      "aria-label": `Accord ${name}`,
      children: [
        /* @__PURE__ */ jsx16(
          "text",
          {
            x: svgW / 2,
            y: 14,
            textAnchor: "middle",
            fontSize: 13,
            fill: DC.primary,
            fontFamily: FONT,
            fontWeight: 700,
            children: name
          }
        ),
        startFret === 1 ? /* @__PURE__ */ jsx16(
          "rect",
          {
            x: LEFT_PAD - 2,
            y: TOP_PAD - 4,
            width: (STRINGS - 1) * COL_W + 4,
            height: 5,
            fill: DC.text,
            rx: 2
          }
        ) : /* @__PURE__ */ jsxs14(
          "text",
          {
            x: LEFT_PAD - 6,
            y: TOP_PAD + ROW_H / 2 + 4,
            textAnchor: "end",
            fontSize: 9,
            fill: DC.text3,
            fontFamily: FONT,
            children: [
              startFret,
              "fr"
            ]
          }
        ),
        Array.from({ length: FRET_ROWS + 1 }, (_, i) => /* @__PURE__ */ jsx16(
          "line",
          {
            x1: LEFT_PAD,
            y1: TOP_PAD + i * ROW_H,
            x2: LEFT_PAD + (STRINGS - 1) * COL_W,
            y2: TOP_PAD + i * ROW_H,
            stroke: DC.border,
            strokeWidth: 1.5
          },
          i
        )),
        Array.from({ length: STRINGS }, (_, i) => /* @__PURE__ */ jsx16(
          "line",
          {
            x1: sx(i),
            y1: TOP_PAD,
            x2: sx(i),
            y2: TOP_PAD + FRET_ROWS * ROW_H,
            stroke: DC.text3,
            strokeWidth: i === 0 ? 2.2 : i === 1 ? 1.9 : i === 2 ? 1.6 : i === 3 ? 1.3 : i === 4 ? 1.1 : 0.9
          },
          i
        )),
        STRING_LABELS.map((label, i) => /* @__PURE__ */ jsx16(
          "text",
          {
            x: sx(i),
            y: svgH - 6,
            textAnchor: "middle",
            fontSize: 8,
            fill: DC.text3,
            fontFamily: FONT,
            children: label
          },
          i
        )),
        barre && /* @__PURE__ */ jsx16(
          "rect",
          {
            x: sx(barre.from) - NOTE_R + 2,
            y: fy(barre.fret) - NOTE_R + 1,
            width: sx(barre.to) - sx(barre.from) + NOTE_R * 2 - 4,
            height: NOTE_R * 2 - 2,
            fill: DC.primary,
            rx: NOTE_R - 1
          }
        ),
        frets.map((f, i) => {
          const x = sx(i);
          if (f === -1) {
            return /* @__PURE__ */ jsx16(
              "text",
              {
                x,
                y: TOP_PAD - 10,
                textAnchor: "middle",
                fontSize: 11,
                fill: DC.coral,
                fontFamily: FONT,
                fontWeight: 700,
                children: "\xD7"
              },
              i
            );
          }
          if (f === 0) {
            return /* @__PURE__ */ jsx16(
              "circle",
              {
                cx: x,
                cy: TOP_PAD - 12,
                r: 6,
                fill: "none",
                stroke: DC.green,
                strokeWidth: 1.5
              },
              i
            );
          }
          const rowIdx = f - startFret;
          if (rowIdx < 0 || rowIdx >= FRET_ROWS) {
            console.warn(`[ChordDiagram] Note hors zone visible ignor\xE9e : corde ${i}, case ${f} (startFret=${startFret})`);
            return null;
          }
          const y = fy(f);
          const finger = fingers[i] || 0;
          return /* @__PURE__ */ jsxs14("g", { children: [
            /* @__PURE__ */ jsx16("circle", { cx: x, cy: y, r: NOTE_R, fill: DC.primary }),
            finger > 0 && /* @__PURE__ */ jsx16(
              "text",
              {
                x,
                y: y + 4,
                textAnchor: "middle",
                fontSize: 9,
                fill: "#fff",
                fontFamily: FONT,
                fontWeight: 700,
                children: finger === 5 ? "T" : finger
              }
            )
          ] }, i);
        })
      ]
    }
  ) });
}

// src/screens/FretboardExplorer.jsx
import { jsx as jsx17, jsxs as jsxs15 } from "react/jsx-runtime";
var ROOTS_FR2 = [
  { en: "C", fr: "Do" },
  { en: "C#", fr: "Do#" },
  { en: "D", fr: "Re" },
  { en: "D#", fr: "Re#" },
  { en: "E", fr: "Mi" },
  { en: "F", fr: "Fa" },
  { en: "F#", fr: "Fa#" },
  { en: "G", fr: "Sol" },
  { en: "G#", fr: "Sol#" },
  { en: "A", fr: "La" },
  { en: "A#", fr: "La#" },
  { en: "B", fr: "Si" }
];
var SCALE_OPTIONS = [
  { key: "pentatonic_minor", label: "Pentatonique mineure" },
  { key: "pentatonic_major", label: "Pentatonique majeure" },
  { key: "blues", label: "Blues" },
  { key: "major", label: "Majeure" },
  { key: "natural_minor", label: "Mineure naturelle" },
  { key: "harmonic_minor", label: "Mineure harmonique" },
  { key: "dorian", label: "Dorien" },
  { key: "phrygian", label: "Phrygien" },
  { key: "mixolydian", label: "Mixolydien" },
  { key: "lydian", label: "Lydien" },
  { key: "whole_tone", label: "Tons entiers" }
];
var CHORD_OPTIONS = [
  { key: "maj", label: "Majeur" },
  { key: "min", label: "Mineur" },
  { key: "dom7", label: "Dom7" },
  { key: "maj7", label: "Maj7" },
  { key: "min7", label: "Mineur 7" },
  { key: "min7b5", label: "Mi-diminue" },
  { key: "dim7", label: "Diminue 7" },
  { key: "sus2", label: "Sus2" },
  { key: "sus4", label: "Sus4" },
  { key: "add9", label: "Add9" }
];
var SCALE_INFO = {
  pentatonic_minor: { desc: "5 notes. La gamme du rock et du blues. Aucune fausse note sur un accord mineur.", usage: "Rock, Blues, Metal, Soul" },
  pentatonic_major: { desc: "5 notes. Version joyeuse. Parfaite pour le country et le pop.", usage: "Country, Pop, Folk" },
  blues: { desc: "Pentatonique mineure + la note bleue (b5). La note bleue = la couleur blues.", usage: "Blues, Jazz, Rock" },
  major: { desc: "7 notes. La gamme de reference. Toutes les autres gammes en decoulent.", usage: "Pop, Rock, Classique" },
  natural_minor: { desc: "7 notes. Sons sombres et melancoliques. Base du rock et du metal.", usage: "Rock, Metal, Classique" },
  harmonic_minor: { desc: "Mineure avec une 7e majeure. Son oriental et dramatique.", usage: "Metal, Flamenco, Classique" },
  dorian: { desc: "Mineur avec une 6te majeure. Son jazz-funk caracteristique.", usage: "Jazz, Fusion, Funk" },
  phrygian: { desc: "Mineur avec une 2de mineure. Son espagnol, flamenco et metal.", usage: "Metal, Flamenco, Fusion" },
  mixolydian: { desc: "Majeure avec une 7e mineure. Son rock-blues des grands solos.", usage: "Rock, Blues, Funk" },
  lydian: { desc: "Majeure avec un #4. Son flottant, cinematique et moderne.", usage: "Fusion, Prog, Cinema" },
  whole_tone: { desc: "6 notes, toutes espacees d'un ton. Son flou et onirique.", usage: "Jazz, Impressionnisme" }
};
var CHORD_INFO = {
  maj: { desc: "Fondamentale + tierce majeure + quinte. Son stable et joyeux.", formula: "1 - 3 - 5" },
  min: { desc: "Fondamentale + tierce mineure + quinte. Son melancolique.", formula: "1 - b3 - 5" },
  dom7: { desc: "Accord de tension. Veut se resoudre vers le I.", formula: "1 - 3 - 5 - b7" },
  maj7: { desc: "Son doux et jazzy. Guide tones : 3e et 7e majeure.", formula: "1 - 3 - 5 - 7" },
  min7: { desc: "Son jazz-funk. Le ii du ii-V-I.", formula: "1 - b3 - 5 - b7" },
  min7b5: { desc: "Mi-diminue (demi-diminue). Le vii de la gamme majeure.", formula: "1 - b3 - b5 - b7" },
  dim7: { desc: "Symetrique, tres tendu. Toutes les notes a 3 demi-tons.", formula: "1 - b3 - b5 - bb7" },
  sus2: { desc: "Pas de tierce -- son ouvert et suspendu.", formula: "1 - 2 - 5" },
  sus4: { desc: "Pas de tierce -- tension vers la quarte.", formula: "1 - 4 - 5" },
  add9: { desc: "Majeur avec une 9e ajoutee. Son moderne et riche.", formula: "1 - 3 - 5 - 9" }
};
function FretboardExplorer({ onBack, embedded = false }) {
  const C = useC();
  const [tab, setTab] = useState14("scale");
  const [root, setRoot] = useState14("A");
  const [scaleKey, setScaleKey] = useState14("pentatonic_minor");
  const [chordKey, setChordKey] = useState14("min7");
  const [displayMode, setDisplayMode] = useState14("notes");
  const [showRootPicker, setShowRootPicker] = useState14(false);
  const [isPlaying, setIsPlaying] = useState14(false);
  const [flashNotes, setFlashNotes] = useState14(null);
  const [arpeggio, setArpeggio] = useState14(true);
  const shapes = useMemo9(() => {
    if (tab !== "chord") return [];
    return getChordShapes(
      normalizeNote(root),
      chordKey,
      12,
      CHORD_TYPES[chordKey]?.intervals || null
    );
  }, [tab, root, chordKey]);
  const finTimerRef = useRef7(null);
  const annulerFin = () => {
    if (finTimerRef.current) {
      clearTimeout(finTimerRef.current);
      finTimerRef.current = null;
    }
  };
  const handleStop = () => {
    annulerFin();
    try {
      stopAll();
    } catch {
    }
    setIsPlaying(false);
    setFlashNotes(null);
  };
  const handlePlay = async () => {
    annulerFin();
    try {
      stopAll();
    } catch {
    }
    setIsPlaying(true);
    setFlashNotes(null);
    try {
      await unlockAudio();
    } catch {
    }
    const onStep = (i, note) => setFlashNotes(i < 0 ? null : note);
    let dureeMs2 = 2600;
    try {
      if (tab === "scale") {
        const notes = await playScaleFromRoot(root, scaleKey, 90, onStep);
        dureeMs2 = (notes?.length ?? 8) * (60 / 90) * 1e3 + 1600;
      } else if (arpeggio) {
        const notes = await playArpeggioFromRoot(root, chordKey, 132, onStep);
        dureeMs2 = (notes?.length ?? 4) * (60 / 132) * 1e3 + 1600;
      } else {
        await playChordFromRoot(root, chordKey);
        dureeMs2 = 2600;
      }
    } catch {
    }
    finTimerRef.current = setTimeout(() => {
      finTimerRef.current = null;
      setIsPlaying(false);
      setFlashNotes(null);
    }, dureeMs2);
  };
  useEffect9(() => () => {
    annulerFin();
    try {
      stopAll();
    } catch {
    }
  }, []);
  const activeNotes = useMemo9(() => {
    if (tab === "scale") return getScaleNotes(root, scaleKey);
    return getChordNotes(root, chordKey);
  }, [tab, root, scaleKey, chordKey]);
  const info = tab === "scale" ? SCALE_INFO[scaleKey] : CHORD_INFO[chordKey];
  const activeLabel = tab === "scale" ? SCALE_OPTIONS.find((s) => s.key === scaleKey)?.label ?? scaleKey : CHORD_OPTIONS.find((c) => c.key === chordKey)?.label ?? chordKey;
  const rootFr = ROOTS_FR2.find((r) => r.en === root)?.fr ?? root;
  const transposeSemitone = (dir) => {
    const idx = ROOTS_FR2.findIndex((r) => r.en === root);
    const next = (idx + dir + 12) % 12;
    setRoot(ROOTS_FR2[next].en);
  };
  return /* @__PURE__ */ jsxs15("div", { style: embedded ? { display: "flex", flexDirection: "column", background: "transparent" } : { display: "flex", flexDirection: "column", minHeight: "100dvh", background: C.bg }, children: [
    /* @__PURE__ */ jsxs15("div", { style: embedded ? { padding: "0 0 12px", display: "flex", alignItems: "center", gap: 10 } : { padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }, children: [
      !embedded && /* @__PURE__ */ jsx17("button", { onClick: onBack, style: { background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0, display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsx17(Ti, { name: "chevron-left", size: 22 }) }),
      /* @__PURE__ */ jsxs15("div", { style: { flex: 1 }, children: [
        !embedded && /* @__PURE__ */ jsx17("div", { style: { fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }, children: "Explorateur du manche" }),
        /* @__PURE__ */ jsxs15("div", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: [
          rootFr,
          " - ",
          activeLabel
        ] })
      ] }),
      /* @__PURE__ */ jsx17(
        "button",
        {
          onClick: isPlaying ? handleStop : handlePlay,
          "aria-label": isPlaying ? "Arr\xEAter la lecture" : "\xC9couter",
          className: "gr-focus",
          style: {
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: C.primary,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(232,93,26,0.3)"
          },
          children: /* @__PURE__ */ jsx17(Ti, { name: isPlaying ? "player-stop-filled" : "volume", size: 16, color: "#fff" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs15("div", { style: { padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingBottom: 32 }, children: [
      /* @__PURE__ */ jsx17("div", { style: { display: "flex", background: C.surface2, borderRadius: R.lg, padding: 3, gap: 2 }, children: [{ key: "scale", label: "Gammes", icon: "music" }, { key: "chord", label: "Accords", icon: "guitar-pick" }].map((t) => /* @__PURE__ */ jsxs15("button", { onClick: () => setTab(t.key), style: {
        flex: 1,
        padding: "9px 12px",
        borderRadius: R.md,
        border: "none",
        cursor: "pointer",
        fontFamily: FONTS.ui,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        background: tab === t.key ? C.surface : "transparent",
        boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        color: tab === t.key ? C.text : C.text3,
        fontSize: 13,
        fontWeight: tab === t.key ? 600 : 400,
        transition: "all 0.15s"
      }, children: [
        /* @__PURE__ */ jsx17(Ti, { name: t.icon, size: 14 }),
        t.label
      ] }, t.key)) }),
      /* @__PURE__ */ jsxs15("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx17("div", { style: { fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }, children: "Tonique" }),
        /* @__PURE__ */ jsx17("button", { onClick: () => transposeSemitone(-1), style: { width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx17(Ti, { name: "chevron-left", size: 16, color: C.text2 }) }),
        /* @__PURE__ */ jsx17("button", { onClick: () => setShowRootPicker(!showRootPicker), style: { flex: 1, height: 34, borderRadius: 10, border: `1.5px solid ${C.primary}`, background: C.primaryL, cursor: "pointer", fontSize: 16, fontWeight: 700, color: C.primaryD, fontFamily: FONTS.ui }, children: rootFr }),
        /* @__PURE__ */ jsx17("button", { onClick: () => transposeSemitone(1), style: { width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx17(Ti, { name: "chevron-right", size: 16, color: C.text2 }) })
      ] }),
      showRootPicker && /* @__PURE__ */ jsx17("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 10 }, children: ROOTS_FR2.map((r) => /* @__PURE__ */ jsx17("button", { onClick: () => {
        setRoot(r.en);
        setShowRootPicker(false);
      }, style: {
        padding: "8px 4px",
        borderRadius: 8,
        border: `1px solid ${root === r.en ? C.primary : C.border}`,
        background: root === r.en ? C.primaryL : C.bg,
        color: root === r.en ? C.primaryD : C.text,
        fontSize: 12,
        fontWeight: root === r.en ? 700 : 400,
        cursor: "pointer",
        fontFamily: FONTS.ui
      }, children: r.fr }, r.en)) }),
      /* @__PURE__ */ jsxs15("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx17("div", { style: { fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }, children: tab === "scale" ? "Gamme" : "Accord" }),
        /* @__PURE__ */ jsx17("div", { style: { flex: 1, overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsx17("div", { style: { display: "flex", gap: 6, paddingBottom: 4 }, children: (tab === "scale" ? SCALE_OPTIONS : CHORD_OPTIONS).map((opt) => {
          const active = tab === "scale" ? scaleKey === opt.key : chordKey === opt.key;
          return /* @__PURE__ */ jsx17("button", { onClick: () => tab === "scale" ? setScaleKey(opt.key) : setChordKey(opt.key), style: {
            flexShrink: 0,
            padding: "7px 12px",
            borderRadius: R.pill,
            border: `1.5px solid ${active ? C.primary : C.border}`,
            background: active ? C.primaryL : C.surface,
            color: active ? C.primaryD : C.text2,
            fontSize: 12,
            fontWeight: active ? 600 : 400,
            cursor: "pointer",
            fontFamily: FONTS.ui,
            whiteSpace: "nowrap"
          }, children: opt.label }, opt.key);
        }) }) })
      ] }),
      /* @__PURE__ */ jsx17("div", { style: { display: "flex", gap: 6 }, children: [{ key: "notes", label: "Notes" }, { key: "intervals", label: "Intervalles" }, { key: "degrees", label: "Degres" }].map((m) => /* @__PURE__ */ jsx17("button", { onClick: () => setDisplayMode(m.key), style: {
        flex: 1,
        padding: "7px 0",
        borderRadius: 8,
        border: `1px solid ${displayMode === m.key ? C.primary : C.border}`,
        background: displayMode === m.key ? C.primaryL : C.surface,
        color: displayMode === m.key ? C.primaryD : C.text3,
        fontSize: 11,
        fontWeight: displayMode === m.key ? 600 : 400,
        cursor: "pointer",
        fontFamily: FONTS.ui
      }, children: m.label }, m.key)) }),
      /* @__PURE__ */ jsx17("div", { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: "hidden" }, children: /* @__PURE__ */ jsx17("div", { style: { padding: "10px 8px 6px", overflowX: "auto", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsx17(
        Fretboard,
        {
          mode: tab === "scale" ? "scale" : "chord",
          root,
          scale: tab === "scale" ? scaleKey : void 0,
          chord: tab === "chord" ? chordKey : void 0,
          displayMode,
          lang: "fr",
          compact: true,
          flashNotes
        }
      ) }) }),
      tab === "chord" && /* @__PURE__ */ jsx17("div", { style: { display: "flex", gap: 6, marginBottom: 12 }, children: [
        { id: true, label: "Arp\xE9g\xE9", hint: "note \xE0 note" },
        { id: false, label: "Plaqu\xE9", hint: "d'un bloc" }
      ].map((m) => /* @__PURE__ */ jsxs15(
        "button",
        {
          onClick: () => setArpeggio(m.id),
          style: {
            flex: 1,
            padding: "8px 0",
            borderRadius: R.md,
            cursor: "pointer",
            border: `1.5px solid ${arpeggio === m.id ? C.primary : C.border}`,
            background: arpeggio === m.id ? C.primaryL : C.surface,
            color: arpeggio === m.id ? C.primaryD : C.text2,
            fontFamily: FONTS.ui
          },
          children: [
            /* @__PURE__ */ jsx17("div", { style: { fontSize: 12.5, fontWeight: 700 }, children: m.label }),
            /* @__PURE__ */ jsx17("div", { style: { fontSize: 10, opacity: 0.75, marginTop: 1 }, children: m.hint })
          ]
        },
        String(m.id)
      )) }),
      tab === "chord" && shapes.length > 0 && /* @__PURE__ */ jsxs15("div", { style: { marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxs15("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }, children: [
          shapes.length,
          " fa\xE7on",
          shapes.length > 1 ? "s" : "",
          " de le jouer"
        ] }),
        /* @__PURE__ */ jsx17("div", { style: { display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }, children: shapes.map((sh, i) => /* @__PURE__ */ jsx17("div", { style: { flexShrink: 0, width: 150 }, children: /* @__PURE__ */ jsx17(
          ChordDiagram,
          {
            data: { name: rootFr, frets: sh.frets, fingers: sh.fingers, startFret: sh.startFret, barre: sh.barre },
            caption: `${sh.label} \xB7 case ${sh.startFret}`
          }
        ) }, i)) })
      ] }),
      /* @__PURE__ */ jsxs15("div", { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px" }, children: [
        /* @__PURE__ */ jsxs15("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }, children: [
          "Notes - ",
          rootFr,
          " ",
          activeLabel
        ] }),
        /* @__PURE__ */ jsx17("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: activeNotes.map((note, i) => /* @__PURE__ */ jsxs15("div", { style: {
          padding: "5px 10px",
          borderRadius: R.pill,
          background: i === 0 ? C.amberL : C.primaryL,
          border: `1px solid ${i === 0 ? C.amberBorder : C.primaryBorder}`,
          fontSize: 13,
          fontWeight: i === 0 ? 700 : 500,
          color: i === 0 ? C.amberD : C.primaryD,
          fontFamily: FONTS.ui
        }, children: [
          noteToFr(note),
          i === 0 ? " R" : ""
        ] }, note)) }),
        tab === "chord" && CHORD_INFO[chordKey] && /* @__PURE__ */ jsxs15("div", { style: { marginTop: 8, fontSize: 12, color: C.text3, fontFamily: FONTS.ui }, children: [
          "Formule : ",
          /* @__PURE__ */ jsx17("strong", { style: { color: C.text2 }, children: CHORD_INFO[chordKey].formula })
        ] })
      ] }),
      info && /* @__PURE__ */ jsxs15("div", { style: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px" }, children: [
        /* @__PURE__ */ jsx17("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }, children: "Contexte" }),
        /* @__PURE__ */ jsx17("p", { style: { margin: "0 0 6px", fontSize: 13, color: C.text, fontFamily: FONTS.title, lineHeight: 1.55 }, children: info.desc }),
        "usage" in info && /* @__PURE__ */ jsxs15("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ jsx17(Ti, { name: "music", size: 12, color: C.text3 }),
          /* @__PURE__ */ jsx17("span", { style: { fontSize: 11, color: C.text3, fontFamily: FONTS.ui }, children: info.usage })
        ] })
      ] })
    ] })
  ] });
}

// src/screens/ToolboxScreen.jsx
import { jsx as jsx18, jsxs as jsxs16 } from "react/jsx-runtime";
function Metronome() {
  const C = useC();
  const pillBtn = {
    minWidth: 42,
    height: 42,
    borderRadius: 12,
    border: `1.5px solid ${C.border}`,
    background: C.surface,
    color: C.text2,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: FONTS.ui
  };
  const [bpm, setBpm] = useState15(90);
  const [playing, setPlaying] = useState15(false);
  const [beats, setBeats] = useState15(4);
  const [current, setCurrent] = useState15(-1);
  const [timbre, setTimbre] = useState15("bois");
  const TIMBRES = [
    { id: "bois", label: "Bois" },
    { id: "mecanique", label: "M\xE9canique" },
    { id: "batterie", label: "Batterie" }
  ];
  const voixRef = useRef8(null);
  const loopRef = useRef8(null);
  const beatRef = useRef8(0);
  const libererVoix = useCallback3(() => {
    try {
      voixRef.current?.dispose?.();
    } catch {
    }
    voixRef.current = null;
  }, []);
  const construireVoix = useCallback3((id) => {
    if (id === "bois") {
      const filtre = new Filter({ type: "bandpass", frequency: 1800, Q: 2.2 }).toDestination();
      const corps = new NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 5e-4, decay: 0.028, sustain: 0 }
      }).connect(filtre);
      corps.volume.value = -8;
      return {
        fort: (t) => {
          filtre.frequency.setValueAtTime(2600, t);
          corps.triggerAttackRelease(0.02, t, 1);
        },
        faible: (t) => {
          filtre.frequency.setValueAtTime(1500, t);
          corps.triggerAttackRelease(0.02, t, 0.55);
        },
        dispose: () => {
          corps.dispose();
          filtre.dispose();
        }
      };
    }
    if (id === "mecanique") {
      const filtre = new Filter({ type: "bandpass", frequency: 1400, Q: 3 }).toDestination();
      const tic = new NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 5e-4, decay: 0.022, sustain: 0 }
      }).connect(filtre);
      tic.volume.value = -11;
      const cloche = new MetalSynth({
        harmonicity: 5.1,
        modulationIndex: 16,
        resonance: 3e3,
        octaves: 1.2,
        envelope: { attack: 1e-3, decay: 0.42, release: 0.12 }
      }).toDestination();
      cloche.volume.value = -22;
      return {
        fort: (t) => cloche.triggerAttackRelease("C6", 0.12, t),
        faible: (t) => tic.triggerAttackRelease(0.02, t, 0.7),
        dispose: () => {
          tic.dispose();
          filtre.dispose();
          cloche.dispose();
        }
      };
    }
    const grosse = new MembraneSynth({
      pitchDecay: 0.035,
      octaves: 5,
      envelope: { attack: 1e-3, decay: 0.22, sustain: 0 }
    }).toDestination();
    grosse.volume.value = -7;
    const passeHaut = new Filter({ type: "highpass", frequency: 7500 }).toDestination();
    const charley = new NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 1e-3, decay: 0.026, sustain: 0 }
    }).connect(passeHaut);
    charley.volume.value = -17;
    return {
      fort: (t) => grosse.triggerAttackRelease("C1", "8n", t),
      faible: (t) => charley.triggerAttackRelease(0.02, t, 0.6),
      dispose: () => {
        grosse.dispose();
        charley.dispose();
        passeHaut.dispose();
      }
    };
  }, []);
  const ensureClick = useCallback3(async () => {
    await start();
    if (!voixRef.current) voixRef.current = construireVoix(timbre);
  }, [timbre, construireVoix]);
  const stop = useCallback3(() => {
    if (loopRef.current) {
      loopRef.current.stop();
      loopRef.current.dispose();
      loopRef.current = null;
    }
    getTransport().stop();
    setPlaying(false);
    setCurrent(-1);
    beatRef.current = 0;
  }, []);
  const start2 = useCallback3(async () => {
    await ensureClick();
    beatRef.current = 0;
    const transport = getTransport();
    transport.bpm.value = bpm;
    loopRef.current = new Loop((time) => {
      const b = beatRef.current % beats;
      const strong = b === 0;
      const voix = voixRef.current;
      if (voix) (strong ? voix.fort : voix.faible)(time);
      getDraw().schedule(() => setCurrent(b), time);
      beatRef.current += 1;
    }, "4n").start(0);
    transport.start();
    setPlaying(true);
  }, [bpm, beats, ensureClick]);
  useEffect10(() => {
    getTransport().bpm.value = bpm;
  }, [bpm]);
  useEffect10(() => {
    if (!voixRef.current) return;
    libererVoix();
    voixRef.current = construireVoix(timbre);
  }, [timbre, construireVoix, libererVoix]);
  useEffect10(() => () => {
    stop();
    libererVoix();
  }, [stop, libererVoix]);
  const toggle = () => playing ? stop() : start2();
  const nudge = (d) => setBpm((v) => Math.min(240, Math.max(40, v + d)));
  const ECART_MIN_MS = 200;
  const ECART_MAX_MS = 2e3;
  const TAPS_MAX = 8;
  const tapsRef = useRef8([]);
  const [tapCount, setTapCount] = useState15(0);
  const tapTempo = () => {
    const now2 = performance.now();
    const taps = tapsRef.current;
    const dernier = taps[taps.length - 1];
    if (dernier !== void 0) {
      const ecart = now2 - dernier;
      if (ecart < ECART_MIN_MS) return;
      if (ecart > ECART_MAX_MS) {
        tapsRef.current = [now2];
        setTapCount(1);
        return;
      }
    }
    tapsRef.current = [...taps, now2].slice(-TAPS_MAX);
    setTapCount(tapsRef.current.length);
    if (tapsRef.current.length < 2) return;
    const ecarts = [];
    for (let i = 1; i < tapsRef.current.length; i++) {
      ecarts.push(tapsRef.current[i] - tapsRef.current[i - 1]);
    }
    ecarts.sort((a, b) => a - b);
    const milieu = Math.floor(ecarts.length / 2);
    const median = ecarts.length % 2 ? ecarts[milieu] : (ecarts[milieu - 1] + ecarts[milieu]) / 2;
    setBpm(Math.min(240, Math.max(40, Math.round(6e4 / median))));
  };
  const resetTap = () => {
    tapsRef.current = [];
    setTapCount(0);
  };
  const aideTap = tapCount === 0 ? "Tape le tempo au doigt, au moins deux fois." : tapCount === 1 ? "Continue : il faut un second appui pour mesurer." : `Tempo mesur\xE9 sur ${tapCount - 1} intervalle${tapCount > 2 ? "s" : ""}.`;
  const tempoLabel = bpm < 60 ? "Largo" : bpm < 76 ? "Adagio" : bpm < 108 ? "Andante" : bpm < 120 ? "Moderato" : bpm < 156 ? "Allegro" : bpm < 176 ? "Vivace" : "Presto";
  return /* @__PURE__ */ jsxs16("div", { children: [
    /* @__PURE__ */ jsx18("div", { style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      margin: "8px 0 22px",
      height: 24
      // hauteur figée : plus de décalage vertical
    }, children: Array.from({ length: beats }).map((_, i) => {
      const on = current === i;
      const strong = i === 0;
      const teinte = strong ? C.primary : C.amber;
      return /* @__PURE__ */ jsx18("div", { style: {
        width: 24,
        height: 24,
        // taille de boîte constante
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }, children: /* @__PURE__ */ jsx18("div", { style: {
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: on ? teinte : C.border,
        transform: on ? "scale(1.35)" : "scale(1)",
        boxShadow: on ? `0 0 0 4px ${teinte}22` : "none",
        // On ne transitionne QUE transform et les couleurs — jamais
        // `all`, qui embarquerait aussi les propriétés de mise en page.
        transition: "transform .08s ease, background-color .08s ease, box-shadow .08s ease",
        willChange: "transform"
      } }) }, i);
    }) }),
    /* @__PURE__ */ jsxs16("div", { style: { textAlign: "center", marginBottom: 6 }, children: [
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 64, fontWeight: 800, color: C.text, letterSpacing: "-2px", lineHeight: 1, fontFamily: FONTS.title }, children: bpm }),
      /* @__PURE__ */ jsxs16("div", { style: { fontSize: 12, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: ".1em", marginTop: 2 }, children: [
        "BPM \xB7 ",
        tempoLabel
      ] })
    ] }),
    /* @__PURE__ */ jsx18(
      "input",
      {
        type: "range",
        min: "40",
        max: "240",
        value: bpm,
        onChange: (e) => setBpm(+e.target.value),
        style: { width: "100%", margin: "16px 0 6px", accentColor: C.primary }
      }
    ),
    /* @__PURE__ */ jsxs16("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 20 }, children: [
      [-5, -1].map((d) => /* @__PURE__ */ jsx18("button", { onClick: () => nudge(d), style: pillBtn, children: d }, d)),
      /* @__PURE__ */ jsx18("button", { onClick: toggle, style: {
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        background: `linear-gradient(135deg,#FF9155,${C.primary})`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 6px 20px ${C.primary}55`
      }, children: /* @__PURE__ */ jsx18(Ti, { name: playing ? "player-pause" : "player-play", size: 30, color: "#fff" }) }),
      [1, 5].map((d) => /* @__PURE__ */ jsxs16("button", { onClick: () => nudge(d), style: pillBtn, children: [
        "+",
        d
      ] }, d))
    ] }),
    /* @__PURE__ */ jsxs16("div", { style: {
      background: C.surface,
      border: `1.5px solid ${C.border}`,
      borderRadius: R.lg,
      padding: "10px 12px",
      marginBottom: 10
    }, children: [
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: C.text2, marginBottom: 8 }, children: "Son" }),
      /* @__PURE__ */ jsx18("div", { role: "radiogroup", "aria-label": "Timbre du m\xE9tronome", style: { display: "flex", gap: 6 }, children: TIMBRES.map((t) => {
        const actif = timbre === t.id;
        return /* @__PURE__ */ jsx18(
          "button",
          {
            role: "radio",
            "aria-checked": actif,
            onClick: () => setTimbre(t.id),
            className: "gr-focus",
            style: {
              flex: 1,
              padding: "11px 6px",
              borderRadius: R.md,
              minHeight: 44,
              border: `1.5px solid ${actif ? C.primary : C.border}`,
              background: actif ? C.primaryL : C.surface,
              color: actif ? C.primaryD : C.text2,
              fontWeight: 700,
              fontSize: 12.5,
              cursor: "pointer",
              fontFamily: FONTS.ui
            },
            children: t.label
          },
          t.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs16("div", { style: { display: "flex", gap: 10 }, children: [
      /* @__PURE__ */ jsxs16("div", { style: { flex: 1, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: "10px 12px" }, children: [
        /* @__PURE__ */ jsx18("div", { style: { fontSize: 9.5, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 7 }, children: "Mesure" }),
        /* @__PURE__ */ jsx18("div", { style: { display: "flex", gap: 6 }, children: [2, 3, 4, 6].map((n) => /* @__PURE__ */ jsx18("button", { onClick: () => setBeats(n), style: {
          flex: 1,
          padding: "7px 0",
          borderRadius: 8,
          cursor: "pointer",
          border: `1.5px solid ${beats === n ? C.primary : C.border}`,
          background: beats === n ? C.primaryL : C.surface,
          color: beats === n ? C.primaryD : C.text2,
          fontWeight: 700,
          fontSize: 13,
          fontFamily: FONTS.ui
        }, children: n }, n)) })
      ] }),
      /* @__PURE__ */ jsxs16(
        "button",
        {
          onClick: tapTempo,
          onDoubleClick: resetTap,
          "aria-label": tapCount > 0 ? `Tap tempo, ${tapCount} appuis compt\xE9s` : "Tap tempo",
          style: {
            width: 96,
            background: C.amberL,
            border: `1.5px solid ${C.amberBorder}`,
            borderRadius: R.lg,
            color: C.amberD,
            fontWeight: 700,
            fontSize: 13,
            fontFamily: FONTS.ui,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3
          },
          children: [
            /* @__PURE__ */ jsx18(Ti, { name: "hand-finger-down", size: 18, color: C.amber }),
            /* @__PURE__ */ jsx18("span", { style: { whiteSpace: "nowrap" }, children: "Tap tempo" }),
            /* @__PURE__ */ jsx18("div", { "aria-hidden": "true", style: {
              height: 6,
              display: "flex",
              gap: 3,
              alignItems: "center",
              justifyContent: "center"
            }, children: Array.from({ length: TAPS_MAX }).map((_, i) => /* @__PURE__ */ jsx18("div", { style: {
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: i < tapCount ? C.amber : "transparent",
              transition: "background-color .1s ease"
            } }, i)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx18("div", { role: "status", "aria-live": "polite", style: {
      minHeight: 18,
      marginTop: 8,
      textAlign: "center",
      fontSize: 11,
      color: C.text2,
      fontFamily: FONTS.ui,
      lineHeight: 1.5
    }, children: aideTap })
  ] });
}
var NOTE_NAMES = ["Do", "Do#", "R\xE9", "R\xE9#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
function noteToHz(name, oct) {
  const idx = NOTE_NAMES.indexOf(name);
  const midi = (oct + 1) * 12 + idx;
  return 440 * Math.pow(2, (midi - 69) / 12);
}
var TUNINGS = [
  // ── 6 cordes ──────────────────────────────────────────────
  {
    id: "standard",
    group: "6 cordes",
    label: "Standard (Mi)",
    courses: [[["Mi", 2]], [["La", 2]], [["R\xE9", 3]], [["Sol", 3]], [["Si", 3]], [["Mi", 4]]]
  },
  {
    id: "dropd",
    group: "6 cordes",
    label: "Drop D",
    courses: [[["R\xE9", 2]], [["La", 2]], [["R\xE9", 3]], [["Sol", 3]], [["Si", 3]], [["Mi", 4]]]
  },
  {
    id: "halfstep",
    group: "6 cordes",
    label: "Demi-ton plus bas (Mi\u266D)",
    courses: [[["R\xE9#", 2]], [["Sol#", 2]], [["Do#", 3]], [["Fa#", 3]], [["La#", 3]], [["R\xE9#", 4]]]
  },
  {
    id: "dadgad",
    group: "6 cordes",
    label: "DADGAD",
    courses: [[["R\xE9", 2]], [["La", 2]], [["R\xE9", 3]], [["Sol", 3]], [["La", 3]], [["R\xE9", 4]]]
  },
  {
    id: "openg",
    group: "6 cordes",
    label: "Open G",
    courses: [[["R\xE9", 2]], [["Sol", 2]], [["R\xE9", 3]], [["Sol", 3]], [["Si", 3]], [["R\xE9", 4]]]
  },
  {
    id: "opend",
    group: "6 cordes",
    label: "Open D",
    courses: [[["R\xE9", 2]], [["La", 2]], [["R\xE9", 3]], [["Fa#", 3]], [["La", 3]], [["R\xE9", 4]]]
  },
  {
    id: "opene",
    group: "6 cordes",
    label: "Open E",
    courses: [[["Mi", 2]], [["Si", 2]], [["Mi", 3]], [["Sol#", 3]], [["Si", 3]], [["Mi", 4]]]
  },
  // ── 12 cordes ─────────────────────────────────────────────
  {
    id: "twelve",
    group: "12 cordes",
    label: "12 cordes (standard)",
    courses: [
      [["Mi", 2], ["Mi", 3]],
      [["La", 2], ["La", 3]],
      [["R\xE9", 3], ["R\xE9", 4]],
      [["Sol", 3], ["Sol", 4]],
      [["Si", 3], ["Si", 3]],
      [["Mi", 4], ["Mi", 4]]
    ]
  },
  // ── Guitare portugaise (fado) — notes fournies par l'utilisateur ──
  {
    id: "fado",
    group: "Guitare portugaise",
    label: "Guitare portugaise (fado)",
    courses: [
      [["R\xE9", 4], ["R\xE9", 3]],
      [["La", 4], ["La", 3]],
      [["Si", 4], ["Si", 3]],
      [["Mi", 4], ["Mi", 4]],
      [["La", 4], ["La", 4]],
      [["Si", 4], ["Si", 4]]
    ]
  }
];
function buildTargets(tuning) {
  const targets = [];
  tuning.courses.forEach((course, ci) => {
    course.forEach(([name, oct]) => {
      targets.push({ name, oct, hz: noteToHz(name, oct), course: ci });
    });
  });
  return targets;
}
function freqToNote(freq) {
  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  const refFreq = 440 * Math.pow(2, (midi - 69) / 12);
  const cents = Math.round(1200 * Math.log2(freq / refFreq));
  return { name: NOTE_NAMES[(midi % 12 + 12) % 12], octave: Math.floor(midi / 12) - 1, cents };
}
var PITCH_MIN_HZ = 60;
var PITCH_MAX_HZ = 700;
function nsdfAt(x, N, lag) {
  let acf = 0, energy = 0;
  const n = N - lag;
  for (let i = 0; i < n; i++) {
    const a = x[i], b = x[i + lag];
    acf += a * b;
    energy += a * a + b * b;
  }
  return energy > 0 ? 2 * acf / energy : 0;
}
function detectPitch(buf, sampleRate) {
  const R2 = 2;
  const rate = sampleRate / R2;
  const minLag = Math.max(2, Math.floor(rate / PITCH_MAX_HZ));
  const maxLag = Math.ceil(rate / PITCH_MIN_HZ);
  const N = Math.min(Math.floor(buf.length / R2), maxLag * 3);
  if (N < maxLag + 2) return -1;
  const x = new Float32Array(N);
  for (let i = 0; i < N; i++) x[i] = buf[i * R2];
  let e0 = 0;
  for (let i = 0; i < N; i++) e0 += x[i] * x[i];
  if (Math.sqrt(e0 / N) < 12e-4) return -1;
  const nsdf = new Float32Array(maxLag + 2);
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    const v = nsdfAt(x, N, lag);
    nsdf[lag] = v;
    if (v > best) best = v;
  }
  if (best < 0.35) return -1;
  const thresh = best * 0.85;
  let coarse = -1;
  for (let i = minLag + 1; i < maxLag; i++) {
    if (nsdf[i] >= thresh && nsdf[i] >= nsdf[i - 1] && nsdf[i] >= nsdf[i + 1]) {
      coarse = i;
      break;
    }
  }
  if (coarse < 0) return -1;
  const center = coarse * R2;
  const lo = Math.max(2, center - R2 - 1);
  const hi = Math.min(Math.floor(buf.length / 3) - 1, center + R2 + 1);
  const NF = Math.min(buf.length, hi * 3);
  let bestLag = center, bestVal = -Infinity;
  const vals = {};
  for (let l = lo; l <= hi; l++) {
    const v = nsdfAt(buf, NF, l);
    vals[l] = v;
    if (v > bestVal) {
      bestVal = v;
      bestLag = l;
    }
  }
  let T0 = bestLag;
  const y1 = vals[bestLag - 1], y2 = vals[bestLag], y3 = vals[bestLag + 1];
  if (y1 !== void 0 && y3 !== void 0) {
    const a = (y1 + y3 - 2 * y2) / 2, b = (y3 - y1) / 2;
    if (a !== 0) {
      const shift = -b / (2 * a);
      if (Math.abs(shift) <= 1) T0 = bestLag + shift;
    }
  }
  const freq = sampleRate / T0;
  if (freq < PITCH_MIN_HZ || freq > PITCH_MAX_HZ) return -1;
  return freq;
}
function TuningPicker({ tuningId, setTuningId, compact = false }) {
  const C = useC();
  const groups = [...new Set(TUNINGS.map((t) => t.group))];
  return /* @__PURE__ */ jsx18(
    "select",
    {
      value: tuningId,
      onChange: (e) => setTuningId(e.target.value),
      style: {
        width: compact ? "100%" : "auto",
        maxWidth: "100%",
        appearance: "none",
        WebkitAppearance: "none",
        background: C.surface,
        border: `1.5px solid ${C.border}`,
        borderRadius: R.lg,
        padding: compact ? "10px 14px" : "11px 38px 11px 16px",
        fontSize: 13.5,
        fontWeight: 700,
        color: C.text,
        fontFamily: FONTS.ui,
        cursor: "pointer",
        textAlign: "center",
        textAlignLast: "center",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23${C.text3.replace("#", "")}' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center"
      },
      children: groups.map((g) => /* @__PURE__ */ jsx18("optgroup", { label: g, children: TUNINGS.filter((t) => t.group === g).map((t) => /* @__PURE__ */ jsx18("option", { value: t.id, children: t.label }, t.id)) }, g))
    }
  );
}
function Tuner() {
  const C = useC();
  const [active, setActive] = useState15(false);
  const [freq, setFreq] = useState15(0);
  const [note, setNote] = useState15(null);
  const [error, setError] = useState15(null);
  const [tuningId, setTuningId] = useState15("standard");
  const tuning = TUNINGS.find((t) => t.id === tuningId) || TUNINGS[0];
  const targets = buildTargets(tuning);
  const ctxRef = useRef8(null);
  const analyser = useRef8(null);
  const streamRef = useRef8(null);
  const rafRef = useRef8(null);
  const bufRef = useRef8(null);
  const freqHistRef = useRef8([]);
  const holdTimer = useRef8(null);
  const lastNoteRef = useRef8(null);
  const needleRef = useRef8(null);
  const needleLabelRef = useRef8(null);
  const centsTargetRef = useRef8(0);
  const centsShownRef = useRef8(0);
  const hasSignalRef = useRef8(false);
  const stop = useCallback3(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (ctxRef.current && ctxRef.current.state !== "closed") ctxRef.current.close();
    ctxRef.current = analyser.current = streamRef.current = null;
    centsTargetRef.current = 0;
    centsShownRef.current = 0;
    hasSignalRef.current = false;
    freqHistRef.current = [];
    setActive(false);
    setFreq(0);
    setNote(null);
  }, []);
  const start2 = useCallback3(async () => {
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false, latency: 0 }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") await ctx.resume();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 70;
      hp.Q.value = 0.5;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1400;
      lp.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.value = 4;
      const an = ctx.createAnalyser();
      an.fftSize = 8192;
      an.smoothingTimeConstant = 0;
      src.connect(hp);
      hp.connect(lp);
      lp.connect(gain);
      gain.connect(an);
      analyser.current = an;
      bufRef.current = new Float32Array(an.fftSize);
      freqHistRef.current = [];
      setActive(true);
      setError(null);
      let frame = 0;
      const tick = () => {
        frame++;
        if (frame % 2 === 0) {
          an.getFloatTimeDomainData(bufRef.current);
          const f = detectPitch(bufRef.current, ctx.sampleRate);
          if (f > 0) {
            const hist = freqHistRef.current;
            hist.push(f);
            if (hist.length > 5) hist.shift();
            const sorted = [...hist].sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];
            if (holdTimer.current) {
              clearTimeout(holdTimer.current);
              holdTimer.current = null;
            }
            lastNoteRef.current = median;
            const n = freqToNote(median);
            centsTargetRef.current = Math.max(-50, Math.min(50, n.cents));
            hasSignalRef.current = true;
            setNote(
              (prev) => prev && prev.name === n.name && prev.octave === n.octave && Math.abs(prev.cents - n.cents) < 3 ? prev : n
            );
            if (frame % 12 === 0) setFreq(median);
          } else {
            const hist = freqHistRef.current;
            if (hist.length > 0) hist.shift();
            if (hist.length === 0 && !holdTimer.current) {
              holdTimer.current = setTimeout(() => {
                setFreq(0);
                setNote(null);
                lastNoteRef.current = null;
                holdTimer.current = null;
                hasSignalRef.current = false;
                centsTargetRef.current = 0;
              }, 1500);
            }
          }
        }
        const target = centsTargetRef.current;
        const next = centsShownRef.current + (target - centsShownRef.current) * 0.16;
        centsShownRef.current = next;
        if (needleRef.current) {
          needleRef.current.style.transform = `translateX(${next}%)`;
        }
        if (needleLabelRef.current) {
          const shown = Math.round(next);
          needleLabelRef.current.textContent = hasSignalRef.current ? shown > 0 ? `+${shown}` : `${shown}` : "";
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      setError("Micro inaccessible. Autorise l'acc\xE8s au microphone dans ton navigateur.");
      setActive(false);
    }
  }, []);
  useEffect10(() => () => stop(), [stop]);
  const cents = note?.cents ?? 0;
  const inTune = active && note && Math.abs(cents) <= 5;
  const needleColor = inTune ? C.green : Math.abs(cents) < 20 ? C.amber : C.pink;
  const nearestCourse = freq > 0 ? targets.reduce((best, t) => {
    const d = Math.abs(1200 * Math.log2(freq / t.hz));
    return d < best.d ? { course: t.course, d } : best;
  }, { course: -1, d: Infinity }).course : -1;
  return /* @__PURE__ */ jsx18("div", { children: !active ? /* @__PURE__ */ jsxs16("div", { style: { textAlign: "center", padding: "10px 0 4px" }, children: [
    /* @__PURE__ */ jsx18(Gropi, { pose: "listen", size: 120, anim: "bob", style: { margin: "0 auto 6px" } }),
    /* @__PURE__ */ jsx18("p", { style: { fontSize: 13, color: C.text2, lineHeight: 1.55, maxWidth: 260, margin: "0 auto 16px" }, children: "Joue une corde \xE0 vide, Gropi \xE9coute et te dit si tu es juste." }),
    /* @__PURE__ */ jsx18(TuningPicker, { tuningId, setTuningId }),
    /* @__PURE__ */ jsxs16("button", { onClick: start2, style: {
      background: `linear-gradient(135deg,#FF9155,${C.primary})`,
      color: "#fff",
      border: "none",
      borderRadius: R.lg,
      padding: "13px 28px",
      fontSize: 14,
      fontWeight: 700,
      fontFamily: FONTS.ui,
      cursor: "pointer",
      boxShadow: `0 4px 16px ${C.primary}44`,
      marginTop: 18,
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }, children: [
      /* @__PURE__ */ jsx18(Ti, { name: "microphone", size: 16, color: "#fff" }),
      " Activer l'accordeur"
    ] }),
    error && /* @__PURE__ */ jsx18("p", { style: { fontSize: 12, color: C.pink, marginTop: 14, lineHeight: 1.5 }, children: error })
  ] }) : /* @__PURE__ */ jsxs16("div", { children: [
    /* @__PURE__ */ jsxs16("div", { style: { textAlign: "center", marginBottom: 6 }, children: [
      /* @__PURE__ */ jsxs16("div", { style: {
        fontSize: 72,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: "-2px",
        fontFamily: FONTS.title,
        color: inTune ? C.green : C.text,
        transition: "color .15s"
      }, children: [
        note ? note.name : "\u2014",
        note && /* @__PURE__ */ jsx18("span", { style: { fontSize: 28, fontWeight: 700, color: C.text3 }, children: note.octave })
      ] }),
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 13, fontWeight: 600, color: C.text3, marginTop: 2 }, children: freq > 0 ? `${freq.toFixed(1)} Hz` : "Joue une corde\u2026" })
    ] }),
    /* @__PURE__ */ jsxs16("div", { style: { position: "relative", height: 64, margin: "14px 0 8px", overflow: "hidden" }, children: [
      /* @__PURE__ */ jsx18("div", { style: { position: "absolute", left: 0, right: 0, top: 30, height: 3, background: C.border, borderRadius: 2 } }),
      /* @__PURE__ */ jsx18("div", { style: { position: "absolute", left: "calc(50% - 18px)", width: 36, top: 26, height: 11, background: `${C.green}33`, borderRadius: 6 } }),
      /* @__PURE__ */ jsx18("div", { style: { position: "absolute", left: "50%", top: 18, width: 2, height: 27, background: C.green, transform: "translateX(-50%)" } }),
      /* @__PURE__ */ jsx18("div", { style: { position: "absolute", left: 0, right: 0, top: 8, pointerEvents: "none" }, children: /* @__PURE__ */ jsxs16("div", { ref: needleRef, style: { width: "100%", transform: "translateX(0%)", willChange: "transform" }, children: [
        /* @__PURE__ */ jsx18("div", { style: {
          width: 0,
          height: 0,
          margin: "0 auto",
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: `14px solid ${needleColor}`,
          transition: "border-top-color .18s"
        } }),
        /* @__PURE__ */ jsx18("div", { ref: needleLabelRef, style: {
          fontSize: 11,
          fontWeight: 700,
          textAlign: "center",
          marginTop: 2,
          color: needleColor,
          transition: "color .18s"
        } })
      ] }) }),
      /* @__PURE__ */ jsx18("div", { style: { position: "absolute", left: 0, top: 46, fontSize: 9.5, color: C.text3, fontWeight: 600 }, children: "\u266D trop bas" }),
      /* @__PURE__ */ jsx18("div", { style: { position: "absolute", right: 0, top: 46, fontSize: 9.5, color: C.text3, fontWeight: 600 }, children: "trop haut \u266F" })
    ] }),
    inTune && /* @__PURE__ */ jsxs16("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }, children: [
      /* @__PURE__ */ jsx18(Ti, { name: "check", size: 15, color: C.green }),
      " Juste !"
    ] }),
    /* @__PURE__ */ jsx18("div", { style: { fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".07em", textAlign: "center", marginTop: 8 }, children: tuning.label }),
    /* @__PURE__ */ jsx18("div", { style: { display: "flex", justifyContent: "center", gap: 6, margin: "8px 0 18px", flexWrap: "wrap" }, children: tuning.courses.map((course, ci) => {
      const on = nearestCourse === ci;
      return /* @__PURE__ */ jsx18("div", { style: {
        minWidth: 42,
        textAlign: "center",
        padding: "7px 8px",
        borderRadius: 10,
        border: `1.5px solid ${on ? C.primary : C.border}`,
        background: on ? C.primaryL : C.surface,
        transition: "all .12s"
      }, children: course.map(([name, oct], k) => /* @__PURE__ */ jsxs16("div", { style: { lineHeight: 1.15 }, children: [
        /* @__PURE__ */ jsx18("span", { style: { fontSize: 13, fontWeight: 800, color: on ? C.primaryD : C.text }, children: name }),
        /* @__PURE__ */ jsx18("span", { style: { fontSize: 9, color: C.text3, fontWeight: 600 }, children: oct })
      ] }, k)) }, ci);
    }) }),
    /* @__PURE__ */ jsx18("div", { style: { marginBottom: 14 }, children: /* @__PURE__ */ jsx18(TuningPicker, { tuningId, setTuningId, compact: true }) }),
    /* @__PURE__ */ jsx18("button", { onClick: stop, style: {
      width: "100%",
      padding: 12,
      borderRadius: R.lg,
      border: `1.5px solid ${C.border}`,
      background: C.surface,
      color: C.text2,
      fontWeight: 700,
      fontSize: 13,
      fontFamily: FONTS.ui,
      cursor: "pointer"
    }, children: "Arr\xEAter l'accordeur" })
  ] }) });
}
var CHORD_ROOTS = [
  ["C", "Do"],
  ["C#", "Do#"],
  ["D", "R\xE9"],
  ["D#", "R\xE9#"],
  ["E", "Mi"],
  ["F", "Fa"],
  ["F#", "Fa#"],
  ["G", "Sol"],
  ["G#", "Sol#"],
  ["A", "La"],
  ["A#", "La#"],
  ["B", "Si"]
];
var CHORD_FAMILIES = [
  { id: "base", label: "Base", keys: ["maj", "min", "dim", "aug", "sus2", "sus4"] },
  { id: "sept", label: "7e / 6e", keys: ["dom7", "maj7", "min7", "min7b5", "dim7", "minMaj7", "dom7sus4", "maj6", "min6"] },
  { id: "neuf", label: "9e", keys: ["dom9", "maj9", "min9", "add9"] },
  { id: "ext", label: "11e / 13e", keys: ["dom11", "min11", "maj7s11", "dom13", "min13", "maj13"] },
  { id: "alt", label: "Alt\xE9r\xE9s", keys: ["dom7b9", "dom7s9", "dom7b5", "dom7s5"] }
];
var SPEED_PRESETS = [
  { id: "lent", label: "Lent", secs: 2.2 },
  { id: "normal", label: "Normal", secs: 1.4 },
  { id: "rapide", label: "Rapide", secs: 0.8 }
];
var MAX_CHORDS = 12;
function ChordPlayer() {
  const C = useC();
  const [root, setRoot] = useState15("C");
  const [family, setFamily] = useState15("base");
  const [quality, setQuality] = useState15("maj");
  const [sequence, setSequence] = useState15([]);
  const [playing, setPlaying] = useState15(false);
  const [activeIdx, setActiveIdx] = useState15(-1);
  const [speed, setSpeed] = useState15("normal");
  const stop = useCallback3(() => {
    stopAll();
    setPlaying(false);
    setActiveIdx(-1);
  }, []);
  useEffect10(() => () => stopAll(), []);
  const addChord = () => {
    if (sequence.length >= MAX_CHORDS) return;
    const rootFr = CHORD_ROOTS.find((r) => r[0] === root)?.[1] || root;
    const label = `${rootFr}${CHORD_TYPES[quality]?.sym ?? ""}`;
    setSequence((s) => [...s, { root, type: quality, label }]);
  };
  const removeChord = (i) => {
    setSequence((s) => s.filter((_, idx) => idx !== i));
  };
  const clearAll = () => {
    stop();
    setSequence([]);
  };
  const play = async () => {
    if (sequence.length === 0) return;
    const secs = SPEED_PRESETS.find((p) => p.id === speed)?.secs || 1.4;
    setPlaying(true);
    await playProgression(sequence, secs, (idx) => {
      setActiveIdx(idx);
      if (idx === -1) setPlaying(false);
    });
  };
  const toggle = () => playing ? stop() : play();
  const chip = {
    padding: "8px 10px",
    borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    background: C.surface,
    color: C.text2,
    fontWeight: 700,
    fontSize: 12.5,
    cursor: "pointer",
    fontFamily: FONTS.ui
  };
  return /* @__PURE__ */ jsxs16("div", { children: [
    /* @__PURE__ */ jsxs16("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16 }, children: [
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 12, fontWeight: 700, color: C.text3, marginBottom: 9, fontFamily: FONTS.ui }, children: "Fondamentale" }),
      /* @__PURE__ */ jsx18("div", { style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginBottom: 14 }, children: CHORD_ROOTS.map(([code, fr]) => /* @__PURE__ */ jsx18("button", { onClick: () => setRoot(code), style: {
        ...chip,
        padding: "9px 0",
        border: `1.5px solid ${root === code ? C.primary : C.border}`,
        background: root === code ? C.primaryL : C.surface,
        color: root === code ? C.primaryD : C.text2
      }, children: fr }, code)) }),
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 12, fontWeight: 700, color: C.text3, marginBottom: 9, fontFamily: FONTS.ui }, children: "Famille" }),
      /* @__PURE__ */ jsx18("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }, children: CHORD_FAMILIES.map((f) => /* @__PURE__ */ jsx18("button", { onClick: () => {
        setFamily(f.id);
        setQuality(f.keys[0]);
      }, style: {
        ...chip,
        padding: "7px 10px",
        fontSize: 12,
        border: `1.5px solid ${family === f.id ? C.primary : C.border}`,
        background: family === f.id ? C.primaryL : C.surface,
        color: family === f.id ? C.primaryD : C.text2
      }, children: f.label }, f.id)) }),
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 12, fontWeight: 700, color: C.text3, marginBottom: 9, fontFamily: FONTS.ui }, children: "Qualit\xE9" }),
      /* @__PURE__ */ jsx18("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }, children: (CHORD_FAMILIES.find((f) => f.id === family)?.keys || []).map((key) => /* @__PURE__ */ jsx18("button", { onClick: () => setQuality(key), style: {
        ...chip,
        border: `1.5px solid ${quality === key ? C.primary : C.border}`,
        background: quality === key ? C.primaryL : C.surface,
        color: quality === key ? C.primaryD : C.text2
      }, children: CHORD_TYPES[key]?.sym || CHORD_TYPES[key]?.name || key }, key)) }),
      /* @__PURE__ */ jsx18("div", { style: { fontSize: 11.5, color: C.text3, marginBottom: 12, fontFamily: FONTS.ui, minHeight: 16 }, children: CHORD_TYPES[quality]?.name }),
      /* @__PURE__ */ jsxs16("button", { onClick: addChord, disabled: sequence.length >= MAX_CHORDS, style: {
        width: "100%",
        padding: "11px 0",
        borderRadius: R.md,
        border: "none",
        background: sequence.length >= MAX_CHORDS ? C.border : C.primary,
        color: "#fff",
        fontWeight: 700,
        fontSize: 13.5,
        fontFamily: FONTS.ui,
        cursor: sequence.length >= MAX_CHORDS ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx18(Ti, { name: "plus", size: 15, color: "#fff" }),
        "Ajouter \xE0 la suite"
      ] })
    ] }),
    /* @__PURE__ */ jsxs16("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16, marginTop: 12 }, children: [
      /* @__PURE__ */ jsxs16("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }, children: [
        /* @__PURE__ */ jsxs16("div", { style: { fontSize: 12, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui }, children: [
          "Ta suite (",
          sequence.length,
          "/",
          MAX_CHORDS,
          ")"
        ] }),
        sequence.length > 0 && /* @__PURE__ */ jsx18("button", { onClick: clearAll, style: {
          background: "none",
          border: "none",
          color: C.coral,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: FONTS.ui,
          cursor: "pointer",
          padding: 0
        }, children: "Vider" })
      ] }),
      sequence.length === 0 ? /* @__PURE__ */ jsx18("div", { style: { textAlign: "center", padding: "18px 0", color: C.text3, fontSize: 13, fontFamily: FONTS.ui }, children: "Ajoute des accords ci-dessus pour construire ta suite." }) : /* @__PURE__ */ jsx18("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }, children: sequence.map((c, i) => /* @__PURE__ */ jsxs16("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 6px 8px 12px",
        borderRadius: 10,
        fontFamily: FONTS.ui,
        fontWeight: 700,
        fontSize: 13,
        border: `1.5px solid ${activeIdx === i && playing ? C.primary : C.border}`,
        background: activeIdx === i && playing ? C.primaryL : C.surface2,
        color: activeIdx === i && playing ? C.primaryD : C.text,
        transition: "all 0.15s"
      }, children: [
        c.label,
        /* @__PURE__ */ jsx18("button", { onClick: () => removeChord(i), style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          display: "flex",
          color: C.text3
        }, children: /* @__PURE__ */ jsx18(Ti, { name: "x", size: 13, color: C.text3 }) })
      ] }, i)) }),
      /* @__PURE__ */ jsx18("div", { style: { display: "flex", gap: 6, marginBottom: 14 }, children: SPEED_PRESETS.map((p) => /* @__PURE__ */ jsx18("button", { onClick: () => setSpeed(p.id), disabled: playing, style: {
        flex: 1,
        padding: "8px 0",
        borderRadius: R.sm,
        fontFamily: FONTS.ui,
        border: `1.5px solid ${speed === p.id ? C.primary : C.border}`,
        background: speed === p.id ? C.primaryL : C.surface,
        color: speed === p.id ? C.primaryD : C.text2,
        fontWeight: 700,
        fontSize: 12.5,
        cursor: playing ? "default" : "pointer",
        opacity: playing ? 0.6 : 1
      }, children: p.label }, p.id)) }),
      /* @__PURE__ */ jsxs16("button", { onClick: toggle, disabled: sequence.length === 0, style: {
        width: "100%",
        padding: "13px 0",
        borderRadius: R.md,
        border: "none",
        background: sequence.length === 0 ? C.border : playing ? C.coral : C.primary,
        color: "#fff",
        fontWeight: 800,
        fontSize: 14,
        fontFamily: FONTS.ui,
        cursor: sequence.length === 0 ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7
      }, children: [
        /* @__PURE__ */ jsx18(Ti, { name: playing ? "player-stop" : "player-play", size: 16, color: "#fff" }),
        playing ? "Arr\xEAter" : "\xC9couter la suite"
      ] })
    ] })
  ] });
}
function ToolboxScreen({ onBack }) {
  const C = useC();
  const [tab, setTab] = useState15("metronome");
  return /* @__PURE__ */ jsxs16("div", { style: { paddingBottom: 30 }, children: [
    /* @__PURE__ */ jsxs16("div", { style: {
      backgroundColor: "#b7a0c8",
      backgroundImage: "url('/sunrise.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 40%",
      padding: "26px 20px 20px",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx18("div", { style: { position: "absolute", inset: 0, background: "rgba(160,55,0,.5)" } }),
      /* @__PURE__ */ jsxs16("div", { style: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }, children: [
        onBack && /* @__PURE__ */ jsx18("button", { onClick: onBack, style: {
          background: "rgba(255,255,255,.85)",
          border: "none",
          borderRadius: R.sm,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }, children: /* @__PURE__ */ jsx18(Ti, { name: "arrow-left", size: 17, color: C.primaryD }) }),
        /* @__PURE__ */ jsxs16("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ jsx18("div", { style: { fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }, children: "Bo\xEEte \xE0 outils" }),
          /* @__PURE__ */ jsx18("div", { style: { fontSize: 12, color: "rgba(255,255,255,.8)", marginTop: 1 }, children: "M\xE9tronome & accordeur" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx18("div", { style: { display: "flex", gap: 8, padding: "14px 20px 0" }, children: [
      { id: "metronome", label: "M\xE9tronome", icon: "clock" },
      { id: "tuner", label: "Accordeur", icon: "microphone" },
      { id: "chords", label: "Accords", icon: "music" },
      { id: "neck", label: "Manche", icon: "guitar-pick" }
    ].map((t) => /* @__PURE__ */ jsxs16("button", { onClick: () => setTab(t.id), style: {
      flex: 1,
      padding: "10px 0",
      borderRadius: R.lg,
      cursor: "pointer",
      fontFamily: FONTS.ui,
      border: `1.5px solid ${tab === t.id ? C.primary : C.border}`,
      background: tab === t.id ? C.primaryL : C.surface,
      color: tab === t.id ? C.primaryD : C.text2,
      fontWeight: 700,
      fontSize: 11.5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3
    }, children: [
      /* @__PURE__ */ jsx18(Ti, { name: t.icon, size: 15, color: tab === t.id ? C.primary : C.text3 }),
      t.label
    ] }, t.id)) }),
    /* @__PURE__ */ jsx18("div", { style: { padding: "18px 20px 0" }, children: tab === "metronome" ? /* @__PURE__ */ jsx18(Metronome, {}) : tab === "tuner" ? /* @__PURE__ */ jsx18(Tuner, {}) : tab === "chords" ? /* @__PURE__ */ jsx18(ChordPlayer, {}) : /* @__PURE__ */ jsx18(FretboardExplorer, { embedded: true }) })
  ] });
}

// src/screens/TrainingScreen.jsx
var TrainingScreen_exports = {};
__export(TrainingScreen_exports, {
  TrainingScreen: () => TrainingScreen
});
import { useState as useState16, useMemo as useMemo10 } from "react";
import { jsx as jsx19, jsxs as jsxs17 } from "react/jsx-runtime";
var SUBTABS = [
  { id: "theory", label: "Th\xE9orie", icon: "help-circle" },
  { id: "playing", label: "Guitare en main", icon: "guitar-pick" }
];
function TrainingScreen({ state, dispatch, content }) {
  const C = useC();
  const [tab, setTab] = useState16("theory");
  const stat = useMemo10(() => {
    if (tab === "theory") {
      const all2 = content.quiz || [];
      const answered = all2.filter((q) => state.quizResults?.[q.id]).length;
      const pct2 = all2.length ? Math.round(answered / all2.length * 100) : 0;
      return { pct: pct2, line: `${answered} / ${all2.length} questions r\xE9pondues` };
    }
    const all = content.exercises || [];
    const done = all.filter((e) => state.completedExercises?.[e.id]).length;
    const pct = all.length ? Math.round(done / all.length * 100) : 0;
    return { pct, line: `${done} / ${all.length} exercices compl\xE9t\xE9s` };
  }, [tab, content.quiz, content.exercises, state.quizResults, state.completedExercises]);
  return /* @__PURE__ */ jsxs17("div", { children: [
    /* @__PURE__ */ jsxs17("div", { style: {
      backgroundColor: "#36b3d7",
      backgroundImage: "url('/ocean.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center 30%",
      padding: "24px 20px 0",
      position: "relative",
      overflow: "hidden"
    }, children: [
      /* @__PURE__ */ jsx19("div", { style: { position: "absolute", inset: 0, background: "rgba(0,60,80,.52)", pointerEvents: "none" } }),
      /* @__PURE__ */ jsxs17("div", { style: { position: "relative", zIndex: 1 }, children: [
        /* @__PURE__ */ jsx19("div", { style: { fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }, children: "Pratique" }),
        /* @__PURE__ */ jsx19("div", { style: {
          fontSize: 13,
          fontWeight: 500,
          color: "rgba(255,255,255,.8)",
          marginTop: 2,
          marginBottom: 12
        }, children: stat.line }),
        /* @__PURE__ */ jsx19(ProgressBar, { pct: stat.pct, color: C.teal, h: 6 }),
        /* @__PURE__ */ jsx19("div", { style: { display: "flex", gap: 6, marginTop: 16 }, children: SUBTABS.map((t) => {
          const active = tab === t.id;
          return /* @__PURE__ */ jsxs17(
            "button",
            {
              onClick: () => setTab(t.id),
              style: {
                flex: 1,
                padding: "10px 6px 11px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: FONTS.ui,
                borderBottom: `3px solid ${active ? "#fff" : "rgba(255,255,255,.22)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7
              },
              children: [
                /* @__PURE__ */ jsx19(Ti, { name: t.icon, size: 16, color: active ? "#fff" : "rgba(255,255,255,.6)" }),
                /* @__PURE__ */ jsx19("span", { style: {
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "-.1px",
                  color: active ? "#fff" : "rgba(255,255,255,.6)"
                }, children: t.label })
              ]
            },
            t.id
          );
        }) })
      ] })
    ] }),
    tab === "theory" ? /* @__PURE__ */ jsx19(QuizScreen, { state, dispatch, content, embedded: true }) : /* @__PURE__ */ jsx19(ExercisesScreen, { state, dispatch, content, embedded: true })
  ] });
}

// src/screens/PracticeScreen.jsx
var PracticeScreen_exports = {};
__export(PracticeScreen_exports, {
  PracticeScreen: () => PracticeScreen
});
import { useState as useState17, useEffect as useEffect11, useRef as useRef9, useCallback as useCallback4, useMemo as useMemo11 } from "react";

// src/store/challenges.js
var KEYS = ["A", "B", "C", "D", "E", "F", "G"];
var MODES2 = ["majeur", "mineur", "dorien", "mixolydien", "phrygien", "lydien"];
var TEMPOS = [60, 70, 80, 90, 100, 110, 120];
var CONSTRAINTS2 = [
  "uniquement 3 notes au choix",
  "uniquement notes longues (rondes/blanches)",
  "phrases qui finissent toutes sur la tonique",
  "phrases qui contiennent au moins 1 bend",
  "uniquement sur cordes 1 et 2",
  "uniquement sur 1 seule corde",
  "alternance jeu / silence toutes les 2 mesures",
  "phrases de 4 notes maximum",
  "uniquement legato (HO/PO, pas de picking)",
  "phrases qui montent puis descendent",
  "yeux ferm\xE9s (pas de visuel manche)",
  "1 nouvelle phrase \xE0 chaque mesure"
];
var DAILY_CHALLENGES = [
  "Improvise 3 minutes non-stop sur Am 70 BPM. Ne t'arr\xEAte JAMAIS.",
  "Joue la pentatonique Am dans les 5 positions encha\xEEn\xE9es sans erreur.",
  "Compose un riff de 4 mesures et joue-le 10 fois parfaitement.",
  "Enregistre-toi 5 minutes. \xC9coute. Note ta meilleure phrase.",
  "Joue Am-F-C-G en arp\xE8ges pendant 10 minutes sans t'arr\xEAter.",
  "Improvise les yeux ferm\xE9s pendant 5 minutes en Am.",
  "Joue uniquement des notes longues (blanches) pendant 5 minutes.",
  "Construis un solo qui monte progressivement d'intensit\xE9 sur 4 minutes.",
  "Joue le m\xEAme riff dans 3 tonalit\xE9s diff\xE9rentes (Am, Dm, Em).",
  "Improvise en alternant 1 mesure jeu / 1 mesure silence pendant 5 minutes."
];

// src/screens/PracticeScreen.jsx
import { jsx as jsx20, jsxs as jsxs18 } from "react/jsx-runtime";
function PracticeScreen({ state, dispatch }) {
  const C = useC();
  const [tab, setTab] = useState17("impro");
  const [current, setCurrent] = useState17(null);
  const [pop, setPop] = useState17(false);
  const timerRef = useRef9(null);
  useEffect11(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  const generateImpro = () => {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)];
    const mode = MODES2[Math.floor(Math.random() * MODES2.length)];
    const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const constraint = CONSTRAINTS2[Math.floor(Math.random() * CONSTRAINTS2.length)];
    setCurrent({ type: "impro", title: `${key} ${mode} \xB7 ${tempo} BPM`, sub: constraint, time: 10 });
  };
  const generateNeck = () => {
    const challenges = [
      "trouve toutes les notes Do sur le manche en 30 secondes",
      "joue la pentatonique Am en 5 positions encha\xEEn\xE9es",
      "trouve la triade de Fa majeur sur cordes 1-2-3 dans 3 positions",
      "joue Cmaj7 dans les 5 formes CAGED"
    ];
    setCurrent({ type: "neck", title: "D\xE9fi manche", sub: challenges[Math.floor(Math.random() * challenges.length)], time: 5 });
  };
  const generateRhythm = () => {
    const t = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const subs = ["noires", "croches", "doubles-croches", "triolets"][Math.floor(Math.random() * 4)];
    setCurrent({ type: "rhythm", title: `M\xE9tronome ${t} BPM`, sub: `Joue uniquement en ${subs} pendant 5 minutes`, time: 5 });
  };
  const finish = () => {
    setPop(true);
    dispatch({ type: "PRACTICE_DONE", minutes: current?.time || 5 });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
    timerRef.current = setTimeout(() => {
      setPop(false);
      setCurrent(null);
    }, 1e3);
  };
  return /* @__PURE__ */ jsxs18("div", { style: { padding: "18px 16px 0" }, children: [
    pop && /* @__PURE__ */ jsx20(XPPop, { amount: 50, onDone: () => {
    } }),
    /* @__PURE__ */ jsx20("h1", { style: { margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }, children: "Practice libre" }),
    /* @__PURE__ */ jsx20("p", { style: { fontSize: 13, color: C.text2, margin: "3px 0 14px", fontFamily: FONTS.ui }, children: "D\xE9fis g\xE9n\xE9r\xE9s \xE0 l'infini. Jamais 2 fois pareil." }),
    /* @__PURE__ */ jsx20("div", { style: { display: "flex", gap: 6, marginBottom: 12 }, children: [{ id: "impro", label: "Impro" }, { id: "neck", label: "Manche" }, { id: "rhythm", label: "Rythme" }].map((t) => /* @__PURE__ */ jsx20("button", { onClick: () => {
      setTab(t.id);
      setCurrent(null);
    }, style: {
      flex: 1,
      padding: "10px",
      borderRadius: R.sm,
      border: `1px solid ${tab === t.id ? C.primary : C.border}`,
      background: tab === t.id ? C.primary : C.surface,
      color: tab === t.id ? "#fff" : C.text2,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: FONTS.ui
    }, children: t.label }, t.id)) }),
    !current ? /* @__PURE__ */ jsxs18("div", { style: { background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.lg, padding: 20, textAlign: "center" }, children: [
      /* @__PURE__ */ jsx20(Ti, { name: "dice-5", size: 36, color: C.coral }),
      /* @__PURE__ */ jsx20("div", { style: { fontSize: 17, fontWeight: 700, color: C.coralD, marginTop: 10, marginBottom: 6, fontFamily: FONTS.title }, children: "G\xE9n\xE8re ton d\xE9fi" }),
      /* @__PURE__ */ jsxs18("div", { style: { fontSize: 13, color: C.coralD, marginBottom: 14, lineHeight: 1.55, fontFamily: FONTS.ui }, children: [
        tab === "impro" && "Tonalit\xE9, mode, tempo et contrainte tir\xE9s au sort.",
        tab === "neck" && "Un d\xE9fi de visualisation du manche.",
        tab === "rhythm" && "Un d\xE9fi de m\xE9tronome \xE0 un tempo donn\xE9."
      ] }),
      /* @__PURE__ */ jsxs18("button", { onClick: tab === "impro" ? generateImpro : tab === "neck" ? generateNeck : generateRhythm, style: {
        width: "100%",
        padding: "14px",
        borderRadius: R.md,
        border: "none",
        background: C.coral,
        color: "#fff",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        fontFamily: FONTS.ui,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6
      }, children: [
        "G\xE9n\xE9rer un d\xE9fi ",
        /* @__PURE__ */ jsx20(Ti, { name: "dice-5", size: 16 })
      ] })
    ] }) : /* @__PURE__ */ jsxs18("div", { children: [
      /* @__PURE__ */ jsxs18("div", { style: { background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: R.lg, padding: 20, marginBottom: 12 }, children: [
        /* @__PURE__ */ jsx20("div", { style: { fontSize: 10, fontWeight: 500, color: C.primaryD, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: FONTS.ui }, children: "D\xE9fi en cours" }),
        /* @__PURE__ */ jsx20("div", { style: { fontSize: 22, fontWeight: 700, color: C.primaryD, marginBottom: 8, fontFamily: FONTS.title }, children: current.title }),
        /* @__PURE__ */ jsx20("div", { style: { fontSize: 14, color: C.primaryD, lineHeight: 1.55, fontFamily: FONTS.title }, children: current.sub }),
        /* @__PURE__ */ jsxs18("div", { style: { fontSize: 11, color: C.primaryD, marginTop: 12, opacity: 0.7, fontFamily: FONTS.ui }, children: [
          "Dur\xE9e : ",
          current.time,
          " min"
        ] })
      ] }),
      /* @__PURE__ */ jsxs18("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }, children: [
        /* @__PURE__ */ jsxs18("button", { onClick: () => setCurrent(null), style: {
          padding: "12px",
          borderRadius: R.md,
          border: `1px solid ${C.border}`,
          background: C.surface,
          color: C.text,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: FONTS.ui,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5
        }, children: [
          "Autre d\xE9fi ",
          /* @__PURE__ */ jsx20(Ti, { name: "dice-5", size: 14 })
        ] }),
        /* @__PURE__ */ jsx20("button", { onClick: finish, style: {
          padding: "12px",
          borderRadius: R.md,
          border: "none",
          background: C.green,
          color: "#fff",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: FONTS.ui,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5
        }, children: "Termin\xE9 \xB7 +50 XP" })
      ] })
    ] }),
    /* @__PURE__ */ jsx20("div", { style: { height: 16 } })
  ] });
}

// src/screens/ChallengeScreen.jsx
var ChallengeScreen_exports = {};
__export(ChallengeScreen_exports, {
  ChallengeScreen: () => ChallengeScreen
});
import { useState as useState18, useEffect as useEffect12, useRef as useRef10, useCallback as useCallback5, useMemo as useMemo12 } from "react";
import { jsx as jsx21, jsxs as jsxs19 } from "react/jsx-runtime";
function ChallengeScreen({ state, dispatch, navigate }) {
  const C = useC();
  const ch = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];
  const done = state.dailyChallengeDone;
  const [pop, setPop] = useState18(false);
  const timerRef = useRef10(null);
  useEffect12(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  const finish = () => {
    setPop(true);
    dispatch({ type: "DAILY_CHALLENGE_DONE" });
    dispatch({ type: "MARK_STREAK" });
    timerRef.current = setTimeout(() => setPop(false), 1e3);
  };
  return /* @__PURE__ */ jsxs19("div", { style: { padding: "14px 16px 0" }, children: [
    pop && /* @__PURE__ */ jsx21(XPPop, { amount: 80, onDone: () => {
    } }),
    /* @__PURE__ */ jsxs19("button", { onClick: () => navigate("home"), style: { background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }, children: [
      /* @__PURE__ */ jsx21(Ti, { name: "chevron-left", size: 16 }),
      " RETOUR"
    ] }),
    /* @__PURE__ */ jsx21("h1", { style: { margin: "0 0 16px", fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }, children: "D\xE9fi du jour" }),
    /* @__PURE__ */ jsxs19("div", { style: {
      background: done ? C.greenL : C.amberL,
      borderRadius: R.lg,
      padding: 20,
      marginBottom: 14,
      border: `1px solid ${done ? C.greenBorder : C.amberBorder}`
    }, children: [
      /* @__PURE__ */ jsxs19("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }, children: [
        /* @__PURE__ */ jsx21(Ti, { name: done ? "trophy" : "bolt", size: 16, color: done ? C.green : C.amber }),
        /* @__PURE__ */ jsx21("div", { style: { fontSize: 10, fontWeight: 500, color: done ? C.greenD : C.amberD, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: FONTS.ui }, children: done ? "D\xE9fi compl\xE9t\xE9" : "Aujourd'hui" })
      ] }),
      /* @__PURE__ */ jsx21("p", { style: { margin: "0 0 12px", fontSize: 16, fontWeight: 500, color: done ? C.greenD : C.amberD, lineHeight: 1.55, fontFamily: FONTS.title }, children: ch }),
      /* @__PURE__ */ jsx21("div", { style: { fontSize: 12, color: done ? C.greenD : C.amberD, opacity: 0.7, fontFamily: FONTS.ui }, children: "R\xE9compense : +80 XP" })
    ] }),
    !done ? /* @__PURE__ */ jsxs19("button", { onClick: finish, style: {
      width: "100%",
      padding: "14px",
      borderRadius: R.md,
      border: "none",
      background: C.amber,
      color: "#fff",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: FONTS.ui,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6
    }, children: [
      "D\xE9fi relev\xE9 ",
      /* @__PURE__ */ jsx21(Ti, { name: "check", size: 16 })
    ] }) : /* @__PURE__ */ jsxs19("div", { style: { background: C.greenL, borderRadius: R.md, padding: 18, textAlign: "center", border: `1px solid ${C.greenBorder}` }, children: [
      /* @__PURE__ */ jsx21(Ti, { name: "trophy", size: 32, color: C.green }),
      /* @__PURE__ */ jsx21("div", { style: { fontWeight: 700, color: C.greenD, fontSize: 16, fontFamily: FONTS.title, marginTop: 8 }, children: "D\xE9fi compl\xE9t\xE9 !" }),
      /* @__PURE__ */ jsx21("div", { style: { fontSize: 12, color: C.green, marginTop: 4, fontFamily: FONTS.ui }, children: "Reviens demain." })
    ] }),
    /* @__PURE__ */ jsx21("div", { style: { height: 16 } })
  ] });
}

// src/onboarding/OnboardingScreen.jsx
var OnboardingScreen_exports = {};
__export(OnboardingScreen_exports, {
  OnboardingScreen: () => OnboardingScreen
});
import { useState as useState19, useEffect as useEffect13, useMemo as useMemo13 } from "react";

// src/store/placementEngine.js
var TESTABLE_MODULES = ["neck", "scales", "harmony", "rhythm", "impro"];
var TIER_ORDER = ["A1", "A2", "B1", "B2"];
var TIER_VALUE = { A1: 1, A2: 2, B1: 3, B2: 4 };
var MAX_STARTING_LEVEL = 8;
var PLACEMENT_LEVELS = [1, 2, 3];
var FALLBACK_TIER = "A2";
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
var usableQuestions = (quizBank, moduleId, lvl) => (quizBank || []).filter(
  (q) => q.courseId === moduleId && q.lvl === lvl && Array.isArray(q.o) && q.o.length >= 2
);
function availableModules(quizBank) {
  if (!quizBank || quizBank.length === 0) return [...TESTABLE_MODULES];
  return TESTABLE_MODULES.filter(
    (m) => PLACEMENT_LEVELS.every((lvl) => usableQuestions(quizBank, m, lvl).length > 0)
  );
}
function buildPlacementQueue(quizBank = null) {
  const modules = quizBank ? availableModules(quizBank) : [...TESTABLE_MODULES];
  const queue = [];
  for (const lvl of PLACEMENT_LEVELS) {
    for (const moduleId of modules) queue.push({ moduleId, lvl });
  }
  return queue;
}
function placementQuestionCount(quizBank = null) {
  return buildPlacementQueue(quizBank).length;
}
var PLACEMENT_QUESTION_COUNT = TESTABLE_MODULES.length * PLACEMENT_LEVELS.length;
function pickQuestion(quizBank, moduleId, lvl, excludeIds) {
  const pool = usableQuestions(quizBank, moduleId, lvl).filter((q) => q.type !== "fretboard" && !excludeIds.has(q.id));
  return pool.length === 0 ? null : pickRandom(pool);
}
function pickPlacementQuestion(quizBank, moduleId, lvl, excludeIds, preferFretboard = false) {
  if (preferFretboard) {
    const fretPool = (quizBank || []).filter(
      (q2) => q2.courseId === moduleId && q2.lvl === lvl && q2.type === "fretboard" && !excludeIds.has(q2.id)
    );
    if (fretPool.length > 0) return { ...pickRandom(fretPool), moduleId };
  }
  const q = pickQuestion(quizBank, moduleId, lvl, excludeIds);
  return q ? { ...q, moduleId } : null;
}
function startFromScore(totalCorrect, totalQuestions) {
  const answered = Math.max(1, Number(totalQuestions) || 1);
  const ratio = Math.max(0, Math.min(1, (Number(totalCorrect) || 0) / answered));
  const level = Math.max(1, Math.min(
    MAX_STARTING_LEVEL,
    Math.round(1 + ratio * (MAX_STARTING_LEVEL - 1))
  ));
  return { grade: gradeForLevel(level), startXp: totalXpForLevel(level), level, startLevel: level };
}
function computeModuleTier(correctCount) {
  const idx = Math.max(0, Math.min(TIER_ORDER.length - 1, Number(correctCount) || 0));
  return TIER_ORDER[idx];
}
var averageTier = (skillLevels, modules) => {
  const values = modules.map((m) => TIER_VALUE[skillLevels?.[m]]).filter(Boolean);
  if (values.length === 0) return FALLBACK_TIER;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return TIER_ORDER[Math.max(0, Math.min(3, Math.round(avg) - 1))];
};
function inferMissingTier(skillLevels, testedModules = TESTABLE_MODULES) {
  return averageTier(skillLevels, testedModules);
}
function computeOverallTier(skillLevels, testedModules = TESTABLE_MODULES) {
  return averageTier(skillLevels, testedModules);
}
function weakestModule(skillLevels, testedModules = TESTABLE_MODULES) {
  let weakest = null, weakestVal = 5;
  for (const m of testedModules) {
    const v = TIER_VALUE[skillLevels?.[m]];
    if (v && v < weakestVal) {
      weakestVal = v;
      weakest = m;
    }
  }
  return weakest;
}

// src/onboarding/OnboardingScreen.jsx
import { Fragment as Fragment10, jsx as jsx22, jsxs as jsxs20 } from "react/jsx-runtime";
var GOAL_OPTIONS = [
  { id: "impro", module: "impro", label: "Improviser librement", icon: "wand" },
  { id: "theorie", module: "harmony", label: "Comprendre la th\xE9orie en profondeur", icon: "stack-2" },
  { id: "manche", module: "neck", label: "Ma\xEEtriser le manche", icon: "map-2" },
  { id: "global", module: null, label: "Un peu de tout, en \xE9quilibre", icon: "sparkles" }
];
var TIME_OPTIONS = [
  { id: "short", label: "15\u201330 min / semaine" },
  { id: "medium", label: "30\u201360 min / semaine" },
  { id: "long", label: "1h ou plus / semaine" }
];
var ALL_PROFILE_MODULES = [.../* @__PURE__ */ new Set([...TESTABLE_MODULES, "impro"])];
function OnboardingScreen({ content, onComplete, onEvent }) {
  const C = useC();
  const [phase, setPhase] = useState19("welcome");
  const [queue, setQueue] = useState19(null);
  const [qIdx, setQIdx] = useState19(0);
  const [currentQ, setCurrentQ] = useState19(null);
  const [selected, setSelected] = useState19(null);
  const [answered, setAnswered] = useState19(false);
  const [forceReveal, setForceReveal] = useState19(false);
  const [usedIds] = useState19(() => /* @__PURE__ */ new Set());
  const modulesTestes = useMemo13(() => availableModules(content?.quiz || []), [content]);
  const nbQuestions = useMemo13(() => placementQuestionCount(content?.quiz || []), [content]);
  const [results, setResults] = useState19(() => Object.fromEntries(TESTABLE_MODULES.map((m) => [m, 0])));
  const [skillLevels, setSkillLevels] = useState19({ neck: null, scales: null, harmony: null, rhythm: null, impro: null });
  const [overallTier, setOverallTier] = useState19(null);
  const [weakest, setWeakest] = useState19(null);
  const [goal, setGoal] = useState19(null);
  const [timePerWeek, setTimePerWeek] = useState19(null);
  const emit = (name, props) => {
    try {
      onEvent?.(name, props);
    } catch {
    }
  };
  const quizBank = content?.quiz || [];
  function loadQuestion(idx, q) {
    const { moduleId, lvl } = q[idx];
    const preferFretboard = moduleId === "neck" && lvl === 1;
    const picked = pickPlacementQuestion(quizBank, moduleId, lvl, usedIds, preferFretboard);
    if (picked) usedIds.add(picked.id);
    setCurrentQ(picked);
    setSelected(null);
    setAnswered(false);
    setForceReveal(false);
  }
  function startTest() {
    emit("placement_test_started");
    setPhase("testing");
    const q = buildPlacementQueue(quizBank);
    setQueue(q);
    setQIdx(0);
    setResults(Object.fromEntries(TESTABLE_MODULES.map((m) => [m, 0])));
    loadQuestion(0, q);
  }
  function recordAnswer(moduleId, correct) {
    setResults((prev) => ({ ...prev, [moduleId]: prev[moduleId] + (correct ? 1 : 0) }));
  }
  function choose(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === currentQ.a;
    emit("placement_question_answered", { module: currentQ.moduleId, correct, questionId: currentQ.id });
    recordAnswer(currentQ.moduleId, correct);
  }
  function chooseFretboard(result) {
    if (answered) return;
    setAnswered(true);
    const correct = !!result?.complete;
    emit("placement_question_answered", { module: currentQ.moduleId, correct, questionId: currentQ.id, fretboard: true });
    recordAnswer(currentQ.moduleId, correct);
  }
  function chooseDontKnow() {
    if (answered) return;
    setSelected(null);
    setAnswered(true);
    emit("placement_question_answered", { module: currentQ.moduleId, correct: false, dontKnow: true, questionId: currentQ.id });
    recordAnswer(currentQ.moduleId, false);
  }
  function continueTest() {
    const nextIdx = qIdx + 1;
    if (nextIdx < queue.length) {
      setQIdx(nextIdx);
      loadQuestion(nextIdx, queue);
      return;
    }
    const newLevels = { ...skillLevels };
    for (const moduleId of modulesTestes) {
      const tier = computeModuleTier(results[moduleId]);
      newLevels[moduleId] = tier;
      emit("placement_module_result", { module: moduleId, tier, correctCount: results[moduleId] });
    }
    const finalLevels = { ...newLevels };
    for (const m of TESTABLE_MODULES) {
      if (!modulesTestes.includes(m)) finalLevels[m] = inferMissingTier(finalLevels, modulesTestes);
    }
    const overall = computeOverallTier(finalLevels, modulesTestes);
    const weak = weakestModule(finalLevels, modulesTestes);
    setSkillLevels(finalLevels);
    setOverallTier(overall);
    setWeakest(weak);
    emit("placement_completed", { skillLevels: finalLevels, overallTier: overall, weakestModule: weak });
    setPhase("results");
  }
  useEffect13(() => {
    if (phase === "testing" && queue && !currentQ) {
      const nextIdx = qIdx + 1;
      if (nextIdx < queue.length) {
        setQIdx(nextIdx);
        loadQuestion(nextIdx, queue);
      } else continueTest();
    }
  }, [phase, currentQ, queue]);
  function finish() {
    const goalOpt = GOAL_OPTIONS.find((g) => g.id === goal);
    const totalCorrect = modulesTestes.reduce((sum, m) => sum + (results[m] || 0), 0);
    const { startXp, startLevel } = startFromScore(totalCorrect, nbQuestions);
    const answers = {
      goal,
      preferredModule: goalOpt?.module || null,
      timePerWeek,
      skillLevels,
      overallTier,
      weakestModule: weakest,
      startXp,
      startLevel,
      completedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    emit("onboarding_completed", answers);
    onComplete(answers);
  }
  const questionNumber = qIdx + 1;
  const progressPct = phase === "welcome" ? 0 : phase === "testIntro" ? 5 : phase === "testing" ? Math.round(5 + (questionNumber - (answered ? 0 : 1)) / Math.max(1, nbQuestions) * 65) : phase === "results" ? 75 : phase === "goal" ? 85 : phase === "time" ? 95 : 100;
  return /* @__PURE__ */ jsxs20("div", { style: {
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    background: C.bg,
    fontFamily: FONTS.title,
    padding: "calc(env(safe-area-inset-top, 0px) + 12px) 0 24px"
  }, children: [
    phase !== "welcome" && /* @__PURE__ */ jsx22("div", { style: { padding: "0 20px 4px" }, children: /* @__PURE__ */ jsx22(ProgressBar, { pct: progressPct }) }),
    /* @__PURE__ */ jsxs20("div", { style: { flex: 1, display: "flex", flexDirection: "column", padding: "0 20px", maxWidth: 440, width: "100%", margin: "0 auto" }, children: [
      phase === "welcome" && /* @__PURE__ */ jsxs20("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18, minHeight: 0 }, children: [
        /* @__PURE__ */ jsx22(Gropi, { pose: "wave", size: 110, anim: "bob" }),
        /* @__PURE__ */ jsx22("h1", { style: { margin: 0, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-.3px" }, children: "Bienvenue sur Groply" }),
        /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 14.5, lineHeight: 1.6, color: C.text2, maxWidth: 300 }, children: "Avant de commencer, on va mesurer ton vrai niveau : pas celui que tu crois avoir, celui que tu as vraiment. 2 minutes, promis." }),
        /* @__PURE__ */ jsx22(PrimaryButton, { C, onClick: () => {
          emit("onboarding_started");
          setPhase("testIntro");
        }, children: "Commencer" })
      ] }),
      phase === "testIntro" && /* @__PURE__ */ jsxs20("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }, children: [
        /* @__PURE__ */ jsx22(Gropi, { pose: "think", size: 90, anim: "bob" }),
        /* @__PURE__ */ jsx22("h2", { style: { margin: 0, fontSize: 20, fontWeight: 800, color: C.text }, children: "Le test de placement" }),
        /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 13.5, lineHeight: 1.6, color: C.text2, maxWidth: 300 }, children: "12 questions, 4 domaines (manche, gammes, harmonie, rythme). \xC7a commence simple, puis \xE7a monte en difficult\xE9. C'est normal de s\xE9cher sur les derni\xE8res." }),
        /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 12, color: C.text3, maxWidth: 280 }, children: "Pas de retour en arri\xE8re possible une fois lanc\xE9. R\xE9ponds au mieux : c'est fait pour r\xE9v\xE9ler o\xF9 tu es, pas pour te juger. Si tu ne sais pas, dis-le, \xE7a compte aussi." }),
        /* @__PURE__ */ jsx22(PrimaryButton, { C, onClick: startTest, children: "Lancer le test" })
      ] }),
      phase === "testing" && currentQ && /* @__PURE__ */ jsxs20("div", { style: { flex: 1, display: "flex", flexDirection: "column", paddingTop: 24, gap: 14 }, children: [
        /* @__PURE__ */ jsxs20("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ jsx22(Ti, { name: MODULE[currentQ.moduleId]?.icon || "music", size: 16, color: C.primary }),
          /* @__PURE__ */ jsxs20("span", { style: { fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.primary, fontFamily: FONTS.ui }, children: [
            MODULE[currentQ.moduleId]?.label || currentQ.moduleId,
            " \xB7 Question ",
            questionNumber,
            "/",
            PLACEMENT_QUESTION_COUNT
          ] })
        ] }),
        currentQ.type === "fretboard" ? /* @__PURE__ */ jsxs20(Fragment10, { children: [
          /* @__PURE__ */ jsx22("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16 }, children: /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: C.text }, children: currentQ.q }) }),
          /* @__PURE__ */ jsx22(
            FretboardQuizQuestion,
            {
              question: currentQ,
              onComplete: chooseFretboard,
              answered,
              forceReveal
            }
          )
        ] }) : /* @__PURE__ */ jsxs20(Fragment10, { children: [
          /* @__PURE__ */ jsx22("div", { style: { background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16 }, children: /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: C.text }, children: currentQ.q }) }),
          /* @__PURE__ */ jsx22("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: currentQ.o.map((opt, i) => {
            let bg = C.surface, border = `1.5px solid ${C.border}`, col = C.text;
            if (answered) {
              if (i === currentQ.a) {
                bg = C.greenL;
                border = `1.5px solid ${C.green}`;
                col = C.greenD;
              } else if (i === selected) {
                bg = C.coralL;
                border = `1.5px solid ${C.coral}`;
                col = C.coralD;
              }
            }
            return /* @__PURE__ */ jsx22("button", { onClick: () => choose(i), disabled: answered, style: {
              textAlign: "left",
              minHeight: 48,
              padding: "12px 14px",
              borderRadius: R.md,
              background: bg,
              border,
              color: col,
              cursor: answered ? "default" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: FONTS.title,
              transition: "all 0.15s"
            }, children: opt }, i);
          }) })
        ] }),
        !answered && /* @__PURE__ */ jsx22(
          "button",
          {
            onClick: currentQ.type === "fretboard" ? () => setForceReveal(true) : chooseDontKnow,
            style: {
              textAlign: "center",
              minHeight: 44,
              padding: "10px 14px",
              borderRadius: R.md,
              background: "transparent",
              border: `1.5px dashed ${C.border}`,
              color: C.text3,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONTS.title,
              cursor: "pointer"
            },
            children: "Je ne sais pas"
          }
        ),
        answered && /* @__PURE__ */ jsxs20(Fragment10, { children: [
          currentQ.type !== "fretboard" && /* @__PURE__ */ jsxs20("p", { style: {
            margin: 0,
            fontSize: 12.5,
            color: C.text2,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }, children: [
            selected === null ? "Pas de souci, tu la reverras. " : "",
            currentQ.exp
          ] }),
          currentQ.type === "fretboard" && forceReveal && /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 12.5, color: C.text2, lineHeight: 1.5 }, children: "Pas de souci, tu la reverras. Les bonnes positions sont affich\xE9es sur le manche." }),
          /* @__PURE__ */ jsx22(PrimaryButton, { C, onClick: continueTest, children: "Continuer" })
        ] })
      ] }),
      phase === "results" && overallTier && (() => {
        const totalCorrect = TESTABLE_MODULES.reduce((sum, m) => sum + (results[m] || 0), 0);
        const { grade, level } = startFromScore(totalCorrect, PLACEMENT_QUESTION_COUNT);
        return /* @__PURE__ */ jsxs20("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 14, paddingTop: 12 }, children: [
          /* @__PURE__ */ jsx22(Gropi, { pose: "celebrate", size: 100, anim: "cheer" }),
          /* @__PURE__ */ jsx22("div", { style: { fontSize: 12, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: ".08em" }, children: "Ton profil Groply" }),
          /* @__PURE__ */ jsx22("h1", { style: { margin: 0, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }, children: grade.label }),
          /* @__PURE__ */ jsxs20("div", { style: {
            fontSize: 11,
            fontWeight: 700,
            color: C.primary,
            background: C.primaryL,
            border: `1px solid ${C.primaryBorder}`,
            borderRadius: 999,
            padding: "3px 11px",
            letterSpacing: ".03em"
          }, children: [
            "Niveau ",
            level
          ] }),
          /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 13, color: C.text2, lineHeight: 1.55, maxWidth: 300 }, children: grade.blurb }),
          /* @__PURE__ */ jsx22("div", { style: { width: "100%", display: "flex", flexDirection: "column", gap: 7, marginTop: 6 }, children: ALL_PROFILE_MODULES.map((m) => {
            const tier = skillLevels[m];
            const value = TIER_VALUE[tier] || 0;
            const th = MODULE[m] || {};
            const isWeak = m === weakest;
            return /* @__PURE__ */ jsxs20("div", { style: {
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: C.surface,
              border: `1.5px solid ${isWeak ? C.primary : C.border}`,
              borderRadius: R.md,
              padding: "10px 13px"
            }, children: [
              /* @__PURE__ */ jsx22(Ti, { name: th.icon || "music", size: 16, color: C[th.color] || C.text2 }),
              /* @__PURE__ */ jsx22("span", { style: { flex: 1, textAlign: "left", fontSize: 13, fontWeight: 700, color: C.text }, children: th.label || m }),
              /* @__PURE__ */ jsx22("div", { style: { display: "flex", gap: 3 }, children: [1, 2, 3, 4].map((seg) => /* @__PURE__ */ jsx22("span", { style: {
                width: 14,
                height: 6,
                borderRadius: 3,
                background: seg <= value ? C[th.color] || C.primary : C.border
              } }, seg)) })
            ] }, m);
          }) }),
          weakest && /* @__PURE__ */ jsxs20("p", { style: { margin: "2px 0 0", fontSize: 12.5, color: C.text2, lineHeight: 1.5, maxWidth: 300 }, children: [
            "Gropi a rep\xE9r\xE9 que ",
            /* @__PURE__ */ jsx22("b", { style: { color: C.text }, children: MODULE[weakest]?.label }),
            " m\xE9rite un coup de boost, on le met en priorit\xE9 dans ton Parcours."
          ] }),
          /* @__PURE__ */ jsx22(PrimaryButton, { C, onClick: () => {
            setPhase("goal");
            emit("onboarding_step_view", { step: "goal" });
          }, children: "Continuer" })
        ] });
      })(),
      phase === "goal" && /* @__PURE__ */ jsxs20(
        StepLayout,
        {
          C,
          eyebrow: "Presque fini",
          title: "Quel est ton objectif principal ?",
          subtitle: "Le Parcours en tiendra compte, en plus de ton profil, sans jamais sauter les autres domaines.",
          children: [
            GOAL_OPTIONS.map((opt) => /* @__PURE__ */ jsx22(OptionCard, { C, selected: goal === opt.id, onClick: () => setGoal(opt.id), children: /* @__PURE__ */ jsxs20("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
              /* @__PURE__ */ jsx22(Ti, { name: opt.icon, size: 19, color: goal === opt.id ? C.primary : C.text2 }),
              /* @__PURE__ */ jsx22("div", { style: { fontWeight: 700, fontSize: 14.5 }, children: opt.label })
            ] }) }, opt.id)),
            /* @__PURE__ */ jsx22(PrimaryButton, { C, disabled: !goal, onClick: () => {
              setPhase("time");
              emit("onboarding_step_view", { step: "time" });
            }, children: "Continuer" })
          ]
        }
      ),
      phase === "time" && /* @__PURE__ */ jsxs20(
        StepLayout,
        {
          C,
          eyebrow: "Derni\xE8re question",
          title: "Combien de temps veux-tu y consacrer ?",
          subtitle: "\xC7a r\xE8gle tes objectifs hebdo, modifiable \xE0 tout moment dans les r\xE9glages.",
          children: [
            TIME_OPTIONS.map((opt) => /* @__PURE__ */ jsx22(OptionCard, { C, selected: timePerWeek === opt.id, onClick: () => setTimePerWeek(opt.id), children: /* @__PURE__ */ jsx22("div", { style: { fontWeight: 700, fontSize: 14.5 }, children: opt.label }) }, opt.id)),
            /* @__PURE__ */ jsx22(PrimaryButton, { C, disabled: !timePerWeek, onClick: finish, children: "C'est parti" })
          ]
        }
      )
    ] })
  ] });
}
function StepLayout({ C, eyebrow, title, subtitle, children }) {
  return /* @__PURE__ */ jsxs20("div", { style: { flex: 1, display: "flex", flexDirection: "column", paddingTop: 28, gap: 14 }, children: [
    /* @__PURE__ */ jsx22("div", { style: { fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.primary, fontFamily: FONTS.ui }, children: eyebrow }),
    /* @__PURE__ */ jsx22("h2", { style: { margin: 0, fontSize: 21, fontWeight: 800, color: C.text, letterSpacing: "-.2px", lineHeight: 1.3 }, children: title }),
    subtitle && /* @__PURE__ */ jsx22("p", { style: { margin: 0, fontSize: 13, color: C.text2, lineHeight: 1.5 }, children: subtitle }),
    /* @__PURE__ */ jsx22("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }, children })
  ] });
}
function OptionCard({ C, selected, onClick, children }) {
  return /* @__PURE__ */ jsx22(
    "button",
    {
      onClick,
      style: {
        textAlign: "left",
        width: "100%",
        minHeight: 48,
        padding: "13px 15px",
        borderRadius: R.lg,
        cursor: "pointer",
        background: selected ? C.primaryL : C.surface,
        border: `1.5px solid ${selected ? C.primary : C.border}`,
        color: C.text,
        fontFamily: FONTS.title,
        transition: "all 0.15s"
      },
      children
    }
  );
}
function PrimaryButton({ C, onClick, disabled, children }) {
  return /* @__PURE__ */ jsx22(
    "button",
    {
      onClick,
      disabled,
      style: {
        width: "100%",
        minHeight: 52,
        marginTop: 8,
        borderRadius: R.lg,
        border: "none",
        cursor: disabled ? "default" : "pointer",
        background: disabled ? C.border : `linear-gradient(135deg, #FF9155, ${C.primary})`,
        color: disabled ? C.text3 : "#fff",
        fontSize: 15.5,
        fontWeight: 700,
        fontFamily: FONTS.ui,
        boxShadow: disabled ? "none" : "0 4px 16px rgba(232,93,26,0.30)",
        transition: "all 0.18s"
      },
      children
    }
  );
}
export {
  ChallengeScreen_exports as ChallengeScreen,
  CoursesScreen_exports as CoursesScreen,
  EarTraining_exports as EarTraining,
  ExercisesScreen_exports as ExercisesScreen,
  Fretboard_exports as Fretboard,
  FretboardExplorer_exports as FretboardExplorer,
  HomeScreen_exports as HomeScreen,
  JamSession_exports as JamSession,
  OnboardingScreen_exports as OnboardingScreen,
  PracticeScreen_exports as PracticeScreen,
  ProgressScreen_exports as ProgressScreen,
  QuizScreen_exports as QuizScreen,
  renderers_exports as Renderers,
  ReviewSession_exports as ReviewSession,
  SettingsScreen_exports as SettingsScreen,
  ThemeContext_exports as Theme,
  ToolboxScreen_exports as ToolboxScreen,
  TrainingScreen_exports as TrainingScreen,
  UnitCheckScreen_exports as UnitCheckScreen
};
