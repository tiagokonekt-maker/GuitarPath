import { useState, useEffect, useCallback, useMemo } from "react";
import { COURSES as DEFAULT_COURSES, QUIZ as DEFAULT_QUIZ, EXERCISES as DEFAULT_EXERCISES } from "./content.js";
import { useAuth } from "./supabase/useAuth.js";
import { useProgress } from "./supabase/useProgress.js";
import { AuthScreen } from "./supabase/AuthScreen.jsx";
import { renderDiagramBlock } from "./diagrams.jsx";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — palette claire, polices Roboto + Josefin Sans, Tabler icons
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  // Surfaces
  bg:           "#F8F7F4",   // fond principal beige cassé
  surface:      "#FFFFFF",   // cartes
  surface2:     "#F1EFE8",   // surfaces secondaires
  border:       "#E8E6E0",   // bordures fines
  borderSoft:   "#F1EFE8",   // bordures très douces (séparateurs)

  // Texte
  text:         "#1A1714",   // texte principal
  text2:        "#5F5E5A",   // texte secondaire
  text3:        "#888780",   // texte tertiaire / captions

  // Marque · XP · niveau
  primary:      "#4C42C8",   // violet principal
  primaryL:     "#F4F2FE",   // violet pâle (fond)
  primaryBorder:"#D8D3F6",   // violet pâle (bordure)
  primaryD:     "#3C3489",   // violet foncé (texte sur fond pâle)

  // Exercices · succès
  green:        "#1D9E75",
  greenL:       "#E8F5EE",
  greenBorder:  "#A8D8BD",
  greenD:       "#085041",

  // Streak · manche · défi
  amber:        "#BA7517",
  amberL:       "#FCF5E4",
  amberBorder:  "#EFD9A7",
  amberD:       "#854F0B",

  // Practice · rythme · erreur
  coral:        "#D85A30",
  coralL:       "#FBEDE5",
  coralBorder:  "#EAC3AC",
  coralD:       "#712B13",

  // Improvisation
  pink:         "#D4537E",
  pinkL:        "#FBEAF1",

  // Danger (déconnexion, reset)
  danger:       "#A32D2D",
};

const FONTS = {
  title: '"Roboto", -apple-system, sans-serif',     // titres + body
  body:  '"Roboto", -apple-system, sans-serif',
  ui:    '"Josefin Sans", "Roboto", sans-serif',    // petites écritures, chiffres, labels
};

const R = { sm: 10, md: 12, lg: 14, xl: 18, pill: 999 };

// ═══════════════════════════════════════════════════════════════════════════
// PERSISTANCE
// ═══════════════════════════════════════════════════════════════════════════
const STATE_KEY = "guitarpath_v4_state";
const CONTENT_KEY = "guitarpath_v3_content";

const defaultState = () => ({
  xp: 0, level: 1, streak: 0, lastSessionDate: "",
  completedExercises: {}, exerciseProgress: {},
  quizResults: {}, wrongQuiz: [],
  completedLessons: {},
  dailyChallengeIdx: 0, dailyChallengeDone: false, dailyChallengeDate: "",
  dailyChallengeCount: 0,
  unlockedBadges: [],
  weeklyGoals: { sessions: 0, exercises: 0, quizzes: 0, week: "" },
  practiceLibre: { count: 0, totalMinutes: 0 },
  sessionHistory: [],
});

const loadState = () => {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) {
      // Tentative de migration depuis v3
      const v3 = localStorage.getItem("guitarpath_v3_state");
      if (v3) return { ...defaultState(), ...JSON.parse(v3) };
      return defaultState();
    }
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch { return defaultState(); }
};
const saveState = (s) => {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch {}
};

const mergeById = (defaults, imported) => {
  const map = new Map(defaults.map(item => [item.id, item]));
  imported.forEach(item => map.set(item.id, item));
  return Array.from(map.values());
};
const mergeCourses = (defaults, imported) => {
  const map = new Map(defaults.map(c => [c.id, c]));
  imported.forEach(c => {
    if (map.has(c.id)) {
      const existing = map.get(c.id);
      const lessonMap = new Map(existing.lessons.map(l => [l.id, l]));
      (c.lessons || []).forEach(l => lessonMap.set(l.id, l));
      map.set(c.id, { ...existing, ...c, lessons: Array.from(lessonMap.values()) });
    } else {
      map.set(c.id, c);
    }
  });
  return Array.from(map.values());
};

const loadContent = () => {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    if (!raw) return { courses: DEFAULT_COURSES, quiz: DEFAULT_QUIZ, exercises: DEFAULT_EXERCISES };
    const imported = JSON.parse(raw);
    return {
      courses: mergeCourses(DEFAULT_COURSES, imported.courses || []),
      quiz: mergeById(DEFAULT_QUIZ, imported.quiz || []),
      exercises: mergeById(DEFAULT_EXERCISES, imported.exercises || []),
    };
  } catch {
    return { courses: DEFAULT_COURSES, quiz: DEFAULT_QUIZ, exercises: DEFAULT_EXERCISES };
  }
};

const todayStr = () => new Date().toISOString().split("T")[0];
const weekStr = () => {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
};

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGES & PRACTICE DATA
// ═══════════════════════════════════════════════════════════════════════════
const KEYS = ["A","B","C","D","E","F","G"];
const MODES = ["majeur","mineur","dorien","mixolydien","phrygien","lydien"];
const TEMPOS = [60,70,80,90,100,110,120];
const CONSTRAINTS = [
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
  "yeux fermés (pas de visuel manche)",
  "1 nouvelle phrase à chaque mesure",
];
const DAILY_CHALLENGES = [
  "Improvise 3 minutes non-stop sur Am 70 BPM. Ne t'arrête JAMAIS.",
  "Joue la pentatonique Am dans les 5 positions enchaînées sans erreur.",
  "Compose un riff de 4 mesures et joue-le 10 fois parfaitement.",
  "Enregistre-toi 5 minutes. Écoute. Note ta meilleure phrase.",
  "Joue Am-F-C-G en arpèges pendant 10 minutes sans t'arrêter.",
  "Improvise les yeux fermés pendant 5 minutes en Am.",
  "Joue uniquement des notes longues (blanches) pendant 5 minutes.",
  "Construis un solo qui monte progressivement d'intensité sur 4 minutes.",
  "Joue le même riff dans 3 tonalités différentes (Am, Dm, Em).",
  "Improvise en alternant 1 mesure jeu / 1 mesure silence pendant 5 minutes.",
];

// ═══════════════════════════════════════════════════════════════════════════
// BADGES — 24 badges, 8 catégories, 4 raretés
// ═══════════════════════════════════════════════════════════════════════════
const BADGE_TINTS = {
  primary: { bg: C.primaryL, border: C.primaryBorder, icon: C.primary, text: C.primaryD },
  green:   { bg: C.greenL,   border: C.greenBorder,   icon: C.green,   text: C.greenD },
  amber:   { bg: C.amberL,   border: C.amberBorder,   icon: C.amber,   text: C.amberD },
  coral:   { bg: C.coralL,   border: C.coralBorder,   icon: C.coral,   text: C.coralD },
  pink:    { bg: C.pinkL,    border: "#EFC4D5",        icon: C.pink,    text: "#85304E" },
};
const BADGE_RARITIES = {
  commun:    { label: "commun",   bg: "#E5E3DC", fg: "#5F5E5A" },
  rare:      { label: "rare",     bg: "#D8D3F6", fg: C.primaryD },
  epique:    { label: "épique",   bg: C.coralBorder, fg: C.coralD },
  legend:    { label: "légend.",  bg: C.primary, fg: "#FFFFFF" },
};

const skillMastery = (state, content, courseId) => {
  const exs = content.exercises.filter(e => e.mod === courseId);
  const qzs = content.quiz.filter(q => q.courseId === courseId);
  if (exs.length === 0 && qzs.length === 0) return 0;
  const exDone = exs.filter(e => state.completedExercises[e.id]).length / Math.max(1, exs.length);
  const qzOk = qzs.filter(q => state.quizResults[q.id]?.correct).length / Math.max(1, qzs.length);
  return Math.round((exDone * 0.6 + qzOk * 0.4) * 100);
};
const allModulesMastered = (state, content) =>
  content.courses.every(c => {
    const total = c.lessons.length;
    const done = c.lessons.filter(l => state.completedLessons[l.id]).length;
    return total > 0 && done === total;
  });
const perfectQuizCount = (state) =>
  Object.values(state.quizResults).filter(r => r.correct && r.attempts === 1).length;

