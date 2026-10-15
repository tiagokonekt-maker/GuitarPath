// Groply — test/jam-styles.test.mjs
// Les quatre styles ajoutés à la Jam (rock, jazz swing, bossa nova, ballade
// pop) : packs bien formés, swing uniquement là où il le faut, basse et
// accompagnement tirés du pack (bassStyle / compStyle), grilles et
// orthographe des accords.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "fs";
import { packSwing, companionSwing, swingBeat, stepPosition, parseGrid } from "../src/jam/music/groove.js";
import { generateDrumBar, DRUM_ALIASES } from "../src/jam/generators/drums.js";
import { createPlanner, createDirector } from "../src/jam/arrangement/arranger.js";
import { generateBassBar, BASS_APPROACHES } from "../src/music/walkingBass.js";
import { createComper, resolveCompStyle, COMP_STYLES } from "../src/music/compRhythm.js";
import { PACK_ID_PAR_STYLE, packPourStyle, bassStylePour, compStylePour, ambiancePour } from "../src/jam/styles.js";
import { getVoicedChord, getBassPattern, getStyle, nomAccord, notesAccord } from "../src/screens/jam/harmonie.js";
import { makeContexts, appliquerChoix, feelLabel } from "../src/screens/jam/contextes.js";
import { SCALES } from "../src/fretboardUtils.js";

const lire = (id) => JSON.parse(readFileSync(new URL(`../src/jam/packs/${id}.json`, import.meta.url)));
const PACKS = ["blues-shuffle", "funk-16", "rock-8", "jazz-swing", "bossa-nova", "ballade-pop"].map(lire);
const P = Object.fromEntries(PACKS.map(p => [p.id, p]));
const NOUVEAUX = ["rock-8", "jazz-swing", "bossa-nova", "ballade-pop"];
const VOIX = new Set(["kick", "snare", "hihat", "hihatOpen", "ride", "crash", "tomMid", "tomLow", ...Object.keys(DRUM_ALIASES)]);
const proche = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;

// Générateur pseudo-aléatoire reproductible.
function alea(seed = 0.123) {
  let s = seed;
  return () => { s = (s * 9301 + 0.49297) % 1; return s; };
}
const pc = (midi) => ((midi % 12) + 12) % 12;
const PC = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
const midiDeTone = (n) => {
  const m = /^([A-G])(b|#)?(-?\d)$/.exec(n);
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === "b" ? -1 : m[2] === "#" ? 1 : 0);
  return base + 12 * (Number(m[3]) + 1);
};

// ── Packs ────────────────────────────────────────────────────────────────

test("packs : champs requis, grilles lisibles, voix connues", () => {
  for (const id of NOUVEAUX) {
    const p = P[id];
    assert.equal(p.id, id);
    assert.ok(p.name && p.tempoRange?.length === 2, `${id} : nom et tempo`);
    assert.ok(p.defaultTempo >= p.tempoRange[0] && p.defaultTempo <= p.tempoRange[1], `${id} : tempo par défaut dans la plage`);
    assert.ok(p.drumPatterns.length >= 2 && p.fills.length >= 1, `${id} : motifs et fills`);
    for (const motif of [...p.drumPatterns, ...p.fills]) {
      const nBars = motif.bars ?? 1;
      for (const [voix, grille] of Object.entries(motif.grid)) {
        assert.ok(VOIX.has(voix), `${id}/${motif.id} : voix inconnue ${voix}`);
        assert.ok(/^[Xxo.O]+$/.test(grille), `${id}/${motif.id}/${voix} : symboles`);
        assert.equal(grille.length % nBars, 0, `${id}/${motif.id}/${voix} : découpable en ${nBars} mesures`);
        assert.ok([4, 8, 12, 16].includes(grille.length / nBars), `${id}/${motif.id}/${voix} : subdivision ${grille.length / nBars}`);
        assert.ok(parseGrid(grille).length > 0);
      }
    }
    assert.ok(BASS_APPROACHES.includes(p.bassStyle.approach), `${id} : bassStyle.approach`);
    assert.ok(COMP_STYLES.includes(resolveCompStyle(p.compStyle.rhythm)), `${id} : compStyle.rhythm`);
  }
});

