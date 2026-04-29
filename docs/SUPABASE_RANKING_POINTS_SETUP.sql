-- ============================================
-- T.A.R.D.I.S. Project — Ranking por Pontos de Exploração
-- Execute no Supabase: SQL Editor → New query → Run
-- Seguro para executar mais de uma vez.
-- ============================================

-- Esta tabela espelha os pontos definidos no catálogo local de conquistas.
-- Ela permite que o ranking calcule Pontos de Exploração no banco, não apenas
-- quantidade de conquistas desbloqueadas.
create table if not exists public.achievement_rewards (
    achievement_id text primary key,
    points_reward integer not null default 0 check (points_reward >= 0),
    title text,
    updated_at timestamptz not null default now()
);

alter table public.achievement_rewards enable row level security;

drop policy if exists "Todos autenticados leem recompensas" on public.achievement_rewards;

create policy "Todos autenticados leem recompensas"
on public.achievement_rewards
for select
to authenticated
using (true);

insert into public.achievement_rewards (achievement_id, points_reward, title)
values
    ('primeiro-salto', 5, 'Primeiro Salto'),
    ('painel-de-bordo', 5, 'Painel de Bordo'),
    ('chamado-da-galaxia', 10, 'Chamado da Galáxia'),
    ('primeira-missao', 10, 'Primeira Missão'),
    ('primeiro-dossie-de-missao', 10, 'Primeiro Dossiê'),
    ('imagem-do-dia', 10, 'Imagem do Dia'),
    ('curioso-do-cosmos', 10, 'Curioso do Cosmos'),
    ('resposta-certeira', 10, 'Resposta Certeira'),
    ('acertos-5', 15, 'Memória de Time Lord'),
    ('acertos-10', 20, 'Mente Cósmica'),
    ('acertos-25', 35, 'Biblioteca Mental'),
    ('acertos-50', 60, 'Gênio da Galáxia'),
    ('perguntas-respondidas-10', 20, 'Investigador Atento'),
    ('perguntas-respondidas-50', 45, 'Tripulante de Perguntas'),
    ('questionario-celeste', 45, 'Questionário Celeste'),
    ('aprendiz-do-doutor', 20, 'Aprendiz do Doutor'),
    ('companheiro-da-tardis', 45, 'Companheiro da T.A.R.D.I.S.'),
    ('aventuras-completas-10', 80, 'Veterano do Vórtex'),
    ('desempenho-80', 35, 'Rota Estável'),
    ('desempenho-90', 60, 'Quase Perfeito'),
    ('rodadas-perfeitas-1', 70, 'Sem Perder o Pulso'),
    ('sequencia-5', 50, 'Raciocínio Regenerado'),
    ('primeiros-10-pontos', 10, 'Primeiros 10 Pontos'),
    ('pontos-acumulados-50', 20, 'Sinal no Radar'),
    ('pontos-acumulados-100', 40, 'Rota Brilhante'),
    ('pontos-acumulados-250', 60, 'Combustível Estelar'),
    ('pontos-acumulados-500', 90, 'Motor de Dobra'),
    ('pontos-acumulados-1000', 120, 'Constelação de Pontos'),
    ('pontos-acumulados-5000', 220, 'Lenda Numérica'),
    ('visitar-sun', 12, 'Sol no Radar'),
    ('visitar-mercury', 12, 'Mercúrio no Radar'),
    ('visitar-venus', 12, 'Vênus no Radar'),
    ('visitar-earth', 12, 'Terra no Radar'),
    ('visitar-mars', 12, 'Marte no Radar'),
    ('visitar-jupiter', 12, 'Júpiter no Radar'),
    ('visitar-saturn', 12, 'Saturno no Radar'),
    ('visitar-uranus', 12, 'Urano no Radar'),
    ('visitar-neptune', 12, 'Netuno no Radar'),
    ('turista-espacial', 25, 'Turista Espacial'),
    ('colecionador-cosmico', 45, 'Colecionador Cósmico'),
    ('mapa-celeste-completo', 90, 'Mapa Celeste Completo'),
    ('mundos-rochosos', 55, 'Quatro Mundos Rochosos'),
    ('gigantes-do-vazio', 75, 'Gigantes do Vazio'),
    ('rota-extrema', 110, 'Rota Extrema'),
    ('detalhes-sun', 14, 'Arquivo Sol'),
    ('detalhes-mercury', 14, 'Arquivo Mercúrio'),
    ('detalhes-venus', 14, 'Arquivo Vênus'),
    ('detalhes-earth', 14, 'Arquivo Terra'),
    ('detalhes-mars', 14, 'Arquivo Marte'),
    ('detalhes-jupiter', 14, 'Arquivo Júpiter'),
    ('detalhes-saturn', 14, 'Arquivo Saturno'),
    ('detalhes-uranus', 14, 'Arquivo Urano'),
    ('detalhes-neptune', 14, 'Arquivo Netuno'),
    ('bibliotecario-espacial', 95, 'Bibliotecário Espacial'),
    ('atlas-rochoso', 50, 'Atlas Rochoso'),
    ('primeira-missao-sun', 18, 'Dossiê de Sol'),
    ('primeira-missao-mercury', 18, 'Dossiê de Mercúrio'),
    ('primeira-missao-venus', 18, 'Dossiê de Vênus'),
    ('primeira-missao-earth', 18, 'Dossiê de Terra'),
    ('primeira-missao-mars', 18, 'Dossiê de Marte'),
    ('primeira-missao-jupiter', 18, 'Dossiê de Júpiter'),
    ('primeira-missao-saturn', 18, 'Dossiê de Saturno'),
    ('primeira-missao-uranus', 18, 'Dossiê de Urano'),
    ('primeira-missao-neptune', 18, 'Dossiê de Netuno'),
    ('missoes-unicas-5', 35, 'Cinco Dossiês'),
    ('missoes-unicas-10', 55, 'Mesa de Controle da NASA'),
    ('missoes-unicas-20', 90, 'Arquivo Interplanetário'),
    ('arquivo-sol-completo', 65, 'Arquivo Solar'),
    ('arquivo-marte-completo', 85, 'O Chamado de Marte'),
    ('arquivo-saturno-completo', 85, 'Ecos de Cassini'),
    ('rota-voyager', 120, 'Rota da Voyager'),
    ('missao-terra-apollo-11', 45, 'Pegadas na Lua'),
    ('dias-ativos-2', 15, 'Voltei para a Nave'),
    ('dias-ativos-7', 60, 'Semana no Vórtex'),
    ('dias-ativos-15', 100, 'Companheiro Persistente'),
    ('dias-ativos-30', 200, 'Guardião da T.A.R.D.I.S.'),
    ('companheiro-do-doutor-dias', 100, 'Companheiro do Doutor'),
    ('conquistas-10', 30, 'Primeira Prateleira'),
    ('conquistas-25', 70, 'Galeria de Insígnias'),
    ('explorador-equilibrado', 120, 'Explorador Equilibrado')
