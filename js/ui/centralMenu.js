// ============================================
// T.A.R.D.I.S. — Central Menu + Loja Cósmica
// Um único menu para Perfil, Conquistas, Ranking e Loja.
// ============================================
import { getCurrentSession } from '../auth/authService.js';
import { SHOP_CATEGORIES, getShopItemsByCategory, RARITY_LABELS } from '../data/shopItems.js';
import { getShopState, purchaseShopItem, equipCosmetic, isItemEquipped, getEquippedItems } from '../shop/shopService.js';

let centralNav = null;
let centralButton = null;
let centralMenu = null;
let shopPage = null;
let shopGrid = null;
let shopStatus = null;
let shopBalance = null;
let shopEquipped = null;
let activeShopCategory = 'all';
let currentShopState = null;
let isShopLoading = false;

const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const setMenuOpen = (open) => {
    if (!centralNav || !centralButton) return;
    centralNav.classList.toggle('open', open);
    centralButton.setAttribute('aria-expanded', open ? 'true' : 'false');
};

const toggleMenu = () => setMenuOpen(!centralNav?.classList.contains('open'));
const closeMenu = () => setMenuOpen(false);

const requestLoginForShop = () => {
    document.dispatchEvent(new CustomEvent('tardis:auth-open', {
        detail: {
            mode: 'login',
            message: 'Entre na sua conta para acessar a Loja Cósmica.',
            messageType: 'warning'
        }
    }));
};

const setShopStatus = (message = '', type = 'info') => {
    if (!shopStatus) return;
    shopStatus.textContent = message;
    shopStatus.className = `shop-status ${message ? 'active' : ''} ${type}`;
};

const getItemButtonLabel = (item, owned, equipped) => {
    if (equipped) return 'Equipado';
    if (owned) return 'Equipar';
    return `Comprar · ${item.price}`;
};

const renderShopFilters = () => SHOP_CATEGORIES.map((category) => `
    <button class="shop-filter ${activeShopCategory === category.id ? 'active' : ''}" data-shop-category="${category.id}" type="button">
        ${escapeHTML(category.label)}
    </button>
`).join('');

const renderEquippedList = (profile) => {
    const equippedItems = getEquippedItems(profile?.equipped_cosmetics || {});

    if (!equippedItems.length) {
        return '<span>Nenhum cosmético equipado ainda.</span>';
    }

    return equippedItems.map((item) => `
        <span class="shop-equipped-chip">${escapeHTML(item.icon)} ${escapeHTML(item.name)}</span>
    `).join('');
};

const renderShop = () => {
    if (!shopPage || !shopGrid) return;

    const profile = currentShopState?.profile || null;
    const ownedIds = currentShopState?.ownedIds || new Set();
    const balance = Number(profile?.star_fragments || 0);
    const items = getShopItemsByCategory(activeShopCategory);

    if (shopBalance) shopBalance.textContent = balance;


    if (shopEquipped) shopEquipped.innerHTML = renderEquippedList(profile);

    const filters = shopPage.querySelector('#shop-filters');
    if (filters) filters.innerHTML = renderShopFilters();

    shopGrid.innerHTML = items.map((item) => {
        const owned = ownedIds.has(item.id);
        const equipped = isItemEquipped(profile, item);
        const canBuy = owned || balance >= item.price;
        const action = owned ? 'equip' : 'buy';

        return `
            <article class="shop-item-card rarity-${item.rarity} ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}">
                <div class="shop-item-icon" aria-hidden="true">${escapeHTML(item.icon)}</div>
                <div class="shop-item-copy">
                    <span class="shop-item-rarity">${escapeHTML(RARITY_LABELS[item.rarity] || item.rarity)}</span>
                    <h3>${escapeHTML(item.name)}</h3>
                    <p>${escapeHTML(item.description)}</p>
                </div>
                <div class="shop-item-footer">
                    <span class="shop-item-price">${owned ? 'Adquirido' : `${item.price} ✦`}</span>
                    <button class="shop-item-action" type="button" data-shop-action="${action}" data-shop-item-id="${item.id}" ${!canBuy ? 'disabled' : ''}>
                        ${escapeHTML(getItemButtonLabel(item, owned, equipped))}
                    </button>
                </div>
            </article>
        `;
    }).join('');
};

const refreshShop = async (message = '') => {
    if (isShopLoading) return;
    isShopLoading = true;

    try {
        setShopStatus(message || 'Sincronizando Loja Cósmica...', 'info');
        currentShopState = await getShopState();
        renderShop();
        setShopStatus('', 'info');
    } catch (error) {
        console.warn('[Shop] Falha ao carregar loja:', error?.message || error);
        setShopStatus(error?.message || 'Não foi possível carregar a Loja Cósmica.', 'error');
    } finally {
        isShopLoading = false;
    }
};

