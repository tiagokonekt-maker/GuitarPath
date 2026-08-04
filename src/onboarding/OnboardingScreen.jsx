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

import { useState, useEffect } from "react";
import { FONTS, R, MODULE } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { ProgressBar } from "../design/ui.jsx";
import {
  TESTABLE_MODULES, pickQuestion, startFromOverallTier, TIER_VALUE,
  computeModuleTier, inferImproTier, computeOverallTier, weakestModule,
} from "../store/placementEngine.js";

const GOAL_OPTIONS = [
  { id: "impro",   module: "impro",   label: "Improviser librement",                icon: "wand" },
  { id: "theorie", module: "harmony", label: "Comprendre la théorie en profondeur", icon: "stack-2" },
  { id: "manche",  module: "neck",    label: "Maîtriser le manche",                 icon: "map-2" },
  { id: "global",  module: null,      label: "Un peu de tout, en équilibre",        icon: "sparkles" },
];

const TIME_OPTIONS = [
  { id: "short",  label: "15–30 min / semaine" },
  { id: "medium", label: "30–60 min / semaine" },
  { id: "long",   label: "1h ou plus / semaine" },
];

const ALL_PROFILE_MODULES = [...TESTABLE_MODULES, "impro"];

export function OnboardingScreen({ content, onComplete, onEvent }) {
  const C = useC();

  // phase : "welcome" → "testIntro" → "testing" → "results" → "goal" → "time"
  const [phase, setPhase] = useState("welcome");

  // ── Test de placement ────────────────────────────────────────────────
  const [moduleIdx, setModuleIdx] = useState(0);
  const [stage, setStage] = useState("pivot"); // "pivot" | "final"
  const [currentQ, setCurrentQ] = useState(null);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [pivotCorrect, setPivotCorrect] = useState(null);
  const [usedIds] = useState(() => new Set());
  const [skillLevels, setSkillLevels] = useState({ neck: null, scales: null, harmony: null, rhythm: null, impro: null });
  const [overallTier, setOverallTier] = useState(null);
  const [weakest, setWeakest] = useState(null);

  // ── Objectif + temps ─────────────────────────────────────────────────
  const [goal, setGoal] = useState(null);
  const [timePerWeek, setTimePerWeek] = useState(null);

  const emit = (name, props) => { try { onEvent?.(name, props); } catch { /* noop */ } };
  const quizBank = content?.quiz || [];

  // ── Chargement d'une question pour le module/étape courants ─────────
  function loadQuestion(modIdx, stg, pivotWasCorrect) {
    const moduleId = TESTABLE_MODULES[modIdx];
    const lvl = stg === "pivot" ? 2 : (pivotWasCorrect ? 3 : 1);
    const q = pickQuestion(quizBank, moduleId, lvl, usedIds);
    if (q) usedIds.add(q.id);
    setCurrentQ(q ? { ...q, moduleId } : null);
    setSelected(null);
    setAnswered(false);
  }

  function startTest() {
    emit("placement_test_started");
    setPhase("testing");
    setModuleIdx(0);
    setStage("pivot");
    setPivotCorrect(null);
    loadQuestion(0, "pivot");
  }

  function choose(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === currentQ.a;
    emit("placement_question_answered", { module: currentQ.moduleId, stage, correct, questionId: currentQ.id });
    if (stage === "pivot") setPivotCorrect(correct);
  }

  // "Je ne sais pas" : compte comme une réponse fausse pour l'escalier de
  // difficulté (aucune option n'est sélectionnée, donc aucune ne s'affiche
  // en rouge) — c'est un signal honnête, pas un échec à sanctionner.
  function chooseDontKnow() {
    if (answered) return;
    setSelected(null);
    setAnswered(true);
    emit("placement_question_answered", { module: currentQ.moduleId, stage, correct: false, dontKnow: true, questionId: currentQ.id });
    if (stage === "pivot") setPivotCorrect(false);
  }

  function recordModuleTierAndAdvance(moduleId, tier) {
    const newLevels = { ...skillLevels, [moduleId]: tier };
    emit("placement_module_result", { module: moduleId, tier });

    if (moduleIdx + 1 < TESTABLE_MODULES.length) {
      const nextIdx = moduleIdx + 1;
      setSkillLevels(newLevels);
      setModuleIdx(nextIdx);
      setStage("pivot");
      setPivotCorrect(null);
      loadQuestion(nextIdx, "pivot");
    } else {
      const improTier = inferImproTier(newLevels);
      const finalLevels = { ...newLevels, impro: improTier };
      const overall = computeOverallTier(finalLevels);
      const weak = weakestModule(finalLevels);
      setSkillLevels(finalLevels);
      setOverallTier(overall);
      setWeakest(weak);
      emit("placement_completed", { skillLevels: finalLevels, overallTier: overall, weakestModule: weak });
      setPhase("results");
    }
  }

  function continueTest() {
    const moduleId = TESTABLE_MODULES[moduleIdx];
    if (stage === "pivot") {
      setStage("final");
      loadQuestion(moduleIdx, "final", pivotCorrect);
    } else {
      const finalCorrect = selected === currentQ.a;
      const tier = computeModuleTier(pivotCorrect, finalCorrect);
      recordModuleTierAndAdvance(moduleId, tier);
    }
  }

  // Filet de sécurité : si jamais le stock de questions manque pour un
  // module/niveau (ne devrait pas arriver vu le contenu actuel), on ne
  // bloque pas l'utilisateur — on passe au module suivant avec un niveau
  // neutre plutôt que de planter l'onboarding.
  useEffect(() => {
    if (phase === "testing" && !currentQ) {
      const moduleId = TESTABLE_MODULES[moduleIdx];
      recordModuleTierAndAdvance(moduleId, "A2");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQ]);

  function finish() {
    const goalOpt = GOAL_OPTIONS.find(g => g.id === goal);
    const { startXp } = startFromOverallTier(overallTier);
    const answers = {
      goal,
      preferredModule: goalOpt?.module || null,
      timePerWeek,
      skillLevels,
      overallTier,
      weakestModule: weakest,
      startXp,
      completedAt: new Date().toISOString(),
    };
    emit("onboarding_completed", answers);
    onComplete(answers);
  }

  const questionNumber = moduleIdx * 2 + (stage === "final" ? 2 : 1);
  const progressPct =
    phase === "welcome"   ? 0  :
    phase === "testIntro" ? 5  :
    phase === "testing"   ? Math.round(5 + ((questionNumber - (answered ? 0 : 1)) / 8) * 65) :
    phase === "results"   ? 75 :
    phase === "goal"      ? 85 :
    phase === "time"      ? 95 : 100;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: C.bg, fontFamily: FONTS.title, padding: "0 0 24px",
    }}>
      {phase !== "welcome" && (
        <div style={{ padding: "calc(env(safe-area-inset-top, 0px) + 16px) 20px 4px" }}>
          <ProgressBar pct={progressPct} />
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px", maxWidth: 440, width: "100%", margin: "0 auto" }}>

        {/* ── Bienvenue ─────────────────────────────────────────────── */}
        {phase === "welcome" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18 }}>
            <Gropi pose="wave" size={110} anim="bob" />
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-.3px" }}>
              Bienvenue sur Groply
            </h1>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: C.text2, maxWidth: 300 }}>
              Avant de commencer, on va mesurer ton vrai niveau : pas celui que tu crois avoir, celui que tu as vraiment. 2 minutes, promis.
            </p>
            <PrimaryButton C={C} onClick={() => { emit("onboarding_started"); setPhase("testIntro"); }}>
              Commencer
            </PrimaryButton>
          </div>
        )}

        {/* ── Intro test ────────────────────────────────────────────── */}
        {phase === "testIntro" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
            <Gropi pose="think" size={90} anim="bob" />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>
              Le test de placement
            </h2>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: C.text2, maxWidth: 300 }}>
              8 questions, 4 domaines (manche, gammes, harmonie, rythme). Les questions s'adaptent à tes réponses, comme un vrai test de niveau.
            </p>
            <p style={{ margin: 0, fontSize: 12, color: C.text3, maxWidth: 280 }}>
              Pas de retour en arrière possible une fois lancé. Réponds au mieux : c'est fait pour révéler où tu es, pas pour te juger. Si tu ne sais pas, dis-le, ça compte aussi.
            </p>
            <PrimaryButton C={C} onClick={startTest}>Lancer le test</PrimaryButton>
          </div>
        )}

        {/* ── Test en cours ─────────────────────────────────────────── */}
        {phase === "testing" && currentQ && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 24, gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Ti name={MODULE[currentQ.moduleId]?.icon || "music"} size={16} color={C.primary} />
              <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.primary, fontFamily: FONTS.ui }}>
                {MODULE[currentQ.moduleId]?.label || currentQ.moduleId} · Question {questionNumber}/8
              </span>
            </div>

            <div style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.5, color: C.text }}>{currentQ.q}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentQ.o.map((opt, i) => {
                let bg = C.surface, border = `1.5px solid ${C.border}`, col = C.text;
                if (answered) {
                  if (i === currentQ.a)      { bg = C.greenL; border = `1.5px solid ${C.green}`; col = C.greenD; }
                  else if (i === selected)   { bg = C.coralL; border = `1.5px solid ${C.coral}`; col = C.coralD; }
                }
                return (
                  <button key={i} onClick={() => choose(i)} disabled={answered} style={{
                    textAlign: "left", minHeight: 48, padding: "12px 14px", borderRadius: R.md,
                    background: bg, border, color: col, cursor: answered ? "default" : "pointer",
                    fontSize: 14, fontWeight: 600, fontFamily: FONTS.title, transition: "all 0.15s",
                  }}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!answered && (
              <button onClick={chooseDontKnow} style={{
                textAlign: "center", minHeight: 44, padding: "10px 14px", borderRadius: R.md,
                background: "transparent", border: `1.5px dashed ${C.border}`, color: C.text3,
                fontSize: 13, fontWeight: 600, fontFamily: FONTS.title, cursor: "pointer",
              }}>
                Je ne sais pas
              </button>
            )}

            {answered && (
              <>
                <p style={{
                  margin: 0, fontSize: 12.5, color: C.text2, lineHeight: 1.5,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {selected === null ? "Pas de souci, tu la reverras. " : ""}{currentQ.exp}
                </p>
                <PrimaryButton C={C} onClick={continueTest}>Continuer</PrimaryButton>
              </>
            )}
          </div>
        )}

        {/* ── Résultat du test ──────────────────────────────────────── */}
        {phase === "results" && overallTier && (() => {
          const { grade } = startFromOverallTier(overallTier);
          return (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 14, paddingTop: 12 }}>
            <Gropi pose="celebrate" size={100} anim="cheer" />
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: ".08em" }}>
              Ton profil Groply
            </div>
            <div style={{
              width: 60, height: 60, borderRadius: "50%", background: C.primaryL,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Ti name={grade.icon.replace("ti-", "")} size={28} color={C.primary} />
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }}>
              {grade.label}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: C.text2, lineHeight: 1.55, maxWidth: 300 }}>
              {grade.blurb}
            </p>

            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7, marginTop: 6 }}>
              {ALL_PROFILE_MODULES.map(m => {
                const tier = skillLevels[m];
                const value = TIER_VALUE[tier] || 0;
                const th = MODULE[m] || {};
                const isWeak = m === weakest;
                return (
                  <div key={m} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: C.surface, border: `1.5px solid ${isWeak ? C.primary : C.border}`,
                    borderRadius: R.md, padding: "10px 13px",
                  }}>
                    <Ti name={th.icon || "music"} size={16} color={C[th.color] || C.text2} />
                    <span style={{ flex: 1, textAlign: "left", fontSize: 13, fontWeight: 700, color: C.text }}>{th.label || m}</span>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4].map(seg => (
                        <span key={seg} style={{
                          width: 14, height: 6, borderRadius: 3,
                          background: seg <= value ? (C[th.color] || C.primary) : C.border,
                        }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {weakest && (
              <p style={{ margin: "2px 0 0", fontSize: 12.5, color: C.text2, lineHeight: 1.5, maxWidth: 300 }}>
                Gropi a repéré que <b style={{ color: C.text }}>{MODULE[weakest]?.label}</b> mérite un coup de boost, on le met en priorité dans ton Parcours.
              </p>
            )}

            <PrimaryButton C={C} onClick={() => { setPhase("goal"); emit("onboarding_step_view", { step: "goal" }); }}>
              Continuer
            </PrimaryButton>
          </div>
          );
        })()}

        {/* ── Objectif ──────────────────────────────────────────────── */}
        {phase === "goal" && (
          <StepLayout C={C} eyebrow="Presque fini" title="Quel est ton objectif principal ?"
            subtitle="Le Parcours en tiendra compte, en plus de ton profil, sans jamais sauter les autres domaines.">
            {GOAL_OPTIONS.map(opt => (
              <OptionCard key={opt.id} C={C} selected={goal === opt.id} onClick={() => setGoal(opt.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Ti name={opt.icon} size={19} color={goal === opt.id ? C.primary : C.text2} />
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{opt.label}</div>
                </div>
              </OptionCard>
            ))}
            <PrimaryButton C={C} disabled={!goal} onClick={() => { setPhase("time"); emit("onboarding_step_view", { step: "time" }); }}>
              Continuer
            </PrimaryButton>
          </StepLayout>
        )}

        {/* ── Temps disponible ──────────────────────────────────────── */}
        {phase === "time" && (
          <StepLayout C={C} eyebrow="Dernière question" title="Combien de temps veux-tu y consacrer ?"
            subtitle="Ça règle tes objectifs hebdo, modifiable à tout moment dans les réglages.">
            {TIME_OPTIONS.map(opt => (
              <OptionCard key={opt.id} C={C} selected={timePerWeek === opt.id} onClick={() => setTimePerWeek(opt.id)}>
                <div style={{ fontWeight: 700, fontSize: 14.5 }}>{opt.label}</div>
              </OptionCard>
            ))}
            <PrimaryButton C={C} disabled={!timePerWeek} onClick={finish}>
              C'est parti
            </PrimaryButton>
          </StepLayout>
        )}
      </div>
    </div>
  );
}

