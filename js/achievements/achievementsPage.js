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
    setAchievementProgress,
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
let searchTerm = '';
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

const isSecretLocked = (achievement, entry) => {
    return Boolean(achievement.hidden && !entry.unlockedAt);
};

const getPublicAchievementText = (achievement, entry) => {
    if (!isSecretLocked(achievement, entry)) {
        return {
            title: achievement.title,
            description: achievement.description,
            detail: achievement.detail || achievement.description,
            category: achievement.category
        };
    }

    return {
        title: 'Conquista secreta',
        description: 'Continue explorando a T.A.R.D.I.S. para revelar esta conquista.',
        detail: 'Esta conquista está oculta. Ela será revelada quando você descobrir a combinação certa de exploração, conhecimento ou desempenho.',
        category: 'Segredo bloqueado'
    };
};

const getFilteredAchievements = (state) => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase('pt-BR');

    return ACHIEVEMENTS_DATA.filter((achievement) => {
        const entry = getAchievementEntry(state, achievement.id);
        const status = getAchievementStatus(achievement, entry);
        const categoryOk = activeCategory === 'Todas' || achievement.category === activeCategory;
        const statusOk = activeStatus === 'all' || activeStatus === status;
        const publicText = getPublicAchievementText(achievement, entry);
        const searchOk = !normalizedSearch || [
            publicText.title,
            publicText.description,
            publicText.detail,
            publicText.category,
            RARITY_META[achievement.rarity]?.label
        ].filter(Boolean).join(' ').toLocaleLowerCase('pt-BR').includes(normalizedSearch);

        return categoryOk && statusOk && searchOk;
    });
};

const updateNavCount = (state = loadAchievementState()) => {
    const countEl = document.getElementById('badges-count');
    if (!countEl) return;
    countEl.textContent = hasActiveAchievementUser() ? getUnlockedCount(state) : 0;
};

const normalizeKey = (value = '') => String(value).trim();

const getTriggeredAchievements = (type, predicate = () => true) => {
    return ACHIEVEMENTS_DATA.filter((achievement) => {
        const trigger = achievement.trigger;
        return trigger?.type === type && predicate(trigger, achievement);
    });
};

const unlockTriggered = (type, meta = {}, predicate = () => true) => {
    if (!hasActiveAchievementUser()) return;
    getTriggeredAchievements(type, predicate).forEach((achievement) => {
        unlockAchievement(achievement.id, meta);
    });
};

const addTriggeredProgress = (type, amount = 1, meta = {}, predicate = () => true) => {
    if (!hasActiveAchievementUser()) return;
    getTriggeredAchievements(type, predicate).forEach((achievement) => {
        addAchievementProgress(achievement.id, amount, meta);
    });
};

const trackTriggeredUnique = (type, metaKey, itemValue, predicate = () => true) => {
    if (!hasActiveAchievementUser() || !itemValue) return;
    getTriggeredAchievements(type, predicate).forEach((achievement) => {
        trackUniqueMetaItem(achievement.id, metaKey, itemValue);
    });
};

let lastLoginTrackAt = 0;
let correctAnswerStreak = 0;
let syncingBalancedExplorer = false;

const trackDailyActivity = () => {
    if (!hasActiveAchievementUser()) return;

    const today = new Date().toISOString().slice(0, 10);
    trackTriggeredUnique('active_day', 'activeDays', today);
};

const trackLoginSession = () => {
    if (!hasActiveAchievementUser()) return;

    const now = Date.now();
    const shouldCountSession = now - lastLoginTrackAt > 1500;
    lastLoginTrackAt = now;

    unlockTriggered('account_login');
    if (shouldCountSession) {
        addTriggeredProgress('login_session_count', 1);
    }
    trackDailyActivity();
};

const handleAchievementsPanelOpened = () => {
    if (!hasActiveAchievementUser()) return;

    unlockTriggered('achievements_open');
    addTriggeredProgress('achievements_open_count', 1);
};

