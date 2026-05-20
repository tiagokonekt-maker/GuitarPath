// ═══════════════════════════════════════════════════════════════════════════
// GuitarPath — screens/JamSession.jsx
// Outil interactif d'improvisation : gamme active, notes cibles, contraintes
// Accessible depuis la carte featured de HomeScreen
// ═══════════════════════════════════════════════════════════════════════════
import { useState, useMemo } from "react";
import { C, FONTS, R } from "../design/tokens.js";
import { Ti } from "../design/Ti.jsx";
import { Fretboard } from "../Fretboard.jsx";
import { getScaleNotes, getChordNotes, noteToFr } from "../fretboardUtils.js";

// ───────────────────────────────────────────────────────────────────────────
// CONTEXTES DE JEU
// ───────────────────────────────────────────────────────────────────────────
const CONTEXTS = [
  {
    id: "blues_minor",
    label: "Blues mineur",
    emoji: "🎸",
    color: C.amber,
    colorL: C.amberL,
    colorD: C.amberD,
    colorB: C.amberBorder,
    scale: "pentatonic_minor",
    chords: ["min7"],
    desc: "Le terrain de jeu du rock et du blues. La pentatonique mineure sonne sur tout.",
    backing: "Am7 — 70-90 BPM",
    targets: ["1", "b3", "5"],
    targetDesc: "Fondamentale, tierce mineure, quinte",
  },
  {
    id: "blues_12",
    label: "Blues 12 mesures",
    emoji: "🔵",
    color: C.primary,
    colorL: C.primaryL,
    colorD: C.primaryD,
    colorB: C.primaryBorder,
    scale: "blues",
    chords: ["dom7"],
    desc: "La note bleue (b5) est ta couleur signature. Bends et vibratos obligatoires.",
    backing: "A7-D7-E7 — 80 BPM",
    targets: ["1", "b3", "b5"],
    targetDesc: "Fondamentale, tierce mineure, note bleue",
  },
  {
    id: "jazz_251",
    label: "Jazz ii-V-I",
    emoji: "✨",
    color: C.green,
    colorL: C.greenL,
    colorD: C.greenD,
    colorB: C.greenBorder,
    scale: "major",
    chords: ["min7", "dom7", "maj7"],
    desc: "Cible les guide tones (3e et 7e) de chaque accord sur les temps forts.",
    backing: "Dm7-G7-Cmaj7 — 120 BPM",
    targets: ["3", "7", "b7"],
    targetDesc: "3e (couleur), 7e majeure ou mineure (tension)",
  },
  {
    id: "modal_dorian",
    label: "Modal — Dorien",
    emoji: "🌊",
    color: "#185FA5",
    colorL: "#E6F1FB",
    colorD: "#042C53",
    colorB: "#A0BFE0",
    scale: "dorian",
    chords: ["min7"],
    desc: "La 6te majeure est ta note caractéristique. Évite de résoudre trop tôt.",
    backing: "Am7 drone — 90 BPM",
    targets: ["1", "6", "b3"],
    targetDesc: "Fondamentale, 6te majeure (couleur dorien), tierce mineure",
  },
  {
    id: "modal_mixo",
    label: "Modal — Mixolydien",
    emoji: "🎺",
    color: C.coral,
    colorL: C.coralL,
    colorD: C.coralD,
    colorB: C.coralBorder,
    scale: "mixolydian",
    chords: ["dom7"],
    desc: "Son rock/funk. La b7 naturelle donne la couleur dominante sans résolution.",
    backing: "A7 vamp — 100 BPM",
    targets: ["1", "3", "b7"],
    targetDesc: "Fondamentale, tierce majeure, 7e mineure (couleur)",
  },
];

const ROOTS_FR = [
  { en: "A",  fr: "La"   }, { en: "B",  fr: "Si"   }, { en: "C",  fr: "Do"   },
  { en: "D",  fr: "Ré"   }, { en: "E",  fr: "Mi"   }, { en: "F",  fr: "Fa"   },
  { en: "G",  fr: "Sol"  }, { en: "C#", fr: "Do#"  }, { en: "D#", fr: "Ré#"  },
  { en: "F#", fr: "Fa#"  }, { en: "G#", fr: "Sol#" }, { en: "A#", fr: "La#"  },
];

