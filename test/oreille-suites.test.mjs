// Groply — test/oreille-suites.test.mjs
// Suites d'accords et accord en tonalité : les NOMS d'accords d'abord, les
// chiffres romains seulement après la leçon du chiffrage (harm-c5-02), puis
// à dose croissante, jamais à 100 %. La correction donne les deux une fois
// la leçon faite. Orthographe vérifiée par un oracle indépendant.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PROGRESSIONS, ORDRE_PROGRESSIONS, ORDRE_DEGRES, DEGRES_TONALITE, TONALITES_MAJ, TONALITES_MIN,
  LECON_CHIFFRES_ROMAINS, PART_ROMAINS, partChiffresRomains, formatSuite, chiffresRomainsAppris,
  toniquesPour, libelleNomsSuite, nomTonique, exempleSuite, exempleDegre, romainDe,
} from "../src/store/oreille.js";
import { generateEarTrainingQuestion } from "../src/audioEngine.js";
import { FAMILLES, genererQuestion } from "../src/store/generateurs.js";
import { COURSES } from "../src/content/index.js";

function rng(graine) { let x = graine >>> 0; return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
// Oracle indépendant : lecture d'un nom français.
const LET = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"], NAT = [0, 2, 4, 5, 7, 9, 11];
function lire(n) {
  const m = /^(Do|Ré|Mi|Fa|Sol|La|Si)(#|b)?(m|7|dim)?$/.exec(n); if (!m) return null;
  const l = LET.indexOf(m[1]), acc = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
  return { l, pc: ((NAT[l] + acc) % 12 + 12) % 12, type: m[3] || "" };
}
const NUM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7 };
const ROMAIN = /(^|[\s(–])(I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii)°?7?(?=$|[\s).–,])/;

/** Vérifie « Sol – Ré – Mim – Do » pour la suite `cle` depuis la tonique `t`. */
function verifierNoms(libelle, cle, t) {
  const noms = libelle.split(" – "), tn = lire(nomTonique(t));
  assert.equal(tn.pc, t, `tonique ${nomTonique(t)}`);
  assert.equal(noms.length, 4, libelle);
  PROGRESSIONS[cle].degres.forEach(([semi, type, rom], k) => {
    const n = lire(noms[k]);
    assert.ok(n, `${noms[k]} illisible (${libelle})`);
    assert.equal(n.pc, (t + semi) % 12, `${libelle} : ${rom}`);
    assert.equal(n.type, type === "min" ? "m" : "", `${libelle} : qualité de ${rom}`);
    // Une lettre par degré : le VI de Do mineur est Lab, jamais Sol#.
    assert.equal(n.l, (tn.l + NUM[rom.toUpperCase()] - 1) % 7, `${libelle} : orthographe de ${rom}`);
  });
}

// ── La leçon qui ouvre les chiffres romains ──────────────────────────────
test("la leçon du chiffrage romain existe dans le parcours", () => {
  const lecon = COURSES.flatMap(c => c.lessons).find(l => l.id === LECON_CHIFFRES_ROMAINS);
  assert.ok(lecon, LECON_CHIFFRES_ROMAINS);
  assert.match(lecon.title, /chiffrage romain/i);
  assert.equal(chiffresRomainsAppris({}), false);
  assert.equal(chiffresRomainsAppris({ [LECON_CHIFFRES_ROMAINS]: true }), true);
});

// ── La règle de dosage ───────────────────────────────────────────────────
test("partChiffresRomains : 0 avant la leçon, 20 % au départ, croît avec les réussites et le niveau, plafonne à 55 %", () => {
  for (const succes of [0, 5, 50, 500]) for (const niveau of [1, 2, 3])
    assert.equal(partChiffresRomains({ leconFaite: false, succes, niveau }), 0);
  assert.equal(partChiffresRomains({ leconFaite: true }), PART_ROMAINS.depart);
  assert.equal(PART_ROMAINS.depart, 0.2);
  let prec = 0;
  for (let s = 0; s <= 40; s++) {
    const p = partChiffresRomains({ leconFaite: true, succes: s });
    assert.ok(p >= prec, `croissante (${s})`);
    assert.ok(p <= 0.55 && p < 1, `plafond (${s})`);
    prec = p;
  }
  assert.ok(Math.abs(partChiffresRomains({ leconFaite: true, succes: 10 }) - 0.375) < 1e-9);
  assert.ok(Math.abs(partChiffresRomains({ leconFaite: true, succes: 20 }) - 0.55) < 1e-9);
  assert.ok(Math.abs(partChiffresRomains({ leconFaite: true, niveau: 2 }) - 0.375) < 1e-9);
  assert.ok(Math.abs(partChiffresRomains({ leconFaite: true, niveau: 3 }) - 0.55) < 1e-9);
  assert.equal(partChiffresRomains({ leconFaite: true, succes: 1e6, niveau: 99 }), 0.55);
});

test("formatSuite : aucun chiffre romain avant la leçon ; après, ~1 sur 5 puis jusqu'à ~55 %, jamais tous", () => {
  const compter = (params, n = 4000, graine = 3) => {
    const r = rng(graine); let k = 0;
    for (let i = 0; i < n; i++) if (formatSuite(r, params) === "romains") k++;
    return k / n;
  };
  assert.equal(compter({ leconFaite: false, succes: 100, niveau: 3 }), 0);
  const debut = compter({ leconFaite: true, succes: 0 });
  const milieu = compter({ leconFaite: true, succes: 10 });
  const fin = compter({ leconFaite: true, succes: 40 });
  assert.ok(debut > 0.16 && debut < 0.24, `départ ${debut}`);
  assert.ok(milieu > debut && milieu < fin, `milieu ${milieu}`);
  assert.ok(fin > 0.5 && fin < 0.6, `fin ${fin}`);
});

// ── Suites d'accords, écran Ear Training ─────────────────────────────────
test("avant la leçon : options en noms d'accords, aucun chiffre romain, ni dans la question ni dans la correction", () => {
  const r = rng(11);
  for (let i = 0; i < 400; i++) {
    const q = generateEarTrainingQuestion("progression", { pool: ORDRE_PROGRESSIONS, toutesOptions: i % 2 === 0, rng: r, leconChiffres: false, format: "romains" });
    assert.equal(q.format, "noms", "« romains » demandé mais leçon pas faite : noms quand même");
    for (const o of q.options) {
      assert.doesNotMatch(o.label, ROMAIN, o.label);
      verifierNoms(o.label, o.key, toniqueDe(q));
    }
    assert.equal(q.options.find(o => o.key === q.answer).label, q.noms.join(" – "));
    assert.match(q.consigne, new RegExp(`^Tonique : ${nomTonique(toniqueDe(q))}\\. `));
    assert.doesNotMatch(q.consigne, /majeur|mineur/, "la tonique seule : le mode s'entend");
    assert.doesNotMatch(q.repere, ROMAIN, q.repere);
    assert.match(q.repere, /^En \S+ (majeur|mineur) : /);
    assert.equal(new Set(q.options.map(o => o.label)).size, q.options.length, "options distinctes");
  }
});
function toniqueDe(q) { return lire(q.noms[0]).pc; }

test("noms orthographiés dans plusieurs tonalités, majeures et mineures", () => {
  assert.equal(libelleNomsSuite("I-V-vi-IV", 7), "Sol – Ré – Mim – Do");
  assert.equal(libelleNomsSuite("I-V-vi-IV", 5), "Fa – Do – Rém – Sib");
  assert.equal(libelleNomsSuite("I-vi-ii-V", 10), "Sib – Solm – Dom – Fa");
  assert.equal(libelleNomsSuite("I-IV-V-I", 3), "Mib – Lab – Sib – Mib");
  assert.equal(libelleNomsSuite("I-IV-vi-V", 4), "Mi – La – Do#m – Si");
  assert.equal(libelleNomsSuite("i-VI-III-VII", 0), "Dom – Lab – Mib – Sib");
  assert.equal(libelleNomsSuite("i-iv-v-i", 9), "Lam – Rém – Mim – Lam");
  assert.equal(libelleNomsSuite("i-iv-V-i", 4), "Mim – Lam – Si – Mim", "mineur harmonique : V majeur");
  assert.equal(libelleNomsSuite("i-VII-VI-V", 2), "Rém – Do – Sib – La");
  assert.equal(libelleNomsSuite("i-VI-VII-i", 11), "Sim – Sol – La – Sim");
  for (const cle of ORDRE_PROGRESSIONS) for (const t of PROGRESSIONS[cle].mineur ? TONALITES_MIN : TONALITES_MAJ)
    verifierNoms(libelleNomsSuite(cle, t), cle, t);
});

test("vivier mixte (majeures et mineures) : une tonique commune, toutes les options partent d'elle", () => {
  assert.deepEqual(toniquesPour(["I-IV-V-I", "i-iv-v-i"]).sort((a, b) => a - b), [0, 2, 4, 5, 7, 9]);
  assert.deepEqual(toniquesPour(["i-iv-v-i", "i-VI-VII-i"]), TONALITES_MIN);
  const r = rng(12);
  for (let i = 0; i < 300; i++) {
    const q = generateEarTrainingQuestion("progression", { pool: ORDRE_PROGRESSIONS, toutesOptions: true, rng: r, leconChiffres: false });
    const t = toniqueDe(q);
    assert.ok(toniquesPour(q.options.map(o => o.key)).includes(t));
    for (const o of q.options) assert.equal(lire(o.label.split(" – ")[0]).pc, t, o.label);
  }
});

test("après la leçon : noms par défaut, chiffres sur demande, et la correction donne TOUJOURS les deux", () => {
  const r = rng(13);
  for (let i = 0; i < 300; i++) {
    const format = i % 3 === 0 ? "romains" : undefined;
    const q = generateEarTrainingQuestion("progression", { pool: ORDRE_PROGRESSIONS, toutesOptions: true, rng: r, leconChiffres: true, format });
    assert.equal(q.format, format ?? "noms");
    if (q.format === "romains") {
      assert.ok(q.options.every(o => o.label === romainDe(o.key)));
      assert.match(q.consigne, /Quels degrés \?$/);
    } else {
      for (const o of q.options) verifierNoms(o.label, o.key, toniqueDe(q));
      assert.match(q.consigne, /Quels accords \?$/);
    }
    // « Sol – Ré – Mim – Do = I – V – vi – IV en Sol majeur. »
    assert.equal(q.repere, `${q.noms.join(" – ")} = ${q.roman} en ${q.tonalite}.`);
  }
});

test("parcours simulé : 0 chiffre romain avant la leçon, puis une part qui grandit sans atteindre 100 %", () => {
  const r = rng(14);
  const part = (params, n = 1500) => {
    let k = 0;
    for (let i = 0; i < n; i++) {
      const q = generateEarTrainingQuestion("progression", { pool: ORDRE_PROGRESSIONS, toutesOptions: true, rng: r, leconChiffres: params.leconFaite, format: formatSuite(r, params) });
      if (q.options.some(o => ROMAIN.test(o.label))) k++;
    }
    return k / n;
  };
  assert.equal(part({ leconFaite: false, succes: 50 }), 0);
  const a = part({ leconFaite: true, succes: 0 }), b = part({ leconFaite: true, succes: 20 });
  assert.ok(a > 0.15 && a < 0.25, `départ ${a}`);
  assert.ok(b > a && b < 0.62, `progression ${b}`);
});

test("annonce du vivier : pas de chiffre romain avant la leçon", () => {
  for (const cle of ORDRE_PROGRESSIONS) {
    assert.doesNotMatch(exempleSuite(cle, false), ROMAIN, exempleSuite(cle, false));
    assert.ok(exempleSuite(cle, true).startsWith(romainDe(cle)));
  }
  assert.equal(exempleSuite("I-V-vi-IV", false), "la suite en Do majeur : Do – Sol – Lam – Fa");
  for (const d of ORDRE_DEGRES) {
    assert.doesNotMatch(exempleDegre(d, false), ROMAIN, exempleDegre(d, false));
    assert.ok(exempleDegre(d, true).endsWith(`(${d})`));
  }
});

// ── Accord en tonalité ───────────────────────────────────────────────────
test("accord en tonalité : « Rém » avant la leçon, « Rém (ii) » après ; la correction suit la même règle", () => {
  const r = rng(15);
  for (let i = 0; i < 300; i++) {
    const avant = generateEarTrainingQuestion("chord_full", { pool: ORDRE_DEGRES, toutesOptions: true, rng: r, leconChiffres: false });
    const t = lire(/Tonalité : (\S+) majeur/.exec(avant.consigne)[1]);
    for (const o of avant.options) {
      const n = lire(o.label);
      assert.ok(n, `nom seul attendu : ${o.label}`);
      assert.equal(n.pc, (t.pc + DEGRES_TONALITE[o.key].semi) % 12, o.label);
    }
    assert.doesNotMatch(avant.repere, ROMAIN, avant.repere);
    const apres = generateEarTrainingQuestion("chord_full", { pool: ORDRE_DEGRES, toutesOptions: true, rng: r, leconChiffres: true });
    for (const o of apres.options) assert.match(o.label, new RegExp(`^\\S+ \\(${o.key}\\)$`));
    assert.ok(apres.repere.includes(`(${apres.answer})`), apres.repere);
  }
});

// ── Révision espacée : compétence « Oreille : suites d'accords » ─────────
test("révision : noms d'accords en majorité, chiffres de 20 % (niveau 1) à 55 % (niveau 3), correction avec les deux", () => {
  const f = FAMILLES.find(x => x.id === "oreille-progressions");
  assert.equal(f.lecon, LECON_CHIFFRES_ROMAINS, "la compétence suit la leçon du chiffrage");
  const r = rng(16), parts = [];
  for (const niv of [1, 2, 3]) {
    let k = 0; const n = 1500;
    for (let i = 0; i < n; i++) {
      const q = genererQuestion(f, niv, r, { completedLessons: { [LECON_CHIFFRES_ROMAINS]: true } });
      const romains = ROMAIN.test(q.o[0]);
      if (romains) k++;
      else assert.match(q.q, /^Tonique : \S+\. .*Quels accords \?$/);
      assert.ok(q.o.every(x => ROMAIN.test(x) === romains), "toutes les options au même format");
      assert.match(q.exp, /^\S.* – .* = [ivIV]+.* en \S+ (majeur|mineur)\./, q.exp);
    }
    parts.push(k / n);
  }
  assert.ok(parts[0] > 0.15 && parts[0] < 0.25, `niveau 1 : ${parts[0]}`);
  assert.ok(parts[1] > parts[0] && parts[2] > parts[1], parts.join(" < "));
  assert.ok(parts[2] < 0.62, `niveau 3 : ${parts[2]}`);
});
