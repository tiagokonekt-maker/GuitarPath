// Liaisons enchaînées (3h5h7, 5h7p5, 7p5p3, 5h7/9) : analyse du texte,
// rendu sonore (une seule voix, sans nouvelle attaque), aller-retour par la
// grille de l'éditeur, affichage dans le lecteur de morceaux — et la
// « suite » de tabSon, qui rend la boucle A–B sans coupure.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTab } from "../src/tab/tabParser.js";
import { planifierTab, CORDE_MIDI, REGLAGES } from "../src/tab/tabSon.js";
import { grilleVersEvenements, evenementsVersGrille, ecrireCase, grilleVide, lireCase } from "../src/tab/tabGrid.js";
import { analyserMorceau, texteEvenement } from "../src/morceaux/morceaux.js";

/** Tab d'une seule ligne de Mi aigu, les 5 autres cordes vides. */
const tab = (ligneE, largeur = ligneE.length) => [
  ligneE, ...["B", "G", "D", "A", "E"].map(c => `${c}|${"-".repeat(largeur - 3)}|`),
].join("\n");
const evs = (ligneE) => parseTab(tab(ligneE)).evenements;
const fixe = () => 0.5;
const plan = (e, o = {}) => planifierTab(e, { bpm: 60, rng: fixe, ...o });   // 1 col = 0,25 s
const J = REGLAGES.decalageMaxMs / 2000;

// ── Analyse du texte ────────────────────────────────────────────────────

test("3h5h7 : un évènement par maillon, chacun arrive sur la colonne de sa case", () => {
  const e = evs("e|--3h5h7--|");
  assert.deepEqual(e.map(x => [x.type, x.fromFret, x.toFret, x.col, x.toCol, !!x.sansAttaque, !!x.enchaine]), [
    ["hammer", 3, 5, 2, 4, false, true],
    ["hammer", 5, 7, 4, 6, true, false],
  ]);
});

test("5h7p5 et 7p5p3 : trilles et pull-offs en cascade", () => {
  assert.deepEqual(evs("e|--5h7p5h7p5--|").map(x => `${x.fromFret}${x.type[0]}${x.toFret}@${x.col}`),
    ["5h7@2", "7p5@4", "5h7@6", "7p5@8"]);
  assert.deepEqual(evs("e|--7p5p3--|").map(x => [x.type, x.fromFret, x.toFret]),
    [["pull", 7, 5], ["pull", 5, 3]]);
});

test("liaisons et slides mélangés : 5h7/9, 9\\7p5 ; cases à deux chiffres", () => {
  assert.deepEqual(evs("e|--5h7/9--9\\7p5--|").map(x => [x.type, x.fromFret, x.toFret, !!x.sansAttaque]), [
    ["hammer", 5, 7, false], ["slide_up", 7, 9, true],
    ["slide_down", 9, 7, false], ["pull", 7, 5, true],
  ]);
  assert.deepEqual(evs("e|--12h14p12--|").map(x => [x.fromFret, x.toFret, x.col, x.toCol]),
    [[12, 14, 2, 5], [14, 12, 5, 8]]);
});

test("une liaison SIMPLE ne change pas : un évènement, sans toCol", () => {
  const [e] = evs("e|--3h5--|");
  assert.deepEqual(e, { type: "hammer", fromFret: 3, toFret: 5, col: 2, string: 1 });
});

test("vibrato final sur le dernier maillon ; chaîne interrompue par un symbole sans cible", () => {
  const e = evs("e|--5h7p5~~--|");
  assert.deepEqual(e.map(x => !!x.vibrato), [false, true]);
  // « 3h5h » : la chaîne s'arrête à 5 (liaison simple), le h orphelin est ignoré.
  assert.deepEqual(evs("e|--3h5h---|").map(x => [x.type, x.fromFret, x.toFret, x.toCol ?? null]), [["hammer", 3, 5, null]]);
});

test("chaîne dans un second système : toCol décalé avec le système", () => {
  const sys = (l) => tab(l);
  const { evenements } = parseTab(sys("e|--------|") + "\n\n" + sys("e|-5h7p5--|"));
  const [a, b] = evenements;
  assert.equal(b.col, a.toCol);
  assert.equal(a.toCol - a.col, 2);
  assert.ok(a.col >= 6, "décalé de la largeur du premier système");
});

// ── Rendu sonore ────────────────────────────────────────────────────────

test("une chaîne = UNE voix (une attaque), hauteur changée à chaque maillon, sur sa colonne", () => {
  const { voix } = plan(evs("e|--5h7p5h7--|"));
  assert.equal(voix.length, 1, "une seule attaque");
  const o = CORDE_MIDI[1];
  assert.deepEqual(voix[0].hauteurs.map(h => [h.t, h.midi, h.forme]), [
    [0, o + 5, "saut"], [0.5, o + 7, "saut"], [1.0, o + 5, "saut"], [1.5, o + 7, "saut"],
  ]);
});

