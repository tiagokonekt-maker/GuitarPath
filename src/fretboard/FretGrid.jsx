// ═══════════════════════════════════════════════════════════════════════════
// Groply — fretboard/FretGrid.jsx
// Grille du manche (cordes × cases) partagée par <Fretboard />, le canvas du
// quiz et le canvas d'exercice. Les trois ré-implémentaient chacun la même
// grille (numéros, sillet, filets, cordes, repères) avec de petites
// variations : elles sont regroupées ici en deux variantes visuelles.
//
// ── Accessibilité clavier ─────────────────────────────────────────────────
// Avant : chaque case portait role="button" tabIndex={0}, même en simple
// affichage → 80 à 150 arrêts de tabulation par manche. Maintenant :
//   • non interactif : role="img" + aria-label résumant le manche, les cases
//     ne sont ni focusables ni annoncées une à une ;
//   • interactif : role="grid" avec tabIndex itinérant (un seul arrêt de
//     tabulation), flèches pour changer de corde / de case, Début / Fin pour
//     la première / dernière case, Entrée ou Espace pour activer.
//
// ── Survol ────────────────────────────────────────────────────────────────
// Le survol passait par des mutations directes de style (onMouseEnter). Il
// est désormais en CSS, limité aux appareils qui survolent vraiment
// (@media (hover: hover)) : plus de case « collée » en surbrillance au doigt.
// ═══════════════════════════════════════════════════════════════════════════

import { useRef, useState } from "react";
import { useC } from "../design/ThemeContext.jsx";
import { T } from "../design/tokens.js";
import { getNoteAtPosition, noteToFr, MARKER_FRETS, DOUBLE_MARKER_FRETS } from "../fretboardUtils.js";

const FONT_UI = '"Inter", "Helvetica Neue", -apple-system, sans-serif';

// ── Injection unique des styles (idempotent) ──────────────────────────────
// Outline rentrée : le manche est dans un conteneur à défilement horizontal
// qui rognerait l'anneau de focus global (outline-offset: 2px) sur les bords.
if (typeof document !== "undefined" && !document.getElementById("gr-fretgrid-styles")) {
  const s = document.createElement("style");
  s.id = "gr-fretgrid-styles";
  s.textContent = `
    @media (hover: hover) {
      .gr-fret-cell[data-interactive]:hover { background: var(--gr-fret-survol); }
    }
    .gr-fret-cell:focus-visible { outline-offset: -3px; }
  `;
  document.head.appendChild(s);
}

// ── Retour haptique ───────────────────────────────────────────────────────
// Sur un manche, la confirmation tactile compte autant que la confirmation
// visuelle : l'utilisateur a les yeux sur sa guitare, pas sur l'écran.
const vibrer = (ms = 8) => {
  try { navigator.vibrate?.(ms); } catch { /* non supporté */ }
};

// ── Libellé lu par un lecteur d'écran pour une case ───────────────────────
// Ex. « Corde de Mi grave, case 3, Sol ». Le numéro de corde seul (« Corde
// 6 ») ne parle qu'aux guitaristes déjà aguerris.
const NOMS_CORDES = { 6: "Mi grave", 5: "La", 4: "Ré", 3: "Sol", 2: "Si", 1: "Mi aigu" };
const labelCase = (corde, fret, note, nomNote = noteToFr) => {
  const nom = `Corde de ${NOMS_CORDES[corde] ?? corde}`;
  const n = note ? nomNote(note) : "";
  return fret === 0
    ? `${nom} à vide${n ? `, ${n}` : ""}`
    : `${nom}, case ${fret}${n ? `, ${n}` : ""}`;
};

// ── Épaisseur des cordes (esthétique) ─────────────────────────────────────
// Corde 6 = Mi grave (la plus épaisse), corde 1 = Mi aigu (la plus fine)
const EPAISSEURS_CORDES = { 6: 3, 5: 2.5, 4: 2, 3: 1.5, 2: 1.5, 1: 1 };

const STRING_LABELS = { 6: "E₂", 5: "A₂", 4: "D₃", 3: "G₃", 2: "B₃", 1: "E₄" };
const CORDES = [1, 2, 3, 4, 5, 6];

