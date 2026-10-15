// Groply — test/diagrammes-son.test.mjs
// Ce que joue chaque diagramme de leçon (src/fretboard/diagrammesSon.js),
// vérifié sur TOUS les blocs réels du contenu : chaque bloc se convertit sans
// erreur, et les notes jouées sont bien celles que le diagramme montre.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES } from "../src/content/index.js";
import { parseTab } from "../src/tab/tabParser.js";
import { pcDeNom } from "../src/music/orthographe.js";
import { SCALES, CHORD_TYPES, normalizeNote } from "../src/fretboardUtils.js";
import {
  midiVersNote, noteVersMidi, noteAPosition, fretsToNotes, cordesDeFrets, parseNomAccord, nomAccordFr,
  voicingAccord, cagedVersCordes, sequenceGrattage, sequenceArpege,
  scaleBlockToNotes, monteeDescente, sequenceMelodique, fretboardBlockToNotes, noteGridToNotes,
  notesMontantesDepuis, sequenceLecon, strumBlockToEvents, rhythmBlockToEvents, decalageLigneTab,
  notesIntervalle, sequenceIntervalles, degreeBoxToNotes, contexteDegres, sequenceDegres, accordDuCercle,
} from "../src/fretboard/diagrammesSon.js";

// ── Inventaire des blocs du contenu ──────────────────────────────────────
const BLOCS = {};
(function parcourir(o) {
  if (Array.isArray(o)) return o.forEach(parcourir);
  if (o && typeof o === "object") {
    if (typeof o.type === "string" && (o.data || o.type === "fretboard_interactive")) (BLOCS[o.type] ||= []).push(o);
    for (const k in o) parcourir(o[k]);
  }
})(COURSES);
const blocs = (type) => {
  const l = BLOCS[type] || [];
  assert.ok(l.length > 0, `aucun bloc ${type} trouvé dans le contenu`);
  return l;
};

