// Groply — src/screens/toolbox/ChordPlayer.jsx
// Lecteur d'accords de la boîte à outils (chargé à la demande par ToolboxScreen).
import { useState, useRef, useEffect, useCallback } from "react";
import { R, T } from "../../design/tokens.js";
import { useC } from "../../design/ThemeContext.jsx";
import { Button, Card, Chip, Eyebrow, IconButton } from "../../design/ui.jsx";
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

// Chip d'un sélecteur : zone tactile de 44 px.
const STYLE_CHOIX = { minHeight: 44 };

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

  return (
    <div className="gr-stagger" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Choix de l'accord à ajouter */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <Eyebrow style={{ marginBottom: 8 }}>Fondamentale</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 6 }}>
            {CHORD_ROOTS.map(code => (
              <Chip key={code} selected={root === code} onClick={() => setRoot(code)}
                style={{ ...STYLE_CHOIX, minWidth: 0, padding: 0 }}>
                {nomRacineAccord(code, quality)}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <Eyebrow style={{ marginBottom: 8 }}>Famille</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CHORD_FAMILIES.map(f => (
              <Chip key={f.id} selected={family === f.id} style={STYLE_CHOIX} onClick={() => {
                setFamily(f.id);
                // On bascule sur la première qualité de la famille, pour ne
                // jamais laisser une sélection invisible dans un autre onglet.
                setQuality(f.keys[0]);
              }}>
                {f.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <Eyebrow style={{ marginBottom: 8 }}>Qualité</Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(CHORD_FAMILIES.find(f => f.id === family)?.keys || []).map(key => (
              <Chip key={key} selected={quality === key} onClick={() => setQuality(key)}
                aria-label={CHORD_TYPES[key]?.name || key} style={{ ...STYLE_CHOIX, minWidth: 48 }}>
                {CHORD_TYPES[key]?.sym || CHORD_TYPES[key]?.name || key}
              </Chip>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.text2, marginTop: 8, minHeight: 18 }}>
            {CHORD_TYPES[quality]?.name}
          </div>
        </div>

        <Button variant="soft" full icon="plus" onClick={addChord} disabled={sequence.length >= MAX_CHORDS}>
          Ajouter à la suite
        </Button>
      </Card>

      {/* Suite d'accords construite */}
      <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 20 }}>
          <Eyebrow>Ta suite ({sequence.length}/{MAX_CHORDS})</Eyebrow>
          {sequence.length > 0 && (
            <Button variant="ghost" size="sm" tone="danger" icon="trash" onClick={clearAll}
              style={{ margin: "-10px -12px -10px 0" }}>
              Vider
            </Button>
          )}
        </div>

        {sequence.length === 0 ? (
          <div role="status" style={{ textAlign: "center", padding: "10px 0", color: C.text2, fontSize: T.small, lineHeight: 1.5 }}>
            {suiteVidee ? (
              <>Suite vidée.{" "}
                <Button variant="ghost" size="sm" onClick={annulerVider} style={{ padding: "0 6px" }}>Annuler</Button>
              </>
            ) : "Ajoute des accords ci-dessus pour construire ta suite."}
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sequence.map((c, i) => {
              const joue = activeIdx === i && playing;
              return (
                // L'accord en cours de lecture s'allume et bat une fois.
                <div key={i} className={joue ? "gr-bump" : undefined} style={{
                  display: "flex", alignItems: "center", gap: 2, padding: "2px 2px 2px 12px",
                  borderRadius: R.sm, fontWeight: 700, fontSize: T.small,
                  border: `2px solid ${joue ? C.primary : C.border}`,
                  background: joue ? C.primaryL : C.surface2,
                  color: joue ? C.primaryD : C.text,
                  transition: "background-color var(--gr-dur-fast) ease, border-color var(--gr-dur-fast) ease, color var(--gr-dur-fast) ease",
                }}>
                  {c.label}
                  <IconButton icon="x" label={`Retirer ${c.label}`} variant="ghost" size={36} iconSize={14}
                    onClick={() => removeChord(i)} />
                </div>
              );
            })}
          </div>
        )}

        {/* Vitesse */}
        <div style={{ display: "flex", gap: 6 }}>
          {SPEED_PRESETS.map(p => (
            <Chip key={p.id} selected={speed === p.id} onClick={() => setSpeed(p.id)} disabled={playing}
              style={{ ...STYLE_CHOIX, flex: 1, minWidth: 0, padding: "0 4px" }}>
              {p.label}
            </Chip>
          ))}
        </div>

        <Button size="lg" full tone={playing ? "coral" : "primary"} icon={playing ? "player-pause" : "player-play"}
          onClick={toggle} disabled={sequence.length === 0}>
          {playing ? "Arrêter" : "Écouter la suite"}
        </Button>
      </Card>
    </div>
  );
}
