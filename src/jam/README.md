# Jam Session v2 — Prototype Phase 0

Objectif de cette phase : **répondre à une seule question** avant d'investir des semaines.

> Est-ce que de vrais échantillons profonds + une humanisation sérieuse produisent
> réellement la sensation d'un groupe qui joue avec toi ?

Tant que cette réponse n'est pas obtenue **à l'oreille**, construire le moteur complet
est un pari. Ce prototype existe pour trancher.

---

## Ce qui est livré

| Fichier | Rôle |
|---|---|
| `src/jam/engine/clock.js` | Transport, ordonnanceur à anticipation, carte de tempo |
| `src/jam/engine/sampleBank.js` | Couches de dynamique, round-robin, sprites, cache |
| `src/jam/engine/graph.js` | Bus de mixage, compresseur de collage, réverbération partagée |
| `src/jam/music/groove.js` | Grilles, swing dépendant du tempo, humanisation |
| `src/jam/generators/drums.js` | Grille + décisions → évènements musicaux |
| `src/jam/arrangement/arranger.js` | Planner (forme longue) + Director (grammaire pondérée) |
| `src/jam/packs/*.json` | Deux styles, en données pures |
| `src/jam/jamEngine.js` | Orchestrateur, point d'entrée unique |
| `test/*.test.mjs` | 63 vérifications en exécution réelle |

**Ce qui n'est pas encore là :** basse, accompagnement, interface. C'est volontaire —
la phase 0 ne sert qu'à valider l'hypothèse sonore, sur la batterie, qui est
l'instrument porteur du groove et le meilleur retour sur investissement.

---

## Les échantillons — la seule chose qui manque

Le moteur est prêt, il lui faut du son. **La question des licences est réglée :**

### VCSL — Versilian Community Sample Library

- **Licence : CC0-1.0** (domaine public)
- Dépôt : https://github.com/sgossner/VCSL
- Le README du projet est explicite : *« you can do whatever you want with these
  sounds (even make commercial software), no royalties, no credit, no special terms »*
- Dossiers utiles : `Membranophones/` (fûts) et `Idiophones/` (cymbales)
- Convention de nommage : `[Instrument]_[Articulation]_[Mic]_vl[Vélocité]_rr[RR].wav`

### Virtuosity Drums (même éditeur, aussi CC0)

Jusqu'à 36 niveaux de dynamique sur caisse claire, toms et grosse caisse ;
4 round-robin sur les cymbales. Plus profond que VCSL sur la batterie précisément.

> ⚠️ **Ne pas utiliser de banque commerciale.** La quasi-totalité interdit la
> redistribution des échantillons dans une application, même achetée légalement.
> C'est le piège qui peut invalider des semaines de travail.

### Mise en place

1. Récupérer les échantillons de batterie
2. Les convertir et les placer dans `public/audio/jam/drums-vcsl/`
3. Renseigner le manifeste ci-dessous

```
public/audio/jam/drums-vcsl/
  kick_vl1_rr1.wav   kick_vl1_rr2.wav
  kick_vl2_rr1.wav   kick_vl2_rr2.wav
  kick_vl3_rr1.wav   kick_vl3_rr2.wav
  snare_vl1_rr1.wav  …
  hihat_vl1_rr1.wav  …
  hihatOpen_vl2_rr1.wav
  ride_vl2_rr1.wav
  crash_vl3_rr1.wav
  tomMid_vl2_rr1.wav
  tomLow_vl2_rr1.wav
  manifest.json
```

### `manifest.json`

```json
{
  "baseUrl": "/audio/jam/drums-vcsl/",
  "samples": {
    "kick": [
      { "vel": [0.00, 0.45], "files": ["kick_vl1_rr1.wav", "kick_vl1_rr2.wav"] },
      { "vel": [0.45, 0.78], "files": ["kick_vl2_rr1.wav", "kick_vl2_rr2.wav"] },
      { "vel": [0.78, 1.01], "files": ["kick_vl3_rr1.wav", "kick_vl3_rr2.wav"] }
    ],
    "snare": [
      { "vel": [0.00, 0.42], "files": ["snare_vl1_rr1.wav", "snare_vl1_rr2.wav"] },
      { "vel": [0.42, 0.75], "files": ["snare_vl2_rr1.wav", "snare_vl2_rr2.wav"] },
      { "vel": [0.75, 1.01], "files": ["snare_vl3_rr1.wav", "snare_vl3_rr2.wav"] }
    ],
    "hihat": [
      { "vel": [0.00, 0.50], "files": ["hihat_vl1_rr1.wav", "hihat_vl1_rr2.wav"] },
      { "vel": [0.50, 1.01], "files": ["hihat_vl2_rr1.wav", "hihat_vl2_rr2.wav"] }
    ],
    "hihatOpen": [
      { "vel": [0.00, 1.01], "files": ["hihatOpen_vl2_rr1.wav", "hihatOpen_vl2_rr2.wav"] }
    ],
    "ride":   [ { "vel": [0.00, 1.01], "files": ["ride_vl2_rr1.wav", "ride_vl2_rr2.wav"] } ],
    "crash":  [ { "vel": [0.00, 1.01], "files": ["crash_vl3_rr1.wav"] } ],
    "tomMid": [ { "vel": [0.00, 1.01], "files": ["tomMid_vl2_rr1.wav", "tomMid_vl2_rr2.wav"] } ],
    "tomLow": [ { "vel": [0.00, 1.01], "files": ["tomLow_vl2_rr1.wav", "tomLow_vl2_rr2.wav"] } ]
  }
}
```

