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
// todayStr en heure LOCALE (voir store/dates.js) — surtout ne pas
// réimplémenter avec `new Date().toISOString()`, qui reproduirait le bug
// UTC corrigé plus tôt cette année : une session jouée après 22h ferait
// apparaître le conseil du jour déjà fermé.
import { todayStr } from "../store/state.js";
import { UnitCheckScreen } from "./UnitCheckScreen.jsx";
import { Gropi, GropiCoach, GropiBubble } from "../design/Gropi.jsx";

// ── Composants de rendu injectés par contexte ─────────────────────────────
// Avant, App.jsx MUTAIT ce module au démarrage (`setXxx(...)`) : un singleton
// mutable au niveau module, avec des gardes défensives qui trahissaient la
// fragilité — si un écran se rendait avant l'injection, le composant valait
// null. Un contexte React rend l'ordre de rendu sans importance.
import { useRenderers } from "../renderers.jsx";
import { playLessonComplete, playChestOpen } from "../audioEngine.js";
import { useWakeLock } from "../hooks/useWakeLock.js";
import { pickTip, TIP_LABELS } from "../store/gropiTips.js";
import { gradeForLevel } from "../store/grades.js";

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
// Historique de ce fichier, parce que je me suis trompé une fois :
//
//   v1  alternance stricte gauche / droite (`index % 2`). Lisible, mais un
//       zigzag parfaitement régulier sur 100 leçons — mécanique.
//   v2  j'ai introduit des positions CENTRALES pour casser la régularité.
//       Mauvaise idée : un nœud centré laisse deux vides de part et d'autre,
//       et sa carte de titre doit malgré tout se rabattre à gauche ou à
//       droite, ce qui décale tout. Résultat : des trous dans la page.
//   v3  celle-ci. On revient à l'alternance STRICTE — c'est elle qui garantit
//       qu'aucun côté ne reste vide et que le regard suit une seule ligne.
//       L'irrégularité vient d'ailleurs : c'est l'AMPLITUDE du zigzag qui
//       varie, pas le côté.
//
// Concrètement, chaque nœud reste à gauche ou à droite en alternance, mais
// son retrait par rapport au bord change (de 6 à 46 px). Le chemin serpente
// donc avec des boucles larges puis serrées, comme un vrai sentier, sans
// jamais laisser une moitié d'écran inoccupée. La hauteur du lien suit
// l'écart réel entre deux nœuds : deux nœuds proches sont reliés court, deux
// nœuds éloignés ont la place d'une vraie courbe.
//
// Tout est DÉTERMINISTE, dérivé de l'identifiant de la leçon — jamais
// Math.random(). Un tracé qui changerait entre deux visites casserait la
// mémoire visuelle du parcours (« ma prochaine leçon est la boucle serrée
// après le coffre »).

/** Hash entier stable à partir d'une chaîne (FNV-1a, 32 bits). */
function hashId(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < String(str).length; i++) {
    h ^= String(str).charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h;
}

// Amplitudes possibles du zigzag, en pixels de retrait par rapport au bord.
// L'ordre est volontairement non monotone : enchaîner 6 → 40 → 18 → 46 → 12
// donne une impression de sentier, là où 6 → 12 → 18 → 24 donnerait une
// spirale trop régulière.
const AMPLITUDES = [6, 40, 18, 46, 12, 32, 24];

/**
 * Position d'un nœud : côté (alterné strictement) + retrait du bord.
 * `unitId` entre dans le hash pour que deux unités de même longueur n'aient
 * pas exactement le même dessin.
 */
function nodeLayout(lessonId, unitId, index) {
  const h = hashId(`${unitId}:${lessonId}`);
  const side = index % 2 === 0 ? "left" : "right";
  const inset = AMPLITUDES[(h + index) % AMPLITUDES.length];
  return { side, inset };
}

/**
 * Position horizontale (0-100) du centre d'un nœud, pour tracer le lien.
 * Le nœud fait 54 à 64 px de large dans un conteneur d'environ 400 px : son
 * centre se situe donc à peu près à (retrait + 30) px du bord.
 */
