// Groply — src/lecon/cartes.js
// Logique PURE des « leçons en cartes » (aucun JSX, aucun accès au DOM) :
// validation du format, navigation, reprise, retour d'une question. Testée
// sous Node (test/lecon-cartes.test.mjs) et utilisée par le vérificateur de
// contenu (scripts/verifier-contenu.mjs) comme par l'écran (LeconCartes.jsx).
//
// Format décrit dans src/content/README.md, section « Leçons en cartes ».
import { updateReviewHistory } from "../store/reviewEngine.js";

export const TYPES_CARTE = ["idee", "question", "a-toi", "recap"];

/** Blocs de diagramme acceptés dans une carte (ceux de renderDiagramBlock). */
export const BLOCS_DIAGRAMME = [
  "fretboard", "scale_pattern", "interval_chart", "chord_diagram", "caged_form", "note_grid",
  "rhythm_grid", "strum_pattern", "circle_of_fifths", "degree_chart", "tab",
];

export const MOTS_MAX_IDEE = 70;         // au-delà : avertissement
export const CARTES_MIN = 6, CARTES_MAX = 10;
export const IDEES_SANS_QUESTION_MAX = 3; // au-delà : avertissement
export const BPM_MIN = 30, BPM_MAX = 240;
export const MINUTEUR_MIN = 10, MINUTEUR_MAX = 600;

export const compterMots = (texte) => String(texte || "").split(/\s+/).filter(m => /[\p{L}\p{N}]/u.test(m)).length;

/** Les paragraphes d'une carte idée (`texte` : chaîne ou tableau). */
export const paragraphes = (carte) => (Array.isArray(carte?.texte) ? carte.texte : carte?.texte ? [carte.texte] : []);

/** Tout le texte lu par l'élève sur une carte (hors diagramme et hors question). */
export function texteDeCarte(carte) {
  if (!carte) return "";
  if (carte.type === "idee") return [carte.titre, ...paragraphes(carte)].join(" ");
  if (carte.type === "a-toi") return [carte.titre, carte.consigne].filter(Boolean).join(" ");
  if (carte.type === "recap") return (carte.points || []).join(" ");
  return "";
}

/** Champs propres à une question écrite dans la carte (interdits avec quizId). */
const CHAMPS_QUESTION = ["q", "o", "a", "exp"];

/**
 * Résout une carte question : avec `quizId`, l'énoncé, les choix, la réponse
 * et l'explication viennent de la question de quiz référencée — il n'y a
 * jamais deux versions d'une même question. Renvoie null si introuvable.
 */
export function resoudreQuestion(carte, quizParId) {
  if (!carte || carte.type !== "question") return null;
  if (carte.quizId) {
    const src = quizParId?.get ? quizParId.get(carte.quizId) : quizParId?.[carte.quizId];
    if (!src || !Array.isArray(src.o)) return null;
    return { quizId: carte.quizId, q: src.q, o: src.o, a: src.a, exp: src.exp };
  }
  if (typeof carte.q !== "string" || !Array.isArray(carte.o)) return null;
  return { quizId: null, q: carte.q, o: carte.o, a: carte.a, exp: carte.exp };
}

function validerBloc(bloc, ou, erreurs) {
  if (bloc == null) return;
  if (typeof bloc !== "object" || !BLOCS_DIAGRAMME.includes(bloc.type)) {
    erreurs.push(`${ou} : bloc de diagramme inconnu « ${bloc?.type} » (attendu : ${BLOCS_DIAGRAMME.join(", ")})`);
  } else if (!bloc.data || typeof bloc.data !== "object") {
    erreurs.push(`${ou} : bloc ${bloc.type} sans data`);
  }
}

/**
 * Valide les cartes d'une leçon.
 * @param lecon      la leçon (`id`, `cartes`, `gropiTip`)
 * @param quizParId  Map (ou objet) id → question de quiz, pour les quizId
 * @returns { erreurs: string[], alertes: string[] } — erreurs = bloquantes
 */
