// Groply — store/seance.js
// La SÉANCE DU JOUR : composée automatiquement, en pur calcul (aucun effet,
// aucune écriture). Elle enchaîne des activités qui existent déjà —
// révision, exercice, Jam Session — et sait quelles étapes sont FAITES en
// lisant la progression réelle : on ne peut pas cocher une étape sans l'avoir
// faite, et une séance commencée sur un appareil se poursuit sur un autre.
//
// Durées : les exercices de l'app durent de 8 à 20 minutes. Une séance de 5
// ou 15 minutes n'en contient donc pas (en faire un plus court serait du
// contenu à créer, pas une question d'interface) :
//   5 min  → Révision, puis Jouer
//   15 min → Révision, puis Jouer, plus longtemps
//   30 min → Révision, Guitare en main (un vrai exercice), puis Jouer
//
// L'OBJECTIF choisi au test d'accueil, longtemps ignoré, oriente la séance :
// « Improviser » allonge Jouer, « La théorie » allonge la Révision,
// « Le manche » choisit l'exercice dans le module Manche.
//
// DÉBUTANT (« Premiers pas » obligatoire et pas encore fini, voir
// `seanceDebutant`) : l'étape « Jouer » n'envoie PAS en Jam Session, dont
// les contextes d'impro supposent des gammes qu'il n'a pas encore vues. Elle
// propose un morceau débutant d'Outils › Morceaux, choisi selon les leçons
// faites (voir `choisirJeuDebutant`), ou à défaut un exercice de Premiers
// pas (changements d'accords…). Le temps joué dans le lecteur de morceaux
// compte pour l'étape comme celui de la Jam.

import { familleDe, domaineDe } from "./generateurs.js";
import { buildUnits, debutFacultatif, DEBUT_MODULE } from "./pathEngine.js";
import { morceauParId } from "../morceaux/catalogue.js";

export const DUREES = [5, 15, 30];

// « Premiers pas » (module d'initiation debut) n'a pas de compétences
// générées : seules ses questions écrites composent son vivier.
const MODULES_DOMAINE = { "Premiers pas": ["debut"], "Manche": ["neck"], "Théorie": ["scales", "harmony"], "Oreille": [], "Rythme": ["rhythm"], "Impro": ["impro"] };
/**
 * Questions d'un seul domaine : les compétences générées selon leur domaine,
 * les questions écrites selon leur module. (L'oreille n'a pas de module de
 * questions écrites : seulement ses compétences d'écoute.)
 */
export function vivierDuDomaine(questions, domaine) {
  const modules = MODULES_DOMAINE[domaine] || [];
  return questions.filter(q => {
    const f = familleDe(q.id);
    return f ? domaineDe(f) === domaine : modules.includes(q.courseId);
  });
}

/** Durée proposée par défaut, d'après le temps indiqué au test d'accueil. */
export function dureeParDefaut(timePerWeek) {
  return { short: 5, medium: 15, long: 30 }[timePerWeek] ?? 15;
}

/** Nombre de jours de pratique visé par semaine, d'après ce même temps. */
export function objectifJoursSemaine(timePerWeek) {
  return { short: 2, medium: 3, long: 5 }[timePerWeek] ?? 3;
}

const BASE = {
  5:  { revision: 3, jouer: 2 },
  15: { revision: 6, jouer: 9 },
  30: { revision: 8, jouer: 10 },
};
const MODULES_OBJECTIF = { manche: ["neck"], theorie: ["scales", "harmony"], impro: ["impro"] };
const DUREE_EXERCICE_IDEALE = 12;

/** Nombre de questions de révision pour une durée donnée (≈ 1,4 question par minute). */
export const questionsPour = (minutes) => Math.max(3, Math.round(minutes * 1.4));

/**
 * Un exercice est jouable quand toutes ses leçons requises sont faites :
 * `unlockedBy` (liste) et `courseLink` (la leçon liée). Règle unique,
 * partagée par la séance et la liste d'exercices de l'onglet Pratique.
 */
export function exerciceDebloque(e, faites = {}) {
  return (!e.unlockedBy?.length || e.unlockedBy.every(id => faites[id])) && (!e.courseLink || !!faites[e.courseLink]);
}

/**
 * Exercices de certains modules : débloqués (niveau croissant, ordre du
 * contenu à niveau égal) et encore verrouillés (ordre du contenu).
 */
export function exercicesDesModules(content, state, modules) {
  const faites = state.completedLessons || {};
  const tous = (content.exercises || []).filter(e => modules.includes(e.mod));
  return {
    dispo: tous.filter(e => exerciceDebloque(e, faites)).sort((a, b) => (a.lvl || 1) - (b.lvl || 1)),
    verrouilles: tous.filter(e => !exerciceDebloque(e, faites)),
  };
}