function sideToX(side, inset) {
  const pct = ((inset + 30) / 400) * 100;
  if (side === "left")  return Math.max(8, Math.min(50, pct));
  if (side === "right") return Math.min(92, Math.max(50, 100 - pct));
  return 50;   // le coffre, toujours centré
}

function PathNode({ lesson, index, state, th, onSelect, isCurrent, isLocked, gropiTip, layout }) {
  const C = useC();
  const done = !!state.completedLessons[lesson.id];
  const { side, inset } = layout;
  // Le côté est toujours franc (gauche ou droite) : la carte de titre et
  // Gropi s'alignent donc naturellement, sans rabattement arbitraire.
  const textSide = side;

  let bg, border, iconEl;
  if(done)         { bg=th.colorL;    border=th.color;   iconEl=<Ti name="check" size={isCurrent?22:18} color={th.color}/>; }
  else if(isCurrent){ bg=C.primaryL;  border=C.primary;  iconEl=<Ti name="player-play" size={22} color={C.primary}/>; }
  else if(isLocked) { bg=C.surface2;  border=C.border;   iconEl=<Ti name="lock" size={16} color={C.text3}/>; }
  else              { bg=C.surface;   border=th.color;   iconEl=<Ti name="book-2" size={17} color={th.color}/>; } // disponible dans l'unité ouverte

  const sz = isCurrent ? 64 : 54;

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems: side==="left" ? "flex-start" : "flex-end",
      width:"100%",
      // Le retrait varie d'un nœud à l'autre : c'est lui qui fait serpenter
      // le chemin. Borné à 46 px, ce qui laisse toujours la place de la carte
      // de titre (186 px) sur un écran de 390 px.
      paddingLeft:  side==="left"  ? inset : 0,
      paddingRight: side==="right" ? inset : 0,
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

  const x1 = sideToX(from.side, from.inset);
  const x2 = sideToX(to.side, to.inset);

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

// ── En-tête « accueil » ────────────────────────────────────────────────────
// Volontairement SANS grande bannière photo : c'est précisément ce qui
// rendait l'ancien Accueil + l'ancien Parcours lourds une fois empilés.
// Ici : une ligne de salutation compacte, le conseil du jour de Gropi, le
// défi du jour, un accès rapide aux outils, puis la bannière d'unité déjà
// existante — qui répond déjà à « où en suis-je ? » sans rien ajouter.
//
// Jam Session et Ear Training ne sont volontairement PAS ici : ce sont des
// outils, pas des étapes du parcours. Leur place est la refonte de Pratique,
// juste après celle-ci — pas de halte intermédiaire.
// ── Popup de bienvenue ──────────────────────────────────────────────────
// Troisième tentative sur ce même besoin, et la plus simple des trois.
//
// v1 : bandeau fixe en haut de la page — mangeait de la place en continu.
// v2 : panneau inséré dans la boucle, au niveau de l'unité en cours —
//      fonctionnait, mais ajoutait de la complexité (calcul de position,
//      cas de repli si aucune unité n'est "en cours") pour un bénéfice
//      finalement incertain.
// v3 (celle-ci) : un simple "coucou" à l'ouverture de l'app. Fermé une
//      fois, on se retrouve directement sur le chemin, à l'endroit où on
//      en est — le cadrage automatique (plus bas dans ce fichier) s'en
//      charge de toute façon, indépendamment de ce popup. Aucune position
//      dans le document à gérer, aucun cas de repli à prévoir.
//
// Une fois par jour (state.gropiTipDate), comme l'était déjà le conseil de
// Gropi avant toutes ces itérations.
function WelcomeModal({ state, tip, navigate, onClose }) {
  const C = useC();
  const dateStr = new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" });
  const grade = gradeForLevel(state.level);
  const defiFait = state.dailyChallengeDone && state.dailyChallengeDate === todayStr();
  const allerAuDefi = () => { onClose(); navigate("challenge"); };

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Bienvenue"
      onClick={onClose}
      style={{
        position:"fixed", inset:0, zIndex:300,
        background:"rgba(20,10,5,.55)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:20,
        animation:"gr-fade .18s ease",
      }}
    >
      <style>{`@keyframes gr-fade{from{opacity:0}to{opacity:1}}
        @keyframes gr-pop{from{opacity:0;transform:scale(.94) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

      <div
        onClick={e=>e.stopPropagation()}
        style={{
          width:"100%", maxWidth:360, background:C.surface,
          borderRadius:R.xl, overflow:"hidden",
          boxShadow:"0 16px 48px rgba(0,0,0,.35)",
          animation:"gr-pop .22s cubic-bezier(.2,.9,.3,1.2)",
        }}
      >
        {/* Même traitement photo que Progrès/Pratique : voile sombre fixe,
            texte blanc, indépendant du thème de l'app. */}
        <div style={{
          position:"relative", padding:"20px 20px 18px",
          backgroundImage:"url('/alhambra.jpg')",
          backgroundSize:"cover", backgroundPosition:"center 35%",
        }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(20,10,5,.65)" }}/>
          <div style={{ position:"relative" }}>
            <div style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,.75)", textTransform:"capitalize" }}>{dateStr}</div>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:"-.3px", marginTop:1 }}>Bonjour !</div>
          </div>
        </div>

        <div style={{ padding:"16px 18px 18px" }}>
          {/* Série, grade — les deux chiffres qui font plaisir à voir en
              ouvrant l'app, sans pour autant dupliquer tout Progrès. */}
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <div style={{
              flex:1, display:"flex", alignItems:"center", gap:7,
              background:C.surface2, border:`1.5px solid ${C.border}`,
              borderRadius:R.md, padding:"9px 11px",
            }}>
              <Ti name="flame" size={16} color={state.streak>0?C.primary:C.text3}/>
              <div>
                <div style={{ fontSize:15, fontWeight:800, color:C.text, lineHeight:1.1 }}>{state.streak}</div>
                <div style={{ fontSize:9.5, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:".05em" }}>
                  {state.streak > 1 ? "jours de série" : "jour de série"}
                </div>
              </div>
            </div>
            <div style={{
              flex:1, display:"flex", alignItems:"center", gap:7,
              background:C.surface2, border:`1.5px solid ${C.border}`,
              borderRadius:R.md, padding:"9px 11px",
            }}>
              <Ti name="medal" size={16} color={C.primary}/>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:800, color:C.text, lineHeight:1.25, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{grade.label}</div>
                <div style={{ fontSize:9.5, fontWeight:700, color:C.text3, textTransform:"uppercase", letterSpacing:".05em" }}>Niveau {state.level}</div>
              </div>
            </div>
          </div>

          {/* Défi du jour : une action, pas juste une info — sa propre
              ligne pleine largeur plutôt que compressée dans les puces
              ci-dessus. Cliquer dessus ferme le popup ET navigue direct. */}
          <button
            onClick={allerAuDefi}
            className="gr-focus"
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:9,
              background: defiFait ? C.greenL : C.amberL,
              border:`1.5px solid ${defiFait ? C.greenBorder : C.amberBorder}`,
              borderRadius:R.md, padding:"9px 11px", marginBottom:14,
              cursor:"pointer", textAlign:"left",
            }}
          >
            <Ti name={defiFait?"check":"bolt"} size={15} color={defiFait?C.greenD:C.amberInk ?? C.amber}/>
            <span style={{ fontSize:12, fontWeight:700, color:defiFait?C.greenD:C.text }}>
              {defiFait ? "Défi du jour relevé" : "Défi du jour"}
            </span>
          </button>

          {/* Conseil du jour */}
          <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:14 }}>
            <Gropi pose="wave" size={38} anim="wiggle"/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{
                fontSize:9, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase",
                color:C.primaryD, fontFamily:FONTS.ui, marginBottom:3,
              }}>{TIP_LABELS[tip.type] || "Conseil de Gropi"}</div>
              <p style={{ margin:0, fontSize:12.5, lineHeight:1.45, fontWeight:500, color:C.text }}>{tip.text}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="gr-focus"
            style={{
              width:"100%", background:C.primaryBtn, color:"#fff",
              border:"none", borderRadius:R.lg, padding:"12px",
              fontSize:14, fontWeight:800, cursor:"pointer",
            }}
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LE PARCOURS ───────────────────────────────────────────────────────────────
//
// `variant` distingue deux présentations d'un seul et même parcours :
//   "courses" (par défaut)  l'en-tête photo existant, inchangé.
//   "home"                  en-tête compact : conseil de Gropi, défi du
//                            jour, accès rapide, bannière d'unité — pensé
//                            pour servir d'écran d'accueil, sans empiler une
//                            seconde bannière photo par-dessus la première.
//
// Le corps du chemin (nœuds, connecteurs, coffres, LessonView, tout ce qui
// est déjà testé) est rigoureusement identique dans les deux cas — seul
// l'en-tête change. Voir HomeScreen.jsx, qui n'est plus qu'un fin
// enrobage : `<CoursesScreen {...props} variant="home" />`.
function CoursesScreen({ state, dispatch, content, navigate, variant = "courses" }) {
  const C = useC();
  const MODULE_THEME = buildModuleTheme(C);
  const [activeLesson, setActiveLesson] = useState(null);
  const [checkingUnit, setCheckingUnit] = useState(null);
  const [chestPop, setChestPop] = useState(false);
  const currentRef = useRef(null);

  // ── En-tête « accueil » uniquement : conseil du jour ────────────────────
  // Même mécanisme que l'ancien HomeScreen (state.gropiTipDate), pour que
  // la fermeture du conseil se comporte exactement pareil qu'avant.
  const today = todayStr();
  const tipDismissed = state.gropiTipDate === today;
  const tip = useMemo(() => pickTip(state), [
    state.xp, state.streak, state.level,
    Object.keys(state.completedLessons || {}).length,
    (state.unlockedBadges || []).length,
    state.dailyChallengeCount,
  ]);
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

  // Cible du scroll : la prochaine chose à faire.
  //
  // Ce n'est PAS toujours une leçon. Quand on valide la dernière leçon d'une
  // unité, il n'y a plus de leçon incomplète : la suite du parcours, c'est la
  // VÉRIFICATION de l'unité, matérialisée par le coffre. La version
  // précédente ne visait que les leçons, donc à ce moment précis elle ne
  // trouvait plus de cible et laissait la page où elle était — il fallait
  // redescendre à la main pour trouver le quiz. C'est le second point que tu
  // as signalé.
  //
  // On renvoie donc une clé qui désigne soit une leçon, soit un coffre, et le
  // ref de cadrage est posé sur l'un ou l'autre.
  const focus = useMemo(()=>{
    // 1. Une unité dont les leçons sont finies mais la vérification en
    //    attente : c'est l'action la plus urgente.
    const aVerifier = path.find(u => u.unlocked && u.needsCheck);
    if (aVerifier) return { type:"chest", id:aVerifier.id, key:`chest:${aVerifier.id}` };

    // 2. Un coffre gagné mais pas encore ouvert : on ne laisse pas une
    //    récompense derrière soi.
    const aOuvrir = path.find(u => u.bonusClaimable);
    if (aOuvrir) return { type:"chest", id:aOuvrir.id, key:`chest:${aOuvrir.id}` };

    // 3. Sinon, la prochaine leçon à faire.
    const u = path.find(x => x.isCurrent);
    const lid = u ? (u.lessons.find(l => !state.completedLessons[l.id])?.id ?? null) : null;
    return lid ? { type:"lesson", id:lid, key:`lesson:${lid}` } : null;
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
    if (!focus) return;
    if (scrolledTo.current === focus.key) return;

    // Court délai : le nœud doit être monté et mesuré avant qu'on cadre
    // dessus, sinon scrollIntoView vise une position qui va encore changer.
    const t = setTimeout(()=>{
      // "start" et non "center" : sur les premiers paliers, la cible est
      // encore proche du haut de la page, et centrer quelque chose de déjà
      // proche du haut ne déplace presque rien — le navigateur ne peut pas
      // scroller au-delà du sommet. "start" pousse franchement la cible en
      // haut de l'écran, quelle que soit sa distance au sommet : c'est ce
      // qui donne la sensation "j'arrive directement là où j'en suis"
      // plutôt que d'avoir à vérifier si un minuscule scroll a eu lieu.
      currentRef.current?.scrollIntoView({
        behavior: scrolledTo.current === null ? "auto" : "smooth",
        block: "start",
      });
      scrolledTo.current = focus.key;
    }, 140);
    return ()=>clearTimeout(t);
  }, [activeLesson, checkingUnit, focus]);

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
      {/* Popup de bienvenue, une fois par jour — voir WelcomeModal plus
          bas. Contrairement aux deux tentatives précédentes (bandeau fixe
          en haut, puis panneau inséré dans la boucle au niveau de l'unité
          en cours), ceci n'a AUCUNE position dans le document : c'est une
          fenêtre par-dessus tout, qui se ferme sur le chemin déjà cadré à
          l'endroit où on en est — le mécanisme de cadrage automatique
          (plus bas, `focus` + scrollIntoView) fait ce travail-là tout
          seul, indépendamment de ce popup. */}
      {variant === "home" && !tipDismissed && (
        <WelcomeModal
          state={state} tip={tip} navigate={navigate}
          onClose={()=>dispatch({type:"DISMISS_GROPI_TIP"})}
        />
      )}

      {/* ── En-tête ──────────────────────────────────────────────────────
          Variante "courses" : bannière photo fixe en haut, inchangée.
          Variante "home" : PLUS de bandeau fixe en haut de la page — le
          panneau (salutation, série, conseil de Gropi) est inséré plus bas,
          À L'INTÉRIEUR de la boucle du chemin, juste avant l'unité en
          cours. Voir le `path.map` ci-dessous.

          Le raisonnement : "arriver au niveau de ta progression actuelle"
          ne devait pas dépendre d'un bandeau fixe qui reste collé en haut
          (ça mange de la place en continu sur le chemin, à l'encontre de
          l'idée même de cette refonte) ni d'un bouton flottant permanent.
          En plaçant le panneau EXACTEMENT là où se trouve l'unité en
          cours dans le document, il apparaît naturellement quand on y
          défile, et disparaît naturellement quand on s'en éloigne — sans
          une ligne de JavaScript pour gérer l'affichage : c'est le
          positionnement dans le document qui fait tout le travail. */}
      {variant !== "home" && (
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
      )}

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
                  <div key={lesson.id}
                       ref={focus?.type==="lesson" && focus.id===lesson.id ? currentRef : null}
                       style={focus?.type==="lesson" && focus.id===lesson.id ? { scrollMarginTop: 16 } : undefined}>
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
                to={{ side:"center", inset:0 }}
                done={unit.complete}
              />
              <div ref={focus?.type==="chest" && focus.id===unit.id ? currentRef : null}
                   style={focus?.type==="chest" && focus.id===unit.id ? { scrollMarginTop: 16 } : undefined}>
                <UnitChest unit={unit} th={th} onClaim={claimChest} onCheck={setCheckingUnit}/>
              </div>
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

  // Empêche l'écran de s'éteindre pendant toute la durée où une leçon est
  // ouverte — avant et après l'avoir marquée terminée, pour ne pas couper
  // quelqu'un qui relit le contenu. Sans ça, l'écran s'éteint après le délai
  // d'inactivité tactile habituel : faire défiler la remet à zéro, mais
  // lire sans toucher l'écran — la guitare dans les mains — non. Se relâche
  // tout seul à la sortie de l'écran (démontage du composant).
  useWakeLock(true);

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
