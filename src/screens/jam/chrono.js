// GuitarPath -- screens/jam/chrono.js
// Temps de jeu réel de la Jam (décompte et pauses exclus), HORS de l'état
// React. Avant, chaque seconde faisait un setState dans JamSession : tout
// l'écran — manche compris — se re-rendait une fois par seconde. Désormais
// seul le lecteur fait avancer le compteur, et seuls les petits composants
// qui l'affichent (abonnés) se re-rendent.
//
// On compte des secondes jouées plutôt qu'un horodatage de départ : le
// temps doit exclure le décompte et les pauses, et c'est le lecteur qui
// sait quand on joue vraiment.
import { useSyncExternalStore } from "react";

export function creerChrono() {
  let secondes = 0;
  const abonnes = new Set();
  return {
    lire: () => secondes,
    abonner: (fn) => { abonnes.add(fn); return () => { abonnes.delete(fn); }; },
    tic: () => { secondes += 1; abonnes.forEach(fn => fn()); },
  };
}

/** Secondes jouées, avec re-rendu du seul composant appelant à chaque tic.
 *  Même lecture côté serveur (rendu smoke) : le chrono y vaut 0. */
export const useSecondesJouees = (chrono) => useSyncExternalStore(chrono.abonner, chrono.lire, chrono.lire);
