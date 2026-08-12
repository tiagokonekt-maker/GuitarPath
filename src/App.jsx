// ═══════════════════════════════════════════════════════════════════════════
// Groply — App.jsx
// Point d'entrée principal : auth, routing, chargement async du contenu.
// Toute la logique métier est dans screens/ et store/.
// ═══════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./supabase/useAuth.js";
import { useProgress } from "./supabase/useProgress.js";
import { AuthScreen } from "./supabase/AuthScreen.jsx";
import { FONTS } from "./design/tokens.js";
import { Ti } from "./design/Ti.jsx";
import { Toast } from "./design/ui.jsx";
import { Gropi } from "./design/Gropi.jsx";
import { ThemeProvider, useC } from "./design/ThemeContext.jsx";
import { loadState, saveState, loadContent, mergeStates, STATE_KEY } from "./store/state.js";
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
  import("./screens/TrainingScreen.jsx"),
  import("./screens/ChallengeScreen.jsx"),
  import("./screens/ProgressScreen.jsx"),
  import("./screens/SettingsScreen.jsx"),
  import("./screens/FretboardExplorer.jsx"),
  import("./screens/JamSession.jsx"),
  import("./screens/ReviewSession.jsx"),
  import("./screens/EarTraining.jsx"),
  import("./screens/ToolboxScreen.jsx"),
  import("./onboarding/OnboardingScreen.jsx"),
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
  { id: "home",      label: "Accueil",  icon: "home" },
  { id: "courses",   label: "Parcours", icon: "route" },
  // "Exercices" et "Quiz" fusionnés en un seul onglet "Pratique" : deux
  // sous-onglets (Théorie / Guitare en main) plutôt que deux entrées de
  // navigation distinctes qui piochaient dans le même contenu.
  { id: "training",  label: "Pratique", icon: "target-arrow" },
  { id: "progress",  label: "Progrès",  icon: "chart-bar" },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  // On lit le thème depuis localStorage directement (avant le state React)
  // pour éviter le flash de couleur au premier rendu.
  // BUGFIX : on passe par STATE_KEY (l'ancienne version lisait une clé
  // codée en dur qui ne correspondait pas à celle où l'état était sauvegardé,
  // donc le thème choisi n'était jamais relu au démarrage).
  const [theme, setTheme] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(STATE_KEY) || "{}"); return s.theme || "auto"; }
    catch { return "auto"; }
  });
  return (
    <ThemeProvider theme={theme}>
      <AppInner onThemeChange={setTheme} />
    </ThemeProvider>
  );
}

