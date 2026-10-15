// Groply — fretboard/useLecteurDiagramme.js
// État de lecture des diagrammes de leçon (bouton « écouter » :
// fretboard/LecteurDiagramme.jsx).
//
// Règles communes à tous les diagrammes :
//   • UN SEUL diagramme joue à la fois. Lancer un diagramme arrête celui qui
//     jouait (son ET bouton : le premier repasse en « Écouter ») — d'où le
//     « lecteur courant » au niveau du module.
//   • unlockAudio() est appelé SYNCHRONIQUEMENT dans le gestionnaire d'appui,
//     avant tout await : sans ça, iOS refuse le son au premier appui.
//   • Premier appui : les échantillons se chargent (quelques secondes en 4G).
//     Le bouton l'indique (sablier qui tourne, aria-busy), et un appui pendant
//     le chargement annule la lecture : rien ne part une fois le chargement fini.
//   • Quitter la leçon (démontage) coupe le son du diagramme qui jouait.
//   • Le bouton revient en « Écouter » à la fin du son, même si un autre écran
//     a coupé l'audio entre-temps (minuteur de secours calé sur la durée).
import { useCallback, useEffect, useRef, useState } from "react";
import { unlockAudio, loadAudio, isAudioLoaded, stopAll } from "../audioEngine.js";

/** Lecteur courant : { id, reinitialiser } — un seul pour toute l'application. */
let lecteurCourant = null;
let prochainId = 1;

/** Marge après la dernière note avant de rendre le bouton (queue du son). */
const MARGE_FIN_MS = 450;

/**
 * État de lecture d'un diagramme.
 * @returns {
 *   etat: "repos" | "chargement" | "lecture",
 *   action: clé de l'action en cours (ex. "accord", "arpege", "i7") ou null,
 *   pas: ce que la séquence demande de surligner (step), ou null,
 *   basculer(action, jouer): lance `jouer({ onStep, onDone })` — ou arrête si
 *       cette action joue déjà. `jouer` renvoie la durée du son en ms : le
 *       bouton revient en « Écouter » à ce moment-là.
 *   arreter()
 * }
 */
export function useLecteurDiagramme() {
  const idRef = useRef(0);
  if (!idRef.current) idRef.current = prochainId++;
  const [etat, setEtat] = useState("repos");
  const [action, setAction] = useState(null);
  const [pas, setPas] = useState(null);
  const jeton = useRef(0);          // change à chaque lancement / arrêt : les rappels périmés s'ignorent
  const minuteur = useRef(null);
  const monte = useRef(true);

  const reinitialiser = useCallback(() => {
    jeton.current++;
    clearTimeout(minuteur.current);
    minuteur.current = null;
    if (!monte.current) return;
    setEtat("repos"); setAction(null); setPas(null);
  }, []);

  const arreter = useCallback(() => {
    if (lecteurCourant?.id === idRef.current) {
      lecteurCourant = null;
      stopAll();
    }
    reinitialiser();
  }, [reinitialiser]);

  const basculer = useCallback((cle, jouer) => {
    // Synchrone, dans le geste : condition du son sur iOS.
    const deverrouillage = unlockAudio().catch(() => false);

    if (lecteurCourant?.id === idRef.current && action === cle && etat !== "repos") {
      arreter();
      return;
    }
    // Un autre diagramme (ou une autre action de celui-ci) jouait : on l'arrête.
    if (lecteurCourant) {
      const precedent = lecteurCourant;
      lecteurCourant = null;
      stopAll();
      if (precedent.id !== idRef.current) precedent.reinitialiser();
    }
    clearTimeout(minuteur.current);
    const monJeton = ++jeton.current;
    const valide = () => jeton.current === monJeton && monte.current;
    lecteurCourant = { id: idRef.current, reinitialiser };
    setAction(cle);
    setPas(null);
    setEtat(isAudioLoaded() ? "lecture" : "chargement");

    const terminer = () => {
      if (!valide()) return;
      if (lecteurCourant?.id === idRef.current) lecteurCourant = null;
      reinitialiser();
    };

    (async () => {
      try { await deverrouillage; } catch { /* on tente quand même */ }
      if (!isAudioLoaded()) {
        try { await loadAudio(); } catch { if (valide()) terminer(); return; }
        if (!valide()) return;   // arrêté pendant le chargement : on ne joue rien
        setEtat("lecture");
      }
      let ms;
      try {
        ms = await jouer({
          onStep: (s) => { if (valide()) setPas(s ?? null); },
          onDone: () => { if (valide()) setPas(null); },
        });
      } catch { terminer(); return; }
      if (!valide()) return;
      // Fin : sur la durée annoncée par `jouer` (filet de sécurité sinon).
      const duree = Number.isFinite(ms) && ms > 0 ? ms : 30000;
      minuteur.current = setTimeout(terminer, duree + MARGE_FIN_MS);
    })();
  }, [action, etat, arreter, reinitialiser]);

  // Démontage : on coupe le son si c'est nous qui jouions.
  useEffect(() => {
    monte.current = true;
    const id = idRef.current;
    return () => {
      monte.current = false;
      clearTimeout(minuteur.current);
      if (lecteurCourant?.id === id) {
        lecteurCourant = null;
        stopAll();
      }
    };
  }, []);

  return { etat, action, pas, basculer, arreter };
}
