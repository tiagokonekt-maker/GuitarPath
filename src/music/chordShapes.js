// Groply — music/chordShapes.js
// Formes d'accords mobiles, système CAGED.
//
// Principe : un guitariste ne mémorise pas 12 × N accords, il mémorise
// quelques FORMES et les déplace le long du manche. Le même La majeur peut
// se jouer en forme de Mi (case 5), en forme de Do (case 12), etc. — mêmes
// notes, position et couleur différentes.
//
// Une forme est définie en cases RELATIVES à sa fondamentale. Pour la
// placer, on cherche la case où la fondamentale tombe sur la corde de
// référence, puis on décale toute la forme.
//
// JavaScript pur, testable en Node.

const CHROMATIC = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
// Cordes à vide, de la 6e (grave) à la 1re (aiguë).
const OPEN_STRINGS = ["E","A","D","G","B","E"];

/**
 * Formes mobiles par qualité d'accord.
 *
 * `rootString` : index 0-5 dans OPEN_STRINGS (0 = 6e corde grave).
 * `offsets`    : décalage en cases par rapport à la fondamentale, de la 6e
 *                à la 1re corde. `null` = corde non jouée.
 * `fingers`    : doigté indicatif (0 = corde à vide/barré).
 */
const SHAPES = {
  maj: [
    { id: "E",  label: "Forme Mi",  rootString: 0, offsets: [0, 2, 2, 1, 0, 0],       fingers: [1, 3, 4, 2, 1, 1], barre: true },
    { id: "A",  label: "Forme La",  rootString: 1, offsets: [null, 0, 2, 2, 2, 0],    fingers: [0, 1, 3, 4, 2, 1], barre: true },
    { id: "C",  label: "Forme Do",  rootString: 1, offsets: [null, 0, -1, -3, -2, -3], fingers: [0, 3, 2, 0, 1, 0] },
    { id: "D",  label: "Forme Ré",  rootString: 2, offsets: [null, null, 0, 2, 3, 2], fingers: [0, 0, 1, 2, 4, 3] },
    { id: "G",  label: "Forme Sol", rootString: 0, offsets: [0, -1, -3, -3, -3, 0],  fingers: [2, 1, 0, 0, 0, 3] },
  ],
  min: [
    { id: "Em", label: "Forme Mim", rootString: 0, offsets: [0, 2, 2, 0, 0, 0],       fingers: [1, 3, 4, 1, 1, 1], barre: true },
    { id: "Am", label: "Forme Lam", rootString: 1, offsets: [null, 0, 2, 2, 1, 0],    fingers: [0, 1, 3, 4, 2, 1], barre: true },
    { id: "Dm", label: "Forme Rém", rootString: 2, offsets: [null, null, 0, 2, 3, 1], fingers: [0, 0, 1, 3, 4, 2] },
  ],
  dom7: [
    { id: "E7", label: "Forme Mi7", rootString: 0, offsets: [0, 2, 0, 1, 0, 0],       fingers: [1, 3, 1, 2, 1, 1], barre: true },
    { id: "A7", label: "Forme La7", rootString: 1, offsets: [null, 0, 2, 0, 2, 0],    fingers: [0, 1, 3, 1, 4, 1], barre: true },
    { id: "D7", label: "Forme Ré7", rootString: 2, offsets: [null, null, 0, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4] },
  ],
  maj7: [
    { id: "Emaj7", label: "Forme Mi", rootString: 0, offsets: [0, null, 1, 1, 0, null], fingers: [1, 0, 3, 4, 2, 0] },
    { id: "Amaj7", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 1, 2, 0],    fingers: [0, 1, 3, 2, 4, 1] },
    { id: "Dmaj7", label: "Forme Ré", rootString: 2, offsets: [null, null, 0, 2, 2, 2], fingers: [0, 0, 1, 2, 3, 4] },
  ],
  min7: [
    { id: "Em7", label: "Forme Mim7", rootString: 0, offsets: [0, 2, 0, 0, 0, 0],      fingers: [1, 3, 1, 1, 1, 1], barre: true },
    { id: "Am7", label: "Forme Lam7", rootString: 1, offsets: [null, 0, 2, 0, 1, 0],   fingers: [0, 1, 3, 1, 2, 1], barre: true },
    { id: "Dm7", label: "Forme Rém7", rootString: 2, offsets: [null, null, 0, 2, 1, 1], fingers: [0, 0, 1, 3, 2, 2] },
  ],
  min7b5: [
    { id: "Am7b5", label: "Forme La", rootString: 1, offsets: [null, 0, 1, 0, 1, null], fingers: [0, 2, 3, 1, 4, 0] },
    { id: "Em7b5", label: "Forme Mi", rootString: 0, offsets: [0, 1, 0, 0, null, null], fingers: [1, 3, 2, 2, 0, 0] },
  ],
  dim7: [
    { id: "Ddim7", label: "Forme Ré", rootString: 2, offsets: [null, null, 0, 1, 0, 1], fingers: [0, 0, 1, 3, 2, 4] },
    { id: "Adim7", label: "Forme La", rootString: 1, offsets: [null, 0, 1, 2, 1, null], fingers: [0, 1, 2, 4, 3, 0] },
  ],
  maj6: [
    { id: "A6", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 2, 2, 2], fingers: [0, 1, 2, 3, 3, 3] },
    { id: "E6", label: "Forme Mi", rootString: 0, offsets: [0, 2, 1, 1, 2, null], fingers: [1, 3, 1, 1, 4, 0] },
  ],
  sus4: [
    { id: "Asus4", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 2, 3, 0], fingers: [0, 1, 2, 3, 4, 1], barre: true },
    { id: "Esus4", label: "Forme Mi", rootString: 0, offsets: [0, 2, 2, 2, 0, 0],    fingers: [1, 2, 3, 4, 1, 1], barre: true },
  ],
  add9: [
    { id: "Cadd9", label: "Forme Do", rootString: 1, offsets: [null, 0, -1, -3, 0, -3] },
    { id: "Aadd9", label: "Forme La", rootString: 1, offsets: [null, 0, 2, 4, 2, 0] },
    { id: "Eadd9", label: "Forme Mi", rootString: 0, offsets: [0, 2, 1, 1, 0, 2] },
  ],
  dom9: [
    { id: "A9", label: "Forme La", rootString: 1, offsets: [null, 0, 1, 0, 2, 0], fingers: [0, 2, 3, 1, 4, 1] },
    { id: "E9", label: "Forme Mi", rootString: 0, offsets: [0, 2, 0, 1, 0, 2],    fingers: [1, 3, 1, 2, 1, 4] },
  ],
};


