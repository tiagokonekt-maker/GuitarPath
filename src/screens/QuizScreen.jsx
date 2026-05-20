// GuitarPath — screens/QuizScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { BADGE_TINTS } from "../store/badges.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";

// Lazy ref injectée par App.jsx
export let _FretboardQuizQuestion = null;
export const setFretboardQuizQuestion = (fn) => { _FretboardQuizQuestion = fn; };

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
  const [fretAnswered, setFretAnswered] = useState(false);
  const [fretCorrect, setFretCorrect] = useState(null);
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
  const isFretQuestion = q.type === "fretboard";
  const answered = isFretQuestion ? fretAnswered : sel !== null;

  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const ok = i === q.a;
    if (ok) setScore(s => s + 1);
    dispatch({ type: "QUIZ_ANSWER", id: q.id, correct: ok, xp: q.xp || 30 });
    dispatch({ type: "MARK_STREAK" });
    dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
  };

  const handleFretComplete = (result) => {
    const ok = result.complete;
    setFretAnswered(true);
    setFretCorrect(ok);
    if (ok) setScore(s => s + 1);
    dispatch({ type: "QUIZ_ANSWER", id: q.id, correct: ok, xp: q.xp || 40 });
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
      setFretAnswered(false);
      setFretCorrect(null);
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
        {isFretQuestion && <span style={{ marginLeft: 6, color: C.amber, fontWeight: 700 }}>· MANCHE</span>}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 16, marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, lineHeight: 1.5, color: C.text, fontFamily: FONTS.title }}>{q.q}</p>
      </div>

      {/* ── Question fretboard interactive ── */}
      {isFretQuestion ? (
        <>
          {_FretboardQuizQuestion && <_FretboardQuizQuestion
            question={q}
            onComplete={handleFretComplete}
            answered={fretAnswered}
          />}
          {fretAnswered && (
            <>
              <div style={{
                background: fretCorrect ? C.greenL : C.coralL,
                borderRadius: R.md, padding: "12px 14px", marginTop: 8, marginBottom: 12,
                border: `1px solid ${fretCorrect ? C.greenBorder : C.coralBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Ti name={fretCorrect ? "check" : "alert-circle"} size={14} color={fretCorrect ? C.green : C.coral} />
                  <div style={{ fontSize: 12, fontWeight: 500, color: fretCorrect ? C.greenD : C.coralD, fontFamily: FONTS.ui }}>
                    {fretCorrect ? `CORRECT · +${q.xp || 40} XP` : "PAS TOUT À FAIT…"}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: fretCorrect ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }}>{q.exp}</div>
              </div>
              <button onClick={next} style={{
                width: "100%", padding: "14px", borderRadius: R.md, border: "none",
                background: C.primary, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.ui,
              }}>{idx + 1 >= questions.length ? "Voir les résultats" : "Suivant →"}</button>
            </>
          )}
        </>
      ) : (
        /* ── Question QCM classique ── */
        <>
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
        </>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRACTICE LIBRE
// ═══════════════════════════════════════════════════════════════════════════

export { QuizScreen, QuizPlayer };
