// GuitarPath — screens/CoursesScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";

// Lazy refs injectées par App.jsx
export let _renderDiagramBlock = null;
export let _FretboardLesson = null;
export const setDiagramRenderer = (fn) => { _renderDiagramBlock = fn; };
export const setFretboardLesson = (fn) => { _FretboardLesson = fn; };

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
          const diagram = _renderDiagramBlock ? _renderDiagramBlock(b, i) : null;
          if (diagram) return diagram;
          // ── Manche interactif
          if (b.type === "fretboard_interactive" && _FretboardLesson) return (
            <div key={i} style={{ marginBottom: 0 }}>
              <_FretboardLesson block={b} />
            </div>
          );
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

export { CoursesScreen, CourseDetail, LessonView };
