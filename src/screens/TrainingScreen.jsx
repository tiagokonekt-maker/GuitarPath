// Groply — screens/TrainingScreen.jsx  v2 — refonte adaptative
//
// ── Ce qui change ──────────────────────────────────────────────────────────
// La v1 fusionnait Quiz et Exercices sous deux sous-onglets, "Théorie" et
// "Guitare en main" — un vrai progrès sur l'empilement d'avant, mais qui
// laissait la moitié du problème intact : révision espacée, vérification
// d'unité en attente et défi du jour vivaient ailleurs dans l'app (surtout
// sur l'ancien Accueil), sans qu'aucun endroit ne réponde clairement à
// « qu'est-ce que je dois retravailler MAINTENANT ? ».
//
// Depuis la fusion Accueil/Parcours, la frontière est nette :
//   Parcours  → qu'est-ce que j'apprends ensuite (contenu neuf, structuré)
//   Pratique  → qu'est-ce que je dois retravailler (déjà appris, à ancrer)
//
// Cette version fait de Pratique ce vrai centre : une recommandation
// unique en tête, décidée par l'app à partir de reviewEngine (ce qui est
// dû) et mastery (ce qui est réellement maîtrisé, module par module) —
// deux moteurs déjà construits, jamais branchés ensemble jusqu'ici. En
// dessous, chaque mode porte sa propre raison d'être en une ligne, au lieu
// de deux libellés (Théorie / Guitare en main) qui ne disent rien de quand
// les choisir.
//
// Ce qui n'est VOLONTAIREMENT PAS fait ici, pour rester honnête sur le
// périmètre :
//   • Pas de filtrage du quiz par module recommandé : QuizScreen.jsx et
//     ExercisesScreen.jsx n'ont pas cette capacité aujourd'hui, et je ne
//     les ai pas sous les yeux dans cette session pour la leur ajouter sans
//     risque. La carte nomme le module faible, mais ouvrir "Théorie" montre
//     encore l'ensemble du quiz.
//   • Pas d'ouverture directe de la vérification d'unité en attente depuis
//     cet écran : ce mécanisme vit entièrement dans l'état local de
//     CoursesScreen (`checkingUnit`), sans route générique pour le
//     déclencher de l'extérieur. La carte renvoie vers Parcours, où le
//     coffre à vérifier est déjà visible.
import { useState, useMemo } from "react";
import { R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { ExercisesScreen } from "./ExercisesScreen.jsx";
import { QuizScreen } from "./QuizScreen.jsx";
import { getReviewStats } from "../store/reviewEngine.js";
import { masteryStats } from "../store/mastery.js";
import { buildPath } from "../store/pathEngine.js";
import { TESTABLE_MODULES } from "../store/placementEngine.js";
// todayStr en heure LOCALE — ne pas réimplémenter avec
// `new Date().toISOString()`, qui reproduirait le bug UTC déjà corrigé
// ailleurs dans l'app cet été (le défi du jour se déclarerait "fait" ou
// "pas fait" à la mauvaise date passé 22h en France).
import { todayStr } from "../store/state.js";

// Noms d'affichage des modules. Une table locale plutôt qu'un import : ce
// fichier n'a pas la certitude d'avoir accès à moduleTheme.js dans cette
// session, et TESTABLE_MODULES est stable depuis le début du projet — le
// risque de diverger est faible, et une table locale explicite vaut mieux
// qu'une dépendance non vérifiée.
const NOM_MODULE = {
  neck: "Manche", scales: "Gammes", harmony: "Harmonie",
  rhythm: "Rythme", impro: "Improvisation",
};

// Seuil de maîtrise en dessous duquel un module est considéré comme ayant
// encore de la marge de progression. Au-dessus, on ne relance pas dessus —
// "presque fini" ne mérite pas une recommandation, seulement "fini" ou
// "loin d'être fini".
const SEUIL_MODULE_FAIBLE = 90;

/**
 * Calcule LA recommandation du moment, par ordre de priorité :
 *   1. Révision due (dette de mémoire — passe toujours en premier)
 *   2. Module le plus faible parmi ceux réellement entamés (mastery réelle,
 *      pas le résultat figé du test de placement — un module peut avoir
 *      progressé ou régressé depuis)
 *   3. Défi du jour, si pas encore relevé
 *   4. Rien de pressant
 */
function useRecommandation(state, content) {
  return useMemo(() => {
    const reviewStats = getReviewStats(content.quiz, state.reviewHistory, state.completedLessons);
    if (reviewStats.toReview > 0) {
      return {
        type: "review",
        titre: "Révision du jour",
        texte: `${reviewStats.toReview} question${reviewStats.toReview > 1 ? "s" : ""} ${reviewStats.toReview > 1 ? "attendent" : "attend"} d'être revue${reviewStats.toReview > 1 ? "s" : ""} — la mémoire s'efface vite, c'est le bon moment.`,
        icon: "history", cta: "Réviser maintenant",
      };
    }

    const parModule = TESTABLE_MODULES
      .map(m => ({ id: m, stats: masteryStats(content, state, m) }))
      .filter(x => x.stats.total > 0 && x.stats.atteints > 0 && x.stats.pctMoyen < SEUIL_MODULE_FAIBLE);
    if (parModule.length > 0) {
      parModule.sort((a, b) => a.stats.pctMoyen - b.stats.pctMoyen);
      const { id, stats } = parModule[0];
      return {
        type: "module", moduleId: id,
        titre: `Concentre-toi sur : ${NOM_MODULE[id] || id}`,
        texte: `${stats.pctMoyen}% de maîtrise sur ce module — ${stats.comprises} leçon${stats.comprises>1?"s":""} comprise${stats.comprises>1?"s":""}, ${stats.ancrees} ancrée${stats.ancrees>1?"s":""}. Encore de la marge.`,
        icon: "target", cta: "Travailler ce module",
      };
    }

    if (!(state.dailyChallengeDone && state.dailyChallengeDate === todayStr())) {
      return {
        type: "challenge",
        titre: "Défi du jour",
        texte: "Rien de plus urgent à revoir pour l'instant — un défi rapide pour garder le rythme ?",
        icon: "bolt", cta: "Relever le défi",
      };
    }

    return {
      type: "none",
      titre: "Tout est à jour",
      texte: "Rien à revoir, rien de faible en ce moment. Explore librement ci-dessous, ou reviens plus tard.",
      icon: "check", cta: null,
    };
  }, [content, state.reviewHistory, state.completedLessons, state.quizResults, state.dailyChallengeDone, state.dailyChallengeDate]);
}

function CarteRecommandation({ rec, navigate, onOuvrirTheorie }) {
  const C = useC();
  const agir = () => {
    if (rec.type === "review") navigate("review");
    else if (rec.type === "challenge") navigate("challenge");
    else if (rec.type === "module") onOuvrirTheorie();
  };
  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${C.primaryBorder}`,
      borderRadius: R.xl, padding: "16px 16px 14px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
        <div style={{
          width: 38, height: 38, borderRadius: R.md, flexShrink: 0,
          background: C.primaryL, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Ti name={rec.icon} size={18} color={C.primary} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-.2px" }}>{rec.titre}</div>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, lineHeight: 1.5, color: C.text2 }}>{rec.texte}</p>
        </div>
      </div>
      {rec.cta && (
        <button onClick={agir} className="gr-focus" style={{
          width: "100%", marginTop: 13, padding: "11px", borderRadius: R.md, border: "none",
          background: C.primaryBtn, color: "#fff", fontSize: 13.5, fontWeight: 800, cursor: "pointer",
        }}>{rec.cta}</button>
      )}
    </div>
  );
}

/** Une carte de mode : icône, rôle en une ligne, stat, état actif optionnel. */
function CarteMode({ icon, titre, role, stat, actif, onClick }) {
  const C = useC();
  return (
    <button onClick={onClick} className="gr-focus" style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
      background: actif ? C.primaryL : C.surface,
      border: `1.5px solid ${actif ? C.primaryBorder : C.border}`,
      borderRadius: R.lg, padding: "12px 14px", marginBottom: 8, cursor: "pointer",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: R.sm, flexShrink: 0,
        background: actif ? "#fff" : C.surface2, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Ti name={icon} size={16} color={actif ? C.primary : C.text2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text }}>{titre}</div>
        <div style={{ fontSize: 11, color: C.text3, marginTop: 1 }}>{role}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: actif ? C.primaryD : C.text2 }}>{stat}</div>
      </div>
    </button>
  );
}

export function TrainingScreen({ state, dispatch, content, navigate }) {
  const C = useC();
  const [tab, setTab] = useState(null);   // null = aucun mode embarqué ouvert

  const rec = useRecommandation(state, content);

  const reviewStats = useMemo(
    () => getReviewStats(content.quiz, state.reviewHistory, state.completedLessons),
    [content.quiz, state.reviewHistory, state.completedLessons]
  );
  const gMastery = useMemo(() => masteryStats(content, state), [content, state]);

  const exoStat = useMemo(() => {
    const all = content.exercises || [];
    const done = all.filter(e => state.completedExercises?.[e.id]).length;
    return { done, total: all.length };
  }, [content.exercises, state.completedExercises]);

  // Unité en attente de vérification, s'il y en a une — voir la note en
  // tête de fichier sur ce que cette carte ne fait pas (encore).
  const uniteEnAttente = useMemo(() => {
    const path = buildPath(content, state);
    return path.find(u => u.needsCheck) || null;
  }, [content, state]);

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
          <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-.4px" }}>Pratique</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,.8)", marginTop: 2 }}>
            {gMastery.comprises} compris · {gMastery.ancrees} ancré{gMastery.ancrees>1?"s":""} sur {gMastery.total} leçons
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px 4px" }}>
        <CarteRecommandation rec={rec} navigate={navigate} onOuvrirTheorie={() => setTab("theory")} />

        {/* ── Les modes, chacun avec son rôle ── */}
        <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>
          Tous les modes
        </div>

        <CarteMode
          icon="history" titre="Révision" role="Ce qui est dû, décidé par la répétition espacée"
          stat={reviewStats.toReview > 0 ? `${reviewStats.toReview} dû${reviewStats.toReview>1?"es":"e"}` : "à jour"}
          actif={false}
          onClick={() => navigate("review")}
        />

        {uniteEnAttente && (
          <CarteMode
            icon="lock-open" titre="Vérification d'unité" role={`${uniteEnAttente.title} — leçons finies, à valider`}
            stat="en attente" actif={false}
            onClick={() => navigate("home")}
          />
        )}

        <CarteMode
          icon="help-circle" titre="Théorie" role="Quiz — vérifier et ancrer ce qui a été lu"
          stat={`${gMastery.comprises + gMastery.ancrees}/${gMastery.total} compris`}
          actif={tab === "theory"}
          onClick={() => setTab(t => t === "theory" ? null : "theory")}
        />

        <CarteMode
          icon="guitar-pick" titre="Guitare en main" role="Exercices — la pratique physique, à son rythme"
          stat={`${exoStat.done}/${exoStat.total}`}
          actif={tab === "playing"}
          onClick={() => setTab(t => t === "playing" ? null : "playing")}
        />
      </div>

      {/* ── Contenu du mode ouvert, sans son propre en-tête ── */}
      {tab === "theory" && <QuizScreen state={state} dispatch={dispatch} content={content} embedded />}
      {tab === "playing" && <ExercisesScreen state={state} dispatch={dispatch} content={content} embedded />}
    </div>
  );
}
