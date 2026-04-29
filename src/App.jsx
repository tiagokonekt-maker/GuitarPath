import { useState, useEffect, useCallback, useMemo } from "react";
import { COURSES as DEFAULT_COURSES, QUIZ as DEFAULT_QUIZ, EXERCISES as DEFAULT_EXERCISES } from "./content.js";

// ═══════════════════════════════════════════════════════════════════════════
// THEME — palette claire + polices custom
// ═══════════════════════════════════════════════════════════════════════════
const C = {
  primary: "#7F77DD",    primaryL: "#EEEDFE",   primaryD: "#3C3489",
  green:   "#1D9E75",    greenL:   "#E1F5EE",   greenD:   "#085041",
  amber:   "#BA7517",    amberL:   "#FAEEDA",   amberD:   "#633806",
  coral:   "#D85A30",    coralL:   "#FAECE7",   coralD:   "#712B13",
  blue:    "#185FA5",    blueL:    "#E6F1FB",   blueD:    "#042C53",
  purple:  "#7B5BA8",    purpleL:  "#EFE9F7",   purpleD:  "#3D2B59",
  text:    "#1F1B2E",
  muted:   "#6B6880",
  bg:      "#FFFFFF",
  bgSec:   "#F5F4FA",
  border:  "#E5E3F0",
};

// Polices : Clarendon (titres), Lulo Clean (sous-titres), Georgia (texte)
const FONTS = {
  title: '"Clarendon LT", "Clarendon", "Playfair Display", Georgia, serif',
  subtitle: '"Lulo Clean", "Montserrat", "Helvetica Neue", sans-serif',
  body: 'Georgia, "Times New Roman", serif',
  ui: '"Inter", "Helvetica Neue", -apple-system, sans-serif',
};

// ═══════════════════════════════════════════════════════════════════════════
// PERSISTANCE — localStorage robuste
// ═══════════════════════════════════════════════════════════════════════════
const STATE_KEY = "guitarpath_v3_state";
const CONTENT_KEY = "guitarpath_v3_content"; // pour le contenu importé

const defaultState = () => ({
  xp: 0, level: 1, streak: 0, lastSessionDate: "",
  completedExercises: {}, exerciseProgress: {},
  quizResults: {}, wrongQuiz: [],
  completedLessons: {},
  dailyChallengeIdx: 0, dailyChallengeDone: false, dailyChallengeDate: "",
  unlockedBadges: [],
  weeklyGoals: { sessions: 0, exercises: 0, quizzes: 0, week: "" },
  practiceLibre: { count: 0, totalMinutes: 0 },
});

const loadState = () => {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch (e) { return defaultState(); }
};
const saveState = (s) => {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) {}
};

// Charger contenu importé (s'il existe) et fusionner avec defaults
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
  } catch (e) {
    return { courses: DEFAULT_COURSES, quiz: DEFAULT_QUIZ, exercises: DEFAULT_EXERCISES };
  }
};

const mergeById = (defaults, imported) => {
  const map = new Map(defaults.map(item => [item.id, item]));
  imported.forEach(item => map.set(item.id, item));
  return Array.from(map.values());
};

// Pour les courses : fusion par id de course, et au sein de chaque course, fusion des leçons par id
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

const todayStr = () => new Date().toISOString().split("T")[0];
const weekStr = () => {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
};

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGES & DATA
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
// REDUCER
// ═══════════════════════════════════════════════════════════════════════════
const BADGES = [
  { id: "first_lesson", icon: "📖", label: "Première leçon", cond: s => Object.keys(s.completedLessons).length >= 1 },
  { id: "first_exercise", icon: "🎸", label: "Premier exercice", cond: s => Object.keys(s.completedExercises).length >= 1 },
  { id: "first_quiz", icon: "🧠", label: "Premier quiz", cond: s => Object.keys(s.quizResults).length >= 1 },
  { id: "streak_3", icon: "🔥", label: "3 jours", cond: s => s.streak >= 3 },
  { id: "streak_7", icon: "🔥", label: "7 jours", cond: s => s.streak >= 7 },
  { id: "streak_30", icon: "🌟", label: "30 jours", cond: s => s.streak >= 30 },
  { id: "xp_500", icon: "⚡", label: "500 XP", cond: s => s.xp >= 500 },
  { id: "xp_2000", icon: "💫", label: "2000 XP", cond: s => s.xp >= 2000 },
  { id: "ex_10", icon: "💪", label: "10 exercices", cond: s => Object.keys(s.completedExercises).length >= 10 },
];