const pc = (note) => ((noteVersMidi(note) % 12) + 12) % 12;
const MIDI_MIN = 36, MIDI_MAX = 83;   // C2 → B5 : la plage des échantillons
const dansLaPlage = (note) => { const m = noteVersMidi(note); return m != null && m >= MIDI_MIN && m <= MIDI_MAX; };
/** Un libellé est-il un nom de note (« Do », « Fa# », « Sib ») ? null sinon. */
const pcDuLibelle = (l) => (typeof l === "string" && /^(Do|Ré|Mi|Fa|Sol|La|Si)(#|b)?$/.test(l) ? pcDeNom(l) : null);

// ═══════════════════════════════════════════════════════════════════════════
test("conversions de base : MIDI ↔ note, case → note (accordage standard)", () => {
  assert.equal(midiVersNote(40), "E2");
  assert.equal(midiVersNote(46), "Bb2");
  assert.equal(noteVersMidi("C#4"), 61);
  assert.equal(noteVersMidi("Bb2"), 46);
  for (let m = 36; m <= 83; m++) assert.equal(noteVersMidi(midiVersNote(m)), m);
  assert.deepEqual([6, 5, 4, 3, 2, 1].map(c => noteAPosition(c, 0)), ["E2", "A2", "D3", "G3", "B3", "E4"]);
  assert.equal(noteAPosition(6, 5), "A2");
  assert.equal(noteAPosition(3, 4), "B3");
  assert.equal(noteAPosition(1, 12), "E5");
  assert.equal(noteAPosition(7, 0), null);
});

test("fretsToNotes : frets [c6..c1] → notes du grave vers l'aigu, cordes étouffées ignorées", () => {
  assert.deepEqual(fretsToNotes([0, 2, 2, 0, 0, 0]), ["E2", "B2", "E3", "G3", "B3", "E4"]);   // Em
  assert.deepEqual(fretsToNotes([-1, 0, 2, 2, 1, 0]), ["A2", "E3", "A3", "C4", "E4"]);       // Am
  assert.deepEqual(fretsToNotes([-1, 3, 2, 0, 1, 0]), ["C3", "E3", "G3", "C4", "E4"]);       // C
  assert.deepEqual(fretsToNotes([3, 2, 0, 0, 0, 3]), ["G2", "B2", "D3", "G3", "B3", "G4"]);  // G
  assert.deepEqual(fretsToNotes([-1, -1, 0, 2, 3, 2]), ["D3", "A3", "D4", "Gb4"]);           // D
  assert.deepEqual(cordesDeFrets([-1, 3, 2, 0, 1, 0]).map(c => c.index), [1, 2, 3, 4, 5]);
  assert.deepEqual(fretsToNotes(undefined), []);
});

test("parseNomAccord : noms des leçons (français, anglais, renversements, fonction entre parenthèses)", () => {
  const pcs = (nom) => [...parseNomAccord(nom).pcs].sort((a, b) => a - b);
  assert.deepEqual(pcs("Am"), [0, 4, 9]);
  assert.deepEqual(pcs("Do"), [0, 4, 7]);
  assert.deepEqual(pcs("Sol"), [2, 7, 11]);
  assert.deepEqual(pcs("G7 (V7)"), [2, 5, 7, 11]);
  assert.deepEqual(pcs("Bb (♭VII)"), [2, 5, 10]);
  assert.deepEqual(pcs("Bdim"), [2, 5, 11]);
  assert.deepEqual(pcs("Cmaj7"), [0, 4, 7, 11]);
  assert.deepEqual(pcs("Am9"), [0, 4, 7, 9, 11]);
  assert.equal(parseNomAccord("C/E").basse, 4);
  assert.equal(parseNomAccord("Xyz"), null);
  assert.equal(nomAccordFr("Am"), "La mineur");
  assert.equal(nomAccordFr("C/E"), "Do majeur, Mi à la basse");
  assert.equal(nomAccordFr("Dm7 (ii)"), "Ré mineur 7");
});

test("chord_diagram : chaque accord du contenu joue exactement les notes de son nom", () => {
  for (const b of blocs("chord_diagram")) {
    const { name, frets, startFret = 1 } = b.data;
    const cordes = cordesDeFrets(frets);
    assert.ok(cordes.length >= 3, `${name} : au moins 3 cordes jouées`);
    assert.ok(cordes.every(c => dansLaPlage(c.note)), `${name} : notes dans la plage des échantillons`);
    // Du grave vers l'aigu : un grattage parcourt les cordes dans cet ordre.
    assert.deepEqual(cordes.map(c => c.corde), [...cordes.map(c => c.corde)].sort((a, b) => b - a));
    const accord = parseNomAccord(name);
    assert.ok(accord, `nom d'accord illisible : « ${name} »`);
    for (const c of cordes) {
      assert.ok(accord.pcs.has(pc(c.note)), `${name} (${frets.join(" ")}) : ${c.note} (corde ${c.corde}, case ${c.case}) n'appartient pas à l'accord`);
    }
    assert.ok(cordes.some(c => pc(c.note) === accord.racine), `${name} : la fondamentale doit sonner`);
    if (accord.basse != null) assert.equal(pc(cordes[0].note), accord.basse, `${name} : basse attendue`);
    // Ce qui sonne est ce qui est dessiné : aucune case jouée hors du cadre.
    for (const c of cordes.filter(x => x.case > 0)) {
      assert.ok(c.case >= startFret && c.case < startFret + 4, `${name} : case ${c.case} hors du cadre dessiné (startFret ${startFret})`);
    }
    // Les deux séquences sont bien formées.
    const g = sequenceGrattage(cordes);
    assert.equal(g.length, 1);
    assert.equal(g[0].strum, "down");
    const a = sequenceArpege(cordes);
    assert.equal(a.length, cordes.length + 1);
    assert.deepEqual(a.slice(0, -1).map(e => e.step), cordes.map((_, i) => i));
    assert.ok(a.every((e, i) => i === 0 || e.t > a[i - 1].t), "arpège : instants croissants");
  }
});

test("caged_form : une note par corde, conforme aux libellés, du grave vers l'aigu", () => {
  for (const b of blocs("caged_form")) {
    const cordes = cagedVersCordes(b.data);
    assert.ok(cordes.length >= 3);
    assert.deepEqual(cordes.map(c => c.corde), [...cordes.map(c => c.corde)].sort((a, z) => z - a));
    const racine = pcDeNom(b.data.root);
    assert.ok(cordes.some(c => pc(c.note) === racine), `forme ${b.data.form} : la fondamentale ${b.data.root} doit sonner`);
    for (const n of b.data.notes) {
      const attendu = pcDuLibelle(n.label);
      if (attendu == null) continue;
      assert.equal(pc(noteAPosition(n.string, n.fret)), attendu, `forme ${b.data.form} : corde ${n.string} case ${n.fret} ≠ ${n.label}`);
    }
    // Mineur : la caption annonce Am, on vérifie La-Do-Mi.
    const pcs = new Set(cordes.map(c => pc(c.note)));
    if (/\bAm\b/.test(b.caption)) assert.deepEqual([...pcs].sort((a, z) => a - z), [0, 4, 9]);
  }
});

test("scale_pattern : ordre du pattern (corde 6 → 1, cases croissantes), notes = libellés du diagramme", () => {
  for (const b of blocs("scale_pattern")) {
    const notes = scaleBlockToNotes(b.data);
    assert.ok(notes.length >= 5, `${b.caption} : au moins 5 notes`);
    assert.ok(notes.every(n => dansLaPlage(n.note)));
    for (let i = 1; i < notes.length; i++) {
      const a = notes[i - 1], z = notes[i];
      assert.ok(z.indexCorde > a.indexCorde || (z.indexCorde === a.indexCorde && z.case > a.case), `${b.caption} : ordre du pattern`);
    }
    for (const n of notes) {
      assert.ok(n.case >= b.data.startFret && n.case <= b.data.endFret);
      const label = b.data.noteMap?.[n.cle];
      if (label != null && pcDuLibelle(label) != null) {
        assert.equal(pc(n.note), pcDuLibelle(label), `${b.caption} : case ${n.cle} jouée ${n.note}, affichée ${label}`);
      }
    }
    // Les fondamentales sont jouées.
    const racines = b.data.strings.flatMap((st, i) => (st.root || []).map(f => `${f},${i}`));
    for (const r of racines) assert.ok(notes.some(n => n.cle === r), `${b.caption} : fondamentale ${r} jouée`);
    // Montée puis descente : palindrome, sommet non répété.
    const md = monteeDescente(notes);
    assert.equal(md.length, notes.length * 2 - 1);
    assert.deepEqual(md.map(n => n.cle), [...md].reverse().map(n => n.cle));
    const seq = sequenceMelodique(md, { ecart: 0.32 });
    assert.deepEqual(seq.map(e => e.step), md.map(n => n.cle));
  }
});

test("scale_pattern : La pentatonique mineure position 1 = La Do Ré Mi Sol La…", () => {
  const b = blocs("scale_pattern").find(x => /pentatonique mineure — Position 1/.test(x.caption));
  assert.deepEqual(scaleBlockToNotes(b.data).map(n => n.note).slice(0, 6), ["A2", "C3", "D3", "E3", "G3", "A3"]);
});

test("fretboard : notes dans l'ordre de l'auteur, conformes aux libellés, sans doublon", () => {
  for (const b of blocs("fretboard")) {
    const notes = fretboardBlockToNotes(b.data);
    assert.ok(notes.length >= 1, `${b.caption} : au moins une note`);
    assert.ok(notes.every(n => dansLaPlage(n.note)));
    assert.equal(new Set(notes.map(n => n.cle)).size, notes.length, "pas de doublon");
    for (const n of b.data.notes) {
      const attendu = pcDuLibelle(n.label);
      if (attendu == null || n.muted) continue;
      assert.equal(pc(noteAPosition(n.string, n.open ? 0 : n.fret)), attendu, `${b.caption} : corde ${n.string} case ${n.fret} ≠ ${n.label}`);
    }
  }
  // L'exercice 1-2-3-4 : Fa Fa# Sol Sol# sur la corde 6, dans l'ordre.
  const ex = blocs("fretboard").find(x => /1-2-3-4/.test(x.caption));
  assert.deepEqual(fretboardBlockToNotes(ex.data).map(n => n.note), ["F2", "Gb2", "G2", "Ab2"]);
});

test("note_grid : notes de la corde, case la plus basse → la plus haute, conformes aux libellés", () => {
  for (const b of blocs("note_grid")) {
    const notes = noteGridToNotes(b.data);
    assert.equal(notes.length, new Set(b.data.highlights.map(h => h.fret)).size);
    for (let i = 1; i < notes.length; i++) assert.ok(notes[i].midi > notes[i - 1].midi);
    for (const h of b.data.highlights) {
      const attendu = pcDuLibelle(h.label);
      if (attendu != null) assert.equal(pc(noteAPosition(b.data.string, h.fret)), attendu, `${b.caption} : case ${h.fret} ≠ ${h.label}`);
    }
  }
});

test("fretboard_interactive : gamme / accord / notes jouées sont celles du manche ; quiz muet", () => {
  for (const b of blocs("fretboard_interactive")) {
    const infos = {
      racinePc: b.root ? pcDeNom(normalizeNote(b.root)) : null,
      intervallesGamme: SCALES[b.scale]?.intervals,
      intervallesAccord: CHORD_TYPES[b.chord]?.intervals,
      pcsNotes: (b.notes || []).map(n => pcDeNom(normalizeNote(n))),
    };
    const seq = sequenceLecon(b, infos);
    if (b.mode === "quiz") { assert.equal(seq, null); continue; }
    assert.ok(seq?.length >= 3, `${b.caption} : une séquence`);
    const permis = new Set(
      b.mode === "scale" ? infos.intervallesGamme.map(i => (infos.racinePc + i) % 12)
        : b.mode === "chord" ? infos.intervallesAccord.map(i => (infos.racinePc + i) % 12)
          : infos.pcsNotes,
    );
    for (const ev of seq) {
      const notes = Array.isArray(ev.notes) ? ev.notes : [ev.notes];
      for (const n of notes) {
        assert.ok(permis.has(pc(n)), `${b.caption} : ${n} hors de l'ensemble affiché`);
        assert.ok(dansLaPlage(n));
      }
      // Le surlignage désigne une note qui sonne (nom interne en dièses).
      const steps = Array.isArray(ev.step) ? ev.step : [ev.step];
      for (const s of steps) assert.ok(permis.has(pcDeNom(s)), `${b.caption} : surlignage ${s}`);
    }
    assert.ok(seq.every((e, i) => i === 0 || e.t >= seq[i - 1].t));
  }
  // Gamme montante : la pentatonique de La part de La3, monte jusqu'à La4, redescend.
  const md = notesMontantesDepuis(9, SCALES.pentatonic_minor.intervals);
  assert.deepEqual(md.map(n => n.note), ["A3", "C4", "D4", "E4", "G4", "A4"]);
});

test("strum_pattern : coups bas/haut/étouffés aux bons instants, 2 mesures au tempo du bloc", () => {
  for (const b of blocs("strum_pattern")) {
    const { evenements, dureeMesure, cellules, bpm } = strumBlockToEvents(b.data);
    const { pattern, beats } = b.data;
    assert.equal(cellules, pattern.length);
    assert.equal(bpm, b.data.bpm ?? 80);
    assert.ok(Math.abs(dureeMesure - beats * 60 / bpm) < 1e-9);
    assert.ok(evenements.every(e => e.t >= 0 && e.t < 2 * dureeMesure), "tout tient dans 2 mesures");
    assert.ok(evenements.every(e => e.step >= 0 && e.step < pattern.length));
    assert.ok(evenements.every((e, i) => i === 0 || e.t >= evenements[i - 1].t), "instants croissants");
    // Autant de coups vers le bas / le haut / étouffés que le pattern en dessine (× 2 mesures).
    const compte = (k) => evenements.filter(e => e.kind === k).length;
    const attendus = { down: 0, up: 0, mute: 0 };
    for (const p of pattern) {
      if (p === "B" || p === "BH") attendus.down++;
      if (p === "H" || p === "BH" || p === "-H") attendus.up++;
      if (p === "x") attendus.mute++;
    }
    assert.equal(compte("down"), attendus.down * 2, `${b.caption} : coups vers le bas`);
    assert.equal(compte("up"), attendus.up * 2, `${b.caption} : coups vers le haut`);
    assert.equal(compte("mute"), attendus.mute * 2, `${b.caption} : coups étouffés`);
    for (const e of evenements.filter(x => x.notes?.length)) {
      assert.ok(e.duree > 0);
      assert.ok(e.notes.every(dansLaPlage));
      // Un coup vers le haut ne touche que les cordes aiguës.
      if (e.kind === "up") assert.ok(e.notes.length <= 4 && e.strum === "up");
    }
  }
  // B - BH -H BH -H B H à 70 : le « -H » tombe sur la seconde moitié de sa case.
  const r = strumBlockToEvents({ pattern: ["B", "-H"], beats: 1, bpm: 60 }, { mesures: 1 });
  assert.deepEqual(r.evenements.map(e => [e.t, e.kind]), [[0, "down"], [0.75, "up"]]);
});

test("rhythm_grid : attaques sur les cases non muettes, tenues jusqu'à la suivante, clic des temps", () => {
  for (const b of blocs("rhythm_grid")) {
    const { evenements, cellules, dureeMesure, bpm } = rhythmBlockToEvents(b.data);
    const { beats = 4, subdivision = 8, muted = [], highlights = [], accents = [] } = b.data;
    assert.equal(cellules, beats * subdivision / 4);
    assert.ok(bpm >= 60 && bpm <= 120);
    const attaques = evenements.filter(e => e.kind === "attaque" || e.kind === "fort");
    const muettes = evenements.filter(e => e.kind === "silence");
    assert.equal(attaques.length, (cellules - muted.length) * 2, `${b.caption} : une attaque par case non muette`);
    assert.equal(muettes.length, muted.length * 2);
    for (const e of attaques) {
      assert.ok(!muted.includes(e.step));
      assert.ok(e.duree > 0 && e.t + e.duree <= 2 * dureeMesure + 1e-9);
      assert.equal(e.kind === "fort", highlights.includes(e.step) || accents.includes(e.step));
    }
    const clics = evenements.filter(e => e.kind === "clic");
    assert.equal(clics.length, highlights.length ? beats * 2 : 0);
  }
  // Ronde : une seule attaque par mesure, tenue (presque) toute la mesure.
  const ronde = blocs("rhythm_grid").find(x => /^Ronde/.test(x.caption));
  const r = rhythmBlockToEvents(ronde.data, { mesures: 1 });
  const a = r.evenements.filter(e => e.kind === "fort");
  assert.equal(a.length, 1);
  assert.ok(a[0].duree > r.dureeMesure * 0.95);
});

test("tab : chaque tablature se lit, et le curseur tombe sur les chiffres de la tab", () => {
  for (const b of blocs("tab")) {
    const { evenements, erreur } = parseTab(b.data.lines.join("\n"));
    assert.equal(erreur, null);
    assert.ok(evenements.length > 0, `${b.caption} : des notes`);
    assert.equal(b.data.lines.length, 6);
    const d = decalageLigneTab(b.data.lines[0]);
    assert.equal(d, 2);   // « e| »
    for (const ev of evenements) {
      const ligne = b.data.lines[ev.string - 1];
      const car = ligne[d + ev.col];
      assert.match(car, /\d/, `${b.caption} : colonne ${ev.col} (corde ${ev.string}) → « ${car} »`);
    }
  }
});

test("interval_chart : intervalles depuis Do 4", () => {
  assert.deepEqual(notesIntervalle(7), ["C4", "G4"]);
  assert.deepEqual(notesIntervalle(3), ["C4", "Eb4"]);
  assert.deepEqual(notesIntervalle(12), ["C4", "C5"]);
  const seq = sequenceIntervalles([{ demiTons: 4, step: "M3" }, { demiTons: 6, step: "TT" }]);
  assert.equal(seq.length, 4);
  assert.deepEqual(seq.filter(e => e.step).map(e => e.step), ["M3", "TT"]);
  assert.deepEqual(seq.map(e => e.notes), ["C4", "E4", "C4", "Gb4"]);
  const SYMBOLES = ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", "M6", "m7", "M7", "P8"];
  for (const b of blocs("interval_chart")) {
    for (const s of b.data.highlight || []) assert.ok(SYMBOLES.includes(s), `symbole inconnu ${s}`);
  }
});

test("degree_chart : chaque case de chaque tableau joue quelque chose de juste", () => {
  for (const b of blocs("degree_chart")) {
    const ctx = contexteDegres(b.data, b.caption);
    for (const box of b.data.boxes) {
      const r = degreeBoxToNotes(box, ctx);
      assert.ok(r, `${b.caption} : case ${box.top} muette`);
      assert.ok(r.notes.length >= 1 && r.notes.every(dansLaPlage));
    }
    const seq = sequenceDegres(b.data, b.caption);
    assert.equal(seq.length, b.data.boxes.length);
  }
  const [degres, triades, , familles, progression] = blocs("degree_chart");
  // « Les 7 degrés de Do majeur » (I … VII en majuscules) : les notes de la gamme.
  const ctx1 = contexteDegres(degres.data, degres.caption);
  assert.equal(ctx1.modeNote, true);
  assert.deepEqual(degres.data.boxes.map(x => degreeBoxToNotes(x, ctx1).notes[0]), ["C4", "D4", "E4", "F4", "G4", "A4", "B4"]);
  // Les 12 triades : exactement les notes écrites dans le libellé.
  for (const box of triades.data.boxes) {
    const pcs = new Set(degreeBoxToNotes(box, {}).notes.map(pc));
    const ecrits = new Set(box.label.split(/\s+–\s+/).map(pcDeNom));
    assert.deepEqual([...pcs].sort((a, z) => a - z), [...ecrits].sort((a, z) => a - z), box.label);
  }
  // Les familles en Do : ii = Ré mineur, vii° = Si diminué.
  const ctx4 = contexteDegres(familles.data, familles.caption);
  const pcsDe = (top) => [...new Set(degreeBoxToNotes(familles.data.boxes.find(x => x.top === top), ctx4).notes.map(pc))].sort((a, z) => a - z);
  assert.deepEqual(pcsDe("ii"), [2, 5, 9]);
  assert.deepEqual(pcsDe("vii°"), [2, 5, 11]);
  // I – V – vi – IV : Do, Sol, La mineur, Fa — les fondamentales à la basse.
  const ctx5 = contexteDegres(progression.data, progression.caption);
  assert.deepEqual(progression.data.boxes.map(x => pc(degreeBoxToNotes(x, ctx5).notes[0])), [0, 7, 9, 5]);
});

test("circle_of_fifths : les 24 tonalités jouent leur accord de tonique", () => {
  const MAJ = ["Do", "Sol", "Ré", "La", "Mi", "Si", "Fa#", "Réb", "Lab", "Mib", "Sib", "Fa"];
  const MIN = ["Lam", "Mim", "Sim", "Fa#m", "Do#m", "Sol#m", "Ré#m", "Sibm", "Fam", "Dom", "Solm", "Rém"];
  MAJ.forEach((nom, i) => {
    const notes = accordDuCercle(nom);
    const r = (i * 7) % 12;
    assert.equal(pc(notes[0]), r, nom);
    assert.deepEqual([...new Set(notes.map(pc))].sort((a, z) => a - z), [r, (r + 4) % 12, (r + 7) % 12].sort((a, z) => a - z), nom);
  });
  MIN.forEach((nom, i) => {
    const notes = accordDuCercle(nom);
    const r = (i * 7 + 9) % 12;
    assert.deepEqual([...new Set(notes.map(pc))].sort((a, z) => a - z), [r, (r + 3) % 12, (r + 7) % 12].sort((a, z) => a - z), nom);
  });
  for (const b of blocs("circle_of_fifths")) for (const h of b.data.highlight) assert.ok(accordDuCercle(h), h);
});

test("voicingAccord : basse dans le registre Mi2–Ré#3, notes croissantes, dans la plage", () => {
  assert.deepEqual(voicingAccord(0, [0, 4, 7]), ["C3", "G3", "C4", "E4", "G4"]);
  for (let r = 0; r < 12; r++) {
    for (const iv of Object.values(CHORD_TYPES).map(c => c.intervals)) {
      const v = voicingAccord(r, iv);
      const m = v.map(noteVersMidi);
      assert.ok(m[0] >= 40 && m[0] <= 51);
      assert.ok(m.every((x, i) => i === 0 || x > m[i - 1]));
      assert.ok(v.every(dansLaPlage));
    }
  }
});
