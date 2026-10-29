// Groply — test/questions-cadeaux.test.mjs
// Une question ne doit pas donner sa réponse (src/content/README.md,
// « Questions de quiz ») : ni doigté noté dans l'énoncé (« x02220 »), ni
// réponse écrite sur la carte affichée juste avant. Contrôles de
// src/lecon/cartes.js, bloquants dans scripts/verifier-contenu.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES, QUIZ } from "../src/content/index.js";
import {
  NOTATION_DOIGTE, DOIGTE_AUTORISE, REPONSE_PRECEDENTE_AUTORISEE,
  enonceAvecDoigte, normaliserTexte, reponsesDonneesAvant, controlerQuestionsCadeaux, cleCadeau,
} from "../src/lecon/cartes.js";

const qcm = (id, q, o, a = 0) => ({ id, courseId: "harmony", lessonId: "test", lvl: 1, q, o, a, exp: "…", xp: 25 });
const lecon = (cartes) => ({ id: "test-01", cartes });

test("doigté dans l'énoncé : repéré (x, chiffres, 6 caractères)", () => {
  for (const q of [
    "Sur l'accord de La (x02220), à partir de quelle corde grattes-tu ?",
    "Dans le petit Fa (xx3211), quel doigt appuie deux cordes ?",
    "Quelles notes dans E5 (022xxx) ?",
    "Le Fa complet (133211) reprend quelle forme ?",
  ]) assert.ok(enonceAvecDoigte({ q }), q);
});

test("doigté dans l'énoncé : pas de faux positif sur les nombres ordinaires", () => {
  for (const q of [
    "Pour l'accord de La majeur, depuis quelle corde grattes-tu ?",
    "À 120 BPM, combien de croches par seconde ?",
    "Dans une tab, 5h7 sur la corde 3 signifie…",
    "En 12/8, combien de pulsations ?",
    "Que joue-t-on en case 10 puis 12 ?",
  ]) assert.ok(!enonceAvecDoigte({ q }), q);
  assert.ok(!NOTATION_DOIGTE.test("1234567"), "7 chiffres : ce n'est pas un doigté");
});

test("doigté dans l'énoncé : bloquant, sauf exception où décoder est la compétence", () => {
  const quiz = [qcm("q-x", "Sur La (x02220), quelle corde ?", ["Corde 5", "Corde 6"]), qcm("q-debut-24", "Que signifie la notation x32010 ?", ["A", "B"])];
  const err = controlerQuestionsCadeaux([], quiz);
  assert.equal(err.length, 1);
  assert.match(err[0], /^q-x : doigté « x02220 »/);
  assert.ok(DOIGTE_AUTORISE.has("q-debut-24"));
  assert.equal(controlerQuestionsCadeaux([], quiz, { doigteAutorise: new Set(["q-x", "q-debut-24"]) }).length, 0);
});

test("réponse sur la carte précédente : repérée (titre, texte, consigne, légende)", () => {
  const quiz = [qcm("q-t", "Quel doigt joue les cordes 6, 5 et 4 ?", ["L'index", "Le pouce"], 1)];
  const parId = new Map(quiz.map(q => [q.id, q]));
  for (const avant of [
    { type: "idee", titre: "Aux doigts", texte: ["Le pouce joue les trois cordes graves."] },
    { type: "idee", titre: "Le pouce", texte: ["Il joue les basses."] },
    { type: "a-toi", consigne: "Joue les basses avec LE POUCE." },
    { type: "idee", titre: "Aux doigts", texte: ["Regarde."], bloc: { type: "tab", caption: "Le pouce sur les basses", data: {} } },
  ]) {
    const r = reponsesDonneesAvant(lecon([avant, { type: "question", quizId: "q-t" }]), parId);
    assert.deepEqual(r, [{ index: 1, quizId: "q-t", reponse: "Le pouce" }], JSON.stringify(avant));
  }
  // Question écrite dans la carte (sans quizId) : même contrôle.
  const r = reponsesDonneesAvant(lecon([
    { type: "idee", titre: "Majeure", texte: ["La majeur : La, Do#, Mi."] },
    { type: "question", q: "Notes de La majeur ?", o: ["La, Do, Mi", "La, Do#, Mi"], a: 1, exp: "…" },
  ]));
  assert.equal(r.length, 1);
  assert.equal(r[0].quizId, null);
});

