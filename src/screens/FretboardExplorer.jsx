// GuitarPath -- screens/FretboardExplorer.jsx
// Page "Explorateur du manche" -- visualisation libre gammes + accords
import { useState, useMemo, useRef, useEffect } from "react";
import { T } from "../design/tokens.js";
import { useC } from "../design/ThemeContext.jsx";
import { Ti } from "../design/Ti.jsx";
import { Button, Card, Chip, Eyebrow, IconButton, Segmented, SubHeader, Tag } from "../design/ui.jsx";
import { Fretboard } from "../Fretboard.jsx";
import { SCALES, CHORD_TYPES, getScaleNotes, getChordNotes, normalizeNote } from "../fretboardUtils.js";
import { NOTES_DIESES_EN } from "../music/notes.js";
import { nomsGamme, nomsAccord, nomRacineGamme, nomRacineAccord } from "../music/orthographe.js";
import { getChordShapes } from "../music/chordShapes.js";
import { ChordDiagram } from "../diagrams.jsx";
import { playScaleFromRoot, playChordFromRoot, playArpeggioFromRoot, stopAll, unlockAudio } from "../audioEngine.js";

// Toniques : valeurs internes en dièses. Leur nom AFFICHÉ dépend de la gamme
// ou de l'accord choisi (Sib majeur, Do# mineur…) : voir nomRacine plus bas.
const ROOTS = NOTES_DIESES_EN;

const SCALE_OPTIONS = [
  { key: "pentatonic_minor", label: "Pentatonique mineure" },
  { key: "pentatonic_major", label: "Pentatonique majeure" },
  { key: "blues",            label: "Blues"                },
  { key: "major",            label: "Majeure"              },
  { key: "natural_minor",    label: "Mineure naturelle"    },
  { key: "harmonic_minor",   label: "Mineure harmonique"   },
  { key: "dorian",           label: "Dorien"               },
  { key: "phrygian",         label: "Phrygien"             },
  { key: "mixolydian",       label: "Mixolydien"           },
  { key: "lydian",           label: "Lydien"               },
  { key: "whole_tone",       label: "Tons entiers"         },
];

const CHORD_OPTIONS = [
  { key: "maj",    label: "Majeur"       },
  { key: "min",    label: "Mineur"       },
  { key: "dom7",   label: "Dom7"         },
  { key: "maj7",   label: "Maj7"         },
  { key: "min7",   label: "Mineur 7"     },
  { key: "min7b5", label: "Mi-diminue"   },
  { key: "dim7",   label: "Diminue 7"    },
  { key: "sus2",   label: "Sus2"         },
  { key: "sus4",   label: "Sus4"         },
  { key: "add9",   label: "Add9"         },
];

const SCALE_INFO = {
  pentatonic_minor: { desc: "5 notes. La gamme du rock et du blues. Aucune fausse note sur un accord mineur.", usage: "Rock, Blues, Metal, Soul" },
  pentatonic_major: { desc: "5 notes. Version joyeuse. Parfaite pour le country et le pop.", usage: "Country, Pop, Folk" },
  blues:            { desc: "Pentatonique mineure + la note bleue (b5). La note bleue = la couleur blues.", usage: "Blues, Jazz, Rock" },
  major:            { desc: "7 notes. La gamme de reference. Toutes les autres gammes en decoulent.", usage: "Pop, Rock, Classique" },
  natural_minor:    { desc: "7 notes. Sons sombres et melancoliques. Base du rock et du metal.", usage: "Rock, Metal, Classique" },
  harmonic_minor:   { desc: "Mineure avec une 7e majeure. Son oriental et dramatique.", usage: "Metal, Flamenco, Classique" },
  dorian:           { desc: "Mineur avec une 6te majeure. Son jazz-funk caracteristique.", usage: "Jazz, Fusion, Funk" },
  phrygian:         { desc: "Mineur avec une 2de mineure. Son espagnol, flamenco et metal.", usage: "Metal, Flamenco, Fusion" },
  mixolydian:       { desc: "Majeure avec une 7e mineure. Son rock-blues des grands solos.", usage: "Rock, Blues, Funk" },
  lydian:           { desc: "Majeure avec un #4. Son flottant, cinematique et moderne.", usage: "Fusion, Prog, Cinema" },
  whole_tone:       { desc: "6 notes, toutes espacees d'un ton. Son flou et onirique.", usage: "Jazz, Impressionnisme" },
};