function reducer(state, action) {
  let s = { ...state };
  const today = todayStr();
  switch (action.type) {
    case "ADD_XP": s.xp += action.xp; s.level = Math.floor(s.xp / 300) + 1; break;
    case "COMPLETE_LESSON":
      if (!s.completedLessons[action.id]) {
        s.completedLessons = { ...s.completedLessons, [action.id]: today };
        s.xp += 30; s.level = Math.floor(s.xp / 300) + 1;
      }
      break;
    case "COMPLETE_EXERCISE":
      s.completedExercises = { ...s.completedExercises, [action.id]: { completedAt: today, count: (s.completedExercises[action.id]?.count || 0) + 1 } };
      delete s.exerciseProgress[action.id];
      s.xp += action.xp; s.level = Math.floor(s.xp / 300) + 1;
      break;
    case "SAVE_EXERCISE_PROGRESS":
      s.exerciseProgress = { ...s.exerciseProgress, [action.id]: action.checkedSteps };
      break;
    case "QUIZ_ANSWER":
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
    case "MARK_STREAK":
      if (s.lastSessionDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        s.streak = (s.lastSessionDate === yesterday) ? s.streak + 1 : 1;
        s.lastSessionDate = today;
      }
      break;
    case "DAILY_CHALLENGE_DONE":
      s.dailyChallengeDone = true; s.dailyChallengeDate = today; s.xp += 80; s.level = Math.floor(s.xp / 300) + 1;
      break;
    case "ROTATE_DAILY":
      if (s.dailyChallengeDate !== today) {
        s.dailyChallengeIdx = (s.dailyChallengeIdx + 1) % DAILY_CHALLENGES.length;
        s.dailyChallengeDone = false; s.dailyChallengeDate = "";
      }
      break;
    case "UPDATE_WEEKLY":
      const w = weekStr();
      if (s.weeklyGoals.week !== w) s.weeklyGoals = { sessions: 0, exercises: 0, quizzes: 0, week: w };
      s.weeklyGoals = { ...s.weeklyGoals, [action.field]: s.weeklyGoals[action.field] + 1 };
      break;
    case "RESET":
      s = defaultState();
      break;
    default: break;
  }
  const newBadges = BADGES.filter(b => !s.unlockedBadges.includes(b.id) && b.cond(s)).map(b => b.id);
  if (newBadges.length) s.unlockedBadges = [...s.unlockedBadges, ...newBadges];
  saveState(s);
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANTS UI
// ═══════════════════════════════════════════════════════════════════════════
function Ring({ pct, size = 48, stroke = 4, color = C.primary, children }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(pct, 100) / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.bgSec} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
      </svg>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

function XPPop({ amount, onDone }) {
  const [y, setY] = useState(0); const [op, setOp] = useState(1);
  useEffect(() => {
    let f = 0; const id = setInterval(() => { f++; setY(f * 4); setOp(1 - f / 12); if (f >= 12) { clearInterval(id); onDone(); } }, 80);
    return () => clearInterval(id);
  }, []);
  return <div style={{ position: "fixed", top: "40%", left: "50%", transform: `translateX(-50%) translateY(-${y}px)`, opacity: op, pointerEvents: "none", zIndex: 9999, fontSize: 28, fontWeight: 700, color: C.primary, fontFamily: FONTS.title }}>+{amount} XP</div>;
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, []);
  return <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", background: C.primaryD, color: "#fff", padding: "11px 22px", borderRadius: 24, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 8px 24px rgba(60,52,137,0.25)", fontFamily: FONTS.ui, maxWidth: "85%" }}>{msg}</div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════
function HomeScreen({ state, dispatch, navigate, content }) {
  const lvlPct = Math.round((state.xp % 300) / 3);
  const totalLessons = content.courses.reduce((a,c) => a + c.lessons.length, 0);
  const completedLessons = Object.keys(state.completedLessons).length;
  const courseProgress = Math.round((completedLessons / totalLessons) * 100);
  const todayChallenge = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: C.muted, fontFamily: FONTS.ui }}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1 style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Bonjour 🎸</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: C.amberL, borderRadius: 20, padding: "5px 11px" }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.amberD, fontFamily: FONTS.ui }}>{state.streak}</span>
          </div>
          <Ring pct={lvlPct} size={44} stroke={4} color={C.primary}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, fontFamily: FONTS.ui }}>N{state.level}</span>
          </Ring>
        </div>
      </div>

      <button onClick={() => navigate("courses")} style={{ width: "100%", background: C.primaryL, border: `1px solid ${C.primary}25`, borderRadius: 16, padding: "16px", marginBottom: "1rem", cursor: "pointer", textAlign: "left", fontFamily: FONTS.ui }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.primaryD, letterSpacing: "0.1em", fontFamily: FONTS.subtitle }}>TON PARCOURS</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.primaryD, marginTop: 4, fontFamily: FONTS.title }}>{completedLessons}/{totalLessons} leçons complétées</div>
          </div>
          <span style={{ fontSize: 22 }}>📚</span>
        </div>
        <div style={{ height: 6, background: `${C.primary}25`, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${courseProgress}%`, background: C.primary, borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 12, color: C.primaryD, marginTop: 6, opacity: 0.8 }}>Continuer où tu t'es arrêté →</div>
      </button>

      <button onClick={() => navigate("challenge")} style={{ width: "100%", background: state.dailyChallengeDone ? C.greenL : C.amberL, border: `1px solid ${state.dailyChallengeDone ? C.green : C.amber}25`, borderRadius: 14, padding: "14px 16px", marginBottom: "1rem", cursor: "pointer", textAlign: "left" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: state.dailyChallengeDone ? C.greenD : C.amberD, marginBottom: 5, letterSpacing: "0.1em", fontFamily: FONTS.subtitle }}>DÉFI DU JOUR {state.dailyChallengeDone ? "✓" : ""}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: state.dailyChallengeDone ? C.greenD : C.amberD, lineHeight: 1.5, fontFamily: FONTS.body }}>{todayChallenge}</div>
          </div>
          <span style={{ fontSize: 20, marginLeft: 10 }}>{state.dailyChallengeDone ? "🏆" : "⚡"}</span>
        </div>
      </button>

      <h2 style={{ fontSize: 11, fontWeight: 700, color: C.muted, margin: "0 0 10px", letterSpacing: "0.1em", fontFamily: FONTS.subtitle }}>SESSION DU JOUR</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[
          { id: "courses", icon: "🧠", label: "Théorie", sub: "Cours structurés", color: C.primary, colorL: C.primaryL },
          { id: "exercises", icon: "🎸", label: "Exercices", sub: `${content.exercises.length} disponibles`, color: C.green, colorL: C.greenL },
          { id: "quiz", icon: "❓", label: "Quiz", sub: `${content.quiz.length} questions${state.wrongQuiz.length>0?` · ${state.wrongQuiz.length} à revoir`:""}`, color: C.amber, colorL: C.amberL },
          { id: "practice", icon: "🎲", label: "Practice libre", sub: "Défis générés à l'infini", color: C.coral, colorL: C.coralL },
        ].map(t => (
          <button key={t.id} onClick={() => navigate(t.id)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 15px", display: "flex", alignItems: "center", gap: 13, cursor: "pointer", textAlign: "left", width: "100%" }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: t.colorL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{t.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: FONTS.title, color: C.text }}>{t.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2, fontFamily: FONTS.body }}>{t.sub}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>
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

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <h1 style={{ margin: "0 0 0.5rem", fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Cours</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: "0 0 1.25rem", fontFamily: FONTS.body, lineHeight: 1.6 }}>Modules approfondis. Chaque leçon dure 8-18 min.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {content.courses.map(c => {
          const total = c.lessons.length;
          const done = c.lessons.filter(l => state.completedLessons[l.id]).length;
          const pct = Math.round(done/total*100);
          return (
            <button key={c.id} onClick={() => setActive(c)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div style={{ width: 52, height: 52, borderRadius: 13, background: c.colorL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600, fontFamily: FONTS.title, color: C.text }}>{c.title}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3, fontFamily: FONTS.body }}>{c.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 5, background: C.bgSec, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, color: c.color, fontWeight: 700, flexShrink: 0, fontFamily: FONTS.ui }}>{done}/{total}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CourseDetail({ course, state, onBack, onSelectLesson }) {
  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 0 12px", fontFamily: FONTS.ui }}>‹ Retour</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: course.colorL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{course.icon}</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: FONTS.title }}>{course.title}</h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: C.muted, fontFamily: FONTS.body }}>{course.lessons.length} leçons</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {course.lessons.map((l, i) => {
          const done = !!state.completedLessons[l.id];
          return (
            <button key={l.id} onClick={() => onSelectLesson(l)} style={{ background: C.bg, border: `1px solid ${done ? course.color+"40" : C.border}`, borderRadius: 13, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? course.colorL : C.bgSec, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: done ? course.color : C.muted, flexShrink: 0, fontFamily: FONTS.ui }}>{done ? "✓" : i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, fontFamily: FONTS.title, color: C.text }}>{l.title}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontFamily: FONTS.ui }}>⏱ {l.duration} min · {(l.quiz || []).length} quiz</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LessonView({ lesson, state, dispatch, onBack }) {
  const [done, setDone] = useState(!!state.completedLessons[lesson.id]);
  const [pop, setPop] = useState(false);

  const finish = () => {
    if (!done) {
      setPop(true);
      setTimeout(() => { setPop(false); dispatch({ type: "COMPLETE_LESSON", id: lesson.id }); dispatch({ type: "MARK_STREAK" }); setDone(true); }, 1000);
    }
  };

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      {pop && <XPPop amount={30} onDone={() => {}} />}
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 0 12px", fontFamily: FONTS.ui }}>‹ Retour</button>
      <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, lineHeight: 1.25, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>{lesson.title}</h1>
      <p style={{ fontSize: 12, color: C.muted, margin: "0 0 1.5rem", fontFamily: FONTS.ui, letterSpacing: "0.05em" }}>⏱ {lesson.duration} MIN · {(lesson.quiz || []).length} QUESTIONS</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: "1.5rem" }}>
        {lesson.content.map((b, i) => {
          if (b.type === "h") return <h3 key={i} style={{ margin: "10px 0 0", fontSize: 17, fontWeight: 700, color: C.primary, fontFamily: FONTS.title }}>{b.text}</h3>;
          if (b.type === "tip") return <div key={i} style={{ background: C.amberL, border: `1px solid ${C.amber}25`, borderRadius: 12, padding: "13px 15px" }}><p style={{ margin: 0, fontSize: 14, color: C.amberD, lineHeight: 1.6, fontFamily: FONTS.body }}>💡 {b.text}</p></div>;
          if (b.type === "img") return <div key={i} style={{ background: C.bgSec, borderRadius: 12, padding: 12, textAlign: "center" }}><img src={b.src} alt={b.alt || ""} style={{ maxWidth: "100%", borderRadius: 8 }} />{b.caption && <p style={{ fontSize: 12, color: C.muted, marginTop: 8, fontFamily: FONTS.body, fontStyle: "italic" }}>{b.caption}</p>}</div>;
          if (b.type === "ref") return <div key={i} style={{ background: C.blueL, border: `1px solid ${C.blue}25`, borderRadius: 12, padding: "12px 14px" }}><p style={{ margin: 0, fontSize: 13, color: C.blueD, lineHeight: 1.55, fontFamily: FONTS.body }}>🎵 <strong>Référence :</strong> {b.text}</p></div>;
          return <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: C.text, fontFamily: FONTS.body }}>{b.text}</p>;
        })}
      </div>

      {(lesson.quiz || []).length > 0 && (
        <div style={{ background: C.primaryL, border: `1px solid ${C.primary}25`, borderRadius: 13, padding: "12px 14px", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontSize: 13, color: C.primaryD, fontFamily: FONTS.body }}>📝 Cette leçon est associée à {(lesson.quiz || []).length} question{(lesson.quiz || []).length>1?"s":""} de quiz.</p>
        </div>
      )}

      <button onClick={finish} disabled={done} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: done ? C.greenL : C.primary, color: done ? C.greenD : "#fff", fontSize: 16, fontWeight: 700, cursor: done ? "default" : "pointer", fontFamily: FONTS.ui, letterSpacing: "0.02em" }}>
        {done ? "✓ Leçon complétée" : "Terminer la leçon (+30 XP)"}
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXERCISES
// ═══════════════════════════════════════════════════════════════════════════
function ExercisesScreen({ state, dispatch, content }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const cats = [{id:"all",label:"Tous"},{id:"neck",label:"Manche"},{id:"scales",label:"Gammes"},{id:"harmony",label:"Harmonie"},{id:"rhythm",label:"Rythme"},{id:"impro",label:"Impro"}];
  const filtered = content.exercises.filter(e => filter === "all" || e.mod === filter);

  if (active) return <ExerciseDetail ex={active} state={state} dispatch={dispatch} onBack={() => setActive(null)} content={content} />;

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <h1 style={{ margin: "0 0 1rem", fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Exercices</h1>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: "1rem", scrollbarWidth: "none" }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${filter===c.id?C.primary:C.border}`, background: filter===c.id?C.primaryL:C.bg, color: filter===c.id?C.primaryD:C.text, fontSize: 13, fontWeight: filter===c.id?700:500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: FONTS.ui }}>{c.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(ex => {
          const done = !!state.completedExercises[ex.id];
          const inProgress = state.exerciseProgress[ex.id]?.length > 0;
          return (
            <button key={ex.id} onClick={() => setActive(ex)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 13, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: done ? C.greenL : inProgress ? C.amberL : C.primaryL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{done ? "✓" : inProgress ? "⏸" : "🎸"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, fontFamily: FONTS.title, color: C.text }}>{ex.title}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: FONTS.ui }}>⏱ {ex.dur} min</span>
                  {ex.bpm && <span style={{ fontSize: 11, color: C.muted, fontFamily: FONTS.ui }}>♩ {ex.bpm}</span>}
                  <span style={{ fontSize: 11, color: C.primary, fontWeight: 700, fontFamily: FONTS.ui }}>+{ex.xp} XP</span>
                  {state.completedExercises[ex.id]?.count > 1 && <span style={{ fontSize: 11, color: C.green, fontFamily: FONTS.ui }}>×{state.completedExercises[ex.id].count}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExerciseDetail({ ex, state, dispatch, onBack, content }) {
  const saved = state.exerciseProgress[ex.id] || [];
  const [checked, setChecked] = useState(saved);
  const [done, setDone] = useState(false);
  const [pop, setPop] = useState(false);
  const allDone = checked.length === ex.steps.length;

  useEffect(() => {
    if (checked.length > 0 && !done) dispatch({ type: "SAVE_EXERCISE_PROGRESS", id: ex.id, checkedSteps: checked });
  }, [checked]);

  const toggle = (i) => setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  const finish = () => { setPop(true); setTimeout(() => { setPop(false); dispatch({ type: "COMPLETE_EXERCISE", id: ex.id, xp: ex.xp }); dispatch({ type: "MARK_STREAK" }); dispatch({ type: "UPDATE_WEEKLY", field: "exercises" }); setDone(true); }, 1200); };
  const linkedLesson = ex.courseLink ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===ex.courseLink) : null;

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      {pop && <XPPop amount={ex.xp} onDone={() => {}} />}
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 0 12px", fontFamily: FONTS.ui }}>‹ Retour</button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: C.greenL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21 }}>🎸</div>
        <div>
          <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONTS.subtitle }}>{ex.mod} · {ex.dur} MIN{ex.bpm ? ` · ♩ ${ex.bpm}` : ""}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, fontFamily: FONTS.title }}>{ex.title}</div>
        </div>
      </div>

      {linkedLesson && (
        <div style={{ background: C.primaryL, border: `1px solid ${C.primary}25`, borderRadius: 12, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: C.primaryD, fontFamily: FONTS.body }}>
          📖 Lié à : <strong>{linkedLesson.title}</strong>
        </div>
      )}

      <div style={{ height: 6, background: C.bgSec, borderRadius: 3, overflow: "hidden", marginBottom: "1rem" }}>
        <div style={{ height: "100%", width: `${(checked.length/ex.steps.length)*100}%`, background: C.green, borderRadius: 3, transition: "width 0.4s" }} />
      </div>

      {!done ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem" }}>
            {ex.steps.map((s, i) => {
              const ck = checked.includes(i);
              return (
                <button key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: ck ? C.greenL : C.bg, border: `1px solid ${ck ? C.green+"50" : C.border}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "left", width: "100%" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${ck ? C.green : C.border}`, background: ck ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {ck && <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: ck ? C.greenD : C.text, fontFamily: FONTS.body }}>{s}</p>
                </button>
              );
            })}
          </div>
          <div style={{ background: C.amberL, borderRadius: 12, padding: "11px 14px", marginBottom: "1rem", border: `1px solid ${C.amber}25` }}>
            <p style={{ margin: 0, fontSize: 14, color: C.amberD, lineHeight: 1.6, fontFamily: FONTS.body }}>💡 {ex.tip}</p>
          </div>
          <button onClick={finish} disabled={!allDone} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: allDone ? C.green : C.bgSec, color: allDone ? "#fff" : C.muted, fontSize: 16, fontWeight: 700, cursor: allDone ? "pointer" : "default", fontFamily: FONTS.ui }}>
            {allDone ? "Exercice terminé ✓" : `${checked.length} / ${ex.steps.length} étapes`}
          </button>
        </>
      ) : (
        <div style={{ background: C.greenL, borderRadius: 14, padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎸</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: C.greenD, fontFamily: FONTS.title }}>Bien joué !</div>
          <div style={{ fontSize: 14, color: C.green, marginTop: 4, fontFamily: FONTS.body }}>+{ex.xp} XP</div>
          <button onClick={onBack} style={{ marginTop: 16, padding: "11px 28px", borderRadius: 12, border: "none", background: C.green, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>Retour</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════════════════
function QuizScreen({ state, dispatch, content }) {
  const [mode, setMode] = useState(null);
  const modes = [
    { id: "daily", label: "Quiz du jour", desc: "7 questions adaptées", icon: "⭐", color: C.primary, colorL: C.primaryL,
      pool: () => {
        const wrong = content.quiz.filter(q => state.wrongQuiz.includes(q.id)).slice(0, 3);
        const fresh = content.quiz.filter(q => !state.quizResults[q.id] && !state.wrongQuiz.includes(q.id)).sort(()=>Math.random()-0.5).slice(0, 4);
        return [...wrong, ...fresh].slice(0, 7);
      } },
    { id: "review", label: `Révisions (${state.wrongQuiz.length})`, desc: "Questions ratées à reprendre", icon: "🔁", color: C.coral, colorL: C.coralL,
      pool: () => content.quiz.filter(q => state.wrongQuiz.includes(q.id)), disabled: state.wrongQuiz.length === 0 },
    { id: "neck", label: "Manche & visualisation", desc: `${content.quiz.filter(q=>q.courseId==="neck").length} questions`, icon: "🗺️", color: C.amber, colorL: C.amberL,
      pool: () => content.quiz.filter(q => q.courseId === "neck").sort(()=>Math.random()-0.5).slice(0, 7) },
    { id: "scales", label: "Gammes & modes", desc: `${content.quiz.filter(q=>q.courseId==="scales").length} questions`, icon: "🎼", color: C.green, colorL: C.greenL,
      pool: () => content.quiz.filter(q => q.courseId === "scales").sort(()=>Math.random()-0.5).slice(0, 7) },
    { id: "harmony", label: "Harmonie", desc: `${content.quiz.filter(q=>q.courseId==="harmony").length} questions`, icon: "🎵", color: C.primary, colorL: C.primaryL,
      pool: () => content.quiz.filter(q => q.courseId === "harmony").sort(()=>Math.random()-0.5).slice(0, 7) },
    { id: "rhythm", label: "Rythme", desc: `${content.quiz.filter(q=>q.courseId==="rhythm").length} questions`, icon: "🥁", color: C.coral, colorL: C.coralL,
      pool: () => content.quiz.filter(q => q.courseId === "rhythm").sort(()=>Math.random()-0.5).slice(0, 7) },
  ];

  if (mode) return <QuizPlayer pool={mode.pool()} title={mode.label} state={state} dispatch={dispatch} content={content} onDone={() => setMode(null)} />;

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <h1 style={{ margin: "0 0 0.5rem", fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Quiz</h1>
      <p style={{ fontSize: 14, color: C.muted, margin: "0 0 1.25rem", fontFamily: FONTS.body }}>{Object.keys(state.quizResults).length} vues / {content.quiz.length} totales · {state.wrongQuiz.length} à réviser</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {modes.map(m => (
          <button key={m.id} onClick={() => !m.disabled && setMode(m)} disabled={m.disabled} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "13px 15px", display: "flex", alignItems: "center", gap: 13, cursor: m.disabled ? "default" : "pointer", textAlign: "left", width: "100%", opacity: m.disabled ? 0.45 : 1 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: m.colorL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, fontFamily: FONTS.title, color: C.text }}>{m.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3, fontFamily: FONTS.body }}>{m.desc}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizPlayer({ pool, title, state, dispatch, content, onDone }) {
  const [questions] = useState(pool);
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return <div style={{ padding: "2rem", textAlign: "center", color: C.muted, fontFamily: FONTS.body }}>Aucune question disponible.<br/><button onClick={onDone} style={{ marginTop: 16, padding: "10px 20px", border: "none", borderRadius: 10, background: C.primary, color: "#fff", cursor: "pointer", fontFamily: FONTS.ui }}>Retour</button></div>;

  const q = questions[idx];
  const answered = sel !== null;

  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const ok = i === q.a;
    if (ok) setScore(s => s + 1);
    dispatch({ type: "QUIZ_ANSWER", id: q.id, correct: ok, xp: q.xp });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
  };

  const next = () => {
    if (idx + 1 >= questions.length) setFinished(true);
    else { setSel(null); setIdx(i => i + 1); }
  };

  if (finished) {
    const pct = Math.round(score / questions.length * 100);
    return (
      <div style={{ padding: "1.5rem 1rem", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{score === questions.length ? "🏆" : score >= 5 ? "🎉" : "💪"}</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, fontFamily: FONTS.title }}>{score === questions.length ? "Parfait !" : score >= 5 ? "Très bien !" : "Continue !"}</div>
        <div style={{ color: C.muted, marginBottom: 24, fontFamily: FONTS.body }}>{score}/{questions.length} · {pct}%</div>
        <button onClick={onDone} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: C.primary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>Retour</button>
      </div>
    );
  }

  const linkedLesson = q.lessonId ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===q.lessonId) : null;
  const linkedCourse = q.courseId ? content.courses.find(c=>c.id===q.courseId) : null;

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <button onClick={onDone} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 0 12px", fontFamily: FONTS.ui }}>‹ Quitter</button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: 26, height: 5, borderRadius: 3, background: i < idx ? C.green : i === idx ? C.primary : C.bgSec }} />
          ))}
        </div>
        <span style={{ fontSize: 13, color: C.muted, marginLeft: 8, fontFamily: FONTS.ui }}>{idx+1}/{questions.length}</span>
      </div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONTS.subtitle }}>{linkedCourse?.title} · NIV. {q.lvl}</div>
      <div style={{ background: C.primaryL, borderRadius: 16, padding: "1.25rem", marginBottom: "1.25rem", border: `1px solid ${C.primary}20` }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, lineHeight: 1.55, color: C.primaryD, fontFamily: FONTS.body }}>{q.q}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: "1rem" }}>
        {q.o.map((opt, i) => {
          let bg = C.bg, border = `1px solid ${C.border}`, col = C.text, ic = null;
          if (answered) {
            if (i === q.a) { bg = C.greenL; border = `1px solid ${C.green}60`; col = C.greenD; ic = "✓"; }
            else if (i === sel) { bg = C.coralL; border = `1px solid ${C.coral}60`; col = C.coralD; ic = "✗"; }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={answered} style={{ display: "flex", alignItems: "center", gap: 12, background: bg, border, borderRadius: 13, padding: "13px 15px", cursor: answered ? "default" : "pointer", textAlign: "left", width: "100%" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: answered && i === q.a ? C.green : answered && i === sel ? C.coral : C.bgSec, color: answered ? "#fff" : C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, fontFamily: FONTS.ui }}>{ic || ["A","B","C","D"][i]}</div>
              <span style={{ fontSize: 15, color: col, fontWeight: answered && i === q.a ? 600 : 400, lineHeight: 1.45, fontFamily: FONTS.body }}>{opt}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <>
          <div style={{ background: sel === q.a ? C.greenL : C.coralL, borderRadius: 13, padding: "12px 14px", marginBottom: "1rem", border: `1px solid ${sel === q.a ? C.green : C.coral}30` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: sel === q.a ? C.greenD : C.coralD, marginBottom: 4, fontFamily: FONTS.ui }}>{sel === q.a ? `Correct ! +${q.xp || q.exp_xp || 30} XP` : "Pas tout à fait…"}</div>
            <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.55, fontFamily: FONTS.body }}>{q.exp || q.x}</div>
            {linkedLesson && <div style={{ fontSize: 12, color: C.primary, marginTop: 8, fontFamily: FONTS.body }}>📖 Pour approfondir : <em>{linkedLesson.title}</em></div>}
          </div>
          <button onClick={next} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: C.primary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>{idx+1 >= questions.length ? "Voir les résultats" : "Suivant →"}</button>
        </>
      )}
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
    const key = KEYS[Math.floor(Math.random()*KEYS.length)];
    const mode = MODES[Math.floor(Math.random()*MODES.length)];
    const tempo = TEMPOS[Math.floor(Math.random()*TEMPOS.length)];
    const constraint = CONSTRAINTS[Math.floor(Math.random()*CONSTRAINTS.length)];
    setCurrent({ type: "impro", title: `${key} ${mode} · ${tempo} BPM`, sub: constraint, time: 10 });
  };
  const generateNeck = () => {
    const challenges = ["trouve toutes les notes Do sur le manche en 30 secondes","joue la pentatonique Am en 5 positions enchaînées","trouve la triade de Fa majeur sur cordes 1-2-3 dans 3 positions","joue Cmaj7 dans les 5 formes CAGED"];
    setCurrent({ type: "neck", title: "Défi manche", sub: challenges[Math.floor(Math.random()*challenges.length)], time: 5 });
  };
  const generateRhythm = () => {
    const t = TEMPOS[Math.floor(Math.random()*TEMPOS.length)];
    const subs = ["noires","croches","doubles-croches","triolets"][Math.floor(Math.random()*4)];
    setCurrent({ type: "rhythm", title: `Métronome ${t} BPM`, sub: `Joue uniquement en ${subs} pendant 5 minutes`, time: 5 });
  };

  const finish = () => {
    setPop(true);
    setTimeout(() => { setPop(false); dispatch({ type: "ADD_XP", xp: 50 }); dispatch({ type: "MARK_STREAK" }); setCurrent(null); }, 1000);
  };

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      {pop && <XPPop amount={50} onDone={() => {}} />}
      <h1 style={{ margin: "0 0 0.5rem", fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Practice libre</h1>
      <p style={{ fontSize: 13, color: C.muted, margin: "0 0 1.25rem", fontFamily: FONTS.body }}>Défis générés à l'infini. Jamais 2 fois pareil.</p>

      <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
        {[{id:"impro",label:"Impro"},{id:"neck",label:"Manche"},{id:"rhythm",label:"Rythme"}].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setCurrent(null); }} style={{ flex: 1, padding: "11px", borderRadius: 11, border: `1px solid ${tab===t.id?C.primary:C.border}`, background: tab===t.id?C.primaryL:C.bg, color: tab===t.id?C.primaryD:C.text, fontSize: 13, fontWeight: tab===t.id?700:500, cursor: "pointer", fontFamily: FONTS.ui }}>{t.label}</button>
        ))}
      </div>

      {!current ? (
        <div style={{ background: C.coralL, border: `1px solid ${C.coral}25`, borderRadius: 16, padding: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🎲</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.coralD, marginBottom: 6, fontFamily: FONTS.title }}>Génère ton défi</div>
          <div style={{ fontSize: 14, color: C.coralD, opacity: 0.8, marginBottom: 16, lineHeight: 1.55, fontFamily: FONTS.body }}>
            {tab === "impro" && "Tonalité, mode, tempo et contrainte tirés au sort."}
            {tab === "neck" && "Un défi de visualisation du manche."}
            {tab === "rhythm" && "Un défi de métronome à un tempo donné."}
          </div>
          <button onClick={tab === "impro" ? generateImpro : tab === "neck" ? generateNeck : generateRhythm} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: C.coral, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>Générer un défi 🎲</button>
        </div>
      ) : (
        <div>
          <div style={{ background: C.primaryL, border: `1px solid ${C.primary}25`, borderRadius: 16, padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.primaryD, letterSpacing: "0.1em", marginBottom: 8, fontFamily: FONTS.subtitle }}>DÉFI EN COURS</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.primaryD, marginBottom: 8, fontFamily: FONTS.title }}>{current.title}</div>
            <div style={{ fontSize: 15, color: C.primaryD, opacity: 0.9, lineHeight: 1.55, fontFamily: FONTS.body }}>{current.sub}</div>
            <div style={{ fontSize: 12, color: C.primaryD, marginTop: 12, opacity: 0.7, fontFamily: FONTS.ui }}>⏱ Durée : {current.time} min</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button onClick={() => { setCurrent(null); }} style={{ padding: "13px", borderRadius: 13, border: `1px solid ${C.border}`, background: C.bg, color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONTS.ui }}>Autre défi 🎲</button>
            <button onClick={finish} style={{ padding: "13px", borderRadius: 13, border: "none", background: C.green, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>Terminé ✓ +50 XP</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGE & PROGRESS & SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function ChallengeScreen({ state, dispatch, navigate }) {
  const ch = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];
  const done = state.dailyChallengeDone;
  const [pop, setPop] = useState(false);

  const finish = () => { setPop(true); setTimeout(() => { setPop(false); dispatch({ type: "DAILY_CHALLENGE_DONE" }); dispatch({ type: "MARK_STREAK" }); }, 1000); };

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      {pop && <XPPop amount={80} onDone={() => {}} />}
      <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 0 12px", fontFamily: FONTS.ui }}>‹ Retour</button>
      <h1 style={{ margin: "0 0 1.25rem", fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Défi du jour</h1>
      <div style={{ background: done ? C.greenL : C.amberL, borderRadius: 16, padding: "1.5rem", marginBottom: "1rem", border: `1px solid ${done ? C.green : C.amber}25` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: done ? C.greenD : C.amberD, marginBottom: 8, letterSpacing: "0.1em", fontFamily: FONTS.subtitle }}>{done ? "DÉFI COMPLÉTÉ ✓" : "AUJOURD'HUI"}</div>
        <p style={{ margin: "0 0 12px", fontSize: 17, fontWeight: 500, color: done ? C.greenD : C.amberD, lineHeight: 1.55, fontFamily: FONTS.body }}>{ch}</p>
        <div style={{ fontSize: 13, color: done ? C.greenD : C.amberD, opacity: 0.7, fontFamily: FONTS.ui }}>Récompense : +80 XP</div>
      </div>
      {!done ? (
        <button onClick={finish} style={{ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: C.amber, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>Défi relevé ✓</button>
      ) : (
        <div style={{ background: C.greenL, borderRadius: 14, padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>🏆</div>
          <div style={{ fontWeight: 700, color: C.greenD, fontSize: 18, fontFamily: FONTS.title }}>Défi complété !</div>
          <div style={{ fontSize: 13, color: C.green, marginTop: 4, fontFamily: FONTS.body }}>Reviens demain.</div>
        </div>
      )}
    </div>
  );
}

function ProgressScreen({ state, dispatch, content, onOpenSettings }) {
  const lvlPct = Math.round((state.xp % 300) / 3);
  const skills = useMemo(() => {
    const skill = (mod) => {
      const exDone = Object.keys(state.completedExercises).filter(id => content.exercises.find(e=>e.id===id)?.mod === mod).length;
      const quizDone = Object.entries(state.quizResults).filter(([id,r]) => r.correct && content.quiz.find(q=>q.id===id)?.courseId === mod).length;
      return Math.min(100, Math.round(exDone * 8 + quizDone * 6));
    };
    return [
      { label: "Manche", pct: skill("neck"), color: C.amber },
      { label: "Gammes & modes", pct: skill("scales"), color: C.green },
      { label: "Harmonie", pct: skill("harmony"), color: C.primary },
      { label: "Rythme", pct: skill("rhythm"), color: C.coral },
      { label: "Improvisation", pct: skill("impro"), color: C.purple },
    ];
  }, [state, content]);

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Progression</h1>
        <button onClick={onOpenSettings} style={{ background: C.bgSec, border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 13, color: C.text, fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/></svg>
          Réglages
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.primaryL, borderRadius: 16, padding: "1rem 1.25rem", marginBottom: "1.25rem", border: `1px solid ${C.primary}20` }}>
        <Ring pct={lvlPct} size={68} stroke={6} color={C.primary}>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.primary, fontFamily: FONTS.ui }}>{state.level}</span>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: C.primaryD, fontFamily: FONTS.ui }}>Niveau {state.level}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: C.primaryD, fontFamily: FONTS.title }}>{state.xp} XP</div>
          <div style={{ fontSize: 12, color: C.primary, marginTop: 2, fontFamily: FONTS.ui }}>{300 - (state.xp % 300)} XP → niv. {state.level + 1}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "1.25rem" }}>
        {[
          ["🔥", `${state.streak}j`, "Streak", C.amber, C.amberL],
          ["✅", Object.keys(state.completedExercises).length, "Exercices", C.green, C.greenL],
          ["📖", Object.keys(state.completedLessons).length, "Leçons", C.primary, C.primaryL],
        ].map(([ic, v, l, c, bg]) => (
          <div key={l} style={{ background: bg, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>{ic}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c, marginTop: 2, fontFamily: FONTS.title }}>{v}</div>
            <div style={{ fontSize: 11, color: c, opacity: 0.7, fontFamily: FONTS.ui }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: FONTS.title }}>Compétences</div>
        {skills.map(sk => (
          <div key={sk.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5, fontFamily: FONTS.ui }}>
              <span>{sk.label}</span><span style={{ color: C.muted }}>{sk.pct}%</span>
            </div>
            <div style={{ height: 6, background: C.bgSec, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${sk.pct}%`, background: sk.color, borderRadius: 3, transition: "width 0.6s" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: FONTS.title }}>Badges ({state.unlockedBadges.length}/{BADGES.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {BADGES.map(b => {
            const ok = state.unlockedBadges.includes(b.id);
            return (
              <div key={b.id} style={{ background: ok ? C.primaryL : C.bgSec, borderRadius: 12, padding: "12px 8px", textAlign: "center", opacity: ok ? 1 : 0.4 }}>
                <div style={{ fontSize: 22 }}>{b.icon}</div>
                <div style={{ fontSize: 10, marginTop: 4, fontWeight: ok ? 700 : 400, color: ok ? C.primaryD : C.muted, lineHeight: 1.3, fontFamily: FONTS.ui }}>{b.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS — IMPORT JSON
// ═══════════════════════════════════════════════════════════════════════════
function SettingsScreen({ state, dispatch, content, onClose, onImported }) {
  const [importStatus, setImportStatus] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        // Validation simple
        if (!data.courses && !data.quiz && !data.exercises) {
          setImportStatus({ ok: false, msg: "Fichier JSON invalide. Le fichier doit contenir au moins une clé 'courses', 'quiz' ou 'exercises'." });
          return;
        }
        // Charger ce qui existe déjà en localStorage et fusionner
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
        setImportStatus({ ok: true, msg: `Import réussi ! +${counts.c} module(s), +${counts.q} quiz, +${counts.e} exercice(s).` });
        if (onImported) onImported();
      } catch (err) {
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

  return (
    <div style={{ padding: "1.25rem 1rem 0" }}>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 0 12px", fontFamily: FONTS.ui }}>‹ Retour</button>
      <h1 style={{ margin: "0 0 1.25rem", fontSize: 26, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em" }}>Réglages</h1>

      <div style={{ background: C.primaryL, border: `1px solid ${C.primary}25`, borderRadius: 14, padding: "16px", marginBottom: "1rem" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.primaryD, marginBottom: 8, letterSpacing: "0.1em", fontFamily: FONTS.subtitle }}>IMPORTER DU CONTENU</div>
        <p style={{ margin: "0 0 12px", fontSize: 14, color: C.primaryD, lineHeight: 1.55, fontFamily: FONTS.body }}>Ajoute de nouveaux cours, quiz et exercices via un fichier JSON. Le contenu sera fusionné avec l'existant.</p>
        <label style={{ display: "block", width: "100%", padding: "13px", borderRadius: 12, background: C.primary, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", textAlign: "center", fontFamily: FONTS.ui }}>
          📥 Choisir un fichier JSON
          <input type="file" accept=".json,application/json" onChange={handleFile} style={{ display: "none" }} />
        </label>
      </div>

      {importStatus && (
        <div style={{ background: importStatus.ok ? C.greenL : C.coralL, border: `1px solid ${importStatus.ok ? C.green : C.coral}30`, borderRadius: 12, padding: "12px 14px", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontSize: 14, color: importStatus.ok ? C.greenD : C.coralD, fontFamily: FONTS.body }}>{importStatus.ok ? "✓" : "⚠"} {importStatus.msg}</p>
        </div>
      )}

      <div style={{ background: C.bgSec, borderRadius: 14, padding: "1rem", marginBottom: "1rem" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: FONTS.title }}>État du contenu</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, fontFamily: FONTS.body }}>
          {content.courses.length} module{content.courses.length>1?"s":""}<br/>
          {content.quiz.length} question{content.quiz.length>1?"s":""} de quiz<br/>
          {content.exercises.length} exercice{content.exercises.length>1?"s":""}
        </div>
      </div>

      <button onClick={resetContent} style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bg, color: C.muted, fontSize: 13, cursor: "pointer", marginBottom: 10, fontFamily: FONTS.ui }}>
        Supprimer le contenu importé
      </button>
      <button onClick={resetProgress} style={{ width: "100%", padding: "13px", borderRadius: 12, border: `1px solid ${C.coral}50`, background: C.bg, color: C.coral, fontSize: 13, cursor: "pointer", fontFamily: FONTS.ui }}>
        Réinitialiser ma progression
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP — Layout fixe + safe area
// ═══════════════════════════════════════════════════════════════════════════
const TABS = [
  { id: "home", label: "Accueil" },
  { id: "courses", label: "Cours" },
  { id: "exercises", label: "Exercices" },
  { id: "quiz", label: "Quiz" },
  { id: "progress", label: "Progrès" },
];

export default function App() {
  const [state, setState] = useState(loadState);
  const [content, setContent] = useState(loadContent);
  const dispatch = useCallback((action) => setState(prev => reducer(prev, action)), []);
  const [screen, setScreen] = useState("home");
  const [toast, setToast] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

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
    else if (s === "practice") setScreen("practice");
  };

  const renderScreen = () => {
    if (showSettings) return <SettingsScreen state={state} dispatch={dispatch} content={content} onClose={() => setShowSettings(false)} onImported={reloadContent} />;
    switch (screen) {
      case "home": return <HomeScreen state={state} dispatch={dispatch} navigate={navigate} content={content} />;
      case "courses": return <CoursesScreen state={state} dispatch={dispatch} content={content} />;
      case "exercises": return <ExercisesScreen state={state} dispatch={dispatch} content={content} />;
      case "quiz": return <QuizScreen state={state} dispatch={dispatch} content={content} />;
      case "practice": return <PracticeScreen state={state} dispatch={dispatch} />;
      case "challenge": return <ChallengeScreen state={state} dispatch={dispatch} navigate={navigate} />;
      case "progress": return <ProgressScreen state={state} dispatch={dispatch} content={content} onOpenSettings={() => setShowSettings(true)} />;
      default: return <HomeScreen state={state} dispatch={dispatch} navigate={navigate} content={content} />;
    }
  };

  // Hauteur de la nav bar + safe area iPhone
  const NAV_HEIGHT = 64;

  return (
    <>
      {/* Style global : reset, safe area, fond */}
      <style>{`
        html, body, #root { margin: 0; padding: 0; background: ${C.bg}; }
        body { font-family: ${FONTS.ui}; color: ${C.text}; -webkit-tap-highlight-color: transparent; overscroll-behavior: none; }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input, textarea { font-family: inherit; }
      `}</style>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Conteneur principal */}
      <div style={{
        maxWidth: 440,
        margin: "0 auto",
        background: C.bg,
        minHeight: "100vh",
        position: "relative",
        paddingBottom: `calc(${NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        {renderScreen()}
      </div>

      {/* Barre de navigation FIXE */}
      {!showSettings && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: C.bg,
          borderTop: `1px solid ${C.border}`,
          zIndex: 100,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            maxWidth: 440,
            margin: "0 auto",
            display: "flex",
            height: NAV_HEIGHT,
          }}>
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
                  flex: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  color: active ? C.primary : C.muted,
                  padding: "8px 0",
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