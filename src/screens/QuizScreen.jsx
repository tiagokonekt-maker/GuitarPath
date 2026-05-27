// GuitarPath — screens/QuizScreen.jsx
import { useState, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { BADGE_TINTS } from "../store/badges.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";

// Lazy ref injectée par App.jsx
export let _FretboardQuizQuestion = null;
export const setFretboardQuizQuestion = (fn) => { _FretboardQuizQuestion = fn; };

// ── Liste des modes de quiz ──────────────────────────────────────────────────
function QuizScreen({ state, dispatch, content }) {
  const [mode, setMode] = useState(null);

  const modes = [
    {
      id:"daily", label:"Quiz du jour", desc:"7 questions adaptées",
      icon:"star", tint:"primary",
      pool:() => {
        const wrong = content.quiz.filter(q => state.wrongQuiz.includes(q.id)).slice(0,3);
        const fresh = content.quiz.filter(q => !state.quizResults[q.id] && !state.wrongQuiz.includes(q.id)).sort(() => Math.random()-.5).slice(0,4);
        return [...wrong, ...fresh].slice(0,7);
      },
    },
    {
      id:"review", label:`Révisions (${state.wrongQuiz.length})`, desc:"Questions ratées à reprendre",
      icon:"refresh", tint:"coral",
      pool:() => content.quiz.filter(q => state.wrongQuiz.includes(q.id)),
      disabled: state.wrongQuiz.length === 0,
    },
    {
      id:"neck",    label:"Manche & visualisation",
      desc:`${content.quiz.filter(q=>q.courseId==="neck").length} questions`,
      icon:"map-2", tint:"amber",
      pool:() => content.quiz.filter(q=>q.courseId==="neck").sort(()=>Math.random()-.5).slice(0,7),
    },
    {
      id:"scales",  label:"Gammes & modes",
      desc:`${content.quiz.filter(q=>q.courseId==="scales").length} questions`,
      icon:"music", tint:"green",
      pool:() => content.quiz.filter(q=>q.courseId==="scales").sort(()=>Math.random()-.5).slice(0,7),
    },
    {
      id:"harmony", label:"Harmonie",
      desc:`${content.quiz.filter(q=>q.courseId==="harmony").length} questions`,
      icon:"stack-2", tint:"primary",
      pool:() => content.quiz.filter(q=>q.courseId==="harmony").sort(()=>Math.random()-.5).slice(0,7),
    },
    {
      id:"rhythm",  label:"Rythme",
      desc:`${content.quiz.filter(q=>q.courseId==="rhythm").length} questions`,
      icon:"metronome", tint:"coral",
      pool:() => content.quiz.filter(q=>q.courseId==="rhythm").sort(()=>Math.random()-.5).slice(0,7),
    },
  ];

  if (mode) return (
    <QuizPlayer pool={mode.pool()} title={mode.label} state={state} dispatch={dispatch} content={content} onDone={() => setMode(null)} />
  );

  return (
    <div>
      {/* En-tête */}
      <div style={{ background:"linear-gradient(150deg,#DFFFFF,#CCFAF0)", padding:"24px 20px 18px" }}>
        <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-.4px" }}>Quiz</div>
        <div style={{ fontSize:13, fontWeight:500, color:"#3A9B7A", marginTop:2 }}>
          {Object.keys(state.quizResults).length} répondues · {content.quiz.length} totales · {state.wrongQuiz.length} à réviser
        </div>
      </div>

      <div style={{ padding:"14px 20px 0" }}>
        {modes.map(m => {
          const tint = BADGE_TINTS[m.tint];
          return (
            <button key={m.id} onClick={() => !m.disabled && setMode(m)} disabled={m.disabled} style={{
              background:C.surface, border:`1.5px solid ${C.border}`,
              borderRadius:R.lg, padding:"13px 16px",
              display:"flex", alignItems:"center", gap:12,
              cursor: m.disabled ? "default" : "pointer",
              textAlign:"left", width:"100%",
              opacity: m.disabled ? 0.4 : 1, marginBottom:8,
              fontFamily:FONTS.title,
            }}>
              <div style={{ width:44, height:44, borderRadius:R.md, background:tint.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ti name={m.icon} size={20} color={tint.icon} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, letterSpacing:"-.1px" }}>{m.label}</div>
                <div style={{ fontSize:11, fontWeight:500, color:C.text3, marginTop:2 }}>{m.desc}</div>
              </div>
              <Ti name="chevron-right" size={15} color={C.text3} />
            </button>
          );
        })}
        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

// ── Lecteur de quiz (logique inchangée, layout retouché) ─────────────────────
function QuizPlayer({ pool, title, state, dispatch, content, onDone }) {
  const [questions]      = useState(pool);
  const [idx, setIdx]    = useState(0);
  const [sel, setSel]    = useState(null);
  const [fretAnswered, setFretAnswered] = useState(false);
  const [fretCorrect,  setFretCorrect]  = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return (
    <div style={{ padding:"32px 20px", textAlign:"center", color:C.text2 }}>
      Aucune question disponible.
      <br />
      <button onClick={onDone} style={{ marginTop:16, padding:"10px 20px", border:"none", borderRadius:R.sm, background:C.primary, color:"#fff", cursor:"pointer", fontFamily:FONTS.ui, fontSize:13, fontWeight:600 }}>Retour</button>
    </div>
  );

  const q             = questions[idx];
  const isFretQ       = q.type === "fretboard";
  const answered      = isFretQ ? fretAnswered : sel !== null;

  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const ok = i === q.a;
    if (ok) setScore(s => s + 1);
    dispatch({ type:"QUIZ_ANSWER", id:q.id, correct:ok, xp:q.xp||30 });
    dispatch({ type:"MARK_STREAK" });
    dispatch({ type:"UPDATE_WEEKLY", field:"quizzes" });
  };

  const handleFretComplete = (result) => {
    const ok = result.complete;
    setFretAnswered(true); setFretCorrect(ok);
    if (ok) setScore(s => s + 1);
    dispatch({ type:"QUIZ_ANSWER", id:q.id, correct:ok, xp:q.xp||40 });
    dispatch({ type:"MARK_STREAK" });
    dispatch({ type:"UPDATE_WEEKLY", field:"quizzes" });
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setFinished(true);
      dispatch({ type:"QUIZ_SESSION_DONE", id:title, title, xp:score*30, score:`${score}/${questions.length}` });
    } else {
      setSel(null); setFretAnswered(false); setFretCorrect(null);
      setIdx(i => i + 1);
    }
  };

  if (finished) {
    const pct    = Math.round(score / questions.length * 100);
    const trophy = score === questions.length ? "trophy" : score >= 5 ? "confetti" : "barbell";
    return (
      <div style={{ padding:"32px 20px", textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:R.xl, background:C.primaryL, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
          <Ti name={trophy} size={36} color={C.primary} />
        </div>
        <div style={{ fontSize:24, fontWeight:800, color:C.text, letterSpacing:"-.4px", marginBottom:6 }}>
          {score === questions.length ? "Parfait !" : score >= 5 ? "Très bien !" : "Continue !"}
        </div>
        <div style={{ fontSize:15, fontWeight:600, color:C.primary, marginBottom:24 }}>
          {score}/{questions.length} · {pct}%
        </div>
        <button onClick={onDone} style={{ width:"100%", padding:14, borderRadius:R.lg, border:"none", background:C.primary, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui }}>
          Retour
        </button>
      </div>
    );
  }

  const linkedLesson = q.lessonId ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===q.lessonId) : null;
  const linkedCourse = q.courseId ? content.courses.find(c=>c.id===q.courseId) : null;

  return (
    <div style={{ padding:"14px 20px 0" }}>
      {/* Header barre + quitter */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <button onClick={onDone} style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.sm, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
          <Ti name="x" size={16} color={C.text2} />
        </button>
        <div style={{ flex:1, display:"flex", gap:4 }}>
          {questions.map((_,i) => (
            <div key={i} style={{ height:4, flex:1, borderRadius:2, background: i<idx ? C.green : i===idx ? C.primary : C.border, transition:"background .2s" }} />
          ))}
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:C.text3, flexShrink:0 }}>{idx+1}/{questions.length}</span>
      </div>

      {/* Meta */}
      <div style={{ fontSize:10, color:C.text3, marginBottom:8, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600 }}>
        {linkedCourse?.title} · Niv. {q.lvl}
        {isFretQ && <span style={{ marginLeft:6, color:C.amber, fontWeight:700 }}>· Manche</span>}
      </div>

      {/* Question */}
      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:16, marginBottom:10 }}>
        <p style={{ margin:0, fontSize:15, fontWeight:600, lineHeight:1.55, color:C.text }}>{q.q}</p>
      </div>

      {/* Fretboard ou QCM */}
      {isFretQ ? (
        <>
          {_FretboardQuizQuestion && <_FretboardQuizQuestion question={q} onComplete={handleFretComplete} answered={fretAnswered} />}
          {fretAnswered && (
            <>
              <div style={{ background:fretCorrect?C.greenL:C.coralL, borderRadius:R.md, padding:"12px 14px", marginTop:8, marginBottom:12, border:`1.5px solid ${fretCorrect?C.greenBorder:C.coralBorder}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <Ti name={fretCorrect?"check":"alert-circle"} size={14} color={fretCorrect?C.green:C.coral} />
                  <div style={{ fontSize:12, fontWeight:700, color:fretCorrect?C.greenD:C.coralD }}>
                    {fretCorrect ? `CORRECT · +${q.xp||40} XP` : "PAS TOUT À FAIT…"}
                  </div>
                </div>
                <div style={{ fontSize:12, color:fretCorrect?C.greenD:C.coralD, lineHeight:1.55 }}>{q.exp}</div>
              </div>
              <button onClick={next} style={{ width:"100%", padding:14, borderRadius:R.lg, border:"none", background:C.primary, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui }}>
                {idx+1>=questions.length?"Voir les résultats":"Suivant →"}
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {q.o.map((opt, i) => {
            let bg=C.surface, border=`1.5px solid ${C.border}`, col=C.text, badgeBg=C.surface2, badgeFg=C.text2, ic=["A","B","C","D"][i];
            if (answered) {
              if (i===q.a)  { bg=C.greenL; border=`1.5px solid ${C.green}`;  col=C.greenD;  badgeBg=C.greenBorder;  badgeFg=C.greenD;  ic=<Ti name="check" size={12} color={C.greenD} />; }
              else if(i===sel){ bg=C.coralL;border=`1.5px solid ${C.coral}`;col=C.coralD;badgeBg=C.coralBorder;badgeFg=C.coralD;ic=<Ti name="x" size={12} color={C.coralD} />; }
            }
            return (
              <button key={i} onClick={()=>choose(i)} disabled={answered} style={{
                display:"flex", alignItems:"center", gap:10,
                background:bg, border, borderRadius:R.md,
                padding:"12px 14px", cursor:answered?"default":"pointer",
                textAlign:"left", width:"100%", marginBottom:7,
              }}>
                <div style={{ width:26, height:26, borderRadius:8, background:badgeBg, color:badgeFg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{ic}</div>
                <span style={{ fontSize:13, color:col, lineHeight:1.45, fontWeight:answered&&i===q.a?700:500 }}>{opt}</span>
              </button>
            );
          })}

          {answered && (
            <>
              <div style={{ background:sel===q.a?C.greenL:C.coralL, borderRadius:R.md, padding:"12px 14px", marginTop:4, marginBottom:12, border:`1.5px solid ${sel===q.a?C.greenBorder:C.coralBorder}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                  <Ti name={sel===q.a?"check":"alert-circle"} size={14} color={sel===q.a?C.green:C.coral} />
                  <div style={{ fontSize:12, fontWeight:700, color:sel===q.a?C.greenD:C.coralD }}>
                    {sel===q.a?`CORRECT · +${q.xp||30} XP`:"PAS TOUT À FAIT…"}
                  </div>
                </div>
                <div style={{ fontSize:12, color:sel===q.a?C.greenD:C.coralD, lineHeight:1.55 }}>{q.exp||q.x}</div>
                {linkedLesson && <div style={{ fontSize:11, color:C.primary, marginTop:6 }}>Pour approfondir : <em>{linkedLesson.title}</em></div>}
              </div>
              <button onClick={next} style={{ width:"100%", padding:14, borderRadius:R.lg, border:"none", background:C.primary, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui }}>
                {idx+1>=questions.length?"Voir les résultats":"Suivant →"}
              </button>
            </>
          )}
        </>
      )}
      <div style={{ height:24 }} />
    </div>
  );
}

export { QuizScreen, QuizPlayer };
