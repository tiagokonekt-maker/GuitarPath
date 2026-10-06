// Groply — screens/TrainingScreen.jsx (onglet Pratique)
//
// Organisé autour de ce que l'élève veut faire, plus selon nos types de
// contenu (Révision / Théorie / Guitare en main) :
//   1. « Ta séance du jour » — composée automatiquement (store/seance.js),
//      5, 15 ou 30 min, qui enchaîne des activités existantes. Chaque étape
//      est faite quand la progression RÉELLE le dit : rien ne se coche à la
//      main, et une séance commencée sur un appareil continue sur un autre.
//   2. « Cette semaine » — les jours de pratique, face à l'objectif tiré du
//      temps indiqué au test d'accueil (les objectifs hebdomadaires
//      existaient dans les données, mais n'étaient affichés nulle part).
//   3. La vérification d'unité, seulement quand elle est due.
//   4. « S'entraîner sur… » — un domaine (Manche, Théorie, Oreille, Rythme,
//      Impro) qui réunit ses compétences, ses exercices et son outil libre :
//      Ear Training rejoint l'Oreille, la Jam Session l'Impro.

import { useState, useMemo } from "react";
import { R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ExerciseDetail } from "./ExercisesScreen.jsx";
import { QuizScreen } from "./QuizScreen.jsx";
import { masteryStats } from "../store/mastery.js";
import { buildPath } from "../store/pathEngine.js";
// todayStr / weekStr en heure LOCALE — ne jamais réimplémenter avec
// `new Date().toISOString()` (bug UTC déjà corrigé ailleurs dans l'app).
import { todayStr, weekStr } from "../store/state.js";
import { FAMILLES, domaineDe, progressionFamilles, itemsGeneres } from "../store/generateurs.js";
import { getReviewStats } from "../store/reviewEngine.js";
import { DUREES, dureeParDefaut, objectifJoursSemaine, planSeance, joursDeLaSemaine, indexJour } from "../store/seance.js";

const CLE_DUREE = "groply:duree-seance";
const lireDuree = (defaut) => { try { const v = Number(localStorage.getItem(CLE_DUREE)); return DUREES.includes(v) ? v : defaut; } catch { return defaut; } };
const ecrireDuree = (v) => { try { localStorage.setItem(CLE_DUREE, String(v)); } catch { /* stockage indisponible */ } };

