import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTab } from "../src/tab/tabParser.js";

test("une note simple sur une seule corde", () => {
  const texte = [
    "e|--0---2---|",
    "B|-----------|",
    "G|-----------|",
    "D|-----------|",
    "A|-----------|",
    "E|-----------|",
  ].join("\n");
  const { evenements, erreur } = parseTab(texte);
  assert.equal(erreur, null);
  assert.equal(evenements.length, 2);
  assert.deepEqual(evenements[0], { type: "note", fret: 0, col: 2, string: 1 });
  assert.equal(evenements[1].fret, 2);
  assert.equal(evenements[1].string, 1);
});

test("un accord : plusieurs cordes à la même colonne, triées par corde", () => {
  const texte = [
    "e|--0--|",
    "B|--1--|",
    "G|--0--|",
    "D|--2--|",
    "A|--2--|",
    "E|--0--|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.equal(evenements.length, 6);
  assert.ok(evenements.every(e => e.col === 2), "toutes les notes à la même colonne");
  assert.deepEqual(evenements.map(e => e.string), [1, 2, 3, 4, 5, 6], "triées par corde à colonne égale");
});

test("numéros de case à deux chiffres, pas confondus avec deux notes", () => {
  const texte = [
    "e|--12--10--|",
    "B|----------|",
    "G|----------|",
    "D|----------|",
    "A|----------|",
    "E|----------|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.equal(evenements.length, 2);
  assert.equal(evenements[0].fret, 12);
  assert.equal(evenements[1].fret, 10);
});

test("hammer-on : direction et cases correctes", () => {
  const texte = [
    "e|--3h5--|",
    "B|-------|", "G|-------|", "D|-------|", "A|-------|", "E|-------|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.equal(evenements.length, 1);
  assert.deepEqual(evenements[0], { type: "hammer", fromFret: 3, toFret: 5, col: 2, string: 1 });
});

test("pull-off : direction et cases correctes", () => {
  const texte = [
    "e|--5p3--|",
    "B|-------|", "G|-------|", "D|-------|", "A|-------|", "E|-------|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.deepEqual(evenements[0], { type: "pull", fromFret: 5, toFret: 3, col: 2, string: 1 });
});

test("slide montant et descendant, symboles distincts", () => {
  const texte = [
    String.raw`e|--3/5--5\3--|`,
    "B|-------------|", "G|-------------|", "D|-------------|", "A|-------------|", "E|-------------|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.equal(evenements.length, 2);
  assert.equal(evenements[0].type, "slide_up");
  assert.equal(evenements[1].type, "slide_down");
});

test("bend avec cible explicite", () => {
  const texte = [
    "e|--7b9--|",
    "B|-------|", "G|-------|", "D|-------|", "A|-------|", "E|-------|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.deepEqual(evenements[0], { type: "bend", fromFret: 7, toFret: 9, col: 2, string: 1 });
});

test("bend SANS cible : un ton entier par défaut (case + 2)", () => {
  const texte = [
    "e|--7b--|",
    "B|------|", "G|------|", "D|------|", "A|------|", "E|------|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.equal(evenements[0].type, "bend");
  assert.equal(evenements[0].fromFret, 7);
  assert.equal(evenements[0].toFret, 9, "un ton entier = +2 cases, par défaut");
});

test("note étouffée (x)", () => {
  const texte = [
    "e|--x--|",
    "B|-----|", "G|-----|", "D|-----|", "A|-----|", "E|-----|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  assert.deepEqual(evenements[0], { type: "mute", col: 2, string: 1 });
});

test("préfixe de corde (e|, B|...) retiré sans décaler l'alignement des colonnes", () => {
  const avecPrefixe = parseTab([
    "e|-0-|", "B|-1-|", "G|-2-|", "D|-3-|", "A|-4-|", "E|-5-|",
  ].join("\n"));
  const sansPrefixe = parseTab([
    "-0-", "-1-", "-2-", "-3-", "-4-", "-5-",
  ].join("\n"));
  // Même position relative pour chaque note, préfixe ou pas.
  assert.deepEqual(
    avecPrefixe.evenements.map(e => ({ fret: e.fret, string: e.string })),
    sansPrefixe.evenements.map(e => ({ fret: e.fret, string: e.string })),
  );
});

test("vibrato (~) toléré, sans faire planter ni produire d'évènement fantôme", () => {
  const texte = [
    "e|--5~---|",
    "B|-------|", "G|-------|", "D|-------|", "A|-------|", "E|-------|",
  ].join("\n");
  const { evenements, erreur } = parseTab(texte);
  assert.equal(erreur, null);
  assert.equal(evenements.length, 1, "le ~ ne doit générer aucun évènement séparé");
  assert.equal(evenements[0].fret, 5);
});

test("moins de 6 lignes exploitables : erreur claire, pas de plantage", () => {
  const { evenements, erreur } = parseTab("e|--0--|\nB|--1--|");
  assert.equal(evenements.length, 0);
  assert.match(erreur, /6 attendues/);
});

test("texte vide ou uniquement des espaces", () => {
  for (const t of ["", "   ", "\n\n\n"]) {
    const { evenements, erreur } = parseTab(t);
    assert.equal(evenements.length, 0);
    assert.ok(erreur);
  }
});

test("plus de 6 lignes (une ligne de titre collée avec) : les 6 premières servent, pas d'échec", () => {
  const texte = [
    "Ma chanson préférée",
    "e|--0--|", "B|--1--|", "G|--2--|", "D|--3--|", "A|--4--|", "E|--5--|",
  ].join("\n");
  const { evenements, erreur } = parseTab(texte);
  // La ligne de titre ne contient pas assez de tirets/chiffres consécutifs
  // pour être retenue par le filtre — les 6 vraies lignes de tab passent.
  assert.equal(erreur, null);
  assert.equal(evenements.length, 6);
});

test("séquence complète, ordre chronologique correct de bout en bout", () => {
  const texte = [
    "e|--0---2---3h5---|",
    "B|-----------------|",
    "G|-------0---------|",
    "D|-----------------|",
    "A|-----------------|",
    "E|-----------------|",
  ].join("\n");
  const { evenements } = parseTab(texte);
  const cols = evenements.map(e => e.col);
  const trie = [...cols].sort((a, b) => a - b);
  assert.deepEqual(cols, trie, "les évènements doivent déjà être dans l'ordre chronologique");
  assert.equal(evenements.length, 4);   // 3 notes corde 1 + 1 note corde 3
});
