// Groply — screens/CoursesScreen.jsx  v6
// Roadmap zigzag avec nœuds typés (leçon / quiz / exercice / checkpoint)
import { useState, useMemo } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { buildModuleTheme } from "../store/moduleTheme.js";
import { Gropi, GropiCoach, GropiBubble } from "../design/Gropi.jsx";

export let _renderDiagramBlock = null;
export let _FretboardLesson    = null;
export const setDiagramRenderer = (fn) => { _renderDiagramBlock = fn; };
export const setFretboardLesson  = (fn) => { _FretboardLesson    = fn; };

// ── Grouper en chapitres de N leçons ─────────────────────────────────────────
function groupIntoChapters(lessons, n=4) {
  const out=[];
  for(let i=0;i<lessons.length;i+=n) out.push(lessons.slice(i,i+n));
  return out;
}

// ── Animation CSS partagée ────────────────────────────────────────────────────
const PULSE_CSS = `
  @keyframes gropi-pulse {
    0%   { transform:scale(.88); opacity:.9; }
    100% { transform:scale(1.28); opacity:0; }
  }
  @keyframes gropi-unlock {
    0%   { transform:scale(.7); opacity:0; }
    60%  { transform:scale(1.12); }
    100% { transform:scale(1); opacity:1; }
  }
`;