test("styles → packs : chaque style de la Jam a son pack", () => {
  for (const [style, id] of Object.entries(PACK_ID_PAR_STYLE)) {
    assert.equal(packPourStyle(style, PACKS)?.id, id, style);
  }
  assert.equal(packPourStyle("inconnu", PACKS), null);
  assert.equal(getStyle("rock"), "rock");
  assert.equal(getStyle("jazz_swing"), "jazz");
  assert.equal(getStyle("bossa"), "bossa");
  assert.equal(getStyle("ballade"), "ballade");
  assert.ok(ambiancePour("jazz").delay && !ambiancePour("rock").delay);
});

test("arrangeur : mesures valides et voix résolues vers des échantillons existants", () => {
  for (const id of NOUVEAUX) {
    const pack = P[id];
    const d = createDirector(pack);
    const plan = createPlanner({ baseEnergy: 3 });
    plan.ensurePlannedUpTo(130);
    for (let bar = 0; bar < 128; bar++) {
      const s = plan.sectionAt(bar);
      const dec = d.decideBar(bar, s, s.energy);
      assert.equal(dec.barIndex, bar);
      const evs = generateDrumBar(pack, dec, { barStartTime: 10, secPerBeat: 60 / pack.defaultTempo, beatsPerBar: 4, bpm: pack.defaultTempo, energy: s.energy });
      assert.ok(evs.length > 0, `${id} mesure ${bar} non vide`);
      for (const e of evs) {
        assert.ok(!(e.instrument in DRUM_ALIASES), `${id} : ${e.instrument} non résolu`);
        assert.ok(e.velocity > 0 && e.velocity <= 1);
        assert.ok(e.time > 10 - 0.05 && e.time < 10 + 4 * 60 / pack.defaultTempo + 0.05, `${id} : dans la mesure`);
      }
    }
  }
});

test("bossa : la clave se joue sur deux mesures (motif `bars: 2`)", () => {
  const pack = { ...P["bossa-nova"], humanize: { jitterMs: 0, velSigma: 0 } };
  const rim = (barIndex) => generateDrumBar(pack, { patternId: "bossa-shaker", ghostNotes: true, barIndex }, {
    barStartTime: 0, secPerBeat: 0.5, beatsPerBar: 4, bpm: 120, energy: 3,
  }).filter(e => e.articulation === "rim").map(e => Math.round(e.time / 0.25));
  // 3-2 : 1re mesure 1, &2, 4 — 2e mesure 2, &3 (en croches).
  assert.deepEqual(rim(0), [0, 3, 6]);
  assert.deepEqual(rim(1), [2, 5]);
  assert.deepEqual(rim(2), rim(0));
  // Cross-stick et shaker : nettement plus doux que la frappe d'origine.
  const evs = generateDrumBar(pack, { patternId: "bossa-shaker", ghostNotes: true, barIndex: 0 }, {
    barStartTime: 0, secPerBeat: 0.5, beatsPerBar: 4, bpm: 120, energy: 3,
  });
  assert.ok(evs.filter(e => e.articulation === "rim").every(e => e.instrument === "snare" && e.velocity < 0.5));
  assert.ok(evs.filter(e => e.articulation === "shaker").every(e => e.instrument === "hihat"));
});

test("jazz : la charleston au pied reste une charleston, même quand la ride entre", () => {
  const pack = { ...P["jazz-swing"], humanize: { jitterMs: 0, velSigma: 0 } };
  const evs = generateDrumBar(pack, { patternId: "spang-a-lang", ghostNotes: true, useRide: true, barIndex: 0 }, {
    barStartTime: 0, secPerBeat: 0.5, beatsPerBar: 4, bpm: 120, energy: 4,
  });
  const pied = evs.filter(e => e.articulation === "pedalHat");
  assert.equal(pied.length, 2);
  assert.ok(pied.every(e => e.instrument === "hihat"));
  assert.ok(proche(pied[0].time, 0.5) && proche(pied[1].time, 1.5), "2 et 4");
  assert.equal(evs.filter(e => e.instrument === "ride").length, 6, "spang-a-lang : 6 coups de ride");
});

// ── Swing ────────────────────────────────────────────────────────────────

