// Groply — screens/TrainingScreen.jsx
//
// NOTE DE NOMMAGE : ce fichier ne s'appelle PAS PracticeScreen.jsx parce
// qu'un écran de ce nom existe déjà et fait tout autre chose (générateur
// de défis d'improvisation, route "practice"). L'écraser aurait détruit
// une fonctionnalité existante.
//
// Fusionne les anciens onglets "Quiz" et "Exercices" en un seul onglet
// "Pratique" : Théorie (QCM rapides) et Guitare en main (exercices).
//
// La v1 de cet écran se contentait d'empiler les deux écrans sous des
// sous-onglets — chacun gardant sa propre grande image d'en-tête, son
// titre et sa barre de progression, sous un bandeau de stats que j'avais
// ajouté par-dessus. Résultat : trois strates d'information avant le
// premier contenu utile, et deux jeux de statistiques qui disaient
// presque la même chose.
//
// Cette version : UN seul en-tête, qui porte le titre, la progression du
// sous-onglet actif, et les sous-onglets eux-mêmes. Les deux écrans
// hébergés passent en mode `embedded` et masquent leur propre en-tête.

import { useState, useMemo } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar } from "../design/ui.jsx";
import { ExercisesScreen } from "./ExercisesScreen.jsx";
import { QuizScreen } from "./QuizScreen.jsx";

const SUBTABS = [
  { id: "theory",  label: "Théorie",         icon: "help-circle" },
  { id: "playing", label: "Guitare en main", icon: "guitar-pick" },
];

export function TrainingScreen({ state, dispatch, content }) {
  const C = useC();
  const [tab, setTab] = useState("theory");

  // Une seule statistique affichée : celle du sous-onglet actif. Montrer
  // les deux en permanence était la principale source de surcharge.
  const stat = useMemo(() => {
    if (tab === "theory") {
      const all = content.quiz || [];
      const answered = all.filter(q => state.quizResults?.[q.id]).length;
      const pct = all.length ? Math.round(answered / all.length * 100) : 0;
      return { pct, line: `${answered} / ${all.length} questions répondues` };
    }
    const all = content.exercises || [];
    const done = all.filter(e => state.completedExercises?.[e.id]).length;
    const pct = all.length ? Math.round(done / all.length * 100) : 0;
    return { pct, line: `${done} / ${all.length} exercices complétés` };
  }, [tab, content.quiz, content.exercises, state.quizResults, state.completedExercises]);

  return (
    <div>
      {/* ── EN-TÊTE UNIQUE — titre, progression, sous-onglets ─────────── */}
      <div style={{
        backgroundColor: "#36b3d7", backgroundImage: "url('/ocean.jpg')",
        backgroundSize: "cover", backgroundPosition: "center 30%",
        padding: "24px 20px 0", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,60,80,.52)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }}>
            Pratique
          </div>
          <div style={{
            fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.8)",
            marginTop: 2, marginBottom: 12,
          }}>
            {stat.line}
          </div>
          <ProgressBar pct={stat.pct} color={C.teal} h={6} />

          {/* Sous-onglets intégrés à l'en-tête plutôt qu'empilés dessous :
              une strate visuelle en moins, et le lien entre l'onglet actif
              et la progression affichée devient évident. */}
          <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
            {SUBTABS.map(t => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1, padding: "10px 6px 11px",
                    border: "none", background: "none", cursor: "pointer",
                    fontFamily: FONTS.ui,
                    borderBottom: `3px solid ${active ? "#fff" : "rgba(255,255,255,.22)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  }}
                >
                  <Ti name={t.icon} size={16} color={active ? "#fff" : "rgba(255,255,255,.6)"} />
                  <span style={{
                    fontSize: 13, fontWeight: 800, letterSpacing: "-.1px",
                    color: active ? "#fff" : "rgba(255,255,255,.6)",
                  }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Contenu du sous-onglet actif, sans son propre en-tête ─────── */}
      {tab === "theory"
        ? <QuizScreen state={state} dispatch={dispatch} content={content} embedded />
        : <ExercisesScreen state={state} dispatch={dispatch} content={content} embedded />}
    </div>
  );
}
