// ═══════════════════════════════════════════════════════════════════════════
// Groply — App.jsx
// Point d'entrée : auth, routing, chargement du contenu, synchronisation.
//
// ── Ce qui change ─────────────────────────────────────────────────────────
// §3.1 VRAI CODE SPLITTING. Avant : `Promise.all([15 imports])` + content.js,
//      donc rien ne s'affichait avant que TOUTE l'application soit
//      téléchargée. Ce n'était pas du lazy loading, c'était un chargement
//      monolithique avec une étape en plus. Maintenant : React.lazy par
//      écran, Suspense, et le contenu chargé en parallèle du premier rendu.
// §4.3 PLUS D'INJECTION PAR MUTATION DE MODULE. Les cinq `setXxxRenderer()`
//      qui muraient l'état d'un module sont remplacés par un contexte.
// §3.2 PLUS DE <style> INJECTÉ À CHAQUE RENDU. Tout est dans index.css.
// §2.4 FLUSH DE SAUVEGARDE sur `visibilitychange` : jusqu'à 3 s de
//      progression étaient perdues à chaque fermeture d'app.
// §2.5 GARDE D'ONBOARDING : on attend la progression cloud avant de décider
//      de montrer le test de placement, sinon un nouvel appareil le
//      réimposait et écrasait les réponses du premier.
// §2.10 PLUS D'EFFET DE BORD dans un updater React : la persistance
//      localStorage passe par un effet.
// §2.11 NAVIGATION DANS L'HISTORIQUE : le bouton retour Android revient à
//      l'écran précédent au lieu de fermer la PWA.
// §7.7 ANALYTIQUE BRANCHÉE : analytics.js existait, complet, et n'était
//      importé nulle part.
// ═══════════════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from "react";

import "./index.css";

import { useAuth } from "./supabase/useAuth.js";
import { useProgress } from "./supabase/useProgress.js";
import { AuthScreen } from "./supabase/AuthScreen.jsx";
import { FONTS, T, TAP } from "./design/tokens.js";
import { Ti } from "./design/Ti.jsx";
import { Toast } from "./design/ui.jsx";
import { Gropi } from "./design/Gropi.jsx";
import { ThemeProvider, useC } from "./design/ThemeContext.jsx";
import { loadState, saveState, loadContent, mergeStates, STATE_KEY } from "./store/state.js";
import { reducer } from "./store/reducer.js";
import { BADGES, computeNewBadges } from "./store/badges.js";
import { buildReviewSession } from "./store/reviewEngine.js";
import { dailyTargetFromTime } from "./store/placementEngine.js";
import { analytics, EVENTS } from "./analytics.js";

// ── Modules visuels partagés ──────────────────────────────────────────────
// Fretboard et diagrams sont utilisés par presque tous les écrans : les
// charger en statique est le bon choix, mais ils passent par un contexte au
// lieu d'être injectés dans les modules des écrans.
import { RenderersProvider } from "./renderers.jsx";
import { renderDiagramBlock } from "./diagrams.jsx";
import { FretboardLesson, FretboardQuizQuestion, FretboardExercise } from "./Fretboard.jsx";

const RENDERERS = { renderDiagramBlock, FretboardLesson, FretboardQuizQuestion, FretboardExercise };

