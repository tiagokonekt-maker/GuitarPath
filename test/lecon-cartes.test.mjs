// Groply — test/lecon-cartes.test.mjs
// Leçons en cartes (src/lecon/cartes.js) : validation du format, navigation,
// reprise, retour des questions et passage en révision espacée — plus les
// 15 leçons « Premiers pas » réelles, qui doivent respecter le format.
import { test } from "node:test";
import assert from "node:assert/strict";
import { COURSES, QUIZ } from "../src/content/index.js";
import {
  validerCartes, resoudreQuestion, compterMots, texteDeCarte,
  bornerIndex, carteSuivante, cartePrecedente, estDerniere, progressionCartes, directionBalayage, libelleContinuer,
  cleReprise, lireReprise, ecrireReprise, effacerReprise, evaluerReponse, actionRevision,
  CARTES_MIN, CARTES_MAX, MOTS_MAX_IDEE,
} from "../src/lecon/cartes.js";
import { reducer } from "../src/store/reducer.js";
import { defaultState } from "../src/store/state.js";

const QUIZ_PAR_ID = new Map(QUIZ.map(q => [q.id, q]));

const leconValide = () => ({
  id: "test-01", gropiTip: "Un conseil.",
  cartes: [
    { type: "idee", titre: "Une idée", texte: ["Un paragraphe court."] },
    { type: "idee", titre: "Avec diagramme", texte: ["Regarde."], bloc: { type: "chord_diagram", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0] } } },
    { type: "question", q: "Combien de cordes ?", o: ["4", "6"], a: 1, exp: "Six cordes." },
    { type: "a-toi", consigne: "Joue.", bpm: 60, minuteur: 60 },
    { type: "question", quizId: "q-debut-01" },
    { type: "recap", points: ["Un", "Deux", "Trois"] },
  ],
});

// ── Validation ─────────────────────────────────────────────────────────────
test("validerCartes : une leçon bien formée passe, une leçon sans cartes n'est pas concernée", () => {
  const r = validerCartes(leconValide(), QUIZ_PAR_ID);
  assert.deepEqual(r.erreurs, []);
  assert.deepEqual(validerCartes({ id: "x", content: [] }, QUIZ_PAR_ID), { erreurs: [], alertes: [] });
});

test("validerCartes : chaque erreur de format est signalée", () => {
  const cas = [
    [l => { l.cartes[0].type = "texte"; }, /type inconnu/],
    [l => { delete l.cartes[0].titre; }, /sans titre/],
    [l => { l.cartes[0].texte = ["a", "b", "c", "d"]; }, /1 à 3 paragraphes/],
    [l => { l.cartes[1].bloc = { type: "video", data: {} }; }, /bloc de diagramme inconnu/],
    [l => { l.cartes[1].bloc = { type: "tab" }; }, /sans data/],
    [l => { l.cartes[2].a = 2; }, /hors bornes/],
    [l => { l.cartes[2].a = -1; }, /hors bornes/],
    [l => { l.cartes[2].o = ["6"]; }, /au moins 2 choix/],
    [l => { l.cartes[2].o = ["6", "6"]; l.cartes[2].a = 0; }, /choix en double/],
    [l => { delete l.cartes[2].exp; }, /explication/],
    [l => { l.cartes[4].quizId = "q-inexistante"; }, /introuvable/],
    [l => { l.cartes[4].q = "Réécrite ?"; }, /ne pas réécrire q/],
    [l => { delete l.cartes[3].consigne; }, /sans consigne/],
    [l => { l.cartes[3].bpm = 500; }, /bpm hors bornes/],
    [l => { l.cartes[3].minuteur = 2.5; }, /minuteur/],
    [l => { l.cartes[5].points = ["Un", "Deux"]; }, /exactement 3 points/],
    [l => { l.cartes.push({ type: "idee", titre: "Après", texte: ["x"] }); }, /recap, en dernier/],
    [l => { l.cartes = l.cartes.filter(c => c.type !== "question"); }, /au moins une carte question/],
    [l => { l.cartes = l.cartes.filter(c => c.type !== "a-toi"); }, /À toi de jouer/],
    [l => { l.cartes = []; }, /tableau non vide/],
  ];
  for (const [casser, motif] of cas) {
    const l = leconValide();
    casser(l);
    const { erreurs } = validerCartes(l, QUIZ_PAR_ID);
    assert.ok(erreurs.some(e => motif.test(e)), `${motif} attendu, obtenu : ${erreurs.join(" | ") || "aucune erreur"}`);
  }
});

