import { test } from "node:test";
import assert from "node:assert/strict";
import {
  interpreterChargementProgression, delaiNouvelEssai,
  preparerStockagePour, purgerDonneesPersonnelles, cleHorsLigne,
  estRejetDefinitif, evenementsDe, OWNER_KEY, ANALYTICS_QUEUE_KEY,
} from "../src/store/compte.js";

/** Stockage en mémoire, même interface que localStorage. */
const memoire = (init = {}) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    dump: () => Object.fromEntries(m),
  };
};

// ── Chargement de la progression ─────────────────────────────────────────
test("une erreur de chargement n'est PAS confondue avec une absence de ligne", () => {
  const r = interpreterChargementProgression({ data: null, error: { message: "Failed to fetch" } });
  assert.equal(r.statut, "erreur");
  assert.equal(r.progression, undefined);
});

test("aucune ligne (première connexion) → absent", () => {
  assert.deepEqual(interpreterChargementProgression({ data: null, error: null }),
    { statut: "absent", progression: null });
});

test("une ligne trouvée est aplatie avec ses colonnes et updated_at", () => {
  const r = interpreterChargementProgression({
    data: { xp: 120, level: 3, streak: 4, data: { theme: "dark" }, updated_at: "2026-10-01T10:00:00Z" },
    error: null,
  });
  assert.equal(r.statut, "trouve");
  assert.deepEqual(r.progression, { theme: "dark", xp: 120, level: 3, streak: 4, cloudUpdatedAt: "2026-10-01T10:00:00Z" });
});

test("une colonne data corrompue n'empêche pas de lire xp/level/streak", () => {
  const r = interpreterChargementProgression({ data: { xp: 5, level: 1, streak: 0, data: "??" }, error: null });
  assert.deepEqual(r.progression, { xp: 5, level: 1, streak: 0, cloudUpdatedAt: "" });
});

test("le délai entre deux essais double puis plafonne à 60 s", () => {
  assert.equal(delaiNouvelEssai(0), 1000);
  assert.equal(delaiNouvelEssai(3), 8000);
  assert.equal(delaiNouvelEssai(20), 60_000);
});

// ── Isolation entre comptes ──────────────────────────────────────────────
test("un autre compte sur le même appareil déclenche la purge des données locales", () => {
  const s = memoire({
    [OWNER_KEY]: "alice",
    groply_state: '{"xp":999}',
    [ANALYTICS_QUEUE_KEY]: "[]",
    [cleHorsLigne("alice")]: '{"xp":999}',
    groply_content: "{}",
  });
  assert.equal(preparerStockagePour("bob", s), true);
  const d = s.dump();
  assert.equal(d.groply_state, undefined);
  assert.equal(d[ANALYTICS_QUEUE_KEY], undefined);
  assert.equal(d[OWNER_KEY], "bob");
  // Le repli hors-ligne d'Alice reste à elle (indexé) : il ne sera relu que
  // si elle se reconnecte, jamais par Bob.
  assert.equal(d[cleHorsLigne("alice")], '{"xp":999}');
  assert.equal(d[cleHorsLigne("bob")], undefined);
  assert.equal(d.groply_content, "{}");
});

test("le même compte ne purge rien", () => {
  const s = memoire({ [OWNER_KEY]: "alice", groply_state: '{"xp":1}' });
  assert.equal(preparerStockagePour("alice", s), false);
  assert.equal(s.getItem("groply_state"), '{"xp":1}');
});

test("sans propriétaire connu, le compte adopte l'état et l'ancien repli hors-ligne", () => {
  const s = memoire({ groply_state: '{"xp":1}', groply_offline_state: '{"xp":2}' });
  assert.equal(preparerStockagePour("alice", s), false);
  const d = s.dump();
  assert.equal(d.groply_state, '{"xp":1}');
  assert.equal(d[cleHorsLigne("alice")], '{"xp":2}');
  assert.equal(d.groply_offline_state, undefined);
  assert.equal(d[OWNER_KEY], "alice");
});

test("la purge de déconnexion retire état, file analytics et propriétaire", () => {
  const s = memoire({
    [OWNER_KEY]: "alice", groply_state: "{}", [ANALYTICS_QUEUE_KEY]: "[]",
    guitarpath_offline_state: "{}", autre: "x",
  });
  purgerDonneesPersonnelles(s);
  assert.deepEqual(s.dump(), { autre: "x" });
});

test("sans userId, rien n'est touché", () => {
  const s = memoire({ [OWNER_KEY]: "alice", groply_state: "{}" });
  assert.equal(preparerStockagePour(null, s), false);
  assert.equal(s.getItem("groply_state"), "{}");
});

// ── File analytics ───────────────────────────────────────────────────────
test("les 4xx sont des rejets définitifs, sauf 408 et 429", () => {
  for (const st of [400, 401, 403, 404, 409, 422]) assert.equal(estRejetDefinitif(st), true, String(st));
  for (const st of [0, 200, 408, 429, 500, 503]) assert.equal(estRejetDefinitif(st), false, String(st));
});

test("la file analytics ne garde que les événements du compte courant", () => {
  const file = [{ user_id: "alice", event: "a" }, { user_id: "bob", event: "b" }, null, { user_id: null, event: "c" }];
  assert.deepEqual(evenementsDe(file, "bob"), [{ user_id: "bob", event: "b" }]);
  assert.deepEqual(evenementsDe(file, null), []);
  assert.deepEqual(evenementsDe(undefined, "bob"), []);
});
