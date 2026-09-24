import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSample, melangerOptions } from "../src/store/unitCheckSampler.js";
import { buildUnits } from "../src/store/pathEngine.js";

// ── Fixture : contenu réaliste sur plusieurs paliers ────────────────────
// Un seul module, pour isoler ce qu'on teste (la logique de rappel
// inter-paliers) de la logique de rotation par module de pathEngine,
// déjà couverte ailleurs (test/path.test.mjs).
function faireLecons(palier, n, quizParLecon = 1) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push({
      id: `l${palier}-${i}`, level: palier, title: `Leçon ${palier}.${i}`,
      quiz: Array.from({ length: quizParLecon }, (_, k) => `q${palier}-${i}-${k}`),
    });
  }
  return out;
}

function contenuMultiPaliers({ quizParLecon = 1 } = {}) {
  const courses = [{
    id: "neck", title: "Manche",
    lessons: [
      ...faireLecons(1, 4, quizParLecon),
      ...faireLecons(2, 6, quizParLecon),
      ...faireLecons(3, 7, quizParLecon),
    ],
  }];
  const quiz = courses[0].lessons.flatMap(l => l.quiz.map(qid => ({
    id: qid, courseId: "neck", lessonId: l.id, lvl: 1,
    q: `Question ${qid}`, o: ["a", "b", "c", "d"], a: 0, exp: "explication",
  })));
  return { courses, quiz };
}

const completerJusquAvant = (courses, palier) => {
  const completed = {};
  for (const l of courses[0].lessons.filter(l => l.level < palier)) {
    completed[l.id] = "2026-01-01";
  }
  return completed;
};

// ── La contrainte non négociable ─────────────────────────────────────────
test("buildSample ne pioche JAMAIS une question dont la leçon d'origine n'est pas complétée", () => {
  const content = contenuMultiPaliers({ quizParLecon: 2 });
  const units = buildUnits(content.courses);
  const u3 = units.find(u => u.level === 3);

  // Palier 1 complété, palier 2 PAS complété : ses questions ne doivent
  // jamais apparaître, ni en rappel ni en renfort, même si palier 2 est
  // strictement antérieur au palier 3 en cours de vérification.
  const completed = {};
  for (const l of content.courses[0].lessons.filter(l => l.level === 1)) {
    completed[l.id] = "2026-01-01";
  }

  const lessonById = new Map(content.courses[0].lessons.map(l => [l.id, l]));
  const quizById = new Map(content.quiz.map(q => [q.id, q]));

  for (let essai = 0; essai < 20; essai++) {
    const echantillon = buildSample(u3, content, completed);
    for (const q of echantillon) {
      const lesson = lessonById.get(quizById.get(q.id)?.lessonId ?? q.lessonId);
      assert.ok(
        lesson && (lesson.level === 3 || completed[lesson.id]),
        `${q.id} vient de ${lesson?.id} (palier ${lesson?.level}), non complétée — fuite de contenu non étudié`
      );
    }
  }
});

test("le rappel ne dépasse jamais 3 questions, même quand le cœur de l'unité est petit", () => {
  // Cœur volontairement pauvre (une seule question par leçon, unité de
  // 5 leçons après découpage), rappel volontairement riche (17 questions
  // disponibles sur les paliers 1 et 2, tous complétés) — exactement le
  // scénario qui, dans une version antérieure de cette fonction, faisait
  // déborder le rappel à 10 questions sur 15 pour compenser un cœur trop
  // petit. Plus jamais : 3 est un plafond dur.
  const content = contenuMultiPaliers();
  content.courses[0].lessons.push(...faireLecons(4, 10));
  content.quiz.push(...faireLecons(4, 10).flatMap(l => l.quiz.map(qid => ({
    id: qid, courseId: "neck", lessonId: l.id, lvl: 1,
    q: `Question ${qid}`, o: ["a","b","c","d"], a: 0, exp: "e",
  }))));

  const units = buildUnits(content.courses);
  const u4 = units.find(u => u.level === 4);
  const completed = completerJusquAvant(content.courses, 4);

  const lessonById = new Map(content.courses[0].lessons.map(l => [l.id, l]));
  const quizById = new Map(content.quiz.map(q => [q.id, q]));

  for (let essai = 0; essai < 10; essai++) {
    const echantillon = buildSample(u4, content, completed);
    const rappels = echantillon.filter(q => {
      const lesson = lessonById.get(quizById.get(q.id)?.lessonId);
      return lesson && lesson.level < 4;
    });
    assert.ok(rappels.length <= 3, `${rappels.length} questions de rappel — jamais plus de 3`);
  }
});

