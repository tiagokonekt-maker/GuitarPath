// ═══════════════════════════════════════════════════════════════════════════
// GuitarPath — fretboardValidator.js
// Moteur de validation générique pour les FretboardChallenge
//
// Usage :
//   import { validate, getTargetPositions, CHALLENGE_TYPES } from "./fretboardValidator.js"
//   const result = validate(challenge.concept, selectedPositions, challenge.selectionRules)
// ═══════════════════════════════════════════════════════════════════════════

import {
  getPositionsOfNote,
  getChordPositions,
  getScalePositions,
  getNoteAtPosition,
  getInterval,
  normalizeNote,
  CHROMATIC_NOTES,
  OPEN_STRINGS,
} from "./fretboardUtils.js";

// ───────────────────────────────────────────────────────────────────────────
// TYPES DE CONCEPTS — extensible sans modifier le validateur
// ───────────────────────────────────────────────────────────────────────────
export const CHALLENGE_TYPES = {
  find_note:     "find_note",      // Trouve toutes les positions d'une note
  find_chord:    "find_chord",     // Trouve les fondamentales ou notes d'un accord
  find_scale:    "find_scale",     // Trouve les notes d'une gamme
  find_interval: "find_interval",  // Trouve les positions d'un intervalle depuis une root
  find_roots:    "find_roots",     // Trouve toutes les fondamentales (alias de find_note)
};

