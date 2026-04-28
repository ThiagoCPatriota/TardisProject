// ============================================
// T.A.R.D.I.S. — Shop Service
// Compra/equipa cosméticos usando Fragmentos Estelares.
// ============================================
import { supabase, getCurrentSession } from '../auth/authService.js';
import { DEFAULT_AVATAR, normalizeAvatar } from '../avatar/avatarData.js';
import { SHOP_ITEMS, getShopItemById } from '../data/shopItems.js';

const DEFAULT_COSMETICS = Object.freeze({
    head: null,
    outfit: null,
    accessory: null,
    aura: null,
    frame: null,
    title: null
});

const normalizeCosmetics = (cosmetics = {}) => ({
    ...DEFAULT_COSMETICS,
    ...(cosmetics && typeof cosmetics === 'object' ? cosmetics : {})
});

const cleanExplorerName = (name = '') => String(name).trim().replace(/\s+/g, ' ');

const getExplorerName = (user) => {
    const metadata = user?.user_metadata || {};
    return cleanExplorerName(
        metadata.explorer_name ||
        metadata.display_name ||
        metadata.full_name ||
        ''
    ) || 'Explorador';
};

const emitShopUpdate = (detail = {}) => {
    window.dispatchEvent(new CustomEvent('tardis:shop-updated', { detail }));
    window.dispatchEvent(new CustomEvent('tardis:profile-points-updated', {
        detail: {
            explorationPoints: detail.profile?.exploration_points,
            starFragments: detail.profile?.star_fragments,
            avatar: detail.profile?.avatar,
            equippedCosmetics: detail.profile?.equipped_cosmetics
        }
    }));
};

export const getDefaultCosmetics = () => ({ ...DEFAULT_COSMETICS });

export const ensureShopProfile = async (session) => {
    if (!supabase || !session?.user) return null;

    const metadataAvatar = session.user.user_metadata?.avatar
        ? normalizeAvatar(session.user.user_metadata.avatar)
        : DEFAULT_AVATAR;

    const { data: existingProfile, error: readError } = await supabase
        .from('profiles')
        .select('id, user_id, explorer_name, exploration_points, star_fragments, avatar, equipped_cosmetics')
        .eq('id', session.user.id)
        .maybeSingle();

    if (readError) throw readError;

    const profile = {
        id: session.user.id,
        user_id: session.user.id,
        explorer_name: getExplorerName(session.user),
        exploration_points: Number(existingProfile?.exploration_points || 0),
        star_fragments: Number(existingProfile?.star_fragments || 0),
        avatar: existingProfile?.avatar ? normalizeAvatar(existingProfile.avatar) : metadataAvatar,
        equipped_cosmetics: normalizeCosmetics(existingProfile?.equipped_cosmetics),
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id', ignoreDuplicates: false });

    if (error) throw error;

    const { data, error: selectError } = await supabase
        .from('profiles')
        .select('id, user_id, explorer_name, exploration_points, star_fragments, avatar, equipped_cosmetics')
        .eq('id', session.user.id)
        .maybeSingle();

    if (selectError) throw selectError;

    return {
        ...data,
        avatar: data?.avatar ? normalizeAvatar(data.avatar) : metadataAvatar,
        equipped_cosmetics: normalizeCosmetics(data?.equipped_cosmetics)
    };
};

export const getShopState = async () => {
    const session = await getCurrentSession();
    if (!session?.user) {
        return {
            session: null,
            profile: null,
            inventory: [],
            ownedIds: new Set(),
            error: null
        };
    }

    const profile = await ensureShopProfile(session);

    const { data: inventoryRows, error } = await supabase
        .from('user_inventory')
        .select('item_id, purchased_at')
        .eq('user_id', session.user.id);

    if (error) {
        throw new Error('Inventário não encontrado. Rode docs/SUPABASE_SHOP_RANKING_SETUP.sql no Supabase.');
    }

    const inventory = Array.isArray(inventoryRows) ? inventoryRows : [];
    const ownedIds = new Set(inventory.map((row) => row.item_id));

    return {
        session,
        profile,
        inventory,
        ownedIds,
        error: null
    };
};

export const isItemEquipped = (profile, item) => {
    if (!profile || !item) return false;
    const cosmetics = normalizeCosmetics(profile.equipped_cosmetics);
    return cosmetics[item.slot] === item.id;
};

export const purchaseShopItem = async (itemId) => {
    const item = getShopItemById(itemId);
    if (!item) throw new Error('Item não encontrado na Loja Cósmica.');

    const state = await getShopState();
    const { session, profile, ownedIds } = state;

    if (!session?.user || !profile) throw new Error('Entre na sua conta para comprar cosméticos.');

    if (ownedIds.has(item.id)) {
        return equipCosmetic(item.id);
    }

    const balance = Number(profile.star_fragments || 0);
    if (balance < item.price) {
        throw new Error(`Fragmentos Estelares insuficientes. Faltam ${item.price - balance}.`);
    }

    const nextBalance = balance - item.price;

    const { error: insertError } = await supabase
        .from('user_inventory')
        .insert({
            user_id: session.user.id,
            item_id: item.id
        });

    if (insertError && !String(insertError.message || '').toLowerCase().includes('duplicate')) {
        throw insertError;
    }

    const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
            star_fragments: nextBalance,
            updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id)
        .select('id, user_id, explorer_name, exploration_points, star_fragments, avatar, equipped_cosmetics')
        .maybeSingle();

    if (updateError) throw updateError;

    const nextProfile = {
        ...data,
        avatar: data?.avatar ? normalizeAvatar(data.avatar) : DEFAULT_AVATAR,
        equipped_cosmetics: normalizeCosmetics(data?.equipped_cosmetics)
    };

    emitShopUpdate({ type: 'purchase', item, profile: nextProfile });

    return {
        item,
        profile: nextProfile
    };
};

export const equipCosmetic = async (itemId) => {
    const item = getShopItemById(itemId);
    if (!item) throw new Error('Item não encontrado.');

    const state = await getShopState();
    const { session, profile, ownedIds } = state;

    if (!session?.user || !profile) throw new Error('Entre na sua conta para equipar cosméticos.');
    if (!ownedIds.has(item.id)) throw new Error('Compre este cosmético antes de equipar.');

    const nextCosmetics = normalizeCosmetics({
        ...profile.equipped_cosmetics,
        [item.slot]: isItemEquipped(profile, item) ? null : item.id
    });

    const { data, error } = await supabase
        .from('profiles')
        .update({
            equipped_cosmetics: nextCosmetics,
            updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id)
        .select('id, user_id, explorer_name, exploration_points, star_fragments, avatar, equipped_cosmetics')
        .maybeSingle();

    if (error) throw error;

    const nextProfile = {
        ...data,
        avatar: data?.avatar ? normalizeAvatar(data.avatar) : DEFAULT_AVATAR,
        equipped_cosmetics: normalizeCosmetics(data?.equipped_cosmetics)
    };

    emitShopUpdate({ type: 'equip', item, profile: nextProfile });

    return {
        item,
        profile: nextProfile
    };
};

export const getEquippedItems = (cosmetics = {}) => {
    const normalized = normalizeCosmetics(cosmetics);
    return Object.values(normalized)
        .filter(Boolean)
        .map((itemId) => SHOP_ITEMS.find((item) => item.id === itemId))
        .filter(Boolean);
};