// ── Écrans : un chunk par écran, chargé au moment où on y va ──────────────
const HomeScreen        = lazy(() => import("./screens/HomeScreen.jsx").then(m => ({ default: m.HomeScreen })));
const CoursesScreen     = lazy(() => import("./screens/CoursesScreen.jsx").then(m => ({ default: m.CoursesScreen })));
const TrainingScreen    = lazy(() => import("./screens/TrainingScreen.jsx").then(m => ({ default: m.TrainingScreen })));
const ProgressScreen    = lazy(() => import("./screens/ProgressScreen.jsx").then(m => ({ default: m.ProgressScreen })));
const SettingsScreen    = lazy(() => import("./screens/SettingsScreen.jsx").then(m => ({ default: m.SettingsScreen })));
const PracticeScreen    = lazy(() => import("./screens/PracticeScreen.jsx").then(m => ({ default: m.PracticeScreen })));
const ChallengeScreen   = lazy(() => import("./screens/ChallengeScreen.jsx").then(m => ({ default: m.ChallengeScreen })));
const FretboardExplorer = lazy(() => import("./screens/FretboardExplorer.jsx").then(m => ({ default: m.FretboardExplorer })));
const JamSession        = lazy(() => import("./screens/JamSession.jsx").then(m => ({ default: m.JamSession })));
const ReviewSession     = lazy(() => import("./screens/ReviewSession.jsx").then(m => ({ default: m.ReviewSession })));
const EarTraining       = lazy(() => import("./screens/EarTraining.jsx").then(m => ({ default: m.EarTraining })));
const ToolboxScreen     = lazy(() => import("./screens/ToolboxScreen.jsx").then(m => ({ default: m.ToolboxScreen })));
const OnboardingScreen  = lazy(() => import("./onboarding/OnboardingScreen.jsx").then(m => ({ default: m.OnboardingScreen })));

/** Précharge un écran sans l'afficher — appelé au survol/appui de l'onglet. */
const PRELOAD = {
  home:     () => import("./screens/HomeScreen.jsx"),
  courses:  () => import("./screens/CoursesScreen.jsx"),
  training: () => import("./screens/TrainingScreen.jsx"),
  progress: () => import("./screens/ProgressScreen.jsx"),
  toolbox:  () => import("./screens/ToolboxScreen.jsx"),
};

// ── Contenu pédagogique ───────────────────────────────────────────────────
// Chargé en parallèle du premier rendu, pas avant lui.
const chargerContenu = () => import("./content.js");

// ── Navigation ────────────────────────────────────────────────────────────
const TABS = [
  { id: "home",      label: "Accueil",  icon: "home" },
  { id: "courses",   label: "Parcours", icon: "route" },
  { id: "training",  label: "Pratique", icon: "target-arrow" },
  { id: "progress",  label: "Progrès",  icon: "chart-bar" },
];

const ECRANS_VALIDES = new Set([
  ...TABS.map(t => t.id),
  "challenge", "practice", "explorer", "jam", "review", "ear", "toolbox",
  "exercises", "quiz",   // anciennes routes, redirigées
]);

// Écrans où le bouton flottant est masqué : au milieu d'un exercice, on ne
// propose pas une porte de sortie, et il recouvrait le bouton « Valider ».
const SANS_FAB = new Set(["toolbox", "review", "practice", "challenge", "ear", "jam", "explorer"]);

const NAV_HEIGHT = 64;

// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  // Thème lu directement dans localStorage avant le state React, pour éviter
  // le flash de couleur au premier rendu.
  const [theme, setTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}").theme || "auto"; }
    catch { return "auto"; }
  });
  return (
    <ThemeProvider theme={theme}>
      <RenderersProvider value={RENDERERS}>
        <AppInner onThemeChange={setTheme} />
      </RenderersProvider>
    </ThemeProvider>
  );
}