// ── Repères (points sous le manche) ───────────────────────────────────────
function RepereStandard({ isDouble }) {
  const C = useC();
  const point = <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.border }} />;
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: isDouble ? 6 : 0, height: 10, marginTop: 2 }}>
      {point}
      {isDouble && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.border }} />}
    </div>
  );
}

function RepereDense({ isDouble }) {
  const C = useC();
  if (!isDouble) return <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border, margin: "2px auto 0" }} />;
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 2 }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.border }} />
    </div>
  );
}

// ── Variantes visuelles ───────────────────────────────────────────────────
// « standard » : <Fretboard /> (explorateur, leçons, jam).
// « dense »    : canvas du quiz et de l'exercice (filets plus fins, numéros
//                et repères plus serrés).
const VARIANTES = {
  standard: {
    conteneur: { minWidth: "fit-content", paddingBottom: 2 },
    margeNumeros: 2, margeReperes: 0,
    numero: { height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 },
    sillet: 3, filet: 1, survol: "08",
    Repere: RepereStandard,
  },
  dense: {
    conteneur: { display: "flex", flexDirection: "column", minWidth: "fit-content" },
    margeNumeros: 1, margeReperes: 1,
    numero: { textAlign: "center", fontSize: T.micro, height: 16, lineHeight: "16px" },
    sillet: 2, filet: 0.5, survol: "0A",
    Repere: RepereDense,
  },
};

/**
 * Props :
 * frets          : number[] — cases frettées affichées (> 0), dans l'ordre
 * showOpen       : affiche la colonne des cordes à vide (case 0)
 * showStringNames, showFretNumbers : bandeaux latéral / supérieur
 * cellW, cellH, openW, labelW : dimensions (px)
 * variant        : "standard" | "dense"
 * epaisseurs     : { [corde]: px } — épaisseur des cordes
 * renderCell     : (corde, case) => ReactNode — pastille éventuelle
 * interactive    : cases activables (souris, tactile, clavier)
 * onCellClick    : (corde, case) => void
 * isCellSelected : (corde, case) => boolean — expose aria-selected (optionnel)
 * ariaLabel      : résumé du manche (lu en entier en mode non interactif)
 * nomNote        : (note interne) => nom lu — orthographié selon la tonalité
 *                  quand l'appelant en connaît une (défaut : noteToFr, dièses)
 */
