-- ============================================
-- T.A.R.D.I.S. Project — Loja Cósmica
-- Execute no Supabase: SQL Editor → New query → Run
-- Seguro para executar mais de uma vez.
-- ============================================

-- 1) Garante que o perfil tem os campos da loja.
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    user_id uuid unique references auth.users(id) on delete cascade,
    explorer_name text not null default 'Explorador',
    exploration_points integer not null default 0 check (exploration_points >= 0),
    star_fragments integer not null default 0 check (star_fragments >= 0),
    avatar jsonb not null default '{}'::jsonb,
    equipped_cosmetics jsonb not null default '{}'::jsonb,
    owned_cosmetics jsonb not null default '[]'::jsonb,
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
    add column if not exists owned_cosmetics jsonb not null default '[]'::jsonb,
    add column if not exists created_at timestamptz not null default now(),
    add column if not exists updated_at timestamptz not null default now();

update public.profiles
set user_id = id
where user_id is null;

update public.profiles
set owned_cosmetics = coalesce(owned_cosmetics, '[]'::jsonb),
    equipped_cosmetics = coalesce(equipped_cosmetics, '{}'::jsonb)
where owned_cosmetics is null
   or equipped_cosmetics is null;

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

-- 2) Catálogo server-side da Loja Cósmica.
-- Observação v44.1: este bloco também corrige instalações em que public.shop_items
-- já existia de uma tentativa anterior, mas sem a coluna item_type.
create table if not exists public.shop_items (
    id text primary key,
    slot text not null default 'misc',
    item_type text not null default 'cosmetic',
    label text not null default 'Item Cósmico',
    description text,
    price integer not null default 0,
    rarity text not null default 'comum',
    icon text,
    metadata jsonb not null default '{}'::jsonb,
    is_active boolean not null default true,
    updated_at timestamptz not null default now()
);

alter table public.shop_items
    add column if not exists id text,
    add column if not exists slot text,
    add column if not exists item_type text,
    add column if not exists label text,
    add column if not exists description text,
    add column if not exists price integer,
    add column if not exists rarity text,
    add column if not exists icon text,
    add column if not exists metadata jsonb,
    add column if not exists is_active boolean,
    add column if not exists updated_at timestamptz;

update public.shop_items
set slot = coalesce(nullif(slot, ''), 'misc'),
    item_type = coalesce(nullif(item_type, ''), 'cosmetic'),
    label = coalesce(nullif(label, ''), coalesce(nullif(id, ''), 'Item Cósmico')),
    price = greatest(coalesce(price, 0), 0),
    rarity = coalesce(nullif(rarity, ''), 'comum'),
    metadata = coalesce(metadata, '{}'::jsonb),
    is_active = coalesce(is_active, true),
    updated_at = coalesce(updated_at, now());

alter table public.shop_items
    alter column slot set default 'misc',
    alter column item_type set default 'cosmetic',
    alter column label set default 'Item Cósmico',
    alter column price set default 0,
    alter column rarity set default 'comum',
    alter column metadata set default '{}'::jsonb,
    alter column is_active set default true,
    alter column updated_at set default now(),
    alter column slot set not null,
    alter column item_type set not null,
    alter column label set not null,
    alter column price set not null,
    alter column rarity set not null,
    alter column metadata set not null,
    alter column is_active set not null,
    alter column updated_at set not null;

create unique index if not exists shop_items_id_key on public.shop_items(id);

do $$
begin
    if not exists (
        select 1 from pg_constraint
        where conname = 'shop_items_price_non_negative'
          and conrelid = 'public.shop_items'::regclass
    ) then
        alter table public.shop_items
            add constraint shop_items_price_non_negative check (price >= 0) not valid;
        alter table public.shop_items validate constraint shop_items_price_non_negative;
    end if;
end $$;

alter table public.shop_items enable row level security;

drop policy if exists "Exploradores leem itens da loja" on public.shop_items;

create policy "Exploradores leem itens da loja"
on public.shop_items
for select
to authenticated
using (is_active = true);

