// Groply — store/unitCheckSampler.js
//
// Logique pure de composition de l'échantillon de vérification d'unité,
// extraite de screens/UnitCheckScreen.jsx.
//
// Pourquoi ce module existe : cette logique n'a rien de "React", elle ne
// fait que choisir des questions dans un pool selon des règles. Elle vivait
// pourtant dans le fichier .jsx de l'écran — ce qui la rendait impossible à
// tester directement avec `node --test`, qui ne sait pas analyser du JSX.
// Toute la suite de tests du projet importe exclusivement depuis des
// modules .js purs (store/reviewEngine.js, store/xp.js...), jamais depuis
// un écran : ce module aligne cette partie du code sur ce principe déjà
// établi partout ailleurs, plutôt que de faire une exception.
//
// UnitCheckScreen.jsx importe désormais buildSample et melangerOptions
// d'ici, au lieu de les définir localement.
import { getUnitQuizPool, UNIT_CHECK_MAX_QUESTIONS } from "./pathEngine.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Compose l'échantillon de la vérification.
 *
 * ── Historique ─────────────────────────────────────────────────────────
 * v1 : le pool faisait exactement la taille de l'échantillon sur les
 *      premiers paliers — toujours les mêmes questions, un contrôle qui ne
 *      contrôlait plus rien une fois les corrections vues une fois.
 * v2 : pool élargi au renfort (même module, déjà complété), dosage
 *      deux-tiers/un-tiers, rotation par tentative précédente.
 * v3 (celle-ci) : cible passée de ~7 à 15, et un TROISIÈME étage —
 *      2 à 3 questions de RAPPEL, tirées de paliers déjà complétés. Objectif
 *      explicite : s'assurer que l'utilisateur a vraiment étudié le
 *      contenu, pas seulement eu de la chance sur un petit échantillon.
 *
 * ── Répartition des 15 questions ─────────────────────────────────────────
 *   1. RAPPEL   jusqu'à 3, jamais plus que ce qui existe réellement (une
 *               unité de palier 1 ou 2 n'a simplement rien à rappeler —
 *               0 rappel dans ce cas, pas une valeur forcée).
 *   2. CŒUR     le reste, à hauteur de deux tiers, plafonné à la moitié du
 *               cœur disponible (pour que la rotation reste possible d'une
 *               tentative à l'autre).
 *   3. RENFORT  complète jusqu'à la cible.
 *   4. CŒUR     à nouveau, si le renfort ne suffit pas à atteindre 15 (cas
 *               des tout premiers paliers, où renfort ET rappel peuvent
 *               être vides).
 *
 * Contrainte non négociable, garantie par pathEngine.getUnitQuizPool et pas
 * réévaluée ici : AUCUNE question de rappel ne porte sur du contenu que
 * l'utilisateur n'a pas complété. Le filtrage se fait à la source, cette
 * fonction ne fait que répartir ce qui lui est déjà remis, déjà filtré.
 *
 * @param dejaVues  identifiants posés à la tentative précédente
 */
// Exportée pour être testée directement (test/unitCheck.test.mjs) — les
// garanties qu'elle porte (jamais de contenu non étudié en rappel, rappel
// plafonné à un nombre fixe) sont trop importantes pour ne vivre que dans
// un script de vérification jetable.
export function buildSample(unit, content, completedLessons, dejaVues = []) {
  const pool = getUnitQuizPool(unit, content.quiz, completedLessons, content.courses);
  const parId = new Map(content.quiz.map(q => [q.id, q]));

  // Cet écran ne sait afficher que des QCM : il rend `q.o` en liste de
  // boutons. Les questions de type "fretboard" n'ont pas de tableau
  // d'options (elles se répondent sur le manche) — en laisser passer une
  // provoquerait un crash au rendu.
  const utilisable = (q) =>
    q && q.type !== "fretboard" && Array.isArray(q.o) && q.o.length >= 2
      && typeof q.a === "number" && q.a >= 0 && q.a < q.o.length;

  const resoudre = (ids) => ids.map(id => parId.get(id)).filter(utilisable);

  const taille = Math.min(
    unit.checkSize ?? UNIT_CHECK_MAX_QUESTIONS,
    pool.length || 1
  );

  const core   = resoudre(pool.core ?? pool);
  const extra  = resoudre(pool.extra ?? []);
  const review = resoudre(pool.review ?? []);
  const ecarte = new Set(dejaVues);

  // On sépare le "jamais posé" du "déjà posé" et on épuise le premier avant
  // de retomber sur le second : la rotation est ainsi progressive plutôt que
  // stricte, et on ne se retrouve jamais avec un échantillon incomplet.
  const parPriorite = (liste) => [
    ...shuffle(liste.filter(q => !ecarte.has(q.id))),
    ...shuffle(liste.filter(q =>  ecarte.has(q.id))),
  ];

  const filesCore   = parPriorite(core);
  const filesExtra  = parPriorite(extra);
  const filesReview = parPriorite(review);

  // Jusqu'à 3 rappels — jamais forcé au-delà de ce qui existe vraiment.
  const cibleRevision = Math.min(3, filesReview.length);

  // Le reste se répartit comme avant (deux tiers cœur / un tiers renfort),
  // mais sur ce qu'il RESTE une fois le rappel casé — et jamais plus que la
  // moitié du cœur disponible, toujours pour préserver la rotation d'une
  // tentative à l'autre.
  const restant = taille - cibleRevision;
  const cibleCore = Math.max(1, Math.min(
    Math.round(restant * 0.65),
    Math.ceil(core.length / 2),
  ));

  const choisies = [];
  const prises = new Set();
  const ajouter = (q) => {
    if (!q || prises.has(q.id) || choisies.length >= taille) return;
    prises.add(q.id); choisies.push(q);
  };

  for (const q of filesReview) { if (choisies.length >= cibleRevision)      break; ajouter(q); }
  for (const q of filesCore)   { if (choisies.length >= cibleRevision+cibleCore) break; ajouter(q); }
  for (const q of filesExtra)  { if (choisies.length >= taille)             break; ajouter(q); }
  // Complément : si le renfort ne suffit pas, le cœur finit de remplir —
  // ça reste une question SUR CETTE unité, donc légitime d'en reprendre au
  // besoin. Le rappel, lui, n'a PAS de complément : 3 est un plafond dur,
  // pas une cible de repli. Sur une unité au cœur trop petit pour compenser,
  // l'échantillon final sera simplement plus court que 15 — plus honnête
  // qu'un rappel gonflé artificiellement pour atteindre un compte rond.
  for (const q of filesCore)   { if (choisies.length >= taille)             break; ajouter(q); }

  // Ordre de présentation mélangé : le rappel n'est pas cantonné à la fin,
  // le cœur pas systématiquement en premier.
  return shuffle(choisies);
}

/**
 * Mélange les propositions d'une question.
 *
 * Sans ça, la bonne réponse reste au même rang d'une tentative à l'autre :
 * on peut valider en mémorisant « c'était la troisième » sans lire l'énoncé.
 * On renvoie une copie — jamais de mutation de la banque de contenu, qui est
 * partagée avec le reste de l'app.
 */
export function melangerOptions(q) {
  if (!Array.isArray(q?.o) || q.o.length < 2) return q;
  const indices = shuffle(q.o.map((_, i) => i));
  return {
    ...q,
    o: indices.map(i => q.o[i]),
    a: indices.indexOf(q.a),
  };
}

export { shuffle };
