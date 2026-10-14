import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Échec explicite plutôt que des erreurs incompréhensibles plus tard :
// sans ces variables, `createClient` construit un client qui échoue à
// chaque appel, et le message est illisible.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Groply — VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont absents.\n" +
    "Crée un fichier .env.local à la racine (voir .env.example)."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // important pour PWA
    flowType: 'pkce',
  },
});

// ── Liens reçus par email (réinitialisation, confirmation) ────────────────
// Avec `detectSessionInUrl: false` + PKCE, Supabase ne lit pas lui-même le
// `?code=` du lien : sans cet échange explicite, cliquer sur « Réinitialiser
// mon mot de passe » ramenait sur l'écran de connexion sans session.
// Lancé une seule fois, au chargement du module (StrictMode exécute les
// effets deux fois, or un code PKCE est à usage unique).
// Résout `null` (pas de lien), `{ redirectType }` ou `{ erreur }`.
export const sessionDepuisUrl = (() => {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const erreurLien = url.searchParams.get('error_description') || url.searchParams.get('error');
  if (!code && !erreurLien) return Promise.resolve(null);

  // L'URL est nettoyée tout de suite : un rechargement ou un partage ne doit
  // pas rejouer un code déjà consommé.
  for (const k of ['code', 'error', 'error_code', 'error_description']) url.searchParams.delete(k);
  try { window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash); } catch { /* noop */ }

  if (!code) return Promise.resolve({ erreur: { message: erreurLien } });
  return supabase.auth.exchangeCodeForSession(code)
    .then(({ data, error }) => (error ? { erreur: error } : { redirectType: data?.redirectType ?? null }))
    .catch(erreur => ({ erreur }));
})();

// ── Jeton d'accès mis en cache ────────────────────────────────────────────
// Nécessaire pour la sauvegarde de dernière chance : au moment où la page se
// ferme, on ne peut plus attendre une promesse. `getSession()` est
// asynchrone, donc on garde le jeton courant sous la main.
let cachedToken = null;
supabase.auth.getSession().then(({ data }) => { cachedToken = data?.session?.access_token ?? null; }).catch(() => {});
supabase.auth.onAuthStateChange((_e, session) => { cachedToken = session?.access_token ?? null; });

export const getCachedAccessToken = () => cachedToken;
export const SUPABASE_REST = SUPABASE_URL ? `${SUPABASE_URL}/rest/v1` : '';
export const SUPABASE_KEY = SUPABASE_ANON_KEY;
