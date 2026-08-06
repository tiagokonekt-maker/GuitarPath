// Groply — test/engine.test.mjs
// Les couches 1 à 5 du moteur sont du JavaScript pur : on peut donc vérifier
// que le moteur est musicalement correct SANS écouter une seule note.
// C'est ce qui rend le projet maîtrisable.

import { readFileSync } from "fs";
import { parseGrid, stepPosition, swingRatio, humanize, gaussian } from "../src/jam/music/groove.js";
import { createPlanner, createDirector } from "../src/jam/arrangement/arranger.js";
import { generateDrumBar } from "../src/jam/generators/drums.js";

const pack = JSON.parse(readFileSync(new URL("../src/jam/packs/blues-shuffle.json", import.meta.url)));

let pass = 0, fail = 0;
const ok  = (cond, label) => { if (cond) { pass++; } else { fail++; console.log("  ECHEC :", label); } };
const section = (t) => console.log("\n=== " + t + " ===");

// ─────────────────────────────────────────────────────────────────────────
section("CARTE DE TEMPO — dérive sur session longue");
// Reproduction de la logique de clock.js (pas d'AudioContext en Node).
function tempoMap(startTime, bpm) {
  const segs = [{ time: startTime, beat: 0, bpm }];
  const segAt = t => { let s = segs[0]; for (const x of segs) { if (x.time <= t) s = x; else break; } return s; };
  return {
    setBpmAt(t, b) { const beat = this.beatAt(t); segs.push({ time: t, beat, bpm: b }); },
    beatAt(t) { const s = segAt(t); return s.beat + (t - s.time) * s.bpm / 60; },
    timeAt(beat) { let s = segs[0]; for (const x of segs) { if (x.beat <= beat) s = x; else break; }
                   return s.time + (beat - s.beat) * 60 / s.bpm; },
  };
}
{
  const tm = tempoMap(0, 90);
  // 30 minutes à 90 BPM = 2700 noires
  const t = tm.timeAt(2700);
  ok(Math.abs(t - 1800) < 1e-9, `30 min : attendu 1800s, obtenu ${t}`);
  // Aller-retour position -> temps -> position
  const back = tm.beatAt(t);
  ok(Math.abs(back - 2700) < 1e-9, `aller-retour sans dérive (${back})`);

  // Avec 3 changements de tempo
  const tm2 = tempoMap(0, 90);
  tm2.setBpmAt(60, 120);
  tm2.setBpmAt(120, 75);
  tm2.setBpmAt(200, 100);
  for (const probe of [30, 90, 150, 400, 1500]) {
    const b = tm2.beatAt(probe);
    const t2 = tm2.timeAt(b);
    ok(Math.abs(t2 - probe) < 1e-6, `aller-retour après changements de tempo à t=${probe} (écart ${Math.abs(t2-probe)})`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
section("GRILLES");
{
  const hits = parseGrid("x..x..x..x..");
  ok(hits.length === 4, `4 frappes attendues, ${hits.length} obtenues`);
  ok(hits.every(h => h.stepsPerBar === 12), "subdivision déduite de la longueur");
  ok(parseGrid("....").length === 0, "grille vide = aucune frappe");
  ok(parseGrid("XxoO").length === 4, "les 4 symboles sont reconnus");
  const vels = parseGrid("Xxo").map(h => h.velocity);
  ok(vels[0] > vels[1] && vels[1] > vels[2], "accent > normal > ghost");
  ok(parseGrid("x?z.").length === 1, "symbole inconnu ignoré sans erreur");
}

// ─────────────────────────────────────────────────────────────────────────
section("SWING dépendant du tempo");
{
  ok(swingRatio(0, 90) === 0.5, "swing 0 = binaire strict");
  const slow = swingRatio(1, 70), fast = swingRatio(1, 190);
  ok(slow > fast, `plus de swing en tempo lent (${slow.toFixed(3)} > ${fast.toFixed(3)})`);
  ok(slow <= 2/3 + 1e-9, `jamais au-delà du ternaire (${slow.toFixed(3)})`);
  ok(fast >= 0.5, `jamais en deçà du binaire (${fast.toFixed(3)})`);
}

// ─────────────────────────────────────────────────────────────────────────
section("POSITION DES PAS");
{
  // Sans swing, les 4 temps d'une grille en croches
  const p0 = stepPosition(0, 8, 0.5);
  const p2 = stepPosition(2, 8, 0.5);
  ok(Math.abs(p0 - 0) < 1e-9, "pas 0 au début de mesure");
  ok(Math.abs(p2 - 0.25) < 1e-9, `pas 2 sur le temps 2 (${p2})`);
  // Avec swing, la croche faible est repoussée
  const straight = stepPosition(1, 8, 0.5);
  const swung    = stepPosition(1, 8, 0.66);
  ok(swung > straight, `swing repousse la croche faible (${swung.toFixed(4)} > ${straight.toFixed(4)})`);
  // Monotonie : les positions doivent toujours croître
  let mono = true, prev = -1;
  for (let s = 0; s < 12; s++) { const p = stepPosition(s, 12, 0.62); if (p <= prev) mono = false; prev = p; }
  ok(mono, "positions strictement croissantes");
}

// ─────────────────────────────────────────────────────────────────────────
section("HUMANISATION");
{
  const feel = { offsets: { kick: -3, snare: 4 }, jitterMs: 7, velSigma: 0.06 };
  const base = { instrument: "kick", time: 10, velocity: 0.8 };
  let minV = 1, maxV = 0, maxShift = 0;
  for (let i = 0; i < 4000; i++) {
    const h = humanize(base, feel, 0.5, 3);
    minV = Math.min(minV, h.velocity); maxV = Math.max(maxV, h.velocity);
    maxShift = Math.max(maxShift, Math.abs(h.time - base.time));
  }
  ok(minV >= 0.05 && maxV <= 1, `dynamique bornée [${minV.toFixed(3)}, ${maxV.toFixed(3)}]`);
  ok(maxShift < 0.030, `décalage temporel raisonnable (max ${(maxShift*1000).toFixed(1)} ms)`);

  // Le décalage systématique par instrument doit être respecté en moyenne
  let sumK = 0, sumS = 0, N = 3000;
  for (let i = 0; i < N; i++) {
    sumK += humanize({ instrument: "kick",  time: 0, velocity: 0.8 }, feel).time;
    sumS += humanize({ instrument: "snare", time: 0, velocity: 0.8 }, feel).time;
  }
  const avgK = sumK / N * 1000, avgS = sumS / N * 1000;
  ok(avgK < -1.5 && avgK > -4.5, `grosse caisse en avance (${avgK.toFixed(2)} ms)`);
  ok(avgS > 2.5 && avgS < 5.5,   `caisse claire en retard (${avgS.toFixed(2)} ms)`);
  ok(avgS > avgK, "la caisse claire est bien derrière la grosse caisse");

  // L'énergie doit faire monter la dynamique
  const lowE = humanize(base, { velSigma: 0 }, 0, 1).velocity;
  const hiE  = humanize(base, { velSigma: 0 }, 0, 5).velocity;
  ok(hiE > lowE, `l'énergie augmente la dynamique (${lowE.toFixed(2)} -> ${hiE.toFixed(2)})`);

  // Le tirage gaussien doit rester borné
  let g = [], gm = 0;
  for (let i = 0; i < 5000; i++) { const x = gaussian(1); g.push(x); gm = Math.max(gm, Math.abs(x)); }
  ok(gm <= 2.5 + 1e-9, `gaussienne bornée (max ${gm.toFixed(2)})`);
}

// ─────────────────────────────────────────────────────────────────────────
section("PLANNER — forme longue");
{
  const p = createPlanner({ baseEnergy: 3 });
  p.ensurePlannedUpTo(400);
  ok(p.sections.length > 5, `plan étendu (${p.sections.length} sections)`);
  ok(p.plannedBars >= 400, `couvre bien 400 mesures (${p.plannedBars})`);

  // Énergie toujours dans les bornes
  ok(p.sections.every(s => s.energy >= 1 && s.energy <= 5), "énergie toujours entre 1 et 5");

  // Sections contiguës, sans trou ni chevauchement
  let contiguous = true;
  for (let i = 1; i < p.sections.length; i++) {
    if (p.sections[i].startBar !== p.sections[i-1].startBar + p.sections[i-1].bars) contiguous = false;
  }
  ok(contiguous, "sections contiguës, sans trou");

  // Jamais deux sections de même rôle à la suite (c'est ce qui crée la boucle)
  let repeats = 0;
  for (let i = 1; i < p.sections.length; i++) {
    if (p.sections[i].role === p.sections[i-1].role) repeats++;
  }
  ok(repeats === 0, `aucun rôle répété consécutivement (${repeats} trouvés)`);

  // On démarre toujours doucement
  ok(p.sections[0].role === "intro" && p.sections[0].energy < 3, "intro à énergie réduite");

  // sectionAt cohérent sur toute la plage
  let lookupOk = true;
  for (let b = 0; b < 400; b += 7) {
    const s = p.sectionAt(b);
    if (!(b >= s.startBar && b < s.startBar + s.bars)) lookupOk = false;
  }
  ok(lookupOk, "sectionAt renvoie toujours la bonne section");
}

// ─────────────────────────────────────────────────────────────────────────
section("DIRECTOR — règles musicales");
{
  const d = createDirector(pack);
  const planner = createPlanner({ baseEnergy: 4 });
  planner.ensurePlannedUpTo(600);

  const decisions = [];
  for (let bar = 0; bar < 512; bar++) {
    decisions.push(d.decideBar(bar, planner.sectionAt(bar), planner.sectionAt(bar).energy));
  }

  // Règle 1 : fill uniquement en fin de phrase
  const badFill = decisions.filter((x, i) => x.fill && (i % 4 !== 3));
  ok(badFill.length === 0, `fills uniquement en fin de phrase (${badFill.length} hors phrase)`);

  // Règle 2 : jamais deux mesures consécutives avec fill
  let consecutive = 0;
  for (let i = 1; i < decisions.length; i++) if (decisions[i].fill && decisions[i-1].fill) consecutive++;
  ok(consecutive === 0, `jamais deux fills consécutifs (${consecutive})`);

  // Règle 3 : jamais deux fois le même fill d'affilée
  let sameTwice = 0;
  const fills = decisions.map(x => x.fill?.id).filter(Boolean);
  for (let i = 1; i < fills.length; i++) if (fills[i] === fills[i-1]) sameTwice++;
  ok(sameTwice === 0, `jamais le même fill deux fois d'affilée (${sameTwice})`);

  // Il doit quand même y avoir des fills, sinon c'est plat
  ok(fills.length > 20, `des fills sont bien produits (${fills.length} sur 512 mesures)`);
  // ...mais pas à chaque phrase, sinon le fill devient lui-même une boucle
  const phraseEnds = decisions.filter((_, i) => i % 4 === 3).length;
  ok(fills.length < phraseEnds * 0.85, `fills non systématiques (${fills.length}/${phraseEnds} fins de phrase)`);

  // Règle 4 : motifs respectant le seuil d'énergie
  let energyViolation = 0;
  for (let bar = 0; bar < 512; bar++) {
    const s = planner.sectionAt(bar);
    const pat = pack.drumPatterns.find(p => p.id === decisions[bar].patternId);
    if (pat && (pat.minEnergy ?? 1) > s.energy) energyViolation++;
  }
  ok(energyViolation === 0, `motifs conformes au seuil d'énergie (${energyViolation} violations)`);

  // Le bouton « Change » doit réellement changer quelque chose
  const d2 = createDirector(pack);
  const sec = { startBar: 0, bars: 64, energy: 5, role: "groove" };
  const before = d2.decideBar(10, sec, 5).patternId;
  d2.requestChange();
  const after = d2.decideBar(11, sec, 5).patternId;
  ok(before !== after || pack.drumPatterns.length === 1, `« Change » renouvelle le motif (${before} -> ${after})`);
}

// ─────────────────────────────────────────────────────────────────────────
section("GÉNÉRATEUR DE BATTERIE");
{
  const d = createDirector(pack);
  const planner = createPlanner({ baseEnergy: 3 });
  planner.ensurePlannedUpTo(200);
  const secPerBeat = 60 / 88;

  let allSorted = true, allInBar = true, velOk = true, total = 0;
  for (let bar = 0; bar < 128; bar++) {
    const s = planner.sectionAt(bar);
    const dec = d.decideBar(bar, s, s.energy);
    const t0 = bar * secPerBeat * 4;
    const evs = generateDrumBar(pack, dec, {
      barStartTime: t0, secPerBeat, beatsPerBar: 4, bpm: 88, energy: s.energy,
    });
    total += evs.length;
    for (let i = 1; i < evs.length; i++) if (evs[i].time < evs[i-1].time) allSorted = false;
    // Tolérance de 40 ms pour l'humanisation aux bords de mesure
    for (const e of evs) {
      if (e.time < t0 - 0.04 || e.time > t0 + secPerBeat * 4 + 0.04) allInBar = false;
      if (e.velocity < 0 || e.velocity > 1) velOk = false;
    }
  }
  ok(allSorted, "évènements triés chronologiquement");
  ok(allInBar, "évènements dans les limites de leur mesure");
  ok(velOk, "dynamiques dans [0, 1]");
  ok(total > 128 * 8, `densité correcte (${total} évènements sur 128 mesures)`);
}

// ─────────────────────────────────────────────────────────────────────────
section("LE TEST DÉCISIF — répétitivité sur une longue session");
// C'est LA question posée : « je ne veux pas de boucles qui deviennent
// répétitives après trente secondes ». On mesure objectivement.
{
  const d = createDirector(pack);
  const planner = createPlanner({ baseEnergy: 3 });
  planner.ensurePlannedUpTo(700);
  const secPerBeat = 60 / 88;
  const BARS = 600;   // ~11 minutes à 88 BPM

  const signatures = [];
  for (let bar = 0; bar < BARS; bar++) {
    const s = planner.sectionAt(bar);
    const dec = d.decideBar(bar, s, s.energy);
    const evs = generateDrumBar(pack, dec, {
      barStartTime: 0, secPerBeat, beatsPerBar: 4, bpm: 88, energy: s.energy,
    });
    // Signature : quantifiée à 8 ms pour ignorer le bruit d'humanisation pur
    // et ne comparer que le CONTENU MUSICAL réel.
    signatures.push(evs.map(e =>
      `${e.instrument}@${Math.round(e.time / 0.008)}v${Math.round(e.velocity * 8)}`
    ).join("|"));
  }

  const unique = new Set(signatures).size;
  const ratio = unique / BARS;
  console.log(`  ${BARS} mesures générées, ${unique} mesures distinctes (${(ratio*100).toFixed(1)} %)`);
  ok(ratio > 0.95, `quasiment aucune mesure identique (${(ratio*100).toFixed(1)} %)`);

  // Test plus dur : deux mesures consécutives strictement identiques ?
  let backToBack = 0;
  for (let i = 1; i < signatures.length; i++) if (signatures[i] === signatures[i-1]) backToBack++;
  ok(backToBack === 0, `aucune répétition immédiate (${backToBack})`);

  // Variété de l'énergie sur la durée
  const energies = new Set();
  for (let b = 0; b < BARS; b++) energies.add(planner.sectionAt(b).energy);
  console.log(`  niveaux d'énergie traversés : ${[...energies].sort().join(", ")}`);
  ok(energies.size >= 3, `l'intensité varie réellement (${energies.size} niveaux)`);

  // Variété des motifs
  const patterns = new Set();
  const d2 = createDirector(pack);
  for (let b = 0; b < BARS; b++) patterns.add(d2.decideBar(b, planner.sectionAt(b), planner.sectionAt(b).energy).patternId);
  console.log(`  motifs de batterie utilisés : ${[...patterns].join(", ")}`);
  ok(patterns.size >= 2, `plusieurs motifs employés (${patterns.size})`);
}

// ─────────────────────────────────────────────────────────────────────────
section("PACK DE STYLE — validité des données");
{
  ok(Array.isArray(pack.drumPatterns) && pack.drumPatterns.length > 0, "motifs présents");
  ok(Array.isArray(pack.fills) && pack.fills.length > 0, "fills présents");
  // Toutes les grilles d'un même motif doivent avoir la même longueur
  let gridOk = true;
  for (const p of pack.drumPatterns) {
    const lens = new Set(Object.values(p.grid).map(g => g.length));
    if (lens.size !== 1) { gridOk = false; console.log("   grilles incohérentes:", p.id, [...lens]); }
  }
  ok(gridOk, "grilles cohérentes au sein de chaque motif");
  // La subdivision déclarée doit correspondre aux grilles
  const declared = pack.feel.subdivision;
  const actual = new Set(pack.drumPatterns.flatMap(p => Object.values(p.grid).map(g => g.length)));
  ok(actual.has(declared), `subdivision déclarée (${declared}) cohérente avec les grilles (${[...actual]})`);
  // Poids exploitables
  ok(pack.drumPatterns.every(p => (p.weight ?? 1) > 0), "poids strictement positifs");
}

// ─────────────────────────────────────────────────────────────────────────
console.log(`\n${"=".repeat(52)}`);
console.log(`RÉSULTAT : ${pass} réussis, ${fail} échoués`);
console.log("=".repeat(52));
process.exit(fail === 0 ? 0 : 1);
