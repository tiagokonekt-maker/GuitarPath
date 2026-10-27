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
  // Travailler un morceau (lent, boucle A–B, tempo) : sur la grille débutant.
  "rhy-routine-01": ["premiers-accords"],
  // Médiator alterné : croches régulières sur une corde (corde 6).
  "rhy-med-01": ["riff-rock-mi"],
  // Legato : le riff folk est écrit avec des hammer-ons (0h2, 2h3).
  // (Bend, vibrato, slides : aucun morceau du catalogue n'en contient —
  // le blues en La est un riff rythmique, sans bend ni vibrato.)
  "rhy-tech-03": ["riff-folk-re"],
  // Jouer aux doigts : deux arpèges basse + cordes aiguës (Do – Lam – Fa – Sol
  // en croches ; Lam – Do – Ré – Fa – Mi en p-i-m-a-m-i).
  "rhy-doigts-01": ["picking-do-lam-fa-sol", "rising-sun"],
  // Mesures à trois : Greensleeves est en 3/4, Rising Sun en 6/8.
  "rhy-mes-01": ["greensleeves", "rising-sun"],
  // Picking Travis : le picking Do – Lam – Fa – Sol alterne deux basses au
  // pouce (temps 1 et 3) sous les cordes aiguës.
  "rhy-doigts-02": ["picking-do-lam-fa-sol"],
  // Construire un riff : le riff de la leçon (corde 6 à vide comme pivot,
  // cases 3 et 5, relance sur la corde 5 case 2) est celui du morceau.
  "rhy-c6-02": ["riff-rock-mi"],

  // ── Manche ───────────────────────────────────────────────────────────
  // Power chords : le riff de la leçon reprend ses cases 0, 3, 5 sur la corde 6.
  "neck-pow-01": ["riff-rock-mi"],

  // ── Gammes ───────────────────────────────────────────────────────────
  // Le riff rock est construit sur la pentatonique de Mi mineur.
  "scales-c3-01": ["riff-rock-mi"],
  // La gamme blues : son terrain naturel, le blues en La.
  "scales-c3-04": ["blues-en-la"],

  // ── Harmonie ─────────────────────────────────────────────────────────
  // Arpèges : l'accord joué note à note (Do – Lam – Fa – Sol, Lam – Do – Ré – Fa – Mi).
  "harmony-03": ["picking-do-lam-fa-sol", "rising-sun"],
  // Accords de septième : la même grille La – Ré – Mi en 12 mesures (A7, D7, E7).
  "harm-acc-02": ["blues-en-la"],
  // Le petit Fa (xx3211) : les deux grilles le jouent dans cette forme.
  "harm-acc-03": ["picking-do-lam-fa-sol", "rising-sun"],
  // I-IV-V : le blues de 12 mesures en est la forme type.
  "harm-c6-01": ["blues-en-la"],
};

/** Identifiants des morceaux liés à une leçon (liste vide si aucun). */
export const morceauxDeLecon = (lessonId) => LIENS_MORCEAUX[lessonId] || [];

/** Leçons qui renvoient à un morceau (pour la mention « Lié à la leçon … »). */
export const leconsDuMorceau = (morceauId) =>
  Object.keys(LIENS_MORCEAUX).filter(id => LIENS_MORCEAUX[id].includes(morceauId));
