// Groply — Edge Function : suppression de compte (RGPD art. 17)
//
// Déployer avec :   supabase functions deploy delete-account
// Elle a besoin de SUPABASE_SERVICE_ROLE_KEY dans ses variables
// d'environnement — variable qui ne doit JAMAIS être préfixée VITE_ ni
// apparaître dans un fichier lu par Vite, sous peine de partir dans le bundle
// client et de contourner tout le RLS.
//
// Le client l'appelle via :
//   const { error } = await supabase.functions.invoke('delete-account', { body: {} });

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": Deno.env.get("GROPLY_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée." }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return json({ error: "Jeton d'authentification manquant." }, 401);
  }

  // 1. On identifie l'appelant avec SON jeton, jamais avec un paramètre du
  //    corps de la requête. Accepter un `user_id` fourni par le client
  //    laisserait n'importe qui supprimer le compte de n'importe qui.
  const anon = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: userErr } = await anon.auth.getUser();
  if (userErr || !user) return json({ error: "Session invalide ou expirée." }, 401);

  // 2. La suppression elle-même exige le rôle de service.
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  try {
    // Suppression explicite plutôt qu'à travers les seules cascades : si une
    // table est ajoutée plus tard sans `on delete cascade`, l'oubli est visible
    // ici plutôt que silencieux.
    await admin.from("progress").delete().eq("user_id", user.id);
    await admin.from("analytics_events").delete().eq("user_id", user.id);

    // Trace non identifiante, pour pouvoir prouver que la demande a été
    // honorée sans conserver de donnée personnelle.
    const empreinte = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(user.id + (Deno.env.get("GROPLY_HASH_SALT") ?? "")),
    );
    const hex = [...new Uint8Array(empreinte)].map(b => b.toString(16).padStart(2, "0")).join("");
    await admin.from("deletion_log").insert({ user_hash: hex });

    const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
    if (delErr) return json({ error: delErr.message }, 500);

    return json({ ok: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Erreur inconnue." }, 500);
  }
});
