// ============================================
// T.A.R.D.I.S. — Achievements Page
// Página visual + conquistas vinculadas à conta Supabase.
// ============================================
import { ACHIEVEMENTS_DATA, ACHIEVEMENT_CATEGORIES, RARITY_META } from '../data/achievementsData.js';
import {
    loadAchievementState,
    getAchievementEntry,
    getUnlockedCount,
    getCompletionPercent,
    unlockAchievement,
    addAchievementProgress,
    trackUniqueMetaItem,
    setAchievementSession,
    hasActiveAchievementUser,
    getLastAchievementSyncError
} from './achievementStore.js';
import { getCurrentSession, onAuthStateChange } from '../auth/authService.js';

let page = null;
let grid = null;
let detailPanel = null;
let activeCategory = 'Todas';
let activeStatus = 'all';
let selectedAchievementId = ACHIEVEMENTS_DATA[0]?.id || null;
let toastTimer = null;
let pendingOpenAfterLogin = false;
let isOpeningPage = false;

const STATUS_LABELS = {
    all: 'Todas',
    unlocked: 'Desbloqueadas',
    progress: 'Em progresso',
    locked: 'Bloqueadas'
};

const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(isoDate));
};

const getAchievementStatus = (achievement, entry) => {
    if (entry.unlockedAt) return 'unlocked';
    if ((entry.progress || 0) > 0) return 'progress';
    return 'locked';
};

const getFilteredAchievements = (state) => {
    return ACHIEVEMENTS_DATA.filter((achievement) => {
        const entry = getAchievementEntry(state, achievement.id);
        const status = getAchievementStatus(achievement, entry);
        const categoryOk = activeCategory === 'Todas' || achievement.category === activeCategory;
        const statusOk = activeStatus === 'all' || activeStatus === status;
        return categoryOk && statusOk;
    });
};

const updateNavCount = (state = loadAchievementState()) => {
    const countEl = document.getElementById('badges-count');
    if (!countEl) return;
    countEl.textContent = hasActiveAchievementUser() ? getUnlockedCount(state) : 0;
};

const requestLoginForAchievements = () => {
    pendingOpenAfterLogin = true;
    document.dispatchEvent(new CustomEvent('tardis:auth-open', {
        detail: {
            mode: 'login',
            message: 'Entre ou crie sua conta para visualizar e salvar suas conquistas.',
            messageType: 'warning'
        }
    }));
};

