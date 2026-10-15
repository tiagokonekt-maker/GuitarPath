// Groply — morceaux/morceaux.js
// Logique PURE du lecteur de morceaux (aucun import audio ni React) :
// analyse de la tab d'un morceau, découpage A–B, vitesse, décompte. Tout
// est testé dans test/morceaux.test.mjs ; Morceaux.jsx ne fait qu'appeler
// ces fonctions puis audioEngine.playTab.
//
// ── Le format des tabs de morceaux ──────────────────────────────────────
// Les tabs du catalogue sont de l'ASCII ordinaire, lu par tab/tabParser.js,
// mais écrites avec une règle stricte : chaque mesure fait EXACTEMENT
// `colsParMesure` caractères (16 en 4/4, 12 en 3/4 et 6/8 — une double-
// croche par caractère), encadrée de barres « | ».
//
// Le parseur compte une barre « | » comme une colonne de silence (c'est sa
// convention pour une tab collée quelconque). Avec la règle ci-dessus, la
// colonne qu'il renvoie vaut donc mesure × (W + 1) + position, W = largeur
// d'une mesure. analyserMorceau retire ces colonnes de barre : la colonne
// « musicale » devient mesure × W + position, sans silence parasite entre
// deux mesures — le rythme reste exact, et l'on sait dans quelle mesure
// tombe chaque note (indispensable pour la boucle A–B).
import { parseTab } from "../tab/tabParser.js";
import { CORDE_MIDI } from "../tab/tabSon.js";

export const NIVEAUX = { debutant: "Débutant", intermediaire: "Intermédiaire" };
export const TYPES = { melodie: "Mélodie", riff: "Riff", accords: "Accords" };

/** Vitesse de lecture : de 40 à 100 % du tempo d'origine. */
export const VITESSE_MIN = 40;
export const VITESSE_MAX = 100;

