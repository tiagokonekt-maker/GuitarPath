// Tests des dates — c'est ici que vivait le bug le plus coûteux du produit.
// Exécuter avec : npm test   (node --test, aucune dépendance à installer)
import { test } from "node:test";
import assert from "node:assert/strict";
import { dayStr, todayStr, daysAgoStr, daysBetween, weekStr, normalizeWeek, compareWeeks }
  from "../src/store/dates.js";

test("dayStr rend la date LOCALE, pas la date UTC", () => {
  // 00h30 heure locale : toISOString() aurait rendu la veille dès que le
  // fuseau est à l'est de Greenwich. C'est le bug §2.1.
  const minuitTrente = new Date(2026, 7, 13, 0, 30, 0);
  assert.equal(dayStr(minuitTrente), "2026-08-13");
  const presqueMinuit = new Date(2026, 7, 13, 23, 59, 0);
  assert.equal(dayStr(presqueMinuit), "2026-08-13");
});

test("dayStr pade le mois et le jour", () => {
  assert.equal(dayStr(new Date(2026, 0, 5)), "2026-01-05");
  assert.equal(dayStr(new Date(2026, 11, 31)), "2026-12-31");
});

test("dayStr sur une date invalide ne jette pas", () => {
  assert.equal(dayStr(new Date("n'importe quoi")), "");
});

test("todayStr est cohérent avec l'horloge locale", () => {
  const now = new Date();
  assert.equal(todayStr(), dayStr(now));
});

test("daysAgoStr recule bien de n jours calendaires", () => {
  const ref = new Date(2026, 2, 3);           // 3 mars 2026
  assert.equal(daysAgoStr(1, ref), "2026-03-02");
  assert.equal(daysAgoStr(3, ref), "2026-02-28");  // 2026 n'est pas bissextile
});

test("daysBetween compte des jours calendaires", () => {
  assert.equal(daysBetween("2026-08-12", "2026-08-13"), 1);
  assert.equal(daysBetween("2026-08-13", "2026-08-13"), 0);
  assert.equal(daysBetween("2026-08-11", "2026-08-13"), 2);
  assert.equal(daysBetween("2026-12-31", "2027-01-01"), 1);
  // Passage à l'heure d'été en Europe : le 29 mars 2026 ne fait que 23 h.
  assert.equal(daysBetween("2026-03-28", "2026-03-30"), 2);
  assert.equal(daysBetween("", "2026-08-13"), null);
});

test("weekStr pade le numéro de semaine sur 2 chiffres", () => {
  const d = (s) => new Date(s + "T12:00:00Z");
  assert.equal(weekStr(d("2026-01-01")), "2026-W01");
  assert.equal(weekStr(d("2026-01-05")), "2026-W02");
  assert.equal(weekStr(d("2026-03-02")), "2026-W10");
  assert.equal(weekStr(d("2026-12-28")), "2026-W53");
  // Règle ISO : le 29 décembre 2025 appartient à la semaine 1 de 2026.
  assert.equal(weekStr(d("2025-12-29")), "2026-W01");
});

test("les clés de semaine sont comparables comme des chaînes", () => {
  // C'était FAUX avant le padding : "2026-W9" > "2026-W12".
  assert.ok(weekStr(new Date("2026-03-02T12:00:00Z")) > weekStr(new Date("2026-02-23T12:00:00Z")));
  assert.equal(compareWeeks("2026-W9", "2026-W12"), -1);   // tolère l'ancien format
  assert.equal(compareWeeks("2026-W09", "2026-W09"), 0);
  assert.equal(normalizeWeek("2026-W9"), "2026-W09");
  assert.equal(normalizeWeek(""), "");
});
