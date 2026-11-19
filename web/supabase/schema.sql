-- Ballistic 12-Week Program: database schema.
-- Paste this whole file into Supabase > SQL Editor > New query, then click Run. Safe to run more than once.

-- Purchases come from Stripe. Only the server (secret key) writes here.
create table if not exists public.purchases (
  stripe_session_id text primary key,
  email text not null,
  name text,
  amount_cents integer,
  paid_at timestamptz not null default now(),
  login_link_used boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists purchases_email_idx on public.purchases (lower(email));

-- One row per member: their program settings.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text,
  version text check (version in ('functional', 'commercial', 'home')),
  start_date date,
  days smallint[],
  seen_milestones smallint[] not null default '{}',
  macros jsonb,
  updated_at timestamptz not null default now()
);

-- One row per logged session, keyed like w3d1 (week 3, day 1).
create table if not exists public.session_logs (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null check (key ~ '^w([1-9]|1[0-2])d[1-4]$'),
  data jsonb not null default '{}',
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- Row level security: members only ever see their own rows.
alter table public.purchases enable row level security;
alter table public.profiles enable row level security;
alter table public.session_logs enable row level security;

drop policy if exists "read own purchases" on public.purchases;
create policy "read own purchases" on public.purchases
  for select to authenticated
  using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "own logs" on public.session_logs;
create policy "own logs" on public.session_logs
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
