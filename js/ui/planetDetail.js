// ============================================
// T.A.R.D.I.S. — PLANET DETAIL MODAL
// ============================================
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { getMissionDetail } from '../data/missionDetails.js';
import { fetchNASAGallery } from '../api/nasaApi.js';

const MISSION_DETAIL_STYLE_ID = 'mission-detail-css';
const MISSION_DETAIL_MODAL_ID = 'mission-detail-modal';

function ensureMissionDetailStyles() {
    if (document.getElementById(MISSION_DETAIL_STYLE_ID)) return;

    const link = document.createElement('link');
    link.id = MISSION_DETAIL_STYLE_ID;
    link.rel = 'stylesheet';
    link.href = './css/mission-detail.css';
    document.head.appendChild(link);
}

function escapeHTML(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function createMissionDetailModal() {
    const existing = document.getElementById(MISSION_DETAIL_MODAL_ID);
    if (existing) return existing;

    const modal = document.createElement('div');
    modal.id = MISSION_DETAIL_MODAL_ID;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="mdm-backdrop" data-mdm-close></div>
        <article class="mdm-container" role="dialog" aria-modal="true" aria-labelledby="mdm-title">
            <header class="mdm-header">
                <div>
                    <div class="mdm-kicker" id="mdm-kicker">MISSÃO ESPACIAL</div>
                    <h2 class="mdm-title" id="mdm-title">--</h2>
                    <p class="mdm-subtitle" id="mdm-subtitle">--</p>
                </div>
                <button class="mdm-close" type="button" aria-label="Fechar detalhes da missão" data-mdm-close>✕</button>
            </header>
            <div class="mdm-body">
                <div class="mdm-meta-grid" id="mdm-meta-grid"></div>

                <section class="mdm-section">
                    <h3 class="mdm-section-title">Objetivo da missão</h3>
                    <p class="mdm-text" id="mdm-objective"></p>
                </section>

                <section class="mdm-section">
                    <h3 class="mdm-section-title">O que foi</h3>
                    <p class="mdm-text" id="mdm-overview"></p>
                </section>

                <section class="mdm-section">
                    <h3 class="mdm-section-title">Destaques</h3>
                    <ul class="mdm-list" id="mdm-highlights"></ul>
                </section>

                <section class="mdm-section">
                    <h3 class="mdm-section-title">Resultados e descobertas</h3>
                    <ul class="mdm-list" id="mdm-results"></ul>
                </section>

                <section class="mdm-section">
                    <h3 class="mdm-section-title">Por que ela importa?</h3>
                    <div class="mdm-highlight-box" id="mdm-why"></div>
                </section>

                <div class="mdm-footer-note" id="mdm-fun-fact"></div>
            </div>
        </article>
    `;

    modal.addEventListener('click', (event) => {
        if (event.target.closest('[data-mdm-close]')) {
            closeMissionDetail();
        }
    });

    // Garante que scroll/toque dentro do dossiê não seja capturado pelos controles 3D.
    const scrollBody = modal.querySelector('.mdm-body');
    scrollBody?.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
    scrollBody?.addEventListener('touchmove', (event) => event.stopPropagation(), { passive: true });

    document.body.appendChild(modal);
    return modal;
}

function renderMissionList(listId, items = []) {
    const list = document.getElementById(listId);
    if (!list) return;

    list.innerHTML = '';
    items.forEach(itemText => {
        const li = document.createElement('li');
        li.textContent = itemText;
        list.appendChild(li);
    });
}

function renderMissionMeta(detail) {
    const metaGrid = document.getElementById('mdm-meta-grid');
    if (!metaGrid) return;

    const meta = [
        { label: 'Ano', value: detail.year || '—' },
        { label: 'Agência', value: detail.agency || '—' },
        { label: 'Alvo', value: detail.target || '—' },
        { label: 'Status', value: detail.status || '—' }
    ];

    metaGrid.innerHTML = meta.map(item => `
        <div class="mdm-meta-card">
            <div class="mdm-meta-label">${escapeHTML(item.label)}</div>
            <div class="mdm-meta-value">${escapeHTML(item.value)}</div>
        </div>
    `).join('');
}

function openMissionDetail(planetKey, mission) {
    ensureMissionDetailStyles();

    const detail = getMissionDetail(planetKey, mission.name, mission);
    const modal = createMissionDetailModal();

    document.getElementById('mdm-kicker').textContent = `${detail.type || 'Missão espacial'} • ${detail.year || ''}`.trim();
    document.getElementById('mdm-title').textContent = detail.name;
    document.getElementById('mdm-subtitle').textContent = detail.shortDescription || detail.objective || '';
    document.getElementById('mdm-objective').textContent = detail.objective || '';
    document.getElementById('mdm-overview').textContent = detail.overview || '';
    document.getElementById('mdm-why').textContent = detail.whyItMatters || '';
    document.getElementById('mdm-fun-fact').textContent = detail.funFact ? `Curiosidade: ${detail.funFact}` : '';

    renderMissionMeta(detail);
    renderMissionList('mdm-highlights', detail.highlights || []);
    renderMissionList('mdm-results', detail.results || []);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const closeButton = modal.querySelector('.mdm-close');
    closeButton?.focus({ preventScroll: true });

    window.dispatchEvent(new CustomEvent('tardis:missionViewed', {
        detail: {
            planet: planetKey,
            mission: mission.name,
            year: mission.year
        }
    }));
}

function closeMissionDetail() {
    const modal = document.getElementById(MISSION_DETAIL_MODAL_ID);
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function renderTimelineItem(planetKey, mission) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'pdm-timeline-item pdm-mission-card';
    item.setAttribute('aria-label', `Ver detalhes da missão ${mission.name}`);
    item.innerHTML = `
        <div class="pdm-timeline-year">${escapeHTML(mission.year)}</div>
        <div class="pdm-timeline-name">${escapeHTML(mission.name)}</div>
        <div class="pdm-timeline-desc">${escapeHTML(mission.desc)}</div>
        <div class="pdm-mission-action">Abrir dossiê da missão →</div>
    `;

    item.addEventListener('click', () => openMissionDetail(planetKey, mission));
    return item;
}

export function openPlanetDetail(pData) {
    ensureMissionDetailStyles();

    const modal = document.getElementById('planet-detail-modal');
    const details = PLANET_DETAILS_DATA[pData.nameEN];
    if (!details) return;

    // Header
    document.getElementById('pdm-badge').textContent = pData.isStar ? 'ESTRELA' : 'PLANETA';
    document.getElementById('pdm-title').textContent = pData.name;
    document.getElementById('pdm-subtitle').textContent = details.subtitle;

    // Stats
    const statsGrid = document.getElementById('pdm-stats-grid');
    statsGrid.innerHTML = '';
    details.stats.forEach(stat => {
        const card = document.createElement('div');
        card.className = 'pdm-stat-card';
        card.innerHTML = `
            <div class="pdm-stat-label">${escapeHTML(stat.label)}</div>
            <div class="pdm-stat-value">${escapeHTML(stat.value)}<span class="pdm-stat-unit">${escapeHTML(stat.unit)}</span></div>
        `;
        statsGrid.appendChild(card);
    });

    // Description
    document.getElementById('pdm-description').textContent = details.description;

    // Curiosities
    const curiosList = document.getElementById('pdm-curiosities');
    curiosList.innerHTML = '';
    details.curiosities.forEach(c => {
        const li = document.createElement('li');
        li.className = 'pdm-curiosity-item';
        li.innerHTML = `<span class="pdm-curiosity-icon">${escapeHTML(c.icon)}</span><span>${escapeHTML(c.text)}</span>`;
        curiosList.appendChild(li);
    });

    // Timeline / Missions
    const timeline = document.getElementById('pdm-timeline');
    timeline.innerHTML = '';
    details.missions.forEach(mission => {
        timeline.appendChild(renderTimelineItem(pData.nameEN, mission));
    });

    // Gallery
    const gallery = document.getElementById('pdm-gallery');
    gallery.innerHTML = '<div class="pdm-gallery-loading">Carregando imagens da NASA...</div>';

    modal.classList.add('active');

    window.dispatchEvent(new CustomEvent('tardis:planetDetailsViewed', {
        detail: {
            planetName: pData.name,
            planetNameEN: pData.nameEN,
            isStar: Boolean(pData.isStar)
        }
    }));

    const searchQuery = pData.isStar ? 'Sun solar' : `planet ${pData.nameEN}`;
    fetchNASAGallery(searchQuery, 8).then(images => {
        gallery.innerHTML = '';
        if (images.length === 0) {
            gallery.innerHTML = '<div class="pdm-gallery-loading" style="animation:none;opacity:0.5;">Nenhuma imagem encontrada</div>';
            return;
        }
        images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'pdm-gallery-item';
            item.innerHTML = `
                <img src="${escapeHTML(img.url)}" alt="${escapeHTML(img.title)}" loading="lazy" />
                <div class="pdm-gallery-caption">${escapeHTML(img.title)}</div>
            `;
            item.onclick = () => window.open(img.url, '_blank');
            gallery.appendChild(item);
        });
    });
}

export function closePlanetDetail() {
    closeMissionDetail();
    document.getElementById('planet-detail-modal').classList.remove('active');
}

// Wire up close events
export function initPlanetDetailEvents() {
    document.getElementById('pdm-close').addEventListener('click', closePlanetDetail);
    document.querySelector('.pdm-backdrop').addEventListener('click', closePlanetDetail);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const missionModal = document.getElementById(MISSION_DETAIL_MODAL_ID);
            if (missionModal?.classList.contains('active')) {
                closeMissionDetail();
                return;
            }

            if (document.getElementById('planet-detail-modal').classList.contains('active')) {
                closePlanetDetail();
            }
        }
    });
}