const trackPlanetGroups = (planetNameEN) => {
    trackTriggeredUnique(
        'planet_group',
        'visitedGroupPlanets',
        planetNameEN,
        (trigger) => Array.isArray(trigger.planets) && trigger.planets.includes(planetNameEN)
    );
};

const trackDetailGroups = (planetNameEN) => {
    trackTriggeredUnique(
        'detail_group',
        'detailGroupPlanets',
        planetNameEN,
        (trigger) => Array.isArray(trigger.planets) && trigger.planets.includes(planetNameEN)
    );
};

const trackMissionGroups = (missionKey) => {
    trackTriggeredUnique(
        'mission_group',
        'missionGroupKeys',
        missionKey,
        (trigger) => Array.isArray(trigger.missions) && trigger.missions.includes(missionKey)
    );
};

let syncingAchievementTotal = false;

const syncAchievementTotalMilestones = (state = loadAchievementState()) => {
    if (!hasActiveAchievementUser() || syncingAchievementTotal) return;

    const totalUnlocked = getUnlockedCount(state);
    const totalMilestones = getTriggeredAchievements('achievement_unlocked_total');
    if (!totalMilestones.length) return;

    syncingAchievementTotal = true;
    try {
        totalMilestones.forEach((achievement) => {
            const entry = getAchievementEntry(state, achievement.id);
            const nextProgress = Math.min(totalUnlocked, achievement.maxProgress);
            if (!entry.unlockedAt && Number(entry.progress || 0) !== nextProgress) {
                setAchievementProgress(achievement.id, nextProgress, { totalUnlocked });
            }
        });
    } finally {
        syncingAchievementTotal = false;
    }
};

const getMetaCount = (state, achievementId, metaKey) => {
    const entry = getAchievementEntry(state, achievementId);
    const value = entry.meta?.[metaKey];
    return Array.isArray(value) ? value.length : 0;
};