/**
 * Calcule le doigté à partir des cases réellement jouées.
 *
 * Les doigtés écrits à la main dans les formes étaient valables pour la
 * position BARRÉE, mais devenaient faux dès que la forme tombait en
 * position ouverte : un numéro de doigt apparaissait sur une corde à vide.
 * On les dérive donc des cases, ce qui est juste dans tous les cas.
 *
 * Règle appliquée, celle qu'enseigne n'importe quel professeur :
 *   - corde à vide ou étouffée → aucun doigt ;
 *   - la case la plus basse prend l'index, et si plusieurs cordes la
 *     partagent sur une forme barrée, l'index les barre toutes ;
 *   - les cases suivantes prennent les doigts suivants, du grave à l'aigu.
 *
 * @returns tableau de 6 entiers (0 = pas de doigt)
 */
function computeFingers(frets, isBarre) {
  const fingers = [0, 0, 0, 0, 0, 0];
  // Positions réellement frettées, triées par case puis par corde.
  const fretted = frets
    .map((f, s) => ({ f, s }))
    .filter(x => x.f > 0)
    .sort((a, b) => (a.f - b.f) || (a.s - b.s));
  if (!fretted.length) return fingers;

  const minFret = fretted[0].f;
  const atMin = fretted.filter(x => x.f === minFret);

  let next = 1;
  if (isBarre && atMin.length >= 2) {
    // Barré : l'index couvre toutes les cordes de la case la plus basse.
    for (const x of atMin) fingers[x.s] = 1;
    next = 2;
  }
  for (const x of fretted) {
    if (fingers[x.s] !== 0) continue;
    fingers[x.s] = Math.min(4, next);
    next++;
  }
  return fingers;
}

/** Case où une note tombe sur une corde donnée (0 = corde à vide). */
function fretForNote(stringIdx, noteName) {
  const open = CHROMATIC.indexOf(OPEN_STRINGS[stringIdx]);
  const target = CHROMATIC.indexOf(noteName);
  if (open < 0 || target < 0) return -1;
  return ((target - open) + 12) % 12;
}

/**
 * Produit les formes jouables d'un accord, prêtes pour <ChordDiagram>.
 *
 * @param rootName  "C", "F#"... (déjà normalisé en dièses)
 * @param quality   clé de CHORD_TYPES ("maj", "min7"...)
 * @param maxFret   au-delà, la forme devient inconfortable et peu utile
 * @returns [{ name, label, frets, fingers, startFret, barre }]
 */
