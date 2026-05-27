// GuitarPath — screens/ExercisesScreen.jsx
import { useState, useEffect } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";

// Lazy ref injectée par App.jsx
export let _FretboardExercise = null;
export const setFretboardExercise = (fn) => { _FretboardExercise = fn; };

// ── Liste des exercices ──────────────────────────────────────────────────────
function ExercisesScreen({ state, dispatch, content }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);

  const cats = [
    { id:"all",     label:"Tous" },
    { id:"neck",    label:"Manche" },
    { id:"scales",  label:"Gammes" },
    { id:"harmony", label:"Harmonie" },
    { id:"rhythm",  label:"Rythme" },
    { id:"impro",   label:"Impro" },
  ];
  const filtered = content.exercises.filter(e => filter === "all" || e.mod === filter);

  if (active) return (
    <ExerciseDetail ex={active} state={state} dispatch={dispatch} onBack={() => setActive(null)} content={content} />
  );

  return (
    <div>
      {/* En-tête */}
      <div style={{ background:"linear-gradient(150deg,#FFF8ED,#FFF0D9)", padding:"24px 20px 18px" }}>
        <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-.4px" }}>Exercices</div>
        <div style={{ fontSize:13, fontWeight:500, color:C.amberD, opacity:.8, marginTop:2 }}>
          {content.exercises.length} exercices disponibles
        </div>
      </div>

      {/* Filtres — tag pills sans scrollbar visible */}
      <div style={{ display:"flex", gap:6, padding:"12px 20px", overflowX:"auto" }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{
            padding:"7px 14px", borderRadius:99,
            border:`1.5px solid ${filter===c.id ? C.primary : C.border}`,
            background: filter===c.id ? C.primary : C.surface,
            color: filter===c.id ? "#fff" : C.text2,
            fontSize:12, fontWeight:600, cursor:"pointer",
            whiteSpace:"nowrap", flexShrink:0, fontFamily:FONTS.ui,
          }}>{c.label}</button>
        ))}
      </div>

      <div style={{ padding:"0 20px" }}>
        {filtered.map(ex => {
          const done       = !!state.completedExercises[ex.id];
          const inProgress = state.exerciseProgress[ex.id]?.length > 0;
          const th         = MODULE_THEME[ex.mod] || MODULE_THEME.neck;
          return (
            <button key={ex.id} onClick={() => setActive(ex)} style={{
              background:C.surface, border:`1.5px solid ${C.border}`,
              borderRadius:R.lg, padding:"13px 16px",
              display:"flex", alignItems:"center", gap:12,
              cursor:"pointer", textAlign:"left", width:"100%", marginBottom:8,
            }}>
              <div style={{
                width:44, height:44, borderRadius:R.md, flexShrink:0,
                background: done ? C.greenL : inProgress ? C.amberL : th.colorL,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {done
                  ? <Ti name="check"         size={20} color={C.green} />
                  : inProgress
                    ? <Ti name="player-pause" size={20} color={C.amber} />
                    : <Ti name="guitar-pick"  size={20} color={th.color} />
                }
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, letterSpacing:"-.1px" }}>{ex.title}</div>
                <div style={{ display:"flex", gap:8, marginTop:3, flexWrap:"wrap", alignItems:"center" }}>
                  <span style={{ fontSize:11, fontWeight:500, color:C.text3 }}>{ex.dur} min</span>
                  {ex.bpm && <span style={{ fontSize:11, color:C.text3 }}>♩ {ex.bpm}</span>}
                  <span style={{ fontSize:11, fontWeight:700, color:C.primary, background:C.primaryL, borderRadius:99, padding:"1px 8px" }}>+{ex.xp} XP</span>
                  {state.completedExercises[ex.id]?.count > 1 && (
                    <span style={{ fontSize:11, color:C.green, fontWeight:700 }}>×{state.completedExercises[ex.id].count}</span>
                  )}
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

// ── Détail exercice (logique inchangée, BackBar ajoutée) ─────────────────────
function ExerciseDetail({ ex, state, dispatch, onBack, content }) {
  const saved  = state.exerciseProgress[ex.id] || [];
  const [checked, setChecked] = useState(saved);
  const [done, setDone]       = useState(false);
  const [pop,  setPop]        = useState(false);
  const theme = MODULE_THEME[ex.mod] || MODULE_THEME.neck;

  function BackBtn() {
    return (
      <div style={{ padding:"14px 20px 0", display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
        <button onClick={onBack} style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.sm, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <Ti name="arrow-left" size={17} color={C.text} />
        </button>
        <span style={{ fontSize:13, fontWeight:600, color:C.text2, fontFamily:FONTS.ui }}>Retour</span>
      </div>
    );
  }

  // Exercice fretboard interactif
  if (ex.type === "fretboard_exercise") {
    const finishFretboard = ({ totalXp }) => {
      dispatch({ type:"COMPLETE_EXERCISE", id:ex.id, title:ex.title, xp:totalXp||ex.xp });
      dispatch({ type:"MARK_STREAK" });
      dispatch({ type:"UPDATE_WEEKLY", field:"exercises" });
    };
    const linkedLesson = ex.courseLink ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===ex.courseLink) : null;
    return (
      <div>
        <BackBtn />
        <div style={{ padding:"0 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <div style={{ width:44, height:44, borderRadius:R.md, background:theme.colorL, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Ti name="guitar-pick" size={20} color={theme.color} />
            </div>
            <div>
              <div style={{ fontSize:10, color:C.text3, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600 }}>
                {ex.mod} · {ex.dur} min · Manche interactif
              </div>
              <div style={{ fontSize:17, fontWeight:800, marginTop:2, color:C.text }}>{ex.title}</div>
            </div>
          </div>
          {linkedLesson && (
            <div style={{ background:C.primaryL, border:`1.5px solid ${C.primaryBorder}`, borderRadius:R.md, padding:"9px 13px", marginBottom:12, display:"flex", gap:8, alignItems:"center" }}>
              <Ti name="book-2" size={14} color={C.primary} />
              <div style={{ fontSize:12, color:C.primaryD }}>Lié à : <strong>{linkedLesson.title}</strong></div>
            </div>
          )}
          {_FretboardExercise && <_FretboardExercise ex={ex} onComplete={finishFretboard} dispatch={dispatch} />}
          {ex.tip && (
            <div style={{ background:C.amberL, borderRadius:R.md, padding:"10px 13px", marginTop:12, marginBottom:12, border:`1.5px solid ${C.amberBorder}`, display:"flex", gap:8, alignItems:"flex-start" }}>
              <Ti name="bulb" size={15} color={C.amber} />
              <p style={{ margin:0, fontSize:13, color:C.amberD, lineHeight:1.55 }}>{ex.tip}</p>
            </div>
          )}
          <div style={{ height:24 }} />
        </div>
      </div>
    );
  }

  // Exercice classique (steps à cocher)
  const allDone = checked.length === (ex.steps || []).length;

  useEffect(() => {
    if (checked.length > 0 && !done) dispatch({ type:"SAVE_EXERCISE_PROGRESS", id:ex.id, checkedSteps:checked });
  }, [checked]);

  const toggle = (i) => setChecked(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);
  const finish = () => {
    setPop(true);
    setTimeout(() => {
      setPop(false);
      dispatch({ type:"COMPLETE_EXERCISE", id:ex.id, title:ex.title, xp:ex.xp });
      dispatch({ type:"MARK_STREAK" });
      dispatch({ type:"UPDATE_WEEKLY", field:"exercises" });
      setDone(true);
    }, 1200);
  };
  const linkedLesson = ex.courseLink ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===ex.courseLink) : null;

  return (
    <div>
      {pop && <XPPop amount={ex.xp} onDone={()=>{}} />}
      <BackBtn />
      <div style={{ padding:"0 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <div style={{ width:44, height:44, borderRadius:R.md, background:theme.colorL, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Ti name="guitar-pick" size={20} color={theme.color} />
          </div>
          <div>
            <div style={{ fontSize:10, color:C.text3, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600 }}>
              {ex.mod} · {ex.dur} min{ex.bpm ? ` · ♩ ${ex.bpm}` : ""}
            </div>
            <div style={{ fontSize:17, fontWeight:800, marginTop:2, color:C.text }}>{ex.title}</div>
          </div>
        </div>

        {linkedLesson && (
          <div style={{ background:C.primaryL, border:`1.5px solid ${C.primaryBorder}`, borderRadius:R.md, padding:"9px 13px", marginBottom:12, display:"flex", gap:8, alignItems:"center" }}>
            <Ti name="book-2" size={14} color={C.primary} />
            <div style={{ fontSize:12, color:C.primaryD }}>Lié à : <strong>{linkedLesson.title}</strong></div>
          </div>
        )}

        <div style={{ marginBottom:14 }}>
          <ProgressBar pct={(checked.length/(ex.steps||[1]).length)*100} color={C.green} h={5} />
        </div>

        {!done ? (
          <>
            {(ex.steps||[]).map((s, i) => {
              const ck = checked.includes(i);
              return (
                <button key={i} onClick={()=>toggle(i)} style={{
                  display:"flex", alignItems:"flex-start", gap:11,
                  background: ck ? C.greenL : C.surface,
                  border:`1.5px solid ${ck ? C.greenBorder : C.border}`,
                  borderRadius:R.md, padding:"11px 13px",
                  cursor:"pointer", textAlign:"left", width:"100%", marginBottom:7,
                }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${ck?C.green:C.border}`, background:ck?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    {ck && <Ti name="check" size={12} color="#fff" />}
                  </div>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.55, color:ck?C.greenD:C.text, fontWeight:ck?600:500 }}>{s}</p>
                </button>
              );
            })}
            {ex.tip && (
              <div style={{ background:C.amberL, borderRadius:R.md, padding:"10px 13px", marginBottom:12, border:`1.5px solid ${C.amberBorder}`, display:"flex", gap:8, alignItems:"flex-start" }}>
                <Ti name="bulb" size={15} color={C.amber} />
                <p style={{ margin:0, fontSize:13, color:C.amberD, lineHeight:1.55 }}>{ex.tip}</p>
              </div>
            )}
            <button onClick={finish} disabled={!allDone} style={{
              width:"100%", padding:14, borderRadius:R.lg, border:"none",
              background: allDone ? C.green : C.surface2,
              color: allDone ? "#fff" : C.text3,
              fontSize:14, fontWeight:700,
              cursor: allDone ? "pointer" : "default",
              fontFamily:FONTS.ui,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              {allDone ? <>Exercice terminé <Ti name="check" size={16} color="#fff" /></> : `${checked.length} / ${(ex.steps||[]).length} étapes`}
            </button>
          </>
        ) : (
          <div style={{ background:C.greenL, borderRadius:R.xl, padding:"24px 20px", textAlign:"center", border:`1.5px solid ${C.greenBorder}` }}>
            <div style={{ width:56, height:56, borderRadius:R.lg, background:C.green, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
              <Ti name="trophy" size={28} color="#fff" />
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:C.greenD, letterSpacing:"-.3px" }}>Bien joué !</div>
            <div style={{ fontSize:14, fontWeight:700, color:C.green, marginTop:4 }}>+{ex.xp} XP</div>
            <button onClick={onBack} style={{ marginTop:16, padding:"12px 28px", borderRadius:R.lg, border:"none", background:C.green, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui }}>
              Retour
            </button>
          </div>
        )}
        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

export { ExercisesScreen, ExerciseDetail };
