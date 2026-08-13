# Groply — correctifs de l'audit

Tout ce qui suit est **appliqué et vérifié** : 90 tests automatisés passent
(`npm test`), l'application compile, et `node scripts/verifier-contenu.mjs`
ne signale aucune anomalie.

---

## Avant de déployer — dans cet ordre

### 1. Le RLS Supabase (le point n°1 de l'audit)

```bash
# Dans le SQL Editor du dashboard Supabase
# → copier/coller sql/01-rls-progress.sql, exécuter
# → puis sql/02-delete-account.sql
```

Le fichier finit par un **test négatif** en `curl`. Fais-le. Voir une policy
dans le dashboard ne prouve pas qu'elle protège : seul un appel réel avec le
jeton d'un autre compte le prouve.

### 2. La suppression de compte

```bash
supabase functions deploy delete-account
# Puis, dans les variables d'environnement de la fonction :
#   SUPABASE_SERVICE_ROLE_KEY  (jamais préfixée VITE_, jamais dans le dépôt)
#   GROPLY_ORIGIN              (l'origine de ton app, pour le CORS)
#   GROPLY_HASH_SALT           (une chaîne aléatoire, pour le journal anonyme)
```

### 3. Les migrations de données

Trois changements touchent des données déjà en circulation. Tous sont
**rétrocompatibles en lecture**, mais lis les trois notes :

| Changement | Effet sur les comptes existants |
|---|---|
| **Dates en heure locale** | Un utilisateur situé à l'est de Greenwich verra ses dates passer d'UTC à local. Sa dernière session peut donc « avancer » d'un jour. `MARK_STREAK` raisonne en écart de jours, donc une série en cours n'est jamais cassée par la bascule : au pire elle est prolongée d'un jour. Aucune action requise. |
| **Semaine paddée** (`2026-W9` → `2026-W09`) | `normalizeWeek()` lit les deux formats. Garde-le au moins une version majeure avant de le retirer. |
| **Courbe de niveaux** | La nouvelle courbe est **moins chère** : les niveaux sont recalculés à la hausse au premier chargement. Personne ne perd de niveau. Un utilisateur à 5 000 XP passe du niveau 12 au niveau 15. |

### 4. Retag du contenu (déjà appliqué)

```bash
node scripts/retag-impro.mjs          # aperçu
node scripts/retag-impro.mjs --write  # déjà fait dans ce livrable
node scripts/verifier-contenu.mjs     # doit finir sur « Aucune anomalie »
```

### 5. Compléter les pages légales

`public/cgu.html` et `public/confidentialite.html` contiennent des
`<!-- À COMPLÉTER -->` : nom ou raison sociale, adresse, email de contact,
région de l'instance Supabase. **Elles ne sont pas déployables en l'état** — le
nom du responsable de traitement est légalement obligatoire.

---

## Ce qui a été corrigé

### Sécurité

