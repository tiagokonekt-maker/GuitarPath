// Le MÊME moteur doit fonctionner sur un pack qu'il n'a jamais vu,
// sans une seule ligne de code modifiée. C'est le test d'extensibilité.
import { readFileSync } from "fs";
import { createPlanner, createDirector } from "../src/jam/arrangement/arranger.js";
import { generateDrumBar } from "../src/jam/generators/drums.js";

let pass = 0, fail = 0;
const ok = (c, l) => { if (c) pass++; else { fail++; console.log("  ECHEC:", l); } };

for (const name of ["blues-shuffle", "funk-16"]) {
  const pack = JSON.parse(readFileSync(new URL(`../src/jam/packs/${name}.json`, import.meta.url)));
  const d = createDirector(pack);
  const planner = createPlanner({ baseEnergy: 3 });
  planner.ensurePlannedUpTo(400);
  const spb = 60 / pack.defaultTempo;

  const sigs = [];
  let total = 0, velOk = true, sorted = true;
  for (let bar = 0; bar < 300; bar++) {
    const s = planner.sectionAt(bar);
    const dec = d.decideBar(bar, s, s.energy);
    const evs = generateDrumBar(pack, dec, { barStartTime: 0, secPerBeat: spb, beatsPerBar: 4, bpm: pack.defaultTempo, energy: s.energy });
    total += evs.length;
    for (let i = 1; i < evs.length; i++) if (evs[i].time < evs[i-1].time) sorted = false;
    for (const e of evs) if (e.velocity < 0 || e.velocity > 1) velOk = false;
    sigs.push(evs.map(e => `${e.instrument}@${Math.round(e.time/0.008)}v${Math.round(e.velocity*8)}`).join("|"));
  }
  const uniq = new Set(sigs).size;
  console.log(`\n${pack.name}`);
  console.log(`  ${total} évènements / 300 mesures — ${uniq} mesures distinctes (${(uniq/300*100).toFixed(1)} %)`);
  ok(sorted, `${name}: tri chronologique`);
  ok(velOk, `${name}: dynamiques valides`);
  ok(uniq / 300 > 0.95, `${name}: non répétitif`);
  ok(total > 300 * 8, `${name}: densité suffisante`);
}
console.log(`\nEXTENSIBILITE : ${pass} réussis, ${fail} échoués`);
process.exit(fail === 0 ? 0 : 1);