test("validerCartes : avertissements non bloquants (idée trop longue, longue suite d'idées, nombre de cartes)", () => {
  const l = leconValide();
  l.cartes[0].texte = ["mot ".repeat(MOTS_MAX_IDEE + 1)];
  l.cartes.splice(1, 0, ...Array.from({ length: 5 }, (_, k) => ({ type: "idee", titre: `I${k}`, texte: ["x"] })));
  const { erreurs, alertes } = validerCartes(l, QUIZ_PAR_ID);
  assert.deepEqual(erreurs, []);
  assert.ok(alertes.some(a => /mots/.test(a)));
  assert.ok(alertes.some(a => /d'affilée sans question/.test(a)));
  assert.ok(alertes.some(a => /cartes \(cible/.test(a)));
});

test("compterMots ignore la ponctuation isolée", () => {
  assert.equal(compterMots("Bas, bas-haut : « et » 1 !"), 4);
  assert.equal(compterMots(""), 0);
});

// ── Navigation ─────────────────────────────────────────────────────────────
test("navigation : bornes, suivante, précédente, dernière, progression", () => {
  assert.equal(bornerIndex(-3, 9), 0);
  assert.equal(bornerIndex(42, 9), 8);
  assert.equal(bornerIndex("abc", 9), 0);
  assert.equal(bornerIndex(3, 0), 0);
  assert.equal(carteSuivante(8, 9), 8);
  assert.equal(carteSuivante(2, 9), 3);
  assert.equal(cartePrecedente(0, 9), 0);
  assert.equal(estDerniere(8, 9), true);
  assert.equal(estDerniere(7, 9), false);
  assert.deepEqual(progressionCartes(2, 9), { libelle: "3 / 9", pct: 33, numero: 3, total: 9 });
  assert.equal(progressionCartes(8, 9).pct, 100);
});

test("balayage : franchement horizontal seulement, gauche = suivante", () => {
  assert.equal(directionBalayage(-80, 10), "suivante");
  assert.equal(directionBalayage(90, -5), "precedente");
  assert.equal(directionBalayage(-40, 0), null);         // trop court
  assert.equal(directionBalayage(-80, 70), null);        // trop vertical (défilement)
});

test("libellé du bouton principal selon la carte", () => {
  assert.equal(libelleContinuer({ type: "idee" }), "Continuer");
  assert.equal(libelleContinuer({ type: "question" }, { repondue: false }), "Passer");
  assert.equal(libelleContinuer({ type: "question" }, { repondue: true }), "Continuer");
  assert.equal(libelleContinuer({ type: "a-toi" }), "C'est fait");
  assert.equal(libelleContinuer({ type: "recap" }, { derniere: true }), "Terminer la leçon · +30 XP");
  assert.equal(libelleContinuer({ type: "recap" }, { derniere: true, terminee: true }), "Retour au parcours");
});

// ── Reprise ────────────────────────────────────────────────────────────────
function faux() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k), m };
}

test("reprise : on retrouve la carte quittée, bornée au nombre de cartes actuel", () => {
  const s = faux();
  assert.equal(cleReprise("debut-c1-01"), "groply:lecon-carte:debut-c1-01");
  assert.equal(lireReprise(s, "debut-c1-01", 9), 0);
  ecrireReprise(s, "debut-c1-01", 4);
  assert.equal(lireReprise(s, "debut-c1-01", 9), 4);
  assert.equal(lireReprise(s, "debut-c1-01", 3), 2);     // la leçon a raccourci
  ecrireReprise(s, "debut-c1-01", 0);                    // retour au début : rien à garder
  assert.equal(s.m.size, 0);
  ecrireReprise(s, "debut-c1-01", 5);
  effacerReprise(s, "debut-c1-01");
  assert.equal(lireReprise(s, "debut-c1-01", 9), 0);
  s.setItem(cleReprise("x"), "n'importe quoi");
  assert.equal(lireReprise(s, "x", 9), 0);
});