test("réponse sur la carte précédente : pas de faux positif", () => {
  const quiz = [
    qcm("q-app", "En Sol majeur, quelle est la 7e note ?", ["Fa#", "Fa"]),                // court (< 4)
    qcm("q-num", "Combien de temps en 3/4 ?", ["3", "4"]),                                 // purement numérique
    qcm("q-loin", "Quel doigt joue la corde 6 ?", ["Le pouce", "L'index"]),                // réponse 2 cartes avant
    qcm("q-mot", "Quel intervalle ?", ["Tierce mineure", "Tierce majeure"]),               // mots voisins, pas la réponse
  ];
  const parId = new Map(quiz.map(q => [q.id, q]));
  const r = reponsesDonneesAvant(lecon([
    { type: "idee", titre: "Le pouce", texte: ["Le pouce joue les basses."] },
    { type: "idee", titre: "Do majeur", texte: ["Sa 7e note est Si ; 3 temps en 3/4. Entre Sol et Si : une tierce majeure. Le mot mineure."] },
    { type: "question", quizId: "q-app" },
    { type: "question", quizId: "q-num" },
    { type: "question", quizId: "q-loin" },
    { type: "question", quizId: "q-mot" },
  ]), parId);
  assert.deepEqual(r, []);
});

test("réponse sur la carte précédente : comparaison sans accents, casse ni ponctuation", () => {
  assert.equal(normaliserTexte("Médiator, « à vide » !"), "mediator a vide");
  assert.equal(normaliserTexte("1-♭3-♭5"), "1 ♭3 ♭5", "le bémol reste : 1-♭3-♭5 ≠ 1-3-5");
  assert.equal(normaliserTexte("Do#"), "do#");
});

test("réponse sur la carte précédente : bloquant, sauf exception justifiée ; exception périmée signalée", () => {
  const quiz = [qcm("q-t", "Quel doigt ?", ["Le pouce", "L'index"])];
  const l = lecon([{ type: "idee", titre: "Le pouce", texte: ["…"] }, { type: "question", quizId: "q-t" }]);
  const err = controlerQuestionsCadeaux([l], quiz, { precedenteAutorisee: new Set() });
  assert.equal(err.length, 1);
  assert.match(err[0], /test-01\/carte 2 \(q-t\).*« Le pouce »/);
  const cle = cleCadeau("test-01", { index: 1, quizId: "q-t" });
  assert.equal(cle, "test-01>q-t");
  assert.deepEqual(controlerQuestionsCadeaux([l], quiz, { precedenteAutorisee: new Set([cle]) }), []);
  const perime = controlerQuestionsCadeaux([], quiz, { precedenteAutorisee: new Set([cle]) });
  assert.equal(perime.length, 1);
  assert.match(perime[0], /inutile/);
});

test("contenu réel : aucune question cadeau", () => {
  const lecons = COURSES.flatMap(c => c.lessons);
  assert.deepEqual(controlerQuestionsCadeaux(lecons, QUIZ), []);
  assert.equal(REPONSE_PRECEDENTE_AUTORISEE.size, 0, "toute exception doit être justifiée en commentaire dans cartes.js");
});

test("contenu réel : les cas corrigés pointent vers une question d'application", () => {
  const L = new Map(COURSES.flatMap(c => c.lessons).map(l => [l.id, l]));
  const Q = new Map(QUIZ.map(q => [q.id, q]));
  const carte = (lid, quizId) => (L.get(lid).cartes || []).some(c => c.quizId === quizId);
  // Énoncés réécrits sans notation, id conservé (même compétence).
  for (const id of ["q-harm-acc-new-01", "q-harm-acc-new-02", "q-harm-sept-new-01", "q-harm-fa-new-01", "q-harm-fa-new-02",
    "q-harm-fa-new-03", "q-neck-pow-new-01", "q-debut-30", "q-rhy-travis-01-lot3"]) {
    assert.ok(!enonceAvecDoigte(Q.get(id)), id);
  }
  // Quelques transferts : la carte explique un cas, la question en demande un autre.
  assert.ok(carte("scales-c2-02", "q-scales-01-app"));
  assert.equal(Q.get("q-scales-01-app").o[Q.get("q-scales-01-app").a], "Do#");
  assert.ok(carte("harm-c2-01", "q-harm-03"), "Si majeur après la carte sur La majeur");
  assert.ok(carte("impro-03b", "q-impro-06-app"));
  assert.ok(!carte("impro-03b", "q-impro-06"));
  // Questions remplacées sur la carte : toujours au quiz de la leçon (révision).
  assert.ok(L.get("debut-c1-03").quiz.includes("q-debut-10"));
  assert.ok(L.get("scales-c2-02").quiz.includes("q-scales-01"));
});
