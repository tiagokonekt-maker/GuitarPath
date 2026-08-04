# Groply

Application d'apprentissage de la guitare — manche, gammes, harmonie, rythme et improvisation — gamifiée (XP, niveaux, grades, badges, séries) et pensée mobile-first.

## Stack

- React 19 + Vite
- Supabase (auth + synchronisation de la progression, avec repli hors-ligne sur `localStorage`)
- Tone.js pour l'audio (oreille musicale, lecture de gammes/accords)
- PWA installable (service worker, manifest)

## Développement

```bash
npm install
npm run dev       # serveur de dev Vite, http://localhost:5173
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build de production en local
npm run lint
```

Variables d'environnement requises dans `.env.local` (jamais commité, voir `.gitignore`) :

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

`VITE_SUPABASE_ANON_KEY` est la clé publique Supabase (`sb_publishable_...`), prévue pour être exposée côté client — la sécurité réelle des données repose sur les policies Row Level Security configurées côté Supabase, pas sur le secret de cette clé.

## Notes de déploiement (Vercel)

- Le dossier `.vercel/` est créé automatiquement en liant le projet à Vercel. Il ne doit jamais être commité (déjà couvert par `.gitignore`).
- `project.json` contient l'identifiant du projet Vercel (`projectId`) et celui de l'organisation/utilisateur propriétaire (`orgId`).

## Structure

```
src/
  App.jsx              point d'entrée, routing, auth, chargement du contenu
  main.jsx             montage React + error boundary de secours
  content.js           tout le contenu pédagogique (cours, quiz, exercices)
  diagrams.jsx         rendu des diagrammes de leçon (gammes, accords, rythme...)
  Fretboard.jsx         manche interactif (quiz tactile, explorateur, exercices)
  design/              design system (tokens, thème clair/sombre, icônes, mascotte Gropi)
  store/               logique métier pure (reducer, XP/niveaux, grades, badges, Parcours...)
  screens/             écrans de l'app
  supabase/             auth + synchronisation cloud
```
