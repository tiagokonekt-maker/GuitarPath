// Groply — screens/UnitCheckScreen.jsx
// Vérification de fin d'unité : un mini-quiz pioché dans les questions déjà
// associées aux leçons de l'unité (aucun contenu nouveau à créer, aucune
// note dupliquée). Tentatives illimitées. Sous le seuil, on propose de
// revoir les leçons concernées plutôt que de juste "recommencer".
//
// Différence volontaire avec QuizScreen : pas d'XP par question ici (ce
// n'est pas une session de quiz normale, c'est un contrôle d'accès) — les
// questions ratées rejoignent quand même wrongQuiz pour la révision espacée.
import { useState, useRef } from "react";
import { useC } from "../design/ThemeContext.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";
import {
  AnswerOption, Button, Eyebrow, Feedback, IconTile, ListGroup, ListRow,
  QuestionCard, ResultScreen, SessionBar,
} from "../design/ui.jsx";
import { vibrer } from "../design/hooks.js";
import { UNIT_CHECK_PASS_PCT, bonnesReponsesRequises } from "../store/pathEngine.js";
// Logique de composition de l'échantillon : voir store/unitCheckSampler.js.
// Extraite dans un module pur pour deux raisons — elle n'a rien de
// spécifique à React, et ça la rend testable par `node --test`, qui ne sait
// pas analyser un fichier .jsx.
import { buildSample, melangerOptions } from "../store/unitCheckSampler.js";

const REPERES = ["A", "B", "C", "D"];

export function UnitCheckScreen({ unit, content, dispatch, onDone, state }) {
  const C = useC();
  const completedLessons = state?.completedLessons ?? {};
  // Les questions de la tentative précédente, pour la rotation. Une ref et
  // non un état : les modifier ne doit pas provoquer de rendu.
  const derniereTentative = useRef([]);
  const [questions, setQuestions] = useState(() =>
    buildSample(unit, content, completedLessons).map(melangerOptions));
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState([]);
  const [finished, setFinished] = useState(false);

  // Cas défensif : unité sans aucun quiz associé — on valide directement
  // plutôt que de bloquer quelqu'un sur un écran vide.
  if (questions.length === 0) {
    dispatch({ type: "SUBMIT_UNIT_CHECK", unitId: unit.id, pct: 100, passPct: UNIT_CHECK_PASS_PCT, wrongIds: [] });
    onDone();
    return null;
  }

  const q = questions[idx];
  const answered = sel !== null;

  const choose = (i) => {
    if (answered) return;
    setSel(i);
    if (i === q.a) setScore(s => s + 1);
    else setWrongIds(w => [...w, q.id]);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      const pct = Math.round((score / questions.length) * 100);
      dispatch({ type: "SUBMIT_UNIT_CHECK", unitId: unit.id, pct, passPct: UNIT_CHECK_PASS_PCT, wrongIds });
      // Unité validée : le retour haptique accompagne les confettis.
      if (pct >= UNIT_CHECK_PASS_PCT) vibrer([12, 40, 18]);
      setFinished(true);
    } else {
      setSel(null);
      setIdx(i => i + 1);
    }
  };

  const retry = () => {
    // Nouvel échantillon à chaque tentative, en écartant les questions qu'on
    // vient de poser. C'est tout l'intérêt : réessayer doit vérifier la
    // compréhension, pas la mémoire des corrections.
    derniereTentative.current = questions.map(q => q.id);
    setQuestions(buildSample(unit, content, completedLessons, derniereTentative.current).map(melangerOptions));
    setIdx(0); setSel(null); setScore(0); setWrongIds([]); setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= UNIT_CHECK_PASS_PCT;
    const lessonsToReview = [...new Set(
      wrongIds.map(id => questions.find(qq => qq.id === id)?.lessonId).filter(Boolean)
    )].map(lid => unit.lessons.find(l => l.id === lid)).filter(Boolean);

    return (
      <div>
        <ResultScreen
          confetti={passed}
          pose={passed ? POSE_ROLE.reussite : POSE_ROLE.erreur} anim={passed ? "cheer" : "pop"} gropiSize={110}
          title={<h1 style={{ margin: 0, font: "inherit", letterSpacing: "inherit" }}>{passed ? "Unité validée !" : "Pas encore tout à fait"}</h1>}
          subtitle={passed
            ? "Le coffre de cette unité est maintenant à toi."
            : `Il faut ${bonnesReponsesRequises(questions.length)} bonnes réponses sur ${questions.length} pour valider l'unité. Tu peux réessayer, aucune limite de tentatives.`}
          stats={[{
            value: score, tone: passed ? "green" : "coral",
            label: `bonne${score > 1 ? "s" : ""} réponse${score > 1 ? "s" : ""} sur ${questions.length}`,
          }]}
          pct={pct} pctTone={passed ? "green" : "coral"}
          actions={passed ? (
            <Button size="lg" full icon="trophy" onClick={onDone}>Réclamer le coffre</Button>
          ) : (
            <>
              <Button size="lg" full onClick={onDone}>Revoir les leçons</Button>
              <Button size="lg" full variant="secondary" icon="refresh" onClick={retry}>Réessayer maintenant</Button>
            </>
          )}
        >
          {!passed && lessonsToReview.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Eyebrow tone="neutral" style={{ color: C.text2 }}>À revoir en priorité</Eyebrow>
              <ListGroup>
                {lessonsToReview.map(l => (
                  <ListRow key={l.id} title={l.title} lead={<IconTile icon="book-2" tone="neutral" size={36} />} />
                ))}
              </ListGroup>
            </div>
          )}
        </ResultScreen>
      </div>
    );
  }

  const juste = sel === q.a;
  return (
    <div className="gr-in-push" style={{ padding: "14px 20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <SessionBar onClose={onDone} current={idx + 1} total={questions.length} />

      <QuestionCard key={idx} eyebrow={`Vérification · ${unit.title}`}>{q.q}</QuestionCard>

      {/* `key` : les réponses d'une nouvelle question entrent en cascade. */}
      <div key={`reponses-${idx}`} className="gr-stagger" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {q.o.map((opt, i) => (
          <AnswerOption key={i} marker={REPERES[i]} locked={answered} onClick={() => choose(i)}
            etat={!answered ? "idle" : i === q.a ? "correct" : i === sel ? "wrong" : "muted"}>
            {opt}
          </AnswerOption>
        ))}
      </div>

      {answered && (
        <>
          {/* Réaction éclair de Gropi, sans bloquer « Continuer ». */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <Gropi key={juste ? "ok" : "ko"} pose={juste ? POSE_ROLE.bonne : POSE_ROLE.erreur} size={48} anim="pop" />
            <Feedback correct={juste} title={juste ? "Correct" : "Pas tout à fait"} style={{ flex: 1, minWidth: 0 }}>
              {q.exp}
            </Feedback>
          </div>
          <Button size="lg" full className="gr-in" iconRight="arrow-right" onClick={next}>
            {idx + 1 >= questions.length ? "Voir le résultat" : "Continuer"}
          </Button>
        </>
      )}
    </div>
  );
}
