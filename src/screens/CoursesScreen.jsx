// GuitarPath — screens/CoursesScreen.jsx
import { useState, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";

// Lazy refs injectées par App.jsx
export let _renderDiagramBlock = null;
export let _FretboardLesson = null;
export const setDiagramRenderer = (fn) => { _renderDiagramBlock = fn; };
export const setFretboardLesson  = (fn) => { _FretboardLesson = fn; };

// ── Barre de retour ──────────────────────────────────────────────────────────
function BackBar({ onBack, label = "Retour" }) {
  return (
    <div style={{
      padding:"14px 20px 0", display:"flex", alignItems:"center", gap:10,
    }}>
      <button onClick={onBack} style={{
        background:C.surface, border:`1.5px solid ${C.border}`,
        borderRadius:R.sm, width:36, height:36,
        display:"flex", alignItems:"center", justifyContent:"center",
        cursor:"pointer",
      }}>
        <Ti name="arrow-left" size={17} color={C.text} />
      </button>
      <span style={{ fontSize:13, fontWeight:600, color:C.text2, fontFamily:FONTS.ui }}>{label}</span>
    </div>
  );
}

// ── Liste des modules ────────────────────────────────────────────────────────
function CoursesScreen({ state, dispatch, content }) {
  const [active, setActive]           = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  if (activeLesson) return (
    <LessonView lesson={activeLesson} state={state} dispatch={dispatch} onBack={() => setActiveLesson(null)} />
  );
  if (active) return (
    <CourseDetail course={active} state={state} onBack={() => setActive(null)} onSelectLesson={setActiveLesson} />
  );

  const totalLessons = content.courses.reduce((a, c) => a + c.lessons.length, 0);

  return (
    <div>
      {/* En-tête coloré */}
      <div style={{
        background:"linear-gradient(150deg, #F2EEFF, #E8E0FF)",
        padding:"24px 20px 18px",
      }}>
        <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-.4px" }}>Cours</div>
        <div style={{ fontSize:13, fontWeight:500, color:"#8B83B0", marginTop:2 }}>
          {content.courses.length} modules · {totalLessons} leçons
        </div>
      </div>

      <div style={{ padding:"14px 20px 0" }}>
        {content.courses.map(c => {
          const total = c.lessons.length;
          const done  = c.lessons.filter(l => state.completedLessons[l.id]).length;
          const pct   = total > 0 ? Math.round(done / total * 100) : 0;
          const th    = MODULE_THEME[c.id] || { icon:"ti-book-2", color:C.primary, colorL:C.primaryL, colorD:C.primaryD };

          return (
            <button key={c.id} onClick={() => setActive(c)} style={{
              width:"100%", border:"none", cursor:"pointer",
              textAlign:"left", fontFamily:FONTS.title,
              borderRadius:R.xl, padding:"16px 18px",
              marginBottom:10, position:"relative", overflow:"hidden",
              // fond teinté propre à chaque module
              background: th.colorL,
            }}>
              {/* blob déco */}
              <div style={{
                position:"absolute", right:-20, top:-20,
                width:80, height:80, borderRadius:"50%",
                background:th.color, opacity:.15, pointerEvents:"none",
              }} />

              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10, position:"relative", zIndex:1 }}>
                <div style={{
                  width:44, height:44, borderRadius:R.md,
                  background:"rgba(255,255,255,.6)",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                }}>
                  <Ti name={th.icon.replace("ti-","")} size={20} color={th.color} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:th.colorD, letterSpacing:"-.2px" }}>{c.title}</div>
                  <div style={{ fontSize:11, fontWeight:500, color:th.colorD, opacity:.7, marginTop:1 }}>{c.desc}</div>
                </div>
                <Ti name="chevron-right" size={16} color={th.color} style={{ opacity:.6 }} />
              </div>

              {/* progress */}
              <div style={{ position:"relative", zIndex:1 }}>
                <ProgressBar pct={pct} color={th.color} h={4} />
                <div style={{ fontSize:11, fontWeight:700, color:th.colorD, marginTop:5 }}>
                  {done} / {total} leçons · {pct}%
                </div>
              </div>
            </button>
          );
        })}
        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

