// Groply — src/screens/toolbox/Morceaux.jsx
// Lecteur de morceaux de la boîte à outils (chargé à la demande par
// ToolboxScreen) : une liste filtrable, puis pour chaque morceau sa tab,
// ses accords, et une lecture avec vitesse réglable, passage A–B en boucle
// et décompte.
//
// Toute la logique (analyse de la tab, découpage A–B, tempo, décompte) vit
// dans morceaux/morceaux.js, testée à part. Ici : l'affichage, et un appel
// à audioEngine.playTab avec des évènements déjà préparés. playTab gère
// lui-même la boucle A–B (option `boucle`, tours enchaînés dans le temps
// audio) et le clic du décompte (évènements `clic`).
import { useState, useRef, useEffect, useCallback, useMemo, useId } from "react";
import { FONTS, R, T, TAP } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Ti } from "../../design/Ti.jsx";
import { BackButton } from "../../design/ui.jsx";
import { ChordDiagram } from "../../diagrams.jsx";
import { playTab, stopAll, unlockAudio } from "../../audioEngine.js";
import { MORCEAUX, morceauParId } from "../../morceaux/catalogue.js";
import { FORMES_ACCORDS, nomAccord } from "../../morceaux/accords.js";
import {
  NIVEAUX, TYPES, VITESSE_MIN, VITESSE_MAX,
  analyserMorceau, preparerLecture, positionCourante, bpmEffectif, filtrerMorceaux, texteEvenement, tempsDeMesure,
} from "../../morceaux/morceaux.js";

const CORDES_LABELS = ["e", "B", "G", "D", "A", "E"];   // corde 1 en haut, comme à l'écrit
const LARGEUR_COL = 14;     // px par double-croche : une mesure de 4/4 = 224 px
const HAUT_CORDE = 26;
const HAUT_ENTETE = 22;     // numéros de mesure et noms d'accords
const STOCKAGE_FILTRES = "groply:morceaux-filtres";

const mouvementReduit = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function lireFiltres() {
  try {
    const f = JSON.parse(localStorage.getItem(STOCKAGE_FILTRES) || "null");
    if (f && (f.niveau === "tous" || f.niveau in NIVEAUX) && (f.type === "tous" || f.type in TYPES)) return f;
  } catch { /* stockage indisponible : filtres par défaut */ }
  return { niveau: "tous", type: "tous" };
}

// ══ Petits éléments ══════════════════════════════════════════════════════

function Puce({ actif, onClick, children, C }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={actif} className="gr-focus" style={{
      minHeight: TAP.min, padding: "0 14px", borderRadius: R.pill, cursor: "pointer", fontFamily: FONTS.ui,
      border: `1.5px solid ${actif ? C.primary : C.border}`, background: actif ? C.primaryL : C.surface,
      color: actif ? C.primaryD : C.text2, fontWeight: 700, fontSize: T.small, flexShrink: 0,
    }}>{children}</button>
  );
}

function Etiquette({ children, C, teinte }) {
  const t = teinte === "vert" ? { bg: C.greenL, fg: C.greenD } : teinte === "violet" ? { bg: C.purpleL, fg: C.purpleD } : { bg: C.surface2, fg: C.text2 };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: R.pill,
      background: t.bg, color: t.fg, fontSize: T.micro, fontWeight: 700, lineHeight: 1.3 }}>{children}</span>
  );
}

// ══ Liste ════════════════════════════════════════════════════════════════

