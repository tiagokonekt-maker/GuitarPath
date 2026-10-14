// GuitarPath -- screens/jam/reglages.js
// Constantes partagées par l'écran Jam et ses sous-composants.
export const SEUIL_SESSION = 180;      // 3 min de jeu réel pour compter une session
export const BPM_MIN = 40;
export const BPM_MAX = 200;

export const fmtDuree = (sec) => `${Math.floor(sec / 60)}:${String(Math.max(0, sec) % 60).padStart(2, "0")}`;