test("reprise : un stockage absent ou qui lève ne casse rien", () => {
  const casse = { getItem() { throw new Error("bloqué"); }, setItem() { throw new Error("plein"); }, removeItem() { throw new Error("x"); } };
  assert.equal(lireReprise(casse, "a", 5), 0);
  assert.doesNotThrow(() => ecrireReprise(casse, "a", 2));
  assert.doesNotThrow(() => effacerReprise(null, "a"));
  assert.equal(lireReprise(undefined, "a", 5), 0);
});

// ── Questions ──────────────────────────────────────────────────────────────
test("question : retour immédiat, jamais bloquant, explication en cas d'erreur", () => {
  const q = resoudreQuestion({ type: "question", q: "?", o: ["A", "B", "C"], a: 1, exp: "Parce que B." }, QUIZ_PAR_ID);
  const bon = evaluerReponse(q, 1);
  assert.equal(bon.correct, true);
  assert.equal(bon.pose, "happy");
  const faux_ = evaluerReponse(q, 2);
  assert.equal(faux_.correct, false);
  assert.equal(faux_.pose, "think");
  assert.match(faux_.message, /« B »/);
  assert.match(faux_.message, /Parce que B/);
  assert.equal(evaluerReponse(q, undefined), null);
});

test("question liée au quiz : l'énoncé vient du quiz, jamais d'une copie", () => {
  const q = resoudreQuestion({ type: "question", quizId: "q-debut-05" }, QUIZ_PAR_ID);
  const src = QUIZ_PAR_ID.get("q-debut-05");
  assert.deepEqual(q, { quizId: "q-debut-05", q: src.q, o: src.o, a: src.a, exp: src.exp });
  assert.equal(resoudreQuestion({ type: "question", quizId: "q-debut-05" }, new Map()), null);
  assert.equal(resoudreQuestion({ type: "idee" }, QUIZ_PAR_ID), null);
});

test("révision espacée : REVIEW_ANSWER sans XP, une fois par jour, pas pour une question locale", () => {
  const q = resoudreQuestion({ type: "question", quizId: "q-debut-05" }, QUIZ_PAR_ID);
  const a = actionRevision(q, false, {}, "2026-10-15");
  assert.equal(a.type, "REVIEW_ANSWER");
  assert.equal(a.questionId, "q-debut-05");
  assert.equal(a.xp, 0);
  assert.equal(a.history["q-debut-05"].attempts, 1);
  assert.equal(a.history["q-debut-05"].due, "2026-10-15");         // ratée : à revoir tout de suite
  assert.equal(actionRevision(q, true, a.history, "2026-10-15"), null);   // déjà vue aujourd'hui
  const b = actionRevision(q, true, a.history, "2026-10-16");
  assert.equal(b.history["q-debut-05"].attempts, 2);
  assert.equal(actionRevision({ quizId: null, q: "?", o: ["a", "b"], a: 0 }, true, {}, "2026-10-15"), null);

  // Le réducteur l'accepte comme une réponse de révision ordinaire.
  const s0 = defaultState();
  const s1 = reducer(s0, b);
  assert.equal(s1.reviewHistory["q-debut-05"].attempts, 2);
  assert.equal(s1.xp, s0.xp);
});

// ── Le contenu réel ───────────────────────────────────────────────────────
const debut = COURSES.find(c => c.id === "debut");

test("les 15 leçons « Premiers pas » sont en cartes et respectent le format", () => {
  assert.equal(debut.lessons.length, 15);
  for (const l of debut.lessons) {
    assert.ok(Array.isArray(l.cartes), `${l.id} : cartes`);
    assert.equal(l.content, undefined, `${l.id} : content retiré (une seule version du texte)`);
    const { erreurs, alertes } = validerCartes(l, QUIZ_PAR_ID);
    assert.deepEqual(erreurs, [], l.id);
    assert.deepEqual(alertes, [], l.id);
    assert.ok(l.cartes.length >= CARTES_MIN && l.cartes.length <= CARTES_MAX, `${l.id} : ${l.cartes.length} cartes`);
    assert.ok(l.cartes.some(c => c.type === "a-toi"), `${l.id} : À toi de jouer`);
    assert.ok(l.gropiTip, `${l.id} : gropiTip`);
    // Les questions liées au quiz citent les questions de CETTE leçon.
    for (const c of l.cartes.filter(c => c.quizId)) assert.ok(l.quiz.includes(c.quizId), `${l.id} : ${c.quizId}`);
    for (const c of l.cartes) assert.ok(c.type === "question" || texteDeCarte(c).trim(), `${l.id} : carte vide`);
  }
});
