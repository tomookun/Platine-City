-- Contributions de la communauté, relues avant publication.
create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('emplacement', 'correction', 'autre')),
  category_id text,
  item_ref text check (char_length(item_ref) <= 80),
  message text not null check (char_length(message) between 10 and 1000),
  source_url text check (char_length(source_url) <= 300),
  pseudo text check (char_length(pseudo) <= 40),
  data_version text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  moderator_note text
);

create index if not exists contributions_status_idx on public.contributions (status, created_at desc);

-- Aucun accès public : seul le serveur (clé service_role) écrit et lit.
alter table public.contributions enable row level security;

-- Droits explicites : le public n'a rien, la clé serveur lit et écrit.
revoke all on public.contributions from anon, authenticated;
grant select, insert, update, delete on public.contributions to service_role;
