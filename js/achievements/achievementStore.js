// ============================================
// T.A.R.D.I.S. — Achievement Store
// Persistência local da primeira versão.
// ============================================
import { ACHIEVEMENTS_DATA } from '../data/achievementsData.js';

const STORAGE_KEY = 'tardis_achievements_v1';

const getDefaultEntry = () => ({
    progress: 0,
    unlockedAt: null,
    meta: {}
});

const safeParse = (value) => {
    try {
        return value ? JSON.parse(value) : null;
    } catch (_error) {
        return null;
    }
};

const normalizeState = (state = {}) => {
    const normalized = {
        version: 1,
        achievements: {},
        totalAchievementPoints: Number(state.totalAchievementPoints) || 0,
        createdAt: state.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    ACHIEVEMENTS_DATA.forEach((achievement) => {
        normalized.achievements[achievement.id] = {
            ...getDefaultEntry(),
            ...(state.achievements?.[achievement.id] || {})
        };

        normalized.achievements[achievement.id].progress = Math.min(
            Number(normalized.achievements[achievement.id].progress) || 0,
            achievement.maxProgress
        );
    });

    return normalized;
};

export const loadAchievementState = () => {
    const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
    return normalizeState(parsed || {});
};

export const saveAchievementState = (state) => {
    const normalized = normalizeState(state);
    normalized.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
};

const findAchievement = (id) => ACHIEVEMENTS_DATA.find((achievement) => achievement.id === id);

const emitStateChanged = (state, unlockedAchievement = null) => {
    window.dispatchEvent(new CustomEvent('tardis:achievements-updated', {
        detail: { state, unlockedAchievement }
    }));
};

export const getAchievementEntry = (state, id) => {
    return state.achievements[id] || getDefaultEntry();
};

export const getUnlockedCount = (state = loadAchievementState()) => {
    return ACHIEVEMENTS_DATA.reduce((count, achievement) => {
        return count + (getAchievementEntry(state, achievement.id).unlockedAt ? 1 : 0);
    }, 0);
};

export const getCompletionPercent = (state = loadAchievementState()) => {
    if (!ACHIEVEMENTS_DATA.length) return 0;
    return Math.round((getUnlockedCount(state) / ACHIEVEMENTS_DATA.length) * 100);
};

export const unlockAchievement = (id, meta = {}) => {
    const achievement = findAchievement(id);
    if (!achievement) return loadAchievementState();

    const state = loadAchievementState();
    const entry = state.achievements[id] || getDefaultEntry();

    if (entry.unlockedAt) return state;

    entry.progress = achievement.maxProgress;
    entry.unlockedAt = new Date().toISOString();
    entry.meta = { ...(entry.meta || {}), ...meta };
    state.achievements[id] = entry;
    state.totalAchievementPoints += achievement.pointsReward || 0;

    const saved = saveAchievementState(state);
    emitStateChanged(saved, achievement);
    return saved;
};

export const setAchievementProgress = (id, progress, meta = {}) => {
    const achievement = findAchievement(id);
    if (!achievement) return loadAchievementState();

    const state = loadAchievementState();
    const entry = state.achievements[id] || getDefaultEntry();
    if (entry.unlockedAt) return state;

    entry.progress = Math.max(0, Math.min(Number(progress) || 0, achievement.maxProgress));
    entry.meta = { ...(entry.meta || {}), ...meta };
    state.achievements[id] = entry;

    if (entry.progress >= achievement.maxProgress) {
        saveAchievementState(state);
        return unlockAchievement(id, meta);
    }

    const saved = saveAchievementState(state);
    emitStateChanged(saved, null);
    return saved;
};

export const addAchievementProgress = (id, amount = 1, meta = {}) => {
    const state = loadAchievementState();
    const entry = state.achievements[id] || getDefaultEntry();
    return setAchievementProgress(id, (Number(entry.progress) || 0) + amount, meta);
};

export const trackUniqueMetaItem = (id, metaKey, itemValue) => {
    if (!itemValue) return loadAchievementState();

    const achievement = findAchievement(id);
    if (!achievement) return loadAchievementState();

    const state = loadAchievementState();
    const entry = state.achievements[id] || getDefaultEntry();
    const existing = Array.isArray(entry.meta?.[metaKey]) ? entry.meta[metaKey] : [];

    if (!existing.includes(itemValue)) {
        existing.push(itemValue);
    }

    return setAchievementProgress(id, existing.length, {
        ...(entry.meta || {}),
        [metaKey]: existing
    });
};

export const resetAchievementsLocal = () => {
    localStorage.removeItem(STORAGE_KEY);
    const state = loadAchievementState();
    emitStateChanged(state, null);
    return state;
};