const BADGES = [
  // ── Premiers pas
  { id: "first_lesson",   cat: "Premiers pas", tint: "primary", rarity: "commun", icon: "ti-flag",          label: "Première leçon",   cond: s => Object.keys(s.completedLessons).length >= 1 },
  { id: "first_exercise", cat: "Premiers pas", tint: "green",   rarity: "commun", icon: "ti-guitar-pick",   label: "Premier exercice", cond: s => Object.keys(s.completedExercises).length >= 1 },
  { id: "first_quiz",     cat: "Premiers pas", tint: "amber",   rarity: "commun", icon: "ti-help-circle",   label: "Premier quiz",     cond: s => Object.keys(s.quizResults).length >= 1 },

  // ── Streak
  { id: "streak_3",  cat: "Streak", tint: "amber", rarity: "commun", icon: "ti-flame", label: "3 jours",  cond: s => s.streak >= 3 },
  { id: "streak_7",  cat: "Streak", tint: "coral", rarity: "rare",   icon: "ti-flame", label: "7 jours",  cond: s => s.streak >= 7 },
  { id: "streak_30", cat: "Streak", tint: "coral", rarity: "epique", icon: "ti-flame", label: "30 jours", cond: s => s.streak >= 30 },

  // ── Expérience
  { id: "xp_500",  cat: "Expérience", tint: "primary", rarity: "commun", icon: "ti-star",   label: "500 XP",   cond: s => s.xp >= 500 },
  { id: "xp_2000", cat: "Expérience", tint: "primary", rarity: "rare",   icon: "ti-bolt",   label: "2 000 XP", cond: s => s.xp >= 2000 },
  { id: "xp_5000", cat: "Expérience", tint: "primary", rarity: "legend", icon: "ti-trophy", label: "5 000 XP", cond: s => s.xp >= 5000 },

  // ── Maîtrise exercices
  { id: "ex_10",  cat: "Maîtrise", tint: "green", rarity: "commun", icon: "ti-circle-check",  label: "10 exercices",  cond: s => Object.keys(s.completedExercises).length >= 10 },
  { id: "ex_25",  cat: "Maîtrise", tint: "green", rarity: "rare",   icon: "ti-target-arrow",  label: "25 exercices",  cond: s => Object.keys(s.completedExercises).length >= 25 },
  { id: "ex_100", cat: "Maîtrise", tint: "green", rarity: "legend", icon: "ti-medal",         label: "100 exercices", cond: s => Object.keys(s.completedExercises).length >= 100 },

  // ── Skill (par module)
  { id: "skill_neck",    cat: "Skill", tint: "amber",   rarity: "rare", icon: "ti-map-2",   label: "Manche maîtrisé",   cond: (s, ctx) => skillMastery(s, ctx, "neck")    >= 80 },
  { id: "skill_scales",  cat: "Skill", tint: "green",   rarity: "rare", icon: "ti-music",   label: "Modes maîtrisés",   cond: (s, ctx) => skillMastery(s, ctx, "scales")  >= 80 },
  { id: "skill_harmony", cat: "Skill", tint: "primary", rarity: "rare", icon: "ti-stack-2", label: "Harmonie pro",       cond: (s, ctx) => skillMastery(s, ctx, "harmony") >= 80 },

  // ── Quiz
  { id: "quiz_perfect", cat: "Quiz", tint: "amber", rarity: "commun", icon: "ti-circle-check", label: "Quiz parfait",      cond: s => perfectQuizCount(s) >= 1 },
  { id: "quiz_50",      cat: "Quiz", tint: "amber", rarity: "rare",   icon: "ti-target",       label: "50 quiz réussis",   cond: s => Object.values(s.quizResults).filter(r => r.correct).length >= 50 },
  { id: "quiz_100",     cat: "Quiz", tint: "amber", rarity: "epique", icon: "ti-crown",        label: "100 quiz réussis",  cond: s => Object.values(s.quizResults).filter(r => r.correct).length >= 100 },

  // ── Leçons
  { id: "lessons_25", cat: "Leçons", tint: "primary", rarity: "commun", icon: "ti-book-2",      label: "25 leçons", cond: s => Object.keys(s.completedLessons).length >= 25 },
  { id: "lessons_50", cat: "Leçons", tint: "primary", rarity: "rare",   icon: "ti-books",       label: "50 leçons", cond: s => Object.keys(s.completedLessons).length >= 50 },

  // ── Pratique
  { id: "practice_10",   cat: "Pratique", tint: "coral", rarity: "rare",   icon: "ti-dice-5",   label: "10 défis libres",   cond: s => (s.practiceLibre?.count || 0) >= 10 },
  { id: "daily_30",      cat: "Pratique", tint: "coral", rarity: "epique", icon: "ti-bolt",     label: "30 défis du jour",  cond: s => (s.dailyChallengeCount || 0) >= 30 },
  { id: "all_modules",   cat: "Pratique", tint: "green", rarity: "legend", icon: "ti-mountain", label: "4 modules finis",   cond: (s, ctx) => allModulesMastered(s, ctx) },

  // ── Régularité
  { id: "full_week", cat: "Régularité", tint: "pink", rarity: "rare", icon: "ti-calendar-check", label: "Semaine pleine", cond: s => s.streak >= 7 && (s.weeklyGoals?.sessions || 0) >= 7 },
];

const computeNewBadges = (state, content) => {
  return BADGES
    .filter(b => !state.unlockedBadges.includes(b.id))
    .filter(b => {
      try { return b.cond(state, content); } catch { return false; }
    })
    .map(b => b.id);
};

// ═══════════════════════════════════════════════════════════════════════════
// REDUCER
// ═══════════════════════════════════════════════════════════════════════════
function reducer(state, action) {
  let s = { ...state };
  const today = todayStr();
  switch (action.type) {
    case "ADD_XP":
      s.xp += action.xp;
      s.level = Math.floor(s.xp / 300) + 1;
      break;
    case "COMPLETE_LESSON":
      if (!s.completedLessons[action.id]) {
        s.completedLessons = { ...s.completedLessons, [action.id]: today };
        s.xp += 30; s.level = Math.floor(s.xp / 300) + 1;
        s.sessionHistory = [{ type: "lesson", id: action.id, title: action.title || "Leçon", xp: 30, date: today }, ...(s.sessionHistory || [])].slice(0, 10);
      }
      break;
    case "COMPLETE_EXERCISE":
      s.completedExercises = { ...s.completedExercises, [action.id]: { completedAt: today, count: (s.completedExercises[action.id]?.count || 0) + 1 } };
      delete s.exerciseProgress[action.id];
      s.xp += action.xp; s.level = Math.floor(s.xp / 300) + 1;
      s.sessionHistory = [{ type: "exercise", id: action.id, title: action.title || "Exercice", xp: action.xp, date: today }, ...(s.sessionHistory || [])].slice(0, 10);
      break;
    case "SAVE_EXERCISE_PROGRESS":
      s.exerciseProgress = { ...s.exerciseProgress, [action.id]: action.checkedSteps };
      break;
    case "QUIZ_ANSWER": {
      const prev = s.quizResults[action.id] || { correct: false, attempts: 0 };
      s.quizResults = { ...s.quizResults, [action.id]: { correct: action.correct, attempts: prev.attempts + 1, lastAttempt: today } };
      if (action.correct) {
        s.xp += action.xp;
        s.wrongQuiz = s.wrongQuiz.filter(id => id !== action.id);
      } else {
        if (!s.wrongQuiz.includes(action.id)) s.wrongQuiz = [...s.wrongQuiz, action.id];
      }
      s.level = Math.floor(s.xp / 300) + 1;
      break;
    }
    case "QUIZ_SESSION_DONE":
      s.sessionHistory = [{ type: "quiz", id: action.id || "session", title: action.title || "Quiz", xp: action.xp, date: today, score: action.score }, ...(s.sessionHistory || [])].slice(0, 10);
      break;
    case "MARK_STREAK":
      if (s.lastSessionDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        s.streak = (s.lastSessionDate === yesterday) ? s.streak + 1 : 1;
        s.lastSessionDate = today;
      }
      break;
    case "DAILY_CHALLENGE_DONE":
      s.dailyChallengeDone = true;
      s.dailyChallengeDate = today;
      s.dailyChallengeCount = (s.dailyChallengeCount || 0) + 1;
      s.xp += 80;
      s.level = Math.floor(s.xp / 300) + 1;
      break;
    case "ROTATE_DAILY":
      if (s.dailyChallengeDate !== today) {
        s.dailyChallengeIdx = (s.dailyChallengeIdx + 1) % DAILY_CHALLENGES.length;
        s.dailyChallengeDone = false; s.dailyChallengeDate = "";
      }
      break;
    case "PRACTICE_DONE":
      s.practiceLibre = { count: (s.practiceLibre?.count || 0) + 1, totalMinutes: (s.practiceLibre?.totalMinutes || 0) + (action.minutes || 5) };
      s.xp += 50;
      s.level = Math.floor(s.xp / 300) + 1;
      break;
    case "UPDATE_WEEKLY": {
      const w = weekStr();
      if (s.weeklyGoals.week !== w) s.weeklyGoals = { sessions: 0, exercises: 0, quizzes: 0, week: w };
      s.weeklyGoals = { ...s.weeklyGoals, [action.field]: s.weeklyGoals[action.field] + 1 };
      break;
    }
    case "UNLOCK_BADGES":
      s.unlockedBadges = [...new Set([...s.unlockedBadges, ...action.badgeIds])];
      break;
    case "RESET":
      s = defaultState();
      break;
    default: break;
  }
  saveState(s);
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANTS UI primitifs
// ═══════════════════════════════════════════════════════════════════════════
function Ti({ name, size = 16, color = "currentColor", style }) {
  return <i className={`ti ti-${name}`} aria-hidden="true" style={{ fontSize: size, color, lineHeight: 1, ...style }} />;
}

function ProgressBar({ pct, color = C.primary, h = 6 }) {
  return (
    <div style={{ height: h, background: C.surface2, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: 4, transition: "width 0.5s ease" }} />
    </div>
  );
}

function XPPop({ amount, onDone }) {
  const [y, setY] = useState(0); const [op, setOp] = useState(1);
  useEffect(() => {
    let f = 0; const id = setInterval(() => { f++; setY(f * 4); setOp(1 - f / 12); if (f >= 12) { clearInterval(id); onDone(); } }, 80);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      position: "fixed", top: "40%", left: "50%",
      transform: `translateX(-50%) translateY(-${y}px)`,
      opacity: op, pointerEvents: "none", zIndex: 9999,
      fontSize: 28, fontWeight: 700, color: C.primary, fontFamily: FONTS.ui,
    }}>+{amount} XP</div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
      background: C.text, color: "#fff", padding: "11px 22px", borderRadius: 24,
      fontSize: 14, fontWeight: 500, zIndex: 9999,
      boxShadow: "0 8px 24px rgba(0,0,0,0.15)", fontFamily: FONTS.ui, maxWidth: "85%",
    }}>{msg}</div>
  );
}

