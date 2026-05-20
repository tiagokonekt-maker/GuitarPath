// ═══════════════════════════════════════════════════════════════════════════
// GuitarPath — Fretboard.jsx
// Composant manche interactif, mobile-first.
// Usage : import { Fretboard } from "./Fretboard.jsx"
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useMemo, useCallback } from "react";
import {
  getNoteAtPosition,
  getScalePositions,
  getChordPositions,
  getHighlightPositions,
  getQuizTargetPositions,
  isCorrectPosition,
  checkQuizCompletion,
  MARKER_FRETS,
  DOUBLE_MARKER_FRETS,
  SCALES,
  CHORD_TYPES,
  INTERVAL_NAMES,
  noteToFr,
  normalizeNote,
} from "./fretboardUtils.js";

// ───────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — cohérence stricte avec App.jsx
// ───────────────────────────────────────────────────────────────────────────
const C = {
  primary:  "#7F77DD",  primaryL:  "#EEEDFE",  primaryD:  "#3C3489",
  green:    "#1D9E75",  greenL:    "#E1F5EE",   greenD:    "#085041",
  amber:    "#BA7517",  amberL:    "#FAEEDA",   amberD:    "#633806",
  coral:    "#D85A30",  coralL:    "#FAECE7",   coralD:    "#712B13",
  blue:     "#185FA5",  blueL:     "#E6F1FB",   blueD:     "#042C53",
  text:     "#1F1B2E",
  muted:    "#6B6880",
  bg:       "#FFFFFF",
  bgSec:    "#F5F4FA",
  border:   "#E5E3F0",
};

const FONTS = {
  title:    '"Clarendon LT", "Clarendon", "Playfair Display", Georgia, serif',
  ui:       '"Inter", "Helvetica Neue", -apple-system, sans-serif',
  body:     'Georgia, "Times New Roman", serif',
};

// ───────────────────────────────────────────────────────────────────────────
// PALETTE DES NOTES ACTIVES
// Les couleurs s'appliquent selon le rôle de la note (root, 3rd, 5th, etc.)
// ───────────────────────────────────────────────────────────────────────────
const NOTE_COLORS = {
  root:     { bg: C.amber,   text: "#fff",    border: C.amberD  },
  third:    { bg: C.primary, text: "#fff",    border: C.primaryD },
  fifth:    { bg: C.green,   text: "#fff",    border: C.greenD  },
  seventh:  { bg: C.coral,   text: "#fff",    border: C.coralD  },
  other:    { bg: C.blue,    text: "#fff",    border: C.blueD   },
  selected: { bg: C.primary, text: "#fff",    border: C.primaryD },
  correct:  { bg: C.green,   text: "#fff",    border: C.greenD  },
  wrong:    { bg: C.coral,   text: "#fff",    border: C.coralD  },
  missed:   { bg: C.amber,   text: "#fff",    border: C.amberD  },
};

