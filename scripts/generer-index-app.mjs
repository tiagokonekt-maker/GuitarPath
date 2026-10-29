// ═══════════════════════════════════════════════════════════════════════════
// Génère l'index du contenu CÔTÉ APPLICATION, à partir de src/content/index.js
// (qui reste la source de vérité, utilisée telle quelle par Node : tests,
// vérificateurs, smoke).
//
//   node scripts/generer-index-app.mjs            → écrit les fichiers (si changés)
//   node scripts/generer-index-app.mjs --verifier → code 1 s'ils sont périmés
//
// Pourquoi : l'app chargeait tout le contenu (136 leçons, cartes comprises)
// en un seul gros morceau au démarrage. Le corps d'une leçon (`cartes`, ou
// l'ancien `content`) n'est utile qu'à l'ouverture de CETTE leçon. On produit
// donc deux fichiers :
//
//  - src/content/index-app.js : tout ce qui sert dès le démarrage, en
//    données pures (JSON) — modules, MÉTADONNÉES des leçons (id, level,
//    unite, title, duration, gropiTip, quiz…, tout sauf le corps), banque
//    QUIZ complète, EXERCISES. Aucun import : le texte des cartes ne peut
//    donc pas se retrouver dans le morceau de démarrage.
//  - src/content/corps-lecons.js : id de leçon → () => import(fichier de la
//    leçon). Vite en fait un petit morceau par leçon, chargé à l'ouverture
//    (et préchargé en tâche de fond pour le hors-ligne, voir
//    src/lecon/corpsLecon.js).
//
// Idempotent : un fichier n'est réécrit que si son contenu change. Lancé
// automatiquement par Vite (dev et build, voir vite.config.js) ; le test
// test/chargement-contenu.test.mjs échoue si les fichiers sont périmés.
// ═══════════════════════════════════════════════════════════════════════════

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
export const RACINE = resolve(ICI, "..");
const CONTENU = join(RACINE, "src", "content");
const COURS = join(CONTENU, "cours");

export const FICHIER_INDEX_APP = join(CONTENU, "index-app.js");
export const FICHIER_CORPS = join(CONTENU, "corps-lecons.js");

/** Champs qui forment le CORPS d'une leçon (chargé à la demande). */
export const CHAMPS_CORPS = ["cartes", "content"];

const ENTETE = (role) => `// ═══════════════════════════════════════════════════════════════════════════
// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Source : src/content/index.js et les fichiers de src/content/cours/.
// Régénérer : node scripts/generer-index-app.mjs (Vite le fait tout seul en
// dev et au build ; npm test échoue si ce fichier est périmé).
// ${role}
// ═══════════════════════════════════════════════════════════════════════════
`;

// Chaîne JSON → littéral de gabarit JS (une entrée par ligne, lisible dans
// un diff). JSON.parse d'une chaîne est plus rapide à analyser pour le
// moteur JS qu'un gros littéral objet équivalent.
const gabarit = (json) => "`" + json.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
const liste = (items) => "[\n" + items.map(x => JSON.stringify(x)).join(",\n") + "\n]";

/** Fichiers .js de leçons (hors index.js) de chaque module. */
function fichiersLecons() {
  const out = [];
  for (const mod of readdirSync(COURS, { withFileTypes: true })) {
    if (!mod.isDirectory()) continue;
    for (const f of readdirSync(join(COURS, mod.name))) {
      if (f.endsWith(".js") && f !== "index.js") out.push(join(COURS, mod.name, f));
    }
  }
  return out.sort();
}

/**
 * Calcule le contenu des fichiers générés (sans rien écrire).
 * @returns {Promise<Record<string, string>>} chemin absolu → contenu
 */
export async function genererFichiers() {
  const { COURSES, QUIZ, EXERCISES } = await import(pathToFileURL(join(CONTENU, "index.js")).href);

  // Leçon (objet) → fichier : même URL de module que celle importée par les
  // index de modules, donc même instance, comparée par identité.
  const fichierDe = new Map();
  for (const f of fichiersLecons()) {
    const ns = await import(pathToFileURL(f).href);
    if (ns.default && typeof ns.default === "object") fichierDe.set(ns.default, f);
  }

  const vus = new Set();
  const corps = [];
  const modules = COURSES.map(({ lessons, ...meta }) => ({
    ...meta,
    lessons: (lessons || []).map(l => {
      if (vus.has(l.id)) throw new Error(`leçon en double : ${l.id}`);
      vus.add(l.id);
      const f = fichierDe.get(l);
      if (!f) throw new Error(`leçon ${l.id} : fichier introuvable sous src/content/cours/ (elle doit être l'export par défaut d'un fichier de leçon)`);
      const rel = "./" + relative(CONTENU, f).split(sep).join("/");
      if (CHAMPS_CORPS.some(c => l[c] !== undefined)) corps.push([l.id, rel]);
      const sansCorps = { ...l };
      for (const c of CHAMPS_CORPS) delete sansCorps[c];
      return sansCorps;
    }),
  }));

  const coursesJson = "[\n" + modules.map(({ lessons, ...meta }) =>
    JSON.stringify(meta).slice(0, -1) + `,"lessons":${liste(lessons)}}`).join(",\n") + "\n]";

  const indexApp = ENTETE("Contenu chargé au démarrage de l'app : modules, métadonnées des leçons\n// (sans leur corps), banque de quiz, exercices. Le corps (cartes) : corps-lecons.js.") + `
export const COURSES = JSON.parse(${gabarit(coursesJson)});

export const QUIZ = JSON.parse(${gabarit(liste(QUIZ))});

export const EXERCISES = JSON.parse(${gabarit(liste(EXERCISES))});
`;

  const corpsLecons = ENTETE("Corps des leçons (cartes), chargés à la demande : un morceau par leçon.") + `
/** id de leçon → () => Promise<module de la leçon> (export par défaut = leçon complète). */
export const CORPS = {
${corps.map(([id, rel]) => `  ${JSON.stringify(id)}: () => import(${JSON.stringify(rel)}),`).join("\n")}
};
`;

  return { [FICHIER_INDEX_APP]: indexApp, [FICHIER_CORPS]: corpsLecons };
}

const normaliser = (s) => s.replace(/\r\n/g, "\n");
const lire = (f) => (existsSync(f) ? normaliser(readFileSync(f, "utf8")) : null);

/** Fichiers générés absents ou différents de ce que donnerait la génération. */
export async function fichiersPerimes() {
  const attendus = await genererFichiers();
  return Object.entries(attendus).filter(([f, txt]) => lire(f) !== txt).map(([f]) => f);
}

async function main() {
  const verifier = process.argv.includes("--verifier");
  const attendus = await genererFichiers();
  const perimes = Object.entries(attendus).filter(([f, txt]) => lire(f) !== txt);
  if (verifier) {
    if (perimes.length) {
      console.error(`✗ Index de l'app périmé : ${perimes.map(([f]) => relative(RACINE, f)).join(", ")}\n  → node scripts/generer-index-app.mjs`);
      process.exit(1);
    }
    console.log("✓ Index de l'app à jour");
    return;
  }
  for (const [f, txt] of perimes) writeFileSync(f, txt);
  console.log(perimes.length
    ? `Index de l'app régénéré : ${perimes.map(([f]) => relative(RACINE, f)).join(", ")}`
    : "Index de l'app déjà à jour");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(e => { console.error("✗ Génération de l'index de l'app :", e.message); process.exit(1); });
}
