// ============================================
// T.A.R.D.I.S. — Loja Cósmica
// Compra, inventário e equipamento de cosméticos usando Fragmentos Estelares.
// ============================================
import { supabase, getCurrentSession } from '../auth/authService.js';
import { DEFAULT_AVATAR, normalizeAvatar } from '../avatar/avatarData.js';
import { renderAvatarInto, renderAvatarPreviewHTML } from '../avatar/avatarRenderer.js';
import {
    SHOP_CATEGORIES,
    SHOP_ITEMS,
    getItemSlotLabel,
    getOwnedItemIds,
    getShopItem,
    isItemOwned,
    normalizeEquippedCosmetics,
    normalizeOwnedCosmetics
} from '../data/shopItems.js';

let shopPage = null;
let shopGrid = null;
let shopWallet = null;
let shopStatus = null;
let shopPreview = null;
let shopInventoryCount = null;
let shopFilter = 'all';
let currentProfile = null;
let isLoading = false;
let isMutating = false;
let shopStylesPromise = null;

const SHOP_STYLES_ID = 'tardis-cosmic-shop-styles';

const ensureShopStyles = () => {
    if (typeof document === 'undefined') return Promise.resolve(null);

    const existing = document.getElementById(SHOP_STYLES_ID)
        || document.querySelector('link[rel="stylesheet"][href*="css/shop.css"]');

    if (existing) return Promise.resolve(existing);
    if (shopStylesPromise) return shopStylesPromise;

    shopStylesPromise = new Promise((resolve) => {
        const link = document.createElement('link');
        link.id = SHOP_STYLES_ID;
        link.rel = 'stylesheet';
        link.href = 'css/shop.css?v=44.5';

        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            resolve(link);
        };

        link.addEventListener('load', finish, { once: true });
        link.addEventListener('error', finish, { once: true });
        document.head.appendChild(link);

        // Não deixa a loja travar caso o navegador bloqueie o evento load do CSS.
        window.setTimeout(finish, 1200);
    });

    return shopStylesPromise;
};

const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const formatPrice = (value = 0) => Number(value || 0).toLocaleString('pt-BR');

const normalizeProfile = (profile = {}, session = null) => {
    const user = session?.user || null;
    const metadata = user?.user_metadata || {};
    const avatar = normalizeAvatar(profile?.avatar || metadata.avatar || DEFAULT_AVATAR);
    const ownedCosmetics = getOwnedItemIds(profile?.owned_cosmetics || []);
    const equippedCosmetics = normalizeEquippedCosmetics(profile?.equipped_cosmetics || {});

    return {
        id: profile?.id || user?.id || null,
        user_id: profile?.user_id || user?.id || null,
        explorer_name: profile?.explorer_name || metadata.explorer_name || metadata.display_name || 'Explorador',
        exploration_points: Number(profile?.exploration_points || 0),
        star_fragments: Number(profile?.star_fragments || 0),
        avatar,
        owned_cosmetics: ownedCosmetics,
        equipped_cosmetics: equippedCosmetics
    };
};

const setStatus = (message = '', type = 'info') => {
    if (!shopStatus) return;
    shopStatus.textContent = message;
    shopStatus.className = `shop-status ${message ? 'active' : ''} ${type}`;
};

const requestLoginForShop = () => {
    document.dispatchEvent(new CustomEvent('tardis:auth-open', {
        detail: {
            mode: 'login',
            message: 'Entre na sua conta para acessar a Loja Cósmica e usar seus Fragmentos Estelares.',
            messageType: 'warning'
        }
    }));
};

const getOwnedSet = () => new Set(getOwnedItemIds(currentProfile?.owned_cosmetics || []));

const getStoredOwnedIds = () => normalizeOwnedCosmetics(currentProfile?.owned_cosmetics || []);

const isEquipped = (item) => currentProfile?.equipped_cosmetics?.[item.slot] === item.id;

const isFreeItem = (item) => Number(item?.price || 0) <= 0;

const getActionVerb = (item) => {
    if (item?.type === 'title' || item?.slot === 'title') return 'Usar título';
    if (item?.type === 'frame' || item?.slot === 'frame') return 'Aplicar borda';
    return 'Equipar';
};

