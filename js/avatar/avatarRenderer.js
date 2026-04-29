// ============================================
// T.A.R.D.I.S. — Avatar Renderer
// Renderização leve do DiceBear Avataaars com cache e sem recarregar preview vazio.
// ============================================
import { DEFAULT_AVATAR, DICEBEAR_BASE_URL, getAvatarSeed, normalizeAvatar } from './avatarData.js';

const loadedUrlCache = new Set();
const loadingUrlPromises = new Map();
const urlCache = new Map();

const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const stripHex = (value = '') => String(value || '').replace('#', '').trim();

const appendParam = (params, key, value) => {
    if (value === undefined || value === null || value === '' || value === 'none') return;
    params.set(key, String(value));
};

const getCacheKey = (avatar, options = {}) => JSON.stringify({
    avatar: normalizeAvatar(avatar),
    compact: Boolean(options.compact),
    size: options.size || null
});

export const getDiceBearAvatarUrl = (avatar = DEFAULT_AVATAR, options = {}) => {
    const normalized = normalizeAvatar(avatar);
    const key = getCacheKey(normalized, options);
    if (urlCache.has(key)) return urlCache.get(key);

    const size = Number(options.size || (options.compact ? 96 : 220));
    const params = new URLSearchParams();

    appendParam(params, 'seed', getAvatarSeed(normalized, options.seed));
    appendParam(params, 'size', size);
    appendParam(params, 'radius', normalized.radius);
    appendParam(params, 'scale', normalized.scale);
    appendParam(params, 'backgroundType', 'solid');
    appendParam(params, 'backgroundColor', stripHex(normalized.backgroundColor));
    appendParam(params, 'style', 'circle');
    appendParam(params, 'top', normalized.top);
    appendParam(params, 'topProbability', 100);
    appendParam(params, 'skinColor', stripHex(normalized.skinColor));
    appendParam(params, 'hairColor', stripHex(normalized.hairColor));
    appendParam(params, 'clothing', normalized.clothing);
    appendParam(params, 'clothesColor', stripHex(normalized.clothesColor));
    appendParam(params, 'eyes', normalized.eyes);
    appendParam(params, 'eyebrows', normalized.eyebrows || 'default');
    appendParam(params, 'mouth', normalized.mouth);
    appendParam(params, 'randomizeIds', false);

    if (normalized.accessories) {
        appendParam(params, 'accessories', normalized.accessories);
        appendParam(params, 'accessoriesProbability', 100);
    } else {
        appendParam(params, 'accessoriesProbability', 0);
    }

    if (normalized.facialHair) {
        appendParam(params, 'facialHair', normalized.facialHair);
        appendParam(params, 'facialHairColor', stripHex(normalized.facialHairColor || normalized.hairColor));
        appendParam(params, 'facialHairProbability', 100);
    } else {
        appendParam(params, 'facialHairProbability', 0);
    }

    const url = `${DICEBEAR_BASE_URL}?${params.toString()}`;
    urlCache.set(key, url);
    return url;
};

const getInitials = (label = 'Explorador') => {
    const parts = String(label || 'Explorador').trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || 'E').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
};

const renderFallbackHTML = (label = 'Explorador', compact = false) => `
    <div class="avatar-preview-card avatar-dicebear-card avatar-fallback-card ${compact ? 'avatar-svg-compact' : ''}">
        <div class="avatar-initials" aria-hidden="true">${escapeHTML(getInitials(label))}</div>
        ${label ? `<span class="avatar-preview-label">${escapeHTML(label)}</span>` : ''}
    </div>
`;

export const renderAvatarPreviewHTML = (avatar = DEFAULT_AVATAR, options = {}) => {
    const normalized = normalizeAvatar(avatar);
    const label = options.label || normalized.title || '';
    const url = getDiceBearAvatarUrl(normalized, options);
    const sizeClass = options.compact ? ' avatar-svg-compact' : '';
    const title = label || 'Avatar do explorador';

    return `
        <div class="avatar-preview-card avatar-dicebear-card${sizeClass}" aria-label="${escapeHTML(title)}" data-avatar-provider="dicebear">
            <img class="avatar-dicebear-img" src="${escapeHTML(url)}" alt="${escapeHTML(title)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
            ${label ? `<span class="avatar-preview-label">${escapeHTML(label)}</span>` : ''}
        </div>
    `;
};

export const preloadAvatar = (avatar = DEFAULT_AVATAR, options = {}) => {
    const url = getDiceBearAvatarUrl(avatar, options);
    if (loadedUrlCache.has(url)) return Promise.resolve(url);
    if (loadingUrlPromises.has(url)) return loadingUrlPromises.get(url);

    const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = 'async';
        img.referrerPolicy = 'no-referrer';
        img.onload = () => {
            loadedUrlCache.add(url);
            loadingUrlPromises.delete(url);
            resolve(url);
        };
        img.onerror = (error) => {
            loadingUrlPromises.delete(url);
            reject(error);
        };
        img.src = url;
    });

    loadingUrlPromises.set(url, promise);
    return promise;
};

export const renderAvatarInto = (container, avatar = DEFAULT_AVATAR, options = {}) => {
    if (!container) return;

    const normalized = normalizeAvatar(avatar);
    const label = options.label || normalized.title || 'Explorador';
    const url = getDiceBearAvatarUrl(normalized, options);
    const compact = Boolean(options.compact);

    if (container.dataset.avatarUrl === url) return;

    // Primeiro render: mostra fallback leve imediatamente.
    if (!container.querySelector('.avatar-dicebear-card')) {
        container.innerHTML = renderFallbackHTML(label, compact);
    }

    container.classList.add('avatar-loading-soft');

    preloadAvatar(normalized, options)
        .then((loadedUrl) => {
            if (!container.isConnected) return;
            container.dataset.avatarUrl = loadedUrl;
            container.innerHTML = renderAvatarPreviewHTML(normalized, options);
            container.classList.remove('avatar-loading-soft');
        })
        .catch(() => {
            if (!container.isConnected) return;
            container.dataset.avatarUrl = 'fallback';
            container.innerHTML = renderFallbackHTML(label, compact);
            container.classList.remove('avatar-loading-soft');
        });
};

export const clearAvatarRendererCaches = () => {
    loadedUrlCache.clear();
    loadingUrlPromises.clear();
    urlCache.clear();
};
