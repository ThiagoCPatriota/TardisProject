// ============================================
// T.A.R.D.I.S. â€” PLANET DETAIL MODAL
// ============================================
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { fetchNASAGallery } from '../api/nasaApi.js';

export function openPlanetDetail(pData) {
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
            <div class="pdm-stat-label">${stat.label}</div>
            <div class="pdm-stat-value">${stat.value}<span class="pdm-stat-unit">${stat.unit}</span></div>
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
        li.innerHTML = `<span class="pdm-curiosity-icon">${c.icon}</span><span>${c.text}</span>`;
        curiosList.appendChild(li);
    });

    // Timeline
    const timeline = document.getElementById('pdm-timeline');
    timeline.innerHTML = '';
    details.missions.forEach(m => {
        const item = document.createElement('div');
        item.className = 'pdm-timeline-item';
        item.innerHTML = `
            <div class="pdm-timeline-year">${m.year}</div>
            <div class="pdm-timeline-name">${m.name}</div>
            <div class="pdm-timeline-desc">${m.desc}</div>
        `;
        timeline.appendChild(item);
    });

    // Gallery
    const gallery = document.getElementById('pdm-gallery');
    gallery.innerHTML = '<div class="pdm-gallery-loading">Carregando imagens da NASA...</div>';

    modal.classList.add('active');

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
                <img src="${img.url}" alt="${img.title}" loading="lazy" />
                <div class="pdm-gallery-caption">${img.title}</div>
            `;
            item.onclick = () => window.open(img.url, '_blank');
            gallery.appendChild(item);
        });
    });
}

export function closePlanetDetail() {
    document.getElementById('planet-detail-modal').classList.remove('active');
}

// Wire up close events
export function initPlanetDetailEvents() {
    document.getElementById('pdm-close').addEventListener('click', closePlanetDetail);
    document.querySelector('.pdm-backdrop').addEventListener('click', closePlanetDetail);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('planet-detail-modal').classList.contains('active')) {
            closePlanetDetail();
        }
    });
}

