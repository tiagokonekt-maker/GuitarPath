// Groply — Edge Function : suppression de compte (RGPD art. 17)
//
// Emplacement : supabase/functions/delete-account/ (disposition par défaut
// de la CLI Supabase). Déployer depuis la RACINE du dépôt avec :
//
//   supabase functions deploy delete-account --project-ref <ref>
//   supabase secrets set GROPLY_HASH_SALT=<chaîne aléatoire longue> \
//                        GROPLY_ORIGIN=https://groply.fr,https://<projet>.vercel.app
//
// Variables d'environnement :
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
//       fournies automatiquement par Supabase. SUPABASE_SERVICE_ROLE_KEY ne
//       doit JAMAIS être préfixée VITE_ ni apparaître dans un fichier lu par
//       Vite, sous peine de partir dans le bundle client et de contourner
//       tout le RLS.
//   GROPLY_HASH_SALT (OBLIGATOIRE)
//       sel de l'empreinte écrite dans deletion_log. Sans sel, l'empreinte
//       d'un UUID se recalcule à partir de l'UUID : la trace redeviendrait
//       une donnée personnelle. La fonction refuse de tourner sans lui.
//       Ne jamais le changer ensuite (les anciennes empreintes deviendraient
//       invérifiables).
//   GROPLY_ORIGIN (OBLIGATOIRE pour un appel depuis le navigateur)
//       liste d'origines autorisées, séparées par des virgules, sans « / »
//       final. L'en-tête CORS ne renvoie que l'origine de la requête si elle
//       figure dans la liste ; sinon, aucune autorisation CORS (le navigateur
//       bloque l'appel) et 403. Jamais de « * » : une route qui supprime un
//       compte n'a pas à être appelable depuis n'importe quel site.
//
// Le client l'appelle via :
//   const { error } = await supabase.functions.invoke('delete-account', { body: {} });
//
// Alternative sans Edge Function : la fonction SQL delete_own_account()
// de sql/02-delete-account.sql.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ORIGINES = (Deno.env.get("GROPLY_ORIGIN") ?? "")
  .split(",").map(o => o.trim().replace(/\/+$/, "")).filter(Boolean);

/** En-têtes CORS : l'origine n'est renvoyée que si elle est dans la liste. */
function cors(req: Request): Record<string, string> {
  const origine = req.headers.get("Origin") ?? "";
  const base: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (origine && ORIGINES.includes(origine)) base["Access-Control-Allow-Origin"] = origine;
  return base;
}

Deno.serve(async (req) => {
  const enTetes = cors(req);
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...enTetes, "Content-Type": "application/json" },
    });

  // Requête de navigateur depuis une origine non autorisée (ou GROPLY_ORIGIN
  // absent) : refus explicite. Sans en-tête Origin (curl, serveur), seul le
  // jeton fait foi, comme pour le reste de l'API.
  const origine = req.headers.get("Origin");
  if (origine && !enTetes["Access-Control-Allow-Origin"]) {
    return json({ error: "Origine non autorisée (voir GROPLY_ORIGIN)." }, 403);
  }
  if (req.method === "OPTIONS") return new Response("ok", { headers: enTetes });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

  // 0. Configuration vérifiée AVANT toute suppression : un compte à moitié
  //    supprimé est pire qu'une demande refusée proprement.
  const url = Deno.env.get("SUPABASE_URL");
  const cleAnon = Deno.env.get("SUPABASE_ANON_KEY");
  const cleService = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const sel = Deno.env.get("GROPLY_HASH_SALT");
  if (!url || !cleAnon || !cleService) {
    return json({ error: "Configuration serveur incomplète (variables Supabase absentes)." }, 500);
  }
  if (!sel) {
    return json({ error: "Configuration serveur incomplète : GROPLY_HASH_SALT n'est pas défini." }, 500);
  }

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return json({ error: "Jeton d'authentification manquant." }, 401);
  }

  // 1. On identifie l'appelant avec SON jeton (vérifié par le serveur d'auth
  //    via getUser), jamais avec un paramètre du corps de la requête.
  //    Accepter un `user_id` fourni par le client laisserait n'importe qui
  //    supprimer le compte de n'importe qui.
  const anon = createClient(url, cleAnon, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: { user }, error: userErr } = await anon.auth.getUser();
  if (userErr || !user) return json({ error: "Session invalide ou expirée." }, 401);

  // 2. La suppression elle-même exige le rôle de service.
  const admin = createClient(url, cleService, { auth: { persistSession: false } });

  // Chaque étape est vérifiée : supabase-js ne LÈVE pas d'exception sur une
  // erreur de requête, il la renvoie dans `{ error }`. Sans ce contrôle, un
  // échec (table renommée, RLS, réseau) était suivi d'un « ok: true ».
  const echec = (etape: string, message?: string) =>
    json({ error: `La suppression a échoué (${etape})${message ? ` : ${message}` : ""}. Aucune confirmation n'a été donnée ; tu peux réessayer.` }, 500);

  let traceId: string | null = null;
  const annulerTrace = async () => {
    if (traceId) await admin.from("deletion_log").delete().eq("id", traceId);
  };

  try {
    // Trace non identifiante, pour pouvoir prouver que la demande a été
    // honorée sans conserver de donnée personnelle. Écrite EN PREMIER puis
    // retirée si une étape suivante échoue : ainsi le journal ne mentionne
    // que des suppressions effectives, et une erreur sur ce journal ne
    // survient jamais après la suppression du compte.
    const empreinte = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(user.id + sel),
    );
    const hex = [...new Uint8Array(empreinte)].map(b => b.toString(16).padStart(2, "0")).join("");
    const { data: trace, error: logErr } = await admin
      .from("deletion_log").insert({ user_hash: hex }).select("id").single();
    if (logErr || !trace) return echec("journal", logErr?.message);
    traceId = trace.id;

    // Suppression explicite plutôt qu'à travers les seules cascades : si une
    // table est ajoutée plus tard sans `on delete cascade`, l'oubli est visible
    // ici plutôt que silencieux. Ces suppressions sont idempotentes : une
    // nouvelle tentative après un échec partiel est sans danger.
    const { error: progErr } = await admin.from("progress").delete().eq("user_id", user.id);
    if (progErr) { await annulerTrace(); return echec("progression", progErr.message); }

    const { error: evtErr } = await admin.from("analytics_events").delete().eq("user_id", user.id);
    if (evtErr) { await annulerTrace(); return echec("statistiques", evtErr.message); }

    const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
    if (delErr) { await annulerTrace(); return echec("compte", delErr.message); }

    return json({ ok: true });
  } catch (e) {
    try { await annulerTrace(); } catch { /* le message d'erreur principal prime */ }
    return echec("erreur inattendue", e instanceof Error ? e.message : undefined);
  }
});
