// Groply — screens/ReviewSession.jsx
// Session de révision espacée — mélange QCM et manche interactif
import { useState, useEffect } from "react";
import { R, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import {
  AnswerOption, Button, Card, Eyebrow, Feedback, Gauge,
  QuestionCard, ResultScreen, SessionBar, Tag,
} from "../design/ui.jsx";
import { vibrer } from "../design/hooks.js";
import { POSE_ROLE } from "../design/gropiPoses.js";
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

const LETTRES = ["A", "B", "C", "D"];

/**
 * Grille rythmique compacte pour les réponses de la dictée : 4 options
 * doivent tenir sur un écran de téléphone, là où le schéma complet des
 * leçons prend ~110 px de haut chacun.
 */
function MiniGrille({ grille, C, active }) {
  const sonne = new Set(grille.attaques);
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
      const hAvant = (state.reviewHistory || {})[q.id];
      const avant = niveauFamille(hAvant);
      const h = newHistory[q.id];
      const apres = niveauFamille(h);
      // Remonter après une consolidation n'est pas un nouveau déblocage : le
      // niveau avait déjà été atteint (le total de réussites le prouve).
      const seuil = { 2: 3, 3: 8 }[apres] ?? Infinity;
      const retour = apres > avant && (hAvant?.successes || 0) >= seuil;
      setSuiviFamille({ avant, apres, retour, restant: avantNiveauSuivant(h), suivant: fam.niveaux[apres] || null, libelle: fam.niveaux[apres - 1] });
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
      if (currentCorrect / results.length >= 0.8) vibrer([12, 40, 18]);
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

    // Compétences générées travaillées pendant la séance, avec leur niveau
    const vues = [...new Set(results.map(r => r.id))].map(id => ({ id, fam: familleDe(id) })).filter(x => x.fam && questions.find(q => q.id === x.id)?.genere);
    const h = state.reviewHistory || {};
    const details = vues.length > 0 || wrongItems.length > 0 || pct >= 80;

    return (
      <ResultScreen
        pose={pct >= 80 ? "celebrate" : pct >= 50 ? "pride" : "think"}
        gropiSize={pct >= 80 ? 150 : 110}
        anim={pct >= 50 ? "cheer" : "pop"}
        confetti={pct >= 80}
        title={title}
        subtitle={pct >= 80
          ? "Excellente révision, ta mémoire se renforce."
          : pct >= 50
          ? "Bon travail ! Les questions ratées reviennent bientôt."
          : "Les erreurs sont normales, c'est comme ça qu'on progresse."}
        stats={[
          { value: correct, label: "Correctes", tone: "green" },
          { value: incorrect, label: "A revoir", tone: incorrect > 0 ? "coral" : "neutral" },
          { value: xpEarned, label: "XP", tone: "primary", prefix: "+" },
        ]}
        pct={pct} pctTone={pct >= 80 ? "green" : pct >= 50 ? "primary" : "coral"}
        actions={<Button size="lg" full onClick={onDone}>Retour à l'accueil</Button>}
      >
        {details && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {vues.length > 0 && (
              <Card pad={14}>
                <Eyebrow tone="neutral" style={{ color: C.text3, marginBottom: 8 }}>Tes compétences</Eyebrow>
                {vues.map(({ id, fam }) => {
                  const n = niveauFamille(h[id]);
                  return (
                    <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                      <div style={{ flex: 1, fontSize: T.small, color: C.text }}>{fam.titre}</div>
                      <Gauge size="sm" value={n} max={3} label={`niveau ${n} sur 3`} />
                    </div>
                  );
                })}
              </Card>
            )}

            {/* Questions ratees */}
            {wrongItems.length > 0 && (
              <Card tone="coral" soft pad="12px 14px">
                <Eyebrow tone="coral" style={{ marginBottom: 8 }}>A retravailler ({wrongItems.length})</Eyebrow>
                {wrongItems.map((q, i) => (
                  <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < wrongItems.length - 1 ? 8 : 0 }}>
                    <div style={{ width: 18, height: 18, borderRadius: R.pill, background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Ti name="x" size={10} color={C.onPrimaryBtn} />
                    </div>
                    <div style={{ fontSize: 12, color: C.coralD, lineHeight: 1.45 }}>
                      {q.q?.substring(0, 80)}{q.q?.length > 80 ? "..." : ""}
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: T.micro, color: C.coralD, marginTop: 8, fontStyle: "italic" }}>
                  Ces questions auront une priorite elevee lors de ta prochaine session.
                </div>
              </Card>
            )}

            {/* Message si tout reussi */}
            {pct >= 80 && (
              <Card tone="green" soft pad="12px 14px" style={{ fontSize: 12, color: C.greenD, lineHeight: 1.5 }}>
                Bien joue ! Les questions reussies ont ete reportees. Tu les reverras moins souvent.
              </Card>
            )}
          </div>
        )}
      </ResultScreen>
    );
  }

  if (!q) return null;

  const isCorrect = isFret ? fretCorrect : sel === q.a;
  const xpReelle = state?.lastGain?.kind === "review" ? (state.lastGain.xp || 0) : 0;
  const attendEcoute = !!q.audio && !ecoutee && !answered;
  const ecouter = async () => { try { await unlockAudio(); await jouerEcoute(q.audio); } catch { /* noop */ } setEcoutee(true); };
  const passerSansSon = () => { setSansSon(true); next(true); };
  const derniere = prochaine(idx, sansSon) >= questions.length;
  const etatDe = (i) => !answered ? "idle" : i === q.a ? "correct" : i === sel ? "wrong" : "muted";
  const monte = suiviFamille && suiviFamille.apres > suiviFamille.avant;

  // Retour après la réponse : explication, Gropi qui réagit en un clin d'œil
  // (rien n'attend), puis le bouton pour avancer. `avant` : encart inséré
  // au-dessus du bouton (progression de la compétence).
  const retour = (explication, avant = null) => (
    <Feedback
      correct={isCorrect}
      title={isCorrect ? `Correct${xpReelle > 0 ? ` · +${xpReelle} XP` : ""}` : "Pas tout à fait…"}
      action={<>
        {avant}
        <Button size="lg" full tone={isCorrect ? "green" : "primary"} iconRight={derniere ? undefined : "arrow-right"} onClick={() => next()}>
          {derniere ? "Voir les résultats" : "Suivant"}
        </Button>
      </>}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{explication}</div>
        <Gropi key={isCorrect ? "ok" : "ko"} pose={isCorrect ? POSE_ROLE.bonne : POSE_ROLE.erreur} size={40} anim="pop" />
      </div>
    </Feedback>
  );

  return (
    <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      <SessionBar onClose={onDone} current={idx + 1} total={questions.length}
        pct={(idx + (answered ? 1 : 0)) / questions.length * 100} />

      <QuestionCard key={idx} eyebrow={
        <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <Tag tone={isFret ? "amber" : "primary"}>
            {q.genere ? `${q.famille} · niveau ${q.niveauFamille}/3` : `${isFret ? "Manche" : "QCM"} · Niv. ${q.lvl}`}
          </Tag>
          {q.genere && <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>{q.libelleNiveau}</span>}
        </span>
      }>
        {q.q}
      </QuestionCard>

      {/* Grille affichée dans l'énoncé (lecture de mesure) — avant l'écoute et
          les options : c'est elle qui pose la question. */}
      {q.grilleQuestion && (
        <Card pad="10px 12px">
          <MiniGrille grille={q.grilleQuestion} C={C} />
        </Card>
      )}

      {/* Écoute */}
      {q.audio && (
        <div>
          <Button size="lg" full icon="volume" variant={ecoutee ? "secondary" : "primary"} onClick={ecouter}>
            {ecoutee ? "Réécouter" : "Écouter"}
          </Button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: C.text3 }}>{attendEcoute ? "Écoute d'abord, puis choisis." : "Tu peux réécouter autant que tu veux."}</span>
            {!answered && (
              <Button variant="ghost" tone="neutral" size="sm" onClick={passerSansSon} style={{ padding: "0 4px", minHeight: 44, color: C.text2 }}>
                Pas de son maintenant
              </Button>
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
          {fretAnswered && retour(q.exp)}
        </>
      ) : (
        /* QCM */
        <>
          <div key={idx} className="gr-stagger" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.o.map((opt, i) => (
              <AnswerOption key={i} etat={etatDe(i)} marker={LETTRES[i]} locked={answered}
                disabled={attendEcoute} aria-label={q.grilles ? opt : undefined}
                style={attendEcoute ? { opacity: .45 } : undefined}
                onClick={() => choose(i)}>
                {q.grilles
                  ? <MiniGrille grille={q.grilles[i]} C={C} active={answered && i === q.a ? C.green : answered && i === sel ? C.danger : null} />
                  : opt}
              </AnswerOption>
            ))}
          </div>

          {answered && retour(q.exp || q.x, suiviFamille && (
            <div role="status" style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, lineHeight: 1.45, color: C.text2, background: C.surface, border: `2px solid ${C.border}`, borderRadius: R.md, padding: "10px 12px" }}>
              <Ti name={monte ? "sparkles" : "target-arrow"} size={15} color={monte ? C.primary : C.text3} />
              <span>
                {monte
                  ? (suiviFamille.retour
                      ? <><b style={{ color: C.primaryD }}>De retour au niveau {suiviFamille.apres}</b> : {suiviFamille.libelle}.</>
                      : <><b style={{ color: C.primaryD }}>Niveau {suiviFamille.apres} débloqué</b> : {suiviFamille.libelle}.</>)
                  : suiviFamille.apres < suiviFamille.avant
                  ? <>On consolide au niveau {suiviFamille.apres} ({suiviFamille.libelle}) avant de remonter.</>
                  : suiviFamille.restant == null
                  ? <>Niveau maximal atteint pour cette compétence. Elle reviendra de temps en temps pour rester ancrée.</>
                  : <>Encore {suiviFamille.restant} réussite{suiviFamille.restant > 1 ? "s" : ""} avant le niveau {suiviFamille.apres + 1} : {suiviFamille.suivant}.</>}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