insert into public.shop_items (id, slot, item_type, label, description, price, rarity, icon, metadata, is_active)
values
    ('titulo_novo_explorador', 'title', 'title', 'Novo Explorador', 'Título inicial para exploradores recém-chegados à T.A.R.D.I.S.', 0, 'comum', '🚀', '{}'::jsonb, true),
    ('titulo_cartografo_cosmico', 'title', 'title', 'Cartógrafo Cósmico', 'Para quem transforma descobertas em mapas do universo.', 120, 'incomum', '🗺️', '{}'::jsonb, true),
    ('titulo_guardiao_da_tardis', 'title', 'title', 'Guardião da T.A.R.D.I.S.', 'Um título raro para exploradores constantes.', 250, 'raro', '🛡️', '{}'::jsonb, true),
    ('titulo_piloto_do_vortice', 'title', 'title', 'Piloto do Vórtex', 'Mostre que você sabe navegar por rotas instáveis do espaço-tempo.', 360, 'épico', '🌀', '{}'::jsonb, true),
    ('titulo_mestre_do_vortex', 'title', 'title', 'Mestre do Vórtex', 'Para exploradores que dominam as rotas do espaço-tempo.', 500, 'lendário', '✨', '{}'::jsonb, true),
    ('head_cabelo_nebula_rosa', 'head', 'avatar', 'Cabelo Nebulosa', 'Um visual volumoso com brilho de nebulosa para seu explorador.', 90, 'incomum', '🌌', '{"avatar":{"top":"curly","hairColor":"f59797"}}'::jsonb, true),
    ('head_black_estelar', 'head', 'avatar', 'Black Estelar', 'Cabelo marcante para quem atravessa constelações com personalidade.', 110, 'incomum', '💫', '{"avatar":{"top":"fro","hairColor":"2c1b18"}}'::jsonb, true),
    ('head_chapeu_vortice', 'head', 'avatar', 'Chapéu do Vórtex', 'Um chapéu de expedição para missões pelo espaço-tempo.', 160, 'raro', '🎩', '{"avatar":{"top":"hat","hairColor":"4a312c"}}'::jsonb, true),
    ('head_gorro_tritao', 'head', 'avatar', 'Gorro de Tritão', 'Proteção estilosa para explorar as regiões geladas do Sistema Solar.', 140, 'raro', '🧢', '{"avatar":{"top":"winterHat1","hairColor":"e8e1e1"}}'::jsonb, true),
    ('acessorio_oculos_estelares', 'accessory', 'avatar', 'Óculos Estelares', 'Lentes para observar detalhes invisíveis das missões espaciais.', 80, 'comum', '🕶️', '{"avatar":{"accessories":"sunglasses"}}'::jsonb, true),
    ('acessorio_visor_sonico', 'accessory', 'avatar', 'Visor Sônico', 'Um acessório com cara de tecnologia Gallifreyana.', 130, 'raro', '🔭', '{"avatar":{"accessories":"round"}}'::jsonb, true),
    ('outfit_jaqueta_tardis', 'outfit', 'avatar', 'Jaqueta T.A.R.D.I.S.', 'Traje azul clássico para representar sua nave favorita.', 100, 'incomum', '🧥', '{"avatar":{"clothing":"blazerAndShirt","clothesColor":"25557c"}}'::jsonb, true),
    ('outfit_traje_aurora', 'outfit', 'avatar', 'Traje Aurora', 'Um traje claro e vibrante inspirado nas luzes planetárias.', 170, 'raro', '🌠', '{"avatar":{"clothing":"hoodie","clothesColor":"a7ffc4"}}'::jsonb, true),
    ('frame_azul_tardis', 'frame', 'frame', 'Borda Azul T.A.R.D.I.S.', 'Uma moldura limpa, azul e elegante para começar a personalização.', 70, 'comum', '🔷', '{"frameClass":"frame-tardis-blue"}'::jsonb, true),
    ('frame_aurora', 'frame', 'frame', 'Borda Aurora', 'Uma moldura luminosa para destacar seu avatar no perfil e ranking.', 180, 'raro', '🌈', '{"frameClass":"frame-aurora"}'::jsonb, true),
    ('frame_nebulosa', 'frame', 'frame', 'Borda Nebulosa', 'Camadas roxas e azuis para um perfil com presença cósmica.', 220, 'épico', '🟣', '{"frameClass":"frame-nebula"}'::jsonb, true),
    ('frame_solar', 'frame', 'frame', 'Borda Solar', 'Uma moldura dourada para exploradores que brilham no ranking.', 300, 'épico', '☀️', '{"frameClass":"frame-solar"}'::jsonb, true),
    ('frame_vortice', 'frame', 'frame', 'Borda do Vórtex', 'Moldura rara com energia de espaço-tempo para perfis lendários.', 420, 'lendário', '🌀', '{"frameClass":"frame-vortex"}'::jsonb, true)
on conflict (id) do update set
    slot = excluded.slot,
    item_type = excluded.item_type,
    label = excluded.label,
    description = excluded.description,
    price = excluded.price,
    rarity = excluded.rarity,
    icon = excluded.icon,
    metadata = excluded.metadata,
    is_active = excluded.is_active,
    updated_at = now();

-- 3) Funções seguras para comprar/equipar.
create or replace function public.ensure_shop_profile()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
    v_profile public.profiles;