const syncBalancedExplorer = (state = loadAchievementState()) => {
    if (!hasActiveAchievementUser() || syncingBalancedExplorer) return;

    const balancedAchievements = getTriggeredAchievements('balanced_explorer');
    if (!balancedAchievements.length) return;

    const visitedPlanets = getMetaCount(state, 'mapa-celeste-completo', 'visitedPlanets');
    const viewedMissions = getMetaCount(state, 'missoes-unicas-5', 'missions');
    const correctAnswers = Number(getAchievementEntry(state, 'acertos-10').progress || 0);

    const steps = [
        visitedPlanets >= 5,
        viewedMissions >= 5,
        correctAnswers >= 10
    ].filter(Boolean).length;

    syncingBalancedExplorer = true;
    try {
        balancedAchievements.forEach((achievement) => {
            const entry = getAchievementEntry(state, achievement.id);
            const nextProgress = Math.min(steps, achievement.maxProgress);
            if (!entry.unlockedAt && Number(entry.progress || 0) !== nextProgress) {
                setAchievementProgress(achievement.id, nextProgress, {
                    visitedPlanets,
                    viewedMissions,
                    correctAnswers
                });
            }
        });
    } finally {
        syncingBalancedExplorer = false;
    }
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

const achievementExists = (achievementId) => ACHIEVEMENTS_DATA.some((achievement) => achievement.id === achievementId);

const getAchievementById = (achievementId) => ACHIEVEMENTS_DATA.find((achievement) => achievement.id === achievementId) || null;

const resetAchievementViewFilters = () => {
    activeCategory = 'Todas';
    activeStatus = 'all';
    searchTerm = '';

    const searchInput = page?.querySelector('#achievements-search-input');
    if (searchInput) searchInput.value = '';
};

const escapeCSSSelector = (value = '') => {
    if (window.CSS?.escape) return CSS.escape(value);
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
};

const scrollSelectedAchievementIntoView = () => {
    if (!page || !selectedAchievementId) return;

    requestAnimationFrame(() => {
        const selectedCard = page.querySelector(`[data-achievement-id="${escapeCSSSelector(selectedAchievementId)}"]`);
        if (!selectedCard) return;

        selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        selectedCard.focus?.({ preventScroll: true });

        selectedCard.classList.add('achievement-card-inspected');
        window.setTimeout(() => selectedCard.classList.remove('achievement-card-inspected'), 1600);
    });
};

const inspectAchievement = (achievementId, options = {}) => {
    if (!achievementExists(achievementId)) return false;

    selectedAchievementId = achievementId;

    if (options.resetFilters) {
        resetAchievementViewFilters();
    }

    render();

    if (options.scroll !== false) {
        scrollSelectedAchievementIntoView();
    }

    return true;
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

    toast.dataset.achievementId = achievement.id;
    toast.setAttribute('role', 'button');
    toast.setAttribute('tabindex', '0');
    toast.setAttribute('aria-label', `Abrir detalhes da conquista ${achievement.title}`);
    toast.title = 'Clique para ver essa conquista no painel';
    toast.innerHTML = `
        <img src="${achievement.image}" alt="" class="achievement-toast-img">
        <div class="achievement-toast-copy">
            <span>Conquista desbloqueada</span>
            <strong>${escapeHTML(achievement.title)}</strong>
            <small>Clique para ver detalhes</small>
        </div>
    `;

    if (toast.dataset.bound !== 'true') {
        toast.dataset.bound = 'true';

        const openToastAchievement = () => {
            const achievementId = toast.dataset.achievementId;
            if (!achievementId) return;
            toast.classList.remove('active');
            openPage({ achievementId, resetFilters: true, scrollToAchievement: true });
        };

        toast.addEventListener('click', openToastAchievement);
        toast.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openToastAchievement();
            }
        });
    }

    toast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('active'), 6000);
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
    activeCategory = 'Todas';

    const statusBox = page.querySelector('#achievements-status-filters');
    if (!statusBox) return;

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
                <span>Tente buscar por outro nome ou alterar o status.</span>
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
        const publicText = getPublicAchievementText(achievement, entry);
        const secretClass = isSecretLocked(achievement, entry) ? 'secret-locked' : '';

        return `
            <article class="achievement-card ${status} ${rarity.className} ${secretClass} ${isSelected ? 'selected' : ''}" data-achievement-id="${achievement.id}" tabindex="0" role="button" aria-label="Ver detalhes da conquista ${escapeHTML(publicText.title)}">
                <div class="achievement-image-shell">
                    <img src="${achievement.image}" alt="Imagem da conquista ${escapeHTML(publicText.title)}" class="achievement-image" loading="lazy">
                    <span class="achievement-lock" aria-hidden="true"></span>
                </div>
                <div class="achievement-card-body">
                    <div class="achievement-card-topline">
                        <span class="achievement-rarity">${rarity.label}</span>
                        <span class="achievement-status-pill">${lockedLabel}</span>
                    </div>
                    <h3>${escapeHTML(publicText.title)}</h3>
                    <p>${escapeHTML(publicText.description)}</p>
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
    const publicText = getPublicAchievementText(achievement, entry);
    const secretClass = isSecretLocked(achievement, entry) ? 'secret-locked' : '';

    detailPanel.innerHTML = `
        <div class="achievement-detail-card ${status} ${rarity.className} ${secretClass}">
            <img src="${achievement.image}" alt="Imagem da conquista ${escapeHTML(publicText.title)}" class="achievement-detail-image">
            <span class="achievement-detail-kicker">${escapeHTML(publicText.category)}</span>
            <h2>${escapeHTML(publicText.title)}</h2>
            <p>${escapeHTML(publicText.detail)}</p>

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

const withTimeout = (promise, timeoutMs = 2500, fallback = null) => {
    let timer = null;

    return Promise.race([
        promise,
        new Promise((resolve) => {
            timer = setTimeout(() => resolve(fallback), timeoutMs);
        })
    ]).finally(() => clearTimeout(timer));
};

