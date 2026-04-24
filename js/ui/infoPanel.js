// ============================================
// T.A.R.D.I.S. — INFO PANEL
// ============================================
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { openPlanetDetail } from './planetDetail.js';

const infoPanel = document.getElementById('info-panel');

export function showPlanetInfo(pData) {
    document.getElementById('info-badge').textContent = pData.isStar ? 'ESTRELA' : 'PLANETA';
    document.getElementById('geo-name').textContent = pData.name;
    document.getElementById('geo-coord').textContent = pData.isStar
        ? 'CENTRO DO SISTEMA SOLAR'
        : `DISTÂNCIA: ${pData.distance} UA (escala)`;
    document.getElementById('geo-details').textContent = pData.desc;

    // Reset NASA image container
    const nasaContainer = document.getElementById('nasa-image-container');
    nasaContainer.style.display = 'none';
    document.getElementById('landmark-info').style.display = 'none';

    // Detail button
    const detailBtn = document.getElementById('detail-btn');
    const detailDivider = document.getElementById('detail-btn-divider');
    if (PLANET_DETAILS_DATA[pData.nameEN]) {
        detailBtn.style.display = 'block';
        detailDivider.style.display = 'block';
        detailBtn.onclick = () => openPlanetDetail(pData);
    } else {
        detailBtn.style.display = 'none';
        detailDivider.style.display = 'none';
    }

    infoPanel.classList.add('active');
}

export function hideInfoPanel() {
    infoPanel.classList.remove('active');
}

export function showLandmarkInfo(lm, selectedPlanet) {
    infoPanel.classList.add('active');
    document.getElementById('info-badge').textContent = 'MARCO NASA';
    document.getElementById('geo-name').textContent = selectedPlanet?.name || 'Terra';

    const landmarkDiv = document.getElementById('landmark-info');
    landmarkDiv.style.display = 'block';
    document.getElementById('landmark-name').textContent = lm.icon + ' ' + lm.name;
    document.getElementById('landmark-desc').textContent =
        (lm.year ? `[${lm.year}] ` : '') + lm.desc;
}

