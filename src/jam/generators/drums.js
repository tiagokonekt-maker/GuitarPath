// Groply — jam/generators/drums.js
// Produit des ÉVÈNEMENTS MUSICAUX abstraits. Ne sait rien de l'audio :
// c'est le renderer qui traduira en échantillons. Cette séparation rend
// tout ce fichier testable en Node.

import { parseGrid, stepPosition, packSwing, humanize } from "../music/groove.js";

/**
 * Voix « virtuelles » d'un pack, jouées avec les échantillons existants
 * (public/audio/drums n'a ni rim-click, ni shaker, ni charleston au pied).
 * Approximation documentée : la même peau ou la même cymbale, frappée
 * nettement moins fort. Le nom d'origine reste dans `articulation`.
 *   rim      → caisse claire très douce (cross-stick, clave de bossa)
 *   shaker   → charleston fermée douce (shaker de bossa)
 *   pedalHat → charleston fermée « au pied » (2 et 4 du jazz) : jamais
 *              remplacée par la ride, contrairement à la charleston jouée.
 */
export const DRUM_ALIASES = {
  rim:      { instrument: "snare", gain: 0.42 },
  shaker:   { instrument: "hihat", gain: 0.5 },
  pedalHat: { instrument: "hihat", gain: 0.62 },
};

/** Évènement d'une frappe, voix virtuelles résolues. */
function frappe(voix, time, velocity, open) {
  const alias = DRUM_ALIASES[voix];
  if (alias) return { instrument: alias.instrument, time, velocity: velocity * alias.gain, open: false, articulation: voix };
  return { instrument: voix, time, velocity, open };
}

/**
 * Génère les évènements d'UNE mesure de batterie.
 *
 * @param pack     le pack de style
 * @param decision sortie du director pour cette mesure
 * @param opts     { barStartTime, secPerBeat, beatsPerBar, bpm, energy }
 * @returns [{ instrument, time, velocity, open }]
 */
export function generateDrumBar(pack, decision, opts) {
  const { barStartTime, secPerBeat, beatsPerBar = 4, bpm, energy = 3 } = opts;
  const barDuration = secPerBeat * beatsPerBar;
  const feel = pack.humanize || {};
  // Swing au niveau de la subdivision du pack : croches pour un pack en
  // croches, doubles-croches pour le funk 16 (les « e » et « a »), aucun
  // pour une grille en triolets qui porte déjà son shuffle.
  const { ratio: swing, stepsPerBeat: swingSteps } = packSwing(pack, bpm, beatsPerBar);

  const pattern = (pack.drumPatterns || []).find(p => p.id === decision.patternId)
               || (pack.drumPatterns || [])[0];
  if (!pattern) return [];

  const events = [];

  // ── Voix du motif de base ─────────────────────────────────────────────
  // Motif sur plusieurs mesures (`bars: 2`, la clave de bossa) : chaque
  // grille est découpée en `bars` tranches égales, jouées tour à tour selon
  // l'index de mesure transmis par le Director.
  const nBars = Math.max(1, Math.floor(pattern.bars ?? 1));
  const tranche = ((decision.barIndex ?? 0) % nBars + nBars) % nBars;
  const grilleDeLaMesure = (g) => {
    if (nBars === 1) return g;
    const len = g.length / nBars;
    return g.slice(tranche * len, (tranche + 1) * len);
  };

  for (const [instrument, gridEntier] of Object.entries(pattern.grid || {})) {
    const grid = grilleDeLaMesure(gridEntier);
    // Les ghost notes ne sortent qu'à partir d'une certaine énergie : c'est
    // ce qui différencie un groove sobre d'un groove qui "parle".
    const allowGhosts = decision.ghostNotes;

    for (const hit of parseGrid(grid)) {
      if (!allowGhosts && hit.velocity < 0.4) continue;

      // La charleston devient ride quand l'énergie monte — changement de
      // texture bien plus efficace qu'une simple hausse de volume.
      let inst = instrument;
      if (instrument === "hihat" && decision.useRide) inst = "ride";
      // Ouvertures de charleston seulement à haute énergie.
      if (hit.open && !decision.openHats) continue;

      const frac = stepPosition(hit.step, hit.stepsPerBar, swing, beatsPerBar, swingSteps);
      events.push(frappe(
        hit.open ? (inst === "hihat" ? "hihatOpen" : inst) : inst,
        barStartTime + frac * barDuration,
        hit.velocity,
        hit.open,
      ));
    }
  }

  // ── Fill de fin de phrase ─────────────────────────────────────────────
  // Le fill REMPLACE la caisse claire et les toms sur la portion concernée,
  // il ne se superpose pas — sinon ça sonne encombré.
  if (decision.fill?.grid) {
    const fillStart = 1 - (decision.fill.beats ?? 2) / beatsPerBar;
    for (let i = events.length - 1; i >= 0; i--) {
      const rel = (events[i].time - barStartTime) / barDuration;
      if (rel >= fillStart && events[i].instrument !== "kick") events.splice(i, 1);
    }
    for (const [instrument, grid] of Object.entries(decision.fill.grid)) {
      for (const hit of parseGrid(grid)) {
        // Même swing que le motif : un fill droit sur un groove swingué
        // sonnerait « à côté ».
        const frac = stepPosition(hit.step, hit.stepsPerBar, swing, beatsPerBar, swingSteps);
        if (frac < fillStart) continue;
        events.push(frappe(instrument, barStartTime + frac * barDuration, hit.velocity, false));
      }
    }
  }

  // ── Crash de début de section ─────────────────────────────────────────
  if (decision.crash) {
    events.push({ instrument: "crash", time: barStartTime, velocity: 0.9, open: false });
  }

  // ── Humanisation ──────────────────────────────────────────────────────
  const humanized = events.map(ev =>
    humanize(ev, feel, decision.phasePos ?? 0, energy)
  );

  // Tri chronologique : le renderer suppose un ordre croissant.
  humanized.sort((a, b) => a.time - b.time);
  return humanized;
}