/**
 * Exercice de l'étape « Guitare en main » : débloqué, lié à une leçon déjà
 * faite, jamais fait de préférence (sinon le plus ancien), dans le module de
 * l'objectif si possible, et pas trop long.
 */
export function choisirExercice(state, content, objectif) {
  const faites = state.completedLessons || {};
  const fait = state.completedExercises || {};
  const prefere = MODULES_OBJECTIF[objectif] || [];
  const candidats = (content.exercises || []).filter(e => exerciceDebloque(e, faites));
  if (!candidats.length) return null;
  const cle = (e) => [
    fait[e.id] ? 1 : 0,                                   // jamais fait d'abord
    fait[e.id]?.lastAt || "",                             // sinon le plus ancien
    prefere.includes(e.mod) ? 0 : 1,                      // module de l'objectif
    (e.dur ?? 99) <= DUREE_EXERCICE_IDEALE ? 0 : 1,       // pas trop long
    e.lvl ?? 9,
  ];
  return [...candidats].sort((a, b) => {
    const ka = cle(a), kb = cle(b);
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] < kb[i] ? -1 : 1;
    return 0;
  })[0];
}

/**
 * La séance est-elle celle d'un débutant ? Oui tant que le module
 * « Premiers pas » n'est pas fini ET qu'il est obligatoire pour lui (débutant
 * déclaré, ou parcours par défaut — même règle que le Parcours). Un joueur
 * confirmé qui feuillette Premiers pas garde la Jam Session.
 */
export function seanceDebutant(state, content) {
  const debut = (content?.courses || []).find(c => c.id === DEBUT_MODULE);
  if (!debut?.lessons?.length) return false;
  const faites = state?.completedLessons || {};
  if (debut.lessons.every(l => faites[l.id])) return false;
  return !debutFacultatif(state, buildUnits(content.courses, state));
}

/**
 * Morceaux débutants, et les leçons qu'il faut avoir faites pour les jouer.
 * Du plus récent au plus ancien dans Premiers pas : la séance propose ce que
 * l'élève vient d'apprendre.
 */
export const MORCEAUX_DEBUTANT = [
  { morceau: "frere-jacques",       requis: ["debut-c3-03"] },
  { morceau: "au-clair-de-la-lune", requis: ["debut-c3-03"] },
  { morceau: "ode-a-la-joie",       requis: ["debut-c3-03"] },
  // Sol, Mim, Do, Ré : les deux leçons d'accords ouverts.
  { morceau: "premiers-accords",    requis: ["debut-c2-02", "debut-c2-03"] },
];
// Ordre de repli quand aucun morceau n'est encore jouable : d'abord les
// changements d'accords, puis le reste de Premiers pas, du plus avancé au plus simple.
const EXERCICES_DEBUTANT = ["ex-debut-04", "ex-debut-05", "ex-debut-06", "ex-debut-03", "ex-debut-02", "ex-debut-01"];

/** Rang du jour (entier), pour faire tourner les morceaux d'un jour à l'autre. */
const rangDuJour = (today) => {
  const [a, m, j] = String(today || "").split("-").map(Number);
  return Number.isFinite(a + m + j) ? Math.floor(Date.UTC(a, m - 1, j) / 86400000) : 0;
};

/**
 * Ce que l'étape « Jouer » propose à un débutant :
 *   { morceau } un morceau débutant jouable (accords et tab déjà vus) ; si
 *               plusieurs le sont, ceux de la DERNIÈRE leçon apprise, en
 *               rotation d'un jour à l'autre (les trois mélodies après
 *               « Premières mélodies », sinon Premiers accords) ;
 *   { exercice } sinon, un exercice débloqué de Premiers pas (en priorité
 *               les changements d'accords), autre que `exclu` ;
 *   { outil: "tuner" } en dernier recours (rien de débloqué).
 */
export function choisirJeuDebutant(state, content, today, exclu = null) {
  const faites = state?.completedLessons || {};
  const jouables = MORCEAUX_DEBUTANT.filter(m => m.requis.every(id => faites[id]) && morceauParId(m.morceau));
  if (jouables.length) {
    const cle = jouables[0].requis.join("+");
    const derniers = jouables.filter(m => m.requis.join("+") === cle);
    return { morceau: derniers[rangDuJour(today) % derniers.length].morceau };
  }
  const exos = new Map((content?.exercises || []).map(e => [e.id, e]));
  for (const id of EXERCICES_DEBUTANT) {
    const e = exos.get(id);
    if (e && e.id !== exclu && exerciceDebloque(e, faites)) return { exercice: e };
  }
  return { outil: "tuner" };
}

/**
 * Compose la séance du jour et indique ce qui est fait.
 * @returns {{ etapes: Array<{id, titre, detail, minutes, fait, questions?, exercice?}>,
 *             prochaine: object|null, terminee: boolean, totalMinutes: number }}
 */
