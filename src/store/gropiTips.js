// Groply — store/gropiTips.js
//
// Choix du conseil de Gropi. Le contenu (≈ 130 entrées) vit dans
// gropiCatalogue.js ; ici, seulement la logique, PURE et testable : la date
// et le hasard sont injectables (ctx.date / ctx.jour / ctx.rng).
//
// Règles (voir aussi src/content/README.md) :
//   1. Stable dans la journée : le conseil retenu est mémorisé dans
//      state.gropiJour ({ date, id }) via l'action GROPI_TIP_VU. Tant que la
//      date est la même et que le conseil reste éligible, pickTip le
//      renvoie tel quel — re-rendu ou rechargement n'y changent rien. Seul
//      « Un autre conseil » (ctx.nouveau) en tire un nouveau.
//   2. Pertinent : on préfère, dans l'ordre, un conseil écrit pour la leçon
//      en cours (lecons), dont un mot-clé apparaît dans son titre (mots),
//      du module en cours (modules), puis générique ("all"). Le palier
//      (niveau) et les conditions (cond) filtrent avant tout.
//   3. Sans répétition : rien n'est remontré tant qu'il reste, dans le
//      contexte, un conseil jamais vu (state.gropiVus). Pool épuisé → on
//      repart des conseils vus il y a le plus longtemps (moitié la plus
//      ancienne), jamais du dernier montré.
//   4. Varié : un rappel de progression au plus une fois sur 4 (aucun dans
//      les 3 derniers conseils vus) ; les rappels « prioritaires » (révisions
//      en retard, série perdue…) passent devant quand ils sont permis.
//      Entre conseil et anecdote, tirage pondéré, en évitant un 3e conseil
//      du même type d'affilée.

import { GROPI_CATALOGUE } from "./gropiCatalogue.js";
import { POSE_PAR_TYPE } from "../design/gropiPoses.js";
import { dayStr } from "./dates.js";
export { GROPI_VUS_MAX, ajouterVu, fusionnerVus } from "./gropiHistorique.js";

export { GROPI_CATALOGUE };

export const TIP_LABELS = { tip: "Conseil de Gropi", anecdote: "Anecdote musicale", progress: "Ta progression" };

const POIDS_TYPE = { tip: 0.5, anecdote: 0.35, progress: 0.15 };
const BOOST_PERTINENCE = { 4: 4, 3: 3, 2: 2, 1: 0.6 };

const sansAccents = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// PRNG déterministe (mulberry32) + hachage de chaîne : même graine, même tirage.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function rngDepuis(graine) {
  let a = hash(String(graine));
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Le conseil est-il affichable pour cet état et ce contexte ? */
function eligible(e, state, c) {
  if (e.niveau && c.palier != null) {
    const [min, max] = e.niveau;
    if (c.palier < min || c.palier > max) return false;
  }
  if (e.cond) { try { if (!e.cond(state, c)) return false; } catch { return false; } }
  return true;
}

/** 4 = écrit pour la leçon, 3 = mot-clé du titre, 2 = module, 1 = générique, 0 = hors sujet. */
export function pertinence(e, c) {
  if (!c.moduleCourant && !c.leconCourante) return 1;   // aucun contexte : tout se vaut
  if (c.leconCourante && e.lecons?.includes(c.leconCourante)) return 4;
  if (c.titreLecon && e.mots?.length) {
    const t = sansAccents(c.titreLecon);
    if (e.mots.some(m => t.includes(sansAccents(m)))) return 3;
  }
  const mods = e.modules || ["all"];
  if (c.moduleCourant && mods.includes(c.moduleCourant)) return 2;
  if (mods.includes("all")) return 1;
  return 0;
}

function rendre(e, state, c) {
  let text;
  try { text = typeof e.text === "function" ? e.text(state, c) : e.text; } catch { text = ""; }
  return {
    id: e.id, type: e.type, text,
    pose: e.pose || POSE_PAR_TYPE[e.type] || "idea",
    label: TIP_LABELS[e.type] || TIP_LABELS.tip,
  };
}

const DEFAUT = { id: "defaut", type: "tip", text: "Gropi est là pour toi. Une leçon, une révision ou une Jam : tout compte.", pose: "idea", label: TIP_LABELS.tip };

function tirerPondere(options, rng) {
  const total = options.reduce((a, o) => a + o.poids, 0);
  let r = rng() * total;
  for (const o of options) { r -= o.poids; if (r < 0) return o.valeur; }
  return options[options.length - 1].valeur;
}