test("swing : seulement le jazz ; rock, bossa et ballade restent droits", () => {
  for (const id of ["rock-8", "bossa-nova", "ballade-pop"]) {
    for (const bpm of [P[id].tempoRange[0], P[id].defaultTempo, P[id].tempoRange[1]]) {
      assert.equal(packSwing(P[id], bpm).ratio, 0.5, `${id} @${bpm}`);
      assert.equal(companionSwing(P[id], bpm).ratio, 0.5, `${id} compagnons @${bpm}`);
    }
  }
  const lent = packSwing(P["jazz-swing"], 100).ratio, rapide = packSwing(P["jazz-swing"], 200).ratio;
  assert.ok(lent > 0.6 && lent <= 2 / 3 + 1e-9, `jazz lent ternaire (${lent})`);
  assert.ok(rapide > 0.5 && rapide < lent, `jazz rapide moins swingué (${rapide})`);
  assert.equal(feelLabel(P["jazz-swing"]), "Swing (croches ternaires)");
  assert.equal(feelLabel(P["rock-8"]), "Binaire");
});

test("jazz : basse et accompagnement swinguent exactement avec la ride", () => {
  const pack = { ...P["jazz-swing"], humanize: { jitterMs: 0, velSigma: 0 } };
  for (const bpm of [110, 140, 190]) {
    const sw = companionSwing(pack, bpm);
    const tambour = packSwing(pack, bpm);
    assert.deepEqual(sw, tambour, "même swing que la grille");
    const spb = 60 / bpm;
    const evs = generateDrumBar(pack, { patternId: "spang-a-lang", ghostNotes: true }, {
      barStartTime: 0, secPerBeat: spb, beatsPerBar: 4, bpm, energy: 3,
    });
    // « a » du spang-a-lang (& du 2 et du 4) = croche faible swinguée.
    const rides = evs.filter(e => e.instrument === "ride").map(e => e.time / spb);
    for (const faible of [1.5, 3.5]) {
      const compagnon = swingBeat(faible, sw.ratio, sw.stepsPerBeat);
      assert.ok(rides.some(t => proche(t, compagnon, 1e-6)), `@${bpm} : croche ${faible} alignée (${compagnon})`);
      assert.ok(compagnon > faible + 0.04, `@${bpm} : vraiment swinguée`);
    }
  }
});

// ── Basse : le pack choisit le générateur ───────────────────────────────

test("basse : walking pour le jazz, croches rock pour le rock", () => {
  assert.equal(bassStylePour(P["jazz-swing"], "jazz").approach, "walking");
  assert.equal(bassStylePour(P["rock-8"], "rock").approach, "rootEighths");
  assert.equal(bassStylePour(P["bossa-nova"], "bossa").approach, "bossaRootFifth");
  assert.equal(bassStylePour(P["ballade-pop"], "ballade").approach, "sustainedRoots");
  assert.equal(bassStylePour(P["blues-shuffle"], "blues").approach, "shuffleWalk");
  assert.equal(bassStylePour(P["funk-16"], "funk").approach, "syncopated16");
  // Sans pack : comportement historique (walking blues ou jazz).
  assert.equal(bassStylePour(null, "blues12").approach, "shuffleWalk");
  assert.equal(bassStylePour(null, "jazz").approach, "walking");

  const rng = alea(0.31);
  for (let bar = 0; bar < 60; bar++) {
    // Jazz : une note par temps (+ croches de passage occasionnelles).
    const jazz = generateBassBar({ ...bassStylePour(P["jazz-swing"], "jazz"), rootName: "D", quality: "min7", nextRoot: "G", barIndex: bar, energy: 3, rng });
    for (const b of [0, 1, 2, 3]) assert.ok(jazz.some(n => n.beat === b && n.dur === "4n"), `jazz : noire sur ${b + 1}`);
    assert.ok(jazz.length <= 6);
    assert.equal(pc(jazz[0].midi) === PC.D || pc(jazz[0].midi) === PC.A, true, "jazz : fondamentale (ou quinte) sur le 1");

    // Rock : huit croches, fondamentale / quinte / octave (ou approche).
    const rock = generateBassBar({ ...bassStylePour(P["rock-8"], "rock"), rootName: "E", quality: "maj", nextRoot: "A", barIndex: bar, energy: 3, rng });
    assert.deepEqual(rock.map(n => n.beat), [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]);
    assert.ok(rock.every(n => n.dur === "8n"));
    assert.equal(pc(rock[0].midi), PC.E, "rock : fondamentale sur le 1");
    for (const n of rock) {
      const ok = [PC.E, PC.B].includes(pc(n.midi)) || (n.approach && [PC["G#"], PC["A#"]].includes(pc(n.midi)));
      assert.ok(ok, `rock : note ${n.midi} hors fondamentale/quinte/approche`);
    }
    assert.ok(rock.every(n => n.midi >= 28 && n.midi <= 48), "tessiture de basse");
  }
  // Rock calme : des noires.
  const calme = generateBassBar({ approach: "rootEighths", rootName: "A", quality: "maj", nextRoot: "A", energy: 2, rng });
  assert.deepEqual(calme.map(n => n.beat), [0, 1, 2, 3]);
});

