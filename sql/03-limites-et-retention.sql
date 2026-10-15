-- ═══════════════════════════════════════════════════════════════════════════
-- Groply — 03-limites-et-retention.sql
-- À exécuter APRÈS 01-rls-progress.sql et 02-delete-account.sql (SQL Editor
-- du dashboard Supabase). Idempotent : peut être rejoué sans risque.
--
-- Ce que ce fichier ajoute :
--   1. des plafonds de taille sur les colonnes JSON écrites par le client ;
--   2. un horodatage `progress.updated_at` posé par l'horloge du SERVEUR ;
--   3. une limite de débit sur les insertions analytiques ;
--   4. la suppression automatique des événements analytiques après 13 mois,
--      durée annoncée dans la politique de confidentialité (§2).
--
-- Rappel : la clé publiable est publique. Tout ce que le client « promet »
-- (taille raisonnable, pas de rafale d'événements) n'engage que le client
-- honnête : seules les règles en base s'imposent à tout le monde.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── 1. Plafonds de taille ─────────────────────────────────────────────────
-- `pg_column_size` mesure la valeur telle que stockée (jsonb, éventuellement
-- compressée). 512 Ko pour une progression : une progression réelle pèse
-- quelques dizaines de Ko ; 4 Ko pour les props d'un événement : le client
-- n'envoie plus que quelques primitives (src/analyticsProps.js).
--
-- Pattern NOT VALID + VALIDATE : la contrainte s'applique immédiatement aux
-- nouvelles écritures sans verrouiller la table pendant le contrôle de
-- l'existant, contrôle fait ensuite par VALIDATE. Si VALIDATE échoue, c'est
-- qu'une ligne existante dépasse déjà la limite : la retrouver avec
--   select user_id, pg_column_size(data) from public.progress order by 2 desc limit 5;
-- Pour les événements analytiques, ce cas est traité d'office avant la
-- contrainte : l'ancien client recopiait l'action entière (historique de
-- révision compris) dans props. Les valeurs objet/tableau sont retirées des
-- props existantes, comme le fait désormais le client — minimisation
-- rétroactive de ce qui a déjà été collecté. Ce qui dépasserait encore est
-- remplacé par un marqueur.
alter table public.progress drop constraint if exists progress_data_taille;
alter table public.progress
  add constraint progress_data_taille check (pg_column_size(data) < 524288) not valid;
alter table public.progress validate constraint progress_data_taille;

-- (props non-objet d'abord : jsonb_each échouerait dessus)
update public.analytics_events set props = '{}'::jsonb where jsonb_typeof(props) <> 'object';

update public.analytics_events e
   set props = coalesce((
         select jsonb_object_agg(j.k, j.v)
         from jsonb_each(e.props) as j(k, v)
         where jsonb_typeof(j.v) in ('number', 'boolean')
            or (jsonb_typeof(j.v) = 'string' and char_length(j.v #>> '{}') <= 80)
       ), '{}'::jsonb)
 where exists (
         select 1 from jsonb_each(e.props) as j(k, v)
         where jsonb_typeof(j.v) in ('object', 'array', 'null')
            or (jsonb_typeof(j.v) = 'string' and char_length(j.v #>> '{}') > 80)
       );

update public.analytics_events
   set props = '{"_props_retirees": true}'::jsonb
 where pg_column_size(props) >= 4096;

alter table public.analytics_events drop constraint if exists analytics_props_taille;
alter table public.analytics_events
  add constraint analytics_props_taille check (pg_column_size(props) < 4096) not valid;
alter table public.analytics_events validate constraint analytics_props_taille;


-- ── 2. progress.updated_at posé par le serveur ────────────────────────────
-- Le client relit `updated_at` après chaque écriture et s'en sert comme jeton
-- de concurrence optimiste (« je n'écrase que si la ligne n'a pas bougé
-- depuis ma dernière lecture »). Ce jeton n'a de sens que s'il vient d'UNE
-- seule horloge : celle du serveur. Une valeur envoyée par le client (horloge
-- d'appareil décalée, ou forgée) est donc ignorée et remplacée par now().
create or replace function public.progress_horodater()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists progress_horodater on public.progress;
create trigger progress_horodater
  before insert or update on public.progress
  for each row execute function public.progress_horodater();


-- ── 3. Limite de débit des événements analytiques ─────────────────────────
-- Un utilisateur réel produit quelques dizaines d'événements par session ;
-- le client envoie par lots de 25. Au-delà de 300 événements en 10 minutes
-- pour un même compte, c'est un script : l'insertion est refusée.
--
-- SECURITY DEFINER : la policy RLS n'accorde aucun SELECT sur la table aux
-- utilisateurs, la fonction doit donc compter avec les droits de son
-- propriétaire. `set search_path = ''` + noms qualifiés : empêche le
-- détournement de la fonction par un objet homonyme (cf. 02).
-- Le comptage s'appuie sur l'index (user_id, created_at desc) créé en 01.
-- `created_at` est forcé à now() : sinon un client pourrait antidater ses
-- événements pour échapper à la fenêtre (ou à la purge des 13 mois).
--
-- Le refus lève une erreur (code 'P0001', réponse HTTP 400 côté PostgREST) :
-- le client la traite comme un rejet définitif et abandonne le lot, ce qui
-- est le comportement voulu (analytics = best-effort).
create or replace function public.analytics_limiter_debit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  recents integer;
begin
  new.created_at := now();
  if new.user_id is null then
    return new;   -- la policy d'insertion refuse déjà ce cas
  end if;
  select count(*) into recents
  from public.analytics_events
  where user_id = new.user_id
    and created_at > now() - interval '10 minutes';
  if recents >= 300 then
    raise exception 'Trop d''événements analytiques pour ce compte (300 / 10 min).'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

revoke all on function public.analytics_limiter_debit() from public, anon, authenticated;

drop trigger if exists analytics_limiter_debit on public.analytics_events;
create trigger analytics_limiter_debit
  before insert on public.analytics_events
  for each row execute function public.analytics_limiter_debit();


-- ── 4. Rétention : suppression après 13 mois ──────────────────────────────
-- Recommandation CNIL pour la mesure d'audience : 13 mois au plus. Tâche
-- quotidienne à 03:17 UTC (heure creuse, minute « non ronde » pour éviter
-- les pics).
--
-- Si `create extension` échoue (droits insuffisants), activer pg_cron dans
-- le dashboard : Database → Extensions → pg_cron → Enable, puis rejouer.
create extension if not exists pg_cron with schema pg_catalog;

-- Planification idempotente : on retire la tâche si elle existe, puis on la
-- recrée. (Les versions récentes de pg_cron remplacent déjà une tâche de même
-- nom, mais le retrait explicite ne dépend pas de la version installée.)
do $$
begin
  if exists (select 1 from cron.job where jobname = 'groply_purge_analytics_13_mois') then
    perform cron.unschedule('groply_purge_analytics_13_mois');
  end if;
end;
$$;

select cron.schedule(
  'groply_purge_analytics_13_mois',
  '17 3 * * *',
  $$delete from public.analytics_events where created_at < now() - interval '13 months'$$
);

-- Purge immédiate de l'existant (la tâche ne passera que cette nuit).
delete from public.analytics_events where created_at < now() - interval '13 months';


-- ── 5. Vérification ───────────────────────────────────────────────────────
-- Contraintes : les deux doivent apparaître avec convalidated = true.
select conrelid::regclass as table_, conname, convalidated
from pg_constraint
where conname in ('progress_data_taille', 'analytics_props_taille');

-- Déclencheurs en place.
select event_object_table as table_, trigger_name, action_timing, event_manipulation
from information_schema.triggers
where trigger_name in ('progress_horodater', 'analytics_limiter_debit')
order by 1, 2;

-- Tâche planifiée.
select jobid, jobname, schedule, command, active
from cron.job where jobname = 'groply_purge_analytics_13_mois';

-- Dernières exécutions (vide tant que la tâche n'a pas tourné).
select status, return_message, start_time
from cron.job_run_details
where jobid = (select jobid from cron.job where jobname = 'groply_purge_analytics_13_mois')
order by start_time desc limit 5;

-- Doit renvoyer 0 : plus aucun événement de plus de 13 mois.
select count(*) as evenements_trop_anciens
from public.analytics_events where created_at < now() - interval '13 months';
