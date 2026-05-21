// GuitarPath — store/state.js
// État initial, persistance localStorage + merge contenu

export const STATE_KEY = "guitarpath_v4_state";
export const CONTENT_KEY = "guitarpath_v3_content";

export const defaultState = () => ({
  xp: 0, level: 1, streak: 0, lastSessionDate: "",
  completedExercises: {}, exerciseProgress: {},
  quizResults: {}, wrongQuiz: [],
  completedLessons: {},
  reviewHistory: {},
  dailyChallengeIdx: 0, dailyChallengeDone: false, dailyChallengeDate: "",
  dailyChallengeCount: 0,
  unlockedBadges: [],
  weeklyGoals: { sessions: 0, exercises: 0, quizzes: 0, week: "" },
  practiceLibre: { count: 0, totalMinutes: 0 },
  sessionHistory: [],
});

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) {
      const v3 = localStorage.getItem("guitarpath_v3_state");
      if (v3) return { ...defaultState(), ...JSON.parse(v3) };
      return defaultState();
    }
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch { return defaultState(); }
};

export const saveState = (s) => {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch {}
};

export const todayStr = () => new Date().toISOString().split("T")[0];
export const weekStr = () => {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
};

// ── Merge helpers ──────────────────────────────────────────────────────────
export const mergeById = (defaults, imported) => {
  const map = new Map(defaults.map(item => [item.id, item]));
  imported.forEach(item => map.set(item.id, item));
  return Array.from(map.values());
};

export const mergeCourses = (defaults, imported) => {
  const map = new Map(defaults.map(c => [c.id, c]));
  imported.forEach(c => {
    if (map.has(c.id)) {
      const existing = map.get(c.id);
      const lessonMap = new Map((c.lessons || []).map(l => [l.id, l]));
      existing.lessons.forEach(l => lessonMap.set(l.id, l));
      map.set(c.id, { ...c, ...existing, lessons: Array.from(lessonMap.values()) });
    } else {
      map.set(c.id, c);
    }
  });
  return Array.from(map.values());
};

export const loadContent = (defaults, CONTENT_KEY_PARAM) => {
  const key = CONTENT_KEY_PARAM || CONTENT_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults;
    const imported = JSON.parse(raw);
    return {
      courses:   mergeCourses(defaults.courses,   imported.courses   || []),
      quiz:      mergeById(defaults.quiz,          imported.quiz      || []),
      exercises: mergeById(defaults.exercises,     imported.exercises || []),
    };
  } catch { return defaults; }
};
