// Groply — store/xp.js
// Économie d'XP : décide COMBIEN d'XP une action rapporte réellement.
//
// ── Le problème corrigé (audit §7.1) ──────────────────────────────────────
// Avant, le reducer créditait l'XP nominale à CHAQUE fois :
//   • COMPLETE_EXERCISE : aucune vérification de première complétion
//   • QUIZ_ANSWER       : aucune vérification de `prev.correct`
//   • PRACTICE_DONE     : +50 XP sur simple déclaration, sans limite
// Répondre 50 fois à la même question rapportait donc 50 fois l'XP.
// Conséquence : le niveau, le grade et les badges ne mesuraient plus rien.
// Et surtout — ce n'est pas qu'une question de triche — quelqu'un qui
// refait un exercice pour s'entraîner (le BON réflexe) voyait son niveau
// monter sans rien apprendre de nouveau.
//
// ── Le principe retenu ────────────────────────────────────────────────────
// On ne met pas l'XP de répétition à zéro : refaire un exercice est
// exactement ce qu'on veut encourager. On la RÉDUIT et on la PLAFONNE.
//
//   1re réussite      → XP nominale (compte pour le niveau)
//   réussites suivantes → 25 % arrondi, borné à 15 XP  (« XP d'entretien »)
//   plafond quotidien d'XP d'entretien → 120 XP/jour
//
// Résultat : la pratique répétée est récompensée, mais le niveau ne peut
// plus être farmé — il reste l'image de ce qui a été appris une première
// fois, plus une part de révision espacée réussie.
//
// Les écrans appellent `xpPreview()` AVANT de dispatcher, pour afficher le
// montant réel (« +30 XP » vs « +8 XP · entretien ») au lieu d'une valeur
// nominale qui mentirait à la deuxième répétition.

import { todayStr } from "./dates.js";

export const REPEAT_RATIO      = 0.25;
export const REPEAT_MAX        = 15;
export const DAILY_REPEAT_CAP  = 120;

/** Sessions de pratique libre créditées par jour (avant, illimité). */
export const DAILY_PRACTICE_CAP = 3;

export const LESSON_XP = 30;

/** État par défaut du compteur quotidien d'XP d'entretien. */
export const defaultDailyXp = () => ({ date: "", repeat: 0, practice: 0 });

/** Remet le compteur à zéro si on a changé de jour. */
export function rollDaily(dailyXp, today = todayStr()) {
  const d = dailyXp && typeof dailyXp === "object" ? dailyXp : defaultDailyXp();
  if (d.date !== today) return { date: today, repeat: 0, practice: 0 };
  return { date: today, repeat: d.repeat || 0, practice: d.practice || 0 };
}

/** XP d'entretien pour une répétition, en tenant compte du plafond du jour. */
export function repeatXp(nominal, dailyXp, today = todayStr()) {
  const d = rollDaily(dailyXp, today);
  const wanted = Math.min(REPEAT_MAX, Math.max(1, Math.round((Number(nominal) || 0) * REPEAT_RATIO)));
  const remaining = Math.max(0, DAILY_REPEAT_CAP - d.repeat);
  return Math.min(wanted, remaining);
}

/**
 * Combien d'XP cette action va RÉELLEMENT rapporter, et pourquoi.
 * Fonction pure : utilisable par les écrans pour l'affichage, et par le
 * reducer pour le crédit — un seul calcul, donc jamais de désaccord entre
 * ce qui est annoncé et ce qui est donné.
 *
 * @param {object} state
 * @param {"lesson"|"quiz"|"exercise"|"practice"|"daily"|"unit"|"review"} kind
 * @param {string} id
 * @param {number} nominal
 * @returns {{ xp:number, first:boolean, reason:"first"|"repeat"|"capped"|"already" }}
 */
export function xpPreview(state, kind, id, nominal = 0) {
  const today = todayStr();
  const nom = Math.max(0, Math.round(Number(nominal) || 0));

  switch (kind) {
    case "lesson": {
      const first = !state?.completedLessons?.[id];
      // Une leçon lue n'est pas un exercice : la relire ne rapporte rien,
      // et c'est très bien — on ne veut pas encourager le scroll.
      return first
        ? { xp: LESSON_XP, first: true,  reason: "first" }
        : { xp: 0,         first: false, reason: "already" };
    }

    case "quiz": {
      const first = !state?.quizResults?.[id]?.correct;
      if (first) return { xp: nom, first: true, reason: "first" };
      const xp = repeatXp(nom, state?.dailyXp, today);
      return { xp, first: false, reason: xp > 0 ? "repeat" : "capped" };
    }

    case "exercise": {
      const first = !state?.completedExercises?.[id];
      if (first) return { xp: nom, first: true, reason: "first" };
      const xp = repeatXp(nom, state?.dailyXp, today);
      return { xp, first: false, reason: xp > 0 ? "repeat" : "capped" };
    }

    case "practice": {
      const d = rollDaily(state?.dailyXp, today);
      if ((d.practice || 0) >= DAILY_PRACTICE_CAP)
        return { xp: 0, first: false, reason: "capped" };
      return { xp: nom || 50, first: (d.practice || 0) === 0, reason: "first" };
    }

    case "daily": {
      const done = state?.dailyChallengeDone && state?.dailyChallengeDate === today;
      return done
        ? { xp: 0,        first: false, reason: "already" }
        : { xp: nom || 80, first: true,  reason: "first" };
    }

    case "unit": {
      const claimed = !!state?.claimedUnits?.[id];
      return claimed
        ? { xp: 0,   first: false, reason: "already" }
        : { xp: nom, first: true,  reason: "first" };
    }

    // Révision espacée : toujours créditée (c'est la SEULE preuve de
    // mémorisation dans le temps), mais soumise au plafond quotidien pour
    // rester bornée.
    case "review": {
      const xp = Math.min(nom, Math.max(0, DAILY_REPEAT_CAP - rollDaily(state?.dailyXp, today).repeat));
      return { xp, first: false, reason: xp > 0 ? "repeat" : "capped" };
    }

    default:
      return { xp: nom, first: true, reason: "first" };
  }
}

/** Libellé court pour l'UI : « +30 XP » ou « +8 XP · entretien ». */
export function xpLabel(preview) {
  if (!preview || preview.xp <= 0) {
    return preview?.reason === "capped" ? "Plafond du jour atteint" : "Déjà acquis";
  }
  return preview.first ? `+${preview.xp} XP` : `+${preview.xp} XP · entretien`;
}
