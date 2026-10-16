// Groply — store/pathEngine.js
// Moteur du Parcours : découpe le contenu en unités, calcule le déblocage,
// et applique la personnalisation issue du test de placement.
//
// ── Ce qui change par rapport à la version précédente ─────────────────────
//
// 1. TAILLE DES UNITÉS. Le seuil de scission était à 15 leçons, alors que
//    la répartition réelle du contenu est :
//      Palier : 1  2  3  4   5   6   7   8   9
//      Leçons : 4  6  7  10  13  15  18  16  19   (108 au total)
//    Seuls les paliers 7, 8 et 9 étaient donc scindés, ce qui donnait des
//    unités de 4 leçons au début et de 15 au milieu. Le verrou étant total
//    (toutes les leçons + une vérification réussie), il fallait enchaîner
//    15 leçons d'affilée pour ouvrir le palier 7 — exactement là où le
//    décrochage est le plus probable. Le seuil passe à 8, avec une
//    scission en autant de parts que nécessaire (plus seulement en deux).
//
// 2. RÉCOMPENSE PROPORTIONNELLE. Le coffre valait 40 XP pour 4 leçons comme
//    pour 15. Il vaut désormais 10 XP par leçon de l'unité.
//
// 3. VÉRIFICATION PROPORTIONNELLE. 8 questions pour valider 15 leçons, avec
//    6 bonnes réponses suffisantes, laissait passer quelqu'un ayant compris
//    la moitié. Le nombre de questions dépend maintenant de la taille.
//
// 4. PERSONNALISATION RÉELLEMENT BRANCHÉE (audit §7.2). Le test de placement
//    remplissait `weakestModule` / `preferredModule` / `overallTier` que
//    PERSONNE ne lisait. Désormais :
//      • `overallTier` ouvre d'emblée les premiers paliers (un joueur testé
//        B2 ne recommence pas par « les cordes s'appellent Mi La Ré Sol Si
//        Mi ») — sans jamais cocher une leçon à sa place ;
//      • `weakestModule` puis `preferredModule` passent en tête de l'ordre
//        interne d'un palier ;
//      • `timePerWeek` dimensionne la session du jour (dailyTarget).
//
// 5. MODULE D'INITIATION « PREMIERS PAS » (debut). Ses leçons ne sont pas
//    rangées par palier : elles forment leurs propres unités (une par valeur
//    du champ `unite` des leçons), placées AVANT le palier 1. Pour un
//    débutant complet, elles sont obligatoires et ouvrent la suite comme
//    n'importe quelle unité. Pour quelqu'un qui joue déjà, elles sont
//    FACULTATIVES : ouvertes, consultables, mais jamais bloquantes ni
//    « courantes ». La règle exacte est dans `debutFacultatif` ci-dessous.
//
// 6. MODULES ENTRELACÉS DANS UN PALIER. Les leçons d'un palier étaient
//    triées par module, puis découpées : un palier scindé donnait des
//    unités d'un seul module (6-1 = cinq leçons de gammes, 8-1 = cinq
//    modes). Elles sont désormais RÉPARTIES (voir `entrelacer`) : chaque
//    module est étalé proportionnellement sur tout le palier, son ordre
//    interne conservé. Chaque unité s'ouvre de préférence par une leçon
//    PRATIQUE (voir `ouvrirParLaPratique`). Les identifiants d'unité ne
//    changent pas (ils ne dépendent que du nombre de leçons du palier) ;
//    la compatibilité avec une progression acquise sous l'ancien
//    découpage est décrite au-dessus de `buildPath`.

export const UNIT_CHECK_PASS_PCT = 70;
export const MODULE_ORDER = ["neck", "scales", "harmony", "rhythm", "impro"];
export const MAX_LEVEL = 9;

/**
 * Module d'initiation (posture, accordage, premiers accords, tablature).
 * Un module marqué `prelude: true` dans ses infos, ou portant cet
 * identifiant, est découpé en unités propres placées avant les paliers.
 */
export const DEBUT_MODULE = "debut";
export const estModulePrelude = (course) => !!course?.prelude || course?.id === DEBUT_MODULE;

/** Au-delà de ce nombre de leçons, un palier est scindé en plusieurs unités. */
const SPLIT_THRESHOLD = 8;
/** Taille cible d'une unité après scission. */
const TARGET_UNIT_SIZE = 6;

