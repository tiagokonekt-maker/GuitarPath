#!/usr/bin/env node
// Groply — scripts/verifier-maitrise.mjs
// Contrôle dédié aux paliers de maîtrise : combien d'objectifs le contenu
// offre-t-il réellement, et quelles leçons restent plafonnées faute de
// question rattachée. Autonome — ne dépend d'aucun autre script.
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..");

// `import()` dynamique exige une URL de module, pas un chemin de système de
// fichiers brut. Sous Linux/macOS, un chemin absolu ("/home/...") est presque
// toujours accepté tel quel par tolérance des moteurs — d'où le fait que ça
// marchait chez moi. Sous Windows, un chemin commençant par une lettre de
// lecteur ("C:\...") est interprété comme un schéma d'URL invalide ("c:"), et
// Node refuse : ERR_UNSUPPORTED_ESM_URL_SCHEME. `pathToFileURL` convertit
// correctement dans les deux cas.
const versUrl = (chemin) => pathToFileURL(chemin).href;

const { COURSES, QUIZ } = await import(versUrl(resolve(RACINE, "src/content.js")));
const { masteryStats } = await import(versUrl(resolve(RACINE, "src/store/mastery.js")));

const content = { courses: COURSES, quiz: QUIZ };
const idsQuiz = new Set(QUIZ.map(q => q.id));
const vide = { completedLessons: {}, quizResults: {}, reviewHistory: {} };

console.log("=== Paliers de maîtrise ===\n");

let alertes = 0;
for (const m of ["neck", "scales", "harmony", "rhythm", "impro"]) {
  const s = masteryStats(content, vide, m);
  console.log(`${m.padEnd(10)} ${s.total} leçons → ${s.objectifs} objectifs` +
    (s.sansQuiz ? `  (${s.sansQuiz} sans question)` : ""));
}
const g = masteryStats(content, vide);
console.log(`\nTOTAL      ${g.total} leçons → ${g.objectifs} objectifs de maîtrise`);
console.log(`           (soit ${(g.objectifs / g.total).toFixed(1)} objectifs par leçon en moyenne)`);

if (g.sansQuiz > 0) {
  alertes += g.sansQuiz;
  console.log(`\n⚠ ${g.sansQuiz} leçon(s) sans aucune question, plafonnées au palier « vu » :`);
  for (const c of COURSES) for (const l of c.lessons || []) {
    const n = (l.quiz || []).filter(q => idsQuiz.has(q)).length;
    if (n === 0) console.log(`   ${c.id.padEnd(8)} p${l.level} ${l.id.padEnd(14)} ${l.title}`);
  }
}

console.log(alertes === 0
  ? "\n✓ Toutes les leçons ont au moins une question : aucune n'est bridée."
  : "\nCe n'est pas bloquant, mais chaque leçon listée ci-dessus perd 2 des 3 paliers.");
process.exit(0);