// ── Détail d'un module ───────────────────────────────────────────────────────
function CourseDetail({ course, state, onBack, onSelectLesson }) {
  const th = MODULE_THEME[course.id] || { icon:"ti-book-2", color:C.primary, colorL:C.primaryL, colorD:C.primaryD };
  return (
    <div>
      <div style={{ background:th.colorL, padding:"22px 20px 18px" }}>
        <button onClick={onBack} style={{
          background:"rgba(255,255,255,.6)", border:"none",
          borderRadius:R.sm, width:36, height:36,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", marginBottom:14,
        }}>
          <Ti name="arrow-left" size={17} color={th.colorD} />
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:R.md, background:"rgba(255,255,255,.6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ti name={th.icon.replace("ti-","")} size={22} color={th.color} />
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:th.colorD, letterSpacing:"-.3px" }}>{course.title}</div>
            <div style={{ fontSize:12, fontWeight:500, color:th.colorD, opacity:.7, marginTop:2 }}>{course.lessons.length} leçons</div>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 20px 0" }}>
        {course.lessons.map((l, i) => {
          const done = !!state.completedLessons[l.id];
          return (
            <button key={l.id} onClick={() => onSelectLesson(l)} style={{
              background:C.surface,
              border:`1.5px solid ${done ? th.color + "50" : C.border}`,
              borderRadius:R.lg, padding:"12px 16px",
              display:"flex", alignItems:"center", gap:12,
              cursor:"pointer", textAlign:"left", width:"100%",
              marginBottom:8, fontFamily:FONTS.title,
            }}>
              <div style={{
                width:32, height:32, borderRadius:"50%",
                background: done ? th.colorL : C.surface2,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, fontWeight:700,
                color: done ? th.color : C.text3, flexShrink:0,
              }}>
                {done ? <Ti name="check" size={14} color={th.color} /> : (i + 1)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{l.title}</div>
                <div style={{ fontSize:11, color:C.text3, marginTop:2 }}>
                  {l.duration} min · {(l.quiz || []).length} quiz
                </div>
              </div>
              <Ti name="chevron-right" size={14} color={C.text3} />
            </button>
          );
        })}
        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

// ── Contenu d'une leçon ──────────────────────────────────────────────────────
function LessonView({ lesson, state, dispatch, onBack }) {
  const [done, setDone] = useState(!!state.completedLessons[lesson.id]);
  const [pop,  setPop]  = useState(false);

  const finish = () => {
    if (!done) {
      setPop(true);
      setTimeout(() => {
        setPop(false);
        dispatch({ type:"COMPLETE_LESSON", id:lesson.id, title:lesson.title });
        dispatch({ type:"MARK_STREAK" });
        dispatch({ type:"UPDATE_WEEKLY", field:"sessions" });
        setDone(true);
      }, 1000);
    }
  };

  return (
    <div>
      {pop && <XPPop amount={30} onDone={() => {}} />}
      <BackBar onBack={onBack} label="Retour au module" />

      <div style={{ padding:"16px 20px 0" }}>
        <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, lineHeight:1.25, letterSpacing:"-.3px", color:C.text }}>{lesson.title}</h1>
        <p style={{ fontSize:11, color:C.text3, margin:"0 0 20px", letterSpacing:".05em", textTransform:"uppercase", fontWeight:600 }}>
          {lesson.duration} MIN · {(lesson.quiz || []).length} QUESTIONS
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
          {lesson.content.map((b, i) => {
            if (b.type === "h") return (
              <h3 key={i} style={{ margin:"8px 0 0", fontSize:17, fontWeight:800, color:C.primary, letterSpacing:"-.2px" }}>{b.text}</h3>
            );
            if (b.type === "tip") return (
              <div key={i} style={{ background:C.amberL, border:`1.5px solid ${C.amberBorder}`, borderRadius:R.md, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
                <Ti name="bulb" size={16} color={C.amber} />
                <p style={{ margin:0, fontSize:13, color:C.amberD, lineHeight:1.65, fontFamily:FONTS.title }}>{b.text}</p>
              </div>
            );
            if (b.type === "img") return (
              <div key={i} style={{ background:C.surface2, borderRadius:R.md, padding:12, textAlign:"center" }}>
                <img src={b.src} alt={b.alt||""} style={{ maxWidth:"100%", borderRadius:8 }} />
                {b.caption && <p style={{ fontSize:12, color:C.text3, marginTop:8, fontStyle:"italic" }}>{b.caption}</p>}
              </div>
            );
            if (b.type === "ref") return (
              <div key={i} style={{ background:C.primaryL, border:`1.5px solid ${C.primaryBorder}`, borderRadius:R.md, padding:"12px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
                <Ti name="music" size={16} color={C.primary} />
                <p style={{ margin:0, fontSize:13, color:C.primaryD, lineHeight:1.55 }}>
                  <strong>Référence :</strong> {b.text}
                </p>
              </div>
            );
            const diagram = _renderDiagramBlock ? _renderDiagramBlock(b, i) : null;
            if (diagram) return diagram;
            if (b.type === "fretboard_interactive" && _FretboardLesson) return (
              <div key={i}><_FretboardLesson block={b} /></div>
            );
            return <p key={i} style={{ margin:0, fontSize:15, lineHeight:1.7, color:C.text }}>{b.text}</p>;
          })}
        </div>

        {(lesson.quiz || []).length > 0 && (
          <div style={{ background:C.primaryL, border:`1.5px solid ${C.primaryBorder}`, borderRadius:R.md, padding:"11px 14px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
            <Ti name="notebook" size={16} color={C.primary} />
            <p style={{ margin:0, fontSize:12, color:C.primaryD }}>
              Cette leçon est associée à {(lesson.quiz||[]).length} question{(lesson.quiz||[]).length>1?"s":""} de quiz.
            </p>
          </div>
        )}

        <button onClick={finish} disabled={done} style={{
          width:"100%", padding:14, borderRadius:R.lg, border:"none",
          background: done ? C.greenL : C.primary,
          color: done ? C.greenD : "#fff",
          fontSize:14, fontWeight:700,
          cursor: done ? "default" : "pointer",
          fontFamily:FONTS.ui, letterSpacing:".01em",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        }}>
          {done
            ? <><Ti name="check" size={16} color={C.greenD} /> Leçon complétée</>
            : <>Terminer la leçon · +30 XP</>
          }
        </button>
        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

export { CoursesScreen, CourseDetail, LessonView };