const showAchievementToast = (achievement) => {
    if (!achievement || !hasActiveAchievementUser()) return;

    let toast = document.getElementById('achievement-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'achievement-toast';
        toast.className = 'achievement-toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <img src="${achievement.image}" alt="" class="achievement-toast-img">
        <div class="achievement-toast-copy">
            <span>Conquista desbloqueada</span>
            <strong>${escapeHTML(achievement.title)}</strong>
        </div>
    `;

    toast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('active'), 4200);
};

const renderSummary = (state) => {
    const unlocked = getUnlockedCount(state);
    const total = ACHIEVEMENTS_DATA.length;
    const percent = getCompletionPercent(state);
    const points = state.totalAchievementPoints || 0;

    page.querySelector('#achievements-summary-unlocked').textContent = `${unlocked}/${total}`;
    page.querySelector('#achievements-summary-percent').textContent = `${percent}%`;
    page.querySelector('#achievements-summary-points').textContent = points;
    page.querySelector('#achievements-progress-fill').style.width = `${percent}%`;

    const syncWarning = page.querySelector('#achievements-sync-warning');
    const syncError = getLastAchievementSyncError();
    if (syncWarning) {
        syncWarning.classList.toggle('active', Boolean(syncError));
        syncWarning.textContent = syncError
            ? 'As conquistas estão em cache local nesta sessão. Verifique se a tabela user_achievements foi criada no Supabase.'
            : '';
    }
};

const renderFilters = () => {
    const categoryBox = page.querySelector('#achievements-category-filters');
    categoryBox.innerHTML = ACHIEVEMENT_CATEGORIES.map((category) => `
        <button class="ach-filter ${activeCategory === category ? 'active' : ''}" data-category="${escapeHTML(category)}" type="button">
            ${escapeHTML(category)}
        </button>
    `).join('');

    const statusBox = page.querySelector('#achievements-status-filters');
    statusBox.innerHTML = Object.entries(STATUS_LABELS).map(([status, label]) => `
        <button class="ach-filter ach-filter-status ${activeStatus === status ? 'active' : ''}" data-status="${status}" type="button">
            ${label}
        </button>
    `).join('');
};

const renderCards = (state) => {
    const achievements = getFilteredAchievements(state);

    if (!achievements.length) {
        grid.innerHTML = `
            <div class="ach-empty-state">
                <strong>Nenhuma conquista encontrada.</strong>
                <span>Tente mudar o filtro para ver outras missões.</span>
            </div>
        `;
        return;
    }

    grid.innerHTML = achievements.map((achievement) => {
        const entry = getAchievementEntry(state, achievement.id);
        const status = getAchievementStatus(achievement, entry);
        const rarity = RARITY_META[achievement.rarity] || RARITY_META.common;
        const progress = Math.min(entry.progress || 0, achievement.maxProgress);
        const progressPercent = Math.round((progress / achievement.maxProgress) * 100);
        const lockedLabel = status === 'locked' ? 'Bloqueada' : status === 'progress' ? 'Em progresso' : 'Desbloqueada';
        const isSelected = selectedAchievementId === achievement.id;

        return `
            <article class="achievement-card ${status} ${rarity.className} ${isSelected ? 'selected' : ''}" data-achievement-id="${achievement.id}" tabindex="0" role="button" aria-label="Ver detalhes da conquista ${escapeHTML(achievement.title)}">
                <div class="achievement-image-shell">
                    <img src="${achievement.image}" alt="Imagem da conquista ${escapeHTML(achievement.title)}" class="achievement-image" loading="lazy">
                    <span class="achievement-lock" aria-hidden="true"></span>
                </div>
                <div class="achievement-card-body">
                    <div class="achievement-card-topline">
                        <span class="achievement-rarity">${rarity.label}</span>
                        <span class="achievement-status-pill">${lockedLabel}</span>
                    </div>
                    <h3>${escapeHTML(achievement.title)}</h3>
                    <p>${escapeHTML(achievement.description)}</p>
                    <div class="achievement-progress-row">
                        <span>${progress}/${achievement.maxProgress} ${achievement.progressLabel || ''}</span>
                        <span>${progressPercent}%</span>
                    </div>
                    <div class="achievement-progress-track">
                        <div class="achievement-progress-fill" style="width:${progressPercent}%"></div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
};

const renderDetail = (state) => {
    const achievement = ACHIEVEMENTS_DATA.find((item) => item.id === selectedAchievementId) || ACHIEVEMENTS_DATA[0];
    if (!achievement) return;

    const entry = getAchievementEntry(state, achievement.id);
    const status = getAchievementStatus(achievement, entry);
    const rarity = RARITY_META[achievement.rarity] || RARITY_META.common;
    const progress = Math.min(entry.progress || 0, achievement.maxProgress);
    const progressPercent = Math.round((progress / achievement.maxProgress) * 100);

    detailPanel.innerHTML = `
        <div class="achievement-detail-card ${status} ${rarity.className}">
            <img src="${achievement.image}" alt="Imagem da conquista ${escapeHTML(achievement.title)}" class="achievement-detail-image">
            <span class="achievement-detail-kicker">${escapeHTML(achievement.category)}</span>
            <h2>${escapeHTML(achievement.title)}</h2>
            <p>${escapeHTML(achievement.detail || achievement.description)}</p>

            <div class="achievement-detail-meta">
                <div>
                    <span>Raridade</span>
                    <strong>${rarity.label}</strong>
                </div>
                <div>
                    <span>Recompensa</span>
                    <strong>${achievement.pointsReward || 0} pts</strong>
                </div>
                <div>
                    <span>Status</span>
                    <strong>${status === 'unlocked' ? 'Desbloqueada' : status === 'progress' ? 'Em progresso' : 'Bloqueada'}</strong>
                </div>
            </div>

            <div class="achievement-detail-progress">
                <div class="achievement-progress-row">
                    <span>Progresso</span>
                    <span>${progress}/${achievement.maxProgress}</span>
                </div>
                <div class="achievement-progress-track">
                    <div class="achievement-progress-fill" style="width:${progressPercent}%"></div>
                </div>
            </div>

            ${entry.unlockedAt ? `<div class="achievement-unlocked-date">Desbloqueada em ${formatDate(entry.unlockedAt)}</div>` : ''}
        </div>
    `;
};

const render = () => {
    if (!page) return;
    const state = loadAchievementState();
    renderSummary(state);
    renderFilters();
    renderCards(state);
    renderDetail(state);
    updateNavCount(state);
};

const openPage = async () => {
    if (isOpeningPage) return;
    isOpeningPage = true;

    const session = await getCurrentSession();
    if (!session?.user) {
        isOpeningPage = false;
        requestLoginForAchievements();
        return;
    }

    await setAchievementSession(session);
    unlockAchievement('novo-explorador');
    unlockAchievement('primeiro-salto');
    unlockAchievement('painel-de-bordo');

    page.classList.add('active');
    page.setAttribute('aria-hidden', 'false');
    document.body.classList.add('achievements-open');
    render();
    isOpeningPage = false;

    setTimeout(() => {
        page.querySelector('#achievements-close')?.focus();
    }, 50);
};

const closePage = () => {
    page.classList.remove('active');
    page.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('achievements-open');
};

const createPage = () => {
    page = document.createElement('div');
    page.id = 'achievements-page';
    page.className = 'achievements-page';
    page.setAttribute('aria-hidden', 'true');

    page.innerHTML = `
        <div class="achievements-backdrop"></div>
        <section class="achievements-shell" role="dialog" aria-modal="true" aria-labelledby="achievements-title">
            <header class="achievements-header">
                <div class="achievements-title-block">
                    <span class="achievements-kicker">PAINEL DE BORDO</span>
                    <h1 id="achievements-title">Conquistas</h1>
                    <p>Acompanhe suas descobertas e marcos como explorador espacial. Seu progresso fica salvo na sua conta.</p>
                </div>
                <button class="achievements-close" id="achievements-close" type="button" aria-label="Fechar conquistas">✕</button>
            </header>

            <section class="achievements-summary">
                <div class="achievements-summary-card">
                    <span>Desbloqueadas</span>
                    <strong id="achievements-summary-unlocked">0/0</strong>
                </div>
                <div class="achievements-summary-card">
                    <span>Progresso geral</span>
                    <strong id="achievements-summary-percent">0%</strong>
                </div>
                <div class="achievements-summary-card">
                    <span>Pontos de conquista</span>
                    <strong id="achievements-summary-points">0</strong>
                </div>
            </section>

            <div class="achievements-progress-global" aria-label="Progresso geral das conquistas">
                <div id="achievements-progress-fill"></div>
            </div>

            <div class="achievements-sync-warning" id="achievements-sync-warning" role="status"></div>

            <nav class="achievements-filters" aria-label="Filtros de conquistas">
                <div class="achievements-filter-row" id="achievements-category-filters"></div>
                <div class="achievements-filter-row achievements-status-row" id="achievements-status-filters"></div>
            </nav>

            <main class="achievements-content">
                <section class="achievements-grid" id="achievements-grid" aria-label="Lista de conquistas"></section>
                <aside class="achievement-detail-panel" id="achievement-detail-panel" aria-label="Detalhes da conquista selecionada"></aside>
            </main>
        </section>
    `;

    document.body.appendChild(page);
    grid = page.querySelector('#achievements-grid');
    detailPanel = page.querySelector('#achievement-detail-panel');
};

const wirePageEvents = () => {
    const navBadges = document.getElementById('nav-badges');
    if (navBadges) {
        navBadges.setAttribute('role', 'button');
        navBadges.setAttribute('tabindex', '0');
        navBadges.setAttribute('aria-label', 'Abrir conquistas');
        navBadges.addEventListener('click', openPage);
        navBadges.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPage();
            }
        });
    }

    page.querySelector('#achievements-close')?.addEventListener('click', closePage);
    page.querySelector('.achievements-backdrop')?.addEventListener('click', closePage);

    page.addEventListener('wheel', (event) => {
        event.stopPropagation();
    }, { passive: true });

    page.addEventListener('touchmove', (event) => {
        event.stopPropagation();
    }, { passive: true });

    page.addEventListener('click', (event) => {
        const categoryButton = event.target.closest('[data-category]');
        if (categoryButton) {
            activeCategory = categoryButton.dataset.category;
            render();
            return;
        }

        const statusButton = event.target.closest('[data-status]');
        if (statusButton) {
            activeStatus = statusButton.dataset.status;
            render();
            return;
        }

        const card = event.target.closest('[data-achievement-id]');
        if (card) {
            selectedAchievementId = card.dataset.achievementId;
            render();
        }
    });

    page.addEventListener('keydown', (event) => {
        const card = event.target.closest('[data-achievement-id]');
        if (card && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            selectedAchievementId = card.dataset.achievementId;
            render();
        }

        if (event.key === 'Escape') closePage();
    });
};

