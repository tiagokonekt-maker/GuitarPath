import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ── Ce qui change ─────────────────────────────────────────────────────────
// La configuration était celle du template Vite par défaut. Elle ne disait
// rien du découpage des chunks, alors que le poids du premier écran était le
// principal problème de performance de l'app (audit §3.1).
//
// Le vrai découpage vient de React.lazy dans App.jsx ; ici on isole en plus
// les grosses dépendances tierces, pour qu'une mise à jour du contenu
// n'invalide pas le cache de React ni celui de Tone.js.
export default defineConfig({
  plugins: [react()],

  build: {
    // Cible réaliste pour une PWA installée : tous les navigateurs visés
    // gèrent les modules ES et l'import dynamique.
    target: 'es2022',
    sourcemap: true,          // indispensable pour lire une pile d'erreur en prod
    cssCodeSplit: true,
    // Le seuil par défaut (500 ko) alerte sur Tone.js, qui est légitimement
    // volumineux et désormais chargé à la demande.
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            // Le contenu pédagogique (~137 ko gzip) dans son propre chunk :
            // il change souvent, le reste du code non.
            if (id.includes('/src/content')) return 'content';
            return undefined;
          }
          if (id.includes('tone')) return 'tone';
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('react-dom') || id.includes('/react/')) return 'react';
          return 'vendor';
        },
      },
    },
  },

  server: {
    port: 5173,
    // Le service worker n'est pas enregistré en dev (App.jsx vérifie PROD) :
    // il casserait le rechargement à chaud de Vite.
  },
});