/**
 * Choisit le conseil à montrer.
 *
 * @param state  état de progression (lit gropiVus, gropiJour + ce que lisent les conditions)
 * @param ctx    {
 *   moduleCourant, leconCourante, titreLecon, palier,   contexte d'étude
 *   toReview, leconsRestantes,                          stats facultatives
 *   nouveau     true = « un autre conseil » (ignore celui du jour)
 *   date | jour Date ou "AAAA-MM-JJ" (défaut : aujourd'hui, heure locale)
 *   rng         () => [0,1) (défaut : PRNG semé par la date et l'historique)
 *   catalogue   pour les tests (défaut : GROPI_CATALOGUE)
 * }
 * @returns { id, type, text, pose, label }
 */
export function pickTip(state = {}, ctx = {}) {
  const catalogue = ctx.catalogue || GROPI_CATALOGUE;
  const jour = ctx.jour || dayStr(ctx.date || new Date());
  const c = { ...ctx, jour, jourSemaine: new Date(`${jour}T12:00:00`).getDay() };
  const vus = Array.isArray(state.gropiVus) ? state.gropiVus : [];
  const memo = state.gropiJour;
  const parId = new Map(catalogue.map(e => [e.id, e]));

  // 1. Stable dans la journée.
  if (!c.nouveau && memo?.date === jour && parId.has(memo.id)) {
    const e = parId.get(memo.id);
    if (eligible(e, state, c)) return rendre(e, state, c);
  }

  // 2. Pool du contexte : éligibles, pertinents, jamais le conseil actuel.
  const exclu = c.nouveau && memo?.date === jour ? memo.id : null;
  let pool = catalogue
    .filter(e => e.id !== exclu && eligible(e, state, c))
    .map(e => ({ e, p: pertinence(e, c), rang: vus.lastIndexOf(e.id) }))
    .filter(x => x.p > 0);
  if (pool.length === 0) return DEFAUT;

  // 3. Jamais vus d'abord ; pool épuisé → la moitié vue il y a le plus longtemps.
  let frais = pool.filter(x => x.rang === -1);
  if (frais.length === 0) {
    const tries = [...pool].sort((a, b) => a.rang - b.rang);
    const dernier = vus[vus.length - 1];
    frais = tries.slice(0, Math.max(1, Math.ceil(tries.length / 2))).filter(x => x.e.id !== dernier);
    if (frais.length === 0) frais = tries;
  }

  const rng = c.rng || rngDepuis(`${jour}|${vus.length}|${exclu || ""}`);
  const typeDe = (id) => parId.get(id)?.type;
  const recents = vus.slice(-3).map(typeDe);
  const progressPermis = !recents.includes("progress");

  // 4a. Rappels prioritaires (si un rappel est permis).
  let candidats = null;
  if (progressPermis) {
    const prio = frais.filter(x => x.e.type === "progress" && x.e.priorite);
    if (prio.length) candidats = prio;
  }

  // 4b. Sinon, tirage pondéré du type.
  if (!candidats) {
    const parType = {};
    for (const x of frais) (parType[x.e.type] ||= []).push(x);
    let types = Object.keys(parType).filter(t => t !== "progress" || progressPermis);
    if (types.length === 0) types = Object.keys(parType);
    const deuxDerniers = vus.slice(-2).map(typeDe);
    const memeType = deuxDerniers.length === 2 && deuxDerniers[0] === deuxDerniers[1] ? deuxDerniers[0] : null;
    // Un type qui a quelque chose de PERTINENT à dire (leçon, mot-clé,
    // module) pèse plus lourd qu'un type qui n'a que du générique.
    const options = types.map(t => ({
      valeur: t,
      poids: (POIDS_TYPE[t] ?? 0.2)
        * (BOOST_PERTINENCE[Math.max(...parType[t].map(x => x.p))] ?? 1)
        * (t === memeType && types.length > 1 ? 0.25 : 1),
    }));
    candidats = parType[tirerPondere(options, rng)];
  }

  // 5. Dans ce type, le niveau de pertinence le plus élevé, puis au hasard.
  const meilleur = Math.max(...candidats.map(x => x.p));
  const top = candidats.filter(x => x.p === meilleur);
  const choisi = top[Math.floor(rng() * top.length) % top.length].e;
  return rendre(choisi, state, c);
}

/**
 * Contexte d'étude tiré du parcours (sortie de buildPath) : la prochaine
 * leçon de l'unité courante, son module, son palier, et ce qu'il reste
 * dans l'unité. Pur : à memoïser côté écran.
 */
export function contexteGropi(path = [], state = {}, extras = {}) {
  const done = state.completedLessons || {};
  const unite = path.find(u => u.isCurrent) || null;
  const lecon = unite?.lessons.find(l => !done[l.id]) || null;
  return {
    moduleCourant: lecon?.courseId ?? null,
    leconCourante: lecon?.id ?? null,
    titreLecon: lecon?.title ?? "",
    palier: unite ? (unite.level ?? 0) : null,
    leconsRestantes: unite ? unite.lessons.filter(l => !done[l.id]).length : null,
    ...extras,
  };
}