// Mapping degré → couleur (pour gammes 7 notes)
function colorForDegree(degree, isRoot) {
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
function getNoteLabel(note, interval, degree, displayMode, lang = "fr") {
  switch (displayMode) {
    case "notes":
      return lang === "fr" ? noteToFr(note) : note;
    case "intervals":
      return INTERVAL_NAMES[interval]?.short ?? "?";
    case "degrees":
      // Si on a un degré valide, l'affiche ; sinon fallback sur l'intervalle court
      if (degree != null && degree > 0) return String(degree);
      if (interval != null) return INTERVAL_NAMES[interval]?.short ?? "?";
      return "?";
    default:
      return lang === "fr" ? noteToFr(note) : note;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPOSANTS
// ═══════════════════════════════════════════════════════════════════════════

// ── Pastille de note sur le manche ──────────────────────────────────────────
function NoteMarker({ label, color, size = 28, style = {} }) {
  return (
    <div style={{
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
      fontFamily: FONTS.ui,
      letterSpacing: "-0.02em",
      flexShrink: 0,
      userSelect: "none",
      boxShadow: `0 2px 4px ${color.border}40`,
      transition: "transform 0.1s ease",
      ...style,
    }}>
      {label}
    </div>
  );
}

// ── Repère visuel (point incrusté) ──────────────────────────────────────────
function FretMarker({ fret, isDouble }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: isDouble ? 6 : 0,
      height: 10,
      marginTop: 2,
    }}>
      {isDouble ? (
        <>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.border }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.border }} />
        </>
      ) : (
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.border }} />
      )}
    </div>
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
}) {
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
      const key = `${string}-${fret}`;
      const already = quizSelected.some(p => p.string === string && p.fret === fret);
      const next = already
        ? quizSelected.filter(p => !(p.string === string && p.fret === fret))
        : [...quizSelected, { string, fret }];

      setQuizSelected(next);
      onQuizProgress?.({ selected: next, correct: activePositions });

      const result = checkQuizCompletion(next, activePositions);
      if (result.complete) {
        onQuizComplete?.(result);
      }
      return;
    }

    onNoteClick?.({ string, fret, note });
  }, [mode, quizRevealed, quizSelected, activePositions, onNoteClick, onQuizProgress, onQuizComplete]);

  // ── Layout du manche ────────────────────────────────────────────────────
  const fretRange = [];
  for (let f = startFret; f <= endFret; f++) fretRange.push(f);

  // Cordes : 6 (Mi grave) → 1 (Mi aigu) — affichage de gauche à droite en orientation portrait
  // En affichage portrait (mobile), les cordes sont en lignes horizontales (6 en haut = Mi grave)
  const strings = [1, 2, 3, 4, 5, 6];

  // ── Tailles adaptées au mode compact ────────────────────────────────────
  const cellW  = compact ? 38 : 46;
  const cellH  = compact ? 32 : 40;
  const dotSz  = compact ? 22 : 28;
  const openW  = compact ? 30 : 36;
  const labelW = compact ? 22 : 28;

  // ── Styles communs ───────────────────────────────────────────────────────
  const stringNameStyle = {
    width: labelW,
    height: cellH,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: compact ? 9 : 10,
    fontWeight: 700,
    color: C.muted,
    fontFamily: FONTS.ui,
    flexShrink: 0,
  };

  const STRING_LABELS = { 6: "E₂", 5: "A₂", 4: "D₃", 3: "G₃", 2: "B₃", 1: "E₄" };

  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {/* Scroll horizontal sur mobile */}
      <div style={{
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        paddingBottom: 4,
        // Cache la scrollbar sur webkit (reste accessible)
        scrollbarWidth: "thin",
        scrollbarColor: `${C.border} transparent`,
      }}>
        <div style={{ minWidth: "fit-content", paddingBottom: 2 }}>

          {/* ── Numéros de cases ────────────────────────────────────── */}
          {showFretNumbers && (
            <div style={{ display: "flex", marginBottom: 2 }}>
              {/* Espace pour le label de corde */}
              {showStringNames && <div style={{ width: labelW, flexShrink: 0 }} />}
              {/* Espace pour les cordes à vide */}
              {showOpenStrings && <div style={{ width: openW, flexShrink: 0 }} />}

              {fretRange.filter(f => f > 0).map(f => (
                <div key={f} style={{
                  width: cellW,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 9,
                  color: C.muted,
                  fontFamily: FONTS.ui,
                  fontWeight: f % 12 === 0 ? 700 : 400,
                  flexShrink: 0,
                }}>
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* ── Corps du manche ─────────────────────────────────────── */}
          {strings.map((s, sIdx) => (
            <div key={s} style={{ display: "flex", alignItems: "center", position: "relative" }}>

              {/* Label de corde */}
              {showStringNames && (
                <div style={stringNameStyle}>{STRING_LABELS[s]}</div>
              )}

              {/* Cordes à vide */}
              {showOpenStrings && (
                <div
                  onClick={() => handleCellClick(s, 0)}
                  style={{
                    width: openW,
                    height: cellH,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    position: "relative",
                    cursor: (mode === "quiz" || onNoteClick) ? "pointer" : "default",
                  }}
                  onMouseEnter={e => {
                    if (mode === "quiz" || onNoteClick) {
                      e.currentTarget.style.background = `${C.primary}08`;
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Ligne de corde */}
                  <div style={{
                    position: "absolute",
                    left: 0, right: 0,
                    top: "50%",
                    height: getStringThickness(s),
                    background: C.border,
                    transform: "translateY(-50%)",
                  }} />
                  {/* Note à vide */}
                  <div style={{ position: "relative", zIndex: 2 }}>
                    {renderCell(s, 0)}
                  </div>
                </div>
              )}

              {/* Cases du manche */}
              {fretRange.filter(f => f > 0).map((f, fIdx) => {
                const isFirstFret = fIdx === 0;
                const isLastFret = f === endFret;
                return (
                  <div
                    key={f}
                    onClick={() => handleCellClick(s, f)}
                    style={{
                      width: cellW,
                      height: cellH,
                      position: "relative",
                      flexShrink: 0,
                      cursor: (mode === "quiz" || onNoteClick) ? "pointer" : "default",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Filet de gauche (plus épais pour le sillet) */}
                    <div style={{
                      position: "absolute",
                      left: 0, top: 0, bottom: 0,
                      width: isFirstFret ? 3 : 1,
                      background: isFirstFret ? C.text : C.border,
                    }} />

                    {/* Ligne de corde (horizontale) */}
                    <div style={{
                      position: "absolute",
                      left: 0, right: 0,
                      top: "50%",
                      height: getStringThickness(s),
                      background: C.border,
                      transform: "translateY(-50%)",
                      zIndex: 0,
                    }} />

                    {/* Zone cliquable + feedback hover */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                    }}
                      onMouseEnter={e => {
                        if (mode === "quiz" || onNoteClick) {
                          e.currentTarget.style.background = `${C.primary}08`;
                        }
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    />

                    {/* Pastille de note */}
                    <div style={{ position: "relative", zIndex: 2 }}>
                      {renderCell(s, f)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* ── Repères visuels (points sous le manche) ──────────────── */}
          <div style={{ display: "flex", marginTop: 0 }}>
            {showStringNames && <div style={{ width: labelW, flexShrink: 0 }} />}
            {showOpenStrings && <div style={{ width: openW, flexShrink: 0 }} />}
            {fretRange.filter(f => f > 0).map(f => (
              <div key={f} style={{ width: cellW, flexShrink: 0 }}>
                {MARKER_FRETS.includes(f) && <FretMarker fret={f} isDouble={false} />}
                {DOUBLE_MARKER_FRETS.includes(f) && <FretMarker fret={f} isDouble={true} />}
              </div>
            ))}
          </div>

        </div>
      </div>

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
          return <NoteMarker label={lang === "fr" ? noteToFr(note) : note} color={NOTE_COLORS.correct} size={dotSz} />;
        }
        if (isCorrect && !isSelected) {
          const note = getNoteAtPosition(s, f);
          return <NoteMarker label={lang === "fr" ? noteToFr(note) : note} color={NOTE_COLORS.missed} size={dotSz} />;
        }
        if (!isCorrect && isSelected) {
          const note = getNoteAtPosition(s, f);
          return <NoteMarker label={lang === "fr" ? noteToFr(note) : note} color={NOTE_COLORS.wrong} size={dotSz} />;
        }
        return null;
      }

      if (isSelected) {
        const note = getNoteAtPosition(s, f);
        return <NoteMarker label={lang === "fr" ? noteToFr(note) : note} color={NOTE_COLORS.selected} size={dotSz} />;
      }
      return null;
    }

    // Positions externes contrôlées
    if (externalSelected) {
      const isExt = externalSelected.some(p => p.string === s && p.fret === f);
      if (isExt) {
        const note = getNoteAtPosition(s, f);
        return <NoteMarker label={lang === "fr" ? noteToFr(note) : note} color={NOTE_COLORS.selected} size={dotSz} />;
      }
    }

    // Mode visualisation
    if (!pos) return null;

    const label = getNoteLabel(pos.note, pos.interval, pos.degree, displayMode, lang);
    const color = pos.isRoot
      ? NOTE_COLORS.root
      : colorForDegree(pos.degree, false);

    return (
      <NoteMarker
        label={label}
        color={color}
        size={dotSz}
        style={onNoteClick ? { cursor: "pointer" } : {}}
      />
    );
  }
}

// ───────────────────────────────────────────────────────────────────────────
// ÉPAISSEUR DES CORDES (esthétique)
// ───────────────────────────────────────────────────────────────────────────
function getStringThickness(string) {
  // Corde 6 = Mi grave (la plus épaisse), corde 1 = Mi aigu (la plus fine)
  const thicknesses = { 6: 3, 5: 2.5, 4: 2, 3: 1.5, 2: 1.5, 1: 1 };
  return thicknesses[string] || 1.5;
}

// ───────────────────────────────────────────────────────────────────────────
// QUIZ CONTROLS
// ───────────────────────────────────────────────────────────────────────────
function QuizControls({ selected, correct, revealed, target, lang, onReveal, onReset }) {
  const result = checkQuizCompletion(selected, correct);
  const label = lang === "fr" ? noteToFr(target) : target;

  return (
    <div style={{
      marginTop: 12,
      padding: "12px 14px",
      background: C.bgSec,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
    }}>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: C.text,
        fontFamily: FONTS.ui,
        marginBottom: 8,
      }}>
        🎯 Trouve tous les <strong>{label}</strong>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          fontSize: 12,
          color: C.muted,
          fontFamily: FONTS.ui,
          flex: 1,
        }}>
          {revealed
            ? `${result.found}/${result.total} trouvé${result.found > 1 ? "s" : ""} · ${result.extras} fausse${result.extras > 1 ? "s" : ""} note${result.extras > 1 ? "s" : ""}`
            : `${selected.length} sélectionné${selected.length > 1 ? "s" : ""}`
          }
        </div>

        {!revealed && (
          <button
            onClick={onReveal}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "none",
              background: C.primary,
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: FONTS.ui,
            }}
          >
            Vérifier
          </button>
        )}

        <button
          onClick={onReset}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: C.bg,
            color: C.muted,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: FONTS.ui,
          }}
        >
          Reset
        </button>
      </div>

      {revealed && (
        <div style={{
          marginTop: 10,
          padding: "8px 10px",
          borderRadius: 8,
          background: result.complete ? C.greenL : C.amberL,
          fontSize: 12,
          color: result.complete ? C.greenD : C.amberD,
          fontFamily: FONTS.body,
          lineHeight: 1.5,
        }}>
          {result.complete
            ? "✅ Parfait ! Tu as trouvé toutes les positions."
            : `🟡 ${result.misses} position${result.misses > 1 ? "s" : ""} manquante${result.misses > 1 ? "s" : ""} (en orange). ${result.extras > 0 ? `${result.extras} erreur${result.extras > 1 ? "s" : ""} (en rouge).` : ""}`
          }
        </div>
      )}
    </div>
  );
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
  const [displayMode, setDisplayMode] = useState(block.displayMode || "notes");
  const [quizDone, setQuizDone] = useState(false);

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
    ? (block.lang === "en" ? block.root : noteToFr(block.root))
    : "";

  return (
    <div style={{
      background: C.bgSec,
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      overflow: "hidden",
      marginBottom: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 14px 8px",
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        flexWrap: "wrap",
      }}>
        <div>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.muted,
            fontFamily: FONTS.ui,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            🎸 {rootLabel} {modeLabel}
          </div>
          {block.caption && (
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: C.text,
              fontFamily: FONTS.ui,
              marginTop: 2,
            }}>
              {block.caption}
            </div>
          )}
        </div>

        {/* Sélecteur de mode d'affichage (sauf quiz) */}
        {block.mode !== "quiz" && (
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { key: "notes",     label: "Notes" },
              { key: "intervals", label: "Intervalles" },
              { key: "degrees",   label: "Degrés" },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setDisplayMode(m.key)}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: `1px solid ${displayMode === m.key ? C.primary : C.border}`,
                  background: displayMode === m.key ? C.primaryL : C.bg,
                  color: displayMode === m.key ? C.primaryD : C.muted,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONTS.ui,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fretboard */}
      <div style={{ padding: "10px 8px" }}>
        <Fretboard
          {...props}
          displayMode={displayMode}
          lang={block.lang || "fr"}
          compact={block.compact ?? true}
          onQuizComplete={block.mode === "quiz" ? () => setQuizDone(true) : undefined}
        />
      </div>

      {/* Succès quiz */}
      {quizDone && (
        <div style={{
          padding: "8px 14px 12px",
          textAlign: "center",
          fontSize: 13,
          color: C.greenD,
          fontFamily: FONTS.body,
        }}>
          🏆 Toutes les positions trouvées ! +XP
        </div>
      )}
    </div>
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
export function FretboardQuizQuestion({ question, onComplete, answered }) {
  const [quizSelected, setQuizSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);

  // Réinitialiser quand la question change
  const questionKey = question.id;
  const [lastKey, setLastKey] = useState(questionKey);
  if (lastKey !== questionKey) {
    setQuizSelected([]);
    setRevealed(false);
    setLastKey(questionKey);
  }

  // Calculer les positions cibles selon le fretMode
  const targetPositions = useMemo(() => {
    const { fretMode, target, root, scale, chord } = question;
    if (fretMode === "find_note" && target) {
      return getQuizTargetPositions(target);
    }
    if (fretMode === "find_root" && root) {
      return getQuizTargetPositions(root);
    }
    if (fretMode === "find_chord" && root && chord) {
      // Pour un accord : on demande de trouver les fondamentales
      return getQuizTargetPositions(root);
    }
    if (fretMode === "find_scale_root" && root) {
      return getQuizTargetPositions(root);
    }
    return [];
  }, [question.id]);

  // Positions de contexte à afficher (pour find_chord, find_scale_root)
  const contextPositions = useMemo(() => {
    const { fretMode, root, scale, chord } = question;
    if (fretMode === "find_chord" && root && chord) {
      return getChordPositions(root, chord, 12);
    }
    if (fretMode === "find_scale_root" && root && scale) {
      return getScalePositions(root, scale, 12);
    }
    return [];
  }, [question.id]);

  const handleCellClick = (string, fret) => {
    if (revealed || answered) return;
    const note = getNoteAtPosition(string, fret);
    const already = quizSelected.some(p => p.string === string && p.fret === fret);
    const next = already
      ? quizSelected.filter(p => !(p.string === string && p.fret === fret))
      : [...quizSelected, { string, fret }];
    setQuizSelected(next);
  };

  const verify = () => {
    if (revealed) return;
    setRevealed(true);
    const result = checkQuizCompletion(quizSelected, targetPositions);
    onComplete(result);
  };

  const result = revealed ? checkQuizCompletion(quizSelected, targetPositions) : null;

  return (
    <div style={{ background: C.bgSec, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "8px 14px 6px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, fontFamily: FONTS.ui, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          🎸 Manche interactif
        </div>
        {question.hint && (
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontFamily: FONTS.ui }}>{question.hint}</div>
        )}
      </div>

      {/* Fretboard */}
      <div style={{ padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <FretboardQuizCanvas
          targetPositions={targetPositions}
          contextPositions={contextPositions}
          selected={quizSelected}
          revealed={revealed}
          onCellClick={handleCellClick}
          compact={true}
          question={question}
        />
      </div>

      {/* Contrôles */}
      {!answered && (
        <div style={{ padding: "6px 12px 10px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, fontSize: 11, color: C.muted, fontFamily: FONTS.ui }}>
            {revealed
              ? `${result.found}/${result.total} correct${result.extras > 0 ? ` · ${result.extras} erreur${result.extras > 1 ? "s" : ""}` : ""}`
              : `${quizSelected.length} sélectionné${quizSelected.length > 1 ? "s" : ""}`
            }
          </div>
          {!revealed && (
            <button
              onClick={verify}
              style={{
                padding: "7px 14px", borderRadius: 8, border: "none",
                background: quizSelected.length > 0 ? C.primary : C.bgSec,
                color: quizSelected.length > 0 ? "#fff" : C.muted,
                fontSize: 11, fontWeight: 700, cursor: quizSelected.length > 0 ? "pointer" : "default",
                fontFamily: FONTS.ui,
              }}
            >
              Vérifier
            </button>
          )}
          {!revealed && (
            <button
              onClick={() => setQuizSelected([])}
              style={{
                padding: "7px 10px", borderRadius: 8,
                border: `1px solid ${C.border}`, background: C.bg,
                color: C.muted, fontSize: 11, cursor: "pointer", fontFamily: FONTS.ui,
              }}
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Canvas interne du quiz fretboard ────────────────────────────────────────
function FretboardQuizCanvas({ targetPositions, contextPositions, selected, revealed, onCellClick, compact, question }) {
  const CW = 36, CH = 28, OW = 26, LW = 20, DOT = 20;
  const strings = [1, 2, 3, 4, 5, 6];
  const MAX_F = 12;
  const SLABELS = { 6: "E₂", 5: "A₂", 4: "D₃", 3: "G₃", 2: "B₃", 1: "E₄" };
  const MARKERS = [3, 5, 7, 9];

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

  function renderDot(s, f) {
    const key = `${s}-${f}`;
    const isSelected = selected.some(p => p.string === s && p.fret === f);
    const isTarget = targetMap[key];
    const ctx = contextMap[key];

    if (revealed) {
      if (isTarget && isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.correct, DOT);
      if (isTarget && !isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.missed, DOT);
      if (!isTarget && isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.wrong, DOT);
      if (ctx && !isTarget) {
        // Note de contexte (accord/gamme) visible mais pas la cible
        return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.other, DOT);
      }
      return null;
    }

    if (isSelected) return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.selected, DOT);

    // Contexte toujours visible (pour find_chord, find_scale_root)
    if (ctx && !isTarget) {
      return mkDot(noteToFr(getNoteAtPosition(s, f)), NOTE_COLORS.other, DOT);
    }

    return null;
  }

  function mkDot(lbl, col, sz) {
    return (
      <div style={{
        width: sz, height: sz, borderRadius: "50%",
        background: col.bg, border: `1.5px solid ${col.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 7, fontWeight: 700, color: col.text,
        fontFamily: FONTS.ui, position: "relative", zIndex: 2,
        userSelect: "none",
      }}>{lbl}</div>
    );
  }

  const frets = Array.from({ length: MAX_F }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: "fit-content" }}>
      {/* Numéros de cases */}
      <div style={{ display: "flex", marginBottom: 1 }}>
        <div style={{ width: LW, flexShrink: 0 }} />
        <div style={{ width: OW, flexShrink: 0 }} />
        {frets.map(f => (
          <div key={f} style={{ width: CW, flexShrink: 0, textAlign: "center", fontSize: 8, color: C.muted, height: 12, lineHeight: "12px", fontFamily: FONTS.ui, fontWeight: f === 12 ? 700 : 400 }}>{f}</div>
        ))}
      </div>

      {strings.map(s => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: LW, flexShrink: 0, textAlign: "center", fontSize: 8, fontWeight: 700, color: C.muted, fontFamily: FONTS.ui }}>{SLABELS[s]}</div>

          {/* Case 0 — corde à vide */}
          <div
            onClick={() => onCellClick(s, 0)}
            style={{ width: OW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" }}
            onMouseEnter={e => { if (!revealed) e.currentTarget.style.background = `${C.primary}0A`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: getStringThickness(s), background: C.border, transform: "translateY(-50%)" }} />
            <div style={{ position: "relative", zIndex: 2 }}>{renderDot(s, 0)}</div>
          </div>

          {/* Cases 1–12 */}
          {frets.map((f, fi) => (
            <div
              key={f}
              onClick={() => onCellClick(s, f)}
              style={{ width: CW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" }}
              onMouseEnter={e => { if (!revealed) e.currentTarget.style.background = `${C.primary}0A`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: fi === 0 ? 2 : 0.5, background: fi === 0 ? C.text : C.border }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: getStringThickness(s), background: C.border, transform: "translateY(-50%)", zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 2 }}>{renderDot(s, f)}</div>
            </div>
          ))}
        </div>
      ))}

      {/* Repères */}
      <div style={{ display: "flex", marginTop: 1 }}>
        <div style={{ width: LW, flexShrink: 0 }} />
        <div style={{ width: OW, flexShrink: 0 }} />
        {frets.map(f => (
          <div key={f} style={{ width: CW, flexShrink: 0 }}>
            {MARKERS.includes(f) && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border, margin: "2px auto 0" }} />}
            {f === 12 && <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 2 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border }} /><div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border }} /></div>}
          </div>
        ))}
      </div>
    </div>
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
  }, [stageIdx, ex.id]);

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
    setCompletedStages(prev => [...prev, { stageIdx, result: stageResult }]);
    if (isLast) {
      setAllDone(true);
      onComplete?.({ totalXp, stages: completedStages });
    } else {
      setStageIdx(i => i + 1);
      setStageSelected([]);
      setStageRevealed(false);
      setStageResult(null);
    }
  };

  const handleSkip = () => {
    setCompletedStages(prev => [...prev, { stageIdx, result: null, skipped: true }]);
    if (isLast) { setAllDone(true); onComplete?.({ totalXp, stages: completedStages }); }
    else { setStageIdx(i => i + 1); setStageSelected([]); setStageRevealed(false); setStageResult(null); }
  };

  if (allDone) {
    return (
      <div style={{ textAlign: "center", padding: "24px 16px", background: C.greenL, borderRadius: 14, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.greenD, fontFamily: FONTS.ui }}>Exercice terminé !</div>
        <div style={{ fontSize: 13, color: C.green, marginTop: 4, fontFamily: FONTS.ui }}>+{totalXp} XP gagnés</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 8, fontFamily: FONTS.ui }}>
          {completedStages.filter(s => s.result?.complete).length}/{ex.stages.length} stages réussis
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Progress stages */}
      <div style={{ display: "flex", gap: 4 }}>
        {ex.stages.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < stageIdx ? C.green
                      : i === stageIdx ? C.primary
                      : C.border,
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {/* Header stage */}
      <div style={{ background: C.bgSec, borderRadius: 12, border: `1px solid ${C.border}`, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.amber, fontFamily: FONTS.ui, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          🎸 Étape {stageIdx + 1} / {ex.stages.length}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: FONTS.ui, marginTop: 4, lineHeight: 1.4 }}>
          {stage.instruction}
        </div>
        {stage.hint && !stageRevealed && (
          <div style={{ fontSize: 11, color: C.muted, fontFamily: FONTS.ui, marginTop: 4, fontStyle: "italic" }}>
            💡 {stage.hint}
          </div>
        )}
        <div style={{ fontSize: 11, color: C.primary, fontFamily: FONTS.ui, marginTop: 4, fontWeight: 600 }}>
          +{stage.xp || 15} XP
        </div>
      </div>

      {/* Manche */}
      <div style={{ background: C.bgSec, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <ExerciseCanvas
            stage={stage}
            targetPositions={targetPositions}
            targetMap={targetMap}
            selected={stageSelected}
            revealed={stageRevealed}
            onCellClick={handleCellClick}
          />
        </div>
      </div>

      {/* Feedback post-vérification */}
      {stageRevealed && stageResult && (
        <div style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: stageResult.complete ? C.greenL : C.amberL,
          border: `1px solid ${stageResult.complete ? C.border : C.border}`,
          fontSize: 12,
          color: stageResult.complete ? C.greenD : C.amberD,
          fontFamily: FONTS.ui,
          lineHeight: 1.5,
        }}>
          {stageResult.feedback}
          {stage.exp && <div style={{ marginTop: 4, opacity: 0.85 }}>{stage.exp}</div>}
        </div>
      )}

      {/* Contrôles */}
      <div style={{ display: "flex", gap: 8 }}>
        {!stageRevealed ? (
          <>
            <button
              onClick={handleVerify}
              disabled={stageSelected.length === 0}
              style={{
                flex: 1, padding: "12px", borderRadius: 10, border: "none",
                background: stageSelected.length > 0 ? C.primary : C.bgSec,
                color: stageSelected.length > 0 ? "#fff" : C.muted,
                fontSize: 13, fontWeight: 700, cursor: stageSelected.length > 0 ? "pointer" : "default",
                fontFamily: FONTS.ui,
              }}
            >
              Vérifier · {stageSelected.length} sélectionné{stageSelected.length > 1 ? "s" : ""}
            </button>
            <button
              onClick={() => setStageSelected([])}
              style={{
                padding: "12px 14px", borderRadius: 10,
                border: `1px solid ${C.border}`, background: C.bg,
                color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: FONTS.ui,
              }}
            >
              Reset
            </button>
            <button
              onClick={handleSkip}
              style={{
                padding: "12px 14px", borderRadius: 10,
                border: `1px solid ${C.border}`, background: C.bg,
                color: C.muted, fontSize: 11, cursor: "pointer", fontFamily: FONTS.ui,
              }}
            >
              Passer
            </button>
          </>
        ) : (
          <button
            onClick={handleNext}
            style={{
              flex: 1, padding: "12px", borderRadius: 10, border: "none",
              background: C.primary, color: "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONTS.ui,
            }}
          >
            {isLast ? "Terminer l'exercice" : "Étape suivante →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Canvas du manche pour FretboardExercise ──────────────────────────────────
function ExerciseCanvas({ stage, targetPositions, targetMap, selected, revealed, onCellClick }) {
  const CW = 36, CH = 28, OW = 26, LW = 20, DOT = 20;
  const strings = [1, 2, 3, 4, 5, 6];
  const MAX_F = (stage.fretRange || [0, 12])[1];
  const MIN_F = (stage.fretRange || [0, 12])[0];
  const SLABELS = { 6: "E₂", 5: "A₂", 4: "D₃", 3: "G₃", 2: "B₃", 1: "E₄" };
  const MARKERS = [3, 5, 7, 9];

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

  function getStringThicknessLocal(s) {
    return [null, 1, 1.5, 2, 2.5, 2.5, 3][s] || 1.5;
  }

  function renderDot(s, f) {
    const key = `${s}-${f}`;
    const note = getNoteAtPosition(s, f);
    const isSelected = selected.some(p => p.string === s && p.fret === f);
    const isTarget = !!targetMap[key];
    const isContext = !!contextMap[key];
    const { showNotes, showIntervals, showDegrees } = stage.display || {};

    // Label de la note
    const getLabel = (pos) => {
      if (showNotes) return noteToFr(note);
      if (showIntervals && pos?.interval != null) return INTERVAL_NAMES[pos.interval]?.short ?? "";
      if (showDegrees && pos?.degree) return String(pos.degree);
      return noteToFr(note);
    };

    if (revealed) {
      const tPos = targetMap[key];
      if (isTarget && isSelected) return mkDot(getLabel(tPos), NOTE_COLORS.correct, DOT);
      if (isTarget && !isSelected) return mkDot(getLabel(tPos), NOTE_COLORS.missed, DOT);
      if (!isTarget && isSelected) return mkDot(noteToFr(note), NOTE_COLORS.wrong, DOT);
      if (isContext) return mkDot(getLabel(contextMap[key]), NOTE_COLORS.other, DOT, 0.4);
      return null;
    }

    if (isSelected) return mkDot(noteToFr(note), NOTE_COLORS.selected, DOT);
    // Affichage contexte (gamme/accord de fond)
    if (isContext && !isTarget) return mkDot(getLabel(contextMap[key]), NOTE_COLORS.other, DOT, 0.5);
    // Affichage notes visibles si showNotes
    if (showNotes) {
      return mkDot(noteToFr(note), { bg: C.bgSec, text: C.muted, border: C.border }, DOT);
    }
    return null;
  }

  function mkDot(lbl, col, sz, opacity = 1) {
    return (
      <div style={{
        width: sz, height: sz, borderRadius: "50%",
        background: col.bg, border: `1.5px solid ${col.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 7, fontWeight: 700, color: col.text,
        fontFamily: FONTS.ui, position: "relative", zIndex: 2,
        userSelect: "none", opacity,
      }}>{lbl}</div>
    );
  }

  const frets = Array.from({ length: MAX_F - MIN_F }, (_, i) => MIN_F + i + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", minWidth: "fit-content" }}>
      {/* Numéros de cases */}
      <div style={{ display: "flex", marginBottom: 1 }}>
        <div style={{ width: LW, flexShrink: 0 }} />
        <div style={{ width: OW, flexShrink: 0 }} />
        {frets.map(f => (
          <div key={f} style={{ width: CW, flexShrink: 0, textAlign: "center", fontSize: 8, color: C.muted, height: 12, lineHeight: "12px", fontFamily: FONTS.ui, fontWeight: f === 12 ? 700 : 400 }}>{f}</div>
        ))}
      </div>

      {strings.map(s => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: LW, flexShrink: 0, textAlign: "center", fontSize: 8, fontWeight: 700, color: C.muted, fontFamily: FONTS.ui }}>{SLABELS[s]}</div>

          {/* Case 0 */}
          {MIN_F === 0 && (
            <div
              onClick={() => onCellClick(s, 0)}
              style={{ width: OW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" }}
              onMouseEnter={e => { if (!revealed) e.currentTarget.style.background = `${C.primary}0A`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: getStringThicknessLocal(s), background: C.border, transform: "translateY(-50%)" }} />
              <div style={{ position: "relative", zIndex: 2 }}>{renderDot(s, 0)}</div>
            </div>
          )}

          {/* Cases 1–N */}
          {frets.map((f, fi) => (
            <div
              key={f}
              onClick={() => onCellClick(s, f)}
              style={{ width: CW, height: CH, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: revealed ? "default" : "pointer" }}
              onMouseEnter={e => { if (!revealed) e.currentTarget.style.background = `${C.primary}0A`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (MIN_F === 0 && fi === 0) || fi === 0 ? 2 : 0.5, background: fi === 0 ? C.text : C.border }} />
              <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: getStringThicknessLocal(s), background: C.border, transform: "translateY(-50%)", zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 2 }}>{renderDot(s, f)}</div>
            </div>
          ))}
        </div>
      ))}

      {/* Repères */}
      <div style={{ display: "flex", marginTop: 1 }}>
        <div style={{ width: LW, flexShrink: 0 }} />
        {MIN_F === 0 && <div style={{ width: OW, flexShrink: 0 }} />}
        {frets.map(f => (
          <div key={f} style={{ width: CW, flexShrink: 0 }}>
            {MARKERS.includes(f) && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border, margin: "2px auto 0" }} />}
            {f === 12 && <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 2 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border }} /><div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border }} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
