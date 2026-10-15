// ═══════════════════════════════════════════════════════════════════════════
// Groply — store/compte.js
// Isolation des données locales entre comptes, et interprétation des
// réponses Supabase. Fonctions pures (le stockage est passé en paramètre)
// pour pouvoir les tester sans navigateur.
//
// ── Pourquoi ce module ────────────────────────────────────────────────────
// • Une erreur de chargement de la progression était confondue avec
//   « pas encore de ligne » : l'app considérait alors la progression cloud
//   comme vide, puis l'écrasait par l'état local à la sauvegarde suivante.
// • À la déconnexion, `groply_state`, le repli hors-ligne et la file
//   analytics restaient dans le localStorage : la personne suivante sur le
//   même appareil héritait de la progression de la précédente, qui était
//   ensuite fusionnée puis poussée dans SON compte.
// ═══════════════════════════════════════════════════════════════════════════

/** Propriétaire des données locales (dernier userId connecté sur l'appareil). */
export const OWNER_KEY = "groply_owner";
export const OFFLINE_PREFIX = "groply_offline_state:";
export const ANALYTICS_QUEUE_KEY = "groply_analytics_queue";

/** Clés locales qui appartiennent à un compte, et jamais à l'appareil. */
export const CLES_PERSONNELLES = [
  "groply_state",
  "guitarpath_v4_state",
  "guitarpath_v3_state",
  ANALYTICS_QUEUE_KEY,
];
/** Anciennes clés de repli hors-ligne, non indexées par utilisateur. */
export const CLES_HORS_LIGNE_ANCIENNES = ["groply_offline_state", "guitarpath_offline_state"];

/** Repli hors-ligne propre à un compte. */
export const cleHorsLigne = (userId) => `${OFFLINE_PREFIX}${userId}`;

// ── Chargement de la progression ──────────────────────────────────────────
/**
 * Traduit la réponse de `select … maybeSingle()` en trois cas distincts :
 *   - "erreur" : on ne SAIT PAS ce qu'il y a dans le cloud → ne rien écrire ;
 *   - "absent" : première connexion, aucune ligne → l'état local fait foi ;
 *   - "trouve" : progression à fusionner.
 */
export function interpreterChargementProgression({ data, error } = {}) {
  if (error) return { statut: "erreur", erreur: error };
  if (!data) return { statut: "absent", progression: null };
  return {
    statut: "trouve",
    progression: {
      ...(data.data && typeof data.data === "object" ? data.data : {}),
      xp: data.xp,
      level: data.level,
      streak: data.streak,
      cloudUpdatedAt: data.updated_at || "",
    },
  };
}

/** Délai avant la n-ième nouvelle tentative de chargement (1 s, 2 s, 4 s… 60 s max). */
export const delaiNouvelEssai = (tentative) => Math.min(60_000, 1000 * 2 ** Math.max(0, tentative));

// ── Stockage local par compte ─────────────────────────────────────────────
const lire = (storage, k) => { try { return storage.getItem(k); } catch { return null; } };
const retirer = (storage, k) => { try { storage.removeItem(k); } catch { /* noop */ } };
const ecrire = (storage, k, v) => { try { storage.setItem(k, v); } catch { /* quota */ } };

/** Supprime toutes les données locales liées à un compte (sauf les replis hors-ligne indexés). */
export function purgerDonneesPersonnelles(storage) {
  for (const k of [...CLES_PERSONNELLES, ...CLES_HORS_LIGNE_ANCIENNES, OWNER_KEY]) retirer(storage, k);
}

/**
 * Caches de contenu pédagogique (actuel et ancien nom). Pas des données
 * personnelles — d'où leur absence de la purge de déconnexion, qui évite de
 * retélécharger le contenu — mais effacés lors d'une suppression de compte,
 * qui promet un appareil « propre ».
 */
export const CLES_CONTENU = ["groply_content", "guitarpath_v3_content"];
/** Brouillon de tablature (Boîte à outils) : contenu créé par la personne. */
export const CLE_BROUILLON_TAB = "groply:tab-brouillon";

/**
 * Purge complète après suppression du compte (RGPD art. 17) : données
 * personnelles, repli hors-ligne de CE compte, caches de contenu et
 * brouillon de tablature. Les replis hors-ligne d'autres comptes et les
 * préférences d'appareil (dont `groply_analytics_off` : l'opposition à la
 * mesure d'audience doit survivre) ne sont pas touchés.
 */
export function purgerSuppressionCompte(storage, userId) {
  purgerDonneesPersonnelles(storage);
  if (userId) retirer(storage, cleHorsLigne(userId));
  for (const k of [...CLES_CONTENU, CLE_BROUILLON_TAB]) retirer(storage, k);
}

/**
 * À appeler dès que l'utilisateur connecté est connu. Si les données locales
 * appartiennent à quelqu'un d'autre, elles sont purgées et la fonction
 * renvoie `true` : l'appelant doit alors réinitialiser son état en mémoire.
 *
 * Sans propriétaire enregistré (données antérieures à ce mécanisme), le
 * compte qui se connecte les adopte, anciens replis hors-ligne compris :
 * c'était forcément le seul compte de l'appareil jusqu'ici, sauf déconnexion
 * — et la déconnexion purge désormais tout.
 */
export function preparerStockagePour(userId, storage) {
  if (!userId) return false;
  const proprietaire = lire(storage, OWNER_KEY);
  if (proprietaire === userId) return false;

  if (proprietaire) {
    purgerDonneesPersonnelles(storage);
  } else {
    const ancien = CLES_HORS_LIGNE_ANCIENNES.map(k => lire(storage, k)).find(Boolean);
    if (ancien && !lire(storage, cleHorsLigne(userId))) ecrire(storage, cleHorsLigne(userId), ancien);
    for (const k of CLES_HORS_LIGNE_ANCIENNES) retirer(storage, k);
  }
  ecrire(storage, OWNER_KEY, userId);
  return !!proprietaire;
}

// ── File analytics ────────────────────────────────────────────────────────
/**
 * Un lot rejeté en 4xx (RLS, schéma, JWT d'un autre compte…) le sera
 * indéfiniment : le remettre en file bloquait tous les envois suivants.
 * Seuls 408 et 429 sont des refus temporaires. Le statut 0 correspond à une
 * erreur réseau, qui elle mérite d'être retentée.
 */
export const estRejetDefinitif = (status) =>
  status >= 400 && status < 500 && status !== 408 && status !== 429;

/** Ne garde que les événements du compte courant. */
export const evenementsDe = (file, userId) =>
  (Array.isArray(file) ? file : []).filter(e => e && userId && e.user_id === userId);
