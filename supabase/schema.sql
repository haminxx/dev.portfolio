-- Dev.portfolio base schema. Written by the site's server (secret key); RLS on, no public access.
create extension if not exists pgcrypto;

create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  auth_user_id text unique,            -- better-auth user id (null for anonymous consented visitors)
  anon_id text unique,                 -- first-party cookie id, set only after consent
  name text,
  email text,
  avatar_url text,
  is_owner boolean not null default false,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  visit_count integer not null default 0
);

create table if not exists public.visits (
  id bigint generated always as identity primary key,
  visitor_id uuid references public.visitors(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  path text,
  referrer text,
  ip inet,
  country text, region text, city text,
  latitude double precision, longitude double precision,
  timezone text,
  user_agent text, browser text, os text, device text,
  language text,
  screen text,
  utm jsonb
);
create index if not exists visits_occurred_at_idx on public.visits (occurred_at desc);
create index if not exists visits_visitor_idx on public.visits (visitor_id);

create table if not exists public.consent_events (
  id bigint generated always as identity primary key,
  visitor_id uuid references public.visitors(id) on delete cascade,
  anon_id text,
  granted boolean not null,
  categories jsonb,
  occurred_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  visitor_id uuid references public.visitors(id) on delete set null,
  name text, email text, message text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- keep visitor counters current
create or replace function public.touch_visitor() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.visitors set last_seen_at = new.occurred_at, visit_count = visit_count + 1
  where id = new.visitor_id;
  return new;
end $$;
drop trigger if exists visits_touch_visitor on public.visits;
create trigger visits_touch_visitor after insert on public.visits
  for each row execute function public.touch_visitor();

-- daily summary for the owner dashboard
create or replace view public.visit_daily with (security_invoker = true) as
select date_trunc('day', occurred_at) as day, count(*) as visits,
       count(distinct visitor_id) as unique_visitors
from public.visits group by 1 order by 1 desc;

-- RLS: on everywhere, no anon/authenticated policies => only the server's secret key can read/write
alter table public.visitors enable row level security;
alter table public.visits enable row level security;
alter table public.consent_events enable row level security;
alter table public.contact_messages enable row level security;
revoke all on public.visitors, public.visits, public.consent_events, public.contact_messages, public.visit_daily from anon, authenticated;

-- Realtime: stream new visits and messages to the owner dashboard
do $$ begin
  alter publication supabase_realtime add table public.visits;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.contact_messages;
exception when duplicate_object then null; end $$;
