// ═══════════════════════════════════════════════════════════════════════════
// GuitarPath — App.jsx
// Point d'entrée principal : auth, routing, chargement async du contenu.
// Toute la logique métier est dans screens/ et store/.
// ═══════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./supabase/useAuth.js";
import { useProgress } from "./supabase/useProgress.js";
import { AuthScreen } from "./supabase/AuthScreen.jsx";
import { C, FONTS } from "./design/tokens.js";
import { Ti } from "./design/Ti.jsx";
import { Toast } from "./design/ui.jsx";
import { loadState, saveState, loadContent } from "./store/state.js";
import { reducer } from "./store/reducer.js";
import { BADGES, computeNewBadges } from "./store/badges.js";
import { buildReviewSession } from "./store/reviewEngine.js";

// ── Screens (lazy imports — chargés après le premier rendu) ────────────────
const screensPromise = Promise.all([
  import("./screens/HomeScreen.jsx"),
  import("./screens/CoursesScreen.jsx"),
  import("./screens/ExercisesScreen.jsx"),
  import("./screens/QuizScreen.jsx"),
  import("./screens/PracticeScreen.jsx"),
  import("./screens/ChallengeScreen.jsx"),
  import("./screens/ProgressScreen.jsx"),
  import("./screens/SettingsScreen.jsx"),
  import("./screens/FretboardExplorer.jsx"),
  import("./screens/JamSession.jsx"),
  import("./screens/ReviewSession.jsx"),
]);

// ── Contenu pédagogique (489kb) ───────────────────────────────────────────
const contentPromise = import("./content.js");

// ── Modules visuels — imports synchrones (58kb gzippé, pas de problème de double instance) ──
import { renderDiagramBlock } from "./diagrams.jsx";
import { FretboardLesson, FretboardQuizQuestion, FretboardExercise } from "./Fretboard.jsx";

// Refs des composants lazy — injectées dans les screens après chargement
let screens = null;