/**
 * Modules « guitare en main » : une unité s'ouvre de préférence par l'un
 * d'eux plutôt que par de la théorie pure (gammes, harmonie).
 */
export const MODULES_PRATIQUES = [DEBUT_MODULE, "neck", "rhythm"];
/** Modules qui appliquent ce que les autres enseignent : gardés en fin de palier. */
export const MODULES_APPLICATION = ["impro"];

/** XP du coffre de fin d'unité, proportionnelle à l'effort. */
export const UNIT_BONUS_PER_LESSON = 10;
export const unitBonusXp = (lessonCount) =>
  Math.max(20, Math.min(150, Math.round((lessonCount || 0) * UNIT_BONUS_PER_LESSON)));
/** Conservé pour compatibilité d'import (valeur indicative, non normative). */
export const UNIT_BONUS_XP = 40;

/**
 * Nombre CIBLE de questions de vérification.
 *
 * Passé de "proportionnel à la taille de l'unité" (4 à 14, borné) à une
 * cible fixe de 15 : le nombre réel de leçons ne dit rien de si l'utilisateur
 * a vraiment compris ou juste eu de la chance sur un petit échantillon.
 *
 * `_lessonCount` reste dans la signature pour ne rien casser côté appelants,
 * mais n'est plus utilisé — la cible ne dépend plus de la taille de l'unité.
 */
export const unitCheckSize = (_lessonCount) => 15;
export const UNIT_CHECK_MAX_QUESTIONS = 15;   // cible par défaut si unit.checkSize est absent

/** Nombre de paliers ouverts d'emblée selon le résultat du placement. */
const TIER_HEADSTART = { A1: 0, A2: 1, B1: 2, B2: 3 };

/**
 * Ordre des modules à l'intérieur d'un palier, personnalisé :
 * module le plus faible d'abord (c'est là qu'il faut travailler), puis le
 * module choisi comme objectif, puis l'ordre canonique. Aucun module n'est
 * retiré, seul l'ordre change.
 */
export function moduleOrderFor(state) {
  const ob = state?.onboarding || {};
  const head = [];
  for (const m of [ob.weakestModule, ob.preferredModule]) {
    if (m && MODULE_ORDER.includes(m) && !head.includes(m)) head.push(m);
  }
  return [...head, ...MODULE_ORDER.filter(m => !head.includes(m))];
}

/** Découpe une liste en parts aussi égales que possible, ≥ 2 items chacune. */
function chunkEvenly(list, threshold = SPLIT_THRESHOLD, target = TARGET_UNIT_SIZE) {
  if (list.length <= threshold) return [list];
  const parts = Math.max(2, Math.ceil(list.length / target));
  const size = Math.ceil(list.length / parts);
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  // Si la dernière part est orpheline (1 leçon), on la fusionne.
  if (out.length > 1 && out[out.length - 1].length === 1) {
    out[out.length - 2] = [...out[out.length - 2], ...out.pop()];
  }
  return out;
}

/**
 * Entrelace les leçons d'un palier entre modules (round-robin PONDÉRÉ).
 *
 * Chaque leçon reçoit une position dans le palier : (rang dans son module
 * + ½) / nombre de leçons du module. On trie sur cette position, puis sur
 * le rang du module (personnalisé, voir `moduleOrderFor`) à égalité. Un
 * module de 5 leçons et un de 2 sont ainsi étalés sur toute la longueur du
 * palier, au lieu qu'un round-robin strict laisse la fin du palier au seul
 * module le plus fourni. L'ordre INTERNE de chaque module est conservé
 * (la position croît avec le rang).
 *
 * Exception : les modules d'APPLICATION (`MODULES_APPLICATION`, l'impro)
 * restent en fin de palier, comme avant. Leurs leçons s'appuient sur celles
 * des autres modules du MÊME palier (« la pentatonique mineure que tu viens
 * de voir », « cibler les notes d'accord » côté harmonie puis côté impro) :
 * les intercaler les ferait passer avant leur prérequis.
 */
function entrelacer(lessons, rank) {
  const parModule = new Map();
  for (const l of lessons) {
    if (!parModule.has(l.courseId)) parModule.set(l.courseId, []);
    parModule.get(l.courseId).push(l);
  }
  const positionnees = [];
  const fin = [];
  for (const [mod, liste] of parModule) {
    if (MODULES_APPLICATION.includes(mod)) { fin.push(...liste); continue; }
    liste.forEach((l, i) => positionnees.push({ l, pos: (i + 0.5) / liste.length, r: rank(mod), i }));
  }
  positionnees.sort((a, b) => a.pos - b.pos || a.r - b.r || a.i - b.i);
  // `lessons` arrive trié par rang de module : `fin` l'est donc aussi.
  return [...positionnees.map(p => p.l), ...fin];
}