// Domaines : couleur du module, icône, modules d'exercices, outil libre.
const DOMAINES = [
  { id: "Manche",  couleur: "amber",  icone: "map-2",     modules: ["neck"],              objectif: "manche",  libre: { titre: "Explorer le manche", detail: "Notes, gammes et accords sur tout le manche", ecran: "toolbox" } },
  { id: "Théorie", couleur: "green",  icone: "stack-2",   modules: ["scales", "harmony"], objectif: "theorie", libre: { titre: "Quiz par module", detail: "Toutes les questions de théorie, à ton rythme", quiz: true } },
  { id: "Oreille", couleur: "teal",   icone: "ear",       modules: [],                    objectif: null,      libre: { titre: "Ear Training", detail: "Intervalles, accords, suites : sans limite", ecran: "ear" } },
  { id: "Rythme",  couleur: "blue",   icone: "metronome", modules: ["rhythm"],            objectif: null,      libre: { titre: "Métronome", detail: "Dans la boîte à outils", ecran: "toolbox" } },
  { id: "Impro",   couleur: "pink",   icone: "wand",      modules: ["impro"],             objectif: "impro",   libre: { titre: "Jam Session", detail: "Un groupe qui suit les accords, et des contraintes à tenir", ecran: "jam" } },
];
const ICONE_ETAPE = { revision: "refresh", guitare: "guitar-pick", jouer: "music" };
const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
const NOMS_JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export function TrainingScreen({ state, dispatch, content, navigate }) {
  const C = useC();
  const [domaineOuvert, setDomaineOuvert] = useState(null);
  const [exerciceOuvert, setExerciceOuvert] = useState(null);
  const [quizOuvert, setQuizOuvert] = useState(false);
  const [duree, setDuree] = useState(() => lireDuree(dureeParDefaut(state.onboarding?.timePerWeek)));
  const objectif = state.onboarding?.goal || "global";
  const today = todayStr();

  // Ce qui reste réellement à réviser (dû + jamais vu) : la séance n'annonce
  // jamais plus de questions qu'il n'en existe.
  const revisionDisponible = useMemo(() => {
    const st = getReviewStats([...content.quiz, ...itemsGeneres(state.completedLessons)], state.reviewHistory, state.completedLessons);
    return st.toReview + st.neverSeen;
  }, [content.quiz, state.reviewHistory, state.completedLessons]);
  const seance = useMemo(() => planSeance({ duree, objectif, state, content, today, revisionDisponible }), [duree, objectif, state, content, today, revisionDisponible]);
  const progression = useMemo(() => progressionFamilles(state), [state.completedLessons, state.reviewHistory]);
  const gMastery = useMemo(() => masteryStats(content, state), [content, state]);
  const uniteEnAttente = useMemo(() => buildPath(content, state).find(u => u.needsCheck) || null, [content, state]);

  const lancerEtape = (e) => {
    if (e.aJour) return;
    if (e.id === "revision") navigate("review", { cible: e.questions, retour: "training" });
    else if (e.id === "guitare") setExerciceOuvert(e.exercice);
    else if (e.id === "jouer") navigate("jam", { retour: "training" });
  };

  if (exerciceOuvert) {
    return <ExerciseDetail ex={exerciceOuvert} state={state} dispatch={dispatch} content={content} onBack={() => setExerciceOuvert(null)} />;
  }
  if (domaineOuvert) {
    const d = DOMAINES.find(x => x.id === domaineOuvert);
    return (
      <VueDomaine C={C} d={d} state={state} dispatch={dispatch} content={content} navigate={navigate} progression={progression}
        quizOuvert={quizOuvert} setQuizOuvert={setQuizOuvert}
        onExercice={setExerciceOuvert} onRetour={() => { setDomaineOuvert(null); setQuizOuvert(false); }} />
    );
  }

  // L'objectif de l'élève passe en tête des domaines.
  const domainesOrdonnes = [...DOMAINES].sort((a, b) => (b.objectif === objectif) - (a.objectif === objectif));

  return (
    <div>
      {/* ── En-tête ── */}
      <div style={{
        backgroundColor: "#36b3d7", backgroundImage: "url('/ocean.jpg')",
        backgroundSize: "cover", backgroundPosition: "center 30%",
        padding: "24px 20px 18px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,60,80,.52)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }}>Pratique</h1>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.85)", marginTop: 2 }}>
            {gMastery.comprises} compris · {gMastery.ancrees} ancré{gMastery.ancrees > 1 ? "s" : ""} sur {gMastery.total} leçons
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {seance.vide ? (
          <section style={{ background: C.surface, border: `1.5px solid ${C.primaryBorder}`, borderRadius: 22, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.primaryD, textTransform: "uppercase", letterSpacing: ".06em" }}>Ta séance du jour</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>Commence par une leçon</h2>
            <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>Ta séance se composera d'elle-même dès ta première leçon : révision de ce que tu as appris, puis du jeu.</div>
            <button onClick={() => navigate("home")} className="gr-focus" style={{ minHeight: 52, border: "none", borderRadius: 16, background: C.primaryBtn || C.primary, color: C.onPrimaryBtn, fontFamily: "inherit", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
              Aller au Parcours
            </button>
          </section>
        ) : (
          <SeanceDuJour C={C} seance={seance} duree={duree}
            onDuree={(v) => { setDuree(v); ecrireDuree(v); }} onLancer={lancerEtape} />
        )}

        <Semaine C={C} state={state} objectifJours={objectifJoursSemaine(state.onboarding?.timePerWeek)} />

        {uniteEnAttente && (
          <section style={{ background: C.amberL, border: `1.5px solid ${C.amberBorder}`, borderRadius: R.lg, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <Ti name="lock" size={22} color={C.amberD} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.amberD }}>Vérification prête</div>
              <div style={{ fontSize: 12, color: C.amberD }}>{uniteEnAttente.title} : leçons finies, à valider</div>
            </div>
            <button onClick={() => navigate("home")} className="gr-focus" style={{ minHeight: 44, padding: "0 14px", borderRadius: R.md, border: `1.5px solid ${C.amber}`, background: C.surface, color: C.amberD, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Valider
            </button>
          </section>
        )}

        <section aria-labelledby="titre-domaines" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h2 id="titre-domaines" style={{ margin: "4px 4px 0", fontSize: 17, fontWeight: 800, color: C.text }}>S'entraîner sur…</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {domainesOrdonnes.map(d => (
              <CarteDomaine key={d.id} C={C} d={d} state={state} progression={progression} onOuvrir={() => setDomaineOuvert(d.id)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ── Séance du jour ─────────────────────────────────────────────────────────
function SeanceDuJour({ C, seance, duree, onDuree, onLancer }) {
  const { etapes, prochaine, terminee, totalMinutes } = seance;
  const commencee = etapes.some(e => e.fait);
  return (
    <section aria-labelledby="titre-seance" style={{ background: C.surface, border: `1.5px solid ${C.primaryBorder}`, borderRadius: 22, padding: 16, display: "flex", flexDirection: "column", gap: 14, boxShadow: "0 6px 20px rgba(184,64,16,.10)" }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.primaryD, textTransform: "uppercase", letterSpacing: ".06em" }}>Ta séance du jour</div>
        <h2 id="titre-seance" style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: "-.3px" }}>
          {terminee ? "Séance terminée" : commencee ? "On continue ?" : "Composée pour toi"}
        </h2>
      </div>

      {!terminee && (
        <div role="group" aria-label="Durée de la séance" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6, background: C.surface2, padding: 4, borderRadius: 14 }}>
          {DUREES.map(v => (
            <button key={v} onClick={() => onDuree(v)} aria-pressed={v === duree} className="gr-focus" style={{
              minHeight: 44, border: "none", borderRadius: 11, fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer",
              background: v === duree ? C.surface : "transparent", color: v === duree ? C.text : C.text2,
              boxShadow: v === duree ? "0 1px 4px rgba(24,19,15,.12)" : "none",
            }}>{v} min</button>
          ))}
        </div>
      )}

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {etapes.map((e, i) => {
          const estProchaine = prochaine?.id === e.id;
          const reste = e.id === "jouer" && !e.fait && e.secondesFaites > 0
            ? ` · ${Math.floor(e.secondesFaites / 60)} min jouée${e.secondesFaites >= 120 ? "s" : ""} sur ${e.minutes}` : "";
          return (
            <li key={e.id}>
              <button onClick={() => onLancer(e)} className="gr-focus"
                aria-label={`Étape ${i + 1} : ${e.titre}, ${e.minutes} minutes, ${e.fait ? "faite" : estProchaine ? "à faire maintenant" : "à faire"}`}
                style={{
                  width: "100%", minHeight: 56, display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", textAlign: "left",
                  borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
                  background: estProchaine ? C.primaryL : "transparent",
                  border: `1.5px solid ${estProchaine ? C.primaryBorder : "transparent"}`,
                }}>
                <div style={{
                  width: 34, height: 34, flexShrink: 0, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  background: e.fait ? C.green : C.primaryL, border: e.fait ? "none" : `1.5px solid ${C.primaryBorder}`,
                }}>
                  <Ti name={e.fait ? "check" : ICONE_ETAPE[e.id]} size={17} color={e.fait ? C.onPrimaryBtn : C.primaryD} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, textDecorationLine: e.fait ? "line-through" : "none", textDecorationColor: C.text3 }}>{e.titre}</div>
                  <div style={{ fontSize: 12, color: C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.detail}{reste}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, whiteSpace: "nowrap" }}>{e.aJour ? "à jour" : `${e.minutes} min`}</div>
              </button>
            </li>
          );
        })}
      </ol>

      {terminee ? (
        <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, background: C.greenL, border: `1.5px solid ${C.greenBorder}`, borderRadius: 14, padding: "12px 14px", color: C.greenD, fontSize: 13, lineHeight: 1.5 }}>
          <Ti name="trophy" size={22} color={C.greenD} />
          <div><b>Bravo, c'est fait pour aujourd'hui.</b> Envie de continuer ? Choisis un domaine ci-dessous.</div>
        </div>
      ) : (
        <button onClick={() => onLancer(prochaine)} className="gr-focus" style={{
          minHeight: 52, border: "none", borderRadius: 16, background: C.primaryBtn || C.primary, color: C.onPrimaryBtn,
          fontFamily: "inherit", fontSize: 16, fontWeight: 800, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <Ti name="player-play" size={18} color={C.onPrimaryBtn} />
          {commencee ? `Continuer : ${prochaine.titre}` : `Commencer · ${totalMinutes} min`}
        </button>
      )}
    </section>
  );
}