export function getChordShapes(rootName, quality, maxFret = 10, chordIntervals = null) {
  const shapes = SHAPES[quality];
  if (!shapes) return [];

  // Notes légitimes de l'accord, pour valider chaque forme.
  const rootIdx = CHROMATIC.indexOf(rootName);
  const allowed = chordIntervals
    ? new Set(chordIntervals.map(i => CHROMATIC[(rootIdx + i) % 12]))
    : null;

  const out = [];
  for (const shape of shapes) {
    let rootFret = fretForNote(shape.rootString, rootName);
    if (rootFret < 0) continue;

    // À la case 0, c'est le SILLET qui fait office de barré : la forme
    // devient l'accord OUVERT, la position la plus simple et la première
    // qu'apprend un guitariste. La version précédente remontait ces formes
    // à la case 12, ce qui supprimait tous les accords ouverts du résultat.
    // (isOpen est déterminé plus bas, une fois les cases calculées : un
    //  accord est "ouvert" dès qu'il fait sonner une corde à vide, pas
    //  seulement quand sa fondamentale tombe case 0. Le Do ouvert, par
    //  exemple, a sa fondamentale case 3 mais reste bien un accord ouvert.)

    // Cases absolues. `null` reste null (corde non jouée).
    const frets = shape.offsets.map(o => (o === null ? null : rootFret + o));
    const played = frets.filter(f => f !== null);
    if (!played.length) continue;

    // On se limite aux 10 premières cases : au-delà, les formes deviennent
    // inconfortables et surtout peu utiles à l'apprentissage.
    const highest = Math.max(...played);
    if (highest > maxFret) continue;

    // startFret : la plus basse case jouée non nulle. Une case 0 signifie
    // corde à vide, elle ne doit pas décaler la grille.
    // Aucune case négative : une forme placée trop bas sort du manche.
    if (played.some(f => f < 0)) continue;

    // ── Validation théorique ──────────────────────────────────────────
    // Un doigté saisi à la main peut contenir une erreur (ça m'est arrivé :
    // 48 formes sur 324 comportaient une note étrangère à l'accord). Plutôt
    // que de faire confiance à la saisie, on vérifie chaque note produite
    // contre la formule réelle de l'accord et on écarte ce qui ne colle pas.
    // Mieux vaut proposer 3 formes justes que 4 dont une est fausse.
    if (allowed) {
      const notes = frets.map((f, s) => (f === null || f < 0) ? null
        : CHROMATIC[(CHROMATIC.indexOf(OPEN_STRINGS[s]) + f) % 12]);
      if (notes.some(n => n && !allowed.has(n))) continue;
    }

    const fretted = played.filter(f => f > 0);
    // Écartement maximal de 3 cases entre le doigt le plus bas et le plus
    // haut. Au-delà, la forme est théoriquement juste mais physiquement
    // hors de portée pour la plupart des mains — mieux vaut ne pas la
    // proposer que faire échouer l'utilisateur sur un accord injouable.
    if (fretted.length && Math.max(...fretted) - Math.min(...fretted) > 3) continue;
    const startFret = fretted.length ? Math.min(...fretted) : 1;
    // Un accord est OUVERT s'il fait sonner au moins une corde à vide.
    // C'est ce qui le rend simple à jouer, et c'est le critère qui compte
    // pour un débutant — pas la position de la fondamentale.
    const isOpen = frets.some(f => f === 0);

    out.push({
      name: rootName,
      label: shape.label,
      // <ChordDiagram> attend -1 pour une corde étouffée, 0 pour une corde
      // à vide, et des cases absolues sinon.
      frets: frets.map(f => (f === null ? -1 : f)),
      // Doigté DÉRIVÉ des cases, jamais celui écrit dans la forme : ce
      // dernier ne vaut que pour la position barrée.
      fingers: computeFingers(frets.map(f => (f === null ? -1 : f)), !!shape.barre && !isOpen),
      // Un accord ouvert s'affiche depuis le SILLET (startFret 1), avec les
      // cordes à vide en cercles au-dessus — c'est la représentation
      // classique, celle de tous les recueils d'accords. Prendre la plus
      // basse case frettée décalerait la grille et rendrait le doigté
      // méconnaissable.
      startFret: isOpen ? 1 : startFret,
      // Pas d'indicateur de barré sur un accord ouvert : le sillet joue ce
      // rôle, et afficher un barré case 0 serait trompeur.
      barre: (shape.barre && !isOpen) ? startFret : undefined,
      rootFret,
      isOpen,
    });
  }

  // Les accords OUVERTS en premier, puis du grave vers l'aigu. C'est l'ordre
  // d'apprentissage réel : on apprend le La ouvert avant le La barré case 5.
  out.sort((a, b) => (b.isOpen - a.isOpen) || (a.rootFret - b.rootFret));
  return out;
}

/** Qualités pour lesquelles des formes existent. */
export function hasShapes(quality) {
  return !!SHAPES[quality];
}
