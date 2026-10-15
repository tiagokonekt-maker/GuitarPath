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