const CHORD_INFO = {
  maj:    { desc: "Fondamentale + tierce majeure + quinte. Son stable et joyeux.", formula: "1 - 3 - 5" },
  min:    { desc: "Fondamentale + tierce mineure + quinte. Son melancolique.", formula: "1 - b3 - 5" },
  dom7:   { desc: "Accord de tension. Veut se resoudre vers le I.", formula: "1 - 3 - 5 - b7" },
  maj7:   { desc: "Son doux et jazzy. Guide tones : 3e et 7e majeure.", formula: "1 - 3 - 5 - 7" },
  min7:   { desc: "Son jazz-funk. Le ii du ii-V-I.", formula: "1 - b3 - 5 - b7" },
  min7b5: { desc: "Mi-diminue (demi-diminue). Le vii de la gamme majeure.", formula: "1 - b3 - b5 - b7" },
  dim7:   { desc: "Symetrique, tres tendu. Toutes les notes a 3 demi-tons.", formula: "1 - b3 - b5 - bb7" },
  sus2:   { desc: "Pas de tierce -- son ouvert et suspendu.", formula: "1 - 2 - 5" },
  sus4:   { desc: "Pas de tierce -- tension vers la quarte.", formula: "1 - 4 - 5" },
  add9:   { desc: "Majeur avec une 9e ajoutee. Son moderne et riche.", formula: "1 - 3 - 5 - 9" },
};

/**
 * @param embedded  true quand l'explorateur est affiché comme onglet de la
 *                  boîte à outils : on masque alors son en-tête et son
 *                  bouton retour, puisque l'écran hôte les fournit déjà.
 */
