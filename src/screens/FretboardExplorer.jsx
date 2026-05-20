// ═══════════════════════════════════════════════════════════════════════════
// GuitarPath — screens/FretboardExplorer.jsx
// Page "Explorateur du manche" — visualisation libre gammes + accords
// ═══════════════════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { Fretboard } from "../Fretboard.jsx";
import {
  SCALES, CHORD_TYPES,
  getScaleNotes, getChordNotes, noteToFr,
} from "../fretboardUtils.js";

// ───────────────────────────────────────────────────────────────────────────
// DONNÉES — listes ordonnées pour les sélecteurs
// ───────────────────────────────────────────────────────────────────────────

const ROOTS_FR = [
  { en: "C",  fr: "Do"   }, { en: "C#", fr: "Do#"  }, { en: "D",  fr: "Ré"   },
  { en: "D#", fr: "Ré#"  }, { en: "E",  fr: "Mi"   }, { en: "F",  fr: "Fa"   },
  { en: "F#", fr: "Fa#"  }, { en: "G",  fr: "Sol"  }, { en: "G#", fr: "Sol#" },
  { en: "A",  fr: "La"   }, { en: "A#", fr: "La#"  }, { en: "B",  fr: "Si"   },
];

const SCALE_OPTIONS = [
  { key: "pentatonic_minor", label: "Pentatonique mineure",  emoji: "🔥" },
  { key: "pentatonic_major", label: "Pentatonique majeure",  emoji: "☀️" },
  { key: "blues",            label: "Blues",                 emoji: "🎸" },
  { key: "major",            label: "Majeure",               emoji: "🎵" },
  { key: "natural_minor",    label: "Mineure naturelle",     emoji: "🌙" },
  { key: "harmonic_minor",   label: "Mineure harmonique",    emoji: "🎻" },
  { key: "dorian",           label: "Dorien",                emoji: "🌊" },
  { key: "phrygian",         label: "Phrygien",              emoji: "🌶️" },
  { key: "mixolydian",       label: "Mixolydien",            emoji: "🎺" },
  { key: "lydian",           label: "Lydien",                emoji: "✨" },
  { key: "whole_tone",       label: "Tons entiers",          emoji: "🔮" },
];

const CHORD_OPTIONS = [
  { key: "maj",    label: "Majeur",        emoji: "☀️" },
  { key: "min",    label: "Mineur",        emoji: "🌙" },
  { key: "dom7",   label: "Dom7",          emoji: "⚡" },
  { key: "maj7",   label: "Maj7",          emoji: "✨" },
  { key: "min7",   label: "Mineur 7",      emoji: "🌊" },
  { key: "min7b5", label: "Mi-diminué ø",  emoji: "🌫️" },
  { key: "dim7",   label: "Diminué 7",     emoji: "🌑" },
  { key: "sus2",   label: "Sus2",          emoji: "💫" },
  { key: "sus4",   label: "Sus4",          emoji: "🌬️" },
  { key: "add9",   label: "Add9",          emoji: "🌸" },
];

// Descriptions pédagogiques courtes
const SCALE_INFO = {
  pentatonic_minor: { desc: "5 notes. La gamme du rock et du blues. Aucune fausse note sur un accord mineur.", usage: "Rock, Blues, Metal, Soul" },
  pentatonic_major: { desc: "5 notes. Version joyeuse de la pentatonique. Parfaite pour le country et le pop.", usage: "Country, Pop, Folk" },
  blues:            { desc: "Pentatonique mineure + la note bleue (b5). La note bleue = la couleur blues.", usage: "Blues, Jazz, Rock" },
  major:            { desc: "7 notes. La gamme de référence. Toutes les autres gammes en découlent.", usage: "Pop, Rock, Classique" },
  natural_minor:    { desc: "7 notes. Sons sombres et mélancoliques. Base du rock et du metal.", usage: "Rock, Metal, Classique" },
  harmonic_minor:   { desc: "Mineure avec une 7e majeure. Son oriental et dramatique.", usage: "Metal, Flamenco, Classique" },
  dorian:           { desc: "Mineur avec une 6te majeure. Son jazz-funk caractéristique.", usage: "Jazz, Fusion, Funk" },
  phrygian:         { desc: "Mineur avec une 2de mineure. Son espagnol, flamenco et metal.", usage: "Metal, Flamenco, Fusion" },
  mixolydian:       { desc: "Majeure avec une 7e mineure. Son rock-blues des grands solos.", usage: "Rock, Blues, Funk" },
  lydian:           { desc: "Majeure avec un #4. Son flottant, cinématique et moderne.", usage: "Fusion, Prog, Cinéma" },
  whole_tone:       { desc: "6 notes, toutes espacées d'un ton. Son flou et onirique.", usage: "Jazz, Impressionnisme" },
};

