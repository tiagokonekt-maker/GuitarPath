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
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { getUnitQuizPool, UNIT_CHECK_PASS_PCT, UNIT_CHECK_MAX_QUESTIONS } from "../store/pathEngine.js";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Compose l'échantillon de la vérification.
 *
 * ── Le problème corrigé ──────────────────────────────────────────────────
 * L'ancienne version tirait dans un pool qui, sur les premiers paliers,
 * faisait exactement la taille de l'échantillon (8 questions pour 8 tirées).
 * Les questions étaient donc TOUJOURS les mêmes : refaire la vérification
 * juste après avoir vu les corrections revenait à la valider de mémoire.
 *
 * ── Trois mesures ────────────────────────────────────────────────────────
 * 1. POOL ÉLARGI (côté pathEngine) : le cœur de l'unité plus du renfort
 *    issu des mêmes modules, sur des leçons déjà complétées.
 * 2. DOSAGE : environ deux tiers du cœur de l'unité, un tiers de renfort.
 *    On vérifie bien l'unité — ce n'est pas un examen général — mais avec
 *    assez de matière pour varier.
 * 3. ROTATION : les questions de la tentative précédente sont écartées en
 *    priorité. Reprendre juste après un échec sert à vérifier qu'on a
 *    compris, pas qu'on a retenu quatre corrections.
 *
 * @param dejaVues  identifiants posés à la tentative précédente
 */
function buildSample(unit, content, completedLessons, dejaVues = []) {
  const pool = getUnitQuizPool(unit, content.quiz, completedLessons);
  const parId = new Map(content.quiz.map(q => [q.id, q]));

  // Cet écran ne sait afficher que des QCM : il rend `q.o` en liste de
  // boutons. Les questions de type "fretboard" n'ont pas de tableau
  // d'options (elles se répondent sur le manche) — en laisser passer une
  // provoquerait un crash au rendu. Il y en a 20 dans la banque, et le pool
  // élargi peut désormais en atteindre, ce qui n'était pas le cas quand il
  // se limitait aux `lesson.quiz`.
  const utilisable = (q) =>
    q && q.type !== "fretboard" && Array.isArray(q.o) && q.o.length >= 2
      && typeof q.a === "number" && q.a >= 0 && q.a < q.o.length;

  const resoudre = (ids) => ids.map(id => parId.get(id)).filter(utilisable);

  const taille = Math.min(
    unit.checkSize ?? UNIT_CHECK_MAX_QUESTIONS,
    pool.length || 1
  );

  const core  = resoudre(pool.core ?? pool);
  const extra = resoudre(pool.extra ?? []);
  const ecarte = new Set(dejaVues);

  // On sépare le "jamais posé" du "déjà posé" et on épuise le premier avant
  // de retomber sur le second : la rotation est ainsi progressive plutôt que
  // stricte, et on ne se retrouve jamais avec un échantillon incomplet.
  const parPriorite = (liste) => [
    ...shuffle(liste.filter(q => !ecarte.has(q.id))),
    ...shuffle(liste.filter(q =>  ecarte.has(q.id))),
  ];

  const filesCore  = parPriorite(core);
  const filesExtra = parPriorite(extra);

  // Deux tiers du cœur de l'unité… mais jamais plus de la moitié du cœur
  // DISPONIBLE. Sur une unité dont le cœur ne compte que 7 questions pour un
  // échantillon de 7, viser 65 % obligerait à réutiliser presque les mêmes à
  // la tentative suivante (mesuré : 43 % de recouvrement). En laissant la
  // moitié du cœur de côté, la rotation reste possible.
  const cibleCore = Math.max(1, Math.min(
    Math.round(taille * 0.65),
    Math.ceil(core.length / 2),
  ));
  const choisies = [];
  const prises = new Set();

  const ajouter = (q) => {
    if (!q || prises.has(q.id) || choisies.length >= taille) return;
    prises.add(q.id); choisies.push(q);
  };

  for (const q of filesCore)  { if (choisies.length >= cibleCore) break; ajouter(q); }
  for (const q of filesExtra) { if (choisies.length >= taille)    break; ajouter(q); }
  // Complément : si le renfort est maigre, le cœur finit de remplir.
  for (const q of filesCore)  { if (choisies.length >= taille)    break; ajouter(q); }

  // Ordre de présentation mélangé, pour ne pas servir systématiquement le
  // cœur de l'unité en premier et le renfort à la fin.
  return shuffle(choisies);
}

/**
 * Mélange les propositions d'une question.
 *
 * Sans ça, la bonne réponse reste au même rang d'une tentative à l'autre :
 * on peut valider en mémorisant « c'était la troisième » sans lire l'énoncé.
 * On renvoie une copie — jamais de mutation de la banque de contenu, qui est
 * partagée avec le reste de l'app.
 */
