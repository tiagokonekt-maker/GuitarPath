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
  // Feel ternaire : shuffle (blues) et mesure composée 6/8 (six croches) ;
  // la gigue irlandaise est le 6/8 type, deux groupes de trois croches.
  "rhy-c2-03": ["blues-en-la", "rising-sun", "irish-washerwoman"],
  // Patterns de strumming : à appliquer sur une grille d'accords ouverts.
  "rhy-c4-02": ["premiers-accords"],
  // Blues shuffle : la grille de 12 mesures, longue-courte.
  "rhy-c5-01": ["blues-en-la", "blues-lent-mi"],
  // Reggae : le skank sur chaque « et », Lam puis Rém, deux mesures chacun
  // (exactement l'exercice de la leçon).
  "rhy-c5-02": ["skank-reggae"],
  // Funk : flux de 16e, Lam7 barré case 5 sur quatre cordes, ghost notes (x).
  "rhy-c5-03": ["chank-funk"],
  // Bossa : pouce sur les temps (La/Mi, Ré/La), doigts à contretemps, Am7 – D7.
  "rhy-c5-04": ["bossa-pouce-doigts"],
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
  "rhy-doigts-01": ["picking-do-lam-fa-sol", "rising-sun", "canon-pachelbel"],
  // Mesures à trois : Greensleeves et Amazing Grace en 3/4, Rising Sun et la
  // gigue irlandaise en 6/8.
  "rhy-mes-01": ["greensleeves", "rising-sun", "amazing-grace", "irish-washerwoman"],
  // Picking Travis : le picking Do – Lam – Fa – Sol alterne deux basses au
  // pouce (temps 1 et 3) sous les cordes aiguës.
  // Le Travis Do – Lam – Rém – Sol : pouce alterné sur chaque temps, doigts sur les « et ».
  "rhy-doigts-02": ["picking-do-lam-fa-sol", "travis-do-lam-rem-sol"],
  // Construire un riff : le riff de la leçon (corde 6 à vide comme pivot,
  // cases 3 et 5, relance sur la corde 5 case 2) est celui du morceau.
  "rhy-c6-02": ["riff-rock-mi"],

  // ── Manche ───────────────────────────────────────────────────────────
  // Power chords : le riff de la leçon reprend ses cases 0, 3, 5 sur la corde 6.
  // Le riff power chords enchaîne E5, G5, A5 et D5 : les formes de la leçon.
  "neck-pow-01": ["riff-rock-mi", "riff-power-chords"],

  // ── Gammes ───────────────────────────────────────────────────────────
  // Le riff rock est construit sur la pentatonique de Mi mineur.
  "scales-c3-01": ["riff-rock-mi"],
  // La gamme blues : son terrain naturel, le blues en La.
  "scales-c3-04": ["blues-en-la"],
  // Dorien : Scarborough Fair est en Ré dorien (Si bécarre, la sixte majeure).
  "scales-c5-02": ["scarborough-fair"],

  // ── Harmonie ─────────────────────────────────────────────────────────
  // Arpèges : l'accord joué note à note (Do – Lam – Fa – Sol, Lam – Do – Ré – Fa – Mi).
  "harmony-03": ["picking-do-lam-fa-sol", "rising-sun", "canon-pachelbel"],
  // Accords de septième : la même grille La – Ré – Mi en 12 mesures (A7, D7, E7).
  // Le blues lent en Mi tourne sur E7, A7, B7.
  "harm-acc-02": ["blues-en-la", "blues-lent-mi"],
  // Le petit Fa (xx3211) : les deux grilles le jouent dans cette forme.
  "harm-acc-03": ["picking-do-lam-fa-sol", "rising-sun", "canon-pachelbel"],
  // I-IV-V : le blues de 12 mesures en est la forme type.
  "harm-c6-01": ["blues-en-la", "blues-lent-mi"],
  // I-V-vi-IV : Sol – Ré – Mim – Do, la grille de la leçon.
  "harm-c6-02": ["ballade-pop"],
};

/** Identifiants des morceaux liés à une leçon (liste vide si aucun). */
export const morceauxDeLecon = (lessonId) => LIENS_MORCEAUX[lessonId] || [];

/** Leçons qui renvoient à un morceau (pour la mention « Lié à la leçon … »). */
export const leconsDuMorceau = (morceauId) =>
  Object.keys(LIENS_MORCEAUX).filter(id => LIENS_MORCEAUX[id].includes(morceauId));
