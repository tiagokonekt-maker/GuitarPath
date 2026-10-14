// Groply — src/music/notes.js
// Les tableaux chromatiques « bruts » de l'application, définis UNE fois.
//
// Ce sont des noms de CLASSES DE HAUTEUR (0 = Do … 11 = Si), écrits en
// dièses par convention interne : ils servent aux calculs (comparaisons,
// recherche de cases, noms Tone.js), pas à l'affichage pédagogique. Pour
// montrer une note à l'élève dans une tonalité, passer par
// music/orthographe.js, qui écrit Sib en Fa majeur et non La#.
//
// Module sans aucune dépendance : fretboardUtils.js, orthographe.js et les
// écrans peuvent tous l'importer sans risque d'import circulaire.

/** Les 12 classes de hauteur, notation anglaise, en dièses. */
export const NOTES_DIESES_EN = Object.freeze(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]);

/** Les 12 classes de hauteur, notation française, en dièses. */
export const NOTES_DIESES_FR = Object.freeze(["Do", "Do#", "Ré", "Ré#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"]);

/** Les 12 classes de hauteur en bémols (notation anglaise) : celle des échantillons audio. */
export const NOTES_BEMOLS_EN = Object.freeze(["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]);

/** Les 7 lettres, de Do à Si. */
export const LETTRES_FR = Object.freeze(["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"]);
export const LETTRES_EN = Object.freeze(["C", "D", "E", "F", "G", "A", "B"]);
/** Demi-tons de chaque lettre naturelle depuis Do. */
export const NATUREL = Object.freeze([0, 2, 4, 5, 7, 9, 11]);