/**
 * Règle d'ouverture d'une unité : on préfère commencer guitare en main.
 *   1. Si le placement a désigné un module FAIBLE et que l'unité en
 *      contient, sa première leçon passe en tête (la personnalisation prime)
 *      — sauf s'il s'agit d'un module d'application (impro), jamais avancé
 *      devant ce qu'il applique.
 *   2. Sinon, si l'unité commence par de la théorie (module non pratique)
 *      et contient une leçon pratique (Premiers pas, Manche, Rythme), la
 *      première leçon pratique passe en tête.
 *   3. Sinon, rien ne bouge.
 * Une seule leçon est déplacée, et c'est la PREMIÈRE de son module dans
 * l'unité : l'ordre interne de chaque module reste intact.
 */
function ouvrirParLaPratique(chunk, faible) {
  const enTete = (pred) => {
    const i = chunk.findIndex(pred);
    return i > 0 ? [chunk[i], ...chunk.slice(0, i), ...chunk.slice(i + 1)] : chunk;
  };
  if (faible && chunk.some(l => l.courseId === faible)) return enTete(l => l.courseId === faible);
  if (MODULES_PRATIQUES.includes(chunk[0]?.courseId)) return chunk;
  return enTete(l => MODULES_PRATIQUES.includes(l.courseId));
}

/**
 * Construit la séquence d'unités PAR PALIER (sans statut).
 * Chaque leçon reçoit son courseId/courseTitle d'origine, ce qui permet au
 * reste de l'app (thème visuel, « prochaine leçon », badges par module) de
 * savoir de quelle discipline elle vient même regroupée.
 */
