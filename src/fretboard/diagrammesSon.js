// Groply — fretboard/diagrammesSon.js
// Ce que JOUE chaque diagramme de leçon : fonctions PURES (aucun audio, aucun
// React), testées dans test/diagrammes-son*.test.mjs sur tous les blocs réels
// du contenu.
//
// Chaque fonction transforme les données d'un bloc (data du diagramme) en
// notes Tone.js ("E2", "Bb3"…) ou en une séquence d'évènements
// { t, notes, duree, velocite, strum, step } que audioEngine.playSequence
// sait planifier. `step` est l'identifiant de ce qu'il faut surligner à
// l'écran à l'instant de l'évènement (index de note, clé de case, index de
// cellule…).
//
// ── Conventions (identiques à diagrams.jsx) ──────────────────────────────
//   chord_diagram  frets[0] = corde 6 (Mi grave) … frets[5] = corde 1 ;
//                  -1 = étouffée, 0 = à vide.
//   scale_pattern  strings[0] = corde 6 … strings[5] = corde 1 ;
//                  noteMap["case,indexCorde"].
//   fretboard      notes[].string : 1 = Mi aigu … 6 = Mi grave.
//   Accordage standard : E2 A2 D3 G3 B3 E4.

import { pcDeNom } from "../music/orthographe.js";
import { NOTES_BEMOLS_EN, NOTES_DIESES_EN } from "../music/notes.js";

/** Hauteur MIDI des cordes à vide (1 = Mi aigu). */
export const CORDE_MIDI = Object.freeze({ 1: 64, 2: 59, 3: 55, 4: 50, 5: 45, 6: 40 });

/** MIDI → note Tone.js, en bémols (la convention des échantillons). */
export const midiVersNote = (m) => `${NOTES_BEMOLS_EN[((m % 12) + 12) % 12]}${Math.floor(m / 12) - 1}`;

/** Note Tone.js → MIDI ("Bb2" → 46, "C#4" → 61), null si illisible. */
export function noteVersMidi(n) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(String(n || ""));
  if (!m) return null;
  const pc = pcDeNom(m[1] + (m[2] || ""));
  return pc == null ? null : pc + 12 * (Number(m[3]) + 1);
}

/** Nom interne (dièses, anglais) d'une classe de hauteur : ce que compare le manche interactif. */
export const pcVersNomDiese = (pc) => NOTES_DIESES_EN[((pc % 12) + 12) % 12];

/** Hauteur MIDI d'une case. corde : 1 (Mi aigu) → 6 (Mi grave). */
export function midiAPosition(corde, cse) {
  const base = CORDE_MIDI[corde];
  if (base == null || !Number.isFinite(cse) || cse < 0) return null;
  return base + cse;
}

/** Note Tone.js d'une case ("E2" pour corde 6 à vide). */
export function noteAPosition(corde, cse) {
  const m = midiAPosition(corde, cse);
  return m == null ? null : midiVersNote(m);
}

const estCase = (f) => Number.isInteger(f) && f >= 0;

// ═══════════════════════════════════════════════════════════════════════════
// ACCORDS (chord_diagram, caged_form)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cordes jouées d'un diagramme d'accord, du grave vers l'aigu.
 * @returns [{ index, corde, case, note }] — index = position dans frets[] (0 = corde 6)
 */
export function cordesDeFrets(frets) {
  if (!Array.isArray(frets)) return [];
  const out = [];
  frets.forEach((f, index) => {
    if (!estCase(f)) return;   // -1, null… : corde étouffée
    const corde = 6 - index;
    const note = noteAPosition(corde, f);
    if (note) out.push({ index, corde, case: f, note });
  });
  return out;
}

/** frets [c6..c1] → notes du grave vers l'aigu. [0,2,2,0,0,0] → ["E2","B2","E3","G3","B3","E4"] */
export const fretsToNotes = (frets) => cordesDeFrets(frets).map(c => c.note);