const safeSetAchievementSession = async (session) => {
    try {
        return await withTimeout(
            setAchievementSession(session),
            2500,
            loadAchievementState()
        );
    } catch (error) {
        console.warn('[Achievements] Não foi possível preparar a sessão de conquistas:', error);
        return loadAchievementState();
    }
};

const closeRankingPageIfOpen = () => {
    window.TardisRanking?.close?.();

    // Defesa extra: se o módulo de ranking ainda não terminou de inicializar
    // ou se o navegador voltou de outra página com estado visual preso.
    const rankingPage = document.getElementById('ranking-page');
    rankingPage?.classList.remove('active');
    rankingPage?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ranking-open');
};

const openPage = async (options = {}) => {
    if (isOpeningPage) return;
    closeRankingPageIfOpen();

    const normalizedOptions = typeof options === 'string'
        ? { achievementId: options, resetFilters: true, scrollToAchievement: true }
        : (options || {});

    const achievementToInspect = normalizedOptions.achievementId && achievementExists(normalizedOptions.achievementId)
        ? normalizedOptions.achievementId
        : null;

    if (achievementToInspect) {
        selectedAchievementId = achievementToInspect;
        if (normalizedOptions.resetFilters) {
            resetAchievementViewFilters();
        }
    }

    isOpeningPage = true;

    try {
        const session = await getCurrentSession();

        if (!session?.user) {
            requestLoginForAchievements();
            return;
        }

        // Abre a tela imediatamente. Antes, se a sincronização com Supabase demorasse
        // ou falhasse, parecia que o botão de conquistas não fazia nada.
        page.classList.add('active');
        page.setAttribute('aria-hidden', 'false');
        document.body.classList.add('achievements-open');
        render();

        await safeSetAchievementSession(session);
        trackLoginSession();
        handleAchievementsPanelOpened();
        render();

        if (achievementToInspect) {
            inspectAchievement(achievementToInspect, {
                resetFilters: false,
                scroll: normalizedOptions.scrollToAchievement !== false
            });
        }

        setTimeout(() => {
            if (achievementToInspect) {
                scrollSelectedAchievementIntoView();
            } else {
                page.querySelector('#achievements-close')?.focus();
            }
        }, 50);
    } catch (error) {
        console.error('[Achievements] Falha ao abrir painel:', error);
        requestLoginForAchievements();
    } finally {
        isOpeningPage = false;
    }
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

            <div class="achievements-toolbar">
                <nav class="achievements-filters" aria-label="Filtros de conquistas">
                    <div class="achievements-filter-row achievements-status-row" id="achievements-status-filters"></div>
                </nav>

                <label class="achievements-search" for="achievements-search-input">
                    <span>Buscar conquista</span>
                    <input id="achievements-search-input" type="search" placeholder="Buscar por nome, planeta, missão ou raridade..." autocomplete="off">
                </label>
            </div>

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

const openAchievementsFromNav = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    event?.stopImmediatePropagation?.();
    openPage();
};

const bindNavBadgesButton = () => {
    const navBadges = document.getElementById('nav-badges');
    if (!navBadges) return;

    navBadges.setAttribute('role', 'button');
    navBadges.setAttribute('tabindex', '0');
    navBadges.setAttribute('aria-label', 'Abrir conquistas');

    if (navBadges.dataset.achievementsBound === 'true') return;
    navBadges.dataset.achievementsBound = 'true';

    navBadges.addEventListener('click', openAchievementsFromNav);
    navBadges.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            openAchievementsFromNav(event);
        }
    });
};

// Mantém compatibilidade com patches anteriores que chamavam esse nome.
const wireNavBadgesButton = bindNavBadgesButton;