export function buildUnits(courses = [], state = null, { regroupementHistorique = false } = {}) {
  const order = moduleOrderFor(state);
  const wm = state?.onboarding?.weakestModule;
  const faible = MODULE_ORDER.includes(wm) && !MODULES_APPLICATION.includes(wm) ? wm : null;
  const units = [];

  // ── Unités d'initiation, avant le palier 1 ────────────────────────────
  // Regroupées par le champ `unite` des leçons (1, 2, 3…) ; sans ce champ,
  // découpage automatique comme un palier. Ids : `debut-1`, `debut-2`…
  for (const c of courses.filter(estModulePrelude)) {
    const lessons = (c.lessons || []).map(l => ({ ...l, courseId: c.id, courseTitle: c.title, level: l.level ?? 0 }));
    if (lessons.length === 0) continue;
    const groupes = lessons.every(l => Number.isInteger(l.unite))
      ? [...new Set(lessons.map(l => l.unite))].sort((a, b) => a - b).map(n => lessons.filter(l => l.unite === n))
      : chunkEvenly(lessons);
    groupes.forEach((chunk, idx) => {
      const nom = c.unites?.[idx];
      units.push({
        id: `${c.id}-${idx + 1}`,
        level: 0,
        part: groupes.length > 1 ? idx + 1 : null,
        parts: groupes.length,
        title: nom ? `${c.title} · ${nom}` : groupes.length > 1 ? `${c.title} · partie ${idx + 1}` : c.title,
        prelude: true,
        courseIds: [c.id],
        lessons: chunk,
        bonusXp: unitBonusXp(chunk.length),
        checkSize: Math.max(3, unitCheckSize(chunk.length)),
        quizPoolSize: new Set(chunk.flatMap(l => l.quiz || [])).size,
      });
    });
  }

  const allLessons = courses.filter(c => !estModulePrelude(c)).flatMap(c =>
    (c.lessons || []).map(l => ({ ...l, courseId: c.id, courseTitle: c.title }))
  );
  // Leçons sans level explicite (contenu importé, oubli) : rattachées au
  // dernier palier plutôt qu'exclues silencieusement du Parcours.
  for (const l of allLessons) if (l.level == null) l.level = MAX_LEVEL;

  for (let level = 1; level <= MAX_LEVEL; level++) {
    const lessons = allLessons.filter(l => l.level === level);
    if (lessons.length === 0) continue;

    // Ordre déterministe et stable : jamais aléatoire. Un module inconnu
    // (pack importé) va en fin de rotation plutôt qu'en tête, ce que
    // faisait `indexOf` en renvoyant -1.
    const rank = (id) => { const i = order.indexOf(id); return i === -1 ? order.length : i; };
    lessons.sort((a, b) => rank(a.courseId) - rank(b.courseId));

    // `regroupementHistorique` : l'ancien découpage (blocs d'un seul
    // module), conservé UNIQUEMENT pour la compatibilité dans buildPath.
    const chunks = regroupementHistorique
      ? chunkEvenly(lessons)
      : chunkEvenly(entrelacer(lessons, rank)).map(c => ouvrirParLaPratique(c, faible));
    chunks.forEach((chunk, partIdx) => {
      // `stock` reste calculé — c'est une donnée informative utile (voir
      // `quizPoolSize` plus bas, et les scripts de vérification de contenu)
      // — mais ne plafonne PLUS `checkSize` ici. Il ne compte que le cœur
      // PROPRE de l'unité, alors que la vérification réelle pioche aussi
      // dans le renfort (même module, déjà complété) et le rappel (palier
      // antérieur, déjà complété) — deux pools qui dépendent de CE QUE
      // l'utilisateur a fait, donc inconnus à ce stade-ci (buildUnits ne
      // reçoit que le contenu, pas la banque de quiz complète ni un
      // historique de progression exploitable pour ce calcul).
      //
      // Le vrai plafond se calcule à l'exécution, dans buildSample
      // (UnitCheckScreen.jsx), contre le pool RÉELLEMENT disponible pour CET
      // utilisateur au moment précis de la vérification — cœur + renfort +
      // rappel confondus. `checkSize` ici n'est qu'une CIBLE.
      const stock = new Set(chunk.flatMap(l => l.quiz || [])).size;
      const checkSize = Math.max(3, unitCheckSize(chunk.length));
      units.push({
        id: chunks.length > 1 ? `palier-${level}-${partIdx + 1}` : `palier-${level}`,
        level,
        part: chunks.length > 1 ? partIdx + 1 : null,
        parts: chunks.length,
        title: chunks.length > 1 ? `Palier ${level} · partie ${partIdx + 1}` : `Palier ${level}`,
        prelude: false,
        courseIds: [...new Set(chunk.map(l => l.courseId))],
        lessons: chunk,
        bonusXp: unitBonusXp(chunk.length),
        checkSize,
        quizPoolSize: stock,
      });
    });
  }
  return units;
}

/**
 * Les unités « Premiers pas » sont-elles FACULTATIVES pour cet utilisateur ?
 * (Facultatives = ouvertes, franchissables, jamais courantes ; sinon elles
 * sont obligatoires et ouvrent le parcours comme n'importe quelle unité.)
 *
 *   1. `onboarding.experience`, s'il est enregistré, décide seul :
 *      "debutant" → obligatoires, toute autre valeur → facultatives.
 *   2. Une progression HORS du module d'initiation (leçon complétée,
 *      vérification réussie) → facultatives : un utilisateur existant n'est
 *      jamais renvoyé en arrière ni bloqué par un module ajouté après coup.
 *   3. Onboarding pas encore fait, aucune progression → obligatoires : le
 *      parcours par défaut est celui du débutant.
 *   4. Onboarding fait : obligatoires seulement pour le débutant déclaré,
 *      soit test de placement sauté (`skipped`) ET niveau A1 — exactement
 *      ce qu'enregistre OnboardingScreen quand on répond « je débute
 *      complètement ». Tout le reste (test passé, quel que soit le score ;
 *      onboarding fait avant l'arrivée de ce module ; ancien compte migré,
 *      `skipped` sans niveau) → facultatives.
 */
export function debutFacultatif(state, units = null) {
  const ob = state?.onboarding || {};
  if (ob.experience === "debutant") return false;
  if (ob.experience) return true;

  const prelude = (units || []).filter(u => u.prelude);
  const leconsPrelude = new Set(prelude.flatMap(u => u.lessons.map(l => l.id)));
  const unitesPrelude = new Set(prelude.map(u => u.id));
  const hors = (id, connus) => !connus.has(id) && !id.startsWith(`${DEBUT_MODULE}-`);
  const autreLecon = Object.keys(state?.completedLessons || {}).some(id => hors(id, leconsPrelude));
  const autreVerif = Object.entries(state?.unitChecks || {}).some(([id, c]) => c?.passed && hors(id, unitesPrelude));
  if (autreLecon || autreVerif) return true;

  if (!ob.done) return false;
  return !(ob.skipped && ob.overallTier === "A1");
}

