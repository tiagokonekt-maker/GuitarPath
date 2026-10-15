// Groply — jam/styles.js
// Ce que JamSession doit savoir d'un style, en JavaScript pur (testable en
// Node) : quel pack le joue, quelle basse, quel accompagnement, quelle
// ambiance. Les packs JSON sont importés par JamSession (Vite) ; ici on ne
// manipule que leurs identifiants et leurs champs.

/** Style de la Jam (harmonie.js → getStyle) → identifiant du pack. */
export const PACK_ID_PAR_STYLE = {
  blues:   "blues-shuffle",
  blues12: "blues-shuffle",
  funk:    "funk-16",
  rock:    "rock-8",
  jazz:    "jazz-swing",
  bossa:   "bossa-nova",
  ballade: "ballade-pop",
};

/** Pack du style, parmi une liste de packs chargés (ou null). */
export function packPourStyle(style, packs) {
  const id = PACK_ID_PAR_STYLE[style];
  return (packs || []).find(p => p.id === id) || null;
}

/**
 * Basse du pack (champ `bassStyle`). Sans pack ou sans champ : walking bass,
 * blues ou jazz selon le style — le comportement d'avant les packs.
 */
export function bassStylePour(pack, style) {
  if (pack?.bassStyle?.approach) return { ghostNotes: true, octaveJumps: 0, ...pack.bassStyle };
  return { approach: style === "blues" || style === "blues12" ? "shuffleWalk" : "walking", ghostNotes: true, octaveJumps: 0 };
}

/**
 * Accompagnement du pack (champ `compStyle`) : vocabulaire rythmique
 * (compRhythm.js), disposition des accords (harmonie.js getVoicedChord) et
 * plancher du registre. Sans pack : comping jazz ou blues, sans fondamentale.
 */
export function compStylePour(pack, style) {
  const cs = pack?.compStyle || {};
  const bluesy = style === "blues" || style === "blues12";
  return {
    rhythm:  cs.rhythm || (bluesy ? "shuffleChank" : "jazzComp"),
    voicing: cs.voicing || "rootless",
    floor:   Array.isArray(cs.register) ? cs.register[0] : 52,
    // Léger étalement des notes (en ms) : un accord gratté, pas plaqué.
    strumMs: cs.strumMs ?? (cs.voicing === "power" || cs.voicing === "triad" ? 9 : 0),
  };
}

/**
 * Ambiance (réverbération, écho, volume du piano) par style. Le jazz et la
 * ballade respirent dans une pièce plus grande ; le rock reste sec.
 */
const AMBIANCES = {
  jazz:    { decay: 2.5, wet: 0.18, delay: true,  pianoDb: -22 },
  ballade: { decay: 3.0, wet: 0.22, delay: true,  pianoDb: -19 },
  bossa:   { decay: 2.2, wet: 0.16, delay: false, pianoDb: -22 },
  rock:    { decay: 1.6, wet: 0.10, delay: false, pianoDb: -25 },
};
const AMBIANCE_DEFAUT = { decay: 1.8, wet: 0.12, delay: false, pianoDb: -25 };
export const ambiancePour = (style) => AMBIANCES[style] || AMBIANCE_DEFAUT;
