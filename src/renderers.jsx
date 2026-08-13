// Groply — src/renderers.jsx
// Contexte des composants de rendu lourds (diagrammes, manche interactif).
//
// Pourquoi un fichier à part plutôt que le contexte dans App.jsx : les écrans
// consomment ce contexte, et App.jsx importe les écrans. Le déclarer ici évite
// un cycle d'imports App → écran → App, qui « marche » en ESM mais casse dès
// qu'un bundler change d'ordre d'évaluation.
//
// Ce contexte remplace l'ancien mécanisme : App.jsx appelait
// `coursesM.setDiagramRenderer(...)`, `quizM.setFretboardQuizQuestion(...)`,
// etc. — cinq singletons mutables au niveau module. Si un écran se rendait
// avant l'injection, le composant valait null, d'où les gardes défensives
// dispersées dans le code.
import { createContext, useContext } from "react";

export const RenderersContext = createContext({
  renderDiagramBlock: null,
  FretboardLesson: null,
  FretboardQuizQuestion: null,
  FretboardExercise: null,
});

export const useRenderers = () => useContext(RenderersContext);
export const RenderersProvider = RenderersContext.Provider;
