// ============================================
// T.A.R.D.I.S. — Central Menu
// Um único menu para Perfil, Conquistas, Ranking e Loja Cósmica.
// ============================================
import { getCurrentSession } from '../auth/authService.js';

let centralNav = null;
let centralButton = null;
let centralMenu = null;
let shopPage = null;

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
            message: 'Entre na sua conta para acessar a futura Loja Cósmica.',
            messageType: 'warning'
        }
    }));
};

const createShopPage = () => {
    if (document.getElementById('shop-page')) {
        shopPage = document.getElementById('shop-page');
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
                <div>
                    <span class="shop-kicker">LOJA CÓSMICA</span>
                    <h2 id="shop-title">Em construção</h2>
                    <p>
                        Em breve, você poderá gastar <strong>Fragmentos Estelares</strong> para comprar cosméticos,
                        enfeitar seu explorador e mostrar seu estilo no ranking.
                    </p>
                </div>
                <button class="shop-close" id="shop-close" type="button" aria-label="Fechar loja">✕</button>
            </header>

            <div class="shop-preview-grid" aria-label="Prévia da loja cósmica">
                <article class="shop-preview-card">
                    <strong>Cosméticos</strong>
                    <span>Coroas, auras, roupas, molduras e acessórios para o avatar.</span>
                </article>
                <article class="shop-preview-card">
                    <strong>Fragmentos Estelares</strong>
                    <span>Moeda gastável recebida ao desbloquear conquistas.</span>
                </article>
                <article class="shop-preview-card">
                    <strong>Ranking visual</strong>
                    <span>Itens equipados poderão aparecer no perfil e no ranking.</span>
                </article>
            </div>
        </section>
    `;

    document.body.appendChild(shopPage);

    shopPage.querySelector('#shop-close')?.addEventListener('click', closeShopPage);
    shopPage.querySelector('.shop-backdrop')?.addEventListener('click', closeShopPage);
    shopPage.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
    shopPage.addEventListener('touchmove', (event) => event.stopPropagation(), { passive: true });
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
};

const initCentralMenu = () => {
    bindCentralMenu();
    createShopPage();
    wireGlobalEvents();

    window.TardisCentral = {
        open: () => setMenuOpen(true),
        close: closeMenu,
        toggle: toggleMenu,
        openShop: openShopPage,
        closeShop: closeShopPage,
        rebind: bindCentralMenu
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCentralMenu, { once: true });
} else {
    initCentralMenu();
}
