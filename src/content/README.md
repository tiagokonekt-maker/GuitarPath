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
  `content` = les blocs affichés, `quiz` = les questions proposées à la fin) ;
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

## Ajouter une leçon

1. Copier une leçon du même module, la renommer `<nouvel-id>.js` et changer
   son `id` (le nom du fichier doit être l'id).
2. L'ajouter dans `cours/<module>/index.js` : une ligne `import`, puis sa
   place dans la liste `LECONS` (l'ordre de la liste = l'ordre du parcours).
3. `npm test` : `scripts/verifier-contenu.mjs` signale un fichier oublié
   dans l'index, un id en double, une question qui pointe vers une leçon
   inexistante, une réponse hors des choix proposés, etc.

## Questions de quiz

Format compact, une question par ligne :
`{ id, courseId, lessonId, lvl, q, o: [choix…], a: index de la bonne réponse, exp, xp }`.
`courseId` est le module **évalué** par la question, qui peut différer du
dossier de la leçon (par exemple des questions d'impro sur une leçon
d'harmonie).

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
