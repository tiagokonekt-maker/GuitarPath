// Groply — screens/CoursesScreen.jsx  v7 — LE PARCOURS
// L'onglet Cours devient un parcours unique et continu : les modules sont
// découpés en unités de 3-4 leçons entrelacées en spirale (pathEngine.js).
// Déverrouillage par groupe : toutes les leçons d'une unité ouverte sont
// accessibles ; l'unité suivante s'ouvre quand la précédente est complète.
// Fin d'unité : un coffre de +40 XP à réclamer.
import { useState, useMemo, useEffect, useRef } from "react";
import { R, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import {
  AnimatedNumber, Button, Card, Confetti, Eyebrow, IconTile, Modal, ProgressBar,
  ScreenHero, SessionBar, Tag, XPPop,
} from "../design/ui.jsx";
import { relief, toneOf } from "../design/hooks.js";
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
import { pickTip, contexteGropi } from "../store/gropiTips.js";
import { getReviewStats } from "../store/reviewEngine.js";
import { POSE_ROLE } from "../design/gropiPoses.js";
import { LeconCartes } from "../lecon/LeconCartes.jsx";
import { useCorpsLecon } from "../lecon/corpsLecon.js";
import { MorceauxLies } from "../lecon/MorceauxLies.jsx";
import { gradeForLevel } from "../store/grades.js";
import { lessonMastery } from "../store/mastery.js";

// ── Popup de bienvenue : affiché une fois PAR CHARGEMENT DE PAGE ──────────
// Volontairement une variable de MODULE, pas un état React ni une donnée
// persistée (state.gropiTipDate, utilisée avant). La nuance :
//   • un état React (useState) se réinitialise à chaque fois que le
//     composant est remonté — donc à chaque fois qu'on change d'onglet et
//     qu'on revient sur Accueil, ce qui rouvrirait le popup bien plus
//     souvent que voulu ;
//   • une donnée persistée (localStorage, state.gropiTipDate) survivrait au
//     rechargement de la page — l'inverse de ce qui est demandé ;
//   • une variable de module n'est réinitialisée que lorsque le fichier
//     JavaScript est réévalué depuis le début, ce qui n'arrive QUE lors
//     d'un vrai rechargement de page (F5, fermeture/réouverture de
//     l'onglet) — jamais lors d'une simple navigation entre les onglets de
//     l'app, qui réutilise le même module déjà chargé en mémoire.
let popupDejaAffiche = false;

// ── Thème d'une unité ─────────────────────────────────────────────────────
// Une unité d'initiation ne mélange pas les disciplines : elle prend le thème
// de son module (« Premiers pas »). Une unité-palier, elle, les mélange :
// thème neutre. Annexes (pathEngine `annexe`) : thème neutre, icône « livres ».
// `tone` est la teinte du design system : c'est elle qui colore les nœuds,
// leur tranche et les bandeaux de l'unité.
function themeUnite(unit, MODULE_THEME) {
  if (unit.annexe) return { ...MODULE_THEME.palier, icon: "ti-books", tone: "primary" };
  if (unit.prelude && MODULE_THEME.debut) return { ...MODULE_THEME.debut, tone: "coral" };
  return { ...MODULE_THEME.palier, tone: "primary" };
}

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

// ── Anneau de maîtrise ───────────────────────────────────────────────────
// 3 segments égaux — Vu / Compris / Ancré — plutôt qu'une barre continue :
// mastery.js modélise 3 PALIERS DISCRETS, pas un pourcentage. Un anneau
// continu aurait suggéré une granularité qui n'existe pas dans les données.
//
// Trois cercles superposés, chacun tronqué en un seul arc de 104° (via
// stroke-dasharray) et pivoté de 120° l'un par rapport à l'autre — plutôt
// qu'un unique cercle avec un dasharray répété, pour pouvoir colorer
// chaque segment indépendamment selon le palier atteint.
function AnneauMaitrise({ niveau, size, couleur, decalY = 0, C }) {
  // L'anneau est visiblement PLUS GRAND que le disque, avec un vrai espace
  // entre les deux : il se lit comme un halo distinct, pas comme un
  // renforcement de la bordure. `decalY` le recentre sur l'ensemble disque +
  // tranche (la moitié de l'épaisseur du relief).
  const traitLargeur = 3;
  const ecartExterieur = 6;   // dégage aussi la tranche, sous le disque
  const rayon = size / 2 + ecartExterieur + traitLargeur / 2;
  const diametreSvg = (rayon + traitLargeur / 2) * 2;
  const centre = diametreSvg / 2;
  const decalage = -(diametreSvg - size) / 2;
  const circonference = 2 * Math.PI * rayon;
  const segDeg = 104; // 3 segments de 104° + 3 espaces de 16° = 360°
  const segLen = circonference * (segDeg / 360);
  const dash = `${segLen} ${circonference - segLen}`;

  return (
    <svg
      aria-hidden="true"
      width={diametreSvg} height={diametreSvg}
      style={{ position:"absolute", left:decalage, top:decalage + decalY, pointerEvents:"none" }}
    >
      {[0, 1, 2].map(i => (
        <circle
          key={i}
          cx={centre} cy={centre} r={rayon}
          fill="none"
          stroke={niveau > i ? couleur : C.border}
          strokeWidth={traitLargeur}
          strokeDasharray={dash}
          strokeLinecap="round"
          transform={`rotate(${-90 + i * 120} ${centre} ${centre})`}
        />
      ))}
    </svg>
  );
}

// ── Nœud de leçon ─────────────────────────────────────────────────────────────
// Un vrai bouton en relief : un disque posé sur sa tranche, qui s'enfonce au
// toucher. Quatre états, lisibles sans légende :
//   fait        aplat de la teinte de l'unité, coche
//   en cours    aplat, plus grand, halo qui pulse, flottement
//   disponible  surface claire bordée de la teinte (unité ouverte, pas encore faite)
//   verrouillé  à plat, atténué, cadenas : rien à presser
function PathNode({ lesson, state, th, onSelect, isCurrent, isLocked, gropiTip, layout }) {
  const C = useC();
  const k = toneOf(C, th.tone);
  const done = !!state.completedLessons[lesson.id];
  const { side, inset } = layout;
  // Le côté est toujours franc (gauche ou droite) : la carte de titre et
  // Gropi s'alignent donc naturellement, sans rabattement arbitraire.
  const textSide = side;

  let fond, bord, tranche = null, icone;
  if (done)          { fond = k.solid;    bord = "transparent"; tranche = k.edge; icone = <Ti name="check" size={24} color={C.onPrimaryBtn} stroke={3}/>; }
  else if (isCurrent){ fond = k.solid;    bord = "transparent"; tranche = k.edge; icone = <Ti name="player-play" size={28} color={C.onPrimaryBtn}/>; }
  else if (isLocked) { fond = C.surface2; bord = C.border;                        icone = <Ti name="lock" size={18} color={C.text3}/>; }
  else               { fond = C.surface;  bord = k.b;           tranche = k.b;    icone = <Ti name="book-2" size={22} color={k.c}/>; } // disponible dans l'unité ouverte

  const sz = isCurrent ? 68 : 56;
  const prof = isCurrent ? 6 : 5;
  // Uniquement sur une leçon déjà faite : lessonMastery renvoie de toute
  // façon LOCKED (0) tant que ce n'est pas le cas, et le nœud "en cours"
  // porte déjà son propre halo — superposer les deux aurait fait double
  // emploi sur le seul nœud qui ne peut jamais être à la fois "en cours" et
  // "fait" (isCurrent implique justement que la leçon ne l'est pas encore).
  const mastery = done ? lessonMastery(lesson, state) : null;
  // Leçon de l'unité ouverte, ni faite ni en cours : elle « apparaît ».
  const nouvelle = !done && !isCurrent && !isLocked;

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
      <div className={isCurrent ? "gr-bob" : undefined} style={{ position:"relative", width:sz }}>
        {isCurrent && (
          <span aria-hidden="true" className="gr-pulse" style={{
            position:"absolute", left:-9, top:-9, width:sz+18, height:sz+18,
            boxSizing:"border-box", borderRadius:"50%",
            border:`3px solid ${k.c}`, pointerEvents:"none",
          }}/>
        )}
        <button
          onClick={()=>!isLocked&&onSelect(lesson)}
          disabled={isLocked}
          className={isLocked ? undefined : `gr-press gr-focus${nouvelle ? " gr-in-pop" : ""}`}
          style={{
            ...(isLocked ? null : relief(tranche, prof)),
            width:sz, height:sz, borderRadius:"50%", padding:0,
            background:fond, border:`2px solid ${bord}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative",
            opacity:isLocked ? .6 : 1,
          }}
        >
          {icone}
        </button>
        {mastery && (
          <AnneauMaitrise niveau={mastery.level} size={sz} couleur={k.c} decalY={prof / 2} C={C} />
        )}
      </div>

      {/* Carte de titre (leçon débloquée). Sur le nœud courant, toute la carte
          se presse comme le disque : elle porte donc le même relief. */}
      {!isLocked&&(
        <Card
          onClick={isCurrent ? () => onSelect(lesson) : undefined}
          tone={isCurrent ? th.tone : undefined} soft={isCurrent} pad="9px 12px"
          style={{
            marginTop:8, width:"auto", maxWidth:186,
            alignSelf:textSide==="left"?"flex-start":"flex-end",
          }}>
          {isCurrent&&<Eyebrow tone={th.tone} style={{marginBottom:3}}>En cours</Eyebrow>}
          <div style={{fontSize:T.small,fontWeight:700,color:done||isCurrent?k.d:C.text,lineHeight:1.3}}>
            {lesson.title}
          </div>
          <div style={{fontSize:T.micro,color:C.text2,marginTop:3}}>{lesson.duration} min</div>
          {isCurrent&&(
            <Tag tone={th.tone} solid icon="player-play"
              style={{marginTop:8,padding:"5px 12px",letterSpacing:".06em",textTransform:"uppercase"}}>
              Commencer
            </Tag>
          )}
        </Card>
      )}

      {/* Gropi compagnon — uniquement sur le nœud en cours. Le toucher
          ouvre sa bulle (le conseil de la leçon) ; la carte et le nœud
          juste au-dessus donnent déjà accès à la leçon. */}
      {isCurrent && gropiTip && (
        <div style={{ marginTop: 10, alignSelf: textSide === "left" ? "flex-start" : "flex-end" }}>
          <GropiBubble
            pose={lesson.gropiTip ? POSE_ROLE.conseil : POSE_ROLE.accueil}
            size={56}
            tint={th.tone}
            eyebrow={lesson.gropiTip ? "Le conseil de Gropi" : `Gropi · ${lesson.title}`}
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
function UnitChest({ unit, onClaim, onCheck, justOpened = false }) {
  const C = useC();
  const { bonusClaimable, bonusClaimed, needsCheck, check, done, total, unlocked } = unit;

  // `action` : seuls le coffre à ouvrir et la vérification à passer se
  // pressent — eux seuls portent le relief (et flottent pour qu'on les voie).
  let fond, bord, tranche = null, icon, iconColor, label, action = null;
  if (bonusClaimed) {
    fond = C.greenL; bord = C.green; icon = "check"; iconColor = C.green;
    label = `Coffre ouvert · +${UNIT_BONUS_XP} XP`;
  } else if (bonusClaimable) {
    fond = C.amber; bord = "transparent"; tranche = `color-mix(in srgb, ${C.amber} 72%, #000)`;
    icon = "trophy"; iconColor = C.onPrimaryBtn;
    label = `Ouvre ton coffre · +${UNIT_BONUS_XP} XP`;
    action = () => onClaim(unit);
  } else if (needsCheck) {
    fond = C.primaryBtn; bord = "transparent"; tranche = C.primaryEdge;
    icon = "clipboard-check"; iconColor = C.onPrimaryBtn;
    label = check?.attempts ? `Retenter la vérification (${check.score}%)` : "Vérifier l'unité";
    action = () => onCheck(unit);
  } else if (unlocked) {
    fond = C.surface; bord = C.border; icon = "trophy"; iconColor = C.text3;
    label = `Coffre · ${done}/${total} leçons`;
  } else {
    fond = C.surface2; bord = C.border; icon = "lock"; iconColor = C.text3;
    label = "Coffre verrouillé";
  }

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"14px 0 8px"}}>
      <div className={action ? "gr-bob" : undefined}>
        <button
          onClick={()=>action?.()}
          disabled={!action}
          aria-label={label}
          className={action ? "gr-press gr-focus" : justOpened ? "gr-tada" : undefined}
          style={{
            // Sans relief, la même marge réserve la place de la tranche : le
            // coffre ne saute pas d'un cran au moment où on l'ouvre.
            ...(action ? relief(tranche, 6) : { marginBottom:6 }),
            width:72,height:72,borderRadius:R.xl,padding:0,
            background:fond, border:`2px solid ${bord}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            opacity:unlocked?1:.55,
          }}>
          <Ti name={icon} size={30} color={iconColor}/>
        </button>
      </div>
      <div style={{
        fontSize:T.micro,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",
        color:action?C.primaryD:C.text2,marginTop:8,textAlign:"center",
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
  const th = u ? themeUnite({ prelude: u.prelude }, MODULE_THEME) : null;
  const tone = th ? th.tone : "green";

  return (
    <Card tone={tone} pad="12px 14px" style={{display:"flex",alignItems:"center",gap:12,marginTop:14}}>
      <IconTile icon={th ? th.icon : "trophy"} tone={tone} size={44}/>
      <div style={{flex:1,minWidth:0}}>
        <Eyebrow tone={tone}>{u ? `Unité ${u.index+1} sur ${stats.units}` : "Parcours"}</Eyebrow>
        <div style={{fontSize:T.body,fontWeight:800,color:C.text,letterSpacing:"-.2px",marginTop:2}}>
          {u ? `${u.title} · ${u.done}/${u.total} leçons` : "Parcours terminé ! 🎉"}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
          <ProgressBar pct={stats.pct} color={toneOf(C, tone).c} h={8} label="Progression du parcours" style={{flex:1}}/>
          <span style={{fontSize:T.micro,fontWeight:700,color:C.text2,fontVariantNumeric:"tabular-nums",flexShrink:0}}>
            <AnimatedNumber value={stats.doneLessons}/> / {stats.totalLessons}
          </span>
        </div>
      </div>
    </Card>
  );
}

// ── En-tête d'unité (séparateur sur le parcours) ─────────────────────────────
// Unité facultative (« Premiers pas » pour qui joue déjà, pathEngine
// `optional`) : style adouci (fond neutre, bordure et filets en pointillés)
// et pastille « Facultatif » sous l'en-tête — sous et non à côté, pour que
// les titres longs tiennent sur une ligne à 375 px.
function UnitHeader({ unit, th, teaser = false }) {
  const C = useC();
  const k = toneOf(C, th.tone);
  const opt = !!unit.optional;
  const trait = `2px ${opt?"dashed":"solid"} ${unit.unlocked?k.b:C.border}`;
  const filet = {flex:1,height:0,borderTop:trait};
  return (
    <div style={{
      display:"flex",flexDirection:"column",alignItems:"center",gap:6,
      margin:unit.index===0?"4px 0 16px":"26px 0 16px",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:10,width:"100%"}}>
        <div style={filet}/>
        <Tag
          tone={unit.unlocked?th.tone:"neutral"} icon={unit.unlocked?th.icon:"lock"}
          style={{
            minWidth:0,padding:"6px 14px",gap:7,border:trait,
            whiteSpace:"normal",textAlign:"center",letterSpacing:".08em",textTransform:"uppercase",
            ...(opt ? { background:C.surface } : null),
            ...(unit.unlocked ? null : { color:C.text2 }),
          }}>
          {unit.title}
        </Tag>
        <div style={filet}/>
      </div>
      {opt&&(
        <Tag tone="neutral" style={{background:C.surface,color:C.text2}}>
          {unit.annexe ? "Facultatif · à lire quand tu veux" : "Facultatif · tu peux passer à la suite"}
        </Tag>
      )}
      {/* Teaser de la PREMIÈRE unité verrouillée seulement (une seule
          mascotte « mystère » sur tout le chemin) : donne envie d'aller
          voir la suite sans encombrer les unités lointaines. */}
      {teaser&&(
        <div style={{display:"flex",alignItems:"center",gap:8,maxWidth:280}}>
          <Gropi pose={POSE_ROLE.verrouille} size={34} anim="bob"/>
          <span style={{fontSize:12,lineHeight:1.4,color:C.text2}}>
            {unit.total} leçon{unit.total>1?"s":""} t'attendent ici. Termine l'unité en cours pour lever le mystère.
          </span>
        </div>
      )}
    </div>
  );
}

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
function WelcomeModal({ state, tip, navigate, onClose, onAutreConseil }) {
  const C = useC();
  const dateStr = new Date().toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" });
  const grade = gradeForLevel(state.level);
  const defiFait = state.dailyChallengeDone && state.dailyChallengeDate === todayStr();
  const allerAuDefi = () => { onClose(); navigate("challenge"); };

  return (
    // overflowX masqué : le bandeau photo épouse les coins arrondis du panneau
    // (qui garde son défilement vertical sur les petits écrans).
    <Modal label="Bienvenue" onClose={onClose} pad={0} panelStyle={{ overflowX:"hidden" }}>
      {/* Même traitement photo que Progrès/Pratique : voile sombre fixe,
          texte blanc, indépendant du thème de l'app. Le logo vit dans
          public/ (/logo.svg), comme la photo. */}
      <ScreenHero
        image="/alhambra.jpg" color="#4A2E14" overlay="rgba(20,10,5,.65)" position="center 35%"
        title="Bonjour !"
        subtitle={<span style={{ textTransform:"capitalize" }}>{dateStr}</span>}
        right={(
          <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
            <img src="/logo.svg" alt="" style={{ height:20, width:20 }}/>
            <span style={{ fontSize:T.small, fontWeight:800, color:"#fff", letterSpacing:"-.1px" }}>Groply</span>
          </div>
        )}
        style={{ padding:"20px 20px 18px", borderRadius:0 }}
      />

      <div className="gr-stagger" style={{ padding:"16px 18px 18px", display:"flex", flexDirection:"column", gap:12 }}>
        {/* Série, grade — les deux chiffres qui font plaisir à voir en
            ouvrant l'app, sans pour autant dupliquer tout Progrès. */}
        <div style={{ display:"flex", gap:8 }}>
          <Card tone="primary" soft pad="9px 11px" style={{ flex:1, minWidth:0, display:"flex", alignItems:"center", gap:8 }}>
            <span aria-hidden="true" className={state.streak>0 ? "gr-flame" : undefined} style={{ display:"flex" }}>
              <Ti name="flame" size={20} color={state.streak>0?C.primary:C.text3}/>
            </span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:T.lead, fontWeight:800, color:C.text, lineHeight:1.1, fontVariantNumeric:"tabular-nums" }}>
                <AnimatedNumber value={state.streak}/>
              </div>
              <div style={{ fontSize:T.micro, fontWeight:700, color:C.text2, textTransform:"uppercase", letterSpacing:".05em" }}>
                {state.streak > 1 ? "jours de série" : "jour de série"}
              </div>
            </div>
          </Card>
          <Card tone="amber" soft pad="9px 11px" style={{ flex:1, minWidth:0, display:"flex", alignItems:"center", gap:8 }}>
            <Ti name="medal" size={20} color={C.amber}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:T.small, fontWeight:800, color:C.text, lineHeight:1.25, overflowWrap:"anywhere" }}>{grade.label}</div>
              <div style={{ fontSize:T.micro, fontWeight:700, color:C.text2, textTransform:"uppercase", letterSpacing:".05em" }}>
                Niveau <AnimatedNumber value={state.level}/>
              </div>
            </div>
          </Card>
        </div>

        {/* Défi du jour : une action, pas juste une info — sa propre ligne
            pleine largeur. La presser ferme le popup ET navigue direct. */}
        <Button
          variant="soft" tone={defiFait ? "green" : "amber"} full
          icon={defiFait ? "check" : "bolt"} iconRight={defiFait ? undefined : "arrow-right"}
          onClick={allerAuDefi}
        >
          <span style={{ flex:1, textAlign:"left" }}>{defiFait ? "Défi du jour relevé" : "Défi du jour"}</span>
        </Button>

        {/* Conseil du jour */}
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          {/* La pose suit le type : ampoule pour un conseil, livre pour
              une anecdote, fierté (ou rocker pour la série) pour un
              rappel de progression. `key` relance l'apparition quand on
              demande un autre conseil. */}
          <Gropi key={tip.id} pose={tip.pose} size={48} anim="pop"/>
          <div style={{ flex:1, minWidth:0 }}>
            <Eyebrow style={{ marginBottom:3 }}>{tip.label}</Eyebrow>
            <p style={{ margin:0, fontSize:T.small, lineHeight:1.5, fontWeight:500, color:C.text }}>{tip.text}</p>
            {onAutreConseil && (
              <Button variant="ghost" size="sm" icon="refresh" onClick={onAutreConseil} style={{ padding:0, marginTop:2 }}>
                Un autre conseil
              </Button>
            )}
          </div>
        </div>

        <Button size="lg" full onClick={onClose}>Commencer</Button>
      </div>
    </Modal>
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
  // Identifiant de l'unité dont on vient d'ouvrir le coffre (le temps de la
  // pastille d'XP et du « tada » du coffre), sinon null.
  const [chestPop, setChestPop] = useState(null);
  const currentRef = useRef(null);

  // ── En-tête « accueil » uniquement : popup de bienvenue ─────────────────
  // `useState(() => ...)` avec une fonction : la valeur initiale n'est
  // calculée QU'UNE FOIS, à la création du composant — pas à chaque rendu.
  // C'est ce qui permet de lire `popupDejaAffiche` une seule fois par
  // montage réel du composant, puis de piloter l'affichage avec un état
  // React normal ensuite (pour que fermer le popup redéclenche un rendu).
  const [tipDismissed, setTipDismissed] = useState(() => popupDejaAffiche);
  const fermerPopup = () => {
    popupDejaAffiche = true;
    setTipDismissed(true);
    dispatch({ type: "DISMISS_GROPI_TIP" });   // conservé : sans effet sur l'affichage désormais, mais gardé pour compatibilité avec le reste de l'état
  };
  // Identifiant de la leçon sur laquelle on a scrollé la dernière fois. Sert à
  // ne pas re-scroller à chaque rendu, tout en re-scrollant bien quand la
  // cible change — c'est-à-dire au retour d'une leçon terminée.
  const scrolledTo = useRef(null);

  // state.unitChecks manquait ici : c'est lui qui porte le resultat du
  // controle de fin d'unite (passed: true/false). Sans cette dependance,
  // React ne recalculait jamais la liste des unites apres un controle
  // reussi — le coffre restait bloque sur "a verifier", et l'unite
  // suivante ne se debloquait jamais, meme apres avoir reclame le coffre.
  // Même piège avec state.onboarding (paliers ouverts d'emblée) : on dépend
  // désormais de `state` entier, seule liste exacte de ce que lit buildPath.
  const path  = useMemo(()=>buildPath(content, state), [content, state]);
  const stats = useMemo(()=>getPathStats(content, state), [content, state]);

  // ── Conseil de Gropi (popup d'accueil) ───────────────────────────────────
  // Contexte d'étude = la prochaine leçon de l'unité courante : Gropi parle
  // de ce qu'on travaille. pickTip est pur ; c'est GROPI_TIP_VU qui le fige
  // pour la journée (state.gropiJour) et l'ajoute à l'historique — dispatché
  // seulement quand le popup est réellement affiché.
  const jour = todayStr();
  const toReview = useMemo(
    () => getReviewStats(content.quiz || [], state.reviewHistory, state.completedLessons).toReview,
    [content.quiz, state.reviewHistory, state.completedLessons],
  );
  const ctxGropi = useMemo(() => contexteGropi(path, state, { toReview, jour }), [path, state, toReview, jour]);
  const tip = useMemo(() => pickTip(state, ctxGropi), [state, ctxGropi]);
  const popupVisible = variant === "home" && !tipDismissed;
  useEffect(() => {
    if (!popupVisible || tip.id === "defaut") return;
    if (state.gropiJour?.date === jour && state.gropiJour?.id === tip.id) return;
    dispatch({ type: "GROPI_TIP_VU", id: tip.id, jour });
  }, [popupVisible, tip.id, jour, state.gropiJour, dispatch]);
  const autreConseil = () => {
    const suivant = pickTip(state, { ...ctxGropi, nouveau: true });
    if (suivant.id !== "defaut") dispatch({ type: "GROPI_TIP_VU", id: suivant.id, jour });
  };

  // Première unité verrouillée : la seule qui reçoit le teaser « mystère ».
  const premiereVerrouillee = path.find(u => !u.unlocked)?.id ?? null;

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
        behavior: scrolledTo.current === null || matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
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
    setChestPop(unit.id);
    setTimeout(()=>setChestPop(null), 1400);
  };

  if(activeLesson) return (
    <LessonView lesson={activeLesson} state={state} dispatch={dispatch}
      quiz={content.quiz} onBack={()=>setActiveLesson(null)}
      onJouerMorceau={(id)=>navigate("toolbox", { outil:"morceaux", morceau:id, retour:"home" })}/>
  );

  if(checkingUnit) return (
    <UnitCheckScreen unit={checkingUnit} content={content} dispatch={dispatch}
      state={state} onDone={()=>setCheckingUnit(null)}/>
  );

  return (
    <div>
      {chestPop!=null && <XPPop amount={UNIT_BONUS_XP} onDone={()=>{}}/>}
      {/* Popup de bienvenue — voir WelcomeModal. Il n'a AUCUNE position dans
          le document : c'est une fenêtre par-dessus tout, qui se ferme sur
          le chemin déjà cadré à l'endroit où on en est (le cadrage
          automatique, `focus` + scrollIntoView, s'en charge tout seul). */}
      {popupVisible && (
        <WelcomeModal
          state={state} tip={tip} navigate={navigate}
          onClose={fermerPopup} onAutreConseil={autreConseil}
        />
      )}

      {/* ── En-tête ──────────────────────────────────────────────────────
          Variante "courses" : bandeau photo de l'onglet, avec l'unité en
          cours. Variante "home" : PAS de bandeau — l'accueil s'ouvre
          directement sur le chemin, cadré sur la prochaine chose à faire. */}
      {variant !== "home" && (
        <ScreenHero
          image="/lavender.jpg" color="#613878" overlay="rgba(60,20,100,.52)" position="center 60%"
          title="Parcours"
          subtitle={`${stats.units} unités · ${stats.totalLessons} leçons · ${stats.pct}%`}
        >
          <CurrentUnitBanner stats={stats} MODULE_THEME={MODULE_THEME}/>
        </ScreenHero>
      )}

      {/* ── Le parcours ── */}
      <div style={{padding:"8px 20px 40px"}}>
        {path.map(unit=>{
          const th = themeUnite(unit, MODULE_THEME);
          // Leçon courante = première non complétée de l'unité courante
          const currentLessonId = unit.isCurrent
            ? (unit.lessons.find(l=>!state.completedLessons[l.id])?.id ?? null)
            : null;

          return (
            <div key={unit.id}>
              {unit.annexe&&(
                <div style={{textAlign:"center",margin:"40px 0 -10px"}}>
                  <div style={{fontSize:T.lead,fontWeight:800,color:C.text,letterSpacing:"-.2px"}}>Annexes</div>
                  <div style={{fontSize:T.small,color:C.text2,marginTop:3,lineHeight:1.45}}>
                    Des leçons pratiques hors parcours, ouvertes à tout moment. Elles ne bloquent rien.
                  </div>
                </div>
              )}
              <UnitHeader unit={unit} th={th} teaser={unit.id===premiereVerrouillee}/>

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
                  est au milieu quelle que soit la position du dernier nœud.
                  Les annexes n'ont ni vérification ni coffre. */}
              {!unit.annexe&&<>
              <PathConnector
                from={unitLayouts[unit.id][unit.lessons.length-1]}
                to={{ side:"center", inset:0 }}
                done={unit.complete}
              />
              <div ref={focus?.type==="chest" && focus.id===unit.id ? currentRef : null}
                   style={focus?.type==="chest" && focus.id===unit.id ? { scrollMarginTop: 16 } : undefined}>
                <UnitChest unit={unit} th={th} onClaim={claimChest} onCheck={setCheckingUnit}
                  justOpened={chestPop===unit.id}/>
              </div>
              </>}
            </div>
          );
        })}

        {/* Fin du parcours */}
        {stats.pct===100&&(
          <div className="gr-in" style={{textAlign:"center",marginTop:20}}>
            <Gropi pose="celebrate" size={130} anim="cheer" style={{margin:"0 auto"}}/>
            <div style={{fontSize:T.lead,fontWeight:800,color:C.greenD,marginTop:8,letterSpacing:"-.2px"}}>
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

// ── Corps de leçon en cours de chargement (ou indisponible hors-ligne) ──────
function ChargementLecon({ lesson, onBack, reessayer }) {
  const C = useC();
  return (
    <div style={{padding:"14px 20px 24px"}}>
      <SessionBar onClose={onBack} closeLabel="Retour au parcours" pct={0}/>
      <div role="status" aria-live="polite" style={{padding:"28px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:10,textAlign:"center"}}>
        <Gropi pose={reessayer ? POSE_ROLE.erreur : POSE_ROLE.calme} size={84} anim="bob"/>
        <h1 style={{margin:0,fontSize:T.h3,fontWeight:800,color:C.text}}>{lesson.title}</h1>
        {reessayer ? (
          <>
            <p style={{fontSize:14,color:C.text2,margin:"0 0 6px",lineHeight:1.5}}>
              Impossible d'ouvrir cette leçon pour l'instant. Vérifie ta connexion, puis réessaie.
            </p>
            <Button icon="refresh" onClick={reessayer}>Réessayer</Button>
          </>
        ) : (
          <p style={{fontSize:14,color:C.text2,margin:0}}>Ouverture de la leçon…</p>
        )}
      </div>
    </div>
  );
}

// ── Contenu d'une leçon ───────────────────────────────────────────────────────
// Deux rendus : la leçon « en cartes » (champ `cartes`, voir src/lecon/ et
// src/content/README.md) ou, à défaut, l'article historique (`content`).
// `quiz` (toutes les questions) sert aux cartes question liées au quiz
// (quizId) ; `carteInitiale` force la carte de départ (rendu de contrôle).
// `onJouerMorceau(id)` : ouvre un morceau lié à la leçon (Outils › Morceaux,
// voir content/liens-morceaux.js) ; absent, les liens ne s'affichent pas.
// `lesson` peut n'être que les métadonnées (contenu de l'app, voir
// src/content/index-app.js) : le corps (cartes) est alors chargé ici, à
// l'ouverture (src/lecon/corpsLecon.js).
function LessonView({ lesson: leconRecue, state, dispatch, onBack, quiz, carteInitiale, onJouerMorceau }) {
  const corps = useCorpsLecon(leconRecue);
  const lesson = corps.lecon;
  const { renderDiagramBlock, FretboardLesson } = useRenderers();
  const C = useC();
  const [done,setDone] = useState(!!state.completedLessons[lesson.id]);
  const [pop, setPop]  = useState(false);
  // Confettis : seulement à l'instant où la leçon est terminée, jamais à la
  // réouverture d'une leçon déjà faite.
  const [fete, setFete] = useState(false);
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
      setFete(true);
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

  // La racine (même balise, même place dans les trois rendus) n'est montée
  // qu'une fois : l'entrée de l'écran ne rejoue pas quand le corps arrive.
  if (corps.statut !== "pret") return (
    <div className="gr-in-push">
      <ChargementLecon lesson={lesson} onBack={onBack} reessayer={corps.reessayer}/>
    </div>
  );

  if (lesson.cartes?.length) return (
    <div className="gr-in-push">
      {pop&&<XPPop amount={30} onDone={()=>{}}/>}
      <LeconCartes key={lesson.id} lesson={lesson} state={state} dispatch={dispatch} onBack={onBack}
        quiz={quiz} carteInitiale={carteInitiale} done={done} onFinish={finish} onJouerMorceau={onJouerMorceau}/>
    </div>
  );

  const blocs = lesson.content || [];
  return (
    <div className="gr-in-push">
      {pop&&<XPPop amount={30} onDone={()=>{}}/>}
      {fete&&<Confetti/>}
      <div style={{padding:"14px 20px 24px"}}>
        <SessionBar onClose={onBack} closeLabel="Retour au parcours" pct={done ? 100 : 0}/>
        <h1 style={{margin:"18px 0 6px",fontSize:T.h2,fontWeight:800,lineHeight:1.25,letterSpacing:"-.3px",color:C.text}}>{lesson.title}</h1>
        <p style={{fontSize:T.micro,color:C.text3,margin:"0 0 20px",letterSpacing:".05em",textTransform:"uppercase",fontWeight:700}}>
          {lesson.duration} MIN · {(lesson.quiz||[]).length} QUESTIONS
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
          {blocs.map((b,i)=>{
            if(b.type==="h") return <h3 key={i} style={{margin:"8px 0 0",fontSize:T.lead,fontWeight:800,color:C.primaryInk,letterSpacing:"-.2px"}}>{b.text}</h3>;
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
                <img src={b.img} alt={b.imgAlt||""} loading="lazy" decoding="async" style={{
                  float:b.imgSide==="left"?"left":"right",
                  width:"34%", maxWidth:124, height:"auto",
                  margin:b.imgSide==="left"?"0 14px 4px 0":"0 0 4px 14px",
                }}/>
                <p style={{margin:0,fontSize:T.body,lineHeight:1.7,color:C.text}}>{b.text}</p>
              </div>
            );
            return <p key={i} style={{margin:0,fontSize:T.body,lineHeight:1.7,color:C.text}}>{b.text}</p>;
          })}
          {/* Le conseil de Gropi propre à la leçon, en fin de lecture : un
              geste concret pour mettre en pratique ce qu'on vient de lire.
              Si le dernier bloc est déjà une bulle de Gropi, on ne remet
              pas une seconde mascotte juste en dessous. */}
          {lesson.gropiTip && (
            <GropiCoach variant="tip" eyebrow="Le conseil de Gropi"
              mascotte={!["tip","ref"].includes(blocs[blocs.length-1]?.type)}>
              {lesson.gropiTip}
            </GropiCoach>
          )}
        </div>
        {(lesson.quiz||[]).length>0&&(
          <Card tone="primary" soft pad="11px 14px" style={{marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
            <Ti name="notebook" size={18} color={C.primary}/>
            <p style={{margin:0,fontSize:T.small,color:C.primaryD,lineHeight:1.45}}>
              Cette leçon est associée à {(lesson.quiz||[]).length} question{(lesson.quiz||[]).length>1?"s":""} de quiz.
            </p>
          </Card>
        )}
        {/* Fin de l'article : les morceaux qui mettent la leçon en pratique.
            Y aller termine la leçon (on a lu jusqu'au bout). */}
        <MorceauxLies lessonId={lesson.id} style={{ marginBottom:14 }}
          onJouer={onJouerMorceau ? (id) => { finish(); onJouerMorceau(id); } : null}/>
        {done ? (
          <Card tone="green" soft pad="22px 20px" className={fete ? "gr-in-pop" : undefined}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center" }}>
            <Gropi pose="celebrate" size={120} anim="cheer"/>
            <div style={{ fontSize:T.h3, fontWeight:800, color:C.greenD, letterSpacing:"-.3px", marginTop:8 }}>Leçon complétée !</div>
            <div style={{ fontSize:T.small, color:C.greenD, marginTop:4 }}>+<AnimatedNumber value={30}/> XP · Continue sur ta lancée</div>
            <Button tone="green" size="lg" onClick={onBack} style={{ marginTop:16 }}>Retour au parcours</Button>
          </Card>
        ) : (
          <Button size="lg" full onClick={finish}>Terminer la leçon · +30 XP</Button>
        )}
      </div>
    </div>
  );
}

export { CoursesScreen, LessonView };
