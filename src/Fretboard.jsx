// ═══════════════════════════════════════════════════════════════════════════
// Groply — Fretboard.jsx
// Composant manche interactif, mobile-first.
//
// ── Cibles tactiles (audit §5.1) ──────────────────────────────────────────
// C'est l'interaction centrale du produit. Les cases mesuraient 36 × 28 px,
// cordes contiguës, sans espacement. Le plancher WCAG 2.2 SC 2.5.8 (AA) est
// de 24 px, donc c'était conforme — mais 24 px est un plancher, pas une
// recommandation : Apple préconise 44 pt, Material 48 dp, et le critère AAA
// demande 44. Or sur un manche, se tromper de corde d'une case, c'est se
// tromper d'intervalle : l'utilisateur attribuera l'erreur à l'app, ou pire,
// à lui-même.
// Les tailles viennent maintenant de design/tokens.js (TAP.fret = 44) et les
// zones tactiles ont un espacement réel entre cordes.
//
// ── Affordance de défilement (audit §5.2) ─────────────────────────────────
// Le conteneur porte la classe .gr-hscroll (barre discrète mais VISIBLE) et
// .gr-hscroll-wrap (dégradés de bord). L'ancienne règle globale
// `*::-webkit-scrollbar { display: none }` masquait tout sur Safari et Chrome,
// donc rien n'indiquait que le manche défilait — on pouvait ne jamais
// découvrir les cases hautes.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useMemo, useCallback, useEffect } from "react";
import { useC } from "./design/ThemeContext.jsx";
import { R, T, TAP } from "./design/tokens.js";
import { AnimatedNumber, Button, Card, Eyebrow, IconTile, Segmented, Tag } from "./design/ui.jsx";
// Grille cordes × cases partagée (rendu, clavier, survol, libellés aria) :
// voir fretboard/FretGrid.jsx.
import { FretGrid } from "./fretboard/FretGrid.jsx";
import {
  getNoteAtPosition,
  getScalePositions,
  getChordPositions,
  getHighlightPositions,
  getQuizTargetPositions,
  isCorrectPosition,
  checkQuizCompletion,
  SCALES,
  CHORD_TYPES,
  INTERVAL_NAMES,
  noteToFr,
  normalizeNote,
} from "./fretboardUtils.js";
import { carteNoms, lireNote, nomFr, nomEn, nomRacineGamme, nomRacineAccord, pcDeNom } from "./music/orthographe.js";
// Son des blocs de leçon (fretboard_interactive) : même lecteur que les
// diagrammes (un seul joue à la fois, bouton en haut à droite).
import { playSequence } from "./audioEngine.js";
import { BoutonEcoute } from "./fretboard/LecteurDiagramme.jsx";
import { useLecteurDiagramme } from "./fretboard/useLecteurDiagramme.js";
import { sequenceLecon } from "./fretboard/diagrammesSon.js";

// ───────────────────────────────────────────────────────────────────────────
// ORTHOGRAPHE DES PASTILLES
// Les positions restent calculées en notes internes (dièses) ; seul le NOM
// affiché change quand une gamme ou un accord donne une tonalité : en Fa
// majeur la pastille dit « Sib », pas « La# ». Sans contexte (quiz « trouve
// tous les… », note isolée), on garde noteToFr (dièses), comme avant.
// Les doubles altérations (7e de dim7) sont affichées sous leur enharmonique
// simple (Sibb → La) : lisible sur une pastille, et le contenu des leçons
// écrit déjà le 𝄫 là où il l'enseigne.
// ───────────────────────────────────────────────────────────────────────────
function carteContexte({ mode, root, scale, chord, highlightedNotes, quizTarget, lang }) {
  const langue = lang === "en" ? "en" : "fr";
  if (mode === "scale" && root && scale) return carteNoms(root, { gamme: scale, langue });
  if (mode === "chord" && root && chord) return carteNoms(root, { accord: chord, langue });
  // Notes surlignées ou cible de quiz : on respecte l'orthographe écrite
  // par l'auteur (« Bb » s'affiche Sib, « A# » La#).
  const ecrites = mode === "highlight" ? highlightedNotes : mode === "quiz" && quizTarget ? [quizTarget] : null;
  if (ecrites?.length) {
    const carte = new Map();
    for (const n of ecrites) {
      if (!carte.has(normalizeNote(n))) carte.set(normalizeNote(n), nomEcrit(n, lang));
    }
    return carte;
  }
  return null;
}
/** Nom d'une note dans l'orthographe où elle est écrite ("Bb" → "Sib"). */
function nomEcrit(n, lang = "fr") {
  const lu = lireNote(n);
  if (!lu) return nomSansContexte(n, lang);
  return lang === "en" ? nomEn(lu) : nomFr(lu);
}
const nomSansContexte = (note, lang) => (lang === "fr" ? noteToFr(note) : note);
/** Nom affiché d'une fondamentale, orthographié pour sa gamme ou son accord. */
function nomRacine(root, { scale, chord, lang = "fr" } = {}) {
  if (!root) return "";
  const langue = lang === "en" ? "en" : "fr";
  if (scale) return nomRacineGamme(root, scale, langue);
  if (chord) return nomRacineAccord(root, chord, langue);
  return nomSansContexte(root, lang);
}

// Police des pastilles : conservée telle quelle, leurs libellés sont calés au
// pixel dans des cercles de 26 à 30 px. Tout le reste (consignes, boutons,
// encarts) hérite de la police de l'app.
const FONT_PASTILLE = '"Inter", "Helvetica Neue", -apple-system, sans-serif';

