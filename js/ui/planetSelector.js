// ============================================
// T.A.R.D.I.S. â€” PLANET SELECTOR UI
// ============================================
import { PLANETS_DATA } from '../data/planetsData.js';

let onSelectCallback = null;

export function createPlanetSelector(onSelect) {
    onSelectCallback = onSelect;

    const container = document.createElement('div');
    container.id = 'planet-selector';
    container.innerHTML = `
        <div class="ps-header">SELECIONAR PLANETA</div>
        <div class="ps-list" id="ps-list"></div>
    `;
    document.getElementById('ui-layer').appendChild(container);

    const list = document.getElementById('ps-list');
    PLANETS_DATA.forEach((pData, index) => {
        const item = document.createElement('div');
        item.className = 'ps-item';
        item.id = `ps-item-${index}`;
        item.dataset.index = index;

        const colorHex = '#' + pData.color.toString(16).padStart(6, '0');
        item.innerHTML = `
            <div class="ps-color" style="background: ${colorHex}; box-shadow: 0 0 8px ${colorHex};"></div>
            <div class="ps-name">${pData.name}</div>
        `;

        item.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onSelectCallback) {
                onSelectCallback(pData, index);
            }
        });

        list.appendChild(item);
    });
}

export function highlightPlanetSelector(index) {
    const items = document.querySelectorAll('.ps-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

export function showPlanetSelector() {
    const ps = document.getElementById('planet-selector');
    if (ps) ps.classList.remove('hidden');
}

export function hidePlanetSelector() {
    const ps = document.getElementById('planet-selector');
    if (ps) ps.classList.add('hidden');
}