const wirePageEvents = () => {
    bindNavBadgesButton();

    // Listener delegado e capturado: se outro módulo recriar a navbar, se o usuário
    // navegar e voltar pelo bfcache, ou se o listener direto for perdido, o botão
    // continua funcionando.
    document.addEventListener('click', (event) => {
        const navBadges = event.target.closest?.('#nav-badges');
        if (!navBadges) return;
        openAchievementsFromNav(event);
    }, true);

    document.addEventListener('keydown', (event) => {
        const navBadges = event.target.closest?.('#nav-badges');
        if (!navBadges || (event.key !== 'Enter' && event.key !== ' ')) return;
        openAchievementsFromNav(event);
    }, true);

    document.addEventListener('tardis:open-achievements', (event) => {
        const achievementId = event.detail?.achievementId;
        openPage(achievementId ? {
            achievementId,
            resetFilters: true,
            scrollToAchievement: true
        } : undefined);
    });

    window.addEventListener('pageshow', () => {
        bindNavBadgesButton();
        page?.classList.toggle('active', page?.getAttribute('aria-hidden') === 'false');
    });

    page.querySelector('#achievements-close')?.addEventListener('click', closePage);
    page.querySelector('.achievements-backdrop')?.addEventListener('click', closePage);

    page.addEventListener('wheel', (event) => {
        event.stopPropagation();
    }, { passive: true });

    page.addEventListener('touchmove', (event) => {
        event.stopPropagation();
    }, { passive: true });

    page.querySelector('#achievements-search-input')?.addEventListener('input', (event) => {
        searchTerm = event.target.value || '';
        render();
    });

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
    trackLoginSession();
};

