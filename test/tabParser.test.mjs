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

// ── Plusieurs systèmes ────────────────────────────────────────────────────

test("tab réelle à 3 systèmes (accords, paroles, numéros de mesure, lignes vides) : séquence complète", () => {
  const texte = [
    "Intro",
    "",
    "   Am              C",
    "e|-0-------|-------0---|",
    "B|---1-----|-----1-----|",
    "G|-----2---|---0-------|",
    "D|---------|-2---------|",
    "A|-0-------|-3---------|",
    "E|---------|-----------|",
    "",
    "   G               Am",
    "e|-3-------|-0---------|",
    "B|---0-----|---1-------|",
    "G|-----0---|-----2-----|",
    "D|---------|-----------|",
    "A|---------|-0---------|",
    "E|-3-------|-----------|",
    "   la la la, paroles ici",
    "5          6",
    "e|-0h2--5~-|",
    "B|---------|",
    "G|---------|",
    "D|---------|",
    "A|---------|",
    "E|---------|",
  ].join("\n");
  const { evenements, erreur, avertissements, systemes } = parseTab(texte);
  assert.equal(erreur, null);
  assert.deepEqual(avertissements, []);
  assert.equal(systemes, 3);
  // 9 + 8 + 2 évènements.
  assert.equal(evenements.length, 19);
  // Système 1 : « -0-------|-------0---| » → 21 colonnes après retrait des
  // barres de bord, +1 pour la barre de jonction. Le système 2 démarre à 22.
  const s1 = evenements.filter(e => e.col < 22);
  const s2 = evenements.filter(e => e.col >= 22 && e.col < 44);
  const s3 = evenements.filter(e => e.col >= 44);
  assert.deepEqual([s1.length, s2.length, s3.length], [9, 8, 2]);
  assert.deepEqual(evenements.find(e => e.string === 6 && e.fret === 3), { type: "note", fret: 3, col: 23, string: 6 },
    "le G du système 2 tombe juste après la fin du système 1, sans trou ni chevauchement");
  assert.equal(s3[0].type, "hammer");
  assert.equal(s3[0].col, 45);
  assert.equal(s3[1].vibrato, true);
  // Ordre chronologique global.
  const cols = evenements.map(e => e.col);
  assert.deepEqual(cols, [...cols].sort((a, b) => a - b));
});

test("jonction de systèmes : même timing qu'un seul système avec une barre au milieu", () => {
  const seul = parseTab([
    "e|-0-|-2-|", "B|---|---|", "G|---|---|", "D|---|---|", "A|---|---|", "E|---|---|",
  ].join("\n")).evenements;
  const deux = parseTab([
    "e|-0-|", "B|---|", "G|---|", "D|---|", "A|---|", "E|---|",
    "",
    "e|-2-|", "B|---|", "G|---|", "D|---|", "A|---|", "E|---|",
  ].join("\n")).evenements;
  assert.deepEqual(deux, seul);
});

test("étiquettes mélangées : e|, B|, sans étiquette, barres en tête — même résultat", () => {
  const avec = parseTab([
    "e|-0-|", "B|-1-|", "G|-2-|", "D|-3-|", "A|-4-|", "E|-5-|",
    "",
    "e|-7-|", "B|---|", "G|---|", "D|---|", "A|---|", "E|---|",
  ].join("\n")).evenements;
  const melange = parseTab([
    "e|-0-|", "|-1-|", "G -2-|", "-3-|", "A|-4-|", "E:-5-|",
    "",
    "|-7-|", "B|---|", "---|", "D|---|", "|---|", "E|---|",
  ].join("\n")).evenements;
  assert.deepEqual(melange, avec);
  assert.deepEqual(avec.map(e => e.string), [1, 2, 3, 4, 5, 6, 1]);
});

test("lignes sans étiquette ni barre : systèmes enchaînés bout à bout", () => {
  const { evenements, systemes } = parseTab([
    "--0--", "-----", "-----", "-----", "-----", "-----",
    "",
    "--3--", "-----", "-----", "-----", "-----", "-----",
  ].join("\n"));
  assert.equal(systemes, 2);
  assert.deepEqual(evenements.map(e => e.col), [2, 7], "pas de barre de fin : pas de colonne ajoutée");
});

