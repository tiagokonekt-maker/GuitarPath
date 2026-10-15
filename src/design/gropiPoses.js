// Groply — design/gropiPoses.js
//
// Quelle pose de Gropi pour quel rôle. Un seul endroit pour que la
// mascotte garde le même « langage » d'un écran à l'autre : l'ampoule veut
// toujours dire « conseil », le livre « anecdote », le point
// d'interrogation « pas encore ouvert »… Fichier JS pur (pas de JSX) : il
// est importé par store/gropiTips.js, testé sous Node.

export const POSE_ROLE = {
  accueil:     "wave",       // bienvenue, onboarding
  conseil:     "idea",       // conseil pratique, gropiTip de leçon
  anecdote:    "histoire",   // fait d'histoire de la musique
  progression: "pride",      // stats, paliers franchis
  serie:       "rocker",     // série de jours, Jam
  verrouille:  "mystere",    // contenu verrouillé, teaser
  ecoute:      "listen",     // oreille, écoute active
  calme:       "zen",        // respiration, pause, recommencer sans stress
  erreur:      "think",      // mauvaise réponse, réflexion
  bonne:       "happy",      // bonne réponse ponctuelle
  reussite:    "celebrate",  // leçon, quiz, unité réussis
  choix:       "choix",      // choisir une gamme, un chemin, un objectif
};

/** Pose par défaut d'un conseil du catalogue, selon son type. */
export const POSE_PAR_TYPE = {
  tip:      POSE_ROLE.conseil,
  anecdote: POSE_ROLE.anecdote,
  progress: POSE_ROLE.progression,
};