/**
 * Date de mise en service de l'entrelacement (AAAA-MM-JJ, locale). Toute
 * progression datée d'AVANT a été acquise sous l'ancien découpage (blocs
 * d'un seul module). À aligner sur le jour du déploiement : une date trop
 * tardive offrirait aux nouveaux joueurs de la veille un peu plus d'unités
 * ouvertes que prévu, jamais moins.
 */
export const DATE_ENTRELACEMENT = "2026-10-16";

/**
 * Identifiant d'unité d'avant un découpage. Un palier qui grossit au-delà
 * du seuil est scindé : `palier-2` devient `palier-2-1` et `palier-2-2`
 * (ajout de leçons, octobre 2026). Une vérification réussie ou un coffre
 * ouvert sous `palier-2` vaut alors pour chacune de ses parties : le
 * joueur avait validé tout ce palier, il ne doit rien repasser.
 */
export const idUniteAvantScission = (id) => {
  const m = /^(palier-\d+)-\d+$/.exec(id || "");
  return m ? m[1] : null;
};
const valeurUnite = (table, id) => {
  if (!table) return undefined;
  if (table[id] != null) return table[id];
  const ancien = idUniteAvantScission(id);
  return ancien ? table[ancien] : undefined;
};
// Une valeur non datée (`true`, ancien format) est forcément antérieure.
const avantEntrelacement = (v) => !!v && (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(v) || v < DATE_ENTRELACEMENT);

/**
 * Leçons ouvertes sous l'ANCIEN découpage, pour ne rien reverrouiller chez
 * un joueur qui a progressé avant l'entrelacement.
 *
 * On rejoue l'ancien découpage sur la progression ACQUISE AVANT
 * `DATE_ENTRELACEMENT` uniquement (leçons, vérifications et coffres datés
 * d'avant) : c'est l'état figé de ce que le joueur avait réellement ouvert.
 * Sans cette borne, rejouer l'ancien découpage sur une progression récente
 * ouvrirait d'un coup tout un palier (le premier ancien bloc d'un palier
 * contient des leçons que le nouveau découpage place en fin de palier).
 * Un joueur sans progression antérieure n'hérite donc de rien.
 *
 * Chaîne rejouée, celle de l'époque : première unité, unité précédente
 * complète (toutes ses leçons + vérification réussie), headstart du
 * placement, initiation facultative, unité entamée. Ne renvoie que les
 * leçons des paliers SCINDÉS (ailleurs, les deux découpages sont identiques).
 */
function leconsOuvertesHistorique(courses, state, headstartCount, facultatif) {
  const ouvertes = new Set();
  const completed = Object.fromEntries(Object.entries(state?.completedLessons || {}).filter(([, v]) => avantEntrelacement(v)));
  const claimed = state?.claimedUnits || {};
  const passedAvant = (id) => {
    const c = valeurUnite(state?.unitChecks, id);
    return (!!c?.passed && avantEntrelacement(c.lastAttemptAt ?? true)) || avantEntrelacement(valeurUnite(claimed, id));
  };
  const traces = Object.keys(completed).length > 0
    || Object.keys(state?.unitChecks || {}).some(passedAvant)
    || Object.keys(claimed).some(passedAvant);
  if (!traces) return ouvertes;

  const anciennes = buildUnits(courses, state, { regroupementHistorique: true });
  let precedenteFranchie = true;
  let palierIdx = 0;
  anciennes.forEach((u, i) => {
    const done = u.lessons.some(l => completed[l.id]);
    const complete = u.lessons.length > 0 && u.lessons.every(l => completed[l.id]) && passedAvant(u.id);
    const headstart = !u.prelude && palierIdx++ < headstartCount;
    const optional = !!u.prelude && facultatif && !complete;
    const unlocked = i === 0 || precedenteFranchie || done || headstart || optional;
    if (unlocked && u.part != null && !u.prelude) for (const l of u.lessons) ouvertes.add(l.id);
    precedenteFranchie = complete || headstart || optional;
  });
  return ouvertes;
}