on conflict (achievement_id) do update set
    points_reward = excluded.points_reward,
    title = excluded.title,
    updated_at = now();

-- Garante que profiles possui os campos usados por ranking/loja futura.
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    user_id uuid unique references auth.users(id) on delete cascade,
    explorer_name text not null default 'Explorador',
    exploration_points integer not null default 0 check (exploration_points >= 0),
    star_fragments integer not null default 0 check (star_fragments >= 0),
    avatar jsonb not null default '{}'::jsonb,
    equipped_cosmetics jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.profiles
    add column if not exists user_id uuid references auth.users(id) on delete cascade,
    add column if not exists explorer_name text not null default 'Explorador',
    add column if not exists exploration_points integer not null default 0 check (exploration_points >= 0),
    add column if not exists star_fragments integer not null default 0 check (star_fragments >= 0),
    add column if not exists avatar jsonb not null default '{}'::jsonb,
    add column if not exists equipped_cosmetics jsonb not null default '{}'::jsonb,
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
drop policy if exists "Exploradores criam o próprio perfil" on public.profiles;
drop policy if exists "Exploradores atualizam o próprio perfil" on public.profiles;

create policy "Exploradores veem perfis públicos"
on public.profiles
for select
to authenticated
using (true);

create policy "Exploradores criam seu perfil"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id and (user_id is null or auth.uid() = user_id));

create policy "Exploradores atualizam seu perfil"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id and (user_id is null or auth.uid() = user_id));

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

-- Função nova/atualizada do ranking.
-- Critério principal: Pontos de Exploração.
-- Critério de desempate: quantidade de conquistas, depois data da última conquista.
-- Fragmentos Estelares NÃO entram no ranking; são moeda gastável da Loja Cósmica.
create or replace function public.get_explorer_ranking(limit_count integer default 50)
returns table (
    rank bigint,
    user_id uuid,
    explorer_name text,
    exploration_points integer,
    star_fragments integer,
    unlocked_count bigint,
    last_unlock_at timestamptz,
    avatar jsonb,
    equipped_cosmetics jsonb
)
language sql
security definer
set search_path = public
as $$
    with achievement_totals as (
        select
            ua.user_id,
            count(*) filter (where ua.unlocked_at is not null)::bigint as unlocked_count,
            max(ua.unlocked_at) as last_unlock_at,
            coalesce(sum(coalesce(ar.points_reward, 0)) filter (where ua.unlocked_at is not null), 0)::integer as earned_points
        from public.user_achievements ua
        left join public.achievement_rewards ar on ar.achievement_id = ua.achievement_id
        group by ua.user_id
    ), combined as (
        select
            coalesce(p.user_id, p.id, a.user_id) as user_id,
            coalesce(nullif(trim(p.explorer_name), ''), 'Explorador') as explorer_name,
            greatest(coalesce(p.exploration_points, 0), coalesce(a.earned_points, 0))::integer as exploration_points,
            coalesce(p.star_fragments, 0)::integer as star_fragments,
            coalesce(a.unlocked_count, 0)::bigint as unlocked_count,
            a.last_unlock_at,
            coalesce(p.avatar, '{}'::jsonb) as avatar,
            coalesce(p.equipped_cosmetics, '{}'::jsonb) as equipped_cosmetics,
            p.updated_at
        from public.profiles p
        full join achievement_totals a on a.user_id = coalesce(p.user_id, p.id)
    ), ranked as (
        select
            row_number() over (
                order by
                    combined.exploration_points desc,
                    combined.unlocked_count desc,
                    combined.last_unlock_at asc nulls last,
                    combined.user_id asc
            ) as rank,
            combined.*
        from combined
        where combined.user_id is not null
          and (combined.exploration_points > 0 or combined.unlocked_count > 0)
    )
    select
        ranked.rank,
        ranked.user_id,
        ranked.explorer_name,
        ranked.exploration_points,
        ranked.star_fragments,
        ranked.unlocked_count,
        ranked.last_unlock_at,
        ranked.avatar,
        ranked.equipped_cosmetics
    from ranked
    order by ranked.rank
    limit greatest(1, least(coalesce(limit_count, 50), 100));
$$;

revoke all on function public.get_explorer_ranking(integer) from public;
grant execute on function public.get_explorer_ranking(integer) to authenticated;