test("annotation après la dernière barre (x2, bis) ignorée, pas prise pour une note étouffée", () => {
  const { evenements, erreur } = parseTab([
    "e|--0--|  x2", "B|-----|", "G|-----|", "D|-----|", "A|-----|", "E|-----|",
  ].join("\n"));
  assert.equal(erreur, null);
  assert.deepEqual(evenements.map(e => e.type), ["note"]);
});

test("bloc de basse 4 cordes : ignoré avec un avertissement, les systèmes de 6 lignes restent lus", () => {
  const { evenements, erreur, avertissements, systemes } = parseTab([
    "G|-----|", "D|--2--|", "A|-----|", "E|--0--|",
    "",
    "e|--5--|", "B|-----|", "G|-----|", "D|-----|", "A|-----|", "E|-----|",
  ].join("\n"));
  assert.equal(erreur, null);
  assert.equal(systemes, 1);
  assert.equal(avertissements.length, 1);
  assert.match(avertissements[0], /4 lignes/);
  assert.deepEqual(evenements, [{ type: "note", fret: 5, col: 2, string: 1 }]);
});

test("7 cordes uniquement : erreur claire (aucun système de 6), avertissement, pas de plantage", () => {
  const { evenements, erreur, avertissements } = parseTab(
    ["e|-0-|", "B|---|", "G|---|", "D|---|", "A|---|", "E|---|", "B|---|"].join("\n"));
  assert.equal(evenements.length, 0);
  assert.match(erreur, /6 attendues/);
  assert.match(avertissements[0], /7 lignes/);
});

test("12 lignes collées sans séparation : découpées en 2 systèmes", () => {
  const sys = (f) => [`e|-${f}-|`, "B|---|", "G|---|", "D|---|", "A|---|", "E|---|"];
  const { evenements, systemes } = parseTab([...sys(1), ...sys(2)].join("\n"));
  assert.equal(systemes, 2);
  assert.deepEqual(evenements.map(e => [e.fret, e.col]), [[1, 1], [2, 5]]);
});

// ── Relâché et vibrato ───────────────────────────────────────────────────

test("bend relâché 7b9r7 : un seul évènement, cible et colonne du relâché", () => {
  const { evenements } = parseTab([
    "e|--7b9r7--|", "B|---------|", "G|---------|", "D|---------|", "A|---------|", "E|---------|",
  ].join("\n"));
  assert.equal(evenements.length, 1, "le r7 ne retombe plus en note séparée");
  assert.deepEqual(evenements[0], { type: "bend", fromFret: 7, toFret: 9, releaseFret: 7, releaseCol: 5, col: 2, string: 1 });
});

test("bend relâché sans cible (7b9r) : retour à la case de départ", () => {
  const { evenements } = parseTab([
    "e|--7b9r---|", "B|---------|", "G|---------|", "D|---------|", "A|---------|", "E|---------|",
  ].join("\n"));
  assert.equal(evenements.length, 1);
  assert.equal(evenements[0].releaseFret, 7);
});

test("colonne du relâché décalée avec le système", () => {
  const { evenements } = parseTab([
    "e|-0-|", "B|---|", "G|---|", "D|---|", "A|---|", "E|---|",
    "",
    "e|-7b9r7-|", "B|-------|", "G|-------|", "D|-------|", "A|-------|", "E|-------|",
  ].join("\n"));
  const bend = evenements.find(e => e.type === "bend");
  assert.equal(bend.col, 5);
  assert.equal(bend.releaseCol, 8);
});

test("vibrato : marqué sur la note, le bend ou la liaison, sans évènement fantôme", () => {
  const { evenements } = parseTab([
    "e|--5~~~--7b9~--3h5~--2--|", "B|------------------------|", "G|------------------------|",
    "D|------------------------|", "A|------------------------|", "E|------------------------|",
  ].join("\n"));
  assert.deepEqual(evenements.map(e => [e.type, !!e.vibrato]),
    [["note", true], ["bend", true], ["hammer", true], ["note", false]]);
  assert.ok(!("vibrato" in evenements[3]), "pas de champ vibrato quand il n'y en a pas");
});