const unlockSessionStartAchievements = () => {
    if (!hasActiveAchievementUser()) return;
    unlockAchievement('novo-explorador');
    unlockAchievement('primeiro-salto');
};

const wireAchievementTriggers = async () => {
    const session = await getCurrentSession();
    await setAchievementSession(session);
    unlockSessionStartAchievements();

    onAuthStateChange(async (_event, sessionData) => {
        await setAchievementSession(sessionData);

        if (sessionData?.user) {
            unlockSessionStartAchievements();
            if (pendingOpenAfterLogin) {
                pendingOpenAfterLogin = false;
                setTimeout(() => {
                    window.TardisAuth?.close?.();
                    openPage();
                }, 300);
            }
        } else {
            closePage();
            updateNavCount(loadAchievementState());
        }
    });

    window.addEventListener('tardis:auth-success', async (event) => {
        const session = event.detail?.session || await getCurrentSession();
        await setAchievementSession(session);
        unlockSessionStartAchievements();

        if (pendingOpenAfterLogin) {
            pendingOpenAfterLogin = false;
            setTimeout(() => {
                window.TardisAuth?.close?.();
                openPage();
            }, 300);
        }
    });

    window.addEventListener('tardis:achievements-updated', (event) => {
        updateNavCount(event.detail.state);
        if (event.detail.unlockedAchievement) showAchievementToast(event.detail.unlockedAchievement);
        render();
    });

    window.addEventListener('tardis:adventure-started', () => {
        unlockAchievement('chamado-da-galaxia');
    });

    window.addEventListener('tardis:question-answered', (event) => {
        unlockAchievement('primeira-missao');
        if (event.detail.correct) {
            unlockAchievement('resposta-certeira');
            addAchievementProgress('primeiros-10-pontos', 10);
        }
    });

    window.addEventListener('tardis:adventure-completed', () => {
        unlockAchievement('aprendiz-do-doutor');
    });

    window.addEventListener('tardis:planet-entered', (event) => {
        unlockAchievement('primeira-aterrissagem');
        trackUniqueMetaItem('turista-espacial', 'visitedPlanets', event.detail.planetNameEN || event.detail.planetName);
    });

    document.getElementById('detail-btn')?.addEventListener('click', () => {
        unlockAchievement('curioso-do-cosmos');
    });

    document.getElementById('apod-header-click')?.addEventListener('click', () => {
        unlockAchievement('imagem-do-dia');
    });
};

const initAchievements = async () => {
    createPage();
    wirePageEvents();
    await wireAchievementTriggers();
    render();

    window.TardisAchievements = {
        unlock: unlockAchievement,
        addProgress: addAchievementProgress,
        open: openPage,
        close: closePage
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAchievements, { once: true });
} else {
    initAchievements();
}
