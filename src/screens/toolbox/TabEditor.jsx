// Groply — src/screens/toolbox/TabEditor.jsx
// Éditeur de tablature de la boîte à outils (chargé à la demande par ToolboxScreen).
import { useState, useRef, useEffect, useCallback, useMemo, useId } from "react";
import { FONTS, R } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Ti } from "../../design/Ti.jsx";
import { playTab, stopAll, unlockAudio } from "../../audioEngine.js";
import { parseTab } from "../../tab/tabParser.js";
import {
  grilleVide, lireCase, ecrireCase, derniereColonne, nbColsVisibles, nbMesuresUtilisees,
  compatibleCroches, saisirChiffre, poserFret, grilleVersEvenements, evenementsVersGrille,
  grilleExemple, grilleValide, PAS_PAR_MESURE,
} from "../../tab/tabGrid.js";

// ══ Éditeur de tablature ════════════════════════════════════════════════
// On touche une case de la tab (corde × temps), puis on choisit la case du
// manche dans la grille 0-24 dessous. Une seule surface : l'aperçu alphaTab
// a été retiré, il doublait la grille sans permettre d'éditer. Toute la
// logique (modèle, conversions) vit dans tab/tabGrid.js, testée à part.
//
// Principes d'UX appliqués :
//   • manipulation directe — on touche la note là où elle est ;
//   • un appui par note : la case du manche se choisit dans une grille,
//     pas en tapant deux chiffres dans un délai invisible ;
//   • tout est réversible (« Annuler ») plutôt que protégé par des
//     confirmations ; les actions secondaires vivent dans un menu « ⋯ » ;
//   • une ligne d'aide contextuelle dit quoi faire, au lieu d'un mode
//     d'emploi à lire avant de commencer ;
//   • lecture et tempo en bas, dans la zone du pouce.
const CORDES_LABELS = ["e", "B", "G", "D", "A", "E"];   // corde 1 en haut, comme à l'écrit
const CELL_H = 34;
const HAUT_ENTETE = 16;                          // bande des numéros de mesure
const LARGEUR_CASE = { 2: 38, 1: 32 };           // croches : une mesure tient à l'écran
const STOCKAGE_TAB = "groply:tab-brouillon";
const HISTORIQUE_MAX = 60;
const DELAI_DEUX_CHIFFRES = 900;                 // clavier physique uniquement
const REPERES_SIMPLES = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const REPERES_DOUBLES = new Set([12, 24]);

function styleTouche(C, actif, extra = {}) {
  return {
    height: 40, borderRadius: R.sm, cursor: "pointer", fontFamily: FONTS.ui,
    border: `1.5px solid ${actif ? C.primary : C.border}`,
    background: actif ? C.primaryL : C.surface, color: actif ? C.primaryD : C.text,
    fontWeight: 800, fontSize: 14, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 2, padding: 0, ...extra,
  };
}