Le moteur est **tolérant aux fichiers absents** : il charge ce qu'il trouve, saute
le reste, et remonte la liste des manquants dans `engine.missingSamples`. On peut
donc commencer avec seulement grosse caisse / caisse claire / charleston.

---

## Utilisation

```js
import { createJamEngine } from "./jam/jamEngine.js";
import bluesShuffle from "./jam/packs/blues-shuffle.json";

const engine = createJamEngine();

// init() doit suivre un geste utilisateur (contrainte iOS)
const manifest = await fetch("/audio/jam/drums-vcsl/manifest.json").then(r => r.json());
const { ok, missing } = await engine.init(bluesShuffle, manifest);
if (!ok) console.warn("Échantillons manquants :", missing);

engine.start({ bpm: 88, startEnergy: 3 });

// Contrôles vivants — pendant la lecture, sans interruption
engine.nudgeEnergy(+1);
engine.nudgeTempo(-4);
engine.requestChange();
engine.toggleMute("drums");

// Synchronisation VISUELLE uniquement (jamais pour piloter l'audio)
engine.setOnBar(({ bar, section, energy, decision }) => { /* … */ });
```

---

## Tests

```bash
node test/engine.test.mjs         # 55 vérifications
node test/extensibility.test.mjs  # 8 vérifications, 2 packs
```

Les couches 1 à 5 sont du JavaScript pur, sans audio : on vérifie que le moteur est
**musicalement correct** sans écouter une note. Ce qui est couvert :

- **Carte de tempo** : aucune dérive sur 30 minutes, aller-retour exact après
  plusieurs changements de tempo
- **Swing** : plus prononcé en tempo lent, jamais au-delà du ternaire
- **Humanisation** : dynamique bornée, grosse caisse en avance / caisse claire en
  retard vérifié statistiquement sur 3 000 tirages
- **Planner** : sections contiguës, énergie entre 1 et 5, jamais deux fois le même
  rôle d'affilée
- **Director** : fills uniquement en fin de phrase, jamais consécutifs, jamais deux
  fois le même — et surtout *pas systématiques*, sinon le fill devient lui-même une boucle
- **Test décisif** : sur 600 mesures (~11 min), **100 % de mesures distinctes**, les
  5 niveaux d'énergie traversés, les 3 motifs employés

Un défaut réel a été trouvé et corrigé grâce à ces tests : le modèle d'énergie
initial faisait dériver l'intensité vers le bas sans jamais y revenir — une session
démarrée à 3 ne dépassait jamais 3. L'énergie orbite désormais autour du niveau
choisi.

---

## Protocole d'écoute — le vrai juge

Une fois les échantillons en place :

1. Lancer 5 minutes de blues shuffle, énergie 3, **et jouer par-dessus**
2. Comparer à l'aveugle avec le moteur actuel et avec iReal Pro
3. Trois questions :
   - Est-ce que ça donne envie de jouer ?
   - Est-ce que ça lasse avant 5 minutes ?
   - Est-ce que ça masque le jeu de guitare ?

**Critère de décision** : si le prototype ne s'impose pas immédiatement à l'oreille,
il faut revoir la stratégie de contenu audio *avant* de construire basse et
accompagnement. C'est tout l'intérêt de faire cette phase en premier.

### Réglages si besoin

| Symptôme | Où agir |
|---|---|
| Trop mécanique | `humanize.jitterMs` et `velSigma` du pack |
| Trop flou / imprécis | Baisser `jitterMs` |
| Swing pas assez marqué | `feel.swing` (0 = binaire, 1 = ternaire) |
| Fills trop fréquents | Constante `probability` dans `arranger.js` |
| Accompagnement masque la guitare | `CHANNEL_PRESETS.comp` dans `graph.js` |

---

## Ce que ce prototype ne prouve pas encore

- **La basse et l'accompagnement.** L'accompagnement reste le point difficile :
  l'échantillonnage note à note ne capture pas entièrement le geste d'un vrai
  guitariste. C'est la décision de la phase 3.
- **L'audio en arrière-plan sur mobile.** À tester tôt sur un iPhone réel : si le
  son s'arrête à l'écran verrouillé, c'est un problème majeur pour une session de
  30 minutes. Aucun test en environnement de développement ne peut le garantir.
- **La qualité perçue.** Je ne peux pas écouter le résultat. Les tests prouvent que
  le moteur est musicalement *correct* ; seule ton oreille dira s'il est *bon*.
