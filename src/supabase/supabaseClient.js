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
