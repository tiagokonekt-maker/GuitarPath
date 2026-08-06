// Groply — jam/generators/drums.js
// Produit des ÉVÈNEMENTS MUSICAUX abstraits. Ne sait rien de l'audio :
// c'est le renderer qui traduira en échantillons. Cette séparation rend
// tout ce fichier testable en Node.

import { parseGrid, stepPosition, swingRatio, humanize } from "../music/groove.js";

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
  const swing = swingRatio(pack.feel?.swing ?? 0, bpm);

  const pattern = (pack.drumPatterns || []).find(p => p.id === decision.patternId)
               || (pack.drumPatterns || [])[0];
  if (!pattern) return [];

  const events = [];

  // ── Voix du motif de base ─────────────────────────────────────────────
  for (const [instrument, grid] of Object.entries(pattern.grid || {})) {
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

      const frac = stepPosition(hit.step, hit.stepsPerBar, swing, beatsPerBar);
      events.push({
        instrument: hit.open ? (inst === "hihat" ? "hihatOpen" : inst) : inst,
        time: barStartTime + frac * barDuration,
        velocity: hit.velocity,
        open: hit.open,
      });
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
        const frac = hit.step / hit.stepsPerBar;
        if (frac < fillStart) continue;
        events.push({
          instrument,
          time: barStartTime + frac * barDuration,
          velocity: hit.velocity,
          open: false,
        });
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
