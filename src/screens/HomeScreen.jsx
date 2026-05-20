// GuitarPath — screens/HomeScreen.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { BADGE_TINTS } from "../store/badges.js";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop, Toast } from "../design/ui.jsx";
import { MODULE_THEME } from "../store/moduleTheme.js";
import { DAILY_CHALLENGES, KEYS, MODES, TEMPOS, CONSTRAINTS } from "../store/challenges.js";

function HomeScreen({ state, dispatch, navigate, content }) {
  const totalLessons = content.courses.reduce((a,c) => a + c.lessons.length, 0);
  const completedLessons = Object.keys(state.completedLessons).length;
  const xpInLevel = state.xp % 300;
  const lvlPct = Math.round((xpInLevel / 300) * 100);
  const xpToNext = 300 - xpInLevel;
  const todayChallenge = DAILY_CHALLENGES[state.dailyChallengeIdx % DAILY_CHALLENGES.length];

  // Trouver la prochaine leçon
  const nextLesson = useMemo(() => {
    for (const course of content.courses) {
      for (const lesson of course.lessons) {
        if (!state.completedLessons[lesson.id]) return { course, lesson };
      }
    }
    return null;
  }, [content, state.completedLessons]);

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>
            {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 style={{ margin: "3px 0 0", fontSize: 24, fontWeight: 700, fontFamily: FONTS.title, letterSpacing: "-0.01em", color: C.text }}>
            Bonjour
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: C.amberL, borderRadius: R.pill, padding: "5px 11px" }}>
            <Ti name="flame" size={13} color={C.amber} />
            <span style={{ fontSize: 13, fontWeight: 500, color: C.amberD, fontFamily: FONTS.ui }}>{state.streak}</span>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${C.primary}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: C.primary, fontFamily: FONTS.ui }}>
            N{state.level}
          </div>
        </div>
      </div>

      {/* XP — barre de progression simple */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui }}>
            Niveau {state.level}
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.text2, fontFamily: FONTS.ui }}>
            {xpInLevel} / 300 XP
          </div>
        </div>
        <ProgressBar pct={lvlPct} color={C.primary} h={6} />
        <div style={{ marginTop: 8, fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>
          Plus que {xpToNext} XP pour le niveau {state.level + 1}
        </div>
      </div>

      {/* Prochain objectif */}
      {nextLesson && (
        <button onClick={() => navigate("courses")} style={{
          width: "100%", background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: R.lg,
          padding: 14, marginBottom: 10, cursor: "pointer", textAlign: "left", fontFamily: FONTS.title,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ti name="player-play" size={18} color={C.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.primary, fontFamily: FONTS.ui, marginBottom: 2 }}>
              Prochain objectif
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>
              {nextLesson.lesson.title}
            </div>
            <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }}>
              {nextLesson.course.title} · {nextLesson.lesson.duration} min
            </div>
          </div>
          <Ti name="arrow-right" size={16} color={C.primary} />
        </button>
      )}

      {/* 🎸 Featured — Explorateur du manche */}
      <button onClick={() => navigate("explorer")} style={{
        width: "100%",
        background: `linear-gradient(135deg, ${C.amberL} 0%, ${C.primaryL} 100%)`,
        border: `1px solid ${C.amberBorder}`,
        borderRadius: R.lg, padding: 14, marginBottom: 10,
        cursor: "pointer", textAlign: "left", fontFamily: FONTS.title,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <Ti name="guitar-pick" size={22} color={C.amber} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.amberD, fontFamily: FONTS.ui, marginBottom: 2 }}>
            Outil · Manche
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: FONTS.title }}>
            Explorateur du manche
          </div>
          <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 1 }}>
            Visualise gammes et accords en temps réel
          </div>
        </div>
        <Ti name="arrow-right" size={16} color={C.amber} />
      </button>

      {/* Défi du jour */}
      <button onClick={() => navigate("challenge")} style={{
        width: "100%", background: state.dailyChallengeDone ? C.greenL : C.amberL,
        border: `1px solid ${state.dailyChallengeDone ? C.greenBorder : C.amberBorder}`,
        borderRadius: R.lg, padding: 14, marginBottom: 14, cursor: "pointer", textAlign: "left", fontFamily: FONTS.title,
        display: "flex", alignItems: "flex-start", gap: 11,
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Ti name={state.dailyChallengeDone ? "trophy" : "bolt"} size={18} color={state.dailyChallengeDone ? C.green : C.amber} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: state.dailyChallengeDone ? C.greenD : C.amberD, fontFamily: FONTS.ui, marginBottom: 3 }}>
            Défi du jour {state.dailyChallengeDone ? "· terminé" : "· +80 XP"}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: state.dailyChallengeDone ? C.greenD : C.amberD, fontFamily: FONTS.title, fontWeight: 500 }}>
            {todayChallenge}
          </div>
        </div>
      </button>

      {/* Session du jour */}
      <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, marginBottom: 8 }}>
        Session du jour
      </div>

      {[
        { id: "courses",   icon: "book-2",        label: "Théorie",       sub: "Cours structurés", tint: "primary" },
        { id: "exercises", icon: "guitar-pick",   label: "Exercices",     sub: `${content.exercises.length} disponibles`, tint: "green" },
        { id: "quiz",      icon: "help-circle",   label: "Quiz",          sub: `${content.quiz.length} questions${state.wrongQuiz.length>0?` · ${state.wrongQuiz.length} à revoir`:""}`, tint: "amber" },
        { id: "practice",  icon: "dice-5",        label: "Practice libre", sub: "Défis générés à l'infini", tint: "coral" },
      ].map(t => {
        const tint = BADGE_TINTS[t.tint];
        return (
          <button key={t.id} onClick={() => navigate(t.id)} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md,
            padding: "11px 14px", display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer", textAlign: "left", width: "100%", marginBottom: 8,
            fontFamily: FONTS.title,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: tint.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Ti name={t.icon} size={18} color={tint.icon} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{t.label}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 1, fontFamily: FONTS.ui }}>{t.sub}</div>
            </div>
            <Ti name="chevron-right" size={14} color="#B4B2A9" />
          </button>
        );
      })}

      {/* Dernières sessions */}
      {state.sessionHistory && state.sessionHistory.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3, fontFamily: FONTS.ui, margin: "16px 0 8px" }}>
            Dernières sessions
          </div>
          {state.sessionHistory.slice(0, 3).map((sess, i) => (
            <div key={i} style={{
              background: "#FAF9F6", border: `1px solid ${C.border}`, borderRadius: R.md,
              padding: "10px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: C.greenL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Ti name="check" size={14} color={C.green} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: FONTS.title }}>{sess.title}</div>
                <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 1 }}>
                  {sess.score ? `${sess.score} · ` : ""}+{sess.xp} XP
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COURSES
// ═══════════════════════════════════════════════════════════════════════════

export { HomeScreen };
