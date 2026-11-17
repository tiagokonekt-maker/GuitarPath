// Groply — screens/ExercisesScreen.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { MODULE, R, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import {
  AnimatedNumber, AnswerOption, Button, Card, Chip, Confetti, Eyebrow, IconTile,
  ListGroup, ListRow, ProgressBar, ResultScreen, ScreenHero, StatTile, SubHeader, Tag, XPPop,
} from "../design/ui.jsx";
import { toneOf, vibrer } from "../design/hooks.js";
import { updateReviewHistory } from "../store/reviewEngine.js";

// ── Composants de rendu injectés par contexte ─────────────────────────────
// Avant, App.jsx MUTAIT ce module au démarrage (`setXxx(...)`) : un singleton
// mutable au niveau module, avec des gardes défensives qui trahissaient la
// fragilité — si un écran se rendait avant l'injection, le composant valait
// null. Un contexte React rend l'ordre de rendu sans importance.
import { useRenderers } from "../renderers.jsx";

// ── Helpers ──────────────────────────────────────────────────────────────────
const LEVEL_LABELS = { 1:"Fondamentaux", 2:"Intermédiaire", 3:"Avancé" };
const DIFF_STARS = { 1:"★☆☆", 2:"★★☆", 3:"★★★" };
// Teinte d'un niveau, teinte d'un module (repli : celle du manche).
const TON_NIVEAU = { 1:"green", 2:"amber", 3:"pink" };
const tonModule = (mod) => (MODULE[mod] || MODULE.neck).color;

// ── ExercisesScreen ───────────────────────────────────────────────────────────
/**
 * @param embedded  true dans l'onglet Pratique : masque le grand en-tête
 *                  image, fourni par l'écran hôte.
 */
