// ============================================
// T.A.R.D.I.S. — Cosmic Shop Items
// Catálogo oficial da Loja Cósmica.
// ============================================

const titleCase = (value = '') => String(value)
    .trim()
    .replace(/[\-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)(\p{L})/gu, (_match, space, letter) => `${space}${letter.toUpperCase()}`);

export const SHOP_CATEGORIES = Object.freeze([
    { id: 'all', label: 'Todos' },
    { id: 'avatar', label: 'Personagem' },
    { id: 'frame', label: 'Bordas' },
    { id: 'title', label: 'Títulos' },
    { id: 'owned', label: 'Inventário' }
]);

export const SHOP_SLOTS = Object.freeze({
    title: 'Título',
    frame: 'Borda do perfil',
    head: 'Cabelo / chapéu',
    accessory: 'Acessório',
    outfit: 'Traje'
});

export const SHOP_ITEMS = Object.freeze([
    {
        id: 'titulo_novo_explorador',
        type: 'title',
        slot: 'title',
        category: 'title',
        label: 'Novo Explorador',
        description: 'Título inicial para exploradores recém-chegados à T.A.R.D.I.S.',
        price: 0,
        rarity: 'comum',
        icon: '🚀'
    },
    {
        id: 'titulo_cartografo_cosmico',
        type: 'title',
        slot: 'title',
        category: 'title',
        label: 'Cartógrafo Cósmico',
        description: 'Para quem transforma descobertas em mapas do universo.',
        price: 120,
        rarity: 'incomum',
        icon: '🗺️'
    },
    {
        id: 'titulo_guardiao_da_tardis',
        type: 'title',
        slot: 'title',
        category: 'title',
        label: 'Guardião da T.A.R.D.I.S.',
        description: 'Um título raro para exploradores constantes.',
        price: 250,
        rarity: 'raro',
        icon: '🛡️'
    },
    {
        id: 'titulo_piloto_do_vortice',
        type: 'title',
        slot: 'title',
        category: 'title',
        label: 'Companheiro do Doutor',
        description: 'Para quem topa atravessar o tempo e o espaço ao lado do Doutor.',
        price: 360,
        rarity: 'épico',
        icon: '🌀'
    },
    {
        id: 'titulo_mestre_do_vortex',
        type: 'title',
        slot: 'title',
        category: 'title',
        label: 'O Doutor',
        description: 'Título lendário para quem transforma cada jornada em uma aventura pelo espaço-tempo.',
        price: 500,
        rarity: 'lendário',
        icon: '✨'
    },
    {
        id: 'head_cabelo_nebula_rosa',
        type: 'avatar',
        slot: 'head',
        category: 'avatar',
        label: 'Cabelo Nebulosa',
        description: 'Um visual volumoso com brilho de nebulosa para seu explorador.',
        price: 90,
        rarity: 'incomum',
        icon: '🌌',
        effect: { avatar: { top: 'curly', hairColor: 'f59797' } }
    },
    {
        id: 'head_black_estelar',
        type: 'avatar',
        slot: 'head',
        category: 'avatar',
        label: 'Black Estelar',
        description: 'Cabelo marcante para quem atravessa constelações com personalidade.',
        price: 110,
        rarity: 'incomum',
        icon: '💫',
        effect: { avatar: { top: 'fro', hairColor: '2c1b18' } }
    },
    {
        id: 'head_chapeu_vortice',
        type: 'avatar',
        slot: 'head',
        category: 'avatar',
        label: 'Chapéu do Vórtex',
        description: 'Um chapéu de expedição para missões pelo espaço-tempo.',
        price: 160,
        rarity: 'raro',
        icon: '🎩',
        effect: { avatar: { top: 'hat', hairColor: '4a312c' } }
    },
    {
        id: 'head_gorro_tritao',
        type: 'avatar',
        slot: 'head',
        category: 'avatar',
        label: 'Gorro de Tritão',
        description: 'Proteção estilosa para explorar as regiões geladas do Sistema Solar.',
        price: 140,
        rarity: 'raro',
        icon: '🧢',
        effect: { avatar: { top: 'winterHat1', hairColor: 'e8e1e1' } }
    },
    {
        id: 'acessorio_oculos_estelares',
        type: 'avatar',
        slot: 'accessory',
        category: 'avatar',
        label: 'Óculos Estelares',
        description: 'Lentes para observar detalhes invisíveis das missões espaciais.',
        price: 80,
        rarity: 'comum',
        icon: '🕶️',
        effect: { avatar: { accessories: 'sunglasses' } }
    },
    {
        id: 'acessorio_visor_sonico',
        type: 'avatar',
        slot: 'accessory',
        category: 'avatar',
        label: 'Visor Sônico',
        description: 'Um acessório com cara de tecnologia Gallifreyana.',
        price: 130,
        rarity: 'raro',
        icon: '🔭',
        effect: { avatar: { accessories: 'round' } }
    },
    {
        id: 'outfit_jaqueta_tardis',
        type: 'avatar',
        slot: 'outfit',
        category: 'avatar',
        label: 'Jaqueta T.A.R.D.I.S.',
        description: 'Traje azul clássico para representar sua nave favorita.',
        price: 100,
        rarity: 'incomum',
        icon: '🧥',
        effect: { avatar: { clothing: 'blazerAndShirt', clothesColor: '25557c' } }
    },
    {
        id: 'outfit_traje_aurora',
        type: 'avatar',
        slot: 'outfit',
        category: 'avatar',
        label: 'Traje Aurora',
        description: 'Um traje claro e vibrante inspirado nas luzes planetárias.',
        price: 170,
        rarity: 'raro',
        icon: '🌠',
        effect: { avatar: { clothing: 'hoodie', clothesColor: 'a7ffc4' } }
    },
    {
        id: 'frame_azul_tardis',
        type: 'frame',
        slot: 'frame',
        category: 'frame',
        label: 'Borda Azul T.A.R.D.I.S.',
        description: 'Uma moldura limpa, azul e elegante para começar a personalização.',
        price: 70,
        rarity: 'comum',
        icon: '🔷',
        effect: { frameClass: 'frame-tardis-blue' }
    },
    {
        id: 'frame_aurora',
        type: 'frame',
        slot: 'frame',
        category: 'frame',
        label: 'Borda Aurora',
        description: 'Uma moldura luminosa para destacar seu avatar no perfil e ranking.',
        price: 180,
        rarity: 'raro',
        icon: '🌈',
        effect: { frameClass: 'frame-aurora' }
    },
    {
        id: 'frame_nebulosa',
        type: 'frame',
        slot: 'frame',
        category: 'frame',
        label: 'Borda Nebulosa',
        description: 'Camadas roxas e azuis para um perfil com presença cósmica.',
        price: 220,
        rarity: 'épico',
        icon: '🟣',
        effect: { frameClass: 'frame-nebula' }
    },
    {
        id: 'frame_solar',
        type: 'frame',
        slot: 'frame',
        category: 'frame',
        label: 'Borda Solar',
        description: 'Uma moldura dourada para exploradores que brilham no ranking.',
        price: 300,
        rarity: 'épico',
        icon: '☀️',
        effect: { frameClass: 'frame-solar' }
    },
    {
        id: 'frame_vortice',
        type: 'frame',
        slot: 'frame',
        category: 'frame',
        label: 'Borda do Vórtex',
        description: 'Moldura rara com energia de espaço-tempo para perfis lendários.',
        price: 420,
        rarity: 'lendário',
        icon: '🌀',
        effect: { frameClass: 'frame-vortex' }
    }
]);

