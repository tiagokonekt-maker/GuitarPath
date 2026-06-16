// Groply — screens/HomeScreen.jsx  v6
// Gropi : conseil contextuel + session du jour fusionnés en un seul bloc
import { useState, useMemo, useEffect } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar } from "../design/ui.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { getReviewStats } from "../store/reviewEngine.js";

// ── Conseils contextuels ─────────────────────────────────────────────────────
const GROPI_TIPS = [
  { cond:(s,rs)=>rs.toReview>=10,   text:(_,rs)=>`Tu as ${rs.toReview} questions qui attendent d'être revues. La mémoire s'efface vite — c'est le moment. 🧠` },
  { cond:(s)=>s.streak===0&&Object.keys(s.completedLessons||{}).length>0, text:()=>"Ta flamme s'est éteinte. Mais tu es là, c'est déjà tout. Rallume-la aujourd'hui. 🔥" },
  { cond:(s)=>s.streak>=7,           text:(s)=>`${s.streak} jours d'affilée 🔥 La régularité, c'est 80 % du chemin. Continue.` },
  { cond:(s)=>s.streak>=3,           text:(s)=>`Série de ${s.streak} jours — tu construis quelque chose. Ne la brise pas. 🎸` },
  { cond:(s)=>s.level>=3&&s.xp%300<30, text:()=>"Tu viens de passer un niveau — c'est le bon moment pour tenter quelque chose de nouveau." },
  { cond:(s)=>Object.keys(s.completedLessons||{}).length===0, text:()=>"Commence par une leçon : 10 minutes aujourd'hui valent mieux qu'une heure dimanche. 🎵" },
  { cond:()=>new Date().getDay()===1, text:()=>"Lundi = parfait pour revoir la semaine passée avant d'avancer. 🔄" },
  { cond:()=>new Date().getDay()===5, text:()=>"Vendredi soir + guitare = combo gagnant. 15 minutes de Jam, et la semaine se termine bien. 🎶" },
  { cond:()=>true, text:()=>"Accorde-toi avant de jouer — 30 secondes qui sauvent toute ta session. 🎸" },
  { cond:()=>true, text:()=>"Entre cordes 3 et 2, le décalage est +4 cases, pas +5. C'est la fameuse cassure du manche — à graver." },
  { cond:()=>true, text:()=>"Vise la tierce de chaque accord quand tu improvises : c'est elle qui raconte l'histoire. 🎵" },
  { cond:()=>true, text:()=>"Le silence fait partie de la musique — laisser respirer une phrase la rend deux fois plus puissante." },
  { cond:()=>true, text:()=>"Joue lentement, puis accélère. Un tempo lent parfait vaut mieux qu'un tempo rapide raté." },
  { cond:()=>true, text:()=>"La pentatonique mineure position 1 fonctionne sur 90 % des jams en mineur. Maîtrise-la d'abord." },
  { cond:()=>true, text:()=>"Le mode dorien = mineur naturel avec une 6te majeure. C'est la gamme de Santana, de Daft Punk. Écoute-les différemment." },
];

function pickTip(state, rs) {
  const dayIdx = new Date().getDate() % 6; // rotation douce parmi les fallbacks
  const contextual = GROPI_TIPS.filter(t=>t.cond(state,rs));
  return contextual[0]?.text(state,rs) || "Gropi est là pour toi. 🎸";
}

// ── Mascotte (pose coucou) ───────────────────────────────────────────────────
function GropiWave({ size = 80 }) {
  const C = useC();
  return <Gropi pose="wave" size={size} anim="wiggle" />;
}

