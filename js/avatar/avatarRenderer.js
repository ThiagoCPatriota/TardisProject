// ============================================
// T.A.R.D.I.S. — Avatar Renderer
// Renderiza o explorador básico e cosméticos equipados em SVG.
// ============================================
import { DEFAULT_AVATAR, DEFAULT_LOCAL_AVATAR, getAvatarOption, normalizeAvatar } from './avatarData.js';

const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const HAIR_PATHS = {
    short_01: '<path d="M69 55c2-17 13-28 31-28s30 10 33 27c-15-11-45-12-64 1Z"/>',
    curly_01: '<path d="M64 58c1-18 15-31 35-31 21 0 36 13 37 31-8-6-13-7-19-4-7-7-18-7-25 0-8-5-17-4-28 4Z"/>',
    bob_01: '<path d="M68 58c2-20 14-31 32-31 18 0 31 12 33 31v23c-12-10-54-11-65 0V58Z"/>',
    none: ''
};

const DEFAULT_COSMETICS = {
    head: null,
    outfit: null,
    accessory: null,
    aura: null,
    frame: null,
    title: null
};

const normalizeCosmetics = (cosmetics = {}) => ({
    ...DEFAULT_COSMETICS,
    ...(cosmetics && typeof cosmetics === 'object' ? cosmetics : {})
});

const renderAccessory = (accessory, suitAccent) => {
    if (accessory === 'star_pin') {
        return `<path d="M112 134l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7Z" fill="${suitAccent}" opacity="0.95"/>`;
    }

    if (accessory === 'visor') {
        return '<rect x="75" y="70" width="50" height="15" rx="7.5" fill="#061226" stroke="#7dd3fc" stroke-width="3" opacity="0.92"/><circle cx="88" cy="77.5" r="3" fill="#38bdf8"/>';
    }

    if (accessory === 'scarf') {
        return '<path d="M75 112c18 10 42 10 59 0l5 12c-19 13-48 13-69 0l5-12Z" fill="#f97316" opacity="0.94"/><path d="M129 119c12 5 19 14 19 28l-13-3c-1-11-5-18-13-22l7-3Z" fill="#fb923c"/>';
    }

    return '';
};

const renderCosmeticAura = (cosmetics) => {
    if (cosmetics.aura === 'galactic_aura') {
        return `
            <ellipse cx="100" cy="111" rx="82" ry="98" fill="none" stroke="#a78bfa" stroke-width="3" opacity="0.22"/>
            <ellipse cx="100" cy="111" rx="70" ry="86" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.20"/>
            <circle cx="49" cy="46" r="3" fill="#f8fafc" opacity="0.85"/>
            <circle cx="151" cy="61" r="2.5" fill="#c084fc" opacity="0.85"/>
            <circle cx="163" cy="152" r="2" fill="#7dd3fc" opacity="0.85"/>
        `;
    }

    if (cosmetics.aura === 'aurora_aura') {
        return `
            <path d="M34 147c28-50 62-62 132-58" fill="none" stroke="#22d3ee" stroke-width="6" opacity="0.18" stroke-linecap="round"/>
            <path d="M42 161c36-42 70-48 122-39" fill="none" stroke="#a7f3d0" stroke-width="5" opacity="0.16" stroke-linecap="round"/>
        `;
    }

    return '';
};

const renderCosmeticOutfit = (cosmetics) => {
    if (cosmetics.outfit === 'scientist_coat') {
        return `
            <path d="M61 145c11-11 24-17 39-17s28 6 39 17l-2 58H63l-2-58Z" fill="#e0f2fe" opacity="0.72"/>
            <path d="M83 137l17 20 17-20" fill="none" stroke="#0f172a" stroke-width="4" opacity="0.42" stroke-linecap="round"/>
        `;
    }

    if (cosmetics.outfit === 'timelord_cape') {
        return `
            <path d="M52 135c16 13 32 19 48 19s32-6 48-19c9 29 13 52 15 68H37c2-16 6-39 15-68Z" fill="#7c2d12" opacity="0.72"/>
            <path d="M64 139c13 9 25 13 36 13s23-4 36-13" fill="none" stroke="#facc15" stroke-width="3" opacity="0.65"/>
        `;
    }

    return '';
};

const renderCosmeticHead = (cosmetics) => {
    if (cosmetics.head === 'crown_solar') {
        return `
            <path d="M72 39l13 13 15-21 15 21 13-13 4 30H68l4-30Z" fill="#facc15" stroke="#fff7ad" stroke-width="3" opacity="0.95"/>
            <circle cx="100" cy="50" r="5" fill="#f97316"/>
        `;
    }

    if (cosmetics.head === 'helmet_mars') {
        return `
            <circle cx="100" cy="82" r="50" fill="none" stroke="#fb923c" stroke-width="6" opacity="0.78"/>
            <path d="M63 78h74" stroke="#fb923c" stroke-width="5" opacity="0.68" stroke-linecap="round"/>
        `;
    }

    if (cosmetics.head === 'visor_nebula') {
        return `
            <rect x="70" y="72" width="60" height="18" rx="9" fill="#111827" stroke="#a855f7" stroke-width="4" opacity="0.96"/>
            <circle cx="87" cy="81" r="4" fill="#38bdf8"/>
            <circle cx="113" cy="81" r="4" fill="#f472b6"/>
        `;
    }

    return '';
};

