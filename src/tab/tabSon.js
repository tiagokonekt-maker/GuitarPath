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
//     relâché (7b9r7), il redescend ensuite, toujours sans attaque ;
//   • un vibrato (5~) fait osciller légèrement la hauteur autour de la
//     note (± vibratoAmplitude demi-ton, vibratoFrequence Hz), jusqu'à la
//     fin de la voix ;
//   • un slide fait GLISSER la hauteur d'une case à l'autre, sans attaque ;
//   • un hammer-on / pull-off change de hauteur d'un coup, sans médiator ;
//     une liaison ENCHAÎNÉE (3h5h7, 5h7p5 : maillons marqués sansAttaque)
//     reste une seule voix, qui change de hauteur à chaque maillon ;
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
  slidePart: 0.85,         // part du temps disponible occupée par le glissé
  vibratoAmplitude: 0.3,    // demi-ton — écart max de part et d'autre de la note
  vibratoFrequence: 5.5,    // Hz — oscillations par seconde
  vibratoDelaiS: 0.06,      // s — la note est d'abord tenue droite, puis vibre
  etouffeeDuree: 0.05,      // s — le « tchk » d'une note étouffée
  velociteEtouffee: 0.55,
};

const vel = (col, rng, R) => {
  // 4 colonnes = 1 temps (doubles-croches) : position dans le temps.
  const base = col % 4 === 0 ? R.velociteTemps : col % 2 === 0 ? R.velociteCroche : R.velociteDouble;
  const v = base + (rng() * 2 - 1) * R.variationVelocite;
  return Math.max(0.2, Math.min(1, v));
};

/** Dernière voix (dans l'ordre de création) jouée sur la corde `corde`. */
function derniereVoixDe(voix, corde) {
  for (let i = voix.length - 1; i >= 0; i--) if (voix[i].corde === corde) return voix[i];
  return null;
}

/**
 * Ajoute un maillon de liaison enchaînée (`sansAttaque`) à la courbe de
 * hauteur de la voix `x`. Les instants sont comptés depuis la colonne de
 * l'attaque de la voix (x.colOrigine). Renvoie false si la voix ne peut pas
 * être prolongée (absente, étouffée, ou pas sur la case de départ du maillon).
 */
function prolonger(x, ev, ouverte, spc, R) {
  if (!x || x.etouffee || x.colOrigine == null || x.colOrigine > ev.col) return false;
  const derniere = x.hauteurs[x.hauteurs.length - 1];
  if (Math.round(derniere.midi) !== ouverte + ev.fromFret) return false;
  const arrivee = ouverte + ev.toFret;
  const tCol = (c) => (c - x.colOrigine) * spc;
  const toCol = ev.toCol ?? ev.col + 1;
  const tDepart = Math.max(derniere.t, tCol(ev.col));
  if (ev.type === "slide_up" || ev.type === "slide_down") {
    const dispo = (toCol - ev.col) * spc;
    x.hauteurs.push({ t: tDepart, midi: derniere.midi, forme: "saut" });
    x.hauteurs.push({ t: tDepart + Math.max(0.03, dispo * R.slidePart), midi: arrivee, forme: "rampe" });
  } else {
    x.hauteurs.push({ t: Math.max(tDepart, tCol(toCol)), midi: arrivee, forme: "saut" });
  }
  if (ev.vibrato) x.vibrato = true;
  x.maillons = (x.maillons || 0) + 1;
  return true;
}

/**
 * @param evenements  sortie de parseTab / grilleVersEvenements
 * @param opts.bpm, opts.subdivision (0.25 = double-croche par colonne)
 * @param opts.rng    générateur aléatoire (injectable pour des tests déterministes)
 * @param opts.reglages  surcharge partielle de REGLAGES
 * @param opts.suite  évènements joués JUSTE APRÈS (boucle A–B : le tour
 *                    suivant, colonnes déjà décalées). Pas joués ici : ils
 *                    décident seulement où s'arrêtent les dernières notes
 *                    (coupées si leur corde rejoue, sinon résonance normale).
 * @returns { voix: [...], duree } — duree = fin de la dernière voix (s)
 */
