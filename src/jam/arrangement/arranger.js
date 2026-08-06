// Groply — jam/arrangement/arranger.js
// LA couche qui transforme un playback en partenaire de jeu.
//
// Deux responsabilités distinctes :
//   PLANNER  — la forme longue. Pense en minutes. Un vrai groupe ne joue pas
//              20 minutes à intensité constante : il installe, il construit,
//              il retombe, il relance.
//   DIRECTOR — les décisions de phrase. Pense en 4/8 mesures : quel motif,
//              où placer un fill, quand changer de texture.
//
// JavaScript pur, aucun audio : entièrement testable en Node.

// ─────────────────────────────────────────────────────────────────────────
// PLANNER
// ─────────────────────────────────────────────────────────────────────────

// L'énergie de chaque section est définie en ÉCART par rapport au niveau
// choisi par l'utilisateur, jamais en cumul.
//
// Une marche aléatoire cumulative (chaque section ajoutant ou retirant à la
// précédente) dérive et ne revient jamais : après une intro à énergie
// réduite, la session resterait basse indéfiniment. Un vrai groupe revient
// toujours vers son intensité de référence — c'est ce que ce modèle traduit.
const SECTION_TEMPLATES = [
  { role: "groove", bars: 32, offset:  0, weight: 3 },
  { role: "groove", bars: 16, offset:  0, weight: 2 },
  { role: "build",  bars:  8, offset: +1, weight: 2 },
  { role: "peak",   bars: 16, offset: +2, weight: 2 },
  { role: "drop",   bars:  8, offset: -1, weight: 1 },
];

export function createPlanner({ baseEnergy = 3, seedRole = "intro" } = {}) {
  let sections = [];
  let barCursor = 0;
  let lastRole = seedRole;
  let base = Math.max(1, Math.min(5, baseEnergy));

  /** Ajoute une section au plan. */
  function push(role, bars, energy) {
    const clamped = Math.max(1, Math.min(5, Math.round(energy)));
    sections.push({ role, startBar: barCursor, bars, energy: clamped });
    barCursor += bars;
    lastRole = role;
    return sections[sections.length - 1];
  }

  // Intro : on ne démarre jamais à pleine puissance.
  push("intro", 4, Math.max(1, base - 2));

  return {
    get sections() { return sections; },
    get plannedBars() { return barCursor; },

    /**
     * Étend le plan jusqu'à couvrir `untilBar`.
     * Génération par blocs glissants : le plan reste toujours en avance
     * d'environ une minute, jamais plus — au-delà, on ne pourrait plus
     * réagir si l'utilisateur change l'énergie.
     */
    ensurePlannedUpTo(untilBar) {
      let guard = 0;
      while (barCursor < untilBar && guard++ < 80) {
        // On évite d'enchaîner deux fois le même rôle : c'est exactement ce
        // qui produit la sensation de boucle.
        const candidates = SECTION_TEMPLATES.filter(t => t.role !== lastRole);
        const total = candidates.reduce((s, t) => s + t.weight, 0);
        let r = Math.random() * total;
        let chosen = candidates[candidates.length - 1];
        for (const t of candidates) { r -= t.weight; if (r <= 0) { chosen = t; break; } }
        // Écart par rapport à la référence, jamais cumul depuis la section
        // précédente : l'intensité orbite autour du niveau voulu.
        push(chosen.role, chosen.bars, base + chosen.offset);
      }
    },

    sectionAt(bar) {
      for (const s of sections) {
        if (bar >= s.startBar && bar < s.startBar + s.bars) return s;
      }
      return sections[sections.length - 1];
    },

    /**
     * Décalage manuel de l'énergie (contrôles vivants).
     * Déplace la RÉFÉRENCE : tout l'arrangement à venir suit, pas seulement
     * la section en cours.
     */
    nudgeEnergy(delta, fromBar) {
      base = Math.max(1, Math.min(5, base + delta));
      // On tronque le plan à venir : l'utilisateur doit sentir l'effet dans
      // les 2 mesures, pas dans 30.
      sections = sections.filter(s => s.startBar + s.bars <= fromBar + 2);
      barCursor = sections.length
        ? sections[sections.length - 1].startBar + sections[sections.length - 1].bars
        : fromBar;
      lastRole = "drop";   // autorise un groove juste après
      push("groove", 16, base);
      return base;
    },

    get baseEnergy() { return base; },

    reset() { sections = []; barCursor = 0; base = Math.max(1, Math.min(5, baseEnergy)); lastRole = seedRole; },
  };
}

