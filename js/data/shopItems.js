// ============================================
// T.A.R.D.I.S. — Shop Items
// Catálogo base da Loja Cósmica.
//
// Mesmo antes da loja completa entrar em produção, o ranking precisa deste
// módulo para traduzir cosméticos equipados, especialmente títulos, sem quebrar
// a inicialização do botão de Ranking.
// ============================================

const titleCase = (value = '') => String(value)
    .trim()
    .replace(/[\-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)(\p{L})/gu, (_match, space, letter) => `${space}${letter.toUpperCase()}`);

export const SHOP_ITEMS = Object.freeze([
    {
        id: 'titulo_novo_explorador',
        type: 'title',
        label: 'Novo Explorador',
        description: 'Título inicial para exploradores recém-chegados à T.A.R.D.I.S.',
        price: 0
    },
    {
        id: 'titulo_cartografo_cosmico',
        type: 'title',
        label: 'Cartógrafo Cósmico',
        description: 'Para quem transforma descobertas em mapas do universo.',
        price: 120
    },
    {
        id: 'titulo_guardiao_da_tardis',
        type: 'title',
        label: 'Guardião da T.A.R.D.I.S.',
        description: 'Um título raro para exploradores constantes.',
        price: 250
    },
    {
        id: 'titulo_mestre_do_vortex',
        type: 'title',
        label: 'Mestre do Vórtex',
        description: 'Para exploradores que dominam as rotas do espaço-tempo.',
        price: 500
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
