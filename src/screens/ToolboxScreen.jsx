// Groply — src/screens/ToolboxScreen.jsx
// Boîte à outils : métronome, accordeur, lecteur d'accords, manche,
// éditeur de tablature, lecteur de morceaux, et accès à Jam Session / Ear Training.
//
// Chaque outil vit dans son propre module (src/screens/toolbox/) et n'est
// chargé qu'à l'ouverture de son onglet : ouvrir « Outils » ne télécharge
// plus Tone.js, l'accordeur et l'éditeur de tab d'un seul bloc.
import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { FONTS, R } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { BackButton } from "../design/ui.jsx";

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

/** Respecte « réduire les animations » pour les défilements déclenchés en JS. */
const comportementDefilement = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

function ToolboxScreen({ onBack, navigate }) {
  const C = useC();
  // L'outil actif est mémorisé : revenir dans Outils ramène là où on était
  // (au milieu d'une tab, par exemple), pas systématiquement au métronome.
  const [tab, setTabBrut] = useState(() => {
    try { const t = localStorage.getItem("groply:outil-actif"); if (OUTILS_INTERNES.has(t)) return t; } catch { /* noop */ }
    return "metronome";
  });
  const setTab = (t) => { setTabBrut(t); try { localStorage.setItem("groply:outil-actif", t); } catch { /* noop */ } };
  // Sur mobile, la barre de défilement horizontale est masquée par le
  // système : rien n'indiquait qu'il y avait d'autres outils à droite. Un
  // fondu + une flèche le signalent, et disparaissent une fois au bout.
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

  const styleOnglet = (actif) => ({
    position:"relative", flexShrink:0, width:90, padding:"10px 4px", borderRadius:R.lg, cursor:"pointer", fontFamily:FONTS.ui,
    border:`1.5px solid ${actif?C.primary:C.border}`,
    background: actif?C.primaryL:C.surface,
    color: actif?C.primaryD:C.text2, fontWeight:700, fontSize:12,
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
    textAlign:"center", lineHeight:1.2,
  });

  const Outil = OUTIL_PAR_ID[tab];

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Header */}
      <div style={{
        backgroundColor:"#b7a0c8", backgroundImage:"url('/sunrise.jpg')", backgroundSize:"cover", backgroundPosition:"center 40%",
        padding:"26px 20px 20px", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(160,55,0,.5)" }}/>
        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:12 }}>
          {onBack && (
            <BackButton onClick={onBack} label="Retour"
              tint={{ bg:"rgba(255,255,255,.85)", border:"transparent", icon:C.primaryD }} />
          )}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff", letterSpacing:"-.4px" }}>Boîte à outils</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.8)", marginTop:1 }}>Tout ce qu'il faut pour pratiquer</div>
          </div>
        </div>
      </div>

      {/* Onglets — en défilement horizontal, pas en répartition égale :
          à 8 entrées, flex:1 chacune serait devenue trop étroite pour que le
          libellé tienne proprement sur mobile. Le tablist ne contient que
          les vrais onglets ; Jam Session et Ear Training suivent dans la
          même rangée, après un séparateur, comme boutons ordinaires qui
          appellent `navigate` (ils quittent l'écran). */}
      <div style={{ position:"relative" }}>
      <div ref={ongletsRef} onScroll={majFinOnglets} style={{ overflowX:"auto", WebkitOverflowScrolling:"touch", padding:"14px 20px 0" }}>
        <div style={{ display:"flex", gap:8, width:"max-content", alignItems:"stretch" }}>
          <div role="tablist" aria-label="Outils" onKeyDown={onKeyDownOnglets} style={{ display:"flex", gap:8, alignItems:"stretch" }}>
            {ONGLETS_OUTILS.map(t => {
              const actif = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={idOnglet(t.id)}
                  aria-selected={actif}
                  aria-controls={ID_PANNEAU}
                  tabIndex={actif ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className="gr-focus"
                  style={styleOnglet(actif)}>
                  <Ti name={t.icon} size={15} color={actif?C.primary:C.text3}/>
                  {t.label}
                </button>
              );
            })}
          </div>
          {/* Un petit séparateur et une flèche ↗ signalent, avant l'appui,
              que ces deux entrées ouvrent une autre page. */}
          <div aria-hidden="true" style={{ width:1.5, background:C.border, margin:"6px 0" }}/>
          {LIENS_EXTERNES.map(t => (
            <button
              key={t.id}
              type="button"
              aria-label={`${t.label} (ouvre une autre page)`}
              onClick={() => navigate(t.id)}
              className="gr-focus"
              style={styleOnglet(false)}>
              <span aria-hidden="true" style={{ position:"absolute", top:3, right:6, fontSize:10, color:C.text3 }}>↗</span>
              <Ti name={t.icon} size={15} color={C.text3}/>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {!finOnglets && (
        <div aria-hidden="true" style={{
          position:"absolute", top:14, right:0, bottom:0, width:56, pointerEvents:"none",
          background:`linear-gradient(to right, transparent, ${C.bg} 70%)`,
          display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:6,
        }}>
          <Ti name="chevron-right" size={18} color={C.text2}/>
        </div>
      )}
      </div>

      {/* Contenu — seul l'outil actif est chargé (React.lazy). */}
      <div role="tabpanel" id={ID_PANNEAU} aria-labelledby={idOnglet(tab)} style={{ padding:"18px 20px 0" }}>
        <Suspense fallback={
          <div role="status" style={{ minHeight:240, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:C.text3, fontFamily:FONTS.ui }}>
            Chargement…
          </div>
        }>
          {Outil ? <Outil/> : <FretboardExplorer embedded />}
        </Suspense>
      </div>

    </div>
  );
}

export { ToolboxScreen };
