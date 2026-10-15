// ═══════════════════════════════════════════════════════════════════════════
// Groply — store/synchro.js
// Sauvegarde cloud sans écrasement entre appareils. Logique pure : l'accès à
// Supabase est passé en paramètre, pour pouvoir la tester sans réseau.
//
// ── Le problème ───────────────────────────────────────────────────────────
// Chaque sauvegarde écrivait TOUTE la progression d'un coup (« le dernier
// qui écrit gagne »), et la fusion des deux appareils n'avait lieu qu'une
// fois, au chargement. Deux appareils ouverts en même temps s'écrasaient
// donc mutuellement ; un appareil resté ouvert plusieurs jours effaçait
// dans le cloud tout ce qui avait été fait ailleurs entre-temps.
//
// ── La règle ──────────────────────────────────────────────────────────────
// `updated_at` sert de jeton de version. On n'écrit QUE si la ligne cloud
// est encore celle qu'on a lue (UPDATE … WHERE updated_at = jeton). Sinon,
// quelqu'un a écrit entre-temps : on relit, on fusionne (mergeStates), et on
// réessaie avec le nouveau jeton. Rien n'est perdu d'un côté ni de l'autre.
// ═══════════════════════════════════════════════════════════════════════════

export const ESSAIS_MAX = 3;

/**
 * @param etat       progression à écrire
 * @param jeton      `updated_at` de la dernière version cloud connue (null si aucune ligne)
 * @param ecrire     (etat, jeton) → { statut: "ok", jeton } | { statut: "conflit" } | { statut: "erreur", erreur }
 * @param lire       () → { statut: "trouve", progression } | { statut: "absent" } | { statut: "erreur", erreur }
 * @param fusionner  (progressionCloud) → état fusionné (l'appelant met aussi son état à jour)
 * @returns { ok: true, jeton, etat } ou { ok: false, raison, erreur? }
 */
export async function sauvegarderSansEcraser({ etat, jeton, ecrire, lire, fusionner, essais = ESSAIS_MAX }) {
  let courant = etat;
  let version = jeton ?? null;
  for (let i = 0; i < essais; i++) {
    const r = await ecrire(courant, version);
    if (r.statut === "ok") return { ok: true, jeton: r.jeton, etat: courant };
    if (r.statut === "erreur") return { ok: false, raison: "erreur", erreur: r.erreur };

    // Conflit : la ligne a changé depuis notre dernière lecture.
    const cloud = await lire();
    if (cloud.statut === "erreur") return { ok: false, raison: "erreur", erreur: cloud.erreur };
    if (cloud.statut === "trouve") {
      courant = fusionner(cloud.progression);
      version = cloud.progression.cloudUpdatedAt || null;
    } else {
      version = null;   // ligne supprimée entre-temps : on la recrée
    }
  }
  return { ok: false, raison: "conflits" };
}

/** Sépare les colonnes de la table `progress` du reste de l'état. */
export function versLigne(userId, state) {
  // `cloudUpdatedAt` est une métadonnée de lecture, elle n'a rien à faire
  // dans la colonne `data`.
  const { xp, level, streak, cloudUpdatedAt: _jeton, ...data } = state;
  return { user_id: userId, xp, level, streak, data };
}

/**
 * File d'attente : une seule opération cloud à la fois. Sans elle, deux
 * sauvegardes parties à 3 s d'écart pouvaient arriver dans le désordre, et
 * une relecture pouvait remplacer le jeton par une version plus ancienne
 * que celle qu'une sauvegarde venait d'écrire.
 */
export function creerFile() {
  let queue = Promise.resolve();
  return (tache) => {
    const resultat = queue.then(tache, tache);
    queue = resultat.catch(() => {});
    return resultat;
  };
}
