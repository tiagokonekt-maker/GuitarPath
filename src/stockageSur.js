// Groply — stockageSur.js
// Importé EN PREMIER par main.jsx, avant tout autre module.
//
// Safari refuse l'accès au stockage dans certains réglages (« Bloquer tous
// les cookies », certains modes privés ou profils gérés) : lire
// `window.localStorage` ou `window.sessionStorage` lève alors une
// SecurityError. Le client Supabase lit `sessionStorage` dès sa création, au
// chargement du module : l'erreur partait avant le démarrage de React, et
// l'app restait sur une page blanche, sans même l'écran d'erreur.
//
// Ici, si le stockage est inaccessible, on le remplace par un stockage en
// mémoire : l'app fonctionne, la progression reste synchronisée avec le
// compte, seule la session locale est perdue à la fermeture de l'onglet.

function stockageEnMemoire() {
  const donnees = new Map();
  return {
    get length() { return donnees.size; },
    key: (i) => [...donnees.keys()][i] ?? null,
    getItem: (k) => (donnees.has(String(k)) ? donnees.get(String(k)) : null),
    setItem: (k, v) => { donnees.set(String(k), String(v)); },
    removeItem: (k) => { donnees.delete(String(k)); },
    clear: () => { donnees.clear(); },
  };
}

function utilisable(nom) {
  try {
    const s = window[nom];
    if (!s) return false;
    const cle = "__groply_test__";
    s.setItem(cle, "1");
    s.removeItem(cle);
    return true;
  } catch {
    return false;
  }
}

export const stockageRemplace = [];

if (typeof window !== "undefined") {
  for (const nom of ["localStorage", "sessionStorage"]) {
    if (utilisable(nom)) continue;
    // Accès refusé : stockage en mémoire. (Un quota plein laisse lire : il
    // est déjà géré par les try/catch autour des écritures, on n'y touche pas.)
    let lisible = false;
    try { lisible = !!window[nom]; } catch { /* accès refusé */ }
    if (lisible) continue;
    try {
      Object.defineProperty(window, nom, { value: stockageEnMemoire(), configurable: true, writable: true });
      stockageRemplace.push(nom);
    } catch { /* propriété non redéfinissable : on ne peut rien de plus */ }
  }
  if (stockageRemplace.length) {
    console.warn(`Groply — stockage du navigateur bloqué (${stockageRemplace.join(", ")}) : données gardées en mémoire pour cette session.`);
  }
}