// ── Sous-composants ─────────────────────────────────────────────────────

function StepLayout({ C, eyebrow, title, subtitle, children }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 28, gap: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: C.primary, fontFamily: FONTS.ui }}>
        {eyebrow}
      </div>
      <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: C.text, letterSpacing: "-.2px", lineHeight: 1.3 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: 0, fontSize: 13, color: C.text2, lineHeight: 1.5 }}>{subtitle}</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
        {children}
      </div>
    </div>
  );
}

function OptionCard({ C, selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", width: "100%", minHeight: 48,
        padding: "13px 15px", borderRadius: R.lg, cursor: "pointer",
        background: selected ? C.primaryL : C.surface,
        border: `1.5px solid ${selected ? C.primary : C.border}`,
        color: C.text, fontFamily: FONTS.title,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ C, onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", minHeight: 52, marginTop: 8,
        borderRadius: R.lg, border: "none", cursor: disabled ? "default" : "pointer",
        background: disabled ? C.border : `linear-gradient(135deg, #FF9155, ${C.primary})`,
        color: disabled ? C.text3 : "#fff",
        fontSize: 15.5, fontWeight: 700, fontFamily: FONTS.ui,
        boxShadow: disabled ? "none" : "0 4px 16px rgba(232,93,26,0.30)",
        transition: "all 0.18s",
      }}
    >
      {children}
    </button>
  );
}