const createShopPage = () => {
    if (document.getElementById('shop-page')) {
        shopPage = document.getElementById('shop-page');
        shopGrid = shopPage.querySelector('#shop-grid');
        shopStatus = shopPage.querySelector('#shop-status');
        shopBalance = shopPage.querySelector('#shop-balance');
        shopEquipped = shopPage.querySelector('#shop-equipped-list');
        return;
    }

    shopPage = document.createElement('div');
    shopPage.id = 'shop-page';
    shopPage.className = 'shop-page';
    shopPage.setAttribute('aria-hidden', 'true');
    shopPage.innerHTML = `
        <div class="shop-backdrop"></div>
        <section class="shop-shell" role="dialog" aria-modal="true" aria-labelledby="shop-title">
            <header class="shop-header">
                <div class="shop-title-block">
                    <span class="shop-kicker">LOJA CÓSMICA</span>
                    <h2 id="shop-title">Cosméticos do Explorador</h2>
                    <p>Use Fragmentos Estelares para comprar itens visuais. Gastar fragmentos não diminui seus Pontos de Exploração nem sua posição no ranking.</p>
                </div>
                <button class="shop-close" id="shop-close" type="button" aria-label="Fechar loja">✕</button>
            </header>

            <section class="shop-hero">
                <div class="shop-avatar-panel shop-no-avatar-panel">
                    <div class="shop-equipped">
                        <span class="shop-small-label">Cosméticos equipados</span>
                        <div id="shop-equipped-list" class="shop-equipped-list"></div>
                    </div>
                    <p class="shop-no-avatar-note">A prévia visual do explorador foi pausada para preservar o FPS do Sistema Solar.</p>
                </div>

                <div class="shop-wallet-panel">
                    <span class="shop-small-label">Saldo disponível</span>
                    <strong><span id="shop-balance">0</span> ✦</strong>
                    <p>Fragmentos Estelares são a moeda gastável da Loja Cósmica.</p>
                </div>
            </section>

            <div class="shop-status" id="shop-status" role="status"></div>

            <nav class="shop-filters" id="shop-filters" aria-label="Categorias da loja"></nav>
            <section class="shop-grid" id="shop-grid" aria-label="Itens da Loja Cósmica"></section>
        </section>
    `;

    document.body.appendChild(shopPage);
    shopGrid = shopPage.querySelector('#shop-grid');
    shopStatus = shopPage.querySelector('#shop-status');
    shopBalance = shopPage.querySelector('#shop-balance');
    shopAvatar = shopPage.querySelector('#shop-avatar-preview');
    shopEquipped = shopPage.querySelector('#shop-equipped-list');

    shopPage.querySelector('#shop-close')?.addEventListener('click', closeShopPage);
    shopPage.querySelector('.shop-backdrop')?.addEventListener('click', closeShopPage);
    shopPage.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
    shopPage.addEventListener('touchmove', (event) => event.stopPropagation(), { passive: true });

    shopPage.addEventListener('click', async (event) => {
        const categoryButton = event.target.closest?.('[data-shop-category]');
        if (categoryButton) {
            activeShopCategory = categoryButton.dataset.shopCategory || 'all';
            renderShop();
            return;
        }

        const actionButton = event.target.closest?.('[data-shop-action]');
        if (!actionButton) return;

        const itemId = actionButton.dataset.shopItemId;
        const action = actionButton.dataset.shopAction;

        try {
            actionButton.disabled = true;
            if (action === 'buy') {
                await purchaseShopItem(itemId);
                setShopStatus('Cosmético comprado com sucesso!', 'success');
            } else {
                await equipCosmetic(itemId);
                setShopStatus('Visual do explorador atualizado!', 'success');
            }

            await refreshShop();
            window.TardisRanking?.refresh?.();
        } catch (error) {
            setShopStatus(error?.message || 'Não foi possível concluir a ação.', 'error');
        } finally {
            actionButton.disabled = false;
        }
    });
};

const openShopPage = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    closeMenu();

    const session = await getCurrentSession();
    if (!session?.user) {
        requestLoginForShop();
        return;
    }

    window.TardisAchievements?.close?.();
    window.TardisRanking?.close?.();

    createShopPage();
    shopPage.classList.add('active');
    shopPage.setAttribute('aria-hidden', 'false');
    document.body.classList.add('shop-open');
    await refreshShop();
};

function closeShopPage() {
    if (!shopPage) return;
    shopPage.classList.remove('active');
    shopPage.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('shop-open');
}

const bindCentralMenu = () => {
    centralNav = document.getElementById('central-nav');
    centralButton = document.getElementById('nav-central');
    centralMenu = document.getElementById('central-menu');

    if (!centralNav || !centralButton || !centralMenu) return;

    if (centralButton.dataset.centralBound !== 'true') {
        centralButton.dataset.centralBound = 'true';
        centralButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleMenu();
        });

        centralButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu();
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setMenuOpen(true);
                centralMenu.querySelector('button')?.focus();
            }
        });
    }

    const shopButton = document.getElementById('nav-shop');
    if (shopButton && shopButton.dataset.shopBound !== 'true') {
        shopButton.dataset.shopBound = 'true';
        shopButton.addEventListener('click', openShopPage);
        shopButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') openShopPage(event);
        });
    }
};

const wireGlobalEvents = () => {
    document.addEventListener('click', (event) => {
        if (!centralNav?.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            closeShopPage();
        }
    });

    document.addEventListener('click', (event) => {
        const menuAction = event.target.closest?.('#central-menu button');
        if (!menuAction || menuAction.id === 'nav-shop') return;
        closeMenu();
    }, true);

    window.addEventListener('pageshow', bindCentralMenu);
    window.addEventListener('focus', bindCentralMenu);

    window.addEventListener('tardis:shop-updated', () => {
        if (shopPage?.classList.contains('active')) refreshShop();
    });
};

const initCentralMenu = () => {
    bindCentralMenu();
    createShopPage();
    renderShop();
    wireGlobalEvents();

    window.TardisCentral = {
        open: () => setMenuOpen(true),
        close: closeMenu,
        toggle: toggleMenu,
        openShop: openShopPage,
        closeShop: closeShopPage,
        refreshShop,
        rebind: bindCentralMenu
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCentralMenu, { once: true });
} else {
    initCentralMenu();
}
