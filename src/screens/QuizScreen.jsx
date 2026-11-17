// Groply — screens/QuizScreen.jsx
import { useState } from "react";
import { MODULE, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import {
  AnswerOption, Button, Card, EmptyState, Eyebrow, Feedback, IconTile,
  ProgressBar, QuestionCard, ResultScreen, ScreenHero, SessionBar,
} from "../design/ui.jsx";
import { vibrer } from "../design/hooks.js";
import { Gropi } from "../design/Gropi.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";
import { makeEarQuizQuestion, loadAudio } from "../audioEngine.js";
import { makeShapeQuestion } from "../music/shapeQuestions.js";
import { buildReviewSession } from "../store/reviewEngine.js";

// ── Composants de rendu injectés par contexte ─────────────────────────────
// Avant, App.jsx MUTAIT ce module au démarrage (`setXxx(...)`) : un singleton
// mutable au niveau module, avec des gardes défensives qui trahissaient la
// fragilité — si un écran se rendait avant l'injection, le composant valait
// null. Un contexte React rend l'ordre de rendu sans importance.
import { useRenderers } from "../renderers.jsx";

// ── Données modules quiz ──────────────────────────────────────────────────────
// Icône, teinte et libellé viennent de la palette des modules (tokens.js).
const MODULES = ["debut", "neck", "scales", "harmony", "rhythm", "impro"]
  .map(id => ({ id, label: MODULE[id].label, icon: MODULE[id].icon, tone: MODULE[id].color }));

const LETTRES = ["A", "B", "C", "D"];

// ── QuizScreen ────────────────────────────────────────────────────────────────
/**
 * Niveau de question débloqué pour un module, d'après la progression RÉELLE
 * dans ce module (leçons terminées), pas le niveau XP global.
 *
 * Le niveau XP est un mauvais indicateur ici : il monte avec n'importe quelle
 * activité (pratique, séries, exercices), pas spécifiquement avec l'avancée
 * en harmonie. Une personne qui a beaucoup joué mais peu avancé en théorie
 * aurait un niveau XP élevé sans connaître pour autant les accords de 7e.
 *
 * On ne RESTREINT pas aux questions du niveau atteint : on autorise tout ce
 * qui va de 1 jusqu'à ce niveau. Les questions de base restent donc
 * éligibles au tirage même une fois le niveau 3 débloqué — revoir les
 * fondamentaux doit rester possible tout au long de la progression, pas
 * seulement au début.
 */
function unlockedQuizLvl(state, content, courseId) {
  const course = content.courses.find(c => c.id === courseId);
  if (!course || !course.lessons.length) return 1;
  const done = course.lessons.filter(l => state.completedLessons[l.id]).length;
  const frac = done / course.lessons.length;
  if (frac < 0.30) return 1;
  if (frac < 0.65) return 2;
  return 3;
}

/**
 * @param embedded  true quand l'écran est affiché dans l'onglet Pratique :
 *                  on masque alors son grand en-tête image et son titre,
 *                  puisque l'écran hôte les fournit déjà. Sans ça, trois
 *                  strates d'en-tête s'empilaient avant le premier contenu.
 */
function QuizScreen({ state, dispatch, content, embedded = false }) {
  const C = useC();
  const [showModules, setShowModules] = useState(false);
  const [mode, setMode] = useState(null);

  const totalAnswered = Object.keys(state.quizResults).length;
  const totalQ        = content.quiz.length;
  const pctDone       = totalQ ? Math.round(totalAnswered / totalQ * 100) : 0;
  const wrongCount    = state.wrongQuiz.length;

  // Cache : la progression d'un module ne change pas pendant l'affichage
  // du quiz, pas la peine de la recalculer à chaque question.
  const unlockedLvl = {};
  MODULES.forEach(m => { unlockedLvl[m.id] = unlockedQuizLvl(state, content, m.id); });

  // Une question dont le module n'a pas de niveau connu (rare, contenu
  // importé par exemple) reste éligible plutôt que d'être bloquée : mieux
  // vaut une question mal calibrée qu'un quiz vide.
  const isUnlocked = (q) => (q.lvl ?? 1) <= (unlockedLvl[q.courseId] ?? 3);

  const pools = {
    // Avant : les 3 premières questions ratées (dans l'ordre du tableau,
    // pas par urgence) + 4 fraîches au hasard. Ça ne tenait jamais compte
    // du VRAI calendrier de révision espacée (streak, intervalle 1/4/10/30
    // jours) déjà calculé ailleurs pour l'affichage — juste ignoré ici.
    // Maintenant : le moteur SM-2 choisit vraiment, priorité par urgence.
    daily: () => {
      const eligible = content.quiz.filter(isUnlocked);
      // Pool de secours : contenu d'un cran au-dessus du niveau debloque,
      // utilise SEULEMENT si les questions dues ne remplissent pas la
      // session. Sans ca, quelqu'un qui a tout maitrise reboucle sur les
      // memes 2 questions a chaque lancement. On borne volontairement a
      // +1 niveau : donner un apercu de la suite, jamais sauter des etapes.
      const lookahead = content.quiz.filter(q => {
        const cap = unlockedLvl[q.courseId] ?? 3;
        const lvl = q.lvl ?? 1;
        return lvl === cap + 1;
      });
      const { questions } = buildReviewSession(eligible, state.reviewHistory, state.completedLessons, {
        targetCount: 7,
        lookaheadQuestions: lookahead,
      });
      return questions;
    },
  };
  MODULES.forEach(m => {
    pools[m.id] = () => content.quiz
      .filter(q => q.courseId===m.id && isUnlocked(q))
      .sort(() => Math.random()-.5).slice(0,7);
  });

  const launch = (id, label) => setMode({ id, label, pool: pools[id]() });

  if (mode) {
    const player = (
      <QuizPlayer pool={mode.pool} title={mode.label} state={state} dispatch={dispatch} content={content} onDone={() => setMode(null)} />
    );
    // Intégré : l'hôte (onglet Pratique) a déjà sa marge latérale de 16 px ;
    // on la rend au lecteur pour ne pas l'empiler avec la sienne.
    return embedded ? <div style={{ margin: "0 -16px" }}>{player}</div> : player;
  }

  return (
    <div>
      {/* En-tête masqué en mode intégré : l'hôte le fournit. */}
      {!embedded && (
        <ScreenHero
          image="/ocean.jpg" color="#36b3d7" overlay="rgba(0,60,80,.50)" position="center 30%"
          title="Quiz" subtitle={`${totalAnswered} / ${totalQ} questions répondues`}
        >
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{pctDone}% maîtrisé</span>
              {wrongCount > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.88)" }}>{wrongCount} à réviser</span>}
            </div>
            <ProgressBar pct={pctDone} color={C.teal} track="rgba(255,255,255,.3)" />
          </div>
        </ScreenHero>
      )}

      <div className="gr-stagger" style={{ padding: embedded ? "4px 0 24px" : "16px 16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Eyebrow tone="neutral" style={{ color: C.text3, margin: "0 4px" }}>Aujourd'hui</Eyebrow>

        {/* Quiz du jour : le fil directeur de l'écran. */}
        <Card onClick={() => launch("daily","Quiz du jour")} tone="primary" soft
          style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <IconTile icon="star" tone="primary" solid size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow style={{ marginBottom: 3 }}>Recommandé · 7 questions</Eyebrow>
            <div style={{ fontSize: T.lead, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }}>Quiz du jour</div>
            <div style={{ fontSize: 12, color: C.text2, marginTop: 2 }}>Adapté à ta progression · ~5 min</div>
          </div>
          <Ti name="arrow-right" size={20} color={C.primaryInk} />
        </Card>

        {/* ── EXPLORER PAR MODULE — replié ─────────────────────────────────
            La grille de 5 cartes avec barres de progression a été retirée :
            c'était de l'information de SUIVI (16% en Manche, 7% en Gammes)
            sur laquelle on n'agit pas, affichée en permanence sur un écran
            d'ACTION. Ces chiffres appartiennent à l'écran Progrès.
            Ce qui reste ici est la seule chose actionnable : choisir un
            module pour le travailler. Replié, parce que le fil directeur
            c'est "Quiz du jour" — le reste est une exploration volontaire. */}
        <button
          onClick={() => setShowModules(v => !v)}
          className="gr-squish gr-focus"
          style={{
            alignSelf: "flex-start", minHeight: 44, background: "none", border: "none",
            padding: "0 4px", display: "flex", alignItems: "center", gap: 7,
            fontFamily: "inherit", textAlign: "left",
          }}>
          <Ti name={showModules ? "chevron-down" : "chevron-right"} size={16} color={C.text3} />
          <span style={{ fontSize: T.micro, fontWeight: 700, color: C.text3, letterSpacing: ".07em", textTransform: "uppercase" }}>
            Cibler un module
          </span>
        </button>

        {showModules && (
          <div className="gr-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {MODULES.map(m => {
              const total = content.quiz.filter(q => q.courseId===m.id && isUnlocked(q)).length;
              if (total === 0) return null;
              return (
                <Card key={m.id} onClick={() => launch(m.id, m.label)} tone={m.tone} pad="10px 12px"
                  style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconTile icon={m.icon} tone={m.tone} size={36} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{m.label}</span>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── QuizPlayer ────────────────────────────────────────────────────────────────
function QuizPlayer({ pool, title, state, dispatch, content, onDone }) {
  const { FretboardQuizQuestion } = useRenderers();
  const C = useC();
  // On glisse 2 questions d'oreille dans la série, à des positions
  // aléatoires. Le quiz devient multimodal : parfois de la théorie, parfois
  // « quel intervalle entends-tu ? ». C'est cette imprévisibilité qui le
  // rend vivant, plutôt qu'une suite homogène de QCM.
  const [questions] = useState(() => {
    const base = [...pool];
    if (base.length < 3) return base;
    // Même logique que le reste du quiz : la progression réelle en
    // harmonie décide, pas le niveau XP global (qui monte avec n'importe
    // quelle activité, pas spécifiquement avec l'avancée en accords).
    // shapeQuestions.js n'accepte que 1 à 4 : le niveau 3 "gammes/triades
    // complètes" du reste du quiz devient le palier 3 des formes (positions
    // hors du jeu ouvert), et le palier 4 (7e, add9) n'apparaît qu'une fois
    // le module vraiment avancé.
    // unlockedQuizLvl est appelée directement ici, pas via une variable du
    // composant parent (QuizScreen) : QuizPlayer est un composant séparé,
    // qui ne reçoit pas cette variable en prop.
    const harmonyLvl = unlockedQuizLvl(state, content, "harmony");
    const harmonyDone = content.courses.find(c => c.id === "harmony")?.lessons
      .filter(l => state.completedLessons[l.id]).length ?? 0;
    const harmonyTotal = content.courses.find(c => c.id === "harmony")?.lessons.length || 1;
    const shapeLevel = harmonyLvl < 3 ? harmonyLvl
      : (harmonyDone / harmonyTotal) > 0.85 ? 4 : 3;
    const ears = [
      makeEarQuizQuestion("interval"),
      makeEarQuizQuestion("chord_quality"),
      makeShapeQuestion(shapeLevel),
    ].filter(Boolean);
    for (const e of ears) {
      // Jamais en première position : on laisse l'utilisateur entrer dans le
      // quiz avant de lui demander d'activer le son.
      const at = 1 + Math.floor(Math.random() * base.length);
      base.splice(at, 0, e);
    }
    return base;
  });
  const [idx, setIdx]   = useState(0);
  const [sel, setSel]   = useState(null);
  const [fretAnswered, setFretAnswered] = useState(false);
  const [fretCorrect,  setFretCorrect]  = useState(null);
  const [score, setScore]   = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return (
    <EmptyState action={<Button onClick={onDone}>Retour</Button>}>
      Aucune question disponible.
    </EmptyState>
  );

  const q = questions[idx];
  const isFretQ  = q.type === "fretboard";
  const answered = isFretQ ? fretAnswered : sel !== null;
  // Une session de révision réussie (≥ 60 %) se fête comme un sans-faute.
  const isReview = /révision/i.test(title);

  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const ok = i === q.a;
    if (ok) setScore(s => s+1);
    dispatch({ type:"QUIZ_ANSWER", id:q.id, correct:ok, xp:q.xp||30 });
    dispatch({ type:"MARK_STREAK" });
    dispatch({ type:"UPDATE_WEEKLY", field:"quizzes" });
  };

  const handleFretComplete = (result) => {
    const ok = result.complete;
    setFretAnswered(true); setFretCorrect(ok);
    if (ok) setScore(s => s+1);
    dispatch({ type:"QUIZ_ANSWER", id:q.id, correct:ok, xp:q.xp||40 });
    dispatch({ type:"MARK_STREAK" });
    dispatch({ type:"UPDATE_WEEKLY", field:"quizzes" });
  };

  const next = () => {
    if (idx+1 >= questions.length) {
      setFinished(true);
      if (score === questions.length || (isReview && score / questions.length >= 0.6)) vibrer([12, 40, 18]);
      dispatch({ type:"QUIZ_SESSION_DONE", id:title, title, xp:score*30, score:`${score}/${questions.length}` });
    } else {
      setSel(null); setFretAnswered(false); setFretCorrect(null);
      setIdx(i => i+1);
    }
  };

  if (finished) {
    const pct      = Math.round(score/questions.length*100);
    const isPerfect = score === questions.length;
    const isGood    = pct >= 60;
    const redeemed  = isReview && isGood;            // questions ratées enfin réussies
    const pose      = redeemed ? "pride" : isPerfect ? "celebrate" : isGood ? "happy" : "think";
    const anim      = (redeemed || isPerfect) ? "cheer" : "pop";
    const heading   = redeemed ? "Tu as enfin réussi !" : isPerfect ? "Parfait !" : isGood ? "Très bien !" : "Continue !";
    const subtitle  = redeemed
      ? "Ces questions te résistaient, et tu les as enfin eues. Gropi est fier de toi."
      : isPerfect
      ? "Toutes les réponses correctes. Gropi est fier de toi."
      : isGood
      ? "Bon travail ! Les questions ratées reviendront en révision."
      : "Pas de panique, les erreurs repassent dans la révision intelligente.";
    const xpEarned  = score * 30;

    return (
      <ResultScreen
        pose={pose} anim={anim} gropiSize={(isPerfect||redeemed) ? 160 : 120}
        confetti={isPerfect || redeemed}
        title={heading} subtitle={subtitle}
        stats={[
          { value: score, label: "Correctes", tone: "green" },
          { value: questions.length-score, label: "À revoir", tone: "neutral" },
          { value: xpEarned, label: "XP", tone: "primary", prefix: "+" },
        ]}
        pct={pct} pctTone={isPerfect ? "green" : isGood ? "primary" : "pink"}
        actions={<Button size="lg" full onClick={onDone}>Retour</Button>}
      />
    );
  }

  const linkedLesson = q.lessonId ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===q.lessonId) : null;
  const linkedCourse = q.courseId ? content.courses.find(c=>c.id===q.courseId) : null;
  const last = idx+1 >= questions.length;
  const etatDe = (i) => !answered ? "idle" : i === q.a ? "correct" : i === sel ? "wrong" : "muted";

  return (
    <div className="gr-in-push" style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <SessionBar onClose={onDone} current={idx+1} total={questions.length}
        pct={(idx + (answered ? 1 : 0)) / questions.length * 100} />

      <QuestionCard key={idx} eyebrow={<>
        {linkedCourse?.title} · Niv. {q.lvl}
        {isFretQ && <span style={{ marginLeft: 6, color: C.amberInk }}>· Manche</span>}
      </>}>
        {q.q}
      </QuestionCard>

      {/* Bouton d'écoute — questions d'oreille uniquement */}
      {q.type === "ear" && (
        <Button variant="soft" size="lg" full icon="volume" onClick={async () => { await loadAudio(); q.play?.(); }}>
          Écouter
        </Button>
      )}

      {/* Fretboard ou QCM */}
      {isFretQ ? (
        <>
          {FretboardQuizQuestion && <FretboardQuizQuestion question={q} onComplete={handleFretComplete} answered={fretAnswered} />}
          {fretAnswered && (
            <FeedbackBox ok={fretCorrect} xp={q.xp||40} exp={q.exp} lesson={null} onNext={next} last={last} />
          )}
        </>
      ) : (
        <>
          <div key={idx} className="gr-stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.o.map((opt, i) => (
              <AnswerOption key={i} etat={etatDe(i)} marker={LETTRES[i]} locked={answered} onClick={() => choose(i)}>
                {opt}
              </AnswerOption>
            ))}
          </div>
          {answered && (
            <FeedbackBox ok={sel===q.a} xp={q.xp||30} exp={q.exp||q.x} lesson={linkedLesson} onNext={next} last={last} />
          )}
        </>
      )}
    </div>
  );
}

// ── Retour après une réponse ──────────────────────────────────────────────────
function FeedbackBox({ ok, xp, exp, lesson, onNext, last }) {
  return (
    <Feedback
      correct={ok}
      title={ok ? `Correct · +${xp} XP` : "Pas tout à fait…"}
      action={
        <Button size="lg" full tone={ok ? "green" : "primary"} iconRight={last ? undefined : "arrow-right"} onClick={onNext}>
          {last ? "Voir les résultats" : "Suivant"}
        </Button>
      }
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {exp}
          {lesson && <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6 }}>Pour approfondir : <em>{lesson.title}</em></div>}
        </div>
        {/* Gropi réagit sans ralentir : petite taille, aucune attente avant
            « Suivant ». Content si c'est juste, pensif sinon — jamais moqueur. */}
        <Gropi key={ok ? "ok" : "ko"} pose={ok ? POSE_ROLE.bonne : POSE_ROLE.erreur} size={40} anim="pop" />
      </div>
    </Feedback>
  );
}

export { QuizScreen, QuizPlayer };
