# Contenu pédagogique

Tout ce que l'élève lit, ses quiz et ses exercices. L'app n'importe que
`index.js`, qui rassemble le reste et exporte `COURSES`, `QUIZ` et `EXERCISES`.

```
content/
  index.js                  assemble tout (ordre des modules)
  cours/<module>/index.js   infos du module + ordre de ses leçons
  cours/<module>/<id>.js    une leçon + ses questions de quiz
  exercices/<module>.js     les exercices du module
```

Modules : `debut` (Premiers pas), `neck` (manche), `scales` (gammes),
`harmony` (harmonie), `rhythm` (rythme), `impro` (improvisation).

`debut` est un module d'initiation (`prelude: true` dans son index) : ses
leçons ne sont pas rangées par palier mais en unités propres, placées avant
le palier 1. Chaque leçon porte `unite: 1|2|3` (le numéro de son unité) et
`level: 0` ; les titres des unités sont dans `unites` de l'index. Il n'entre
pas dans le test de placement, et il est facultatif pour qui joue déjà
(voir `debutFacultatif` dans `src/store/pathEngine.js`).

## Modifier une leçon

Ouvrir `cours/<module>/<id>.js`. Le fichier contient :

- `export default { … }` : la leçon (`id`, `level`, `title`, `duration`,
  `content` = les blocs affichés — ou `cartes`, voir « Leçons en cartes »
  plus bas —, `quiz` = les questions rattachées à la leçon) ;