const getProfileSelectColumns = () => 'id, user_id, explorer_name, exploration_points, star_fragments, avatar, owned_cosmetics, equipped_cosmetics';

const mergeOwnedIds = (...collections) => [...new Set(collections
    .flatMap((collection) => normalizeOwnedCosmetics(collection))
    .filter(Boolean))];

const getFilteredItems = () => {
    if (shopFilter === 'owned') {
        const owned = getOwnedSet();
        return SHOP_ITEMS.filter((item) => owned.has(item.id));
    }

    if (shopFilter === 'all') return SHOP_ITEMS;
    return SHOP_ITEMS.filter((item) => item.category === shopFilter || item.type === shopFilter);
};

const getItemAction = (item) => {
    const owned = isItemOwned(item.id, currentProfile?.owned_cosmetics || []);
    const equipped = isEquipped(item);
    const canAfford = Number(currentProfile?.star_fragments || 0) >= Number(item.price || 0);

    if (equipped) return { label: 'Em uso', action: 'none', disabled: true, className: 'equipped' };
    if (owned || isFreeItem(item)) return { label: getActionVerb(item), action: 'equip', disabled: false, className: 'equip' };
    if (!canAfford) return { label: 'Sem fragmentos', action: 'buy', disabled: true, className: 'locked' };
    return { label: `Comprar · ${formatPrice(item.price)} ✦`, action: 'buy', disabled: false, className: 'buy' };
};

const renderTabs = () => {
    const tabs = shopPage?.querySelector('#shop-tabs');
    if (!tabs) return;

    tabs.innerHTML = SHOP_CATEGORIES.map((category) => `
        <button class="shop-tab ${shopFilter === category.id ? 'active' : ''}" data-shop-filter="${escapeHTML(category.id)}" type="button">
            ${escapeHTML(category.label)}
        </button>
    `).join('');
};

const renderWallet = () => {
    if (!shopWallet) return;

    const ownedCount = getOwnedSet().size;
    const totalCount = SHOP_ITEMS.length;

    shopWallet.innerHTML = `
        <div class="shop-wallet-card primary">
            <span>Fragmentos</span>
            <strong>${formatPrice(currentProfile?.star_fragments || 0)} ✦</strong>
        </div>
        <div class="shop-wallet-card">
            <span>Inventário</span>
            <strong>${ownedCount}/${totalCount}</strong>
        </div>
    `;

    if (shopInventoryCount) shopInventoryCount.textContent = `${ownedCount}/${totalCount}`;
};

const renderPreview = () => {
    if (!shopPreview) return;

    const avatar = currentProfile?.avatar || DEFAULT_AVATAR;
    const cosmetics = currentProfile?.equipped_cosmetics || {};
    const equippedItems = Object.entries(cosmetics)
        .map(([slot, itemId]) => ({ slot, item: getShopItem(itemId) }))
        .filter(({ item }) => Boolean(item));

    shopPreview.innerHTML = `
        <div class="shop-preview-stage" aria-hidden="false">
            <div class="shop-preview-avatar" id="shop-preview-avatar"></div>
        </div>
        <div class="shop-preview-copy">
            <span>Prévia do perfil</span>
            <strong>${escapeHTML(currentProfile?.explorer_name || 'Explorador')}</strong>
            <p>O que você equipar aqui aparece no Perfil e no Ranking.</p>
            <div class="shop-equipped-list">
                ${equippedItems.length ? equippedItems.map(({ slot, item }) => `
                    <span>${escapeHTML(getItemSlotLabel(slot))}: <b>${escapeHTML(item.label)}</b></span>
                `).join('') : '<span>Nenhum cosmético equipado ainda.</span>'}
            </div>
        </div>
    `;

    renderAvatarInto(shopPreview.querySelector('#shop-preview-avatar'), avatar, {
        compact: false,
        size: 220,
        label: currentProfile?.explorer_name || 'Explorador',
        cosmetics
    });
};