// ── Navigation ────────────────────────────────────────────────────────────
const TABS = [
  { id: "home",      label: "ACCUEIL",   icon: "home" },
  { id: "courses",   label: "COURS",     icon: "book-2" },
  { id: "exercises", label: "EXERCICES", icon: "guitar-pick" },
  { id: "quiz",      label: "QUIZ",      icon: "help-circle" },
  { id: "progress",  label: "PROGRÈS",   icon: "chart-bar" },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { loadProgress, saveProgress, syncOfflineData } = useProgress(user?.id);

  const [state, setState] = useState(loadState);
  const [content, setContent] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [screen, setScreen] = useState("home");
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [toast, setToast] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  // ── Chargement async de tout après le premier rendu ─────────────────────
  useEffect(() => {
    Promise.all([contentPromise, screensPromise])
      .then(([contentModule, screenModules]) => {

      // Injecter les renderers synchrones dans les screens
      const [, coursesM, exercisesM, quizM, , , , , , , reviewM] = screenModules;
      coursesM.setDiagramRenderer(renderDiagramBlock);
      coursesM.setFretboardLesson(FretboardLesson);
      exercisesM.setFretboardExercise(FretboardExercise);
      quizM.setFretboardQuizQuestion(FretboardQuizQuestion);
      if (reviewM?.setFretboardQuizQuestion) reviewM.setFretboardQuizQuestion(FretboardQuizQuestion);

      // Stocker les screens
      screens = {
        HomeScreen:          screenModules[0].HomeScreen,
        CoursesScreen:       screenModules[1].CoursesScreen,
        ExercisesScreen:     screenModules[2].ExercisesScreen,
        QuizScreen:          screenModules[3].QuizScreen,
        PracticeScreen:      screenModules[4].PracticeScreen,
        ChallengeScreen:     screenModules[5].ChallengeScreen,
        ProgressScreen:      screenModules[6].ProgressScreen,
        SettingsScreen:      screenModules[7].SettingsScreen,
        FretboardExplorer:   screenModules[8].FretboardExplorer,
        JamSession:          screenModules[9].JamSession,
        ReviewSession:       screenModules[10].ReviewSession,
      };

      // Charger le contenu (merge localStorage)
      const c = loadContent({
        courses:   contentModule.COURSES,
        quiz:      contentModule.QUIZ,
        exercises: contentModule.EXERCISES,
      });
      setContent(c);
      setAppReady(true);
    });
  }, []);

  const dispatch = useCallback((action) => {
    setState(prev => {
      const next = reducer(prev, action);
      saveState(next);
      return next;
    });
  }, []);

  // ── Badges ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!content) return;
    const newBadges = computeNewBadges(state, content);
    if (newBadges.length === 0) return;
    setState(prev => {
      const merged = [...new Set([...prev.unlockedBadges, ...newBadges])];
      if (merged.length === prev.unlockedBadges.length) return prev;
      const next = { ...prev, unlockedBadges: merged };
      saveState(next);
      return next;
    });
    const last = BADGES.find(b => b.id === newBadges[newBadges.length - 1]);
    if (last) setToast(`Badge débloqué : ${last.label}`);
  }, [state.xp, state.streak, state.completedLessons, state.completedExercises,
      state.quizResults, state.dailyChallengeCount, state.practiceLibre, content]);

  // ── Sync Supabase ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || progressLoaded) return;
    loadProgress().then(cloudState => {
      if (cloudState) {
        // Sanitiser — évite que null de Supabase écrase les valeurs par défaut
        const safe = { ...cloudState };
        if (safe.xp == null) delete safe.xp;
        if (safe.level == null) delete safe.level;
        if (safe.streak == null) delete safe.streak;
        setState(prev => ({ ...prev, ...safe }));
      }
      setProgressLoaded(true);
    });
  }, [user, progressLoaded, loadProgress]);

  useEffect(() => { if (!user) setProgressLoaded(false); }, [user]);

  // ── Sauvegarde Supabase — debounce stable via useRef ───────────────────
  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (!user || !progressLoaded) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveProgress(state);
    }, 3000);
    return () => clearTimeout(saveTimerRef.current);
  }, [state, user, progressLoaded]);

  useEffect(() => {
    const handleOnline = () => { if (user) syncOfflineData(); };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [user, syncOfflineData]);

  useEffect(() => { dispatch({ type: "ROTATE_DAILY" }); }, []);

  const reloadContent = () => {
    contentPromise.then(m => {
      setContent(loadContent({ courses: m.COURSES, quiz: m.QUIZ, exercises: m.EXERCISES }));
    });
  };

  const navigate = (s) => {
    if (TABS.find(t => t.id === s) || ["challenge","practice","explorer","jam","review"].includes(s)) {
      // Calculer les questions de revision une seule fois a l'ouverture
      if (s === "review" && content) {
        const session = buildReviewSession(
          content.quiz,
          state.reviewHistory || {},
          state.completedLessons,
          { targetCount: 12 }
        );
        setReviewQuestions(session.questions);
      }
      setScreen(s);
    }
  };

  // ── Loaders ──────────────────────────────────────────────────────────────
  if (authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
      <Ti name="music" size={42} color={C.primary} />
    </div>
  );

  if (!user) return <AuthScreen onSignIn={signIn} onSignUp={signUp} />;

  if (!appReady || !screens) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, gap: 16 }}>
      <Ti name="music" size={42} color={C.primary} />
      <div style={{ fontSize: 13, color: C.text2, fontFamily: FONTS.ui }}>Chargement…</div>
    </div>
  );

  const { HomeScreen, CoursesScreen, ExercisesScreen, QuizScreen,
          PracticeScreen, ChallengeScreen, ProgressScreen, SettingsScreen,
          FretboardExplorer, JamSession, ReviewSession } = screens;

  // ── Rendu principal ──────────────────────────────────────────────────────
  const renderScreen = () => {
    if (showSettings) return (
      <SettingsScreen state={state} dispatch={dispatch} content={content}
        onClose={() => setShowSettings(false)} onImported={reloadContent}
        user={user} onSignOut={signOut} />
    );
    switch (screen) {
      case "home":      return <HomeScreen state={state} dispatch={dispatch} navigate={navigate} content={content} />;
      case "courses":   return <CoursesScreen state={state} dispatch={dispatch} content={content} />;
      case "exercises": return <ExercisesScreen state={state} dispatch={dispatch} content={content} />;
      case "quiz":      return <QuizScreen state={state} dispatch={dispatch} content={content} />;
      case "explorer":  return <FretboardExplorer onBack={() => setScreen("home")} />;
      case "jam":       return <JamSession onBack={() => setScreen("home")} />;
      case "review":    return <ReviewSession questions={reviewQuestions} state={state} dispatch={dispatch} onDone={() => setScreen("home")} />;
      case "practice":  return <PracticeScreen state={state} dispatch={dispatch} />;
      case "challenge": return <ChallengeScreen state={state} dispatch={dispatch} navigate={navigate} />;
      case "progress":  return <ProgressScreen state={state} content={content} onOpenSettings={() => setShowSettings(true)} />;
      default:          return <HomeScreen state={state} dispatch={dispatch} navigate={navigate} content={content} />;
    }
  };

  const NAV_HEIGHT = 62;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Josefin+Sans:wght@400;500;600;700&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.20.0/dist/tabler-icons.min.css');
        html, body, #root { margin: 0; padding: 0; background: ${C.bg}; }
        body { font-family: ${FONTS.title}; color: ${C.text}; -webkit-tap-highlight-color: transparent; overscroll-behavior: none; }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div style={{ maxWidth: 440, margin: "0 auto", background: C.bg, minHeight: "100vh", position: "relative",
        paddingBottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        paddingTop: "env(safe-area-inset-top, 0px)" }}>
        {renderScreen()}
      </div>

      {!showSettings && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface,
          borderTop: `1px solid ${C.border}`, zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", height: NAV_HEIGHT, padding: "8px 0 6px" }}>
            {TABS.map(t => {
              const active = screen === t.id && !showSettings;
              return (
                <button key={t.id} onClick={() => { setScreen(t.id); setShowSettings(false); }} style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 2, color: active ? C.primary : C.text2, padding: "4px 0", fontFamily: FONTS.ui,
                }}>
                  <Ti name={t.icon} size={19} />
                  <span style={{ fontSize: 9, fontWeight: active ? 600 : 500, letterSpacing: "0.04em",
                    color: active ? C.primary : C.text2 }}>{t.label}</span>
                  {active && <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.primary, marginTop: -1 }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
