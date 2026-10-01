// Groply — tab/tabSon.js
// Planification du RENDU SONORE d'une tablature. Pur calcul, sans audio :
// ce module décide quand chaque corde sonne, s'arrête, avec quelle force, et
// comment sa hauteur évolue. audioEngine.playTab ne fait que traduire ce plan
// en appels Tone.js — ce qui permet de TOUT vérifier par des tests, sans
// avoir à écouter.
//
// ── Le modèle : une voix par note attaquée, une corde = une voix à la fois ──
// Sur une vraie guitare :
//   • une note continue de sonner jusqu'à ce que la MÊME corde rejoue (ou
//     qu'elle s'éteigne d'elle-même) — elle n'est pas coupée au bout d'une
//     double-croche, ce qui donnait un son haché, « robotique » ;
//   • un bend fait MONTER la hauteur en continu, sans nouvelle attaque ;
//   • un slide fait GLISSER la hauteur d'une case à l'autre, sans attaque ;
//   • un hammer-on / pull-off change de hauteur d'un coup, sans médiator ;
//   • une note étouffée (x) donne un « tchk » court et sourd, pas un silence ;
//   • dans un accord, les cordes sont grattées de la plus grave à la plus
//     aiguë, à quelques millisecondes d'écart — jamais parfaitement ensemble.
//
// Une voix = { corde, debut, fin, velocite, etouffee, hauteurs }, avec
// `hauteurs` la courbe de hauteur (demi-tons MIDI) : liste de points
// { t, midi, forme } où `forme` vaut "saut" (changement instantané) ou
// "rampe" (glissement continu depuis le point précédent). t est relatif au
// début de la voix, en secondes.

/** MIDI des cordes à vide, accordage standard. */
export const CORDE_MIDI = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };

// ── Réglages : regroupés ici pour pouvoir les ajuster à l'oreille ──────────
export const REGLAGES = {
  resonanceMax: 2.2,        // s — une note seule ne sonne pas plus longtemps
  resonanceFinale: 1.6,     // s — dernière note d'une corde, si rien ne la coupe
  velociteTemps: 0.86,      // sur le temps
  velociteCroche: 0.74,     // sur le « et »
  velociteDouble: 0.64,     // sur les doubles-croches intermédiaires
  variationVelocite: 0.05,  // ± aléatoire, pour ne jamais jouer deux fois pareil
  decalageMaxMs: 7,         // retard aléatoire max (jamais en avance sur la grille)
  grattageMs: 12,           // écart entre deux cordes d'un accord
  bendDelaiS: 0.03,         // le bend commence juste après l'attaque
  bendDureeMax: 0.18,       // s — durée max de la montée d'un bend
  slidePart: 0.85,          // part du temps disponible occupée par le glissé
  etouffeeDuree: 0.05,      // s — le « tchk » d'une note étouffée
  velociteEtouffee: 0.55,
};

const vel = (col, rng, R) => {
  // 4 colonnes = 1 temps (doubles-croches) : position dans le temps.
  const base = col % 4 === 0 ? R.velociteTemps : col % 2 === 0 ? R.velociteCroche : R.velociteDouble;
  const v = base + (rng() * 2 - 1) * R.variationVelocite;
  return Math.max(0.2, Math.min(1, v));
};

/**
 * @param evenements  sortie de parseTab / grilleVersEvenements
 * @param opts.bpm, opts.subdivision (0.25 = double-croche par colonne)
 * @param opts.rng    générateur aléatoire (injectable pour des tests déterministes)
 * @param opts.reglages  surcharge partielle de REGLAGES
 * @returns { voix: [...], duree } — duree = fin de la dernière voix (s)
 */