const NOMS_NOTES = ["Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

/** Nom français (avec dièse) d'une hauteur MIDI : 60 → « Do ». */
export const nomNote = (midi) => NOMS_NOTES[((midi % 12) + 12) % 12];

/** Nombre de mesures écrites dans la tab : barres de la ligne de Mi aigu. */
export function compterMesures(tab) {
  let n = 0;
  for (const ligne of String(tab).split(/\r?\n/)) {
    if (/^\s*e\s*\|/.test(ligne)) n += Math.max(0, (ligne.match(/\|/g) || []).length - 1);
  }
  return n;
}

/**
 * Analyse la tab d'un morceau en évènements « musicaux ».
 * @returns {
 *   evenements  [{ ...évènement de parseTab, col (musicale), mesure }],
 *   nbMesures, colsParMesure,
 *   erreur, avertissements  (de parseTab),
 *   anomalies   [string] — note posée sur une barre de mesure, mesure
 *               mal dimensionnée… (vide pour une tab conforme)
 * }
 */
export function analyserMorceau(morceau) {
  const W = morceau.colsParMesure;
  const { evenements: bruts, erreur, avertissements } = parseTab(morceau.tab);
  const anomalies = [];
  const pas = W + 1;
  const versMusical = (col) => Math.floor(col / pas) * W + (col % pas);
  const evenements = bruts.map(ev => {
    const pos = ev.col % pas;
    if (pos >= W) anomalies.push(`Évènement sur une barre de mesure (corde ${ev.string}, colonne ${ev.col}).`);
    const out = { ...ev, col: versMusical(ev.col), mesure: Math.floor(ev.col / pas) };
    if (ev.releaseCol != null) out.releaseCol = versMusical(ev.releaseCol);
    return out;
  });
  const nbMesures = compterMesures(morceau.tab);
  // Contrôle de forme : chaque ligne de corde = barres à intervalle W + 1.
  for (const ligne of String(morceau.tab).split(/\r?\n/)) {
    const m = ligne.match(/^\s*[eBGDAE]\s*(\|.*\|)\s*$/);
    if (!m) continue;
    const corps = m[1];
    for (let i = 0; i < corps.length; i++) {
      const doitEtreBarre = i % pas === 0;
      if ((corps[i] === "|") !== doitEtreBarre) {
        anomalies.push(`Mesure de largeur incorrecte : « ${ligne.trim()} » (${W} caractères attendus par mesure).`);
        break;
      }
    }
  }
  return { evenements, nbMesures, colsParMesure: W, erreur, avertissements: avertissements || [], anomalies };
}

/** Hauteurs jouées (notes simples), dans l'ordre : pour vérifier une mélodie. */
export function melodieJouee(evenements) {
  return evenements
    .filter(e => e.type === "note")
    .sort((a, b) => a.col - b.col || a.string - b.string)
    .map(e => nomNote(CORDE_MIDI[e.string] + e.fret));
}

/** Tempo effectif, arrondi au BPM, pour une vitesse en % du tempo d'origine. */
export function bpmEffectif(tempo, pourcent) {
  const p = Math.max(VITESSE_MIN, Math.min(VITESSE_MAX, Number(pourcent) || VITESSE_MAX));
  return Math.max(20, Math.round((tempo * p) / 100));
}

/** Durée (s) de `nbCols` colonnes (une colonne = une double-croche) à `bpm`. */
export const dureeColonnes = (nbCols, bpm) => nbCols * (60 / bpm) / 4;

/**
 * Position de lecture (colonne du morceau, fractionnaire) à l'instant `maintenant`
 * (ms), d'après la dernière note entendue : sa colonne, l'instant où elle a
 * sonné et le tempo de la lecture. Sert à reprendre exactement là où on en
 * est, et non au début de la mesure.
 */
export function positionCourante(derniere, maintenant) {
  if (!derniere) return null;
  const ecoule = Math.max(0, (maintenant - derniere.t) / 1000);
  return derniere.col + ecoule / dureeColonnes(1, derniere.bpm);
}

/**
 * Colonnes des temps d'une mesure, pour le décompte : 4/4 → 0 4 8 12,
 * 3/4 → 0 4 8, 6/8 (deux temps pointés) → 0 6.
 */
export function tempsDeMesure(signature, colsParMesure) {
  const [num, den] = String(signature || "4/4").split("/").map(Number);
  if (den === 8 && num % 3 === 0) {
    return Array.from({ length: num / 3 }, (_, i) => i * 6).filter(c => c < colsParMesure);
  }
  const pasTemps = 16 / (den || 4);
  return Array.from({ length: num || 4 }, (_, i) => i * pasTemps).filter(c => c < colsParMesure);
}

/**
 * Évènements des mesures `debut` à `fin` (incluses, numérotées depuis 0),
 * recalés pour que la mesure `debut` commence à la colonne 0.
 * `colMorceau` garde la colonne d'origine (curseur de lecture).
 */
export function extraireSegment(evenements, colsParMesure, debut, fin) {
  const d = Math.max(0, Math.min(debut, fin)), f = Math.max(debut, fin);
  const decalage = d * colsParMesure;
  return evenements
    .filter(e => e.mesure >= d && e.mesure <= f)
    .map(e => {
      const out = { ...e, col: e.col - decalage, colMorceau: e.col };
      if (e.releaseCol != null) out.releaseCol = e.releaseCol - decalage;
      if (e.toCol != null) out.toCol = e.toCol - decalage;
      return out;
    });
}

/** Décale les colonnes d'un ensemble d'évènements (bends, slides compris). */
function decaler(evenements, delta) {
  return evenements.map(e => {
    const out = { ...e, col: e.col + delta };
    if (e.releaseCol != null) out.releaseCol = e.releaseCol + delta;
    if (e.toCol != null) out.toCol = e.toCol + delta;
    return out;
  });
}

/**
 * Ajoute une mesure de décompte (notes étouffées sur les temps) devant les
 * évènements, décalés d'une mesure. Chaque clic porte `decompte: n` (1, 2…).
 */
export function ajouterDecompte(evenements, colsParMesure, temps) {
  const clics = temps.map((c, i) => ({ type: "mute", string: 4, col: c, decompte: i + 1 }));
  const decales = evenements.map(e => {
    const out = { ...e, col: e.col + colsParMesure };
    if (e.releaseCol != null) out.releaseCol = e.releaseCol + colsParMesure;
    if (e.toCol != null) out.toCol = e.toCol + colsParMesure;
    return out;
  });
  return [...clics, ...decales];
}

/**
 * Prépare une lecture : segment A–B, décompte éventuel, tempo réduit.
 * @param analyse  sortie d'analyserMorceau
 * @param opts { tempo, signature, pourcent, debut, fin, decompte, depuisCol }
 *   depuisCol : colonne du morceau (fractionnaire possible) où reprendre —
 *   pause, ou réglage changé en pleine lecture. Les notes d'avant sont
 *   retirées et la suite est recalée pour démarrer là, au même rythme.
 * @returns { evenements, bpm, colonnes, duree }
 *   colonnes / duree : longueur de ce qui est joué (décompte compris), en
 *   colonnes et en secondes — mesures entières, pour boucler sur la pulsation.
 */
export function preparerLecture(analyse, opts) {
  const { tempo, signature, pourcent = 100, decompte = false } = opts;
  const W = analyse.colsParMesure;
  const dernier = Math.max(0, analyse.nbMesures - 1);
  const debut = Math.max(0, Math.min(dernier, opts.debut ?? 0));
  const fin = Math.max(debut, Math.min(dernier, opts.fin ?? dernier));
  let evenements = extraireSegment(analyse.evenements, W, debut, fin);
  let colonnes = (fin - debut + 1) * W;
  const ecart = opts.depuisCol == null ? 0 : opts.depuisCol - debut * W;
  if (ecart > 0 && ecart < colonnes) {
    evenements = decaler(evenements.filter(e => e.col >= ecart - 1e-6), -ecart);
    colonnes -= ecart;
  }
  if (decompte) {
    evenements = ajouterDecompte(evenements, W, tempsDeMesure(signature, W));
    colonnes += W;
  }
  const bpm = bpmEffectif(tempo, pourcent);
  return { evenements, bpm, colonnes, duree: dureeColonnes(colonnes, bpm), debut, fin };
}

/** Filtre du catalogue ("tous" = pas de filtre). */
export function filtrerMorceaux(liste, { niveau = "tous", type = "tous" } = {}) {
  return liste.filter(m => (niveau === "tous" || m.niveau === niveau) && (type === "tous" || m.type === type));
}

/** Texte d'un évènement tel qu'écrit dans la tab : « 3 », « x », « 0h2 »… */
export function texteEvenement(ev) {
  switch (ev.type) {
    case "mute": return "x";
    case "note": return String(ev.fret);
    case "hammer": return `${ev.fromFret}h${ev.toFret}`;
    case "pull": return `${ev.fromFret}p${ev.toFret}`;
    case "slide_up": return `${ev.fromFret}/${ev.toFret}`;
    case "slide_down": return `${ev.fromFret}\\${ev.toFret}`;
    case "bend": return `${ev.fromFret}b${ev.toFret}${ev.releaseFret != null ? "r" + ev.releaseFret : ""}`;
    default: return "?";
  }
}
