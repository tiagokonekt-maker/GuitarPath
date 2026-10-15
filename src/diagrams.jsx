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
//   { type: "circle_of_fifths", data: { ... } } → cercle des quintes (majeures + relatifs mineurs)
//   { type: "degree_chart",  data: { ... } }   → les 7 degrés d'une gamme (nom, chiffrage, fonction)
//   { type: "tab", text, data: { lines } }     → tablature ASCII (6 lignes, corde 1 en haut)
//
// UTILISATION dans content.js :
//   { type: "fretboard", caption: "...", data: { ... } }
//
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { useC } from "./design/ThemeContext.jsx";
// ── Son ──────────────────────────────────────────────────────────────────
// Chaque diagramme peut s'écouter : bouton rond en haut à droite du cadre
// (BarreEcoute), un seul diagramme à la fois (useLecteurDiagramme). CE QUI
// est joué est calculé par des fonctions pures (fretboard/diagrammesSon.js,
// testées sur tous les blocs du contenu) ; audioEngine ne fait que planifier.
import { playSequence, playTab } from "./audioEngine.js";
import { parseTab } from "./tab/tabParser.js";
import { BoutonEcoute, BarreEcoute } from "./fretboard/LecteurDiagramme.jsx";
import { useLecteurDiagramme } from "./fretboard/useLecteurDiagramme.js";
import {
  cordesDeFrets, cagedVersCordes, sequenceGrattage, sequenceArpege, nomAccordFr,
  scaleBlockToNotes, monteeDescente, sequenceMelodique, fretboardBlockToNotes, noteGridToNotes,
  strumBlockToEvents, rhythmBlockToEvents, decalageLigneTab,
  sequenceIntervalles, degreeBoxToNotes, contexteDegres, sequenceDegres, accordDuCercle,
} from "./fretboard/diagrammesSon.js";

const FONT = '"Josefin Sans", "Roboto", sans-serif';
const STRING_NAMES = ["Mi", "Si", "Sol", "Ré", "La", "Mi"]; // c1→c6, affiché c6→c1