test("chaîne avec slide : glissement continu, sans attaque, arrivé avant sa colonne", () => {
  const { voix } = plan(evs("e|--5h7/9--|"));
  assert.equal(voix.length, 1);
  const h = voix[0].hauteurs;
  const fin = h[h.length - 1];
  assert.equal(fin.forme, "rampe");
  assert.equal(fin.midi, CORDE_MIDI[1] + 9);
  assert.ok(fin.t > 0.5 && fin.t < 1.0);
});

test("la résonance se compte depuis le dernier maillon, et le vibrato final s'entend", () => {
  const { voix } = plan(evs("e|--5h7p5h7p5h7~--|"));
  const x = voix[0];
  const dernier = 2.5;   // 10 colonnes après l'attaque
  assert.ok(x.fin - x.debut >= dernier + REGLAGES.resonanceFinale - 1e-9);
  assert.ok(x.hauteurs.some(h => h.t > dernier && h.midi !== CORDE_MIDI[1] + 7), "vibrato présent");
});

test("maillon orphelin (reprise au milieu de la chaîne) : attaqué comme une liaison simple", () => {
  const [, deuxieme] = evs("e|--5h7p5--|");
  const { voix } = plan([deuxieme]);
  assert.equal(voix.length, 1);
  assert.deepEqual(voix[0].hauteurs.map(h => h.midi), [CORDE_MIDI[1] + 7, CORDE_MIDI[1] + 5]);
});

// ── Grille de l'éditeur ─────────────────────────────────────────────────

test("grille : notes liées en cascade → chaîne au format de parseTab", () => {
  let g = grilleVide();
  g = ecrireCase(g, 1, 0, { fret: 5, lie: true });
  g = ecrireCase(g, 1, 2, { fret: 7, lie: true });
  g = ecrireCase(g, 1, 4, { fret: 5, slide: true });
  g = ecrireCase(g, 1, 8, { fret: 9, vibrato: true });
  assert.deepEqual(grilleVersEvenements(g), [
    { type: "hammer", fromFret: 5, toFret: 7, col: 0, toCol: 2, string: 1, enchaine: true },
    { type: "pull", fromFret: 7, toFret: 5, col: 2, toCol: 4, string: 1, sansAttaque: true, enchaine: true },
    { type: "slide_up", fromFret: 5, toFret: 9, col: 4, toCol: 8, string: 1, sansAttaque: true, vibrato: true },
  ]);
});

test("aller-retour texte → grille → évènements : la chaîne est conservée à l'identique", () => {
  const e = evs("e|--5h7p5h7p5~--3h5h7/9--7p5p3--|");
  const g = evenementsVersGrille(e);
  assert.deepEqual(lireCase(g, 1, 4), { fret: 7, lie: true });
  assert.deepEqual(grilleVersEvenements(g), e);
});

// ── Lecteur de morceaux ─────────────────────────────────────────────────

test("morceau : toCol converti en colonne musicale, texte affiché comme écrit", () => {
  const m = {
    colsParMesure: 8,
    tab: tab("e|--------|5h7p5---|"),
  };
  const a = analyserMorceau(m);
  assert.deepEqual(a.evenements.map(e => [e.col, e.toCol]), [[8, 10], [10, 12]], "barres de mesure retirées");
  assert.deepEqual(a.evenements.map(texteEvenement), ["5h", "7p5"]);
});

// ── Boucle sans coupure : la « suite » ─────────────────────────────────

test("suite : la dernière note s'arrête quand SA corde rejoue au tour suivant, pas avant", () => {
  const tour = evs("e|----5---|");   // note à la colonne 4, tour de 8 colonnes
  const suite = tour.map(e => ({ ...e, col: e.col + 8 }));
  const seul = plan(tour).voix[0];
  const enBoucle = plan(tour, { suite }).voix;
  assert.equal(enBoucle.length, 1, "les voix de la suite ne sont pas jouées");
  assert.ok(Math.abs(seul.fin - (4 * 0.25 + J + REGLAGES.resonanceFinale)) < 1e-9);
  assert.ok(Math.abs(enBoucle[0].fin - (12 * 0.25 + J)) < 1e-9, "coupée à la reprise de la même corde");
});

test("suite : une corde qui ne rejoue pas au tour suivant résonne normalement", () => {
  const tour = parseTab([
    "e|--------|", "B|-----3--|", "G|--------|", "D|--------|", "A|0-------|", "E|--------|",
  ].join("\n")).evenements;
  const suite = tour.filter(e => e.string === 5).map(e => ({ ...e, col: e.col + 8 }));
  const { voix } = plan(tour, { suite });
  const si = voix.find(v => v.corde === 2), la = voix.find(v => v.corde === 5);
  assert.ok(Math.abs(si.fin - si.debut - REGLAGES.resonanceFinale) < 1e-9, "Si : résonance normale");
  assert.ok(Math.abs(la.fin - (8 * 0.25 + J)) < 1e-9, "La : coupé quand il rejoue");
});
