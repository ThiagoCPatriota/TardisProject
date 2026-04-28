-- T.A.R.D.I.S. Project — Loja Cósmica + Ranking Visual
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

create table if not exists public.shop_items (
    id text primary key,
    name text not null,
    category text not null,
    slot text not null,
    rarity text not null default 'common',
    price integer not null default 0 check (price >= 0),
    icon text not null default '✨',
    description text not null default '',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists public.user_inventory (
    user_id uuid not null references auth.users(id) on delete cascade,
    item_id text not null references public.shop_items(id) on delete cascade,
    purchased_at timestamptz not null default now(),
    primary key (user_id, item_id)
);

insert into public.shop_items (id, name, category, slot, rarity, price, icon, description) values
('crown_solar', 'Coroa Solar', 'head', 'head', 'rare', 120, '☀️', 'Uma coroa brilhante para exploradores que carregam energia de estrela.'),
('helmet_mars', 'Capacete de Marte', 'head', 'head', 'uncommon', 80, '🪐', 'Capacete vermelho inspirado nas missões marcianas.'),
('visor_nebula', 'Óculos Nebulosa', 'head', 'head', 'epic', 180, '🕶️', 'Lentes de navegação para enxergar rotas cósmicas invisíveis.'),
('scientist_coat', 'Traje de Cientista Cósmico', 'outfit', 'outfit', 'uncommon', 95, '🥼', 'Um jaleco espacial para quem estuda o universo com curiosidade.'),
('timelord_cape', 'Capa de Time Lord', 'outfit', 'outfit', 'legendary', 320, '🧥', 'Uma capa lendária para viajantes que parecem conhecer todos os tempos.'),
('sonic_screwdriver', 'Chave de Fenda Sônica', 'accessory', 'accessory', 'epic', 220, '🪛', 'Uma ferramenta elegante para investigar mistérios da galáxia.'),
('saturn_badge', 'Insígnia de Saturno', 'accessory', 'accessory', 'rare', 140, '🪙', 'Uma insígnia orbital para mostrar respeito aos anéis de Saturno.'),
('galactic_aura', 'Aura Galáctica', 'aura', 'aura', 'epic', 260, '✨', 'Um brilho ao redor do explorador, como poeira de estrelas.'),
('aurora_aura', 'Aura de Aurora', 'aura', 'aura', 'rare', 155, '🌌', 'Um brilho suave inspirado nas luzes das atmosferas planetárias.'),
('voyager_frame', 'Moldura da Voyager', 'frame', 'frame', 'rare', 170, '🛰️', 'Uma moldura dourada para exploradores que seguem rotas históricas.'),
('blue_nebula_bg', 'Fundo Nebulosa Azul', 'frame', 'frame', 'uncommon', 90, '🔷', 'Um fundo azulado para destacar seu perfil no painel de exploradores.'),
('title_doctor_companion', 'Título: Companheiro do Doutor', 'title', 'title', 'legendary', 300, '🏷️', 'Um título especial para quem acompanha aventuras pelo tempo e espaço.')
on conflict (id) do update set
    name = excluded.name,
    category = excluded.category,
    slot = excluded.slot,
    rarity = excluded.rarity,
    price = excluded.price,
    icon = excluded.icon,
    description = excluded.description,
    is_active = true;

alter table public.profiles enable row level security;
alter table public.shop_items enable row level security;
alter table public.user_inventory enable row level security;

drop policy if exists "Exploradores veem perfis públicos" on public.profiles;
drop policy if exists "Exploradores criam seu perfil" on public.profiles;
drop policy if exists "Exploradores atualizam seu perfil" on public.profiles;
drop policy if exists "Todos veem itens ativos da loja" on public.shop_items;
drop policy if exists "Exploradores veem seu inventário" on public.user_inventory;
drop policy if exists "Exploradores compram itens" on public.user_inventory;

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

create policy "Todos veem itens ativos da loja"
on public.shop_items
for select
to authenticated
using (is_active = true);

create policy "Exploradores veem seu inventário"
on public.user_inventory
for select
to authenticated
using (auth.uid() = user_id);

create policy "Exploradores compram itens"
on public.user_inventory
for insert
to authenticated
with check (auth.uid() = user_id);

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
    select
        row_number() over (order by p.exploration_points desc, coalesce(a.unlocked_count, 0) desc, p.updated_at asc) as rank,
        p.user_id,
        p.explorer_name,
        p.exploration_points,
        p.star_fragments,
        coalesce(a.unlocked_count, 0) as unlocked_count,
        a.last_unlock_at,
        p.avatar,
        p.equipped_cosmetics
    from public.profiles p
    left join (
        select
            ua.user_id,
            count(*) filter (where ua.unlocked_at is not null) as unlocked_count,
            max(ua.unlocked_at) as last_unlock_at
        from public.user_achievements ua
        group by ua.user_id
    ) a on a.user_id = p.user_id
    where p.exploration_points > 0 or coalesce(a.unlocked_count, 0) > 0
    order by p.exploration_points desc, coalesce(a.unlocked_count, 0) desc, p.updated_at asc
    limit limit_count;
$$;

grant execute on function public.get_explorer_ranking(integer) to authenticated;