export function planSeance({ duree = 15, objectif = "global", state, content, today, revisionDisponible = Infinity }) {
  // Aucune leçon faite : rien à réviser ni à jouer de pertinent, la séance
  // renvoie vers le Parcours (au lieu d'ouvrir une révision vide).
  if (!Object.keys(state.completedLessons || {}).length) return { vide: true, etapes: [], prochaine: null, terminee: false, totalMinutes: 0 };
  const d = BASE[duree] ? duree : 15;
  let { revision, jouer } = BASE[d];
  if (objectif === "impro")   { const t = Math.min(2, revision - 2); revision -= t; jouer += t; }
  if (objectif === "theorie") { const t = Math.min(2, jouer - 2);    jouer -= t;    revision += t; }

  const etapes = [];
  const reviseAujourdhui = state.derniereRevision === today
    || (state.sessionHistory || []).some(h => h.type === "review" && h.date === today);
  if (!reviseAujourdhui && revisionDisponible <= 0) {
    // Tout est à jour : l'étape est faite d'office (sinon elle ne pourrait
    // JAMAIS l'être, une révision vide ne se terminant pas), et son temps va au jeu.
    jouer += revision;
    etapes.push({ id: "revision", titre: "Révision", minutes: 0, questions: 0, aJour: true,
      detail: "Tout est à jour aujourd'hui", fait: true });
    revision = 0;
  } else {
    const nbQuestions = Math.max(1, Math.min(questionsPour(revision), revisionDisponible));
    etapes.push({ id: "revision", titre: "Révision", minutes: revision, questions: nbQuestions,
      detail: `${nbQuestions} question${nbQuestions > 1 ? "s" : ""} · compétences et quiz`, fait: reviseAujourdhui });
  }

  let exGuitare = null;
  if (d === 30) {
    const ex = choisirExercice(state, content, objectif);
    exGuitare = ex;
    if (ex) {
      const exFaitAujourdhui = Object.values(state.completedExercises || {}).some(x => x?.lastAt === today);
      const minutesEx = ex.dur ?? DUREE_EXERCICE_IDEALE;
      jouer = Math.max(5, 30 - revision - minutesEx);
      etapes.push({ id: "guitare", titre: "Guitare en main", minutes: minutesEx, exercice: ex,
        detail: ex.title, fait: exFaitAujourdhui });
    } else {
      jouer = 30 - revision;   // aucun exercice disponible : le temps va au jeu
    }
  }

  const jam = state.jam || {};
  const secondesJour = jam.jour === today ? (jam.secondesJour || 0) : 0;
  const jeuTempo = { secondesCible: jouer * 60, secondesFaites: Math.min(secondesJour, jouer * 60), fait: secondesJour >= jouer * 60 };
  if (seanceDebutant(state, content)) {
    const jeu = choisirJeuDebutant(state, content, today, exGuitare?.id);
    if (jeu.morceau) {
      etapes.push({ id: "jouer", titre: "Jouer", minutes: jouer, ...jeuTempo, debutant: true, morceau: jeu.morceau,
        detail: `Morceau · ${morceauParId(jeu.morceau).titre}` });
    } else if (jeu.exercice) {
      // Un exercice se termine (il est alors coché), il ne se chronomètre pas.
      const fait = state.completedExercises?.[jeu.exercice.id]?.lastAt === today || jeuTempo.fait;
      etapes.push({ id: "jouer", titre: "Jouer", minutes: jouer, ...jeuTempo, fait, debutant: true, exercice: jeu.exercice,
        detail: `Exercice · ${jeu.exercice.title}` });
    } else {
      etapes.push({ id: "jouer", titre: "Jouer", minutes: jouer, ...jeuTempo, debutant: true, outil: "tuner",
        detail: "Accorde ta guitare, puis gratte les cordes à vide" });
    }
  } else {
    etapes.push({ id: "jouer", titre: "Jouer", minutes: jouer, ...jeuTempo,
      detail: "Jam Session · avec une contrainte à tenir" });
  }

  const prochaine = etapes.find(e => !e.fait) || null;
  return { etapes, prochaine, terminee: !prochaine, totalMinutes: etapes.reduce((s, e) => s + e.minutes, 0) };
}

/** Jours de pratique de la semaine en cours (dates locales "AAAA-MM-JJ"). */
export function joursDeLaSemaine(state, semaineCourante) {
  const s = state.semaine;
  return s && s.cle === semaineCourante ? [...new Set(s.jours || [])] : [];
}

/** Lundi = 0 … dimanche = 6, pour une date locale "AAAA-MM-JJ". */
export function indexJour(dateStr) {
  const [a, m, j] = dateStr.split("-").map(Number);
  return (new Date(a, m - 1, j).getDay() + 6) % 7;
}
