// Groply -- screens/EarTraining.jsx
// Entraînement de l'oreille : intervalles, qualité d'accord, accord en
// tonalité, suites d'accords et dictée mélodique.
//
// ── Progressivité ─────────────────────────────────────────────────────────
// Chaque mode démarre avec quelques éléments très contrastés (octave, quinte,
// tierce majeure ; majeur/mineur…) et en ajoute un dès que tout le vivier est
// acquis — 2 réussites d'affilée par élément (store/oreille.js). Ce qui a été
// rencontré reste dans le vivier, et le tirage favorise le nouveau et le
// souvent raté. « Tout débloquer » ouvre le vivier complet à qui le veut.
// La dictée a 5 niveaux (3 → 5 notes, de la tierce à l'octave, puis le
// mineur), déduits des réussites comme les compétences de la révision.
//
// ── Chiffres romains ──────────────────────────────────────────────────────
// Accord en tonalité et suites répondent par des NOMS d'accords, en notation anglaise (« Dm »,
// « G – D – Em – C »). Les chiffres romains n'arrivent qu'après la leçon
// du chiffrage (harm-c5-02) : « Dm (ii) », correction « noms = chiffres »,
// et une part de questions de suites en chiffres (20 % → 55 %, jamais tous),
// qui grandit avec les réussites en chiffres (oreille.partChiffresRomains).
//
// ── Historique ────────────────────────────────────────────────────────────
// Chaque réponse met à jour, dans reviewHistory (même action REVIEW_ANSWER
// qu'avant, synchronisée entre appareils) :
//   • `ear-<mode>` : la précision du mode, comme avant ;
//   • `ear:<mode>:<élément>` : l'élément entendu (ex. ear:interval:7), qui
//     pilote le vivier progressif.
// Ces clés ne sont pas des questions programmées : la révision espacée de
// l'oreille passe par les compétences générées (store/generateurs.js), que
// la séance de révision sait faire écouter.
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { R, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";
import {
  AnimatedNumber, AnswerOption, Button, Card, Chip, Feedback, IconTile, ResultScreen, SubHeader, Tag,
} from "../design/ui.jsx";
import { relief, toneOf } from "../design/hooks.js";
import { loadAudio, isAudioLoaded, generateEarTrainingQuestion, stopAll, unlockAudio } from "../audioEngine.js";
import { updateReviewHistory } from "../store/reviewEngine.js";
import {
  INTERVALLES, QUALITES, ORDRE_INTERVALLES, DEPART_INTERVALLES, ORDRE_QUALITES, DEPART_QUALITES,
  ORDRE_DEGRES, DEPART_DEGRES, ORDRE_PROGRESSIONS, DEPART_PROGRESSIONS, NIVEAUX_DICTEE, SEUILS_DICTEE,
  cleItem, poolAdaptatif, choisirItem, niveauProgressif, precision,
  chiffresRomainsAppris, partChiffresRomains, formatSuite, CLE_SUITES_ROMAINS, exempleSuite, exempleDegre,
} from "../store/oreille.js";

const MODES = [
  { key: "interval",      label: "Intervalles",       icon: "arrows-up-down" },
  { key: "chord_quality", label: "Qualité d'accord",  icon: "music" },
  { key: "chord_full",    label: "Accord en tonalité", icon: "music-plus" },
  { key: "progression",   label: "Suites d'accords",  icon: "list-numbers" },
  { key: "dictation",     label: "Dictée mélodique",  icon: "notebook" },
];

const SENS = [
  { key: "ascending",  label: "En montant" },
  { key: "descending", label: "En descendant" },
  { key: "harmonic",   label: "Ensemble" },
  { key: "mix",        label: "Mélange" },
];

// Vivier progressif de chaque mode à choix : ordre d'introduction, taille de
// départ, nom affiché d'un élément (`chiffres` : la leçon du chiffrage romain
// est faite — avant, aucun chiffre romain n'est affiché).
const VIVIERS = {
  interval:      { ordre: ORDRE_INTERVALLES,   depart: DEPART_INTERVALLES,   nom: (x) => INTERVALLES[x].nom,  unite: "intervalles" },
  chord_quality: { ordre: ORDRE_QUALITES,      depart: DEPART_QUALITES,      nom: (x) => QUALITES[x].nom,     unite: "qualités" },
  chord_full:    { ordre: ORDRE_DEGRES,        depart: DEPART_DEGRES,        nom: (x, chiffres) => exempleDegre(x, chiffres), unite: "accords" },
  progression:   { ordre: ORDRE_PROGRESSIONS,  depart: DEPART_PROGRESSIONS,  nom: (x, chiffres) => exempleSuite(x, chiffres), unite: "suites" },
};

const SESSION_LENGTH = 8;
const XP_PAR_REPONSE = 25;

export function EarTraining({ onBack, dispatch, state }) {
  const C = useC();
  const [audioReady, setAudioReady]   = useState(isAudioLoaded());
  const [audioError, setAudioError]   = useState(false);
  const [mode, setMode]               = useState("interval");
  const [sens, setSens]               = useState("ascending");
  const [libre, setLibre]             = useState(false);
  const [question, setQuestion]       = useState(null);
  const [selected, setSelected]       = useState(null);   // clé choisie, ou "dictee" une fois la dictée corrigée
  const [saisie, setSaisie]           = useState([]);     // dictée : degrés tapés
  const [isPlaying, setIsPlaying]     = useState(false);
  const [score, setScore]             = useState({ correct: 0, total: 0 });
  const [sessionDone, setSessionDone] = useState(false);
  const [answers, setAnswers]         = useState([]);
  // Minuteur qui remet le bouton en « play » à la fin du son. Une ref : un
  // appui sur stop doit pouvoir l'annuler, sinon l'ancien minuteur remettait
  // le bouton en « play » au milieu d'une nouvelle lecture.
  const finTimerRef = useRef(null);
  const precedentRef = useRef(null);   // dernier élément joué : jamais deux fois de suite

  const hist = useMemo(() => state?.reviewHistory || {}, [state?.reviewHistory]);
  const idMode = `ear-${mode}`;
  const cfg = VIVIERS[mode] || null;
  const vivier = useMemo(() => {
    if (!cfg) return null;
    if (libre) return { pool: cfg.ordre, nouveau: null, total: cfg.ordre.length };
    return poolAdaptatif(cfg.ordre, cfg.depart, hist, (x) => cleItem(mode, x));
  }, [cfg, libre, hist, mode]);
  const niveauDictee = niveauProgressif(hist["ear-dictation"], SEUILS_DICTEE);
  const precisionMode = precision(hist[idMode]);
  // Chiffres romains (accord en tonalité, suites) : seulement après la leçon
  // du chiffrage, puis à dose croissante avec les réussites (store/oreille.js).
  const leconChiffres = chiffresRomainsAppris(state?.completedLessons);
  const partRomains = partChiffresRomains({ leconFaite: leconChiffres, succes: hist[CLE_SUITES_ROMAINS]?.successes || 0 });

  const annulerFinTimer = useCallback(() => {
    if (finTimerRef.current) { clearTimeout(finTimerRef.current); finTimerRef.current = null; }
  }, []);

  // Charger l'audio au montage
  useEffect(() => {
    if (!isAudioLoaded()) {
      loadAudio()
        .then(() => setAudioReady(true))
        .catch(() => setAudioError(true));
    }
  }, []);

  const nextQuestion = useCallback(() => {
    // Couper le son en cours : une suite d'accords lancée juste avant
    // continuerait sinon de jouer par-dessus la nouvelle question.
    annulerFinTimer();
    try { stopAll(); } catch { /* rien ne jouait */ }
    setIsPlaying(false);
    setSelected(null);
    setSaisie([]);
    if (mode === "dictation") {
      setQuestion(generateEarTrainingQuestion("dictation", { niveau: niveauDictee }));
      return;
    }
    const cible = choisirItem(Math.random, vivier.pool, hist, (x) => cleItem(mode, x), precedentRef.current);
    precedentRef.current = cible;
    const format = mode === "progression"
      ? formatSuite(Math.random, { leconFaite: leconChiffres, succes: hist[CLE_SUITES_ROMAINS]?.successes || 0 })
      : undefined;
    setQuestion(generateEarTrainingQuestion(mode, { pool: vivier.pool, cible, sens, toutesOptions: true, leconChiffres, format }));
  }, [mode, sens, vivier, hist, niveauDictee, annulerFinTimer, leconChiffres]);

  // Première question quand l'audio est prêt, et après un changement de mode
  // (qui remet `question` à null). Pas de boucle : rien tant qu'une question existe.
  useEffect(() => {
    // setState voulu ici : la question dépend de la fin du chargement audio
    // (asynchrone) ; un seul rendu supplémentaire, borné par `!question`.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (audioReady && !question) nextQuestion();
  }, [audioReady, question, nextQuestion]);

  // Quitter l'écran coupe le son.
  useEffect(() => () => { annulerFinTimer(); try { stopAll(); } catch { /* déjà arrêté */ } }, [annulerFinTimer]);

  // Lecture générique : question, référence, arpège. Le bouton principal
  // passe en « stop » pendant toute la durée réelle (fournie par le moteur).
  const lancer = async (fn, dureeMs) => {
    if (!fn) return;
    annulerFinTimer();
    setIsPlaying(true);
    // unlockAudio() EN TÊTE du gestionnaire d'appui : iOS exige que le
    // contexte audio démarre dans le geste lui-même.
    try { await unlockAudio(); } catch { /* on tente quand même */ }
    try { await fn(); } catch { /* échec de lecture : le minuteur remet le bouton */ }
    finTimerRef.current = setTimeout(() => {
      finTimerRef.current = null;
      setIsPlaying(false);
    }, dureeMs ?? 2000);
  };
  const playQuestion = () => { if (question && !isPlaying) lancer(question.play, question.durationMs); };

  // Arrêt net, pour tous les modes (stopAll coupe aussi la queue de réverb).
  const stopPlayback = () => {
    annulerFinTimer();
    try { stopAll(); } catch { /* déjà arrêté */ }
    setIsPlaying(false);
  };

  const enregistrer = (correct, item) => {
    let h = updateReviewHistory(hist, idMode, correct);
    if (item != null && mode !== "dictation") h = updateReviewHistory(h, cleItem(mode, item), correct);
    // Réussites en chiffres romains : elles font grandir leur part.
    if (question?.format === "romains") h = updateReviewHistory(h, CLE_SUITES_ROMAINS, correct);
    dispatch?.({ type: "REVIEW_ANSWER", questionId: idMode, id: idMode, history: h, correct, xp: correct ? XP_PAR_REPONSE : 0 });
    const newScore = { correct: score.correct + (correct ? 1 : 0), total: score.total + 1 };
    setScore(newScore);
    setAnswers(prev => [...prev, { correct }]);
    if (newScore.total >= SESSION_LENGTH) setTimeout(() => setSessionDone(true), 1600);
  };

  const handleAnswer = (option) => {
    if (selected !== null) return;
    setSelected(option.key);
    enregistrer(option.key === question.answer, question.answer);
  };

  // Dictée : chaque appui ajoute une note ; la correction tombe dès que la
  // mélodie est complète, note par note.
  const taperNote = (degre) => {
    if (selected !== null || !question) return;
    const s = [...saisie, degre];
    setSaisie(s);
    if (s.length === question.degres.length) {
      setSelected("dictee");
      enregistrer(s.every((d, i) => d === question.degres[i]), null);
    }
  };
  const effacerNote = () => { if (selected === null) setSaisie(s => s.slice(0, -1)); };

  const changeMode = (m) => {
    annulerFinTimer();
    try { stopAll(); } catch { /* déjà arrêté */ }
    precedentRef.current = null;
    setIsPlaying(false);
    setMode(m);
    setQuestion(null);
    setSelected(null);
    setSaisie([]);
    setScore({ correct: 0, total: 0 });
    setAnswers([]);
    setSessionDone(false);
  };
  // Changer le sens ou le vivier relance une question, sans remettre le score à zéro.
  const changeSens = (s) => { setSens(s); setQuestion(null); };
  const basculerLibre = () => { setLibre(v => !v); setQuestion(null); };

  const xpReelle = state?.lastGain?.kind === "review" ? (state.lastGain.xp || 0) : 0;

  // ── Ecran de fin ─────────────────────────────────────────────────────────
  if (sessionDone) {
    const pct = Math.round((score.correct / score.total) * 100);
    return (
      <ResultScreen
        pose={pct >= 75 ? POSE_ROLE.reussite : pct >= 50 ? POSE_ROLE.ecoute : POSE_ROLE.calme}
        anim={pct >= 75 ? "cheer" : "pop"}
        confetti={pct >= 75}
        title={pct >= 75 ? "Belle oreille !" : pct >= 50 ? "Bon travail !" : "Continue l'entraînement !"}
        subtitle={mode === "dictation"
          ? `Niveau ${niveauDictee}/${NIVEAUX_DICTEE.length} : ${NIVEAUX_DICTEE[niveauDictee - 1].libelle}.`
          : cfg && vivier ? `Ton vivier : ${vivier.pool.length} ${cfg.unite} sur ${vivier.total}.` : undefined}
        stats={[
          { value: score.correct, label: "Correctes", tone: "green" },
          { value: score.total - score.correct, label: "Ratées", tone: "danger" },
        ]}
        pct={pct}
        pctTone={pct >= 75 ? "green" : pct >= 50 ? "primary" : "danger"}
        actions={<>
          <Button size="lg" full tone="teal" onClick={onBack}>Retour</Button>
          <Button size="lg" full variant="secondary" icon="refresh"
            onClick={() => { setScore({ correct: 0, total: 0 }); setAnswers([]); setSessionDone(false); nextQuestion(); }}>
            Recommencer
          </Button>
        </>}
      />
    );
  }

  const repondu = selected !== null;
  const juste = mode === "dictation"
    ? repondu && question && saisie.every((d, i) => d === question.degres[i])
    : repondu && selected === question?.answer;
  const bonneOption = question?.options?.find(o => o.key === question.answer);
  // Intervalles affichés du plus petit au plus grand ; les autres modes dans
  // leur ordre d'introduction.
  const options = !question?.options ? [] : mode === "interval" ? [...question.options].sort((a, b) => a.key - b.key) : question.options;
  const nbJustes = mode === "dictation" && repondu ? saisie.filter((d, i) => d === question.degres[i]).length : 0;

  const teinte = toneOf(C, "teal");

  // Gropi écoute pendant la question ; après la réponse, il sourit si c'est
  // juste, ou passe en mode zen si c'est raté : on respire, on réécoute, sans
  // pression.
  const derniere = repondu ? answers[answers.length - 1] : null;
  const poseGropi = !derniere ? POSE_ROLE.ecoute : derniere.correct ? POSE_ROLE.bonne : POSE_ROLE.calme;

  // Explication sous le verdict (rien si le mode n'en donne pas).
  const explication = !repondu || !question ? null
    : mode === "dictation" ? <>Mélodie : {question.noms.join(" – ")} (degrés {question.degres.map(d => d + 1).join(" - ")}).</>
    : mode === "interval" ? <>{question.detail}. Repère : {question.repere}</>
    : question.repere || null;

  return (
    <div className="gr-in-push" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      <SubHeader compact tone="teal" onBack={onBack} title="Oreille"
        style={{ position: "sticky", top: 0, zIndex: 10 }}
        subtitle={(
          <span role="status" aria-live="polite" style={{ fontVariantNumeric: "tabular-nums" }}>
            {score.total}/{SESSION_LENGTH} · <AnimatedNumber value={score.correct} /> correcte{score.correct > 1 ? "s" : ""}
          </span>
        )}
        right={<Gropi key={poseGropi} pose={poseGropi} size={46} anim={derniere ? "pop" : "bob"} />}
      />

      <div style={{ padding: "14px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

        <div className="gr-stagger" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Barre de progression — décorative : le score, annoncé, dit la même chose. */}
          <div aria-hidden="true" style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: SESSION_LENGTH }).map((_, i) => {
              const ans = answers[i];
              return (
                <div key={i} style={{
                  flex: 1, height: 8, borderRadius: R.pill,
                  background: ans ? (ans.correct ? C.green : C.danger) : i === score.total ? C.teal : C.border,
                  transition: "background-color var(--gr-dur) ease",
                }} />
              );
            })}
          </div>

          {/* Choix du mode */}
          <div role="group" aria-label="Mode d'entraînement" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
            {MODES.map((m, i) => {
              const actif = mode === m.key;
              const seule = i === MODES.length - 1 && MODES.length % 2 === 1;
              return (
                <Card key={m.key} onClick={() => changeMode(m.key)} aria-pressed={actif}
                  tone="teal" soft={actif} selected={actif} pad="8px 10px"
                  style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 52, gridColumn: seule ? "1 / -1" : undefined }}>
                  <IconTile icon={m.icon} tone={actif ? "teal" : "neutral"} solid={actif} size={32} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: T.small, fontWeight: 700, lineHeight: 1.25, color: actif ? C.tealD : C.text }}>{m.label}</span>
                </Card>
              );
            })}
          </div>

          {/* Sens des intervalles */}
          {mode === "interval" && (
            <div role="group" aria-label="Sens de l'intervalle" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SENS.map(s => (
                <Chip key={s.key} tone="teal" selected={sens === s.key} onClick={() => changeSens(s.key)}
                  style={{ flex: "1 1 auto", minHeight: 44 }}>
                  {s.label}
                </Chip>
              ))}
            </div>
          )}

          {/* Vivier / niveau */}
          <Card pad="8px 12px" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 160, fontSize: 12, color: C.text2, lineHeight: 1.45 }}>
              {cfg && vivier && <>Vivier : <b style={{ color: C.text }}>{vivier.pool.length}/{vivier.total}</b> {cfg.unite}</>}
              {mode === "dictation" && <>Niveau <b style={{ color: C.text }}>{niveauDictee}/{NIVEAUX_DICTEE.length}</b> · {NIVEAUX_DICTEE[niveauDictee - 1].libelle}</>}
              {precisionMode != null && <> · précision {precisionMode} %</>}
              {mode === "progression" && leconChiffres && <> · chiffres romains : {Math.round(partRomains * 100)} % des questions</>}
            </div>
            {cfg && (
              <Chip tone="teal" selected={libre} onClick={basculerLibre}>
                {libre ? "Vivier complet" : "Tout débloquer"}
              </Chip>
            )}
          </Card>
        </div>

        {cfg && vivier?.nouveau != null && (
          <Card role="status" tone="amber" soft pad="8px 12px" className="gr-in-pop"
            style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12, color: C.amberD, lineHeight: 1.45 }}>
            <IconTile icon="sparkles" tone="amber" solid size={30} />
            <span>Nouveau dans ton vivier : <b>{cfg.nom(vivier.nouveau, leconChiffres)}</b></span>
          </Card>
        )}

        {/* Chargement audio */}
        {audioError && (
          <Card role="alert" tone="danger" soft pad="12px 14px" className="gr-in" style={{ fontSize: 12, color: C.dangerD, lineHeight: 1.5 }}>
            Les échantillons audio n'ont pas pu être chargés. Vérifie ta connexion, puis reviens sur cet écran.
          </Card>
        )}
        {!audioReady && !audioError && (
          <Card role="status" aria-live="polite" tone="amber" soft pad="12px 14px" className="gr-in-fade" style={{ fontSize: 12, color: C.amberD, lineHeight: 1.5 }}>
            Chargement des échantillons audio…
          </Card>
        )}

        {audioReady && question && (
          <>
            {/* Écoute */}
            <div className="gr-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "10px 0 4px" }}>
              <div style={{ position: "relative", display: "flex" }}>
                {/* Halo : le bouton attend qu'on le touche, tant qu'on n'a ni écouté ni répondu. */}
                {!repondu && !isPlaying && (
                  <span aria-hidden="true" className="gr-pulse" style={{
                    position: "absolute", top: 0, left: 0, width: 84, height: 84, boxSizing: "border-box",
                    borderRadius: R.pill, border: `3px solid ${C.teal}`, pointerEvents: "none",
                  }} />
                )}
                <button type="button" onClick={isPlaying ? stopPlayback : playQuestion}
                  aria-label={isPlaying ? "Arrêter l'écoute" : "Écouter"} className="gr-press gr-focus" style={{
                    ...relief(teinte.edge, 5),
                    position: "relative", width: 84, height: 84, padding: 0, borderRadius: R.pill, border: "none",
                    background: teinte.solid, color: C.onPrimaryBtn,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                  <Ti name={isPlaying ? "player-pause" : "player-play"} size={32} color="currentColor" />
                </button>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 10, lineHeight: 1.45 }}>
                {question.consigne}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {question.playReference && (
                  <Button variant="soft" tone="teal" size="sm" icon="volume" style={{ minHeight: 44 }}
                    onClick={() => lancer(question.playReference, 2600)}>
                    Entendre {question.referenceLabel}
                  </Button>
                )}
                {question.playArpege && (
                  <Button variant="soft" tone="teal" size="sm" icon="stairs" style={{ minHeight: 44 }}
                    onClick={() => lancer(question.playArpege, question.arpegeDurationMs)}>
                    Écouter note à note
                  </Button>
                )}
              </div>
              {!repondu && (
                <div style={{ fontSize: T.micro, color: C.text3, marginTop: 8, fontStyle: "italic" }}>
                  Tu peux réécouter autant de fois que tu veux
                </div>
              )}
            </div>

            {/* Réponse : dictée */}
            {mode === "dictation" ? (
              <>
                <div aria-label="Ta mélodie" style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  {question.degres.map((attendu, i) => {
                    const d = saisie[i];
                    const ok = repondu && d === attendu;
                    const ko = repondu && d !== attendu;
                    return (
                      <div key={i} className={ok ? "gr-bump" : ko ? "gr-shake" : undefined} style={{
                        flex: "1 1 0", maxWidth: 76, minHeight: 56, boxSizing: "border-box", borderRadius: R.md,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4px 2px",
                        border: `2px ${d == null ? "dashed" : "solid"} ${ok ? C.green : ko ? C.danger : d == null ? C.borderStrong : C.teal}`,
                        background: ok ? C.greenL : ko ? C.dangerL : d == null ? C.surface : C.tealL,
                        transition: "background-color var(--gr-dur-fast) ease, border-color var(--gr-dur-fast) ease",
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: ok ? C.greenD : ko ? C.dangerD : d == null ? C.text3 : C.tealD }}>
                          {d != null ? question.touches[d].nom : "·"}
                        </span>
                        {ko && <span style={{ fontSize: T.micro, color: C.dangerD }}>{question.touches[attendu].nom}</span>}
                      </div>
                    );
                  })}
                </div>
                <div role="group" aria-label="Notes de la gamme" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
                  {question.touches.map(t => (
                    <button key={t.degre} type="button" onClick={() => taperNote(t.degre)} disabled={repondu} className="gr-press gr-focus"
                      aria-label={`${t.nom}, degré ${t.numero}`}
                      style={{
                        ...relief(C.border, 3),
                        minHeight: 52, borderRadius: R.md, border: `2px solid ${C.border}`, background: C.surface,
                        opacity: repondu ? 0.6 : 1, fontFamily: "inherit",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, padding: "4px 2px",
                      }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{t.nom}</span>
                      <span style={{ fontSize: T.micro, color: C.text3 }}>{t.numero}</span>
                    </button>
                  ))}
                </div>
                {!repondu && (
                  <Button variant="ghost" size="sm" tone="teal" icon="arrow-left" onClick={effacerNote} disabled={!saisie.length}
                    style={{ alignSelf: "center", minHeight: 44 }}>
                    Effacer la dernière note
                  </Button>
                )}
              </>
            ) : (
              /* Réponse : choix */
              <div style={{ display: "grid", gridTemplateColumns: options.length > 4 ? "repeat(2, minmax(0, 1fr))" : "1fr", gap: 8 }}>
                {options.map((opt) => {
                  const isAnswer = opt.key === question.answer;
                  const isSelected = opt.key === selected;
                  const etat = !repondu ? "idle" : isAnswer ? "correct" : isSelected ? "wrong" : "muted";
                  const suffixe = !repondu ? "" : isAnswer ? ", bonne réponse" : isSelected ? ", ta réponse, incorrecte" : "";
                  return (
                    <AnswerOption key={String(opt.key)} etat={etat} locked={repondu} onClick={() => handleAnswer(opt)}
                      aria-label={suffixe ? `${opt.label}${suffixe}` : undefined}>
                      {opt.label}
                    </AnswerOption>
                  );
                })}
              </div>
            )}

            {/* Correction + suite */}
            {repondu && (
              <Feedback correct={!!juste} style={{ marginTop: 4 }}
                title={(
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {mode === "dictation"
                      ? (juste ? "Mélodie juste !" : `${nbJustes} note${nbJustes > 1 ? "s" : ""} juste${nbJustes > 1 ? "s" : ""} sur ${question.degres.length}.`)
                      : (juste ? "Correct !" : `La bonne réponse était : ${bonneOption?.label}`)}
                    {juste && xpReelle > 0 && <Tag tone="green" icon="bolt">+{xpReelle} XP</Tag>}
                  </span>
                )}
                action={score.total < SESSION_LENGTH && (
                  <Button size="lg" full iconRight="arrow-right" onClick={nextQuestion}>
                    Question suivante
                  </Button>
                )}>
                {explication}
              </Feedback>
            )}
          </>
        )}
      </div>
    </div>
  );
}