const renderCosmeticHandAccessory = (cosmetics) => {
    if (cosmetics.accessory === 'sonic_screwdriver') {
        return `
            <g transform="rotate(-25 145 148)">
                <rect x="139" y="119" width="8" height="42" rx="4" fill="#dbeafe" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="143" cy="116" r="5" fill="#7dd3fc"/>
            </g>
        `;
    }

    if (cosmetics.accessory === 'saturn_badge') {
        return `
            <g transform="translate(120 134)">
                <circle cx="0" cy="0" r="10" fill="#facc15" opacity="0.95"/>
                <ellipse cx="0" cy="0" rx="18" ry="6" fill="none" stroke="#fde68a" stroke-width="3" transform="rotate(-18)"/>
            </g>
        `;
    }

    return '';
};

const renderCosmeticFrame = (cosmetics) => {
    if (cosmetics.frame === 'voyager_frame') {
        return `
            <rect x="14" y="12" width="172" height="196" rx="28" fill="none" stroke="#facc15" stroke-width="4" opacity="0.78"/>
            <path d="M30 34h34M136 34h34M30 186h34M136 186h34" stroke="#fde68a" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
        `;
    }

    if (cosmetics.frame === 'blue_nebula_bg') {
        return `
            <circle cx="35" cy="40" r="34" fill="#38bdf8" opacity="0.10"/>
            <circle cx="166" cy="165" r="42" fill="#2563eb" opacity="0.12"/>
        `;
    }

    return '';
};

const renderLocalAvatarPreviewHTML = (avatar = DEFAULT_LOCAL_AVATAR, options = {}) => {
    const normalized = normalizeAvatar({ ...avatar, avatarProvider: 'local' });
    const cosmetics = normalizeCosmetics(options.cosmetics || normalized.equippedCosmetics || {});
    const skin = getAvatarOption('skin', normalized.skin)?.color || '#d6a06f';
    const hair = getAvatarOption('hairColor', normalized.hairColor)?.color || '#6b3f24';
    const suit = getAvatarOption('suit', normalized.suit) || getAvatarOption('suit', DEFAULT_AVATAR.suit);
    const suitColor = suit?.color || '#0f5ea8';
    const suitAccent = suit?.accent || '#38bdf8';
    const hairPath = normalized.hair === 'none' ? '' : (HAIR_PATHS[normalized.hair] || HAIR_PATHS.short_01);
    const accessory = renderAccessory(normalized.accessory, suitAccent);
    const sizeClass = options.compact ? ' avatar-svg-compact' : '';

    return `
        <div class="avatar-preview-card${sizeClass}" aria-label="Avatar do explorador">
            <svg class="avatar-svg" viewBox="0 0 200 220" role="img" aria-label="Explorador T.A.R.D.I.S.">
                <defs>
                    <radialGradient id="avatarGlow" cx="50%" cy="25%" r="70%">
                        <stop offset="0%" stop-color="${suitAccent}" stop-opacity="0.34"/>
                        <stop offset="70%" stop-color="#020617" stop-opacity="0"/>
                    </radialGradient>
                    <linearGradient id="suitGradient" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stop-color="${suitAccent}" stop-opacity="0.95"/>
                        <stop offset="55%" stop-color="${suitColor}"/>
                        <stop offset="100%" stop-color="#061226"/>
                    </linearGradient>
                </defs>
                ${renderCosmeticFrame(cosmetics)}
                <circle cx="100" cy="98" r="88" fill="url(#avatarGlow)"/>
                ${renderCosmeticAura(cosmetics)}
                <path d="M55 203c5-47 24-75 45-75s40 28 45 75H55Z" fill="url(#suitGradient)" stroke="rgba(255,255,255,0.26)" stroke-width="3"/>
                ${renderCosmeticOutfit(cosmetics)}
                <path d="M77 133h46l-8 22H85l-8-22Z" fill="#e0f2fe" opacity="0.88"/>
                <path d="M83 153h34v46H83z" fill="rgba(2,6,23,0.28)"/>
                <circle cx="100" cy="80" r="42" fill="${skin}" stroke="rgba(255,255,255,0.28)" stroke-width="3"/>
                <g fill="${hair}">${hairPath}</g>
                <circle cx="86" cy="82" r="4" fill="#061226"/>
                <circle cx="114" cy="82" r="4" fill="#061226"/>
                <path d="M89 99c8 8 16 8 24 0" fill="none" stroke="#061226" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
                <circle cx="100" cy="133" r="9" fill="${suitAccent}" opacity="0.95"/>
                ${accessory}
                ${renderCosmeticHandAccessory(cosmetics)}
                ${renderCosmeticHead(cosmetics)}
            </svg>
            ${options.label ? `<span class="avatar-preview-label">${escapeHTML(options.label)}</span>` : ''}
        </div>
    `;
};

