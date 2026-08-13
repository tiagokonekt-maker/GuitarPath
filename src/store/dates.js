// Groply — store/dates.js
// Source de vérité UNIQUE pour toutes les dates de l'app.
//
// ── Pourquoi ce fichier existe ────────────────────────────────────────────
// L'ancienne implémentation faisait partout :
//     new Date().toISOString().split("T")[0]
// `toISOString()` renvoie de l'UTC. En France (UTC+1 / UTC+2), toute
// session jouée entre minuit et 01h/02h locale était donc enregistrée sur
// la VEILLE. Conséquences réelles pour un produit basé sur une série
// quotidienne, utilisé par des gens qui jouent le soir :
//   • lundi 23h00 + mardi 01h00  → même date  → la 2e session ne compte pas,
//     la série est perdue alors qu'elle devrait continuer ;
//   • mardi 01h00 + mardi 23h00  → 2 dates    → série gonflée artificiellement ;
//   • le défi du jour se réinitialisait à 02h00 locale au lieu de minuit.
//
// Ici, tout passe par `todayStr()` qui rend la date LOCALE de l'appareil.

/** Date locale au format YYYY-MM-DD (jamais UTC). */
export const dayStr = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const j = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${j}`;
};

/** Aujourd'hui, en local. */
export const todayStr = () => dayStr();

/** La date locale d'il y a n jours. */
export const daysAgoStr = (n, from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return dayStr(d);
};

/** Nombre de jours calendaires entre deux dates YYYY-MM-DD (b - a). */
export const daysBetween = (a, b) => {
  if (!a || !b) return null;
  const pa = a.split("-").map(Number), pb = b.split("-").map(Number);
  if (pa.length !== 3 || pb.length !== 3) return null;
  // Date.UTC sur des composantes déjà locales : on ne veut qu'un écart de
  // jours calendaires, sans que l'heure d'été ne décale le calcul.
  const ta = Date.UTC(pa[0], pa[1] - 1, pa[2]);
  const tb = Date.UTC(pb[0], pb[1] - 1, pb[2]);
  return Math.round((tb - ta) / 86400000);
};

// ── Semaine ISO 8601 ──────────────────────────────────────────────────────
// Lundi = premier jour, semaine 1 = celle qui contient le premier jeudi.
//
// CORRECTIF : le numéro est désormais paddé sur 2 chiffres ("2026-W09").
// L'ancien format non paddé ("2026-W9") était comparé COMME UNE CHAÎNE dans
// mergeStates : "2026-W9" > "2026-W12" est vrai lexicographiquement, donc
// une synchro entre deux appareils écrasait les compteurs de la semaine 12
// par ceux de la semaine 9. Le bug était actif pour les semaines 10 à 53,
// soit ~83 % de l'année.
export const weekStr = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;            // dimanche → 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);    // jeudi de la semaine courante
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

/**
 * Normalise une clé de semaine, paddée ou non, pour pouvoir comparer des
 * données déjà stockées (format historique "2026-W9") avec les nouvelles.
 * À conserver au moins une version majeure, le temps que tous les états
 * en circulation soient réécrits.
 */
export const normalizeWeek = (w) => {
  if (!w || typeof w !== "string") return "";
  const m = w.match(/^(\d{4})-W(\d{1,2})$/);
  return m ? `${m[1]}-W${m[2].padStart(2, "0")}` : w;
};

/** Compare deux clés de semaine (-1, 0, 1), tolérant l'ancien format. */
export const compareWeeks = (a, b) => {
  const na = normalizeWeek(a), nb = normalizeWeek(b);
  return na < nb ? -1 : na > nb ? 1 : 0;
};