// ───────────────────────────────────────────────────────────────────────────
// CONTRAINTES D'IMPROVISATION — tirées aléatoirement
// ───────────────────────────────────────────────────────────────────────────
const CONSTRAINTS = [
  { text: "Joue UNIQUEMENT des notes longues (blanches ou rondes). Zéro doubles-croches.", level: "🟢 Facile" },
  { text: "Chaque phrase doit finir sur une note de l'accord (chord tone).", level: "🟢 Facile" },
  { text: "Maximum 4 notes par phrase. Silence entre chaque phrase.", level: "🟢 Facile" },
  { text: "Joue une phrase de 2 mesures, silence 2 mesures. Call & response.", level: "🟢 Facile" },
  { text: "Reste dans les 3 premières cordes (aiguës) uniquement.", level: "🟡 Moyen" },
  { text: "Commence chaque phrase sur un temps fort (temps 1 ou 3).", level: "🟡 Moyen" },
  { text: "Utilise le silence pendant au moins 50% du temps.", level: "🟡 Moyen" },
  { text: "Monte progressivement en intensité pendant 2 minutes, puis redescends.", level: "🟡 Moyen" },
  { text: "Chaque phrase doit contenir exactement une note chromatique (hors gamme).", level: "🔴 Difficile" },
  { text: "Joue le même rythme pendant 1 minute, puis varie les notes seulement.", level: "🔴 Difficile" },
  { text: "Cible uniquement les guide tones (3e et 7e) sur les temps 1 et 3.", level: "🔴 Difficile" },
  { text: "Construis un solo en 3 actes : calme (1 min) → montée (2 min) → climax (30s).", level: "🔴 Difficile" },
  { text: "Joue en legato uniquement (hammer-on et pull-off, pas de picking).", level: "🟡 Moyen" },
  { text: "Chaque phrase doit monter puis redescendre — jamais dans un seul sens.", level: "🟡 Moyen" },
  { text: "Joue les yeux fermés. Sens le manche, ne le regarde pas.", level: "🔴 Difficile" },
];

