// Groply — screens/HomeScreen.jsx  v7
// Gropi : conseil contextuel + session du jour fusionnés en un seul bloc
// v7 : courbe d'XP centralisée (leveling.js), objectifs hebdo, gels de série
import { useState, useMemo, useEffect } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar } from "../design/ui.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { getReviewStats } from "../store/reviewEngine.js";
import { getNextLesson } from "../store/pathEngine.js";
import { levelProgress } from "../store/leveling.js";
import { weekStr } from "../store/state.js";

// ── Conseils contextuels ─────────────────────────────────────────────────────
const GROPI_TIPS = [
  // ── Contextuel (prioritaire, condition spécifique à l'état du joueur) ──────
  { type:"progress", cond:(s,rs)=>rs.toReview>=10,   text:(_,rs)=>`Tu as ${rs.toReview} questions qui attendent d'être revues. La mémoire s'efface vite, c'est le bon moment pour les reprendre.` },
  { type:"progress", cond:(s)=>s.streak===0&&Object.keys(s.completedLessons||{}).length>0, text:()=>"Ta série est retombée à zéro. Tu es là, c'est déjà l'essentiel : rallume-la aujourd'hui." },
  { type:"progress", cond:(s)=>s.streak>=7,           text:(s)=>`${s.streak} jours d'affilée. La régularité, c'est 80 % du chemin, continue comme ça.` },
  { type:"progress", cond:(s)=>s.streak>=3,           text:(s)=>`Série de ${s.streak} jours. Tu construis une vraie habitude, ne la casse pas maintenant.` },
  { type:"progress", cond:(s)=>s.level>=3&&levelProgress(s.xp).xpInLevel<30, text:()=>"Tu viens de passer un niveau. C'est le bon moment pour tenter quelque chose de nouveau." },
  { type:"progress", cond:(s)=>Object.keys(s.completedLessons||{}).length===0, text:()=>"Commence par une leçon : 10 minutes aujourd'hui valent mieux qu'une heure dimanche." },
  { type:"tip",      cond:()=>new Date().getDay()===1, text:()=>"Lundi est un bon jour pour revoir la semaine passée avant d'avancer." },
  { type:"tip",      cond:()=>new Date().getDay()===5, text:()=>"Vendredi soir et guitare, ça marche bien ensemble. 15 minutes de Jam pour finir la semaine sur une bonne note." },

  // ── Rappels de progression (toujours éligibles, piochent dans les vraies stats) ──
  { type:"progress", cond:(s)=>Object.keys(s.completedLessons||{}).length>=1, text:(s)=>`${Object.keys(s.completedLessons).length} leçon${Object.keys(s.completedLessons).length>1?"s":""} déjà complétée${Object.keys(s.completedLessons).length>1?"s":""}. Chaque leçon ajoute une pierre à l'édifice, même les plus courtes.` },
  { type:"progress", cond:(s)=>(s.unlockedBadges||[]).length>=1, text:(s)=>`${s.unlockedBadges.length} badge${s.unlockedBadges.length>1?"s":""} débloqué${s.unlockedBadges.length>1?"s":""}. Va voir ta collection dans l'onglet Progrès, ça fait toujours plaisir.` },
  { type:"progress", cond:(s)=>(s.dailyChallengeCount||0)>=3, text:(s)=>`${s.dailyChallengeCount} défis du jour relevés. C'est ce genre de petite régularité qui construit une vraie oreille.` },

  // ── Conseils pratiques (toujours éligibles) ──────────────────────────────
  { type:"tip", cond:()=>true, text:()=>"Accorde-toi avant de jouer. 30 secondes qui évitent de fausser toute la session." },
  { type:"tip", cond:()=>true, text:()=>"Entre cordes 3 et 2, le décalage est de 4 cases, pas 5. C'est la cassure du manche, un repère à retenir par cœur." },
  { type:"tip", cond:()=>true, text:()=>"Vise la tierce de chaque accord quand tu improvises : c'est elle qui raconte l'histoire." },
  { type:"tip", cond:()=>true, text:()=>"Le silence fait partie de la musique. Laisser respirer une phrase la rend souvent plus puissante." },
  { type:"tip", cond:()=>true, text:()=>"Joue lentement, puis accélère. Un tempo lent parfait vaut mieux qu'un tempo rapide raté." },
  { type:"tip", cond:()=>true, text:()=>"La pentatonique mineure position 1 fonctionne sur 90 % des jams en mineur. Maîtrise-la d'abord." },
  { type:"tip", cond:()=>true, text:()=>"Le mode dorien est un mineur naturel avec une 6te majeure. C'est la gamme de Santana ou de Daft Punk, écoute-les différemment." },

  // ── Anecdotes musicales (faits historiques vérifiables, jamais de paroles) ──
  { type:"anecdote", cond:()=>true, text:()=>"Le riff de 'Smoke on the Water' (Deep Purple) est né d'un incendie bien réel : un concert de Frank Zappa à Montreux qui a pris feu en 1971, sous les yeux du groupe." },
  { type:"anecdote", cond:()=>true, text:()=>"Jimi Hendrix était gaucher, mais jouait souvent sur une Stratocaster de droitier simplement retournée, cordes replacées à l'envers." },
  { type:"anecdote", cond:()=>true, text:()=>"Le riff d'intro de 'Stairway to Heaven' est tellement rejoué en magasin de musique qu'il a inspiré une scène culte de 'Wayne's World' où un panneau l'interdit carrément." },
  { type:"anecdote", cond:()=>true, text:()=>"B.B. King a appelé toutes ses guitares 'Lucille', en souvenir d'un incendie qu'il a fui de justesse pendant un concert." },
  { type:"anecdote", cond:()=>true, text:()=>"Eddie Van Halen a popularisé le tapping à deux mains sur 'Eruption' — une technique que très peu de guitaristes utilisaient avant lui à ce niveau." },
  { type:"anecdote", cond:()=>true, text:()=>"La gamme pentatonique n'est pas née en Occident : on la retrouve, inventée indépendamment, dans les musiques traditionnelles chinoise, africaine et amérindienne." },
  { type:"anecdote", cond:()=>true, text:()=>"Keith Richards joue une bonne partie des riffs des Rolling Stones en accordage ouvert de Sol, sur une guitare à seulement 5 cordes (sans le Mi grave)." },
  { type:"anecdote", cond:()=>true, text:()=>"Brian May (Queen) a construit sa guitare légendaire, la 'Red Special', avec son père — en partie à partir de bois de cheminée récupéré." },
  { type:"anecdote", cond:()=>true, text:()=>"Le blues à 12 mesures est la structure la plus reprise de l'histoire du rock : des milliers de morceaux, du blues au rock'n'roll, s'appuient sur elle." },
  { type:"anecdote", cond:()=>true, text:()=>"Slash a enregistré le riff de 'Sweet Child O' Mine' sur une copie de Gibson Les Paul, avant même de pouvoir s'offrir une vraie." },
];

