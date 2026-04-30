// ═══════════════════════════════════════════════════════════════════════════
// PATCH App.jsx — Intégration Supabase
// Applique ces modifications à ton App.jsx existant
// ═══════════════════════════════════════════════════════════════════════════

// ── 1. IMPORTS — ajoute en haut du fichier ──────────────────────────────────
// Remplace la première ligne par :

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { COURSES as DEFAULT_COURSES, QUIZ as DEFAULT_QUIZ, EXERCISES as DEFAULT_EXERCISES } from "./content.js";
import { useAuth } from "./supabase/useAuth.js";
import { useProgress } from "./supabase/useProgress.js";
import { AuthScreen } from "./supabase/AuthScreen.jsx";


// ── 2. FONCTION saveState — modifie dans la section PERSISTANCE ──────────────
// Garde l'original mais elle sera appelée moins souvent (Supabase prend le relais)
// Rien à changer ici.


// ── 3. EXPORT DEFAULT App — remplace entièrement la fonction App() ───────────

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { loadProgress, saveProgressDebounced, syncOfflineData } = useProgress(user?.id);

  const [state, setState]   = useState(loadState);
  const [content, setContent] = useState(loadContent);
  const [screen, setScreen] = useState("home");
  const [toast, setToast]   = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const dispatch = useCallback((action) => {
    setState(prev => {
      const next = reducer(prev, action);
      return next;
    });
  }, []);

  // ── Charger la progression Supabase à la connexion ──────────────────
  useEffect(() => {
    if (!user || progressLoaded) return;
    loadProgress().then(cloudState => {
      if (cloudState) {
        // Fusionner cloud + local (priorité cloud)
        setState(prev => ({ ...prev, ...cloudState }));
      }
      setProgressLoaded(true);
    });
  }, [user, progressLoaded, loadProgress]);

  // Reset progressLoaded à la déconnexion
  useEffect(() => {
    if (!user) setProgressLoaded(false);
  }, [user]);

  // ── Sauvegarder dans Supabase à chaque changement de state ──────────
  useEffect(() => {
    if (!user || !progressLoaded) return;
    saveProgressDebounced(state);
  }, [state, user, progressLoaded, saveProgressDebounced]);

  // ── Sync offline au retour en ligne ─────────────────────────────────
  useEffect(() => {
    const handleOnline = () => { if (user) syncOfflineData(); };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [user, syncOfflineData]);

  useEffect(() => { dispatch({ type: "ROTATE_DAILY" }); }, []);

  const prevBadgesCount = useMemo(() => state.unlockedBadges.length, []);
  useEffect(() => {
    if (state.unlockedBadges.length > prevBadgesCount) {
      const last = BADGES.find(b => b.id === state.unlockedBadges[state.unlockedBadges.length - 1]);
      if (last) setToast(`Badge débloqué : ${last.icon} ${last.label}`);
    }
  }, [state.unlockedBadges.length]);

  const reloadContent = () => setContent(loadContent());

  const navigate = (s) => {
    if (TABS.find(t => t.id === s)) setScreen(s);
    else if (s === "challenge") setScreen("challenge");
    else if (s === "practice")  setScreen("practice");
  };

  // ── Écran de chargement auth ─────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4FA' }}>
        <div style={{ fontSize: 40 }}>🎸</div>
      </div>
    );
  }

  // ── Non connecté → écran login ───────────────────────────────────────
  if (!user) {
    return <AuthScreen onSignIn={signIn} onSignUp={signUp} />;
  }

  const renderScreen = () => {
    if (showSettings) return (
      <SettingsScreen
        state={state} dispatch={dispatch} content={content}
        onClose={() => setShowSettings(false)} onImported={reloadContent}
        user={user} onSignOut={signOut}
      />
    );
    switch (screen) {
      case "home":      return <HomeScreen state={state} dispatch={dispatch} navigate={navigate} content={content} />;
      case "courses":   return <CoursesScreen state={state} dispatch={dispatch} content={content} />;
      case "exercises": return <ExercisesScreen state={state} dispatch={dispatch} content={content} />;
      case "quiz":      return <QuizScreen state={state} dispatch={dispatch} content={content} />;
      case "practice":  return <PracticeScreen state={state} dispatch={dispatch} />;
      case "challenge": return <ChallengeScreen state={state} dispatch={dispatch} navigate={navigate} />;
      case "progress":  return <ProgressScreen state={state} dispatch={dispatch} content={content} onOpenSettings={() => setShowSettings(true)} />;
      default:          return <HomeScreen state={state} dispatch={dispatch} navigate={navigate} content={content} />;
    }
  };

  const NAV_HEIGHT = 64;

  return (
    <>
      <style>{`
        html, body, #root { margin: 0; padding: 0; background: ${C.bg}; }
        body { font-family: ${FONTS.ui}; color: ${C.text}; -webkit-tap-highlight-color: transparent; overscroll-behavior: none; }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
      `}</style>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <div style={{
        maxWidth: 440, margin: "0 auto", background: C.bg, minHeight: "100vh",
        position: "relative",
        paddingBottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        {renderScreen()}
      </div>

      {!showSettings && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: C.bg, borderTop: `1px solid ${C.border}`,
          zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", height: NAV_HEIGHT }}>
            {TABS.map(t => {
              const active = screen === t.id;
              const icons = {
                home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?C.primary:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
                courses: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?C.primary:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
                exercises: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?C.primary:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
                quiz: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?C.primary:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                progress: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?C.primary:C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
              };
              return (
                <button key={t.id} onClick={() => { setScreen(t.id); setShowSettings(false); }} style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 3,
                  color: active ? C.primary : C.muted, padding: "8px 0",
                }}>
                  {icons[t.id]}
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, fontFamily: FONTS.ui, letterSpacing: "0.02em" }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}


// ── 4. SETTINGSSCREEN — ajoute les props user et onSignOut ───────────────────
// Remplace la signature de SettingsScreen par :

function SettingsScreen({ state, dispatch, content, onClose, onImported, user, onSignOut }) {
  // ... garde tout le code existant ...
  // Ajoute ce bloc juste AVANT le bouton "Supprimer le contenu importé" :

  /*
  <div style={{ background: C.bgSec, borderRadius: 14, padding: '1rem', marginBottom: '1rem' }}>
    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: FONTS.title }}>Compte</div>
    <div style={{ fontSize: 13, color: C.muted, marginBottom: 10, fontFamily: FONTS.body }}>
      Connecté : <strong>{user?.email}</strong>
    </div>
    <button onClick={onSignOut} style={{
      width: '100%', padding: '12px', borderRadius: 12,
      border: `1px solid ${C.coral}50`, background: C.bg,
      color: C.coral, fontSize: 13, cursor: 'pointer', fontFamily: FONTS.ui,
    }}>
      Se déconnecter
    </button>
  </div>
  */
}
