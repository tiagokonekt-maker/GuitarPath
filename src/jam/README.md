# Jam Session — moteur de groove

La Jam (`src/screens/JamSession.jsx`) tourne sur **Tone.js** (`Tone.Transport`
sert d'horloge). Ce dossier contient la partie « intelligence musicale » de
la batterie : elle ne produit que des **évènements** (quoi jouer, quand, à
quelle force), et c'est JamSession qui les joue avec ses propres échantillons.

## Fichiers

| Fichier | Rôle |
|---|---|
| `music/groove.js` | Grilles de pas, swing dépendant du tempo, humanisation |
| `generators/drums.js` | Grille du pack + décisions du Director → évènements de batterie |
| `arrangement/arranger.js` | Planner (forme longue : intro, couplets, breaks) + Director (grammaire pondérée des remplissages) |
| `packs/*.json` | Un style = un fichier de données (`blues-shuffle`, `funk-16`, `rock-8`, `jazz-swing`, `bossa-nova`, `ballade-pop`) |
| `styles.js` | Style de la Jam → pack ; lecture de `bassStyle` / `compStyle` ; ambiance (réverbération) |

Testés par `test/engine.test.mjs`, `test/extensibility.test.mjs`,
`test/swing.test.mjs` et `test/jam-styles.test.mjs`.

## Ajouter un style

1. Copier un pack existant dans `packs/` et adapter grilles, `feel.swing`, sections.
2. L'importer dans `JamSession.jsx` (liste `PACKS`) et l'associer au style
   dans `styles.js` (`PACK_ID_PAR_STYLE`) ; le contexte (grilles, gammes,
   tonalités) va dans `src/screens/jam/contextes.js`.
3. `npm test` : `extensibility.test.mjs` vérifie qu'un pack bien formé
   produit des mesures valides.

Un style sans pack retombe sur le motif de batterie codé dans JamSession.

## Champs d'un pack

- `feel.subdivision` / `feel.swing` : le swing ne s'applique qu'au jazz
  (0.95) ; rock, bossa et ballade sont à 0. Basse et accompagnement suivent
  le même swing (`companionSwing`).
- `drumPatterns[].bars` : motif sur plusieurs mesures (la clave de bossa sur
  2 mesures) ; chaque grille est découpée en `bars` tranches.
- `fillRate` : multiplie la fréquence des fills (ballade 0.45, bossa 0.6).
- Voix virtuelles (`generators/drums.js`, `DRUM_ALIASES`) : il n'y a ni
  rim-click, ni shaker, ni charleston au pied dans `public/audio/drums`.
  `rim` = caisse claire à ~40 % de vélocité (cross-stick), `shaker` =
  charleston fermée à 50 %, `pedalHat` = charleston fermée à ~60 %, jamais
  remplacée par la ride. Approximations à remplacer si de vrais échantillons
  arrivent.
- `bassStyle.approach` : `walking`, `shuffleWalk`, `rootEighths`,
  `syncopated16`, `bossaRootFifth`, `sustainedRoots`
  (`src/music/walkingBass.js`, `generateBassBar`).
- `compStyle.rhythm` : `jazzComp`, `shuffleChank`, `rock8`, `chank16`,
  `bossa`, `arpeggio8` (`src/music/compRhythm.js`) ; `compStyle.voicing` :
  `rootless`, `power`, `triad`, `shell`, `spread`
  (`src/screens/jam/harmonie.js`, `getVoicedChord`) ; `register[0]` = plancher.

## Échantillons

Batterie, basse et piano sont dans `public/audio/{drums,bass,piano}/`.
Si de nouveaux échantillons sont ajoutés, n'utiliser que des banques à licence
libre de redistribution (par exemple VCSL, CC0 :
https://github.com/sgossner/VCSL). La plupart des banques commerciales
interdisent de redistribuer leurs sons dans une application.

## Historique

Le prototype « phase 0 » avait sa propre horloge, son propre `AudioContext`
et sa banque d'échantillons (`jamEngine.js`, `engine/`). Seuls le groove,
l'arrangeur et le générateur de batterie ont été branchés dans la Jam : le
reste faisait doublon avec Tone.js et a été retiré.
