// ============================================
// T.A.R.D.I.S. — Loja Cósmica
// Catálogo inicial de cosméticos compráveis com Fragmentos Estelares.
// ============================================

export const SHOP_CATEGORIES = Object.freeze([
    { id: 'all', label: 'Todos' },
    { id: 'head', label: 'Cabeça' },
    { id: 'outfit', label: 'Trajes' },
    { id: 'accessory', label: 'Acessórios' },
    { id: 'aura', label: 'Auras' },
    { id: 'frame', label: 'Molduras' },
    { id: 'title', label: 'Títulos' }
]);

export const RARITY_LABELS = Object.freeze({
    common: 'Comum',
    uncommon: 'Incomum',
    rare: 'Raro',
    epic: 'Épico',
    legendary: 'Lendário'
});

export const SHOP_ITEMS = Object.freeze([
    {
        id: 'crown_solar',
        name: 'Coroa Solar',
        category: 'head',
        slot: 'head',
        rarity: 'rare',
        price: 120,
        icon: '☀️',
        description: 'Uma coroa brilhante para exploradores que carregam energia de estrela.'
    },
    {
        id: 'helmet_mars',
        name: 'Capacete de Marte',
        category: 'head',
        slot: 'head',
        rarity: 'uncommon',
        price: 80,
        icon: '🪐',
        description: 'Capacete vermelho inspirado nas missões marcianas.'
    },
    {
        id: 'visor_nebula',
        name: 'Óculos Nebulosa',
        category: 'head',
        slot: 'head',
        rarity: 'epic',
        price: 180,
        icon: '🕶️',
        description: 'Lentes de navegação para enxergar rotas cósmicas invisíveis.'
    },
    {
        id: 'scientist_coat',
        name: 'Traje de Cientista Cósmico',
        category: 'outfit',
        slot: 'outfit',
        rarity: 'uncommon',
        price: 95,
        icon: '🥼',
        description: 'Um jaleco espacial para quem estuda o universo com curiosidade.'
    },
    {
        id: 'timelord_cape',
        name: 'Capa de Time Lord',
        category: 'outfit',
        slot: 'outfit',
        rarity: 'legendary',
        price: 320,
        icon: '🧥',
        description: 'Uma capa lendária para viajantes que parecem conhecer todos os tempos.'
    },
    {
        id: 'sonic_screwdriver',
        name: 'Chave de Fenda Sônica',
        category: 'accessory',
        slot: 'accessory',
        rarity: 'epic',
        price: 220,
        icon: '🪛',
        description: 'Uma ferramenta elegante para investigar mistérios da galáxia.'
    },
    {
        id: 'saturn_badge',
        name: 'Insígnia de Saturno',
        category: 'accessory',
        slot: 'accessory',
        rarity: 'rare',
        price: 140,
        icon: '🪙',
        description: 'Uma insígnia orbital para mostrar respeito aos anéis de Saturno.'
    },
    {
        id: 'galactic_aura',
        name: 'Aura Galáctica',
        category: 'aura',
        slot: 'aura',
        rarity: 'epic',
        price: 260,
        icon: '✨',
        description: 'Um brilho ao redor do explorador, como poeira de estrelas.'
    },
    {
        id: 'aurora_aura',
        name: 'Aura de Aurora',
        category: 'aura',
        slot: 'aura',
        rarity: 'rare',
        price: 155,
        icon: '🌌',
        description: 'Um brilho suave inspirado nas luzes das atmosferas planetárias.'
    },
    {
        id: 'voyager_frame',
        name: 'Moldura da Voyager',
        category: 'frame',
        slot: 'frame',
        rarity: 'rare',
        price: 170,
        icon: '🛰️',
        description: 'Uma moldura dourada para exploradores que seguem rotas históricas.'
    },
    {
        id: 'blue_nebula_bg',
        name: 'Fundo Nebulosa Azul',
        category: 'frame',
        slot: 'frame',
        rarity: 'uncommon',
        price: 90,
        icon: '🔷',
        description: 'Um fundo azulado para destacar seu perfil no painel de exploradores.'
    },
    {
        id: 'title_doctor_companion',
        name: 'Título: Companheiro do Doutor',
        category: 'title',
        slot: 'title',
        rarity: 'legendary',
        price: 300,
        icon: '🏷️',
        description: 'Um título especial para quem acompanha aventuras pelo tempo e espaço.'
    }
]);

export const getShopItemById = (itemId) => SHOP_ITEMS.find((item) => item.id === itemId) || null;

export const getShopItemsByCategory = (category = 'all') => {
    if (category === 'all') return SHOP_ITEMS;
    return SHOP_ITEMS.filter((item) => item.category === category);
};

export const getCosmeticLabel = (itemId) => getShopItemById(itemId)?.name || '';
