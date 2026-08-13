#!/usr/bin/env node
// Groply — scripts/verifier-imports.mjs
//
// Vérifie que chaque import nommé existe bien dans son module cible. C'est ce
// contrôle qui aurait attrapé le build Vercel cassé
// ("listSampleUrls is not exported by src/audioEngine.js") AVANT le push.
//
// Note Windows : on passe par `fileURLToPath` et non par `url.pathname`.
// `.pathname` renvoie "/C:/Users/Tiago%20BRITO/..." — préfixe "/" parasite et
// espaces encodés en %20 — ce qui donnait un chemin "C:\C:\Users\Tiago%20BRITO"
// introuvable. Le piège classique des scripts Node écrits sous Linux.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = resolve(ICI, "..", "src");

if (!existsSync(RACINE)) {
  console.error(`Dossier source introuvable : ${RACINE}`);
  console.error("Lance ce script depuis la racine du projet (npm run verify).");
  process.exit(1);
}

// ── Inventaire des fichiers source ────────────────────────────────────────
const fichiers = [];
(function parcourir(d) {
  for (const e of readdirSync(d)) {
    if (e === "node_modules" || e.startsWith(".")) continue;
    const p = join(d, e);
    if (statSync(p).isDirectory()) parcourir(p);
    else if (/\.(js|jsx)$/.test(e)) fichiers.push(p);
  }
})(RACINE);

// Commentaires retirés avant analyse : sans ça, un exemple d'import écrit
// dans un commentaire est signalé comme cassé.
const sansCommentaires = (t) => t
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .split("\n").map(l => l.replace(/(^|\s)\/\/.*$/, "")).join("\n");

// ── Ce que chaque module exporte ──────────────────────────────────────────
const exportsDe = new Map();
for (const f of fichiers) {
  const src = sansCommentaires(readFileSync(f, "utf8"));
  const noms = new Set();
  for (const m of src.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|var|class)\s+(\w+)/gm)) noms.add(m[1]);
  for (const m of src.matchAll(/^export\s*\{([^}]+)\}/gm))
    for (const part of m[1].split(",")) {
      const t = part.trim().split(/\s+as\s+/);
      const nom = (t[1] || t[0]).trim();
      if (nom) noms.add(nom);
    }
  if (/^export\s+default/m.test(src)) noms.add("default");
  if (/^export\s+\*/m.test(src)) noms.add("*");
  exportsDe.set(f, noms);
}

// ── Résolution d'un chemin d'import vers un fichier réel ──────────────────
const resoudre = (depuis, spec) => {
  const base = resolve(dirname(depuis), spec);
  for (const candidat of [base, base + ".js", base + ".jsx", join(base, "index.js"), join(base, "index.jsx")]) {
    if (exportsDe.has(candidat)) return candidat;
  }
  return null;
};

// ── Contrôle ──────────────────────────────────────────────────────────────
let erreurs = 0;
for (const f of fichiers) {
  const src = sansCommentaires(readFileSync(f, "utf8"));
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["'](\.[^"']+)["']/g)) {
    const cible = resoudre(f, m[2]);
    if (!cible) continue;                       // module hors périmètre (json, css…)
    const dispo = exportsDe.get(cible);
    if (dispo.has("*")) continue;               // ré-export global : indécidable ici
    for (const part of m[1].split(",")) {
      const nom = part.trim().split(/\s+as\s+/)[0].trim();
      if (!nom) continue;
      if (!dispo.has(nom)) {
        erreurs++;
        const rel = "src" + sep + relative(RACINE, f);
        console.log(`  ✗ ${rel} importe « ${nom} » — absent de ${m[2]}`);
      }
    }
  }
}

console.log(erreurs === 0
  ? `  ✓ ${fichiers.length} fichiers vérifiés, tous les imports nommés existent.`
  : `\n  ${erreurs} import(s) cassé(s) — le build échouera.`);
process.exit(erreurs === 0 ? 0 : 1);
