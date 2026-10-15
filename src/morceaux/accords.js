// Groply — morceaux/accords.js
// Formes d'accords ouverts utilisées par les morceaux, au format attendu
// par ChordDiagram (diagrams.jsx) : frets[0] = corde 6 (Mi grave) …
// frets[5] = corde 1 (Mi aigu), -1 = corde non jouée, 0 = à vide.
// Le test test/morceaux.test.mjs vérifie que chaque note des morceaux
// « accords » appartient bien à la forme de l'accord de sa mesure.

export const FORMES_ACCORDS = {
  C:  { nom: "Do",  frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  Am: { nom: "Lam", frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  D:  { nom: "Ré",  frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  // Petite forme de Fa : un mini-barré sur les deux cordes aiguës, sans grand barré.
  F:  { nom: "Fa",  frets: [-1, -1, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1], barre: { fret: 1, from: 4, to: 5 } },
  E:  { nom: "Mi",  frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  G:  { nom: "Sol", frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  Em: { nom: "Mim", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  A:  { nom: "La",  frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
};

/** Nom affiché d'un accord : « Lam », « Sol »… (le symbole si inconnu). */
export const nomAccord = (symbole) => FORMES_ACCORDS[symbole]?.nom ?? symbole;
