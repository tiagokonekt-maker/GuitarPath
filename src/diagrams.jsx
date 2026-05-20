// ═══════════════════════════════════════════════════════════════════════════
// GuitarPath — diagrams.jsx
// Composants visuels pédagogiques, générés en SVG inline React
// Aucune dépendance externe, compatible PWA offline
//
// TYPES de blocs supportés dans lesson.content[] :
//
//   { type: "fretboard",     data: { ... } }   → manche avec notes colorées
//   { type: "scale_pattern", data: { ... } }   → pattern de gamme sur 6 cordes
//   { type: "interval_chart",data: { ... } }   → tableau d'intervalles
//   { type: "chord_diagram", data: { ... } }   → diagramme d'accord vertical
//   { type: "caged_form",    data: { ... } }   → forme CAGED annotée
//   { type: "note_grid",     data: { ... } }   → grille de notes sur 1 corde
//
// UTILISATION dans content.js :
//   { type: "fretboard", caption: "...", data: { ... } }
//
// ═══════════════════════════════════════════════════════════════════════════

// ─── Palette partagée (identique à App.jsx C tokens) ───────────────────────
const DC = {
  bg:       "#F8F7F4",
  surface:  "#FFFFFF",
  border:   "#E8E6E0",
  text:     "#1A1714",
  text2:    "#5F5E5A",
  text3:    "#888780",
  primary:  "#4C42C8",
  primaryL: "#F4F2FE",
  green:    "#1D9E75",
  greenL:   "#E8F5EE",
  amber:    "#BA7517",
  amberL:   "#FCF5E4",
  coral:    "#D85A30",
  coralL:   "#FBEDE5",
  pink:     "#D4537E",
  pinkL:    "#FBEAF1",
  fret:     "#C8C4B8",       // couleur des frettes
  string:   "#9B9890",       // couleur des cordes
  nut:      "#1A1714",       // sillet
  dot:      "#E8E6E0",       // points d'incrustation
};

const FONT = '"Josefin Sans", "Roboto", sans-serif';
const STRING_NAMES = ["Mi", "Si", "Sol", "Ré", "La", "Mi"]; // c1→c6, affiché c6→c1