const renderGrid = () => {
    if (!shopGrid) return;

    const items = getFilteredItems();

    if (!items.length) {
        shopGrid.innerHTML = `
            <div class="shop-empty">
                <strong>Nenhum item encontrado.</strong>
                <span>Compre cosméticos para preencher o inventário.</span>
            </div>
        `;
        return;
    }

    shopGrid.innerHTML = items.map((item) => {
        const owned = isItemOwned(item.id, currentProfile?.owned_cosmetics || []);
        const equipped = isEquipped(item);
        const action = getItemAction(item);

        return `
            <article class="shop-item-card rarity-${escapeHTML(item.rarity || 'comum')} ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}" data-shop-card-type="${escapeHTML(item.type || '')}" data-shop-card-slot="${escapeHTML(item.slot || '')}">
                <div class="shop-item-topline">
                    <span class="shop-item-icon" aria-hidden="true">${escapeHTML(item.icon || '✦')}</span>
                    <span class="shop-item-rarity">${escapeHTML(item.rarity || 'comum')}</span>
                </div>
                <div class="shop-item-preview">
                    ${renderAvatarPreviewHTML(currentProfile?.avatar || DEFAULT_AVATAR, {
                        compact: true,
                        size: 86,
                        cosmetics: item.type === 'title' ? currentProfile?.equipped_cosmetics || {} : {
                            ...(currentProfile?.equipped_cosmetics || {}),
                            [item.slot]: item.id
                        }
                    })}
                </div>
                <div class="shop-item-copy">
                    <h3>${escapeHTML(item.label)}</h3>
                    <span>${escapeHTML(getItemSlotLabel(item.slot))}</span>
                    <p>${escapeHTML(item.description || '')}</p>
                </div>
                <div class="shop-item-footer">
                    <span class="shop-price">${Number(item.price || 0) <= 0 ? 'Grátis' : `${formatPrice(item.price)} ✦`}</span>
                    <button class="shop-item-action ${action.className}" data-shop-action="${action.action}" data-shop-item="${escapeHTML(item.id)}" type="button" ${action.disabled ? 'disabled' : ''}>
                        ${escapeHTML(action.label)}
                    </button>
                </div>
            </article>
        `;
    }).join('');
};

const renderShop = () => {
    renderTabs();
    renderWallet();
    renderPreview();
    renderGrid();
};

const emitShopUpdated = (profile = currentProfile) => {
    window.dispatchEvent(new CustomEvent('tardis:shop-updated', {
        detail: {
            profile,
            ownedCosmetics: profile?.owned_cosmetics || [],
            equippedCosmetics: profile?.equipped_cosmetics || {},
            starFragments: profile?.star_fragments || 0
        }
    }));

    window.dispatchEvent(new CustomEvent('tardis:profile-points-updated', {
        detail: {
            userId: profile?.user_id || profile?.id || null,
            explorerName: profile?.explorer_name || 'Explorador',
            explorationPoints: profile?.exploration_points || 0,
            starFragments: profile?.star_fragments || 0,
            avatar: profile?.avatar || DEFAULT_AVATAR,
            ownedCosmetics: profile?.owned_cosmetics || [],
            equippedCosmetics: profile?.equipped_cosmetics || {}
        }
    }));
};

const loadProfile = async ({ silent = false } = {}) => {
    if (!supabase) throw new Error('Supabase ainda não foi configurado.');

    const session = await getCurrentSession();
    if (!session?.user) {
        requestLoginForShop();
        return null;
    }

    if (!silent) setStatus('Sincronizando a Loja Cósmica...', 'info');

    await window.TardisProfileProgress?.sync?.();

    const { data, error } = await supabase
        .from('profiles')
        .select(getProfileSelectColumns())
        .eq('id', session.user.id)
        .maybeSingle();

    if (error) throw error;

    currentProfile = normalizeProfile(data || {}, session);
    renderShop();
    emitShopUpdated(currentProfile);
    if (!silent) setStatus('', 'info');
    return currentProfile;
};

const applyReturnedProfile = async (data) => {
    const session = await getCurrentSession();
    const row = Array.isArray(data) ? data[0] : data;
    currentProfile = normalizeProfile(row || currentProfile || {}, session);
    renderShop();
    emitShopUpdated(currentProfile);
    await window.TardisProfileProgress?.sync?.();
    return currentProfile;
};