test("basse : bossa fondamentale-quinte avec anticipation, ballade tenue", () => {
  const rng = alea(0.77);
  const bossa = generateBassBar({ approach: "bossaRootFifth", rootName: "C", quality: "maj7", nextRoot: "D", energy: 3, rng });
  assert.deepEqual(bossa.map(n => n.beat), [0, 1.5, 2, 3.5]);
  assert.equal(pc(bossa[0].midi), PC.C);
  assert.equal(pc(bossa[2].midi), PC.G, "quinte sur le 3");
  assert.equal(pc(bossa[3].midi), PC.D, "& du 4 : fondamentale de l'accord suivant");
  assert.ok(bossa[3].anticipate);
  const bossaFixe = generateBassBar({ approach: "bossaRootFifth", rootName: "C", quality: "maj7", nextRoot: "C", energy: 3, rng });
  assert.equal(pc(bossaFixe[3].midi), PC.G, "sans changement : la quinte");
  const m7b5 = generateBassBar({ approach: "bossaRootFifth", rootName: "B", quality: "min7b5", nextRoot: "E", energy: 3, rng });
  assert.equal(pc(m7b5[2].midi), PC.F, "m7b5 : quinte diminuée");

  const ronde = generateBassBar({ approach: "sustainedRoots", rootName: "G", quality: "maj", nextRoot: "D", energy: 1, rng });
  assert.equal(ronde.length, 1);
  assert.equal(ronde[0].dur, "1n");
  assert.equal(pc(ronde[0].midi), PC.G);
  const blanches = generateBassBar({ approach: "sustainedRoots", rootName: "G", quality: "maj", nextRoot: "D", energy: 3, rng });
  assert.deepEqual(blanches.map(n => [n.beat, n.dur]), [[0, "2n"], [2, "2n"]]);
});

test("basse : getBassPattern (harmonie) honore le bassStyle du pack", () => {
  const rock = getBassPattern("E", "maj", "rock", "A", 0, 3, bassStylePour(P["rock-8"], "rock"));
  assert.equal(rock.length, 8);
  assert.ok(rock.every(n => /^[A-G](b)?\d$/.test(n.note) && typeof n.beat === "number"));
  const jazz = getBassPattern("D", "min7", "jazz", "G", 0, 3, bassStylePour(P["jazz-swing"], "jazz"));
  assert.ok(jazz.length >= 4 && jazz.length <= 6);
  // Sans bassStyle : walking bass, comme avant.
  const historique = getBassPattern("A", "dom7", "blues", "D", 0, 3);
  assert.ok(historique.length >= 4);
});

// ── Accompagnement : le pack choisit le vocabulaire ──────────────────────

test("comping : rythme du pack résolu vers le bon vocabulaire", () => {
  assert.equal(resolveCompStyle(compStylePour(P["jazz-swing"], "jazz").rhythm), "jazz");
  assert.equal(resolveCompStyle(compStylePour(P["blues-shuffle"], "blues").rhythm), "blues");
  assert.equal(resolveCompStyle(compStylePour(P["rock-8"], "rock").rhythm), "rock8");
  assert.equal(resolveCompStyle(compStylePour(P["bossa-nova"], "bossa").rhythm), "bossa");
  assert.equal(resolveCompStyle(compStylePour(P["ballade-pop"], "ballade").rhythm), "arpeggio8");
  assert.equal(resolveCompStyle(compStylePour(P["funk-16"], "funk").rhythm), "chank16");
  assert.equal(resolveCompStyle("inconnu"), "jazz");
  assert.equal(compStylePour(P["rock-8"], "rock").voicing, "power");
  assert.ok(compStylePour(P["rock-8"], "rock").strumMs > 0, "rock : accords grattés");
  assert.equal(compStylePour(P["ballade-pop"], "ballade").floor, 48);
});