const DICEBEAR_BASE_URL = 'https://api.dicebear.com/9.x/avataaars/svg';

const sanitizeSeed = (seed = 'tardis-explorer') => {
    const clean = String(seed || '').trim();
    return clean || 'tardis-explorer';
};

const addParam = (params, key, value) => {
    if (value === null || value === undefined || value === '') return;
    params.set(key, String(value));
};

export const buildDiceBearAvatarUrl = (avatar = DEFAULT_AVATAR, options = {}) => {
    const normalized = normalizeAvatar(avatar);
    const params = new URLSearchParams();

    addParam(params, 'seed', sanitizeSeed(options.seed || normalized.seed));
    addParam(params, 'size', options.size || 256);
    addParam(params, 'radius', 50);
    addParam(params, 'style', normalized.style || 'circle');
    addParam(params, 'backgroundColor', normalized.backgroundColor || '0f172a');
    addParam(params, 'backgroundType', 'solid');
    addParam(params, 'top', normalized.top);
    addParam(params, 'topProbability', 100);
    addParam(params, 'hairColor', normalized.hairColor);
    addParam(params, 'skinColor', normalized.skinColor);
    addParam(params, 'clothing', normalized.clothing);
    addParam(params, 'clothesColor', normalized.clothesColor);
    addParam(params, 'mouth', normalized.mouth);
    addParam(params, 'eyes', normalized.eyes);
    addParam(params, 'eyebrows', normalized.eyebrows || 'default');

    if (normalized.accessories) {
        addParam(params, 'accessories', normalized.accessories);
        addParam(params, 'accessoriesColor', normalized.accessoriesColor || normalized.clothesColor || '65c9ff');
        addParam(params, 'accessoriesProbability', normalized.accessoriesProbability || 100);
    } else {
        addParam(params, 'accessoriesProbability', 0);
    }

    if (normalized.facialHair) {
        addParam(params, 'facialHair', normalized.facialHair);
        addParam(params, 'facialHairColor', normalized.facialHairColor || normalized.hairColor || '724133');
        addParam(params, 'facialHairProbability', normalized.facialHairProbability || 100);
    } else {
        addParam(params, 'facialHairProbability', 0);
    }

    if (normalized.clothing === 'graphicShirt') {
        addParam(params, 'clothingGraphic', 'diamond');
    }

    return `${DICEBEAR_BASE_URL}?${params.toString()}`;
};

const renderDiceBearCosmeticOverlay = (cosmetics = {}) => {
    const frame = renderCosmeticFrame(cosmetics);
    const aura = renderCosmeticAura(cosmetics);
    const head = renderCosmeticHead(cosmetics);
    const hand = renderCosmeticHandAccessory(cosmetics);

    if (!frame && !aura && !head && !hand) return '';

    return `
        <svg class="avatar-cosmetic-overlay" viewBox="0 0 200 220" aria-hidden="true">
            ${frame}
            ${aura}
            ${head}
            ${hand}
        </svg>
    `;
};

const renderDiceBearAvatarPreviewHTML = (avatar = DEFAULT_AVATAR, options = {}) => {
    const normalized = normalizeAvatar(avatar);
    const cosmetics = normalizeCosmetics(options.cosmetics || normalized.equippedCosmetics || {});
    const sizeClass = options.compact ? ' avatar-svg-compact' : '';
    const label = options.label || 'DiceBear · Avataaars';
    const url = buildDiceBearAvatarUrl(normalized, { size: options.compact ? 128 : 256 });
    const fallback = renderLocalAvatarPreviewHTML({ ...DEFAULT_LOCAL_AVATAR, suit: 'basic_blue' }, { compact: options.compact });

    return `
        <div class="avatar-preview-card avatar-dicebear-card${sizeClass}" aria-label="Avatar do explorador DiceBear">
            <img class="avatar-dicebear-img" src="${escapeHTML(url)}" alt="Avatar do explorador" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="avatar-dicebear-fallback" style="display:none">${fallback}</div>
            ${renderDiceBearCosmeticOverlay(cosmetics)}
            ${options.label !== false ? `<span class="avatar-preview-label">${escapeHTML(label)}</span>` : ''}
        </div>
    `;
};

export const renderAvatarPreviewHTML = (avatar = DEFAULT_AVATAR, options = {}) => {
    const normalized = normalizeAvatar(avatar);

    if (normalized.avatarProvider === 'dicebear') {
        return renderDiceBearAvatarPreviewHTML(normalized, options);
    }

    return renderLocalAvatarPreviewHTML(normalized, options);
};

export const renderAvatarInto = (container, avatar, options = {}) => {
    if (!container) return;
    container.innerHTML = renderAvatarPreviewHTML(avatar, options);
};
