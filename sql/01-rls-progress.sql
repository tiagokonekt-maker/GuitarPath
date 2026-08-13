-- ═══════════════════════════════════════════════════════════════════════════
-- Groply — 01-rls-progress.sql
-- À EXÉCUTER AVANT TOUTE MISE EN PRODUCTION (SQL Editor du dashboard Supabase)
--
-- Pourquoi c'est le point n°1 de l'audit : le client envoie `user_id` depuis le
-- navigateur (useProgress.js). La clé publiable est publique par conception et
-- se trouve dans le bundle JavaScript de tous les visiteurs. Ce qui empêche
-- n'importe qui de lire et d'écraser la progression de tout le monde, ce n'est
-- donc PAS le secret de la clé : c'est uniquement le Row Level Security.
--
-- Les tables créées par SQL ou par migration ont le RLS DÉSACTIVÉ par défaut.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 0. Diagnostic : quelles tables sont exposées ? ────────────────────────
-- Toute ligne avec rowsecurity = false est lisible ET modifiable par
-- quiconque possède la clé publiable.
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by rowsecurity, tablename;


-- ── 1. Table de progression ───────────────────────────────────────────────
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  xp         integer not null default 0,
  level      integer not null default 1,
  streak     integer not null default 0,
  data       jsonb   not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  -- Garde-fous en base : le client peut être modifié par son propriétaire,
  -- la base non. Un XP négatif ou absurde est refusé côté serveur.
  constraint progress_xp_sain    check (xp >= 0 and xp <= 10000000),
  constraint progress_level_sain check (level >= 1 and level <= 60)
);

-- `on delete cascade` sur la clé étrangère : supprimer le compte auth
-- supprime automatiquement la ligne de progression. Nécessaire au droit à
-- l'effacement (RGPD art. 17) — voir 02-delete-account.sql.

alter table public.progress enable row level security;

-- Repartir de zéro sur les policies : l'opération est idempotente, on peut
-- rejouer ce fichier sans risque.
drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;

-- Chaque utilisateur ne voit et ne touche QUE sa propre ligne.
-- `(select auth.uid())` plutôt que `auth.uid()` : Postgres peut alors
-- évaluer la fonction une seule fois par requête au lieu d'une fois par
-- ligne, ce qui change tout dès que la table grossit.
create policy "progress_select_own" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "progress_insert_own" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "progress_update_own" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);   -- interdit de « donner » sa ligne

create policy "progress_delete_own" on public.progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Le rôle anonyme n'a rien à faire ici : la progression est nominative.
revoke all on public.progress from anon;
grant select, insert, update, delete on public.progress to authenticated;


-- ── 2. Événements analytiques ─────────────────────────────────────────────
create table if not exists public.analytics_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  event      text not null,
  props      jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint analytics_event_court check (char_length(event) <= 120)
);

create index if not exists analytics_events_user_created_idx
  on public.analytics_events (user_id, created_at desc);
create index if not exists analytics_events_event_created_idx
  on public.analytics_events (event, created_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics_insert_own" on public.analytics_events;

-- Écriture de ses propres événements uniquement. AUCUNE policy de lecture :
-- le client ne relit jamais les événements, l'analyse se fait via le SQL
-- Editor, qui utilise le rôle de service.
create policy "analytics_insert_own" on public.analytics_events
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.analytics_events from anon;
grant insert on public.analytics_events to authenticated;


-- ── 3. Vérification ───────────────────────────────────────────────────────
-- Doit renvoyer rowsecurity = true pour les deux tables.
select tablename, rowsecurity from pg_tables
where schemaname = 'public' and tablename in ('progress', 'analytics_events');

-- Et lister les policies effectivement en place.
select tablename, policyname, cmd, roles
from pg_policies where schemaname = 'public'
order by tablename, policyname;


-- ── 4. TEST NÉGATIF — à faire à la main, il est indispensable ─────────────
-- Voir la policy en place ne prouve pas qu'elle protège. Depuis un terminal,
-- avec le jeton d'accès du compte B et l'UUID du compte A :
--
--   curl -i "https://<projet>.supabase.co/rest/v1/progress?user_id=eq.<uuid_de_A>" \
--     -H "apikey: <cle_publiable>" \
--     -H "Authorization: Bearer <jwt_du_compte_B>"
--   → doit renvoyer  []   (et non les données de A)
--
--   curl -i -X PATCH "https://<projet>.supabase.co/rest/v1/progress?user_id=eq.<uuid_de_A>" \
--     -H "apikey: <cle_publiable>" \
--     -H "Authorization: Bearer <jwt_du_compte_B>" \
--     -H "Content-Type: application/json" -d '{"xp": 999999}'
--   → doit renvoyer 0 ligne modifiée
--
-- Et sans aucun jeton :
--   curl -i "https://<projet>.supabase.co/rest/v1/progress?select=*" \
--     -H "apikey: <cle_publiable>"
--   → doit renvoyer []  (un tableau peuplé = la table est publique)
