import { test } from "node:test";
import assert from "node:assert/strict";
import { MORCEAUX, morceauParId } from "../src/morceaux/catalogue.js";
import { FORMES_ACCORDS } from "../src/morceaux/accords.js";
import {
  analyserMorceau, melodieJouee, bpmEffectif, dureeColonnes, tempsDeMesure,
  extraireSegment, ajouterDecompte, preparerLecture, filtrerMorceaux, compterMesures,
  texteEvenement, NIVEAUX, TYPES,
} from "../src/morceaux/morceaux.js";
import { planifierTab } from "../src/tab/tabSon.js";

// ── Catalogue ─────────────────────────────────────────────────────────────

test("catalogue : 8 à 12 morceaux, identifiants uniques, champs requis", () => {
  assert.ok(MORCEAUX.length >= 8 && MORCEAUX.length <= 12, `${MORCEAUX.length} morceaux`);
  const ids = new Set(MORCEAUX.map(m => m.id));
  assert.equal(ids.size, MORCEAUX.length);
  for (const m of MORCEAUX) {
    for (const champ of ["id", "titre", "auteur", "description", "tonalite", "mesure", "licence", "tab"]) {
      assert.ok(typeof m[champ] === "string" && m[champ].trim(), `${m.id} : ${champ} manquant`);
    }
    assert.ok(m.niveau in NIVEAUX, `${m.id} : niveau ${m.niveau}`);
    assert.ok(m.type in TYPES, `${m.id} : type ${m.type}`);
    assert.ok(m.tempo >= 40 && m.tempo <= 200, `${m.id} : tempo ${m.tempo}`);
    assert.ok([12, 16].includes(m.colsParMesure), `${m.id} : colsParMesure`);
    assert.ok(/domaine public|original/i.test(m.licence), `${m.id} : licence explicite`);
    assert.equal(morceauParId(m.id), m);
  }
  // Chaque filtre a au moins un morceau.
  for (const niveau of Object.keys(NIVEAUX)) assert.ok(filtrerMorceaux(MORCEAUX, { niveau }).length > 0, niveau);
  for (const type of Object.keys(TYPES)) assert.ok(filtrerMorceaux(MORCEAUX, { type }).length > 0, type);
});

for (const m of MORCEAUX) {
  test(`« ${m.titre} » : la tab se lit sans erreur ni avertissement, mesures conformes`, () => {
    const a = analyserMorceau(m);
    assert.equal(a.erreur, null);
    assert.deepEqual(a.avertissements, []);
    assert.deepEqual(a.anomalies, []);
    assert.ok(a.evenements.length > 0);
    assert.ok(a.nbMesures > 0);
    // Toutes les notes tombent dans une mesure existante.
    for (const ev of a.evenements) {
      assert.ok(ev.mesure >= 0 && ev.mesure < a.nbMesures, `mesure ${ev.mesure}`);
      assert.equal(Math.floor(ev.col / m.colsParMesure), ev.mesure);
    }
    if (m.grille) assert.equal(m.grille.length, a.nbMesures, "un accord par mesure");
    // Jouable : le planificateur sonore produit une voix par évènement.
    const { voix } = planifierTab(a.evenements, { bpm: m.tempo, rng: () => 0 });
    assert.equal(voix.length, a.evenements.length);
  });
}

test("mélodies : les notes de la tab sont exactement celles annoncées", () => {
  const melodies = MORCEAUX.filter(m => m.type === "melodie");
  assert.ok(melodies.length >= 4);
  for (const m of melodies) {
    assert.ok(m.melodie, `${m.id} : champ melodie`);
    const attendu = m.melodie.replace(/\|/g, " ").trim().split(/\s+/);
    assert.deepEqual(melodieJouee(analyserMorceau(m).evenements), attendu, m.id);
    // Une seule note à la fois : c'est une mélodie.
    const cols = analyserMorceau(m).evenements.map(e => e.col);
    assert.equal(new Set(cols).size, cols.length, `${m.id} : deux notes simultanées`);
  }
});

