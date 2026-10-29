// Corps des leçons (cartes) chargés à la demande.
//
// Au démarrage, l'app ne charge que les métadonnées des leçons
// (src/content/index-app.js, généré). Le corps d'une leçon vit dans son
// propre petit morceau JS (src/content/corps-lecons.js, généré), chargé à
// l'ouverture de la leçon — puis gardé en mémoire.
//
// Hors-ligne : le service worker (public/sw.js) met en cache tout fichier
// /assets/ récupéré. `prechargerCorpsLecons()` récupère donc tous les corps
// en tâche de fond après le démarrage, pour que toutes les leçons restent
// ouvrables sans réseau.
import { useEffect, useMemo, useState } from "react";
import { CORPS } from "../content/corps-lecons.js";

const CACHE = new Map();      // id → leçon complète (export par défaut)
const EN_COURS = new Map();   // id → Promise

/** La leçon porte-t-elle déjà son corps (contenu importé, rendu de test…) ? */
const aSonCorps = (l) => l.cartes !== undefined || l.content !== undefined;

/** Charge (une fois) le corps de la leçon `id`. Rejette si indisponible. */
export function chargerCorpsLecon(id) {
  if (CACHE.has(id)) return Promise.resolve(CACHE.get(id));
  if (EN_COURS.has(id)) return EN_COURS.get(id);
  const charger = CORPS[id];
  if (!charger) return Promise.reject(new Error(`leçon inconnue : ${id}`));
  const p = charger()
    .then(m => { CACHE.set(id, m.default); return m.default; })
    .finally(() => EN_COURS.delete(id));
  EN_COURS.set(id, p);
  return p;
}

/**
 * Précharge tous les corps, un par un, sans gêner le reste : s'arrête à la
 * première erreur (hors-ligne) — ce qui est déjà en cache le reste.
 */
export async function prechargerCorpsLecons() {
  for (const id of Object.keys(CORPS)) {
    if (CACHE.has(id)) continue;
    try { await chargerCorpsLecon(id); } catch { return; }
  }
}

/**
 * Leçon prête à afficher : métadonnées + corps.
 * @returns {{ statut: "pret"|"chargement"|"erreur", lecon, reessayer?: () => void }}
 */
export function useCorpsLecon(lecon) {
  const id = lecon?.id;
  const aCharger = !!lecon && !aSonCorps(lecon) && !!CORPS[id];
  const [resultat, setResultat] = useState(null);   // { id, essai, erreur? }
  const [essai, setEssai] = useState(0);

  useEffect(() => {
    if (!aCharger || CACHE.has(id)) return;
    let actif = true;
    chargerCorpsLecon(id).then(
      () => { if (actif) setResultat({ id, essai }); },
      (erreur) => { if (actif) setResultat({ id, essai, erreur }); },
    );
    return () => { actif = false; };
  }, [id, aCharger, essai]);

  const corps = aCharger ? CACHE.get(id) : undefined;
  // Les métadonnées passées en prop priment (contenu importé qui en
  // surcharge une partie) ; le corps vient du fichier de la leçon.
  const complete = useMemo(() => (corps ? { ...corps, ...lecon } : lecon), [corps, lecon]);

  if (!aCharger || corps) return { statut: "pret", lecon: complete };
  if (resultat?.id === id && resultat.essai === essai && resultat.erreur) {
    return { statut: "erreur", lecon, reessayer: () => setEssai(e => e + 1) };
  }
  return { statut: "chargement", lecon };
}
