// Groply — onboarding/OnboardingScreen.jsx
// Onboarding avec test de placement adaptatif obligatoire (comme un vrai
// test de niveau, façon langues — A1 à B2) + objectif + temps dispo.
//
// Le test réutilise les quiz existants (déjà tagués courseId + lvl 1-3),
// aucune question n'est inventée. Aucune leçon n'est jamais cochée comme
// acquise à la place de l'utilisateur : le résultat sert à RÉORDONNER le
// Parcours et à adapter le ton de Gropi, jamais à sauter du contenu.
//
// Props :
//   content              — { courses, quiz, exercises } — nécessaire pour piocher les questions
//   onComplete(answers)  — appelé à la fin
//   onEvent(name, props) — instrumentation analytics (funnel, drop-off)

import { useState, useEffect, useMemo } from "react";
import { FONTS, T, MODULE } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { vibrer } from "../design/hooks.js";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";
import {
  AnswerOption, Button, Card, Eyebrow, Feedback, Gauge, IconTile, ListGroup, ListRow,
  QuestionCard, ResultScreen, SessionBar, Tag,
} from "../design/ui.jsx";
import { FretboardQuizQuestion } from "../Fretboard.jsx";
import {
  TESTABLE_MODULES, startFromScore, TIER_VALUE,
  buildPlacementQueue, pickPlacementQuestion,
  computeModuleTier, inferMissingTier, computeOverallTier, weakestModule,
  availableModules, placementQuestionCount,
} from "../store/placementEngine.js";

const GOAL_OPTIONS = [
  { id: "impro",   module: "impro",   label: "Improviser librement",                icon: "wand" },
  { id: "theorie", module: "harmony", label: "Comprendre la théorie en profondeur", icon: "stack-2" },
  { id: "manche",  module: "neck",    label: "Maîtriser le manche",                 icon: "map-2" },
  { id: "global",  module: null,      label: "Un peu de tout, en équilibre",        icon: "sparkles" },
];

// Première question : « Tu joues déjà ? ». Le débutant complet saute le test
// de placement (15 questions de théorie n'auraient aucun sens pour lui) et
// démarre au module « Premiers pas ». Les deux autres réponses passent le
// test ; ces joueurs voient « Premiers pas » comme facultatif. La règle qui
// en découle côté Parcours est `debutFacultatif` (store/pathEngine.js) :
// débutant = test sauté (`skipped`) + niveau A1.
const EXPERIENCE_OPTIONS = [
  { id: "debutant", label: "Je débute complètement",       sub: "Jamais joué, ou presque",                    icon: "sparkles" },
  { id: "quelques", label: "Je connais quelques accords",  sub: "Je gratte un peu, sans trop de théorie",    icon: "guitar-pick" },
  { id: "confirme", label: "Je joue depuis un moment",     sub: "Je veux progresser à partir de mon niveau", icon: "music" },
];

const TIME_OPTIONS = [
  { id: "short",  label: "15–30 min / semaine" },
  { id: "medium", label: "30–60 min / semaine" },
  { id: "long",   label: "1h ou plus / semaine" },
];

// TESTABLE_MODULES inclut désormais l'impro (elle en était exclue faute de
// questions taguées). L'ancien `[...TESTABLE_MODULES, "impro"]` la ferait
// apparaître deux fois dans l'écran de résultat.
const ALL_PROFILE_MODULES = [...new Set([...TESTABLE_MODULES, "impro"])];

