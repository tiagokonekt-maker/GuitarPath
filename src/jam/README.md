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
| `packs/*.json` | Un style = un fichier de données (`blues-shuffle`, `funk-16`) |

Testés par `test/engine.test.mjs` et `test/extensibility.test.mjs`.

## Ajouter un style

1. Copier un pack existant dans `packs/` et adapter grilles, `feel.swing`, sections.
2. L'importer dans `JamSession.jsx` et l'associer au style voulu.
3. `npm test` : `extensibility.test.mjs` vérifie qu'un pack bien formé
   produit des mesures valides.

Un style sans pack retombe sur le motif de batterie codé dans JamSession.

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
