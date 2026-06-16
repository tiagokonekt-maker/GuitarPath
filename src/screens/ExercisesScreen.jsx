// Groply — screens/ExercisesScreen.jsx
import { useState, useEffect, useMemo } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { buildModuleTheme } from "../store/moduleTheme.js";

export let _FretboardExercise = null;
export const setFretboardExercise = (fn) => { _FretboardExercise = fn; };

// ── Helpers ──────────────────────────────────────────────────────────────────
const LEVEL_LABELS = { 1:"Fondamentaux", 2:"Intermédiaire", 3:"Avancé" };
const makeLevelColors = (C) => ({ 1:{ bg:C.greenL, border:C.greenBorder, text:C.greenD, dot:C.green }, 2:{ bg:C.amberL, border:C.amberBorder, text:C.amberD, dot:C.amber }, 3:{ bg:C.pinkL, border:C.pinkBorder, text:C.pinkD, dot:C.pink } });
const DIFF_STARS = { 1:"★☆☆", 2:"★★☆", 3:"★★★" };

// ── ExercisesScreen ───────────────────────────────────────────────────────────
function ExercisesScreen({ state, dispatch, content }) {
  const C = useC();
  const MODULE_THEME = buildModuleTheme(C);
  const LEVEL_COLORS = makeLevelColors(C);
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

  const allEx = content.exercises;

  // Stats globales
  const totalDone  = useMemo(() => allEx.filter(e => state.completedExercises[e.id]).length, [state.completedExercises, allEx]);
  const totalXP    = useMemo(() => allEx.reduce((s,e) => s + (state.completedExercises[e.id] ? e.xp : 0), 0), [state.completedExercises, allEx]);
  const pctGlobal  = allEx.length ? Math.round(totalDone / allEx.length * 100) : 0;

  // Exercice recommandé = premier non-complété du niveau le plus bas
  const recommended = useMemo(() => {
    const sorted = [...allEx].sort((a,b) => (a.lvl||1) - (b.lvl||1));
    return sorted.find(e => !state.completedExercises[e.id] && (filter==="all" || e.mod===filter));
  }, [allEx, state.completedExercises, filter]);

  // Exercices filtrés groupés par niveau
  const byLevel = useMemo(() => {
    const filtered = allEx.filter(e => filter==="all" || e.mod===filter);
    const groups = {};
    filtered.forEach(e => {
      const l = e.lvl || 1;
      if (!groups[l]) groups[l] = [];
      groups[l].push(e);
    });
    return groups;
  }, [allEx, filter]);

  if (active) return (
    <ExerciseDetail ex={active} state={state} dispatch={dispatch} onBack={() => setActive(null)} content={content} />
  );

  return (
    <div>
      {/* ── EN-TÊTE ──────────────────────────────────────────────────────── */}
      <div style={{
        backgroundImage:"url('/beach.jpg')",
        backgroundSize:"cover", backgroundPosition:"center 55%",
        padding:"24px 20px 20px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(20,60,120,.45)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Exercices</div>
        <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,.8)", marginTop:2, marginBottom:14 }}>
          {totalDone} / {allEx.length} complétés · {totalXP} XP gagnés
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{pctGlobal}% terminé</span>
          <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.8)" }}>{allEx.length - totalDone} restants</span>
        </div>
        <ProgressBar pct={pctGlobal} color={C.amber} h={7} />
        </div>
      </div>

      {/* ── FILTRES ──────────────────────────────────────────────────────── */}
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

        {/* ── RECOMMANDÉ ───────────────────────────────────────────────────── */}
        {recommended && (
          <>
            <div style={{ fontSize:11, fontWeight:700, color:C.text3, letterSpacing:".07em", textTransform:"uppercase", marginBottom:10 }}>
              Recommandé pour toi
            </div>
            <button onClick={() => setActive(recommended)} style={{
              width:"100%", background:`linear-gradient(135deg, ${C.primaryL}, ${C.surface})`,
              border:`2px solid ${C.primaryBorder}`, borderRadius:R.xl,
              padding:"16px", cursor:"pointer", textAlign:"left",
              fontFamily:FONTS.title, marginBottom:20, display:"flex", gap:14, alignItems:"center",
            }}>
              <div style={{ width:52, height:52, borderRadius:R.lg, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 12px ${C.primaryBorder}` }}>
                <Ti name="player-play" size={24} color="#fff" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.primary, letterSpacing:".08em", textTransform:"uppercase", marginBottom:3 }}>
                  {LEVEL_LABELS[recommended.lvl||1]} · {DIFF_STARS[recommended.lvl||1]}
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:"-.2px" }}>{recommended.title}</div>
                <div style={{ display:"flex", gap:8, marginTop:4, alignItems:"center" }}>
                  <span style={{ fontSize:11, color:C.text3, fontWeight:500 }}>{recommended.dur} min</span>
                  {recommended.bpm && <span style={{ fontSize:11, color:C.text3 }}>♩ {recommended.bpm}</span>}
                  <span style={{ fontSize:11, fontWeight:700, color:C.primary, background:C.primaryL, borderRadius:99, padding:"2px 8px" }}>+{recommended.xp} XP</span>
                </div>
              </div>
              <Ti name="arrow-right" size={18} color={C.primary} />
            </button>
          </>
        )}

        {/* ── GROUPES PAR NIVEAU ──────────────────────────────────────────── */}
        {[1, 2, 3].map(lvl => {
          const exos = byLevel[lvl];
          if (!exos || exos.length === 0) return null;
          const lvlDone = exos.filter(e => state.completedExercises[e.id]).length;
          const lvlPct  = Math.round(lvlDone / exos.length * 100);
          const lc      = LEVEL_COLORS[lvl];

          return (
            <div key={lvl} style={{ marginBottom:20 }}>
              {/* Header groupe */}
              <div style={{
                background:lc.bg, border:`1.5px solid ${lc.border}`,
                borderRadius:R.lg, padding:"12px 14px", marginBottom:10,
              }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:lc.dot }} />
                    <span style={{ fontSize:13, fontWeight:800, color:lc.text }}>{LEVEL_LABELS[lvl]}</span>
                    <span style={{ fontSize:11, color:lc.text, opacity:.7 }}>{DIFF_STARS[lvl]}</span>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:lc.dot }}>{lvlDone}/{exos.length}</span>
                </div>
                <ProgressBar pct={lvlPct} color={lc.dot} h={4} />
              </div>

              {/* Liste exercices */}
              {exos.map(ex => {
                const done       = !!state.completedExercises[ex.id];
                const inProgress = (state.exerciseProgress[ex.id]?.length || 0) > 0;
                const th         = MODULE_THEME[ex.mod] || MODULE_THEME.neck;
                const count      = state.completedExercises[ex.id]?.count || 0;

                return (
                  <button key={ex.id} onClick={() => setActive(ex)} style={{
                    background:C.surface, border:`1.5px solid ${done ? C.greenBorder : inProgress ? C.amberBorder : C.border}`,
                    borderRadius:R.lg, padding:"12px 14px",
                    display:"flex", alignItems:"center", gap:12,
                    cursor:"pointer", textAlign:"left", width:"100%", marginBottom:8,
                    fontFamily:FONTS.title,
                  }}>
                    {/* Icône état */}
                    <div style={{
                      width:44, height:44, borderRadius:R.md, flexShrink:0,
                      background: done ? C.greenL : inProgress ? C.amberL : th.colorL,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      position:"relative",
                    }}>
                      {done
                        ? <Ti name="check" size={20} color={C.green} />
                        : inProgress
                          ? <Ti name="player-pause" size={20} color={C.amber} />
                          : <Ti name="guitar-pick" size={20} color={th.color} />
                      }
                      {count > 1 && (
                        <div style={{ position:"absolute", top:-4, right:-4, width:16, height:16, borderRadius:"50%", background:C.green, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontSize:8, fontWeight:800, color:"#fff" }}>{count}</span>
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color: done ? C.text2 : C.text, letterSpacing:"-.1px", textDecoration: done ? "line-through" : "none" }}>
                        {ex.title}
                      </div>
                      <div style={{ display:"flex", gap:6, marginTop:3, flexWrap:"wrap", alignItems:"center" }}>
                        <span style={{ fontSize:11, fontWeight:500, color:C.text3 }}>{ex.dur} min</span>
                        {ex.bpm && <span style={{ fontSize:11, color:C.text3 }}>♩{ex.bpm}</span>}
                        <span style={{
                          fontSize:11, fontWeight:700,
                          color: done ? C.green : C.primary,
                          background: done ? C.greenL : C.primaryL,
                          borderRadius:99, padding:"1px 7px",
                        }}>
                          {done ? `✓ ${ex.xp} XP` : `+${ex.xp} XP`}
                        </span>
                        {inProgress && !done && (
                          <span style={{ fontSize:11, fontWeight:600, color:C.amber }}>En cours</span>
                        )}
                      </div>
                    </div>
                    <Ti name="chevron-right" size={15} color={C.text3} />
                  </button>
                );
              })}
            </div>
          );
        })}

        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

// ── ExerciseDetail (logique inchangée, layout redesigné) ──────────────────────
function ExerciseDetail({ ex, state, dispatch, onBack, content }) {
  const C = useC();
  const MODULE_THEME = buildModuleTheme(C);
  const LEVEL_COLORS = makeLevelColors(C);
  const saved  = state.exerciseProgress[ex.id] || [];
  const [checked, setChecked] = useState(saved);
  const [done, setDone]       = useState(false);
  const [pop,  setPop]        = useState(false);
  const theme  = MODULE_THEME[ex.mod] || MODULE_THEME.neck;
  const lc     = LEVEL_COLORS[ex.lvl||1];

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
          <ExHeader ex={ex} theme={theme} lc={lc} />
          {linkedLesson && <LinkedLesson lesson={linkedLesson} />}
          {_FretboardExercise && <_FretboardExercise ex={ex} onComplete={finishFretboard} dispatch={dispatch} />}
          {ex.tip && <Tip text={ex.tip} />}
          <div style={{ height:24 }} />
        </div>
      </div>
    );
  }

  // Exercice classique
  const allDone = checked.length === (ex.steps||[]).length;
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
        <ExHeader ex={ex} theme={theme} lc={lc} />
        {linkedLesson && <LinkedLesson lesson={linkedLesson} />}

        {/* Progression steps */}
        <div style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:12, fontWeight:600, color:C.text2 }}>Étapes</span>
            <span style={{ fontSize:12, fontWeight:700, color:C.green }}>{checked.length}/{(ex.steps||[]).length}</span>
          </div>
          <ProgressBar pct={(checked.length/(ex.steps||[1]).length)*100} color={C.green} h={5} />
        </div>

        {!done ? (
          <>
            {(ex.steps||[]).map((s, i) => {
              const ck = checked.includes(i);
              return (
                <button key={i} onClick={() => toggle(i)} style={{
                  display:"flex", alignItems:"flex-start", gap:11,
                  background: ck ? C.greenL : C.surface,
                  border:`1.5px solid ${ck ? C.greenBorder : C.border}`,
                  borderRadius:R.md, padding:"12px 13px",
                  cursor:"pointer", textAlign:"left", width:"100%", marginBottom:7,
                }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${ck?C.green:C.border}`, background:ck?C.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    {ck && <Ti name="check" size={12} color="#fff" />}
                  </div>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.55, color:ck?C.greenD:C.text, fontWeight:ck?600:500, fontFamily:FONTS.title }}>{s}</p>
                </button>
              );
            })}
            {ex.tip && <Tip text={ex.tip} />}
            <button onClick={finish} disabled={!allDone} style={{
              width:"100%", padding:14, borderRadius:R.lg, border:"none",
              background: allDone ? C.green : C.surface2,
              color: allDone ? "#fff" : C.text3,
              fontSize:14, fontWeight:700,
              cursor: allDone ? "pointer" : "default",
              fontFamily:FONTS.ui,
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              {allDone
                ? <><Ti name="check" size={16} color="#fff" /> Exercice terminé · +{ex.xp} XP</>
                : `${checked.length} / ${(ex.steps||[]).length} étapes complétées`
              }
            </button>
          </>
        ) : (
          <div style={{ background:C.greenL, borderRadius:R.xl, padding:"24px 20px", textAlign:"center", border:`1.5px solid ${C.greenBorder}` }}>
            <Gropi pose="celebrate" size={130} anim="cheer" style={{ margin:"0 auto" }}/>
            <div style={{ fontSize:22, fontWeight:800, color:C.greenD, letterSpacing:"-.3px", marginTop:8 }}>Bien joué !</div>
            <div style={{ fontSize:13, fontWeight:500, color:C.green, marginTop:4 }}>+{ex.xp} XP gagnés</div>
            <div style={{ fontSize:12, color:C.greenD, opacity:.7, marginTop:6, lineHeight:1.5 }}>
              Gropi a tout entendu depuis ici. Continue comme ça. 🎸
            </div>
            <button onClick={onBack} style={{ marginTop:18, padding:"12px 32px", borderRadius:R.lg, border:"none", background:C.green, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui, boxShadow:`0 4px 14px ${C.green}44` }}>
              Retour
            </button>
          </div>
        )}
        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