test("aucun rappel sur le tout premier palier (rien à rappeler)", () => {
  const content = contenuMultiPaliers();
  const units = buildUnits(content.courses);
  const u1 = units.find(u => u.level === 1);
  const echantillon = buildSample(u1, content, {});
  const lessonById = new Map(content.courses[0].lessons.map(l => [l.id, l]));
  const quizById = new Map(content.quiz.map(q => [q.id, q]));
  for (const q of echantillon) {
    const lesson = lessonById.get(quizById.get(q.id)?.lessonId);
    assert.equal(lesson.level, 1, "aucune question ne peut venir d'un palier antérieur au tout premier");
  }
});

test("l'échantillon atteint la cible (15) quand le cœur de l'unité est assez fourni", () => {
  // Reproduit l'ordre de grandeur du contenu réel (plusieurs questions par
  // leçon), où la cible doit être pleinement atteignable.
  const content = contenuMultiPaliers({ quizParLecon: 3 });
  const units = buildUnits(content.courses);
  const u3 = units.find(u => u.level === 3);
  const completed = completerJusquAvant(content.courses, 3);
  const echantillon = buildSample(u3, content, completed);
  assert.equal(echantillon.length, 15);
});

test("jamais de doublon dans un échantillon", () => {
  const content = contenuMultiPaliers({ quizParLecon: 3 });
  const units = buildUnits(content.courses);
  const u3 = units.find(u => u.level === 3);
  const completed = completerJusquAvant(content.courses, 3);
  for (let essai = 0; essai < 10; essai++) {
    const echantillon = buildSample(u3, content, completed);
    assert.equal(new Set(echantillon.map(q => q.id)).size, echantillon.length);
  }
});

test("la rotation écarte en priorité les questions de la tentative précédente", () => {
  const content = contenuMultiPaliers({ quizParLecon: 3 });
  const units = buildUnits(content.courses);
  const u3 = units.find(u => u.level === 3);
  const completed = completerJusquAvant(content.courses, 3);
  const t1 = buildSample(u3, content, completed);
  const t2 = buildSample(u3, content, completed, t1.map(q => q.id));
  const ids1 = new Set(t1.map(q => q.id));
  const recouvrement = t2.filter(q => ids1.has(q.id)).length / t1.length;
  assert.ok(recouvrement < 0.5, `recouvrement de ${Math.round(recouvrement*100)}% — la rotation doit varier l'échantillon`);
});

test("une unité sans aucun quiz associé renvoie un échantillon vide, sans planter", () => {
  const unit = { id: "u-vide", level: 1, courseIds: ["neck"], lessons: [{ id: "l1", level: 1, quiz: [] }], checkSize: 15 };
  const content = { courses: [{ id: "neck", lessons: unit.lessons }], quiz: [] };
  assert.doesNotThrow(() => buildSample(unit, content, {}));
  assert.equal(buildSample(unit, content, {}).length, 0);
});

// ── Mélange des propositions ──────────────────────────────────────────────
test("melangerOptions déplace la bonne réponse sans changer sa valeur", () => {
  const q = { id: "q1", o: ["A", "B", "C", "D"], a: 2 };
  let dejaDeplace = false;
  for (let i = 0; i < 30; i++) {
    const m = melangerOptions(q);
    assert.equal(m.o[m.a], "C", "la bonne réponse doit toujours être 'C', quel que soit son nouveau rang");
    assert.equal(new Set(m.o).size, 4, "aucune option perdue ni dupliquée");
    if (m.a !== q.a) dejaDeplace = true;
  }
  assert.ok(dejaDeplace, "sur 30 essais, la position aurait dû changer au moins une fois");
});

test("melangerOptions ne mute jamais la question d'origine", () => {
  const q = { id: "q1", o: ["A", "B", "C", "D"], a: 0 };
  const original = JSON.stringify(q);
  melangerOptions(q);
  assert.equal(JSON.stringify(q), original, "la banque de contenu est partagée, jamais mutée");
});