const updateProfileCosmeticsDirectly = async ({ ownedCosmetics, equippedCosmetics }) => {
    const session = await getCurrentSession();
    if (!session?.user) {
        requestLoginForShop();
        return null;
    }

    const payload = {
        owned_cosmetics: mergeOwnedIds(ownedCosmetics),
        equipped_cosmetics: normalizeEquippedCosmetics(equippedCosmetics || {}),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', session.user.id)
        .select(getProfileSelectColumns())
        .maybeSingle();

    if (error) throw error;
    return applyReturnedProfile(data || { ...currentProfile, ...payload });
};

const equipItemDirectly = async (item) => {
    const storedOwned = getStoredOwnedIds();
    const nextOwned = mergeOwnedIds(storedOwned, [item.id]);
    const nextEquipped = normalizeEquippedCosmetics({
        ...(currentProfile?.equipped_cosmetics || {}),
        [item.slot]: item.id
    });

    return updateProfileCosmeticsDirectly({
        ownedCosmetics: nextOwned,
        equippedCosmetics: nextEquipped
    });
};

const purchaseItem = async (itemId) => {
    const item = getShopItem(itemId);
    if (!item || isMutating) return null;

    if (isItemOwned(item.id, currentProfile?.owned_cosmetics || [])) {
        setStatus(`${item.label} já está no seu inventário. ${isEquipped(item) ? 'Ele já está em uso.' : 'Aplicando agora...'}`, isEquipped(item) ? 'success' : 'info');
        return isEquipped(item) ? currentProfile : equipItem(item.id);
    }

    if (isFreeItem(item)) {
        setStatus(`${item.label} é gratuito. Adicionando ao inventário e aplicando...`, 'info');
        return equipItem(item.id);
    }

    isMutating = true;
    setStatus(`Comprando ${item.label}...`, 'info');

    try {
        const { data, error } = await supabase.rpc('purchase_shop_item', {
            target_item_id: item.id
        });

        if (error) throw error;

        const profile = await applyReturnedProfile(data);
        setStatus(`${item.label} agora está no seu inventário.`, 'success');
        return profile;
    } catch (error) {
        console.warn('[CosmicShop] Falha ao comprar item:', error?.message || error);
        setStatus('Não foi possível comprar. Confira seus Fragmentos Estelares e as funções SQL da Loja Cósmica.', 'error');
        return null;
    } finally {
        isMutating = false;
    }
};

const equipItem = async (itemId) => {
    const item = getShopItem(itemId);
    if (!item || isMutating) return null;

    if (isEquipped(item)) {
        setStatus(`${item.label} já está em uso.`, 'success');
        renderShop();
        return currentProfile;
    }

    const owned = isItemOwned(item.id, currentProfile?.owned_cosmetics || []);
    if (owned) {
        setStatus(`${item.label} já está no seu inventário. Aplicando agora...`, 'info');
    } else if (isFreeItem(item)) {
        setStatus(`${item.label} é gratuito. Salvando no inventário e aplicando...`, 'info');
    } else {
        setStatus(`Compre ${item.label} antes de equipar.`, 'error');
        renderShop();
        return null;
    }

    isMutating = true;

    try {
        const { data, error } = await supabase.rpc('equip_shop_item', {
            target_slot: item.slot,
            target_item_id: item.id
        });

        if (error) throw error;

        const profile = await applyReturnedProfile(data);
        setStatus(`${item.label} aplicado com sucesso.`, 'success');
        return profile;
    } catch (error) {
        console.warn('[CosmicShop] RPC equip_shop_item falhou, tentando atualização direta:', error?.message || error);

        try {
            const profile = await equipItemDirectly(item);
            setStatus(`${item.label} aplicado com sucesso.`, 'success');
            return profile;
        } catch (fallbackError) {
            console.warn('[CosmicShop] Falha ao equipar item pelo fallback:', fallbackError?.message || fallbackError);
            setStatus('Não foi possível aplicar este item. Confira as permissões da tabela profiles e tente atualizar a página.', 'error');
            renderShop();
            return null;
        }
    } finally {
        isMutating = false;
    }
};

const handleItemAction = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    const button = event.target.closest?.('[data-shop-action]');
    if (!button || !shopPage?.contains(button)) return;

    const action = button.dataset.shopAction;
    const itemId = button.dataset.shopItem;

    if (action === 'buy') {
        const profile = await purchaseItem(itemId);
        const item = getShopItem(itemId);
        if (profile && item && !isEquipped(item) && isItemOwned(itemId, profile.owned_cosmetics)) await equipItem(itemId);
        return;
    }

    if (action === 'equip') {
        await equipItem(itemId);
    }
};