export function validerCartes(lecon, quizParId = new Map()) {
  const erreurs = [], alertes = [];
  const id = lecon?.id || "?";
  const cartes = lecon?.cartes;
  if (cartes === undefined) return { erreurs, alertes };
  if (!Array.isArray(cartes) || cartes.length === 0) {
    erreurs.push(`${id} : cartes doit être un tableau non vide`);
    return { erreurs, alertes };
  }

  cartes.forEach((c, i) => {
    const ou = `${id}/carte ${i + 1}`;
    if (!c || !TYPES_CARTE.includes(c.type)) { erreurs.push(`${ou} : type inconnu « ${c?.type} » (attendu : ${TYPES_CARTE.join(", ")})`); return; }

    if (c.type === "idee") {
      if (typeof c.titre !== "string" || !c.titre.trim()) erreurs.push(`${ou} : idée sans titre`);
      const ps = paragraphes(c);
      if (ps.length < 1 || ps.length > 3) erreurs.push(`${ou} : une idée a 1 à 3 paragraphes (ici ${ps.length})`);
      if (ps.some(p => typeof p !== "string" || !p.trim())) erreurs.push(`${ou} : paragraphe vide ou non textuel`);
      const mots = compterMots(ps.join(" "));
      if (mots > MOTS_MAX_IDEE) alertes.push(`${ou} « ${c.titre} » : ${mots} mots (au-delà de ${MOTS_MAX_IDEE}, coupe ou scinde la carte)`);
      validerBloc(c.bloc, ou, erreurs);
    }

    if (c.type === "question") {
      if (c.quizId) {
        const src = quizParId?.get ? quizParId.get(c.quizId) : quizParId?.[c.quizId];
        if (!src) erreurs.push(`${ou} : quizId « ${c.quizId} » introuvable`);
        else if (!Array.isArray(src.o)) erreurs.push(`${ou} : quizId « ${c.quizId} » n'est pas un QCM`);
        const doublons = CHAMPS_QUESTION.filter(k => c[k] !== undefined);
        if (doublons.length) erreurs.push(`${ou} : avec quizId, ne pas réécrire ${doublons.join(", ")} (la question vient du quiz)`);
      } else {
        if (typeof c.q !== "string" || !c.q.trim()) erreurs.push(`${ou} : question sans énoncé (q)`);
        if (!Array.isArray(c.o) || c.o.length < 2) erreurs.push(`${ou} : au moins 2 choix (o)`);
        else {
          if (new Set(c.o).size !== c.o.length) erreurs.push(`${ou} : choix en double`);
          if (!Number.isInteger(c.a) || c.a < 0 || c.a >= c.o.length) erreurs.push(`${ou} : index de réponse hors bornes (a=${c.a}, ${c.o.length} choix)`);
        }
        if (typeof c.exp !== "string" || !c.exp.trim()) erreurs.push(`${ou} : pas d'explication (exp)`);
      }
    }

    if (c.type === "a-toi") {
      if (typeof c.consigne !== "string" || !c.consigne.trim()) erreurs.push(`${ou} : « À toi de jouer » sans consigne`);
      if (c.bpm !== undefined && !(Number.isFinite(c.bpm) && c.bpm >= BPM_MIN && c.bpm <= BPM_MAX)) erreurs.push(`${ou} : bpm hors bornes (${BPM_MIN}–${BPM_MAX})`);
      if (c.minuteur !== undefined && !(Number.isInteger(c.minuteur) && c.minuteur >= MINUTEUR_MIN && c.minuteur <= MINUTEUR_MAX)) erreurs.push(`${ou} : minuteur en secondes entières (${MINUTEUR_MIN}–${MINUTEUR_MAX})`);
      if (compterMots(c.consigne) > MOTS_MAX_IDEE) alertes.push(`${ou} : consigne de ${compterMots(c.consigne)} mots (au-delà de ${MOTS_MAX_IDEE})`);
      validerBloc(c.bloc, ou, erreurs);
    }

    if (c.type === "recap") {
      if (!Array.isArray(c.points) || c.points.length !== 3 || c.points.some(p => typeof p !== "string" || !p.trim())) {
        erreurs.push(`${ou} : le récap a exactement 3 points (chaînes non vides)`);
      }
    }
  });

  // ── Structure de la leçon ──
  const types = cartes.map(c => c?.type);
  const nbRecap = types.filter(t => t === "recap").length;
  if (nbRecap !== 1 || types[types.length - 1] !== "recap") erreurs.push(`${id} : une seule carte recap, en dernier`);
  if (!types.includes("question")) erreurs.push(`${id} : au moins une carte question`);
  if (!types.includes("a-toi")) erreurs.push(`${id} : au moins une carte « À toi de jouer » (a-toi)`);
  if (cartes.length < CARTES_MIN || cartes.length > CARTES_MAX) alertes.push(`${id} : ${cartes.length} cartes (cible ${CARTES_MIN} à ${CARTES_MAX})`);
  let suite = 0;
  for (const t of types) {
    if (t === "idee") { suite++; if (suite === IDEES_SANS_QUESTION_MAX + 1) alertes.push(`${id} : plus de ${IDEES_SANS_QUESTION_MAX} idées d'affilée sans question`); }
    else if (t === "question") suite = 0;
  }
  if (typeof lecon.gropiTip !== "string" || !lecon.gropiTip.trim()) alertes.push(`${id} : pas de gropiTip (la carte récap l'affiche)`);
  return { erreurs, alertes };
}