// Palette des notes actives — fonction du thème courant (plus de couleurs figées)
function getNoteColors(DC) {
  return {
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
}

// ─── Wrapper commun ────────────────────────────────────────────────────────
// `actions` : boutons d'écoute, en haut à droite du cadre (toujours au même
// endroit, quel que soit le diagramme).
function DiagramCard({ caption, children, accent, actions }) {
  const DC = useC();
  const dotColor = accent || DC.primary;
  return (
    <div style={{
      background: DC.surface, borderRadius: 14,
      border: `1px solid ${DC.border}`,
      overflow: "hidden",
      marginBottom: 0,
    }}>
      {actions && <BarreEcoute>{actions}</BarreEcoute>}
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
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />
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
/** Une séquence de diagrammesSon.js → la fonction `jouer` attendue par useLecteurDiagramme. */
const jouerSequence = (evenements) => ({ onStep, onDone }) => playSequence(evenements, { onStep, onDone });

/** État visuel d'un bouton d'écoute pour une action donnée. */
const etatBouton = (lecteur, action) => ({
  joue: lecteur.action === action && lecteur.etat !== "repos",
  charge: lecteur.action === action && lecteur.etat === "chargement",
});

const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;

export function FretboardDiagram({ data, caption }) {
  // Bloc « fretboard » : on joue les notes dans l'ordre écrit par l'auteur
  // (souvent pédagogique : doigts 1-2-3-4, paires d'octaves…).
  const lecteur = useLecteurDiagramme();
  const notes = useMemo(() => fretboardBlockToNotes(data), [data]);
  const actions = notes.length > 0 && (
    <BoutonEcoute
      {...etatBouton(lecteur, "notes")}
      label={notes.length === 1 ? "Écouter la note" : `Écouter les ${notes.length} notes, dans l'ordre`}
      onClick={() => lecteur.basculer("notes", jouerSequence(sequenceMelodique(notes, { ecart: 0.5, duree: 0.9 })))}
    />
  );
  const actifs = lecteur.pas != null ? new Set([lecteur.pas]) : null;
  return <FretboardDiagramVue data={data} caption={caption} actions={actions} actifs={actifs} />;
}

// Rendu du manche, sans état. `actifs` : Set de clés "corde-case" à
// surligner (note en train de sonner).
function FretboardDiagramVue({ data, caption, actions, actifs }) {
  const DC = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(DC), [DC]);
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
    <DiagramCard caption={caption} accent={DC.amber} actions={actions}>
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
            fill={DC.text} rx={2}
          />
        )}

        {/* Frettes */}
        {displayFrets.map((f, i) => (
          <line key={f}
            x1={LEFT_PAD + i * FRET_SPACING + FRET_SPACING} y1={TOP_PAD - 2}
            x2={LEFT_PAD + i * FRET_SPACING + FRET_SPACING} y2={TOP_PAD + (STRINGS - 1) * STRING_SPACING + 2}
            stroke={DC.border} strokeWidth={1.5}
          />
        ))}

        {/* Cordes */}
        {Array.from({ length: STRINGS }, (_, i) => i + 1).map(s => (
          <line key={s}
            x1={LEFT_PAD - 4} y1={sy(s)}
            x2={LEFT_PAD + frets * FRET_SPACING} y2={sy(s)}
            stroke={DC.text3}
            strokeWidth={s === 1 ? 1 : s === 2 ? 1.2 : s === 3 ? 1.5 : s === 4 ? 1.8 : s === 5 ? 2.2 : 2.6}
          />
        ))}

        {/* Points d'incrustation */}
        {markerFrets.filter(f => f > startFret && f <= startFret + frets).map(f => {
          const x = fx(f);
          const isDouble = f % 12 === 0 && f !== 0;
          return isDouble ? (
            <g key={f}>
              <circle cx={x} cy={sy(2)} r={4} fill={DC.border} />
              <circle cx={x} cy={sy(5)} r={4} fill={DC.border} />
            </g>
          ) : (
            <circle key={f} cx={x} cy={sy(3.5)} r={4} fill={DC.border} />
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
          const sonne = !!actifs?.has(`${s}-${isOpen ? 0 : f}`);
          const halo = sonne ? <circle cx={f === 0 || isOpen ? LEFT_PAD - 16 : LEFT_PAD + (f - startFret - 1) * FRET_SPACING + FRET_SPACING / 2} cy={sy(s)} r={NOTE_R + 4} fill="none" stroke={DC.text} strokeWidth={2.5} /> : null;

          if (isMuted) {
            const x = LEFT_PAD - 16; const y = sy(s);
            return <text key={i} x={x} y={y + 4} textAnchor="middle" fontSize={13} fill={DC.coral} fontFamily={FONT} fontWeight={700}>×</text>;
          }
          if (isOpen) {
            const x = LEFT_PAD - 16; const y = sy(s);
            return <g key={i}>{halo}<circle cx={x} cy={y} r={NOTE_R - 2} fill="none" stroke={col.stroke || DC.primary} strokeWidth={2} /></g>;
          }

          // fret 0 (corde à vide jouée) : affichée à gauche du sillet, colorée
          if (f === 0) {
            const x = LEFT_PAD - 16; const y = sy(s);
            return (
              <g key={i}>
                {halo}
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

          if (f < startFret + 1 || f > startFret + frets) {
            if (typeof console !== "undefined" && console.warn) {
              console.warn(`FretboardDiagram: note case ${f} hors de la fenêtre [${startFret + 1},${startFret + frets}] ignorée (corde ${s}). Ajuste startFret/frets dans le contenu.`);
            }
            return null;
          }

          return (
            <g key={i}>
              {halo}
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
  const DC = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(DC), [DC]);
  const {
    strings = [],      // [c6, c5, c4, c3, c2, c1]
    startFret = 4,
    endFret = 9,
    noteMap = {},
    rootColor = "amber",
    noteColor = "primary",
    // Note caractéristique (ex. la sixte majeure du dorien). Avant, les
    // légendes promettaient « en corail » / « en rose » alors que le
    // composant ne savait afficher que 2 couleurs : la note la plus
    // importante d'un mode n'était jamais distinguée. strings[i].accent
    // liste les cases concernées ; un anneau s'ajoute à la couleur, pour
    // que la distinction ne repose pas sur la couleur seule.
    accentColor = "coral",
    accentLabel = "note caractéristique",
  } = data;
  const aDesAccents = strings.some(st => (st.accent || []).length);

  // Son : la gamme en montant (corde 6 → corde 1) puis en descendant, la
  // case qui sonne cerclée.
  const lecteur = useLecteurDiagramme();
  const notesGamme = useMemo(() => scaleBlockToNotes(data), [data]);
  const ecouter = () => lecteur.basculer("gamme",
    jouerSequence(sequenceMelodique(monteeDescente(notesGamme), { ecart: 0.32, duree: 0.6 })));
  const actions = notesGamme.length > 0 && (
    <BoutonEcoute {...etatBouton(lecteur, "gamme")}
      label={`Écouter la gamme (${notesGamme.length} notes), en montant puis en descendant`}
      onClick={ecouter} />
  );

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
    <DiagramCard caption={caption} accent={NOTE_COLORS[rootColor]?.fill || DC.amber} actions={actions}>
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
            stroke={i === 0 ? DC.text : DC.border}
            strokeWidth={i === 0 ? 3 : 1.5}
          />
        ))}

        {/* Cordes horizontales */}
        {stringsArr.map((_, s) => (
          <line key={s}
            x1={LEFT_PAD} y1={sy(s)}
            x2={LEFT_PAD + displayFrets * FRET_SPACING} y2={sy(s)}
            stroke={DC.text3}
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
          const { frets = [], root = [], accent = [] } = str;
          return frets.map(f => {
            if (f < startFret || f > endFret) {
              if (typeof console !== "undefined" && console.warn) {
                console.warn(`ScalePattern: note case ${f} hors de la fenêtre [${startFret},${endFret}] ignorée (corde index ${s}). Ajuste startFret/endFret dans le contenu.`);
              }
              return null;
            }
            const isRoot = root.includes(f);
            const isAccent = !isRoot && accent.includes(f);
            const col = isRoot ? NOTE_COLORS[rootColor] : isAccent ? NOTE_COLORS[accentColor] : NOTE_COLORS[noteColor];
            const key = `${f},${s}`;
            const label = noteMap[key] || (isRoot ? "R" : "");
            const x = fx(f);
            const y = sy(s);
            const sonne = lecteur.pas === key;
            return (
              <g key={`${s}-${f}`}>
                {sonne && <circle cx={x} cy={y} r={NOTE_R + 4} fill="none" stroke={DC.text} strokeWidth={2.5} />}
                <circle cx={x} cy={y} r={NOTE_R}
                  fill={col.fill}
                  stroke={isAccent ? DC.text : "none"} strokeWidth={isAccent ? 1.5 : 0}
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
      <div aria-hidden="true" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6, fontSize: 11, color: DC.text2, fontFamily: FONT }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: NOTE_COLORS[rootColor]?.fill }} /> fondamentale
        </span>
        {aDesAccents && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: NOTE_COLORS[accentColor]?.fill, boxShadow: `0 0 0 1.5px ${DC.text}` }} /> {accentLabel}
          </span>
        )}
      </div>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. CIRCLE OF FIFTHS — cercle des quintes, majeures + relatifs mineurs
//
// data = {
//   highlight: ["Do", "Sol", "Ré"],  // tonalités majeures à mettre en valeur
//   showMinors: true,                 // afficher l'anneau des relatifs mineurs (défaut: true)
// }
// ═══════════════════════════════════════════════════════════════════════════
const FIFTHS_MAJORS = ["Do","Sol","Ré","La","Mi","Si","Fa#","Réb","Lab","Mib","Sib","Fa"];
const FIFTHS_MINORS = ["Lam","Mim","Sim","Fa#m","Do#m","Sol#m","Ré#m","Sibm","Fam","Dom","Solm","Rém"];

export function CircleOfFifths({ data, caption }) {
  const DC = useC();
  const { highlight = [], showMinors = true } = data || {};
  const cx = 110, cy = 110;
  const rMaj = showMinors ? 86 : 92;
  const rMin = 54;
  const svgSize = 220;

  const pos = (r, i) => {
    const angle = (-90 + i * 30) * Math.PI / 180;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Son : toucher une tonalité fait entendre son accord de tonique ; le
  // bouton joue les tonalités mises en avant, dans l'ordre du cercle.
  const lecteur = useLecteurDiagramme();
  const [focusClavier, setFocusClavier] = useState(null);
  const ecouterTon = (nom) => {
    const notes = accordDuCercle(nom);
    if (notes) lecteur.basculer(`ton:${nom}`, jouerSequence([{ t: 0, notes, duree: 2, velocite: 0.85, strum: "down", ecart: 0.03, step: nom }]));
  };
  const parcours = FIFTHS_MAJORS.filter(n => !highlight.length || highlight.includes(n));
  const ecouterTout = () => lecteur.basculer("cercle", jouerSequence(parcours.map((nom, i) => ({
    t: i * 1.15, notes: accordDuCercle(nom) || [], duree: 1.2, velocite: 0.82, strum: "down", ecart: 0.028, step: nom,
  }))));
  const nomLisible = (nom) => nom.endsWith("m") ? `${nom.slice(0, -1)} mineur` : `${nom} majeur`;
  // Une tonalité du cercle se comporte comme un bouton (clic, Entrée, Espace).
  const propsTouche = (nom) => ({
    role: "button", tabIndex: 0,
    "aria-label": `Écouter l'accord de ${nomLisible(nom)}`,
    "aria-pressed": etatBouton(lecteur, `ton:${nom}`).joue,
    style: { cursor: "pointer", outline: "none", WebkitTapHighlightColor: "transparent" },
    onClick: () => ecouterTon(nom),
    onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ecouterTon(nom); } },
    onFocus: (e) => { let v = false; try { v = e.currentTarget.matches(":focus-visible"); } catch { v = true; } if (v) setFocusClavier(nom); },
    onBlur: () => setFocusClavier(f => (f === nom ? null : f)),
  });
  const anneauFocus = (nom, x, y, r) => focusClavier === nom
    ? <circle cx={x} cy={y} r={r + 4} fill="none" stroke="var(--gr-focus)" strokeWidth={2.5} />
    : null;
  const anneauSon = (nom, x, y, r) => lecteur.pas === nom && lecteur.etat !== "repos"
    ? <circle cx={x} cy={y} r={r + 2.5} fill="none" stroke={DC.text} strokeWidth={2} />
    : null;

  return (
    <DiagramCard caption={caption || "Cercle des quintes"} accent={DC.primary} actions={
      <BoutonEcoute {...etatBouton(lecteur, "cercle")}
        label={`Écouter les accords de ${parcours.length > 1 ? parcours.join(", ") : parcours[0]} majeur, dans l'ordre du cercle`}
        onClick={ecouterTout} />
    }>
      <svg
        width="100%"
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        style={{ display: "block", minWidth: 220, maxWidth: 280, margin: "0 auto" }}
        role="group"
        aria-label={`${caption || "Cercle des quintes"} — touche une tonalité pour entendre son accord`}
      >
        <circle cx={cx} cy={cy} r={rMaj} fill="none" stroke={DC.border} strokeWidth={1} />
        {showMinors && <circle cx={cx} cy={cy} r={rMin} fill="none" stroke={DC.border} strokeWidth={1} />}

        {FIFTHS_MAJORS.map((name, i) => {
          const { x, y } = pos(rMaj, i);
          const isHi = highlight.includes(name);
          return (
            <g key={name} {...propsTouche(name)}>
              {anneauFocus(name, x, y, 15)}
              {anneauSon(name, x, y, 15)}
              <circle cx={x} cy={y} r={15}
                fill={isHi ? DC.primary : DC.surface}
                stroke={isHi ? DC.primary : DC.border}
                strokeWidth={isHi ? 0 : 1.5}
              />
              <text x={x} y={y + 4} textAnchor="middle"
                fontSize={name.length > 2 ? 8.5 : 10.5} fontWeight={700}
                fill={isHi ? "#fff" : DC.text} fontFamily={FONT}
              >{name}</text>
            </g>
          );
        })}

        {showMinors && FIFTHS_MINORS.map((name, i) => {
          const { x, y } = pos(rMin, i);
          const isHi = highlight.includes(FIFTHS_MAJORS[i]);
          return (
            <g key={name} {...propsTouche(name)}>
              {anneauFocus(name, x, y, 13)}
              {anneauSon(name, x, y, 13)}
              <circle cx={x} cy={y} r={13}
                fill={isHi ? DC.primaryL : DC.bg}
                stroke={isHi ? DC.primary : DC.border}
                strokeWidth={1}
              />
              <text x={x} y={y + 3} textAnchor="middle"
                fontSize={7} fontWeight={600}
                fill={isHi ? DC.primary : DC.text3} fontFamily={FONT}
              >{name}</text>
            </g>
          );
        })}
      </svg>
    </DiagramCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. DEGREE CHART — les 7 degrés d'une gamme (nom, chiffrage, fonction...)
//
// data = {
//   boxes: [
//     { top: "I", label: "Tonique", tint: "green" },
//     { top: "ii", label: "Sus-tonique", tint: "primary" },
//     ... (jusqu'à 7 entrées, tint parmi les clés de NOTE_COLORS)
//   ],
// }
// ═══════════════════════════════════════════════════════════════════════════
export function DegreeChart({ data, caption }) {
  const DC = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(DC), [DC]);
  const { boxes = [] } = data || {};
  // Son : chaque ligne se touche (la note du degré, ou son accord) ; le
  // bouton les enchaîne toutes, dans l'ordre du tableau.
  const lecteur = useLecteurDiagramme();
  const ctx = useMemo(() => contexteDegres(data, caption), [data, caption]);
  const sons = useMemo(() => boxes.map(b => degreeBoxToNotes(b, ctx)), [boxes, ctx]);
  const ecouterCase = (i) => {
    const r = sons[i];
    if (!r) return;
    lecteur.basculer(`case:${i}`, jouerSequence(r.type === "note"
      ? [{ t: 0, notes: r.notes[0], duree: 1, velocite: 0.85, step: i }]
      : [{ t: 0, notes: r.notes, duree: 1.8, velocite: 0.85, strum: "down", ecart: 0.028, step: i }]));
  };
  const quoi = ctx.modeNote ? "les notes" : "les accords";
  return (
    <DiagramCard caption={caption || "Les degrés de la gamme"} accent={DC.primary} actions={sons.some(Boolean) && (
      <BoutonEcoute {...etatBouton(lecteur, "tout")}
        label={`Écouter ${quoi} du tableau, dans l'ordre`}
        onClick={() => lecteur.basculer("tout", jouerSequence(sequenceDegres(data, caption)))} />
    )}>
      <div style={{ padding: "10px 12px" }}>
        {boxes.map((b, i) => {
          const col = NOTE_COLORS[b.tint] || NOTE_COLORS.neutral;
          const son = sons[i];
          const sonne = lecteur.pas === i && lecteur.etat !== "repos";
          const Ligne = son ? "button" : "div";
          return (
            <Ligne key={i}
              {...(son ? {
                type: "button", className: "gr-focus",
                onClick: () => ecouterCase(i),
                "aria-pressed": etatBouton(lecteur, `case:${i}`).joue,
                "aria-label": `Écouter ${son.type === "note" ? "la note" : "l'accord"} : ${b.top}, ${b.label}${b.sub ? `, ${b.sub}` : ""}`,
              } : {})}
              style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "6px 8px", borderRadius: 8, marginBottom: 3,
              minHeight: 36, textAlign: "left", font: "inherit",
              background: col.fill + "18",
              border: `1.5px solid ${sonne ? DC.text : "transparent"}`,
              cursor: son ? "pointer" : "default",
            }}>
              <span style={{
                minWidth: 28, height: 22, padding: "0 4px", borderRadius: 6,
                background: col.fill,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, fontFamily: FONT,
                color: col.text, flexShrink: 0,
              }}>{b.top}</span>
              <span style={{ flex: 1, fontSize: 11.5, fontFamily: FONT, color: DC.text, fontWeight: 600 }}>{b.label}</span>
              {b.sub && (
                <span style={{ fontSize: 10, fontFamily: FONT, color: DC.text3, flexShrink: 0 }}>{b.sub}</span>
              )}
            </Ligne>
          );
        })}
      </div>
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
  const DC = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(DC), [DC]);
  const { highlight = [], showOnGuitar = false } = data || {};

  // Son : chaque ligne se touche (Do 4 puis la note de l'intervalle) ; le
  // bouton enchaîne les intervalles mis en avant (tous, s'il n'y en a pas).
  const lecteur = useLecteurDiagramme();
  const enAvant = INTERVALS.filter(iv => !highlight.length || highlight.includes(iv.symbol));
  const ecouter = (iv) => lecteur.basculer(`iv:${iv.symbol}`,
    jouerSequence(sequenceIntervalles([{ demiTons: iv.semitones, step: iv.symbol }])));
  const ecouterTout = () => lecteur.basculer("tout",
    jouerSequence(sequenceIntervalles(enAvant.map(iv => ({ demiTons: iv.semitones, step: iv.symbol })))));

  return (
    <DiagramCard caption={caption || "Les 12 intervalles"} accent={DC.primary} actions={
      <BoutonEcoute {...etatBouton(lecteur, "tout")}
        label={`Écouter ${highlight.length ? "les intervalles en surbrillance" : "les 12 intervalles"} depuis Do, l'un après l'autre`}
        onClick={ecouterTout} />
    }>
      <div style={{ padding: "10px 12px" }}>
        {INTERVALS.map(iv => {
          const isHighlighted = highlight.includes(iv.symbol);
          const col = NOTE_COLORS[iv.color] || NOTE_COLORS.neutral;
          const sonne = lecteur.pas === iv.symbol && lecteur.etat !== "repos";
          return (
            <button key={iv.symbol} type="button" className="gr-focus"
              onClick={() => ecouter(iv)}
              aria-pressed={etatBouton(lecteur, `iv:${iv.symbol}`).joue}
              aria-label={`Écouter : ${iv.name} (${pluriel(iv.semitones, "demi-ton")}) depuis Do — ${iv.character}`}
              style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "6px 8px", borderRadius: 8, marginBottom: 3,
              minHeight: 36, textAlign: "left", font: "inherit", cursor: "pointer",
              background: isHighlighted ? col.fill + "18" : "transparent",
              border: sonne ? `1.5px solid ${DC.text}` : isHighlighted ? `1.5px solid ${col.fill}40` : "1.5px solid transparent",
            }}>
              {/* Badge demi-tons */}
              <span style={{
                width: 22, height: 22, borderRadius: 6,
                background: isHighlighted ? col.fill : DC.surface2,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, fontFamily: FONT,
                color: isHighlighted ? col.text : DC.text3,
                flexShrink: 0,
              }}>{iv.semitones}</span>

              {/* Symbole */}
              <span style={{
                width: 28, fontSize: 11, fontWeight: 700, fontFamily: FONT,
                color: isHighlighted ? col.fill : DC.text, flexShrink: 0,
              }}>{iv.symbol}</span>

              {/* Nom */}
              <span style={{ flex: 1, fontSize: 11, fontFamily: FONT, color: DC.text2 }}>{iv.name}</span>

              {/* Caractère */}
              <span style={{ fontSize: 10, fontFamily: FONT, color: isHighlighted ? col.fill : DC.text3, textAlign: "right", flexShrink: 0 }}>
                {iv.character}
              </span>
            </button>
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
  const DC = useC();
  const { name = "", frets = [], fingers = [], startFret = 1, barre } = data;

  // Son : l'accord tel que dessiné (cases réelles × accordage standard),
  // gratté — ou arpégé corde par corde, la corde qui sonne cerclée.
  const lecteur = useLecteurDiagramme();
  const cordes = useMemo(() => cordesDeFrets(frets), [frets]);
  const nomFr = nomAccordFr(name) || "dessiné";
  const pasLecture = lecteur.etat !== "repos" ? lecteur.pas : null;
  const cordeSonne = (i) => pasLecture === "tout" ? cordes.some(c => c.index === i) : cordes[pasLecture]?.index === i;
  const actions = cordes.length > 0 && (
    <>
      <BoutonEcoute {...etatBouton(lecteur, "arpege")} texte="Arpège"
        label={`Écouter l'accord ${nomFr} en arpège, corde par corde`}
        onClick={() => lecteur.basculer("arpege", jouerSequence(sequenceArpege(cordes)))} />
      <BoutonEcoute {...etatBouton(lecteur, "accord")}
        label={`Écouter l'accord ${nomFr}`}
        onClick={() => lecteur.basculer("accord", jouerSequence(sequenceGrattage(cordes)))} />
    </>
  );

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
    <DiagramCard caption={caption || name} accent={DC.primary} actions={actions}>
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
              fill={DC.text} rx={2}
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
            stroke={DC.border} strokeWidth={1.5}
          />
        ))}

        {/* Cordes verticales — épaisseur variable c6 (gauche) → c1 (droite) */}
        {Array.from({ length: STRINGS }, (_, i) => (
          <line key={i}
            x1={sx(i)} y1={TOP_PAD}
            x2={sx(i)} y2={TOP_PAD + FRET_ROWS * ROW_H}
            stroke={DC.text3}
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
                r={cordeSonne(i) ? 7.5 : 6} fill={cordeSonne(i) ? DC.green : "none"}
                stroke={DC.green} strokeWidth={1.5}
              />
            );
          }
          // Note enfoncée
          // Filet de sécurité : si la case est hors des FRET_ROWS lignes
          // affichées (mauvais startFret, voicing trop étiré...), on ignore
          // plutôt que de laisser le point déborder silencieusement du cadre.
          const rowIdx = f - startFret;
          if (rowIdx < 0 || rowIdx >= FRET_ROWS) {
            console.warn(`[ChordDiagram] Note hors zone visible ignorée : corde ${i}, case ${f} (startFret=${startFret})`);
            return null;
          }
          const y = fy(f);
          const finger = fingers[i] || 0;
          return (
            <g key={i}>
              {cordeSonne(i) && <circle cx={x} cy={y} r={NOTE_R + 3.5} fill="none" stroke={DC.text} strokeWidth={2.5} />}
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
  const DC = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(DC), [DC]);
  const { form = "E", root = "La", rootFret = 5, notes = [], startFret = 4, frets = 5 } = data;
  const color = CAGED_COLORS[form] || "primary";
  const tint = NOTE_COLORS[color];

  // Badge form
  const enhancedCaption = caption || `Forme ${form} — ${root} (case ${rootFret})`;

  // Son : la forme jouée comme un accord (une note par corde, du grave vers
  // l'aigu), grattée ou arpégée — la case qui sonne cerclée.
  const lecteur = useLecteurDiagramme();
  const cordes = useMemo(() => cagedVersCordes(data), [data]);
  const pasLecture = lecteur.etat !== "repos" ? lecteur.pas : null;
  const actifs = pasLecture === "tout" ? new Set(cordes.map(c => c.cle))
    : cordes[pasLecture] ? new Set([cordes[pasLecture].cle]) : null;
  const actions = cordes.length > 0 && (
    <>
      <BoutonEcoute {...etatBouton(lecteur, "arpege")} texte="Arpège"
        label={`Écouter la forme ${form} de ${root} en arpège, corde par corde`}
        onClick={() => lecteur.basculer("arpege", jouerSequence(sequenceArpege(cordes)))} />
      <BoutonEcoute {...etatBouton(lecteur, "accord")}
        label={`Écouter la forme ${form} de ${root}`}
        onClick={() => lecteur.basculer("accord", jouerSequence(sequenceGrattage(cordes)))} />
    </>
  );

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
      <FretboardDiagramVue
        data={{ frets, startFret, notes, showStringNames: true, showFretNumbers: true }}
        caption={enhancedCaption}
        actions={actions}
        actifs={actifs}
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
  const DC = useC();
  const NOTE_COLORS = useMemo(() => getNoteColors(DC), [DC]);
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

  // Son : les notes surlignées, de la case la plus basse à la plus haute.
  const lecteur = useLecteurDiagramme();
  const notesCorde = useMemo(() => noteGridToNotes(data), [data]);
  const caseSonne = lecteur.etat !== "repos" ? lecteur.pas : null;
  const actions = notesCorde.length > 0 && (
    <BoutonEcoute {...etatBouton(lecteur, "notes")}
      label={`Écouter les ${notesCorde.length} notes de la corde ${strNum}, de la case ${notesCorde[0].case} à la case ${notesCorde[notesCorde.length - 1].case}`}
      onClick={() => lecteur.basculer("notes", jouerSequence(sequenceMelodique(notesCorde, { ecart: 0.42, duree: 0.7 })))} />
  );

  return (
    <DiagramCard caption={caption || `Notes sur la corde ${strNum} (${stringName})`} accent={DC.amber} actions={actions}>
      <svg
        width="100%"
        viewBox={`0 0 ${svgW} ${H}`}
        style={{ display: "block", minWidth: 280 }}
        aria-label={caption || "Grille de notes"}
      >
        {/* Corde */}
        <line x1={LEFT_PAD} y1={STRING_Y} x2={svgW - 4} y2={STRING_Y}
          stroke={DC.text3} strokeWidth={strNum >= 4 ? 2.2 : 1.4} />

        {/* Frettes */}
        {Array.from({ length: maxFret + 1 }, (_, i) => i).map(f => (
          <line key={f}
            x1={LEFT_PAD + f * CELL_W} y1={STRING_Y - NOTE_R - 2}
            x2={LEFT_PAD + f * CELL_W} y2={STRING_Y + NOTE_R + 2}
            stroke={f === 0 ? DC.text : DC.border}
            strokeWidth={f === 0 ? 3 : 1.2}
          />
        ))}

        {/* Points d'incrustation */}
        {MARKER_FRETS.filter(f => f <= maxFret).map(f => (
          <circle key={f}
            cx={LEFT_PAD + f * CELL_W + CELL_W / 2} cy={STRING_Y + NOTE_R + 8}
            r={3} fill={DC.border}
          />
        ))}

        {/* Notes surlignées */}
        {highlights.map(h => {
          const col = NOTE_COLORS[h.color] || NOTE_COLORS.primary;
          const x = LEFT_PAD + h.fret * CELL_W + (h.fret > 0 ? CELL_W / 2 : 0);
          const y = STRING_Y;
          return (
            <g key={h.fret}>
              {caseSonne === h.fret && <circle cx={x} cy={y} r={NOTE_R + 3.5} fill="none" stroke={DC.text} strokeWidth={2.5} />}
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
// 7bis. TAB — tablature ASCII
//
// block = {
//   type: "tab",
//   caption: "…",            // légende visible sous la tab
//   text: "Tab — corde 1 : 0, 1, 3…", // la même tab dite en mots
//   data: { lines: [         // 6 lignes, corde 1 (Mi aigu) EN HAUT
//     "e|-0---1---3---|",
//     "B|-------------|", …
//   ] },
// }
//
// Accessibilité : le <pre> n'a aucun sens lu caractère par caractère
// (« tiret tiret zéro tiret… »), il est donc masqué aux lecteurs d'écran ;
// c'est `text` qui sert de nom accessible (role="img"). La légende reste
// du texte normal, lue après.
// ═══════════════════════════════════════════════════════════════════════════
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Roboto Mono", monospace';

// Tempo de lecture des tabs de leçon : une colonne = une double-croche à 90.
const TAB_BPM = 90;
const TAB_SUBDIVISION = 0.25;

export function TabBlock({ data, caption, text }) {
  const DC = useC();
  const lines = useMemo(() => (Array.isArray(data?.lines) ? data.lines : []), [data]);
  // Son : la tab passe par le même lecteur que la boîte à outils (tabParser
  // → playTab), avec un curseur qui suit la colonne jouée.
  const lecteur = useLecteurDiagramme();
  const evenements = useMemo(() => (lines.length ? parseTab(lines.join("\n")).evenements : []), [lines]);
  // Curseur : seulement pour une tab d'un seul système (6 lignes), où la
  // colonne de l'analyseur = position du caractère après « e| ».
  const decalage = lines.length === 6 ? decalageLigneTab(lines[0]) : null;
  const curseur = lecteur.etat !== "repos" && lecteur.pas && decalage != null ? lecteur.pas : null;
  const ecouter = () => lecteur.basculer("tab", ({ onStep }) => {
    playTab(evenements, {
      bpm: TAB_BPM, subdivision: TAB_SUBDIVISION,
      onEvent: (ev) => onStep({ col: ev.col, largeur: String(ev.fret ?? ev.fromFret ?? "").length || 1 }),
    });
    const spc = (60 / TAB_BPM) * TAB_SUBDIVISION;
    const dernier = Math.max(...evenements.map(e => e.toCol ?? e.col));
    return (dernier + 2) * spc * 1000 + 600;   // + avance de playTab et résonance de la dernière note
  });
  if (lines.length === 0) {
    return text ? <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: DC.text }}>{text}</p> : null;
  }
  return (
    <DiagramCard caption={caption} accent={DC.primary} actions={evenements.length > 0 && (
      <BoutonEcoute {...etatBouton(lecteur, "tab")} label="Écouter la tablature" onClick={ecouter} />
    )}>
      <div role="img" aria-label={text || caption || "Tablature"} style={{ padding: "12px 14px", width: "max-content", minWidth: "100%", boxSizing: "border-box" }}>
        <pre aria-hidden="true" style={{
          margin: 0, fontFamily: MONO, fontSize: 14, lineHeight: 1.45,
          whiteSpace: "pre", color: DC.text3, fontWeight: 600, position: "relative",
        }}>
          {curseur && (
            <span style={{
              position: "absolute", top: -2, bottom: -2,
              left: `${decalage + curseur.col}ch`, width: `${curseur.largeur}ch`,
              background: DC.primaryL, borderRadius: 3,
              boxShadow: `0 0 0 2px ${DC.primary}`,
            }} />
          )}
          {lines.map((ligne, i) => {
            // Nom de corde (« e| ») en secondaire, chiffres (cases) mis en
            // valeur, tirets et barres en tertiaire.
            const m = /^([A-Za-z]{1,2}\|)?(.*)$/.exec(String(ligne));
            const morceaux = (m[2] || "").split(/(\d+)/);
            return (
              <span key={i} style={{ display: "block", position: "relative" }}>
                {m[1] && <span style={{ color: DC.text2, fontWeight: 700 }}>{m[1]}</span>}
                {morceaux.map((t, j) => (j % 2 === 1
                  ? <span key={j} style={{ color: DC.primaryInk || DC.primary, fontWeight: 800 }}>{t}</span>
                  : t))}
              </span>
            );
          })}
        </pre>
      </div>
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
    case "circle_of_fifths": return <CircleOfFifths key={key} data={data} caption={caption} />;
    case "degree_chart":   return <DegreeChart key={key} data={data} caption={caption} />;
    case "tab":            return <TabBlock key={key} data={data} caption={caption} text={block.text} />;
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
  const DC = useC();
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

  // Son : deux mesures, attaques tenues jusqu'à la suivante, la case jouée
  // cerclée. Un clic léger marque les temps quand la grille distingue des
  // attaques (ronde, syncope…), pour qu'on sente la pulsation dessous.
  const lecteur = useLecteurDiagramme();
  const rythme = useMemo(() => rhythmBlockToEvents(data), [data]);
  const caseSonne = lecteur.etat !== "repos" ? lecteur.pas : null;
  const actions = rythme.evenements.length > 0 && (
    <BoutonEcoute {...etatBouton(lecteur, "rythme")}
      label={`Écouter le rythme : 2 mesures à ${rythme.bpm} BPM`}
      onClick={() => lecteur.basculer("rythme", jouerSequence(rythme.evenements))} />
  );

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
    if (subdivision === 12) {
      if (sub === 1) return "trip";
      if (sub === 2) return "let";
    }
    if (subdivision === 16) {
      if (sub === 1) return "e";
      if (sub === 2) return "et";
      if (sub === 3) return "a";
    }
    return "";
  };

  return (
    <DiagramCard caption={caption || label} accent={DC.green} actions={actions}>
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
            stroke={b === 0 || b === beats ? DC.text : DC.border}
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
                stroke={caseSonne === i ? DC.text : "none"} strokeWidth={caseSonne === i ? 2.5 : 0}
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
function getStrumColors(DC) {
  return {
    B:  { bg: DC.primary,  text: "#fff",        label: "↓" },
    H:  { bg: DC.blue,     text: "#fff",        label: "↑" },
    BH: { bg: DC.primary,  text: "#fff",        label: "↓↑" },
    "-H":{ bg: DC.blue,    text: "#fff",        label: "↑" },
    "-":{ bg: DC.surface2, text: DC.text3,      label: "–" },
    x:  { bg: DC.amber,    text: "#fff",        label: "×" },
  };
}

function getStyleColors(DC) {
  return {
    folk:    DC.green,
    pop:     DC.primary,
    rock:    DC.coral,
    reggae:  DC.amber,
    blues:   DC.amber,
    bossa:   DC.pink,
    funk:    DC.coral,
  };
}

export function StrumPattern({ data, caption }) {
  const DC = useC();
  const STRUM_COLORS = useMemo(() => getStrumColors(DC), [DC]);
  const STYLE_COLORS = useMemo(() => getStyleColors(DC), [DC]);
  const { pattern = [], beats = 4, style = "folk", bpm } = data;
  const CELL_W = 40;
  const CELL_H = 44;
  const LEFT_PAD = 8;
  const TOP_PAD = 24;
  const svgW = LEFT_PAD * 2 + pattern.length * CELL_W;
  const svgH = TOP_PAD + CELL_H + 24;
  const accent = STYLE_COLORS[style] || DC.primary;

  // Son : deux mesures du pattern sur un accord typique du style (Sol en
  // folk, Mi5 en rock…), coups bas / haut / étouffés, la case jouée cerclée.
  const lecteur = useLecteurDiagramme();
  const grattage = useMemo(() => strumBlockToEvents(data), [data]);
  const caseSonne = lecteur.etat !== "repos" ? lecteur.pas : null;
  const actions = grattage.evenements.some(e => e.notes?.length) && (
    <BoutonEcoute {...etatBouton(lecteur, "grattage")}
      label={`Écouter le pattern de grattage : 2 mesures à ${grattage.bpm} BPM`}
      onClick={() => lecteur.basculer("grattage", jouerSequence(grattage.evenements))} />
  );

  return (
    <DiagramCard caption={caption || `Pattern ${style}${bpm ? ` · ${bpm} BPM` : ""}`} accent={accent} actions={actions}>
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
                stroke={caseSonne === i ? DC.text : "none"} strokeWidth={caseSonne === i ? 2.5 : 0}
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
              stroke={DC.border} strokeWidth={1}
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