test("comping rock : croches courtes (étouffées), sur la grille de croches", () => {
  const c = createComper("rock8", alea(0.4));
  let croches = 0;
  for (let bar = 0; bar < 80; bar++) {
    const hits = c.nextBar(bar, 4);
    assert.ok(hits.length > 0);
    for (const h of hits) {
      assert.ok(proche(h.beat * 2, Math.round(h.beat * 2)), `croche (${h.beat})`);
      if (h.dur === "16n") croches++;
    }
  }
  assert.ok(croches > 80, "beaucoup de croches étouffées");
});

test("comping jazz : Charleston et Freddie Green au vocabulaire, coups brefs", () => {
  const c = createComper("jazzComp", alea(0.9));
  const vus = new Set();
  for (let bar = 0; bar < 200; bar++) {
    const hits = c.nextBar(bar, 3);
    vus.add(hits.map(h => h.beat).join(","));
    for (const h of hits) assert.ok(["8n", "4n", "2n"].includes(h.dur));
  }
  assert.ok(vus.has("0,1.5"), "Charleston (1, &2)");
  assert.ok(vus.has("0,1,2,3"), "Freddie Green (4 noires)");
});

test("comping bossa : la batida alterne ses deux mesures", () => {
  const c = createComper("bossa", alea(0.55));
  for (let bar = 0; bar < 40; bar++) {
    const beats = c.nextBar(bar, 3).map(h => h.beat);
    if (beats.length === 1) continue;   // respiration
    if (bar % 2 === 0) assert.ok(beats.includes(0), `mesure A (${bar}) : attaque sur le 1`);
    else assert.ok(beats.includes(0.5) && !beats.includes(0), `mesure B (${bar}) : syncope, pas de 1`);
  }
});

test("comping ballade : arpèges note à note en croches", () => {
  const c = createComper("arpeggio8", alea(0.21));
  let arpeges = 0;
  for (let bar = 0; bar < 40; bar++) {
    for (const h of c.nextBar(bar, 3)) {
      if (h.voice != null) { arpeges++; assert.ok(Number.isInteger(h.voice) && h.voice >= 0 && h.voice < 4); }
    }
  }
  assert.ok(arpeges > 150, `arpèges (${arpeges})`);
  // Calme : seulement les temps (les croches faibles disparaissent).
  const calme = createComper("arpeggio8", alea(0.5)).nextBar(1, 1);
  assert.ok(calme.every(h => Number.isInteger(h.beat)));
});

test("comping : le swing des compagnons ne s'applique qu'au jazz", () => {
  const rock = companionSwing(P["rock-8"], 120);
  for (const b of [0.5, 1.5, 3.5]) assert.equal(swingBeat(b, rock.ratio, rock.stepsPerBeat), b);
  const jazz = companionSwing(P["jazz-swing"], 120);
  assert.ok(swingBeat(1.5, jazz.ratio, jazz.stepsPerBeat) > 1.6);
  // Et la grille de la batterie rock reste droite elle aussi.
  assert.ok(proche(stepPosition(1, 8, packSwing(P["rock-8"], 120).ratio) * 4, 0.5));
});

// ── Voicings ─────────────────────────────────────────────────────────────

test("voicings : power chord, accord écarté, sans fondamentale, 7(9)", () => {
  const power = getVoicedChord("E", "maj", "rock", { voicing: "power" }).map(midiDeTone);
  assert.deepEqual(power.map(pc), [PC.E, PC.B, PC.E]);
  assert.ok(power[0] >= 52, "au-dessus de la basse");
  const spread = getVoicedChord("C", "maj", "ballade", { voicing: "spread", floor: 48 }).map(midiDeTone);
  assert.deepEqual(spread.map(pc), [PC.C, PC.G, PC.C, PC.E]);
  assert.ok(spread[0] >= 48 && spread[0] < 60);
  const sansFond = getVoicedChord("D", "min7", "jazz").map(midiDeTone).map(pc);
  assert.ok(!sansFond.includes(PC.D) && sansFond.includes(PC.F) && sansFond.includes(PC.C));
  const neuf = getVoicedChord("G", "dom9", "bossa").map(midiDeTone).map(pc);
  assert.deepEqual([...neuf].sort((a, b) => a - b), [PC.F, PC.A, PC.B].sort((a, b) => a - b));
  const shell = getVoicedChord("G", "dom7", "jazz", { voicing: "shell" }).map(midiDeTone).map(pc);
  assert.deepEqual(shell, [PC.B, PC.F]);
});