test("Ode à la joie commence par Mi Mi Fa Sol Sol Fa Mi Ré", () => {
  const ode = morceauParId("ode-a-la-joie");
  assert.deepEqual(melodieJouee(analyserMorceau(ode).evenements).slice(0, 8),
    ["Mi", "Mi", "Fa", "Sol", "Sol", "Fa", "Mi", "Ré"]);
});

test("morceaux d'accords : chaque note appartient à la forme de l'accord de sa mesure", () => {
  for (const m of MORCEAUX.filter(x => x.type === "accords")) {
    for (const s of m.accords) assert.ok(FORMES_ACCORDS[s], `${m.id} : forme ${s} manquante`);
    for (const s of m.grille) assert.ok(FORMES_ACCORDS[s], `${m.id} : forme ${s} manquante`);
    for (const ev of analyserMorceau(m).evenements) {
      const forme = FORMES_ACCORDS[m.grille[ev.mesure]];
      assert.equal(ev.type, "note");
      assert.equal(forme.frets[6 - ev.string], ev.fret,
        `${m.id} mesure ${ev.mesure + 1}, corde ${ev.string} : case ${ev.fret} hors de ${m.grille[ev.mesure]}`);
    }
  }
});

// ── Analyse ───────────────────────────────────────────────────────────────

const MINI = {
  colsParMesure: 4,
  tab: [
    "e|0---|--1-|",
    "B|----|----|",
    "G|----|----|",
    "D|----|----|",
    "A|----|----|",
    "E|----|3---|",
    "",
    "e|----|",
    "B|-0h2|",
    "G|----|",
    "D|----|",
    "A|----|",
    "E|----|",
  ].join("\n"),
};

test("analyserMorceau : colonnes de barre retirées, mesures numérotées, systèmes enchaînés", () => {
  const a = analyserMorceau(MINI);
  assert.equal(a.nbMesures, 3);
  assert.deepEqual(a.anomalies, []);
  const resume = a.evenements.map(e => [e.col, e.mesure, e.string, texteEvenement(e)]);
  assert.deepEqual(resume, [
    [0, 0, 1, "0"],
    [4, 1, 6, "3"],
    [6, 1, 1, "1"],
    [9, 2, 2, "0h2"],
  ]);
});

test("analyserMorceau : signale une mesure de mauvaise largeur", () => {
  const faux = { colsParMesure: 4, tab: MINI.tab.replace("e|0---|--1-|", "e|0----|-1-|") };
  assert.ok(analyserMorceau(faux).anomalies.length > 0);
});

test("compterMesures compte les mesures de chaque système", () => {
  assert.equal(compterMesures(MINI.tab), 3);
  assert.equal(compterMesures("rien"), 0);
});

// ── Tempo ─────────────────────────────────────────────────────────────────

test("bpmEffectif : pourcentage du tempo d'origine, borné à 40–100 %", () => {
  assert.equal(bpmEffectif(100, 100), 100);
  assert.equal(bpmEffectif(100, 70), 70);
  assert.equal(bpmEffectif(96, 75), 72);
  assert.equal(bpmEffectif(100, 10), 40);     // plancher 40 %
  assert.equal(bpmEffectif(100, 150), 100);   // plafond 100 %
  assert.equal(bpmEffectif(84, 55), 46);      // arrondi
});

test("dureeColonnes : une mesure de 4/4 (16 colonnes) dure 4 temps", () => {
  assert.equal(dureeColonnes(16, 60), 4);
  assert.equal(dureeColonnes(16, 120), 2);
  assert.equal(dureeColonnes(12, 60), 3);
});

test("tempsDeMesure : clics du décompte selon la signature", () => {
  assert.deepEqual(tempsDeMesure("4/4", 16), [0, 4, 8, 12]);
  assert.deepEqual(tempsDeMesure("3/4", 12), [0, 4, 8]);
  assert.deepEqual(tempsDeMesure("6/8", 12), [0, 6]);
});

// ── A–B ───────────────────────────────────────────────────────────────────

