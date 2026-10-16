// Groply — src/lecon/LeconCartes.jsx
// Une leçon en cartes : une carte par écran, guitare en main.
//
// Affichée par LessonView (screens/CoursesScreen.jsx) quand la leçon porte un
// tableau `cartes` ; les autres leçons gardent leur rendu « article ».
// Types de carte : idee · question · a-toi · recap — format dans
// src/content/README.md (« Leçons en cartes »), logique pure dans ./cartes.js.
//
// Navigation : bouton « Continuer » (ou « Passer », « C'est fait »), bouton
// « Retour », balayage gauche/droite, flèches du clavier. Au changement de
// carte, le titre de la carte reçoit le focus (lecteurs d'écran, clavier).
// La carte en cours est mémorisée (localStorage `groply:lecon-carte:<id>`) :
// quitter la leçon puis y revenir reprend au même endroit.
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { BackButton, ProgressBar } from "../design/ui.jsx";
import { Gropi, GropiCoach } from "../design/Gropi.jsx";
import { useRenderers } from "../renderers.jsx";
import { stopAll } from "../audioEngine.js";
import { demarrerClic } from "./clic.js";
import {
  resoudreQuestion, paragraphes, bornerIndex, estDerniere, progressionCartes, directionBalayage,
  libelleContinuer, lireReprise, ecrireReprise, effacerReprise, evaluerReponse, actionRevision,
} from "./cartes.js";
import { todayStr } from "../store/state.js";
import { MorceauxLies } from "./MorceauxLies.jsx";

const stockage = () => { try { return typeof window !== "undefined" ? window.localStorage : null; } catch { return null; } };

const CSS = `
@keyframes lc-in-av { from { opacity: 0; transform: translateX(32px); } to { opacity: 1; transform: none; } }
@keyframes lc-in-ar { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: none; } }
@keyframes lc-fondu { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: no-preference) {
  .lc-carte.lc-av { animation: lc-in-av .24s ease-out both; }
  .lc-carte.lc-ar { animation: lc-in-ar .24s ease-out both; }
  .lc-retour { animation: lc-fondu .2s ease-out both; }
}
.lc-titre:focus { outline: none; }
.lc-titre:focus-visible { outline: 3px solid var(--gr-focus); outline-offset: 4px; border-radius: 6px; }
`;

const ENTETE = {
  idee:     { libelle: "L'idée",          icone: "bulb",        teinte: "primary" },
  question: { libelle: "Vérifie",         icone: "help-circle", teinte: "purple" },
  "a-toi":  { libelle: "À toi de jouer",  icone: "guitar-pick", teinte: "green" },
  recap:    { libelle: "Récap",           icone: "sparkles",    teinte: "amber" },
};

/** Faut-il ignorer ce geste (il a commencé dans une zone qui défile en largeur, comme une tab) ? */
function dansZoneDefilante(cible, racine) {
  for (let el = cible; el && el !== racine; el = el.parentElement) {
    if (el.scrollWidth > el.clientWidth + 2) {
      const ox = getComputedStyle(el).overflowX;
      if (ox === "auto" || ox === "scroll") return true;
    }
  }
  return false;
}