// ── Bloc Gropi fusionné : conseil + session du jour + CTA unique ─────────────
function GropiBlock({ state, dispatch, navigate, reviewStats, nextLesson }) {
  const C = useC();
  const today = new Date().toISOString().split("T")[0];
  const dismissed = state.gropiTipDate === today;

  const tip = useMemo(()=>pickTip(state,reviewStats),
    [state.xp,state.streak,state.level,reviewStats.toReview]);

  // Session steps
  const steps = useMemo(()=>{
    const s=[];
    if(reviewStats.toReview>0) s.push({
      icon:"refresh", color:C.pink,
      label:"Révision intelligente",
      sub:`${reviewStats.toReview} question${reviewStats.toReview>1?"s":""} à revoir`,
      dur:"5 min", action:"review",
    });
    if(nextLesson) s.push({
      icon:"book-2", color:C.green,
      label:nextLesson.lesson.title,
      sub:nextLesson.course.title,
      dur:`${nextLesson.lesson.duration} min`, action:"courses",
    });
    if(s.length===0) s.push({
      icon:"music", color:C.pink,
      label:"Jam Session libre",
      sub:"Improvise, explore, détends-toi",
      dur:"∞", action:"jam",
    });
    return s;
  },[reviewStats.toReview,nextLesson]);

  const totalMin = steps.reduce((a,s)=>a+(parseInt(s.dur)||5),0);
  const mainAction = steps[0]?.action || "jam";

  if(dismissed) return null;

  return (
    <div style={{
      margin:"14px 16px 0",
      background:C.surface,
      border:`1.5px solid ${C.primaryBorder}`,
      borderRadius:22,
      overflow:"hidden",
      boxShadow:`0 4px 20px ${C.primary}18`,
    }}>
      {/* ── Partie haute : Gropi + conseil ── */}
      <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"14px 14px 12px"}}>
        <GropiWave size={76}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{
            fontSize:9,fontWeight:700,letterSpacing:".1em",
            textTransform:"uppercase",color:C.primaryD,
            fontFamily:FONTS.ui,marginBottom:5,
          }}>Conseil de Gropi · aujourd'hui</div>
          <p style={{
            margin:0,fontSize:13.5,lineHeight:1.55,
            fontWeight:500,color:C.text,fontFamily:FONTS.body,
          }}>{tip}</p>
        </div>
        <button
          onClick={()=>dispatch({type:"DISMISS_GROPI_TIP"})}
          aria-label="Fermer"
          style={{
            background:"none",border:"none",cursor:"pointer",
            color:C.text3,fontSize:16,fontWeight:600,
            fontFamily:FONTS.ui,padding:"0 2px",flexShrink:0,lineHeight:1,
          }}>✕</button>
      </div>

      {/* ── Séparateur ── */}
      <div style={{borderTop:`1px dashed ${C.primaryBorder}`,margin:"0 14px"}}/>

      {/* ── Partie basse : session du jour ── */}
      <div style={{padding:"11px 14px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:C.primaryD,fontFamily:FONTS.ui}}>
            Ta session du jour
          </span>
          <span style={{
            fontSize:9.5,fontWeight:700,
            background:C.primaryL,border:`1px solid ${C.primaryBorder}`,
            color:C.primary,borderRadius:999,padding:"3px 9px",
            fontFamily:FONTS.ui,letterSpacing:".05em",textTransform:"uppercase",
          }}>≈ {totalMin} min</span>
        </div>

        {steps.map((step,i)=>(
          <div key={i} style={{
            display:"flex",alignItems:"center",gap:10,
            padding:"8px 0",
            borderTop:i>0?`1px dashed ${C.borderSoft}`:"none",
          }}>
            <div style={{
              width:32,height:32,borderRadius:10,background:C.surface2,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            }}>
              <Ti name={step.icon} size={15} color={step.color}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text,letterSpacing:"-.1px"}}>{step.label}</div>
              <div style={{fontSize:10.5,color:C.text3,marginTop:1}}>{step.sub}</div>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:C.text2,flexShrink:0}}>{step.dur}</span>
          </div>
        ))}

        {/* CTA principal — un seul bouton */}
        <button
          onClick={()=>navigate(mainAction)}
          style={{
            width:"100%",marginTop:11,
            background:`linear-gradient(135deg,#FF9155 0%,${C.primary} 100%)`,
            color:"#fff",border:"none",borderRadius:R.lg,
            padding:"13px 16px",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            fontSize:13.5,fontWeight:700,fontFamily:FONTS.ui,letterSpacing:".02em",
            boxShadow:`0 4px 16px ${C.primary}44`,
          }}>
          <Ti name="player-play" size={14} color="#fff"/>
          Commencer la session
        </button>
      </div>
    </div>
  );
}

