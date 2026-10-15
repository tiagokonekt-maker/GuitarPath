import { test } from "node:test";
import assert from "node:assert/strict";
import {
  purgerSuppressionCompte, cleHorsLigne, OWNER_KEY, ANALYTICS_QUEUE_KEY,
  CLES_PERSONNELLES, CLES_HORS_LIGNE_ANCIENNES, CLES_CONTENU,
} from "../src/store/compte.js";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const memoire = (init = {}) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    dump: () => Object.fromEntries(m),
  };
};

test("suppression de compte : tout ce qui appartient au compte disparaît de l'appareil", () => {
  const s = memoire({
    [OWNER_KEY]: "alice",
    groply_state: "{}",
    guitarpath_v4_state: "{}",
    guitarpath_v3_state: "{}",
    [ANALYTICS_QUEUE_KEY]: "[]",
    groply_offline_state: "{}",
    guitarpath_offline_state: "{}",
    [cleHorsLigne("alice")]: '{"xp":3}',
    groply_content: "{}",
    guitarpath_v3_content: "{}",
    "groply:tab-brouillon": "[]",
    // Doivent rester : autre compte, préférences d'appareil.
    [cleHorsLigne("bob")]: '{"xp":9}',
    groply_analytics_off: "1",
    "groply:duree-seance": "15",
  });
  purgerSuppressionCompte(s, "alice");
  assert.deepEqual(s.dump(), {
    [cleHorsLigne("bob")]: '{"xp":9}',
    groply_analytics_off: "1",
    "groply:duree-seance": "15",
  });
});

test("sans userId, la purge complète ne touche à aucun repli indexé", () => {
  const s = memoire({ [cleHorsLigne("alice")]: "{}", groply_state: "{}" });
  purgerSuppressionCompte(s, null);
  assert.deepEqual(s.dump(), { [cleHorsLigne("alice")]: "{}" });
});

// Filet de sécurité : toute clé `groply_*` / `guitarpath_*` littérale du code
// doit être connue de la purge, ou explicitement déclarée « d'appareil ».
test("toutes les clés de stockage du code sont couvertes par la purge", () => {
  const racine = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
  const trouvees = new Set();
  (function parcourir(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) { parcourir(p); continue; }
      if (!/\.(js|jsx)$/.test(e)) continue;
      for (const m of readFileSync(p, "utf8").matchAll(/["'`]((?:groply|guitarpath)_[a-z0-9_]+)["'`:]/g)) trouvees.add(m[1]);
    }
  })(racine);
  const couvertes = new Set([...CLES_PERSONNELLES, ...CLES_HORS_LIGNE_ANCIENNES, ...CLES_CONTENU, OWNER_KEY]);
  const appareil = new Set(["groply_analytics_off", "groply_offline_state"]); // préférence ; préfixe indexé
  const oubliees = [...trouvees].filter(k => !couvertes.has(k) && !appareil.has(k));
  assert.deepEqual(oubliees, []);
});