// ── Cette semaine ──────────────────────────────────────────────────────────
function Semaine({ C, state, objectifJours }) {
  const jours = joursDeLaSemaine(state, weekStr());
  const faits = new Set(jours.map(indexJour));
  const auj = indexJour(todayStr());
  const n = jours.length;
  return (
    <section aria-labelledby="titre-semaine" style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <h2 id="titre-semaine" style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.text }}>Cette semaine</h2>
        <div style={{ fontSize: 13, color: C.text2 }}>
          <b style={{ color: C.text }}>{n} jour{n > 1 ? "s" : ""}</b> de pratique sur {objectifJours}
        </div>
      </div>
      <ul aria-label={`Jours de pratique : ${n} sur ${objectifJours} visés`} style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
        {JOURS.map((l, i) => (
          <li key={i} aria-label={`${NOMS_JOURS[i]} : ${faits.has(i) ? "pratiqué" : i === auj ? "aujourd'hui" : "pas de pratique"}`}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box",
              background: faits.has(i) ? C.green : i === auj ? C.surface : C.surface2,
              border: !faits.has(i) && i === auj ? `2px solid ${C.primary}` : "none",
            }}>
              {faits.has(i) && <Ti name="check" size={14} color={C.onPrimaryBtn} />}
            </div>
            <div aria-hidden="true" style={{ fontSize: 11, fontWeight: i === auj ? 800 : 600, color: i === auj ? C.primaryD : C.text2 }}>{l}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ── Domaines ───────────────────────────────────────────────────────────────
function familleDomaine(f) { return domaineDe(f); }
function couleurs(C, nom) { return { c: C[nom], l: C[nom + "L"], d: C[nom + "D"], b: C[nom + "Border"], ink: C[nom + "Ink"] || C[nom + "D"] }; }

function CarteDomaine({ C, d, state, progression, onOuvrir }) {
  const k = couleurs(C, d.couleur);
  const miennes = progression.filter(p => p.domaine === d.id);
  const commencees = miennes.filter(p => p.commencee);
  const niveau = commencees.length ? Math.round(commencees.reduce((s, p) => s + p.niveau, 0) / commencees.length) : 0;
  const detail = d.id === "Impro"
    ? `Jam Session · ${state.jam?.seances || 0} séance${(state.jam?.seances || 0) > 1 ? "s" : ""}`
    : miennes.length ? `${miennes.length} compétence${miennes.length > 1 ? "s" : ""}` : "À débloquer dans le parcours";
  return (
    <button onClick={onOuvrir} className="gr-focus" aria-label={`${d.id} : ${detail}${commencees.length ? `, niveau moyen ${niveau} sur 3` : ""}`}
      style={{ minHeight: 148, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 18, background: C.surface, border: `1.5px solid ${k.b}`, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: k.l }}>
        <Ti name={d.icone} size={20} color={k.c} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{d.id}</div>
      {d.id !== "Impro" && (
        <div aria-hidden="true" style={{ display: "flex", gap: 4, width: "100%" }}>
          {[1, 2, 3].map(n => <div key={n} style={{ flex: 1, height: 6, borderRadius: 3, background: n <= niveau ? k.c : C.border }} />)}
        </div>
      )}
      <div style={{ fontSize: 12, color: C.text2 }}>{detail}</div>
    </button>
  );
}

function VueDomaine({ C, d, state, dispatch, content, navigate, progression, quizOuvert, setQuizOuvert, onExercice, onRetour }) {
  const k = couleurs(C, d.couleur);
  const lecons = useMemo(() => new Map(content.courses.flatMap(c => c.lessons).map(l => [l.id, l.title])), [content.courses]);
  const debloquees = progression.filter(p => p.domaine === d.id);
  const verrouillees = FAMILLES.filter(f => familleDomaine(f) === d.id && !state.completedLessons?.[f.lecon]);
  const exercices = (content.exercises || []).filter(e => d.modules.includes(e.mod) &&
    (!e.unlockedBy?.length || e.unlockedBy.every(id => state.completedLessons?.[id])) &&
    (!e.courseLink || state.completedLessons?.[e.courseLink]));
  const quizDispo = (content.quiz || []).some(q => d.modules.includes(q.courseId) && state.completedLessons?.[q.lessonId]);
  const peutReviser = debloquees.length > 0 || quizDispo;

  const ouvrirLibre = () => {
    if (d.libre.quiz) setQuizOuvert(true);
    else navigate(d.libre.ecran, d.libre.ecran === "toolbox" ? {} : { retour: "training" });
  };

  return (
    <div>
      <div style={{ background: k.l, borderBottom: `1.5px solid ${k.b}`, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <button onClick={onRetour} aria-label="Retour à Pratique" className="gr-focus" style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: C.surface, border: `1.5px solid ${k.b}`, cursor: "pointer" }}>
          <Ti name="arrow-left" size={18} color={k.d} />
        </button>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-.5px", color: k.d }}>{d.id}</h1>
        {peutReviser ? (
          <button onClick={() => navigate("review", { domaine: d.id, cible: 10, retour: "training" })} className="gr-focus" style={{
            minHeight: 52, border: "none", borderRadius: 16, background: k.ink, color: C.onPrimaryBtn, fontFamily: "inherit", fontSize: 15, fontWeight: 800, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <Ti name="player-play" size={18} color={C.onPrimaryBtn} /> S'entraîner sur {d.id === "Impro" ? "l'impro" : d.id === "Oreille" ? "l'oreille" : `le ${d.id.toLowerCase()}`}
          </button>
        ) : d.id !== "Impro" && (
          <div style={{ fontSize: 13, color: k.d }}>Rien à réviser pour l'instant : les compétences de ce domaine se débloquent avec les leçons du parcours.</div>
        )}
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {quizOuvert ? (
          <section>
            <button onClick={() => setQuizOuvert(false)} className="gr-focus" style={{ minHeight: 44, border: "none", background: "none", color: C.text2, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
              ← Fermer les quiz
            </button>
            <QuizScreen state={state} dispatch={dispatch} content={content} embedded />
          </section>
        ) : (<>
          {d.id === "Impro" ? (
            <Bloc C={C} titre="Ta Jam Session">
              <Ligne C={C} titre={`${state.jam?.seances || 0} séance${(state.jam?.seances || 0) > 1 ? "s" : ""} comptée${(state.jam?.seances || 0) > 1 ? "s" : ""}`}
                detail={`${Math.floor((state.jam?.secondes || 0) / 60)} min de jeu · ${state.jam?.contraintes || 0} contrainte${(state.jam?.contraintes || 0) > 1 ? "s" : ""} tenue${(state.jam?.contraintes || 0) > 1 ? "s" : ""}`} />
            </Bloc>
          ) : (
            <Bloc C={C} titre="Tes compétences">
              {debloquees.map(p => (
                <Ligne key={p.id} C={C} titre={p.titre.replace(/^[^:]+ : /, "")}
                  detail={p.commencee ? `Niveau ${p.niveau} · ${p.libelle}` : "Nouvelle"}
                  jauge={p.commencee ? p.niveau : 0} couleur={k.c} />
              ))}
              {verrouillees.map(f => (
                <Ligne key={f.id} C={C} titre={f.titre.replace(/^[^:]+ : /, "")} verrou
                  detail={`Se débloque avec « ${lecons.get(f.lecon) || "une leçon du parcours"} »`} />
              ))}
              {!debloquees.length && !verrouillees.length && <Ligne C={C} titre="Aucune compétence dans ce domaine" detail="" />}
            </Bloc>
          )}

          {exercices.length > 0 && (
            <Bloc C={C} titre="Guitare en main">
              {exercices.map(e => (
                <Ligne key={e.id} C={C} titre={e.title} detail={`${e.dur ?? "?"} min${state.completedExercises?.[e.id] ? " · déjà fait" : ""}`}
                  onClick={() => onExercice(e)} />
              ))}
            </Bloc>
          )}

          <Bloc C={C} titre="En libre">
            <Ligne C={C} titre={d.libre.titre} detail={d.libre.detail} onClick={ouvrirLibre} />
          </Bloc>
        </>)}
      </div>
    </div>
  );
}

function Bloc({ C, titre, children }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <h2 style={{ margin: "0 4px", fontSize: 16, fontWeight: 800, color: C.text }}>{titre}</h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
        {children}
      </ul>
    </section>
  );
}

function Ligne({ C, titre, detail, jauge, couleur, verrou, onClick }) {
  const contenu = (
    <>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: verrou ? C.text2 : C.text }}>{titre}</div>
        {detail && <div style={{ fontSize: 12, color: C.text2 }}>{detail}</div>}
      </div>
      {verrou && <Ti name="lock" size={17} color={C.text2} label="Verrouillée" />}
      {jauge != null && !verrou && (
        <div role="img" aria-label={`niveau ${jauge} sur 3`} style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          {[1, 2, 3].map(n => <div key={n} style={{ width: 14, height: 6, borderRadius: 3, background: n <= jauge ? couleur : C.border }} />)}
        </div>
      )}
      {onClick && <Ti name="chevron-right" size={18} color={C.text2} />}
    </>
  );
  const style = { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", minHeight: 56, boxSizing: "border-box", borderTop: `1px solid ${C.surface2}` };
  return (
    <li style={{ borderTop: "none" }}>
      {onClick
        ? <button onClick={onClick} className="gr-focus" style={{ ...style, width: "100%", background: "none", border: "none", borderTop: `1px solid ${C.surface2}`, textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>{contenu}</button>
        : <div style={style}>{contenu}</div>}
    </li>
  );
}
