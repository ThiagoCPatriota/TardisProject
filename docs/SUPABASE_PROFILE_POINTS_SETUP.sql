-- T.A.R.D.I.S. Project — Perfil, pontos e avatar base
-- Rode no Supabase SQL Editor. Seguro para executar mais de uma vez.

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    user_id uuid unique references auth.users(id) on delete cascade,
    explorer_name text not null default 'Explorador',
    exploration_points integer not null default 0 check (exploration_points >= 0),
    star_fragments integer not null default 0 check (star_fragments >= 0),
    avatar jsonb not null default '{"base":"explorer_01","skin":"tone_02","hair":"short_01","hairColor":"brown","suit":"basic_blue","accessory":null,"aura":null,"frame":null,"title":null}'::jsonb,
    equipped_cosmetics jsonb not null default '{"head":null,"outfit":null,"accessory":null,"aura":null,"frame":null,"title":null}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles
    add column if not exists user_id uuid references auth.users(id) on delete cascade,
    add column if not exists explorer_name text not null default 'Explorador',
    add column if not exists exploration_points integer not null default 0 check (exploration_points >= 0),
    add column if not exists star_fragments integer not null default 0 check (star_fragments >= 0),
    add column if not exists avatar jsonb not null default '{"base":"explorer_01","skin":"tone_02","hair":"short_01","hairColor":"brown","suit":"basic_blue","accessory":null,"aura":null,"frame":null,"title":null}'::jsonb,
    add column if not exists equipped_cosmetics jsonb not null default '{"head":null,"outfit":null,"accessory":null,"aura":null,"frame":null,"title":null}'::jsonb,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now();

update public.profiles
set user_id = id
where user_id is null;

create unique index if not exists profiles_user_id_key on public.profiles(user_id);

alter table public.profiles enable row level security;

drop policy if exists "Exploradores veem perfis públicos" on public.profiles;
drop policy if exists "Exploradores criam seu perfil" on public.profiles;
drop policy if exists "Exploradores atualizam seu perfil" on public.profiles;

-- O ranking pode ler dados não sensíveis. Não coloque e-mail nesta tabela.
create policy "Exploradores veem perfis públicos"
on public.profiles
for select
to authenticated
using (true);

create policy "Exploradores criam seu perfil"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id and auth.uid() = user_id);

create policy "Exploradores atualizam seu perfil"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();
