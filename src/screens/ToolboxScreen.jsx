// Groply — src/screens/ToolboxScreen.jsx
// Boîte à outils : métronome, accordeur, lecteur d'accords, manche,
// éditeur de tablature, lecteur de morceaux, et accès à Jam Session / Ear Training.
//
// Chaque outil vit dans son propre module (src/screens/toolbox/) et n'est
// chargé qu'à l'ouverture de son onglet : ouvrir « Outils » ne télécharge
// plus Tone.js, l'accordeur et l'éditeur de tab d'un seul bloc.
import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { R, T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { relief } from "../design/hooks.js";
import { BackButton, LoadingScreen, ScreenHero } from "../design/ui.jsx";

const Metronome   = lazy(() => import("./toolbox/Metronome.jsx").then(m => ({ default: m.Metronome })));
const Tuner       = lazy(() => import("./toolbox/Tuner.jsx").then(m => ({ default: m.Tuner })));
const ChordPlayer = lazy(() => import("./toolbox/ChordPlayer.jsx").then(m => ({ default: m.ChordPlayer })));
const TabEditor   = lazy(() => import("./toolbox/TabEditor.jsx").then(m => ({ default: m.TabEditor })));
const Morceaux    = lazy(() => import("./toolbox/Morceaux.jsx").then(m => ({ default: m.Morceaux })));
const FretboardExplorer = lazy(() => import("./FretboardExplorer.jsx").then(m => ({ default: m.FretboardExplorer })));

// Les vrais onglets : ils changent le contenu affiché sous la rangée.
const ONGLETS_OUTILS = [
  { id:"metronome", label:"Métronome",    icon:"clock" },
  { id:"tuner",     label:"Accordeur",    icon:"microphone" },
  { id:"chords",    label:"Accords",      icon:"music" },
  { id:"neck",      label:"Manche",       icon:"guitar-pick" },
  { id:"tablature", label:"Tablature",    icon:"notebook" },
  { id:"morceaux",  label:"Morceaux",     icon:"headphones" },
];
// Jam Session et Ear Training ouvrent une autre page : ce ne sont PAS des
// onglets (un lecteur d'écran annoncerait « onglet 6 sur 7 » puis quitterait
// l'écran). Ce sont des boutons ordinaires, placés hors du tablist.
const LIENS_EXTERNES = [
  { id:"jam",       label:"Jam Session",  icon:"music-plus" },
  { id:"ear",       label:"Ear Training", icon:"ear" },
];
const OUTILS_INTERNES = new Set(ONGLETS_OUTILS.map(t => t.id));
const idOnglet = (id) => `outil-onglet-${id}`;
const ID_PANNEAU = "outil-panneau";

const OUTIL_PAR_ID = {
  metronome: Metronome,
  tuner:     Tuner,
  chords:    ChordPlayer,
  tablature: TabEditor,
  morceaux:  Morceaux,
};

const TITRE = "Boîte à outils";
const SOUS_TITRE = "Tout ce qu'il faut pour pratiquer";

/** Respecte « réduire les animations » pour les défilements déclenchés en JS. */
const comportementDefilement = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/**
 * Tuile de la rangée d'outils : icône au-dessus du libellé, en relief.
 * Sélectionnée, elle prend la teinte primaire (fond, bordure et tranche).
 * `externe` : l'entrée ouvre une autre page, une flèche ↗ le signale.
 * Les attributs (role, id, aria-*, tabIndex, onClick) passent au bouton.
 */
function OngletOutil({ icon, actif = false, externe = false, children, ...rest }) {
  const C = useC();
  const bord = actif ? C.primary : C.border;
  return (
    <button
      type="button"
      className="gr-press gr-focus"
      style={{
        ...relief(bord, 3),
        position: "relative", flexShrink: 0, width: 92, minHeight: 64, padding: "8px 4px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        background: actif ? C.primaryL : C.surface,
        border: `2px solid ${bord}`, borderRadius: R.md,
        color: actif ? C.primaryD : C.text2,
        fontFamily: "inherit", fontSize: 12, fontWeight: 700, lineHeight: 1.2, textAlign: "center",
      }}
      {...rest}
    >
      {externe && <span aria-hidden="true" style={{ position: "absolute", top: 3, right: 6, fontSize: T.micro, color: C.text3 }}>↗</span>}
      <Ti name={icon} size={18} color={actif ? C.primary : C.text3} />
      {children}
    </button>
  );
}

/**
 * @param outilInitial   onglet imposé par un lien profond (navigate("toolbox",
 *                       { outil })) : prime sur l'onglet mémorisé, et devient
 *                       le nouvel onglet mémorisé.
 * @param morceauInitial avec l'onglet « morceaux », le morceau à ouvrir.
 * @param dispatch       transmis aux outils qui comptent du temps de jeu.
 */
function ToolboxScreen({ onBack, navigate, dispatch, outilInitial = null, morceauInitial = null }) {
  const C = useC();
  // L'outil actif est mémorisé : revenir dans Outils ramène là où on était
  // (au milieu d'une tab, par exemple), pas systématiquement au métronome.
  const [tab, setTabBrut] = useState(() => {
    if (OUTILS_INTERNES.has(outilInitial)) {
      try { localStorage.setItem("groply:outil-actif", outilInitial); } catch { /* noop */ }
      return outilInitial;
    }
    try { const t = localStorage.getItem("groply:outil-actif"); if (OUTILS_INTERNES.has(t)) return t; } catch { /* noop */ }
    return "metronome";
  });
  // Le morceau demandé n'est ouvert qu'une fois : changer d'onglet puis
  // revenir à Morceaux ramène à la liste, pas au morceau du lien.
  const [morceauDemande, setMorceauDemande] = useState(outilInitial === "morceaux" ? morceauInitial : null);
  const setTab = (t) => { setTabBrut(t); setMorceauDemande(null); try { localStorage.setItem("groply:outil-actif", t); } catch { /* noop */ } };
  // Sur mobile, la barre de défilement horizontale est à peine visible :
  // rien n'indiquait qu'il y avait d'autres outils à droite. Un fondu + une
  // flèche le signalent, et disparaissent une fois au bout.
  const ongletsRef = useRef(null);
  const [finOnglets, setFinOnglets] = useState(false);
  const majFinOnglets = useCallback(() => {
    const el = ongletsRef.current;
    if (el) setFinOnglets(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);
  useEffect(() => {
    // Un outil restauré peut se trouver hors de la vue (Tablature, à droite).
    ongletsRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    majFinOnglets();
    window.addEventListener("resize", majFinOnglets);
    return () => window.removeEventListener("resize", majFinOnglets);
  }, [majFinOnglets]);

  // Navigation clavier du tablist (motif ARIA « tabs ») : flèches gauche /
  // droite d'un onglet à l'autre (en boucle), Début / Fin pour les extrémités.
  // Un seul onglet est atteignable à la touche Tab (tabIndex itinérant) ;
  // l'activation suit le focus, comme un clic.
  const onKeyDownOnglets = (e) => {
    const i = ONGLETS_OUTILS.findIndex(t => t.id === tab);
    const n = ONGLETS_OUTILS.length;
    const cible =
      e.key === "ArrowRight" ? (i + 1) % n
      : e.key === "ArrowLeft" ? (i - 1 + n) % n
      : e.key === "Home" ? 0
      : e.key === "End" ? n - 1
      : null;
    if (cible == null) return;
    e.preventDefault();
    const id = ONGLETS_OUTILS[cible].id;
    setTab(id);
    const bouton = document.getElementById(idOnglet(id));
    bouton?.focus({ preventScroll: true });
    bouton?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: comportementDefilement() });
  };

  const Outil = OUTIL_PAR_ID[tab];

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Avec un bouton retour (arrivée depuis la séance du jour, une fin de
          leçon…), le titre se range à sa droite : il passe alors en enfant
          du bandeau, avec la même typographie. */}
      <ScreenHero
        image="/sunrise.jpg" color="#b7a0c8" overlay="rgba(160,55,0,.5)" position="center 40%"
        title={onBack ? undefined : TITRE}
        subtitle={onBack ? undefined : SOUS_TITRE}
      >
        {onBack && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BackButton onClick={onBack} label="Retour"
              tint={{ bg: C.surface, border: C.primaryBorder, icon: C.primaryD }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: T.h1, fontWeight: 800, color: "#fff", letterSpacing: "-.4px", lineHeight: 1.15 }}>{TITRE}</h1>
              <div style={{ fontSize: T.small, fontWeight: 500, color: "rgba(255,255,255,.88)", marginTop: 4, lineHeight: 1.45 }}>{SOUS_TITRE}</div>
            </div>
          </div>
        )}
      </ScreenHero>

      {/* Onglets — en défilement horizontal, pas en répartition égale :
          à 8 entrées, flex:1 chacune serait devenue trop étroite pour que le
          libellé tienne proprement sur mobile. Le tablist ne contient que
          les vrais onglets ; Jam Session et Ear Training suivent dans la
          même rangée, après un séparateur, comme boutons ordinaires qui
          appellent `navigate` (ils quittent l'écran). */}
      <div className="gr-in" style={{ position: "relative" }}>
        <div ref={ongletsRef} onScroll={majFinOnglets} className="gr-hscroll" style={{ padding: "14px 16px 6px" }}>
          <div style={{ display: "flex", gap: 8, width: "max-content", alignItems: "stretch" }}>
            <div role="tablist" aria-label="Outils" onKeyDown={onKeyDownOnglets} style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
              {ONGLETS_OUTILS.map(t => {
                const actif = tab === t.id;
                return (
                  <OngletOutil
                    key={t.id}
                    role="tab"
                    id={idOnglet(t.id)}
                    aria-selected={actif}
                    aria-controls={ID_PANNEAU}
                    tabIndex={actif ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    icon={t.icon}
                    actif={actif}>
                    {t.label}
                  </OngletOutil>
                );
              })}
            </div>
            {/* Un petit séparateur et une flèche ↗ signalent, avant l'appui,
                que ces deux entrées ouvrent une autre page. */}
            <div aria-hidden="true" style={{ width: 2, borderRadius: R.pill, background: C.border, margin: "8px 0 11px" }} />
            {LIENS_EXTERNES.map(t => (
              <OngletOutil
                key={t.id}
                aria-label={`${t.label} (ouvre une autre page)`}
                onClick={() => navigate(t.id)}
                icon={t.icon}
                externe>
                {t.label}
              </OngletOutil>
            ))}
          </div>
        </div>
        {!finOnglets && (
          <div aria-hidden="true" className="gr-in-fade" style={{
            position: "absolute", top: 14, right: 0, bottom: 9, width: 56, pointerEvents: "none",
            background: `linear-gradient(to right, transparent, ${C.bg} 70%)`,
            display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6,
          }}>
            <Ti name="chevron-right" size={18} color={C.text2} />
          </div>
        )}
      </div>

      {/* Contenu — seul l'outil actif est chargé (React.lazy). La `key`
          remonte le contenu à chaque changement d'outil : il rejoue son entrée. */}
      <div role="tabpanel" id={ID_PANNEAU} aria-labelledby={idOnglet(tab)} style={{ padding: "12px 16px 0" }}>
        <div key={tab} className="gr-in">
          <Suspense fallback={<LoadingScreen texte="Chargement…" hauteur={240} />}>
            {tab === "morceaux"
              ? <Morceaux dispatch={dispatch} morceauInitial={morceauDemande} />
              : Outil ? <Outil /> : <FretboardExplorer embedded />}
          </Suspense>
        </div>
      </div>

    </div>
  );
}

export { ToolboxScreen };