export function FretboardExplorer({ onBack, embedded = false }) {
  const C = useC();
  const [tab, setTab]             = useState("scale");
  const [root, setRoot]           = useState("A");
  const [scaleKey, setScaleKey]   = useState("pentatonic_minor");
  const [chordKey, setChordKey]   = useState("min7");
  const [displayMode, setDisplayMode] = useState("notes");
  const [showRootPicker, setShowRootPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Note(s) actuellement illuminée(s) sur le manche pendant la lecture.
  const [flashNotes, setFlashNotes] = useState(null);
  // Mode d'écoute des accords : arpégé (pédagogique) ou plaqué (sonorité
  // réelle de l'accord). Arpégé par défaut : c'est le mode qui apprend.
  const [arpeggio, setArpeggio] = useState(true);

  // Formes jouables de l'accord courant. Chaque forme est validée contre la
  // formule théorique de l'accord au moment de la génération : une forme
  // contenant une note étrangère est écartée plutôt qu'affichée.
  const shapes = useMemo(() => {
    if (tab !== "chord") return [];
    return getChordShapes(
      normalizeNote(root), chordKey, 12,
      CHORD_TYPES[chordKey]?.intervals || null
    );
  }, [tab, root, chordKey]);

  // Minuteur de fin de lecture, annulable — voir handleStop.
  const finTimerRef = useRef(null);
  const annulerFin = () => {
    if (finTimerRef.current) { clearTimeout(finTimerRef.current); finTimerRef.current = null; }
  };

  /**
   * Arrête la lecture. Il n'y avait AUCUN moyen de le faire : le bouton était
   * simplement désactivé pendant la lecture (`disabled={isPlaying}`), et une
   * gamme de 8 notes à 90 bpm dure plus de 5 secondes qu'il fallait subir.
   */
  const handleStop = () => {
    annulerFin();
    try { stopAll(); } catch { /* noop */ }
    setIsPlaying(false);
    setFlashNotes(null);
  };

  const handlePlay = async () => {
    // Une nouvelle lecture ÉCRASE la précédente au lieu d'être ignorée : le
    // `if (isPlaying) return` obligeait à attendre la fin avant de pouvoir
    // écouter autre chose.
    annulerFin();
    try { stopAll(); } catch { /* noop */ }
    setIsPlaying(true);
    setFlashNotes(null);

    // Dans le geste utilisateur, avant tout await : iOS exige que
    // l'AudioContext démarre à l'intérieur du geste.
    try { await unlockAudio(); } catch { /* noop */ }

    // onStep suit le calendrier de lecture : l'illumination tombe exactement
    // sur la note entendue.
    const onStep = (i, note) => setFlashNotes(i < 0 ? null : note);

    // Durée réelle, au lieu d'un délai fixe de 3 s qui laissait le bouton
    // désactivé bien après la fin d'un accord, et bien avant la fin d'une
    // gamme. QUEUE_AUDIBLE_MS couvre la résonance des cordes.
    let dureeMs = 2600;
    try {
      if (tab === "scale") {
        const notes = await playScaleFromRoot(root, scaleKey, 90, onStep);
        dureeMs = (notes?.length ?? 8) * (60 / 90) * 1000 + 1600;
      } else if (arpeggio) {
        // Arpégé : chaque note s'entend et s'illumine séparément.
        const notes = await playArpeggioFromRoot(root, chordKey, 132, onStep);
        dureeMs = (notes?.length ?? 4) * (60 / 132) * 1000 + 1600;
      } else {
        // Plaqué : on n'illumine rien. Toutes les notes sonnant ensemble,
        // le surlignage n'apporterait aucune information par rapport à
        // l'affichage statique déjà visible.
        await playChordFromRoot(root, chordKey);
        dureeMs = 2600;
      }
    } catch { /* noop */ }

    finTimerRef.current = setTimeout(() => {
      finTimerRef.current = null;
      setIsPlaying(false);
      setFlashNotes(null);
    }, dureeMs);
  };

  // Quitter l'écran doit couper le son : sans ça une gamme lancée juste avant
  // continuait de jouer par-dessus l'écran suivant.
  useEffect(() => () => { annulerFin(); try { stopAll(); } catch { /* déjà arrêté */ } }, []);

  const activeNotes = useMemo(() => {
    if (tab === "scale") return getScaleNotes(root, scaleKey);
    return getChordNotes(root, chordKey);
  }, [tab, root, scaleKey, chordKey]);

  const info = tab === "scale" ? SCALE_INFO[scaleKey] : CHORD_INFO[chordKey];
  const activeLabel = tab === "scale"
    ? (SCALE_OPTIONS.find(s => s.key === scaleKey)?.label ?? scaleKey)
    : (CHORD_OPTIONS.find(c => c.key === chordKey)?.label ?? chordKey);
  // Orthographe selon le contexte : la tonique et les notes s'écrivent comme
  // dans la tonalité (Fa majeur : Sib, pas La#). Les valeurs internes
  // (activeNotes, root) restent en dièses pour l'audio et le manche.
  const nomRacine = (r) => tab === "scale" ? nomRacineGamme(r, scaleKey) : nomRacineAccord(r, chordKey);
  const rootFr = nomRacine(root);
  const nomsActifs = tab === "scale" ? nomsGamme(root, scaleKey) : nomsAccord(root, chordKey);

  const transposeSemitone = (dir) => {
    const idx = ROOTS.indexOf(root);
    const next = (idx + dir + 12) % 12;
    setRoot(ROOTS[next]);
  };

  const sousTitre = `${rootFr} - ${activeLabel}`;
  // Carré d'arrêt pendant la lecture, plutôt qu'une roue d'attente : une roue
  // signifie « patiente », un carré signifie « tu peux arrêter ». C'est le
  // second message qui est vrai maintenant.
  const boutonEcouter = (
    <IconButton variant="primary" icon={isPlaying ? "player-stop-filled" : "volume"}
      label={isPlaying ? "Arrêter la lecture" : "Écouter"}
      onClick={isPlaying ? handleStop : handlePlay} />
  );
  const libelle = { width: 60, flexShrink: 0, color: C.text2 };

  return (
    <div className={embedded ? undefined : "gr-in-push"} style={embedded
      ? { display: "flex", flexDirection: "column" }
      : { display: "flex", flexDirection: "column", minHeight: "100dvh", background: C.bg }}>

      {embedded ? (
        <div style={{ paddingBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0, fontSize: T.small, fontWeight: 700, color: C.text2 }}>{sousTitre}</div>
          {boutonEcouter}
        </div>
      ) : (
        <SubHeader compact tone="amber" onBack={onBack} title="Explorateur du manche" subtitle={sousTitre}
          right={boutonEcouter} style={{ position: "sticky", top: 0, zIndex: 10 }} />
      )}

      {/* Pas de cascade ici : ce conteneur se re-rend à chaque note jouée. */}
      <div style={{ padding: embedded ? "0 0 8px" : "14px 16px 32px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>

        <Segmented label="Gammes ou accords" value={tab} onChange={setTab}
          options={[{ value: "scale", label: "Gammes", icon: "music" }, { value: "chord", label: "Accords", icon: "guitar-pick" }]} />

        {/* Tonique, et son sélecteur déplié */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Eyebrow tone="neutral" style={libelle}>Tonique</Eyebrow>
            <IconButton icon="chevron-left" label="Tonique : un demi-ton plus bas" size={46} onClick={() => transposeSemitone(-1)} />
            <Button variant="soft" aria-expanded={showRootPicker} onClick={() => setShowRootPicker(!showRootPicker)}
              style={{ flex: 1, fontSize: T.lead }}>
              {rootFr}
            </Button>
            <IconButton icon="chevron-right" label="Tonique : un demi-ton plus haut" size={46} onClick={() => transposeSemitone(1)} />
          </div>

          {showRootPicker && (
            <Card pad={10} className="gr-in-pop" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 6 }}>
              {ROOTS.map(r => (
                <Chip key={r} selected={root === r} onClick={() => { setRoot(r); setShowRootPicker(false); }}
                  style={{ minHeight: 44, padding: "0 2px" }}>{nomRacine(r)}</Chip>
              ))}
            </Card>
          )}
        </div>

        {/* Selecteur gamme/accord */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Eyebrow tone="neutral" style={libelle}>{tab === "scale" ? "Gamme" : "Accord"}</Eyebrow>
          <div className="gr-hscroll" style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: 6, width: "max-content" }}>
              {(tab === "scale" ? SCALE_OPTIONS : CHORD_OPTIONS).map(opt => {
                const active = tab === "scale" ? scaleKey === opt.key : chordKey === opt.key;
                return (
                  <Chip key={opt.key} selected={active} onClick={() => tab === "scale" ? setScaleKey(opt.key) : setChordKey(opt.key)}>
                    {opt.label}
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>

        <Segmented label="Affichage sur le manche" size="sm" value={displayMode} onChange={setDisplayMode}
          options={[{ value: "notes", label: "Notes" }, { value: "intervals", label: "Intervalles" }, { value: "degrees", label: "Degres" }]} />

        {/* Manche */}
        <Card pad={0} style={{ overflow: "hidden" }}>
          <div className="gr-hscroll" style={{ padding: "10px 8px 6px" }}>
            <Fretboard
              mode={tab === "scale" ? "scale" : "chord"}
              root={root}
              scale={tab === "scale" ? scaleKey : undefined}
              chord={tab === "chord" ? chordKey : undefined}
              displayMode={displayMode}
              lang="fr"
              compact={true}
              flashNotes={flashNotes}
            />
          </div>
        </Card>

        {/* Mode d'écoute — uniquement pour les accords */}
        {tab === "chord" && (
          <div className="gr-in">
            <Segmented label="Mode d'écoute" value={arpeggio} onChange={setArpeggio}
              options={[
                { id: true,  label: "Arpégé", hint: "note à note" },
                { id: false, label: "Plaqué", hint: "d'un bloc" },
              ].map(m => ({
                value: m.id,
                label: (
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                    <span>{m.label}</span>
                    <span style={{ fontSize: T.micro, fontWeight: 500 }}>{m.hint}</span>
                  </span>
                ),
              }))} />
          </div>
        )}

        {/* Formes jouables sur le manche */}
        {tab === "chord" && shapes.length > 0 && (
          <div className="gr-in">
            <Eyebrow tone="neutral" style={{ color: C.text2, marginBottom: 8 }}>
              {shapes.length} façon{shapes.length > 1 ? "s" : ""} de le jouer
            </Eyebrow>
            <div className="gr-hscroll" style={{ display: "flex", gap: 10 }}>
              {shapes.map((sh, i) => (
                <div key={i} style={{ flexShrink: 0, width: 150 }}>
                  <ChordDiagram
                    data={{ name: rootFr, frets: sh.frets, fingers: sh.fingers, startFret: sh.startFret, barre: sh.barre }}
                    caption={`${sh.label} · case ${sh.startFret}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes actives */}
        <Card pad="12px 14px">
          <Eyebrow tone="neutral" style={{ color: C.text2, marginBottom: 8 }}>
            Notes - {rootFr} {activeLabel}
          </Eyebrow>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {activeNotes.map((note, i) => (
              <Tag key={note} tone={i === 0 ? "amber" : "primary"} style={{ padding: "5px 10px", fontSize: T.small }}>
                {nomsActifs[i] ?? note}{i === 0 ? " R" : ""}
              </Tag>
            ))}
          </div>
          {tab === "chord" && CHORD_INFO[chordKey] && (
            <div style={{ marginTop: 8, fontSize: 12, color: C.text3 }}>
              Formule : <strong style={{ color: C.text2 }}>{CHORD_INFO[chordKey].formula}</strong>
            </div>
          )}
        </Card>

        {/* Info pedagogique */}
        {info && (
          <Card pad="12px 14px">
            <Eyebrow tone="neutral" style={{ color: C.text2, marginBottom: 6 }}>Contexte</Eyebrow>
            <p style={{ margin: "0 0 6px", fontSize: T.small, color: C.text, lineHeight: 1.55 }}>{info.desc}</p>
            {"usage" in info && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Ti name="music" size={12} color={C.text3} />
                <span style={{ fontSize: T.micro, color: C.text3 }}>{info.usage}</span>
              </div>
            )}
          </Card>
        )}

      </div>
    </div>
  );
}