export function planifierTab(evenements, opts = {}) {
  const { bpm = 90, subdivision = 0.25, rng = Math.random } = opts;
  const R = { ...REGLAGES, ...(opts.reglages || {}) };
  const spc = (60 / bpm) * subdivision;   // secondes par colonne
  if (!Array.isArray(evenements) || !evenements.length) return { voix: [], duree: 0 };

  // Grattage : dans un accord (≥ 3 cordes sur la même colonne), de la corde
  // la plus grave (6) à la plus aiguë (1).
  const parCol = new Map();
  for (const ev of evenements) {
    if (!parCol.has(ev.col)) parCol.set(ev.col, []);
    parCol.get(ev.col).push(ev);
  }
  const decalageGrattage = new Map();
  for (const [, evs] of parCol) {
    if (evs.length < 3) continue;
    [...evs].sort((a, b) => b.string - a.string).forEach((ev, i) => decalageGrattage.set(ev, i * R.grattageMs / 1000));
  }

  const voix = [];
  for (const ev of [...evenements].sort((a, b) => a.col - b.col || b.string - a.string)) {
    const ouverte = CORDE_MIDI[ev.string];
    if (ouverte == null) continue;
    const jitter = (rng() * R.decalageMaxMs) / 1000;
    const debut = ev.col * spc + (decalageGrattage.get(ev) || 0) + jitter;
    const v = vel(ev.col, rng, R);

    if (ev.type === "mute") {
      voix.push({ corde: ev.string, debut, fin: debut + R.etouffeeDuree, velocite: R.velociteEtouffee, etouffee: true,
        hauteurs: [{ t: 0, midi: ouverte, forme: "saut" }], ev });
      continue;
    }
    if (ev.type === "note") {
      voix.push({ corde: ev.string, debut, fin: null, velocite: v, etouffee: false, hauteurs: [{ t: 0, midi: ouverte + ev.fret, forme: "saut" }], ev });
      continue;
    }
    if (ev.type === "bend") {
      const depart = ouverte + ev.fromFret, arrivee = ouverte + ev.toFret;
      voix.push({ corde: ev.string, debut, fin: null, velocite: v, etouffee: false, ev,
        hauteurs: [
          { t: 0, midi: depart, forme: "saut" },
          { t: R.bendDelaiS, midi: depart, forme: "saut" },
          { t: R.bendDelaiS + Math.min(R.bendDureeMax, spc * 2), midi: arrivee, forme: "rampe" },
        ] });
      continue;
    }
    if (ev.type === "hammer" || ev.type === "pull") {
      // Arrivée sur SA colonne (toCol, grille de saisie) ; sinon 75 ms après
      // (texte collé), comme avant.
      const ecart = ev.toCol != null ? (ev.toCol - ev.col) * spc : 0.075;
      voix.push({ corde: ev.string, debut, fin: null, velocite: v, etouffee: false, ev,
        hauteurs: [{ t: 0, midi: ouverte + ev.fromFret, forme: "saut" }, { t: ecart, midi: ouverte + ev.toFret, forme: "saut" }] });
      continue;
    }
    if (ev.type === "slide_up" || ev.type === "slide_down") {
      const dispo = ev.toCol != null ? (ev.toCol - ev.col) * spc : Math.min(0.16, spc);
      voix.push({ corde: ev.string, debut, fin: null, velocite: v, etouffee: false, ev,
        hauteurs: [{ t: 0, midi: ouverte + ev.fromFret, forme: "saut" }, { t: Math.max(0.03, dispo * R.slidePart), midi: ouverte + ev.toFret, forme: "rampe" }] });
      continue;
    }
  }

  // Résonance : une voix sonne jusqu'à ce que la MÊME corde rejoue, sans
  // dépasser resonanceMax ; la dernière d'une corde résonne resonanceFinale.
  const parCorde = new Map();
  for (const x of voix) {
    if (!parCorde.has(x.corde)) parCorde.set(x.corde, []);
    parCorde.get(x.corde).push(x);
  }
  for (const [, liste] of parCorde) {
    liste.sort((a, b) => a.debut - b.debut);
    liste.forEach((x, i) => {
      if (x.etouffee) return;
      const derniereHauteur = x.hauteurs[x.hauteurs.length - 1].t;
      const suivante = liste[i + 1];
      const naturelle = x.debut + Math.max(derniereHauteur + 0.05, suivante ? R.resonanceMax : R.resonanceFinale);
      x.fin = suivante ? Math.min(suivante.debut, naturelle) : naturelle;
    });
  }

  voix.sort((a, b) => a.debut - b.debut);
  return { voix, duree: voix.reduce((m, x) => Math.max(m, x.fin), 0) };
}
