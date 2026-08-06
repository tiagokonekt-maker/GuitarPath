// Groply — jam/music/groove.js
// Grilles rythmiques, swing et humanisation. JavaScript pur, aucun audio :
// tout ce fichier est testable en Node.

// ─────────────────────────────────────────────────────────────────────────
// NOTATION DES GRILLES
// Lisible et éditable par un musicien, sans outil :
//   X  accent        x  normal        o  ghost note
//   O  ouvert (charleston)            .  silence
// Une chaîne = une mesure. Sa longueur définit la subdivision.
//   "x...x...x...x..." = 16 pas = doubles-croches
//   "x.x.x.x."         =  8 pas = croches
// ─────────────────────────────────────────────────────────────────────────

const SYMBOL_VELOCITY = {
  "X": 1.00,   // accent
  "x": 0.72,   // normal
  "o": 0.34,   // ghost — essentiel au groove, presque toujours oublié
  "O": 0.85,   // charleston ouverte
};

const OPEN_SYMBOLS = new Set(["O"]);

/**
 * Analyse une grille en évènements positionnés.
 * @returns [{ step, stepsPerBar, velocity, open }]
 */
export function parseGrid(grid) {
  const steps = grid.length;
  const out = [];
  for (let i = 0; i < steps; i++) {
    const sym = grid[i];
    if (sym === "." || sym === " ") continue;
    const vel = SYMBOL_VELOCITY[sym];
    if (vel === undefined) continue;   // symbole inconnu : ignoré, pas d'erreur
    out.push({ step: i, stepsPerBar: steps, velocity: vel, open: OPEN_SYMBOLS.has(sym) });
  }
  return out;
}

/**
 * Ratio de swing effectif.
 *
 * Détail authentique que presque aucun logiciel ne modélise : un musicien
 * swingue DAVANTAGE dans les tempos lents et se redresse dans les tempos
 * rapides. Un ratio fixe sonne mécanique aux extrêmes.
 *
 * @param base 0 = binaire, 1 = ternaire complet
 * @returns position de la croche faible, 0.5 = binaire, 0.667 = ternaire
 */
export function swingRatio(base, bpm) {
  if (base <= 0) return 0.5;
  // Pleine valeur vers 80 BPM, décroît progressivement jusqu'à ~40% vers 200.
  const tempoFactor = Math.max(0.4, Math.min(1, 1 - (bpm - 80) / 240));
  return 0.5 + (base * tempoFactor) * (2 / 3 - 0.5);
}

/**
 * Position temporelle d'un pas, en fraction de mesure (0..1), swing appliqué.
 * Le swing ne concerne que les pas IMPAIRS du niveau croche.
 */
export function stepPosition(step, stepsPerBar, swing, beatsPerBar = 4) {
  const stepsPerBeat = stepsPerBar / beatsPerBar;
  const beat = Math.floor(step / stepsPerBeat);
  const within = step % stepsPerBeat;
  let frac = within / stepsPerBeat;

  // Swing sur la deuxième croche de chaque temps.
  if (stepsPerBeat >= 2) {
    const halfway = stepsPerBeat / 2;
    if (within === halfway) frac = swing;
  }
  return (beat + frac) / beatsPerBar;
}

// ─────────────────────────────────────────────────────────────────────────
// HUMANISATION
// Peu de code, énormément d'effet perçu. C'est ce qui sépare une machine
// d'un musicien.
// ─────────────────────────────────────────────────────────────────────────

/** Tirage gaussien (Box-Muller), borné pour éviter les valeurs aberrantes. */
export function gaussian(sigma = 1, clamp = 2.5) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return Math.max(-clamp, Math.min(clamp, z)) * sigma;
}

/**
 * Applique le feel humain à un évènement.
 *
 * @param ev        { time, velocity, instrument }
 * @param feel      { offsets:{kick,snare,hihat...}, jitterMs, velSigma }
 * @param phasePos  position dans la phrase (0..1) — pour la respiration
 * @param energy    1..5
 */
export function humanize(ev, feel, phasePos = 0, energy = 3) {
  const offsets = feel.offsets || {};
  // Décalage systématique par instrument : la grosse caisse légèrement en
  // avance, la caisse claire légèrement en retard. C'est la signature
  // rythmique d'un style (le jazz "laid back", le funk "on top").
  const offsetMs = offsets[ev.instrument] ?? 0;
  // Gigue aléatoire : aucun humain ne frappe deux fois exactement au même
  // endroit de la grille.
  const jitterMs = gaussian((feel.jitterMs ?? 6) / 2);

  // Respiration de phrase : léger crescendo, retombée à la phrase suivante.
  const breath = 1 + Math.sin(phasePos * Math.PI) * 0.06;
  // Facteur d'énergie global.
  const energyGain = 0.62 + (energy - 1) * 0.095;
  const velJitter = gaussian(feel.velSigma ?? 0.055);

  return {
    ...ev,
    time: ev.time + (offsetMs + jitterMs) / 1000,
    velocity: Math.max(0.05, Math.min(1, ev.velocity * energyGain * breath + velJitter)),
  };
}