/**
 * Le parcours complet avec statuts :
 * { done, total, complete, unlocked, isCurrent, bonusClaimable, bonusClaimed,
 *   headstart, index }
 *
 * Règles de déblocage :
 *   • la première unité est toujours ouverte ;
 *   • une unité est ouverte si la précédente est FRANCHIE : complète
 *     (leçons + vérification réussie), ou sa vérification déjà réussie, ou
 *     son coffre déjà ouvert (voir « Compatibilité » ci-dessous) ;
 *   • une unité contenant déjà une leçon complétée reste ouverte (reprise
 *     d'une progression existante — personne ne perd son avancement) ;
 *   • les N premières unités DE PALIER sont ouvertes d'emblée si le test de
 *     placement a établi un niveau élevé (`headstart`). Elles ne sont PAS
 *     marquées comme faites : l'utilisateur peut les survoler ou les
 *     travailler ;
 *   • les unités « Premiers pas » (prelude) sont, selon `debutFacultatif`,
 *     obligatoires (chaîne normale, en tête du parcours) ou facultatives
 *     (`optional` : ouvertes, franchissables, jamais « courantes »).
 *
 * ── Compatibilité avec l'ancien découpage (modules non entrelacés) ──────
 * `claimedUnits` et `unitChecks` sont indexés par identifiant d'unité
 * (`palier-6-1`…), et ces identifiants n'ont pas changé, mais le CONTENU
 * des unités d'un palier scindé, si. Règles, pour qu'aucun joueur ne perde
 * rien :
 *   1. Une vérification réussie ou un coffre ouvert reste acquis, à vie :
 *      jamais repassée, jamais re-crédité (le coffre reste « ouvert »).
 *   2. Une unité est COMPLÈTE quand toutes ses leçons ACTUELLES sont faites
 *      et sa vérification réussie (même sous l'ancien contenu). S'il reste
 *      des leçons venues d'un autre bloc, il suffit de les faire : pas de
 *      nouvelle vérification.
 *   3. Une vérification réussie (ou un coffre ouvert) suffit à FRANCHIR
 *      l'unité et à ouvrir la suivante — exactement ce que l'ancien
 *      découpage avait ouvert, puisque les identifiants sont les mêmes.
 *      Pour un nouveau joueur, rien ne change : la vérification n'est
 *      proposée qu'une fois toutes les leçons faites.
 *   4. Une unité est ouverte si elle contient une leçon qui l'était sous
 *      l'ancien découpage (`leconsOuvertesHistorique`) : une leçon déjà
 *      accessible n'est jamais reverrouillée, même déplacée dans une unité
 *      plus lointaine.
 */
export function buildPath(content, state) {
  const completed = state?.completedLessons || {};
  const claimed   = state?.claimedUnits || {};
  const checks    = state?.unitChecks || {};
  const courses = content?.courses || [];
  const units = buildUnits(courses, state);

  const tier = state?.onboarding?.overallTier;
  const headstartCount = state?.onboarding?.done ? (TIER_HEADSTART[tier] ?? 0) : 0;
  const facultatif = debutFacultatif(state, units);
  const ouvertesAvant = leconsOuvertesHistorique(courses, state, headstartCount, facultatif);
  let palierIdx = 0;

  // `prevPassable` plutôt que `prevComplete` : une unité ouverte par le
  // placement est franchissable sans être faite, sinon le déblocage
  // s'arrêterait net au bout du headstart et le joueur se retrouverait
  // sans aucune unité « courante ».
  let prevPassable = true;
  let currentAssigned = false;

  return units.map((u, i) => {
    const done = u.lessons.filter(l => completed[l.id]).length;
    const total = u.lessons.length;
    const lessonsComplete = total > 0 && done === total;
    // valeurUnite : un acquis enregistré sous l'identifiant d'avant
    // scission (`palier-2`) vaut pour chaque partie (`palier-2-1`, `-2`).
    const check = valeurUnite(checks, u.id) || null;
    const checkPassed = !!check?.passed;
    const bonusClaimed = !!valeurUnite(claimed, u.id);
    const complete = lessonsComplete && checkPassed;
    const needsCheck = lessonsComplete && !checkPassed;
    // Acquis (compatibilité, règles 1 et 3) : vérification réussie ou coffre ouvert.
    const acquis = checkPassed || bonusClaimed;
    // Le headstart compte les unités DE PALIER : les unités d'initiation
    // placées devant elles ne décalent pas ce que le placement ouvre.
    const headstart = !u.prelude && palierIdx++ < headstartCount;
    const optional = !!u.prelude && facultatif && !complete;
    const dejaOuverte = acquis || u.lessons.some(l => ouvertesAvant.has(l.id));
    const unlocked = i === 0 || prevPassable || done > 0 || headstart || optional || dejaOuverte;
    // « Unité courante » = la première ouverte non terminée qui n'est pas un
    // simple palier ouvert par le placement : on ne veut pas envoyer un
    // joueur testé B2 travailler le palier 1. Une unité d'initiation
    // facultative ne devient jamais courante, même entamée : un joueur qui
    // y jette un œil ne doit pas voir « Continuer » le ramener aux bases.
    const isCurrent = unlocked && !complete && !currentAssigned && !optional && (!headstart || done > 0);
    if (isCurrent) currentAssigned = true;
    prevPassable = complete || acquis || headstart || optional;

    return {
      // Le titre reste nu : c'est l'écran (pastille « Facultatif » de
      // CoursesScreen) qui signale `optional`, pas un suffixe de texte.
      ...u,
      index: i, done, total, complete, unlocked, isCurrent, optional,
      lessonsComplete, needsCheck, check, headstart,
      bonusClaimable: complete && !bonusClaimed,
      bonusClaimed,
    };
  });
}