export function OnboardingScreen({ content, onComplete, onEvent }) {
  const C = useC();

  // phase : "welcome" → "experience" → "testIntro" → "testing" → "results" → "goal" → "time"
  //                                  ↘ "debutant" (test sauté) ────────────↗
  const [phase, setPhase] = useState("welcome");
  const [experience, setExperience] = useState(null);

  // ── Test de placement ────────────────────────────────────────────────
  // File fixe (facile → intermédiaire → difficile, une question par module),
  // construite une seule fois au lancement du test.
  const [queue, setQueue] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [currentQ, setCurrentQ] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);
  const [usedIds] = useState(() => new Set());
  // Bonnes réponses par module au fil du test (0 à 3 une fois terminé) —
  // remplace l'ancien pivotCorrect isolé.
  // Les modules testés sont DÉDUITS DU CONTENU, plus codés en dur. Depuis le
  // retag des questions q-impro-* (scripts/retag-impro.mjs), l'improvisation
  // entre dans le test : c'était l'objectif n°1 du produit et le seul module
  // jamais évalué.
  const modulesTestes = useMemo(() => availableModules(content?.quiz || []), [content]);
  const nbQuestions   = useMemo(() => placementQuestionCount(content?.quiz || []), [content]);
  const [results, setResults] = useState(() =>
    Object.fromEntries(TESTABLE_MODULES.map(m => [m, 0])));
  const [skillLevels, setSkillLevels] = useState({ neck: null, scales: null, harmony: null, rhythm: null, impro: null });
  const [overallTier, setOverallTier] = useState(null);
  const [weakest, setWeakest] = useState(null);

  // ── Objectif + temps ─────────────────────────────────────────────────
  const [goal, setGoal] = useState(null);
  const [timePerWeek, setTimePerWeek] = useState(null);

  const emit = (name, props) => { try { onEvent?.(name, props); } catch { /* noop */ } };
  const quizBank = content?.quiz || [];

  // ── Chargement d'une question depuis la file, à un index donné ───────
  function loadQuestion(idx, q) {
    const { moduleId, lvl } = q[idx];
    // La toute première question (Manche, palier facile) préfère une
    // question "manche interactif" — ouvrir le test sur quelque chose de
    // concret plutôt qu'un QCM de vocabulaire théorique.
    const preferFretboard = moduleId === "neck" && lvl === 1;
    const picked = pickPlacementQuestion(quizBank, moduleId, lvl, usedIds, preferFretboard);
    if (picked) usedIds.add(picked.id);
    setCurrentQ(picked);
    setSelected(null);
    setAnswered(false);
    setForceReveal(false);
  }

  function startTest() {
    emit("placement_test_started");
    setPhase("testing");
    const q = buildPlacementQueue(quizBank);
    setQueue(q);
    setQIdx(0);
    setResults(Object.fromEntries(TESTABLE_MODULES.map(m => [m, 0])));
    loadQuestion(0, q);
  }

  function recordAnswer(moduleId, correct) {
    setResults(prev => ({ ...prev, [moduleId]: prev[moduleId] + (correct ? 1 : 0) }));
  }

  function choose(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === currentQ.a;
    emit("placement_question_answered", { module: currentQ.moduleId, correct, questionId: currentQ.id });
    recordAnswer(currentQ.moduleId, correct);
  }

  // Réponse à une question "manche interactif" (fretboard) : le composant
  // gère lui-même sa sélection et son propre bouton Vérifier, il renvoie
  // juste le résultat une fois validé.
  function chooseFretboard(result) {
    if (answered) return;
    setAnswered(true);
    const correct = !!result?.complete;
    emit("placement_question_answered", { module: currentQ.moduleId, correct, questionId: currentQ.id, fretboard: true });
    recordAnswer(currentQ.moduleId, correct);
  }

  // "Je ne sais pas" : compte comme une réponse fausse pour le calcul du
  // niveau (aucune option n'est sélectionnée, donc aucune ne s'affiche en
  // rouge) — c'est un signal honnête, pas un échec à sanctionner.
  function chooseDontKnow() {
    if (answered) return;
    setSelected(null);
    setAnswered(true);
    emit("placement_question_answered", { module: currentQ.moduleId, correct: false, dontKnow: true, questionId: currentQ.id });
    recordAnswer(currentQ.moduleId, false);
  }

  function continueTest() {
    const nextIdx = qIdx + 1;
    if (nextIdx < queue.length) {
      setQIdx(nextIdx);
      loadQuestion(nextIdx, queue);
      return;
    }
    // File terminée : le niveau de chaque module vient du nombre de bonnes
    // réponses sur ses 3 questions (0 à 3), pas d'un pivot isolé.
    const newLevels = { ...skillLevels };
    for (const moduleId of modulesTestes) {
      const tier = computeModuleTier(results[moduleId]);
      newLevels[moduleId] = tier;
      emit("placement_module_result", { module: moduleId, tier, correctCount: results[moduleId] });
    }
    // Un module écarté faute de contenu suffisant reçoit la moyenne des
    // modules réellement testés — jamais une valeur inventée.
    const finalLevels = { ...newLevels };
    for (const m of TESTABLE_MODULES) {
      if (!modulesTestes.includes(m)) finalLevels[m] = inferMissingTier(finalLevels, modulesTestes);
    }
    const overall = computeOverallTier(finalLevels, modulesTestes);
    const weak = weakestModule(finalLevels, modulesTestes);
    setSkillLevels(finalLevels);
    setOverallTier(overall);
    setWeakest(weak);
    emit("placement_completed", { skillLevels: finalLevels, overallTier: overall, weakestModule: weak });
    vibrer([12, 40, 18]);
    setPhase("results");
  }

  // Filet de sécurité : si jamais le stock de questions manque pour un
  // module/niveau (ne devrait pas arriver vu le contenu actuel), on ne
  // bloque pas l'utilisateur — on passe à la question suivante plutôt que
  // de planter l'onboarding.
  useEffect(() => {
    if (phase === "testing" && queue && !currentQ) {
      const nextIdx = qIdx + 1;
      if (nextIdx < queue.length) { setQIdx(nextIdx); loadQuestion(nextIdx, queue); }
      else continueTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ, queue]);

  // Débutant complet : pas de test. Profil A1 partout (aucune valeur
  // inventée : c'est ce qu'il a déclaré), départ au niveau 1, et le
  // Parcours commence par le module « Premiers pas ».
  function chooseExperience() {
    emit("onboarding_experience", { experience });
    if (experience === "debutant") {
      setSkillLevels(Object.fromEntries(TESTABLE_MODULES.map(m => [m, "A1"])));
      setOverallTier("A1");
      setWeakest(null);
      setResults(Object.fromEntries(TESTABLE_MODULES.map(m => [m, 0])));
      setPhase("debutant");
      emit("onboarding_step_view", { step: "debutant" });
      return;
    }
    setPhase("testIntro");
  }

  function finish() {
    const goalOpt = GOAL_OPTIONS.find(g => g.id === goal);
    const debutant = experience === "debutant";
    const totalCorrect = debutant ? 0 : modulesTestes.reduce((sum, m) => sum + (results[m] || 0), 0);
    // Le dénominateur est le nombre de questions RÉELLEMENT posées, pas une
    // constante : sinon un module écarté faisait chuter le score de départ.
    const { startXp, startLevel } = startFromScore(totalCorrect, nbQuestions);
    const answers = {
      goal,
      preferredModule: goalOpt?.module || null,
      timePerWeek,
      skillLevels,
      overallTier,
      weakestModule: weakest,
      startXp,
      startLevel,
      // `skipped` = test de placement sauté. `experience` est conservé
      // par le reducer et décide seul si « Premiers pas » est obligatoire
      // (pathEngine.debutFacultatif) ; `skipped` + niveau A1 ne sert plus
      // que de repli pour les états sans `experience`.
      skipped: debutant,
      experience,
      completedAt: new Date().toISOString(),
    };
    emit("onboarding_completed", answers);
    onComplete(answers);
  }

  const questionNumber = qIdx + 1;
  const progressPct =
    phase === "welcome"   ? 0  :
    phase === "experience" ? 3 :
    phase === "debutant"  ? 60 :
    phase === "testIntro" ? 5  :
    phase === "testing"   ? Math.round(5 + ((questionNumber - (answered ? 0 : 1)) / Math.max(1, nbQuestions)) * 65) :
    phase === "results"   ? 75 :
    phase === "goal"      ? 85 :
    phase === "time"      ? 95 : 100;

  // Étape plein écran centrée (bienvenue, intro du test).
  const centre = { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, minHeight: 0 };
  const titreEtape = { margin: 0, fontSize: T.h2, fontWeight: 800, color: C.text, letterSpacing: "-.3px", lineHeight: 1.25 };
  // Titre passé à ResultScreen : garde sa balise de titre, prend le style du composant.
  const titreHerite = { margin: 0, font: "inherit", letterSpacing: "inherit" };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      background: C.bg, fontFamily: FONTS.ui,
      padding: "calc(env(safe-area-inset-top, 0px) + 12px) 0 24px",
    }}>
      {phase !== "welcome" && (
        <SessionBar pct={progressPct} style={{ padding: "0 20px 4px", maxWidth: 440, width: "100%", margin: "0 auto", boxSizing: "border-box" }} />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px", maxWidth: 440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

        {/* ── Bienvenue ─────────────────────────────────────────────── */}
        {phase === "welcome" && (
          <div className="gr-in-push" style={{ ...centre, gap: 18 }}>
            <Gropi pose="wave" size={132} anim="wiggle" />
            <h1 style={{ ...titreEtape, fontSize: T.h1 }}>
              Bienvenue sur Groply
            </h1>
            <p style={{ margin: 0, fontSize: T.body, lineHeight: 1.6, color: C.text2, maxWidth: 310 }}>
              Avant de commencer, dis-moi où tu en es : ton Parcours s'adapte à ton vrai niveau, que tu n'aies jamais touché une guitare ou que tu joues depuis des années. 2 minutes, promis.
            </p>
            <Button size="lg" full style={{ marginTop: 8 }}
              onClick={() => { emit("onboarding_started"); setPhase("experience"); emit("onboarding_step_view", { step: "experience" }); }}>
              Commencer
            </Button>
          </div>
        )}

        {/* ── Tu joues déjà ? ───────────────────────────────────────── */}
        {phase === "experience" && (
          <StepLayout pose={POSE_ROLE.choix} eyebrow="Pour commencer" title="Tu as déjà joué de la guitare ?"
            subtitle="Si tu débutes, pas de test : on commence ensemble par les tout premiers pas.">
            {EXPERIENCE_OPTIONS.map(opt => (
              <OptionCard key={opt.id} selected={experience === opt.id} onClick={() => setExperience(opt.id)}
                icon={opt.icon} label={opt.label} sub={opt.sub} />
            ))}
            <Button size="lg" full style={{ marginTop: 8 }} disabled={!experience} onClick={chooseExperience}>
              Continuer
            </Button>
          </StepLayout>
        )}

        {/* ── Débutant complet : pas de test ───────────────────────── */}
        {phase === "debutant" && (
          <div className="gr-in-push" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <ResultScreen
              pose="celebrate" anim="cheer" style={{ padding: "12px 0 0" }}
              title={<h2 style={titreHerite}>Bienvenue dans l'aventure !</h2>}
              subtitle={<>Pas de test pour toi : ton Parcours commence par les <b style={{ color: C.text }}>Premiers pas</b>. Tenir ta guitare, l'accorder, tes premiers accords, tes premières rythmiques et la lecture des tablatures, à ton rythme.</>}
              actions={(
                <Button size="lg" full onClick={() => { setPhase("goal"); emit("onboarding_step_view", { step: "goal" }); }}>
                  Continuer
                </Button>
              )}
            />
          </div>
        )}

        {/* ── Intro test ────────────────────────────────────────────── */}
        {phase === "testIntro" && (
          <div className="gr-in-push" style={centre}>
            <Gropi pose="think" size={112} anim="bob" />
            <h2 style={titreEtape}>
              Le test de placement
            </h2>
            <p style={{ margin: 0, fontSize: T.body, lineHeight: 1.6, color: C.text2, maxWidth: 310 }}>
              {nbQuestions} questions, {modulesTestes.length} domaines ({modulesTestes.map(m => MODULE[m]?.label?.toLowerCase() || m).join(", ")}). Ça commence simple, puis ça monte en difficulté. C'est normal de sécher sur les dernières.
            </p>
            <p style={{ margin: 0, fontSize: T.small, lineHeight: 1.55, color: C.text3, maxWidth: 300 }}>
              Pas de retour en arrière possible une fois lancé. Réponds au mieux : c'est fait pour révéler où tu es, pas pour te juger. Si tu ne sais pas, dis-le, ça compte aussi.
            </p>
            <Button size="lg" full icon="player-play" style={{ marginTop: 8 }} onClick={startTest}>Lancer le test</Button>
          </div>
        )}

        {/* ── Test en cours ─────────────────────────────────────────── */}
        {phase === "testing" && currentQ && (
          <div className="gr-in-push" style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 20 }}>
            {/* Clé par question : énoncé et réponses rejouent leur entrée. */}
            <div key={qIdx} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <QuestionCard eyebrow={(
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Ti name={MODULE[currentQ.moduleId]?.icon || "music"} size={15} color={C[MODULE[currentQ.moduleId]?.color] || C.primary} />
                  {MODULE[currentQ.moduleId]?.label || currentQ.moduleId} · Question {questionNumber}/{nbQuestions}
                </span>
              )}>
                {currentQ.q}
              </QuestionCard>

              {currentQ.type === "fretboard" ? (
                <FretboardQuizQuestion
                  question={currentQ}
                  onComplete={chooseFretboard}
                  answered={answered}
                  forceReveal={forceReveal}
                />
              ) : (
                <div className="gr-stagger" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {currentQ.o.map((opt, i) => (
                    <AnswerOption key={i} marker={String.fromCharCode(65 + i)} locked={answered} onClick={() => choose(i)}
                      etat={!answered ? "idle" : i === currentQ.a ? "correct" : i === selected ? "wrong" : "muted"}>
                      {opt}
                    </AnswerOption>
                  ))}
                </div>
              )}

              {!answered && (
                <Button variant="secondary" full
                  onClick={currentQ.type === "fretboard" ? () => setForceReveal(true) : chooseDontKnow}>
                  Je ne sais pas
                </Button>
              )}

              {answered && (
                <>
                  {/* Pour le manche interactif, les bonnes positions sont déjà
                      montrées visuellement sur le manche (points colorés) —
                      pas besoin de la notation "corde 6 case 8, corde 5 case 3..." en plus, elle
                      ne veut rien dire pour quelqu'un qui découvre l'app. */}
                  {currentQ.type !== "fretboard" && (selected === null ? (
                    // « Je ne sais pas » : encart neutre, ce n'est pas une faute.
                    <NoteNeutre>
                      <span style={DEUX_LIGNES}>Pas de souci, tu la reverras. {currentQ.exp}</span>
                    </NoteNeutre>
                  ) : (
                    <Feedback correct={selected === currentQ.a}>
                      <span style={DEUX_LIGNES}>{currentQ.exp}</span>
                    </Feedback>
                  ))}
                  {currentQ.type === "fretboard" && forceReveal && (
                    <NoteNeutre>
                      Pas de souci, tu la reverras. Les bonnes positions sont affichées sur le manche.
                    </NoteNeutre>
                  )}
                  <Button size="lg" full iconRight="arrow-right" onClick={continueTest}>Continuer</Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Résultat du test ──────────────────────────────────────── */}
        {phase === "results" && overallTier && (() => {
          const totalCorrect = TESTABLE_MODULES.reduce((sum, m) => sum + (results[m] || 0), 0);
          const { grade, level } = startFromScore(totalCorrect, nbQuestions);
          return (
          <div className="gr-in-push" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <ResultScreen
              confetti pose="celebrate" anim="cheer" style={{ padding: "12px 0 0" }}
              title={(
                <>
                  <Eyebrow tone="neutral" style={{ color: C.text2, marginBottom: 6 }}>Ton profil Groply</Eyebrow>
                  <h1 style={titreHerite}>{grade.label}</h1>
                </>
              )}
              subtitle={(
                <>
                  <span style={{ display: "block", marginBottom: 8 }}><Tag>Niveau {level}</Tag></span>
                  {grade.blurb}
                </>
              )}
              actions={(
                <Button size="lg" full onClick={() => { setPhase("goal"); emit("onboarding_step_view", { step: "goal" }); }}>
                  Continuer
                </Button>
              )}
            >
              <ListGroup>
                {ALL_PROFILE_MODULES.map(m => {
                  const tier = skillLevels[m];
                  const value = TIER_VALUE[tier] || 0;
                  const th = MODULE[m] || {};
                  const isWeak = m === weakest;
                  return (
                    <ListRow key={m} title={th.label || m}
                      style={{ minHeight: 52, textAlign: "left", background: isWeak ? C.primaryL : undefined }}
                      lead={<IconTile icon={th.icon || "music"} tone={th.color || "neutral"} size={34} />}
                      right={<Gauge size="sm" value={value} max={4} tone={th.color || "primary"} />} />
                  );
                })}
              </ListGroup>

              {weakest && (
                <p style={{ margin: "12px auto 0", fontSize: T.small, color: C.text2, lineHeight: 1.5, maxWidth: 300, textAlign: "center" }}>
                  Gropi a repéré que <b style={{ color: C.text }}>{MODULE[weakest]?.label}</b> mérite un coup de boost, on le met en priorité dans ton Parcours.
                </p>
              )}
            </ResultScreen>
          </div>
          );
        })()}

        {/* ── Objectif ──────────────────────────────────────────────── */}
        {phase === "goal" && (
          <StepLayout pose={POSE_ROLE.choix} eyebrow="Presque fini" title="Quel est ton objectif principal ?"
            subtitle="Le Parcours en tiendra compte, en plus de ton profil, sans jamais sauter les autres domaines.">
            {GOAL_OPTIONS.map(opt => (
              <OptionCard key={opt.id} selected={goal === opt.id} onClick={() => setGoal(opt.id)}
                icon={opt.icon} label={opt.label} />
            ))}
            <Button size="lg" full style={{ marginTop: 8 }} disabled={!goal}
              onClick={() => { setPhase("time"); emit("onboarding_step_view", { step: "time" }); }}>
              Continuer
            </Button>
          </StepLayout>
        )}

        {/* ── Temps disponible ──────────────────────────────────────── */}
        {phase === "time" && (
          <StepLayout pose={POSE_ROLE.bonne} eyebrow="Dernière question" title="Combien de temps veux-tu y consacrer ?"
            subtitle="Ça règle tes objectifs hebdo, modifiable à tout moment dans les réglages.">
            {TIME_OPTIONS.map(opt => (
              <OptionCard key={opt.id} selected={timePerWeek === opt.id} onClick={() => setTimePerWeek(opt.id)}
                icon="clock" label={opt.label} />
            ))}
            <Button size="lg" full style={{ marginTop: 8 }} disabled={!timePerWeek} onClick={finish}>
              C'est parti
            </Button>
          </StepLayout>
        )}
      </div>
    </div>
  );
}

// ── Sous-composants ─────────────────────────────────────────────────────

// Explication limitée à deux lignes : le test doit rester rapide.
const DEUX_LIGNES = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };

/** Encart neutre après « Je ne sais pas » (ni vert ni rouge). */
function NoteNeutre({ children }) {
  const C = useC();
  return (
    <Card tone="neutral" soft pad="12px 14px" className="gr-in" role="status">
      <p style={{ margin: 0, fontSize: T.small, color: C.text2, lineHeight: 1.5 }}>{children}</p>
    </Card>
  );
}

// `pose` : un Gropi à droite du titre — « choix » sur les questions où l'on
// choisit son chemin.
function StepLayout({ eyebrow, title, subtitle, pose, children }) {
  const C = useC();
  return (
    <div className="gr-in-push" style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 24, gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 style={{ margin: 0, fontSize: T.h2, fontWeight: 800, color: C.text, letterSpacing: "-.3px", lineHeight: 1.25 }}>
            {title}
          </h2>
        </div>
        {pose && <Gropi pose={pose} size={68} anim="bob" />}
      </div>
      {subtitle && (
        <p style={{ margin: 0, fontSize: T.small, color: C.text2, lineHeight: 1.5 }}>{subtitle}</p>
      )}
      <div className="gr-stagger" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
        {children}
      </div>
    </div>
  );
}

/** Choix d'une étape : carte en relief, teintée et cochée une fois choisie. */
function OptionCard({ selected, onClick, icon, label, sub }) {
  const C = useC();
  return (
    <Card onClick={onClick} selected={selected} soft={selected} tone={selected ? "primary" : undefined}
      aria-pressed={selected} pad="12px 14px"
      style={{ minHeight: 64, display: "flex", alignItems: "center", gap: 12 }}>
      {icon && <IconTile icon={icon} tone={selected ? "primary" : "neutral"} solid={selected} size={38} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: T.body, fontWeight: 700, color: selected ? C.primaryD : C.text, lineHeight: 1.35 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: C.text2, marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
      {selected && (
        <span aria-hidden="true" className="gr-in-pop" style={{ display: "inline-flex" }}>
          <Ti name="circle-check" size={22} color={C.primary} />
        </span>
      )}
    </Card>
  );
}