// Suffixes d'accord → intervalles (demi-tons depuis la fondamentale).
const QUALITES = {
  "": [0, 4, 7], M: [0, 4, 7], maj: [0, 4, 7],
  m: [0, 3, 7], min: [0, 3, 7], "-": [0, 3, 7],
  dim: [0, 3, 6], "°": [0, 3, 6], o: [0, 3, 6],
  aug: [0, 4, 8], "+": [0, 4, 8],
  5: [0, 7],
  6: [0, 4, 7, 9], m6: [0, 3, 7, 9],
  7: [0, 4, 7, 10], maj7: [0, 4, 7, 11], M7: [0, 4, 7, 11], "7M": [0, 4, 7, 11], "Δ": [0, 4, 7, 11], "Δ7": [0, 4, 7, 11],
  m7: [0, 3, 7, 10], min7: [0, 3, 7, 10], "-7": [0, 3, 7, 10],
  m7b5: [0, 3, 6, 10], "ø": [0, 3, 6, 10], "ø7": [0, 3, 6, 10],
  dim7: [0, 3, 6, 9], "°7": [0, 3, 6, 9],
  mMaj7: [0, 3, 7, 11], "m(maj7)": [0, 3, 7, 11],
  sus2: [0, 2, 7], sus4: [0, 5, 7], sus: [0, 5, 7], "7sus4": [0, 5, 7, 10],
  9: [0, 4, 7, 10, 14], maj9: [0, 4, 7, 11, 14], m9: [0, 3, 7, 10, 14], add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14],
};

/**
 * Lit un nom d'accord tel qu'écrit dans les leçons : « Am », « Do », « C/E »,
 * « G7 (V7) », « Bb (♭VII) », « Cmaj7 », « Bdim ».
 * @returns { racine (classe 0-11), intervalles, basse (classe ou null), pcs: Set } ou null
 */