function melangerOptions(q) {
  if (!Array.isArray(q?.o) || q.o.length < 2) return q;
  const indices = shuffle(q.o.map((_, i) => i));
  return {
    ...q,
    o: indices.map(i => q.o[i]),
    a: indices.indexOf(q.a),
  };
}

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
      <div style={{ padding: "32px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Gropi pose={passed ? "celebrate" : "think"} size={110} anim={passed ? "cheer" : "pop"} />
        <h1 style={{ margin: "14px 0 4px", fontSize: 21, fontWeight: 800, color: C.text, fontFamily: FONTS.title }}>
          {passed ? "Unité validée !" : "Pas encore tout à fait"}
        </h1>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: C.text2, lineHeight: 1.5, maxWidth: 300 }}>
          {passed
            ? "Le coffre de cette unité est maintenant à toi."
            : `Il faut ${UNIT_CHECK_PASS_PCT}% pour valider l'unité. Tu peux réessayer, aucune limite de tentatives.`}
        </p>

        <div style={{ width: "100%", maxWidth: 280 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: C.text3 }}>Score</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.text2 }}>{score}/{questions.length} · {pct}%</span>
          </div>
          <div style={{ height: 7, background: C.border, borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 99, background: passed ? C.green : C.coral, transition: "width .5s ease" }} />
          </div>
        </div>

        {!passed && lessonsToReview.length > 0 && (
          <div style={{ width: "100%", maxWidth: 280, marginTop: 18, textAlign: "left" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
              À revoir en priorité
            </div>
            {lessonsToReview.map(l => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.md, marginBottom: 6 }}>
                <Ti name="book-2" size={14} color={C.text3} />
                <span style={{ fontSize: 12.5, color: C.text, fontWeight: 600 }}>{l.title}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onDone} style={{
          width: "100%", maxWidth: 280, marginTop: 20, padding: 14, borderRadius: R.lg, border: "none",
          background: passed ? `linear-gradient(135deg,#FF9155,${C.primary})` : C.surface2,
          color: passed ? "#fff" : C.text2, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui,
        }}>
          {passed ? "Réclamer le coffre" : "Revoir les leçons"}
        </button>

        {!passed && (
          <button onClick={retry} style={{
            width: "100%", maxWidth: 280, marginTop: 10, padding: 12, borderRadius: R.lg,
            border: `1.5px solid ${C.border}`, background: "transparent",
            color: C.text2, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONTS.ui,
          }}>
            Réessayer maintenant
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "14px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <button onClick={onDone} style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.sm, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Ti name="x" size={16} color={C.text2} />
        </button>
        <div style={{ flex: 1, display: "flex", gap: 4 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < idx ? C.green : i === idx ? C.primary : C.border, transition: "background .2s" }} />
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text3, flexShrink: 0 }}>{idx + 1}/{questions.length}</span>
      </div>

      <div style={{ fontSize: 10, color: C.text3, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600 }}>
        Vérification · {unit.title}
      </div>

      <div style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: 16, marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.55, color: C.text, fontFamily: FONTS.title }}>{q.q}</p>
      </div>

      {q.o.map((opt, i) => {
        let bg = C.surface, border = `1.5px solid ${C.border}`, col = C.text, badgeBg = C.surface2, badgeFg = C.text2, ic = ["A", "B", "C", "D"][i];
        if (answered) {
          if (i === q.a) { bg = C.greenL; border = `1.5px solid ${C.green}`; col = C.greenD; badgeBg = C.greenBorder; badgeFg = C.greenD; ic = <Ti name="check" size={12} color={C.greenD} />; }
          else if (i === sel) { bg = C.coralL; border = `1.5px solid ${C.coral}`; col = C.coralD; badgeBg = C.coralBorder; badgeFg = C.coralD; ic = <Ti name="x" size={12} color={C.coralD} />; }
        }
        return (
          <button key={i} onClick={() => choose(i)} disabled={answered} style={{ display: "flex", alignItems: "center", gap: 10, background: bg, border, borderRadius: R.md, padding: "12px 14px", cursor: answered ? "default" : "pointer", textAlign: "left", width: "100%", marginBottom: 7, fontFamily: FONTS.title }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: badgeBg, color: badgeFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{ic}</div>
            <span style={{ fontSize: 13, color: col, lineHeight: 1.45, fontWeight: answered && i === q.a ? 700 : 500 }}>{opt}</span>
          </button>
        );
      })}

      {answered && (
        <>
          <div style={{ background: sel === q.a ? C.greenL : C.coralL, borderRadius: R.md, padding: "12px 14px", marginBottom: 12, border: `1.5px solid ${sel === q.a ? C.greenBorder : C.coralBorder}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Ti name={sel === q.a ? "check" : "alert-circle"} size={14} color={sel === q.a ? C.green : C.coral} />
              <div style={{ fontSize: 12, fontWeight: 700, color: sel === q.a ? C.greenD : C.coralD }}>
                {sel === q.a ? "CORRECT" : "PAS TOUT À FAIT"}
              </div>
            </div>
            {q.exp && <p style={{ margin: 0, fontSize: 12.5, color: C.text2, lineHeight: 1.5 }}>{q.exp}</p>}
          </div>
          <button onClick={next} style={{
            width: "100%", padding: 13, borderRadius: R.lg, border: "none",
            background: C.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui,
          }}>
            {idx + 1 >= questions.length ? "Voir le résultat" : "Continuer"}
          </button>
        </>
      )}
      <div style={{ height: 24 }} />
    </div>
  );
}