// Libellé affiché selon le type de conseil piché ce jour-là.
const TIP_LABELS = { tip:"Conseil de Gropi", anecdote:"Anecdote musicale", progress:"Ta progression" };

function pickTip(state, rs) {
  // Rotation par jour du mois parmi les conseils éligibles aujourd'hui : le
  // même jour montre toujours le même conseil (cohérent si on ne le ferme
  // pas), mais un autre jour pioche ailleurs dans le pool — au lieu de
  // toujours retomber sur le premier de la liste comme avant.
  const dayIdx = new Date().getDate();
  const contextual = GROPI_TIPS.filter(t=>t.cond(state,rs));
  if (contextual.length === 0) return { type:"tip", text:"Gropi est là pour toi." };
  const picked = contextual[dayIdx % contextual.length];
  return { type: picked.type, text: picked.text(state,rs) };
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
    [state.xp,state.streak,state.level,reviewStats.toReview,
     Object.keys(state.completedLessons||{}).length,
     (state.unlockedBadges||[]).length,
     state.dailyChallengeCount]);

  // Session steps
  const steps = useMemo(()=>{
    const s=[];
    if(reviewStats.toReview>0) s.push({
      icon:"refresh", color:C.pink,
      label:"Révision intelligente",
      sub:`${reviewStats.toReview} question${reviewStats.toReview>1?"s":""} à revoir`,
      dur:"5 min", action:"review",
    });
    if(nextLesson?.lesson) s.push({
      icon:"book-2", color:C.green,
      label:nextLesson.lesson.title,
      sub:nextLesson.course.title,
      dur:`${nextLesson.lesson.duration} min`, action:"courses",
    });
    else if(nextLesson?.needsCheck) s.push({
      icon:"clipboard-check", color:C.primary,
      label:"Vérifier ton unité",
      sub:"Toutes les leçons sont vues, il ne reste que le contrôle",
      dur:"5 min", action:"courses",
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

  return (
    <div style={{
      margin:"14px 16px 0",
      background:C.surface,
      border:`1.5px solid ${C.primaryBorder}`,
      borderRadius:22,
      overflow:"hidden",
      boxShadow:`0 4px 20px ${C.primary}18`,
    }}>
      {/* ── Partie haute : Gropi + conseil — masquée pour la journée une fois
          fermée, mais la session du jour en dessous reste toujours visible :
          c'est un raccourci fonctionnel (révision, prochaine leçon), pas
          juste un message de passage, il ne doit jamais disparaître avec. ── */}
      {!dismissed && (
        <>
          <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"14px 14px 12px"}}>
            <GropiWave size={76}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{
                fontSize:9,fontWeight:700,letterSpacing:".1em",
                textTransform:"uppercase",color:C.primaryD,
                fontFamily:FONTS.ui,marginBottom:5,
              }}>{TIP_LABELS[tip.type] || "Conseil de Gropi"} · aujourd'hui</div>
              <p style={{
                margin:0,fontSize:13.5,lineHeight:1.55,
                fontWeight:500,color:C.text,fontFamily:FONTS.body,
              }}>{tip.text}</p>
            </div>
            <button
              onClick={()=>dispatch({type:"DISMISS_GROPI_TIP"})}
              aria-label="Fermer le conseil du jour"
              style={{
                background:"none",border:"none",cursor:"pointer",
                color:C.text3,fontSize:16,fontWeight:600,
                fontFamily:FONTS.ui,padding:"0 2px",flexShrink:0,lineHeight:1,
              }}>✕</button>
          </div>
          <div style={{borderTop:`1px dashed ${C.primaryBorder}`,margin:"0 14px"}}/>
        </>
      )}
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

// ── Objectifs de la semaine ───────────────────────────────────────────────────
// Ces compteurs étaient déjà alimentés par tous les écrans (UPDATE_WEEKLY)
// mais n'étaient affichés nulle part. Les objectifs sont volontairement
// atteignables : la régularité prime sur le volume.
const WEEKLY_TARGETS = { sessions: 5, exercises: 8, quizzes: 12 };

function WeeklyGoals({ state }) {
  const C = useC();
  const currentWeek = weekStr();
  // Si la semaine stockée n'est plus la courante, tout repart à zéro à l'affichage
  const g = state.weeklyGoals?.week === currentWeek
    ? state.weeklyGoals
    : { sessions: 0, exercises: 0, quizzes: 0 };

  const rows = [
    { key: "sessions",  label: "Sessions de pratique", icon: "player-play",  color: C.primary },
    { key: "exercises", label: "Exercices",            icon: "guitar-pick",  color: C.green   },
    { key: "quizzes",   label: "Quiz",                 icon: "help-circle",  color: C.amber   },
  ];
  const allDone = rows.every(r => (g[r.key] || 0) >= WEEKLY_TARGETS[r.key]);

  return (
    <div style={{margin:"16px 16px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:9}}>
        <span style={{fontSize:11,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase",color:C.text3,fontFamily:FONTS.ui}}>
          Objectifs de la semaine
        </span>
        {allDone && (
          <span style={{fontSize:10,fontWeight:700,color:C.green,fontFamily:FONTS.ui}}>Semaine réussie</span>
        )}
      </div>
      <div style={{
        background:C.surface,border:`1.5px solid ${allDone?C.greenBorder:C.border}`,
        borderRadius:R.lg,padding:"12px 14px",
      }}>
        {rows.map((r,i)=>{
          const done   = g[r.key] || 0;
          const target = WEEKLY_TARGETS[r.key];
          const hit    = done >= target;
          return (
            <div key={r.key} style={{
              display:"flex",alignItems:"center",gap:10,
              padding:i>0?"9px 0 0":"0",
              marginTop:i>0?9:0,
              borderTop:i>0?`1px dashed ${C.border}`:"none",
            }}>
              <Ti name={hit?"circle-check":r.icon} size={15} color={hit?C.green:r.color}/>
              <span style={{flex:1,fontSize:12.5,fontWeight:600,color:C.text}}>{r.label}</span>
              <div style={{width:72}}>
                <ProgressBar pct={Math.min(100,(done/target)*100)} color={hit?C.green:r.color} h={5}/>
              </div>
              <span style={{fontSize:11.5,fontWeight:700,color:hit?C.green:C.text2,minWidth:36,textAlign:"right"}}>
                {Math.min(done,target)}/{target}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Écran principal ───────────────────────────────────────────────────────────
function HomeScreen({state,dispatch,navigate,content}) {
  const C = useC();
  const { xpInLevel, xpNeeded, pct: lvlPct, xpToNext } = levelProgress(state.xp);

  const reviewStats = useMemo(()=>{
    if(!content.quiz) return {toReview:0,eligible:0,pctMastered:0,mastered:0};
    return getReviewStats(content.quiz,state.reviewHistory||{},state.completedLessons);
  },[content.quiz,state.reviewHistory,state.completedLessons]);

  const nextLesson = useMemo(()=>
    // Suit l'ordre du Parcours (unités débloquées) — cohérent avec l'onglet Parcours
    getNextLesson(content, state),
  [content,state.completedLessons,state.claimedUnits]);

  const dateStr = new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{
        backgroundColor:"#995a36", backgroundImage:"url('/alhambra.jpg')",
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
            <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:18,letterSpacing:"-.3px"}}>Bonjour</div>
            {nextLesson?.lesson ? (
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
            ) : nextLesson?.needsCheck ? (
              <button onClick={()=>navigate("courses")} style={{
                width:"100%",background:"rgba(255,255,255,.18)",
                border:"1.5px solid rgba(255,255,255,.28)",
                borderRadius:R.lg,padding:"14px 16px",
                backdropFilter:"blur(6px)",cursor:"pointer",textAlign:"left",fontFamily:FONTS.title,
              }}>
                <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,.7)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>Prochain objectif</div>
                <div style={{fontSize:15,fontWeight:800,color:"#fff",letterSpacing:"-.2px",marginBottom:4}}>Vérifier ton unité</div>
                <div style={{fontSize:11,fontWeight:500,color:"rgba(255,255,255,.7)",marginBottom:12}}>Toutes les leçons sont vues, il ne reste que le contrôle</div>
                <span style={{display:"inline-flex",alignItems:"center",gap:7,background:"#fff",color:C.primary,borderRadius:99,padding:"8px 16px",fontSize:13,fontWeight:700}}>
                  <Ti name="clipboard-check" size={13} color={C.primary}/>Continuer
                </span>
              </button>
            ):(
              <div style={{background:"rgba(255,255,255,.18)",border:"1.5px solid rgba(255,255,255,.28)",borderRadius:R.lg,padding:"16px 18px",backdropFilter:"blur(6px)"}}>
                <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>Tout est complété</div>
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
          {v:`${state.streak}🔥`,l:(state.streakFreezes||0)>0?`Série · ${state.streakFreezes}❄️`:"Série",color:C.primaryD},
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
          <span style={{fontSize:12,fontWeight:600,color:C.primary}}>{xpInLevel} / {xpNeeded} XP</span>
        </div>
        <div style={{height:8,background:C.border,borderRadius:99,overflow:"hidden"}}>
          <div style={{width:`${lvlPct}%`,height:"100%",background:`linear-gradient(90deg,#FF9155,${C.primary})`,borderRadius:99,transition:"width .4s ease"}}/>
        </div>
        <div style={{fontSize:11,color:C.text3,marginTop:4}}>{xpToNext} XP pour le niveau {state.level+1}</div>
      </div>

      {/* ── OBJECTIFS HEBDO ── */}
      <WeeklyGoals state={state}/>

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
