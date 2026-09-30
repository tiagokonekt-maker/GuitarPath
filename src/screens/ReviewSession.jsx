// Groply — screens/ReviewSession.jsx
// Session de révision espacée — mélange QCM et manche interactif
import { useState, useCallback, useEffect } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { updateReviewHistory } from "../store/reviewEngine.js";
import { todayStr } from "../store/dates.js";
import { familleDe, niveauFamille, avantNiveauSuivant } from "../store/generateurs.js";
import { jouerEcoute, stopAll, unlockAudio } from "../audioEngine.js";

// ── Composants de rendu injectés par contexte ─────────────────────────────
// Avant, App.jsx MUTAIT ce module au démarrage (`setXxx(...)`) : un singleton
// mutable au niveau module, avec des gardes défensives qui trahissaient la
// fragilité — si un écran se rendait avant l'injection, le composant valait
// null. Un contexte React rend l'ordre de rendu sans importance.
import { useRenderers } from "../renderers.jsx";

/**
 * Grille rythmique compacte pour les réponses de la dictée : 4 options
 * doivent tenir sur un écran de téléphone, là où le schéma complet des
 * leçons prend ~110 px de haut chacun.
 */
function MiniGrille({ grille, C, active }) {
  const n = 4 * grille.pas, sonne = new Set(grille.attaques);
  return (
    <div aria-hidden="true" style={{ display: "flex", gap: 3, flex: 1 }}>
      {Array.from({ length: 4 }, (_, t) => (
        <div key={t} style={{ display: "flex", gap: 2, flex: 1, paddingLeft: t ? 4 : 0, borderLeft: t ? `1.5px solid ${C.border}` : "none" }}>
          {Array.from({ length: grille.pas }, (_, k) => {
            const i = t * grille.pas + k;
            return <div key={k} style={{ flex: 1, height: 20, borderRadius: 4, background: sonne.has(i) ? (active || C.primary) : C.surface2, border: `1px solid ${sonne.has(i) ? "transparent" : C.border}` }} />;
          })}
        </div>
      ))}
    </div>
  );
}

