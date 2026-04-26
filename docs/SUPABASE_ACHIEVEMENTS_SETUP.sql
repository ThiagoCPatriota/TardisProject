-- =============================================================
-- T.A.R.D.I.S. Project — Supabase Achievements Setup
-- Execute este SQL no Supabase em: SQL Editor -> New query -> Run
-- =============================================================

create table if not exists public.user_achievements (
    user_id uuid not null references auth.users(id) on delete cascade,
    achievement_id text not null,
    progress integer not null default 0 check (progress >= 0),
    unlocked_at timestamptz,
    meta jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

-- Remove policies antigas caso você rode este arquivo mais de uma vez.
drop policy if exists "Exploradores veem suas conquistas" on public.user_achievements;
drop policy if exists "Exploradores criam suas conquistas" on public.user_achievements;
drop policy if exists "Exploradores atualizam suas conquistas" on public.user_achievements;
drop policy if exists "Exploradores apagam suas conquistas" on public.user_achievements;

create policy "Exploradores veem suas conquistas"
on public.user_achievements
for select
to authenticated
using (auth.uid() = user_id);

create policy "Exploradores criam suas conquistas"
on public.user_achievements
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Exploradores atualizam suas conquistas"
on public.user_achievements
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Exploradores apagam suas conquistas"
on public.user_achievements
for delete
to authenticated
using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_user_achievements_updated_at on public.user_achievements;

create trigger set_user_achievements_updated_at
before update on public.user_achievements
for each row
execute function public.set_updated_at();