/**
 * Pool de questions pour la vérification de fin d'unité.
 *
 * ── Le problème (signalé à l'usage) ──────────────────────────────────────
 * L'ancienne version ne renvoyait QUE les quiz listés dans `lesson.quiz`.
 * Sur le contenu réel :
 *
 *     palier-1 : 4 leçons →  8 questions dans le pool, 8 tirées
 *     palier-2 : 6 leçons →  8 questions dans le pool, 8 tirées
 *
 * Le pool ÉTAIT l'échantillon. Refaire la vérification juste après avoir vu
 * les corrections revenait à la revalider de mémoire, sans avoir compris
 * l'unité. Le contrôle ne contrôlait plus rien.
 *
 * ── Ce que renvoie cette version ─────────────────────────────────────────
 *   { core, extra, review }
 *
 *   core    les quiz explicitement rattachés aux leçons de l'unité.
 *           C'est la matière de l'unité, elle reste prioritaire au tirage.
 *
 *   extra   les quiz du ou des MÊMES modules, dont la leçon d'origine est
 *           déjà complétée, au palier COURANT (ou sans palier de
 *           rattachement précis). Renfort, pas rappel.
 *
 *   review  NOUVEAU. Les quiz du ou des MÊMES modules dont la leçon
 *           d'origine appartient à un PALIER STRICTEMENT ANTÉRIEUR à celui
 *           de l'unité, ET déjà complétée. C'est le rappel explicitement
 *           demandé : « est-ce que ce qui a été vu avant tient toujours ? »
 *           Contrainte stricte, non négociable : une question ne peut
 *           entrer dans `review` que si (a) elle appartient à un palier
 *           strictement inférieur à celui de l'unité en cours, ET (b) la
 *           leçon dont elle dépend est dans `completedLessons`. Sans ces
 *           deux conditions réunies, elle retombe dans `extra` ou est
 *           écartée — jamais promue en rappel sur la base d'une supposition.
 *
 * Distinguer `extra` de `review` demande de connaître le PALIER de la leçon
 * d'origine de chaque question — pas seulement son identifiant. D'où le
 * nouveau paramètre `allCourses` : sans lui, impossible de savoir si une
 * leçon vient d'avant ou d'ici, donc tout retombe dans `extra` comme avant
 * (comportement historique préservé, `review` reste vide).
 *
 * Note conservée de la version précédente : on ne filtre PAS sur `q.lvl`
 * (difficulté 1-3), qui n'est PAS le palier (`lesson.level`, 1-9) — les
 * confondre était une vraie erreur de catégorie corrigée plus tôt.
 *
 * @param unit              l'unité concernée
 * @param allQuiz           la banque complète (content.quiz) — facultatif
 * @param completedLessons  pour n'admettre que du contenu déjà vu
 * @param allCourses        content.courses, pour connaître le palier
 *                          d'origine de chaque leçon — facultatif ; sans
 *                          lui, `review` reste vide et tout retombe dans
 *                          `extra`, comme avant l'ajout de cette catégorie.
 */