const wireAchievementTriggers = async () => {
    const session = await getCurrentSession();
    await setAchievementSession(session);
    unlockSessionStartAchievements();

    onAuthStateChange(async (_event, sessionData) => {
        await safeSetAchievementSession(sessionData);

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
        await safeSetAchievementSession(session);
        unlockSessionStartAchievements();

        if (pendingOpenAfterLogin) {
            pendingOpenAfterLogin = false;
            setTimeout(() => {
                window.TardisAuth?.close?.();
                openPage();
            }, 300);
        }
    });

    window.addEventListener('tardis:achievements-auth-required', () => {
        requestLoginForAchievements();
    });

    window.addEventListener('tardis:achievements-updated', (event) => {
        updateNavCount(event.detail.state);
        if (event.detail.unlockedAchievement) showAchievementToast(event.detail.unlockedAchievement);
        syncAchievementTotalMilestones(event.detail.state);
        syncBalancedExplorer(event.detail.state);
        render();
    });

    window.addEventListener('tardis:adventure-started', () => {
        if (!hasActiveAchievementUser()) return;
        unlockTriggered('adventure_started');
        addTriggeredProgress('adventure_started_count', 1);
    });

    window.addEventListener('tardis:question-answered', (event) => {
        if (!hasActiveAchievementUser()) return;

        const detail = event.detail || {};
        const planetNameEN = normalizeKey(detail.planetNameEN || detail.planetName);

        unlockTriggered('question_answered', detail);
        addTriggeredProgress('question_answered_count', 1, detail);

        if (planetNameEN) {
            trackTriggeredUnique('question_planet_unique', 'questionPlanets', planetNameEN);
        }

        if (detail.correct) {
            correctAnswerStreak += 1;
            unlockTriggered('correct_answer', detail);
            unlockTriggered('correct_answer_streak', { ...detail, streak: correctAnswerStreak }, (trigger) => correctAnswerStreak >= Number(trigger.streak || 0));
            addTriggeredProgress('correct_answer_count', 1, detail);
            addTriggeredProgress('score_total', 10, detail);
        } else {
            correctAnswerStreak = 0;
            addTriggeredProgress('wrong_answer_count', 1, detail);
        }
    });

    window.addEventListener('tardis:adventure-completed', (event) => {
        if (!hasActiveAchievementUser()) return;

        const detail = event.detail || {};
        unlockTriggered('adventure_completed', detail);
        addTriggeredProgress('adventure_completed_count', 1, detail);

        const today = new Date().toISOString().slice(0, 10);
        trackTriggeredUnique('adventure_day_unique', 'adventureDays', today);

        if (detail.perfect) {
            addTriggeredProgress('perfect_adventure_count', 1, detail);
        }

        correctAnswerStreak = 0;

        const percent = Number(detail.percent) || 0;
        unlockTriggered('adventure_percent', detail, (trigger) => percent >= Number(trigger.percent || 0));
    });

    window.addEventListener('tardis:planet-entered', (event) => {
        if (!hasActiveAchievementUser()) return;

        const detail = event.detail || {};
        const planetNameEN = normalizeKey(detail.planetNameEN || detail.planetName);

        unlockTriggered('planet_entered', detail);

        if (planetNameEN) {
            trackTriggeredUnique('unique_planet_visit', 'visitedPlanets', planetNameEN);
            unlockTriggered('planet_first_visit', detail, (trigger) => trigger.planet === planetNameEN);
            addTriggeredProgress('planet_visit_count', 1, detail, (trigger) => trigger.planet === planetNameEN);
            trackPlanetGroups(planetNameEN);
        }
    });

    window.addEventListener('tardis:planetDetailsViewed', (event) => {
        if (!hasActiveAchievementUser()) return;

        const detail = event.detail || {};
        const planetNameEN = normalizeKey(detail.planetNameEN || detail.planetName);

        unlockTriggered('planet_detail_opened', detail);
        addTriggeredProgress('planet_detail_count', 1, detail);

        if (planetNameEN) {
            unlockTriggered('planet_detail_specific', detail, (trigger) => trigger.planet === planetNameEN);
            trackTriggeredUnique('unique_planet_detail', 'planetDetails', planetNameEN);
            trackDetailGroups(planetNameEN);
        }
    });

    window.addEventListener('tardis:missionViewed', (event) => {
        if (!hasActiveAchievementUser()) return;

        const detail = event.detail || {};
        const planet = normalizeKey(detail.planet);
        const mission = normalizeKey(detail.mission);
        const missionKey = planet && mission ? `${planet}::${mission}` : mission;

        unlockTriggered('mission_viewed', detail);
        addTriggeredProgress('mission_viewed_count', 1, detail);

        if (missionKey) {
            trackTriggeredUnique('unique_mission_view', 'missions', missionKey);
            trackMissionGroups(missionKey);
        }

        if (planet) {
            unlockTriggered('mission_planet_first', detail, (trigger) => trigger.planet === planet);
            trackTriggeredUnique('mission_planet_unique', `missions_${planet}`, missionKey, (trigger) => trigger.planet === planet);
        }

        if (planet && mission) {
            unlockTriggered('mission_specific', detail, (trigger) => trigger.planet === planet && trigger.mission === mission);
        }
    });

    window.addEventListener('tardis:apodOpened', () => {
        if (!hasActiveAchievementUser()) return;
        unlockTriggered('apod_opened');
        addTriggeredProgress('apod_opened_count', 1);
    });

    document.getElementById('apod-header-click')?.addEventListener('click', () => {
        if (!hasActiveAchievementUser()) return;
        unlockTriggered('apod_opened');
        addTriggeredProgress('apod_opened_count', 1);
    });
};

const initAchievements = async () => {
    createPage();
    wirePageEvents();

    try {
        await wireAchievementTriggers();
    } catch (error) {
        console.warn('[Achievements] Inicialização parcial. O botão continuará abrindo o painel:', error);
    }

    render();

    window.TardisAchievements = {
        unlock: unlockAchievement,
        addProgress: addAchievementProgress,
        open: openPage,
        inspect: (achievementId) => openPage({ achievementId, resetFilters: true, scrollToAchievement: true }),
        close: closePage,
        render,
        rebindButton: bindNavBadgesButton
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAchievements, { once: true });
} else {
    initAchievements();
}
