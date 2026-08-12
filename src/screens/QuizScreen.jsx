// Groply — screens/QuizScreen.jsx
import { useState, useMemo } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ProgressBar, XPPop } from "../design/ui.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { makeEarQuizQuestion, loadAudio } from "../audioEngine.js";
import { makeShapeQuestion } from "../music/shapeQuestions.js";
import { buildReviewSession } from "../store/reviewEngine.js";

export let _FretboardQuizQuestion = null;
export const setFretboardQuizQuestion = (fn) => { _FretboardQuizQuestion = fn; };

// ── Données modules quiz ──────────────────────────────────────────────────────
const makeModules = (C) => [
  { id:"neck",    label:"Manche",   icon:"map-2",    color:C.amber,  colorL:C.amberL,  colorD:C.amberD,  border:C.amberBorder },
  { id:"scales",  label:"Gammes",   icon:"music",    color:C.green,  colorL:C.greenL,  colorD:C.greenD,  border:C.greenBorder },
  { id:"harmony", label:"Harmonie", icon:"stack-2",  color:C.purple, colorL:C.purpleL, colorD:C.purpleD, border:C.purpleBorder },
  { id:"rhythm",  label:"Rythme",   icon:"metronome",color:C.blue,   colorL:C.blueL,   colorD:C.blueD,   border:C.blueBorder },
  { id:"impro",   label:"Impro",    icon:"wand",     color:C.pink,   colorL:C.pinkL,   colorD:C.pinkD,   border:C.pinkBorder },
];

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
  const MODULES = makeModules(C);
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

  if (mode) return (
    <QuizPlayer pool={mode.pool} title={mode.label} state={state} dispatch={dispatch} content={content} onDone={() => setMode(null)} />
  );

  return (
    <div>
      {/* ── EN-TÊTE ── (masqué en mode intégré : l'hôte le fournit) ────── */}
      {!embedded && <div style={{
        backgroundColor:"#36b3d7", backgroundImage:"url('/ocean.jpg')",
        backgroundSize:"cover", backgroundPosition:"center 30%",
        padding:"24px 20px 20px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(0,60,80,.50)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
        <div style={{ fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Quiz</div>
        <div style={{ fontSize:13, fontWeight:500, color:"rgba(255,255,255,.8)", marginTop:2, marginBottom:14 }}>
          {totalAnswered} / {totalQ} questions répondues
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{pctDone}% maîtrisé</span>
          {wrongCount > 0 && <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,.85)" }}>{wrongCount} à réviser</span>}
        </div>
        <ProgressBar pct={pctDone} color={C.teal} h={7} />
        </div>
      </div>}

      <div style={{ padding: embedded ? "4px 20px 0" : "16px 20px 0" }}>

        {/* ── BLOC PRIORITAIRE : quiz du jour + révision ───────────────────── */}
        <div style={{ fontSize:11, fontWeight:700, color:C.text3, letterSpacing:".07em", textTransform:"uppercase", marginBottom:10 }}>
          Aujourd'hui
        </div>

        {/* Quiz du jour — carte hero */}
        <button onClick={() => launch("daily","Quiz du jour")} style={{
          width:"100%", background:`linear-gradient(135deg, ${C.primaryL}, ${C.surface})`,
          border:`2px solid ${C.primaryBorder}`, borderRadius:R.xl,
          padding:16, cursor:"pointer", textAlign:"left",
          fontFamily:FONTS.title, marginBottom:10,
          display:"flex", gap:14, alignItems:"center",
        }}>
          <div style={{ width:52, height:52, borderRadius:R.lg, background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 12px ${C.primaryBorder}` }}>
            <Ti name="star" size={24} color="#fff" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.primary, letterSpacing:".08em", textTransform:"uppercase", marginBottom:3 }}>
              Recommandé · 7 questions
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:"-.2px" }}>Quiz du jour</div>
            <div style={{ fontSize:12, color:C.text3, marginTop:2 }}>Adapté à ta progression · ~5 min</div>
          </div>
          <Ti name="arrow-right" size={18} color={C.primary} />
        </button>

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
          style={{
            width:"100%", background:"none", border:"none", cursor:"pointer",
            padding:"6px 0 10px", display:"flex", alignItems:"center", gap:7,
            fontFamily:FONTS.ui, textAlign:"left",
          }}>
          <Ti name={showModules ? "chevron-down" : "chevron-right"} size={15} color={C.text3} />
          <span style={{ fontSize:11, fontWeight:700, color:C.text3, letterSpacing:".07em", textTransform:"uppercase" }}>
            Cibler un module
          </span>
        </button>

        {showModules && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
            {MODULES.map(m => {
              const total = content.quiz.filter(q => q.courseId===m.id && isUnlocked(q)).length;
              if (total === 0) return null;
              return (
                <button key={m.id} onClick={() => launch(m.id, m.label)} style={{
                  background:C.surface, border:`1.5px solid ${C.border}`,
                  borderRadius:R.md, padding:"11px 12px",
                  display:"flex", alignItems:"center", gap:9,
                  cursor:"pointer", textAlign:"left", fontFamily:FONTS.ui,
                }}>
                  <Ti name={m.icon} size={17} color={m.color} />
                  <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{m.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ height:24 }} />
      </div>
    </div>
  );
}

// ── QuizPlayer (logique 100% inchangée, layout retouché) ──────────────────────
function QuizPlayer({ pool, title, state, dispatch, content, onDone }) {
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
    <div style={{ padding:"32px 20px", textAlign:"center", color:C.text2, fontFamily:FONTS.title }}>
      Aucune question disponible.
      <br />
      <button onClick={onDone} style={{ marginTop:16, padding:"10px 20px", border:"none", borderRadius:R.sm, background:C.primary, color:"#fff", cursor:"pointer", fontFamily:FONTS.ui, fontSize:13, fontWeight:600 }}>Retour</button>
    </div>
  );

  const q = questions[idx];
  const isFretQ  = q.type === "fretboard";
  const answered = isFretQ ? fretAnswered : sel !== null;

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
    const isReview  = /révision/i.test(title);       // session de rattrapage
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
      <div style={{ padding:"28px 20px 32px", display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
        {/* Gropi */}
        <Gropi pose={pose} size={(isPerfect||redeemed) ? 160 : 120} anim={anim}/>

        {/* Titre */}
        <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-.4px", marginTop:(isPerfect||redeemed)?6:10, textAlign:"center" }}>
          {heading}
        </div>
        <div style={{ fontSize:13, fontWeight:500, color:C.text2, marginTop:6, textAlign:"center", lineHeight:1.5, maxWidth:260 }}>
          {subtitle}
        </div>

        {/* Score */}
        <div style={{
          display:"flex", gap:16, margin:"18px 0 0",
          background:C.surface, border:`1.5px solid ${C.border}`,
          borderRadius:R.xl, padding:"14px 24px",
        }}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:C.green}}>{score}</div>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:".06em"}}>Correctes</div>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:C.text2}}>{questions.length-score}</div>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:".06em"}}>À revoir</div>
          </div>
          <div style={{width:1,background:C.border}}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:C.primary}}>+{xpEarned}</div>
            <div style={{fontSize:10,fontWeight:700,color:C.text3,textTransform:"uppercase",letterSpacing:".06em"}}>XP</div>
          </div>
        </div>

        {/* Barre de score */}
        <div style={{width:"100%",marginTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontSize:11,color:C.text3}}>Score</span>
            <span style={{fontSize:11,fontWeight:700,color:C.text2}}>{pct}%</span>
          </div>
          <div style={{height:7,background:C.border,borderRadius:99,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",borderRadius:99,transition:"width .5s ease",
              background:isPerfect?C.green:isGood?C.primary:C.pink}}/>
          </div>
        </div>

        <button onClick={onDone} style={{
          width:"100%", marginTop:20, padding:14, borderRadius:R.lg, border:"none",
          background:`linear-gradient(135deg,#FF9155,${C.primary})`,
          color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui,
          boxShadow:`0 4px 16px ${C.primary}44`,
        }}>
          Retour
        </button>
      </div>
    );
  }

  const linkedLesson = q.lessonId ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===q.lessonId) : null;
  const linkedCourse = q.courseId ? content.courses.find(c=>c.id===q.courseId) : null;

  return (
    <div style={{ padding:"14px 20px 0" }}>
      {/* Header barre progression + quitter */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
        <button onClick={onDone} style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.sm, width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
          <Ti name="x" size={16} color={C.text2} />
        </button>
        <div style={{ flex:1, display:"flex", gap:4 }}>
          {questions.map((_,i) => (
            <div key={i} style={{ height:4, flex:1, borderRadius:2, background: i<idx ? C.green : i===idx ? C.primary : C.border, transition:"background .2s" }} />
          ))}
        </div>
        <span style={{ fontSize:12, fontWeight:700, color:C.text3, flexShrink:0 }}>{idx+1}/{questions.length}</span>
      </div>

      {/* Meta */}
      <div style={{ fontSize:10, color:C.text3, marginBottom:8, textTransform:"uppercase", letterSpacing:".1em", fontWeight:600 }}>
        {linkedCourse?.title} · Niv. {q.lvl}
        {isFretQ && <span style={{ marginLeft:6, color:C.amber, fontWeight:700 }}>· Manche</span>}
      </div>

      {/* Question */}
      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:16, marginBottom:10 }}>
        <p style={{ margin:0, fontSize:15, fontWeight:600, lineHeight:1.55, color:C.text, fontFamily:FONTS.title }}>{q.q}</p>
      </div>

      {/* Bouton d'écoute — questions d'oreille uniquement */}
      {q.type === "ear" && (
        <button
          onClick={async () => { await loadAudio(); q.play?.(); }}
          style={{
            width:"100%", padding:"14px 0", marginBottom:10, borderRadius:R.lg,
            border:`1.5px solid ${C.primary}`, background:C.primaryL, color:C.primaryD,
            fontWeight:800, fontSize:14, fontFamily:FONTS.ui, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          }}
        >
          <Ti name="volume" size={18} color={C.primary} />
          Écouter
        </button>
      )}

      {/* Fretboard ou QCM */}
      {isFretQ ? (
        <>
          {_FretboardQuizQuestion && <_FretboardQuizQuestion question={q} onComplete={handleFretComplete} answered={fretAnswered} />}
          {fretAnswered && (
            <>
              <FeedbackBox ok={fretCorrect} xp={q.xp||40} exp={q.exp} lesson={null} />
              <NextBtn onClick={next} last={idx+1>=questions.length} />
            </>
          )}
        </>
      ) : (
        <>
          {q.o.map((opt, i) => {
            let bg=C.surface, border=`1.5px solid ${C.border}`, col=C.text, badgeBg=C.surface2, badgeFg=C.text2, ic=["A","B","C","D"][i];
            if (answered) {
              if (i===q.a)   { bg=C.greenL; border=`1.5px solid ${C.green}`;  col=C.greenD;  badgeBg=C.greenBorder; badgeFg=C.greenD;  ic=<Ti name="check" size={12} color={C.greenD} />; }
              else if(i===sel){ bg=C.coralL;border=`1.5px solid ${C.coral}`;col=C.coralD;badgeBg=C.coralBorder;badgeFg=C.coralD;ic=<Ti name="x" size={12} color={C.coralD} />; }
            }
            return (
              <button key={i} onClick={()=>choose(i)} disabled={answered} style={{ display:"flex", alignItems:"center", gap:10, background:bg, border, borderRadius:R.md, padding:"12px 14px", cursor:answered?"default":"pointer", textAlign:"left", width:"100%", marginBottom:7, fontFamily:FONTS.title }}>
                <div style={{ width:26, height:26, borderRadius:8, background:badgeBg, color:badgeFg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{ic}</div>
                <span style={{ fontSize:13, color:col, lineHeight:1.45, fontWeight:answered&&i===q.a?700:500 }}>{opt}</span>
              </button>
            );
          })}
          {answered && (
            <>
              <FeedbackBox ok={sel===q.a} xp={q.xp||30} exp={q.exp||q.x} lesson={linkedLesson} />
              <NextBtn onClick={next} last={idx+1>=questions.length} />
            </>
          )}
        </>
      )}
      <div style={{ height:24 }} />
    </div>
  );
}

// ── Micro-composants ──────────────────────────────────────────────────────────
function FeedbackBox({ ok, xp, exp, lesson }) {
  const C = useC();
  return (
    <div style={{ background:ok?C.greenL:C.coralL, borderRadius:R.md, padding:"12px 14px", marginBottom:12, border:`1.5px solid ${ok?C.greenBorder:C.coralBorder}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
        <Ti name={ok?"check":"alert-circle"} size={14} color={ok?C.green:C.coral} />
        <div style={{ fontSize:12, fontWeight:700, color:ok?C.greenD:C.coralD }}>
          {ok ? `CORRECT · +${xp} XP` : "PAS TOUT À FAIT…"}
        </div>
      </div>
      <div style={{ fontSize:12, color:ok?C.greenD:C.coralD, lineHeight:1.55 }}>{exp}</div>
      {lesson && <div style={{ fontSize:11, color:C.primary, marginTop:6 }}>Pour approfondir : <em>{lesson.title}</em></div>}
    </div>
  );
}

function NextBtn({ onClick, last }) {
  const C = useC();
  return (
    <button onClick={onClick} style={{ width:"100%", padding:14, borderRadius:R.lg, border:"none", background:C.primary, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:FONTS.ui }}>
      {last ? "Voir les résultats" : "Suivant →"}
    </button>
  );
}

export { QuizScreen, QuizPlayer };