// ─── Wrapper commun ────────────────────────────────────────────────────────
function DiagramCard({ caption, children, accent = DC.primary }) {
  return (
    <div style={{
      background: DC.surface, borderRadius: 14,
      border: `1px solid ${DC.border}`,
      overflow: "hidden",
      marginBottom: 0,
    }}>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        {children}
      </div>
      {caption && (
        <div style={{
          padding: "8px 14px 10px",
          fontSize: 11, color: DC.text2, fontFamily: FONT,
          fontWeight: 500, letterSpacing: "0.02em",
          borderTop: `1px solid ${DC.border}`,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
          {caption}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. FRETBOARD — manche complet (6 cordes × N cases)
//
// data = {
//   frets: 12,              // nombre de cases affichées (5-17)
//   startFret: 0,           // case de départ (ex: 5 pour la position A)
//   notes: [                // notes à afficher
//     { string: 6, fret: 5, label: "La", color: "primary", root: true },
//     // string: 1-6 (1=aigu, 6=grave)
//     // color: "primary"|"green"|"amber"|"coral"|"pink"|"neutral"
//     // root: true → cercle plein avec bordure
//     // label: texte affiché dans le cercle (note, chiffre intervalle...)
//   ],
//   showStringNames: true,
//   showFretNumbers: true,
//   markerFrets: [3,5,7,9,12], // cases avec points d'incrustation
// }
// ═══════════════════════════════════════════════════════════════════════════
const NOTE_COLORS = {
  primary: { fill: DC.primary,  text: "#fff" },
  green:   { fill: DC.green,    text: "#fff" },
  amber:   { fill: DC.amber,    text: "#fff" },
  coral:   { fill: DC.coral,    text: "#fff" },
  pink:    { fill: DC.pink,     text: "#fff" },
  neutral: { fill: DC.text2,    text: "#fff" },
  ghost:   { fill: DC.border,   text: DC.text2 },
  open:    { fill: DC.surface,  text: DC.primary, stroke: DC.primary }, // corde à vide
  muted:   { fill: "none",      text: DC.coral },                       // corde étouffée (X)
};

export function FretboardDiagram({ data, caption }) {
  const {
    frets = 5,
    startFret = 0,
    notes = [],
    showStringNames = false,
    showFretNumbers = true,
    markerFrets = [3, 5, 7, 9, 12],
  } = data;

  const STRINGS = 6;
  const LEFT_PAD = showStringNames ? 46 : 30;
  const TOP_PAD = showFretNumbers ? 22 : 10;
  const BOTTOM_PAD = 14;
  const RIGHT_PAD = 12;

  const STRING_SPACING = 32;
  const FRET_SPACING = 44;
  const NOTE_R = 12;

  const svgW = LEFT_PAD + frets * FRET_SPACING + RIGHT_PAD;
  const svgH = TOP_PAD + (STRINGS - 1) * STRING_SPACING + BOTTOM_PAD;

  // Convertit string 1-6 → y (1=haut=aigu, 6=bas=grave)
  const sy = (s) => TOP_PAD + (s - 1) * STRING_SPACING;
  // Convertit fret absolu → x
  const fx = (f) => LEFT_PAD + (f - startFret - 0.5) * FRET_SPACING;

  const displayFrets = Array.from({ length: frets }, (_, i) => startFret + i + 1);

  return (
    <DiagramCard caption={caption} accent={DC.amber}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: "block", minWidth: Math.min(svgW, 300) }}
        aria-label={caption || "Diagramme de manche"}
      >
        {/* Sillet (case 0) */}
        {startFret === 0 && (
          <rect x={LEFT_PAD - 4} y={TOP_PAD - 2}
            width={5} height={(STRINGS - 1) * STRING_SPACING + 4}
            fill={DC.nut} rx={2}
          />
        )}

        {/* Frettes */}
        {displayFrets.map((f, i) => (
          <line key={f}
            x1={LEFT_PAD + i * FRET_SPACING + FRET_SPACING} y1={TOP_PAD - 2}
            x2={LEFT_PAD + i * FRET_SPACING + FRET_SPACING} y2={TOP_PAD + (STRINGS - 1) * STRING_SPACING + 2}
            stroke={DC.fret} strokeWidth={1.5}
          />
        ))}

        {/* Cordes */}
        {Array.from({ length: STRINGS }, (_, i) => i + 1).map(s => (
          <line key={s}
            x1={LEFT_PAD - 4} y1={sy(s)}
            x2={LEFT_PAD + frets * FRET_SPACING} y2={sy(s)}
            stroke={DC.string}
            strokeWidth={s === 1 ? 1 : s === 2 ? 1.2 : s === 3 ? 1.5 : s === 4 ? 1.8 : s === 5 ? 2.2 : 2.6}
          />
        ))}

        {/* Points d'incrustation */}
        {markerFrets.filter(f => f > startFret && f <= startFret + frets).map(f => {
          const x = fx(f);
          const isDouble = f % 12 === 0 && f !== 0;
          return isDouble ? (
            <g key={f}>
              <circle cx={x} cy={sy(2)} r={4} fill={DC.dot} />
              <circle cx={x} cy={sy(5)} r={4} fill={DC.dot} />
            </g>
          ) : (
            <circle key={f} cx={x} cy={sy(3.5)} r={4} fill={DC.dot} />
          );
        })}

        {/* Numéros de cases */}
        {showFretNumbers && displayFrets.map((f, i) => (
          <text key={f}
            x={LEFT_PAD + i * FRET_SPACING + FRET_SPACING / 2} y={TOP_PAD - 8}
            textAnchor="middle" fontSize={9} fill={DC.text3} fontFamily={FONT}
          >{f}</text>
        ))}

        {/* Noms de cordes */}
        {showStringNames && Array.from({ length: STRINGS }, (_, i) => i + 1).map(s => (
          <text key={s}
            x={LEFT_PAD - 8} y={sy(s) + 4}
            textAnchor="end" fontSize={9} fill={DC.text2} fontFamily={FONT}
          >
            {/* c1=Mi aigu, c6=Mi grave */}
            {["Mi", "Si", "Sol", "Ré", "La", "Mi"][s - 1]}
          </text>
        ))}

        {/* Notes */}
        {notes.map((n, i) => {
          const { string: s, fret: f, label = "", color = "primary", root = false, open: isOpen = false, muted: isMuted = false } = n;
          const col = NOTE_COLORS[color] || NOTE_COLORS.primary;

          if (isMuted) {
            const x = LEFT_PAD - 16; const y = sy(s);
            return <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize={13} fill={DC.coral} fontFamily={FONT} fontWeight={700}>×</text>;
          }
          if (isOpen) {
            const x = LEFT_PAD - 16; const y = sy(s);
            return <circle key={i} cx={x} cy={y} r={NOTE_R - 2} fill="none" stroke={col.stroke || DC.primary} strokeWidth={2} />;
          }

          // fret 0 (corde à vide jouée) : affichée à gauche du sillet, colorée
          if (f === 0) {
            const x = LEFT_PAD - 16; const y = sy(s);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={NOTE_R - 2} fill={col.fill} stroke={col.fill} strokeWidth={2} />
                {label && (
                  <text x={x} y={y + 4} textAnchor="middle"
                    fontSize={label.length > 2 ? 7 : 9}
                    fill={col.text} fontFamily={FONT} fontWeight={600}
                  >{label}</text>
                )}
              </g>
            );
          }

          const x = LEFT_PAD + (f - startFret - 1) * FRET_SPACING + FRET_SPACING / 2;
          const y = sy(s);

          return (
            <g key={i}>
              <circle cx={x} cy={y} r={NOTE_R}
                fill={col.fill}
                stroke={root ? col.fill : "none"}
                strokeWidth={root ? 3 : 0}
                style={{ filter: root ? `drop-shadow(0 0 3px ${col.fill}60)` : "none" }}
              />
              {label && (
                <text x={x} y={y + 4} textAnchor="middle"
                  fontSize={label.length > 2 ? 8 : 10}
                  fill={col.text} fontFamily={FONT} fontWeight={600}
                >{label}</text>
              )}
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. SCALE PATTERN — gamme sur 6 cordes avec intervalles
//
// data = {
//   title: "Pentatonique mineure — Position 1",
//   tuning: ["E","B","G","D","A","E"],  // optionnel
//   strings: [                           // une entrée par corde (c6→c1)
//     { frets: [5, 8], root: [5] },     // frets à jouer, root = fondamentale(s)
//     ...
//   ],
//   startFret: 4,
//   endFret: 9,
//   labels: "notes" | "intervals" | "degrees" | "none"
//   noteMap: { "5,6": "La", "8,6": "Do", ... }  // "fret,string" → label
// }
// ═══════════════════════════════════════════════════════════════════════════
export function ScalePattern({ data, caption }) {
  const {
    strings = [],      // [c6, c5, c4, c3, c2, c1]
    startFret = 4,
    endFret = 9,
    noteMap = {},
    rootColor = "amber",
    noteColor = "primary",
  } = data;

  const STRINGS = 6;
  const displayFrets = endFret - startFret + 1;
  const LEFT_PAD = 32;
  const TOP_PAD = 18;
  const BOTTOM_PAD = 14;
  const STRING_SPACING = 30;
  const FRET_SPACING = 40;
  const NOTE_R = 11;

  const svgW = LEFT_PAD + displayFrets * FRET_SPACING + 12;
  const svgH = TOP_PAD + (STRINGS - 1) * STRING_SPACING + BOTTOM_PAD;

  const sy = (s) => TOP_PAD + (STRINGS - 1 - s) * STRING_SPACING; // 0=c6=bas, 5=c1=haut
  const fx = (f) => LEFT_PAD + (f - startFret + 0.5) * FRET_SPACING;

  const stringsArr = strings.length === 6 ? strings : Array(6).fill({ frets: [], root: [] });

  return (
    <DiagramCard caption={caption} accent={NOTE_COLORS[rootColor]?.fill || DC.amber}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: "block", minWidth: 260 }}
        aria-label={caption || "Pattern de gamme"}
      >
        {/* Frettes verticales */}
        {Array.from({ length: displayFrets + 1 }, (_, i) => i).map(i => (
          <line key={i}
            x1={LEFT_PAD + i * FRET_SPACING} y1={TOP_PAD - 2}
            x2={LEFT_PAD + i * FRET_SPACING} y2={TOP_PAD + (STRINGS - 1) * STRING_SPACING + 2}
            stroke={i === 0 ? DC.nut : DC.fret}
            strokeWidth={i === 0 ? 3 : 1.5}
          />
        ))}

        {/* Cordes horizontales */}
        {stringsArr.map((_, s) => (
          <line key={s}
            x1={LEFT_PAD} y1={sy(s)}
            x2={LEFT_PAD + displayFrets * FRET_SPACING} y2={sy(s)}
            stroke={DC.string}
            strokeWidth={s === 0 ? 2.4 : s === 1 ? 2 : s === 2 ? 1.6 : s === 3 ? 1.3 : s === 4 ? 1.1 : 0.9}
          />
        ))}

        {/* Numéros de cases */}
        {Array.from({ length: displayFrets }, (_, i) => startFret + i).map((f, i) => (
          <text key={f}
            x={LEFT_PAD + i * FRET_SPACING + FRET_SPACING / 2} y={TOP_PAD - 7}
            textAnchor="middle" fontSize={9} fill={DC.text3} fontFamily={FONT}
          >{f}</text>
        ))}

        {/* Noms de cordes (c6 en bas → s=0, c1 en haut → s=5) */}
        {["Mi", "La", "Ré", "Sol", "Si", "Mi"].map((name, s) => (
          <text key={s}
            x={LEFT_PAD - 6} y={sy(s) + 4}
            textAnchor="end" fontSize={9} fill={DC.text2} fontFamily={FONT}
          >{name}</text>
        ))}

        {/* Notes */}
        {stringsArr.map((str, s) => {
          const { frets = [], root = [] } = str;
          return frets.map(f => {
            const isRoot = root.includes(f);
            const col = isRoot ? NOTE_COLORS[rootColor] : NOTE_COLORS[noteColor];
            const key = `${f},${s}`;
            const label = noteMap[key] || (isRoot ? "R" : "");
            const x = fx(f);
            const y = sy(s);
            return (
              <g key={`${s}-${f}`}>
                <circle cx={x} cy={y} r={NOTE_R}
                  fill={col.fill}
                  style={{ filter: isRoot ? `drop-shadow(0 0 4px ${col.fill}80)` : "none" }}
                />
                {label && (
                  <text x={x} y={y + 4} textAnchor="middle"
                    fontSize={label.length > 2 ? 7.5 : 9}
                    fill={col.text} fontFamily={FONT} fontWeight={600}
                  >{label}</text>
                )}
              </g>
            );
          });
        })}
      </svg>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. INTERVAL CHART — tableau des 12 intervalles
//
// data = {
//   highlight: ["P5", "m3", "M3"],  // intervalles à mettre en avant
//   showOnGuitar: true,              // afficher où trouver sur 1 corde
// }
// ═══════════════════════════════════════════════════════════════════════════
const INTERVALS = [
  { semitones: 1,  symbol: "m2",  name: "2de mineure",    color: "coral",   character: "Dissonance forte" },
  { semitones: 2,  symbol: "M2",  name: "2de majeure",    color: "neutral", character: "Tension douce" },
  { semitones: 3,  symbol: "m3",  name: "3ce mineure",    color: "primary", character: "Mélancolie" },
  { semitones: 4,  symbol: "M3",  name: "3ce majeure",    color: "green",   character: "Joie, brillance" },
  { semitones: 5,  symbol: "P4",  name: "Quarte juste",   color: "neutral", character: "Stabilité" },
  { semitones: 6,  symbol: "TT",  name: "Triton",         color: "coral",   character: "Tension max" },
  { semitones: 7,  symbol: "P5",  name: "Quinte juste",   color: "amber",   character: "Force, stabilité" },
  { semitones: 8,  symbol: "m6",  name: "6te mineure",    color: "primary", character: "Tristesse, lyrisme" },
  { semitones: 9,  symbol: "M6",  name: "6te majeure",    color: "green",   character: "Douceur, chaleur" },
  { semitones: 10, symbol: "m7",  name: "7ème mineure",   color: "amber",   character: "Tension blues" },
  { semitones: 11, symbol: "M7",  name: "7ème majeure",   color: "pink",    character: "Couleur jazz" },
  { semitones: 12, symbol: "P8",  name: "Octave",         color: "neutral", character: "Unisson à l'octave" },
];

export function IntervalChart({ data, caption }) {
  const { highlight = [], showOnGuitar = false } = data || {};

  return (
    <DiagramCard caption={caption || "Les 12 intervalles"} accent={DC.primary}>
      <div style={{ padding: "10px 12px" }}>
        {INTERVALS.map(iv => {
          const isHighlighted = highlight.includes(iv.symbol);
          const col = NOTE_COLORS[iv.color] || NOTE_COLORS.neutral;
          return (
            <div key={iv.symbol} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 8px", borderRadius: 8, marginBottom: 3,
              background: isHighlighted ? col.fill + "18" : "transparent",
              border: isHighlighted ? `1px solid ${col.fill}40` : "1px solid transparent",
            }}>
              {/* Badge demi-tons */}
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: isHighlighted ? col.fill : DC.surface2,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, fontFamily: FONT,
                color: isHighlighted ? col.text : DC.text3,
                flexShrink: 0,
              }}>{iv.semitones}</div>

              {/* Symbole */}
              <div style={{
                width: 28, fontSize: 11, fontWeight: 700, fontFamily: FONT,
                color: isHighlighted ? col.fill : DC.text, flexShrink: 0,
              }}>{iv.symbol}</div>

              {/* Nom */}
              <div style={{ flex: 1, fontSize: 11, fontFamily: FONT, color: DC.text2 }}>{iv.name}</div>

              {/* Caractère */}
              <div style={{ fontSize: 10, fontFamily: FONT, color: isHighlighted ? col.fill : DC.text3, textAlign: "right", flexShrink: 0 }}>
                {iv.character}
              </div>
            </div>
          );
        })}

        {showOnGuitar && (
          <div style={{ marginTop: 10, padding: "8px 10px", background: DC.amberL, borderRadius: 10, border: `1px solid ${DC.amberBorder}` }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: DC.amberD, fontFamily: FONT, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Sur 1 seule corde
            </div>
            <div style={{ fontSize: 11, color: DC.amberD, fontFamily: FONT, lineHeight: 1.6 }}>
              Tierce maj = 4 cases · Quinte = 7 cases · Octave = 12 cases
            </div>
          </div>
        )}
      </div>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CHORD DIAGRAM — accord vertical classique
//
// CONVENTION STRICTE (identique à tous les autres composants) :
//   frets[0] = corde 6 (Mi grave) → affiché à GAUCHE
//   frets[5] = corde 1 (Mi aigu)  → affiché à DROITE
//   frets[i] = -1 → corde étouffée (×)
//   frets[i] =  0 → corde à vide (○)
//   frets[i] =  N → case N enfoncée
//
// data = {
//   name: "Am",
//   frets: [0, 0, 2, 2, 1, 0],   // [c6, c5, c4, c3, c2, c1]
//   fingers: [0, 0, 2, 3, 1, 0], // 0=vide/à vide, 1-4=doigts, 5=pouce T
//   startFret: 1,                 // première frette affichée
//   barre: { fret: 2, from: 0, to: 5 }  // from/to = index dans frets[] (c6=0)
// }
// ═══════════════════════════════════════════════════════════════════════════
const STRING_LABELS = ["Mi", "La", "Ré", "Sol", "Si", "Mi"]; // [c6..c1] affiché gauche→droite

export function ChordDiagram({ data, caption }) {
  const { name = "", frets = [], fingers = [], startFret = 1, barre } = data;

  const STRINGS  = 6;
  const FRET_ROWS = 4;
  const COL_W    = 32;
  const ROW_H    = 30;
  const LEFT_PAD = 16;
  const TOP_PAD  = 38;   // espace pour ○/× + nom
  const BOT_PAD  = 24;   // espace pour noms de cordes
  const NOTE_R   = 10;
  const svgW = LEFT_PAD + (STRINGS - 1) * COL_W + 16;
  const svgH = TOP_PAD + FRET_ROWS * ROW_H + BOT_PAD;

  // frets[i] → i=0 est c6 (gauche) → colonne sx = LEFT_PAD + i * COL_W
  const sx = (i) => LEFT_PAD + i * COL_W;
  // fret absolu → y
  const fy = (f) => TOP_PAD + (f - startFret + 0.5) * ROW_H;

  return (
    <DiagramCard caption={caption || name} accent={DC.primary}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: "block", maxWidth: 200, margin: "0 auto" }}
        aria-label={`Accord ${name}`}
      >
        {/* Nom */}
        <text x={svgW / 2} y={14} textAnchor="middle"
          fontSize={13} fill={DC.primary} fontFamily={FONT} fontWeight={700}
        >{name}</text>

        {/* Sillet (case 1) ou indicateur de position */}
        {startFret === 1
          ? <rect x={LEFT_PAD - 2} y={TOP_PAD - 4}
              width={(STRINGS - 1) * COL_W + 4} height={5}
              fill={DC.nut} rx={2}
            />
          : <text x={LEFT_PAD - 6} y={TOP_PAD + ROW_H / 2 + 4}
              textAnchor="end" fontSize={9} fill={DC.text3} fontFamily={FONT}
            >{startFret}fr</text>
        }

        {/* Frettes horizontales */}
        {Array.from({ length: FRET_ROWS + 1 }, (_, i) => (
          <line key={i}
            x1={LEFT_PAD} y1={TOP_PAD + i * ROW_H}
            x2={LEFT_PAD + (STRINGS - 1) * COL_W} y2={TOP_PAD + i * ROW_H}
            stroke={DC.fret} strokeWidth={1.5}
          />
        ))}

        {/* Cordes verticales — épaisseur variable c6 (gauche) → c1 (droite) */}
        {Array.from({ length: STRINGS }, (_, i) => (
          <line key={i}
            x1={sx(i)} y1={TOP_PAD}
            x2={sx(i)} y2={TOP_PAD + FRET_ROWS * ROW_H}
            stroke={DC.string}
            strokeWidth={i === 0 ? 2.2 : i === 1 ? 1.9 : i === 2 ? 1.6 : i === 3 ? 1.3 : i === 4 ? 1.1 : 0.9}
          />
        ))}

        {/* Noms de cordes en bas */}
        {STRING_LABELS.map((label, i) => (
          <text key={i}
            x={sx(i)} y={svgH - 6}
            textAnchor="middle" fontSize={8} fill={DC.text3} fontFamily={FONT}
          >{label}</text>
        ))}

        {/* Barré */}
        {barre && (
          <rect
            x={sx(barre.from) - NOTE_R + 2}
            y={fy(barre.fret) - NOTE_R + 1}
            width={sx(barre.to) - sx(barre.from) + NOTE_R * 2 - 4}
            height={NOTE_R * 2 - 2}
            fill={DC.primary} rx={NOTE_R - 1}
          />
        )}

        {/* Notes : ○ à vide, × étouffé, ● case */}
        {frets.map((f, i) => {
          const x = sx(i);
          if (f === -1) {
            // Corde étouffée — × au-dessus
            return (
              <text key={i} x={x} y={TOP_PAD - 10}
                textAnchor="middle" fontSize={11}
                fill={DC.coral} fontFamily={FONT} fontWeight={700}
              >×</text>
            );
          }
          if (f === 0) {
            // Corde à vide — ○ au-dessus
            return (
              <circle key={i} cx={x} cy={TOP_PAD - 12}
                r={6} fill="none"
                stroke={DC.green} strokeWidth={1.5}
              />
            );
          }
          // Note enfoncée
          const y = fy(f);
          const finger = fingers[i] || 0;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={NOTE_R} fill={DC.primary} />
              {finger > 0 && (
                <text x={x} y={y + 4}
                  textAnchor="middle" fontSize={9}
                  fill="#fff" fontFamily={FONT} fontWeight={700}
                >{finger === 5 ? "T" : finger}</text>
              )}
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. CAGED FORM — forme CAGED avec zones annotées
//
// data = {
//   form: "E",              // C | A | G | E | D
//   root: "La",
//   rootFret: 5,
//   notes: [ ... ],         // même format que FretboardDiagram
//   startFret: 4,
//   frets: 5,
// }
// ═══════════════════════════════════════════════════════════════════════════
const CAGED_COLORS = { C: "green", A: "amber", G: "pink", E: "primary", D: "coral" };

export function CAGEDForm({ data, caption }) {
  const { form = "E", root = "La", rootFret = 5, notes = [], startFret = 4, frets = 5 } = data;
  const color = CAGED_COLORS[form] || "primary";
  const tint = NOTE_COLORS[color];

  // Badge form
  const enhancedCaption = caption || `Forme ${form} — ${root} (case ${rootFret})`;

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: tint.fill,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: tint.text, fontFamily: FONT,
        }}>{form}</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: DC.text, fontFamily: FONT }}>{root} — Forme {form}</div>
          <div style={{ fontSize: 10, color: DC.text3, fontFamily: FONT }}>Fondamentale case {rootFret}</div>
        </div>
      </div>
      <FretboardDiagram
        data={{ frets, startFret, notes, showStringNames: true, showFretNumbers: true }}
        caption={enhancedCaption}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. NOTE GRID — notes sur 1 corde (utile pour mémorisation)
//
// data = {
//   string: 6,               // numéro de corde (1-6)
//   stringName: "Mi grave",
//   highlights: [            // cases à mettre en valeur
//     { fret: 0,  label: "Mi",  color: "amber" },
//     { fret: 5,  label: "La",  color: "green" },
//   ],
//   maxFret: 12,
// }
// ═══════════════════════════════════════════════════════════════════════════
export function NoteGrid({ data, caption }) {
  const { string: strNum = 6, stringName = "Corde", highlights = [], maxFret = 12 } = data;
  const CELL_W = 26;
  const H = 44;
  const LEFT_PAD = 8;
  const svgW = LEFT_PAD + (maxFret + 1) * CELL_W + 8;
  const MID_Y = H / 2;
  const STRING_Y = MID_Y;
  const NOTE_R = 10;

  const MARKER_FRETS = [3, 5, 7, 9, 12];

  const hlMap = {};
  highlights.forEach(h => { hlMap[h.fret] = h; });

  return (
    <DiagramCard caption={caption || `Notes sur la corde ${strNum} (${stringName})`} accent={DC.amber}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${H}`}
        style={{ display: "block", minWidth: 280 }}
        aria-label={caption || "Grille de notes"}
      >
        {/* Corde */}
        <line x1={LEFT_PAD} y1={STRING_Y} x2={svgW - 4} y2={STRING_Y}
          stroke={DC.string} strokeWidth={strNum >= 4 ? 2.2 : 1.4} />

        {/* Frettes */}
        {Array.from({ length: maxFret + 1 }, (_, i) => i).map(f => (
          <line key={f}
            x1={LEFT_PAD + f * CELL_W} y1={STRING_Y - NOTE_R - 2}
            x2={LEFT_PAD + f * CELL_W} y2={STRING_Y + NOTE_R + 2}
            stroke={f === 0 ? DC.nut : DC.fret}
            strokeWidth={f === 0 ? 3 : 1.2}
          />
        ))}

        {/* Points d'incrustation */}
        {MARKER_FRETS.filter(f => f <= maxFret).map(f => (
          <circle key={f}
            cx={LEFT_PAD + f * CELL_W + CELL_W / 2} cy={STRING_Y + NOTE_R + 8}
            r={3} fill={DC.dot}
          />
        ))}

        {/* Notes surlignées */}
        {highlights.map(h => {
          const col = NOTE_COLORS[h.color] || NOTE_COLORS.primary;
          const x = LEFT_PAD + h.fret * CELL_W + (h.fret > 0 ? CELL_W / 2 : 0);
          const y = STRING_Y;
          return (
            <g key={h.fret}>
              <circle cx={x} cy={y} r={NOTE_R} fill={col.fill}
                style={{ filter: `drop-shadow(0 0 3px ${col.fill}80)` }}
              />
              <text x={x} y={y + 4} textAnchor="middle"
                fontSize={h.label.length > 2 ? 7 : 9}
                fill={col.text} fontFamily={FONT} fontWeight={600}
              >{h.label}</text>
            </g>
          );
        })}

        {/* Numéros de cases sous les frettes */}
        {Array.from({ length: maxFret + 1 }, (_, f) => f).map(f => {
          if (hlMap[f]) return null; // déjà affiché avec le label note
          if (!MARKER_FRETS.includes(f) && f !== 0 && f !== maxFret) return null;
          return (
            <text key={f}
              x={LEFT_PAD + f * CELL_W + (f > 0 ? CELL_W / 2 : 0)} y={STRING_Y - NOTE_R - 5}
              textAnchor="middle" fontSize={8} fill={DC.text3} fontFamily={FONT}
            >{f}</text>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDERER — function centrale, à appeler dans LessonView de App.jsx
//
// Usage dans App.jsx :
//   import { renderDiagramBlock } from "./diagrams.jsx";
//   // Dans le map de lesson.content :
//   const visual = renderDiagramBlock(b, i);
//   if (visual) return visual;
// ═══════════════════════════════════════════════════════════════════════════
export function renderDiagramBlock(block, key) {
  const { type, data, caption } = block;

  switch (type) {
    case "fretboard":      return <FretboardDiagram key={key} data={data} caption={caption} />;
    case "scale_pattern":  return <ScalePattern key={key} data={data} caption={caption} />;
    case "interval_chart": return <IntervalChart key={key} data={data} caption={caption} />;
    case "chord_diagram":  return <ChordDiagram key={key} data={data} caption={caption} />;
    case "caged_form":     return <CAGEDForm key={key} data={data} caption={caption} />;
    case "note_grid":      return <NoteGrid key={key} data={data} caption={caption} />;
    case "rhythm_grid":    return <RhythmGrid key={key} data={data} caption={caption} />;
    case "strum_pattern":  return <StrumPattern key={key} data={data} caption={caption} />;
    default:               return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. RHYTHM GRID — grille visuelle des subdivisions rythmiques
//
// data = {
//   beats: 4,              // temps par mesure
//   subdivision: 8,        // 4=noires, 8=croches, 16=doubles-croches
//   accents: [0, 4],       // index des cases accentuées (0-based)
//   muted: [2, 6],         // index des cases en silence
//   label: "Croches en 4/4 — main droite continue",
// }
// ═══════════════════════════════════════════════════════════════════════════
export function RhythmGrid({ data, caption }) {
  const {
    beats = 4,
    subdivision = 8,
    accents = [],
    muted = [],
    highlights = [],
    counters = [],
    label = "",
  } = data;

  const CELL_W = subdivision <= 8 ? 32 : 22;
  const CELL_H = 36;
  const LEFT_PAD = 8;
  const TOP_PAD = 28;
  const total = beats * (subdivision / 4);
  const svgW = LEFT_PAD * 2 + total * CELL_W;
  const svgH = TOP_PAD + CELL_H + 28;

  const getColor = (i) => {
    if (highlights.includes(i)) return { bg: DC.primary, text: "#fff" };
    if (accents.includes(i)) return { bg: DC.amber, text: "#fff" };
    if (muted.includes(i)) return { bg: DC.surface2, text: DC.text3 };
    return { bg: DC.greenL, text: DC.greenD };
  };

  const getCounter = (i) => {
    if (counters[i]) return counters[i];
    const beat = Math.floor(i / (subdivision / 4)) + 1;
    const sub = i % (subdivision / 4);
    if (sub === 0) return String(beat);
    if (subdivision === 8) return "et";
    if (subdivision === 16) {
      if (sub === 1) return "e";
      if (sub === 2) return "et";
      if (sub === 3) return "a";
    }
    return "";
  };

  return (
    <DiagramCard caption={caption || label} accent={DC.green}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: "block", minWidth: 240 }}
        aria-label={caption || "Grille rythmique"}
      >
        {/* Labels de temps */}
        {Array.from({ length: beats }, (_, b) => (
          <text key={b}
            x={LEFT_PAD + b * (subdivision / 4) * CELL_W + CELL_W / 2}
            y={16} textAnchor="middle"
            fontSize={10} fill={DC.text2} fontFamily={FONT} fontWeight={600}
          >{b + 1}</text>
        ))}

        {/* Séparateurs de temps */}
        {Array.from({ length: beats + 1 }, (_, b) => (
          <line key={b}
            x1={LEFT_PAD + b * (subdivision / 4) * CELL_W} y1={TOP_PAD - 4}
            x2={LEFT_PAD + b * (subdivision / 4) * CELL_W} y2={TOP_PAD + CELL_H + 4}
            stroke={b === 0 || b === beats ? DC.nut : DC.fret}
            strokeWidth={b === 0 || b === beats ? 2 : 1}
          />
        ))}

        {/* Cellules */}
        {Array.from({ length: total }, (_, i) => {
          const col = getColor(i);
          const x = LEFT_PAD + i * CELL_W;
          const counter = getCounter(i);
          return (
            <g key={i}>
              <rect x={x + 1} y={TOP_PAD} width={CELL_W - 2} height={CELL_H}
                fill={col.bg} rx={4}
              />
              <text x={x + CELL_W / 2} y={TOP_PAD + CELL_H / 2 + 4}
                textAnchor="middle" fontSize={10} fill={col.text}
                fontFamily={FONT} fontWeight={600}
              >{counter}</text>
            </g>
          );
        })}

        {/* Séparateurs inter-cellules */}
        {Array.from({ length: total - 1 }, (_, i) => {
          if ((i + 1) % (subdivision / 4) === 0) return null;
          const x = LEFT_PAD + (i + 1) * CELL_W;
          return (
            <line key={i}
              x1={x} y1={TOP_PAD} x2={x} y2={TOP_PAD + CELL_H}
              stroke={DC.surface} strokeWidth={1.5}
            />
          );
        })}

        {/* Label sous la grille */}
        {label && (
          <text x={svgW / 2} y={TOP_PAD + CELL_H + 18}
            textAnchor="middle" fontSize={9} fill={DC.text3} fontFamily={FONT}
          >{label}</text>
        )}
      </svg>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. STRUM PATTERN — pattern de strumming visuel (B=bas, H=haut, -=silence)
//
// data = {
//   pattern: ["B", "-", "BH", "-H", "BH", "-H", "B", "H"],
//   beats: 4,
//   style: "folk",      // pour la couleur
//   bpm: 80,
// }
// ═══════════════════════════════════════════════════════════════════════════
const STRUM_COLORS = {
  B:  { bg: DC.primary,  text: "#fff",        label: "↓" },
  H:  { bg: "#A78BFA",   text: "#fff",        label: "↑" },
  BH: { bg: DC.primary,  text: "#fff",        label: "↓↑" },
  "-H":{ bg: "#A78BFA",  text: "#fff",        label: "↑" },
  "-":{ bg: DC.surface2, text: DC.text3,      label: "–" },
  x:  { bg: DC.amber,    text: "#fff",        label: "×" },
};

const STYLE_COLORS = {
  folk:    DC.green,
  pop:     DC.primary,
  rock:    DC.coral,
  reggae:  DC.amber,
  blues:   DC.amber,
  bossa:   DC.pink,
  funk:    DC.coral,
};

export function StrumPattern({ data, caption }) {
  const { pattern = [], beats = 4, style = "folk", bpm } = data;
  const CELL_W = 40;
  const CELL_H = 44;
  const LEFT_PAD = 8;
  const TOP_PAD = 24;
  const svgW = LEFT_PAD * 2 + pattern.length * CELL_W;
  const svgH = TOP_PAD + CELL_H + 24;
  const accent = STYLE_COLORS[style] || DC.primary;
  const beatsPerCell = beats / pattern.length;

  return (
    <DiagramCard caption={caption || `Pattern ${style}${bpm ? ` · ${bpm} BPM` : ""}`} accent={accent}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ display: "block", minWidth: 260 }}
        aria-label={caption || "Pattern de strumming"}
      >
        {/* Numéros de temps */}
        {Array.from({ length: beats }, (_, b) => {
          const cellsPerBeat = pattern.length / beats;
          const x = LEFT_PAD + b * cellsPerBeat * CELL_W + (cellsPerBeat * CELL_W) / 2;
          return (
            <text key={b} x={x} y={16} textAnchor="middle"
              fontSize={10} fill={DC.text2} fontFamily={FONT} fontWeight={600}
            >{b + 1}</text>
          );
        })}

        {/* Cellules */}
        {pattern.map((p, i) => {
          const col = STRUM_COLORS[p] || STRUM_COLORS["-"];
          const x = LEFT_PAD + i * CELL_W;
          return (
            <g key={i}>
              <rect x={x + 2} y={TOP_PAD} width={CELL_W - 4} height={CELL_H}
                fill={col.bg} rx={6}
              />
              <text x={x + CELL_W / 2} y={TOP_PAD + CELL_H / 2 + 5}
                textAnchor="middle"
                fontSize={col.label.length > 2 ? 10 : 14}
                fill={col.text} fontFamily={FONT} fontWeight={700}
              >{col.label}</text>
            </g>
          );
        })}

        {/* Séparateurs de temps */}
        {Array.from({ length: beats + 1 }, (_, b) => {
          const cellsPerBeat = pattern.length / beats;
          const x = LEFT_PAD + b * cellsPerBeat * CELL_W;
          return (
            <line key={b}
              x1={x} y1={TOP_PAD - 2}
              x2={x} y2={TOP_PAD + CELL_H + 2}
              stroke={DC.fret} strokeWidth={1}
            />
          );
        })}

        {/* Légende */}
        <text x={svgW / 2} y={TOP_PAD + CELL_H + 16}
          textAnchor="middle" fontSize={9} fill={DC.text3} fontFamily={FONT}
        >↓ bas · ↑ haut · – silence · × étouffé</text>
      </svg>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UPDATE renderDiagramBlock — ajouter les 2 nouveaux types
// ═══════════════════════════════════════════════════════════════════════════
// NOTE : remplace la fonction renderDiagramBlock existante dans ce fichier
// par celle-ci (ou ajoute les 2 cases dans le switch existant)

export function renderDiagramBlockV2(block, key) {
  const { type, data, caption } = block;
  switch (type) {
    case "fretboard":      return <FretboardDiagram key={key} data={data} caption={caption} />;
    case "scale_pattern":  return <ScalePattern key={key} data={data} caption={caption} />;
    case "interval_chart": return <IntervalChart key={key} data={data} caption={caption} />;
    case "chord_diagram":  return <ChordDiagram key={key} data={data} caption={caption} />;
    case "caged_form":     return <CAGEDForm key={key} data={data} caption={caption} />;
    case "note_grid":      return <NoteGrid key={key} data={data} caption={caption} />;
    case "rhythm_grid":    return <RhythmGrid key={key} data={data} caption={caption} />;
    case "strum_pattern":  return <StrumPattern key={key} data={data} caption={caption} />;
    default:               return null;
  }
}
