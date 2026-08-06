// Groply — jam/music/compRhythm.js
// Rythme de l'accompagnement.
//
// L'accompagnement plaquait jusqu'ici UN accord tenu sur la mesure entière
// ("1m"). C'est ce qui reste de plus "amateur" dans le rendu : un vrai
// accompagnateur ne tient pas un accord quatre temps durant, il place des
// accents, il laisse du silence, et surtout il ANTICIPE — il joue le
// changement d'accord une croche AVANT la mesure suivante.
//
// C'est aussi ce qui rend un playback jouable : le soliste a besoin de
// repères rythmiques auxquels s'accrocher. Un bourdon continu n'en donne
// aucun.
//
// JavaScript pur, testable en Node.

/**
 * Vocabulaire rythmique, en temps fractionnaires (0 = temps 1).
 * `anticipate: true` signifie que l'accord joué est celui de la mesure
 * SUIVANTE — l'anticipation est le geste le plus caractéristique du
 * comping jazz et funk.
 */
const COMP_PATTERNS = {
  jazz: [
    { id: "charleston", weight: 0.28, hits: [
      { beat: 0,   dur: "8n",  vel: 0.72 },
      { beat: 1.5, dur: "4n",  vel: 0.62 },
    ]},
    { id: "anticipe", weight: 0.24, hits: [
      { beat: 0,   dur: "4n",  vel: 0.70 },
      { beat: 2,   dur: "8n",  vel: 0.58 },
      { beat: 3.5, dur: "8n",  vel: 0.66, anticipate: true },
    ]},
    { id: "sparse", weight: 0.20, hits: [
      { beat: 1,   dur: "4n",  vel: 0.60 },
      { beat: 3,   dur: "4n",  vel: 0.64 },
    ]},
    { id: "deuxquatre", weight: 0.16, hits: [
      { beat: 1,   dur: "8n",  vel: 0.66 },
      { beat: 2.5, dur: "8n",  vel: 0.55 },
      { beat: 3,   dur: "4n",  vel: 0.62 },
    ]},
    { id: "respire", weight: 0.12, hits: [
      { beat: 0,   dur: "2n",  vel: 0.66 },
    ]},
  ],
  blues: [
    { id: "shuffle-stab", weight: 0.30, hits: [
      { beat: 0,   dur: "8n", vel: 0.70 },
      { beat: 1,   dur: "8n", vel: 0.58 },
      { beat: 2,   dur: "8n", vel: 0.66 },
      { beat: 3,   dur: "8n", vel: 0.58 },
    ]},
    { id: "backbeat", weight: 0.26, hits: [
      { beat: 1,   dur: "4n", vel: 0.70 },
      { beat: 3,   dur: "4n", vel: 0.70 },
    ]},
    { id: "charleston", weight: 0.22, hits: [
      { beat: 0,   dur: "8n", vel: 0.72 },
      { beat: 1.5, dur: "4n", vel: 0.60 },
    ]},
    { id: "anticipe", weight: 0.14, hits: [
      { beat: 0,   dur: "4n", vel: 0.68 },
      { beat: 2,   dur: "8n", vel: 0.56 },
      { beat: 3.5, dur: "8n", vel: 0.64, anticipate: true },
    ]},
    { id: "respire", weight: 0.08, hits: [
      { beat: 0,   dur: "2n", vel: 0.64 },
    ]},
  ],
};

/** Tirage pondéré, en évitant si possible de répéter le motif précédent. */
function weightedPick(items, exclude, rng) {
  const pool = items.filter(i => i.id !== exclude);
  const list = pool.length ? pool : items;
  const total = list.reduce((s, i) => s + i.weight, 0);
  let r = rng() * total;
  for (const i of list) { r -= i.weight; if (r <= 0) return i; }
  return list[list.length - 1];
}

/**
 * Crée un accompagnateur avec mémoire.
 * La mémoire est essentielle : sans elle, le tirage aléatoire peut répéter
 * le même motif plusieurs mesures de suite, ce qui s'entend exactement
 * comme la boucle qu'on cherche à éviter.
 */
export function createComper(style = "jazz", rng = Math.random) {
  const vocab = COMP_PATTERNS[style] || COMP_PATTERNS.jazz;
  let lastId = null;
  let barsSinceBreath = 0;

  return {
    /**
     * Rythme d'accompagnement pour une mesure.
     * @param barIndex  index de mesure (les phrases font 4 mesures)
     * @param energy    1..5 — densité
     * @returns [{ beat, dur, velocity, anticipate }]
     */
    nextBar(barIndex, energy = 3) {
      barsSinceBreath++;

      // Toutes les 8 mesures environ, on laisse respirer : une mesure aérée.
      // Sans ces respirations, l'accompagnement sature l'espace et le
      // soliste n'a plus de place — c'est la première cause d'un playback
      // sur lequel on n'a pas envie de jouer. Mais l'excès inverse vide le
      // morceau : une respiration toutes les 2-3 mesures donne un
      // accompagnement absent, pas aéré.
      const forceBreath = barsSinceBreath >= 8;
      let pattern;
      if (forceBreath) {
        pattern = vocab.find(p => p.id === "respire") || vocab[vocab.length - 1];
      } else {
        // On exclut la respiration du tirage aléatoire : elle n'arrive que
        // lorsqu'on la décide, pas par hasard.
        const dense = vocab.filter(p => p.id !== "respire");
        pattern = weightedPick(dense, lastId, rng);
      }
      // Le compteur se remet à zéro dès qu'une respiration est jouée, quelle
      // que soit la façon dont elle a été choisie.
      if (pattern.id === "respire") barsSinceBreath = 0;
      lastId = pattern.id;

      // À basse énergie on allège encore : on retire les frappes faibles.
      const threshold = energy <= 2 ? 0.6 : 0;
      const hits = pattern.hits.filter(h => h.vel >= threshold);

      return hits.map(h => ({
        beat: h.beat,
        dur: h.dur,
        // Dynamique : facteur d'énergie + variation humaine légère.
        velocity: Math.max(0.15, Math.min(1,
          h.vel * (0.72 + energy * 0.07) + (rng() - 0.5) * 0.07
        )),
        anticipate: !!h.anticipate,
      }));
    },

    reset() { lastId = null; barsSinceBreath = 0; },
  };
}

/** Position Tone.js ("0:2:2") depuis un temps fractionnaire. */
export function beatToToneTime(beat) {
  const whole = Math.floor(beat);
  const sixteenths = Math.round((beat - whole) * 4);
  return `0:${whole}:${sixteenths}`;
}