const CHORD_INFO = {
  maj:    { desc: "Fondamentale + tierce majeure + quinte. Son stable et joyeux.", formula: "1 – 3 – 5" },
  min:    { desc: "Fondamentale + tierce mineure + quinte. Son mélancolique.", formula: "1 – b3 – 5" },
  dom7:   { desc: "Accord de tension. Veut se résoudre vers le I.", formula: "1 – 3 – 5 – b7" },
  maj7:   { desc: "Son doux et jazzy. Guide tones : 3e et 7e majeure.", formula: "1 – 3 – 5 – 7" },
  min7:   { desc: "Son jazz-funk. Le ii du ii-V-I.", formula: "1 – b3 – 5 – b7" },
  min7b5: { desc: "Mi-diminué (ø). Le vii° de la gamme majeure.", formula: "1 – b3 – b5 – b7" },
  dim7:   { desc: "Symétrique, très tendu. Toutes les notes à 3 demi-tons.", formula: "1 – b3 – b5 – bb7" },
  sus2:   { desc: "Pas de tierce — son ouvert et suspendu.", formula: "1 – 2 – 5" },
  sus4:   { desc: "Pas de tierce — tension vers la quarte.", formula: "1 – 4 – 5" },
  add9:   { desc: "Majeur avec une 9e ajoutée. Son moderne et riche.", formula: "1 – 3 – 5 – 9" },
};

