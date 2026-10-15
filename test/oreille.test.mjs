// Groply — test/oreille.test.mjs
// Entraînement de l'oreille (src/store/oreille.js + audioEngine) : ce qui
// sonne correspond à la réponse attendue, la dictée reste dans la gamme et
// dans la tessiture, le vivier progresse comme annoncé, et l'orthographe des
// suites suit la tonalité. Sans audio : Tone.js n'est chargé qu'à la lecture.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  INTERVALLES, ORDRE_INTERVALLES, QUALITES, ORDRE_QUALITES, PROGRESSIONS, ORDRE_PROGRESSIONS, DEGRES_TONALITE, ORDRE_DEGRES,
  NIVEAUX_DICTEE, ECHELLES, TONALITES_MAJ, TONALITES_MIN,
  tirerIntervalle, tirerAccord, tirerAccordEnTonalite, tirerProgression, tirerDictee, touchesDictee,
  poolAdaptatif, choisirItem, niveauProgressif, estAcquis, cleItem, precision, nomTonalite, romainDe,
} from "../src/store/oreille.js";
import { generateEarTrainingQuestion, makeEarQuizQuestion, dureeMelodieMs, RELEASE } from "../src/audioEngine.js";

function rng(graine) { let x = graine >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
const TONE = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
const midi = (t) => { const m = /^([A-G]#?)(-?\d)$/.exec(t); return TONE[m[1]] + 12 * (+m[2] + 1); };
const MIDI_MIN = 36, MIDI_MAX = 83;   // plage échantillonnée (C2 → B5)
const dansLaPlage = (ns) => ns.every(n => n >= MIDI_MIN && n <= MIDI_MAX);
// Oracle indépendant de lecture des noms français.
const LET = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"], NAT = [0, 2, 4, 5, 7, 9, 11];
function lire(n) {
  const m = /^(Do|Ré|Mi|Fa|Sol|La|Si)(#{1,2}|b{1,2})?/.exec(n); if (!m) return null;
  const l = LET.indexOf(m[1]), alt = m[2] || "", acc = alt.startsWith("#") ? alt.length : -alt.length;
  return { l, acc, pc: ((NAT[l] + acc) % 12 + 12) % 12, reste: n.slice(m[0].length) };
}

// ── Intervalles ────────────────────────────────────────────────────────────
test("les 12 intervalles : écart exact, dans les 3 modes, dans la plage échantillonnée", () => {
  assert.deepEqual(Object.keys(INTERVALLES).map(Number), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.deepEqual([...ORDRE_INTERVALLES].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const r = rng(1);
  for (const dt of ORDRE_INTERVALLES) for (const mode of ["ascending", "descending", "harmonic"]) for (let i = 0; i < 30; i++) {
    const t = tirerIntervalle(r, dt, mode);
    assert.equal(t.midi[1] - t.midi[0], dt);
    assert.ok(dansLaPlage(t.midi));
  }
});

test("question d'intervalle de l'écran : la réponse est ce qui sonne, quel que soit le sens", () => {
  const r = rng(2);
  for (const sens of ["ascending", "descending", "harmonic", "mix"]) for (let i = 0; i < 100; i++) {
    const pool = ORDRE_INTERVALLES.slice(0, 3 + (i % 10));
    const q = generateEarTrainingQuestion("interval", { pool, sens, toutesOptions: true, rng: r });
    assert.equal(midi(q.note2) - midi(q.note1), q.answer);
    assert.ok(pool.includes(q.answer));
    assert.deepEqual(q.options.map(o => o.key).sort((a, b) => a - b), [...pool].sort((a, b) => a - b), "une option par élément du vivier");
    assert.ok(q.options.every(o => o.semitones === o.key && o.label === INTERVALLES[o.key].nom));
    if (sens !== "mix") assert.equal(q.mode, sens);
    const attendu = q.mode === "harmonic" ? 1000 : 650 + 500;
    assert.equal(q.durationMs, attendu + Math.round(RELEASE * 1000), "durée = calendrier réel + relâchement");
  }
});

test("les repères mnémotechniques restent génériques (aucune citation entre guillemets de plus de 2 mots)", () => {
  for (const { repere } of Object.values(INTERVALLES)) {
    const cites = repere.match(/«([^»]*)»/g) || [];
    for (const c of cites) assert.ok(c.split(/\s+/).filter(Boolean).length <= 4, c);
  }
});

// ── Qualités d'accord ─────────────────────────────────────────────────────
const ATTENDU = { maj: [0, 4, 7], min: [0, 3, 7], aug: [0, 4, 8], dim: [0, 3, 6], dom7: [0, 4, 7, 10], min7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], sus4: [0, 5, 7], sus2: [0, 2, 7], min7b5: [0, 3, 6, 10], dim7: [0, 3, 6, 9] };
test("chaque qualité d'accord sonne avec ses intervalles exacts, fondamentale à la basse", () => {
  const r = rng(3);
  for (const q of Object.keys(QUALITES)) for (let i = 0; i < 30; i++) {
    const a = tirerAccord(r, q);
    assert.deepEqual(a.midi.slice(0, -1).map(n => n - a.midi[0]), ATTENDU[q], q);
    assert.equal(a.midi.at(-1) - a.midi[0], 12, "fondamentale doublée à l'octave");
    assert.ok(dansLaPlage(a.midi));
  }
  for (const q of ORDRE_QUALITES) assert.ok(QUALITES[q], q);
  assert.deepEqual(ORDRE_QUALITES.slice(0, 2), ["maj", "min"], "on commence par majeur / mineur");
});

test("question de qualité : notes jouées = qualité attendue, arpège disponible", () => {
  const r = rng(4);
  for (let i = 0; i < 200; i++) {
    const q = generateEarTrainingQuestion("chord_quality", { pool: ORDRE_QUALITES, toutesOptions: true, rng: r });
    const ns = q.notes.map(midi);
    assert.deepEqual(ns.slice(0, -1).map(n => n - ns[0]), ATTENDU[q.answer]);
    assert.equal(q.options.length, ORDRE_QUALITES.length);
    assert.equal(typeof q.playArpege, "function");
  }
});

// ── Accord en tonalité (ancien « accord complet ») ────────────────────────
test("accord en tonalité : la tonique de référence est jouée, la cible est bien le degré demandé", () => {
  const r = rng(5);
  for (const degre of ORDRE_DEGRES) for (const t of TONALITES_MAJ) {
    const a = tirerAccordEnTonalite(r, degre, t);
    const { semi, type } = DEGRES_TONALITE[degre];
    assert.equal(a.reference[0] % 12, t, "référence = accord de la tonique");
    assert.deepEqual(a.reference.slice(0, 3).map(n => n - a.reference[0]), [0, 4, 7]);
    assert.equal(((a.midi[0] - a.reference[0]) % 12 + 12) % 12, semi, `${degre} en ${t}`);
    assert.deepEqual(a.midi.slice(0, -1).map(n => n - a.midi[0]), ATTENDU[type]);
    assert.ok(dansLaPlage([...a.reference, ...a.midi]));
    // Orthographe : la fondamentale porte la lettre du degré dans la gamme.
    const n = lire(a.nom), tn = lire(nomTonalite(t));
    assert.equal(n.pc, (t + semi) % 12, a.nom);
    assert.equal(n.l, (tn.l + [0, 2, 4, 5, 7, 9, 11].indexOf(semi)) % 7, `${a.nom} en ${nomTonalite(t)}`);
  }
});

test("l'écran ne demande plus l'oreille absolue : la question annonce la tonalité et joue la tonique d'abord", () => {
  const q = generateEarTrainingQuestion("chord_full", { pool: ORDRE_DEGRES, toutesOptions: true, rng: rng(6) });
  assert.match(q.consigne, /Tonalité : \S+ majeur/);
  assert.equal(typeof q.playReference, "function");
  assert.ok(q.options.some(o => o.key === q.answer));
  assert.ok(q.options.every(o => /\((I|IV|V|vi|ii|iii|V7|vii°)\)$/.test(o.label)), "nom de l'accord + degré");
});

// ── Suites d'accords ──────────────────────────────────────────────────────
const SEMI = { maj: { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 }, min: { I: 0, II: 2, III: 3, IV: 5, V: 7, VI: 8, VII: 10 } };
test("suites : chaque accord joué correspond à son chiffre romain (majeur et mineur)", () => {
  const r = rng(7);
  for (const cle of ORDRE_PROGRESSIONS) for (let i = 0; i < 20; i++) {
    const p = tirerProgression(r, cle);
    const table = PROGRESSIONS[cle].mineur ? SEMI.min : SEMI.maj;
    romainDe(cle).split(" – ").forEach((rom, k) => {
      const a = p.accords[k];
      assert.equal(((a[0] - p.accords[0][0]) % 12 + 12) % 12, table[rom.toUpperCase()], `${cle} : ${rom}`);
      assert.deepEqual(a.slice(0, 3).map(n => n - a[0]), rom === rom.toUpperCase() ? [0, 4, 7] : [0, 3, 7], `${cle} : ${rom}`);
    });
    assert.ok(dansLaPlage(p.accords.flat()));
    assert.equal(p.accords.length, 4, "toutes les suites ont 4 accords : compter ne suffit jamais");
  }
  for (const k of ["i-iv-v-i", "i-VI-III-VII", "i-iv-V-i"]) assert.ok(PROGRESSIONS[k]?.mineur, `suite mineure ${k}`);
});

test("orthographe des suites dans la tonalité : Dom – Lab – Mib – Sib, pas de dièse en Do mineur", () => {
  assert.deepEqual(tirerProgression(rng(1), "i-VI-III-VII", 0).noms, ["Dom", "Lab", "Mib", "Sib"]);
  assert.deepEqual(tirerProgression(rng(1), "i-iv-V-i", 9).noms, ["Lam", "Rém", "Mi", "Lam"], "mineur harmonique : V majeur");
  assert.deepEqual(tirerProgression(rng(1), "I-V-vi-IV", 5).noms, ["Fa", "Do", "Rém", "Sib"]);
  assert.deepEqual(tirerProgression(rng(1), "I-vi-ii-V", 3).noms, ["Mib", "Dom", "Fam", "Sib"]);
  assert.equal(tirerProgression(rng(1), "i-VI-VII-i", 5).tonalite, "Fa mineur");
  // Aucune tonalité de la liste ne produit de dièse en tonalité bémolisée (ni l'inverse).
  for (const cle of ORDRE_PROGRESSIONS) for (const t of PROGRESSIONS[cle].mineur ? TONALITES_MIN : TONALITES_MAJ) {
    const noms = tirerProgression(rng(1), cle, t).noms.join(" ");
    assert.ok(!(noms.includes("#") && /[a-zé]b/.test(noms.replace(/m7♭5/g, ""))), `${cle} en ${t} : ${noms}`);
  }
});

test("question de suite : options en chiffres romains, tonalité et accords nommés dans la correction", () => {
  const r = rng(8);
  for (let i = 0; i < 100; i++) {
    const q = generateEarTrainingQuestion("progression", { pool: ORDRE_PROGRESSIONS, toutesOptions: true, rng: r });
    assert.equal(q.options.find(o => o.key === q.answer).label, q.roman);
    assert.ok(q.options.every(o => /^[ivIV]+°?( – [ivIV]+°?)+$/.test(o.label)));
    assert.match(q.repere, /^En \S+ (majeur|mineur) : /);
    assert.equal(q.accords.length, 4);
  }
});

// ── Dictée mélodique ──────────────────────────────────────────────────────
test("dictée : part de la tonique, reste dans la gamme et dans la tessiture du niveau", () => {
  const r = rng(9);
  NIVEAUX_DICTEE.forEach((p, idx) => {
    const niveau = idx + 1;
    for (let i = 0; i < 400; i++) {
      const d = tirerDictee(r, niveau);
      const ech = p.mineur ? ECHELLES.mineur : ECHELLES.majeur;
      assert.equal(d.degres.length, p.n);
      assert.equal(d.degres[0], 0, "commence sur la tonique");
      assert.equal(d.midi[0] % 12, d.toniquePc);
      d.midi.forEach((m, k) => {
        const ecart = m - d.toniqueMidi;
        assert.ok(ecart >= 0 && ecart <= ech[p.degreMax], `niveau ${niveau} : hors tessiture`);
        assert.ok(ech.includes(ecart), `niveau ${niveau} : ${ecart} hors gamme`);
        if (k) {
          assert.notEqual(d.degres[k], d.degres[k - 1], "pas de note répétée");
          assert.ok(Math.abs(d.degres[k] - d.degres[k - 1]) <= p.sautMax, "saut trop grand pour le niveau");
        }
      });
      assert.ok(dansLaPlage([...d.midi, ...d.reference]));
      assert.equal(d.reference[0] % 12, d.toniquePc);
      assert.deepEqual(d.reference.slice(0, 3).map(n => n - d.reference[0]), p.mineur ? [0, 3, 7] : [0, 4, 7]);
      assert.ok((p.mineur ? TONALITES_MIN : TONALITES_MAJ).includes(d.toniquePc));
    }
  });
});

test("dictée : touches nommées dans la tonalité (une lettre par degré), octave distincte", () => {
  for (const t of TONALITES_MAJ) {
    const touches = touchesDictee(t, 4), tn = lire(nomTonalite(t));
    touches.forEach((k, d) => {
      const n = lire(k.nom);
      assert.equal(n.pc, (t + ECHELLES.majeur[d]) % 12, k.nom);
      assert.equal(n.l, (tn.l + d) % 7, `${k.nom} en ${nomTonalite(t)}`);
    });
    assert.match(touches[7].nom, / aigu$/);
    assert.equal(new Set(touches.map(k => k.nom)).size, touches.length);
  }
  assert.deepEqual(touchesDictee(10, 4).map(k => k.nom).slice(0, 7), ["Sib", "Do", "Ré", "Mib", "Fa", "Sol", "La"]);
  assert.deepEqual(touchesDictee(4, 5).map(k => k.nom).slice(0, 7), ["Mi", "Fa#", "Sol", "La", "Si", "Do", "Ré"], "Mi mineur");
  assert.equal(touchesDictee(0, 1).length, 3, "niveau 1 : trois touches seulement");
});

test("question de dictée : réponse = degrés joués, durée = calendrier de lecture", () => {
  const q = generateEarTrainingQuestion("dictation", { niveau: 3, rng: rng(10) });
  assert.equal(q.answer, q.degres.join("-"));
  assert.deepEqual(q.notes.map(midi), q.midi);
  assert.equal(q.durationMs, dureeMelodieMs(q.notes.length, true));
  assert.equal(dureeMelodieMs(4, true), Math.round((1.6 + 3 * 0.7 + 0.6) * 1000) + Math.round(RELEASE * 1000));
});

// ── Vivier progressif ─────────────────────────────────────────────────────
const cle = (x) => cleItem("interval", x);
const vu = (streak, attempts = streak, successes = streak) => ({ attempts, successes, streak });
test("vivier : 3 intervalles contrastés au départ, un de plus quand tout est acquis", () => {
  assert.deepEqual(poolAdaptatif(ORDRE_INTERVALLES, 3, {}, cle).pool, [12, 7, 4]);
  const h = { [cle(12)]: vu(2), [cle(7)]: vu(3), [cle(4)]: vu(1) };
  assert.deepEqual(poolAdaptatif(ORDRE_INTERVALLES, 3, h, cle).pool, [12, 7, 4], "tierce majeure pas encore acquise");
  h[cle(4)] = vu(2);
  const p = poolAdaptatif(ORDRE_INTERVALLES, 3, h, cle);
  assert.deepEqual(p.pool, [12, 7, 4, 5]);
  assert.equal(p.nouveau, 5, "la quarte entre");
});

test("vivier : ce qui a été travaillé n'est jamais retiré, même après une erreur", () => {
  const h = { [cle(12)]: vu(2), [cle(7)]: vu(0, 5, 3), [cle(4)]: vu(2), [cle(5)]: vu(1) };
  assert.deepEqual(poolAdaptatif(ORDRE_INTERVALLES, 3, h, cle).pool, [12, 7, 4, 5]);
  const tout = Object.fromEntries(ORDRE_INTERVALLES.map(x => [cle(x), vu(3)]));
  const p = poolAdaptatif(ORDRE_INTERVALLES, 3, tout, cle);
  assert.equal(p.pool.length, 12); assert.equal(p.nouveau, null);
  assert.ok(estAcquis(vu(2)) && !estAcquis(vu(1)) && !estAcquis(undefined));
});

test("tirage pondéré : jamais deux fois de suite le même, et le raté revient plus souvent", () => {
  const r = rng(12), pool = [12, 7, 4];
  for (let i = 0; i < 200; i++) assert.notEqual(choisirItem(r, pool, {}, cle, 7), 7);
  const h = { [cle(12)]: vu(5), [cle(7)]: vu(5), [cle(4)]: vu(0, 6, 1) };
  const compte = { 12: 0, 7: 0, 4: 0 };
  for (let i = 0; i < 3000; i++) compte[choisirItem(r, pool, h, cle)]++;
  assert.ok(compte[4] > compte[12] * 2 && compte[4] > compte[7] * 2, JSON.stringify(compte));
  assert.equal(choisirItem(r, [5], {}, cle, 5), 5, "un vivier d'un seul élément reste jouable");
});

test("niveau de dictée : monte avec les réussites, redescend d'un cran après une erreur", () => {
  assert.equal(niveauProgressif(undefined), 1);
  assert.equal(niveauProgressif({ attempts: 3, successes: 3, streak: 3 }), 2);
  assert.equal(niveauProgressif({ attempts: 20, successes: 18, streak: 4 }), 5);
  assert.equal(niveauProgressif({ attempts: 21, successes: 18, streak: 0 }), 4);
  assert.equal(niveauProgressif({ attempts: 1, successes: 0, streak: 0 }), 1);
  assert.equal(precision({ attempts: 4, successes: 3 }), 75);
  assert.equal(precision(undefined), null);
});

// ── Rétrocompatibilité ────────────────────────────────────────────────────
test("sans options, l'API historique ne change pas (quiz : 4 options, sens montant)", () => {
  for (let i = 0; i < 50; i++) {
    const q = generateEarTrainingQuestion("interval");
    assert.equal(q.options.length, 4); assert.equal(q.mode, "ascending");
    assert.ok([3, 4, 5, 7, 9, 10, 12].includes(q.answer));
    assert.ok(q.options.some(o => o.semitones === q.answer));
  }
  const iq = makeEarQuizQuestion("interval"), cq = makeEarQuizQuestion("chord_quality");
  assert.equal(iq.o.length, 4); assert.ok(iq.a >= 0); assert.equal(typeof iq.play, "function");
  assert.equal(cq.o.length, 4); assert.ok(cq.a >= 0);
  assert.equal(generateEarTrainingQuestion("inconnu"), null);
});
