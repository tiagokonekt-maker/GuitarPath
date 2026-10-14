// Groply — src/screens/toolbox/ChordPlayer.jsx
// Lecteur d'accords de la boîte à outils (chargé à la demande par ToolboxScreen).
import { useState, useRef, useEffect, useCallback } from "react";
import { FONTS, R } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Ti } from "../../design/Ti.jsx";
import { playProgression, stopAll } from "../../audioEngine.js";
import { CHORD_TYPES } from "../../fretboardUtils.js";
import { NOTES_DIESES_EN } from "../../music/notes.js";
import { symboleAccord, nomRacineAccord } from "../../music/orthographe.js";

// ═══════════════════════════════════════════════════════════════════════════
// LECTEUR D'ACCORDS — construis une suite d'accords, écoute-la jouée avec
// le vrai son de guitare (même moteur que le reste de l'app).
// ═══════════════════════════════════════════════════════════════════════════
// Fondamentales : valeurs internes en dièses (celles que joue le moteur
// audio). Le nom AFFICHÉ suit la qualité choisie : Sib, Mib m, Do# m, Réb…
const CHORD_ROOTS = NOTES_DIESES_EN;
// Qualités groupées par famille : à plat, 29 pastilles seraient illisibles
// sur un écran de téléphone. On sélectionne d'abord la famille, ce qui garde
// des zones tactiles confortables.
const CHORD_FAMILIES = [
  { id:"base",   label:"Base",    keys:["maj","min","dim","aug","sus2","sus4"] },
  { id:"sept",   label:"7e / 6e", keys:["dom7","maj7","min7","min7b5","dim7","minMaj7","dom7sus4","maj6","min6"] },
  { id:"neuf",   label:"9e",      keys:["dom9","maj9","min9","add9"] },
  { id:"ext",    label:"11e / 13e", keys:["dom11","min11","maj7s11","dom13","min13","maj13"] },
  { id:"alt",    label:"Altérés", keys:["dom7b9","dom7s9","dom7b5","dom7s5"] },
];
const SPEED_PRESETS = [
  { id:"lent",   label:"Lent",   secs:2.2 },
  { id:"normal", label:"Normal", secs:1.4 },
  { id:"rapide", label:"Rapide", secs:0.8 },
];
const MAX_CHORDS = 12;

