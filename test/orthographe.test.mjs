import { test } from "node:test";
import assert from "node:assert/strict";
import {
  epelerGamme, epelerAccord, nomsGamme, nomsAccord, nomFr, nomEn, pcDe, lireNote,
  epelerDansTonalite, nomDansTonalite, symboleAccord, nomRacineGamme, carteNoms, simplifier, simplifierRare, note,
} from "../src/music/orthographe.js";
import { getScaleNotes, getChordNotes, CHROMATIC_NOTES, SCALES, CHORD_TYPES, normalizeNote, noteToFr } from "../src/fretboardUtils.js";

const fr = (notes) => notes.map(nomFr).join(" ");
const lettres = (notes) => notes.map(n => n.l);

// ── 12 tonalités majeures et 12 mineures : chaque lettre une seule fois ──
const MAJEURES = {
  "C": "Do Ré Mi Fa Sol La Si",
  "C#": "Réb Mib Fa Solb Lab Sib Do",
  "D": "Ré Mi Fa# Sol La Si Do#",
  "D#": "Mib Fa Sol Lab Sib Do Ré",
  "E": "Mi Fa# Sol# La Si Do# Ré#",
  "F": "Fa Sol La Sib Do Ré Mi",
  "F#": "Fa# Sol# La# Si Do# Ré# Mi#",
  "G": "Sol La Si Do Ré Mi Fa#",
  "G#": "Lab Sib Do Réb Mib Fa Sol",
  "A": "La Si Do# Ré Mi Fa# Sol#",
  "A#": "Sib Do Ré Mib Fa Sol La",
  "B": "Si Do# Ré# Mi Fa# Sol# La#",
};
const MINEURES = {
  "C": "Do Ré Mib Fa Sol Lab Sib",
  "C#": "Do# Ré# Mi Fa# Sol# La Si",
  "D": "Ré Mi Fa Sol La Sib Do",
  "D#": "Mib Fa Solb Lab Sib Dob Réb",
  "E": "Mi Fa# Sol La Si Do Ré",
  "F": "Fa Sol Lab Sib Do Réb Mib",
  "F#": "Fa# Sol# La Si Do# Ré Mi",
  "G": "Sol La Sib Do Ré Mib Fa",
  "G#": "Sol# La# Si Do# Ré# Mi Fa#",
  "A": "La Si Do Ré Mi Fa Sol",
  "A#": "Sib Do Réb Mib Fa Solb Lab",
  "B": "Si Do# Ré Mi Fa# Sol La",
};

test("12 tonalités majeures : orthographe usuelle, 7 lettres distinctes", () => {
  for (const [r, attendu] of Object.entries(MAJEURES)) {
    const g = epelerGamme(r, "major");
    assert.equal(fr(g), attendu, `${r} majeur`);
    assert.equal(new Set(lettres(g)).size, 7, `${r} majeur : une lettre par degré`);
    assert.ok(g.every(n => Math.abs(n.acc) <= 1), `${r} majeur : pas de double altération`);
  }
});

test("12 tonalités mineures : orthographe usuelle, 7 lettres distinctes", () => {
  for (const [r, attendu] of Object.entries(MINEURES)) {
    const g = epelerGamme(r, "natural_minor");
    assert.equal(fr(g), attendu, `${r} mineur`);
    assert.equal(new Set(lettres(g)).size, 7, `${r} mineur : une lettre par degré`);
  }
});

test("toutes les gammes heptatoniques, dans les 12 tons : une lettre par degré, sans double altération", () => {
  for (const [key, s] of Object.entries(SCALES)) {
    if (s.intervals.length !== 7) continue;
    for (const r of CHROMATIC_NOTES) {
      const g = epelerGamme(r, key);
      assert.equal(new Set(lettres(g)).size, 7, `${r} ${key}`);
      assert.ok(g.every(n => Math.abs(n.acc) <= 1), `${r} ${key} : ${fr(g)}`);
    }
  }
});

test("la racine accepte toutes les écritures (A#, Bb, Sib, La#) avec le même résultat", () => {
  for (const r of ["A#", "Bb", "Sib", "La#"]) assert.equal(fr(epelerGamme(r, "major")), MAJEURES["A#"]);
});