export function FretGrid({
  frets,
  showOpen = true,
  showStringNames = true,
  showFretNumbers = true,
  cellW, cellH, openW, labelW,
  variant = "standard",
  epaisseurs = EPAISSEURS_CORDES,
  renderCell,
  interactive = false,
  onCellClick,
  isCellSelected,
  ariaLabel = "Manche de guitare",
  nomNote = noteToFr,
}) {
  const C = useC();
  const V = VARIANTES[variant] ?? VARIANTES.standard;
  const colonnes = showOpen ? [0, ...frets] : frets;

  // ── TabIndex itinérant : une seule case focusable à la fois ─────────────
  const [actif, setActif] = useState(null);
  const actifValide = actif && CORDES.includes(actif.s) && colonnes.includes(actif.f)
    ? actif : { s: CORDES[0], f: colonnes[0] };
  const refs = useRef(new Map());

  const focaliser = (s, f) => {
    setActif({ s, f });
    refs.current.get(`${s}-${f}`)?.focus();
  };

  const activer = (s, f) => { vibrer(); onCellClick?.(s, f); };

  const onKeyDown = (e, s, f) => {
    const ri = CORDES.indexOf(s);
    const ci = colonnes.indexOf(f);
    const dernier = colonnes.length - 1;
    let r = ri, c = ci;
    switch (e.key) {
      case "ArrowUp":    r = Math.max(0, ri - 1); break;
      case "ArrowDown":  r = Math.min(CORDES.length - 1, ri + 1); break;
      case "ArrowLeft":  c = Math.max(0, ci - 1); break;
      case "ArrowRight": c = Math.min(dernier, ci + 1); break;
      case "Home":       c = 0; if (e.ctrlKey) r = 0; break;
      case "End":        c = dernier; if (e.ctrlKey) r = CORDES.length - 1; break;
      case "Enter":
      case " ":
        e.preventDefault();
        activer(s, f);
        return;
      default:
        return;
    }
    e.preventDefault();
    focaliser(CORDES[r], colonnes[c]);
  };

  // Attributs d'une case selon le mode
  const propsCase = (s, f) => {
    if (!interactive) return {};
    const k = `${s}-${f}`;
    const estActif = actifValide.s === s && actifValide.f === f;
    return {
      ref: (el) => { if (el) refs.current.set(k, el); else refs.current.delete(k); },
      role: "gridcell",
      tabIndex: estActif ? 0 : -1,
      "aria-label": labelCase(s, f, getNoteAtPosition(s, f), nomNote),
      ...(isCellSelected ? { "aria-selected": !!isCellSelected(s, f) } : {}),
      "data-interactive": "",
      onClick: () => { setActif({ s, f }); activer(s, f); },
      onFocus: () => { if (!estActif) setActif({ s, f }); },
      onKeyDown: (e) => onKeyDown(e, s, f),
    };
  };

  const cursor = interactive ? "pointer" : "default";

  const ligneCorde = (s, extra) => (
    <div style={{
      position: "absolute",
      left: 0, right: 0,
      top: "50%",
      height: epaisseurs[s] || 1.5,
      background: C.border,
      transform: "translateY(-50%)",
      ...extra,
    }} />
  );

  const espaceurs = (
    <>
      {showStringNames && <div style={{ width: labelW, flexShrink: 0 }} />}
      {showOpen && <div style={{ width: openW, flexShrink: 0 }} />}
    </>
  );

  return (
    <div
      role={interactive ? "grid" : "img"}
      aria-label={ariaLabel}
      {...(interactive && isCellSelected ? { "aria-multiselectable": true } : {})}
      style={{ ...V.conteneur, "--gr-fret-survol": `${C.primary}${V.survol}` }}
    >
      {/* ── Numéros de cases ──────────────────────────────────────────── */}
      {showFretNumbers && (
        <div aria-hidden="true" style={{ display: "flex", marginBottom: V.margeNumeros }}>
          {espaceurs}
          {frets.map(f => (
            <div key={f} style={{
              width: cellW,
              flexShrink: 0,
              color: C.text3,
              fontFamily: FONT_UI,
              fontWeight: f % 12 === 0 ? 700 : 400,
              ...V.numero,
            }}>
              {f}
            </div>
          ))}
        </div>
      )}

      {/* ── Corps du manche ───────────────────────────────────────────── */}
      {CORDES.map(s => (
        <div key={s} role={interactive ? "row" : undefined} style={{ display: "flex", alignItems: "center", position: "relative" }}>

          {/* Label de corde (redondant avec l'aria-label des cases) */}
          {showStringNames && (
            <div aria-hidden="true" style={{
              width: labelW,
              height: cellH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: T.micro,
              fontWeight: 700,
              color: C.text3,
              fontFamily: FONT_UI,
              flexShrink: 0,
            }}>{STRING_LABELS[s]}</div>
          )}

          {/* Corde à vide */}
          {showOpen && (
            <div
              className="gr-fret-cell"
              {...propsCase(s, 0)}
              style={{
                width: openW,
                height: cellH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                cursor,
              }}
            >
              {ligneCorde(s)}
              <div style={{ position: "relative", zIndex: 2 }}>{renderCell(s, 0)}</div>
            </div>
          )}

          {/* Cases frettées */}
          {frets.map((f, fi) => (
            <div
              key={f}
              className="gr-fret-cell"
              {...propsCase(s, f)}
              style={{
                width: cellW,
                height: cellH,
                position: "relative",
                flexShrink: 0,
                cursor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Filet de gauche (plus épais pour le sillet) */}
              <div style={{
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: fi === 0 ? V.sillet : V.filet,
                background: fi === 0 ? C.text : C.border,
              }} />
              {ligneCorde(s, { zIndex: 0 })}
              <div style={{ position: "relative", zIndex: 2 }}>{renderCell(s, f)}</div>
            </div>
          ))}
        </div>
      ))}

      {/* ── Repères visuels ───────────────────────────────────────────── */}
      <div aria-hidden="true" style={{ display: "flex", marginTop: V.margeReperes }}>
        {espaceurs}
        {frets.map(f => (
          <div key={f} style={{ width: cellW, flexShrink: 0 }}>
            {MARKER_FRETS.includes(f) && <V.Repere isDouble={false} />}
            {DOUBLE_MARKER_FRETS.includes(f) && <V.Repere isDouble={true} />}
          </div>
        ))}
      </div>
    </div>
  );
}
