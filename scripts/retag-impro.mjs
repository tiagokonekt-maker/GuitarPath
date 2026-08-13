#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// Groply — scripts/retag-impro.mjs
//
// Corrige le point §7.3 de l'audit : les 15 questions `q-impro-*` de
// content.js portent `courseId: "harmony"` ou `"scales"`. Conséquence, la
// répartition réelle était :
//
//     neck: 31 · scales: 43 · harmony: 50 · rhythm: 18 · impro: 0
//
// Donc, en chaîne :
//   • placementEngine excluait l'impro du test (aucune question disponible),
//     son niveau était INFÉRÉ par moyenne ;
//   • le badge `skill_impro` ne pouvait se calculer que sur 6 exercices ;
//   • l'écran Progrès affichait une maîtrise « Impro » ne reposant sur
//     aucune évaluation d'impro.
//
// L'improvisation est l'objectif n°1 du produit. C'était le seul module non
// mesuré.
//
// Usage :
//     node scripts/retag-impro.mjs            # aperçu, n'écrit rien
//     node scripts/retag-impro.mjs --write    # applique, avec sauvegarde .bak
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CIBLE = new URL("../src/content.js", import.meta.url);
const ECRIRE = process.argv.includes("--write");

if (!existsSync(CIBLE)) {
  // fileURLToPath et non .pathname : sous Windows, .pathname renvoie
  // "/C:/Users/Tiago%20BRITO/..." — inutilisable tel quel.
  console.error("content.js introuvable :", fileURLToPath(CIBLE));
  process.exit(1);
}

const source = readFileSync(CIBLE, "utf8");

// On ne touche QUE le champ courseId des objets dont l'id commence par
// "q-impro-". Une réécriture globale par expression régulière sur tout le
// fichier risquerait de renommer des occurrences sans rapport ; ici le motif
// est ancré sur l'identifiant lui-même.
const MOTIF = /(\{\s*id:\s*"q-impro-\d+"\s*,\s*courseId:\s*")([a-z]+)(")/g;

const modifs = [];
const resultat = source.replace(MOTIF, (tout, avant, ancien, apres) => {
  if (ancien === "impro") return tout;   // déjà correct, idempotent
  const id = avant.match(/q-impro-\d+/)[0];
  modifs.push({ id, ancien });
  return `${avant}impro${apres}`;
});

// Contrôle : on compte les questions q-impro-* réellement présentes, pour
// détecter le cas où le format du fichier aurait changé et où la regex ne
// matcherait plus rien alors qu'il y a du travail à faire.
const total = (source.match(/id:\s*"q-impro-\d+"/g) || []).length;

console.log(`Questions q-impro-* trouvées : ${total}`);
console.log(`À retaguer vers courseId "impro" : ${modifs.length}`);
for (const m of modifs) console.log(`  ${m.id}  ${m.ancien} → impro`);

if (total > 0 && modifs.length === 0) {
  console.log("\nRien à faire : elles sont déjà taguées impro.");
}
if (total > 0 && modifs.length < total) {
  console.warn(
    `\nATTENTION : ${total - modifs.length} question(s) q-impro-* n'ont pas été ` +
    `reconnues par le motif. Vérifie leur format (l'ordre des clés id/courseId ` +
    `doit être respecté) et corrige-les à la main.`
  );
}

if (!ECRIRE) {
  console.log("\nAperçu seulement. Relance avec --write pour appliquer.");
  process.exit(0);
}

if (modifs.length === 0) process.exit(0);

copyFileSync(CIBLE, new URL("../src/content.js.bak", import.meta.url));
writeFileSync(CIBLE, resultat, "utf8");
console.log(`\nÉcrit. Sauvegarde : src/content.js.bak`);
console.log(
  "\nÉtape suivante : vérifie que chaque palier de difficulté (lvl 1, 2, 3) a\n" +
  "au moins une question impro, sinon placementEngine.availableModules()\n" +
  "écartera quand même le module. Lance :  node scripts/verifier-contenu.mjs"
);
