// GuitarPath -- screens/jam/mixage.js

// ── Mixage ───────────────────────────────────────────────────────────────
// Avant : tous les instruments au centre, sans égalisation ni limiteur. Le
// piano et la basse se disputaient les graves, et les pics pouvaient saturer
// sur un haut-parleur de téléphone. Gestes classiques, volontairement
// mesurés, et regroupés ici pour être ajustés à l'oreille.
export const MIXAGE = {
  pianoPasseHaut: 160,   // Hz — sous ce seuil, le piano laisse la place à la basse
  pianoPan: 0.18,        // −1 gauche … +1 droite — légèrement à droite
  charlestonPan: -0.22,  // légèrement à gauche (basse et grosse caisse restent au centre)
  bassePasseHaut: 45,    // Hz — infra-basses : inaudibles au téléphone, elles font pomper le compresseur
  batterieReverb: 0.14,  // part de la batterie envoyée dans la réverbération : même « pièce » que le piano
  limiteurDb: -1,        // plafond final : aucun pic ne dépasse −1 dB
};