const bindShopEvents = () => {
    if (!shopPage || shopPage.dataset.shopEventsBound === 'true') return;

    shopPage.dataset.shopEventsBound = 'true';

    // Listener em modo capture: os cliques nos botões internos precisam ser
    // capturados antes de qualquer camada visual parar a propagação do evento.
    shopPage.addEventListener('click', async (event) => {
        const closeTrigger = event.target.closest?.('[data-shop-close]');
        if (closeTrigger && shopPage.contains(closeTrigger)) {
            event.preventDefault();
            event.stopPropagation();
            closeCosmicShop();
            return;
        }

        const tab = event.target.closest?.('[data-shop-filter]');
        if (tab && shopPage.contains(tab)) {
            event.preventDefault();
            event.stopPropagation();
            shopFilter = tab.dataset.shopFilter || 'all';
            renderShop();
            return;
        }

        const actionButton = event.target.closest?.('[data-shop-action]');
        if (actionButton && shopPage.contains(actionButton)) {
            event.preventDefault();
            event.stopPropagation();
            await handleItemAction(event);
        }
    }, true);

    shopPage.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
    shopPage.addEventListener('touchmove', (event) => event.stopPropagation(), { passive: true });
};

const hydrateShopRefs = () => {
    shopGrid = shopPage?.querySelector('#shop-grid') || null;
    shopWallet = shopPage?.querySelector('#shop-wallet') || null;
    shopStatus = shopPage?.querySelector('#shop-status') || null;
    shopPreview = shopPage?.querySelector('#shop-preview') || null;
    shopInventoryCount = shopPage?.querySelector('#shop-inventory-count') || null;
};

const createShopPage = () => {
    if (document.getElementById('cosmic-shop-page')) {
        shopPage = document.getElementById('cosmic-shop-page');
        hydrateShopRefs();
        bindShopEvents();
        if (!shopPage.classList.contains('active')) {
            shopPage.hidden = true;
            shopPage.style.display = 'none';
            shopPage.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('shop-open');
        }
        return;
    }

    shopPage = document.createElement('div');
    shopPage.id = 'cosmic-shop-page';
    shopPage.className = 'cosmic-shop-page';
    shopPage.setAttribute('aria-hidden', 'true');
    // Proteção extra: a loja nasce invisível mesmo se o CSS estiver em cache,
    // atrasado ou ainda não tiver sido carregado pelo navegador.
    shopPage.hidden = true;
    shopPage.style.display = 'none';
    shopPage.innerHTML = `
        <div class="shop-backdrop" data-shop-close="true" aria-hidden="true"></div>
        <section class="shop-shell" role="dialog" aria-modal="true" aria-labelledby="shop-title">
            <header class="shop-header">
                <div class="shop-title-block">
                    <div class="shop-brand-row">
                        <span class="shop-kicker">LOJA CÓSMICA</span>
                        <span class="shop-live-badge">Mercado de cosméticos</span>
                    </div>
                    <h1 id="shop-title">Loja Cósmica</h1>
                    <p>Compre e equipe títulos, cabelos, chapéus, trajes e bordas. Tudo aparece no Perfil e no Ranking.</p>
                </div>
                <button class="shop-close" id="shop-close" data-shop-close="true" type="button" aria-label="Fechar loja">✕</button>
            </header>

            <div class="shop-content">
                <aside class="shop-sidebar" aria-label="Prévia e carteira da Loja Cósmica">
                    <section class="shop-preview-card">
                        <div class="shop-preview-card-head">
                            <span>Provador orbital</span>
                            <strong>Ao vivo</strong>
                        </div>
                        <div class="shop-preview" id="shop-preview"></div>
                    </section>

                    <section class="shop-wallet" id="shop-wallet" aria-label="Carteira e inventário"></section>

                    <section class="shop-help-card">
                        <span class="shop-mini-label">Como funciona</span>
                        <strong>Compre, equipe e apareça.</strong>
                        <p>Itens pagos usam Fragmentos Estelares. Itens equipados sincronizam com seu Perfil e com a listagem do Ranking.</p>
                    </section>
                </aside>

                <main class="shop-catalog-panel">
                    <div class="shop-toolbar">
                        <div class="shop-tabs" id="shop-tabs" role="tablist" aria-label="Categorias da Loja Cósmica"></div>
                        <span class="shop-inventory-pill">Inventário <b id="shop-inventory-count">0/0</b></span>
                    </div>

                    <div class="shop-status" id="shop-status" role="status"></div>

                    <section class="shop-board">
                        <div class="shop-board-head">
                            <div>
                                <span>Catálogo</span>
                                <strong>Cosméticos disponíveis</strong>
                            </div>
                            <p class="shop-board-note">Escolha uma categoria e teste o visual antes de comprar.</p>
                        </div>
                        <div class="shop-grid" id="shop-grid"></div>
                    </section>
                </main>
            </div>
        </section>
    `;

    document.body.appendChild(shopPage);
    hydrateShopRefs();
    bindShopEvents();
};