export function ChordPlayer() {
  const C = useC();
  const [root, setRoot]     = useState("C");
  const [family, setFamily] = useState("base");
  const [quality, setQuality] = useState("maj");
  const [sequence, setSequence] = useState([]); // [{root, type, label}]
  const [playing, setPlaying]   = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [speed, setSpeed] = useState("normal");
  // « Vider » était une suppression sans retour, derrière un bouton minuscule :
  // on garde la suite effacée quelques secondes pour pouvoir l'annuler.
  const [suiteVidee, setSuiteVidee] = useState(null);
  const timerViderRef = useRef(null);
  useEffect(() => () => clearTimeout(timerViderRef.current), []);

  const stop = useCallback(() => {
    // stopAll() et non stopProgression() : le second n'annulait que les
    // accords À VENIR, celui en cours continuait de résonner 1,6 s.
    stopAll();
    setPlaying(false);
    setActiveIdx(-1);
  }, []);

  // Nettoyage : si on quitte l'onglet en cours de lecture, on arrête —
  // sinon la progression continuerait à jouer en fond, ou entrerait en
  // conflit avec le métronome qui partage le même transport audio.
  useEffect(() => () => stopAll(), []);

  const addChord = () => {
    if (sequence.length >= MAX_CHORDS) return;
    // Symbole conventionnel plutôt que le nom en clair : un guitariste lit
    // "Do7♯9" immédiatement, là où "Do 7 dièse 9" demande un décodage. La
    // fondamentale est orthographiée selon l'accord (Sib7, pas La#7).
    const label = symboleAccord(root, quality);
    setSequence(s => [...s, { root, type: quality, label }]);
  };
  const removeChord = (i) => {
    setSequence(s => s.filter((_, idx) => idx !== i));
  };
  const clearAll = () => {
    stop();
    setSuiteVidee(sequence);
    setSequence([]);
    clearTimeout(timerViderRef.current);
    timerViderRef.current = setTimeout(() => setSuiteVidee(null), 6000);
  };
  const annulerVider = () => { if (suiteVidee) setSequence(suiteVidee); setSuiteVidee(null); clearTimeout(timerViderRef.current); };

  const play = async () => {
    if (sequence.length === 0) return;
    const secs = SPEED_PRESETS.find(p => p.id === speed)?.secs || 1.4;
    setPlaying(true);
    // playProgression signale la fin par onStep(-1). L'écran ne s'en servait
    // que pour éteindre le surlignage, jamais pour remettre le bouton en
    // « Écouter la suite » : il restait donc bloqué sur « Arrêter » une fois
    // la séquence terminée.
    await playProgression(sequence, secs, (idx) => {
      setActiveIdx(idx);
      if (idx === -1) setPlaying(false);
    });
  };

  const toggle = () => (playing ? stop() : play());

  const chip = {
    padding:"8px 10px", borderRadius:10, border:`1.5px solid ${C.border}`,
    background:C.surface, color:C.text2, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:FONTS.ui,
  };

  return (
    <div>
      {/* Choix de l'accord à ajouter */}
      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:16 }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.text3, marginBottom:9, fontFamily:FONTS.ui }}>Fondamentale</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:6, marginBottom:14 }}>
          {CHORD_ROOTS.map(code => (
            <button key={code} onClick={() => setRoot(code)} aria-pressed={root===code} className="gr-focus" style={{
              ...chip, padding:"9px 0",
              border:`1.5px solid ${root===code ? C.primary : C.border}`,
              background: root===code ? C.primaryL : C.surface,
              color: root===code ? C.primaryD : C.text2,
            }}>
              {nomRacineAccord(code, quality)}
            </button>
          ))}
        </div>

        <div style={{ fontSize:12, fontWeight:700, color:C.text3, marginBottom:9, fontFamily:FONTS.ui }}>Famille</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
          {CHORD_FAMILIES.map(f => (
            <button key={f.id} aria-pressed={family===f.id} className="gr-focus" onClick={() => {
              setFamily(f.id);
              // On bascule sur la première qualité de la famille, pour ne
              // jamais laisser une sélection invisible dans un autre onglet.
              setQuality(f.keys[0]);
            }} style={{
              ...chip, padding:"7px 10px", fontSize:12,
              border:`1.5px solid ${family===f.id ? C.primary : C.border}`,
              background: family===f.id ? C.primaryL : C.surface,
              color: family===f.id ? C.primaryD : C.text2,
            }}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize:12, fontWeight:700, color:C.text3, marginBottom:9, fontFamily:FONTS.ui }}>Qualité</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
          {(CHORD_FAMILIES.find(f => f.id === family)?.keys || []).map(key => (
            <button key={key} onClick={() => setQuality(key)} aria-pressed={quality===key} aria-label={CHORD_TYPES[key]?.name || key} className="gr-focus" style={{
              ...chip,
              border:`1.5px solid ${quality===key ? C.primary : C.border}`,
              background: quality===key ? C.primaryL : C.surface,
              color: quality===key ? C.primaryD : C.text2,
            }}>
              {CHORD_TYPES[key]?.sym || CHORD_TYPES[key]?.name || key}
            </button>
          ))}
        </div>

        <div style={{ fontSize:11.5, color:C.text3, marginBottom:12, fontFamily:FONTS.ui, minHeight:16 }}>
          {CHORD_TYPES[quality]?.name}
        </div>

        <button onClick={addChord} disabled={sequence.length >= MAX_CHORDS} className="gr-focus" style={{
          width:"100%", padding:"11px 0", borderRadius:R.md, border:"none",
          background: sequence.length >= MAX_CHORDS ? C.border : C.primary,
          color:C.onPrimaryBtn, fontWeight:700, fontSize:13.5, fontFamily:FONTS.ui,
          cursor: sequence.length >= MAX_CHORDS ? "default" : "pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
        }}>
          <Ti name="plus" size={15} color={C.onPrimaryBtn}/>
          Ajouter à la suite
        </button>
      </div>

      {/* Suite d'accords construite */}
      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:R.lg, padding:16, marginTop:12 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.text3, fontFamily:FONTS.ui }}>
            Ta suite ({sequence.length}/{MAX_CHORDS})
          </div>
          {sequence.length > 0 && (
            <button onClick={clearAll} className="gr-focus" style={{
              background:"none", border:"none", color:C.coral, fontSize:12.5, fontWeight:700,
              fontFamily:FONTS.ui, cursor:"pointer", padding:"8px 10px", margin:"-8px -10px", minHeight:36,
            }}>
              Vider
            </button>
          )}
        </div>

        {sequence.length === 0 ? (
          <div role="status" style={{ textAlign:"center", padding:"18px 0", color:C.text3, fontSize:13, fontFamily:FONTS.ui }}>
            {suiteVidee ? (
              <>Suite vidée.{" "}
                <button onClick={annulerVider} className="gr-focus" style={{ background:"none", border:"none", padding:"6px 4px", color:C.primaryD, fontWeight:800, fontSize:13, fontFamily:FONTS.ui, cursor:"pointer", textDecoration:"underline" }}>Annuler</button>
              </>
            ) : "Ajoute des accords ci-dessus pour construire ta suite."}
          </div>
        ) : (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
            {sequence.map((c, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", gap:6, padding:"8px 6px 8px 12px",
                borderRadius:10, fontFamily:FONTS.ui, fontWeight:700, fontSize:13,
                border:`1.5px solid ${activeIdx===i && playing ? C.primary : C.border}`,
                background: activeIdx===i && playing ? C.primaryL : C.surface2,
                color: activeIdx===i && playing ? C.primaryD : C.text,
                transition:"all 0.15s",
              }}>
                {c.label}
                <button onClick={() => removeChord(i)} aria-label={`Retirer ${c.label}`} className="gr-focus" style={{
                  background:"none", border:"none", cursor:"pointer", padding:0,
                  width:32, height:32, margin:"-8px -4px -8px 0", borderRadius:8,
                  display:"flex", alignItems:"center", justifyContent:"center", color:C.text3,
                }}>
                  <Ti name="x" size={13} color={C.text3}/>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Vitesse */}
        <div style={{ display:"flex", gap:6, marginBottom:14 }}>
          {SPEED_PRESETS.map(p => (
            <button key={p.id} onClick={() => setSpeed(p.id)} disabled={playing} aria-pressed={speed===p.id} className="gr-focus" style={{
              flex:1, padding:"8px 0", borderRadius:R.sm, fontFamily:FONTS.ui,
              border:`1.5px solid ${speed===p.id ? C.primary : C.border}`,
              background: speed===p.id ? C.primaryL : C.surface,
              color: speed===p.id ? C.primaryD : C.text2,
              fontWeight:700, fontSize:12.5, cursor: playing ? "default" : "pointer",
              opacity: playing ? 0.6 : 1,
            }}>
              {p.label}
            </button>
          ))}
        </div>

        <button onClick={toggle} disabled={sequence.length === 0} className="gr-focus" style={{
          width:"100%", padding:"13px 0", borderRadius:R.md, border:"none",
          background: sequence.length === 0 ? C.border : (playing ? C.coral : C.primary),
          color:C.onPrimaryBtn, fontWeight:800, fontSize:14, fontFamily:FONTS.ui,
          cursor: sequence.length === 0 ? "default" : "pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:7,
        }}>
          <Ti name={playing ? "player-pause" : "player-play"} size={16} color={C.onPrimaryBtn}/>
          {playing ? "Arrêter" : "Écouter la suite"}
        </button>
      </div>
    </div>
  );
}