// ── QuickCard ─────────────────────────────────────────────────────────────────
function QuickCard({icon,iconBg,iconColor,label,onClick,done=false}) {
  const C = useC();
  return (
    <button onClick={onClick} style={{
      background:C.surface,border:`1.5px solid ${done?C.greenBorder:C.border}`,
      borderRadius:R.lg,padding:14,cursor:"pointer",
      textAlign:"left",fontFamily:FONTS.title,
      display:"flex",flexDirection:"column",gap:8,
      transition:"transform .1s",
    }}>
      <div style={{
        width:40,height:40,borderRadius:R.md,
        background:iconBg,display:"flex",alignItems:"center",justifyContent:"center",
      }}>
        <Ti name={icon} size={18} color={iconColor}/>
      </div>
      <div style={{fontSize:12.5,fontWeight:700,color:C.text,lineHeight:1.3}}>{label}</div>
    </button>
  );
}

// ── Écran principal ───────────────────────────────────────────────────────────
function HomeScreen({state,dispatch,navigate,content}) {
  const C = useC();
  const xpInLevel = state.xp%300;
  const lvlPct    = Math.round((xpInLevel/300)*100);
  const xpToNext  = 300-xpInLevel;

  const reviewStats = useMemo(()=>{
    if(!content.quiz) return {toReview:0,eligible:0,pctMastered:0,mastered:0};
    return getReviewStats(content.quiz,state.reviewHistory||{},state.completedLessons);
  },[content.quiz,state.reviewHistory,state.completedLessons]);

  const nextLesson = useMemo(()=>{
    for(const course of content.courses)
      for(const lesson of course.lessons)
        if(!state.completedLessons[lesson.id]) return {course,lesson};
    return null;
  },[content,state.completedLessons]);

  const dateStr = new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{
        backgroundImage:"url('/sunset.jpg')",
        backgroundSize:"cover",backgroundPosition:"center 30%",
        padding:"56px 20px 22px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",inset:0,background:"rgba(160,55,0,.5)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"absolute",top:-30,right:-35,width:130,height:130,background:"rgba(255,255,255,.08)",borderRadius:"50%",pointerEvents:"none"}}/>

        {/* Logo */}
        <div style={{position:"absolute",top:18,left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",alignItems:"center",gap:9}}>
          <img src="/logo.svg" alt="Groply" style={{height:40,width:"auto",filter:"brightness(0) invert(1)",opacity:.95}}/>
          <span style={{fontSize:26,fontWeight:800,color:"#fff",letterSpacing:"-.3px",opacity:.95,fontFamily:"'Nunito',sans-serif"}}>Groply</span>
        </div>

        {/* Gropi célébration */}
        <Gropi pose="celebrate" size={196} anim="bob" style={{
          position:"absolute", right:-4, bottom:0, zIndex:1,
          filter:"drop-shadow(0 10px 18px rgba(120,40,0,.38))",
          pointerEvents:"none",
        }}/>

        <div style={{display:"flex",alignItems:"flex-end",position:"relative",zIndex:2}}>
          <div style={{flex:"0 0 58%",maxWidth:"58%"}}>
            <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,.75)",marginBottom:2}}>{dateStr}</div>
            <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:18,letterSpacing:"-.3px"}}>Bonjour 👋</div>
            {nextLesson ? (
              <button onClick={()=>navigate("courses")} style={{
                width:"100%",background:"rgba(255,255,255,.18)",
                border:"1.5px solid rgba(255,255,255,.28)",
                borderRadius:R.lg,padding:"14px 16px",
                backdropFilter:"blur(6px)",cursor:"pointer",textAlign:"left",fontFamily:FONTS.title,
              }}>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.7)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>Prochain objectif</div>
                <div style={{fontSize:15,fontWeight:800,color:"#fff",letterSpacing:"-.2px",marginBottom:4}}>{nextLesson.lesson.title}</div>
                <div style={{fontSize:11,fontWeight:500,color:"rgba(255,255,255,.7)",marginBottom:12}}>{nextLesson.course.title} · {nextLesson.lesson.duration} min</div>
                <span style={{display:"inline-flex",alignItems:"center",gap:7,background:"#fff",color:C.primary,borderRadius:99,padding:"8px 16px",fontSize:13,fontWeight:700}}>
                  <Ti name="player-play" size={13} color={C.primary}/>Continuer
                </span>
              </button>
            ):(
              <div style={{background:"rgba(255,255,255,.18)",border:"1.5px solid rgba(255,255,255,.28)",borderRadius:R.lg,padding:"16px 18px",backdropFilter:"blur(6px)"}}>
                <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>Tout est complété ! 🎉</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,.7)",marginTop:3}}>Reviens demain pour de nouveaux défis.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"14px 16px 0",scrollbarWidth:"none"}}>
        {[
          {v:`Niv. ${state.level}`,l:"Niveau",color:C.primaryD},
          {v:Object.keys(state.completedLessons).length,l:"Leçons"},
          {v:Object.keys(state.quizResults||{}).length,l:"Quiz"},
          {v:Object.keys(state.completedExercises).length,l:"Exercices"},
          {v:`${state.streak}🔥`,l:"Série",color:C.primaryD},
        ].map((s,i)=>(
          <div key={i} style={{flexShrink:0,background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:R.md,padding:"10px 14px",minWidth:68,textAlign:"center"}}>
            <div style={{fontSize:17,fontWeight:800,color:s.color||C.text,letterSpacing:"-.3px"}}>{s.v}</div>
            <div style={{fontSize:9.5,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:".05em",marginTop:1}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── XP BAR ── */}
      <div style={{margin:"14px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:13,fontWeight:700,color:C.text}}>Niveau {state.level}</span>
          <span style={{fontSize:12,fontWeight:600,color:C.primary}}>{xpInLevel} / 300 XP</span>
        </div>
        <div style={{height:8,background:C.border,borderRadius:99,overflow:"hidden"}}>
          <div style={{width:`${lvlPct}%`,height:"100%",background:`linear-gradient(90deg,#FF9155,${C.primary})`,borderRadius:99,transition:"width .4s ease"}}/>
        </div>
        <div style={{fontSize:11,color:C.text3,marginTop:4}}>{xpToNext} XP pour le niveau {state.level+1}</div>
      </div>

      {/* ── GROPI BLOCK ── */}
      <GropiBlock
        state={state} dispatch={dispatch} navigate={navigate}
        reviewStats={reviewStats} nextLesson={nextLesson}
      />

      {/* ── ACCÈS RAPIDE ── */}
      <div style={{padding:"20px 16px 0"}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",color:C.text3,fontFamily:FONTS.ui,marginBottom:10}}>
          Accès rapide
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <QuickCard icon="guitar-pick" iconBg={C.amberL}  iconColor={C.amber}  label="Explorateur du manche" onClick={()=>navigate("explorer")}/>
          <QuickCard icon="music"       iconBg={C.pinkL}   iconColor={C.pink}   label="Jam Session"           onClick={()=>navigate("jam")}/>
          <QuickCard icon="ear"         iconBg={C.greenL}  iconColor={C.green}  label="Ear Training"          onClick={()=>navigate("ear")}/>
          <QuickCard
            icon={state.dailyChallengeDone?"trophy":"bolt"}
            iconBg={state.dailyChallengeDone?C.greenL:C.amberL}
            iconColor={state.dailyChallengeDone?C.green:C.amber}
            label={state.dailyChallengeDone?"Défi terminé ✓":"Défi du jour"}
            done={state.dailyChallengeDone}
            onClick={()=>navigate("challenge")}
          />
          <QuickCard icon="clock" iconBg={C.blueL} iconColor={C.blue} label="Boîte à outils" onClick={()=>navigate("toolbox")}/>
        </div>
      </div>

      {/* ── DERNIÈRES SESSIONS ── */}
      {state.sessionHistory?.length>0&&(
        <div style={{padding:"0 16px"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",color:C.text3,fontFamily:FONTS.ui,marginBottom:10}}>
            Dernières sessions
          </div>
          {state.sessionHistory.slice(0,3).map((sess,i)=>(
            <div key={i} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:R.lg,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{width:38,height:38,borderRadius:R.md,background:C.greenL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ti name="check" size={16} color={C.green}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.text}}>{sess.title}</div>
                <div style={{fontSize:11,color:C.text3,marginTop:1}}>{sess.score?`${sess.score} · `:""} +{sess.xp} XP</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{height:28}}/>
    </div>
  );
}

export { HomeScreen };
