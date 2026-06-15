// Groply — screens/QuizScreen.jsx
import { useState, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";

export let _FretboardQuizQuestion = null;
export const setFretboardQuizQuestion = (fn) => { _FretboardQuizQuestion = fn; };

// ── Données modules quiz ──────────────────────────────────────────────────────
const MODULES = [
  { id:"neck",    label:"Manche",   icon:"map-2",    color:C.amber,  colorL:C.amberL,  colorD:C.amberD,  border:C.amberBorder },
  { id:"scales",  label:"Gammes",   icon:"music",    color:C.green,  colorL:C.greenL,  colorD:C.greenD,  border:C.greenBorder },
  { id:"harmony", label:"Harmonie", icon:"stack-2",  color:C.purple, colorL:C.purpleL, colorD:C.purpleD, border:C.purpleBorder },
  { id:"rhythm",  label:"Rythme",   icon:"metronome",color:C.blue,   colorL:C.blueL,   colorD:C.blueD,   border:C.blueBorder },
  { id:"impro",   label:"Impro",    icon:"wand",     color:C.pink,   colorL:C.pinkL,   colorD:C.pinkD,   border:C.pinkBorder },
];

// ── QuizScreen ────────────────────────────────────────────────────────────────
function QuizScreen({ state, dispatch, content }) {
  const [mode, setMode] = useState(null);

  const totalAnswered = Object.keys(state.quizResults).length;
  const totalQ        = content.quiz.length;
  const pctDone       = totalQ ? Math.round(totalAnswered / totalQ * 100) : 0;
  const wrongCount    = state.wrongQuiz.length;

  const pools = {
    daily: () => {
      const wrong = content.quiz.filter(q => state.wrongQuiz.includes(q.id)).slice(0,3);
      const fresh = content.quiz.filter(q => !state.quizResults[q.id] && !state.wrongQuiz.includes(q.id)).sort(() => Math.random()-.5).slice(0,4);
      return [...wrong, ...fresh].slice(0,7);
    },
    review: () => content.quiz.filter(q => state.wrongQuiz.includes(q.id)),
  };
  MODULES.forEach(m => {
    pools[m.id] = () => content.quiz.filter(q => q.courseId===m.id).sort(() => Math.random()-.5).slice(0,7);
  });

  const launch = (id, label) => setMode({ id, label, pool: pools[id]() });

  if (mode) return (
    <QuizPlayer pool={mode.pool} title={mode.label} state={state} dispatch={dispatch} content={content} onDone={() => setMode(null)} />
  );

  return (
    <div>
      {/* ── EN-TÊTE ──────────────────────────────────────────────────────── */}
      <div style={{
        backgroundImage:"url('/ocean.jpg')",
        backgroundSize:"cover", backgroundPosition:"center 30%",
        padding:"24px 20px 20px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,60,80,.50)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Quiz</div>
        <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,.8)", marginTop:2, marginBottom:14 }}>
          {totalAnswered} / {totalQ} questions répondues
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{pctDone}% maîtrisé</span>
          {wrongCount > 0 && <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.85)" }}>{wrongCount} à réviser</span>}
        </div>
        <ProgressBar pct={pctDone} color={C.teal} h={7} />
        </div>
      </div>

      <div style={{ padding:"16px 20px 0" }}>

        {/* ── BLOC PRIORITAIRE : quiz du jour + révision ───────────────────── */}
        <div style={{ fontSize:11, fontWeight:700, color:C.text3, letterSpacing:".07em", textTransform:"uppercase", marginBottom:10 }}>
          Aujourd'hui
        </div>

        {/* Quiz du jour — carte hero */}
        <button onClick={() => launch("daily","Quiz du jour")} style={{
          width:"100%", background:`linear-gradient(135deg, ${C.primaryL}, #fff)`,
          border:`2px solid ${C.primaryBorder}`, borderRadius:R.xl,
          padding:16, cursor:"pointer", textAlign:"left",
          fontFamily:FONTS.title, marginBottom:10,
          display:"flex", gap:14, alignItems:"center",
        }}>
          <div style={{ width:52, height:52, borderRadius:R.lg, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 12px ${C.primaryBorder}` }}>
            <Ti name="star" size={24} color="#fff" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.primary, letterSpacing:".08em", textTransform:"uppercase", marginBottom:3 }}>
              Recommandé · 7 questions
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:"-.2px" }}>Quiz du jour</div>
            <div style={{ fontSize:12, color:C.text3, marginTop:2 }}>Adapté à ta progression · ~5 min</div>
          </div>
          <Ti name="arrow-right" size={18} color={C.primary} />
        </button>

        {/* Révision */}
        <button
          onClick={() => wrongCount > 0 && launch("review", `Révision (${wrongCount})`)}
          disabled={wrongCount === 0}
          style={{
            width:"100%",
            background: wrongCount > 0 ? `linear-gradient(135deg, ${C.pinkL}, #fff)` : C.surface2,
            border:`2px solid ${wrongCount > 0 ? C.pinkBorder : C.border}`,
            borderRadius:R.xl, padding:16,
            cursor: wrongCount > 0 ? "pointer" : "default",
            textAlign:"left", fontFamily:FONTS.title, marginBottom:24,
            display:"flex", gap:14, alignItems:"center",
            opacity: wrongCount === 0 ? 0.5 : 1,
          }}>
          <div style={{ width:52, height:52, borderRadius:R.lg, background: wrongCount > 0 ? C.pink : C.border, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <Ti name="refresh" size={24} color="#fff" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color: wrongCount > 0 ? C.pink : C.text3, letterSpacing:".08em", textTransform:"uppercase", marginBottom:3 }}>
              {wrongCount > 0 ? `${wrongCount} à revoir` : "Aucune question à réviser"}
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:"-.2px" }}>Révision intelligente</div>
            <div style={{ fontSize:12, color:C.text3, marginTop:2 }}>
              {wrongCount > 0 ? "Renforce tes points faibles · ~5 min" : "Tu es à jour !"}
            </div>
          </div>
          {wrongCount > 0 && <Ti name="arrow-right" size={18} color={C.pink} />}
        </button>

        {/* ── QUIZ PAR MODULE ──────────────────────────────────────────────── */}
        <div style={{ fontSize:11, fontWeight:700, color:C.text3, letterSpacing:".07em", textTransform:"uppercase", marginBottom:10 }}>
          Par module
        </div>

        {MODULES.map(m => {
          const total   = content.quiz.filter(q => q.courseId===m.id).length;
          const done    = content.quiz.filter(q => q.courseId===m.id && state.quizResults[q.id]).length;
          const wrong   = content.quiz.filter(q => q.courseId===m.id && state.wrongQuiz.includes(q.id)).length;
          const pct     = total ? Math.round(done/total*100) : 0;
          if (total === 0) return null;

          return (
            <button key={m.id} onClick={() => launch(m.id, m.label)} style={{
              width:"100%", background:C.surface, border:`1.5px solid ${C.border}`,
              borderRadius:R.lg, padding:"13px 16px",
              display:"flex", alignItems:"center", gap:12,
              cursor:"pointer", textAlign:"left",
              fontFamily:FONTS.title, marginBottom:8,
            }}>
              <div style={{ width:44, height:44, borderRadius:R.md, background:m.colorL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Ti name={m.icon} size={20} color={m.color} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:C.text }}>{m.label}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:m.color }}>{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={m.color} h={4} />
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <span style={{ fontSize:11, color:C.text3 }}>{done}/{total} répondues</span>
                  {wrong > 0 && <span style={{ fontSize:11, fontWeight:600, color:C.pink }}>{wrong} à revoir</span>}
                </div>
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

// ── QuizPlayer (logique 100% inchangée, layout retouché) ──────────────────────
function QuizPlayer({ pool, title, state, dispatch, content, onDone }) {
  const [questions] = useState(pool);
  const [idx, setIdx]   = useState(0);
  const [sel, setSel]   = useState(null);
  const [fretAnswered, setFretAnswered] = useState(false);
  const [fretCorrect,  setFretCorrect]  = useState(null);
  const [score, setScore]   = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return (
    <div style={{ padding:"32px 20px", textAlign:"center", color:C.text2, fontFamily:FONTS.title }}>
      Aucune question disponible.
      <br />
      <button onClick={onDone} style={{ marginTop:16, padding:"10px 20px", border:"none", borderRadius:R.sm, background:C.primary, color:"#fff", cursor:"pointer", fontFamily:FONTS.ui, fontSize:13, fontWeight:600 }}>Retour</button>
    </div>
  );

  const q = questions[idx];
  const isFretQ  = q.type === "fretboard";
  const answered = isFretQ ? fretAnswered : sel !== null;

  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const ok = i === q.a;
    if (ok) setScore(s => s+1);
    dispatch({ type:"QUIZ_ANSWER", id:q.id, correct:ok, xp:q.xp||30 });
    dispatch({ type:"MARK_STREAK" });
    dispatch({ type:"UPDATE_WEEKLY", field:"quizzes" });
  };

  const handleFretComplete = (result) => {
    const ok = result.complete;
    setFretAnswered(true); setFretCorrect(ok);
    if (ok) setScore(s => s+1);
    dispatch({ type:"QUIZ_ANSWER", id:q.id, correct:ok, xp:q.xp||40 });
    dispatch({ type:"MARK_STREAK" });
    dispatch({ type:"UPDATE_WEEKLY", field:"quizzes" });
  };

  const next = () => {
    if (idx+1 >= questions.length) {
      setFinished(true);
      dispatch({ type:"QUIZ_SESSION_DONE", id:title, title, xp:score*30, score:`${score}/${questions.length}` });
    } else {
      setSel(null); setFretAnswered(false); setFretCorrect(null);
      setIdx(i => i+1);
    }
  };

  if (finished) {
    const pct      = Math.round(score/questions.length*100);
    const isPerfect = score === questions.length;
    const isGood    = pct >= 60;
    const isReview  = /révision/i.test(title);       // session de rattrapage
    const redeemed  = isReview && isGood;            // questions ratées enfin réussies
    const pose      = redeemed ? "pride" : isPerfect ? "celebrate" : isGood ? "happy" : "think";
    const anim      = (redeemed || isPerfect) ? "cheer" : "pop";
    const heading   = redeemed ? "Tu as enfin réussi !" : isPerfect ? "Parfait !" : isGood ? "Très bien !" : "Continue !";
    const subtitle  = redeemed
      ? "Ces questions te résistaient — et tu les as eues. Gropi en a la larme à l'œil. 🥹"
      : isPerfect
      ? "Toutes les réponses correctes — Gropi est fier de toi. 🎸"
      : isGood
      ? "Bon travail ! Les questions ratées reviendront en révision."
      : "Pas de panique — les erreurs sont dans la révision intelligente.";
    const xpEarned  = score * 30;

    return (
      <div style={{ padding:"28px 20px 32px", display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
        {/* Gropi */}
        <Gropi pose={pose} size={(isPerfect||redeemed) ? 160 : 120} anim={anim}/>

        {/* Titre */}
        <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-.4px", marginTop:(isPerfect||redeemed)?6:10, textAlign:"center" }}>
          {heading}
        </div>
        <div style={{ fontSize:13, fontWeight:500, color:C.text2, marginTop:6, textAlign:"center", lineHeight:1.5, maxWidth:260 }}>
          {subtitle}
        </div>

        {/* Score */}
        <div style={{
          display:"flex", gap:16, margin:"18px 0 0",
          background:C.surface, border:`1.5px solid ${C.border}`,
          borderRadius:R.xl, padding:"14px 24px",
        }}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:C.green}}>{score}</div>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:".06em"}}>Correctes</div>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:C.text2}}>{questions.length-score}</div>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:".06em"}}>À revoir</div>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:C.primary}}>+{xpEarned}</div>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:".06em"}}>XP</div>
          </div>
        </div>

        {/* Barre de score */}
        <div style={{width:"100%",marginTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:11,color:C.text3}}>Score</span>
            <span style={{fontSize:11,fontWeight:700,color:C.text2}}>{pct}%</span>
          </div>
          <div style={{height:7,background:C.border,borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",borderRadius:99,transition:"width .5s ease",
              background:isPerfect?C.green:isGood?C.primary:C.pink}}/>
          </div>
        </div>

        <button onClick={onDone} style={{
          width:"100%", marginTop:20, padding:14, borderRadius:R.lg, border:"none",
          background:`linear-gradient(135deg,#FF9155,${C.primary})`,
          color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui,
          boxShadow:`0 4px 16px ${C.primary}44`,
        }}>
          Retour
        </button>
      </div>
    );
  }

  const linkedLesson = q.lessonId ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===q.lessonId) : null;
  const linkedCourse = q.courseId ? content.courses.find(c=>c.id===q.courseId) : null;

  return (
    <div style={{ padding:"14px 20px 0" }}>
      {/* Header barre progression + quitter */}
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
        <p style={{ margin:0, fontSize:15, fontWeight:600, lineHeight:1.55, color:C.text, fontFamily:FONTS.title }}>{q.q}</p>
      </div>

      {/* Fretboard ou QCM */}
      {isFretQ ? (
        <>
          {_FretboardQuizQuestion && <_FretboardQuizQuestion question={q} onComplete={handleFretComplete} answered={fretAnswered} />}
          {fretAnswered && (
            <>
              <FeedbackBox ok={fretCorrect} xp={q.xp||40} exp={q.exp} lesson={null} />
              <NextBtn onClick={next} last={idx+1>=questions.length} />
            </>
          )}
        </>
      ) : (
        <>
          {q.o.map((opt, i) => {
            let bg=C.surface, border=`1.5px solid ${C.border}`, col=C.text, badgeBg=C.surface2, badgeFg=C.text2, ic=["A","B","C","D"][i];
            if (answered) {
              if (i===q.a)   { bg=C.greenL; border=`1.5px solid ${C.green}`;  col=C.greenD;  badgeBg=C.greenBorder; badgeFg=C.greenD;  ic=<Ti name="check" size={12} color={C.greenD} />; }
              else if(i===sel){ bg=C.coralL;border=`1.5px solid ${C.coral}`;col=C.coralD;badgeBg=C.coralBorder;badgeFg=C.coralD;ic=<Ti name="x" size={12} color={C.coralD} />; }
            }
            return (
              <button key={i} onClick={()=>choose(i)} disabled={answered} style={{ display:"flex", alignItems:"center", gap:10, background:bg, border, borderRadius:R.md, padding:"12px 14px", cursor:answered?"default":"pointer", textAlign:"left", width:"100%", marginBottom:7, fontFamily:FONTS.title }}>
                <div style={{ width:26, height:26, borderRadius:8, background:badgeBg, color:badgeFg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{ic}</div>
                <span style={{ fontSize:13, color:col, lineHeight:1.45, fontWeight:answered&&i===q.a?700:500 }}>{opt}</span>
              </button>
            );
          })}
          {answered && (
            <>
              <FeedbackBox ok={sel===q.a} xp={q.xp||30} exp={q.exp||q.x} lesson={linkedLesson} />
              <NextBtn onClick={next} last={idx+1>=questions.length} />
            </>
          )}
        </>
      )}
      <div style={{ height:24 }} />
    </div>
  );
}

// ── Micro-composants ──────────────────────────────────────────────────────────
function FeedbackBox({ ok, xp, exp, lesson }) {
  return (
    <div style={{ background:ok?C.greenL:C.coralL, borderRadius:R.md, padding:"12px 14px", marginBottom:12, border:`1.5px solid ${ok?C.greenBorder:C.coralBorder}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
        <Ti name={ok?"check":"alert-circle"} size={14} color={ok?C.green:C.coral} />
        <div style={{ fontSize:12, fontWeight:700, color:ok?C.greenD:C.coralD }}>
          {ok ? `CORRECT · +${xp} XP` : "PAS TOUT À FAIT…"}
        </div>
      </div>
      <div style={{ fontSize:12, color:ok?C.greenD:C.coralD, lineHeight:1.55 }}>{exp}</div>
      {lesson && <div style={{ fontSize:11, color:C.primary, marginTop:6 }}>Pour approfondir : <em>{lesson.title}</em></div>}
    </div>
  );
}

function NextBtn({ onClick, last }) {
  return (
    <button onClick={onClick} style={{ width:"100%", padding:14, borderRadius:R.lg, border:"none", background:C.primary, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui }}>
      {last ? "Voir les résultats" : "Suivant →"}
    </button>
  );
}

export { QuizScreen, QuizPlayer };
