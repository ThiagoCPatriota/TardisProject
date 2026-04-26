const RANKING_TOAST_ID = 'ranking-coming-soon-toast';
let toastTimer = null;

const getCurrentSession = async () => {
    try {
        return await window.TardisAuth?.getSession?.();
    } catch (_error) {
        return null;
    }
};

const showRankingToast = (message) => {
    let toast = document.getElementById(RANKING_TOAST_ID);

    if (!toast) {
        toast = document.createElement('div');
        toast.id = RANKING_TOAST_ID;
        toast.className = 'ranking-coming-soon-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('active');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('active');
    }, 3400);
};

const initRankingButton = () => {
    const rankingButton = document.getElementById('nav-ranking');
    if (!rankingButton) return;

    rankingButton.addEventListener('click', async () => {
        const session = await getCurrentSession();

        if (!session?.user) {
            window.dispatchEvent(new CustomEvent('tardis:auth-open', {
                detail: {
                    mode: 'login',
                    message: 'Faça login para participar do futuro ranking de exploradores.',
                    messageType: 'warning'
                }
            }));
            return;
        }

        showRankingToast('Ranking dos exploradores em breve. A próxima etapa será conectar pontuação e conquistas ao Supabase.');
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRankingButton, { once: true });
} else {
    initRankingButton();
}
