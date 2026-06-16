// GuitarPath -- screens/EarTraining.jsx
// Quiz d'oreille : intervalles et qualite d'accords
import { useState, useEffect, useRef } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { loadAudio, isAudioLoaded, generateEarTrainingQuestion, playInterval, playChord } from "../audioEngine.js";

const MODES = [
  { key: "interval",      label: "Intervalles",      icon: "arrows-up-down",  desc: "Identifie l'ecart entre deux notes" },
  { key: "chord_quality", label: "Qualite d'accord", icon: "music",           desc: "Majeur, mineur, dominant..." },
];

export function EarTraining({ onBack, dispatch }) {
  const C = useC();
  const [audioReady, setAudioReady]   = useState(isAudioLoaded());
  const [audioError, setAudioError]   = useState(false);
  const [mode, setMode]               = useState("interval");
  const [question, setQuestion]       = useState(null);
  const [selected, setSelected]       = useState(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [score, setScore]             = useState({ correct: 0, total: 0 });
  const [sessionDone, setSessionDone] = useState(false);
  const [answers, setAnswers]         = useState([]);
  const SESSION_LENGTH = 8;

  // Charger l'audio au montage
  useEffect(() => {
    if (!isAudioLoaded()) {
      loadAudio()
        .then(() => setAudioReady(true))
        .catch(() => setAudioError(true));
    }
  }, []);

  // Generer la premiere question quand l'audio est pret
  useEffect(() => {
    if (audioReady && !question) nextQuestion();
  }, [audioReady, mode]);

  const nextQuestion = () => {
    setSelected(null);
    setQuestion(generateEarTrainingQuestion(mode));
  };

  const playQuestion = async () => {
    if (!question || isPlaying) return;
    setIsPlaying(true);
    try { await question.play(); }
    catch {}
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const handleAnswer = (option) => {
    if (selected !== null) return;
    const key = mode === "interval" ? option.semitones : option.key;
    const correct = key === question.answer;
    setSelected(key);
    const newScore = { correct: score.correct + (correct ? 1 : 0), total: score.total + 1 };
    setScore(newScore);
    setAnswers(prev => [...prev, { question: question.options.find(o => (mode === "interval" ? o.semitones : o.key) === question.answer)?.label, correct }]);
    dispatch?.({ type: "REVIEW_ANSWER", questionId: `ear-${Date.now()}`, correct, history: {}, xp: correct ? 25 : 0 });
    if (newScore.total >= SESSION_LENGTH) {
      setTimeout(() => setSessionDone(true), 1200);
    }
  };

  const changeMode = (m) => {
    setMode(m);
    setQuestion(null);
    setSelected(null);
    setScore({ correct: 0, total: 0 });
    setAnswers([]);
    setSessionDone(false);
  };

  // ── Ecran de fin ─────────────────────────────────────────────────────────
  if (sessionDone) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>{pct >= 75 ? "🎧" : pct >= 50 ? "👂" : "📚"}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>
            {pct >= 75 ? "Belle oreille !" : pct >= 50 ? "Bon travail !" : "Continue l'entrainement !"}
          </div>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>{score.correct}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>Correctes</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.coral }}>{score.total - score.correct}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>Ratees</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.primary }}>+{score.correct * 25}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>XP</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 75 ? C.green : pct >= 50 ? C.primary : C.coral, borderRadius: 3 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setScore({ correct:0, total:0 }); setAnswers([]); setSessionDone(false); nextQuestion(); }} style={{ flex: 1, padding: "13px", borderRadius: R.md, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONTS.ui }}>
            Recommencer
          </button>
          <button onClick={onBack} style={{ flex: 1, padding: "13px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* Header */}
      <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0 }}>
          <Ti name="chevron-left" size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>Ear Training</div>
          <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{score.total}/{SESSION_LENGTH} · {score.correct} correctes</div>
        </div>
        <Gropi pose="listen" size={46} anim="bob" />
        <div style={{ fontSize: 13, fontWeight: 600, color: C.primary, fontFamily: FONTS.ui }}>
          {score.total > 0 ? `${Math.round(score.correct/score.total*100)}%` : ""}
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Barre de progression */}
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: SESSION_LENGTH }).map((_, i) => {
            const ans = answers[i];
            return (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: ans ? (ans.correct ? C.green : C.coral) : i === score.total ? C.primary : C.border, transition: "background 0.3s" }} />
            );
          })}
        </div>

        {/* Toggle mode */}
        <div style={{ display: "flex", background: C.surface2, borderRadius: R.lg, padding: 3, gap: 2 }}>
          {MODES.map(m => (
            <button key={m.key} onClick={() => changeMode(m.key)} style={{ flex: 1, padding: "8px 10px", borderRadius: R.md, border: "none", cursor: "pointer", fontFamily: FONTS.ui, background: mode === m.key ? C.surface : "transparent", boxShadow: mode === m.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none", color: mode === m.key ? C.text : C.text3, fontSize: 12, fontWeight: mode === m.key ? 600 : 400 }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Etat chargement audio */}
        {audioError && (
          <div style={{ background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.md, padding: "12px 14px", fontSize: 12, color: C.coralD, fontFamily: FONTS.ui }}>
            Les samples audio n'ont pas ete trouves. Verifie que les fichiers .mp3 sont dans public/audio/guitar/
          </div>
        )}

        {!audioReady && !audioError && (
          <div style={{ background: C.amberL, border: `1px solid ${C.amberBorder}`, borderRadius: R.md, padding: "12px 14px", fontSize: 12, color: C.amberD, fontFamily: FONTS.ui }}>
            Chargement des samples audio...
          </div>
        )}

        {/* Bouton ecoute */}
        {audioReady && question && (
          <>
            <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
              <button onClick={playQuestion} disabled={isPlaying} style={{
                width: 80, height: 80, borderRadius: "50%",
                border: "none",
                background: isPlaying
                  ? `linear-gradient(135deg, ${C.primaryL}, ${C.primaryBorder})`
                  : `linear-gradient(135deg, ${C.primary}, ${C.primaryD})`,
                cursor: isPlaying ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
                boxShadow: isPlaying ? "none" : "0 4px 20px rgba(127,119,221,0.4)",
                transition: "all 0.2s",
              }}>
                <Ti name={isPlaying ? "loader" : "player-play"} size={28} color={isPlaying ? C.primary : "#fff"} />
              </button>
              <div style={{ fontSize: 12, color: C.text3, fontFamily: FONTS.ui, marginTop: 10 }}>
                {mode === "interval" ? "Ecoute l'intervalle" : "Ecoute l'accord"}
              </div>
              {selected === null && (
                <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 4, fontStyle: "italic" }}>
                  Tu peux réécouter autant de fois que tu veux
                </div>
              )}
            </div>

            {/* Options de reponse */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {question.options.map((opt, i) => {
                const key = mode === "interval" ? opt.semitones : opt.key;
                const isAnswer = key === question.answer;
                const isSelected = key === selected;
                let bg = C.surface, border = `1px solid ${C.border}`, col = C.text;
                if (selected !== null) {
                  if (isAnswer)        { bg = C.greenL;  border = `1px solid ${C.green}`;  col = C.greenD; }
                  else if (isSelected) { bg = C.coralL;  border = `1px solid ${C.coral}`;  col = C.coralD; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(opt)} disabled={selected !== null} style={{ padding: "14px 16px", borderRadius: 12, border, background: bg, cursor: selected !== null ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FONTS.title }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: col }}>{opt.label}</span>
                    {selected !== null && isAnswer && <Ti name="check" size={18} color={C.green} />}
                    {selected !== null && isSelected && !isAnswer && <Ti name="x" size={18} color={C.coral} />}
                  </button>
                );
              })}
            </div>

            {/* Feedback + bouton suivant */}
            {selected !== null && (
              <div style={{ marginTop: 4 }}>
                <div style={{ background: selected === question.answer ? C.greenL : C.coralL, border: `1px solid ${selected === question.answer ? C.greenBorder : C.coralBorder}`, borderRadius: R.md, padding: "10px 14px", marginBottom: 10, fontSize: 12, color: selected === question.answer ? C.greenD : C.coralD, fontFamily: FONTS.ui, lineHeight: 1.5 }}>
                  {selected === question.answer
                    ? "Correct ! +25 XP"
                    : `La bonne reponse etait : ${question.options.find(o => (mode === "interval" ? o.semitones : o.key) === question.answer)?.label}`
                  }
                </div>
                {score.total < SESSION_LENGTH && (
                  <button onClick={nextQuestion} style={{ width: "100%", padding: "13px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
                    Question suivante
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