export const getShopItem = (itemId) => {
    const normalizedId = String(itemId || '').trim();
    if (!normalizedId) return null;
    return SHOP_ITEMS.find((item) => item.id === normalizedId) || null;
};

export const getCosmeticLabel = (itemId) => {
    const normalizedId = String(itemId || '').trim();
    if (!normalizedId) return '';

    return getShopItem(normalizedId)?.label || titleCase(normalizedId);
};

export const getShopItemsByType = (type) => {
    const normalizedType = String(type || '').trim();
    if (!normalizedType) return [...SHOP_ITEMS];
    return SHOP_ITEMS.filter((item) => item.type === normalizedType);
};

export const getShopItemsByCategory = (category = 'all') => {
    if (!category || category === 'all') return [...SHOP_ITEMS];
    return SHOP_ITEMS.filter((item) => item.category === category || item.type === category);
};

export const getItemSlotLabel = (slot = '') => SHOP_SLOTS[slot] || titleCase(slot || 'item');

export const normalizeOwnedCosmetics = (owned = []) => {
    if (Array.isArray(owned)) return owned.map(String).filter(Boolean);
    if (owned && typeof owned === 'object') return Object.keys(owned).filter((key) => owned[key]);
    return [];
};

export const getDefaultOwnedItemIds = () => SHOP_ITEMS
    .filter((item) => Number(item.price || 0) <= 0)
    .map((item) => item.id);

export const getOwnedItemIds = (owned = []) => [...new Set([
    ...getDefaultOwnedItemIds(),
    ...normalizeOwnedCosmetics(owned)
])];

export const isItemOwned = (itemId, owned = []) => getOwnedItemIds(owned).includes(String(itemId || ''));

export const normalizeEquippedCosmetics = (cosmetics = {}) => {
    if (!cosmetics || typeof cosmetics !== 'object' || Array.isArray(cosmetics)) return {};

    return Object.entries(cosmetics).reduce((result, [slot, itemId]) => {
        const item = getShopItem(itemId);
        if (item && item.slot === slot) result[slot] = item.id;
        return result;
    }, {});
};

export const getEquippedItemForSlot = (cosmetics = {}, slot = '') => {
    const normalized = normalizeEquippedCosmetics(cosmetics);
    return getShopItem(normalized[slot]);
};

export const getAvatarCosmeticOverrides = (cosmetics = {}) => {
    const normalized = normalizeEquippedCosmetics(cosmetics);
    return Object.values(normalized).reduce((overrides, itemId) => {
        const item = getShopItem(itemId);
        if (item?.effect?.avatar) return { ...overrides, ...item.effect.avatar };
        return overrides;
    }, {});
};

export const getCosmeticFrameClass = (frameItemId = '') => {
    const frameItem = getShopItem(frameItemId);
    return frameItem?.effect?.frameClass || '';
};

export const applyCosmeticsToAvatar = (avatar = {}, cosmetics = {}) => ({
    ...avatar,
    ...getAvatarCosmeticOverrides(cosmetics)
});