// ── Micro-composants ──────────────────────────────────────────────────────────
function ExHeader({ ex, theme, lc }) {
  const C = useC();
  return (
    <div style={{ background:lc.bg, border:`1.5px solid ${lc.border}`, borderRadius:R.lg, padding:"14px 16px", marginBottom:14 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:48, height:48, borderRadius:R.md, background:theme.colorL, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Ti name="guitar-pick" size={22} color={theme.color} />
        </div>
        <div>
          <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:3 }}>
            <span style={{ fontSize:10, fontWeight:700, color:lc.dot, background:lc.bg, border:`1px solid ${lc.border}`, borderRadius:99, padding:"1px 7px", textTransform:"uppercase", letterSpacing:".06em" }}>
              {LEVEL_LABELS[ex.lvl||1]}
            </span>
            <span style={{ fontSize:11, color:lc.dot }}>{DIFF_STARS[ex.lvl||1]}</span>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:C.text, letterSpacing:"-.2px" }}>{ex.title}</div>
          <div style={{ fontSize:11, color:C.text3, marginTop:2 }}>
            {ex.dur} min{ex.bpm ? ` · ♩ ${ex.bpm} BPM` : ""} · +{ex.xp} XP
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedLesson({ lesson }) {
  const C = useC();
  return (
    <div style={{ background:C.primaryL, border:`1.5px solid ${C.primaryBorder}`, borderRadius:R.md, padding:"9px 13px", marginBottom:12, display:"flex", gap:8, alignItems:"center" }}>
      <Ti name="book-2" size={14} color={C.primary} />
      <div style={{ fontSize:12, color:C.primaryD }}>Lié à la leçon : <strong>{lesson.title}</strong></div>
    </div>
  );
}

function Tip({ text }) {
  const C = useC();
  return (
    <div style={{ background:C.amberL, borderRadius:R.md, padding:"11px 13px", marginBottom:12, border:`1.5px solid ${C.amberBorder}`, display:"flex", gap:8, alignItems:"flex-start" }}>
      <Ti name="bulb" size={15} color={C.amber} />
      <p style={{ margin:0, fontSize:13, color:C.amberD, lineHeight:1.55, fontFamily:FONTS.title }}>{text}</p>
    </div>
  );
}

export { ExercisesScreen, ExerciseDetail };
