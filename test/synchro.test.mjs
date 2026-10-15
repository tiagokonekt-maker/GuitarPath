import { test } from "node:test";
import assert from "node:assert/strict";
import { sauvegarderSansEcraser, versLigne, creerFile } from "../src/store/synchro.js";
import { mergeStates, defaultState } from "../src/store/state.js";

// Faux cloud : une ligne avec un jeton de version, et la même règle que la
// base (UPDATE … WHERE updated_at = jeton, INSERT refusé si la ligne existe).
function fauxCloud(initial = null) {
  let ligne = initial ? { etat: initial, jeton: "v0" } : null;
  let n = 0;
  return {
    get contenu() { return ligne?.etat ?? null; },
    ecrireDepuisAilleurs(etat) { ligne = { etat, jeton: `v${++n}x` }; },
    ecrire: async (etat, jeton) => {
      if (!jeton) {
        if (ligne) return { statut: "conflit" };
      } else if (!ligne || ligne.jeton !== jeton) {
        return { statut: "conflit" };
      }
      ligne = { etat, jeton: `v${++n}` };
      return { statut: "ok", jeton: ligne.jeton };
    },
    lire: async () => (ligne
      ? { statut: "trouve", progression: { ...ligne.etat, cloudUpdatedAt: ligne.jeton } }
      : { statut: "absent" }),
  };
}

const base = (over = {}) => ({ ...defaultState(), ...over });

test("deux appareils : la seconde sauvegarde fusionne au lieu d'écraser", async () => {
  const cloud = fauxCloud(base());
  // Les deux appareils ont lu la version v0.
  const telephone = base({ completedLessons: { "neck-c1-01": "2026-10-01" }, xp: 100 });
  const ordi = base({ completedLessons: { "neck-c1-02": "2026-10-01" }, xp: 80 });

  const r1 = await sauvegarderSansEcraser({ etat: telephone, jeton: "v0", ...cloud, fusionner: c => mergeStates(telephone, c) });
  assert.ok(r1.ok);

  let fusionAppelee = false;
  const r2 = await sauvegarderSansEcraser({
    etat: ordi, jeton: "v0", ...cloud,
    fusionner: (c) => { fusionAppelee = true; return mergeStates(ordi, c); },
  });
  assert.ok(r2.ok);
  assert.ok(fusionAppelee, "le conflit doit déclencher une fusion");
  assert.deepEqual(Object.keys(cloud.contenu.completedLessons).sort(), ["neck-c1-01", "neck-c1-02"]);
  assert.equal(cloud.contenu.xp, 100);
});

test("première sauvegarde : insertion, puis conflit si un autre appareil a créé la ligne", async () => {
  const cloud = fauxCloud(null);
  const a = await sauvegarderSansEcraser({ etat: base({ xp: 10 }), jeton: null, ...cloud, fusionner: c => c });
  assert.ok(a.ok);

  const b = await sauvegarderSansEcraser({
    etat: base({ xp: 30 }), jeton: null, ...cloud,
    fusionner: (c) => mergeStates(base({ xp: 30 }), c),
  });
  assert.ok(b.ok);
  assert.equal(cloud.contenu.xp, 30);
});

test("le jeton renvoyé sert à la sauvegarde suivante (pas de conflit inutile)", async () => {
  const cloud = fauxCloud(base());
  let fusions = 0;
  const fusionner = (c) => { fusions++; return c; };
  const r1 = await sauvegarderSansEcraser({ etat: base({ xp: 5 }), jeton: "v0", ...cloud, fusionner });
  const r2 = await sauvegarderSansEcraser({ etat: base({ xp: 6 }), jeton: r1.jeton, ...cloud, fusionner });
  assert.ok(r2.ok);
  assert.equal(fusions, 0);
});

test("une erreur réseau n'écrit rien et n'est pas prise pour un conflit", async () => {
  const r = await sauvegarderSansEcraser({
    etat: base(), jeton: "v0",
    ecrire: async () => ({ statut: "erreur", erreur: new Error("hors ligne") }),
    lire: async () => { throw new Error("ne doit pas relire"); },
    fusionner: c => c,
  });
  assert.equal(r.ok, false);
  assert.equal(r.raison, "erreur");
});

test("conflits en boucle : abandon après le nombre d'essais, sans écrire", async () => {
  const cloud = fauxCloud(base());
  let ecritures = 0;
  const r = await sauvegarderSansEcraser({
    etat: base({ xp: 1 }), jeton: "v0",
    ecrire: async () => { ecritures++; cloud.ecrireDepuisAilleurs(base({ xp: 99 })); return { statut: "conflit" }; },
    lire: cloud.lire,
    fusionner: c => c,
    essais: 3,
  });
  assert.equal(r.ok, false);
  assert.equal(r.raison, "conflits");
  assert.equal(ecritures, 3);
});

test("versLigne sépare les colonnes et retire le jeton de lecture", () => {
  const ligne = versLigne("u1", { xp: 5, level: 2, streak: 1, cloudUpdatedAt: "v3", theme: "dark" });
  assert.deepEqual(ligne, { user_id: "u1", xp: 5, level: 2, streak: 1, data: { theme: "dark" } });
});

test("la file exécute les opérations une par une, dans l'ordre, même après une erreur", async () => {
  const file = creerFile();
  const journal = [];
  const lente = () => new Promise(r => setTimeout(() => { journal.push("lente"); r(); }, 20));
  const p1 = file(lente);
  const p2 = file(async () => { journal.push("rapide"); throw new Error("échec"); });
  const p3 = file(async () => { journal.push("après"); });
  await p1; await assert.rejects(p2); await p3;
  assert.deepEqual(journal, ["lente", "rapide", "après"]);
});
