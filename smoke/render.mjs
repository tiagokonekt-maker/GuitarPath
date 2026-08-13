// Rend chaque écran pour de vrai (react-dom/server) avec des props plausibles.
// C'est ce test qui attrape les "X is not defined" : la compilation ne voit
// pas qu'une variable est hors de portée dans une autre fonction du fichier.
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as M from "./bundle.mjs";
import { COURSES, QUIZ, EXERCISES } from "../src/content.js";
import { defaultState } from "../src/store/state.js";
import { buildPath } from "../src/store/pathEngine.js";

// --- Environnement navigateur minimal ---
const def = (nom, valeur) => {
  try { Object.defineProperty(globalThis, nom, { value: valeur, configurable: true, writable: true }); }
  catch { /* déjà en lecture seule : on fait sans */ }
};
def("window", globalThis);
if (!globalThis.navigator?.vibrate) {
  try { Object.defineProperty(globalThis.navigator ?? {}, "vibrate", { value: () => {}, configurable: true }); } catch {}
}
def("localStorage", { getItem: () => null, setItem: () => {}, removeItem: () => {} });
def("matchMedia", () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }));
def("document", {
  documentElement: { setAttribute: () => {}, style: {}, classList: { add(){}, remove(){} } },
  addEventListener: () => {}, removeEventListener: () => {},
  visibilityState: "visible",
  body: { style: {} },
});

const content = { courses: COURSES, quiz: QUIZ, exercises: EXERCISES };

// État réaliste : quelques leçons faites, pour que les écrans aient de la matière
const state = (() => {
  const s = defaultState();
  s.onboarding = { ...s.onboarding, done: true, overallTier: "A2", timePerWeek: "medium" };
  const units = buildPath(content, s);
  for (const l of units[0].lessons) s.completedLessons[l.id] = "2026-01-01";
  s.xp = 900; s.level = 8; s.streak = 4;
  s.quizResults = { [QUIZ[0].id]: { correct: true, attempts: 1, lastAttempt: "2026-01-01" } };
  return s;
})();

const path = buildPath(content, state);
const unitPrete = path.find(u => u.needsCheck) || path[0];
const lecon = path[0].lessons[0];
const noop = () => {};

// Les composants de rendu du manche, fournis par contexte comme dans l'app
const renderers = {
  renderDiagramBlock: () => null,
  FretboardLesson: () => null,
  FretboardQuizQuestion: () => null,
  FretboardExercise: () => null,
};

const cas = [
  ["CoursesScreen",     M.CoursesScreen.CoursesScreen,         { state, dispatch: noop, content }],
  ["LessonView",        M.CoursesScreen.LessonView,            { lesson: lecon, state, dispatch: noop, onBack: noop }],
  ["UnitCheckScreen",   M.UnitCheckScreen.UnitCheckScreen,     { unit: unitPrete, content, dispatch: noop, onDone: noop, state }],
  ["QuizScreen",        M.QuizScreen.QuizScreen,               { state, dispatch: noop, content }],
  ["ReviewSession",     M.ReviewSession.ReviewSession,         { questions: QUIZ.slice(0, 5).filter(q => q.type !== "fretboard"), state, dispatch: noop, onDone: noop }],
  ["ExercisesScreen",   M.ExercisesScreen.ExercisesScreen,     { state, dispatch: noop, content }],
  ["EarTraining",       M.EarTraining.EarTraining,             { onBack: noop, dispatch: noop }],
  ["JamSession",        M.JamSession.JamSession,               { onBack: noop }],
  ["HomeScreen",        M.HomeScreen.HomeScreen,               { state, dispatch: noop, content, navigate: noop }],
  ["ProgressScreen",    M.ProgressScreen.ProgressScreen,       { state, content, onOpenSettings: noop }],
  ["SettingsScreen",    M.SettingsScreen.SettingsScreen,       { state, dispatch: noop, content, onClose: noop, onImported: noop, user: { email: "a@b.c" }, onSignOut: noop, onDeleteAccount: noop }],
  ["ToolboxScreen",     M.ToolboxScreen.ToolboxScreen,         { onBack: noop }],
  ["FretboardExplorer", M.FretboardExplorer.FretboardExplorer, { onBack: noop }],
  ["TrainingScreen",    M.TrainingScreen.TrainingScreen,       { state, dispatch: noop, content, navigate: noop }],
  ["PracticeScreen",    M.PracticeScreen.PracticeScreen,       { state, dispatch: noop }],
  ["ChallengeScreen",   M.ChallengeScreen.ChallengeScreen,     { state, dispatch: noop, navigate: noop }],
  ["OnboardingScreen",  M.OnboardingScreen.OnboardingScreen,   { content, onComplete: noop, onEvent: noop }],

  // ── Cas PROFONDS ────────────────────────────────────────────────────────
  // Ces composants ne sont montés qu'après une interaction (lancer un quiz,
  // ouvrir un exercice). Ce sont eux qui consomment les composants de rendu
  // du manche — c'est exactement là que se cachait le
  // "FretboardQuizQuestion is not defined", invisible au premier rendu.
  ["QuizPlayer (QCM)",  M.QuizScreen.QuizPlayer, {
    pool: QUIZ.filter(q => q.type !== "fretboard").slice(0, 4),
    title: "Test", state, dispatch: noop, content, onDone: noop }],
  ["QuizPlayer (manche)", M.QuizScreen.QuizPlayer, {
    pool: QUIZ.filter(q => q.type === "fretboard").slice(0, 3),
    title: "Test manche", state, dispatch: noop, content, onDone: noop }],
  ["ExerciseDetail",    M.ExercisesScreen.ExerciseDetail, {
    ex: EXERCISES[0], state, dispatch: noop, onBack: noop, content }],
  ["ExerciseDetail (manche)", M.ExercisesScreen.ExerciseDetail, {
    ex: EXERCISES.find(e => e.type === "fretboard") || EXERCISES[0],
    state, dispatch: noop, onBack: noop, content }],
  ["ReviewSession (manche)", M.ReviewSession.ReviewSession, {
    questions: QUIZ.filter(q => q.type === "fretboard").slice(0, 3),
    state, dispatch: noop, onDone: noop }],
  ["LessonView (diagrammes)", M.CoursesScreen.LessonView, {
    lesson: COURSES.flatMap(c => c.lessons || [])
      .find(l => (l.blocks || []).some(b => b.type === "fretboard_interactive" || b.type === "diagram"))
      || lecon,
    state, dispatch: noop, onBack: noop }],
];

let ok = 0;
const echecs = [];

for (const [nom, Comp, props] of cas) {
  if (typeof Comp !== "function") { echecs.push([nom, "composant non exporté"]); continue; }
  try {
    const arbre = h(
      M.Theme.ThemeProvider, { theme: "dark" },
      h(M.Renderers.RenderersProvider, { value: renderers }, h(Comp, props))
    );
    const html = renderToStaticMarkup(arbre);
    if (!html || html.length < 20) throw new Error("rendu vide");
    ok++;
    console.log(`  ✓ ${nom.padEnd(20)} ${String(html.length).padStart(6)} caractères`);
  } catch (e) {
    echecs.push([nom, e.message]);
    console.log(`  ✗ ${nom.padEnd(20)} ${e.message}`);
  }
}

console.log(`\n${ok}/${cas.length} écrans rendus sans erreur`);
if (echecs.length) {
  console.log("\nÉCHECS :");
  for (const [n, m] of echecs) console.log(`  ${n} → ${m}`);
  process.exit(1);
}
