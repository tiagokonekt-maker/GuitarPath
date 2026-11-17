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
//      Ear Training rejoint l'Oreille, la Jam Session l'Impro. Le module
//      d'initiation « Premiers pas » y a aussi sa carte (ses exercices et ses
//      questions n'étaient accessibles nulle part ailleurs), mais seulement
//      pour qui en a besoin : obligatoire pour lui, ou déjà entamé.
//   5. « Exercices » — les exercices guitare en main débloqués par les leçons
//      faites (même règle que la séance : unlockedBy + courseLink), avec leur
//      état (à faire, en cours, fait). Un aperçu ici, la liste complète par
//      domaine en un geste ; chaque carte de domaine rappelle aussi son compte.
//      (L'ancien écran Exercices n'était plus atteignable depuis l'interface.)

import { useState, useMemo } from "react";
import { R, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Gropi } from "../design/Gropi.jsx";
import {
  Button, Card, Eyebrow, Gauge, IconTile, ListGroup, ListRow,
  ScreenHero, SectionTitle, Segmented, SubHeader,
} from "../design/ui.jsx";
import { POSE_ROLE } from "../design/gropiPoses.js";
import { ExerciseDetail } from "./ExercisesScreen.jsx";
import { QuizScreen } from "./QuizScreen.jsx";
import { masteryStats } from "../store/mastery.js";
import { buildPath, buildUnits, debutFacultatif, DEBUT_MODULE } from "../store/pathEngine.js";
// todayStr / weekStr en heure LOCALE — ne jamais réimplémenter avec
// `new Date().toISOString()` (bug UTC déjà corrigé ailleurs dans l'app).
import { todayStr, weekStr } from "../store/state.js";
import { FAMILLES, domaineDe, progressionFamilles, itemsGeneres } from "../store/generateurs.js";
import { getReviewStats } from "../store/reviewEngine.js";
import { exercicesDesModules, DUREES, dureeParDefaut, objectifJoursSemaine, planSeance, joursDeLaSemaine, indexJour } from "../store/seance.js";

const CLE_DUREE = "groply:duree-seance";
const lireDuree = (defaut) => { try { const v = Number(localStorage.getItem(CLE_DUREE)); return DUREES.includes(v) ? v : defaut; } catch { return defaut; } };
const ecrireDuree = (v) => { try { localStorage.setItem(CLE_DUREE, String(v)); } catch { /* stockage indisponible */ } };

// Domaines : couleur du module, icône, modules d'exercices, outil libre.
// `prelude` : domaine du module d'initiation — pas de compétences générées
// ni de jauge de niveau, seulement ses leçons, exercices et questions.
const DOMAINES = [
  { id: "Premiers pas", couleur: "coral", icone: "sparkles", modules: [DEBUT_MODULE], objectif: null, prelude: true, libre: { titre: "Accordeur", detail: "Dans la boîte à outils, onglet Accordeur", ecran: "toolbox", outil: "tuner" } },
  { id: "Manche",  couleur: "amber",  icone: "map-2",     modules: ["neck"],              objectif: "manche",  libre: { titre: "Explorer le manche", detail: "Notes, gammes et accords sur tout le manche", ecran: "toolbox", outil: "neck" } },
  { id: "Théorie", couleur: "green",  icone: "stack-2",   modules: ["scales", "harmony"], objectif: "theorie", libre: { titre: "Quiz par module", detail: "Toutes les questions de théorie, à ton rythme", quiz: true } },
  { id: "Oreille", couleur: "teal",   icone: "ear",       modules: [],                    objectif: null,      libre: { titre: "Ear Training", detail: "Intervalles, accords, suites : sans limite", ecran: "ear" } },
  { id: "Rythme",  couleur: "blue",   icone: "metronome", modules: ["rhythm"],            objectif: null,      libre: { titre: "Métronome", detail: "Dans la boîte à outils", ecran: "toolbox", outil: "metronome" } },
  { id: "Impro",   couleur: "pink",   icone: "wand",      modules: ["impro"],             objectif: "impro",   libre: { titre: "Jam Session", detail: "Un groupe qui suit les accords, et des contraintes à tenir", ecran: "jam" } },
];
/** Exercices d'un domaine : débloqués et verrouillés (règle partagée avec la séance). */
const exercicesDe = (d, content, state) => exercicesDesModules(content, state, d.modules);
const exerciceFait = (state, e) => !!state.completedExercises?.[e.id];
const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;

