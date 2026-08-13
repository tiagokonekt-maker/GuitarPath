// Groply — screens/CoursesScreen.jsx  v7 — LE PARCOURS
// L'onglet Cours devient un parcours unique et continu : les modules sont
// découpés en unités de 3-4 leçons entrelacées en spirale (pathEngine.js).
// Déverrouillage par groupe : toutes les leçons d'une unité ouverte sont
// accessibles ; l'unité suivante s'ouvre quand la précédente est complète.
// Fin d'unité : un coffre de +40 XP à réclamer.
import { useState, useMemo, useEffect, useRef } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { buildModuleTheme } from "../store/moduleTheme.js";
import { buildPath, getPathStats, UNIT_BONUS_XP } from "../store/pathEngine.js";
import { UnitCheckScreen } from "./UnitCheckScreen.jsx";
import { Gropi, GropiCoach, GropiBubble } from "../design/Gropi.jsx";

// ── Composants de rendu injectés par contexte ─────────────────────────────
// Avant, App.jsx MUTAIT ce module au démarrage (`setXxx(...)`) : un singleton
// mutable au niveau module, avec des gardes défensives qui trahissaient la
// fragilité — si un écran se rendait avant l'injection, le composant valait
// null. Un contexte React rend l'ordre de rendu sans importance.
import { useRenderers } from "../renderers.jsx";
import { playLessonComplete, playChestOpen } from "../audioEngine.js";

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
  @keyframes chest-bounce {
    0%, 100% { transform:translateY(0); }
    50%      { transform:translateY(-5px); }
  }
