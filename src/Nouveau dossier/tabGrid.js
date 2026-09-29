// Groply — tab/tabGrid.js
// Modèle de l'éditeur de tablature « on touche la tab directement ».
// Logique pure, sans React ni audio : testable avec node --test.
//
// ── Le modèle ───────────────────────────────────────────────────────────
// 6 cordes × pas de temps. 1 pas = 1 double-croche (même convention que la
// lecture audio). Stockage CREUX : seules les cases remplies existent.
//
//   grille = { notes: { "1-0": { fret: 5 }, "3-4": { mute: true } } }
//
// Une case peut porter :
//   fret  : numéro de case du manche (0-24)
//   mute  : note étouffée (x), sans fret
//   lie   : liée à la PROCHAINE note de la même corde — hammer-on si elle
//           monte, pull-off si elle descend (déduit, pas à choisir)
//   slide : glissé vers la prochaine note de la même corde (sens déduit)
//   bend  : 1 (demi-ton) ou 2 (ton entier), hauteur d'arrivée = fret+bend
//
// ── La taille n'est plus stockée ────────────────────────────────────────
// Elle se déduit du contenu : toujours au moins 2 mesures, et toujours une
// mesure vide après la dernière utilisée. On n'a donc jamais à « ajouter
// une mesure » : poser une note dans la mesure vide en fait apparaître une
// nouvelle. Et il n'y a rien à retirer : une mesure vidée disparaît seule.

export const PAS_PAR_MESURE = 16;
export const NB_CORDES = 6;
export const FRET_MAX = 24;

const cle = (corde, col) => `${corde}-${col}`;
const colDeCle = (k) => Number(k.split("-")[1]);

export function grilleVide() {
  return { notes: {} };
}

export function lireCase(grille, corde, col) {
  return grille?.notes?.[cle(corde, col)] || null;
}

/** Remplace (ou efface, si `cell` est null) une case. Ne mute jamais. */
export function ecrireCase(grille, corde, col, cell) {
  const notes = { ...grille.notes };
  if (cell == null) delete notes[cle(corde, col)];
  else notes[cle(corde, col)] = cell;
  return { notes };
}

/** Colonne de la dernière note posée, ou -1 si la grille est vide. */
export function derniereColonne(grille) {
  let max = -1;
  for (const k of Object.keys(grille?.notes || {})) max = Math.max(max, colDeCle(k));
  return max;
}

/** Nombre de pas affichés : ≥ 2 mesures, et une mesure vide après la dernière utilisée. */
export function nbColsVisibles(grille) {
  const der = derniereColonne(grille);
  const mesures = der < 0 ? 2 : Math.max(2, Math.floor(der / PAS_PAR_MESURE) + 2);
  return mesures * PAS_PAR_MESURE;
}

/** Nombre de mesures réellement utilisées (0 si vide) — sert à caler la boucle de lecture. */
export function nbMesuresUtilisees(grille) {
  const der = derniereColonne(grille);
  return der < 0 ? 0 : Math.floor(der / PAS_PAR_MESURE) + 1;
}

/**
 * La grille peut-elle s'afficher en croches (1 case = 2 pas) sans rien
 * cacher ? Oui si aucune note ne tombe sur une double-croche impaire.
 */
export function compatibleCroches(grille) {
  return Object.keys(grille?.notes || {}).every(k => colDeCle(k) % 2 === 0);
}

/**
 * Saisie au clavier PHYSIQUE : deux chiffres rapprochés se combinent
 * (1 puis 2 → 12), comme dans Guitar Pro. À l'écran, on choisit la case
 * directement dans une grille 0-24 : pas de délai invisible au doigt.
 * Les techniques déjà posées sur la case sont conservées.
 */
export function saisirChiffre(cellActuelle, chiffre, enchainer) {
  const base = cellActuelle && !cellActuelle.mute ? cellActuelle : {};
  if (enchainer && typeof base.fret === "number") {
    const combine = base.fret * 10 + chiffre;
    if (combine <= FRET_MAX) return { ...base, fret: combine };
  }
  return { ...base, fret: chiffre, mute: undefined };
}

/** Pose un numéro de case, en gardant les techniques déjà présentes. */
export function poserFret(cellActuelle, fret) {
  const base = cellActuelle && !cellActuelle.mute ? cellActuelle : {};
  return { ...base, fret: Math.max(0, Math.min(FRET_MAX, fret)), mute: undefined };
}

function notesDeLaCorde(grille, corde) {
  const out = [];
  for (const [k, cell] of Object.entries(grille.notes)) {
    const [s, c] = k.split("-").map(Number);
    if (s === corde) out.push({ col: c, cell });
  }
  return out.sort((a, b) => a.col - b.col);
}