export function getUnitQuizPool(unit, allQuiz = null, completedLessons = null, allCourses = null) {
  const seen = new Set();
  const core = [];
  for (const lesson of unit?.lessons || []) {
    for (const qid of lesson.quiz || []) {
      if (!seen.has(qid)) { seen.add(qid); core.push(qid); }
    }
  }

  // Sans la banque complète, on garde le comportement historique : un simple
  // tableau d'identifiants. Les appelants existants continuent de marcher.
  if (!Array.isArray(allQuiz) || allQuiz.length === 0) {
    return Object.assign([...core], { core, extra: [], review: [] });
  }

  const modules   = new Set(unit?.courseIds || []);
  const lessonIds = new Set((unit?.lessons || []).map(l => l.id));

  // Palier d'origine de chaque leçon, pour distinguer rappel (avant) de
  // renfort (ici). Sans `allCourses`, cette table reste vide : aucune
  // question ne pourra jamais être classée `review`, elle tombera dans
  // `extra` — dégradation sans casse, pas d'erreur silencieuse.
  const niveauParLecon = new Map();
  if (Array.isArray(allCourses)) {
    for (const c of allCourses) {
      for (const l of c.lessons || []) niveauParLecon.set(l.id, l.level);
    }
  }

  const extra = [];
  const review = [];
  for (const q of allQuiz) {
    if (seen.has(q.id)) continue;
    if (!modules.has(q.courseId)) continue;
    // Une question rattachée à une leçon extérieure à l'unité n'est admise
    // que si cette leçon a été complétée : on ne teste jamais sur du contenu
    // que l'utilisateur n'a pas encore ouvert. Cette garde s'applique aux
    // DEUX catégories, extra et review — c'est elle qui garantit qu'aucune
    // question de rappel ne porte sur du contenu jamais vu.
    if (q.lessonId && !lessonIds.has(q.lessonId) && !completedLessons?.[q.lessonId]) continue;

    seen.add(q.id);
    const niveauOrigine = q.lessonId ? niveauParLecon.get(q.lessonId) : undefined;
    const estPalierAnterieur = niveauOrigine != null && unit?.level != null && niveauOrigine < unit.level;
    (estPalierAnterieur ? review : extra).push(q.id);
  }

  // Le tableau reste itérable comme avant (compatibilité), avec `core`,
  // `extra` et `review` accessibles pour les appelants qui savent les
  // exploiter.
  return Object.assign([...core, ...extra, ...review], { core, extra, review });
}

/**
 * Prochaine leçon dans l'ordre du parcours (unités débloquées uniquement).
 * Retourne { course, lesson, unit } ou null si tout est complété.
 */
export function getNextLesson(content, state) {
  const completed = state?.completedLessons || {};
  const path = buildPath(content, state);
  let pendingCheckUnit = null;

  // Priorité à l'unité courante (celle que l'app considère « en cours »),
  // pour ne pas renvoyer un joueur expérimenté vers un palier ouvert par le
  // placement mais volontairement survolé.
  // Les unités d'initiation facultatives passent en dernier : elles ne
  // sont jamais proposées avant le contenu du parcours lui-même.
  const ordered = [...path.filter(u => u.isCurrent), ...path.filter(u => !u.optional), ...path.filter(u => u.optional)];
  const seen = new Set();

  for (const u of ordered) {
    if (!u.unlocked || seen.has(u.id)) continue;
    seen.add(u.id);
    if (u.needsCheck && !pendingCheckUnit) pendingCheckUnit = u;
    for (const lesson of u.lessons) {
      if (!completed[lesson.id]) {
        const course = (content?.courses || []).find(c => c.id === lesson.courseId);
        return { course, lesson, unit: u };
      }
    }
  }
  if (pendingCheckUnit) return { course: null, lesson: null, unit: pendingCheckUnit, needsCheck: true };
  return null;
}

/** Statistiques globales du parcours (pour l'en-tête de l'écran). */
export function getPathStats(content, state) {
  const path = buildPath(content, state);
  const totalLessons = path.reduce((a, u) => a + u.total, 0);
  const doneLessons  = path.reduce((a, u) => a + u.done, 0);
  const currentUnit  = path.find(u => u.isCurrent) || null;
  return {
    units: path.length,
    completedUnits: path.filter(u => u.complete).length,
    totalLessons, doneLessons,
    pct: totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0,
    currentUnit,
  };
}
