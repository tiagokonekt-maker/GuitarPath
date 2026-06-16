// GuitarPath -- screens/ReviewSession.jsx
// Session de revision intelligente -- mix QCM + fretboard
import { useState, useCallback } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { updateReviewHistory } from "../store/reviewEngine.js";

// Fretboard injecte depuis App.jsx
export let _FretboardQuizQuestion = null;
export const setFretboardQuizQuestion = (fn) => { _FretboardQuizQuestion = fn; };

export function ReviewSession({ questions, state, dispatch, onDone }) {
  const C = useC();
  const [idx, setIdx]           = useState(0);
  const [sel, setSel]           = useState(null);
  const [fretAnswered, setFretAnswered] = useState(false);
  const [fretCorrect, setFretCorrect]   = useState(null);
  const [results, setResults]   = useState([]); // { id, correct }
  const [finished, setFinished] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const q = questions[idx];
  const isFret = q?.type === "fretboard";
  const answered = isFret ? fretAnswered : sel !== null;

  // ── Reponse QCM ─────────────────────────────────────────────────────────
  const choose = (i) => {
    if (answered) return;
    setSel(i);
    const correct = i === q.a;
    recordAnswer(correct);
  };

  // ── Reponse fretboard ────────────────────────────────────────────────────
  const handleFretComplete = (result) => {
    setFretAnswered(true);
    setFretCorrect(result.complete);
    recordAnswer(result.complete);
  };

  // ── Enregistrement de la reponse ─────────────────────────────────────────
  const recordAnswer = (correct) => {
    // Mettre a jour l'historique de revision dans le state
    const newHistory = updateReviewHistory(
      state.reviewHistory || {},
      q.id,
      correct,
      today
    );
    dispatch({ type: "REVIEW_ANSWER", questionId: q.id, correct, history: newHistory, xp: correct ? (q.xp || 30) : 0 });
    setResults(prev => [...prev, { id: q.id, correct }]);
  };

  // ── Question suivante ─────────────────────────────────────────────────────
  const next = () => {
    const currentCorrect = results.filter(r => r.correct).length;
    if (idx + 1 >= questions.length) {
      // Dispatcher les actions de fin de session
      dispatch({ type: "REVIEW_SESSION_DONE", xp: currentCorrect * 20, score: `${currentCorrect}/${questions.length}` });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
      setFinished(true);
    } else {
      setSel(null);
      setFretAnswered(false);
      setFretCorrect(null);
      setIdx(i => i + 1);
    }
  };

  // ── Ecran de fin ─────────────────────────────────────────────────────────
  if (finished) {
    const correct = results.filter(r => r.correct).length;
    const incorrect = questions.length - correct;
    const pct = Math.round((correct / questions.length) * 100);
    const xpEarned = correct * 20;
    const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚";
    const title = pct >= 80 ? "Excellent !" : pct >= 50 ? "Bien joue !" : "Continue !";

    // Questions ratees pour affichage
    const wrongItems = results
      .filter(r => !r.correct)
      .map(r => questions.find(q => q.id === r.id))
      .filter(Boolean);

    return (
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Hero Gropi */}
        <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
          <Gropi
            pose={pct >= 80 ? "celebrate" : pct >= 50 ? "pride" : "think"}
            size={pct >= 80 ? 150 : 110}
            anim={pct >= 50 ? "cheer" : "pop"}
            style={{ margin: "0 auto" }}
          />
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONTS.title, marginTop: 8 }}>{title}</div>
          <div style={{ fontSize: 13, color: C.text2, fontFamily: FONTS.ui, marginTop: 4 }}>
            {pct >= 80
              ? "Excellente révision — ta mémoire se renforce. 🎸"
              : pct >= 50
              ? "Bon travail ! Les questions ratées reviennent bientôt."
              : "Les erreurs sont normales — c'est comme ça qu'on progresse."}
          </div>
        </div>

        {/* Stats principales */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "16px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.green, fontFamily: FONTS.title }}>{correct}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }}>Correctes</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: incorrect > 0 ? C.coral : C.text3, fontFamily: FONTS.title }}>{incorrect}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }}>A revoir</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.primary, fontFamily: FONTS.title }}>+{xpEarned}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 2 }}>XP</div>
            </div>
          </div>

          {/* Barre de score */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>Score</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.text2, fontFamily: FONTS.ui }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? C.green : pct >= 50 ? C.primary : C.coral, borderRadius: 3, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>

        {/* Questions ratees */}
        {wrongItems.length > 0 && (
          <div style={{ background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.lg, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.coralD, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              A retravailler ({wrongItems.length})
            </div>
            {wrongItems.map((q, i) => (
              <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < wrongItems.length - 1 ? 8 : 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Ti name="x" size={10} color="#fff" />
                </div>
                <div style={{ fontSize: 12, color: C.coralD, fontFamily: FONTS.ui, lineHeight: 1.45 }}>
                  {q.q?.substring(0, 80)}{q.q?.length > 80 ? "..." : ""}
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: C.coral, fontFamily: FONTS.ui, marginTop: 8, fontStyle: "italic" }}>
              Ces questions auront une priorite elevee lors de ta prochaine session.
            </div>
          </div>
        )}

        {/* Message si tout reussi */}
        {pct >= 80 && (
          <div style={{ background: C.greenL, border: `1px solid ${C.greenBorder}`, borderRadius: R.lg, padding: "12px 14px", fontSize: 12, color: C.greenD, fontFamily: FONTS.ui, lineHeight: 1.5 }}>
            Bien joue ! Les questions reussies ont ete reportees. Tu les reverras moins souvent.
          </div>
        )}

        <button onClick={onDone} style={{
          width: "100%", padding: "14px", borderRadius: R.md, border: "none",
          background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: FONTS.ui, marginTop: 4,
        }}>
          Retour a l'accueil
        </button>
      </div>
    );
  }

  if (!q) return null;

  const isCorrect = isFret ? fretCorrect : sel === q.a;

  return (
    <div style={{ padding: "14px 16px 0" }}>

      {/* Header + progression */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={onDone} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0 }}>
          <Ti name="x" size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < idx ? C.green
                          : i === idx ? C.primary
                          : C.border,
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, flexShrink: 0 }}>
          {idx + 1}/{questions.length}
        </div>
      </div>

      {/* Badge type */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div style={{
          padding: "3px 8px", borderRadius: R.pill, fontSize: 10, fontWeight: 700,
          fontFamily: FONTS.ui, letterSpacing: "0.06em", textTransform: "uppercase",
          background: isFret ? C.amberL : C.primaryL,
          color: isFret ? C.amberD : C.primaryD,
        }}>
          {isFret ? "Manche" : "QCM"} · Niv. {q.lvl}
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.lg, padding: 16, marginBottom: 12,
      }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, lineHeight: 1.5, color: C.text, fontFamily: FONTS.title }}>
          {q.q}
        </p>
      </div>

      {/* Question fretboard */}
      {isFret ? (
        <>
          {_FretboardQuizQuestion && (
            <_FretboardQuizQuestion
              question={q}
              onComplete={handleFretComplete}
              answered={fretAnswered}
            />
          )}
          {fretAnswered && (
            <>
              <div style={{
                background: isCorrect ? C.greenL : C.coralL,
                borderRadius: R.md, padding: "12px 14px", marginTop: 10, marginBottom: 12,
                border: `1px solid ${isCorrect ? C.greenBorder : C.coralBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Ti name={isCorrect ? "check" : "alert-circle"} size={14} color={isCorrect ? C.green : C.coral} />
                  <div style={{ fontSize: 12, fontWeight: 500, color: isCorrect ? C.greenD : C.coralD, fontFamily: FONTS.ui }}>
                    {isCorrect ? `Correct · +${q.xp || 40} XP` : "Pas tout a fait..."}
                  </div>
                </div>
                {q.exp && <div style={{ fontSize: 12, color: isCorrect ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }}>{q.exp}</div>}
              </div>
              <button onClick={next} style={{ width: "100%", padding: "14px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
                {idx + 1 >= questions.length ? "Voir les resultats" : "Suivant"}
              </button>
            </>
          )}
        </>
      ) : (
        /* QCM */
        <>
          {q.o.map((opt, i) => {
            let bg = C.surface, border = `1px solid ${C.border}`, col = C.text;
            let badgeBg = C.surface2, badgeFg = C.text2, ic = ["A", "B", "C", "D"][i];
            if (answered) {
              if (i === q.a) { bg = C.greenL; border = `1px solid ${C.green}`; col = C.greenD; badgeBg = C.greenBorder; badgeFg = C.greenD; ic = "✓"; }
              else if (i === sel) { bg = C.coralL; border = `1px solid ${C.coral}`; col = C.coralD; badgeBg = C.coralBorder; badgeFg = C.coralD; ic = "✗"; }
            }
            return (
              <button key={i} onClick={() => choose(i)} disabled={answered} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: bg, border, borderRadius: 11, padding: "11px 13px",
                cursor: answered ? "default" : "pointer", textAlign: "left",
                width: "100%", marginBottom: 7, fontFamily: FONTS.title,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, flexShrink: 0, fontFamily: FONTS.ui }}>
                  {ic}
                </div>
                <span style={{ fontSize: 13, color: col, lineHeight: 1.4, fontFamily: FONTS.title, fontWeight: answered && i === q.a ? 500 : 400 }}>{opt}</span>
              </button>
            );
          })}

          {answered && (
            <>
              <div style={{
                background: isCorrect ? C.greenL : C.coralL,
                borderRadius: R.md, padding: "12px 14px", marginTop: 4, marginBottom: 12,
                border: `1px solid ${isCorrect ? C.greenBorder : C.coralBorder}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Ti name={isCorrect ? "check" : "alert-circle"} size={14} color={isCorrect ? C.green : C.coral} />
                  <div style={{ fontSize: 12, fontWeight: 500, color: isCorrect ? C.greenD : C.coralD, fontFamily: FONTS.ui }}>
                    {isCorrect ? `Correct · +${q.xp || 30} XP` : "Pas tout a fait..."}
                  </div>
                </div>
                {(q.exp || q.x) && <div style={{ fontSize: 12, color: isCorrect ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }}>{q.exp || q.x}</div>}
              </div>
              <button onClick={next} style={{ width: "100%", padding: "14px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
                {idx + 1 >= questions.length ? "Voir les resultats" : "Suivant"}
              </button>
            </>
          )}
        </>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}