- `export const quiz = [ … ]` : les questions **rattachées** à cette leçon
  (`lessonId` = l'id de la leçon).

Attention, ce sont deux choses différentes : le champ `quiz` de la leçon est
une liste d'**identifiants**, et il peut citer des questions d'autres leçons
(révision). Le tableau `quiz` exporté contient les questions elles-mêmes.

Blocs de `content` les plus courants : `p` (paragraphe), `h` (intertitre),
`tip` (conseil), `ref` (écoute de référence), et les diagrammes
(`chord_diagram`, `fretboard`, `scale_pattern`, `rhythm_grid`…) rendus par
`src/diagrams.jsx` et `src/Fretboard.jsx`. Copier un bloc existant est le
plus sûr. Le bloc `tab` (`data.lines` = 6 lignes ASCII, corde 1 en haut,
`text` = la même tab dite en mots, `caption` = légende) sert aux leçons de
tablature : `src/diagrams.jsx` (TabBlock) l'affiche en police à chasse fixe,
défilable horizontalement, et donne `text` aux lecteurs d'écran. Un paragraphe peut porter une image : `img`, `imgAlt`, `imgSide`.

## Leçons en cartes

Une leçon peut remplacer `content` par `cartes` : une carte par écran, la
guitare en main, avec des questions et des moments « À toi de jouer » au fil
de la leçon (écran : `src/lecon/LeconCartes.jsx`, logique pure et contrôles :
`src/lecon/cartes.js`). Une leçon sans `cartes` garde son rendu article.
Les 15 leçons de `debut` sont dans ce format ; on n'y garde plus `content`
(une seule version du texte, que le vérificateur contrôle vraiment).

```js
export default {
  id: "debut-c2-02", level: 0, unite: 2,
  title: "Tes deux premiers accords : Mi mineur et La mineur",
  duration: 7,
  gropiTip: "…",                       // affiché sur la carte récap
  cartes: [
    // Une idée : un titre court, 1 à 3 paragraphes (≈ 60 mots en tout,
    // avertissement au-delà de 70), et au plus UN diagramme (tout bloc de
    // renderDiagramBlock : chord_diagram, strum_pattern, tab… avec son
    // bouton d'écoute).
    { type: "idee", titre: "Mi mineur (Em)", texte: [
      "Majeur (2) sur la corde 5, case 2 ; annulaire (3) sur la corde 4, case 2.",
      "Ses trois notes : Mi, Sol et Si.",
    ], bloc: { type: "chord_diagram", caption: "…", data: { name: "Em", frets: [0, 2, 2, 0, 0, 0] } } },

    // Une question liée au quiz : énoncé, choix et explication viennent de
    // la question q-debut-25 (rien à recopier), et la réponse alimente la
    // révision espacée (REVIEW_ANSWER, sans XP, une fois par jour).
    { type: "question", quizId: "q-debut-25" },

    // …ou une question propre à la carte (ne passe pas en révision).
    { type: "question", q: "Combien de cordes gratte-t-on ?", o: ["5", "6"], a: 1, exp: "Les six." },

    // À toi de jouer : une consigne, un diagramme facultatif, un clic de
    // métronome facultatif (bpm, 30–240) et/ou un minuteur (secondes, 10–600).
    { type: "a-toi", titre: "Une minute de changements",
      consigne: "Mi mineur, La mineur… le plus de changements possible.",
      bloc: { type: "chord_diagram", caption: "…", data: { name: "Am", frets: [-1, 0, 2, 2, 1, 0] } },
      bpm: 60, minuteur: 60 },

    // Le récap, toujours en dernier : exactement 3 points à retenir.
    { type: "recap", points: ["…", "…", "…"] },
  ],
  quiz: ["q-debut-25", "q-debut-26", "q-debut-27", "q-debut-28"],   // inchangé
};
```

Règles vérifiées par `npm test` (`scripts/verifier-contenu.mjs`) :

- **Bloquant** : type de carte inconnu, champ requis manquant, `a` hors des
  choix, `quizId` inexistant, `quizId` accompagné d'un `q`/`o`/`a`/`exp`
  réécrit, bloc de diagramme inconnu ou sans `data`, récap absent ou pas en
  dernier, aucune question ou aucun « À toi de jouer ».
- **Avertissement** : idée de plus de 70 mots, moins de 6 ou plus de 10
  cartes, plus de 3 idées d'affilée sans question.
- Les diagrammes et le texte des cartes passent par les mêmes contrôles
  musicaux que `content` (accords recalculés, « Note (corde X case Y) »…).

Conseils d'écriture : une idée par carte ; une question toutes les 2 ou 3
idées ; au moins un « À toi de jouer » avec de quoi jouer (accords à 60 BPM,
rythmique avec son `strum_pattern`, tab à lire) ; un même diagramme réutilisé
se déclare une fois en constante en tête de fichier.

À l'écran : barre de progression (« 3 / 9 »), bouton principal « Continuer »
(« Passer » sur une question pas encore répondue, « C'est fait » sur un « À
toi de jouer », « Terminer la leçon » sur le récap), « Retour », balayage
gauche/droite, flèches du clavier. La carte en cours est mémorisée dans
`localStorage` (`groply:lecon-carte:<id>`) : on reprend là où on s'était
arrêté.

## Ajouter une leçon

1. Copier une leçon du même module, la renommer `<nouvel-id>.js` et changer
   son `id` (le nom du fichier doit être l'id).
2. L'ajouter dans `cours/<module>/index.js` : une ligne `import`, puis sa
   place dans la liste `LECONS` (l'ordre de la liste = l'ordre du parcours).
3. `npm test` : `scripts/verifier-contenu.mjs` signale un fichier oublié
   dans l'index, un id en double, une question qui pointe vers une leçon
   inexistante, une réponse hors des choix proposés, etc.

**Après toute modification du contenu** (leçon, question, exercice) :
l'app ne charge au démarrage que `index-app.js` (métadonnées, quiz,
exercices) et va chercher le texte d'une leçon à son ouverture
(`corps-lecons.js`). Ces deux fichiers sont générés depuis `index.js` :
`npm run contenu:app` les met à jour. C'est automatique avec `npm run dev`,
`npm run build` et `npm test` ; il faut juste penser à les commiter avec le
reste (un test échoue s'ils sont périmés et affiche la commande).

## Questions de quiz

Format compact, une question par ligne :
`{ id, courseId, lessonId, lvl, q, o: [choix…], a: index de la bonne réponse, exp, xp }`.
`courseId` est le module **évalué** par la question, qui peut différer du
dossier de la leçon (par exemple des questions d'impro sur une leçon
d'harmonie).

Règles de qualité (contrôlées par `npm test`, section « Qualité des quiz »
du vérificateur, et `test/quiz-qualite.test.mjs`) :

- au moins **3 questions** dans le `quiz` de chaque leçon article ;
- **pas de doublon** d'énoncé ; deux questions sur la même notion doivent
  l'aborder sous des angles différents (définition, application, oreille) ;
- **pas de « selon la leçon »** ni d'anecdote à mémoriser : on vérifie une
  compétence (reconnaître, appliquer, raisonner) ;
- une leçon ne cite **jamais une question d'une leçon placée plus loin**
  dans le parcours (sinon l'élève est interrogé sur ce qu'il n'a pas vu) ;
- des choix **parallèles** : même forme, longueur voisine ; une précision
  entre parenthèses ou une réponse nettement plus longue trahit la bonne
  réponse (rappel ℹ du vérificateur) ; des distracteurs **plausibles**
  (erreurs réelles d'élève), jamais « un pouvoir magique » ;
- une seule réponse juste : vérifier qu'aucun distracteur n'est aussi
  défendable (enharmonie, accord commun à deux tonalités…).
- **jamais de question « cadeau »**, qui donne sa réponse (bloquant,
  section « Questions cadeaux » du vérificateur, logique dans
  `src/lecon/cartes.js`, tests dans `test/questions-cadeaux.test.mjs`) :
  - pas de **doigté noté en 6 caractères** (`x02220`, `xx3211`, `022xxx`…)
    dans un énoncé : « Pour l'accord de La majeur, depuis quelle corde
    grattes-tu ? », pas « Sur La (x02220)… ». Seule exception, listée dans
    `DOIGTE_AUTORISE` : les questions dont la compétence est justement de
    décoder la notation (`q-debut-24`). Les symboles de tab (« 5h7 »,
    « 7b9 ») ne sont pas concernés ;
  - dans une leçon en cartes, la **bonne réponse ne figure pas sur la carte
    affichée juste avant** la question (titre, texte, consigne, légende ;
    comparaison sans accents ni ponctuation, réponses d'au moins 4
    caractères et pas seulement des chiffres). Plutôt que de faire relire,
    faire **appliquer** : la carte explique Do majeur, la question demande
    Ré majeur ; la carte place Si sur la corde 3, la question demande Do.
    On peut aussi éloigner la question (au moins une carte entre les deux,
    pour un vrai rappel) ou ajouter une question d'application (id suffixé
    `-app`), la question d'origine restant au `quiz` de la leçon pour la
    révision. Un faux positif réel va dans `REPONSE_PRECEDENTE_AUTORISEE`
    (clé `leçon>question`), avec un commentaire qui le justifie.

Supprimer une question : retirer son id de tous les `quiz` de leçon et des
cartes (`quizId`). Les entrées de révision déjà enregistrées chez les élèves
pour cet id deviennent des orphelines sans effet. Préférer réécrire une
question (même id) quand la notion reste évaluée.

## Ordre des leçons et prérequis

Le `level` (palier) fixe l'ordre entre paliers. **À l'intérieur d'un
palier**, les leçons sont rangées par module (manche, gammes, harmonie,
rythme, impro — ordre personnalisable par l'élève), puis dans l'ordre de
`LECONS` de chaque index. Une leçon qui dépend d'une leçon d'un autre module
doit donc être à un palier **supérieur** (ou, dans le même module, plus loin
dans `LECONS`).

## Exercices

`exercices/<module>.js` : un tableau d'exercices. Exercice guidé (`steps`,
`tip`) ou exercice sur le manche (`type: "fretboard_exercise"`, `stages`).
`courseLink` / `unlockedBy` désignent les leçons qui les débloquent.

## Conseils de Gropi

Gropi (la mascotte) parle à deux endroits : le **conseil de la leçon**, écrit
dans chaque leçon, et le **conseil du jour** du popup d'accueil, tiré d'un
catalogue.

### Le conseil d'une leçon (`gropiTip`)

Chaque leçon porte un champ `gropiTip`, juste après `duration` :

```js
export default {
  id: "rhy-c4-03", level: 6,
  title: "Le palm mute : étouffer pour créer du groove",
  duration: 9,
  gropiTip: "Si ton palm mute tue complètement la note, recule un peu la paume vers le chevalet…",
  content: [ … ],
```

- Une ou deux phrases (≈ 220 caractères max), tutoiement, **propres à CETTE
  leçon** : un mini-exercice, un piège à éviter, un moyen mnémotechnique, ou
  un fait amusant vérifiable. Ne pas recopier un bloc `tip` de la leçon.
- Musicalement exact. Les positions écrites « Note (corde X case Y) » sont
  recalculées par `scripts/verifier-contenu.mjs`, comme dans le reste du
  contenu.
- Affiché avec la pose « idée » : en fin de leçon (bulle « Le conseil de
  Gropi ») et dans la bulle de Gropi sur le nœud « En cours » du Parcours.
- Une leçon sans `gropiTip` n'est pas une erreur : le vérificateur le
  signale en simple rappel, et le Parcours affiche un message générique.

### Le catalogue du conseil du jour (`src/store/gropiCatalogue.js`)

Une entrée par conseil :

```js
{ id: "t-rhy-palm-mute", type: "tip", modules: ["rhythm"], niveau: [4, 9], mots: ["palm mute"],
  text: "Pour le palm mute, pose le tranchant de la paume juste sur le chevalet…" },
```

| Champ | Rôle |
|---|---|
| `id` | **Stable**, jamais renommé : il est mémorisé dans l'historique de l'élève (`state.gropiVus`). Préfixes : `t-` conseil, `a-` anecdote, `p-` progression. |
| `type` | `tip` (conseil pratique, pose idée), `anecdote` (histoire de la musique, pose histoire), `progress` (rappel calculé, pose fierté). |
| `modules` | `["all"]` ou des modules (`debut`, `neck`, `scales`, `harmony`, `rhythm`, `impro`). |
| `niveau` | Facultatif, `[min, max]` : paliers où le conseil a du sens (0 = Premiers pas). |
| `lecons` | Facultatif : ids des leçons pour lesquelles il est taillé (priorité maximale). |
| `mots` | Facultatif : mots-clés cherchés dans le titre de la leçon en cours (minuscules, sans accents). |
| `text` | Une chaîne ; pour `progress`, une fonction `(state, ctx) => chaîne`. |
| `cond` | Facultatif, `(state, ctx) => booléen` (ex. `ctx.jourSemaine === 1`, `ctx.toReview >= 10`). |
| `priorite` | `progress` uniquement : passe devant quand un rappel est permis. |
| `pose` | Facultatif : remplace la pose du type (`rocker` pour une série, etc.). |

Règles pour les **anecdotes** : uniquement des faits vérifiables, jamais de
paroles de chanson ni de citation inventée. Dans le doute, on ne l'ajoute pas.

Comment le conseil du jour est choisi (`pickTip`, `src/store/gropiTips.js`) :
le contexte est la prochaine leçon de l'unité en cours ; on préfère un
conseil écrit pour cette leçon, puis un mot-clé de son titre, puis son
module, puis le générique. Aucun conseil n'est répété tant qu'il en reste
un jamais vu dans ce contexte ; un rappel de progression au plus une fois
sur quatre ; le même conseil toute la journée (bouton « Un autre conseil »
pour en changer). `npm test` vérifie le catalogue (ids uniques, modules et
leçons existants) et le tirage (`test/gropi.test.mjs`).

Les poses par rôle (conseil, anecdote, verrouillé, écoute, erreur…) sont
réunies dans `src/design/gropiPoses.js`.