function ExercisesScreen({ state, dispatch, content, embedded = false }) {
  const [showFilters, setShowFilters] = useState(false);
  const C = useC();
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);

  const cats = [
    { id:"all",     label:"Tous" },
    { id:"debut",   label:"Premiers pas" },
    { id:"neck",    label:"Manche" },
    { id:"scales",  label:"Gammes" },
    { id:"harmony", label:"Harmonie" },
    { id:"rhythm",  label:"Rythme" },
    { id:"impro",   label:"Impro" },
  ];

  const allEx = content.exercises;

  // Stats globales
  const totalDone  = useMemo(() => allEx.filter(e => state.completedExercises[e.id]).length, [state.completedExercises, allEx]);
  const totalXP    = useMemo(() => allEx.reduce((s,e) => s + (state.completedExercises[e.id] ? e.xp : 0), 0), [state.completedExercises, allEx]);
  const pctGlobal  = allEx.length ? Math.round(totalDone / allEx.length * 100) : 0;

  // Exercice recommandé = premier non-complété du niveau le plus bas
  const recommended = useMemo(() => {
    const sorted = [...allEx].sort((a,b) => (a.lvl||1) - (b.lvl||1));
    return sorted.find(e => !state.completedExercises[e.id] && (filter==="all" || e.mod===filter));
  }, [allEx, state.completedExercises, filter]);

  // Exercices filtrés groupés par niveau
  const byLevel = useMemo(() => {
    const filtered = allEx.filter(e => filter==="all" || e.mod===filter);
    const groups = {};
    filtered.forEach(e => {
      const l = e.lvl || 1;
      if (!groups[l]) groups[l] = [];
      groups[l].push(e);
    });
    return groups;
  }, [allEx, filter]);

  if (active) return (
    <ExerciseDetail ex={active} state={state} dispatch={dispatch} onBack={() => setActive(null)} content={content} />
  );

  return (
    <div>
      {/* En-tête masqué en mode intégré : l'hôte le fournit. */}
      {!embedded && (
        <ScreenHero
          image="/beach.jpg" color="#e6af6d" overlay="rgba(20,60,120,.45)" position="center 55%"
          title="Exercices" subtitle={`${totalDone} / ${allEx.length} complétés · ${totalXP} XP gagnés`}
        >
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{pctGlobal}% terminé</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.88)" }}>{allEx.length - totalDone} restants</span>
            </div>
            <ProgressBar pct={pctGlobal} color={C.amber} track="rgba(255,255,255,.3)" />
          </div>
        </ScreenHero>
      )}

      <div className="gr-stagger" style={{ padding: embedded ? "4px 0 24px" : "12px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ── CIBLER UNE MATIÈRE — replié ────────────────────────────────
            Les pastilles de filtre étaient auparavant le PREMIER élément de
            l'écran : elles imposaient un choix avant même de savoir ce qu'on
            cherchait, et sur la taxonomie par matière qu'on a abandonnée
            ailleurs. Elles restent disponibles (utile guitare en main, pour
            travailler un point précis), mais repliées par défaut. */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className="gr-squish gr-focus"
          style={{
            alignSelf: "flex-start", minHeight: 44, background: "none", border: "none",
            padding: "0 4px", display: "flex", alignItems: "center", gap: 7,
            fontFamily: "inherit", textAlign: "left",
          }}>
          <Ti name={showFilters ? "chevron-down" : "chevron-right"} size={16} color={C.text3} />
          <span style={{ fontSize: T.micro, fontWeight: 700, color: C.text3, letterSpacing: ".07em", textTransform: "uppercase" }}>
            {filter === "all" ? "Cibler une matière" : `Filtré : ${cats.find(c=>c.id===filter)?.label}`}
          </span>
        </button>

        {showFilters && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "2px 2px 6px" }}>
            {cats.map(c => (
              <Chip key={c.id} selected={filter===c.id} onClick={() => setFilter(c.id)}>{c.label}</Chip>
            ))}
          </div>
        )}

        {/* ── RECOMMANDÉ ───────────────────────────────────────────────────── */}
        {recommended && (
          <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Eyebrow tone="neutral" style={{ color: C.text3, margin: "0 4px" }}>Recommandé pour toi</Eyebrow>
            <Card onClick={() => setActive(recommended)} tone="primary" soft
              style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <IconTile icon="player-play" tone="primary" solid size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Eyebrow style={{ marginBottom: 3 }}>
                  {LEVEL_LABELS[recommended.lvl||1]} · {DIFF_STARS[recommended.lvl||1]}
                </Eyebrow>
                <div style={{ fontSize: T.lead, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }}>{recommended.title}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center", fontSize: 12, color: C.text2 }}>
                  <span>{recommended.dur} min</span>
                  {recommended.bpm && <span>♩ {recommended.bpm}</span>}
                  <Tag>+{recommended.xp} XP</Tag>
                </div>
              </div>
              <Ti name="arrow-right" size={20} color={C.primaryInk} />
            </Card>
          </section>
        )}

        {/* ── GROUPES PAR NIVEAU ──────────────────────────────────────────── */}
        {[1, 2, 3].map(lvl => {
          const exos = byLevel[lvl];
          if (!exos || exos.length === 0) return null;
          const lvlDone = exos.filter(e => state.completedExercises[e.id]).length;
          const lvlPct  = Math.round(lvlDone / exos.length * 100);
          const k       = toneOf(C, TON_NIVEAU[lvl]);

          return (
            <section key={lvl} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Header groupe */}
              <Card tone={TON_NIVEAU[lvl]} soft pad="12px 14px">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: R.pill, background: k.c }} />
                    <span style={{ fontSize: T.small, fontWeight: 800, color: k.d }}>{LEVEL_LABELS[lvl]}</span>
                    <span style={{ fontSize: T.micro, color: k.d, opacity: .7 }}>{DIFF_STARS[lvl]}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: k.d }}>{lvlDone}/{exos.length}</span>
                </div>
                <ProgressBar pct={lvlPct} color={k.c} h={8} track={C.surface} />
              </Card>

              {/* Liste exercices */}
              <ListGroup>
                {exos.map(ex => {
                  const done       = !!state.completedExercises[ex.id];
                  const inProgress = (state.exerciseProgress[ex.id]?.length || 0) > 0;
                  const count      = state.completedExercises[ex.id]?.count || 0;

                  return (
                    <ListRow key={ex.id} onClick={() => setActive(ex)}
                      lead={
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          <IconTile size={44} solid={done}
                            icon={done ? "check" : inProgress ? "player-pause" : "guitar-pick"}
                            tone={done ? "green" : inProgress ? "amber" : tonModule(ex.mod)} />
                          {count > 1 && (
                            <div style={{
                              position: "absolute", top: -5, right: -5, minWidth: 18, height: 18, boxSizing: "border-box", padding: "0 4px",
                              borderRadius: R.pill, background: C.greenInk, border: `2px solid ${C.surface}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, fontWeight: 800, color: C.onPrimaryBtn,
                            }}>{count}</div>
                          )}
                        </div>
                      }
                      title={
                        <span style={{ color: done ? C.text2 : C.text, textDecorationLine: done ? "line-through" : "none", textDecorationColor: C.text3 }}>
                          {ex.title}
                        </span>
                      }
                      detail={
                        <span style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
                          <span>{ex.dur} min</span>
                          {ex.bpm && <span>♩{ex.bpm}</span>}
                          <Tag tone={done ? "green" : "primary"} icon={done ? "check" : undefined}>
                            {done ? `${ex.xp} XP` : `+${ex.xp} XP`}
                          </Tag>
                          {inProgress && !done && <Tag tone="amber">En cours</Tag>}
                        </span>
                      }
                    />
                  );
                })}
              </ListGroup>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ── ExerciseDetail ────────────────────────────────────────────────────────────
function ExerciseDetail({ ex, state, dispatch, onBack, content }) {
  const { FretboardExercise } = useRenderers();
  const C = useC();
  const saved  = state.exerciseProgress[ex.id] || [];
  const [checked, setChecked] = useState(saved);
  const [done, setDone]       = useState(false);
  const [pop,  setPop]        = useState(false);
  // Exercice sur le manche réussi : confettis (l'exercice classique fête sa
  // fin dans son écran de résultat).
  const [fete, setFete]       = useState(false);
  const popTimerRef = useRef(null);
  useEffect(() => () => { if (popTimerRef.current) clearTimeout(popTimerRef.current); }, []);

  const estFretboard = ex.type === "fretboard_exercise";

  // Sauvegarde des étapes cochées (exercice classique). Placé AVANT le
  // retour anticipé de l'exercice fretboard : un hook appelé après un
  // `return` conditionnel change l'ordre des hooks d'un rendu à l'autre.
  useEffect(() => {
    if (!estFretboard && checked.length > 0 && !done) dispatch({ type:"SAVE_EXERCISE_PROGRESS", id:ex.id, checkedSteps:checked });
  }, [checked, done, estFretboard, dispatch, ex.id]);

  // Exercice fretboard interactif
  if (estFretboard) {
    const finishFretboard = ({ totalXp, stages }) => {
      dispatch({ type:"COMPLETE_EXERCISE", id:ex.id, title:ex.title, xp:totalXp||ex.xp });
      dispatch({ type:"MARK_STREAK" });
      dispatch({ type:"UPDATE_WEEKLY", field:"exercises" });

      // Score réel plutôt que le simple booléen d'avant : un exercice à
      // plusieurs étapes n'est "réussi" pour la répétition espacée que si
      // la majorité des étapes l'ont été (même seuil que le contrôle de
      // fin d'unité, pour rester cohérent dans toute l'app). Un exercice
      // sauté (skipped) ne compte jamais comme réussi.
      const total = stages?.length || 1;
      const passed = stages?.filter(s => s.result?.complete && !s.skipped).length || 0;
      const correct = (passed / total) >= 0.7;
      const today = new Date().toISOString().split("T")[0];
      const newHistory = updateReviewHistory(state.exerciseHistory, ex.id, correct, today);
      dispatch({ type:"EXERCISE_MASTERY_ANSWER", history: newHistory });

      if (correct) { setFete(true); vibrer([12, 40, 18]); }
    };
    const linkedLesson = ex.courseLink ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===ex.courseLink) : null;
    return (
      <div className="gr-in-push">
        {fete && <Confetti />}
        <ExHeader ex={ex} onBack={onBack} />
        <div className="gr-stagger" style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {linkedLesson && <LinkedLesson lesson={linkedLesson} />}
          {FretboardExercise && <FretboardExercise ex={ex} onComplete={finishFretboard} dispatch={dispatch} />}
          {ex.tip && <Tip text={ex.tip} />}
        </div>
      </div>
    );
  }

  // Exercice classique
  const allDone = checked.length === (ex.steps||[]).length;
  const toggle = (i) => setChecked(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);
  const finish = () => {
    setPop(true);
    dispatch({ type:"COMPLETE_EXERCISE", id:ex.id, title:ex.title, xp:ex.xp });
    dispatch({ type:"MARK_STREAK" });
    dispatch({ type:"UPDATE_WEEKLY", field:"exercises" });

    // Pas de score gradué possible sur une simple liste à cocher — la
    // finalisation compte comme un succès. Ça reste un progrès net par
    // rapport à l'ancien booléen : l'exercice revient maintenant selon
    // le même calendrier de répétition espacée que le quiz (1 jour, puis
    // 4, 10, 30...), au lieu de disparaître pour toujours une fois cochée.
    const today = new Date().toISOString().split("T")[0];
    const newHistory = updateReviewHistory(state.exerciseHistory, ex.id, true, today);
    dispatch({ type:"EXERCISE_MASTERY_ANSWER", history: newHistory });

    setDone(true);
    vibrer([12, 40, 18]);
    popTimerRef.current = setTimeout(() => setPop(false), 1200);
  };
  const linkedLesson = ex.courseLink ? content.courses.flatMap(c=>c.lessons).find(l=>l.id===ex.courseLink) : null;

  return (
    <div className="gr-in-push">
      {pop && <XPPop amount={ex.xp} onDone={()=>{}} />}
      <ExHeader ex={ex} onBack={onBack} />
      <div className="gr-stagger" style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {linkedLesson && <LinkedLesson lesson={linkedLesson} />}

        {/* Progression steps */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Étapes</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: C.greenInk, fontVariantNumeric: "tabular-nums" }}>{checked.length}/{(ex.steps||[]).length}</span>
          </div>
          <ProgressBar pct={(checked.length/(ex.steps||[1]).length)*100} color={C.green} />
        </div>

        {!done ? (
          <>
            {/* Étapes cochables : même relief et même coche qu'une réponse. */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(ex.steps||[]).map((s, i) => {
                const ck = checked.includes(i);
                return (
                  <AnswerOption key={i} etat={ck ? "correct" : "idle"} marker={i + 1} aria-pressed={ck}
                    onClick={() => { vibrer(); toggle(i); }}>
                    {s}
                  </AnswerOption>
                );
              })}
            </div>
            {ex.tip && <Tip text={ex.tip} />}
            <Button size="lg" full tone="green" icon={allDone ? "check" : undefined} disabled={!allDone} onClick={finish}>
              {allDone
                ? <>Exercice terminé · +{ex.xp} XP</>
                : `${checked.length} / ${(ex.steps||[]).length} étapes complétées`
              }
            </Button>
          </>
        ) : (
          <Card tone="green" soft pad={0}>
            <ResultScreen
              confetti pose="celebrate" anim="cheer" gropiSize={130}
              title="Bien joué !"
              subtitle="Gropi a tout entendu depuis ici. Continue comme ça. 🎸"
              actions={<Button size="lg" full tone="green" onClick={onBack}>Retour</Button>}
              style={{ padding: "20px 16px" }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <StatTile tone="green" label="XP gagnés" value={<>+<AnimatedNumber value={ex.xp} /></>}
                  style={{ minWidth: 150, background: C.surface }} />
              </div>
            </ResultScreen>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── Micro-composants ──────────────────────────────────────────────────────────
/** En-tête de l'exercice : teinte du module, niveau en étiquette. */
function ExHeader({ ex, onBack }) {
  const C = useC();
  const lvl = ex.lvl || 1;
  const ton = tonModule(ex.mod);
  return (
    <SubHeader compact tone={ton} onBack={onBack} backLabel="Retour aux exercices"
      title={ex.title}
      subtitle={`${ex.dur} min${ex.bpm ? ` · ♩ ${ex.bpm} BPM` : ""} · +${ex.xp} XP`}
      right={<IconTile icon="guitar-pick" tone={ton} size={44} style={{ background: C.surface }} />}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Tag tone={TON_NIVEAU[lvl]} style={{ textTransform: "uppercase", letterSpacing: ".06em" }}>{LEVEL_LABELS[lvl]}</Tag>
        <span style={{ fontSize: T.micro, color: toneOf(C, ton).d }}>{DIFF_STARS[lvl]}</span>
      </div>
    </SubHeader>
  );
}

function LinkedLesson({ lesson }) {
  const C = useC();
  return (
    <Card tone="primary" soft pad="10px 14px" style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Ti name="book-2" size={16} color={C.primary} />
      <div style={{ fontSize: 12, color: C.primaryD }}>Lié à la leçon : <strong>{lesson.title}</strong></div>
    </Card>
  );
}

function Tip({ text }) {
  const C = useC();
  return (
    <Card tone="amber" soft pad="12px 14px" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <Ti name="bulb" size={18} color={C.amber} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ margin: 0, fontSize: T.small, color: C.amberD, lineHeight: 1.55 }}>{text}</p>
    </Card>
  );
}

export { ExercisesScreen, ExerciseDetail };