export const openCosmicShop = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    const session = await getCurrentSession();
    if (!session?.user) {
        requestLoginForShop();
        return;
    }

    await ensureShopStyles();
    createShopPage();
    window.TardisAchievements?.close?.();
    window.TardisRanking?.close?.();

    shopPage.hidden = false;
    shopPage.style.removeProperty('display');
    shopPage.classList.add('active');
    shopPage.setAttribute('aria-hidden', 'false');
    document.body.classList.add('shop-open');

    if (!isLoading) {
        isLoading = true;
        try {
            await loadProfile();
        } catch (error) {
            console.warn('[CosmicShop] Falha ao carregar loja:', error?.message || error);
            setStatus('Não foi possível carregar a loja. Execute docs/SUPABASE_COSMIC_SHOP_SETUP.sql e atualize a página.', 'error');
        } finally {
            isLoading = false;
        }
    }
};

export function closeCosmicShop() {
    if (!shopPage) return;
    shopPage.classList.remove('active');
    shopPage.setAttribute('aria-hidden', 'true');
    shopPage.hidden = true;
    shopPage.style.display = 'none';
    document.body.classList.remove('shop-open');
}

export const initCosmicShop = () => {
    ensureShopStyles();

    // A loja agora é criada de forma preguiçosa, apenas quando o usuário clica em
    // "Loja Cósmica". Isso impede que o modal apareça sozinho no carregamento.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && shopPage?.classList.contains('active')) closeCosmicShop();
    });

    window.addEventListener('tardis:profile-points-updated', (event) => {
        if (!event.detail?.userId) return;
        currentProfile = normalizeProfile({
            ...currentProfile,
            exploration_points: event.detail.explorationPoints,
            star_fragments: event.detail.starFragments,
            avatar: event.detail.avatar || currentProfile?.avatar,
            owned_cosmetics: event.detail.ownedCosmetics || currentProfile?.owned_cosmetics || [],
            equipped_cosmetics: event.detail.equippedCosmetics || currentProfile?.equipped_cosmetics || {},
            explorer_name: event.detail.explorerName || currentProfile?.explorer_name
        });
        if (shopPage?.classList.contains('active')) renderShop();
    });

    window.TardisCosmicShop = {
        open: openCosmicShop,
        close: closeCosmicShop,
        refresh: () => loadProfile({ silent: true }),
        buyItem: purchaseItem,
        equipItem,
        getProfile: () => currentProfile,
        getCatalog: () => [...SHOP_ITEMS],
        renderItemPreview: (itemId, avatar = DEFAULT_AVATAR, cosmetics = {}) => {
            const item = getShopItem(itemId);
            return renderAvatarPreviewHTML(avatar, {
                compact: true,
                cosmetics: item ? { ...cosmetics, [item.slot]: item.id } : cosmetics
            });
        }
    };
};
