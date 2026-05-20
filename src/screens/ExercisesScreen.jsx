// GuitarPath — screens/ExercisesScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";

// Lazy ref injectée par App.jsx
export let _FretboardExercise = null;
export const setFretboardExercise = (fn) => { _FretboardExercise = fn; };

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
  const theme = MODULE_THEME[ex.mod] || MODULE_THEME.neck;

  // ── Exercice fretboard interactif (type: "fretboard_exercise") ───────────
  if (ex.type === "fretboard_exercise") {
    const finishFretboard = ({ totalXp }) => {
      dispatch({ type: "COMPLETE_EXERCISE", id: ex.id, title: ex.title, xp: totalXp || ex.xp });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "exercises" });
    };
    const linkedLesson = ex.courseLink ? content.courses.flatMap(c => c.lessons).find(l => l.id === ex.courseLink) : null;
    return (
      <div style={{ padding: "14px 16px 0" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, fontSize: 13, padding: "0 0 12px", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 4 }}>
          <Ti name="chevron-left" size={16} /> RETOUR
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: theme.colorL, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="guitar-pick" size={20} color={theme.color} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FONTS.ui }}>
              {ex.mod} · {ex.dur} MIN · MANCHE INTERACTIF
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2, fontFamily: FONTS.title, color: C.text }}>{ex.title}</div>
          </div>
        </div>
        {linkedLesson && (
          <div style={{ background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: 11, padding: "9px 13px", marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <Ti name="book-2" size={14} color={C.primary} />
            <div style={{ fontSize: 12, color: C.primaryD, fontFamily: FONTS.title }}>Lié à : <strong>{linkedLesson.title}</strong></div>
          </div>
        )}
        {_FretboardExercise && <_FretboardExercise
          ex={ex}
          onComplete={finishFretboard}
          dispatch={dispatch}
        />}
        {ex.tip && (
          <div style={{ background: C.amberL, borderRadius: 11, padding: "10px 13px", marginTop: 12, marginBottom: 12, border: `1px solid ${C.amberBorder}`, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Ti name="bulb" size={15} color={C.amber} style={{ marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 13, color: C.amberD, lineHeight: 1.55, fontFamily: FONTS.title }}>{ex.tip}</p>
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>
    );
  }

  // ── Exercice classique (steps à cocher) ──────────────────────────────────
  const allDone = checked.length === (ex.steps || []).length;

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

export { ExercisesScreen, ExerciseDetail };
