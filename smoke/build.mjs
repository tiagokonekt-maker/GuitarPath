// Compile chaque écran en bundle Node autonome, avec des remplacements
// (stubs) pour tout ce qui touche au navigateur ou à l'audio.
// Objectif : RENDRE réellement les composants pour attraper les
// "X is not defined" — ce qu'une simple compilation ne voit pas.
import * as esbuild from "esbuild";
import { writeFileSync } from "node:fs";
import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Chemins ancrés sur l'emplacement du script, pas sur le dossier courant :
// `npm run smoke` s'exécute depuis la racine, mais un appel direct
// `node smoke/build.mjs` depuis un autre dossier casserait tout.
// `fileURLToPath` et non `.pathname` : sous Windows ce dernier renvoie
// "/C:/Users/Mon%20Dossier/..." — préfixe parasite et espaces encodés.
const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");
const dansRacine = (...p) => resolve(RACINE, ...p);

const stubs = {
  // Tone.js n'existe pas côté Node : on le remplace par un objet inerte.
  name: "stubs",
  setup(build) {
    build.onResolve({ filter: /^tone$/ }, () => ({ path: "tone-stub", namespace: "stub" }));
    build.onResolve({ filter: /supabaseClient\.js$/ }, () => ({ path: "supa-stub", namespace: "stub" }));
    build.onLoad({ filter: /.*/, namespace: "stub" }, (args) => {
      if (args.path === "tone-stub") return {
        contents: `
          export const now = () => 0;
          export const context = { state: "running", rawContext: { resume(){}, suspend(){} } };
          export async function start(){}
          export const Draw = { schedule(){} };
          export function getTransport(){ return { start(){}, stop(){}, cancel(){} }; }
          export class Sampler { constructor(o){ o?.onload?.(); } connect(){return this;} toDestination(){return this;} triggerAttackRelease(){} releaseAll(){} dispose(){} }
          export class Reverb { toDestination(){return this;} connect(){return this;} }
          const inerte = () => { const o = function(){ return o; };
            return new Proxy(o, { get: () => inerte(), apply: () => inerte(), construct: () => inerte() }); };
          export const getContext = () => ({ resume: async()=>{}, state: "running" });
          export const getDraw = () => ({ schedule(){} });
          export const Time = () => 0;
          export class Compressor { constructor(){} toDestination(){return this;} connect(){return this;} dispose(){} }
          export class FeedbackDelay { constructor(){} toDestination(){return this;} connect(){return this;} dispose(){} }
          export class Synth { constructor(){} connect(){return this;} toDestination(){return this;} triggerAttackRelease(){} dispose(){} }
          export class Filter { constructor(){} connect(){return this;} toDestination(){return this;} dispose(){} }
          export class Players { constructor(o){ o?.onload?.(); } connect(){return this;} toDestination(){return this;} player(){return { start(){}, stop(){} };} has(){return false;} dispose(){} }
          export class MembraneSynth { constructor(){} connect(){return this;} toDestination(){return this;} triggerAttackRelease(){} dispose(){} }
          export class NoiseSynth { constructor(){} connect(){return this;} toDestination(){return this;} triggerAttackRelease(){} dispose(){} }
          export class Sequence { constructor(){} start(){return this;} stop(){return this;} dispose(){} set loop(v){} }
          export class Part { constructor(){} start(){return this;} stop(){return this;} dispose(){} }
          export class Loop { constructor(){} start(){return this;} stop(){return this;} dispose(){} }
        `, loader: "js" };
      return { contents: `export const supabase = { auth: { getSession: async () => ({ data: {} }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe(){} } } }) }, from: () => ({}) };
        export const getCachedAccessToken = () => null; export const SUPABASE_REST = ""; export const SUPABASE_KEY = "";`, loader: "js" };
    });
  },
};

const cibles = [
  ["CoursesScreen",     "src/screens/CoursesScreen.jsx"],
  ["UnitCheckScreen",   "src/screens/UnitCheckScreen.jsx"],
  ["QuizScreen",        "src/screens/QuizScreen.jsx"],
  ["ReviewSession",     "src/screens/ReviewSession.jsx"],
  ["ExercisesScreen",   "src/screens/ExercisesScreen.jsx"],
  ["EarTraining",       "src/screens/EarTraining.jsx"],
  ["JamSession",        "src/screens/JamSession.jsx"],
  ["HomeScreen",        "src/screens/HomeScreen.jsx"],
  ["ProgressScreen",    "src/screens/ProgressScreen.jsx"],
  ["SettingsScreen",    "src/screens/SettingsScreen.jsx"],
  ["ToolboxScreen",     "src/screens/ToolboxScreen.jsx"],
  ["FretboardExplorer", "src/screens/FretboardExplorer.jsx"],
  ["TrainingScreen",    "src/screens/TrainingScreen.jsx"],
  ["PracticeScreen",    "src/screens/PracticeScreen.jsx"],
  ["ChallengeScreen",   "src/screens/ChallengeScreen.jsx"],
  ["OnboardingScreen",  "src/onboarding/OnboardingScreen.jsx"],
  ["Fretboard",         "src/Fretboard.jsx"],
];

let entry = "";
for (const [nom, chemin] of cibles) {
  entry += `export * as ${nom} from "../${chemin}";\n`;
}
entry += `export * as Renderers from "../src/renderers.jsx";\n`;
entry += `export * as Theme from "../src/design/ThemeContext.jsx";\n`;
writeFileSync(dansRacine("smoke/_entry.jsx"), entry);

await esbuild.build({
  entryPoints: [dansRacine("smoke/_entry.jsx")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: dansRacine("smoke/bundle.mjs"),
  absWorkingDir: RACINE,
  jsx: "automatic",
  external: ["react", "react-dom", "react-dom/server", "react/jsx-runtime"],
  plugins: [stubs],
  logLevel: "warning",
  define: { "import.meta.env.DEV": "false", "import.meta.env.PROD": "true" },
});
console.log("bundle de test construit");