export function parseNomAccord(nom) {
  const s = String(nom ?? "")
    .replace(/\s*\(.*?\)\s*/g, "")      // « (V7) », « (I) » : fonction, pas le nom
    .replace(/♭/g, "b").replace(/♯/g, "#")
    .trim();
  const m = /^(Do|Ré|Re|Mi|Fa|Sol|La|Si|[A-G])(#|b)?([^/]*)(?:\/(.+))?$/.exec(s);
  if (!m) return null;
  const racine = pcDeNom(m[1] + (m[2] || ""));
  if (racine == null) return null;
  const qualite = m[3].trim();
  const intervalles = QUALITES[qualite];
  if (!intervalles) return null;
  let basse = null;
  if (m[4]) {
    basse = pcDeNom(m[4].trim());
    if (basse == null) return null;
  }
  const pcs = new Set(intervalles.map(i => (racine + i) % 12));
  if (basse != null) pcs.add(basse);
  return { racine, intervalles: [...intervalles], basse, pcs };
}

/**
 * Empilement guitare d'un accord donné par sa fondamentale et ses intervalles :
 * basse dans le registre Mi2–Ré#3, quinte, puis l'accord complet une octave
 * au-dessus. Do majeur → C3 G3 C4 E4 G4.
 */
export function voicingAccord(racinePc, intervalles = [0, 4, 7]) {
  const basse = 40 + (((racinePc - 4) % 12) + 12) % 12;   // E2 … D#3
  const midis = [basse];
  if (intervalles.includes(7)) midis.push(basse + 7);
  for (const i of intervalles) {
    let m = basse + 12 + i;
    while (m > 83) m -= 12;   // au-delà de Si5, plus d'échantillon : l'extension descend d'une octave
    midis.push(m);
  }
  return [...new Set(midis)].sort((a, b) => a - b).map(midiVersNote);
}

/** Notes d'une forme CAGED, une par corde, du grave vers l'aigu. */
export function cagedVersCordes(data) {
  const parCorde = new Map();
  for (const n of data?.notes || []) {
    if (n.muted) continue;
    const cse = n.open ? 0 : n.fret;
    if (!estCase(cse) || !CORDE_MIDI[n.string]) continue;
    if (!parCorde.has(n.string)) parCorde.set(n.string, { corde: n.string, case: cse, cle: `${n.string}-${cse}`, note: noteAPosition(n.string, cse) });
  }
  return [...parCorde.values()].sort((a, b) => b.corde - a.corde);
}

/**
 * Séquence « accord gratté » : un coup vers le bas, tenu.
 * @param cordes [{ note, … }] du grave vers l'aigu
 */
export function sequenceGrattage(cordes, { duree = 2.6 } = {}) {
  if (!cordes.length) return [];
  return [{ t: 0, notes: cordes.map(c => c.note), duree, velocite: 0.85, strum: "down", ecart: 0.03, step: "tout" }];
}

/**
 * Séquence « arpège » : chaque corde l'une après l'autre (on la laisse
 * sonner), puis l'accord gratté. step = index de la corde dans `cordes`.
 */
export function sequenceArpege(cordes, { ecart = 0.36 } = {}) {
  if (!cordes.length) return [];
  const evs = cordes.map((c, i) => ({ t: i * ecart, notes: c.note, duree: 1.4, velocite: 0.75, step: i }));
  evs.push({ t: cordes.length * ecart + 0.15, notes: cordes.map(c => c.note), duree: 2.2, velocite: 0.8, strum: "down", ecart: 0.03, step: "tout" });
  return evs;
}

// ═══════════════════════════════════════════════════════════════════════════
// GAMMES ET NOTES (scale_pattern, fretboard, note_grid, fretboard_interactive)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Notes d'un scale_pattern, dans l'ordre où on les joue : corde 6 → corde 1,
 * cases croissantes sur chaque corde. Les cases hors de la fenêtre affichée
 * sont ignorées, comme dans le rendu (on ne joue pas ce qu'on ne voit pas).
 * @returns [{ cle: "case,indexCorde", indexCorde, corde, case, note, midi }]
 */
export function scaleBlockToNotes(data) {
  const { strings = [], startFret = 4, endFret = 9 } = data || {};
  if (strings.length !== 6) return [];
  const out = [];
  strings.forEach((st, indexCorde) => {
    const corde = 6 - indexCorde;
    const cases = [...new Set((st?.frets || []).filter(estCase))].sort((a, b) => a - b);
    for (const f of cases) {
      if (f < startFret || f > endFret) continue;
      const midi = midiAPosition(corde, f);
      out.push({ cle: `${f},${indexCorde}`, indexCorde, corde, case: f, midi, note: midiVersNote(midi) });
    }
  });
  return out;
}

/**
 * Montée puis descente, sans répéter la note du sommet. Chaque élément
 * garde ses propriétés (dont `cle`, pour le surlignage).
 */
export function monteeDescente(notes) {
  if (notes.length < 2) return [...notes];
  return [...notes, ...notes.slice(0, -1).reverse()];
}

/** Séquence mélodique : une note toutes les `ecart` secondes, step = clé de surlignage. */
export function sequenceMelodique(notes, { ecart = 0.4, duree = 0.7, velocite = 0.8 } = {}) {
  return notes.map((n, i) => ({
    t: i * ecart,
    notes: n.note,
    duree: i === notes.length - 1 ? Math.max(duree, 1.2) : duree,
    velocite,
    step: n.cle ?? i,
  }));
}

/**
 * Notes d'un bloc « fretboard », dans l'ordre écrit par l'auteur (souvent
 * pédagogique : paires d'octaves, doigts 1-2-3-4…). Les notes étouffées et
 * hors fenêtre sont ignorées ; un doublon de case n'est joué qu'une fois.
 * @returns [{ cle: "corde-case", corde, case, note, midi }]
 */
export function fretboardBlockToNotes(data) {
  const { notes = [], startFret = 0, frets = 5 } = data || {};
  const vues = new Set();
  const out = [];
  for (const n of notes) {
    if (!n || n.muted) continue;
    const cse = n.open ? 0 : n.fret;
    if (!estCase(cse) || !CORDE_MIDI[n.string]) continue;
    // Même filtre que FretboardDiagram : la case 0 s'affiche toujours (à
    // gauche du sillet), les autres seulement dans la fenêtre.
    if (cse !== 0 && (cse < startFret + 1 || cse > startFret + frets)) continue;
    const cle = `${n.string}-${cse}`;
    if (vues.has(cle)) continue;
    vues.add(cle);
    const midi = midiAPosition(n.string, cse);
    out.push({ cle, corde: n.string, case: cse, midi, note: midiVersNote(midi) });
  }
  return out;
}

/** Notes d'une note_grid, de la case la plus basse à la plus haute. step = case. */
export function noteGridToNotes(data) {
  const { string: corde = 6, highlights = [], maxFret = 12 } = data || {};
  if (!CORDE_MIDI[corde]) return [];
  const cases = [...new Set(highlights.map(h => h?.fret).filter(f => estCase(f) && f <= maxFret))].sort((a, b) => a - b);
  return cases.map(f => {
    const midi = midiAPosition(corde, f);
    return { cle: f, corde, case: f, midi, note: midiVersNote(midi) };
  });
}

/**
 * Notes ASCENDANTES d'un ensemble de classes de hauteur, à partir de la
 * fondamentale (octave 3), une octave complète + la fondamentale en haut.
 * Sert au manche interactif (gamme, accord, notes surlignées).
 * @returns [{ cle: nom interne en dièses ("C#"), note, midi }]
 */
export function notesMontantesDepuis(racinePc, intervalles, { octaveHaute = true } = {}) {
  const base = 48 + racinePc;   // C3 + pc : de Do3 à Si3
  const ivs = [...new Set(intervalles.map(i => ((i % 12) + 12) % 12))].sort((a, b) => a - b);
  const midis = ivs.map(i => base + i);
  if (octaveHaute) midis.push(base + 12);
  return midis.map(m => ({ cle: pcVersNomDiese(m), midi: m, note: midiVersNote(m) }));
}

/**
 * Séquence d'un bloc fretboard_interactive (manche complet de leçon).
 *   scale      la gamme sur une octave, en montant puis en descendant
 *   chord      l'accord arpégé (une octave), puis gratté
 *   highlight  les notes surlignées, en montant depuis la première écrite
 *   quiz       rien (null) : il n'y a pas de son à écouter, juste des cases à trouver
 * step = nom interne de la note qui sonne ("C#"), ou la liste des notes de
 * l'accord gratté — c'est ce que le manche sait illuminer (flashNotes).
 * @param infos { racinePc, intervallesGamme, intervallesAccord, pcsNotes } —
 *   résolus par l'appelant (fretboardUtils), pour garder ce module sans
 *   dépendance aux tables de gammes.
 */
export function sequenceLecon(block, { racinePc = null, intervallesGamme, intervallesAccord, pcsNotes = [] } = {}) {
  const mode = block?.mode;
  if (mode === "scale" && racinePc != null && intervallesGamme?.length) {
    return sequenceMelodique(monteeDescente(notesMontantesDepuis(racinePc, intervallesGamme)), { ecart: 0.36, duree: 0.65 });
  }
  if (mode === "chord" && racinePc != null && intervallesAccord?.length) {
    const ECART = 0.34;
    const arpege = notesMontantesDepuis(racinePc, intervallesAccord);
    const evs = sequenceMelodique(arpege, { ecart: ECART, duree: 1.1 });
    evs.push({
      t: arpege.length * ECART + 0.15, notes: voicingAccord(racinePc, intervallesAccord),
      duree: 2.2, velocite: 0.82, strum: "down", ecart: 0.03,
      step: [...new Set(arpege.map(n => n.cle))],
    });
    return evs;
  }
  if (mode === "highlight") {
    const pcs = pcsNotes.filter(p => Number.isInteger(p));
    if (!pcs.length || pcs.length !== pcsNotes.length) return null;
    const racine = pcs[0];
    const notes = notesMontantesDepuis(racine, pcs.map(pc => pc - racine), { octaveHaute: false });
    return sequenceMelodique(notes, { ecart: 0.5, duree: 0.8 });
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// RYTHME (strum_pattern, rhythm_grid)
// ═══════════════════════════════════════════════════════════════════════════

/** Accord joué par un pattern de grattage, selon son style. */
const ACCORD_STYLE = {
  folk:   [43, 47, 50, 55, 59, 67],   // Sol ouvert  320003
  pop:    [48, 52, 55, 60, 64],       // Do          x32010
  rock:   [40, 47, 52],               // Mi5 (power chord)
  reggae: [45, 52, 57, 60, 64],       // La mineur   x02210
  blues:  [45, 52, 55, 61, 64],       // La7         x02020
  bossa:  [45, 52, 55, 60, 64],       // La m7       x02010
  funk:   [40, 47, 50, 56, 59, 66],   // Mi9-ish     (Mi Si Ré Sol# Si Fa#)
};
export const accordDuStyle = (style) => (ACCORD_STYLE[style] || ACCORD_STYLE.folk).map(midiVersNote);

/**
 * Pattern de grattage → séquence. Cellules : "B" bas, "H" haut, "BH" bas
 * puis haut dans la même cellule, "-H" silence puis haut, "x" coup étouffé,
 * "-" silence.
 * @returns { evenements, dureeMesure, cellules, bpm }
 */
export function strumBlockToEvents(data, { mesures = 2 } = {}) {
  const { pattern = [], beats = 4, style = "folk", bpm: bpmBrut } = data || {};
  const bpm = Number.isFinite(bpmBrut) && bpmBrut > 0 ? bpmBrut : 80;
  const cellules = pattern.length;
  if (!cellules || !(beats > 0)) return { evenements: [], dureeMesure: 0, cellules: 0, bpm };
  const spb = 60 / bpm;
  const dureeMesure = beats * spb;
  const dc = dureeMesure / cellules;
  const parTemps = cellules / beats;
  const accord = accordDuStyle(style);
  const aigus = accord.slice(-Math.min(4, accord.length));   // un coup vers le haut ne touche que les cordes aiguës
  const graves = accord.slice(0, 3);

  // Instants des coups dans UNE mesure.
  const coups = [];
  pattern.forEach((p, i) => {
    const t = i * dc;
    const surTemps = i % parTemps === 0;
    const v = String(p || "-");
    if (v === "B") coups.push({ t, kind: "down", step: i, accent: surTemps });
    else if (v === "H") coups.push({ t, kind: "up", step: i });
    else if (v === "BH") { coups.push({ t, kind: "down", step: i, accent: surTemps }); coups.push({ t: t + dc / 2, kind: "up", step: i }); }
    else if (v === "-H") coups.push({ t: t + dc / 2, kind: "up", step: i });
    else if (v === "x" || v === "X") coups.push({ t, kind: "mute", step: i });
    else coups.push({ t, kind: "silence", step: i });
  });

  const evenements = [];
  for (let k = 0; k < mesures; k++) {
    const decal = k * dureeMesure;
    coups.forEach((c, j) => {
      const suivant = coups.slice(j + 1).find(x => x.kind !== "silence");
      const tSuiv = suivant ? suivant.t : dureeMesure + (coups.find(x => x.kind !== "silence")?.t ?? 0);
      const tient = Math.max(0.08, tSuiv - c.t);
      const t = decal + c.t;
      if (c.kind === "down") evenements.push({ t, notes: accord, duree: tient, velocite: c.accent ? 0.92 : 0.8, strum: "down", ecart: 0.016, step: c.step, kind: "down" });
      else if (c.kind === "up") evenements.push({ t, notes: aigus, duree: tient, velocite: 0.6, strum: "up", ecart: 0.014, step: c.step, kind: "up" });
      else if (c.kind === "mute") evenements.push({ t, notes: graves, duree: 0.04, velocite: 0.32, strum: "down", ecart: 0.008, step: c.step, kind: "mute" });
      else evenements.push({ t, notes: [], duree: 0, step: c.step, kind: "silence" });
    });
  }
  return { evenements, dureeMesure, cellules, bpm };
}

/** Tempo par défaut d'une grille rythmique (data.bpm sinon). */
export function tempoGrille(data) {
  if (Number.isFinite(data?.bpm) && data.bpm > 0) return data.bpm;
  return (data?.subdivision ?? 8) >= 12 ? 70 : 80;
}

/**
 * Grille rythmique → séquence. Règles de lecture (celles du rendu) :
 *   muted       la case ne sonne pas (silence, ou note précédente tenue)
 *   highlights  attaques mises en avant (fortes)
 *   accents     attaques accentuées
 *   autres      attaque normale
 * Une attaque est tenue jusqu'à la suivante. Quand la grille distingue des
 * attaques (highlights), un clic léger marque chaque temps pour qu'on sente
 * la pulsation sous le rythme (ronde, blanche, syncope…).
 * @returns { evenements, dureeMesure, cellules, bpm }
 */
export function rhythmBlockToEvents(data, { mesures = 2 } = {}) {
  const { beats = 4, subdivision = 8, accents = [], muted = [], highlights = [] } = data || {};
  const parTemps = subdivision / 4;
  const cellules = Math.round(beats * parTemps);
  const bpm = tempoGrille(data);
  if (!(cellules > 0)) return { evenements: [], dureeMesure: 0, cellules: 0, bpm };
  const spb = 60 / bpm;
  const dureeMesure = beats * spb;
  const dc = dureeMesure / cellules;
  const avecClic = highlights.length > 0;
  const attaque = [40, 47, 52].map(midiVersNote);   // quinte à vide sur Mi : sonne comme un coup de guitare, pas comme une mélodie
  const CLIC = "E5";

  const sonne = (i) => !muted.includes(i);
  const evenements = [];
  for (let k = 0; k < mesures; k++) {
    const decal = k * dureeMesure;
    for (let i = 0; i < cellules; i++) {
      const t = decal + i * dc;
      if (avecClic && i % parTemps === 0) {
        evenements.push({ t, notes: CLIC, duree: 0.05, velocite: i === 0 ? 0.32 : 0.22, kind: "clic" });
      }
      if (!sonne(i)) { evenements.push({ t, notes: [], duree: 0, step: i, kind: "silence" }); continue; }
      let j = i + 1;
      while (j < cellules && !sonne(j)) j++;
      const tient = Math.max(0.08, (j - i) * dc - 0.03);
      const fort = highlights.includes(i) || accents.includes(i);
      evenements.push({ t, notes: attaque, duree: tient, velocite: fort ? 0.95 : 0.6, strum: "down", ecart: 0.01, step: i, kind: fort ? "fort" : "attaque" });
    }
  }
  return { evenements, dureeMesure, cellules, bpm };
}

// ═══════════════════════════════════════════════════════════════════════════
// TABLATURE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Décalage (en caractères) entre le début d'une ligne de tab et la colonne 0
 * de l'analyseur (nom de corde + barre retirés, comme tabParser).
 */
export function decalageLigneTab(ligne) {
  const s = String(ligne ?? "");
  const sansNom = s.replace(/^\s*[A-Ga-g](#|b)?\s*[|:]?\s?/, "").replace(/^[|:]+/, "");
  return s.length - sansNom.length;
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERVALLES, DEGRÉS, CERCLE DES QUINTES
// ═══════════════════════════════════════════════════════════════════════════

/** Note de référence des intervalles : Do 4. */
export const RACINE_INTERVALLES = 60;

/** Les deux notes d'un intervalle depuis la référence. 7 → ["C4","G4"]. */
export const notesIntervalle = (demiTons, racine = RACINE_INTERVALLES) =>
  [midiVersNote(racine), midiVersNote(racine + demiTons)];

/** Séquence de plusieurs intervalles enchaînés (mélodique : fondamentale puis note). step = index. */
export function sequenceIntervalles(liste, { ecart = 0.55, pause = 0.6 } = {}) {
  const evs = [];
  let t = 0;
  liste.forEach(({ demiTons, step }) => {
    const [a, b] = notesIntervalle(demiTons);
    evs.push({ t, notes: a, duree: 0.5, velocite: 0.8, step });
    evs.push({ t: t + ecart, notes: b, duree: 0.8, velocite: 0.8 });
    t += ecart * 2 + pause;
  });
  return evs;
}

const DEGRES_MAJEUR = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 };

/** Tonalité citée dans une légende (« … de Do majeur », « en Sol majeur ») : classe de hauteur, Do par défaut. */
export function tonaliteDeLegende(texte) {
  const m = /\b(?:en|de)\s+(Do|Ré|Re|Mi|Fa|Sol|La|Si)\s*([#b♯♭]?)\s+(majeur|mineur)/i.exec(String(texte || ""));
  if (!m) return 0;
  const pc = pcDeNom(m[1] + (m[2] || "").replace("♯", "#").replace("♭", "b"));
  return pc ?? 0;
}

/** Lit un chiffrage romain : « I », « ii », « vii° », « ♭VII », « V7 ». null sinon. */
export function lireRomain(txt) {
  const s = String(txt ?? "").trim().replace(/♭/g, "b").replace(/♯/g, "#");
  const m = /^(b|#)?(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)(°|ø|\+)?(7)?$/.exec(s);
  if (!m) return null;
  const deg = DEGRES_MAJEUR[m[2].toUpperCase()];
  const alt = m[1] === "b" ? -1 : m[1] === "#" ? 1 : 0;
  const mineur = m[2] === m[2].toLowerCase();
  let intervalles = mineur ? [0, 3, 7] : [0, 4, 7];
  if (m[3] === "°") intervalles = m[4] ? [0, 3, 6, 9] : [0, 3, 6];
  else if (m[3] === "ø") intervalles = [0, 3, 6, 10];
  else if (m[3] === "+") intervalles = [0, 4, 8];
  else if (m[4]) intervalles = mineur ? [0, 3, 7, 10] : [0, 4, 7, 10];
  return { decalage: (deg + alt + 12) % 12, mineur, intervalles };
}

/**
 * Ce que joue une case de degree_chart :
 *   « Do – Mi – Sol » dans le libellé  → ces notes, plaquées (accord)
 *   chiffrage romain, tableau avec des minuscules (ii, vi, vii°) → l'accord du degré
 *   chiffrage romain tout en majuscules (I … VII)               → la note du degré
 *   nom de note en tête (« Sol »)                               → accord majeur
 * @param ctx { tonique (classe), modeNote (bool) }
 * @returns { type: "accord"|"note", notes: [Tone…] } ou null
 */
export function degreeBoxToNotes(box, ctx = {}) {
  const { tonique = 0, modeNote = false } = ctx;
  const label = String(box?.label ?? "");
  // 1. Liste de notes explicite, séparée par des tirets.
  if (/[–-]/.test(label)) {
    const noms = label.split(/\s+[–-]\s+/).map(x => x.trim());
    const pcs = noms.map(n => pcDeNom(n.replace("♯", "#").replace("♭", "b")));
    if (noms.length >= 3 && pcs.every(p => p != null)) {
      // Empilement ascendant depuis la première note (Do3 … Si3), chaque
      // note suivante juste au-dessus de la précédente.
      let precedent = 48 + pcs[0];
      const midis = [precedent];
      for (const pc of pcs.slice(1)) {
        precedent += ((pc - (precedent % 12) + 12) % 12) || 12;
        midis.push(precedent);
      }
      // Basse doublée à l'octave inférieure, tant qu'elle reste sur la guitare (≥ Mi2).
      const basse = midis[0] - 12 >= 40 ? [midis[0] - 12] : [];
      return { type: "accord", notes: [...basse, ...midis].map(midiVersNote) };
    }
  }
  // 2. Chiffrage romain.
  const r = lireRomain(box?.top);
  if (r) {
    const pc = (tonique + r.decalage) % 12;
    if (modeNote) return { type: "note", notes: [midiVersNote(60 + pc + (pc < tonique ? 12 : 0))] };
    return { type: "accord", notes: voicingAccord(pc, r.intervalles) };
  }
  // 3. Nom de note en tête : accord majeur.
  const pcTop = pcDeNom(String(box?.top ?? "").replace("♯", "#").replace("♭", "b"));
  if (pcTop != null) return { type: "accord", notes: voicingAccord(pcTop, [0, 4, 7]) };
  return null;
}

/** Contexte d'un degree_chart : tonalité (légende) et mode note/accord. */
export function contexteDegres(data, caption) {
  const tops = (data?.boxes || []).map(b => String(b?.top ?? ""));
  const romains = tops.map(lireRomain);
  const tousRomains = romains.length > 0 && romains.every(Boolean);
  // Tout en majuscules, sans altération ni qualité : ce sont des DEGRÉS DE
  // GAMME (I = Do, II = Ré…), pas des accords — on joue la note.
  const modeNote = tousRomains && tops.every(t => /^[IV]+$/.test(t));
  return { tonique: tonaliteDeLegende(caption), modeNote };
}

/** Séquence d'un degree_chart entier : chaque case l'une après l'autre. step = index de la case. */
export function sequenceDegres(data, caption) {
  const ctx = contexteDegres(data, caption);
  const evs = [];
  let t = 0;
  (data?.boxes || []).forEach((b, i) => {
    const r = degreeBoxToNotes(b, ctx);
    if (!r) return;
    if (r.type === "note") {
      evs.push({ t, notes: r.notes[0], duree: 0.7, velocite: 0.8, step: i });
      t += 0.55;
    } else {
      evs.push({ t, notes: r.notes, duree: 1.3, velocite: 0.8, strum: "down", ecart: 0.025, step: i });
      t += 1.25;
    }
  });
  return evs;
}

/** Accord de tonique d'une case du cercle des quintes (« Réb », « Fa#m »). */
export function accordDuCercle(nom) {
  const s = String(nom ?? "").trim();
  const mineur = /m$/.test(s);
  const pc = pcDeNom(mineur ? s.slice(0, -1) : s);
  if (pc == null) return null;
  return voicingAccord(pc, mineur ? [0, 3, 7] : [0, 4, 7]);
}

const QUALITE_FR = {
  "": "majeur", M: "majeur", maj: "majeur", m: "mineur", min: "mineur", "-": "mineur",
  dim: "diminué", "°": "diminué", aug: "augmenté", "+": "augmenté", 5: "5 (power chord)",
  7: "7", maj7: "majeur 7", M7: "majeur 7", m7: "mineur 7", m7b5: "mineur 7 bémol 5",
  dim7: "diminué 7", m9: "mineur 9", maj9: "majeur 9", 9: "9", sus2: "sus2", sus4: "sus4",
  6: "6", m6: "mineur 6", add9: "add9",
};
const NOM_FR_PC = ["Do", "Do#", "Ré", "Mib", "Mi", "Fa", "Fa#", "Sol", "Lab", "La", "Sib", "Si"];

/**
 * Nom d'accord en toutes lettres, pour les lecteurs d'écran :
 * « Am » → « La mineur », « C/E » → « Do majeur, Mi à la basse ».
 * Repli : le nom tel qu'écrit, sans la parenthèse de fonction.
 */
export function nomAccordFr(nom) {
  const brut = String(nom ?? "").replace(/\s*\(.*?\)\s*/g, " ").trim();
  const p = parseNomAccord(nom);
  if (!p) return brut;
  const qualite = /^(Do|Ré|Re|Mi|Fa|Sol|La|Si|[A-G])(#|b|♯|♭)?([^/]*)/.exec(brut)?.[3]?.trim() ?? "";
  const q = QUALITE_FR[qualite] ?? qualite;
  const base = `${NOM_FR_PC[p.racine]} ${q}`.trim();
  return p.basse != null ? `${base}, ${NOM_FR_PC[p.basse]} à la basse` : base;
}
