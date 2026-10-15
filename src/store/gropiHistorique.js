// Groply — store/gropiHistorique.js
//
// Historique des conseils de Gropi déjà montrés (state.gropiVus). Isolé de
// gropiTips.js pour que state.js et reducer.js (bundle principal)
// n'embarquent pas tout le catalogue de conseils.

/** Taille max de l'historique des conseils vus (state.gropiVus). */
export const GROPI_VUS_MAX = 150;

/** Ajoute un id à l'historique (déplacé en fin s'il y était), plafonné. */
export function ajouterVu(vus = [], id) {
  return [...vus.filter(x => x !== id), id].slice(-GROPI_VUS_MAX);
}

/** Fusion multi-appareils de l'historique : union, l'ordre local fait foi (le plus récent). */
export function fusionnerVus(local = [], cloud = []) {
  const L = Array.isArray(local) ? local : [], C = Array.isArray(cloud) ? cloud : [];
  const setL = new Set(L);
  return [...new Set([...C.filter(id => !setL.has(id)), ...L])].slice(-GROPI_VUS_MAX);
}