// ── Navigation ─────────────────────────────────────────────────────────────
export const bornerIndex = (i, n) => (n <= 0 ? 0 : Math.max(0, Math.min(n - 1, Math.trunc(Number(i) || 0))));
export const carteSuivante = (i, n) => bornerIndex(i + 1, n);
export const cartePrecedente = (i, n) => bornerIndex(i - 1, n);
export const estDerniere = (i, n) => n > 0 && i >= n - 1;

/** « 3 / 9 » et le pourcentage de la barre (la 1re carte n'est pas à 0 %). */
export function progressionCartes(i, n) {
  const k = bornerIndex(i, n);
  return { libelle: `${k + 1} / ${n}`, pct: n > 0 ? Math.round(((k + 1) / n) * 100) : 0, numero: k + 1, total: n };
}

/**
 * Direction d'un geste de balayage, ou null. dx > 0 = doigt vers la droite =
 * carte précédente. Le geste doit être franchement horizontal.
 */
export function directionBalayage(dx, dy, seuil = 60) {
  if (Math.abs(dx) < seuil || Math.abs(dx) < Math.abs(dy) * 1.5) return null;
  return dx < 0 ? "suivante" : "precedente";
}

/** Libellé du bouton principal selon la carte et son état. */
export function libelleContinuer(carte, { repondue = false, derniere = false, terminee = false } = {}) {
  if (carte?.type === "recap" || derniere) return terminee ? "Retour au parcours" : "Terminer la leçon · +30 XP";
  if (carte?.type === "question" && !repondue) return "Passer";
  if (carte?.type === "a-toi") return "C'est fait";
  return "Continuer";
}

// ── Reprise ────────────────────────────────────────────────────────────────
export const cleReprise = (leconId) => `groply:lecon-carte:${leconId}`;

/** Index sauvegardé (borné au nombre de cartes actuel), 0 sinon. */
export function lireReprise(storage, leconId, n) {
  try {
    const brut = storage?.getItem?.(cleReprise(leconId));
    if (brut == null) return 0;
    const i = Number.parseInt(brut, 10);
    return Number.isFinite(i) ? bornerIndex(i, n) : 0;
  } catch { return 0; }
}

export function ecrireReprise(storage, leconId, i) {
  try {
    if (i <= 0) storage?.removeItem?.(cleReprise(leconId));
    else storage?.setItem?.(cleReprise(leconId), String(i));
  } catch { /* stockage indisponible : la reprise est un confort */ }
}

export function effacerReprise(storage, leconId) {
  try { storage?.removeItem?.(cleReprise(leconId)); } catch { /* idem */ }
}

// ── Questions ──────────────────────────────────────────────────────────────
/**
 * Retour immédiat à une réponse. Jamais bloquant : bonne ou mauvaise, on peut
 * continuer ; une erreur montre l'explication.
 */
export function evaluerReponse(question, choix) {
  if (!question || !Number.isInteger(choix)) return null;
  const correct = choix === question.a;
  return {
    correct,
    pose: correct ? "happy" : "think",
    titre: correct ? "Bien vu !" : "Pas tout à fait",
    bonne: question.o[question.a],
    message: correct
      ? (question.exp || "")
      : `La bonne réponse : « ${question.o[question.a]} ». ${question.exp || ""}`.trim(),
  };
}

/**
 * Action REVIEW_ANSWER à dispatcher pour une question liée au quiz (quizId),
 * ou null. Mêmes champs que ReviewSession, mais sans XP (la leçon rapporte
 * déjà les siens) et une seule fois par jour et par question : refaire la
 * leçon le même jour ne doit pas gonfler la série de réussites.
 */
export function actionRevision(question, correct, reviewHistory, today) {
  if (!question?.quizId) return null;
  const h = reviewHistory || {};
  if (h[question.quizId]?.lastSeen === today) return null;
  const history = updateReviewHistory(h, question.quizId, !!correct, today);
  return { type: "REVIEW_ANSWER", questionId: question.quizId, id: question.quizId, correct: !!correct, history, xp: 0 };
}

/** Blocs de diagramme portés par les cartes (pour les contrôles musicaux). */
export const blocsDesCartes = (cartes) => (cartes || []).filter(c => c?.bloc).map(c => c.bloc);