begin
    if auth.uid() is null then
        raise exception 'Usuário não autenticado.' using errcode = '28000';
    end if;

    insert into public.profiles (id, user_id, explorer_name, owned_cosmetics, equipped_cosmetics)
    values (auth.uid(), auth.uid(), 'Explorador', '[]'::jsonb, '{}'::jsonb)
    on conflict (id) do nothing;

    select * into v_profile
    from public.profiles
    where id = auth.uid();

    return v_profile;
end;
$$;

create or replace function public.purchase_shop_item(target_item_id text)
returns table (
    id uuid,
    user_id uuid,
    explorer_name text,
    exploration_points integer,
    star_fragments integer,
    avatar jsonb,
    owned_cosmetics jsonb,
    equipped_cosmetics jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item public.shop_items;
    v_profile public.profiles;
    v_owned jsonb;
    v_next_owned jsonb;
begin
    if auth.uid() is null then
        raise exception 'Usuário não autenticado.' using errcode = '28000';
    end if;

    select * into v_item
    from public.shop_items
    where id = target_item_id and is_active = true;

    if not found then
        raise exception 'Item da loja não encontrado.' using errcode = '22023';
    end if;

    v_profile := public.ensure_shop_profile();
    v_owned := coalesce(v_profile.owned_cosmetics, '[]'::jsonb);

    if v_item.price <= 0 or (v_owned ? v_item.id) then
        v_next_owned := case when v_owned ? v_item.id then v_owned else v_owned || jsonb_build_array(v_item.id) end;
        update public.profiles p
        set owned_cosmetics = v_next_owned
        where p.id = auth.uid();
    else
        if coalesce(v_profile.star_fragments, 0) < v_item.price then
            raise exception 'Fragmentos Estelares insuficientes.' using errcode = '22023';
        end if;

        update public.profiles p
        set star_fragments = p.star_fragments - v_item.price,
            owned_cosmetics = v_owned || jsonb_build_array(v_item.id)
        where p.id = auth.uid();
    end if;

    return query
    select p.id, p.user_id, p.explorer_name, p.exploration_points, p.star_fragments, p.avatar, p.owned_cosmetics, p.equipped_cosmetics
    from public.profiles p
    where p.id = auth.uid();
end;
$$;

create or replace function public.equip_shop_item(target_slot text, target_item_id text default null)
returns table (
    id uuid,
    user_id uuid,
    explorer_name text,
    exploration_points integer,
    star_fragments integer,
    avatar jsonb,
    owned_cosmetics jsonb,
    equipped_cosmetics jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_item public.shop_items;
    v_profile public.profiles;
    v_owned jsonb;
begin
    if auth.uid() is null then
        raise exception 'Usuário não autenticado.' using errcode = '28000';
    end if;

    if target_slot is null or trim(target_slot) = '' then
        raise exception 'Slot de cosmético inválido.' using errcode = '22023';
    end if;

    v_profile := public.ensure_shop_profile();
    v_owned := coalesce(v_profile.owned_cosmetics, '[]'::jsonb);

    if target_item_id is null or trim(target_item_id) = '' then
        update public.profiles p
        set equipped_cosmetics = coalesce(p.equipped_cosmetics, '{}'::jsonb) - target_slot
        where p.id = auth.uid();
    else
        select * into v_item
        from public.shop_items
        where id = target_item_id and is_active = true;

        if not found then
            raise exception 'Item da loja não encontrado.' using errcode = '22023';
        end if;

        if v_item.slot <> target_slot then
            raise exception 'Esse item não pertence ao slot informado.' using errcode = '22023';
        end if;

        if v_item.price > 0 and not (v_owned ? v_item.id) then
            raise exception 'Compre o item antes de equipar.' using errcode = '22023';
        end if;

        if v_item.price <= 0 and not (v_owned ? v_item.id) then
            v_owned := v_owned || jsonb_build_array(v_item.id);
        end if;

        update public.profiles p
        set owned_cosmetics = v_owned,
            equipped_cosmetics = jsonb_set(coalesce(p.equipped_cosmetics, '{}'::jsonb), array[target_slot], to_jsonb(v_item.id), true)
        where p.id = auth.uid();
    end if;

    return query
    select p.id, p.user_id, p.explorer_name, p.exploration_points, p.star_fragments, p.avatar, p.owned_cosmetics, p.equipped_cosmetics
    from public.profiles p
    where p.id = auth.uid();
end;
$$;

revoke all on function public.ensure_shop_profile() from public;
revoke all on function public.purchase_shop_item(text) from public;
revoke all on function public.equip_shop_item(text, text) from public;

grant execute on function public.ensure_shop_profile() to authenticated;
grant execute on function public.purchase_shop_item(text) to authenticated;
grant execute on function public.equip_shop_item(text, text) to authenticated;
