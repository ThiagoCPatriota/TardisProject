// ============================================
// T.A.R.D.I.S. — Ranking dos Exploradores
// Ranking geral baseado na quantidade de conquistas desbloqueadas no Supabase.
// ============================================
import { supabase, getCurrentSession, onAuthStateChange } from '../auth/authService.js';

let rankingPage = null;
let rankingList = null;
let rankingPodium = null;
let rankingStatus = null;
let rankingSummary = null;
let isLoadingRanking = false;

const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

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

const getInitials = (name = 'Explorador') => {
    const parts = cleanExplorerName(name).split(' ').filter(Boolean);
    const initials = parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return initials || 'EX';
};

const formatDate = (isoDate) => {
    if (!isoDate) return '—';

    try {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(isoDate));
    } catch (_error) {
        return '—';
    }
};

const requestLoginForRanking = () => {
    document.dispatchEvent(new CustomEvent('tardis:auth-open', {
        detail: {
            mode: 'login',
            message: 'Entre na sua conta para ver e participar do ranking dos exploradores.',
            messageType: 'warning'
        }
    }));
};

const setStatus = (message = '', type = 'info') => {
    if (!rankingStatus) return;
    rankingStatus.textContent = message;
    rankingStatus.className = `ranking-status ${message ? 'active' : ''} ${type}`;
};