// Pastilles colorées par module (icônes Tabler)
const MODULE_THEME = {
  neck:    { icon: "ti-map-2",     color: C.amber,   colorL: C.amberL,   colorD: C.amberD },
  scales:  { icon: "ti-music",     color: C.green,   colorL: C.greenL,   colorD: C.greenD },
  harmony: { icon: "ti-stack-2",   color: C.primary, colorL: C.primaryL, colorD: C.primaryD },
  rhythm:  { icon: "ti-metronome", color: C.coral,   colorL: C.coralL,   colorD: C.coralD },
  impro:   { icon: "ti-wand",      color: C.pink,    colorL: C.pinkL,    colorD: "#85304E" },
};

// ═══════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════
function HomeScreen({ state, dispatch, navigate, content }) {
  const totalLessons = content.courses.reduce((a,c) => a + c.lessons.length, 0);
  const completedLessons = Object.keys(state.completedLessons).length;
  const xpInLevel = state.xp % 300;
  const lvlPct = Math.round((xpInLevel / 300) * 100);
  const xpToNext = 300 - xpInLevel;
  const todayChallenge = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];

  // Trouver la prochaine leçon
  const nextLesson = useMemo(() => {
    for (const course of content.courses) {
      for (const lesson of course.lessons) {
        if (!state.completedLessons[lesson.id]) return { course, lesson };
      }
    }
    return null;
  }, [content, state.completedLessons]);

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>
            Bonjour
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: C.amberL, borderRadius: R.pill, padding: "5px 11px" }}>
            <Ti name="flame" size={13} color={C.amber} />
            <span style={{ fontSize: 13, fontWeight: 500, color: C.amberD, fontFamily: FONTS.ui }}>{state.streak}</span>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${C.primary}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: C.primary, fontFamily: FONTS.ui }}>
            N{state.level}
          </div>
        </div>
      </div>

      {/* XP — barre de progression simple */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>
            Niveau {state.level}
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.text2, fontFamily: FONTS.ui }}>
            {xpInLevel} / 300 XP
          </div>
        </div>
        <ProgressBar pct={lvlPct} color={C.primary} h={6} />
        <div style={{ marginTop: 8, fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>
          Plus que {xpToNext} XP pour le niveau {state.level + 1}
        </div>
      </div>

      {/* Prochain objectif */}
      {nextLesson && (
        <button onClick={() => navigate("courses")} style={{
          width: "100%", background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: R.lg,
          padding: 14, marginBottom: 10, cursor: "pointer", textAlign: "left", fontFamily: FONTS.title,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ti name="player-play" size={18} color={C.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, fontFamily: FONTS.ui, marginBottom: 2 }}>
              Prochain objectif
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>
              {nextLesson.lesson.title}
            </div>
            <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }}>
              {nextLesson.course.title} · {nextLesson.lesson.duration} min
            </div>
          </div>
          <Ti name="arrow-right" size={16} color={C.primary} />
        </button>
      )}

      {/* Défi du jour */}
      <button onClick={() => navigate("challenge")} style={{
        width: "100%", background: state.dailyChallengeDone ? C.greenL : C.amberL,
        border: `1px solid ${state.dailyChallengeDone ? C.greenBorder : C.amberBorder}`,
        borderRadius: R.lg, padding: 14, marginBottom: 14, cursor: "pointer", textAlign: "left", fontFamily: FONTS.title,
        display: "flex", alignItems: "flex-start", gap: 11,
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ti name={state.dailyChallengeDone ? "trophy" : "bolt"} size={18} color={state.dailyChallengeDone ? C.green : C.amber} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: state.dailyChallengeDone ? C.greenD : C.amberD, fontFamily: FONTS.ui, marginBottom: 3 }}>
            Défi du jour {state.dailyChallengeDone ? "· terminé" : "· +80 XP"}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: state.dailyChallengeDone ? C.greenD : C.amberD, fontFamily: FONTS.title, fontWeight: 500 }}>
            {todayChallenge}
          </div>
        </div>
      </button>

      {/* Session du jour */}
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, marginBottom: 8 }}>
        Session du jour
      </div>

      {[
        { id: "courses",   icon: "book-2",        label: "Théorie",       sub: "Cours structurés", tint: "primary" },
        { id: "exercises", icon: "guitar-pick",   label: "Exercices",     sub: `${content.exercises.length} disponibles`, tint: "green" },
        { id: "quiz",      icon: "help-circle",   label: "Quiz",          sub: `${content.quiz.length} questions${state.wrongQuiz.length>0?` · ${state.wrongQuiz.length} à revoir`:""}`, tint: "amber" },
        { id: "practice",  icon: "dice-5",        label: "Practice libre", sub: "Défis générés à l'infini", tint: "coral" },
      ].map(t => {
        const tint = BADGE_TINTS[t.tint];
        return (
          <button key={t.id} onClick={() => navigate(t.id)} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md,
            padding: "11px 14px", display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 8,
            fontFamily: FONTS.title,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: tint.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ti name={t.icon} size={18} color={tint.icon} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{t.label}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 1, fontFamily: FONTS.ui }}>{t.sub}</div>
            </div>
            <Ti name="chevron-right" size={14} color="#B4B2A9" />
          </button>
        );
      })}

      {/* Dernières sessions */}
      {state.sessionHistory && state.sessionHistory.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, margin: "16px 0 8px" }}>
            Dernières sessions
          </div>
          {state.sessionHistory.slice(0, 3).map((sess, i) => (
            <div key={i} style={{
              background: "#FAF9F6", border: `1px solid ${C.border}`, borderRadius: R.md,
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: C.greenL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ti name="check" size={14} color={C.green} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{sess.title}</div>
                <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 1 }}>
                  {sess.score ? `${sess.score} · ` : ""}+{sess.xp} XP
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COURSES
// ═══════════════════════════════════════════════════════════════════════════
function CoursesScreen({ state, dispatch, content }) {
  const [active, setActive] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  if (activeLesson) return <LessonView lesson={activeLesson} state={state} dispatch={dispatch} onBack={() => setActiveLesson(null)} />;
  if (active) return <CourseDetail course={active} state={state} onBack={() => setActive(null)} onSelectLesson={setActiveLesson} />;

  const totalLessons = content.courses.reduce((a, c) => a + c.lessons.length, 0);

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Cours</h1>
      <p style={{ fontSize: 13, color: C.text2, margin: "3px 0 16px", fontFamily: FONTS.ui }}>
        {content.courses.length} modules · {totalLessons} leçons
      </p>

      {content.courses.map(c => {
        const total = c.lessons.length;
        const done = c.lessons.filter(l => state.completedLessons[l.id]).length;
        const pct = total > 0 ? Math.round(done / total * 100) : 0;
        const theme = MODULE_THEME[c.id] || { icon: "ti-book-2", color: C.primary, colorL: C.primaryL, colorD: C.primaryD };
        return (
          <button key={c.id} onClick={() => setActive(c)} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md,
            padding: "13px 14px", display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 8, fontFamily: FONTS.title,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.colorL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ti name={theme.icon.replace("ti-", "")} size={20} color={theme.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{c.title}</div>
              <div style={{ fontSize: 11, color: C.text3, margin: "1px 0 6px", fontFamily: FONTS.ui }}>{c.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <ProgressBar pct={pct} color={theme.color} h={3} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: pct > 0 ? theme.colorD : C.text3, fontFamily: FONTS.ui }}>{done}/{total}</span>
              </div>
            </div>
          </button>
        );
      })}
      <div style={{ height: 16 }} />
    </div>
  );
}

function CourseDetail({ course, state, onBack, onSelectLesson }) {
  const theme = MODULE_THEME[course.id] || { icon: "ti-book-2", color: C.primary, colorL: C.primaryL };
  return (
    <div style={{ padding: "14px 16px 0" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="chevron-left" size={16} /> RETOUR
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: theme.colorL, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ti name={theme.icon.replace("ti-", "")} size={22} color={theme.color} />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: FONTS.title, color: C.text }}>{course.title}</h1>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: C.text3, fontFamily: FONTS.ui }}>{course.lessons.length} leçons</p>
        </div>
      </div>

      {course.lessons.map((l, i) => {
        const done = !!state.completedLessons[l.id];
        return (
          <button key={l.id} onClick={() => onSelectLesson(l)} style={{
            background: C.surface, border: `1px solid ${done ? theme.color + "40" : C.border}`,
            borderRadius: R.md, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 8, fontFamily: FONTS.title,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: done ? theme.colorL : C.surface2,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 500, color: done ? theme.color : C.text2, flexShrink: 0, fontFamily: FONTS.ui,
            }}>
              {done ? <Ti name="check" size={14} /> : (i + 1)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{l.title}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 2, fontFamily: FONTS.ui }}>
                {l.duration} min · {(l.quiz || []).length} quiz
              </div>
            </div>
            <Ti name="chevron-right" size={14} color="#B4B2A9" />
          </button>
        );
      })}
      <div style={{ height: 16 }} />
    </div>
  );
}