function AppInner({ onThemeChange }) {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { loadProgress, saveProgress, syncOfflineData } = useProgress(user?.id);

  const [state, setState] = useState(loadState);
  const C = useC();   // thème dynamique — remplace l'import statique
  const [content, setContent] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
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
        TrainingScreen:      screenModules[5].TrainingScreen,
        ChallengeScreen:     screenModules[6].ChallengeScreen,
        ProgressScreen:      screenModules[7].ProgressScreen,
        SettingsScreen:      screenModules[8].SettingsScreen,
        FretboardExplorer:   screenModules[9].FretboardExplorer,
        JamSession:          screenModules[10].JamSession,
        ReviewSession:       screenModules[11].ReviewSession,
        EarTraining:         screenModules[12].EarTraining,
        ToolboxScreen:       screenModules[13].ToolboxScreen,
        OnboardingScreen:    screenModules[14].OnboardingScreen,
      };

      // Charger le contenu (merge localStorage)
      const c = loadContent({
        courses:   contentModule.COURSES,
        quiz:      contentModule.QUIZ,
        exercises: contentModule.EXERCISES,
      });
      setContent(c);
      setAppReady(true);
    }).catch(err => {
      console.error("Erreur chargement app:", err);
      setLoadError(err);
    });
  }, []);

  const dispatch = useCallback((action) => {
    setState(prev => {
      const next = reducer(prev, action);
      saveState(next);
      if (action.type === "SET_THEME") onThemeChange(action.theme);
      if (action.type === "RESET" && user) {
        // RESET est annoncé à l'utilisateur comme irréversible — on ne peut
        // pas attendre le debounce de 3s de la sauvegarde normale, sinon
        // fermer l'app juste après laisse l'ancien état cloud "regagner"
        // au prochain chargement et annuler silencieusement le reset.
        saveProgress(next);
      }
      return next;
    });
  }, [onThemeChange, user, saveProgress]);

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
    let cancelled = false;
    loadProgress().then(cloudState => {
      if (cancelled) return; // l'utilisateur a changé pendant l'appel : réponse périmée, on l'ignore
      if (cloudState) {
        // Sanitiser — évite que null de Supabase écrase les valeurs par défaut
        const safe = { ...cloudState };
        if (safe.xp == null) delete safe.xp;
        if (safe.level == null) delete safe.level;
        if (safe.streak == null) delete safe.streak;
        // Merge champ par champ (multi-appareils) au lieu d'écraser :
        // deux appareils utilisés le même jour ne se font plus perdre
        // mutuellement leur progression.
        setState(prev => mergeStates(prev, safe));
      }
      setProgressLoaded(true);
    });
    return () => { cancelled = true; };
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
    // "exercises" et "quiz" ne sont plus des onglets, mais restent
    // acceptees : l'app memorise le dernier ecran visite, et quelqu'un qui
    // avait quitte sur l'ancien onglet Quiz doit pouvoir etre restaure
    // (la route redirige vers le nouvel onglet fusionne).
    if (TABS.find(t => t.id === s) || ["challenge","practice","explorer","jam","review","ear","toolbox","exercises","quiz"].includes(s)) {
      if (s === "review" && content) {
        const session = buildReviewSession(content.quiz, state.reviewHistory || {}, state.completedLessons, { targetCount: 12 });
        setReviewQuestions(session.questions);
      }
      setScreen(s);
    }
  };

  // ── Loaders ──────────────────────────────────────────────────────────────
  if (loadError) return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 14,
      background: C.bg, color: C.text, padding: 24, textAlign: "center",
      fontFamily: FONTS.title,
    }}>
      <Gropi pose="think" size={90} />
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.2px" }}>Oups, une fausse note.</div>
      <div style={{ fontSize: 13, color: C.text2, maxWidth: 300, lineHeight: 1.5 }}>
        Le contenu n'a pas pu se charger. Vérifie ta connexion et recharge l'app.
      </div>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 6, background: C.primary, color: "#fff", border: "none",
          borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: FONTS.ui,
        }}
      >
        Recharger Groply
      </button>
      <details style={{ marginTop: 8, fontSize: 11, color: C.text3, maxWidth: 320 }}>
        <summary style={{ cursor: "pointer" }}>Détails techniques</summary>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", textAlign: "left", background: C.surface2, padding: 8, borderRadius: 8, marginTop: 6 }}>
          {loadError?.message || String(loadError)}
        </pre>
      </details>
    </div>
  );

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
          PracticeScreen, TrainingScreen, ChallengeScreen, ProgressScreen, SettingsScreen,
          FretboardExplorer, JamSession, ReviewSession, EarTraining, ToolboxScreen,
          OnboardingScreen } = screens;

  // ── Onboarding : test de placement adaptatif, une seule fois ────────────
  // Tant que ce n'est pas fait (ou explicitement passé), on ne montre rien
  // d'autre — c'est ce qui détermine le grade/XP de départ et la priorité
  // du Parcours (module le plus faible en premier).
  if (!state.onboarding?.done) {
    return (
      <OnboardingScreen
        content={content}
        onComplete={(answers) => dispatch({ type: "COMPLETE_ONBOARDING", ...answers })}
      />
    );
  }

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
      case "training":  return <TrainingScreen state={state} dispatch={dispatch} content={content} />;
      // Anciennes routes conservees : elles redirigent vers le nouvel onglet
      // fusionne plutot que de casser un lien profond ou un raccourci deja
      // enregistre par quelqu'un (l'app memorise le dernier ecran visite).
      case "exercises":
      case "quiz":      return <TrainingScreen state={state} dispatch={dispatch} content={content} />;
      case "ear":       return <EarTraining onBack={() => setScreen("home")} dispatch={dispatch} />;
      case "explorer":  return <FretboardExplorer onBack={() => setScreen("home")} />;
      case "jam":       return <JamSession onBack={() => setScreen("home")} />;
      case "toolbox":   return <ToolboxScreen onBack={() => setScreen("home")} />;
      case "review":    return <ReviewSession questions={reviewQuestions} state={state} dispatch={dispatch} onDone={() => setScreen("home")} />;
      case "practice":  return <PracticeScreen state={state} dispatch={dispatch} />;
      case "challenge": return <ChallengeScreen state={state} dispatch={dispatch} navigate={navigate} />;
      case "progress":  return <ProgressScreen state={state} content={content} onOpenSettings={() => setShowSettings(true)} />;
      default:          return <HomeScreen state={state} dispatch={dispatch} navigate={navigate} content={content} />;
    }
  };

  // Hauteur nav + safe area iOS
  const NAV_HEIGHT = 66;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.20.0/dist/tabler-icons.min.css');

        html, body, #root {
          margin: 0; padding: 0;
          background: ${C.bg};
        }
        body {
          font-family: ${FONTS.title};
          color: ${C.text};
          -webkit-tap-highlight-color: transparent;
          overscroll-behavior: none;
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }

        /* ── Masquer toutes les scrollbars (mobile-first) ─────────────── */
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
      `}</style>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div style={{
        maxWidth: 440, margin: "0 auto",
        background: C.bg, minHeight: "100vh",
        position: "relative",
        paddingBottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        {renderScreen()}
      </div>

      {/* ── Barre de navigation ────────────────────────────────────────── */}
      {!showSettings && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: C.surface,
          borderTop: `1.5px solid ${C.border}`,
          zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{
            maxWidth: 440, margin: "0 auto",
            display: "flex",
            height: NAV_HEIGHT,
            padding: "10px 4px 0",
          }}>
            {TABS.map(t => {
              const active = screen === t.id && !showSettings;
              return (
                <button
                  key={t.id}
                  onClick={() => { setScreen(t.id); setShowSettings(false); }}
                  style={{
                    flex: 1,
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "flex-start",
                    gap: 3,
                    padding: "4px 0",
                    fontFamily: FONTS.ui,
                    minHeight: 44,
                  }}
                >
                  <Ti name={t.icon} size={21} color={active ? C.primary : C.text2} />
                  <span style={{
                    fontSize: 10,
                    fontWeight: active ? 700 : 500,
                    color: active ? C.primary : C.text2,
                    letterSpacing: "0.01em",
                  }}>
                    {t.label}
                  </span>
                  {active && (
                    <span style={{
                      width: 4, height: 4,
                      borderRadius: "50%",
                      background: C.primary,
                      marginTop: 1,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Bouton flottant : Boîte à outils ───────────────────────────── */}
      {!showSettings && screen !== "toolbox" && (
        <div style={{
          position: "fixed", left: 0, right: 0,
          bottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px) + 14px)`,
          maxWidth: 440, margin: "0 auto",
          pointerEvents: "none", zIndex: 101,
        }}>
          <button
            onClick={() => navigate("toolbox")}
            aria-label="Boîte à outils"
            style={{
              pointerEvents: "auto",
              position: "absolute", right: 16, bottom: 0,
              width: 58, height: 58, borderRadius: "50%", border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,#FF9155,${C.primary})`,
              boxShadow: `0 6px 20px ${C.primary}66`,
              overflow: "visible",
            }}
          >
            <Gropi pose="rocker" size={72} anim="bob" style={{
              position: "absolute", bottom: -8, left: "calc(50% - 8px)", transform: "translateX(-50%)",
              filter: "drop-shadow(0 4px 8px rgba(120,40,0,.35))",
            }}/>
          </button>
        </div>
      )}
    </>
  );
}