const ensureExplorerProfile = async (session) => {
    if (!supabase || !session?.user) return;

    try {
        await supabase
            .from('profiles')
            .upsert({
                id: session.user.id,
                explorer_name: getExplorerName(session.user),
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
    } catch (error) {
        console.warn('[Ranking] Não foi possível sincronizar o perfil público:', error?.message || error);
    }
};

const getFallbackRanking = async (session) => {
    if (!session?.user || !window.TardisAchievements) return [];

    // Fallback visual para não deixar a página vazia caso o SQL do ranking ainda não tenha sido executado.
    // O ranking real vem de public.get_achievement_ranking() no Supabase.
    return [];
};

const loadRankingRows = async (session) => {
    if (!supabase) {
        throw new Error('Supabase ainda não está configurado.');
    }

    await ensureExplorerProfile(session);

    const { data, error } = await supabase.rpc('get_achievement_ranking', {
        limit_count: 50
    });

    if (error) throw error;

    return Array.isArray(data) ? data : [];
};

const getPodiumOrder = (rows) => {
    const top = rows.slice(0, 3);
    // Visualmente o 1º fica no centro; esquerda 2º, direita 3º.
    return [top[1], top[0], top[2]].filter(Boolean);
};

const renderPodium = (rows, currentUserId) => {
    if (!rankingPodium) return;

    const podiumRows = getPodiumOrder(rows);

    if (!podiumRows.length) {
        rankingPodium.innerHTML = `
            <div class="ranking-empty-podium">
                <strong>Nenhum explorador no pódio ainda.</strong>
                <span>Desbloqueie conquistas para aparecer aqui.</span>
            </div>
        `;
        return;
    }

    rankingPodium.innerHTML = podiumRows.map((row) => {
        const rank = Number(row.rank || 0);
        const name = row.explorer_name || 'Explorador';
        const isCurrentUser = row.user_id === currentUserId;

        return `
            <article class="ranking-podium-card rank-${rank} ${isCurrentUser ? 'current-user' : ''}">
                <div class="ranking-medal">${rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</div>
                <div class="ranking-avatar">${escapeHTML(getInitials(name))}</div>
                <span class="ranking-place">${rank}º lugar</span>
                <h3>${escapeHTML(name)}</h3>
                <strong>${Number(row.unlocked_count || 0)}</strong>
                <span>conquistas</span>
            </article>
        `;
    }).join('');
};

const renderList = (rows, currentUserId) => {
    if (!rankingList) return;

    if (!rows.length) {
        rankingList.innerHTML = `
            <div class="ranking-empty-list">
                <strong>Ainda não há ranking.</strong>
                <span>Quando os exploradores desbloquearem conquistas, eles aparecerão aqui.</span>
            </div>
        `;
        return;
    }

    rankingList.innerHTML = rows.map((row) => {
        const name = row.explorer_name || 'Explorador';
        const isCurrentUser = row.user_id === currentUserId;

        return `
            <article class="ranking-row ${isCurrentUser ? 'current-user' : ''}">
                <span class="ranking-row-rank">#${Number(row.rank || 0)}</span>
                <span class="ranking-row-avatar">${escapeHTML(getInitials(name))}</span>
                <span class="ranking-row-name">
                    <strong>${escapeHTML(name)}</strong>
                    ${isCurrentUser ? '<em>Você</em>' : ''}
                </span>
                <span class="ranking-row-score">${Number(row.unlocked_count || 0)} conquistas</span>
                <span class="ranking-row-date">Última: ${formatDate(row.last_unlock_at)}</span>
            </article>
        `;
    }).join('');
};

const renderSummary = (rows, currentUserId) => {
    if (!rankingSummary) return;

    const currentUserRow = rows.find((row) => row.user_id === currentUserId);
    const totalExplorers = rows.length;
    const topScore = Number(rows[0]?.unlocked_count || 0);

    rankingSummary.innerHTML = `
        <div class="ranking-summary-card">
            <span>Exploradores no ranking</span>
            <strong>${totalExplorers}</strong>
        </div>
        <div class="ranking-summary-card">
            <span>Maior marca</span>
            <strong>${topScore}</strong>
        </div>
        <div class="ranking-summary-card">
            <span>Sua posição</span>
            <strong>${currentUserRow ? `#${Number(currentUserRow.rank || 0)}` : '—'}</strong>
        </div>
    `;
};

const renderRanking = (rows, currentUserId) => {
    renderSummary(rows, currentUserId);
    renderPodium(rows, currentUserId);
    renderList(rows, currentUserId);
};

const loadAndRenderRanking = async () => {
    if (isLoadingRanking) return;
    isLoadingRanking = true;

    try {
        const session = await getCurrentSession();

        if (!session?.user) {
            closeRankingPage();
            requestLoginForRanking();
            return;
        }

        setStatus('Sincronizando ranking com o banco de dados...', 'info');
        rankingList.innerHTML = '<div class="ranking-loading">Carregando ranking dos exploradores...</div>';
        rankingPodium.innerHTML = '';

        const rows = await loadRankingRows(session);
        renderRanking(rows, session.user.id);
        setStatus(rows.length ? '' : 'Ainda não há conquistas desbloqueadas suficientes para montar o ranking.', 'warning');
    } catch (error) {
        console.warn('[Ranking] Falha ao carregar ranking:', error?.message || error);
        const session = await getCurrentSession();
        const fallbackRows = await getFallbackRanking(session);
        renderRanking(fallbackRows, session?.user?.id);
        setStatus('Não foi possível carregar o ranking do Supabase. Execute docs/SUPABASE_RANKING_SETUP.sql no SQL Editor e tente novamente.', 'error');
    } finally {
        isLoadingRanking = false;
    }
};

const closeAchievementsPageIfOpen = () => {
    window.TardisAchievements?.close?.();

    // Defesa extra: caso o módulo de conquistas ainda não tenha exposto a API
    // ou algum estado antigo tenha ficado preso após navegar/voltar no browser.
    const achievementsPage = document.getElementById('achievements-page');
    achievementsPage?.classList.remove('active');
    achievementsPage?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('achievements-open');
};

function openRankingPage() {
    if (!rankingPage) return;
    closeAchievementsPageIfOpen();
    rankingPage.classList.add('active');
    rankingPage.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ranking-open');
    loadAndRenderRanking();
}

function closeRankingPage() {
    if (!rankingPage) return;
    rankingPage.classList.remove('active');
    rankingPage.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ranking-open');
}

const openRankingFromNav = async (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();

    const session = await getCurrentSession();
    if (!session?.user) {
        requestLoginForRanking();
        return;
    }

    openRankingPage();
};

const createRankingPage = () => {
    rankingPage = document.createElement('div');
    rankingPage.id = 'ranking-page';
    rankingPage.className = 'ranking-page';
    rankingPage.setAttribute('aria-hidden', 'true');

    rankingPage.innerHTML = `
        <div class="ranking-backdrop"></div>
        <section class="ranking-shell" role="dialog" aria-modal="true" aria-labelledby="ranking-title">
            <header class="ranking-header">
                <div class="ranking-title-block">
                    <span class="ranking-kicker">HALL DOS EXPLORADORES</span>
                    <h1 id="ranking-title">Ranking</h1>
                    <p>O pódio é definido pela quantidade de conquistas desbloqueadas. Quanto mais você explora, mais alto chega.</p>
                </div>
                <button class="ranking-close" id="ranking-close" type="button" aria-label="Fechar ranking">✕</button>
            </header>

            <section class="ranking-summary" id="ranking-summary"></section>
            <div class="ranking-status" id="ranking-status" role="status"></div>
            <section class="ranking-podium" id="ranking-podium" aria-label="Pódio dos três melhores exploradores"></section>

            <section class="ranking-board" aria-label="Lista geral do ranking">
                <div class="ranking-board-head">
                    <span>Posição</span>
                    <span>Explorador</span>
                    <span>Conquistas</span>
                    <span>Última conquista</span>
                </div>
                <div class="ranking-list" id="ranking-list"></div>
            </section>
        </section>
    `;

    document.body.appendChild(rankingPage);
    rankingList = rankingPage.querySelector('#ranking-list');
    rankingPodium = rankingPage.querySelector('#ranking-podium');
    rankingStatus = rankingPage.querySelector('#ranking-status');
    rankingSummary = rankingPage.querySelector('#ranking-summary');
};

const bindRankingButton = () => {
    const rankingButton = document.getElementById('nav-ranking');
    if (!rankingButton) return;

    rankingButton.setAttribute('role', 'button');
    rankingButton.setAttribute('tabindex', '0');
    rankingButton.setAttribute('aria-label', 'Abrir ranking dos exploradores');

    if (rankingButton.dataset.rankingBound === 'true') return;
    rankingButton.dataset.rankingBound = 'true';

    rankingButton.addEventListener('click', openRankingFromNav);
    rankingButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            openRankingFromNav(event);
        }
    });
};

const wireRankingEvents = () => {
    bindRankingButton();

    // Listener delegado e capturado: se outro módulo recriar a navbar, se o usuário
    // navegar e voltar pelo bfcache, ou se o listener direto for perdido, o botão
    // continua funcionando.
    document.addEventListener('click', (event) => {
        const rankingButton = event.target.closest?.('#nav-ranking');
        if (!rankingButton) return;
        openRankingFromNav(event);
    }, true);

    document.addEventListener('keydown', (event) => {
        const rankingButton = event.target.closest?.('#nav-ranking');
        if (!rankingButton || (event.key !== 'Enter' && event.key !== ' ')) return;
        openRankingFromNav(event);
    }, true);

    document.addEventListener('tardis:open-ranking', openRankingFromNav);

    window.addEventListener('pageshow', () => {
        bindRankingButton();
        rankingPage?.classList.toggle('active', rankingPage?.getAttribute('aria-hidden') === 'false');
    });

    rankingPage.querySelector('#ranking-close')?.addEventListener('click', closeRankingPage);
    rankingPage.querySelector('.ranking-backdrop')?.addEventListener('click', closeRankingPage);

    rankingPage.addEventListener('wheel', (event) => {
        event.stopPropagation();
    }, { passive: true });

    rankingPage.addEventListener('touchmove', (event) => {
        event.stopPropagation();
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && rankingPage.classList.contains('active')) {
            closeRankingPage();
        }
    });
};

const syncProfileOnAuth = async () => {
    const session = await getCurrentSession();
    await ensureExplorerProfile(session);

    onAuthStateChange(async (_event, sessionData) => {
        await ensureExplorerProfile(sessionData);
        if (!sessionData?.user) closeRankingPage();
    });
};

const initRanking = async () => {
    createRankingPage();
    wireRankingEvents();
    await syncProfileOnAuth();

    window.TardisRanking = {
        open: openRankingPage,
        openFromNav: openRankingFromNav,
        close: closeRankingPage,
        refresh: loadAndRenderRanking,
        rebindButton: bindRankingButton
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRanking, { once: true });
} else {
    initRanking();
}