export function planifierTab(evenements, opts = {}) {
  const { bpm = 90, subdivision = 0.25, rng = Math.random } = opts;
  const R = { ...REGLAGES, ...(opts.reglages || {}) };
  const spc = (60 / bpm) * subdivision;   // secondes par colonne
  if (!Array.isArray(evenements) || !evenements.length) return { voix: [], duree: 0 };
  // Suite (boucle) : évènements qui suivent immédiatement, mêmes colonnes.
  // Ils servent seulement à savoir quand une corde REJOUE après la fin :
  // leurs voix sont calculées puis retirées du plan.
  const suite = Array.isArray(opts.suite) ? opts.suite : [];
  const deLaSuite = new Set(suite);
  const tous = suite.length ? [...evenements, ...suite] : evenements;

  // Grattage : dans un accord (≥ 3 cordes sur la même colonne), de la corde
  // la plus grave (6) à la plus aiguë (1).
  const parCol = new Map();
  for (const ev of tous) {
    if (!parCol.has(ev.col)) parCol.set(ev.col, []);
    parCol.get(ev.col).push(ev);
  }
  const decalageGrattage = new Map();
  for (const [, evs] of parCol) {
    if (evs.length < 3) continue;
    [...evs].sort((a, b) => b.string - a.string).forEach((ev, i) => decalageGrattage.set(ev, i * R.grattageMs / 1000));
  }

  const voix = [];
  for (const ev of [...tous].sort((a, b) => a.col - b.col || b.string - a.string)) {
    const ouverte = CORDE_MIDI[ev.string];
    if (ouverte == null) continue;
    // Maillon d'une liaison enchaînée (3h5h7) : il PROLONGE la voix en cours
    // sur sa corde, sans nouvelle attaque. Si cette voix manque (passage A–B
    // ou reprise qui commence au milieu de la chaîne), il est attaqué comme
    // une liaison simple.
    if (ev.sansAttaque) {
      const x = derniereVoixDe(voix, ev.string);
      if (x && deLaSuite.has(x.ev) === deLaSuite.has(ev) && prolonger(x, ev, ouverte, spc, R)) continue;
    }
    const jitter = (rng() * R.decalageMaxMs) / 1000;
    const debut = ev.col * spc + (decalageGrattage.get(ev) || 0) + jitter;
    const v = vel(ev.col, rng, R);

    if (ev.type === "mute") {
      voix.push({ corde: ev.string, colOrigine: ev.col, debut, fin: debut + R.etouffeeDuree, velocite: R.velociteEtouffee, etouffee: true,
        hauteurs: [{ t: 0, midi: ouverte, forme: "saut" }], ev });
      continue;
    }
    if (ev.type === "note") {
      voix.push({ corde: ev.string, colOrigine: ev.col, debut, fin: null, velocite: v, etouffee: false, hauteurs: [{ t: 0, midi: ouverte + ev.fret, forme: "saut" }], ev });
      continue;
    }
    if (ev.type === "bend") {
      const depart = ouverte + ev.fromFret, arrivee = ouverte + ev.toFret;
      const montee = Math.min(R.bendDureeMax, spc * 2);
      const tHaut = R.bendDelaiS + montee;
      const hauteurs = [
        { t: 0, midi: depart, forme: "saut" },
        { t: R.bendDelaiS, midi: depart, forme: "saut" },
        { t: tHaut, midi: arrivee, forme: "rampe" },
      ];
      if (ev.releaseFret != null) {
        // Relâché : tenu en haut jusqu'à la colonne du « r » (jamais avant
        // d'être arrivé en haut), puis redescente continue, aussi rapide
        // que la montée.
        const tRelache = Math.max(tHaut + 0.02, ev.releaseCol != null ? (ev.releaseCol - ev.col) * spc : tHaut + spc);
        hauteurs.push({ t: tRelache, midi: arrivee, forme: "saut" });
        hauteurs.push({ t: tRelache + montee, midi: ouverte + ev.releaseFret, forme: "rampe" });
      }
      voix.push({ corde: ev.string, colOrigine: ev.col, debut, fin: null, velocite: v, etouffee: false, ev, hauteurs });
      continue;
    }
    if (ev.type === "hammer" || ev.type === "pull") {
      // Arrivée sur SA colonne (toCol, grille de saisie) ; sinon 75 ms après
      // (texte collé), comme avant.
      const ecart = ev.toCol != null ? (ev.toCol - ev.col) * spc : 0.075;
      voix.push({ corde: ev.string, colOrigine: ev.col, debut, fin: null, velocite: v, etouffee: false, ev,
        hauteurs: [{ t: 0, midi: ouverte + ev.fromFret, forme: "saut" }, { t: ecart, midi: ouverte + ev.toFret, forme: "saut" }] });
      continue;
    }
    if (ev.type === "slide_up" || ev.type === "slide_down") {
      const dispo = ev.toCol != null ? (ev.toCol - ev.col) * spc : Math.min(0.16, spc);
      voix.push({ corde: ev.string, colOrigine: ev.col, debut, fin: null, velocite: v, etouffee: false, ev,
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
      // Liaison enchaînée : chaque hammer-on / pull-off relance la corde, la
      // résonance se compte depuis le dernier maillon (pas depuis l'attaque).
      const depuis = x.maillons ? derniereHauteur : 0;
      const naturelle = x.debut + Math.max(derniereHauteur + 0.05, depuis + (suivante ? R.resonanceMax : R.resonanceFinale));
      x.fin = suivante ? Math.min(suivante.debut, naturelle) : naturelle;
    });
  }

  // Vibrato : ajouté une fois la durée de la voix connue. Points alternés
  // note / +A / note / −A / … reliés par des rampes, un quart de période
  // d'écart : une oscillation régulière jusqu'à la fin de la voix.
  for (const x of voix) {
    if (!(x.ev?.vibrato || x.vibrato) || x.etouffee) continue;
    const dernier = x.hauteurs[x.hauteurs.length - 1];
    const tDebut = dernier.t + R.vibratoDelaiS;
    const tFin = x.fin - x.debut;
    if (tFin <= tDebut) continue;
    const pas = 1 / (4 * R.vibratoFrequence);
    x.hauteurs.push({ t: tDebut, midi: dernier.midi, forme: "saut" });
    for (let k = 1; tDebut + k * pas <= tFin; k++) {
      const ecart = [0, 1, 0, -1][k % 4] * R.vibratoAmplitude;
      x.hauteurs.push({ t: tDebut + k * pas, midi: dernier.midi + ecart, forme: "rampe" });
    }
  }

  const retenues = suite.length ? voix.filter(x => !deLaSuite.has(x.ev)) : voix;
  retenues.sort((a, b) => a.debut - b.debut);
  return { voix: retenues, duree: retenues.reduce((m, x) => Math.max(m, x.fin), 0) };
}