function ListeMorceaux({ onOuvrir, dernierOuvert, C }) {
  const [filtres, setFiltresBruts] = useState(lireFiltres);
  const setFiltre = (cle, valeur) => {
    const f = { ...filtres, [cle]: valeur };
    setFiltresBruts(f);
    try { localStorage.setItem(STOCKAGE_FILTRES, JSON.stringify(f)); } catch { /* noop */ }
  };
  const liste = filtrerMorceaux(MORCEAUX, filtres);

  // Au retour d'un morceau, le focus revient sur sa carte (et non en haut de page).
  useEffect(() => {
    if (dernierOuvert) document.getElementById(`morceau-${dernierOuvert}`)?.focus({ preventScroll: false });
  }, [dernierOuvert]);

  const groupe = (cle, label, options) => (
    <div role="group" aria-label={label} style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" }}>
      {[["tous", "Tous"], ...Object.entries(options)].map(([v, l]) => (
        <Puce key={v} actif={filtres[cle] === v} onClick={() => setFiltre(cle, v)} C={C}>{l}</Puce>
      ))}
    </div>
  );

  return (
    <div>
      <p style={{ margin: "0 0 12px", fontSize: T.small, color: C.text2, lineHeight: 1.45 }}>
        Des airs du domaine public et des riffs originaux, à écouter puis jouer à ton rythme.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
        {groupe("niveau", "Filtrer par niveau", NIVEAUX)}
        {groupe("type", "Filtrer par type", TYPES)}
      </div>

      <div role="status" style={{ fontSize: T.micro, color: C.text3, fontWeight: 700, marginBottom: 8 }}>
        {liste.length} morceau{liste.length > 1 ? "x" : ""}
      </div>

      {liste.length === 0 ? (
        <div style={{ padding: 16, borderRadius: R.md, background: C.surface2, color: C.text2, fontSize: T.small }}>
          Aucun morceau ne correspond à ces filtres.
        </div>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {liste.map(m => (
            <li key={m.id}>
              <button type="button" id={`morceau-${m.id}`} onClick={() => onOuvrir(m.id)} className="gr-focus" style={{
                width: "100%", textAlign: "left", cursor: "pointer", fontFamily: FONTS.ui,
                padding: "12px 14px", minHeight: 64, borderRadius: R.lg, border: `1.5px solid ${C.border}`,
                background: C.surface, color: C.text, display: "flex", alignItems: "center", gap: 12,
              }}>
                <span aria-hidden="true" style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: C.primaryL,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ti name={m.type === "accords" ? "stack-2" : m.type === "riff" ? "bolt" : "music"} size={20} color={C.primary} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: T.body, fontWeight: 800, lineHeight: 1.25 }}>{m.titre}</span>
                  <span style={{ display: "block", fontSize: T.micro, color: C.text3, marginTop: 2 }}>{m.auteur}</span>
                  <span style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    <Etiquette C={C} teinte={m.niveau === "debutant" ? "vert" : "violet"}>{NIVEAUX[m.niveau]}</Etiquette>
                    <Etiquette C={C}>{TYPES[m.type]}</Etiquette>
                    <Etiquette C={C}>{m.tempo} BPM</Etiquette>
                  </span>
                </span>
                <Ti name="chevron-right" size={18} color={C.text3} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ══ Tablature en lecture seule ═══════════════════════════════════════════

function TabLecture({ morceau, analyse, colCourante, debut, fin, C }) {
  const scrollRef = useRef(null);
  const W = analyse.colsParMesure;
  const largeurMesure = W * LARGEUR_COL;
  const largeur = analyse.nbMesures * largeurMesure;
  const hauteur = HAUT_ENTETE + HAUT_CORDE * 6;
  const passageEntier = debut === 0 && fin === analyse.nbMesures - 1;
  const temps = tempsDeMesure(morceau.mesure, W);
  const pasTemps = temps.length > 1 ? temps[1] - temps[0] : 4;

  // Garde visible la position de lecture (à ~30 % du bord, pour voir venir
  // la suite) ; hors lecture, le début du passage choisi.
  const cible = colCourante ?? debut * W;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const x = cible * LARGEUR_COL;
    const horsVue = x < el.scrollLeft + 8 || x + LARGEUR_COL > el.scrollLeft + el.clientWidth - 8;
    if (colCourante != null || horsVue) {
      el.scrollTo({ left: Math.max(0, x - el.clientWidth * 0.3), behavior: mouvementReduit() ? "auto" : "smooth" });
    }
  }, [cible, colCourante]);

  return (
    <div style={{ display: "flex", border: `1.5px solid ${C.border}`, borderRadius: R.md, background: C.surface, overflow: "hidden" }}>
      <div aria-hidden="true" style={{ flexShrink: 0, width: 22, background: C.surface2, borderRight: `1.5px solid ${C.border}`, paddingTop: HAUT_ENTETE }}>
        {CORDES_LABELS.map((l, i) => (
          <div key={l + i} style={{ height: HAUT_CORDE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: T.micro, fontWeight: 800, color: C.text3 }}>{l}</div>
        ))}
      </div>
      {/* Le dessin est décoratif pour un lecteur d'écran : la tab texte,
          juste en dessous, en donne le contenu exact. */}
      <div ref={scrollRef} tabIndex={0} className="gr-focus" role="region"
        aria-label={`Tablature, ${analyse.nbMesures} mesures (défilement horizontal)`}
        style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", flex: 1 }}>
        <div aria-hidden="true" style={{ position: "relative", width: largeur + 4, height: hauteur }}>
          {/* Passage A–B choisi */}
          {!passageEntier && (
            <div style={{ position: "absolute", top: 0, bottom: 0, left: debut * largeurMesure, width: (fin - debut + 1) * largeurMesure, background: C.primaryL }} />
          )}
          {/* Un temps sur deux légèrement teinté (temps pointés en 6/8) */}
          {Array.from({ length: Math.ceil((analyse.nbMesures * W) / pasTemps) }, (_, t) => t % 2 === 1 ? (
            <div key={"t" + t} style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: t * pasTemps * LARGEUR_COL, width: pasTemps * LARGEUR_COL, background: C.surface2, opacity: .35 }} />
          ) : null)}
          {/* Tête de lecture */}
          {colCourante != null && (
            <div style={{ position: "absolute", top: HAUT_ENTETE, bottom: 0, left: colCourante * LARGEUR_COL - 2, width: LARGEUR_COL + 4, borderRadius: 4, background: C.primary, opacity: .28 }} />
          )}
          {/* Cordes */}
          {CORDES_LABELS.map((l, i) => (
            <div key={"c" + i} style={{ position: "absolute", left: 0, right: 0, top: HAUT_ENTETE + i * HAUT_CORDE + HAUT_CORDE / 2, height: 1.5, background: C.border }} />
          ))}
          {/* Mesures : numéro, accord, barre */}
          {Array.from({ length: analyse.nbMesures }, (_, m) => (
            <div key={"m" + m}>
              <div style={{ position: "absolute", top: 3, left: m * largeurMesure + 4, fontSize: T.micro, fontWeight: 700, color: C.text3, lineHeight: "14px", whiteSpace: "nowrap" }}>
                {m + 1}
                {morceau.grille?.[m] && <span style={{ marginLeft: 6, color: C.primaryInk, fontWeight: 800 }}>{nomAccord(morceau.grille[m])}</span>}
              </div>
              <div style={{ position: "absolute", top: HAUT_ENTETE + HAUT_CORDE / 2, height: HAUT_CORDE * 5 + 1.5, left: (m + 1) * largeurMesure - 1, width: 2, background: C.text3 }} />
            </div>
          ))}
          {/* Notes */}
          {analyse.evenements.map((ev, i) => {
            const actif = colCourante === ev.col;
            return (
              <span key={i} style={{
                position: "absolute", left: ev.col * LARGEUR_COL, top: HAUT_ENTETE + (ev.string - 1) * HAUT_CORDE + HAUT_CORDE / 2 - 9,
                minWidth: LARGEUR_COL, height: 18, padding: "0 1px", borderRadius: 4, textAlign: "center",
                fontFamily: "monospace", fontWeight: 800, fontSize: 13, lineHeight: "18px",
                background: actif ? C.primaryBtn : C.surface, color: actif ? C.onPrimaryBtn : C.text,
              }}>{texteEvenement(ev)}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══ Grille d'accords ═════════════════════════════════════════════════════

function Accords({ morceau, mesureCourante, C }) {
  return (
    <section aria-labelledby="morceau-accords" style={{ marginTop: 16 }}>
      <h3 id="morceau-accords" style={{ margin: "0 0 8px", fontSize: T.small, fontWeight: 800, color: C.text, fontFamily: FONTS.title }}>Accords</h3>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
        {morceau.accords.map(s => {
          const f = FORMES_ACCORDS[s];
          return f ? (
            <div key={s} style={{ flexShrink: 0, width: 128 }}>
              <ChordDiagram data={{ name: f.nom, frets: f.frets, fingers: f.fingers, startFret: 1, barre: f.barre }} caption={`${f.nom} (${s})`} />
            </div>
          ) : null;
        })}
      </div>
      {morceau.grille && (
        <ol aria-label="Grille, un accord par mesure" style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
          {morceau.grille.map((s, i) => {
            const actif = mesureCourante === i;
            return (
              <li key={i} aria-current={actif ? "true" : undefined} style={{
                padding: "8px 4px", borderRadius: R.sm, textAlign: "center", fontWeight: 800, fontSize: T.small,
                border: `1.5px solid ${actif ? C.primary : C.border}`, background: actif ? C.primaryL : C.surface,
                color: actif ? C.primaryD : C.text,
              }}>
                <span style={{ fontSize: T.micro, fontWeight: 600, color: C.text3, marginRight: 4 }}>{i + 1}</span>{nomAccord(s)}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

// ══ Lecteur ══════════════════════════════════════════════════════════════

/**
 * Temps de lecture réel (état « lecture »), versé à l'étape « Jouer » de la
 * séance du jour par JAM_PROGRES `horsJam` (jamais aux badges de Jam). Versé
 * à chaque arrêt / pause, à la sortie du morceau et quand l'app passe en
 * arrière-plan — pas une écriture par seconde.
 */
function useTempsDeJeu(jouant, dispatch) {
  useEffect(() => {
    if (!jouant) return undefined;
    let debut = performance.now();
    const verser = () => {
      const sec = Math.round((performance.now() - debut) / 1000);
      debut = performance.now();
      if (sec > 0) dispatch?.({ type: "JAM_PROGRES", secondes: sec, horsJam: true });
    };
    const auMasquage = () => { if (document.visibilityState === "hidden") verser(); else debut = performance.now(); };
    document.addEventListener("visibilitychange", auMasquage);
    return () => { document.removeEventListener("visibilitychange", auMasquage); verser(); };
  }, [jouant, dispatch]);
}

function LecteurMorceau({ morceau, onRetour, C, dispatch }) {
  const analyse = useMemo(() => analyserMorceau(morceau), [morceau]);
  const derniere = analyse.nbMesures - 1;
  const idVitesse = useId();

  const [vitesse, setVitesse] = useState(100);
  const [debut, setDebut] = useState(0);
  const [fin, setFin] = useState(derniere);
  const [boucle, setBoucle] = useState(false);
  const [decompte, setDecompte] = useState(true);
  // "arret" | "lecture" | "pause". En pause, le curseur reste où il était
  // et « Reprendre » repart au début de cette mesure.
  const [etat, setEtat] = useState("arret");
  const jouant = etat === "lecture";
  const [colCourante, setColCourante] = useState(null);
  const [clic, setClic] = useState(null);         // temps du décompte en cours (1, 2…)
  useTempsDeJeu(jouant, dispatch);

  // Miroir des réglages, lu par les rappels de lecture (minuterie de boucle,
  // onDone). Mis à jour dans les gestionnaires d'évènement, jamais pendant
  // le rendu.
  const reglagesRef = useRef({ vitesse, debut, fin, boucle, decompte });
  const majReglages = (champs) => { reglagesRef.current = { ...reglagesRef.current, ...champs }; };
  // Numéro de la lecture en cours : un rappel (note, fin, boucle) venu d'une
  // lecture qu'on a remplacée (pause, nouveau réglage) est ignoré.
  const lectureRef = useRef(0);
  const etatRef = useRef("arret");
  const enLecture = (id) => id === lectureRef.current && etatRef.current === "lecture";
  // Dernière note entendue : { col, t, bpm } — de quoi calculer où en est la
  // lecture à tout instant, entre deux notes.
  const derniereRef = useRef(null);
  const repriseRef = useRef(null);                 // position mémorisée à la pause
  const timerReglageRef = useRef(null);
  const titreRef = useRef(null);

  useEffect(() => { titreRef.current?.focus(); }, []);

  // Coupe le son et invalide les rappels de la lecture en cours.
  const couper = useCallback(() => {
    lectureRef.current++;
    stopAll();
    setClic(null);
  }, []);

  // Arrêt complet : retour au début du passage.
  const arreter = useCallback(() => {
    couper();
    clearTimeout(timerReglageRef.current);
    etatRef.current = "arret"; setEtat("arret");
    derniereRef.current = null; repriseRef.current = null; setColCourante(null);
  }, [couper]);

  // Où reprendre : la position exacte (calculée), si elle est dans le
  // passage A–B ; sinon null, c'est-à-dire le début du passage.
  const dansLePassage = useCallback((pos) => {
    if (pos == null) return null;
    const { debut: d, fin: f } = reglagesRef.current;
    const W = analyse.colsParMesure;
    return pos >= d * W && pos < (f + 1) * W ? pos : null;
  }, [analyse]);

  // depuisCol : colonne exacte où reprendre (par défaut le début A) ;
  // avecDecompte : décompte joué devant (si l'option est active).
  const lancer = useCallback(async ({ depuisCol, avecDecompte }) => {
    const r = reglagesRef.current;
    const base = { tempo: morceau.tempo, signature: morceau.mesure, pourcent: r.vitesse, debut: r.debut, fin: r.fin };
    // En boucle, le passage A–B complet (sans décompte ni reprise) est confié
    // au moteur audio, qui enchaîne les tours dans le temps audio : la fin du
    // passage résonne jusqu'au retour du début A, sans coupure ni trou.
    const tour = r.boucle ? preparerLecture(analyse, base) : null;
    let plan = preparerLecture(analyse, { ...base, decompte: avecDecompte && r.decompte, depuisCol });
    if (!plan.evenements.length && tour?.evenements.length) plan = tour;   // reprise sur la fin muette du passage
    if (!plan.evenements.length) return;
    couper();
    const id = lectureRef.current;
    etatRef.current = "lecture"; setEtat("lecture");
    // ATTENDRE playTab : au premier lancement, il charge les échantillons
    // avant de jouer ; la minuterie de boucle ne doit partir qu'ensuite.
    await playTab(plan.evenements, {
      bpm: plan.bpm,
      colonnes: plan.colonnes,
      boucle: tour?.evenements.length ? { evenements: tour.evenements, colonnes: tour.colonnes } : undefined,
      onEvent: (ev) => {
        if (!enLecture(id)) return;
        if (ev.decompte) { setClic(ev.decompte); return; }
        setClic(null);
        derniereRef.current = { col: ev.colMorceau, t: performance.now(), bpm: plan.bpm };
        setColCourante(ev.colMorceau);
      },
      // Jamais appelé en boucle : la lecture ne s'arrête qu'à stopAll().
      onDone: () => {
        if (enLecture(id) && !reglagesRef.current.boucle) arreter();
      },
    });
  }, [analyse, morceau, arreter, couper]);

  // On quitte le morceau (retour à la liste, autre onglet) : silence.
  useEffect(() => () => {
    lectureRef.current++; etatRef.current = "arret";
    clearTimeout(timerReglageRef.current);
    stopAll();
  }, []);

  const lireOuPause = () => {
    if (etat === "lecture") {                 // pause : on garde la position exacte
      clearTimeout(timerReglageRef.current);
      repriseRef.current = positionCourante(derniereRef.current, performance.now());
      couper();
      etatRef.current = "pause"; setEtat("pause");
      return;
    }
    unlockAudio();   // dans le geste : indispensable sur iOS
    lancer(etat === "pause"
      ? { depuisCol: dansLePassage(repriseRef.current), avecDecompte: true }
      : { avecDecompte: true });
  };

  // Un réglage changé PENDANT la lecture s'applique tout de suite : on
  // relance exactement là où on en est (sans décompte, pour ne pas casser
  // le fil). Le curseur de vitesse envoie une valeur à chaque cran : on
  // attend qu'il se stabilise. En pause, la position mémorisée reste valable.
  const appliquerEnDirect = (delai = 0) => {
    if (etatRef.current !== "lecture") return;
    clearTimeout(timerReglageRef.current);
    timerReglageRef.current = setTimeout(() => {
      if (etatRef.current !== "lecture") return;
      const pos = positionCourante(derniereRef.current, performance.now());
      lancer({ depuisCol: dansLePassage(pos), avecDecompte: false });
    }, delai);
  };

  const changerVitesse = (v, delai = 0) => { setVitesse(v); majReglages({ vitesse: v }); appliquerEnDirect(delai); };
  const changerDebut = (d) => {
    const f = Math.max(d, fin);
    setDebut(d); setFin(f); majReglages({ debut: d, fin: f }); appliquerEnDirect();
  };
  const changerFin = (f) => {
    const d = Math.min(debut, f);
    setDebut(d); setFin(f); majReglages({ debut: d, fin: f }); appliquerEnDirect();
  };
  const toutLeMorceau = () => { setDebut(0); setFin(derniere); majReglages({ debut: 0, fin: derniere }); appliquerEnDirect(); };
  // La boucle est planifiée par le moteur audio dès le lancement : relancer
  // (là où on en est) pour l'ajouter ou la retirer.
  const basculerBoucle = () => { const b = !boucle; setBoucle(b); majReglages({ boucle: b }); appliquerEnDirect(); };
  // Le décompte ne sert qu'au démarrage : rien à relancer.
  const basculerDecompte = () => { const d = !decompte; setDecompte(d); majReglages({ decompte: d }); };

  const bpm = bpmEffectif(morceau.tempo, vitesse);
  const mesureCourante = colCourante != null ? Math.floor(colCourante / analyse.colsParMesure) : null;
  const passageEntier = debut === 0 && fin === derniere;
  const optionsMesures = Array.from({ length: analyse.nbMesures }, (_, i) => <option key={i} value={i}>{i + 1}</option>);

  const styleSelect = {
    minHeight: TAP.min, minWidth: 64, padding: "0 10px", borderRadius: R.sm, border: `1.5px solid ${C.borderStrong}`,
    background: C.surface, color: C.text, fontFamily: FONTS.ui, fontSize: T.body, fontWeight: 700,
  };
  const styleBascule = (actif) => ({
    minHeight: TAP.min, padding: "0 12px", borderRadius: R.md, cursor: "pointer", fontFamily: FONTS.ui,
    border: `1.5px solid ${actif ? C.primary : C.border}`, background: actif ? C.primaryL : C.surface,
    color: actif ? C.primaryD : C.text2, fontWeight: 800, fontSize: T.small,
    display: "inline-flex", alignItems: "center", gap: 6,
  });

  const statut = jouant
    ? (clic ? `Décompte : ${clic}` : `Lecture ${passageEntier ? "du morceau" : `des mesures ${debut + 1} à ${fin + 1}`} à ${vitesse} %${boucle ? ", en boucle" : ""}.`)
    : etat === "pause" ? `En pause, mesure ${mesureCourante != null ? mesureCourante + 1 : debut + 1}.` : "";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <BackButton onClick={onRetour} label="Retour à la liste des morceaux" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 ref={titreRef} tabIndex={-1} style={{ margin: 0, fontSize: T.h3, fontWeight: 800, color: C.text, fontFamily: FONTS.title, lineHeight: 1.2, outline: "none" }}>
            {morceau.titre}
          </h2>
          <div style={{ fontSize: T.micro, color: C.text3, marginTop: 2 }}>{morceau.auteur}</div>
        </div>
      </div>
      <p style={{ margin: "0 0 8px", fontSize: T.small, color: C.text2, lineHeight: 1.45 }}>{morceau.description}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
        <Etiquette C={C} teinte={morceau.niveau === "debutant" ? "vert" : "violet"}>{NIVEAUX[morceau.niveau]}</Etiquette>
        <Etiquette C={C}>{TYPES[morceau.type]}</Etiquette>
        <Etiquette C={C}>{morceau.tempo} BPM</Etiquette>
        <Etiquette C={C}>{morceau.tonalite}</Etiquette>
        <Etiquette C={C}>{morceau.mesure}</Etiquette>
      </div>

      <TabLecture morceau={morceau} analyse={analyse} colCourante={colCourante} debut={debut} fin={fin} C={C} />

      {/* Décompte visible, grand : on le lit guitare en main. */}
      <div aria-hidden="true" style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 6 }}>
        {clic && Array.from({ length: clic }, (_, i) => (
          <span key={i} style={{ fontSize: 20, fontWeight: 800, color: i === clic - 1 ? C.primary : C.text3 }}>{i + 1}</span>
        ))}
      </div>

      {/* ── Lecture ── */}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={lireOuPause} className="gr-focus" style={{
          flex: 1, minHeight: TAP.comfy, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          borderRadius: R.lg, border: "none", background: jouant ? C.surface2 : C.primaryBtn,
          color: jouant ? C.text : C.onPrimaryBtn, fontWeight: 800, fontSize: T.body, cursor: "pointer", fontFamily: FONTS.ui,
        }}>
          <Ti name={jouant ? "player-pause" : "player-play"} size={18} color={jouant ? C.text : C.onPrimaryBtn} />
          {jouant ? "Pause" : etat === "pause" ? "Reprendre" : "Écouter"}
        </button>
        {etat !== "arret" && (
          <button type="button" onClick={arreter} aria-label="Arrêter et revenir au début du passage" className="gr-focus" style={{
            minWidth: TAP.comfy, minHeight: TAP.comfy, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: R.lg, border: `1.5px solid ${C.borderStrong}`, background: C.surface, cursor: "pointer",
          }}>
            <Ti name="player-stop" size={18} color={C.text} />
          </button>
        )}
      </div>
      <div role="status" aria-live="polite" style={{ minHeight: 20, fontSize: T.micro, color: C.text2, marginTop: 4, textAlign: "center" }}>{statut}</div>

      {/* ── Vitesse ── */}
      <div style={{ marginTop: 10, padding: "12px 14px", borderRadius: R.md, background: C.surface, border: `1.5px solid ${C.border}` }}>
        <label htmlFor={idVitesse} style={{ display: "flex", justifyContent: "space-between", fontSize: T.small, fontWeight: 800, color: C.text }}>
          <span>Vitesse</span>
          <span style={{ color: C.primaryInk }}>{vitesse} % · {bpm} BPM</span>
        </label>
        <input id={idVitesse} type="range" min={VITESSE_MIN} max={VITESSE_MAX} step={5} value={vitesse}
          onChange={e => changerVitesse(Number(e.target.value), 350)}
          aria-valuetext={`${vitesse} % du tempo, ${bpm} battements par minute`}
          className="gr-focus"
          style={{ width: "100%", height: TAP.min, accentColor: C.primary, margin: 0 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[50, 75, 100].map(v => (
            <Puce key={v} actif={vitesse === v} onClick={() => changerVitesse(v)} C={C}>{v} %</Puce>
          ))}
        </div>
      </div>

      {/* ── Passage A–B, boucle, décompte ── */}
      <div style={{ marginTop: 10, padding: "12px 14px", borderRadius: R.md, background: C.surface, border: `1.5px solid ${C.border}` }}>
        <div style={{ fontSize: T.small, fontWeight: 800, color: C.text, marginBottom: 8 }}>Passage à travailler</div>
        <div role="group" aria-label="Passage, de la mesure A à la mesure B" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span aria-hidden="true" style={{ fontSize: T.small, color: C.text2 }}>Mesure</span>
          <select value={debut} onChange={e => changerDebut(Number(e.target.value))} className="gr-focus" style={styleSelect}
            aria-label="Mesure de début du passage (A)">{optionsMesures}</select>
          <span aria-hidden="true" style={{ fontSize: T.small, color: C.text2 }}>à</span>
          <select value={fin} onChange={e => changerFin(Number(e.target.value))} className="gr-focus" style={styleSelect}
            aria-label="Mesure de fin du passage (B)">{optionsMesures}</select>
          {!passageEntier && (
            <button type="button" onClick={toutLeMorceau} className="gr-focus" style={{ ...styleBascule(false), fontWeight: 700 }}>Tout</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <button type="button" onClick={basculerBoucle} aria-pressed={boucle} className="gr-focus" style={styleBascule(boucle)}>
            <Ti name="refresh" size={16} color={boucle ? C.primary : C.text2} /> En boucle
          </button>
          <button type="button" onClick={basculerDecompte} aria-pressed={decompte} className="gr-focus" style={styleBascule(decompte)}>
            <Ti name="metronome" size={16} color={decompte ? C.primary : C.text2} /> Décompte
          </button>
        </div>
      </div>

      {morceau.accords && <Accords morceau={morceau} mesureCourante={mesureCourante} C={C} />}

      <details style={{ marginTop: 16 }}>
        <summary className="gr-focus" style={{ cursor: "pointer", minHeight: TAP.min, display: "flex", alignItems: "center", fontSize: T.small, fontWeight: 800, color: C.text }}>
          Tab au format texte
        </summary>
        <pre style={{ margin: "6px 0 0", padding: 10, borderRadius: R.sm, background: C.surface2, color: C.text, fontSize: 12, lineHeight: 1.4, overflowX: "auto" }}>
          {morceau.tab.trim()}
        </pre>
      </details>

      <p style={{ margin: "14px 0 0", fontSize: T.micro, color: C.text3, lineHeight: 1.45 }}>
        <Ti name="info-circle" size={13} color={C.text3} style={{ verticalAlign: "-2px", marginRight: 4 }} />
        {morceau.licence}
      </p>
    </div>
  );
}

// ══ Onglet ═══════════════════════════════════════════════════════════════

/**
 * @param morceauInitial identifiant d'un morceau à ouvrir d'emblée (lien
 *                       profond : navigate("toolbox", { outil: "morceaux",
 *                       morceau })). Inconnu → la liste. Le retour ramène à la liste.
 * @param dispatch       pour compter le temps de lecture dans la séance du jour.
 */
export function Morceaux({ morceauInitial = null, dispatch = null } = {}) {
  const C = useC();
  const [ouvert, setOuvert] = useState(() => (morceauParId(morceauInitial) ? morceauInitial : null));
  const [dernierOuvert, setDernierOuvert] = useState(null);
  const morceau = ouvert ? morceauParId(ouvert) : null;

  const ouvrir = (id) => { setOuvert(id); window.scrollTo?.({ top: 0, behavior: mouvementReduit() ? "auto" : "smooth" }); };
  const retour = () => { setDernierOuvert(ouvert); setOuvert(null); };

  return morceau
    ? <LecteurMorceau key={morceau.id} morceau={morceau} onRetour={retour} C={C} dispatch={dispatch} />
    : <ListeMorceaux onOuvrir={ouvrir} dernierOuvert={dernierOuvert} C={C} />;
}
