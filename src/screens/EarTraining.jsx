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
// Accord en tonalité et suites répondent par des NOMS d'accords (« Rém »,
// « Sol – Ré – Mim – Do »). Les chiffres romains n'arrivent qu'après la leçon
// du chiffrage (harm-c5-02) : « Rém (ii) », correction « noms = chiffres »,
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
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";
import { BackButton } from "../design/ui.jsx";
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

// Assombrit une couleur hex d'une quantité fixe, quel que soit le thème.
// (`C.primaryD` est une couleur de TEXTE, claire en thème sombre : elle ne
// convient pas comme fond de bouton.)
function shade(hex, amount) {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  let r = (num >> 16) + amount, g = ((num >> 8) & 0xff) + amount, b = (num & 0xff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

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
      <div style={{ padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ marginBottom: 10, display: "flex", justifyContent: "center" }}>
            <Gropi pose={pct >= 75 ? POSE_ROLE.reussite : pct >= 50 ? POSE_ROLE.ecoute : POSE_ROLE.calme} size={88} anim={pct >= 75 ? "cheer" : "pop"} />
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>
            {pct >= 75 ? "Belle oreille !" : pct >= 50 ? "Bon travail !" : "Continue l'entraînement !"}
          </h1>
          {cfg && vivier && (
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: C.text2, fontFamily: FONTS.ui }}>
              Ton vivier : {vivier.pool.length} {cfg.unite} sur {vivier.total}.
            </p>
          )}
          {mode === "dictation" && (
            <p style={{ margin: "8px 0 0", fontSize: 12.5, color: C.text2, fontFamily: FONTS.ui }}>
              Niveau {niveauDictee}/{NIVEAUX_DICTEE.length} : {NIVEAUX_DICTEE[niveauDictee - 1].libelle}.
            </p>
          )}
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.greenInk }}>{score.correct}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>Correctes</div>
            </div>
            <div style={{ width: 1, background: C.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: C.coralInk }}>{score.total - score.correct}</div>
              <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>Ratées</div>
            </div>
          </div>
          <div style={{ marginTop: 14, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 75 ? C.green : pct >= 50 ? C.primary : C.coral, borderRadius: 3 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => { setScore({ correct: 0, total: 0 }); setAnswers([]); setSessionDone(false); nextQuestion(); }} className="gr-focus" style={{ flex: 1, minHeight: 48, padding: "13px", borderRadius: R.md, border: `1px solid ${C.borderStrong}`, background: C.surface, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONTS.ui }}>
            Recommencer
          </button>
          <button onClick={onBack} className="gr-focus" style={{ flex: 1, minHeight: 48, padding: "13px", borderRadius: R.md, border: "none", background: C.primaryBtn, color: C.onPrimaryBtn, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
            Retour
          </button>
        </div>
      </div>
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

  const chip = (actif) => ({
    minHeight: 44, padding: "8px 12px", borderRadius: R.md, cursor: "pointer", fontFamily: FONTS.ui, fontSize: 12.5,
    border: `1.5px solid ${actif ? C.primary : C.borderStrong}`,
    background: actif ? C.primaryL : C.surface,
    color: actif ? C.primaryD : C.text2, fontWeight: actif ? 700 : 500,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* En-tête */}
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.surface, position: "sticky", top: 0, zIndex: 10 }}>
        <BackButton onClick={onBack} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>Oreille</h1>
          <div role="status" aria-live="polite" style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{score.total}/{SESSION_LENGTH} · {score.correct} correcte{score.correct > 1 ? "s" : ""}</div>
        </div>
        {/* Gropi écoute pendant la question ; après la réponse, il sourit si
            c'est juste, ou passe en mode zen si c'est raté : on respire, on
            réécoute, sans pression. */}
        {(() => {
          const derniere = selected !== null ? answers[answers.length - 1] : null;
          const pose = !derniere ? POSE_ROLE.ecoute : derniere.correct ? POSE_ROLE.bonne : POSE_ROLE.calme;
          return <Gropi key={pose} pose={pose} size={46} anim={derniere ? "pop" : "bob"} />;
        })()}
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Barre de progression — décorative : le score, annoncé, dit la même chose. */}
        <div aria-hidden="true" style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: SESSION_LENGTH }).map((_, i) => {
            const ans = answers[i];
            return <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: ans ? (ans.correct ? C.green : C.coral) : i === score.total ? C.primary : C.border, transition: "background 0.3s" }} />;
          })}
        </div>

        {/* Choix du mode */}
        <div role="group" aria-label="Mode d'entraînement" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {MODES.map(m => (
            <button key={m.key} onClick={() => changeMode(m.key)} aria-pressed={mode === m.key} className="gr-focus"
              style={{ ...chip(mode === m.key), display: "inline-flex", alignItems: "center", gap: 6, flex: "1 1 auto" }}>
              <Ti name={m.icon} size={15} color={mode === m.key ? C.primaryD : C.text3} />
              {m.label}
            </button>
          ))}
        </div>

        {/* Sens des intervalles */}
        {mode === "interval" && (
          <div role="group" aria-label="Sens de l'intervalle" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SENS.map(s => (
              <button key={s.key} onClick={() => changeSens(s.key)} aria-pressed={sens === s.key} className="gr-focus" style={{ ...chip(sens === s.key), flex: "1 1 auto" }}>
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Vivier / niveau */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", background: C.surface2, borderRadius: R.md, padding: "8px 12px" }}>
          <div style={{ flex: 1, minWidth: 160, fontSize: 12, color: C.text2, fontFamily: FONTS.ui, lineHeight: 1.45 }}>
            {cfg && vivier && <>Vivier : <b style={{ color: C.text }}>{vivier.pool.length}/{vivier.total}</b> {cfg.unite}</>}
            {mode === "dictation" && <>Niveau <b style={{ color: C.text }}>{niveauDictee}/{NIVEAUX_DICTEE.length}</b> · {NIVEAUX_DICTEE[niveauDictee - 1].libelle}</>}
            {precisionMode != null && <> · précision {precisionMode} %</>}
            {mode === "progression" && leconChiffres && <> · chiffres romains : {Math.round(partRomains * 100)} % des questions</>}
          </div>
          {cfg && (
            <button onClick={basculerLibre} aria-pressed={libre} className="gr-focus" style={{ ...chip(libre), minHeight: 40, padding: "6px 10px", fontSize: 11.5 }}>
              {libre ? "Vivier complet" : "Tout débloquer"}
            </button>
          )}
        </div>
        {cfg && vivier?.nouveau != null && (
          <div role="status" style={{ display: "flex", gap: 8, alignItems: "center", background: C.primaryL, border: `1px solid ${C.primaryBorder}`, borderRadius: R.md, padding: "8px 12px", fontSize: 12, color: C.primaryD, fontFamily: FONTS.ui }}>
            <Ti name="sparkles" size={15} color={C.primaryD} />
            <span>Nouveau dans ton vivier : <b>{cfg.nom(vivier.nouveau, leconChiffres)}</b></span>
          </div>
        )}

        {/* Chargement audio */}
        {audioError && (
          <div role="alert" style={{ background: C.coralL, border: `1px solid ${C.coralBorder}`, borderRadius: R.md, padding: "12px 14px", fontSize: 12, color: C.coralD, fontFamily: FONTS.ui }}>
            Les échantillons audio n'ont pas pu être chargés. Vérifie ta connexion, puis reviens sur cet écran.
          </div>
        )}
        {!audioReady && !audioError && (
          <div role="status" aria-live="polite" style={{ background: C.amberL, border: `1px solid ${C.amberBorder}`, borderRadius: R.md, padding: "12px 14px", fontSize: 12, color: C.amberD, fontFamily: FONTS.ui }}>
            Chargement des échantillons audio…
          </div>
        )}

        {audioReady && question && (
          <>
            {/* Écoute */}
            <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
              <button onClick={isPlaying ? stopPlayback : playQuestion}
                aria-label={isPlaying ? "Arrêter l'écoute" : "Écouter"} className="gr-focus" style={{
                  width: 80, height: 80, borderRadius: "50%", border: "none",
                  background: `linear-gradient(135deg, ${C.primary}, ${shade(C.primary, -45)})`,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto", boxShadow: "0 4px 20px rgba(232,93,26,0.4)", transition: "all 0.2s",
                }}>
                <Ti name={isPlaying ? "player-pause" : "player-play"} size={28} color={C.onPrimaryBtn} />
              </button>
              <div style={{ fontSize: 13, color: C.text2, fontFamily: FONTS.ui, marginTop: 10, lineHeight: 1.45 }}>
                {question.consigne}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {question.playReference && (
                  <button onClick={() => lancer(question.playReference, 2600)} className="gr-focus" style={{ ...chip(false), borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Ti name="volume" size={14} color={C.text3} />
                    Entendre {question.referenceLabel}
                  </button>
                )}
                {question.playArpege && (
                  <button onClick={() => lancer(question.playArpege, question.arpegeDurationMs)} className="gr-focus" style={{ ...chip(false), borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Ti name="stairs" size={14} color={C.text3} />
                    Écouter note à note
                  </button>
                )}
              </div>
              {!repondu && (
                <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui, marginTop: 8, fontStyle: "italic" }}>
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
                      <div key={i} style={{ flex: "1 1 0", maxWidth: 76, minHeight: 56, borderRadius: R.md, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4px 2px",
                        border: `1.5px ${d == null ? "dashed" : "solid"} ${ok ? C.green : ko ? C.coral : d == null ? C.borderStrong : C.primary}`,
                        background: ok ? C.greenL : ko ? C.coralL : C.surface }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: ok ? C.greenD : ko ? C.coralD : C.text, fontFamily: FONTS.title }}>
                          {d != null ? question.touches[d].nom : "·"}
                        </span>
                        {ko && <span style={{ fontSize: 11, color: C.coralD, fontFamily: FONTS.ui }}>{question.touches[attendu].nom}</span>}
                      </div>
                    );
                  })}
                </div>
                <div role="group" aria-label="Notes de la gamme" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {question.touches.map(t => (
                    <button key={t.degre} onClick={() => taperNote(t.degre)} disabled={repondu} className="gr-focus"
                      aria-label={`${t.nom}, degré ${t.numero}`}
                      style={{ minHeight: 52, borderRadius: R.md, border: `1.5px solid ${C.borderStrong}`, background: C.surface, cursor: repondu ? "default" : "pointer", opacity: repondu ? 0.6 : 1,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, padding: "4px 2px" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>{t.nom}</span>
                      <span style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{t.numero}</span>
                    </button>
                  ))}
                </div>
                {!repondu && (
                  <button onClick={effacerNote} disabled={!saisie.length} className="gr-focus" style={{ ...chip(false), alignSelf: "center", opacity: saisie.length ? 1 : 0.5, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Ti name="arrow-left" size={15} color={C.text3} />
                    Effacer la dernière note
                  </button>
                )}
              </>
            ) : (
              /* Réponse : choix */
              <div style={{ display: "grid", gridTemplateColumns: options.length > 4 ? "repeat(2, 1fr)" : "1fr", gap: 8 }}>
                {options.map((opt) => {
                  const isAnswer = opt.key === question.answer;
                  const isSelected = opt.key === selected;
                  let bg = C.surface, border = `1px solid ${C.borderStrong}`, col = C.text;
                  if (repondu) {
                    if (isAnswer)        { bg = C.greenL; border = `1px solid ${C.green}`; col = C.greenD; }
                    else if (isSelected) { bg = C.coralL; border = `1px solid ${C.coral}`; col = C.coralD; }
                  }
                  const suffixe = !repondu ? "" : isAnswer ? ", bonne réponse" : isSelected ? ", ta réponse, incorrecte" : "";
                  return (
                    <button key={String(opt.key)} onClick={() => handleAnswer(opt)} disabled={repondu}
                      aria-label={suffixe ? `${opt.label}${suffixe}` : undefined} className="gr-focus"
                      style={{ padding: "12px 14px", minHeight: 52, borderRadius: 12, border, background: bg, cursor: repondu ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, fontFamily: FONTS.title, textAlign: "left" }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: col }}>{opt.label}</span>
                      {repondu && isAnswer && <Ti name="check" size={18} color={C.green} />}
                      {repondu && isSelected && !isAnswer && <Ti name="x" size={18} color={C.coral} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Correction + suite */}
            {repondu && (
              <div style={{ marginTop: 4 }}>
                <div role="status" aria-live="assertive" style={{ background: juste ? C.greenL : C.coralL, border: `1px solid ${juste ? C.greenBorder : C.coralBorder}`, borderRadius: R.md, padding: "10px 14px", marginBottom: 10, fontSize: 12.5, color: juste ? C.greenD : C.coralD, fontFamily: FONTS.ui, lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 700 }}>
                    {mode === "dictation"
                      ? (juste ? "Mélodie juste !" : `${nbJustes} note${nbJustes > 1 ? "s" : ""} juste${nbJustes > 1 ? "s" : ""} sur ${question.degres.length}.`)
                      : (juste ? "Correct !" : `La bonne réponse était : ${bonneOption?.label}`)}
                    {juste && xpReelle > 0 ? ` +${xpReelle} XP` : ""}
                  </div>
                  {mode === "dictation" && (
                    <div>Mélodie : {question.noms.join(" – ")} (degrés {question.degres.map(d => d + 1).join(" - ")}).</div>
                  )}
                  {mode === "interval" && <div>{question.detail}. Repère : {question.repere}</div>}
                  {mode !== "dictation" && mode !== "interval" && question.repere && <div>{question.repere}</div>}
                </div>
                {score.total < SESSION_LENGTH && (
                  <button onClick={nextQuestion} className="gr-focus" style={{ width: "100%", minHeight: 48, padding: "13px", borderRadius: R.md, border: "none", background: C.primaryBtn, color: C.onPrimaryBtn, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
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