`;

// ── Nœud individuel ───────────────────────────────────────────────────────────
// ── Tracé du chemin ───────────────────────────────────────────────────────────
// L'ancienne version alternait strictement gauche / droite (`index % 2`), ce
// qui donnait un zigzag parfaitement régulier : joli une fois, monotone sur
// 100 leçons, et surtout ça ne ressemble pas à un chemin.
//
// Ici on garde le principe du serpentin — indispensable en mobile-first, il
// faut que le doigt suive une ligne lisible et que rien ne sorte des 440 px
// de large — mais on introduit deux variations :
//
//   • le CÔTÉ suit un motif de 7 (au lieu de 2), qui inclut deux positions
//     centrales : le chemin passe parfois par le milieu au lieu de rebondir
//     systématiquement d'un bord à l'autre ;
//   • le DÉCALAGE horizontal varie de quelques pixels par nœud.
//
// Le tout est DÉTERMINISTE : dérivé de l'identifiant de la leçon, pas de
// Math.random(). Un tracé qui changerait à chaque rendu — ou au retour d'une
// leçon — serait désorientant, et casserait la mémoire visuelle du parcours
// (« ma prochaine leçon est celle en bas à droite »).

/** Hash entier stable à partir d'une chaîne (FNV-1a, 32 bits). */
function hashId(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

// Motif de côtés sur 7 positions. Les deux "center" sont ce qui casse le
// zigzag mécanique ; le motif reste équilibré (3 gauche, 2 centre, 2 droite)
// pour que le chemin ne dérive pas d'un côté sur une longue unité.
const SIDE_PATTERN = ["left", "right", "center", "right", "left", "center", "left"];

/**
 * Position d'un nœud : côté + décalage horizontal.
 * `unitId` entre dans le hash pour que deux unités de même longueur n'aient
 * pas exactement le même dessin.
 */
function nodeLayout(lessonId, unitId, index) {
  const h = hashId(`${unitId}:${lessonId}`);
  // Décalage du motif propre à chaque unité : le serpentin ne repart pas
  // toujours du même pied.
  const offset = h % SIDE_PATTERN.length;
  const side = SIDE_PATTERN[(index + offset) % SIDE_PATTERN.length];
  // Dérive horizontale de 0 à 15 px. Volontairement modeste : au-delà, sur
  // un écran de 390 px, les cartes de titre commencent à se décaler
  // visiblement et le chemin devient brouillon.
  const drift = (h >> 8) % 16;
  return { side, drift };
}

/** Position horizontale (en %) du centre d'un nœud, pour tracer le lien. */
function sideToX(side, drift) {
  const base = side === "left" ? 21 : side === "right" ? 79 : 50;
  // La dérive pousse vers le centre, jamais vers l'extérieur : on ne risque
  // pas de sortir du cadre.
  const towardCenter = side === "left" ? +1 : side === "right" ? -1 : (drift % 2 ? +1 : -1);
  return base + towardCenter * (drift / 3.2);
}

function PathNode({ lesson, index, state, th, onSelect, isCurrent, isLocked, gropiTip, layout }) {
  const C = useC();
  const done = !!state.completedLessons[lesson.id];
  const { side, drift } = layout;
  // Les bulles de titre et Gropi ne peuvent pas être "centrées" sans casser
  // la lisibilité : on les rabat sur le bord le plus proche.
  const textSide = side === "center" ? (drift % 2 ? "left" : "right") : side;

  let bg, border, iconEl;
  if(done)         { bg=th.colorL;    border=th.color;   iconEl=<Ti name="check" size={isCurrent?22:18} color={th.color}/>; }
  else if(isCurrent){ bg=C.primaryL;  border=C.primary;  iconEl=<Ti name="player-play" size={22} color={C.primary}/>; }
  else if(isLocked) { bg=C.surface2;  border=C.border;   iconEl=<Ti name="lock" size={16} color={C.text3}/>; }
  else              { bg=C.surface;   border=th.color;   iconEl=<Ti name="book-2" size={17} color={th.color}/>; } // disponible dans l'unité ouverte

  const sz = isCurrent ? 64 : 54;

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems: side==="left" ? "flex-start" : side==="right" ? "flex-end" : "center",
      width:"100%",
      // Le décalage vient s'ajouter au retrait de bord : c'est lui qui donne
      // l'irrégularité, sans jamais pousser vers l'extérieur du cadre.
      paddingLeft:  side==="left"  ? 26 + drift : 0,
      paddingRight: side==="right" ? 26 + drift : 0,
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

      {/* Bulle d'info (leçon débloquée) — toute la carte est cliquable sur
          le nœud courant, pas seulement le petit cercle : "Commencer" était
          un simple texte décoratif sans la moindre action au clic. */}
      {!isLocked&&(
        <div
          onClick={isCurrent ? () => onSelect(lesson) : undefined}
          style={{
            marginTop:6,
            background:isCurrent?C.primaryL:C.surface,
            border:`1.5px solid ${isCurrent?C.primaryBorder:C.border}`,
            borderRadius:R.md, padding:"9px 12px",
            maxWidth:186,
            alignSelf:textSide==="left"?"flex-start":"flex-end",
            boxShadow:isCurrent?`0 4px 14px ${C.primary}22`:"none",
            cursor:isCurrent?"pointer":"default",
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

      {/* Gropi compagnon — uniquement sur le nœud en cours, cliquable
          au même titre que la carte pour accéder à la leçon. */}
      {isCurrent && (
        <div
          onClick={() => onSelect(lesson)}
          style={{ marginTop: 10, alignSelf: textSide === "left" ? "flex-start" : "flex-end", cursor: "pointer" }}
        >
          <GropiBubble
            pose="wave"
            size={68}
            tint="primary"
            eyebrow={`Gropi · ${lesson.title}`}
            side={textSide}
          >
            {gropiTip}
          </GropiBubble>
        </div>
      )}
    </div>
  );
}

// ── Coffre de fin d'unité ─────────────────────────────────────────────────────
// Remplace l'ancien checkpoint décoratif : celui-ci fait vraiment quelque chose.
// États : verrouillé (gris) → en cours (x/y) → réclamable (rebond ambré) → ouvert.
function UnitChest({ unit, th, onClaim, onCheck }) {
  const C = useC();
  const { complete, bonusClaimable, bonusClaimed, needsCheck, check, done, total, unlocked } = unit;

  let bg, border, icon, iconColor, label, anim = "none", clickable = false, action = null;
  if (bonusClaimed) {
    bg = C.greenL; border = C.greenBorder; icon = "check"; iconColor = C.green;
    label = `Coffre ouvert · +${UNIT_BONUS_XP} XP`;
  } else if (bonusClaimable) {
    bg = C.amberL; border = C.amber; icon = "gift"; iconColor = C.amber;
    label = `Ouvre ton coffre · +${UNIT_BONUS_XP} XP`;
    anim = "chest-bounce 1.2s ease-in-out infinite"; clickable = true; action = () => onClaim(unit);
  } else if (needsCheck) {
    bg = C.primaryL; border = C.primary; icon = "clipboard-check"; iconColor = C.primary;
    label = check?.attempts ? `Retenter la vérification (${check.score}%)` : "Vérifier l'unité";
    anim = "chest-bounce 1.2s ease-in-out infinite"; clickable = true; action = () => onCheck(unit);
  } else if (unlocked) {
    bg = C.surface; border = C.border; icon = "gift"; iconColor = C.text3;
    label = `Coffre · ${done}/${total} leçons`;
  } else {
    bg = C.surface2; border = C.border; icon = "lock"; iconColor = C.text3;
    label = "Coffre verrouillé";
  }

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"14px 0 8px"}}>
      <button
        onClick={()=>clickable&&action?.()}
        disabled={!clickable}
        aria-label={label}
        style={{
          width:72,height:72,borderRadius:"50%",
          background:bg, border:`2px solid ${border}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:clickable?"pointer":"default",
          opacity:(!unlocked)?.55:1,
          boxShadow:(bonusClaimable||needsCheck)?`0 6px 20px ${border}44`:"none",
          animation:anim,
        }}>
        <Ti name={icon} size={26} color={iconColor}/>
      </button>
      <div style={{
        fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",
        color:(bonusClaimable||needsCheck)?C.primaryD||C.primary:C.text3,fontFamily:FONTS.ui,marginTop:7,textAlign:"center",
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Connecteur tiretillé ──────────────────────────────────────────────────────
// Relie deux nœuds quelconques, et non plus deux bords fixes.
// L'ancienne version ne connaissait que deux tracés en dur (gauche→droite et
// droite→gauche), ce qui imposait le zigzag régulier. Ici la courbe est
// calculée entre les positions réelles des deux nœuds, ce qui permet les
// passages par le centre et les décalages.
//
// `stroke` ne doit pas être une couleur codée en dur : "#E0D8CE" restait
// clair sur le fond sombre du thème dark, d'où un chemin qui ressortait plus
// que les nœuds eux-mêmes.
function PathConnector({ from, to, done }) {
  const C = useC();
  const stroke = done ? C.green : C.border;

  const x1 = sideToX(from.side, from.drift);
  const x2 = sideToX(to.side, to.drift);

  // Hauteur du lien : un saut de bord à bord a besoin de plus de place pour
  // que la courbe reste douce ; un petit décalage se relie presque droit.
  const ecart = Math.abs(x2 - x1);
  const h = ecart < 12 ? 26 : ecart < 40 ? 34 : 42;

  // Courbe de Bézier : les points de contrôle restent sur la verticale de
  // départ et d'arrivée, ce qui donne un raccord tangent aux nœuds — le
  // chemin "sort" du nœud par le bas et "entre" dans le suivant par le haut.
  const d = `M ${x1} 0 C ${x1} ${h * 0.55}, ${x2} ${h * 0.45}, ${x2} ${h}`;

  return (
    <div style={{position:"relative",height:h,overflow:"visible"}} aria-hidden="true">
      <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none"
           style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
        <path
          d={d}
          fill="none" stroke={stroke} strokeWidth="2.5"
          strokeDasharray="6 8" strokeLinecap="round"
          // vectorEffect empêche le trait d'être étiré par le
          // preserveAspectRatio="none" : sans ça, l'épaisseur variait avec la
          // largeur de l'écran et le pointillé se déformait.
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// ── Bannière de l'unité courante ──────────────────────────────────────────────
function CurrentUnitBanner({ stats, MODULE_THEME }) {
  const C = useC();
  const u = stats.currentUnit;
  const th = u ? (MODULE_THEME.palier) : null;

  return (
    <div style={{
      background:`${C.surface}CC`,borderRadius:R.lg,
      padding:"13px 15px",display:"flex",alignItems:"center",gap:12,
      border:`1px solid ${th?`${th.color}22`:C.border}`,
      boxShadow:th?`0 4px 16px ${th.color}18`:"none",
    }}>
      <div style={{
        width:42,height:42,borderRadius:R.md,
        background:th?th.colorL:C.greenL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
        border:`1.5px solid ${th?`${th.color}44`:C.greenBorder}`,
      }}>
        <Ti name={th?th.icon.replace("ti-",""):"trophy"} size={20} color={th?th.color:C.green}/>
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:th?th.colorD:C.greenD,fontFamily:FONTS.ui}}>
          {u ? `Unité ${u.index+1} sur ${stats.units}` : "Parcours"}
        </div>
        <div style={{fontSize:15,fontWeight:800,color:th?th.colorD:C.greenD,letterSpacing:"-.2px",marginTop:2}}>
          {u ? `${u.title} · ${u.done}/${u.total} leçons` : "Parcours terminé ! 🎉"}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:9,marginTop:7}}>
          <div style={{flex:1,height:5,background:"rgba(0,0,0,.08)",borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${stats.pct}%`,height:"100%",background:th?th.color:C.green,borderRadius:99,transition:"width .4s ease"}}/>
          </div>
          <span style={{fontSize:11,fontWeight:700,color:th?th.colorD:C.greenD}}>{stats.doneLessons} / {stats.totalLessons}</span>
        </div>
      </div>
    </div>
  );
}

// ── En-tête d'unité (séparateur sur le parcours) ─────────────────────────────
function UnitHeader({ unit, th }) {
  const C = useC();
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:10,
      margin:unit.index===0?"4px 0 16px":"26px 0 16px",
    }}>
      <div style={{flex:1,height:1.5,background:unit.unlocked?`${th.color}44`:C.border}}/>
      <div style={{
        display:"flex",alignItems:"center",gap:7,
        background:unit.unlocked?th.colorL:C.surface2,
        border:`1.5px solid ${unit.unlocked?`${th.color}44`:C.border}`,
        borderRadius:999,padding:"6px 14px",
      }}>
        <Ti name={unit.unlocked?th.icon.replace("ti-",""):"lock"} size={13} color={unit.unlocked?th.color:C.text3}/>
        <span style={{
          fontSize:10,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",
          color:unit.unlocked?th.colorD:C.text3,fontFamily:FONTS.ui,
        }}>
          {unit.title}
        </span>
      </div>
      <div style={{flex:1,height:1.5,background:unit.unlocked?`${th.color}44`:C.border}}/>
    </div>
  );
}

// ── LE PARCOURS ───────────────────────────────────────────────────────────────
function CoursesScreen({ state, dispatch, content }) {
  const C = useC();
  const MODULE_THEME = buildModuleTheme(C);
  const [activeLesson, setActiveLesson] = useState(null);
  const [checkingUnit, setCheckingUnit] = useState(null);
  const [chestPop, setChestPop] = useState(false);
  const currentRef = useRef(null);
  // Identifiant de la leçon sur laquelle on a scrollé la dernière fois. Sert à
  // ne pas re-scroller à chaque rendu, tout en re-scrollant bien quand la
  // cible change — c'est-à-dire au retour d'une leçon terminée.
  const scrolledTo = useRef(null);

  // state.unitChecks manquait ici : c'est lui qui porte le resultat du
  // controle de fin d'unite (passed: true/false). Sans cette dependance,
  // React ne recalculait jamais la liste des unites apres un controle
  // reussi — le coffre restait bloque sur "a verifier", et l'unite
  // suivante ne se debloquait jamais, meme apres avoir reclame le coffre.
  const path  = useMemo(()=>buildPath(content, state),
    [content, state.completedLessons, state.claimedUnits, state.unitChecks]);
  const stats = useMemo(()=>getPathStats(content, state),
    [content, state.completedLessons, state.claimedUnits, state.unitChecks]);

  // Tracés de chemin, calculés une fois par unité. `useMemo` sur le contenu
  // seulement : le dessin ne doit PAS bouger quand la progression change,
  // sinon le parcours se réorganiserait sous les yeux à chaque leçon finie.
  const unitLayouts = useMemo(()=>{
    const out = {};
    for (const unit of path) {
      out[unit.id] = unit.lessons.map((l, i) => nodeLayout(l.id, unit.id, i));
    }
    return out;
  }, [path]);

  // Leçon courante, au niveau de l'écran : c'est la cible du scroll.
  const currentLessonIdGlobal = useMemo(()=>{
    const u = path.find(x => x.isCurrent);
    return u ? (u.lessons.find(l => !state.completedLessons[l.id])?.id ?? null) : null;
  }, [path, state.completedLessons]);

  // Auto-scroll vers la leçon courante.
  //
  // Avant, un `scrolledOnce` passait à true au premier scroll et n'était
  // jamais remis à zéro : au retour d'une leçon, on retombait donc là où la
  // page avait été laissée — c'est-à-dire au-dessus de la leçon suivante,
  // qu'il fallait aller chercher en descendant. C'est le comportement que tu
  // as signalé.
  //
  // Maintenant on mémorise SUR QUELLE leçon on a scrollé. Quand la leçon
  // courante change (donc quand on vient d'en terminer une), la cible ne
  // correspond plus et on recadre. Aucun scroll parasite pendant la
  // consultation d'une leçon, et aucun scroll répété si rien n'a bougé.
  useEffect(()=>{
    if (activeLesson || checkingUnit) return;
    if (!currentLessonIdGlobal) return;
    if (scrolledTo.current === currentLessonIdGlobal) return;

    // Court délai : le nœud doit être monté et mesuré avant qu'on cadre
    // dessus, sinon scrollIntoView vise une position qui va encore changer.
    const t = setTimeout(()=>{
      currentRef.current?.scrollIntoView({
        behavior: scrolledTo.current === null ? "auto" : "smooth",
        block: "center",
      });
      scrolledTo.current = currentLessonIdGlobal;
    }, 120);
    return ()=>clearTimeout(t);
  }, [activeLesson, checkingUnit, currentLessonIdGlobal]);

  const claimChest = (unit) => {
    try { playChestOpen(); } catch { /* jamais bloquant */ }
    try { navigator.vibrate?.([15, 50, 25, 50, 35]); } catch { /* non supporté */ }
    // L'XP du coffre est proportionnelle à la taille de l'unité (unit.bonusXp),
    // et non plus une constante de 40 XP : 4 leçons et 15 leçons ne méritent
    // pas la même récompense.
    dispatch({ type:"CLAIM_UNIT_BONUS", unitId:unit.id, xp:unit.bonusXp ?? UNIT_BONUS_XP,
               title:`Coffre — ${unit.title}` });
    setChestPop(true);
    setTimeout(()=>setChestPop(false), 1400);
  };

  if(activeLesson) return (
    <LessonView lesson={activeLesson} state={state} dispatch={dispatch}
      onBack={()=>setActiveLesson(null)}/>
  );

  if(checkingUnit) return (
    <UnitCheckScreen unit={checkingUnit} content={content} dispatch={dispatch}
      state={state} onDone={()=>setCheckingUnit(null)}/>
  );

  return (
    <div>
      <style>{PULSE_CSS}</style>
      {chestPop && <XPPop amount={UNIT_BONUS_XP} onDone={()=>{}}/>}

      {/* ── En-tête ── */}
      <div style={{
        backgroundColor:"#613878", backgroundImage:"url('/lavender.jpg')",
        backgroundSize:"cover",backgroundPosition:"center 60%",
        padding:"26px 20px 18px",position:"relative",overflow:"hidden",
      }}>
        <div style={{position:"absolute",inset:0,background:"rgba(60,20,100,.52)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-.4px"}}>Parcours</div>
          <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,.78)",marginTop:2,marginBottom:14}}>
            {stats.units} unités · {stats.totalLessons} leçons · {stats.pct}%
          </div>
          <CurrentUnitBanner stats={stats} MODULE_THEME={MODULE_THEME}/>
        </div>
      </div>

      {/* ── Légende ── */}
      <div style={{display:"flex",gap:14,padding:"12px 20px 4px",flexWrap:"wrap"}}>
        {[
          {color:C.primary,          label:"En cours"},
          {color:C.primary,          label:"À vérifier"},
          {color:C.green,            label:"Complétée"},
          {color:C.amber,            label:"Coffre"},
          {color:C.text3,            label:"Verrouillée"},
        ].map(({color,label})=>(
          <span key={label} style={{display:"flex",alignItems:"center",gap:5,fontSize:9,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",color:C.text3}}>
            <span style={{width:9,height:9,borderRadius:"50%",background:color,display:"inline-block"}}/>
            {label}
          </span>
        ))}
      </div>

      {/* ── Le parcours ── */}
      <div style={{padding:"8px 20px 40px"}}>
        {path.map(unit=>{
          const th = MODULE_THEME.palier;
          // Leçon courante = première non complétée de l'unité courante
          const currentLessonId = unit.isCurrent
            ? (unit.lessons.find(l=>!state.completedLessons[l.id])?.id ?? null)
            : null;

          return (
            <div key={unit.id}>
              <UnitHeader unit={unit} th={th}/>

              {unit.lessons.map((lesson,li)=>{
                const isCurrent = lesson.id===currentLessonId;
                // Position de ce nœud et du précédent : le connecteur a besoin
                // des deux pour tracer sa courbe.
                const lay     = unitLayouts[unit.id][li];
                const prevLay = li===0 ? null : unitLayouts[unit.id][li-1];

                // Tip contextuel de Gropi sur le nœud en cours
                let gropiTip = null;
                if (isCurrent) {
                  if (lesson.gropiTip) {
                    gropiTip = lesson.gropiTip;            // tip rédigé dans content.js
                  } else {
                    const remaining = unit.total - unit.done;
                    gropiTip = remaining > 1
                      ? `Plus que ${remaining} leçons avant la vérification de l'unité ${unit.index+1}. Tu peux les faire dans l'ordre que tu veux.`
                      : `Dernière leçon de l'unité. La vérification t'attend juste après, tu es prêt.`;
                  }
                }

                return (
                  <div key={lesson.id} ref={isCurrent?currentRef:null}>
                    {li>0&&(
                      <PathConnector
                        from={prevLay} to={lay}
                        done={!!state.completedLessons[unit.lessons[li-1].id]}
                      />
                    )}
                    <PathNode
                      lesson={lesson} index={li}
                      state={state} th={th}
                      onSelect={setActiveLesson}
                      isCurrent={isCurrent}
                      isLocked={!unit.unlocked}
                      gropiTip={gropiTip}
                      layout={lay}
                    />
                  </div>
                );
              })}

              {/* Connecteur → coffre. Le coffre est centré, donc l'arrivée
                  est au milieu quelle que soit la position du dernier nœud. */}
              <PathConnector
                from={unitLayouts[unit.id][unit.lessons.length-1]}
                to={{ side:"center", drift:0 }}
                done={unit.complete}
              />
              <UnitChest unit={unit} th={th} onClaim={claimChest} onCheck={setCheckingUnit}/>
            </div>
          );
        })}

        {/* Fin du parcours */}
        {stats.pct===100&&(
          <div style={{textAlign:"center",marginTop:20}}>
            <Gropi pose="celebrate" size={130} anim="cheer" style={{margin:"0 auto"}}/>
            <div style={{fontSize:17,fontWeight:800,color:C.greenD,marginTop:8,letterSpacing:"-.2px"}}>
              Parcours complété ! 🎉
            </div>
            <div style={{fontSize:12,color:C.text2,marginTop:4}}>
              Continue avec les révisions, la Jam et les défis pour entretenir tout ça.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Contenu d'une leçon ───────────────────────────────────────────────────────
function LessonView({ lesson, state, dispatch, onBack }) {
  const { renderDiagramBlock, FretboardLesson } = useRenderers();
  const C = useC();
  const [done,setDone] = useState(!!state.completedLessons[lesson.id]);
  const [pop, setPop]  = useState(false);
  const popTimerRef = useRef(null);

  // Toujours remonter en haut à l'ouverture d'une leçon. LessonView n'a pas
  // de key unique par leçon (App passe juste activeLesson en prop) : React
  // peut donc réutiliser la même instance sans la remonter si on change de
  // leçon sans repasser par le Parcours. Un scroll au seul montage ne
  // suffirait pas — la dépendance sur lesson.id garantit que ça se
  // redéclenche à chaque changement de leçon, remontage ou pas.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [lesson.id]);

  useEffect(() => () => { if (popTimerRef.current) clearTimeout(popTimerRef.current); }, []);

  const finish = () => {
    if(!done) {
      setPop(true);
      // Petite fioriture de guitare en même temps que Gropi apparaît.
      // playLessonComplete() ne déclenche PAS le chargement des samples : si
      // l'audio n'est pas déjà en mémoire, elle ne fait rien et renvoie false.
      // Télécharger plusieurs mégaoctets pour un jingle de 400 ms serait
      // absurde, surtout en 4G — la récompense sonore est un bonus, pas un
      // prérequis.
      try { playLessonComplete(); } catch { /* jamais bloquant */ }
      // Vibration courte : sur mobile, l'écran est souvent hors du champ de
      // vision (guitare dans les mains), le retour haptique porte autant que
      // l'animation.
      try { navigator.vibrate?.([12, 40, 18]); } catch { /* non supporté */ }
      dispatch({type:"COMPLETE_LESSON",id:lesson.id,title:lesson.title});
      dispatch({type:"MARK_STREAK"});
      dispatch({type:"UPDATE_WEEKLY",field:"sessions"});
      setDone(true);
      popTimerRef.current = setTimeout(()=>setPop(false),1000);
    }
  };

  return (
    <div>
      {pop&&<XPPop amount={30} onDone={()=>{}}/>}
      <div style={{padding:"14px 20px 0",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:R.sm,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <Ti name="arrow-left" size={17} color={C.text}/>
        </button>
        <span style={{fontSize:13,fontWeight:600,color:C.text2,fontFamily:FONTS.ui}}>Retour au parcours</span>
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
              <div key={i} style={{textAlign:"center"}}>
                <img src={b.src} alt={b.alt||""} style={{maxWidth:"56%",maxHeight:150,width:"auto",height:"auto",margin:"0 auto",display:"block"}}/>
                {b.caption&&<p style={{fontSize:12,color:C.text3,marginTop:8,fontStyle:"italic"}}>{b.caption}</p>}
              </div>
            );
            if(b.type==="ref") return <GropiCoach key={i} variant="ref">{b.text}</GropiCoach>;
            const diagram = renderDiagramBlock?renderDiagramBlock(b,i):null;
            if(diagram) return diagram;
            if(b.type==="fretboard_interactive"&&FretboardLesson) return <div key={i}><FretboardLesson block={b}/></div>;
            // Paragraphe avec illustration détourée à côté : le texte habille
            // l'image (float), donc aucune coupure dans la lecture. overflow
            // hidden contient le float pour qu'il ne déborde pas sur le bloc
            // suivant quand le paragraphe est plus court que l'image.
            if(b.img) return (
              <div key={i} style={{overflow:"hidden"}}>
                <img src={b.img} alt={b.imgAlt||""} style={{
                  float:b.imgSide==="left"?"left":"right",
                  width:"34%", maxWidth:124, height:"auto",
                  margin:b.imgSide==="left"?"0 14px 4px 0":"0 0 4px 14px",
                }}/>
                <p style={{margin:0,fontSize:15,lineHeight:1.7,color:C.text}}>{b.text}</p>
              </div>
            );
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
            <div style={{ fontSize:13, color:C.green, marginTop:4 }}>+30 XP · Continue sur ta lancée</div>
            <button onClick={onBack} style={{ marginTop:16, padding:"12px 32px", borderRadius:R.lg, border:"none", background:C.green, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui, boxShadow:`0 4px 14px ${C.green}44` }}>
              Retour au parcours
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
