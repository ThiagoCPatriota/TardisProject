-- ============================================
-- T.A.R.D.I.S. Project — Ranking dos Exploradores
-- Execute no Supabase: SQL Editor → New query → Run
-- Requer a tabela public.user_achievements criada na etapa de conquistas.
-- ============================================

-- Perfil público mínimo para mostrar Nome de Explorador no ranking.
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    explorer_name text not null default 'Explorador',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Exploradores veem perfis públicos" on public.profiles;
drop policy if exists "Exploradores criam o próprio perfil" on public.profiles;
drop policy if exists "Exploradores atualizam o próprio perfil" on public.profiles;

create policy "Exploradores veem perfis públicos"
on public.profiles
for select
to authenticated
using (true);

create policy "Exploradores criam o próprio perfil"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Exploradores atualizam o próprio perfil"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

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

-- Função segura para ranking agregado.
-- Ela retorna somente nome público, quantidade de conquistas e última conquista.
-- Não expõe e-mail, senha, metadata sensível nem progresso completo de outros usuários.
create or replace function public.get_achievement_ranking(limit_count integer default 50)
returns table (
    rank bigint,
    user_id uuid,
    explorer_name text,
    unlocked_count integer,
    last_unlock_at timestamptz
)
language sql
security definer
set search_path = public
as $$
    with totals as (
        select
            ua.user_id,
            count(*) filter (where ua.unlocked_at is not null)::integer as unlocked_count,
            max(ua.unlocked_at) as last_unlock_at
        from public.user_achievements ua
        group by ua.user_id
    ), ranked as (
        select
            row_number() over (
                order by totals.unlocked_count desc, totals.last_unlock_at asc nulls last, totals.user_id asc
            ) as rank,
            totals.user_id,
            coalesce(nullif(trim(p.explorer_name), ''), 'Explorador') as explorer_name,
            totals.unlocked_count,
            totals.last_unlock_at
        from totals
        left join public.profiles p on p.id = totals.user_id
        where totals.unlocked_count > 0
    )
    select
        ranked.rank,
        ranked.user_id,
        ranked.explorer_name,
        ranked.unlocked_count,
        ranked.last_unlock_at
    from ranked
    order by ranked.rank
    limit greatest(1, least(coalesce(limit_count, 50), 100));
$$;

revoke all on function public.get_achievement_ranking(integer) from public;
grant execute on function public.get_achievement_ranking(integer) to authenticated;
