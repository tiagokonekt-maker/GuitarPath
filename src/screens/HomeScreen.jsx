// Groply — screens/HomeScreen.jsx  v8 — Parcours-accueil
//
// ── Ce qui change ─────────────────────────────────────────────────────────
// L'accueil affichait niveau, XP, leçons, quiz, exercices, série — des
// chiffres déjà tous présents dans l'onglet Progrès. Il ne décidait rien à
// ta place : trois cartes à départager (révision, prochaine leçon, défi),
// un peu comme un tableau de bord plutôt qu'un point de départ.
//
// Sur le modèle Duolingo : l'accueil N'EST PAS un tableau de bord séparé,
// c'est le chemin lui-même, avec le nœud courant qui indique déjà quoi
// faire. Pas de carte à choisir — juste une décision déjà prise.
//
// CoursesScreen porte maintenant les deux présentations (voir son en-tête
// conditionnel, `variant`) : ce fichier n'est plus qu'un fin enrobage.
// Le corps du chemin — nœuds, connecteurs, coffres, LessonView — est
// EXACTEMENT le même code que l'onglet Parcours, aucune duplication.
//
// Ce qui n'a pas (encore) de nouvelle place, volontairement laissé de côté
// pour cette étape :
//   • Objectifs de la semaine, barre d'XP, historique des sessions — déjà
//     dans Progrès, ou à y ajouter séparément si besoin.
//   • Révision espagnée : sa place naturelle est la refonte de l'onglet
//     Pratique (« qu'est-ce qui a besoin d'être ancré »), pas l'accueil
//     (« qu'est-ce que j'apprends ensuite »). Prochaine étape.
//   • Jam Session / Ear Training : gardés en accès rapide dans le nouvel
//     en-tête pour l'instant (voir HomeHeader dans CoursesScreen.jsx),
//     temporairement — ils rejoindront Pratique à la prochaine étape.
import { CoursesScreen } from "./CoursesScreen.jsx";

export function HomeScreen(props) {
  return <CoursesScreen {...props} variant="home" />;
}

export default HomeScreen;
