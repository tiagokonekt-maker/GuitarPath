// Groply — src/lecon/clic.js
// Clic de métronome des cartes « À toi de jouer ».
//
// audioEngine n'expose pas de métronome, et celui de la boîte à outils
// (toolbox/Metronome.jsx) pilote le Transport global de Tone : le démarrer
// ici entrerait en conflit avec la Jam ou le métronome des Outils. On
// planifie donc nos clics nous-mêmes sur l'horloge audio (Tone.now()), avec
// une petite avance (lookahead), sans toucher au Transport.
//
// Déverrouillage : unlockAudio() (API publique d'audioEngine) fait sa partie
// synchrone dans le geste, puis charge Tone ; l'import dynamique ci-dessous
// renvoie le même module, donc le même AudioContext que tout le reste.
import { unlockAudio } from "../audioEngine.js";

const AVANCE_S = 0.12;     // on planifie les clics qui tombent dans les 120 ms
const PAS_MS = 25;

/**
 * Démarre un clic à `bpm` (premier temps de chaque mesure accentué).
 * `onTemps(numero)` est appelé au moment où chaque temps sonne (0 = temps 1).
 * Renvoie une promesse de fonction d'arrêt (idempotente).
 */
export async function demarrerClic(bpm, { temps = 4, onTemps } = {}) {
  const ok = await unlockAudio();
  if (!ok) return () => {};
  const Tone = await import("tone");

  // Timbre « bois » : bruit très bref dans un passe-bande, comme le
  // métronome des Outils — sec, il perce le son de la guitare sans le masquer.
  const filtre = new Tone.Filter({ type: "bandpass", frequency: 1800, Q: 2.2 }).toDestination();
  const corps = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.0005, decay: 0.028, sustain: 0 } }).connect(filtre);
  corps.volume.value = -6;

  const periode = 60 / bpm;
  let prochain = Tone.now() + 0.08;
  let n = 0;
  let actif = true;
  const minuteurs = new Set();

  const planifier = () => {
    if (!actif) return;
    const maintenant = Tone.now();
    while (prochain < maintenant + AVANCE_S) {
      const b = n % temps;
      const t = prochain;
      try {
        filtre.frequency.setValueAtTime(b === 0 ? 2600 : 1500, t);
        corps.triggerAttackRelease(0.02, t, b === 0 ? 1 : 0.55);
      } catch { /* nœud libéré entre-temps */ }
      if (onTemps) {
        const id = setTimeout(() => { minuteurs.delete(id); if (actif) onTemps(b); }, Math.max(0, (t - maintenant) * 1000));
        minuteurs.add(id);
      }
      n++;
      prochain += periode;
    }
  };
  planifier();
  const boucle = setInterval(planifier, PAS_MS);

  return () => {
    if (!actif) return;
    actif = false;
    clearInterval(boucle);
    minuteurs.forEach(clearTimeout);
    minuteurs.clear();
    // Libération différée : laisse le dernier clic planifié se terminer.
    setTimeout(() => { try { corps.dispose(); filtre.dispose(); } catch { /* noop */ } }, 300);
  };
}