// `onJouerMorceau(id)` : ouvre un morceau lié (Outils › Morceaux). Sans lui,
// les cartes « Joue-le maintenant » ne s'affichent pas.
export function LeconCartes({ lesson, state, dispatch, onBack, quiz, carteInitiale, done, onFinish, onJouerMorceau }) {
  const C = useC();
  const { renderDiagramBlock: rendreDiagramme, FretboardLesson } = useRenderers();
  // Le manche interactif n'est pas un diagramme de diagrams.jsx : il a son
  // propre composant (Fretboard.jsx), comme dans les leçons article.
  const renderDiagramBlock = useCallback((bloc, cle) => (
    bloc?.type === "fretboard_interactive"
      ? (FretboardLesson ? <FretboardLesson key={cle} block={bloc} /> : null)
      : rendreDiagramme?.(bloc, cle)
  ), [rendreDiagramme, FretboardLesson]);
  const quizParId = useMemo(() => new Map((quiz || []).map(q => [q.id, q])), [quiz]);
  // Une question liée au quiz qu'on ne sait pas résoudre (quiz non fourni)
  // est retirée plutôt qu'affichée vide.
  const cartes = useMemo(
    () => (lesson.cartes || []).filter(c => c.type !== "question" || resoudreQuestion(c, quizParId)),
    [lesson.cartes, quizParId],
  );
  const n = cartes.length;

  const [index, setIndex] = useState(() => (
    carteInitiale != null ? bornerIndex(carteInitiale, n) : done ? 0 : lireReprise(stockage(), lesson.id, n)
  ));
  const [sens, setSens] = useState(0);
  const [reponses, setReponses] = useState({});   // index de carte → choix
  const [bilan, setBilan] = useState(false);
  const titreRef = useRef(null);
  const racineRef = useRef(null);
  const toucher = useRef(null);
  const montage = useRef(true);

  const carte = cartes[index];
  const derniere = estDerniere(index, n);
  const prog = progressionCartes(index, n);

  // Changement de carte : mémoriser, couper le son, remonter, focus au titre.
  useEffect(() => {
    if (!done) ecrireReprise(stockage(), lesson.id, index);
    if (montage.current) { montage.current = false; return; }
    try { stopAll(); } catch { /* jamais bloquant */ }
    window.scrollTo({ top: 0 });
    titreRef.current?.focus({ preventScroll: true });
  }, [index, bilan, done, lesson.id]);

  const aller = useCallback((i) => {
    const cible = bornerIndex(i, n);
    if (cible === index) return;
    setSens(cible > index ? 1 : -1);
    setIndex(cible);
  }, [index, n]);

  const continuer = () => {
    if (!derniere) return aller(index + 1);
    if (done && !bilan) return onBack();
    onFinish?.();
    effacerReprise(stockage(), lesson.id);
    setBilan(true);
  };

  // Flèches du clavier (jamais pour terminer la leçon : seulement naviguer).
  useEffect(() => {
    if (bilan) return undefined;
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowRight" && !derniere) { e.preventDefault(); aller(index + 1); }
      else if (e.key === "ArrowLeft" && index > 0) { e.preventDefault(); aller(index - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aller, index, derniere, bilan]);

  const debutToucher = (e) => {
    const p = e.touches?.[0];
    if (!p || e.touches.length > 1 || dansZoneDefilante(e.target, racineRef.current)) { toucher.current = null; return; }
    toucher.current = { x: p.clientX, y: p.clientY };
  };
  const finToucher = (e) => {
    const d = toucher.current; toucher.current = null;
    const p = e.changedTouches?.[0];
    if (!d || !p) return;
    const dir = directionBalayage(p.clientX - d.x, p.clientY - d.y);
    if (dir === "suivante" && !derniere) aller(index + 1);
    else if (dir === "precedente" && index > 0) aller(index - 1);
  };

  const choisir = (i, question) => {
    if (reponses[index] !== undefined) return;
    setReponses(r => ({ ...r, [index]: i }));
    const ev = evaluerReponse(question, i);
    try { navigator.vibrate?.(ev.correct ? 12 : [10, 40, 10]); } catch { /* non supporté */ }
    const action = actionRevision(question, ev.correct, state?.reviewHistory, todayStr());
    if (action) dispatch?.(action);
  };

  const nbQuiz = (lesson.quiz || []).length;

  // Depuis la carte Récap (la dernière), partir jouer le morceau termine la
  // leçon : on ne perd pas sa complétion en sautant le bouton « Terminer ».
  const jouerMorceau = onJouerMorceau ? (id) => {
    if (!done) { onFinish?.(); effacerReprise(stockage(), lesson.id); }
    onJouerMorceau(id);
  } : null;

  // ── Bilan (après « Terminer la leçon ») ──────────────────────────────────
  if (bilan) {
    const questions = cartes.map((c, i) => [c, i]).filter(([c]) => c.type === "question");
    const bonnes = questions.filter(([c, i]) => reponses[i] !== undefined && reponses[i] === resoudreQuestion(c, quizParId)?.a).length;
    return (
      <div ref={racineRef} style={{ padding: "14px 20px 24px" }}>
        <style>{CSS}</style>
        <div className="lc-retour" style={{ background: C.greenL, borderRadius: R.xl, padding: "22px 20px", textAlign: "center", border: `1.5px solid ${C.greenBorder}`, marginTop: 8 }}>
          <Gropi pose="celebrate" size={120} anim="cheer" style={{ margin: "0 auto" }} />
          <h2 ref={titreRef} tabIndex={-1} className="lc-titre" style={{ fontSize: 20, fontWeight: 800, color: C.greenD, letterSpacing: "-.3px", margin: "8px 0 0" }}>Leçon complétée !</h2>
          <p style={{ fontSize: 13, color: C.greenInk, margin: "4px 0 0" }}>
            +30 XP{questions.length > 0 ? ` · ${bonnes} bonne${bonnes > 1 ? "s" : ""} réponse${bonnes > 1 ? "s" : ""} sur ${questions.length}` : ""}
          </p>
          {nbQuiz > 0 && (
            <p style={{ fontSize: 13, color: C.text, margin: "12px 0 0", lineHeight: 1.5 }}>
              Ses {nbQuiz} question{nbQuiz > 1 ? "s" : ""} de quiz reviendront dans ta révision, au bon moment.
            </p>
          )}
          <button type="button" onClick={onBack} className="gr-focus" style={{ marginTop: 16, minHeight: 48, padding: "12px 32px", borderRadius: R.lg, border: "none", background: C.green, color: C.onPrimaryBtn, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
            Retour au parcours
          </button>
          <MorceauxLies lessonId={lesson.id} onJouer={jouerMorceau} style={{ marginTop: 16, textAlign: "left" }} />
          <div>
            <button type="button" onClick={() => { setBilan(false); setSens(-1); setIndex(0); }} className="gr-focus" style={{ marginTop: 10, minHeight: 44, padding: "8px 16px", borderRadius: R.md, border: "none", background: "transparent", color: C.greenInk, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui }}>
              Revoir les cartes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!carte) return null;
  const entete = ENTETE[carte.type];
  const teinte = { fond: C[entete.teinte + "L"], encre: C[entete.teinte + "Ink"] || C[entete.teinte + "D"], bord: C[entete.teinte + "Border"] };
  const question = carte.type === "question" ? resoudreQuestion(carte, quizParId) : null;
  const repondue = reponses[index] !== undefined;
  const titreCarte = carte.type === "question" ? question.q
    : carte.type === "recap" ? "Ce que tu retiens"
    : carte.titre || (carte.type === "a-toi" ? "À toi de jouer" : "");

  return (
    <div ref={racineRef} onTouchStart={debutToucher} onTouchEnd={finToucher} style={{ padding: "14px 20px 24px" }}>
      <style>{CSS}</style>

      {/* En-tête : retour au parcours, titre de la leçon, progression */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <BackButton onClick={onBack} label="Retour au parcours" style={{ borderRadius: R.sm }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text2, fontFamily: FONTS.ui, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lesson.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <div style={{ flex: 1 }}><ProgressBar pct={prog.pct} h={6} label={`Carte ${prog.numero} sur ${prog.total}`} /></div>
            <span aria-hidden="true" style={{ fontSize: 12, fontWeight: 700, color: C.text3, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{prog.libelle}</span>
          </div>
        </div>
      </div>

      {/* La carte */}
      <section key={index} aria-roledescription="carte" aria-label={`Carte ${prog.numero} sur ${prog.total}`}
        className={`lc-carte ${sens > 0 ? "lc-av" : sens < 0 ? "lc-ar" : ""}`}
        style={{ marginTop: 18, minHeight: "52vh", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.xl, padding: "16px 16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: R.pill, background: teinte.fond, border: `1px solid ${teinte.bord}` }}>
          <Ti name={entete.icone} size={14} color={teinte.encre} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase", color: teinte.encre, fontFamily: FONTS.ui }}>{entete.libelle}</span>
        </div>
        <h2 ref={titreRef} tabIndex={-1} className="lc-titre"
          style={{ margin: 0, fontSize: carte.type === "question" ? 18 : 21, fontWeight: 800, lineHeight: 1.3, letterSpacing: "-.3px", color: C.text, fontFamily: FONTS.title }}>
          {titreCarte}
        </h2>

        {carte.type === "idee" && (
          <>
            {paragraphes(carte).map((p, i) => <p key={i} style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: C.text }}>{p}</p>)}
            {carte.bloc && renderDiagramBlock?.(carte.bloc, "bloc")}
          </>
        )}

        {carte.type === "question" && (
          <QuestionCarte question={question} choix={reponses[index]} onChoisir={(i) => choisir(i, question)} />
        )}

        {carte.type === "a-toi" && <AToiCarte carte={carte} renderDiagramBlock={renderDiagramBlock} />}

        {carte.type === "recap" && (
          <>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {carte.points.map((p, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ marginTop: 2, flexShrink: 0 }}><Ti name="circle-check-filled" size={20} color={C.green} /></span>
                  <span style={{ fontSize: 16, lineHeight: 1.55, color: C.text }}>{p}</span>
                </li>
              ))}
            </ul>
            {lesson.gropiTip && <GropiCoach variant="tip" eyebrow="Le conseil de Gropi">{lesson.gropiTip}</GropiCoach>}
            <MorceauxLies lessonId={lesson.id} onJouer={jouerMorceau} />
            {nbQuiz > 0 && (
              <p style={{ margin: 0, fontSize: 13, color: C.text2, display: "flex", gap: 8, alignItems: "center" }}>
                <Ti name="notebook" size={16} color={C.primaryInk} />
                {nbQuiz} question{nbQuiz > 1 ? "s" : ""} de quiz rejoindront ta révision.
              </p>
            )}
          </>
        )}
      </section>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {index > 0 && (
          <button type="button" onClick={() => aller(index - 1)} className="gr-focus" style={{
            minHeight: 52, padding: "0 16px", borderRadius: R.lg, border: `1.5px solid ${C.borderStrong}`,
            background: C.surface, color: C.text, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Ti name="chevron-left" size={18} color={C.text} /> Retour
          </button>
        )}
        <button type="button" onClick={continuer} className="gr-focus" style={{
          flex: 1, minHeight: 52, padding: "0 16px", borderRadius: R.lg,
          border: carte.type === "question" && !repondue ? `1.5px solid ${C.borderStrong}` : "none",
          background: carte.type === "question" && !repondue ? C.surface : derniere && done ? C.green : C.primaryBtn,
          color: carte.type === "question" && !repondue ? C.text : C.onPrimaryBtn,
          fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: FONTS.ui,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {libelleContinuer(carte, { repondue, derniere, terminee: done })}
          {!derniere && <Ti name="chevron-right" size={18} color={carte.type === "question" && !repondue ? C.text : C.onPrimaryBtn} />}
        </button>
      </div>
      {index === 0 && !done && (
        <p style={{ margin: "10px 0 0", fontSize: 12, color: C.text3, textAlign: "center" }}>
          Une idée par carte. Balaie l'écran ou utilise les boutons pour avancer.
        </p>
      )}
    </div>
  );
}

// ── Carte question : retour immédiat, jamais bloquant ─────────────────────
function QuestionCarte({ question, choix, onChoisir }) {
  const C = useC();
  const repondue = choix !== undefined;
  const ev = repondue ? evaluerReponse(question, choix) : null;
  return (
    <>
      <div role="group" aria-label="Choix de réponse" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.o.map((o, i) => {
          const bonne = i === question.a, choisie = i === choix;
          const fond = !repondue ? C.surface : bonne ? C.greenL : choisie ? C.dangerL : C.surface;
          const bord = !repondue ? C.borderStrong : bonne ? C.green : choisie ? C.danger : C.border;
          return (
            <button key={i} type="button" onClick={() => onChoisir(i)} disabled={repondue} aria-pressed={choisie}
              className="gr-focus"
              style={{
                textAlign: "left", minHeight: 48, padding: "11px 14px", borderRadius: R.md,
                border: `1.5px solid ${bord}`, background: fond, color: C.text,
                fontSize: 15, lineHeight: 1.4, fontFamily: FONTS.body, cursor: repondue ? "default" : "pointer",
                opacity: repondue && !bonne && !choisie ? 0.7 : 1,
                display: "flex", gap: 10, alignItems: "center",
              }}>
              <span style={{ flex: 1 }}>{o}</span>
              {repondue && bonne && <Ti name="check" size={18} color={C.greenInk} />}
              {repondue && choisie && !bonne && <Ti name="x" size={18} color={C.dangerInk} />}
            </button>
          );
        })}
      </div>
      <div role="status" aria-live="polite">
        {ev && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <Gropi pose={ev.pose} size={56} anim="pop" />
            <div style={{ flex: 1, background: ev.correct ? C.greenL : C.amberL, border: `1.5px solid ${ev.correct ? C.greenBorder : C.amberBorder}`, borderRadius: R.lg, borderBottomLeftRadius: 4, padding: "10px 13px" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: ev.correct ? C.greenD : C.amberD, fontFamily: FONTS.ui }}>{ev.titre}</div>
              <p style={{ margin: "3px 0 0", fontSize: 14, lineHeight: 1.55, color: C.text }}>{ev.message}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Carte « À toi de jouer » : consigne, diagramme, clic, minuteur ───────
function AToiCarte({ carte, renderDiagramBlock }) {
  const C = useC();
  return (
    <>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: C.text }}>{carte.consigne}</p>
      {carte.bloc && renderDiagramBlock?.(carte.bloc, "bloc")}
      {(carte.bpm || carte.minuteur) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {carte.bpm && <Clic bpm={carte.bpm} />}
          {carte.minuteur && <Minuteur secondes={carte.minuteur} />}
        </div>
      )}
    </>
  );
}

function Clic({ bpm }) {
  const C = useC();
  const [actif, setActif] = useState(false);
  const [temps, setTemps] = useState(-1);
  const arret = useRef(null);
  const jeton = useRef(0);

  const couper = useCallback(() => {
    jeton.current++;
    const a = arret.current; arret.current = null;
    if (a) a();
    setActif(false); setTemps(-1);
  }, []);
  useEffect(() => () => { jeton.current++; arret.current?.(); arret.current = null; }, []);

  const basculer = async () => {
    if (actif) return couper();
    const moi = ++jeton.current;
    setActif(true);
    const stop = await demarrerClic(bpm, { onTemps: setTemps });
    // Arrêté (ou carte quittée) pendant le chargement de l'audio.
    if (moi !== jeton.current) { stop(); return; }
    arret.current = stop;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: R.lg, background: C.surface2, border: `1px solid ${C.border}` }}>
      <button type="button" onClick={basculer} aria-pressed={actif} className="gr-focus" style={{
        minHeight: 48, padding: "0 16px", borderRadius: R.md, border: "none",
        background: actif ? C.text : C.primaryBtn, color: actif ? C.surface : C.onPrimaryBtn,
        fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: FONTS.ui, display: "flex", alignItems: "center", gap: 8,
      }}>
        <Ti name={actif ? "player-stop-filled" : "metronome"} size={18} color={actif ? C.surface : C.onPrimaryBtn} />
        {actif ? "Arrêter le clic" : `Lancer le clic · ${bpm} BPM`}
      </button>
      <div aria-hidden="true" style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2, 3].map(b => (
          <span key={b} style={{ width: b === 0 ? 14 : 11, height: b === 0 ? 14 : 11, borderRadius: 99, background: temps === b ? (b === 0 ? C.primary : C.amber) : C.border, transition: "background .06s" }} />
        ))}
      </div>
    </div>
  );
}

const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Minuteur({ secondes }) {
  const C = useC();
  const [reste, setReste] = useState(secondes);
  const [etat, setEtat] = useState("pret");   // pret · en-cours · fini
  const fin = useRef(0);

  useEffect(() => {
    if (etat !== "en-cours") return undefined;
    const id = setInterval(() => {
      const r = Math.max(0, Math.ceil((fin.current - Date.now()) / 1000));
      setReste(r);
      if (r === 0) {
        setEtat("fini");
        try { navigator.vibrate?.([200, 80, 200]); } catch { /* non supporté */ }
      }
    }, 200);
    return () => clearInterval(id);
  }, [etat]);

  const lancer = () => { fin.current = Date.now() + secondes * 1000; setReste(secondes); setEtat("en-cours"); };
  const libelle = secondes === 60 ? "la minute" : secondes % 60 === 0 ? `les ${secondes / 60} minutes` : `les ${secondes} secondes`;

  return (
    <div style={{ padding: "12px", borderRadius: R.lg, background: C.surface2, border: `1px solid ${C.border}`, textAlign: "center" }}>
      <div role="timer" aria-label={`Temps restant : ${mmss(reste)}`} style={{ fontSize: 40, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: etat === "fini" ? C.greenInk : C.text, lineHeight: 1.1 }}>
        {mmss(reste)}
      </div>
      <div role="status" aria-live="polite" style={{ fontSize: 13, color: C.text2, minHeight: 18, marginTop: 2 }}>
        {etat === "en-cours" ? "C'est parti, ne t'arrête pas !" : etat === "fini" ? "Temps écoulé ! Note ton score, tu le battras demain." : ""}
      </div>
      <button type="button" onClick={etat === "en-cours" ? () => { setEtat("pret"); setReste(secondes); } : lancer} className="gr-focus" style={{
        marginTop: 8, width: "100%", minHeight: 56, borderRadius: R.lg, border: "none",
        background: etat === "en-cours" ? C.text : C.green, color: etat === "en-cours" ? C.surface : C.onPrimaryBtn,
        fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: FONTS.ui, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Ti name={etat === "en-cours" ? "player-stop-filled" : etat === "fini" ? "refresh" : "clock"} size={20} color={etat === "en-cours" ? C.surface : C.onPrimaryBtn} />
        {etat === "en-cours" ? "Arrêter" : etat === "fini" ? "Recommencer" : `Lancer ${libelle}`}
      </button>
    </div>
  );
}
