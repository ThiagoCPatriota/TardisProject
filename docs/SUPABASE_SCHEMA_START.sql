-- ==========================================================
-- T.A.R.D.I.S. — Supabase schema inicial para features futuras
-- Execute no SQL Editor do Supabase quando formos salvar conquistas/progresso.
-- Para login/cadastro básico, isto ainda não é obrigatório.
-- ==========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Em etapa futura, vamos criar tabelas como:
-- public.user_achievements
-- public.user_quiz_runs
-- public.user_progress