// ───────────────────────────────────────────────────────────────────────────
// PALETTE DES NOTES ACTIVES — fonction du thème courant (plus de couleurs figées)
// Les couleurs s'appliquent selon le rôle de la note (root, 3rd, 5th, etc.)
// Le libellé est posé sur un aplat : C.onPrimaryBtn (blanc en clair, brun
// foncé en sombre), jamais un blanc fixe.
// ───────────────────────────────────────────────────────────────────────────
function getNoteColors(C) {
  const text = C.onPrimaryBtn;
  return {
    root:     { bg: C.amber,   text, border: C.amberD  },
    third:    { bg: C.primary, text, border: C.primaryD },
    fifth:    { bg: C.green,   text, border: C.greenD  },
    seventh:  { bg: C.coral,   text, border: C.coralD  },
    other:    { bg: C.blue,    text, border: C.blueD   },
    selected: { bg: C.primary, text, border: C.primaryD },
    correct:  { bg: C.green,   text, border: C.greenD  },
    wrong:    { bg: C.coral,   text, border: C.coralD  },
    missed:   { bg: C.amber,   text, border: C.amberD  },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// RETOUR DE JEU — animation d'une pastille selon son état (classes d'index.css)
// Une case touchée apparaît en ressort, une note juste saute, une erreur
// tremble, une position manquée apparaît à la correction. Ces classes
// n'animent que `transform` : rien ne bouge autour. Une animation CSS ne
// rejoue que lorsque la classe change, donc sur un geste (toucher une case,
// Vérifier), jamais à chaque rendu.
// ───────────────────────────────────────────────────────────────────────────
const ANIM = { selected: "gr-in-pop", correct: "gr-bump", wrong: "gr-shake", missed: "gr-in-pop" };

// Mapping degré → couleur (pour gammes 7 notes)
function colorForDegree(degree, isRoot, NOTE_COLORS) {
  if (isRoot) return NOTE_COLORS.root;
  const map = {
    2: NOTE_COLORS.other,
    3: NOTE_COLORS.third,
    4: NOTE_COLORS.other,
    5: NOTE_COLORS.fifth,
    6: NOTE_COLORS.other,
    7: NOTE_COLORS.seventh,
  };
  return map[degree] || NOTE_COLORS.other;
}

// ───────────────────────────────────────────────────────────────────────────
// LABEL D'UNE NOTE selon le displayMode
// ───────────────────────────────────────────────────────────────────────────
function getNoteLabel(note, interval, degree, displayMode, lang = "fr", noms = null) {
  const nomNote = () => noms?.get(normalizeNote(note)) ?? nomSansContexte(note, lang);
  switch (displayMode) {
    case "notes":
      return nomNote();
    case "intervals":
      return INTERVAL_NAMES[interval]?.short ?? "?";
    case "degrees":
      // Si on a un degré valide, l'affiche ; sinon fallback sur l'intervalle court
      if (degree != null && degree > 0) return String(degree);
      if (interval != null) return INTERVAL_NAMES[interval]?.short ?? "?";
      return "?";
    default:
      return nomNote();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPOSANTS
// ═══════════════════════════════════════════════════════════════════════════

// ── Pastille de note sur le manche ──────────────────────────────────────────
function NoteMarker({ label, color, size = 28, anim, style = {} }) {
  return (
    <div className={anim} style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color.bg,
      border: `2px solid ${color.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size <= 24 ? 8 : size <= 30 ? 9 : 11,
      fontWeight: 700,
      color: color.text,
      fontFamily: FONT_PASTILLE,
      letterSpacing: "-0.02em",
      flexShrink: 0,
      userSelect: "none",
      ...style,
    }}>
      {label}
    </div>
  );
}

// ── Pastille compacte (canvas du quiz et de l'exercice) ─────────────────────
function PastilleDense({ label, color, size = 26, opacity = 1, anim }) {
  return (
    <div className={anim} style={{
      width: size, height: size, borderRadius: "50%",
      background: color.bg, border: `2px solid ${color.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 7, fontWeight: 700, color: color.text,
      fontFamily: FONT_PASTILLE, position: "relative", zIndex: 2,
      userSelect: "none", opacity,
    }}>{label}</div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL — <Fretboard />
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props :
 *
 * --- Données musicales ---
 * mode          : "scale" | "chord" | "highlight" | "quiz" | "blank"
 * root          : "C" | "A" | "G#" | ... (fondamentale)
 * scale         : clé de SCALES (ex: "pentatonic_minor", "major")
 * chord         : clé de CHORD_TYPES (ex: "min7", "maj")
 * highlightedNotes : string[] (ex: ["C", "E", "G"]) — pour mode "highlight"
 *
 * --- Affichage ---
 * displayMode   : "notes" | "intervals" | "degrees"
 * lang          : "fr" | "en"
 * startFret     : case de début à afficher (défaut 0)
 * endFret       : case de fin à afficher (défaut 12)
 * showOpenStrings : boolean (défaut true)
 * showStringNames : boolean (défaut true)
 * showFretNumbers : boolean (défaut true)
 * compact       : boolean — affichage réduit pour intégration dans les cours
 *
 * --- Quiz ---
 * quizTarget    : string (note à trouver, ex: "C")
 * onQuizComplete: function({ found, total, complete })
 * onQuizProgress: function({ selected, correct })
 *
 * --- Callbacks mode sélection ---
 * onNoteClick   : function({ string, fret, note }) — appelé quand l'user clique
 * selectedPositions : Array<{string, fret}> — positions déjà sélectionnées (contrôlé depuis l'extérieur)
 */
export function Fretboard({
  // Données
  mode = "blank",
  root,
  scale,
  chord,
  highlightedNotes,

  // Affichage
  displayMode = "notes",
  lang = "fr",
  startFret = 0,
  endFret = 12,
  showOpenStrings = true,
  showStringNames = true,
  showFretNumbers = true,
  compact = false,

  // Quiz
  quizTarget,
  onQuizComplete,
  onQuizProgress,

  // Callbacks libres
  onNoteClick,
  selectedPositions: externalSelected,

  // Illumination pendant la lecture : nom de note ("Do") ou tableau de noms
  // pour un accord. Toutes les positions de ces notes s'allument, ce qui
  // rend audible ET visible le lien entre le son et le manche.
  flashNotes = null,
}) {
  const C = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(C), [C]);
  const [quizSelected, setQuizSelected] = useState([]);
  const [quizRevealed, setQuizRevealed] = useState(false);

  // ── Calcul des positions actives ────────────────────────────────────────
  const activePositions = useMemo(() => {
    if (mode === "scale" && root && scale) {
      return getScalePositions(root, scale, endFret);
    }
    if (mode === "chord" && root && chord) {
      return getChordPositions(root, chord, endFret);
    }
    if (mode === "highlight" && highlightedNotes?.length) {
      return getHighlightPositions(highlightedNotes, endFret);
    }
    if (mode === "quiz" && quizTarget) {
      // En mode quiz : les cibles sont cachées jusqu'à la révélation
      return getQuizTargetPositions(quizTarget, endFret);
    }
    return [];
  }, [mode, root, scale, chord, highlightedNotes, quizTarget, endFret]);

  // ── Noms orthographiés selon la tonalité (voir carteContexte) ───────────
  const nomsContexte = useMemo(
    () => carteContexte({ mode, root, scale, chord, highlightedNotes, quizTarget, lang }),
    [mode, root, scale, chord, highlightedNotes, quizTarget, lang]
  );
  const nomAffiche = (note) => nomsContexte?.get(normalizeNote(note)) ?? nomSansContexte(note, lang);

  // ── Lookup rapide : pos → info ───────────────────────────────────────────
  const positionMap = useMemo(() => {
    const map = {};
    for (const p of activePositions) {
      map[`${p.string}-${p.fret}`] = p;
    }
    return map;
  }, [activePositions]);

  // ── Sélection quiz ──────────────────────────────────────────────────────
  const handleCellClick = useCallback((string, fret) => {
    const note = getNoteAtPosition(string, fret);

    if (mode === "quiz" && !quizRevealed) {
      setQuizSelected(prev => {
        const already = prev.some(p => p.string === string && p.fret === fret);
        const next = already
          ? prev.filter(p => !(p.string === string && p.fret === fret))
          : [...prev, { string, fret }];
        onQuizProgress?.({ selected: next, correct: activePositions });
        const result = checkQuizCompletion(next, activePositions);
        if (result.complete) onQuizComplete?.(result);
        return next;
      });
      return;
    }

    onNoteClick?.({ string, fret, note });
  }, [mode, quizRevealed, activePositions, onNoteClick, onQuizProgress, onQuizComplete]);

  // ── Layout du manche ────────────────────────────────────────────────────
  // Cases frettées affichées (la case 0 est la colonne des cordes à vide)
  const frets = [];
  for (let f = Math.max(1, startFret); f <= endFret; f++) frets.push(f);

  // ── Tailles adaptées au mode compact ────────────────────────────────────
  // Le mode « compact » servait à insérer le manche dans une leçon. Il
  // descendait à 32 px de haut, soit sous le seuil confortable, alors que
  // l'écran fait 440 px de large : la place ne manquait pas.
  const cellW  = compact ? TAP.fretW : 48;
  const cellH  = compact ? TAP.fret  : TAP.comfy;
  const dotSz  = compact ? 26 : 30;
  const openW  = compact ? 34 : 38;
  const labelW = compact ? 26 : 30;

  // Les cases ne sont activables que si un clic a un effet
  const interactive = mode === "quiz" || !!onNoteClick;

  // ── Résumé pour les lecteurs d'écran ────────────────────────────────────
  const rootFr = nomRacine(root, { scale: mode === "scale" ? scale : null, chord: mode === "chord" ? chord : null });
  const resume = (
    mode === "scale" && root && scale ? `Manche : gamme ${SCALES[scale]?.name ?? scale} de ${rootFr}`
    : mode === "chord" && root && chord ? `Manche : accord ${rootFr} ${CHORD_TYPES[chord]?.name ?? chord}`
    : mode === "highlight" && highlightedNotes?.length ? `Manche : notes ${highlightedNotes.map(n => nomEcrit(n)).join(", ")}`
    : mode === "quiz" && quizTarget ? `Manche : trouve tous les ${nomEcrit(quizTarget)}`
    : "Manche de guitare"
  ) + `, cases ${startFret} à ${endFret}`;

  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {/* Défilement horizontal. Les classes viennent d'index.css : barre
          discrète mais visible + dégradés de bord, pour qu'on SACHE que le
          manche continue à droite. */}
      <div className="gr-hscroll-wrap">
      <div className="gr-hscroll" role="group" aria-label="Manche de guitare, défile horizontalement">
        <FretGrid
          frets={frets}
          showOpen={showOpenStrings}
          showStringNames={showStringNames}
          showFretNumbers={showFretNumbers}
          cellW={cellW} cellH={cellH} openW={openW} labelW={labelW}
          variant="standard"
          renderCell={renderCell}
          interactive={interactive}
          onCellClick={handleCellClick}
          isCellSelected={mode === "quiz" && !quizRevealed
            ? (s, f) => quizSelected.some(p => p.string === s && p.fret === f)
            : undefined}
          ariaLabel={resume}
          nomNote={nomAffiche}
        />
      </div>
      </div>{/* /gr-hscroll-wrap */}

      {/* ── Interface quiz ────────────────────────────────────────────── */}
      {mode === "quiz" && (
        <QuizControls
          selected={quizSelected}
          correct={activePositions}
          revealed={quizRevealed}
          target={quizTarget}
          lang={lang}
          onReveal={() => setQuizRevealed(true)}
          onReset={() => { setQuizSelected([]); setQuizRevealed(false); }}
        />
      )}
    </div>
  );

  // ── Rendu d'une cellule (note ou vide) ───────────────────────────────────
  function renderCell(s, f) {
    const key = `${s}-${f}`;
    const pos = positionMap[key];

    // Mode quiz : gestion des états selected/correct/wrong
    if (mode === "quiz") {
      const isSelected = quizSelected.some(p => p.string === s && p.fret === f);
      const isCorrect = isCorrectPosition(s, f, activePositions);

      if (quizRevealed) {
        if (isCorrect && isSelected) {
          const note = getNoteAtPosition(s, f);
          return <NoteMarker label={nomAffiche(note)} color={NOTE_COLORS.correct} size={dotSz} anim={ANIM.correct} />;
        }
        if (isCorrect && !isSelected) {
          const note = getNoteAtPosition(s, f);
          return <NoteMarker label={nomAffiche(note)} color={NOTE_COLORS.missed} size={dotSz} anim={ANIM.missed} />;
        }
        if (!isCorrect && isSelected) {
          const note = getNoteAtPosition(s, f);
          return <NoteMarker label={nomAffiche(note)} color={NOTE_COLORS.wrong} size={dotSz} anim={ANIM.wrong} />;
        }
        return null;
      }

      if (isSelected) {
        const note = getNoteAtPosition(s, f);
        return <NoteMarker label={nomAffiche(note)} color={NOTE_COLORS.selected} size={dotSz} anim={ANIM.selected} />;
      }
      return null;
    }

    // Positions externes contrôlées
    if (externalSelected) {
      const isExt = externalSelected.some(p => p.string === s && p.fret === f);
      if (isExt) {
        const note = getNoteAtPosition(s, f);
        return <NoteMarker label={nomAffiche(note)} color={NOTE_COLORS.selected} size={dotSz} />;
      }
    }

    // Mode visualisation
    if (!pos) return null;

    const label = getNoteLabel(pos.note, pos.interval, pos.degree, displayMode, lang, nomsContexte);
    const baseColor = pos.isRoot
      ? NOTE_COLORS.root
      : colorForDegree(pos.degree, false, NOTE_COLORS);

    // La note en cours de lecture s'illumine : agrandie, bordure lumineuse,
    // halo. C'est ce qui rend la gamme compréhensible visuellement — on voit
    // exactement quelle case produit le son qu'on entend.
    const flashList = flashNotes == null ? []
      : Array.isArray(flashNotes) ? flashNotes : [flashNotes];
    const isFlashing = flashList.some(n => n && normalizeNote(n) === normalizeNote(pos.note));

    return (
      <NoteMarker
        label={label}
        color={baseColor}
        size={isFlashing ? Math.round(dotSz * 1.32) : dotSz}
        style={{
          ...(onNoteClick ? { cursor: "pointer" } : {}),
          ...(isFlashing ? {
            boxShadow: `0 0 0 3px ${C.bg}, 0 0 14px 4px ${baseColor.bg}`,
            zIndex: 5,
          } : {}),
          transition: "width var(--gr-dur-fast) ease, height var(--gr-dur-fast) ease, box-shadow var(--gr-dur-fast) ease",
        }}
      />
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
// QUIZ CONTROLS
// ───────────────────────────────────────────────────────────────────────────
function QuizControls({ selected, correct, revealed, target, lang, onReveal, onReset }) {
  const C = useC();
  const result = checkQuizCompletion(selected, correct);
  const label = nomEcrit(target, lang);

  return (
    <Card pad="12px 14px" style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <div style={{ fontSize: T.small, fontWeight: 600, color: C.text }}>
          🎯 Trouve tous les <strong>{label}</strong>
        </div>
        <div style={{ fontSize: 12, color: C.text2, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
          {revealed
            ? `${result.found}/${result.total} trouvé${result.found > 1 ? "s" : ""} · ${result.extras} fausse${result.extras > 1 ? "s" : ""} note${result.extras > 1 ? "s" : ""}`
            : `${selected.length} sélectionné${selected.length > 1 ? "s" : ""}`
          }
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {!revealed && <Button onClick={onReveal} style={{ flex: 1 }}>Vérifier</Button>}
        <Button variant="secondary" onClick={onReset} style={revealed ? { flex: 1 } : undefined}>Reset</Button>
      </div>

      {revealed && (
        <EncartResultat reussi={result.complete}>
          {result.complete
            ? "✅ Parfait ! Tu as trouvé toutes les positions."
            : `🟡 ${result.misses} position${result.misses > 1 ? "s" : ""} manquante${result.misses > 1 ? "s" : ""} (en orange). ${result.extras > 0 ? `${result.extras} erreur${result.extras > 1 ? "s" : ""} (en rouge).` : ""}`
          }
        </EncartResultat>
      )}
    </Card>
  );
}

// ── Encart de résultat (après « Vérifier ») ─────────────────────────────────
// Vert quand tout est juste, ambre quand il reste des positions : sur le
// manche, « presque » n'est pas « faux », d'où l'ambre plutôt que le rouge de
// <Feedback>. Apparaît en ressort, une fois, à son montage.
function EncartResultat({ reussi, children }) {
  const C = useC();
  return (
    <Card tone={reussi ? "green" : "amber"} soft pad="10px 14px" className="gr-in-pop"
      style={{ fontSize: T.small, lineHeight: 1.5, color: reussi ? C.greenD : C.amberD }}>
      {children}
    </Card>
  );
}

// ── Cadre du manche ─────────────────────────────────────────────────────────
// Carte du système (bordure, rayon) ; en-tête et contrôles sur la surface.
// Seule la zone du manche garde son fond surface2 : c'est la touche sur
// laquelle cordes et filets sont dessinés.
function CadreManche({ children }) {
  return <Card pad={0} style={{ overflow: "hidden" }}>{children}</Card>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT WRAPPER POUR LES COURS — <FretboardLesson />
// Gère le rendu du bloc { type: "fretboard", ... } dans les leçons
// ═══════════════════════════════════════════════════════════════════════════

/**
 * À utiliser dans LessonView pour rendre un bloc fretboard pédagogique.
 * Supporte tous les types définis dans content.js.
 *
 * block : {
 *   type: "fretboard",
 *   mode: "scale" | "chord" | "highlight" | "quiz",
 *   caption: string,       // titre du bloc
 *   root: string,          // ex: "A"
 *   scale: string,         // ex: "pentatonic_minor"
 *   chord: string,         // ex: "min7"
 *   notes: string[],       // pour mode highlight
 *   displayMode: string,   // "notes" | "intervals" | "degrees"
 *   quizTarget: string,    // pour mode quiz
 *   compact: boolean,
 * }
 */
export function FretboardLesson({ block }) {
  const C = useC();
  // Pour highlight et quiz, forcer "notes" — pas de degrés/intervalles sans structure harmonique
  const defaultDisplay = (block.mode === "highlight" || block.mode === "quiz") ? "notes" : (block.displayMode || "notes");
  const [displayMode, setDisplayMode] = useState(defaultDisplay);
  const [quizDone, setQuizDone] = useState(false);

  // Son : gamme montante puis descendante, accord arpégé puis gratté, ou
  // notes surlignées — chaque note sonnante s'allume sur tout le manche
  // (flashNotes). Pas de son en mode quiz : il n'y a rien à écouter, juste
  // des positions à trouver.
  const lecteur = useLecteurDiagramme();
  const lecon = useMemo(() => sequenceLecon(block, {
    racinePc: block.root ? pcDeNom(normalizeNote(block.root)) : null,
    intervallesGamme: SCALES[block.scale]?.intervals,
    intervallesAccord: CHORD_TYPES[block.chord]?.intervals,
    pcsNotes: (block.notes || []).map(n => pcDeNom(normalizeNote(n))),
  }), [block]);
  const flashNotes = lecteur.etat !== "repos" ? lecteur.pas : null;

  const modeMap = {
    "scale":     { mode: "scale",     root: block.root, scale: block.scale },
    "chord":     { mode: "chord",     root: block.root, chord: block.chord },
    "highlight": { mode: "highlight", highlightedNotes: block.notes },
    "quiz":      { mode: "quiz",      quizTarget: block.quizTarget },
  };

  const props = modeMap[block.mode] || { mode: "blank" };

  // Nom lisible du mode
  const modeLabel = {
    "scale": block.scale ? (SCALES[block.scale]?.name ?? block.scale) : "",
    "chord": block.chord ? (CHORD_TYPES[block.chord]?.name ?? block.chord) : "",
    "highlight": "",
    "quiz": "",
  }[block.mode] ?? "";

  const rootLabel = block.root
    ? nomRacine(block.root, {
        scale: block.mode === "scale" ? block.scale : null,
        chord: block.mode === "chord" ? block.chord : null,
        lang: block.lang === "en" ? "en" : "fr",
      })
    : "";

  return (
    <CadreManche>
      {/* En-tête : titre et écoute, puis le choix d'affichage sur sa ligne */}
      <div style={{
        padding: "10px 14px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Eyebrow tone="amber">🎸 {rootLabel} {modeLabel}</Eyebrow>
            {block.caption && (
              <div style={{ fontSize: T.small, fontWeight: 700, color: C.text, marginTop: 2, lineHeight: 1.4 }}>
                {block.caption}
              </div>
            )}
          </div>
          {lecon && (
            <BoutonEcoute
              joue={lecteur.action === "lecon" && lecteur.etat !== "repos"}
              charge={lecteur.action === "lecon" && lecteur.etat === "chargement"}
              label={block.mode === "scale" ? `Écouter la gamme ${modeLabel} de ${rootLabel}, en montant puis en descendant`
                : block.mode === "chord" ? `Écouter l'accord ${rootLabel} ${modeLabel}, arpégé puis gratté`
                : "Écouter ces notes"}
              onClick={() => lecteur.basculer("lecon", ({ onStep, onDone }) => playSequence(lecon, { onStep, onDone }))}
            />
          )}
        </div>

        {/* Sélecteur de mode d'affichage (sauf quiz et highlight) */}
        {block.mode !== "quiz" && block.mode !== "highlight" && (
          <Segmented size="sm" label="Affichage des pastilles" value={displayMode} onChange={setDisplayMode}
            options={[
              { value: "notes",     label: "Notes" },
              { value: "intervals", label: "Intervalles" },
              { value: "degrees",   label: "Degrés" },
            ]} />
        )}
      </div>

      {/* Fretboard */}
      <div style={{ padding: "10px 8px", background: C.surface2 }}>
        <Fretboard
          {...props}
          displayMode={displayMode}
          lang={block.lang || "fr"}
          compact={block.compact ?? true}
          flashNotes={flashNotes}
          onQuizComplete={block.mode === "quiz" ? () => setQuizDone(true) : undefined}
        />
      </div>

      {/* Succès quiz */}
      {quizDone && (
        <div className="gr-in-pop" style={{
          padding: "10px 14px",
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
          fontSize: T.small,
          fontWeight: 700,
          color: C.greenD,
        }}>
          🏆 Toutes les positions trouvées ! +XP
        </div>
      )}
    </CadreManche>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDERER GLOBAL — à intégrer dans LessonView de App.jsx
// Ajouter ce case dans le switch/renderBlock de LessonView :
//
// case "fretboard_interactive":
//   return <FretboardLesson key={i} block={b} />;
//
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// FRETBOARD QUIZ QUESTION — composant pour QuizPlayer
// Reçoit une question de type { type: "fretboard", fretMode, target, ... }
// et gère son propre état jusqu'à onComplete(result)
//
// Formats de questions supportés :
//   { type:"fretboard", fretMode:"find_note",     target:"C",  q:"Trouve tous les Do", xp:40 }
//   { type:"fretboard", fretMode:"find_root",     root:"A",    scale:"pentatonic_minor", q:"...", xp:50 }
//   { type:"fretboard", fretMode:"find_chord",    root:"G",    chord:"maj7", q:"...", xp:50 }
// ═══════════════════════════════════════════════════════════════════════════
export function FretboardQuizQuestion({ question, onComplete, answered, forceReveal }) {
  const C = useC();
  const [quizSelected, setQuizSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  // L'indice n'est jamais affiché par défaut — un "trouve tous les Do"
  // dont l'indice donne déjà 2 des 6 positions dès l'ouverture, c'est
  // donner la réponse avant même la question. L'utilisateur doit le
  // demander explicitement s'il veut de l'aide.
  const [showHint, setShowHint] = useState(false);

  // Réinitialiser quand la question change
  const questionKey = question.id;
  const [lastKey, setLastKey] = useState(questionKey);
  if (lastKey !== questionKey) {
    setQuizSelected([]);
    setRevealed(false);
    setShowHint(false);
    setLastKey(questionKey);
  }

  // Calculer les positions cibles
  // Support double format :
  //   ancien : { fretMode, target, root, scale, chord }
  //   content.js : { concept: { type, root }, selectionRules }
  const targetPositions = useMemo(() => {
    // Résoudre le mode et la note cible selon le format de la question
    const fretMode = question.fretMode || question.concept?.type;
    const target   = question.target   || question.concept?.root;
    const root     = question.root     || question.concept?.root;

    if ((fretMode === "find_note" || fretMode === "find_root" ||
         fretMode === "find_chord" || fretMode === "find_scale_root") && (target || root)) {
      return getQuizTargetPositions(target || root);
    }
    // find_shape : les positions sont donnees TELLES QUELLES dans le concept
    // (un doigte precis), pas deduites d'une note cible. Sans cette branche,
    // targetPositions restait vide et TOUTE reponse etait refusee, meme la
    // bonne — ce composant ne connaissait que les 4 types ci-dessus.
    if (fretMode === "find_shape" && Array.isArray(question.concept?.positions)) {
      return question.concept.positions.filter(p => p && p.fret > 0);
    }
    return [];
  }, [question]);

  // Positions de contexte à afficher (pour find_chord, find_scale_root)
  const contextPositions = useMemo(() => {
    const fretMode = question.fretMode || question.concept?.type;
    const root     = question.root     || question.concept?.root;
    const { scale, chord } = question;
    if (fretMode === "find_chord" && root && chord) {
      return getChordPositions(root, chord, 12);
    }
    if (fretMode === "find_scale_root" && root && scale) {
      return getScalePositions(root, scale, 12);
    }
    return [];
  }, [question]);

  const handleCellClick = (string, fret) => {
    if (revealed || answered) return;
    setQuizSelected(prev => {
      const already = prev.some(p => p.string === string && p.fret === fret);
      return already
        ? prev.filter(p => !(p.string === string && p.fret === fret))
        : [...prev, { string, fret }];
    });
  };

  // Cordes a vide qui SONNENT dans la forme demandee : on ne peut pas
  // "presser" une corde a vide, et rien ne la distingue visuellement d'une
  // case a presser sur un manche tactile. Cliquer dessus est donc un
  // reflexe legitime — on ignore ce clic au lieu de le compter comme une
  // erreur (meme logique que les positions neutres de validate()).
  const neutralPositions = question.concept?.neutralPositions || [];
  const stripNeutral = (sel) => sel.filter(
    s => !neutralPositions.some(n => n.string === s.string && n.fret === s.fret)
  );

  const verify = () => {
    if (revealed) return;
    setRevealed(true);
    const result = checkQuizCompletion(stripNeutral(quizSelected), targetPositions);
    onComplete(result);
  };

  // Le parent peut demander la révélation depuis l'extérieur (ex: bouton
  // "je ne sais pas" externe) — même mécanique que Vérifier, sur la
  // sélection en cours (vide si rien n'a été touché). Montre les bonnes
  // positions sur le manche plutôt que de laisser l'utilisateur sans
  // aucun retour visuel.
  useEffect(() => {
    if (forceReveal && !revealed) verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceReveal]);

  const result = revealed ? checkQuizCompletion(stripNeutral(quizSelected), targetPositions) : null;

  return (
    <CadreManche>
      {/* Header */}
      <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap", minHeight: 28 }}>
          <Eyebrow tone="amber">Manche interactif</Eyebrow>
          {question.hint && !revealed && !showHint && (
            <Button variant="ghost" size="sm" icon="bulb" onClick={() => setShowHint(true)} style={{ padding: 0 }}>
              Afficher un indice
            </Button>
          )}
        </div>
        {question.hint && (revealed || showHint) && (
          <div className="gr-in" style={{ fontSize: 12, color: C.text2, marginTop: 2, lineHeight: 1.45 }}>{question.hint}</div>
        )}
      </div>

      {/* Fretboard */}
      <div style={{ padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch", background: C.surface2 }}>
        <FretboardQuizCanvas
          targetPositions={targetPositions}
          contextPositions={contextPositions}
          selected={quizSelected}
          revealed={revealed}
          locked={answered}
          onCellClick={handleCellClick}
          question={question}
        />
      </div>

      {/* Contrôles */}
      {!answered && (
        <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text2, fontVariantNumeric: "tabular-nums" }}>
            {revealed
              ? `${result.found}/${result.total} correct${result.extras > 0 ? ` · ${result.extras} erreur${result.extras > 1 ? "s" : ""}` : ""}`
              : `${quizSelected.length} sélectionné${quizSelected.length > 1 ? "s" : ""}`
            }
          </div>
          {!revealed && (
            <div style={{ display: "flex", gap: 8 }}>
              {/* Sans sélection, « Vérifier » reste actif (il révèle la
                  réponse) : il passe simplement en retrait, sans être désactivé. */}
              <Button variant={quizSelected.length > 0 ? "primary" : "secondary"} onClick={verify} style={{ flex: 1 }}>
                Vérifier
              </Button>
              <Button variant="secondary" onClick={() => setQuizSelected([])}>Reset</Button>
            </div>
          )}
        </div>
      )}
    </CadreManche>
  );
}

// ── Canvas interne du quiz fretboard ────────────────────────────────────────
function FretboardQuizCanvas({ targetPositions, contextPositions, selected, revealed, locked, onCellClick, question }) {
  const C = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(C), [C]);
  // En mode quiz, on ne compacte JAMAIS : c'est le moment où une erreur de
  // visée coûte le plus cher. 44 px de haut = recommandation Apple.
  const DOT = 26;

  // Map pour lookup rapide
  const targetMap = useMemo(() => {
    const m = {};
    targetPositions.forEach(p => { m[`${p.string}-${p.fret}`] = true; });
    return m;
  }, [targetPositions]);

  const contextMap = useMemo(() => {
    const m = {};
    contextPositions.forEach(p => { m[`${p.string}-${p.fret}`] = p; });
    return m;
  }, [contextPositions]);

  const isSel = (s, f) => selected.some(p => p.string === s && p.fret === f);

  // Noms orthographiés : selon l'accord ou la gamme de contexte s'il y en a
  // un, sinon selon l'orthographe de la note cible (« Bb » → Sib).
  const nomsQuestion = useMemo(() => {
    const fretMode = question?.fretMode || question?.concept?.type;
    const root = question?.root || question?.concept?.root;
    if (fretMode === "find_chord" && root && question.chord) return carteNoms(root, { accord: question.chord });
    if (fretMode === "find_scale_root" && root && question.scale) return carteNoms(root, { gamme: question.scale });
    const cible = question?.target || root;
    return cible ? new Map([[normalizeNote(cible), nomEcrit(cible)]]) : null;
  }, [question]);

  function renderDot(s, f) {
    const key = `${s}-${f}`;
    const isSelected = isSel(s, f);
    const isTarget = targetMap[key];
    const ctx = contextMap[key];
    const note = getNoteAtPosition(s, f);
    const dot = (col, anim) => <PastilleDense label={nomsQuestion?.get(note) ?? noteToFr(note)} color={col} size={DOT} anim={anim} />;

    if (revealed) {
      if (isTarget && isSelected) return dot(NOTE_COLORS.correct, ANIM.correct);
      if (isTarget && !isSelected) return dot(NOTE_COLORS.missed, ANIM.missed);
      if (!isTarget && isSelected) return dot(NOTE_COLORS.wrong, ANIM.wrong);
      // Note de contexte (accord/gamme) visible mais pas la cible
      if (ctx && !isTarget) return dot(NOTE_COLORS.other);
      return null;
    }

    if (isSelected) return dot(NOTE_COLORS.selected, ANIM.selected);

    // Contexte toujours visible (pour find_chord, find_scale_root)
    if (ctx && !isTarget) return dot(NOTE_COLORS.other);

    return null;
  }

  const interactive = !revealed && !locked;
  const consigne = question?.q ? ` : ${question.q}` : "";

  return (
    <FretGrid
      frets={Array.from({ length: 12 }, (_, i) => i + 1)}
      cellW={TAP.fretW} cellH={TAP.fret} openW={34} labelW={26}
      variant="dense"
      renderCell={renderDot}
      interactive={interactive}
      onCellClick={onCellClick}
      isCellSelected={isSel}
      ariaLabel={interactive ? `Manche interactif${consigne}` : `Manche, correction affichée${consigne}`}
    />
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// FRETBOARD EXERCISE — composant multi-stages pour ExerciseDetail
//
// Reçoit un exercice { type: "fretboard_exercise", stages: [...] }
// et gère le flow stage par stage avec validation via fretboardValidator.
//
// Usage dans App.jsx ExerciseDetail :
//   case "fretboard_exercise": return <FretboardExercise ex={ex} onComplete={finish} dispatch={dispatch} />
// ═══════════════════════════════════════════════════════════════════════════
import { validate, getTargetPositions } from "./fretboardValidator.js";

export function FretboardExercise({ ex, onComplete, dispatch }) {
  const C = useC();
  const [stageIdx, setStageIdx] = useState(0);
  const [stageSelected, setStageSelected] = useState([]);
  const [stageRevealed, setStageRevealed] = useState(false);
  const [stageResult, setStageResult] = useState(null);
  const [totalXp, setTotalXp] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
  const [allDone, setAllDone] = useState(false);

  const stage = ex.stages[stageIdx];
  const isLast = stageIdx === ex.stages.length - 1;

  // Positions cibles pour ce stage
  const targetPositions = useMemo(() => {
    if (!stage) return [];
    return getTargetPositions(stage.concept, {
      fretRange: stage.fretRange || [0, 12],
      stringRange: stage.stringRange || [1, 6],
    });
  }, [stage]);

  // Map pour lookup rapide
  const targetMap = useMemo(() => {
    const m = {};
    targetPositions.forEach(p => { m[`${p.string}-${p.fret}`] = p; });
    return m;
  }, [targetPositions]);

  const handleCellClick = useCallback((string, fret) => {
    if (stageRevealed) return;
    const already = stageSelected.some(p => p.string === string && p.fret === fret);
    setStageSelected(prev =>
      already ? prev.filter(p => !(p.string === string && p.fret === fret))
              : [...prev, { string, fret }]
    );
  }, [stageRevealed, stageSelected]);

  const handleVerify = () => {
    const result = validate(
      stage.concept,
      stageSelected,
      stage.selectionRules || { mode: "all" },
      {
        fretRange: stage.fretRange || [0, 12],
        stringRange: stage.stringRange || [1, 6],
      }
    );
    setStageResult(result);
    setStageRevealed(true);
    if (result.complete) {
      const xp = stage.xp || 15;
      setTotalXp(prev => prev + xp);
      dispatch?.({ type: "ADD_XP", amount: xp });
    }
  };

  const handleNext = () => {
    const updatedStages = [...completedStages, { stageIdx, result: stageResult }];
    setCompletedStages(updatedStages);
    if (isLast) {
      setAllDone(true);
      onComplete?.({ totalXp, stages: updatedStages });
    } else {
      setStageIdx(i => i + 1);
      setStageSelected([]);
      setStageRevealed(false);
      setStageResult(null);
    }
  };

  const handleSkip = () => {
    const updatedStages = [...completedStages, { stageIdx, result: null, skipped: true }];
    setCompletedStages(updatedStages);
    if (isLast) { setAllDone(true); onComplete?.({ totalXp, stages: updatedStages }); }
    else { setStageIdx(i => i + 1); setStageSelected([]); setStageRevealed(false); setStageResult(null); }
  };

  if (allDone) {
    return (
      <Card tone="green" soft pad="24px 16px" className="gr-in-pop"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div className="gr-tada" style={{ marginBottom: 8 }}>
          <IconTile icon="trophy" tone="green" solid size={52} />
        </div>
        <div style={{ fontSize: T.h3, fontWeight: 800, color: C.greenD }}>Exercice terminé !</div>
        <div style={{ fontSize: T.small, fontWeight: 700, color: C.greenD, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
          +<AnimatedNumber value={totalXp} /> XP gagnés
        </div>
        <div style={{ fontSize: 12, color: C.text2, marginTop: 8 }}>
          {completedStages.filter(s => s.result?.complete).length}/{ex.stages.length} stages réussis
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Progress stages */}
      <div style={{ display: "flex", gap: 4 }}>
        {ex.stages.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: R.pill,
            background: i < stageIdx ? C.green
                      : i === stageIdx ? C.primary
                      : C.border,
            transition: "background-color var(--gr-dur-slow) ease",
          }} />
        ))}
      </div>

      {/* Header stage */}
      <Card pad="10px 14px">
        <Eyebrow tone="amber">🎸 Étape {stageIdx + 1} / {ex.stages.length}</Eyebrow>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginTop: 4, lineHeight: 1.4 }}>
          {stage.instruction}
        </div>
        {stage.hint && !stageRevealed && (
          <div style={{ fontSize: T.micro, color: C.text3, marginTop: 4, fontStyle: "italic" }}>
            💡 {stage.hint}
          </div>
        )}
        <div style={{ marginTop: 6 }}>
          <Tag tone="primary">+{stage.xp || 15} XP</Tag>
        </div>
      </Card>

      {/* Manche */}
      <CadreManche>
        <div style={{ padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch", background: C.surface2 }}>
          <ExerciseCanvas
            stage={stage}
            targetPositions={targetPositions}
            targetMap={targetMap}
            selected={stageSelected}
            revealed={stageRevealed}
            onCellClick={handleCellClick}
          />
        </div>
      </CadreManche>

      {/* Feedback post-vérification */}
      {stageRevealed && stageResult && (
        <EncartResultat reussi={stageResult.complete}>
          {stageResult.feedback}
          {stage.exp && <div style={{ marginTop: 4, opacity: 0.85 }}>{stage.exp}</div>}
        </EncartResultat>
      )}

      {/* Contrôles */}
      <div style={{ display: "flex", gap: 8 }}>
        {!stageRevealed ? (
          <>
            <Button onClick={handleVerify} disabled={stageSelected.length === 0} style={{ flex: 1 }}>
              Vérifier · {stageSelected.length} sélectionné{stageSelected.length > 1 ? "s" : ""}
            </Button>
            <Button variant="secondary" onClick={() => setStageSelected([])}>Reset</Button>
            <Button variant="ghost" onClick={handleSkip}>Passer</Button>
          </>
        ) : (
          <Button onClick={handleNext} style={{ flex: 1 }}>
            {isLast ? "Terminer l'exercice" : "Étape suivante →"}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Canvas du manche pour FretboardExercise ──────────────────────────────────
// Épaisseurs propres au canvas d'exercice (cordes 3 et 4 un peu plus épaisses
// que sur <Fretboard />) — conservées telles quelles pour ne rien changer au rendu.
const EPAISSEURS_EXERCICE = { 1: 1, 2: 1.5, 3: 2, 4: 2.5, 5: 2.5, 6: 3 };

function ExerciseCanvas({ stage, targetMap, selected, revealed, onCellClick }) {
  const C = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(C), [C]);
  const DOT = 26;
  const MAX_F = (stage.fretRange || [0, 12])[1];
  const MIN_F = (stage.fretRange || [0, 12])[0];

  // Positions de contexte à afficher en fond (gamme/accord de contexte)
  const contextPositions = useMemo(() => {
    if (!stage.display?.showContext) return [];
    const ctx = stage.display.showContext;
    return getTargetPositions(ctx, {
      fretRange: stage.fretRange || [0, 12],
      stringRange: stage.stringRange || [1, 6],
    });
  }, [stage]);

  const contextMap = useMemo(() => {
    const m = {};
    contextPositions.forEach(p => { m[`${p.string}-${p.fret}`] = p; });
    return m;
  }, [contextPositions]);

  const isSel = (s, f) => selected.some(p => p.string === s && p.fret === f);

  function renderDot(s, f) {
    const key = `${s}-${f}`;
    const note = getNoteAtPosition(s, f);
    const isSelected = isSel(s, f);
    const isTarget = !!targetMap[key];
    const isContext = !!contextMap[key];
    const { showNotes, showIntervals, showDegrees } = stage.display || {};
    const dot = (lbl, col, opacity, anim) => <PastilleDense label={lbl} color={col} size={DOT} opacity={opacity} anim={anim} />;

    // Label de la note
    const getLabel = (pos) => {
      if (showNotes) return noteToFr(note);
      if (showIntervals && pos?.interval != null) return INTERVAL_NAMES[pos.interval]?.short ?? "";
      if (showDegrees && pos?.degree) return String(pos.degree);
      return noteToFr(note);
    };

    if (revealed) {
      const tPos = targetMap[key];
      if (isTarget && isSelected) return dot(getLabel(tPos), NOTE_COLORS.correct, 1, ANIM.correct);
      if (isTarget && !isSelected) return dot(getLabel(tPos), NOTE_COLORS.missed, 1, ANIM.missed);
      if (!isTarget && isSelected) return dot(noteToFr(note), NOTE_COLORS.wrong, 1, ANIM.wrong);
      if (isContext) return dot(getLabel(contextMap[key]), NOTE_COLORS.other, 0.4);
      return null;
    }

    if (isSelected) return dot(noteToFr(note), NOTE_COLORS.selected, 1, ANIM.selected);
    // Affichage contexte (gamme/accord de fond)
    if (isContext && !isTarget) return dot(getLabel(contextMap[key]), NOTE_COLORS.other, 0.5);
    // Affichage notes visibles si showNotes
    if (showNotes) {
      return dot(noteToFr(note), { bg: C.surface2, text: C.text3, border: C.border });
    }
    return null;
  }

  // Cases MIN_F+1 … MAX_F ; la case 0 (à vide) n'existe que si MIN_F === 0.
  // Avant l'extraction, la ligne des numéros gardait la colonne « à vide »
  // même quand MIN_F > 0 (ex. fretRange [4, 9]) : tous les numéros étaient
  // décalés d'une colonne par rapport aux cases. Corrigé par FretGrid.
  const frets = Array.from({ length: MAX_F - MIN_F }, (_, i) => MIN_F + i + 1);
  const consigne = stage.instruction ? ` : ${stage.instruction}` : "";

  return (
    <FretGrid
      frets={frets}
      showOpen={MIN_F === 0}
      cellW={TAP.fretW} cellH={TAP.fret} openW={34} labelW={26}
      variant="dense"
      epaisseurs={EPAISSEURS_EXERCICE}
      renderCell={renderDot}
      interactive={!revealed}
      onCellClick={onCellClick}
      isCellSelected={isSel}
      ariaLabel={!revealed ? `Manche interactif${consigne}` : `Manche, correction affichée${consigne}`}
    />
  );
}