/**
 * Grille → évènements, au format de tabParser.parseTab (+ `toCol` pour les
 * liaisons : la note d'arrivée sonne sur SA colonne). Une note d'arrivée
 * de liaison est "consommée" : elle n'est pas rejouée une seconde fois.
 * Limite v1, assumée : une liaison ne s'enchaîne pas sur une autre
 * (3h5h7 donne 3h5 puis 7 simple).
 */
export function grilleVersEvenements(grille) {
  const evenements = [];
  for (let corde = 1; corde <= NB_CORDES; corde++) {
    const notes = notesDeLaCorde(grille, corde);
    const consommees = new Set();
    notes.forEach((n, i) => {
      if (consommees.has(n.col)) return;
      const { cell, col } = n;
      if (cell.mute) { evenements.push({ type: "mute", col, string: corde }); return; }
      if (typeof cell.fret !== "number") return;

      const suivante = notes[i + 1];
      const suivanteJouable = suivante && !suivante.cell.mute && typeof suivante.cell.fret === "number";

      if ((cell.lie || cell.slide) && suivanteJouable) {
        const monte = suivante.cell.fret >= cell.fret;
        const type = cell.slide ? (monte ? "slide_up" : "slide_down") : (monte ? "hammer" : "pull");
        evenements.push({ type, fromFret: cell.fret, toFret: suivante.cell.fret, col, toCol: suivante.col, string: corde });
        consommees.add(suivante.col);
        return;
      }
      if (cell.bend === 1 || cell.bend === 2) {
        evenements.push({ type: "bend", fromFret: cell.fret, toFret: cell.fret + cell.bend, col, string: corde });
        return;
      }
      evenements.push({ type: "note", fret: cell.fret, col, string: corde });
    });
  }
  return evenements.sort((a, b) => a.col - b.col || a.string - b.string);
}

/**
 * Évènements (issus d'un texte collé, via parseTab) → grille. La colonne de
 * caractère devient directement le pas de temps : c'est déjà la convention
 * de lecture, donc le rythme entendu reste celui du texte d'origine.
 */
export function evenementsVersGrille(evenements) {
  let g = grilleVide();
  for (const ev of evenements || []) {
    switch (ev.type) {
      case "note": g = ecrireCase(g, ev.string, ev.col, { fret: ev.fret }); break;
      case "mute": g = ecrireCase(g, ev.string, ev.col, { mute: true }); break;
      case "bend": {
        const b = Math.max(1, Math.min(2, ev.toFret - ev.fromFret));
        g = ecrireCase(g, ev.string, ev.col, { fret: ev.fromFret, bend: b });
        break;
      }
      case "hammer": case "pull": case "slide_up": case "slide_down": {
        const lien = ev.type.startsWith("slide") ? { slide: true } : { lie: true };
        g = ecrireCase(g, ev.string, ev.col, { fret: ev.fromFret, ...lien });
        g = ecrireCase(g, ev.string, ev.toCol ?? ev.col + 1, { fret: ev.toFret });
        break;
      }
      default: break;
    }
  }
  return g;
}

/**
 * Exemple de départ : un plan de pentatonique mineure de La (position 5),
 * en croches, qui montre chaque technique une fois — hammer-on, pull-off,
 * bend d'un ton, slide — et finit sur la fondamentale (La, corde 4 case 7).
 */
export function grilleExemple() {
  const notes = [
    [3, 0, { fret: 5, lie: true }], [3, 2, { fret: 7 }],   // hammer 5→7
    [2, 4, { fret: 5 }],
    [2, 6, { fret: 8, lie: true }], [2, 8, { fret: 5 }],   // pull-off 8→5
    [3, 10, { fret: 7, bend: 2 }],                          // bend d'un ton
    [3, 14, { fret: 5 }],
    [4, 16, { fret: 7 }], [4, 18, { fret: 5 }],
    [5, 20, { fret: 5, slide: true }], [5, 24, { fret: 7 }],   // slide 5→7
    [4, 28, { fret: 7 }],                                   // retour sur La
  ];
  let g = grilleVide();
  for (const [s, c, cell] of notes) g = ecrireCase(g, s, c, cell);
  return g;
}

/** Validation défensive d'une grille relue depuis le stockage local
 *  (accepte aussi l'ancien format, qui portait un champ nbCols). */
export function grilleValide(g) {
  if (!g || typeof g !== "object" || !g.notes || typeof g.notes !== "object" || Array.isArray(g.notes)) return false;
  return Object.entries(g.notes).every(([k, v]) =>
    /^[1-6]-\d+$/.test(k) && colDeCle(k) < PAS_PAR_MESURE * 256 && v && typeof v === "object"
  );
}