// ───────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ───────────────────────────────────────────────────────────────────────────
export function JamSession({ onBack }) {
  const [contextId, setContextId]   = useState("blues_minor");
  const [root, setRoot]             = useState("A");
  const [displayMode, setDisplayMode] = useState("notes");
  const [constraint, setConstraint] = useState(null);
  const [showRootPicker, setShowRootPicker] = useState(false);

  const ctx = CONTEXTS.find(c => c.id === contextId);
  const rootFr = ROOTS_FR.find(r => r.en === root)?.fr ?? root;

  const activeNotes = useMemo(() => getScaleNotes(root, ctx.scale), [root, ctx.scale]);

  const randomConstraint = () => {
    const next = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setConstraint(next);
  };

  const transposeSemitone = (dir) => {
    const chromatic = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
    const idx = chromatic.indexOf(root);
    setRoot(chromatic[(idx + dir + 12) % 12]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg }}>

      {/* Header */}
      <div style={{
        padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 10,
        borderBottom: `1px solid ${C.border}`, background: C.surface,
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.text2, padding: 0 }}>
          <Ti name="chevron-left" size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONTS.title }}>Jam Session</div>
          <div style={{ fontSize: 11, color: C.text3, fontFamily: FONTS.ui }}>{rootFr} · {ctx.label}</div>
        </div>
        <div style={{ fontSize: 20 }}>{ctx.emoji}</div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", paddingBottom: 32 }}>

        {/* Sélecteur contexte — scroll horizontal */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginHorizontal: -16 }}>
          <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
            {CONTEXTS.map(c => (
              <button key={c.id} onClick={() => setContextId(c.id)} style={{
                flexShrink: 0, padding: "8px 14px", borderRadius: R.pill,
                border: `1.5px solid ${contextId === c.id ? c.color : C.border}`,
                background: contextId === c.id ? c.colorL : C.surface,
                color: contextId === c.id ? c.colorD : C.text2,
                fontSize: 12, fontWeight: contextId === c.id ? 700 : 400,
                cursor: "pointer", fontFamily: FONTS.ui, whiteSpace: "nowrap",
              }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description du contexte */}
        <div style={{
          background: ctx.colorL, border: `1px solid ${ctx.colorB}`,
          borderRadius: R.lg, padding: "10px 14px",
        }}>
          <div style={{ fontSize: 12, color: ctx.colorD, fontFamily: FONTS.title, lineHeight: 1.5 }}>
            {ctx.desc}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <Ti name="music" size={12} color={ctx.color} />
            <span style={{ fontSize: 11, color: ctx.colorD, fontFamily: FONTS.ui, fontWeight: 600 }}>
              Backing suggéré : {ctx.backing}
            </span>
          </div>
        </div>

        {/* Sélecteur tonique */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", width: 60 }}>
            Tonique
          </div>
          <button onClick={() => transposeSemitone(-1)} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-left" size={16} color={C.text2} />
          </button>
          <button onClick={() => setShowRootPicker(!showRootPicker)} style={{
            flex: 1, height: 34, borderRadius: 10, border: `1.5px solid ${ctx.color}`,
            background: ctx.colorL, cursor: "pointer",
            fontSize: 16, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui,
          }}>
            {rootFr}
          </button>
          <button onClick={() => transposeSemitone(1)} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ti name="chevron-right" size={16} color={C.text2} />
          </button>
        </div>

        {/* Picker tonique */}
        {showRootPicker && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: 10 }}>
            {ROOTS_FR.map(r => (
              <button key={r.en} onClick={() => { setRoot(r.en); setShowRootPicker(false); }} style={{
                padding: "8px 4px", borderRadius: 8,
                border: `1px solid ${root === r.en ? ctx.color : C.border}`,
                background: root === r.en ? ctx.colorL : C.bg,
                color: root === r.en ? ctx.colorD : C.text,
                fontSize: 12, fontWeight: root === r.en ? 700 : 400,
                cursor: "pointer", fontFamily: FONTS.ui,
              }}>
                {r.fr}
              </button>
            ))}
          </div>
        )}

        {/* Affichage */}
        <div style={{ display: "flex", gap: 6 }}>
          {[{ key: "notes", label: "Notes" }, { key: "intervals", label: "Intervalles" }, { key: "degrees", label: "Degrés" }].map(m => (
            <button key={m.key} onClick={() => setDisplayMode(m.key)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8,
              border: `1px solid ${displayMode === m.key ? ctx.color : C.border}`,
              background: displayMode === m.key ? ctx.colorL : C.surface,
              color: displayMode === m.key ? ctx.colorD : C.text3,
              fontSize: 11, fontWeight: displayMode === m.key ? 600 : 400,
              cursor: "pointer", fontFamily: FONTS.ui,
            }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Manche */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, overflow: "hidden" }}>
          <div style={{ padding: "8px 8px 4px", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Fretboard
              mode="scale"
              root={root}
              scale={ctx.scale}
              displayMode={displayMode}
              lang="fr"
              compact={true}
            />
          </div>
        </div>

        {/* Notes actives + cibles */}
        <div style={{ display: "flex", gap: 10 }}>
          {/* Notes de la gamme */}
          <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Gamme
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {activeNotes.map((note, i) => (
                <div key={note} style={{
                  padding: "4px 8px", borderRadius: R.pill,
                  background: i === 0 ? ctx.colorL : C.bg,
                  border: `1px solid ${i === 0 ? ctx.color : C.border}`,
                  fontSize: 12, fontWeight: i === 0 ? 700 : 400,
                  color: i === 0 ? ctx.colorD : C.text2,
                  fontFamily: FONTS.ui,
                }}>
                  {noteToFr(note)}{i === 0 ? " R" : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Notes cibles */}
          <div style={{ flex: 1, background: ctx.colorL, border: `1px solid ${ctx.colorB}`, borderRadius: R.lg, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ctx.colorD, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              🎯 Cibles
            </div>
            <div style={{ fontSize: 11, color: ctx.colorD, fontFamily: FONTS.ui, lineHeight: 1.5 }}>
              {ctx.targetDesc}
            </div>
          </div>
        </div>

        {/* Contrainte du moment */}
        <div style={{
          background: constraint ? C.amberL : C.surface,
          border: `1px solid ${constraint ? C.amberBorder : C.border}`,
          borderRadius: R.lg, padding: "12px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: constraint ? 8 : 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: constraint ? C.amberD : C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              🎲 Contrainte du moment
            </div>
            <button onClick={randomConstraint} style={{
              padding: "5px 12px", borderRadius: R.pill,
              border: `1px solid ${C.amber}`, background: C.amber,
              color: "#fff", fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: FONTS.ui,
            }}>
              {constraint ? "Nouvelle" : "Tirer"}
            </button>
          </div>
          {constraint && (
            <>
              <div style={{ fontSize: 13, color: C.amberD, fontFamily: FONTS.title, lineHeight: 1.55, fontWeight: 500 }}>
                {constraint.text}
              </div>
              <div style={{ fontSize: 10, color: C.amber, fontFamily: FONTS.ui, marginTop: 4 }}>
                {constraint.level}
              </div>
            </>
          )}
          {!constraint && (
            <div style={{ fontSize: 12, color: C.text3, fontFamily: FONTS.ui }}>
              Tire une contrainte pour booster ta créativité
            </div>
          )}
        </div>

        {/* Conseils rapides */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: R.lg, padding: "12px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.text3, fontFamily: FONTS.ui, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            💡 Rappels
          </div>
          {[
            "Silence = note. Utilise-le.",
            "Arrive sur une chord tone sur les temps forts.",
            "Une bonne phrase monte puis descend.",
            "Le climax aux 2/3 du solo, pas à la fin.",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 3 ? 6 : 0 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: ctx.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: C.text2, fontFamily: FONTS.ui, lineHeight: 1.5 }}>{tip}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
