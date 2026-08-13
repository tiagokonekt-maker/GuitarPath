-- ═══════════════════════════════════════════════════════════════════════════
-- Groply — 02-delete-account.sql
-- Droit à l'effacement (RGPD art. 17).
--
-- Le problème : supprimer un utilisateur de `auth.users` exige des droits que
-- le client n'a pas — et ne doit surtout pas avoir. La clé `service_role`
-- contourne tout le RLS : elle ne doit JAMAIS se trouver dans le navigateur.
--
-- Deux mises en œuvre possibles. La fonction SQL ci-dessous est la plus
-- simple ; l'Edge Function (fichier voisin) est celle qu'appelle le client
-- via supabase.functions.invoke('delete-account').
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Option A : fonction SQL SECURITY DEFINER ──────────────────────────────
-- L'utilisateur appelle une fonction qui ne peut supprimer QUE son propre
-- compte. Aucun secret ne circule côté client.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
-- `set search_path = ''` : sans ça, une fonction SECURITY DEFINER peut être
-- détournée en plaçant un objet homonyme dans un schéma que l'appelant
-- contrôle. C'est l'erreur classique sur ce type de fonction.
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Aucune session authentifiée.';
  end if;

  -- La suppression dans auth.users déclenche les cascades (progress,
  -- analytics_events), mais on est explicite : si une table est ajoutée plus
  -- tard sans cascade, l'oubli se verra ici.
  delete from public.progress          where user_id = uid;
  delete from public.analytics_events  where user_id = uid;
  delete from auth.users               where id = uid;
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;

-- Appel depuis le client (alternative à l'Edge Function) :
--   await supabase.rpc('delete_own_account');


-- ── Journal des suppressions ──────────────────────────────────────────────
-- Conserver une trace MINIMALE et non identifiante permet de prouver qu'une
-- demande a bien été honorée, sans conserver de donnée personnelle : c'est
-- exactement l'équilibre attendu par le RGPD.
create table if not exists public.deletion_log (
  id         uuid primary key default gen_random_uuid(),
  -- Empreinte de l'identifiant, pas l'identifiant : irréversible.
  user_hash  text not null,
  deleted_at timestamptz not null default now()
);
alter table public.deletion_log enable row level security;
-- Aucune policy : table réservée au rôle de service.
revoke all on public.deletion_log from anon, authenticated;