function GrilleTab({ grille, evenements, res, selection, onSelect, onKeyDown, colLecture, C }) {
  const grilleRef = useRef(null);
  const scrollRef = useRef(null);
  const prefixeId = useId();
  const idCase = (corde, col) => `${prefixeId}-case-${corde}-${col}`;
  const nbCols = nbColsVisibles(grille);
  const cellW = LARGEUR_CASE[res];
  const nbCases = nbCols / res;
  const casesParMesure = PAS_PAR_MESURE / res;
  const casesParTemps = 4 / res;
  const vide = derniereColonne(grille) < 0;
  const liaisons = evenements.filter(e => e.toCol != null);
  const origines = new Set(liaisons.map(e => `${e.string}-${e.col}`));

  // Garde visible la case active : la sélection quand on édite, la tête de
  // lecture (à ~30 % du bord, pour voir venir la suite) quand on écoute.
  // Si le focus clavier est dans la grille, il suit la sélection (déplacée
  // aux flèches) — sinon il resterait sur une case qui n'est plus active.
  // (Si c'est la grille elle-même qui a le focus, rien à faire :
  // aria-activedescendant désigne déjà la case sélectionnée.)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !el.contains(document.activeElement)) return;
    el.querySelector(`[data-case="${selection.corde}-${selection.col}"]`)?.focus({ preventScroll: true });
  }, [selection]);

  const colSuivie = colLecture ?? selection.col;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const x = (colSuivie / res) * cellW;
    const horsVue = x < el.scrollLeft + 8 || x + cellW > el.scrollLeft + el.clientWidth - 8;
    if (colLecture != null || horsVue) {
      // Défilement animé, sauf si l'utilisateur a demandé moins d'animations.
      const reduit = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: Math.max(0, x - el.clientWidth * 0.3), behavior: reduit ? "auto" : "smooth" });
    }
  }, [colSuivie, colLecture, res, cellW]);

  // La grille entière est UN arrêt de tabulation (motif ARIA « grid ») : elle
  // reçoit les raccourcis clavier, et aria-activedescendant annonce la case
  // sélectionnée. Les cases restent des boutons pour le toucher et la souris ;
  // une frappe sur une case remonte jusqu'ici.
  return (
    <div ref={grilleRef} role="grid" tabIndex={0} className="gr-focus" onKeyDown={onKeyDown}
      aria-label="Tablature. Flèches pour se déplacer, chiffres pour la case, x étouffée, h liaison, s slide, b bend, Retour arrière pour effacer, Espace pour écouter."
      aria-activedescendant={idCase(selection.corde, selection.col)}
      style={{ position: "relative", display: "flex", border: `1.5px solid ${C.border}`, borderRadius: R.md, background: C.surface, overflow: "hidden" }}>
      {/* Noms de corde, fixes ; la corde sélectionnée est mise en avant */}
      <div aria-hidden="true" style={{ flexShrink: 0, width: 24, background: C.surface2, borderRight: `1.5px solid ${C.border}`, paddingTop: HAUT_ENTETE }}>
        {CORDES_LABELS.map((l, i) => (
          <div key={l + i} style={{ height: CELL_H, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11.5, fontWeight: 800, color: selection.corde === i + 1 ? C.primary : C.text3 }}>{l}</div>
        ))}
      </div>

      <div ref={scrollRef} style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", flex: 1 }}>
        <div style={{ position: "relative", width: nbCases * cellW, height: HAUT_ENTETE + CELL_H * 6 }}>
          {/* Un temps sur deux légèrement teinté : on lit le rythme d'un coup d'œil */}
          {Array.from({ length: nbCols / 4 }, (_, t) => t % 2 === 1 ? (
            <div key={"t" + t} aria-hidden="true" style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: t * casesParTemps * cellW, width: casesParTemps * cellW, background: C.surface2, opacity: .55 }} />
          ) : null)}

          {/* Colonne sélectionnée, puis tête de lecture */}
          <div aria-hidden="true" style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: (selection.col / res) * cellW, width: cellW, background: C.primaryL, opacity: .6 }} />
          {colLecture != null && (
            <div aria-hidden="true" style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: (colLecture / res) * cellW, width: cellW, background: C.primary, opacity: .22 }} />
          )}

          {/* Numéros et barres de mesure */}
          {Array.from({ length: nbCols / PAS_PAR_MESURE }, (_, m) => (
            <div key={"n" + m} aria-hidden="true" style={{ position: "absolute", top: 1, left: m * casesParMesure * cellW + 5, fontSize: 10, fontWeight: 700, color: C.text3 }}>{m + 1}</div>
          ))}
          {Array.from({ length: nbCols / PAS_PAR_MESURE }, (_, m) => m > 0 ? (
            <div key={"b" + m} aria-hidden="true" style={{ position: "absolute", top: HAUT_ENTETE + CELL_H / 2, height: CELL_H * 5, left: m * casesParMesure * cellW - 1, width: 2, background: C.text3 }} />
          ) : null)}

          {/* Les 6 cordes et leurs cases */}
          {CORDES_LABELS.map((label, idx) => {
            const corde = idx + 1;
            return (
              <div key={corde} role="row" style={{ position: "absolute", top: HAUT_ENTETE + idx * CELL_H, left: 0, height: CELL_H, width: "100%", display: "flex" }}>
                <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: CELL_H / 2, height: 1.5, background: C.border }} />
                {Array.from({ length: nbCases }, (_, d) => {
                  const col = d * res;
                  const cell = lireCase(grille, corde, col);
                  const sel = selection.corde === corde && selection.col === col;
                  const enAttente = cell && (cell.lie || cell.slide) && !origines.has(`${corde}-${col}`);
                  const repere = cell?.bend === 2 ? "full" : cell?.bend === 1 ? "½" : enAttente ? (cell.slide ? "sl…" : "h/p…") : "";
                  return (
                    <button key={col} onClick={() => onSelect({ corde, col })} className="gr-focus"
                      role="gridcell"
                      id={idCase(corde, col)}
                      data-case={`${corde}-${col}`}
                      tabIndex={-1}
                      aria-selected={sel}
                      aria-label={`Corde ${label}, mesure ${Math.floor(col / PAS_PAR_MESURE) + 1}, temps ${Math.floor((col % PAS_PAR_MESURE) / 4) + 1}${cell ? (cell.mute ? ", note étouffée" : `, case ${cell.fret}`) : ", vide"}`}
                      style={{ position: "relative", width: cellW, height: CELL_H, flexShrink: 0, padding: 0, background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {cell ? (
                        <span style={{
                          position: "relative", zIndex: 1, minWidth: 18, padding: "1px 3px", borderRadius: 4,
                          fontFamily: "monospace", fontWeight: 800, fontSize: 13.5, lineHeight: "18px",
                          background: sel ? C.primary : C.surface, color: sel ? C.onPrimaryBtn : C.text,
                        }}>{cell.mute ? "x" : cell.fret}</span>
                      ) : sel ? (
                        <span style={{ position: "relative", zIndex: 1, width: 20, height: 20, borderRadius: 5, border: `2px solid ${C.primary}`, background: C.surface }} />
                      ) : null}
                      {repere && (
                        <span style={{ position: "absolute", top: -1, right: 1, zIndex: 2, fontSize: 9.5, fontWeight: 800, color: enAttente ? C.text3 : C.primary }}>{repere}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Liaisons, dessinées comme sur une tab imprimée */}
          {liaisons.map((e, i) => {
            const x1 = (e.col / res) * cellW + cellW / 2;
            const x2 = (e.toCol / res) * cellW + cellW / 2;
            const y = HAUT_ENTETE + (e.string - 1) * CELL_H;
            if (e.type === "hammer" || e.type === "pull") {
              return (
                <div key={"l" + i} aria-hidden="true" style={{ pointerEvents: "none" }}>
                  <div style={{ position: "absolute", zIndex: 3, left: x1 + 5, width: Math.max(6, x2 - x1 - 10), top: y + 3, height: 8, border: `1.5px solid ${C.primary}`, borderBottom: "none", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />
                  <div style={{ position: "absolute", zIndex: 4, left: (x1 + x2) / 2 - 4, top: y - 3, fontSize: 9, fontWeight: 800, lineHeight: "10px", color: C.primary, background: C.surface, padding: "0 1px" }}>{e.type === "hammer" ? "h" : "p"}</div>
                </div>
              );
            }
            return (
              <div key={"l" + i} aria-hidden="true" style={{ position: "absolute", zIndex: 3, pointerEvents: "none", left: (x1 + x2) / 2 - 5, top: y + CELL_H / 2 - 9, fontSize: 14, fontWeight: 800, color: C.primary, lineHeight: "16px" }}>
                {e.type === "slide_up" ? "/" : "\\"}
              </div>
            );
          })}
        </div>
      </div>

      {vide && (
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text2, background: C.surface, padding: "6px 10px", borderRadius: R.sm, border: `1px solid ${C.border}` }}>
            Touche une case pour placer ta première note
          </div>
        </div>
      )}
    </div>
  );
}

/** Grille 0-24, avec les repères de touche d'un vrai manche (3, 5, 7, 9, 12…). */
function ClavierManche({ cell, onFret, onMute, onEffacer, C }) {
  const fretActif = cell && !cell.mute ? cell.fret : null;
  const point = (k) => <span key={k} style={{ width: 4, height: 4, borderRadius: 2, background: C.text3 }} />;
  return (
    <div role="group" aria-label="Case du manche" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
      {Array.from({ length: 25 }, (_, f) => (
        <button key={f} onClick={() => onFret(f)} aria-pressed={fretActif === f} className="gr-focus" style={styleTouche(C, fretActif === f)}>
          <span style={{ lineHeight: "16px" }}>{f}</span>
          <span aria-hidden="true" style={{ display: "flex", gap: 3, height: 4 }}>
            {REPERES_DOUBLES.has(f) ? [point(1), point(2)] : REPERES_SIMPLES.has(f) ? [point(1)] : null}
          </span>
        </button>
      ))}
      <button onClick={onMute} aria-pressed={!!cell?.mute} aria-label="Note étouffée" className="gr-focus" style={styleTouche(C, !!cell?.mute)}>x</button>
      <button onClick={onEffacer} disabled={!cell} className="gr-focus"
        style={styleTouche(C, false, { gridColumn: "span 2", fontSize: 12.5, opacity: cell ? 1 : .4, cursor: cell ? "pointer" : "default" })}>
        Effacer
      </button>
    </div>
  );
}

function TechniquesNote({ cell, onLie, onSlide, onBend, C }) {
  const aNote = !!cell && !cell.mute && typeof cell.fret === "number";
  const bouton = (label, actif, onClick) => (
    <button onClick={onClick} disabled={!aNote} aria-pressed={actif} className="gr-focus"
      style={styleTouche(C, actif, { flex: 1, fontSize: 12.5, opacity: aNote ? 1 : .4, cursor: aNote ? "pointer" : "default" })}>
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Technique de la note" style={{ display: "flex", gap: 5, marginTop: 5 }}>
      {bouton("Liaison h/p", !!cell?.lie, onLie)}
      {bouton("Slide", !!cell?.slide, onSlide)}
      {bouton(cell?.bend === 2 ? "Bend · 1 ton" : cell?.bend === 1 ? "Bend · ½ ton" : "Bend", !!cell?.bend, onBend)}
    </div>
  );
}

function ItemMenu({ icon, label, onClick, onFermer, danger, C }) {
  return (
    <button role="menuitem" onClick={() => { onFermer(); onClick(); }} className="gr-focus" style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "11px 12px", border: "none",
      background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 700, textAlign: "left",
      color: danger ? C.primaryD : C.text, fontFamily: FONTS.ui,
    }}>
      <Ti name={icon} size={16} color={danger ? C.primary : C.text2} />{label}
    </button>
  );
}

function initialiserEditeur() {
  let grille = null;
  try {
    const brut = localStorage.getItem(STOCKAGE_TAB);
    if (brut) {
      const g = JSON.parse(brut);
      if (grilleValide(g)) grille = { notes: g.notes };
    }
  } catch { /* stockage indisponible ou corrompu : on repart de l'exemple */ }
  return grille || grilleExemple();
}

export function TabEditor() {
  const C = useC();

  // Grille + historique dans un même état, mis à jour par des fonctions
  // PURES : React (mode strict) peut les exécuter deux fois sans doubler
  // une entrée d'historique. Initialiseur paresseux : le brouillon n'est lu
  // qu'une fois, au montage.
  const [edit, setEdit] = useState(() => ({ grille: initialiserEditeur(), passe: [] }));
  const grille = edit.grille;
  // Au premier rendu, `grille` est la grille initiale : même résultat qu'avant.
  const [res, setRes] = useState(() => (compatibleCroches(grille) ? 2 : 1));
  const [selection, setSelection] = useState({ corde: 3, col: 0 });
  const [bpm, setBpm] = useState(80);
  const [boucle, setBoucle] = useState(false);
  const [jouant, setJouant] = useState(false);
  const [colLecture, setColLecture] = useState(null);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [importOuvert, setImportOuvert] = useState(false);
  const [texteImport, setTexteImport] = useState("");
  const [erreurImport, setErreurImport] = useState(null);
  const [message, setMessage] = useState(null);

  const enLectureRef = useRef(false);
  const timerBoucleRef = useRef(null);
  // Miroirs lus par les callbacks de lecture (onDone, minuterie de boucle).
  // Ils sont tenus à jour là où l'état change — `changerTempo` et
  // `basculerBoucle`, seuls à appeler setBpm / setBoucle — et non pendant
  // le rendu.
  const boucleRef = useRef(boucle);
  const bpmRef = useRef(bpm);
  const derniereSaisieRef = useRef(null);
  const menuRef = useRef(null);
  const timerMessageRef = useRef(null);

  const evenements = useMemo(() => grilleVersEvenements(grille), [grille]);
  const origines = useMemo(() => new Set(evenements.filter(e => e.toCol != null).map(e => `${e.string}-${e.col}`)), [evenements]);
  const cellSel = lireCase(grille, selection.corde, selection.col);

  // Brouillon conservé entre deux visites (même appareil).
  useEffect(() => {
    try { localStorage.setItem(STOCKAGE_TAB, JSON.stringify(grille)); } catch { /* noop */ }
  }, [grille]);

  // Une tab importée (ou restaurée par « Annuler ») peut contenir des
  // doubles-croches : la vue croches les cacherait, on bascule donc seul.
  // Ajustements faits PENDANT le rendu (motif React « ajuster un état quand
  // une donnée change ») plutôt que dans un effet : React relance aussitôt
  // le rendu, sans afficher d'abord une image incohérente.
  if (res === 2 && !compatibleCroches(grille)) setRes(1);
  const colMax = nbColsVisibles(grille) - res;
  if (selection.col > colMax) setSelection({ ...selection, col: colMax });

  const annoncer = useCallback((txt) => {
    setMessage(txt);
    clearTimeout(timerMessageRef.current);
    timerMessageRef.current = setTimeout(() => setMessage(null), 3500);
  }, []);
  const effacerMessage = useCallback(() => { setMessage(null); clearTimeout(timerMessageRef.current); }, []);

  const modifier = useCallback((fn) => {
    setEdit(e => {
      const n = fn(e.grille);
      if (n === e.grille) return e;
      return { grille: n, passe: [...e.passe.slice(-(HISTORIQUE_MAX - 1)), e.grille] };
    });
  }, []);
  const modifierSelection = useCallback((fn) => {
    const { corde, col } = selection;
    effacerMessage();
    modifier(g => {
      const avant = lireCase(g, corde, col);
      const apres = fn(avant);
      return apres === avant ? g : ecrireCase(g, corde, col, apres);
    });
  }, [selection, modifier, effacerMessage]);

  const annuler = useCallback(() => {
    effacerMessage();
    setEdit(e => e.passe.length ? { grille: e.passe[e.passe.length - 1], passe: e.passe.slice(0, -1) } : e);
  }, [effacerMessage]);

  const onFret = useCallback((f) => { derniereSaisieRef.current = null; modifierSelection(c => poserFret(c, f)); }, [modifierSelection]);
  const onMute = useCallback(() => modifierSelection(c => (c?.mute ? null : { mute: true })), [modifierSelection]);
  const onEffacer = useCallback(() => { derniereSaisieRef.current = null; modifierSelection(() => null); }, [modifierSelection]);
  const basculer = useCallback((champ) => modifierSelection(c => {
    if (!c || c.mute || typeof c.fret !== "number") return c;
    return { fret: c.fret, [champ]: c[champ] ? undefined : true };
  }), [modifierSelection]);
  const onLie = useCallback(() => basculer("lie"), [basculer]);
  const onSlide = useCallback(() => basculer("slide"), [basculer]);
  // bend : aucun → ton entier (le plus courant) → demi-ton → aucun
  const onBend = useCallback(() => modifierSelection(c => {
    if (!c || c.mute || typeof c.fret !== "number") return c;
    return { fret: c.fret, bend: c.bend === 2 ? 1 : c.bend === 1 ? undefined : 2 };
  }), [modifierSelection]);

  const deplacer = useCallback((dCase, dCorde) => {
    derniereSaisieRef.current = null;
    effacerMessage();
    setSelection(s => ({
      corde: Math.max(1, Math.min(6, s.corde + dCorde)),
      col: Math.max(0, Math.min(nbColsVisibles(grille) - res, s.col + dCase * res)),
    }));
  }, [grille, res, effacerMessage]);

  const choisirResolution = (r) => {
    if (r === 2 && !compatibleCroches(grille)) {
      annoncer("Cette tab contient des doubles-croches : la vue croches en cacherait certaines.");
      return;
    }
    setRes(r);
    setSelection(s => ({ ...s, col: s.col - (s.col % r) }));
  };

  // ── Lecture ──
  const arreter = useCallback(() => {
    enLectureRef.current = false;
    clearTimeout(timerBoucleRef.current); timerBoucleRef.current = null;
    stopAll();
    setJouant(false); setColLecture(null);
  }, []);

  const lancerRef = useRef(null);
  const lancer = useCallback(async (bpmLecture) => {
    const evs = grilleVersEvenements(grille);
    if (evs.length === 0) return;
    await unlockAudio();
    enLectureRef.current = true;
    setJouant(true);
    clearTimeout(timerBoucleRef.current); timerBoucleRef.current = null;
    // ATTENDRE playTab : au premier lancement, il charge les échantillons
    // avant de jouer. Sans attendre, le chronomètre de la boucle démarrait
    // pendant ce chargement et la tab repartait trop tôt, fin coupée.
    await playTab(evs, {
      bpm: bpmLecture,
      onEvent: (ev) => { if (enLectureRef.current) setColLecture(ev.col); },
      onDone: () => {
        if (!enLectureRef.current) return;
        if (boucleRef.current) { if (!timerBoucleRef.current) lancerRef.current?.(bpmRef.current); return; }
        arreter();
      },
    });
    if (!enLectureRef.current) return;   // arrêtée pendant le chargement
    // En boucle, on repart à la fin de la DERNIÈRE MESURE, pas de la
    // dernière note : la boucle reste calée sur la pulsation.
    if (boucleRef.current) {
      const secParPas = (60 / bpmLecture) / 4;
      const dureeMs = nbMesuresUtilisees(grille) * PAS_PAR_MESURE * secParPas * 1000;
      timerBoucleRef.current = setTimeout(() => {
        timerBoucleRef.current = null;
        if (enLectureRef.current) lancerRef.current?.(bpmRef.current);
      }, dureeMs);
    }
  }, [grille, arreter]);
  // La boucle relit la grille à jour : on peut corriger en jouant. Synchronisé
  // après le rendu (et non pendant) ; la minuterie de boucle ne s'en sert
  // que plus tard, une fois l'écran à jour.
  useEffect(() => { lancerRef.current = lancer; }, [lancer]);

  const basculerLecture = useCallback(() => { if (jouant) arreter(); else lancer(bpm); }, [jouant, arreter, lancer, bpm]);

  const changerTempo = (delta) => {
    const nb = Math.max(30, Math.min(240, bpm + delta));
    setBpm(nb); bpmRef.current = nb;
    if (jouant) lancer(nb);   // appliqué tout de suite, pas au tour suivant
  };
  const basculerBoucle = () => {
    const suivant = !boucle;
    setBoucle(suivant); boucleRef.current = suivant;
    if (!suivant) { clearTimeout(timerBoucleRef.current); timerBoucleRef.current = null; }
  };

  useEffect(() => () => { enLectureRef.current = false; clearTimeout(timerBoucleRef.current); clearTimeout(timerMessageRef.current); stopAll(); }, []);

  // ── Clavier physique (ordinateur) ──
  // Les raccourcis sont écoutés SUR LA GRILLE (qui prend le focus), et non
  // sur `window` : avant, les flèches, l'espace et x/h/s/b étaient captés
  // même quand le focus était ailleurs dans l'app (curseur de tempo d'un
  // autre outil, champ de texte d'un autre écran resté monté, etc.).
  const onKeyDownGrille = (e) => {
    const tag = e.target?.tagName;
    if ((e.key === " " || e.key === "Enter") && tag === "BUTTON") return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { annuler(); e.preventDefault(); return; }
    if (/^[0-9]$/.test(e.key)) {
      const now = Date.now(), d = Number(e.key), der = derniereSaisieRef.current;
      const enchainer = !!der && der.corde === selection.corde && der.col === selection.col && now - der.t < DELAI_DEUX_CHIFFRES;
      const c = lireCase(grille, selection.corde, selection.col);
      const combine = enchainer && c && !c.mute && typeof c.fret === "number" && c.fret * 10 + d <= 24;
      modifierSelection(cell => saisirChiffre(cell, d, enchainer));
      derniereSaisieRef.current = combine ? null : { corde: selection.corde, col: selection.col, t: now };
      e.preventDefault(); return;
    }
    const actions = {
      ArrowLeft: () => deplacer(-1, 0), ArrowRight: () => deplacer(1, 0),
      ArrowUp: () => deplacer(0, -1), ArrowDown: () => deplacer(0, 1),
      Backspace: onEffacer, Delete: onEffacer, " ": basculerLecture,
      x: onMute, h: onLie, s: onSlide, b: onBend,
    };
    const a = actions[e.key];
    if (a) { a(); e.preventDefault(); }
  };

  // Échap ferme le menu « ⋯ » et le panneau d'import — écouté seulement
  // quand l'un des deux est ouvert, pour ne rien intercepter le reste du temps.
  useEffect(() => {
    if (!menuOuvert && !importOuvert) return;
    const onEchap = (e) => { if (e.key === "Escape") { setMenuOuvert(false); setImportOuvert(false); } };
    document.addEventListener("keydown", onEchap);
    return () => document.removeEventListener("keydown", onEchap);
  }, [menuOuvert, importOuvert]);

  // Menu « ⋯ » : se ferme au premier appui en dehors.
  useEffect(() => {
    if (!menuOuvert) return;
    const fermer = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOuvert(false); };
    document.addEventListener("pointerdown", fermer);
    return () => document.removeEventListener("pointerdown", fermer);
  }, [menuOuvert]);

  const importer = () => {
    const { evenements: ev, erreur } = parseTab(texteImport);
    if (erreur) { setErreurImport(erreur); return; }
    modifier(() => evenementsVersGrille(ev));
    setSelection({ corde: 1, col: 0 });
    setErreurImport(null); setTexteImport(""); setImportOuvert(false);
    annoncer("Tab importée. « Annuler » revient à la version précédente.");
  };

  // Ligne d'aide : un message ponctuel d'abord, sinon ce qu'il faut faire
  // pour la case sélectionnée. Hauteur fixe : rien ne saute à l'écran.
  const cle = `${selection.corde}-${selection.col}`;
  const nomCorde = CORDES_LABELS[selection.corde - 1];
  const aide = message
    || (!cellSel ? `Choisis la case du manche pour la corde ${nomCorde}.`
      : cellSel.mute ? "Note étouffée : jouée sans hauteur, pour le rythme."
      : (cellSel.lie || cellSel.slide) && !origines.has(cle)
        ? (cellSel.slide ? "Place une note plus loin sur cette corde pour terminer le slide."
                         : "Place une note plus loin sur cette corde : hammer-on si elle monte, pull-off si elle descend.")
      : cellSel.bend ? `Case ${cellSel.fret}, tirée d'${cellSel.bend === 2 ? "un ton" : "un demi-ton"}.`
      : `Corde ${nomCorde}, case ${cellSel.fret}.`);

  // Actions du menu « ⋯ ». Des gestionnaires d'événement (jamais appelés
  // pendant le rendu) : ils peuvent toucher aux refs via `annoncer`.
  const importerTexte = () => setImportOuvert(true);
  const repartirExemple = () => { modifier(() => grilleExemple()); annoncer("Exemple rechargé. « Annuler » pour revenir."); };
  const toutEffacer = () => { modifier(() => grilleVide()); annoncer("Tab effacée. « Annuler » la fait revenir."); };
  const fermerMenu = () => setMenuOuvert(false);
  const boutonCarre = { width: 40, height: 40, borderRadius: R.sm, border: `1.5px solid ${C.border}`, background: C.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.text2, fontWeight: 800, fontFamily: FONTS.ui, padding: 0 };

  return (
    <div>
      {/* ── Barre d'édition : densité, annuler, menu ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <div role="group" aria-label="Densité de la grille" style={{ display: "flex", background: C.surface2, borderRadius: R.sm, padding: 3 }}>
          {[[2, "Croches"], [1, "Doubles"]].map(([r, label]) => (
            <button key={r} onClick={() => choisirResolution(r)} aria-pressed={res === r} className="gr-focus" style={{
              padding: "7px 11px", borderRadius: R.sm - 2, border: "none", cursor: "pointer", fontFamily: FONTS.ui,
              fontSize: 12, fontWeight: 800, background: res === r ? C.surface : "transparent",
              color: res === r ? C.text : C.text3, boxShadow: res === r ? `0 0 0 1.5px ${C.border}` : "none",
            }}>{label}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={annuler} disabled={edit.passe.length === 0} className="gr-focus" style={{
          ...boutonCarre, width: "auto", padding: "0 12px", fontSize: 12.5,
          opacity: edit.passe.length ? 1 : .4, cursor: edit.passe.length ? "pointer" : "default",
        }}>Annuler</button>
        <div ref={menuRef} style={{ position: "relative" }}>
          <button onClick={() => setMenuOuvert(o => !o)} aria-haspopup="menu" aria-expanded={menuOuvert} aria-label="Plus d'actions" className="gr-focus" style={{ ...boutonCarre, fontSize: 18 }}>⋯</button>
          {menuOuvert && (
            <div role="menu" style={{ position: "absolute", right: 0, top: 44, zIndex: 20, minWidth: 220, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: R.md, boxShadow: "0 8px 24px rgba(0,0,0,.18)", overflow: "hidden" }}>
              <ItemMenu icon="clipboard-check" label="Importer une tab texte" onClick={importerTexte} onFermer={fermerMenu} C={C} />
              <ItemMenu icon="sparkles" label="Repartir de l'exemple" onClick={repartirExemple} onFermer={fermerMenu} C={C} />
              <ItemMenu icon="trash" label="Tout effacer" onClick={toutEffacer} onFermer={fermerMenu} danger C={C} />
            </div>
          )}
        </div>
      </div>

      {importOuvert && (
        <div style={{ marginBottom: 10, padding: 10, borderRadius: R.md, background: C.surface2 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.text2, marginBottom: 6 }}>Colle une tab au format texte (6 lignes, une par corde)</div>
          <textarea value={texteImport} onChange={e => setTexteImport(e.target.value)} spellCheck={false} rows={6}
            placeholder={"e|--0---2---3h5---|\nB|----------------|\n…"}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 12.5, lineHeight: 1.5, padding: "10px 12px", borderRadius: R.md, border: `1.5px solid ${erreurImport ? C.primary : C.border}`, background: C.surface, color: C.text, resize: "vertical" }} />
          {erreurImport && <div style={{ fontSize: 12, color: C.primaryD, marginTop: 4 }}>{erreurImport}</div>}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <button onClick={importer} className="gr-focus" style={{ flex: 1, height: 40, borderRadius: R.sm, border: "none", background: C.primaryBtn, color: C.onPrimaryBtn, fontWeight: 800, cursor: "pointer", fontFamily: FONTS.ui }}>Importer</button>
            <button onClick={() => { setImportOuvert(false); setErreurImport(null); }} className="gr-focus" style={{ ...boutonCarre, width: "auto", padding: "0 14px", fontSize: 12.5 }}>Fermer</button>
          </div>
        </div>
      )}

      <GrilleTab grille={grille} evenements={evenements} res={res} selection={selection}
        onSelect={(s) => { setSelection(s); derniereSaisieRef.current = null; effacerMessage(); }}
        onKeyDown={onKeyDownGrille} colLecture={colLecture} C={C} />

      <div role="status" aria-live="polite" style={{ minHeight: 34, display: "flex", alignItems: "center", fontSize: 12, lineHeight: 1.35, color: message ? C.primaryD : C.text2, fontWeight: message ? 700 : 500, padding: "4px 2px" }}>
        {aide}
      </div>

      <ClavierManche cell={cellSel} onFret={onFret} onMute={onMute} onEffacer={onEffacer} C={C} />
      <TechniquesNote cell={cellSel} onLie={onLie} onSlide={onSlide} onBend={onBend} C={C} />

      {/* ── Lecture, dans la zone du pouce ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
        <button onClick={basculerLecture} disabled={!jouant && evenements.length === 0} className="gr-focus" style={{
          flex: 1, height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          borderRadius: R.lg, border: "none", background: jouant ? C.surface2 : C.primaryBtn,
          color: jouant ? C.text : C.onPrimaryBtn, fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: FONTS.ui,
          opacity: (!jouant && evenements.length === 0) ? .5 : 1,
        }}>
          <Ti name={jouant ? "player-pause" : "player-play"} size={17} color={jouant ? C.text : C.onPrimaryBtn} />
          {jouant ? "Arrêter" : "Écouter"}
        </button>
        <div role="group" aria-label="Tempo" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={() => changerTempo(-5)} aria-label="Ralentir" className="gr-focus" style={{ ...boutonCarre, width: 36 }}>−</button>
          <div style={{ minWidth: 44, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, lineHeight: 1 }}>{bpm}</div>
            <div style={{ fontSize: 9, color: C.text3, marginTop: 2 }}>BPM</div>
          </div>
          <button onClick={() => changerTempo(5)} aria-label="Accélérer" className="gr-focus" style={{ ...boutonCarre, width: 36 }}>+</button>
        </div>
        <button onClick={basculerBoucle} aria-pressed={boucle} aria-label="Lecture en boucle" className="gr-focus" style={{
          ...boutonCarre, width: 52, height: 44, flexDirection: "column", gap: 1,
          border: `1.5px solid ${boucle ? C.primary : C.border}`, background: boucle ? C.primaryL : C.surface,
        }}>
          <Ti name="refresh" size={15} color={boucle ? C.primary : C.text2} />
          <span style={{ fontSize: 9.5, fontWeight: 800, color: boucle ? C.primaryD : C.text3 }}>Boucle</span>
        </button>
      </div>
    </div>
  );
}
