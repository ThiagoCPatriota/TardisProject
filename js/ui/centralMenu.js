// ============================================
// T.A.R.D.I.S. — Central Menu
// Um único menu para Perfil, Conquistas, Ranking e Loja Cósmica.
// ============================================
import { getCurrentSession } from '../auth/authService.js';
import { closeCosmicShop, initCosmicShop, openCosmicShop } from '../shop/cosmicShop.js';

let centralNav = null;
let centralButton = null;
let centralMenu = null;

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
            message: 'Entre na sua conta para acessar a Loja Cósmica e usar seus Fragmentos Estelares.',
            messageType: 'warning'
        }
    }));
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

    await openCosmicShop(event);
};

function closeShopPage() {
    closeCosmicShop();
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
    initCosmicShop();
    bindCentralMenu();
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
