// Groply — screens/HomeScreen.jsx  v6
// Gropi : conseil contextuel + session du jour fusionnés en un seul bloc
import { useState, useMemo, useEffect } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar } from "../design/ui.jsx";
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

// ── Gropi SVG inline (pose wave) ─────────────────────────────────────────────
function GropiWave({ size=80 }) {
  return (
    <svg viewBox="0 0 200 230" width={size} height={Math.round(size*1.15)}
         style={{display:"block",flexShrink:0}} aria-hidden="true">
      <defs>
        <linearGradient id="gb-hw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFA45E"/><stop offset="1" stopColor="#E85D1A"/>
        </linearGradient>
      </defs>
      <ellipse cx="78" cy="207" rx="14" ry="9" fill="#C2490E"/>
      <ellipse cx="122" cy="207" rx="14" ry="9" fill="#C2490E"/>
      <path d="M56 120 L42 142" stroke="#E2560F" strokeWidth="15" strokeLinecap="round"/>
      <path d="M146 112 L166 84" stroke="#E2560F" strokeWidth="15" strokeLinecap="round"/>
      {[13,22].map(y=>[81,119].map(x=><circle key={x+"-"+y} cx={x} cy={y} r="3.6" fill="#FFDDC0"/>))}
      <rect x="86" y="4" width="28" height="27" rx="9" fill="#B5430C"/>
      <rect x="91" y="24" width="18" height="36" fill="#C2490E"/>
      {[34,43,52].map(y=><line key={y} x1="91" y1={y} x2="109" y2={y} stroke="#E89055" strokeWidth="2"/>)}
      {[95.5,100,104.5].map(x=><line key={x} x1={x} y1="25" x2={x} y2="59" stroke="#FFE6CC" strokeWidth="1.4"/>)}
      <path d="M100 54 C76 54 60 66 56 88 C54 100 50 105 50 122 C50 168 70 200 100 200 C130 200 150 168 150 122 C150 105 146 100 144 88 C140 66 124 54 100 54 Z" fill="url(#gb-hw)"/>
      <path d="M100 116 C127 116 141 133 141 152 C141 178 122 195 100 195 C78 195 59 178 59 152 C59 133 73 116 100 116 Z" fill="#FFE9D8"/>
      <circle cx="100" cy="131" r="17.5" fill="none" stroke="#F4B98F" strokeWidth="2.6"/>
      <ellipse cx="57" cy="104" rx="8.5" ry="5.5" fill="#FF9E6B" opacity=".7"/>
      <ellipse cx="143" cy="104" rx="8.5" ry="5.5" fill="#FF9E6B" opacity=".7"/>
      <ellipse cx="76" cy="88" rx="12.5" ry="14.5" fill="#fff"/>
      <ellipse cx="124" cy="88" rx="12.5" ry="14.5" fill="#fff"/>
      <circle cx="78" cy="90" r="6.2" fill="#2B1608"/><circle cx="122" cy="90" r="6.2" fill="#2B1608"/>
      <circle cx="75.5" cy="85" r="2.1" fill="#fff"/><circle cx="119.5" cy="85" r="2.1" fill="#fff"/>
      <path d="M62 68 Q76 61 90 67" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
      <path d="M110 67 Q124 61 138 68" fill="none" stroke="#7A2E08" strokeWidth="4" strokeLinecap="round"/>
      <path d="M86 126 Q100 139 114 126" fill="none" stroke="#7A2E08" strokeWidth="5" strokeLinecap="round"/>
    </svg>
  );
}

// ── Bloc Gropi fusionné : conseil + session du jour + CTA unique ─────────────
function GropiBlock({ state, dispatch, navigate, reviewStats, nextLesson }) {
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
        padding:"28px 20px 22px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",inset:0,background:"rgba(160,55,0,.5)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"absolute",top:-30,right:-35,width:130,height:130,background:"rgba(255,255,255,.08)",borderRadius:"50%",pointerEvents:"none"}}/>

        {/* Logo */}
        <div style={{position:"absolute",top:28,left:"58%",transform:"translateX(-50%)",zIndex:4,display:"flex",alignItems:"center",gap:6}}>
          <img src="/logo.svg" alt="Groply" style={{height:46,width:"auto",filter:"brightness(0) invert(1)",opacity:.92}}/>
          <span style={{fontSize:24,fontWeight:800,color:"#fff",letterSpacing:".5px",opacity:.92,fontFamily:"'Nunito',sans-serif"}}>Groply</span>
        </div>

        {/* Guitare */}
        <img src="/guitar.webp" alt="" aria-hidden="true" style={{
          position:"absolute",right:10,top:"50%",transform:"translateY(-50%) rotate(6deg)",
          height:290,width:"auto",zIndex:1,mixBlendMode:"multiply",
          filter:"brightness(1) saturate(1.1) contrast(1.1)",
          WebkitMaskImage:"radial-gradient(ellipse 90% 95% at 50% 55%,black 55%,transparent 100%)",
          maskImage:"radial-gradient(ellipse 90% 95% at 50% 55%,black 55%,transparent 100%)",
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