const ICONE_ETAPE = { revision: "refresh", guitare: "guitar-pick", jouer: "music" };
const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
const NOMS_JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export function TrainingScreen({ state, dispatch, content, navigate, vueInitiale = null }) {
  const C = useC();
  const [domaineOuvert, setDomaineOuvert] = useState(null);
  // Liste complète des exercices. L'ancienne route « exercises » y mène directement.
  const [exercicesOuverts, setExercicesOuverts] = useState(vueInitiale === "exercices");
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
  const progression = useMemo(() => progressionFamilles(state), [state]);
  const gMastery = useMemo(() => masteryStats(content, state), [content, state]);
  const afficherPrelude = useMemo(() => {
    const debut = content.courses.find(c => c.id === DEBUT_MODULE);
    if (!debut) return false;
    return debut.lessons.some(l => state.completedLessons?.[l.id])
      || !debutFacultatif(state, buildUnits(content.courses, state));
  }, [content.courses, state]);
  const uniteEnAttente = useMemo(() => buildPath(content, state).find(u => u.needsCheck) || null, [content, state]);

  const lancerEtape = (e) => {
    if (e.aJour) return;
    if (e.id === "revision") navigate("review", { cible: e.questions, retour: "training" });
    else if (e.id === "guitare") setExerciceOuvert(e.exercice);
    // Débutant : un morceau d'Outils › Morceaux, un exercice de Premiers
    // pas ou l'accordeur, jamais la Jam Session (voir seanceDebutant).
    else if (e.id === "jouer" && e.morceau) navigate("toolbox", { outil: "morceaux", morceau: e.morceau, retour: "training" });
    else if (e.id === "jouer" && e.exercice) setExerciceOuvert(e.exercice);
    else if (e.id === "jouer" && e.outil) navigate("toolbox", { outil: e.outil, retour: "training" });
    else if (e.id === "jouer") navigate("jam", { retour: "training" });
  };

  if (exerciceOuvert) {
    return <ExerciseDetail ex={exerciceOuvert} state={state} dispatch={dispatch} content={content} onBack={() => setExerciceOuvert(null)} />;
  }
  // Domaines visibles : « Premiers pas » seulement s'il est obligatoire ou entamé.
  const domainesVisibles = DOMAINES.filter(d => !d.prelude || afficherPrelude);
  if (exercicesOuverts) {
    return <VueExercices C={C} domaines={domainesVisibles} state={state} content={content}
      onExercice={setExerciceOuvert} onRetour={() => setExercicesOuverts(false)} />;
  }
  if (domaineOuvert) {
    const d = DOMAINES.find(x => x.id === domaineOuvert);
    return (
      <VueDomaine C={C} d={d} state={state} dispatch={dispatch} content={content} navigate={navigate} progression={progression}
        quizOuvert={quizOuvert} setQuizOuvert={setQuizOuvert}
        onExercice={setExerciceOuvert} onRetour={() => { setDomaineOuvert(null); setQuizOuvert(false); }} />
    );
  }

  // L'objectif de l'élève passe en tête des domaines. « Premiers pas »
  // n'apparaît que s'il est obligatoire ou déjà entamé : un joueur confirmé
  // qui ne l'a jamais ouvert n'a pas à le voir ici.
  const domainesOrdonnes = [...domainesVisibles].sort((a, b) => (b.objectif === objectif) - (a.objectif === objectif));

  return (
    <div>
      <ScreenHero
        image="/ocean.jpg" color="#36b3d7" overlay="rgba(0,60,80,.52)" position="center 30%"
        title="Pratique"
        subtitle={`${gMastery.comprises} compris · ${gMastery.ancrees} ancré${gMastery.ancrees > 1 ? "s" : ""} sur ${gMastery.total} leçons`}
      />

      <div className="gr-stagger" style={{ padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {seance.vide ? (
          <Card as="section" tone="primary" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Eyebrow>Ta séance du jour</Eyebrow>
            <h2 style={{ margin: 0, fontSize: T.h3, fontWeight: 800, color: C.text, letterSpacing: "-.3px" }}>Commence par une leçon</h2>
            <div style={{ fontSize: T.small, color: C.text2, lineHeight: 1.5 }}>Ta séance se composera d'elle-même dès ta première leçon : révision de ce que tu as appris, puis du jeu.</div>
            <Button size="lg" full iconRight="arrow-right" onClick={() => navigate("home")}>Aller au Parcours</Button>
          </Card>
        ) : (
          <SeanceDuJour C={C} seance={seance} duree={duree}
            onDuree={(v) => { setDuree(v); ecrireDuree(v); }} onLancer={lancerEtape} />
        )}

        <Semaine C={C} state={state} objectifJours={objectifJoursSemaine(state.onboarding?.timePerWeek)} />

        {uniteEnAttente && (
          <Card as="section" tone="amber" soft pad="12px 14px" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <IconTile icon="clipboard-check" tone="amber" solid />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.amberD }}>Vérification prête</div>
              <div style={{ fontSize: 12, color: C.amberD, lineHeight: 1.4 }}>{uniteEnAttente.title} : leçons finies, à valider</div>
            </div>
            <Button size="sm" variant="secondary" tone="amber" onClick={() => navigate("home")}>Valider</Button>
          </Card>
        )}

        <ApercuExercices C={C} domaines={domainesVisibles} state={state} content={content}
          onExercice={setExerciceOuvert} onTout={() => setExercicesOuverts(true)} />

        <section aria-labelledby="titre-domaines" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Gropi « choix » : c'est ici qu'on choisit son chemin du jour. */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
            <SectionTitle id="titre-domaines">S'entraîner sur…</SectionTitle>
            <Gropi pose={POSE_ROLE.choix} size={44} anim="bob" style={{ marginRight: 4 }} />
          </div>
          <div className="gr-stagger" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {domainesOrdonnes.map(d => (
              <CarteDomaine key={d.id} C={C} d={d} state={state} content={content} progression={progression} onOuvrir={() => setDomaineOuvert(d.id)} />
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
    <Card as="section" tone="primary" aria-labelledby="titre-seance" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <Eyebrow>Ta séance du jour</Eyebrow>
        <h2 id="titre-seance" style={{ margin: "4px 0 0", fontSize: T.h3, fontWeight: 800, color: C.text, letterSpacing: "-.3px" }}>
          {terminee ? "Séance terminée" : commencee ? "On continue ?" : "Composée pour toi"}
        </h2>
      </div>

      {!terminee && (
        <Segmented label="Durée de la séance" value={duree} onChange={onDuree}
          options={DUREES.map(v => ({ value: v, label: `${v} min` }))} />
      )}

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {etapes.map((e, i) => {
          const estProchaine = prochaine?.id === e.id;
          const reste = e.id === "jouer" && !e.fait && e.secondesFaites > 0
            ? ` · ${Math.floor(e.secondesFaites / 60)} min jouée${e.secondesFaites >= 120 ? "s" : ""} sur ${e.minutes}` : "";
          return (
            <li key={e.id}>
              <button onClick={() => onLancer(e)} className="gr-row gr-focus"
                aria-label={`Étape ${i + 1} : ${e.titre}, ${e.minutes} minutes, ${e.fait ? "faite" : estProchaine ? "à faire maintenant" : "à faire"}`}
                style={{
                  width: "100%", minHeight: 56, display: "flex", alignItems: "center", gap: 12, padding: "8px 10px", textAlign: "left",
                  borderRadius: R.md, fontFamily: "inherit",
                  background: estProchaine ? C.primaryL : "transparent",
                  border: `2px solid ${estProchaine ? C.primaryBorder : "transparent"}`,
                }}>
                <IconTile icon={e.fait ? "check" : ICONE_ETAPE[e.id]} tone={e.fait ? "green" : "primary"} solid={e.fait} size={36}
                  style={e.fait ? undefined : { color: C.primaryD }} />
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
        <div role="status" className="gr-in-pop" style={{ display: "flex", alignItems: "center", gap: 10, background: C.greenL, border: `2px solid ${C.greenBorder}`, borderRadius: R.md, padding: "12px 14px", color: C.greenD, fontSize: T.small, lineHeight: 1.5 }}>
          <Gropi pose={POSE_ROLE.reussite} size={44} anim="cheer" />
          <div><b>Bravo, c'est fait pour aujourd'hui.</b> Envie de continuer ? Choisis un domaine ci-dessous.</div>
        </div>
      ) : (
        <Button size="lg" full icon="player-play" onClick={() => onLancer(prochaine)}>
          {commencee ? `Continuer : ${prochaine.titre}` : `Commencer · ${totalMinutes} min`}
        </Button>
      )}
    </Card>
  );
}

// ── Cette semaine ──────────────────────────────────────────────────────────
function Semaine({ C, state, objectifJours }) {
  const jours = joursDeLaSemaine(state, weekStr());
  const faits = new Set(jours.map(indexJour));
  const auj = indexJour(todayStr());
  const n = jours.length;
  return (
    <Card as="section" aria-labelledby="titre-semaine" pad="12px 14px" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <h2 id="titre-semaine" style={{ margin: 0, fontSize: T.body, fontWeight: 800, color: C.text }}>Cette semaine</h2>
        <div style={{ fontSize: T.small, color: C.text2 }}>
          <b style={{ color: C.text }}>{n} jour{n > 1 ? "s" : ""}</b> de pratique sur {objectifJours}
        </div>
      </div>
      <ul aria-label={`Jours de pratique : ${n} sur ${objectifJours} visés`} style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
        {JOURS.map((l, i) => (
          <li key={i} aria-label={`${NOMS_JOURS[i]} : ${faits.has(i) ? "pratiqué" : i === auj ? "aujourd'hui" : "pas de pratique"}`}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div className={faits.has(i) ? "gr-in-pop gr-delay" : undefined} style={{
              "--d": i + 2,
              width: 32, height: 32, borderRadius: R.pill, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box",
              background: faits.has(i) ? C.green : i === auj ? C.surface : C.surface2,
              border: !faits.has(i) && i === auj ? `2.5px solid ${C.primary}` : "none",
              boxShadow: faits.has(i) ? `0 2px 0 color-mix(in srgb, ${C.green} 70%, #000)` : "none",
            }}>
              {faits.has(i) && <Ti name="check" size={15} color={C.onPrimaryBtn} stroke={3} />}
            </div>
            <div aria-hidden="true" style={{ fontSize: T.micro, fontWeight: i === auj ? 800 : 600, color: i === auj ? C.primaryD : C.text2 }}>{l}</div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ── Domaines ───────────────────────────────────────────────────────────────
function familleDomaine(f) { return domaineDe(f); }
function couleurs(C, nom) { return { c: C[nom], l: C[nom + "L"], d: C[nom + "D"], b: C[nom + "Border"], ink: C[nom + "Ink"] || C[nom + "D"] }; }

function CarteDomaine({ C, d, state, content, progression, onOuvrir }) {
  const k = couleurs(C, d.couleur);
  const miennes = progression.filter(p => p.domaine === d.id);
  const commencees = miennes.filter(p => p.commencee);
  const niveau = commencees.length ? Math.round(commencees.reduce((s, p) => s + p.niveau, 0) / commencees.length) : 0;
  const lecons = d.prelude ? (content.courses.find(c => d.modules.includes(c.id))?.lessons || []) : [];
  const leconsFaites = lecons.filter(l => state.completedLessons?.[l.id]).length;
  const { dispo, verrouilles } = exercicesDe(d, content, state);
  const exosFaits = dispo.filter(e => exerciceFait(state, e)).length;
  const detailExos = dispo.length
    ? `${exosFaits}/${pluriel(dispo.length, "exercice")} fait${exosFaits > 1 ? "s" : ""}`
    : verrouilles.length ? `${pluriel(verrouilles.length, "exercice")} à débloquer` : null;
  const detail = d.prelude
    ? `${leconsFaites}/${lecons.length} leçon${lecons.length > 1 ? "s" : ""}`
    : d.id === "Impro"
    ? `Jam Session · ${state.jam?.seances || 0} séance${(state.jam?.seances || 0) > 1 ? "s" : ""}`
    : miennes.length ? `${miennes.length} compétence${miennes.length > 1 ? "s" : ""}` : "À débloquer dans le parcours";
  return (
    <Card onClick={onOuvrir} tone={d.couleur} pad={14}
      aria-label={`${d.id} : ${detail}${commencees.length ? `, niveau moyen ${niveau} sur 3` : ""}${detailExos ? `, ${detailExos}` : ""}`}
      style={{ minHeight: 148, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
      <IconTile icon={d.icone} tone={d.couleur} size={40} />
      <div style={{ fontSize: T.body, fontWeight: 800, color: C.text }}>{d.id}</div>
      {d.id !== "Impro" && !d.prelude && <Gauge value={niveau} color={k.c} style={{ width: "100%" }} />}
      <div style={{ fontSize: 12, color: C.text2 }}>{detail}</div>
      {detailExos && (
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: C.text2, marginTop: -4 }}>
          <Ti name="guitar-pick" size={13} color={k.c} /> {detailExos}
        </div>
      )}
    </Card>
  );
}

function VueDomaine({ C, d, state, dispatch, content, navigate, progression, quizOuvert, setQuizOuvert, onExercice, onRetour }) {
  const k = couleurs(C, d.couleur);
  const lecons = useMemo(() => new Map(content.courses.flatMap(c => c.lessons).map(l => [l.id, l.title])), [content.courses]);
  const debloquees = progression.filter(p => p.domaine === d.id);
  const verrouillees = FAMILLES.filter(f => familleDomaine(f) === d.id && !state.completedLessons?.[f.lecon]);
  const { dispo: exercices, verrouilles: exosVerrouilles } = exercicesDe(d, content, state);
  const quizDispo = (content.quiz || []).some(q => d.modules.includes(q.courseId) && state.completedLessons?.[q.lessonId]);
  const peutReviser = debloquees.length > 0 || quizDispo;

  const ouvrirLibre = () => {
    if (d.libre.quiz) setQuizOuvert(true);
    // Outils : ouvert directement sur l'onglet de l'outil (Accordeur pour
    // Premiers pas), pas sur le dernier onglet visité.
    else navigate(d.libre.ecran, d.libre.ecran === "toolbox" ? { outil: d.libre.outil, retour: "training" } : { retour: "training" });
  };

  return (
    <div className="gr-in-push">
      <SubHeader tone={d.couleur} onBack={onRetour} backLabel="Retour à Pratique" title={d.id}
        right={<IconTile icon={d.icone} tone={d.couleur} size={44} style={{ background: C.surface }} />}>
        {peutReviser ? (
          <Button size="lg" full tone={d.couleur} icon="player-play"
            onClick={() => navigate("review", { domaine: d.id, cible: 10, retour: "training" })}>
            {d.prelude ? "Réviser les premiers pas" : `S'entraîner sur ${d.id === "Impro" ? "l'impro" : d.id === "Oreille" ? "l'oreille" : `le ${d.id.toLowerCase()}`}`}
          </Button>
        ) : d.id !== "Impro" && (
          <div style={{ fontSize: T.small, color: k.d, lineHeight: 1.5 }}>{d.prelude
            ? "Rien à réviser pour l'instant : les questions se débloquent avec les leçons « Premiers pas » du parcours."
            : "Rien à réviser pour l'instant : les compétences de ce domaine se débloquent avec les leçons du parcours."}</div>
        )}
      </SubHeader>

      <div className="gr-stagger" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {quizOuvert ? (
          <section>
            <Button variant="ghost" size="sm" icon="arrow-left" onClick={() => setQuizOuvert(false)} style={{ padding: 0, marginBottom: 4 }}>
              Fermer les quiz
            </Button>
            <QuizScreen state={state} dispatch={dispatch} content={content} embedded />
          </section>
        ) : (<>
          {d.id === "Impro" ? (
            <Bloc titre="Ta Jam Session">
              <ListRow title={`${state.jam?.seances || 0} séance${(state.jam?.seances || 0) > 1 ? "s" : ""} comptée${(state.jam?.seances || 0) > 1 ? "s" : ""}`}
                detail={`${Math.floor((state.jam?.secondes || 0) / 60)} min de jeu · ${state.jam?.contraintes || 0} contrainte${(state.jam?.contraintes || 0) > 1 ? "s" : ""} tenue${(state.jam?.contraintes || 0) > 1 ? "s" : ""}`} />
            </Bloc>
          ) : d.prelude ? null : (
            <Bloc titre="Tes compétences">
              {debloquees.map(p => (
                <ListRow key={p.id} title={p.titre.replace(/^[^:]+ : /, "")}
                  detail={p.commencee ? `Niveau ${p.niveau} · ${p.libelle}` : "Nouvelle"}
                  right={<Gauge size="sm" value={p.commencee ? p.niveau : 0} color={k.c} />} />
              ))}
              {verrouillees.map(f => (
                <ListRow key={f.id} title={f.titre.replace(/^[^:]+ : /, "")} locked
                  detail={`Se débloque avec « ${lecons.get(f.lecon) || "une leçon du parcours"} »`} />
              ))}
              {!debloquees.length && !verrouillees.length && <ListRow title="Aucune compétence dans ce domaine" />}
            </Bloc>
          )}

          {(exercices.length > 0 || exosVerrouilles.length > 0) && (
            <BlocExercices titre="Exercices" exercices={exercices} verrouilles={exosVerrouilles}
              state={state} lecons={lecons} onExercice={onExercice} />
          )}

          <Bloc titre="En libre">
            <ListRow title={d.libre.titre} detail={d.libre.detail} onClick={ouvrirLibre}
              lead={<IconTile icon="player-play" tone={d.couleur} size={36} />} />
          </Bloc>
        </>)}
      </div>
    </div>
  );
}

function Bloc({ titre, children }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <SectionTitle>{titre}</SectionTitle>
      <ListGroup>{children}</ListGroup>
    </section>
  );
}

// ── Exercices ──────────────────────────────────────────────────────────────
/** Aperçu sur l'écran Pratique : les prochains exercices à faire, et l'accès à la liste complète. */
function ApercuExercices({ C, domaines, state, content, onExercice, onTout }) {
  const groupes = domaines.map(d => exercicesDe(d, content, state));
  const dispo = groupes.flatMap(g => g.dispo);
  const nbVerrouilles = groupes.reduce((n, g) => n + g.verrouilles.length, 0);
  const faits = dispo.filter(e => exerciceFait(state, e)).length;
  // À faire d'abord : ceux entamés, puis les plus faciles.
  const enCours = (e) => (state.exerciseProgress?.[e.id]?.length || 0) > 0;
  const suivants = dispo.filter(e => !exerciceFait(state, e))
    .sort((a, b) => (enCours(b) - enCours(a)) || ((a.lvl || 1) - (b.lvl || 1)))
    .slice(0, 2);
  return (
    <section aria-labelledby="titre-exercices" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <SectionTitle id="titre-exercices"
        right={dispo.length > 0 && <><b style={{ color: C.text }}>{faits}/{dispo.length}</b> fait{faits > 1 ? "s" : ""}</>}>
        Exercices
      </SectionTitle>
      <ListGroup>
        {dispo.length === 0 ? (
          <ListRow title="Pas encore d'exercice" detail={nbVerrouilles ? `${pluriel(nbVerrouilles, "exercice")} se débloquent avec les leçons du parcours` : "Les exercices arrivent avec les leçons du parcours"} />
        ) : suivants.length === 0 ? (
          <ListRow title="Tout est fait !" detail="Refais-les quand tu veux : la répétition ancre le geste."
            lead={<IconTile icon="check" tone="green" solid size={36} />} />
        ) : suivants.map(e => <LigneExercice key={e.id} C={C} e={e} state={state} onClick={() => onExercice(e)} />)}
        {dispo.length > 0 && (
          <li style={{ borderTop: `1px solid ${C.surface2}` }}>
            <button onClick={onTout} className="gr-row gr-focus" style={{
              width: "100%", minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "none", border: "none",
              fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: C.primaryInk,
            }}>
              Voir tous les exercices ({dispo.length}) <Ti name="arrow-right" size={16} color={C.primaryInk} />
            </button>
          </li>
        )}
      </ListGroup>
    </section>
  );
}

/** Liste complète, par domaine. */
function VueExercices({ domaines, state, content, onExercice, onRetour }) {
  const lecons = useMemo(() => new Map(content.courses.flatMap(c => c.lessons).map(l => [l.id, l.title])), [content.courses]);
  const groupes = domaines.map(d => ({ d, ...exercicesDe(d, content, state) })).filter(g => g.dispo.length || g.verrouilles.length);
  const dispo = groupes.flatMap(g => g.dispo);
  const faits = dispo.filter(e => exerciceFait(state, e)).length;
  return (
    <div className="gr-in-push">
      <SubHeader onBack={onRetour} backLabel="Retour à Pratique" title="Exercices"
        subtitle={dispo.length
          ? `${faits} fait${faits > 1 ? "s" : ""} sur ${pluriel(dispo.length, "exercice")} disponible${dispo.length > 1 ? "s" : ""}. Guitare en main, étape par étape.`
          : "Aucun exercice disponible pour l'instant : ils se débloquent avec les leçons du parcours."} />
      <div className="gr-stagger" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {groupes.map(({ d, dispo: liste, verrouilles }) => (
          <BlocExercices key={d.id} titre={d.id} exercices={liste} verrouilles={verrouilles}
            state={state} lecons={lecons} onExercice={onExercice} />
        ))}
      </div>
    </div>
  );
}

/** Bloc d'exercices d'un domaine : les débloqués, puis le prochain verrouillé et le compte des autres. */
function BlocExercices({ titre, exercices, verrouilles, state, lecons, onExercice }) {
  const C = useC();
  const faites = state.completedLessons || {};
  const faits = exercices.filter(e => exerciceFait(state, e)).length;
  const prochain = verrouilles[0];
  const leconRequise = prochain && [...(prochain.unlockedBy || []), prochain.courseLink].find(id => id && !faites[id]);
  return (
    <Bloc titre={exercices.length ? `${titre} · ${faits}/${exercices.length}` : titre}>
      {exercices.map(e => <LigneExercice key={e.id} C={C} e={e} state={state} onClick={() => onExercice(e)} />)}
      {prochain && (
        <ListRow locked title={verrouilles.length > 1 ? `${pluriel(verrouilles.length, "exercice")} à débloquer` : prochain.title}
          detail={`${verrouilles.length > 1 ? `Prochain : « ${prochain.title} », avec` : "Se débloque avec"} la leçon « ${lecons.get(leconRequise) || "du parcours"} »`} />
      )}
    </Bloc>
  );
}

function LigneExercice({ C, e, state, onClick }) {
  const fait = exerciceFait(state, e);
  const enCours = !fait && (state.exerciseProgress?.[e.id]?.length || 0) > 0;
  const statut = fait ? "fait" : enCours ? "en cours" : "à faire";
  const detail = [`${e.dur ?? "?"} min`, e.bpm ? `${e.bpm} BPM` : null, fait ? "Fait · à refaire quand tu veux" : enCours ? "En cours" : `+${e.xp} XP`].filter(Boolean).join(" · ");
  return (
    <ListRow onClick={onClick} ariaLabel={`Exercice « ${e.title} », ${e.dur ?? "?"} minutes, ${statut}`}
      title={e.title} detail={detail} detailColor={fait ? C.greenD : undefined}
      lead={<IconTile size={36} solid={fait}
        icon={fait ? "check" : enCours ? "player-pause" : "guitar-pick"}
        tone={fait ? "green" : enCours ? "amber" : "neutral"} />} />
  );
}