test("blues : la note bleue est la quinte bémolisée", () => {
  assert.equal(nomsGamme("C", "blues").join(" "), "Do Mib Fa Solb Sol Sib");
  assert.equal(nomsGamme("A", "blues").join(" "), "La Do Ré Mib Mi Sol");
  assert.equal(nomsGamme("E", "blues").join(" "), "Mi Sol La Sib Si Ré");
  // Hors gamme heptatonique, Dob s'affiche Si (règle 4) ; l'orthographe
  // théorique brute reste disponible via epelerGamme.
  assert.equal(nomsGamme("F", "blues").join(" "), "Fa Lab Sib Si Do Mib");
  assert.equal(fr(epelerGamme("F", "blues")), "Fa Lab Sib Dob Do Mib");
  assert.equal(carteNoms("F", { gamme: "blues" }).get("B"), "Si");
  assert.equal(nomsGamme("G", "blues").join(" "), "Sol Sib Do Réb Ré Fa");
  // Fa# plutôt que Solb (qui donnerait Sibb) : la règle « moins d'altérations ».
  assert.equal(nomsGamme("F#", "blues").join(" "), "Fa# La Si Do Do# Mi");
});

test("pentatoniques", () => {
  assert.equal(nomsGamme("A", "pentatonic_minor").join(" "), "La Do Ré Mi Sol");
  assert.equal(nomsGamme("F", "pentatonic_major").join(" "), "Fa Sol La Do Ré");
  assert.equal(nomsGamme("D#", "pentatonic_minor").join(" "), "Mib Solb Lab Sib Réb");
  assert.equal(nomsGamme("C#", "pentatonic_minor").join(" "), "Do# Mi Fa# Sol# Si");
});

test("accords courants", () => {
  const cas = [
    ["A#", "dom7", "Sib Ré Fa Lab"],
    ["D#", "min", "Mib Solb Sib"],
    ["F#", "maj", "Fa# La# Do#"],
    ["C#", "maj", "Réb Fa Lab"],
    ["C#", "min", "Do# Mi Sol#"],
    ["G#", "min", "Sol# Si Ré#"],
    ["G#", "maj", "Lab Do Mib"],
    ["C", "maj7", "Do Mi Sol Si"],
    ["F", "maj7", "Fa La Do Mi"],
    ["D", "min7", "Ré Fa La Do"],
    ["G", "dom7", "Sol Si Ré Fa"],
    ["B", "min7b5", "Si Ré Fa La"],
    ["E", "min7b5", "Mi Sol Sib Ré"],
    ["C", "dom7s9", "Do Mi Sol Sib Ré#"],
    ["C", "dom7b9", "Do Mi Sol Sib Réb"],
    ["C", "aug", "Do Mi Sol#"],
    ["C", "maj7s11", "Do Mi Sol Si Fa#"],
  ];
  for (const [r, t, attendu] of cas) assert.equal(fr(epelerAccord(r, t)), attendu, `${r} ${t}`);
});