// ─────────────────────────────────────────────────────────────────────────
// DIRECTOR
// ─────────────────────────────────────────────────────────────────────────

/**
 * Tirage pondéré.
 * Le piège du "moteur vivant" est de tomber dans l'aléatoire pur : un
 * batteur qui change de motif à chaque mesure ne sonne pas vivant, il sonne
 * incohérent. On tire donc dans un vocabulaire contraint, avec des poids,
 * et surtout avec de la MÉMOIRE.
 */
function weightedPick(items, exclude = null) {
  const pool = items.filter(i => i.id !== exclude);
  const list = pool.length ? pool : items;
  const total = list.reduce((s, i) => s + (i.weight ?? 1), 0);
  let r = Math.random() * total;
  for (const i of list) {
    r -= (i.weight ?? 1);
    if (r <= 0) return i;
  }
  return list[list.length - 1];
}

export function createDirector(pack, { phraseBars = 4 } = {}) {
  let lastPatternId = null;
  let lastFillId    = null;
  let lastFillBar   = -99;
  let forceChange   = false;

  return {
    /** Bouton « Change » : renouvelle le vocabulaire immédiatement. */
    requestChange() { forceChange = true; },

    /**
     * Décide de tout ce qui concerne UNE mesure.
     * @returns { patternId, fill, crash, useRide, ghostNotes, openHats }
     */
    decideBar(barIndex, section, energy) {
      const barInPhrase  = barIndex % phraseBars;
      const isPhraseEnd  = barInPhrase === phraseBars - 1;
      const isSectionTop = barIndex === section.startBar;

      // ── Motif de base ────────────────────────────────────────────────
      const available = (pack.drumPatterns || []).filter(p => (p.minEnergy ?? 1) <= energy);
      let patternId = lastPatternId;
      const mustChange = forceChange || isSectionTop || patternId === null ||
                         !available.some(p => p.id === patternId);
      if (mustChange && available.length) {
        // On exclut le motif courant seulement si un autre est disponible,
        // pour ne pas se retrouver bloqué sur un pack minimal.
        patternId = weightedPick(available, available.length > 1 ? lastPatternId : null).id;
        lastPatternId = patternId;
        forceChange = false;
      }

      // ── Fill ─────────────────────────────────────────────────────────
      // Règles non négociables pour rester musical :
      //   - uniquement en fin de phrase ;
      //   - jamais deux mesures consécutives ;
      //   - jamais deux fois le même d'affilée.
      let fill = null;
      const fillsOk = (pack.fills || []).filter(f => (f.minEnergy ?? 1) <= energy);
      if (isPhraseEnd && fillsOk.length && barIndex - lastFillBar >= 2) {
        // Plus d'énergie = fills plus fréquents, mais jamais systématiques :
        // un fill à chaque phrase devient lui-même une boucle.
        const probability = 0.18 + energy * 0.11;
        if (Math.random() < probability) {
          fill = weightedPick(fillsOk, fillsOk.length > 1 ? lastFillId : null);
          lastFillId  = fill.id;
          lastFillBar = barIndex;
        }
      }

      return {
        patternId,
        fill,
        // Crash uniquement en tête de section : c'est ce qui marque la forme.
        crash:      isSectionTop && section.role !== "intro" && energy >= 2,
        useRide:    energy >= 4,
        ghostNotes: energy >= 3,
        openHats:   energy >= 4,
        isPhraseEnd,
        phasePos:   barInPhrase / phraseBars,
      };
    },

    reset() { lastPatternId = null; lastFillId = null; lastFillBar = -99; forceChange = false; },
  };
}
