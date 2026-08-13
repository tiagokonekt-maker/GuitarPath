# Fichiers à supprimer

Ces fichiers ont été identifiés comme du **code mort** par analyse complète du
graphe d'imports (audit §4.1) : aucun fichier de l'application ne les importe.

## À supprimer sans hésiter

```
src/App_patch.jsx          205 lignes — duplique App.jsx, jamais importé
src/index.css              (l'ancien)  — template Vite ; remplacé par le nouveau
```

L'ancien `index.css` était un piège actif : son
`#root { width: 1126px; text-align: center; border-inline: 1px solid }`
aurait cassé toute la mise en page mobile le jour où quelqu'un l'aurait importé.
Il est remplacé par une vraie feuille de styles, elle-même importée par
`main.jsx` et `App.jsx`.

## À trancher : le moteur de jam

```
src/jam/jamEngine.js                158 lignes
src/jam/arrangement/arranger.js     195
src/jam/music/groove.js             120
src/jam/music/clock.js              154
src/jam/generators/drums.js          90
src/jam/generators/sampleBank.js    152
src/jam/harmony/graph.js            211
src/jam/packs/blues-shuffle.json    101
src/jam/packs/funk-16.json          100
test/engine.test.mjs                319   (teste ce moteur)
test/extensibility.test.mjs          37   (idem)
                                  -----
                                   1637 lignes
```

`jamEngine.js` n'est importé par personne. `JamSession.jsx` (971 lignes)
réimplémente tout de son côté sans l'utiliser.

Autrement dit : le moteur **propre** — horloge sans dérive de tempo, arrangeur,
packs JSON extensibles, 356 lignes de tests — est celui qui ne tourne pas.

**Deux options, à trancher explicitement :**

| Option | Ce que ça implique |
|---|---|
| **A — Le brancher** | `JamSession.jsx` consomme `jamEngine` et perd sa propre implémentation. Gain : une horloge testée, des packs de style ajoutables en JSON sans toucher au code. Coût : une à deux journées de refonte de `JamSession`. |
| **B — Le supprimer** | `rm -rf src/jam test/engine.test.mjs test/extensibility.test.mjs`. Gain : 1 637 lignes de moins à maintenir. Coût : le travail est perdu, et ajouter un style de jam restera du code. |

Garder les deux, c'est payer la maintenance des deux et ne bénéficier
d'aucun. Ma recommandation : **option A**, parce que « ajouter un pack de style
en JSON » est exactement ce dont un produit d'improvisation a besoin — mais
c'est un choix de roadmap, pas une correction de bug, donc je ne l'ai pas fait
à ta place.

## Doublons de configuration

Le dossier que tu m'as fourni contenait **deux** `index.html` et **deux**
`manifest.json`, avec des valeurs divergentes (`background_color` `#FFF7F0`
vs `#FFE8CF`, `orientation` `portrait` vs `portrait-primary`, jeux d'icônes
différents). L'un des deux était un artefact de build (`dist/`).

Vérifie que `dist/` est bien dans `.gitignore` — c'est le cas dans celui que je
te livre — et qu'il n'y a qu'une seule source de vérité pour ces deux fichiers.