test("extraireSegment : garde les mesures A à B et recale à la colonne 0", () => {
  const a = analyserMorceau(MINI);
  const seg = extraireSegment(a.evenements, 4, 1, 2);
  assert.deepEqual(seg.map(e => [e.col, e.colMorceau, e.mesure]), [[0, 4, 1], [2, 6, 1], [5, 9, 2]]);
  // L'original n'est pas modifié.
  assert.equal(a.evenements[1].col, 4);
  // Bornes inversées tolérées ; une seule mesure.
  assert.deepEqual(extraireSegment(a.evenements, 4, 2, 1).map(e => e.col), [0, 2, 5]);
  assert.deepEqual(extraireSegment(a.evenements, 4, 0, 0).map(e => e.colMorceau), [0]);
});

test("extraireSegment décale aussi releaseCol et toCol", () => {
  const evs = [{ type: "bend", string: 2, col: 18, fromFret: 7, toFret: 9, releaseFret: 7, releaseCol: 21, mesure: 1 },
    { type: "hammer", string: 3, col: 20, toCol: 22, fromFret: 5, toFret: 7, mesure: 1 }];
  const seg = extraireSegment(evs, 16, 1, 1);
  assert.equal(seg[0].col, 2); assert.equal(seg[0].releaseCol, 5);
  assert.equal(seg[1].col, 4); assert.equal(seg[1].toCol, 6);
});

test("ajouterDecompte : une mesure de clics devant, le reste décalé d'une mesure", () => {
  const evs = ajouterDecompte([{ type: "note", string: 1, fret: 0, col: 0 }], 16, [0, 4, 8, 12]);
  assert.deepEqual(evs.map(e => [e.col, e.type, e.decompte ?? null]),
    [[0, "mute", 1], [4, "mute", 2], [8, "mute", 3], [12, "mute", 4], [16, "note", null]]);
});

test("preparerLecture : segment, tempo réduit, décompte et durée de boucle", () => {
  const ode = morceauParId("ode-a-la-joie");
  const a = analyserMorceau(ode);
  const p = preparerLecture(a, { tempo: 100, signature: "4/4", pourcent: 50, debut: 2, fin: 3, decompte: true });
  assert.equal(p.bpm, 50);
  assert.equal(p.colonnes, 16 * 3);                 // 2 mesures + décompte
  assert.equal(p.duree, dureeColonnes(48, 50));     // 48 doubles à 50 BPM = 14,4 s
  assert.ok(Math.abs(p.duree - 14.4) < 1e-9);
  assert.deepEqual(p.evenements.slice(0, 4).map(e => e.decompte), [1, 2, 3, 4]);
  const notes = p.evenements.filter(e => !e.decompte);
  assert.ok(notes.every(e => e.mesure === 2 || e.mesure === 3));
  assert.equal(notes[0].col, 16);                   // juste après le décompte
  assert.equal(notes[0].colMorceau, 32);            // début de la 3e mesure du morceau
  // Sans options : tout le morceau, tempo d'origine, pas de décompte.
  const tout = preparerLecture(a, { tempo: 100, signature: "4/4" });
  assert.equal(tout.bpm, 100);
  assert.equal(tout.evenements.length, a.evenements.length);
  assert.equal(tout.colonnes, a.nbMesures * 16);
  // Bornes hors du morceau ramenées dans les limites.
  const borne = preparerLecture(a, { tempo: 100, signature: "4/4", debut: -3, fin: 99 });
  assert.equal(borne.debut, 0); assert.equal(borne.fin, a.nbMesures - 1);
});

test("filtrerMorceaux : par niveau et par type", () => {
  const deb = filtrerMorceaux(MORCEAUX, { niveau: "debutant" });
  assert.ok(deb.every(m => m.niveau === "debutant"));
  const riffsInter = filtrerMorceaux(MORCEAUX, { niveau: "intermediaire", type: "riff" });
  assert.ok(riffsInter.every(m => m.niveau === "intermediaire" && m.type === "riff"));
  assert.equal(filtrerMorceaux(MORCEAUX).length, MORCEAUX.length);
});