// ───────────────────────────────────────────────────────────────────────────
// RÉSOLVEURS DE POSITIONS CIBLES
// Chaque résolveur prend un concept et retourne les positions correctes
// ───────────────────────────────────────────────────────────────────────────
const RESOLVERS = {

  find_note: (concept, opts) => {
    const { root, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const strings = Array.from({ length: maxStr - minStr + 1 }, (_, i) => minStr + i);
    return getPositionsOfNote(root, maxFret, strings)
      .filter(p => p.fret >= minFret);
  },

  find_roots: (concept, opts) => {
    return RESOLVERS.find_note(concept, opts);
  },

  find_chord: (concept, opts) => {
    const { root, quality, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const all = getChordPositions(root, quality, maxFret);
    return all.filter(p =>
      p.fret >= minFret &&
      p.string >= minStr &&
      p.string <= maxStr
    );
  },

  find_scale: (concept, opts) => {
    const { root, quality, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const all = getScalePositions(root, quality, maxFret);
    return all.filter(p =>
      p.fret >= minFret &&
      p.string >= minStr &&
      p.string <= maxStr
    );
  },

  find_interval: (concept, opts) => {
    // Trouve toutes les positions où l'intervalle depuis root est correct
    const { root, interval, fretRange = [0, 12], stringRange = [1, 6] } = { ...concept, ...opts };
    const [minFret, maxFret] = fretRange;
    const [minStr, maxStr] = stringRange;
    const rootNorm = normalizeNote(root);
    const positions = [];

    for (let s = minStr; s <= maxStr; s++) {
      for (let f = minFret; f <= maxFret; f++) {
        const note = getNoteAtPosition(s, f);
        const iv = getInterval(rootNorm, note);
        if (iv === interval) {
          positions.push({ string: s, fret: f, note, interval: iv });
        }
      }
    }
    return positions;
  },
};

// ───────────────────────────────────────────────────────────────────────────
// STRATÉGIES DE MATCHING
// ───────────────────────────────────────────────────────────────────────────
const MATCH_STRATEGIES = {

  // L'utilisateur doit trouver TOUTES les positions correctes
  all: (selected, correct) => {
    const hits = selected.filter(s => correct.some(c => c.string === s.string && c.fret === s.fret));
    const extras = selected.filter(s => !correct.some(c => c.string === s.string && c.fret === s.fret));
    const missed = correct.filter(c => !selected.some(s => s.string === c.string && s.fret === c.fret));
    return {
      complete: hits.length === correct.length && extras.length === 0,
      hits: hits.length,
      total: correct.length,
      extras: extras.length,
      missed: missed.length,
      missedPositions: missed,
      score: Math.max(0, hits.length - extras.length),
    };
  },

  // L'utilisateur doit trouver au moins N positions correctes
  any_n: (selected, correct, n = 1) => {
    const hits = selected.filter(s => correct.some(c => c.string === s.string && c.fret === s.fret));
    const extras = selected.filter(s => !correct.some(c => c.string === s.string && c.fret === s.fret));
    return {
      complete: hits.length >= n && extras.length === 0,
      hits: hits.length,
      total: n,
      extras: extras.length,
      missed: Math.max(0, n - hits.length),
      missedPositions: [],
      score: Math.min(hits.length, n),
    };
  },

  // L'utilisateur doit sélectionner exactement les notes d'un accord (positions libres)
  chord_build: (selected, correct) => {
    // Les notes de l'accord (pas les positions exactes)
    const correctNotes = [...new Set(correct.map(p => p.note))];
    const selectedNotes = [...new Set(selected.map(s => getNoteAtPosition(s.string, s.fret)))];
    const foundNotes = correctNotes.filter(n => selectedNotes.includes(n));
    const extraNotes = selectedNotes.filter(n => !correctNotes.includes(n));
    return {
      complete: foundNotes.length === correctNotes.length && extraNotes.length === 0,
      hits: foundNotes.length,
      total: correctNotes.length,
      extras: extraNotes.length,
      missed: correctNotes.length - foundNotes.length,
      missedPositions: [],
      foundNotes,
      missingNotes: correctNotes.filter(n => !selectedNotes.includes(n)),
      score: Math.max(0, foundNotes.length - extraNotes.length),
    };
  },
};

// ───────────────────────────────────────────────────────────────────────────
// VALIDATEUR PRINCIPAL
// ───────────────────────────────────────────────────────────────────────────

/**
 * Valide la sélection de l'utilisateur contre un concept musical.
 *
 * @param {Object} concept         - { type, root, quality, interval }
 * @param {Array}  selected        - [{ string, fret }, ...]
 * @param {Object} selectionRules  - { mode, minSelections, maxSelections }
 * @param {Object} opts            - { fretRange, stringRange }
 * @returns {Object} result        - { complete, hits, total, extras, missed, score, feedback }
 */
export function validate(concept, selected, selectionRules = {}, opts = {}) {
  const { type } = concept;
  const { mode = "all", minSelections = 1 } = selectionRules;

  // 1. Résoudre les positions cibles
  const resolver = RESOLVERS[type];
  if (!resolver) {
    console.warn(`[fretboardValidator] Type inconnu : "${type}"`);
    return { complete: false, hits: 0, total: 0, extras: 0, missed: 0, score: 0, feedback: "Type de challenge inconnu." };
  }

  const fretRange  = opts.fretRange  || [0, 12];
  const stringRange = opts.stringRange || [1, 6];
  const correct = resolver(concept, { fretRange, stringRange });

  // 2. Appliquer la stratégie de matching
  let result;
  if (mode === "chord_build") {
    result = MATCH_STRATEGIES.chord_build(selected, correct);
  } else if (mode === "any_n") {
    result = MATCH_STRATEGIES.any_n(selected, correct, minSelections);
  } else {
    result = MATCH_STRATEGIES.all(selected, correct);
  }

  // 3. Générer le feedback
  result.feedback = generateFeedback(result, concept, mode);
  result.correctPositions = correct;

  return result;
}

/**
 * Résout les positions cibles sans valider — utile pour afficher
 * les bonnes réponses ou préparer le rendu.
 */
export function getTargetPositions(concept, opts = {}) {
  const { type } = concept;
  const resolver = RESOLVERS[type];
  if (!resolver) return [];
  const fretRange   = opts.fretRange   || [0, 12];
  const stringRange = opts.stringRange || [1, 6];
  return resolver(concept, { fretRange, stringRange });
}

/**
 * Vérifie si une position individuelle fait partie des positions correctes.
 */
export function isPositionCorrect(string, fret, concept, opts = {}) {
  const correct = getTargetPositions(concept, opts);
  return correct.some(p => p.string === string && p.fret === fret);
}

/**
 * Vérifie en temps réel si l'utilisateur a fait une erreur sur le dernier clic.
 */
export function checkLastClick(string, fret, concept, opts = {}) {
  const note = getNoteAtPosition(string, fret);
  const correct = isPositionCorrect(string, fret, concept, opts);
  return { correct, note };
}

// ───────────────────────────────────────────────────────────────────────────
// GÉNÉRATION DE FEEDBACK
// ───────────────────────────────────────────────────────────────────────────
function generateFeedback(result, concept, mode) {
  if (result.complete) {
    return "✅ Parfait — toutes les positions trouvées !";
  }
  const parts = [];
  if (result.missed > 0) {
    parts.push(`${result.missed} position${result.missed > 1 ? "s" : ""} manquante${result.missed > 1 ? "s" : ""}`);
  }
  if (result.extras > 0) {
    parts.push(`${result.extras} erreur${result.extras > 1 ? "s" : ""}`);
  }
  return `🟡 ${parts.join(" · ")} — en orange = manqué, en rouge = erreur.`;
}

// ───────────────────────────────────────────────────────────────────────────
// HELPERS DE GÉNÉRATION DYNAMIQUE
// Prépare le terrain pour la génération automatique de challenges
// ───────────────────────────────────────────────────────────────────────────

/**
 * Génère un challenge "find_note" aléatoire sur une note diatonique.
 * Prêt pour la révision intelligente future.
 */
export function generateFindNoteChallenge(opts = {}) {
  const {
    notes = CHROMATIC_NOTES,
    fretRange = [0, 12],
    lvl = 1,
  } = opts;
  const root = notes[Math.floor(Math.random() * notes.length)];
  return {
    concept: { type: "find_note", root },
    fretRange,
    selectionRules: { mode: "all" },
    display: { showNotes: false, showIntervals: false, showDegrees: false },
    lvl,
    xp: 40,
  };
}

/**
 * Génère un challenge "find_interval" aléatoire depuis une note donnée.
 */
export function generateIntervalChallenge(opts = {}) {
  const {
    root,
    intervals = [7, 5, 4, 3],  // quinte, quarte, tierce M, tierce m
    fretRange = [0, 12],
    lvl = 2,
  } = opts;
  const rootNote = root || CHROMATIC_NOTES[Math.floor(Math.random() * 12)];
  const interval = intervals[Math.floor(Math.random() * intervals.length)];
  return {
    concept: { type: "find_interval", root: rootNote, interval },
    fretRange,
    selectionRules: { mode: "all" },
    display: { showNotes: true, showIntervals: false },
    lvl,
    xp: 50,
  };
}

/**
 * Filtre les challenges disponibles selon les leçons complétées.
 * Utilisé plus tard pour la révision intelligente.
 *
 * @param {Array}  challenges       - Liste de tous les challenges
 * @param {Object} completedLessons - { "neck-01": true, ... }
 * @returns {Array}                 - Challenges débloqués
 */
export function getUnlockedChallenges(challenges, completedLessons = {}) {
  return challenges.filter(c => {
    if (!c.unlockedBy || c.unlockedBy.length === 0) return true;
    return c.unlockedBy.every(id => completedLessons[id]);
  });
}

/**
 * Calcule un score de priorité pour la révision intelligente.
 * Plus le score est élevé, plus le challenge doit être revu.
 *
 * @param {Object} challenge     - Le challenge
 * @param {Object} history       - { [challengeId]: { lastResult, attempts, successRate } }
 * @returns {number}             - Score de priorité (0-100)
 */
export function getPriorityScore(challenge, history = {}) {
  const h = history[challenge.id];
  if (!h) return 80; // jamais fait = haute priorité
  const { successRate = 1, attempts = 0, daysSinceLastAttempt = 0 } = h;
  const failurePriority = (1 - successRate) * 50;
  const freshnessPriority = Math.min(daysSinceLastAttempt * 3, 30);
  const noveltyPriority = attempts < 3 ? 20 : 0;
  return Math.round(failurePriority + freshnessPriority + noveltyPriority);
}