function AppInner({ onThemeChange }) {
  const {
    user, loading: authLoading, recovery,
    signIn, signUp, signOut, resetPassword, updatePassword, resendConfirmation,
  } = useAuth();
  const { loadProgress, saveProgress, flush, syncOfflineData, deleteAccount } = useProgress(user?.id);

  const C = useC();
  const [state, setState] = useState(loadState);
  const [content, setContent] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [screen, setScreen] = useState("home");
  const [reviewQuestions, setReviewQuestions] = useState([]);
  const [toast, setToast] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [swReady, setSwReady] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;

  // ── Contenu pédagogique ────────────────────────────────────────────────
  const rechargerContenu = useCallback(() => {
    chargerContenu()
      .then(m => setContent(loadContent({ courses: m.COURSES, quiz: m.QUIZ, exercises: m.EXERCISES })))
      .catch(err => { console.error("Groply — chargement du contenu :", err); setLoadError(err); });
  }, []);
  useEffect(() => { rechargerContenu(); }, [rechargerContenu]);

  // ── Dispatch ───────────────────────────────────────────────────────────
  // Aucun effet de bord ici : uniquement le calcul du nouvel état. La
  // persistance est faite plus bas, dans un effet — avant, `saveState` était
  // appelé DANS l'updater (que React peut invoquer deux fois) et une seconde
  // fois dans le reducer lui-même.
  const dispatch = useCallback((action) => {
    setState(prev => reducer(prev, action));
    if (action.type === "SET_THEME") onThemeChange(action.theme);
    analytics.trackAction(action);
  }, [onThemeChange]);

  // ── Persistance locale ─────────────────────────────────────────────────
  useEffect(() => {
    const ok = saveState(state);
    if (!ok) setToast("Espace de stockage plein : ta progression n'a pas pu être enregistrée localement.");
  }, [state]);

  // ── Analytique ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { analytics.stop(); return; }
    analytics.start(user.id);
    analytics.track(EVENTS.APP_OPEN);
    return () => analytics.stop();
  }, [user]);

  useEffect(() => {
    if (user && progressLoaded) analytics.track(EVENTS.SCREEN_VIEW, { screen });
  }, [screen, user, progressLoaded]);

  // ── Badges ─────────────────────────────────────────────────────────────
  // Les dépendances sont des compteurs SCALAIRES et non les objets eux-mêmes :
  // avant, l'effet se redéclenchait à chaque action et re-parcourait les 142
  // quiz et 36 exercices pour chaque badge de maîtrise.
  const signatureBadges = useMemo(() => [
    state.xp, state.streak, state.level,
    Object.keys(state.completedLessons).length,
    Object.keys(state.completedExercises).length,
    Object.keys(state.quizResults).length,
    state.dailyChallengeCount,
    state.practiceLibre?.count || 0,
    state.weeklyGoals?.sessions || 0,
  ].join("|"), [state]);

  useEffect(() => {
    if (!content) return;
    const nouveaux = computeNewBadges(state, content);
    if (nouveaux.length === 0) return;
    dispatch({ type: "UNLOCK_BADGES", badgeIds: nouveaux });
    const dernier = BADGES.find(b => b.id === nouveaux[nouveaux.length - 1]);
    if (dernier) setToast(`Badge débloqué : ${dernier.label}`);
    for (const id of nouveaux) analytics.track("badge_unlocked", { badge: id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatureBadges, content]);

  // ── Chargement de la progression cloud ─────────────────────────────────
  useEffect(() => {
    if (!user) { setProgressLoaded(false); return; }
    if (progressLoaded) return;
    let annule = false;
    loadProgress()
      .then(cloud => {
        if (annule) return;
        if (cloud) {
          const sain = { ...cloud };
          if (sain.xp == null) delete sain.xp;
          if (sain.level == null) delete sain.level;
          if (sain.streak == null) delete sain.streak;
          setState(prev => mergeStates(prev, sain));
        }
        setProgressLoaded(true);
      })
      .catch(() => { if (!annule) setProgressLoaded(true); });   // hors-ligne : on n'enferme pas l'utilisateur
    return () => { annule = true; };
  }, [user, progressLoaded, loadProgress]);

  // ── Sauvegarde cloud débouncée ─────────────────────────────────────────
  const saveTimer = useRef(null);
  useEffect(() => {
    if (!user || !progressLoaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveProgress(stateRef.current), 3000);
    return () => clearTimeout(saveTimer.current);
  }, [state, user, progressLoaded, saveProgress]);

  // ── Sauvegarde de dernière chance ──────────────────────────────────────
  // Le geste normal sur mobile : je termine mon quiz, je ferme l'app. Sans
  // ce flush, la dernière session était perdue côté cloud.
  useEffect(() => {
    if (!user || !progressLoaded) return;
    const vider = () => {
      if (document.visibilityState !== "hidden") return;
      clearTimeout(saveTimer.current);
      flush(stateRef.current);
    };
    document.addEventListener("visibilitychange", vider);
    window.addEventListener("pagehide", vider);
    return () => {
      document.removeEventListener("visibilitychange", vider);
      window.removeEventListener("pagehide", vider);
    };
  }, [user, progressLoaded, flush]);

  // ── Retour en ligne ────────────────────────────────────────────────────
  useEffect(() => {
    const enLigne = () => { if (user) syncOfflineData(); };
    window.addEventListener("online", enLigne);
    return () => window.removeEventListener("online", enLigne);
  }, [user, syncOfflineData]);

  // ── Rotation du défi du jour ───────────────────────────────────────────
  // Après le chargement cloud : sinon la rotation était calculée sur l'état
  // local puis réécrite par le merge.
  useEffect(() => {
    if (progressLoaded) dispatch({ type: "ROTATE_DAILY" });
  }, [progressLoaded, dispatch]);

  // ── Service worker : proposer la mise à jour, ne pas l'imposer ──────────
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    let reg;
    const enregistrer = async () => {
      try {
        reg = await navigator.serviceWorker.register("/sw.js");
        reg.addEventListener("updatefound", () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            // Un SW en attente + un SW actif = une nouvelle version est prête.
            if (sw.state === "installed" && navigator.serviceWorker.controller) setSwReady(true);
          });
        });
      } catch { /* la PWA reste utilisable sans SW */ }
    };
    window.addEventListener("load", enregistrer);
    return () => window.removeEventListener("load", enregistrer);
  }, []);

  const appliquerMaj = () => {
    navigator.serviceWorker.getRegistration().then(reg => {
      const sw = reg?.waiting || reg?.installing;
      if (!sw) return window.location.reload();
      navigator.serviceWorker.addEventListener("controllerchange",
        () => window.location.reload(), { once: true });
      sw.postMessage({ type: "SKIP_WAITING" });
    });
  };

  // ── Navigation ─────────────────────────────────────────────────────────
  const cibleSession = dailyTargetFromTime(state.onboarding?.timePerWeek);

  const navigate = useCallback((s, { remplacer = false } = {}) => {
    if (!ECRANS_VALIDES.has(s)) return;
    if (s === "review" && content) {
      const session = buildReviewSession(
        content.quiz, state.reviewHistory || {}, state.completedLessons,
        { targetCount: cibleSession, maxNew: Math.ceil(cibleSession / 3) },
      );
      setReviewQuestions(session.questions);
    }
    setShowSettings(false);
    setScreen(s);
    // Une entrée d'historique par écran : le bouton retour Android revient à
    // l'écran précédent au lieu de quitter la PWA.
    try {
      const url = s === "home" ? "#" : `#${s}`;
      if (remplacer) history.replaceState({ screen: s }, "", url);
      else history.pushState({ screen: s }, "", url);
    } catch { /* contexte sans history (tests, iframe) */ }
  }, [content, state.reviewHistory, state.completedLessons, cibleSession]);

  useEffect(() => {
    const auRetour = (e) => {
      const s = e.state?.screen;
      if (showSettings) { setShowSettings(false); return; }
      setScreen(ECRANS_VALIDES.has(s) ? s : "home");
    };
    window.addEventListener("popstate", auRetour);
    // Ancrage initial, pour que le premier retour ne sorte pas de l'app.
    try {
      const depart = (location.hash || "").slice(1);
      history.replaceState({ screen: ECRANS_VALIDES.has(depart) ? depart : "home" }, "");
      if (ECRANS_VALIDES.has(depart)) setScreen(depart);
    } catch { /* noop */ }
    return () => window.removeEventListener("popstate", auRetour);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSettings]);

  // Raccourcis du manifeste (?shortcut=session|jam). L'ancienne version
  // écrivait `window.__GROPLY_SHORTCUT` dans index.html, valeur que personne
  // ne lisait : les deux raccourcis ne faisaient rien.
  const raccourciTraite = useRef(false);
  useEffect(() => {
    if (raccourciTraite.current || !content || !progressLoaded) return;
    raccourciTraite.current = true;
    const sc = new URLSearchParams(location.search).get("shortcut");
    if (sc === "session") navigate("review", { remplacer: true });
    if (sc === "jam")     navigate("jam",    { remplacer: true });
  }, [content, progressLoaded, navigate]);

  const ouvrirReglages = useCallback(() => {
    setShowSettings(true);
    try { history.pushState({ screen, settings: true }, "", "#reglages"); } catch { /* noop */ }
  }, [screen]);

  // ── Écrans de service ──────────────────────────────────────────────────
  if (loadError) return <EcranErreur C={C} message={loadError?.message || String(loadError)} />;

  if (authLoading) return <EcranChargement C={C} texte="Groply" />;

  if (!user || recovery) return (
    <AuthScreen
      onSignIn={signIn} onSignUp={signUp}
      onResetPassword={resetPassword} onUpdatePassword={updatePassword}
      onResendConfirmation={resendConfirmation}
      recovery={recovery}
    />
  );

  // On attend le contenu ET la progression cloud avant de décider quoi que ce
  // soit : c'est ce qui empêche de réimposer l'onboarding sur un nouvel
  // appareil (audit §2.5).
  if (!content || !progressLoaded) return <EcranChargement C={C} texte="Chargement…" />;

  if (!state.onboarding?.done) {
    return (
      <Suspense fallback={<EcranChargement C={C} texte="Préparation du test…" />}>
        <OnboardingScreen
          content={content}
          onEvent={(nom, props) => analytics.track(nom, props)}
          onComplete={(reponses) => dispatch({ type: "COMPLETE_ONBOARDING", ...reponses })}
        />
      </Suspense>
    );
  }

  // ── Rendu principal ────────────────────────────────────────────────────
  const props = { state, dispatch, content, navigate };
  const rendreEcran = () => {
    if (showSettings) return (
      <SettingsScreen {...props}
        onClose={() => { setShowSettings(false); try { history.back(); } catch {} }}
        onImported={rechargerContenu}
        user={user} onSignOut={signOut} onDeleteAccount={deleteAccount} />
    );
    switch (screen) {
      case "home":      return <HomeScreen {...props} />;
      case "courses":   return <CoursesScreen {...props} />;
      // Anciennes routes conservées : « Exercices » et « Quiz » ont fusionné
      // en « Pratique », mais l'app mémorise le dernier écran visité.
      case "training":
      case "exercises":
      case "quiz":      return <TrainingScreen {...props} />;
      case "progress":  return <ProgressScreen state={state} content={content} onOpenSettings={ouvrirReglages} />;
      case "ear":       return <EarTraining onBack={() => navigate("home")} dispatch={dispatch} />;
      case "explorer":  return <FretboardExplorer onBack={() => navigate("home")} />;
      case "jam":       return <JamSession onBack={() => navigate("home")} />;
      case "toolbox":   return <ToolboxScreen onBack={() => navigate("home")} />;
      case "review":    return <ReviewSession questions={reviewQuestions} state={state} dispatch={dispatch} onDone={() => navigate("home")} />;
      case "practice":  return <PracticeScreen state={state} dispatch={dispatch} />;
      case "challenge": return <ChallengeScreen state={state} dispatch={dispatch} navigate={navigate} />;
      default:          return <HomeScreen {...props} />;
    }
  };

  return (
    <>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {swReady && (
        <div role="status" style={{
          position: "fixed", top: "calc(env(safe-area-inset-top, 0px) + 10px)",
          left: 12, right: 12, maxWidth: 416, margin: "0 auto", zIndex: 400,
          background: C.surface, border: `1.5px solid ${C.primaryBorder}`,
          borderRadius: 14, padding: "10px 12px", boxShadow: "var(--gr-shadow)",
          display: "flex", alignItems: "center", gap: 10,
          fontSize: T.small, fontFamily: FONTS.ui, color: C.text,
        }}>
          <Ti name="refresh" size={16} color={C.primary} />
          <span style={{ flex: 1 }}>Une nouvelle version est prête.</span>
          <button onClick={appliquerMaj} className="gr-focus" style={{
            background: C.primaryBtn, color: "#fff", border: "none", borderRadius: 10,
            padding: "9px 14px", fontWeight: 700, fontSize: 12.5, cursor: "pointer", minHeight: TAP.min - 8,
          }}>Mettre à jour</button>
        </div>
      )}

      <main
        className="gr-vscroll"
        style={{
          maxWidth: 440, margin: "0 auto",
          background: C.bg, minHeight: "100dvh",
          position: "relative",
          paddingBottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px) + 24px)`,
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <Suspense fallback={<EcranChargement C={C} texte="" hauteur="60dvh" />}>
          {rendreEcran()}
        </Suspense>
      </main>

      {/* ── Barre de navigation ──────────────────────────────────────── */}
      {!showSettings && (
        <nav aria-label="Navigation principale" style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", height: NAV_HEIGHT }}>
            {TABS.map(t => {
              const actif = screen === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => navigate(t.id)}
                  onPointerEnter={() => PRELOAD[t.id]?.()}
                  aria-current={actif ? "page" : undefined}
                  aria-label={t.label}
                  className="gr-focus"
                  style={{
                    flex: 1, background: "none", border: "none", cursor: "pointer",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 3,
                    padding: "6px 0", fontFamily: FONTS.ui,
                    minHeight: TAP.min,
                    // Repère d'onglet actif en haut : plus lisible qu'un point
                    // de 4 px, et il ne décale plus le contenu du bouton.
                    boxShadow: actif ? `inset 0 2px 0 0 ${C.primary}` : "none",
                  }}
                >
                  <Ti name={t.icon} size={22} color={actif ? C.primaryInk : C.text2} />
                  <span style={{
                    fontSize: T.micro,
                    fontWeight: actif ? 700 : 500,
                    color: actif ? C.primaryInk : C.text2,
                  }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ── Bouton flottant : boîte à outils ─────────────────────────── */}
      {!showSettings && !SANS_FAB.has(screen) && (
        <div style={{
          position: "fixed", left: 0, right: 0,
          bottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px) + 14px)`,
          maxWidth: 440, margin: "0 auto",
          pointerEvents: "none", zIndex: 101,
        }}>
          <button
            onClick={() => navigate("toolbox")}
            onPointerEnter={() => PRELOAD.toolbox()}
            aria-label="Boîte à outils"
            className="gr-focus"
            style={{
              pointerEvents: "auto",
              position: "absolute", right: 16, bottom: 0,
              width: 58, height: 58, borderRadius: "50%", border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,#FF9155,${C.primaryBtn})`,
              boxShadow: `0 6px 20px ${C.primary}55`,
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

// ── Écrans de service ──────────────────────────────────────────────────────
// Le texte remplace l'icône : les deux anciens écrans de chargement
// affichaient `<Ti name="music">`, c'est-à-dire une icône issue d'une webfont
// qui n'est justement pas encore chargée à ce moment-là — donc un spinner
// invisible.
function EcranChargement({ C, texte, hauteur = "100dvh" }) {
  return (
    <div role="status" aria-live="polite" style={{
      minHeight: hauteur, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 14,
      background: C.bg, fontFamily: FONTS.ui,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        border: `3px solid ${C.border}`, borderTopColor: C.primary,
        animation: "gr-spin .8s linear infinite",
      }} />
      {texte && <div style={{ fontSize: 13, color: C.text2 }}>{texte}</div>}
      <style>{`@keyframes gr-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

function EcranErreur({ C, message }) {
  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 14,
      background: C.bg, color: C.text, padding: 24, textAlign: "center",
      fontFamily: FONTS.title,
    }}>
      <Gropi pose="think" size={90} />
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.2px" }}>Oups, une fausse note.</div>
      <div style={{ fontSize: 13, color: C.text2, maxWidth: 300, lineHeight: 1.5 }}>
        Le contenu n'a pas pu se charger. Vérifie ta connexion et recharge l'app.
        Ta progression est en sécurité.
      </div>
      <button onClick={() => window.location.reload()} className="gr-focus" style={{
        marginTop: 6, background: C.primaryBtn, color: "#fff", border: "none",
        borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700,
        cursor: "pointer", fontFamily: FONTS.ui, minHeight: 48,
      }}>Recharger Groply</button>
      <details style={{ marginTop: 8, fontSize: 11, color: C.text3, maxWidth: 320 }}>
        <summary style={{ cursor: "pointer", padding: 8 }}>Détails techniques</summary>
        <pre style={{
          whiteSpace: "pre-wrap", wordBreak: "break-word", textAlign: "left",
          background: C.surface2, padding: 8, borderRadius: 8, marginTop: 6,
        }}>{message}</pre>
      </details>
    </div>
  );
}