function LessonView({ lesson, state, dispatch, onBack }) {
  const [done, setDone] = useState(!!state.completedLessons[lesson.id]);
  const [pop, setPop] = useState(false);

  const finish = () => {
    if (!done) {
      setPop(true);
      setTimeout(() => {
        setPop(false);
        dispatch({ type: "COMPLETE_LESSON", id: lesson.id, title: lesson.title });
        dispatch({ type: "MARK_STREAK" });
        dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
        setDone(true);
      }, 1000);
    }
  };

  return (
    <div style={{ padding: "14px 16px 0" }}>
      {pop && <XPPop amount={30} onDone={() => {}} />}
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="chevron-left" size={16} /> RETOUR
      </button>
      <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700, lineHeight: 1.25, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>{lesson.title}</h1>
      <p style={{ fontSize: 11, color: C.text3, margin: "0 0 18px", fontFamily: FONTS.ui, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {lesson.duration} MIN · {(lesson.quiz || []).length} QUESTIONS
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {lesson.content.map((b, i) => {
          if (b.type === "h") return <h3 key={i} style={{ margin: "8px 0 0", fontSize: 16, fontWeight: 700, color: C.primary, fontFamily: FONTS.title }}>{b.text}</h3>;
          if (b.type === "tip") return (
            <div key={i} style={{ background: C.amberL, border: `1px solid ${C.amberBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Ti name="bulb" size={16} color={C.amber} style={{ marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 13, color: C.amberD, lineHeight: 1.6, fontFamily: FONTS.title }}>{b.text}</p>
            </div>
          );
          if (b.type === "img") return (
            <div key={i} style={{ background: C.surface2, borderRadius: 12, padding: 12, textAlign: "center" }}>
              <img src={b.src} alt={b.alt || ""} style={{ maxWidth: "100%", borderRadius: 8 }} />
              {b.caption && <p style={{ fontSize: 12, color: C.text3, marginTop: 8, fontFamily: FONTS.ui, fontStyle: "italic" }}>{b.caption}</p>}
            </div>
          );
          if (b.type === "ref") return (
            <div key={i} style={{ background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Ti name="music" size={16} color={C.primary} style={{ marginTop: 2 }} />
              <p style={{ margin: 0, fontSize: 13, color: C.primaryD, lineHeight: 1.55, fontFamily: FONTS.title }}>
                <strong>Référence :</strong> {b.text}
              </p>
            </div>
          );
          // ── Blocs visuels (fretboard, scale_pattern, interval_chart, chord_diagram, caged_form, note_grid)
          const diagram = renderDiagramBlock(b, i);
          if (diagram) return diagram;
          return <p key={i} style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: C.text, fontFamily: FONTS.title }}>{b.text}</p>;
        })}
      </div>

      {(lesson.quiz || []).length > 0 && (
        <div style={{ background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: 12, padding: "11px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
          <Ti name="notebook" size={16} color={C.primary} />
          <p style={{ margin: 0, fontSize: 12, color: C.primaryD, fontFamily: FONTS.ui }}>
            Cette leçon est associée à {(lesson.quiz || []).length} question{(lesson.quiz || []).length > 1 ? "s" : ""} de quiz.
          </p>
        </div>
      )}

      <button onClick={finish} disabled={done} style={{
        width: "100%", padding: "14px", borderRadius: R.md, border: "none",
        background: done ? C.greenL : C.primary,
        color: done ? C.greenD : "#fff",
        fontSize: 14, fontWeight: 500, cursor: done ? "default" : "pointer",
        fontFamily: FONTS.ui, letterSpacing: "0.02em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        {done ? <><Ti name="check" size={16} /> Leçon complétée</> : <>Terminer la leçon · +30 XP</>}
      </button>
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXERCICES
// ═══════════════════════════════════════════════════════════════════════════
function ExercisesScreen({ state, dispatch, content }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const cats = [
    { id: "all", label: "Tous" },
    { id: "neck", label: "Manche" },
    { id: "scales", label: "Gammes" },
    { id: "harmony", label: "Harmonie" },
    { id: "rhythm", label: "Rythme" },
    { id: "impro", label: "Impro" },
  ];
  const filtered = content.exercises.filter(e => filter === "all" || e.mod === filter);

  if (active) return <ExerciseDetail ex={active} state={state} dispatch={dispatch} onBack={() => setActive(null)} content={content} />;

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Exercices</h1>
      <p style={{ fontSize: 13, color: C.text2, margin: "3px 0 14px", fontFamily: FONTS.ui }}>{content.exercises.length} exercices au total</p>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 10, scrollbarWidth: "none" }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{
            padding: "7px 13px", borderRadius: R.pill,
            border: `1px solid ${filter === c.id ? C.primary : C.border}`,
            background: filter === c.id ? C.primary : C.surface,
            color: filter === c.id ? "#fff" : C.text2,
            fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
            flexShrink: 0, fontFamily: FONTS.ui,
          }}>{c.label}</button>
        ))}
      </div>

      {filtered.map(ex => {
        const done = !!state.completedExercises[ex.id];
        const inProgress = state.exerciseProgress[ex.id]?.length > 0;
        const theme = MODULE_THEME[ex.mod] || MODULE_THEME.neck;
        return (
          <button key={ex.id} onClick={() => setActive(ex)} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md,
            padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 8, fontFamily: FONTS.title,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: done ? C.greenL : inProgress ? C.amberL : theme.colorL,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {done
                ? <Ti name="check" size={18} color={C.green} />
                : inProgress
                  ? <Ti name="player-pause" size={18} color={C.amber} />
                  : <Ti name="guitar-pick" size={18} color={theme.color} />
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{ex.title}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 3, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{ex.dur} min</span>
                {ex.bpm && <span style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>♩ {ex.bpm}</span>}
                <span style={{ fontSize: 11, color: C.primary, fontWeight: 500, fontFamily: FONTS.ui }}>+{ex.xp} XP</span>
                {state.completedExercises[ex.id]?.count > 1 && (
                  <span style={{ fontSize: 11, color: C.green, fontFamily: FONTS.ui }}>×{state.completedExercises[ex.id].count}</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
      <div style={{ height: 16 }} />
    </div>
  );
}

function ExerciseDetail({ ex, state, dispatch, onBack, content }) {
  const saved = state.exerciseProgress[ex.id] || [];
  const [checked, setChecked] = useState(saved);
  const [done, setDone] = useState(false);
  const [pop, setPop] = useState(false);
  const allDone = checked.length === ex.steps.length;
  const theme = MODULE_THEME[ex.mod] || MODULE_THEME.neck;

  useEffect(() => {
    if (checked.length > 0 && !done) dispatch({ type: "SAVE_EXERCISE_PROGRESS", id: ex.id, checkedSteps: checked });
  }, [checked]);

  const toggle = (i) => setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const finish = () => {
    setPop(true);
    setTimeout(() => {
      setPop(false);
      dispatch({ type: "COMPLETE_EXERCISE", id: ex.id, title: ex.title, xp: ex.xp });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "exercises" });
      setDone(true);
    }, 1200);
  };
  const linkedLesson = ex.courseLink ? content.courses.flatMap(c => c.lessons).find(l => l.id === ex.courseLink) : null;

  return (
    <div style={{ padding: "14px 16px 0" }}>
      {pop && <XPPop amount={ex.xp} onDone={() => {}} />}
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="chevron-left" size={16} /> RETOUR
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: theme.colorL, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ti name="guitar-pick" size={20} color={theme.color} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONTS.ui }}>
            {ex.mod} · {ex.dur} MIN{ex.bpm ? ` · ♩ ${ex.bpm}` : ""}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2, fontFamily: FONTS.title, color: C.text }}>{ex.title}</div>
        </div>
      </div>

      {linkedLesson && (
        <div style={{ background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: 11, padding: "9px 13px", marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <Ti name="book-2" size={14} color={C.primary} />
          <div style={{ fontSize: 12, color: C.primaryD, fontFamily: FONTS.title }}>
            Lié à : <strong>{linkedLesson.title}</strong>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <ProgressBar pct={(checked.length / ex.steps.length) * 100} color={C.green} h={4} />
      </div>

      {!done ? (
        <>
          {ex.steps.map((s, i) => {
            const ck = checked.includes(i);
            return (
              <button key={i} onClick={() => toggle(i)} style={{
                display: "flex", alignItems: "flex-start", gap: 11,
                background: ck ? C.greenL : C.surface,
                border: `1px solid ${ck ? C.greenBorder : C.border}`,
                borderRadius: 11, padding: "11px 13px", cursor: "pointer", textAlign: "left",
                width: "100%", marginBottom: 7, fontFamily: FONTS.title,
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${ck ? C.green : C.border}`,
                  background: ck ? C.green : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  {ck && <Ti name="check" size={11} color="#fff" />}
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: ck ? C.greenD : C.text, fontFamily: FONTS.title }}>{s}</p>
              </button>
            );
          })}
          <div style={{ background: C.amberL, borderRadius: 11, padding: "10px 13px", marginBottom: 12, border: `1px solid ${C.amberBorder}`, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Ti name="bulb" size={15} color={C.amber} style={{ marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 13, color: C.amberD, lineHeight: 1.55, fontFamily: FONTS.title }}>{ex.tip}</p>
          </div>
          <button onClick={finish} disabled={!allDone} style={{
            width: "100%", padding: "14px", borderRadius: R.md, border: "none",
            background: allDone ? C.green : C.surface2,
            color: allDone ? "#fff" : C.text3,
            fontSize: 14, fontWeight: 500, cursor: allDone ? "pointer" : "default",
            fontFamily: FONTS.ui,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {allDone ? <>Exercice terminé <Ti name="check" size={16} /></> : `${checked.length} / ${ex.steps.length} étapes`}
          </button>
        </>
      ) : (
        <div style={{ background: C.greenL, borderRadius: 14, padding: "22px 16px", textAlign: "center", border: `1px solid ${C.greenBorder}` }}>
          <Ti name="trophy" size={36} color={C.green} />
          <div style={{ fontSize: 18, fontWeight: 700, color: C.greenD, fontFamily: FONTS.title, marginTop: 8 }}>Bien joué !</div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 4, fontFamily: FONTS.ui }}>+{ex.xp} XP</div>
          <button onClick={onBack} style={{
            marginTop: 16, padding: "10px 24px", borderRadius: 11, border: "none",
            background: C.green, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
          }}>Retour</button>
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════════════════
function QuizScreen({ state, dispatch, content }) {
  const [mode, setMode] = useState(null);
  const modes = [
    {
      id: "daily", label: "Quiz du jour", desc: "7 questions adaptées", icon: "star", tint: "primary",
      pool: () => {
        const wrong = content.quiz.filter(q => state.wrongQuiz.includes(q.id)).slice(0, 3);
        const fresh = content.quiz.filter(q => !state.quizResults[q.id] && !state.wrongQuiz.includes(q.id)).sort(() => Math.random() - 0.5).slice(0, 4);
        return [...wrong, ...fresh].slice(0, 7);
      },
    },
    {
      id: "review", label: `Révisions (${state.wrongQuiz.length})`, desc: "Questions ratées à reprendre", icon: "refresh", tint: "coral",
      pool: () => content.quiz.filter(q => state.wrongQuiz.includes(q.id)),
      disabled: state.wrongQuiz.length === 0,
    },
    {
      id: "neck", label: "Manche & visualisation", desc: `${content.quiz.filter(q => q.courseId === "neck").length} questions`, icon: "map-2", tint: "amber",
      pool: () => content.quiz.filter(q => q.courseId === "neck").sort(() => Math.random() - 0.5).slice(0, 7),
    },
    {
      id: "scales", label: "Gammes & modes", desc: `${content.quiz.filter(q => q.courseId === "scales").length} questions`, icon: "music", tint: "green",
      pool: () => content.quiz.filter(q => q.courseId === "scales").sort(() => Math.random() - 0.5).slice(0, 7),
    },
    {
      id: "harmony", label: "Harmonie", desc: `${content.quiz.filter(q => q.courseId === "harmony").length} questions`, icon: "stack-2", tint: "primary",
      pool: () => content.quiz.filter(q => q.courseId === "harmony").sort(() => Math.random() - 0.5).slice(0, 7),
    },
    {
      id: "rhythm", label: "Rythme", desc: `${content.quiz.filter(q => q.courseId === "rhythm").length} questions`, icon: "metronome", tint: "coral",
      pool: () => content.quiz.filter(q => q.courseId === "rhythm").sort(() => Math.random() - 0.5).slice(0, 7),
    },
  ];

  if (mode) return <QuizPlayer pool={mode.pool()} title={mode.label} state={state} dispatch={dispatch} content={content} onDone={() => setMode(null)} />;

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Quiz</h1>
      <p style={{ fontSize: 13, color: C.text2, margin: "3px 0 16px", fontFamily: FONTS.ui }}>
        {Object.keys(state.quizResults).length} répondues · {content.quiz.length} totales · {state.wrongQuiz.length} à réviser
      </p>

      {modes.map(m => {
        const tint = BADGE_TINTS[m.tint];
        return (
          <button key={m.id} onClick={() => !m.disabled && setMode(m)} disabled={m.disabled} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md,
            padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
            cursor: m.disabled ? "default" : "pointer", textAlign: "left", width: "100%",
            opacity: m.disabled ? 0.45 : 1, marginBottom: 8, fontFamily: FONTS.title,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: tint.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ti name={m.icon} size={18} color={tint.icon} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{m.label}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 2, fontFamily: FONTS.ui }}>{m.desc}</div>
            </div>
            <Ti name="chevron-right" size={14} color="#B4B2A9" />
          </button>
        );
      })}
      <div style={{ height: 16 }} />
    </div>
  );
}

function QuizPlayer({ pool, title, state, dispatch, content, onDone }) {
  const [questions] = useState(pool);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", color: C.text2, fontFamily: FONTS.title }}>
        Aucune question disponible.<br />
        <button onClick={onDone} style={{
          marginTop: 16, padding: "10px 20px", border: "none", borderRadius: R.sm,
          background: C.primary, color: "#fff", cursor: "pointer", fontFamily: FONTS.ui, fontSize: 13, fontWeight: 500,
        }}>Retour</button>
      </div>
    );
  }

  const q = questions[idx];
  const answered = sel !== null;

  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const ok = i === q.a;
    if (ok) setScore(s => s + 1);
    dispatch({ type: "QUIZ_ANSWER", id: q.id, correct: ok, xp: q.xp || 30 });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setFinished(true);
      const totalXp = score * 30;
      dispatch({ type: "QUIZ_SESSION_DONE", id: title, title, xp: totalXp, score: `${score}/${questions.length}` });
    } else {
      setSel(null);
      setIdx(i => i + 1);
    }
  };

  if (finished) {
    const pct = Math.round(score / questions.length * 100);
    const trophy = score === questions.length ? "trophy" : score >= 5 ? "confetti" : "barbell";
    return (
      <div style={{ padding: "24px 16px", textAlign: "center" }}>
        <Ti name={trophy} size={48} color={C.primary} />
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 12, marginBottom: 6, fontFamily: FONTS.title, color: C.text }}>
          {score === questions.length ? "Parfait !" : score >= 5 ? "Très bien !" : "Continue !"}
        </div>
        <div style={{ color: C.text2, marginBottom: 22, fontFamily: FONTS.ui, fontSize: 13 }}>
          {score}/{questions.length} · {pct}%
        </div>
        <button onClick={onDone} style={{
          width: "100%", padding: "14px", borderRadius: R.md, border: "none",
          background: C.primary, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
        }}>Retour</button>
      </div>
    );
  }

  const linkedLesson = q.lessonId ? content.courses.flatMap(c => c.lessons).find(l => l.id === q.lessonId) : null;
  const linkedCourse = q.courseId ? content.courses.find(c => c.id === q.courseId) : null;

  return (
    <div style={{ padding: "14px 16px 0" }}>
      <button onClick={onDone} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="x" size={16} /> QUITTER
      </button>
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {questions.map((_, i) => (
          <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < idx ? C.green : i === idx ? C.primary : C.border }} />
        ))}
      </div>
      <div style={{ fontSize: 10, color: C.text3, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONTS.ui }}>
        {linkedCourse?.title} · NIV. {q.lvl} · {idx + 1}/{questions.length}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 16, marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, lineHeight: 1.5, color: C.text, fontFamily: FONTS.title }}>{q.q}</p>
      </div>

      {q.o.map((opt, i) => {
        let bg = C.surface, border = `1px solid ${C.border}`, col = C.text, badgeBg = C.surface2, badgeFg = C.text2, ic = ["A", "B", "C", "D"][i];
        if (answered) {
          if (i === q.a) { bg = C.greenL; border = `1px solid ${C.green}`; col = C.greenD; badgeBg = C.greenBorder; badgeFg = C.greenD; ic = <Ti name="check" size={12} />; }
          else if (i === sel) { bg = C.coralL; border = `1px solid ${C.coral}`; col = C.coralD; badgeBg = C.coralBorder; badgeFg = C.coralD; ic = <Ti name="x" size={12} />; }
        }
        return (
          <button key={i} onClick={() => choose(i)} disabled={answered} style={{
            display: "flex", alignItems: "center", gap: 10,
            background: bg, border, borderRadius: 11,
            padding: "11px 13px", cursor: answered ? "default" : "pointer",
            textAlign: "left", width: "100%", marginBottom: 7, fontFamily: FONTS.title,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7,
              background: badgeBg, color: badgeFg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 500, flexShrink: 0, fontFamily: FONTS.ui,
            }}>{ic}</div>
            <span style={{ fontSize: 13, color: col, lineHeight: 1.4, fontFamily: FONTS.title, fontWeight: answered && i === q.a ? 500 : 400 }}>{opt}</span>
          </button>
        );
      })}

      {answered && (
        <>
          <div style={{
            background: sel === q.a ? C.greenL : C.coralL,
            borderRadius: R.md, padding: "12px 14px", marginTop: 8, marginBottom: 12,
            border: `1px solid ${sel === q.a ? C.greenBorder : C.coralBorder}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Ti name={sel === q.a ? "check" : "alert-circle"} size={14} color={sel === q.a ? C.green : C.coral} />
              <div style={{ fontSize: 12, fontWeight: 500, color: sel === q.a ? C.greenD : C.coralD, fontFamily: FONTS.ui }}>
                {sel === q.a ? `CORRECT · +${q.xp || 30} XP` : "PAS TOUT À FAIT…"}
              </div>
            </div>
            <div style={{ fontSize: 12, color: sel === q.a ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }}>{q.exp || q.x}</div>
            {linkedLesson && <div style={{ fontSize: 11, color: C.primary, marginTop: 6, fontFamily: FONTS.ui }}>Pour approfondir : <em>{linkedLesson.title}</em></div>}
          </div>
          <button onClick={next} style={{
            width: "100%", padding: "14px", borderRadius: R.md, border: "none",
            background: C.primary, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
          }}>{idx + 1 >= questions.length ? "Voir les résultats" : "Suivant →"}</button>
        </>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE LIBRE
// ═══════════════════════════════════════════════════════════════════════════
function PracticeScreen({ state, dispatch }) {
  const [tab, setTab] = useState("impro");
  const [current, setCurrent] = useState(null);
  const [pop, setPop] = useState(false);

  const generateImpro = () => {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)];
    const mode = MODES[Math.floor(Math.random() * MODES.length)];
    const tempo = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const constraint = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setCurrent({ type: "impro", title: `${key} ${mode} · ${tempo} BPM`, sub: constraint, time: 10 });
  };
  const generateNeck = () => {
    const challenges = [
      "trouve toutes les notes Do sur le manche en 30 secondes",
      "joue la pentatonique Am en 5 positions enchaînées",
      "trouve la triade de Fa majeur sur cordes 1-2-3 dans 3 positions",
      "joue Cmaj7 dans les 5 formes CAGED",
    ];
    setCurrent({ type: "neck", title: "Défi manche", sub: challenges[Math.floor(Math.random() * challenges.length)], time: 5 });
  };
  const generateRhythm = () => {
    const t = TEMPOS[Math.floor(Math.random() * TEMPOS.length)];
    const subs = ["noires", "croches", "doubles-croches", "triolets"][Math.floor(Math.random() * 4)];
    setCurrent({ type: "rhythm", title: `Métronome ${t} BPM`, sub: `Joue uniquement en ${subs} pendant 5 minutes`, time: 5 });
  };

  const finish = () => {
    setPop(true);
    setTimeout(() => {
      setPop(false);
      dispatch({ type: "PRACTICE_DONE", minutes: current?.time || 5 });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "sessions" });
      setCurrent(null);
    }, 1000);
  };

  return (
    <div style={{ padding: "18px 16px 0" }}>
      {pop && <XPPop amount={50} onDone={() => {}} />}
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Practice libre</h1>
      <p style={{ fontSize: 13, color: C.text2, margin: "3px 0 14px", fontFamily: FONTS.ui }}>Défis générés à l'infini. Jamais 2 fois pareil.</p>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[{ id: "impro", label: "Impro" }, { id: "neck", label: "Manche" }, { id: "rhythm", label: "Rythme" }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setCurrent(null); }} style={{
            flex: 1, padding: "10px", borderRadius: R.sm,
            border: `1px solid ${tab === t.id ? C.primary : C.border}`,
            background: tab === t.id ? C.primary : C.surface,
            color: tab === t.id ? "#fff" : C.text2,
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
          }}>{t.label}</button>
        ))}
      </div>

      {!current ? (
        <div style={{ background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.lg, padding: 20, textAlign: "center" }}>
          <Ti name="dice-5" size={36} color={C.coral} />
          <div style={{ fontSize: 17, fontWeight: 700, color: C.coralD, marginTop: 10, marginBottom: 6, fontFamily: FONTS.title }}>Génère ton défi</div>
          <div style={{ fontSize: 13, color: C.coralD, marginBottom: 14, lineHeight: 1.55, fontFamily: FONTS.ui }}>
            {tab === "impro" && "Tonalité, mode, tempo et contrainte tirés au sort."}
            {tab === "neck" && "Un défi de visualisation du manche."}
            {tab === "rhythm" && "Un défi de métronome à un tempo donné."}
          </div>
          <button onClick={tab === "impro" ? generateImpro : tab === "neck" ? generateNeck : generateRhythm} style={{
            width: "100%", padding: "14px", borderRadius: R.md, border: "none",
            background: C.coral, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>Générer un défi <Ti name="dice-5" size={16} /></button>
        </div>
      ) : (
        <div>
          <div style={{ background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: R.lg, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: C.primaryD, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: FONTS.ui }}>
              Défi en cours
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.primaryD, marginBottom: 8, fontFamily: FONTS.title }}>{current.title}</div>
            <div style={{ fontSize: 14, color: C.primaryD, lineHeight: 1.55, fontFamily: FONTS.title }}>{current.sub}</div>
            <div style={{ fontSize: 11, color: C.primaryD, marginTop: 12, opacity: 0.7, fontFamily: FONTS.ui }}>Durée : {current.time} min</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => setCurrent(null)} style={{
              padding: "12px", borderRadius: R.md, border: `1px solid ${C.border}`,
              background: C.surface, color: C.text, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>Autre défi <Ti name="dice-5" size={14} /></button>
            <button onClick={finish} style={{
              padding: "12px", borderRadius: R.md, border: "none",
              background: C.green, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>Terminé · +50 XP</button>
          </div>
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGE (Défi du jour)
// ═══════════════════════════════════════════════════════════════════════════
function ChallengeScreen({ state, dispatch, navigate }) {
  const ch = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];
  const done = state.dailyChallengeDone;
  const [pop, setPop] = useState(false);

  const finish = () => {
    setPop(true);
    setTimeout(() => {
      setPop(false);
      dispatch({ type: "DAILY_CHALLENGE_DONE" });
      dispatch({ type: "MARK_STREAK" });
    }, 1000);
  };

  return (
    <div style={{ padding: "14px 16px 0" }}>
      {pop && <XPPop amount={80} onDone={() => {}} />}
      <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="chevron-left" size={16} /> RETOUR
      </button>
      <h1 style={{ margin: "0 0 16px", fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Défi du jour</h1>

      <div style={{
        background: done ? C.greenL : C.amberL,
        borderRadius: R.lg, padding: 20, marginBottom: 14,
        border: `1px solid ${done ? C.greenBorder : C.amberBorder}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Ti name={done ? "trophy" : "bolt"} size={16} color={done ? C.green : C.amber} />
          <div style={{ fontSize: 10, fontWeight: 500, color: done ? C.greenD : C.amberD, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: FONTS.ui }}>
            {done ? "Défi complété" : "Aujourd'hui"}
          </div>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 500, color: done ? C.greenD : C.amberD, lineHeight: 1.55, fontFamily: FONTS.title }}>{ch}</p>
        <div style={{ fontSize: 12, color: done ? C.greenD : C.amberD, opacity: 0.7, fontFamily: FONTS.ui }}>Récompense : +80 XP</div>
      </div>

      {!done ? (
        <button onClick={finish} style={{
          width: "100%", padding: "14px", borderRadius: R.md, border: "none",
          background: C.amber, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>Défi relevé <Ti name="check" size={16} /></button>
      ) : (
        <div style={{ background: C.greenL, borderRadius: R.md, padding: 18, textAlign: "center", border: `1px solid ${C.greenBorder}` }}>
          <Ti name="trophy" size={32} color={C.green} />
          <div style={{ fontWeight: 700, color: C.greenD, fontSize: 16, fontFamily: FONTS.title, marginTop: 8 }}>Défi complété !</div>
          <div style={{ fontSize: 12, color: C.green, marginTop: 4, fontFamily: FONTS.ui }}>Reviens demain.</div>
        </div>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS
// ═══════════════════════════════════════════════════════════════════════════
function ProgressScreen({ state, content, onOpenSettings }) {
  const xpInLevel = state.xp % 300;
  const xpToNext = 300 - xpInLevel;

  const skills = useMemo(() => [
    { label: "Manche",   pct: skillMastery(state, content, "neck"),    color: C.amber },
    { label: "Gammes",   pct: skillMastery(state, content, "scales"),  color: C.green },
    { label: "Harmonie", pct: skillMastery(state, content, "harmony"), color: C.primary },
    { label: "Rythme",   pct: skillMastery(state, content, "rhythm"),  color: C.coral },
    { label: "Impro",    pct: skillMastery(state, content, "impro"),   color: C.pink },
  ], [state, content]);

  // Grouper badges par catégorie
  const badgesByCategory = useMemo(() => {
    const map = {};
    BADGES.forEach(b => {
      if (!map[b.cat]) map[b.cat] = [];
      map[b.cat].push(b);
    });
    return map;
  }, []);

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Progression</h1>
        <button onClick={onOpenSettings} style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.sm,
          padding: "6px 11px", fontSize: 11, color: C.text, cursor: "pointer",
          fontFamily: FONTS.ui, fontWeight: 500, display: "flex", alignItems: "center", gap: 5,
        }}>
          <Ti name="settings" size={13} /> RÉGLAGES
        </button>
      </div>

      {/* XP hero */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: C.primaryL, border: `2px solid ${C.primary}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 9, color: C.text3, letterSpacing: "0.05em", fontFamily: FONTS.ui }}>NIV.</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.primary, lineHeight: 1, fontFamily: FONTS.ui }}>{state.level}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, marginBottom: 3 }}>
              Expérience totale
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", color: C.text, lineHeight: 1, fontFamily: FONTS.ui }}>
              {state.xp} XP
            </div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 4, fontFamily: FONTS.ui }}>
              {xpToNext} XP pour atteindre le niveau {state.level + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Stats 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
        {[
          { ic: "flame",        v: `${state.streak}j`, l: "Streak",    c: C.amber, cd: C.amberD },
          { ic: "circle-check", v: Object.keys(state.completedExercises).length, l: "Exercices", c: C.green, cd: C.greenD },
          { ic: "book-2",       v: Object.keys(state.completedLessons).length,   l: "Leçons",    c: C.primary, cd: C.primaryD },
        ].map(s => (
          <div key={s.l} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.sm, padding: "10px 6px", textAlign: "center" }}>
            <Ti name={s.ic} size={16} color={s.c} />
            <div style={{ fontSize: 18, fontWeight: 700, color: s.cd, lineHeight: 1, marginTop: 3, fontFamily: FONTS.ui }}>{s.v}</div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 2, fontFamily: FONTS.ui }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Compétences */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 11, fontFamily: FONTS.title, color: C.text }}>Compétences</div>
        {skills.map(sk => (
          <div key={sk.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
            <span style={{ fontSize: 12, color: C.text2, width: 90, flexShrink: 0, fontWeight: 500, fontFamily: FONTS.ui }}>{sk.label}</span>
            <div style={{ flex: 1 }}>
              <ProgressBar pct={sk.pct} color={sk.color} h={3} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, width: 32, textAlign: "right", flexShrink: 0, color: sk.pct > 0 ? sk.color : C.text3, fontFamily: FONTS.ui }}>{sk.pct}%</span>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ padding: "0 0 6px", display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>
          Badges
        </div>
        <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>
          {state.unlockedBadges.length} / {BADGES.length} débloqués
        </div>
      </div>

      {Object.entries(badgesByCategory).map(([cat, badges]) => (
        <div key={cat}>
          <div style={{ padding: "0 0 6px", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em", color: C.text3, fontFamily: FONTS.ui, marginTop: 8 }}>
            — {cat}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7, marginBottom: 8 }}>
            {badges.map(b => {
              const ok = state.unlockedBadges.includes(b.id);
              const tint = BADGE_TINTS[b.tint];
              const rarity = BADGE_RARITIES[b.rarity];
              return (
                <div key={b.id} style={{
                  borderRadius: 12, padding: "10px 6px", textAlign: "center",
                  border: `1px solid ${tint.border}`, background: tint.bg,
                  position: "relative", opacity: ok ? 1 : 0.32, filter: ok ? "none" : "grayscale(0.5)",
                }}>
                  <span style={{
                    position: "absolute", top: 4, right: 4,
                    fontSize: 7, fontWeight: 600, padding: "1px 4px", borderRadius: 3,
                    letterSpacing: "0.05em", textTransform: "uppercase",
                    background: rarity.bg, color: rarity.fg, fontFamily: FONTS.ui,
                  }}>{rarity.label}</span>
                  <Ti name={b.icon.replace("ti-", "")} size={22} color={tint.icon} />
                  <div style={{ fontSize: 9.5, fontWeight: 500, lineHeight: 1.25, marginTop: 5, color: tint.text, fontFamily: FONTS.ui }}>{b.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ height: 20 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS — propre, lisible, plein contraste
// ═══════════════════════════════════════════════════════════════════════════
function SettingsScreen({ state, dispatch, content, onClose, onImported, user, onSignOut }) {
  const [importStatus, setImportStatus] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.courses && !data.quiz && !data.exercises) {
          setImportStatus({ ok: false, msg: "Fichier JSON invalide. Le fichier doit contenir au moins une clé 'courses', 'quiz' ou 'exercises'." });
          return;
        }
        let existing = { courses: [], quiz: [], exercises: [] };
        try {
          const raw = localStorage.getItem(CONTENT_KEY);
          if (raw) existing = JSON.parse(raw);
        } catch {}
        const merged = {
          courses: mergeCourses(existing.courses || [], data.courses || []),
          quiz: mergeById(existing.quiz || [], data.quiz || []),
          exercises: mergeById(existing.exercises || [], data.exercises || []),
        };
        localStorage.setItem(CONTENT_KEY, JSON.stringify(merged));
        const counts = {
          c: (data.courses || []).length,
          q: (data.quiz || []).length,
          e: (data.exercises || []).length,
        };
        setImportStatus({ ok: true, msg: `Import réussi : +${counts.c} module(s), +${counts.q} quiz, +${counts.e} exercice(s).` });
        if (onImported) onImported();
      } catch {
        setImportStatus({ ok: false, msg: "Erreur de lecture : le fichier n'est pas un JSON valide." });
      }
    };
    reader.readAsText(file);
  };

  const resetContent = () => {
    if (window.confirm("Supprimer tout le contenu importé et revenir au contenu de base ?")) {
      localStorage.removeItem(CONTENT_KEY);
      if (onImported) onImported();
      setImportStatus({ ok: true, msg: "Contenu remis à l'état initial." });
    }
  };

  const resetProgress = () => {
    if (window.confirm("Réinitialiser TOUTE ta progression (XP, badges, etc.) ? Action irréversible.")) {
      dispatch({ type: "RESET" });
      setImportStatus({ ok: true, msg: "Progression réinitialisée." });
    }
  };

  const exportProgress = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "GuitarPath",
      version: 4,
      state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guitarpath-progression-${todayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportStatus({ ok: true, msg: "Progression exportée." });
  };

  // Styles communs des boutons réglages
  const btnBase = {
    width: "100%", padding: 13, borderRadius: 11, fontSize: 13, fontWeight: 500,
    cursor: "pointer", fontFamily: FONTS.ui, display: "flex",
    alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8,
  };
  const btnNeutral = { ...btnBase, background: C.surface, color: C.text, border: `1px solid ${C.text}` };
  const btnPrimary = { ...btnBase, background: C.surface, color: C.primary, border: `1px solid ${C.primary}` };
  const btnDanger  = { ...btnBase, background: C.surface, color: C.danger,  border: `1px solid ${C.danger}` };

  return (
    <div style={{ padding: "14px 16px 0" }}>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 8px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
        <Ti name="chevron-left" size={16} /> RETOUR
      </button>
      <h1 style={{ margin: "0 0 14px", fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>Réglages</h1>

      {/* Compte */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 0", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>Compte</div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Email</span>
            <span style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui }}>{user?.email || "—"}</span>
          </div>
        </div>
      </div>
      <button onClick={onSignOut} style={btnDanger}>
        <Ti name="logout" size={14} /> Se déconnecter
      </button>

      {/* Contenu */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, marginTop: 14, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 0", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>Contenu</div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Modules</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{content.courses.length}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Quiz</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{content.quiz.length} questions</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px" }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Exercices</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{content.exercises.length}</span>
          </div>
        </div>
      </div>
      <label style={{ ...btnPrimary, cursor: "pointer" }}>
        <Ti name="upload" size={14} /> Importer un fichier JSON
        <input type="file" accept=".json,application/json" onChange={handleFile} style={{ display: "none" }} />
      </label>
      <button onClick={resetContent} style={btnNeutral}>
        <Ti name="trash" size={14} /> Supprimer le contenu importé
      </button>

      {/* Progression */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, marginTop: 14, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 0", fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>Ma progression</div>
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>XP total</span>
            <span style={{ fontSize: 12, color: C.primary, fontWeight: 500, fontFamily: FONTS.ui }}>{state.xp} XP</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Niveau actuel</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{state.level}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px" }}>
            <span style={{ fontSize: 13, color: C.text, fontFamily: FONTS.title }}>Badges débloqués</span>
            <span style={{ fontSize: 12, color: C.text, fontWeight: 500, fontFamily: FONTS.ui }}>{state.unlockedBadges.length} / {BADGES.length}</span>
          </div>
        </div>
      </div>
      <button onClick={exportProgress} style={btnNeutral}>
        <Ti name="download" size={14} /> Exporter ma progression (JSON)
      </button>
      <button onClick={resetProgress} style={btnDanger}>
        <Ti name="refresh" size={14} /> Réinitialiser ma progression
      </button>

      {importStatus && (
        <div style={{
          background: importStatus.ok ? C.greenL : C.coralL,
          border: `1px solid ${importStatus.ok ? C.greenBorder : C.coralBorder}`,
          borderRadius: 11, padding: "11px 13px", marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <Ti name={importStatus.ok ? "check" : "alert-circle"} size={15} color={importStatus.ok ? C.green : C.coral} style={{ marginTop: 1 }} />
          <p style={{ margin: 0, fontSize: 12, color: importStatus.ok ? C.greenD : C.coralD, fontFamily: FONTS.title, lineHeight: 1.5 }}>{importStatus.msg}</p>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "home",      label: "ACCUEIL",   icon: "home" },
  { id: "courses",   label: "COURS",     icon: "book-2" },
  { id: "exercises", label: "EXERCICES", icon: "guitar-pick" },
  { id: "quiz",      label: "QUIZ",      icon: "help-circle" },
  { id: "progress",  label: "PROGRÈS",   icon: "chart-bar" },
];

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { loadProgress, saveProgressDebounced, syncOfflineData } = useProgress(user?.id);

  const [state, setState] = useState(loadState);
  const [content, setContent] = useState(loadContent);
  const [screen, setScreen] = useState("home");
  const [toast, setToast] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);

  const dispatch = useCallback((action) => {
    setState(prev => reducer(prev, action));
  }, []);

  // Calcul des nouveaux badges après chaque changement de state (avec accès au content)
  useEffect(() => {
    const newBadges = computeNewBadges(state, content);
    if (newBadges.length > 0) {
      setState(prev => {
        const merged = [...new Set([...prev.unlockedBadges, ...newBadges])];
        if (merged.length === prev.unlockedBadges.length) return prev;
        const next = { ...prev, unlockedBadges: merged };
        saveState(next);
        return next;
      });
      // Toast pour le dernier badge débloqué
      const last = BADGES.find(b => b.id === newBadges[newBadges.length - 1]);
      if (last) setToast(`Badge débloqué : ${last.label}`);
    }
  }, [state.xp, state.streak, state.completedLessons, state.completedExercises, state.quizResults, state.dailyChallengeCount, state.practiceLibre, content]);

  // Sync Supabase
  useEffect(() => {
    if (!user || progressLoaded) return;
    loadProgress().then(cloudState => {
      if (cloudState) setState(prev => ({ ...prev, ...cloudState }));
      setProgressLoaded(true);
    });
  }, [user, progressLoaded, loadProgress]);

  useEffect(() => {
    if (!user) setProgressLoaded(false);
  }, [user]);

  useEffect(() => {
    if (!user || !progressLoaded) return;
    saveProgressDebounced(state);
  }, [state, user, progressLoaded, saveProgressDebounced]);

  useEffect(() => {
    const handleOnline = () => { if (user) syncOfflineData(); };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [user, syncOfflineData]);

  useEffect(() => { dispatch({ type: "ROTATE_DAILY" }); }, []);

  const reloadContent = () => setContent(loadContent());

  const navigate = (s) => {
    if (TABS.find(t => t.id === s)) setScreen(s);
    else if (s === "challenge") setScreen("challenge");
    else if (s === "practice") setScreen("practice");
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <Ti name="music" size={42} color={C.primary} />
      </div>
    );
  }

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
        body {
          font-family: ${FONTS.title};
          color: ${C.text};
          -webkit-tap-highlight-color: transparent;
          overscroll-behavior: none;
        }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width: 0; height: 0; }
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
          background: C.surface, borderTop: `1px solid ${C.border}`,
          zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          <div style={{ maxWidth: 440, margin: "0 auto", display: "flex", height: NAV_HEIGHT, padding: "8px 0 6px" }}>
            {TABS.map(t => {
              const active = screen === t.id && !showSettings;
              return (
                <button key={t.id} onClick={() => { setScreen(t.id); setShowSettings(false); }} style={{
                  flex: 1, background: "none", border: "none", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 2,
                  color: active ? C.primary : C.text2,
                  padding: "4px 0",
                  fontFamily: FONTS.ui,
                }}>
                  <Ti name={t.icon} size={19} />
                  <span style={{
                    fontSize: 9,
                    fontWeight: active ? 600 : 500,
                    letterSpacing: "0.04em",
                    color: active ? C.primary : C.text2,
                  }}>{t.label}</span>
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