export function ReviewSession({ questions, state, dispatch, onDone }) {
  const { FretboardQuizQuestion } = useRenderers();
  const C = useC();
  const [idx, setIdx]           = useState(0);
  const [sel, setSel]           = useState(null);
  const [fretAnswered, setFretAnswered] = useState(false);
  const [fretCorrect, setFretCorrect]   = useState(null);
  const [results, setResults]   = useState([]); // { id, correct }
  const [finished, setFinished] = useState(false);
  const [suiviFamille, setSuiviFamille] = useState(null);   // progression de la famille après la réponse
  // Écoute : on n'autorise la réponse qu'après une première écoute (sinon on
  // devine), et on peut réécouter à volonté. « Pas de son maintenant » retire
  // les questions d'écoute de la séance, sans pénalité.
  const [ecoutee, setEcoutee] = useState(false);
  const [sansSon, setSansSon] = useState(false);
  useEffect(() => () => { try { stopAll(); } catch { /* noop */ } }, []);

  const today = todayStr();
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
    // Question générée : on dit à l'élève où il en est dans cette compétence.
    const fam = q.genere ? familleDe(q.id) : null;
    if (fam) {
      const avant = niveauFamille((state.reviewHistory || {})[q.id]);
      const h = newHistory[q.id];
      const apres = niveauFamille(h);
      setSuiviFamille({ avant, apres, restant: avantNiveauSuivant(h), suivant: fam.niveaux[apres] || null, libelle: fam.niveaux[apres - 1] });
    } else setSuiviFamille(null);
  };

  // ── Question suivante ─────────────────────────────────────────────────────
  const prochaine = (depuis, muet) => {
    let j = depuis + 1;
    while (j < questions.length && muet && questions[j]?.audio) j++;
    return j;
  };
  const next = (muetForce) => {
    const muet = muetForce ?? sansSon;
    try { stopAll(); } catch { /* noop */ }
    const currentCorrect = results.filter(r => r.correct).length;
    const j = prochaine(idx, muet);
    if (j >= questions.length) {
      if (results.length === 0) { onDone?.(); return; }   // rien n'a été répondu : on ne compte pas de séance
      // Dispatcher les actions de fin de session
      dispatch({ type: "REVIEW_SESSION_DONE", xp: currentCorrect * 20, score: `${currentCorrect}/${results.length}` });
      dispatch({ type: "MARK_STREAK" });
      dispatch({ type: "UPDATE_WEEKLY", field: "quizzes" });
      setFinished(true);
    } else {
      setSel(null);
      setSuiviFamille(null);
      setEcoutee(false);
      setFretAnswered(false);
      setFretCorrect(null);
      setIdx(j);
    }
  };

  // ── Ecran de fin ─────────────────────────────────────────────────────────
  if (finished) {
    const correct = results.filter(r => r.correct).length;
    const repondues = results.length || 1;
    const incorrect = results.length - correct;
    const pct = Math.round((correct / repondues) * 100);
    const xpEarned = correct * 20;
    const title = pct >= 80 ? "Excellent !" : pct >= 50 ? "Bien joué !" : "Continue !";

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
              ? "Excellente révision, ta mémoire se renforce."
              : pct >= 50
              ? "Bon travail ! Les questions ratées reviennent bientôt."
              : "Les erreurs sont normales, c'est comme ça qu'on progresse."}
          </div>
        </div>

        {/* Compétences générées travaillées pendant la séance, avec leur niveau */}
        {(() => {
          const vues = [...new Set(results.map(r => r.id))].map(id => ({ id, fam: familleDe(id) })).filter(x => x.fam && questions.find(q => q.id === x.id)?.genere);
          if (!vues.length) return null;
          const h = state.reviewHistory || {};
          return (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "14px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Tes compétences</div>
              {vues.map(({ id, fam }) => {
                const n = niveauFamille(h[id]);
                return (
                  <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                    <div style={{ flex: 1, fontSize: 12.5, color: C.text, fontFamily: FONTS.ui }}>{fam.titre}</div>
                    <div aria-label={`niveau ${n} sur 3`} style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3].map(k => <span key={k} style={{ width: 14, height: 6, borderRadius: 3, background: k <= n ? C.primary : C.border }} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

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
          Retour à l'accueil
        </button>
      </div>
    );
  }

  if (!q) return null;

  const isCorrect = isFret ? fretCorrect : sel === q.a;
  const xpReelle = state?.lastGain?.kind === "review" ? (state.lastGain.xp || 0) : 0;
  const attendEcoute = !!q.audio && !ecoutee && !answered;
  const ecouter = async () => { try { await unlockAudio(); await jouerEcoute(q.audio); } catch { /* noop */ } setEcoutee(true); };
  const passerSansSon = () => { setSansSon(true); next(true); };

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
          {q.genere ? `${q.famille} · niveau ${q.niveauFamille}/3` : `${isFret ? "Manche" : "QCM"} · Niv. ${q.lvl}`}
        </div>
        {q.genere && <div style={{ fontSize: 10.5, color: C.text3, fontFamily: FONTS.ui }}>{q.libelleNiveau}</div>}
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

      {/* Écoute */}
      {q.audio && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={ecouter} className="gr-focus" style={{
            width: "100%", height: 52, borderRadius: R.lg, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: ecoutee ? C.surface2 : C.primary, color: ecoutee ? C.text : "#fff",
            fontSize: 15, fontWeight: 800, fontFamily: FONTS.ui,
          }}>
            <Ti name="volume" size={18} color={ecoutee ? C.text : "#fff"} />
            {ecoutee ? "Réécouter" : "Écouter"}
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span style={{ fontSize: 11.5, color: C.text3, fontFamily: FONTS.ui }}>{attendEcoute ? "Écoute d'abord, puis choisis." : "Tu peux réécouter autant que tu veux."}</span>
            {!answered && (
              <button onClick={passerSansSon} className="gr-focus" style={{ background: "none", border: "none", padding: "8px 2px", cursor: "pointer", fontSize: 11.5, fontWeight: 700, color: C.text2, fontFamily: FONTS.ui, textDecoration: "underline" }}>
                Pas de son maintenant
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question fretboard */}
      {isFret ? (
        <>
          {FretboardQuizQuestion && (
            <FretboardQuizQuestion
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
                    {isCorrect ? `Correct${xpReelle > 0 ? ` · +${xpReelle} XP` : ""}` : "Pas tout à fait…"}
                  </div>
                </div>
                {q.exp && <div style={{ fontSize: 12, color: isCorrect ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }}>{q.exp}</div>}
              </div>
              <button onClick={() => next()} style={{ width: "100%", padding: "14px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
                {prochaine(idx, sansSon) >= questions.length ? "Voir les résultats" : "Suivant"}
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
              <button key={i} onClick={() => choose(i)} disabled={answered || attendEcoute} aria-label={q.grilles ? opt : undefined} className="gr-focus" style={{
                opacity: attendEcoute ? .45 : 1,
                display: "flex", alignItems: "center", gap: 10,
                background: bg, border, borderRadius: 11, padding: "11px 13px",
                cursor: answered ? "default" : "pointer", textAlign: "left",
                width: "100%", marginBottom: 7, fontFamily: FONTS.title,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, flexShrink: 0, fontFamily: FONTS.ui }}>
                  {ic}
                </div>
                {q.grilles
                  ? <MiniGrille grille={q.grilles[i]} C={C} active={answered && i === q.a ? C.green : answered && i === sel ? C.coral : null} />
                  : <span style={{ fontSize: 13, color: col, lineHeight: 1.4, fontFamily: FONTS.title, fontWeight: answered && i === q.a ? 500 : 400 }}>{opt}</span>}
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
                    {isCorrect ? `Correct${xpReelle > 0 ? ` · +${xpReelle} XP` : ""}` : "Pas tout à fait…"}
                  </div>
                </div>
                {(q.exp || q.x) && <div style={{ fontSize: 12, color: isCorrect ? C.greenD : C.coralD, lineHeight: 1.55, fontFamily: FONTS.ui }}>{q.exp || q.x}</div>}
              </div>
              {suiviFamille && (
                <div role="status" style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, lineHeight: 1.45, color: C.text2, fontFamily: FONTS.ui, background: C.surface2, borderRadius: R.md, padding: "10px 12px", marginBottom: 12 }}>
                  <Ti name={suiviFamille.apres > suiviFamille.avant ? "sparkles" : "target-arrow"} size={15} color={suiviFamille.apres > suiviFamille.avant ? C.primary : C.text3} />
                  <span>
                    {suiviFamille.apres > suiviFamille.avant
                      ? <><b style={{ color: C.primaryD }}>Niveau {suiviFamille.apres} débloqué</b> : {suiviFamille.libelle}.</>
                      : suiviFamille.apres < suiviFamille.avant
                      ? <>On consolide au niveau {suiviFamille.apres} ({suiviFamille.libelle}) avant de remonter.</>
                      : suiviFamille.restant == null
                      ? <>Niveau maximal atteint pour cette compétence. Elle reviendra de temps en temps pour rester ancrée.</>
                      : <>Encore {suiviFamille.restant} réussite{suiviFamille.restant > 1 ? "s" : ""} avant le niveau {suiviFamille.apres + 1} : {suiviFamille.suivant}.</>}
                  </span>
                </div>
              )}
              <button onClick={() => next()} style={{ width: "100%", padding: "14px", borderRadius: R.md, border: "none", background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
                {prochaine(idx, sansSon) >= questions.length ? "Voir les résultats" : "Suivant"}
              </button>
            </>
          )}
        </>
      )}
      <div style={{ height: 16 }} />
    </div>
  );
}