// ── Nœud individuel ───────────────────────────────────────────────────────────
function PathNode({ lesson, index, state, th, onSelect, isCurrent, isLocked, gropiTip }) {
  const C = useC();
  const done = !!state.completedLessons[lesson.id];
  const side = index%2===0 ? "left" : "right";

  let bg, border, iconEl;
  if(done)         { bg=th.colorL;    border=th.color;   iconEl=<Ti name="check" size={isCurrent?22:18} color={th.color}/>; }
  else if(isCurrent){ bg=C.primaryL;  border=C.primary;  iconEl=<Ti name="player-play" size={22} color={C.primary}/>; }
  else if(isLocked) { bg=C.surface2;  border=C.border;   iconEl=<Ti name="lock" size={16} color={C.text3}/>; }
  else              { bg=C.surface;   border=C.border;    iconEl=<Ti name="book-2" size={16} color={C.text3}/>; }

  const sz = isCurrent ? 64 : 54;

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems: side==="left" ? "flex-start" : "flex-end",
      width:"100%",
      paddingLeft:  side==="left"  ? 26 : 0,
      paddingRight: side==="right" ? 26 : 0,
      marginBottom: 4,
    }}>
      <button
        onClick={()=>!isLocked&&onSelect(lesson)}
        disabled={isLocked}
        style={{
          width:sz, height:sz, borderRadius:"50%",
          background:bg, border:`${isCurrent?"3px":"2px"} solid ${border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:isLocked?"default":"pointer",
          position:"relative",
          boxShadow:isCurrent?`0 6px 22px ${C.primary}44`:"none",
          animation: !done&&!isCurrent&&!isLocked ? "gropi-unlock .35s ease" : "none",
        }}
      >
        {iconEl}
        {done&&(
          <div style={{
            position:"absolute",top:-4,right:-4,
            width:18,height:18,borderRadius:"50%",
            background:th.color,border:`2px solid ${C.bg}`,
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <Ti name="check" size={9} color="#fff"/>
          </div>
        )}
        {isCurrent&&(
          <div style={{
            position:"absolute",inset:-9,borderRadius:"50%",
            border:`2px solid ${C.primaryBorder}`,
            animation:"gropi-pulse 2s ease-out infinite",
          }}/>
        )}
      </button>

      {/* Bulle d'info (leçon débloquée) */}
      {!isLocked&&(
        <div style={{
          marginTop:6,
          background:isCurrent?C.primaryL:C.surface,
          border:`1.5px solid ${isCurrent?C.primaryBorder:C.border}`,
          borderRadius:R.md, padding:"9px 12px",
          maxWidth:186,
          alignSelf:side==="left"?"flex-start":"flex-end",
          boxShadow:isCurrent?`0 4px 14px ${C.primary}22`:"none",
        }}>
          {isCurrent&&(
            <div style={{fontSize:8.5,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:C.primary,marginBottom:3}}>
              En cours
            </div>
          )}
          <div style={{fontSize:12.5,fontWeight:700,color:done?th.colorD:isCurrent?C.primaryD:C.text,lineHeight:1.3}}>
            {lesson.title}
          </div>
          <div style={{fontSize:10,color:C.text3,marginTop:3}}>{lesson.duration} min</div>
          {isCurrent&&(
            <div style={{
              display:"inline-block",marginTop:8,
              background:C.primary,color:"#fff",
              borderRadius:999,padding:"5px 14px",
              fontSize:10,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",
              boxShadow:`0 3px 10px ${C.primary}44`,
            }}>Commencer</div>
          )}
        </div>
      )}

      {/* Gropi compagnon — uniquement sur le nœud en cours */}
      {isCurrent && (
        <div style={{ marginTop: 10, alignSelf: side === "left" ? "flex-start" : "flex-end" }}>
          <GropiBubble
            pose="wave"
            size={68}
            tint="primary"
            eyebrow={`Gropi · ${lesson.title}`}
            side={side}
          >
            {gropiTip}
          </GropiBubble>
        </div>
      )}
    </div>
  );
}

// ── Checkpoint ────────────────────────────────────────────────────────────────
function CheckpointNode({ isLocked, isDone, th }) {
  const C = useC();
  const purple = C.purple || "#6B4FCC";
  const purpleL = C.purpleL || "#EDE8FC";
  const purpleB = C.purpleBorder || "#C4B8F0";
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"14px 0 8px"}}>
      <div style={{
        width:72,height:72,borderRadius:"50%",
        background:isDone?th.colorL:isLocked?C.surface2:purpleL,
        border:`2px solid ${isDone?th.color:isLocked?C.border:purple}`,
        display:"flex",alignItems:"center",justifyContent:"center",
        opacity:isLocked?.5:1,
        boxShadow:(!isLocked&&!isDone)?`0 6px 20px ${purple}33`:"none",
      }}>
        <Ti name={isDone?"trophy":isLocked?"lock":"trophy"} size={26}
            color={isDone?th.color:isLocked?C.text3:purple}/>
      </div>
      <div style={{
        fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
        color:C.text3,fontFamily:FONTS.ui,marginTop:7,textAlign:"center",
      }}>
        Checkpoint · quiz + manche + oreille
      </div>
    </div>
  );
}

// ── Connecteur tiretillé ──────────────────────────────────────────────────────
function PathConnector({ fromSide, done }) {
  const C = useC();
  const stroke = done ? C.green : "#E0D8CE";
  return (
    <div style={{position:"relative",height:38,overflow:"visible",margin:"0 26px"}} aria-hidden="true">
      <svg viewBox="0 0 300 38" preserveAspectRatio="none"
           style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        <path
          d={fromSide==="left"
            ? "M 64 0 C 64 19, 236 19, 236 38"
            : "M 236 0 C 236 19, 64 19, 64 38"}
          fill="none" stroke={stroke} strokeWidth="2.5"
          strokeDasharray="6 8" strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ── Roadmap d'un module ───────────────────────────────────────────────────────
function ModuleRoadmap({ course, state, th, onSelectLesson, onBack }) {
  const C = useC();
  const chapters = useMemo(()=>groupIntoChapters(course.lessons,4),[course.lessons]);

  const currentLessonId = useMemo(()=>{
    for(const l of course.lessons) if(!state.completedLessons[l.id]) return l.id;
    return null;
  },[course.lessons,state.completedLessons]);

  const unlockedUntil = useMemo(()=>{
    const idx=course.lessons.findIndex(l=>l.id===currentLessonId);
    return idx===-1?course.lessons.length:idx;
  },[course.lessons,currentLessonId]);

  const doneCount = course.lessons.filter(l=>state.completedLessons[l.id]).length;
  const totalCount = course.lessons.length;
  const pct = totalCount>0 ? Math.round(doneCount/totalCount*100) : 0;

  return (
    <div>
      <style>{PULSE_CSS}</style>

      {/* En-tête module */}
      <div style={{
        backgroundImage:`linear-gradient(180deg,${th.colorL}88 0%,${C.bg} 100%)`,
        padding:"18px 20px 16px",
      }}>
        <button onClick={onBack} style={{
          background:C.surface,border:`1.5px solid ${C.border}`,
          borderRadius:R.sm,width:36,height:36,
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:"pointer",marginBottom:12,
        }}>
          <Ti name="arrow-left" size={17} color={th.colorD}/>
        </button>

        {/* Bannière chapitre courant */}
        <div style={{
          background:`${C.surface}CC`,borderRadius:R.lg,
          padding:"13px 15px",display:"flex",alignItems:"center",gap:12,
          border:`1px solid ${th.color}22`,
          boxShadow:`0 4px 16px ${th.color}18`,
        }}>
          <div style={{
            width:42,height:42,borderRadius:R.md,
            background:th.colorL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            border:`1.5px solid ${th.color}44`,
          }}>
            <Ti name={th.icon.replace("ti-","")} size={20} color={th.color}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:th.colorD,fontFamily:FONTS.ui}}>
              {course.title}
            </div>
            <div style={{fontSize:15,fontWeight:800,color:th.colorD,letterSpacing:"-.2px",marginTop:2}}>
              {currentLessonId
                ? `Chapitre ${Math.floor(unlockedUntil/4)+1} — ${course.title}`
                : "Module terminé ! 🎉"}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:9,marginTop:7}}>
              <div style={{flex:1,height:5,background:"rgba(0,0,0,.08)",borderRadius:99,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:th.color,borderRadius:99,transition:"width .4s ease"}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:th.colorD}}>{doneCount} / {totalCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div style={{display:"flex",gap:14,padding:"10px 20px 4px",flexWrap:"wrap"}}>
        {[
          {color:th.color,    label:"Leçon"},
          {color:C.primary,   label:"Quiz"},
          {color:C.teal||"#1A8276", label:"Exercice"},
          {color:C.purple||"#6B4FCC",label:"Checkpoint"},
        ].map(({color,label})=>(
          <span key={label} style={{display:"flex",alignItems:"center",gap:5,fontSize:9,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:C.text3}}>
            <span style={{width:9,height:9,borderRadius:"50%",background:color,display:"inline-block"}}/>
            {label}
          </span>
        ))}
      </div>

      {/* Roadmap */}
      <div style={{padding:"8px 20px 40px"}}>
        {chapters.map((chapterLessons,ci)=>{
          const chapterDone = chapterLessons.every(l=>state.completedLessons[l.id]);
          const cpLocked    = !chapterDone;

          return (
            <div key={ci}>
              {/* Titre chapitre */}
              <div style={{
                textAlign:"center",fontSize:10,fontWeight:700,
                letterSpacing:".12em",textTransform:"uppercase",
                color:C.text3,fontFamily:FONTS.ui,
                margin:ci===0?"4px 0 16px":"20px 0 16px",
              }}>
                — Chapitre {ci+1} —
              </div>

              {/* Nœuds */}
              {chapterLessons.map((lesson,li)=>{
                const globalIdx = ci*4+li;
                const isCurrent = lesson.id===currentLessonId;
                const isLocked  = globalIdx>unlockedUntil;
                const prevSide  = li===0 ? null : (li-1)%2===0?"left":"right";
                const curSide   = li%2===0?"left":"right";

                // Tip contextuel de Gropi sur le nœud en cours
                let gropiTip = null;
                if (isCurrent) {
                  if (lesson.gropiTip) {
                    gropiTip = lesson.gropiTip;            // tip rédigé dans content.js
                  } else {
                    const remaining = chapterLessons.length - li;
                    gropiTip = remaining > 1
                      ? `Plus que ${remaining} leçons avant le checkpoint du chapitre ${ci+1} ! On avance pas à pas, prends ton temps sur celle-ci. 🎸`
                      : `Dernière leçon avant le checkpoint ! Après, on teste tout : quiz, manche et oreille. Tu es prêt. 💪`;
                  }
                }

                return (
                  <div key={lesson.id}>
                    {li>0&&(
                      <PathConnector
                        fromSide={prevSide}
                        done={!!state.completedLessons[chapterLessons[li-1].id]}
                      />
                    )}
                    <PathNode
                      lesson={lesson} index={li}
                      state={state} th={th}
                      onSelect={onSelectLesson}
                      isCurrent={isCurrent}
                      isLocked={isLocked}
                      gropiTip={gropiTip}
                    />
                  </div>
                );
              })}

              {/* Connecteur → checkpoint */}
              <PathConnector
                fromSide={(chapterLessons.length-1)%2===0?"left":"right"}
                done={chapterDone}
              />
              <CheckpointNode isLocked={cpLocked} isDone={chapterDone} th={th}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Liste des modules ─────────────────────────────────────────────────────────
function CoursesScreen({ state, dispatch, content }) {
  const C = useC();
  const MODULE_THEME = buildModuleTheme(C);
  const [active,       setActive]       = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  if(activeLesson) return (
    <LessonView lesson={activeLesson} state={state} dispatch={dispatch}
      onBack={()=>setActiveLesson(null)}/>
  );
  if(active) {
    const th = MODULE_THEME[active.id]||{icon:"ti-book-2",color:C.primary,colorL:C.primaryL,colorD:C.primaryD};
    return (
      <ModuleRoadmap
        course={active} state={state} th={th}
        onSelectLesson={setActiveLesson}
        onBack={()=>setActive(null)}
      />
    );
  }

  const totalLessons = content.courses.reduce((a,c)=>a+c.lessons.length,0);

  return (
    <div>
      {/* Header */}
      <div style={{
        backgroundImage:"url('/lavender.jpg')",
        backgroundSize:"cover",backgroundPosition:"center 60%",
        padding:"26px 20px 20px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",inset:0,background:"rgba(60,20,100,.52)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-.4px"}}>Cours</div>
          <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,.78)",marginTop:2}}>
            {content.courses.length} modules · {totalLessons} leçons
          </div>
        </div>
      </div>

      <div style={{padding:"16px 20px 0"}}>
        {content.courses.map(c=>{
          const total = c.lessons.length;
          const done  = c.lessons.filter(l=>state.completedLessons[l.id]).length;
          const pct   = total>0?Math.round(done/total*100):0;
          const th    = MODULE_THEME[c.id]||{icon:"ti-book-2",color:C.primary,colorL:C.primaryL,colorD:C.primaryD};
          // Leçon courante dans ce module
          const nextL = c.lessons.find(l=>!state.completedLessons[l.id]);

          return (
            <button key={c.id} onClick={()=>setActive(c)} style={{
              width:"100%",border:"none",cursor:"pointer",
              textAlign:"left",fontFamily:FONTS.title,
              borderRadius:R.xl,padding:"16px 18px",
              marginBottom:12,position:"relative",overflow:"hidden",
              background:th.colorL,
              boxShadow:`0 4px 16px ${th.color}18`,
            }}>
              {/* Cercle déco */}
              <div style={{position:"absolute",right:-20,top:-20,width:80,height:80,borderRadius:"50%",background:th.color,opacity:.12,pointerEvents:"none"}}/>

              <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:11,position:"relative",zIndex:1}}>
                <div style={{width:46,height:46,borderRadius:R.md,background:"rgba(255,255,255,.65)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ti name={th.icon.replace("ti-","")} size={22} color={th.color}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:800,color:th.colorD,letterSpacing:"-.2px"}}>{c.title}</div>
                  <div style={{fontSize:11,fontWeight:500,color:th.colorD,opacity:.72,marginTop:1,lineHeight:1.4}}>{c.desc}</div>
                </div>
                <Ti name="chevron-right" size={16} color={th.color} style={{opacity:.6,flexShrink:0}}/>
              </div>

              <div style={{position:"relative",zIndex:1}}>
                <ProgressBar pct={pct} color={th.color} h={5}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:th.colorD}}>
                    {done} / {total} leçons · {pct}%
                  </div>
                  {nextL&&pct>0&&pct<100&&(
                    <div style={{fontSize:10,fontWeight:600,color:th.colorD,opacity:.7}}>
                      ▶ {nextL.title}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        <div style={{height:24}}/>
      </div>
    </div>
  );
}

// ── Contenu d'une leçon ───────────────────────────────────────────────────────
function LessonView({ lesson, state, dispatch, onBack }) {
  const C = useC();
  const [done,setDone] = useState(!!state.completedLessons[lesson.id]);
  const [pop, setPop]  = useState(false);

  const finish = () => {
    if(!done) {
      setPop(true);
      setTimeout(()=>{
        setPop(false);
        dispatch({type:"COMPLETE_LESSON",id:lesson.id,title:lesson.title});
        dispatch({type:"MARK_STREAK"});
        dispatch({type:"UPDATE_WEEKLY",field:"sessions"});
        setDone(true);
      },1000);
    }
  };

  return (
    <div>
      {pop&&<XPPop amount={30} onDone={()=>{}}/>}
      <div style={{padding:"14px 20px 0",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:R.sm,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <Ti name="arrow-left" size={17} color={C.text}/>
        </button>
        <span style={{fontSize:13,fontWeight:600,color:C.text2,fontFamily:FONTS.ui}}>Retour au module</span>
      </div>
      <div style={{padding:"16px 20px 0"}}>
        <h1 style={{margin:"0 0 6px",fontSize:22,fontWeight:800,lineHeight:1.25,letterSpacing:"-.3px",color:C.text}}>{lesson.title}</h1>
        <p style={{fontSize:11,color:C.text3,margin:"0 0 20px",letterSpacing:".05em",textTransform:"uppercase",fontWeight:600}}>
          {lesson.duration} MIN · {(lesson.quiz||[]).length} QUESTIONS
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
          {lesson.content.map((b,i)=>{
            if(b.type==="h") return <h3 key={i} style={{margin:"8px 0 0",fontSize:17,fontWeight:800,color:C.primary,letterSpacing:"-.2px"}}>{b.text}</h3>;
            if(b.type==="tip") return <GropiCoach key={i} variant="tip">{b.text}</GropiCoach>;
            if(b.type==="img") return (
              <div key={i} style={{background:C.surface2,borderRadius:R.md,padding:12,textAlign:"center"}}>
                <img src={b.src} alt={b.alt||""} style={{maxWidth:"100%",borderRadius:8}}/>
                {b.caption&&<p style={{fontSize:12,color:C.text3,marginTop:8,fontStyle:"italic"}}>{b.caption}</p>}
              </div>
            );
            if(b.type==="ref") return <GropiCoach key={i} variant="ref">{b.text}</GropiCoach>;
            const diagram = _renderDiagramBlock?_renderDiagramBlock(b,i):null;
            if(diagram) return diagram;
            if(b.type==="fretboard_interactive"&&_FretboardLesson) return <div key={i}><_FretboardLesson block={b}/></div>;
            return <p key={i} style={{margin:0,fontSize:15,lineHeight:1.7,color:C.text}}>{b.text}</p>;
          })}
        </div>
        {(lesson.quiz||[]).length>0&&(
          <div style={{background:C.primaryL,border:`1.5px solid ${C.primaryBorder}`,borderRadius:R.md,padding:"11px 14px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
            <Ti name="notebook" size={16} color={C.primary}/>
            <p style={{margin:0,fontSize:12,color:C.primaryD}}>
              Cette leçon est associée à {(lesson.quiz||[]).length} question{(lesson.quiz||[]).length>1?"s":""} de quiz.
            </p>
          </div>
        )}
        {done ? (
          <div style={{ background:C.greenL, borderRadius:R.xl, padding:"22px 20px", textAlign:"center", border:`1.5px solid ${C.greenBorder}`, marginBottom:8 }}>
            <Gropi pose="celebrate" size={120} anim="cheer" style={{ margin:"0 auto" }}/>
            <div style={{ fontSize:20, fontWeight:800, color:C.greenD, letterSpacing:"-.3px", marginTop:8 }}>Leçon complétée !</div>
            <div style={{ fontSize:13, color:C.green, marginTop:4 }}>+30 XP · Continue sur ta lancée 🎸</div>
            <button onClick={onBack} style={{ marginTop:16, padding:"12px 32px", borderRadius:R.lg, border:"none", background:C.green, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui, boxShadow:`0 4px 14px ${C.green}44` }}>
              Retour au module
            </button>
          </div>
        ) : (
          <button onClick={finish} style={{
            width:"100%", padding:14, borderRadius:R.lg, border:"none",
            background:C.primary, color:"#fff",
            fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui,
            letterSpacing:".01em", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            boxShadow:`0 4px 16px ${C.primary}44`,
          }}>
            Terminer la leçon · +30 XP
          </button>
        )}
        <div style={{height:24}}/>
      </div>
    </div>
  );
}

export { CoursesScreen, LessonView };