// ── Contextes (interface) ───────────────────────────────────────────────

const C = new Proxy({}, { get: (_, k) => `#${String(k)}` });
const CONTEXTES = makeContexts(C);

test("contextes : les quatre styles, noms français, descriptions, grilles", () => {
  const attendus = { rock: "Rock", jazz_swing: "Jazz swing", bossa: "Bossa nova", ballade: "Ballade pop" };
  for (const [id, label] of Object.entries(attendus)) {
    const c = CONTEXTES.find(x => x.id === id);
    assert.ok(c, id);
    assert.equal(c.label, label);
    assert.ok(c.desc.length > 20 && c.desc.length < 160, `${id} : description courte`);
    assert.ok(c.grilles.length >= 3, `${id} : plusieurs grilles`);
    assert.ok(c.gammes.every(g => SCALES[g]), `${id} : gammes connues`);
    assert.ok(SCALES[c.scale]);
    assert.ok(c.tonalites.every(t => t in PC));
    assert.deepEqual(c.chords, c.grilles[0].chords, "grille par défaut");
    const pack = packPourStyle(getStyle(id), PACKS);
    assert.ok(c.bpm >= pack.tempoRange[0] && c.bpm <= pack.tempoRange[1], `${id} : tempo dans la plage du pack`);
    for (const g of c.grilles) {
      assert.ok(g.chords.length >= 2);
      for (const ch of g.chords) {
        assert.ok(Number.isInteger(ch.degree) && ch.degree >= 0 && ch.degree < 12);
        assert.ok(ch.bars >= 1);
        assert.ok(notesAccord("C", ch).length >= 3, `${id}/${g.id} : qualité ${ch.quality}`);
      }
      if (g.scale) assert.ok(SCALES[g.scale]);
    }
  }
  // Les contextes historiques restent là, intacts.
  for (const id of ["blues_minor", "blues_12", "jazz_251", "modal_dorian", "modal_mixo"]) assert.ok(CONTEXTES.find(x => x.id === id));
});

test("contextes : grille et gamme choisies", () => {
  const rock = CONTEXTES.find(x => x.id === "rock");
  assert.equal(appliquerChoix(rock, null, null).grilleId, "I-IV-V");
  const vi = appliquerChoix(rock, "vi-IV-I-V", null);
  assert.equal(vi.chords[0].degree, 9);
  assert.equal(vi.scale, "pentatonic_major", "la grille propose sa gamme");
  assert.equal(appliquerChoix(rock, "vi-IV-I-V", "pentatonic_minor").scale, "pentatonic_minor", "le choix explicite l'emporte");
  const blues = CONTEXTES.find(x => x.id === "blues_minor");
  assert.deepEqual(appliquerChoix(blues, null, null).chords, blues.chords, "contexte sans grilles : inchangé");
});

test("orthographe : accords nommés selon la tonalité", () => {
  const ctx = (id, grille, gamme) => appliquerChoix(CONTEXTES.find(x => x.id === id), grille, gamme);
  const noms = (c, root) => c.chords.map(ch => nomAccord(root, ch, c.scale));
  // Rock en Fa : le ♭VII est Mib, pas Ré#.
  assert.deepEqual(noms(ctx("rock", "I-bVII-IV"), "F"), ["Fa", "Mib", "Sib"]);
  // Jazz en Sib (A# en interne) : Dom7 – Fa7 – Sibmaj7 – Sol7.
  assert.deepEqual(noms(ctx("jazz_swing", "251-majeur"), "A#"), ["Dom7", "Fa7", "Sibmaj7", "Sol7"]);
  // ii–V–i mineur en La : Sim7b5 – Mi7 – Lam7.
  assert.deepEqual(noms(ctx("jazz_swing", "251-mineur"), "A"), ["Sim7b5", "Mi7", "Lam7"]);
  // Bossa en Fa : Famaj7 – Solm7 – Do9.
  assert.deepEqual(noms(ctx("bossa", "I-ii-V"), "F"), ["Famaj7", "Solm7", "Do9"]);
  // Ballade en Ré : Ré – La – Sim – Sol.
  assert.deepEqual(noms(ctx("ballade", "I-V-vi-IV"), "D"), ["Ré", "La", "Sim", "Sol"]);
});