| § | Correctif | Fichiers |
|---|---|---|
| 1.1 | Policies RLS + contraintes en base + test négatif documenté | `sql/01-rls-progress.sql` |
| 1.2 | Mot de passe oublié, définition du nouveau mot de passe, renvoi de l'email de confirmation | `useAuth.js`, `AuthScreen.jsx` |
| 1.3 | 13 messages d'erreur Supabase traduits, avec repli générique | `useAuth.js` |
| 1.4 | En-têtes de sécurité, CSP, `no-cache` sur `/sw.js`, cache immuable sur les assets hashés | `vercel.json` |
| 1.5 | 8 caractères minimum + jauge de robustesse informative | `AuthScreen.jsx` |
| 1.6 | Quota `localStorage` géré : en cas de saturation, le pack de contenu (reconstructible) est libéré pour sauver la progression (qui ne l'est pas), et l'utilisateur est averti | `state.js`, `App.jsx` |

### Bugs

| § | Bug | Correctif |
|---|---|---|
| 2.1 | **Toutes les dates en UTC** — une session à 00h30 à Paris était enregistrée la veille : série perdue le lendemain, ou gonflée dans l'autre sens | `store/dates.js`, source unique en heure locale. 8 tests. |
| 2.2 | **Semaine non paddée comparée comme une chaîne** — `"2026-W9" > "2026-W12"` : les compteurs hebdo régressaient à chaque synchro, ~83 % de l'année | Padding + `compareWeeks()` tolérant l'ancien format. 3 tests. |
| 2.3 | **Un RESET était ressuscité par l'autre appareil** — `Math.max(0, 4200)` = 4200, alors que la confirmation annonçait « irréversible » | `resetAt` horodaté + `resetWins()` dans `mergeStates`. 3 tests, dont le cas symétrique et le cas « activité postérieure au reset ». |
| 2.4 | **Jusqu'à 3 s de progression perdues à chaque fermeture** — debounce sans flush, alors que le geste normal sur mobile est « je finis mon quiz, je ferme » | `flush()` en `fetch(keepalive)` sur `visibilitychange` et `pagehide` |
| 2.5 | **Onboarding réimposé sur un nouvel appareil**, écrasant les réponses du premier | La porte d'onboarding n'est évaluée qu'après `progressLoaded` |
| 2.6 | **Le premier échec audio était définitif** — la promesse rejetée restait mémorisée, plus aucun son jusqu'au rechargement complet | `loadPromise` remis à `null` en cas d'échec + `resetAudio()` |
| 2.7 | **`Tone.start()` après un `await`** — la chaîne du geste était rompue, d'où le « il faut appuyer deux fois » sur iOS | `unlockAudio()` à appeler en tête du handler ; contexte démarré avant le chargement ; état `interrupted` traité |
| 2.8 | Le service worker renvoyait `undefined` à `respondWith()` → erreur réseau brute | Réponse 504 explicite, stratégie par type de ressource, 780 ko de JPEG sortis du precache, samples audio cachables |
| 2.9 | `levelFromXp(Infinity)` renvoyait **501** → grade maximum pour un état corrompu | Bornage + `sanitizeXp()`. 1 test sur 9 valeurs limites. |
| 2.10 | `saveState` appelé **dans** un updater React (invocable deux fois) **et** dans le reducer | Persistance déplacée dans un effet, une seule écriture |
| 2.11 | **Bouton retour Android = fermeture de la PWA** ; les 2 raccourcis du manifeste ne faisaient rien | Entrée d'historique par écran + `popstate` ; `?shortcut=` réellement lu |

### Performance

| § | Correctif |
|---|---|
| 3.1 | **Vrai code splitting.** `Promise.all([15 imports])` attendait toute l'app avant d'afficher quoi que ce soit. Désormais `React.lazy` par écran + préchargement au survol de l'onglet. **Tone.js sorti du chemin critique** (`import("tone")` dynamique) : il était téléchargé au démarrage même par quelqu'un qui ne jouerait jamais une note. `content.js` dans son propre chunk. |
| 3.2 | **Polices et icônes dans `<head>`.** Elles étaient chargées par `@import` dans un `<style>` injecté par React : requête partant après le montage, et `@import` est sérialisant. Résultat, un premier rendu **sans aucune icône** — y compris dans l'écran de chargement, qui en affichait une. Les deux écrans de chargement utilisent maintenant un indicateur CSS. |
| 3.3 | `100vh` → `100dvh` partout (8 occurrences) |
| 3.4 | Les badges se recalculaient à chaque action, en reparcourant 142 quiz et 36 exercices. Dépendances passées en compteurs scalaires. |
| 3.5 | Feuille de styles réelle avec variables CSS pilotées par `data-theme` |

### Accessibilité

| § | Correctif | Preuve |
|---|---|---|
| 6.1 | **Tous les contrastes corrigés.** Le thème sombre réutilisait les accents du thème clair (`blue` 2,98:1 · `purple` 2,97:1 · `danger` 2,88:1) ; `text3` était à 2,84:1 ; le blanc sur les CTA orange à 3,49:1. Chaque thème a maintenant ses propres accents et une variante `Ink` lisible comme texte. | `test/contrast.test.mjs` — 13 tests qui échouent si quelqu'un repasse sous AA |
| 6.2 | `:focus-visible` global. Deux `outline: none` sans remplacement rendaient la navigation clavier impraticable. | `index.css`, classe `.gr-focus` |
| 6.3 | `role="status"` + `aria-live` sur les toasts et les gains d'XP (un lecteur d'écran n'annonçait ni gain ni badge) ; `role="progressbar"` avec valeur ; `aria-current` sur la nav ; les cases du manche deviennent des boutons nommés (« Corde 5, case 3, Do ») navigables au clavier | `ui.jsx`, `App.jsx`, `Fretboard.jsx` |
| 5.5 | Échelle typographique avec plancher à 11 px. On trouvait du 8 px (numéros de case) et du 8,5 px en majuscules espacées (« LE CONSEIL DE GROPI »). | `tokens.js` (`T`), `Fretboard.jsx`, `Gropi.jsx` |

### UX mobile

| § | Correctif |
|---|---|
| 5.1 | **Cibles tactiles du manche : 36 × 28 → 42 × 44 px.** C'est l'interaction centrale du produit, et sur un manche, se tromper de corde d'une case c'est se tromper d'intervalle. Le mode « compact » ne descend plus sous 44 px de haut. Retour haptique à la sélection. |
| 5.2 | **Le manche indique qu'il défile.** La règle globale `*::-webkit-scrollbar { display: none }` masquait tout sur Safari et Chrome — un pseudo-élément qu'aucun style inline ne peut neutraliser. Classes `.gr-hscroll` (barre discrète mais visible) et `.gr-hscroll-wrap` (dégradés de bord). Le masquage ne s'applique plus qu'au défilement vertical. |
| 5.3 | Le bouton flottant Gropi est masqué pendant les sessions actives (quiz, révision, exercice, jam) — il pouvait recouvrir le bouton « Valider » — et le contenu réserve 24 px de plus en bas. |
| 5.4 | Sélecteur de thème en liste verticale : trois boutons de 127 px contenant icône + label + description ne tenaient pas. |
| 5.6 | Les deux `window.confirm` remplacés par `ConfirmDialog`. Le RESET exige de taper `EFFACER`, la suppression de compte `SUPPRIMER`. |

### Produit et pédagogie

| § | Correctif |
|---|---|
| **7.1** | **L'XP ne se farme plus.** `COMPLETE_EXERCISE` et `QUIZ_ANSWER` créditaient l'XP nominale à chaque répétition : répondre 50 fois à la même question rapportait 50 fois l'XP, et le niveau ne mesurait plus rien. Nouveau module `store/xp.js` : 1<sup>re</sup> réussite = XP pleine ; répétitions = 25 % borné à 15 XP (« XP d'entretien ») ; plafond 120 XP/jour tous types confondus ; pratique libre plafonnée à 3 sessions créditées/jour ; défi du jour idempotent. **Refaire un exercice reste récompensé — c'est le bon réflexe — mais ne fait plus monter le niveau artificiellement.** `xpPreview()` est pur, donc l'écran affiche exactement ce qui sera accordé. |
| **7.2** | **L'onboarding sert enfin à quelque chose.** `weakestModule`, `preferredModule`, `overallTier`, `timePerWeek` étaient stockés et lus par personne : 665 lignes de code et 12 questions obligatoires pour un effet nul. Désormais : `overallTier` **ouvre réellement des paliers** (A2 → 1, B1 → 2, B2 → 3) sans jamais cocher une leçon à la place de l'utilisateur ; `weakestModule` puis `preferredModule` passent en tête de l'ordre interne des paliers ; `timePerWeek` dimensionne la session du jour (6 / 12 / 18 items) et le quota de nouveaux items. Et le mot « adaptatif » a disparu des commentaires : la file était fixe, il fallait arrêter de la décrire autrement. |
| **7.3** | **L'improvisation est enfin évaluée.** Les 15 questions `q-impro-*` portaient `courseId: "harmony"` ou `"scales"` : le module comptait **zéro** question, donc son niveau était inféré par moyenne, le badge `skill_impro` ne reposait que sur 6 exercices, et l'écran Progrès affichait une maîtrise sans évaluation. C'était l'objectif n°1 du produit et le seul module non mesuré. Après retag : `neck 31 · scales 37 · harmony 42 · rhythm 17 · impro 15`, et les **5 modules** entrent dans le test de placement. Les modules testables sont maintenant déduits du contenu, plus codés en dur. |
| **7.4** | **Économie d'XP recalibrée.** Le niveau 30 exigeait 18 650 XP quand tout le contenu en contient 13 435 : le grade maximum était mathématiquement inatteignable. Nouvelle courbe `min(120 + (n-1)×40, 500)` → niveau 30 = 12 500 XP = **93 % du contenu**. Finir l'app, c'est devenir Star légendaire. Et le placement ne peut plus créditer 6 650 XP (la moitié du contenu) pour 12 QCM : plafond au niveau 8, soit 1 680 XP (12,5 %). |
| **7.5** | **Unités du Parcours rééquilibrées : 3 à 7 leçons au lieu de 4 à 15.** Le seuil de scission était à 15, donc il fallait enchaîner 15 leçons d'affilée pour ouvrir le palier 7 — exactement là où le décrochage est le plus probable. Coffre proportionnel (10 XP par leçon au lieu de 40 quelle que soit la taille), vérification proportionnelle et **bornée au stock de questions réellement disponible**. |
| **7.6** | **Révision espacée v2.** Intervalles fixes `[0,1,4,10,30]` et réponse binaire : une question difficile et une évidente suivaient la même trajectoire. Ajout d'un `ease` par item (1,3 → 2,7), d'une réponse graduée (`again`/`hard`/`good`/`easy`, l'ancien booléen reste accepté), d'un intervalle calculé plafonné à 180 jours, et surtout de la **séparation stricte « dus » / « nouveaux »** avec quota quotidien : avec 178 items éligibles, le compteur affichait « 99+ » en permanence, ce qui n'est pas un signal mais du bruit. |
| **7.7** | **Analytique branchée.** `analytics.js` était complet — taxonomie, file locale, SQL des policies en commentaire — et importé nulle part ; et les 8 `emit()` de l'onboarding relayaient vers une prop `onEvent` que `App.jsx` ne passait pas. Tout est connecté, `Do Not Track` est respecté, `pagehide` remplace `beforeunload` (ignoré sur iOS), et `stopAnalytics()` retire enfin les écouteurs. |

### RGPD

| § | Correctif |
|---|---|
| 8.1 | Suppression de compte réelle : Edge Function + fonction SQL `SECURITY DEFINER` avec `search_path` vide, cascades explicites, journal anonymisé. `RESET` ne supprimait ni la ligne `progress` ni le compte `auth.users`. |
| 8.2 | `public/cgu.html` et `public/confidentialite.html`, avec tableau des données, finalités, bases légales et durées de conservation. Liens depuis l'écran de connexion et les Réglages. |
| 8.3 | `.env.example` explique que la clé publiable est publique par conception et que la protection vient du RLS. Les CDN tiers restent documentés dans la politique de confidentialité en attendant l'auto-hébergement. |

### Architecture

| § | Correctif |
|---|---|
| 4.1 | `NETTOYAGE.md` liste les 1 637 lignes de code mort, avec la décision à trancher sur le moteur de jam (les deux options chiffrées) |
| 4.2 | **`npm test` existe**, avec 90 tests sur 6 fichiers, zéro dépendance à installer (`node --test`). Les seuls tests existants portaient sur le moteur de jam — c'est-à-dire sur le code qui ne tourne pas. |
| 4.3 | L'injection par mutation de module (`setDiagramRenderer`, `setFretboardLesson`…) est remplacée par `renderers.jsx` — dans son propre fichier, pour éviter le cycle App → écran → App |
| 4.4 | `tintColors` → `useTintColors` : la fonction appelait `useC()` sans commencer par `use`, donc ESLint ne pouvait pas vérifier ses conditions d'appel |
| 4.5 | Badges sensibles au thème (`useBadgeTints`), plus aucune couleur codée en dur |
| 4.6 | `package.json` : nom `groply`, version `1.0.0`, script `test` |

---

## Ce qu'il reste à faire (volontairement pas fait)

Ce sont des **choix de roadmap**, pas des corrections. Je ne les ai pas
tranchés à ta place.

1. **Auto-héberger les polices et remplacer la webfont Tabler par des SVG
   inline.** C'est le dernier gros gain de performance *et* la fin des deux
   tiers qui reçoivent l'IP de chaque visiteur. Environ 30 icônes à extraire.
2. **Trancher le moteur de jam** (`NETTOYAGE.md`).
3. **Évaluation réelle de l'improvisation.** Le retag débloque le badge et le
   placement, mais mesurer l'impro par QCM restera toujours indirect. La piste
   sérieuse : détection de hauteur au micro pour vérifier « joue les
   5 positions de la pentatonique Am à 70 BPM ». L'infrastructure audio est
   déjà là. C'est le vrai différenciateur du produit.
4. **Migrer les styles inline vers des classes CSS.** Les variables existent
   déjà dans `index.css` ; il reste à les consommer. Cela permettrait aussi de
   retirer `'unsafe-inline'` de la CSP.
5. **ARIA sur les écrans restants** (`ProgressScreen`, `ToolboxScreen`,
   `JamSession`, `EarTraining` — 0 attribut chacun).
6. **Compléter les mentions légales**, indispensable avant toute mise en ligne
   publique.
