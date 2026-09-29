import { test } from "node:test";
import assert from "node:assert/strict";
import {
  grilleVide, ecrireCase, lireCase, derniereColonne, nbColsVisibles, nbMesuresUtilisees,
  compatibleCroches, saisirChiffre, poserFret, grilleVersEvenements, evenementsVersGrille,
  grilleExemple, grilleValide, PAS_PAR_MESURE,
} from "../src/tab/tabGrid.js";
import { parseTab } from "../src/tab/tabParser.js";

/** Forme comparable d'un évènement : la note d'arrivée d'une liaison issue
 *  d'un texte collé tombe implicitement à col+1. */
const normaliser = (evs) => evs.map(e => ({ ...e, ...(e.fromFret != null && e.type !== "bend" ? { toCol: e.toCol ?? e.col + 1 } : {}) }));

test("grille vide : aucune note, 2 mesures affichées, 0 utilisée", () => {
  const g = grilleVide();
  assert.deepEqual(grilleVersEvenements(g), []);
  assert.equal(derniereColonne(g), -1);
  assert.equal(nbColsVisibles(g), 2 * PAS_PAR_MESURE);
  assert.equal(nbMesuresUtilisees(g), 0);
});

test("la grille grandit seule : toujours une mesure vide après la dernière utilisée", () => {
  assert.equal(nbColsVisibles(ecrireCase(grilleVide(), 1, 3, { fret: 0 })), 32, "note en mesure 1 → 2 mesures");
  assert.equal(nbColsVisibles(ecrireCase(grilleVide(), 1, 20, { fret: 0 })), 48, "note en mesure 2 → 3 mesures");
  assert.equal(nbMesuresUtilisees(ecrireCase(grilleVide(), 1, 20, { fret: 0 })), 2);
});

test("vider la dernière mesure la fait disparaître, sans bouton « retirer »", () => {
  let g = ecrireCase(grilleVide(), 1, 40, { fret: 3 });
  assert.equal(nbColsVisibles(g), 64);
  g = ecrireCase(g, 1, 40, null);
  assert.equal(nbColsVisibles(g), 32);
});

test("écrire puis effacer une case, sans jamais muter la grille d'origine", () => {
  const g0 = grilleVide();
  const g1 = ecrireCase(g0, 2, 5, { fret: 3 });
  assert.equal(lireCase(g0, 2, 5), null);
  assert.deepEqual(lireCase(g1, 2, 5), { fret: 3 });
  assert.equal(lireCase(ecrireCase(g1, 2, 5, null), 2, 5), null);
});

test("compatibilité croches : impossible dès qu'une note tombe sur une double-croche impaire", () => {
  assert.equal(compatibleCroches(ecrireCase(grilleVide(), 1, 4, { fret: 0 })), true);
  assert.equal(compatibleCroches(ecrireCase(grilleVide(), 1, 5, { fret: 0 })), false);
});

test("poserFret : borné à 0-24, garde les techniques, efface l'étouffement", () => {
  assert.equal(poserFret(null, 30).fret, 24);
  assert.deepEqual(poserFret({ fret: 7, bend: 2 }, 9), { fret: 9, bend: 2, mute: undefined });
  assert.ok(!poserFret({ mute: true }, 3).mute);
});

test("clavier physique : 1 puis 2 → 12, mais 3 puis 5 → 5 (35 > 24)", () => {
  assert.equal(saisirChiffre(saisirChiffre(null, 1, false), 2, true).fret, 12);
  assert.equal(saisirChiffre(saisirChiffre(null, 3, false), 5, true).fret, 5);
});

test("liaison montante → hammer-on, descendante → pull-off (sens déduit)", () => {
  let g = grilleVide();
  g = ecrireCase(g, 1, 0, { fret: 5, lie: true });
  g = ecrireCase(g, 1, 2, { fret: 7 });
  g = ecrireCase(g, 2, 4, { fret: 8, lie: true });
  g = ecrireCase(g, 2, 6, { fret: 5 });
  const ev = grilleVersEvenements(g);
  assert.equal(ev.length, 2, "la note d'arrivée est consommée par la liaison, pas rejouée");
  assert.deepEqual(ev[0], { type: "hammer", fromFret: 5, toFret: 7, col: 0, toCol: 2, string: 1 });
  assert.equal(ev[1].type, "pull");
});

test("slide : sens déduit des cases, toCol conservé", () => {
  let g = ecrireCase(grilleVide(), 3, 1, { fret: 9, slide: true });
  g = ecrireCase(g, 3, 5, { fret: 7 });
  assert.deepEqual(grilleVersEvenements(g),
    [{ type: "slide_down", fromFret: 9, toFret: 7, col: 1, toCol: 5, string: 3 }]);
});

test("liaison sans note suivante sur la corde : la note reste jouée, simple", () => {
  const g = ecrireCase(grilleVide(), 1, 3, { fret: 5, lie: true });
  assert.deepEqual(grilleVersEvenements(g), [{ type: "note", fret: 5, col: 3, string: 1 }]);
});

test("bend demi-ton et ton entier", () => {
  let g = ecrireCase(grilleVide(), 2, 0, { fret: 8, bend: 1 });
  g = ecrireCase(g, 3, 0, { fret: 7, bend: 2 });
  const ev = grilleVersEvenements(g);
  assert.equal(ev.find(e => e.string === 2).toFret, 9);
  assert.equal(ev.find(e => e.string === 3).toFret, 9);
});

test("accord : plusieurs cordes sur la même colonne, triées par corde", () => {
  let g = grilleVide();
  for (const [s, f] of [[1, 0], [2, 1], [3, 0], [4, 2], [5, 3]]) g = ecrireCase(g, s, 0, { fret: f });
  assert.deepEqual(grilleVersEvenements(g).map(e => e.string), [1, 2, 3, 4, 5]);
});

test("import d'un texte collé : mêmes évènements une fois passés par la grille", () => {
  const texte = [
    "e|--0---2---3h5---5/7---7b9---x---|",
    "B|---------------------------------|", "G|---------------------------------|",
    "D|---------------------------------|", "A|---------------------------------|",
    "E|---------------------------------|",
  ].join("\n");
  const direct = parseTab(texte).evenements;
  const viaGrille = grilleVersEvenements(evenementsVersGrille(direct));
  assert.deepEqual(viaGrille, normaliser(direct));
});

test("l'exemple de départ : valide, en croches, et montre chaque technique", () => {
  const g = grilleExemple();
  assert.ok(grilleValide(g));
  assert.ok(compatibleCroches(g), "l'exemple doit s'afficher en croches, le mode le plus lisible");
  const types = new Set(grilleVersEvenements(g).map(e => e.type));
  for (const t of ["hammer", "pull", "bend", "slide_up"]) assert.ok(types.has(t), `technique absente : ${t}`);
  assert.equal(nbMesuresUtilisees(g), 2);
});

test("grilleValide : accepte l'ancien format, rejette une grille corrompue", () => {
  assert.equal(grilleValide(grilleVide()), true);
  assert.equal(grilleValide({ nbCols: 32, notes: {} }), true, "ancien format (avec nbCols) toujours relu");
  for (const mauvais of [null, "x", { nbCols: 32 }, { notes: [] }, { notes: { "9-0": { fret: 1 } } }, { notes: { "1-0": null } }]) {
    assert.equal(grilleValide(mauvais), false, JSON.stringify(mauvais));
  }
});