test("règle 4 : Dob/Fab/Mi#/Si# gardés en gamme heptatonique et en accord", () => {
  assert.equal(nomsGamme("F#", "major").join(" "), "Fa# Sol# La# Si Do# Ré# Mi#");
  assert.equal(nomsGamme("C#", "major", { simplifierDoubles: false }).join(" "), "Réb Mib Fa Solb Lab Sib Do");
  assert.equal(nomsGamme("D#", "natural_minor").join(" "), "Mib Fa Solb Lab Sib Dob Réb");
  assert.equal(fr(epelerGamme(note(4, -1), "major")), "Solb Lab Sib Dob Réb Mib Fa"); // Solb majeur imposé
  assert.equal(fr(epelerGamme(note(0, 1), "major")), "Do# Ré# Mi# Fa# Sol# La# Si#"); // Do# majeur imposé
  assert.equal(nomsAccord(note(5, -1), "min").join(" "), "Lab Dob Mib");              // Lab m
  assert.equal(nomFr(simplifierRare(note(0, -1))), "Si");
  assert.equal(nomFr(simplifierRare(note(2, 1))), "Fa");
  assert.equal(nomFr(simplifierRare(note(6, -1))), "Sib");
  for (const r of CHROMATIC_NOTES) for (const k of ["blues", "pentatonic_minor", "pentatonic_major", "whole_tone", "diminished"]) {
    assert.ok(nomsGamme(r, k).every(x => !/^(Dob|Fab|Mi#|Si#)$/.test(x)), `${r} ${k}: ${nomsGamme(r, k)}`);
  }
});

test("dim7 : orthographe théorique avec 𝄫, simplifiée à l'affichage", () => {
  assert.equal(fr(epelerAccord("C", "dim7")), "Do Mib Solb Sibb");
  assert.equal(nomsAccord("C", "dim7").join(" "), "Do Mib Solb La");
  assert.equal(nomsAccord("C", "dim7", { simplifierDoubles: false }).join(" "), "Do Mib Solb Sibb");
  assert.equal(fr(epelerAccord("B", "dim7")), "Si Ré Fa Lab");
});

test("symboles d'accord orthographiés (français et anglais)", () => {
  assert.equal(symboleAccord("A#", "min"), "Sibm");
  assert.equal(symboleAccord("A#", "min", "en"), "Bbm");
  assert.equal(symboleAccord("D#", "dom7"), "Mib7");
  assert.equal(symboleAccord("C#", "min7"), "Do#m7");
  assert.equal(symboleAccord("F#", "maj"), "Fa#");
  assert.equal(nomRacineGamme("G#", "major"), "Lab");
  assert.equal(nomRacineGamme("G#", "natural_minor"), "Sol#");
});

test("note dans une tonalité : degré si dans la gamme, sinon degré chromatique", () => {
  assert.equal(nomDansTonalite("A#", "F", "major"), "Sib");
  assert.equal(nomDansTonalite("F#", "C", "major"), "Solb");   // b5
  assert.equal(nomDansTonalite("D#", "A", "pentatonic_minor"), "Mib"); // note bleue de La
  assert.equal(nomDansTonalite(8, "C", "major"), "Lab");          // b6
  assert.equal(nomDansTonalite("C#", "C", "major"), "Réb");       // b2
  assert.equal(nomDansTonalite("A#", "C", "major"), "Sib");       // b7
  // Règle 4 : rare gardée pour un degré heptatonique, naturelle sinon.
  assert.equal(nomDansTonalite("B", "F#", "major"), "Si");        // degré 4 de Fa#
  assert.equal(nomDansTonalite("F", "F#", "major"), "Mi#");       // sensible de Fa# majeur
  assert.equal(nomDansTonalite("B", "F", "major"), "Si");         // b5 de Fa (Dob) → Si
  assert.equal(nomDansTonalite("B", "F", "pentatonic_minor"), "Si");
  assert.equal(nomDansTonalite("B", "D#", "natural_minor"), "Dob");  // degré 6 de Mib m
  // Bémol impossible sans double altération : la lettre voisine est prise.
  const n = epelerDansTonalite("C", "C#", "natural_minor");     // b2 de Do# = Ré (naturel)
  assert.ok(Math.abs(n.acc) <= 1);
  assert.equal(pcDe(n), 0);
});

test("les classes de hauteur ne changent pas par rapport aux fonctions historiques", () => {
  for (const r of CHROMATIC_NOTES) {
    for (const k of Object.keys(SCALES)) {
      assert.deepEqual(epelerGamme(r, k).map(pcDe), getScaleNotes(r, k).map(n => CHROMATIC_NOTES.indexOf(n)), `${r} ${k}`);
      assert.deepEqual(nomsGamme(r, k).map(normalizeNote), getScaleNotes(r, k), `${r} ${k} (affichage)`);
    }
    for (const k of Object.keys(CHORD_TYPES)) {
      assert.deepEqual(epelerAccord(r, k).map(pcDe), getChordNotes(r, k).map(n => CHROMATIC_NOTES.indexOf(n)), `${r} ${k}`);
      assert.deepEqual(nomsAccord(r, k).map(normalizeNote), getChordNotes(r, k), `${r} ${k} (affichage)`);
      assert.ok(nomsAccord(r, k).every(x => !/##|bb/.test(x)), `${r} ${k} : affichage sans double altération`);
    }
  }
});

test("carteNoms : clé interne en dièses → nom affiché", () => {
  const c = carteNoms("F", { gamme: "major" });
  assert.equal(c.get("A#"), "Sib");
  assert.equal(c.get("F"), "Fa");
  assert.equal(carteNoms("C", { accord: "dim7" }).get("A"), "La");
  assert.equal(carteNoms("F", { gamme: "major", langue: "en" }).get("A#"), "Bb");
});

test("lecture et simplification", () => {
  assert.deepEqual(lireNote("Sib"), note(6, -1));
  assert.deepEqual(lireNote("A#3"), note(5, 1));
  assert.deepEqual(lireNote("Re"), note(1));
  assert.equal(lireNote("H"), null);
  assert.equal(nomEn(lireNote("Réb")), "Db");
  assert.equal(nomFr(simplifier(note(3, 2))), "Sol");     // Fa## → Sol
  assert.equal(nomFr(simplifier(note(2, 2))), "Fa#");     // Mi## → Fa#
  assert.equal(nomFr(simplifier(note(6, -2))), "La");     // Sibb → La
});

test("rétrocompatibilité : noteToFr et normalizeNote sans contexte restent en dièses", () => {
  assert.equal(noteToFr("Bb"), "La#");
  assert.equal(noteToFr("A#"), "La#");
  assert.equal(normalizeNote("Bb"), "A#");
  assert.equal(normalizeNote("Ré"), "D");
  assert.equal(normalizeNote("Sib"), "A#");
  assert.equal(normalizeNote("Mi#"), "F");
  assert.equal(normalizeNote("Sibb"), "A");
});

// ── Câblage : Jam et entraînement d'oreille ─────────────────────────────
import { nomAccord, nomsNotesAccord, nomTonique } from "../src/screens/jam/harmonie.js";
import { generateEarTrainingQuestion } from "../src/audioEngine.js";

test("Jam : accords et notes orthographiés dans la tonalité", () => {
  assert.equal(nomTonique("A#", "major"), "Sib");
  assert.equal(nomTonique("C#", "pentatonic_minor"), "Do#");
  assert.equal(nomAccord("F", { degree: 5, quality: "dom7" }, "blues"), "Sib7");
  assert.equal(nomAccord("D#", { degree: 2, quality: "min7" }, "major"), "Fam7");
  assert.equal(nomAccord("D#", { degree: 7, quality: "dom7" }, "major"), "Sib7");
  assert.equal(nomAccord("F#", { degree: 7, quality: "dom7" }, "major"), "Do#7");
  const n = nomsNotesAccord("F", { degree: 5, quality: "dom7" }, "blues");
  assert.deepEqual(n.map(x => x.nom), ["Sib", "Ré", "Fa", "Lab"]);
  assert.deepEqual(n.map(x => x.note), ["A#", "D", "F", "G#"]);   // valeurs internes inchangées
});

const NOM_ACCORD_FR = /^(Do|Ré|Mi|Fa|Sol|La|Si)(#|b)?(m|7|m7|maj7|dim)?$/;
test("oreille : libellés d'accords en français orthographié, clés internes inchangées", () => {
  // Accord en tonalité : « Rém (ii) » — nom orthographié dans la tonalité
  // annoncée, puis le degré (la clé interne).
  const DEMI_TONS = { "I": 0, "IV": 5, "V": 7, "vi": 9, "ii": 2, "iii": 4, "V7": 7, "vii°": 11 };
  for (let i = 0; i < 300; i++) {
    const q = generateEarTrainingQuestion("chord_full", { pool: Object.keys(DEMI_TONS), toutesOptions: true });
    const tonique = normalizeNote(/Tonalité : (\S+) majeur/.exec(q.consigne)[1]);
    for (const o of q.options) {
      const m = /^(\S+) \((.+)\)$/.exec(o.label);
      assert.ok(m && m[2] === o.key, o.label);
      assert.match(m[1], NOM_ACCORD_FR, o.label);
      const racine = normalizeNote(m[1].match(/^(Do|Ré|Mi|Fa|Sol|La|Si)(#|b)?/)[0]);
      assert.equal((CHROMATIC_NOTES.indexOf(racine) - CHROMATIC_NOTES.indexOf(tonique) + 12) % 12, DEMI_TONS[o.key], `${o.label} en ${tonique}`);
    }
    // Une lettre par degré : Ré#dim en Mi majeur (sensible), jamais Mib ; Sib en Fa, jamais La#.
    const lettre = (o) => /^(Do|Ré|Mi|Fa|Sol|La|Si)/.exec(o.label)[1];
    const parDegre = new Map(q.options.map(o => [DEMI_TONS[o.key], lettre(o)]));
    assert.equal(new Set(parDegre.values()).size, parDegre.size, q.options.map(o => o.label).join(", "));
  }
  for (let i = 0; i < 300; i++) {
    const q = generateEarTrainingQuestion("progression");
    assert.equal(q.noms.length, q.chords.length);
    q.noms.forEach((nom, k) => {
      assert.match(nom, NOM_ACCORD_FR, nom);
      assert.equal(normalizeNote(nom.match(/^(Do|Ré|Mi|Fa|Sol|La|Si)(#|b)?/)[0]), q.chords[k].root, q.noms.join(" – "));
    });
  }
});
