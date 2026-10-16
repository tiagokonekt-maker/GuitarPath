// Groply — content/liens-morceaux.js
// Leçons ↔ morceaux : quels morceaux d'Outils › Morceaux (src/morceaux/
// catalogue.js) mettent en pratique ce qu'une leçon vient d'enseigner.
//
// Affiché en fin de leçon (carte Récap des leçons en cartes, fin de
// l'article sinon) : une carte « Joue-le maintenant » par morceau, qui ouvre
// directement le morceau (navigate("toolbox", { outil: "morceaux", morceau })).
//
// RÈGLE : un lien seulement quand le morceau applique VRAIMENT le sujet de
// la leçon (mêmes accords, même technique, même rythme), jamais « pour
// remplir ». Les identifiants sont vérifiés par test/liens-morceaux.test.mjs
// (leçon existante, morceau existant, pas de doublon).
export const LIENS_MORCEAUX = {
  // ── Premiers pas ─────────────────────────────────────────────────────
  // Changer d'accord, gratter, enchaîner : Sol – Mim – Do – Ré, un grattage par temps.
  "debut-c2-04": ["premiers-accords"],
  "debut-c2-05": ["premiers-accords"],
  "debut-c2-06": ["premiers-accords"],
  // Lire une tab : un riff sur une seule corde (cases 0, 3, 5), puis des notes répétées.
  "debut-c3-01": ["riff-rock-mi", "ah-vous-dirai-je"],
  // Les symboles de la tab : le riff folk est écrit avec des hammer-ons (h).
  "debut-c3-02": ["riff-folk-re"],
  // Les trois airs de la leçon, en version lecteur (tempo réglable, boucle).
  "debut-c3-03": ["frere-jacques", "au-clair-de-la-lune", "ode-a-la-joie"],

  // ── Rythme ───────────────────────────────────────────────────────────
  // Croches régulières sur la corde grave.
  "rhy-c2-02": ["riff-rock-mi"],
  // Feel ternaire : shuffle (blues) et mesure composée 6/8 (six croches).
  "rhy-c2-03": ["blues-en-la", "rising-sun"],
  // Patterns de strumming : à appliquer sur une grille d'accords ouverts.
  "rhy-c4-02": ["premiers-accords"],
  // Blues shuffle : la grille de 12 mesures, longue-courte.
  "rhy-c5-01": ["blues-en-la"],

  // ── Gammes ───────────────────────────────────────────────────────────
  // Le riff rock est construit sur la pentatonique de Mi mineur.
  "scales-c3-01": ["riff-rock-mi"],
  // La gamme blues : son terrain naturel, le blues en La.
  "scales-c3-04": ["blues-en-la"],

  // ── Harmonie ─────────────────────────────────────────────────────────
  // Arpèges : l'accord joué note à note (Do – Lam – Fa – Sol, Lam – Do – Ré – Fa – Mi).
  "harmony-03": ["picking-do-lam-fa-sol", "rising-sun"],
  // I-IV-V : le blues de 12 mesures en est la forme type.
  "harm-c6-01": ["blues-en-la"],
};

/** Identifiants des morceaux liés à une leçon (liste vide si aucun). */
export const morceauxDeLecon = (lessonId) => LIENS_MORCEAUX[lessonId] || [];

/** Leçons qui renvoient à un morceau (pour la mention « Lié à la leçon … »). */
export const leconsDuMorceau = (morceauId) =>
  Object.keys(LIENS_MORCEAUX).filter(id => LIENS_MORCEAUX[id].includes(morceauId));
