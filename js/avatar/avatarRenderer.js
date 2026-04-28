// ============================================
// T.A.R.D.I.S. — Avatar Renderer
// Renderiza o explorador básico em SVG, sem depender de imagens externas.
// ============================================
import { DEFAULT_AVATAR, getAvatarOption, normalizeAvatar } from './avatarData.js';

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

export const renderAvatarPreviewHTML = (avatar = DEFAULT_AVATAR, options = {}) => {
    const normalized = normalizeAvatar(avatar);
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
                <circle cx="100" cy="98" r="88" fill="url(#avatarGlow)"/>
                <path d="M55 203c5-47 24-75 45-75s40 28 45 75H55Z" fill="url(#suitGradient)" stroke="rgba(255,255,255,0.26)" stroke-width="3"/>
                <path d="M77 133h46l-8 22H85l-8-22Z" fill="#e0f2fe" opacity="0.88"/>
                <path d="M83 153h34v46H83z" fill="rgba(2,6,23,0.28)"/>
                <circle cx="100" cy="80" r="42" fill="${skin}" stroke="rgba(255,255,255,0.28)" stroke-width="3"/>
                <g fill="${hair}">${hairPath}</g>
                <circle cx="86" cy="82" r="4" fill="#061226"/>
                <circle cx="114" cy="82" r="4" fill="#061226"/>
                <path d="M89 99c8 8 16 8 24 0" fill="none" stroke="#061226" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
                <circle cx="100" cy="133" r="9" fill="${suitAccent}" opacity="0.95"/>
                ${accessory}
            </svg>
            ${options.label ? `<span class="avatar-preview-label">${escapeHTML(options.label)}</span>` : ''}
        </div>
    `;
};

export const renderAvatarInto = (container, avatar, options = {}) => {
    if (!container) return;
    container.innerHTML = renderAvatarPreviewHTML(avatar, options);
};