// ───────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ───────────────────────────────────────────────────────────────────────────
export function FretboardExplorer({ onBack }) {
  const [tab, setTab]             = useState("scale");
  const [root, setRoot]           = useState("A");
  const [scaleKey, setScaleKey]   = useState("pentatonic_minor");
  const [chordKey, setChordKey]   = useState("min7");
  const [displayMode, setDisplayMode] = useState("notes");
  const [showRootPicker, setShowRootPicker] = useState(false);

  // Notes affichées dans le résumé
  const activeNotes = useMemo(() => {
    if (tab === "scale") return getScaleNotes(root, scaleKey);
    return getChordNotes(root, chordKey);
  }, [tab, root, scaleKey, chordKey]);

  const info = tab === "scale" ? SCALE_INFO[scaleKey] : CHORD_INFO[chordKey];
  const activeLabel = tab === "scale"
    ? (SCALE_OPTIONS.find(s => s.key === scaleKey)?.label ?? scaleKey)
    : (CHORD_OPTIONS.find(c => c.key === chordKey)?.label ?? chordKey);
  const rootFr = ROOTS_FR.find(r => r.en === root)?.fr ?? root;

  const transposeSemitone = (dir) => {
    const idx = ROOTS_FR.findIndex(r => r.en === root);
    const next = (idx + dir + 12) % 12;
    setRoot(ROOTS_FR[next].en);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* Header */}
      <div style={{
        padding: "14px 16px 12px",
        display: "flex", alignItems: "center", gap: 10,
        borderBottom: `1px solid ${C.border}`,
        background: C.surface,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0, display: "flex", alignItems: "center" }}>
          <Ti name="chevron-left" size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>
            Explorateur du manche
          </div>
          <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>
            {rootFr} · {activeLabel}
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingBottom: 32 }}>

        {/* Toggle Scale / Chord */}
        <div style={{
          display: "flex", background: C.surface2,
          borderRadius: R.lg, padding: 3, gap: 2,
        }}>
          {[
            { key: "scale", label: "Gammes", icon: "music" },
            { key: "chord", label: "Accords", icon: "guitar-pick" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: "9px 12px", borderRadius: R.md,
              border: "none", cursor: "pointer", fontFamily: FONTS.ui,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: tab === t.key ? C.surface : "transparent",
              boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              color: tab === t.key ? C.text : C.text3,
              fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
              transition: "all 0.15s",
            }}>
              <Ti name={t.icon} size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Sélecteur de fondamentale */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }}>
            Tonique
          </div>
          <button onClick={() => transposeSemitone(-1)} style={{
            width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`,
            background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ti name="chevron-left" size={16} color={C.text2} />
          </button>
          <button onClick={() => setShowRootPicker(!showRootPicker)} style={{
            flex: 1, height: 34, borderRadius: 10,
            border: `1.5px solid ${C.primary}`,
            background: C.primaryL, cursor: "pointer",
            fontSize: 16, fontWeight: 700, color: C.primaryD,
            fontFamily: FONTS.ui,
          }}>
            {rootFr}
          </button>
          <button onClick={() => transposeSemitone(1)} style={{
            width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`,
            background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Ti name="chevron-right" size={16} color={C.text2} />
          </button>
        </div>

        {/* Picker tonique (grille) */}
        {showRootPicker && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6,
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.lg, padding: 10,
          }}>
            {ROOTS_FR.map(r => (
              <button key={r.en} onClick={() => { setRoot(r.en); setShowRootPicker(false); }} style={{
                padding: "8px 4px", borderRadius: 8,
                border: `1px solid ${root === r.en ? C.primary : C.border}`,
                background: root === r.en ? C.primaryL : C.bg,
                color: root === r.en ? C.primaryD : C.text,
                fontSize: 12, fontWeight: root === r.en ? 700 : 400,
                cursor: "pointer", fontFamily: FONTS.ui,
              }}>
                {r.fr}
              </button>
            ))}
          </div>
        )}

        {/* Sélecteur gamme / accord */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }}>
            {tab === "scale" ? "Gamme" : "Accord"}
          </div>
          <div style={{ flex: 1, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "flex", gap: 6, paddingBottom: 4 }}>
              {(tab === "scale" ? SCALE_OPTIONS : CHORD_OPTIONS).map(opt => {
                const active = tab === "scale" ? scaleKey === opt.key : chordKey === opt.key;
                return (
                  <button key={opt.key} onClick={() => tab === "scale" ? setScaleKey(opt.key) : setChordKey(opt.key)} style={{
                    flexShrink: 0,
                    padding: "7px 12px", borderRadius: R.pill,
                    border: `1.5px solid ${active ? C.primary : C.border}`,
                    background: active ? C.primaryL : C.surface,
                    color: active ? C.primaryD : C.text2,
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    cursor: "pointer", fontFamily: FONTS.ui,
                    whiteSpace: "nowrap",
                  }}>
                    {opt.emoji} {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sélecteur affichage */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "notes",     label: "Notes" },
            { key: "intervals", label: "Intervalles" },
            { key: "degrees",   label: "Degrés" },
          ].map(m => (
            <button key={m.key} onClick={() => setDisplayMode(m.key)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8,
              border: `1px solid ${displayMode === m.key ? C.primary : C.border}`,
              background: displayMode === m.key ? C.primaryL : C.surface,
              color: displayMode === m.key ? C.primaryD : C.text3,
              fontSize: 11, fontWeight: displayMode === m.key ? 600 : 400,
              cursor: "pointer", fontFamily: FONTS.ui,
            }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Manche */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.lg, overflow: "hidden",
        }}>
          <div style={{ padding: "10px 8px 6px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Fretboard
              mode={tab === "scale" ? "scale" : "chord"}
              root={root}
              scale={tab === "scale" ? scaleKey : undefined}
              chord={tab === "chord" ? chordKey : undefined}
              displayMode={displayMode}
              lang="fr"
              compact={true}
            />
          </div>
        </div>

        {/* Notes actives */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.lg, padding: "12px 14px",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Notes · {rootFr} {activeLabel}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {activeNotes.map((note, i) => (
              <div key={note} style={{
                padding: "5px 10px", borderRadius: R.pill,
                background: i === 0 ? C.amberL : C.primaryL,
                border: `1px solid ${i === 0 ? C.amberBorder : C.primaryBorder}`,
                fontSize: 13, fontWeight: i === 0 ? 700 : 500,
                color: i === 0 ? C.amberD : C.primaryD,
                fontFamily: FONTS.ui,
              }}>
                {noteToFr(note)}
                {i === 0 && <span style={{ fontSize: 9, marginLeft: 3, opacity: 0.7 }}>R</span>}
              </div>
            ))}
          </div>
          {tab === "chord" && CHORD_INFO[chordKey] && (
            <div style={{ marginTop: 8, fontSize: 12, color: C.text3, fontFamily: FONTS.ui }}>
              Formule : <strong style={{ color: C.text2 }}>{CHORD_INFO[chordKey].formula}</strong>
            </div>
          )}
        </div>

        {/* Info pédagogique */}
        {info && (
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.lg, padding: "12px 14px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Contexte
            </div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: C.text, fontFamily: FONTS.title, lineHeight: 1.55 }}>
              {info.desc}
            </p>
            {"usage" in info && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Ti name="music" size={12} color={C.text3} />
                <span style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{info.usage}</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
