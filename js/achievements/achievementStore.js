// ============================================
// T.A.R.D.I.S. — Achievement Store
// Persistência por usuário com Supabase + cache local por conta.
// ============================================
import { ACHIEVEMENTS_DATA } from '../data/achievementsData.js';
import { supabase } from '../auth/authService.js';

const STORAGE_PREFIX = 'tardis_achievements_user_v2';
const GUEST_STORAGE_KEY = 'tardis_achievements_guest_v2';
const TABLE_NAME = 'user_achievements';

let currentUserId = null;
let lastSyncError = null;
let isRemoteSyncReady = false;

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

const getStorageKey = () => currentUserId
    ? `${STORAGE_PREFIX}_${currentUserId}`
    : GUEST_STORAGE_KEY;

const cloneEntry = (entry = {}) => ({
    ...getDefaultEntry(),
    ...entry,
    meta: {
        ...(entry.meta || {})
    }
});

const normalizeState = (state = {}) => {
    const normalized = {
        version: 2,
        userId: currentUserId,
        achievements: {},
        totalAchievementPoints: 0,
        createdAt: state.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        syncStatus: currentUserId ? (isRemoteSyncReady ? 'synced' : 'local-cache') : 'guest',
        lastSyncError
    };

    ACHIEVEMENTS_DATA.forEach((achievement) => {
        const entry = cloneEntry(state.achievements?.[achievement.id]);
        entry.progress = Math.max(0, Math.min(Number(entry.progress) || 0, achievement.maxProgress));
        normalized.achievements[achievement.id] = entry;

        if (entry.unlockedAt) {
            normalized.totalAchievementPoints += achievement.pointsReward || 0;
        }
    });

    return normalized;
};

const findAchievement = (id) => ACHIEVEMENTS_DATA.find((achievement) => achievement.id === id);

const emitStateChanged = (state, unlockedAchievement = null) => {
    window.dispatchEvent(new CustomEvent('tardis:achievements-updated', {
        detail: { state, unlockedAchievement, userId: currentUserId, syncError: lastSyncError }
    }));
};

const emitAuthRequired = () => {
    window.dispatchEvent(new CustomEvent('tardis:achievements-auth-required'));
};

export const hasActiveAchievementUser = () => Boolean(currentUserId);

export const getLastAchievementSyncError = () => lastSyncError;

export const loadAchievementState = () => {
    const parsed = safeParse(localStorage.getItem(getStorageKey()));
    return normalizeState(parsed || {});
};

export const saveAchievementState = (state) => {
    const normalized = normalizeState(state);
    normalized.updatedAt = new Date().toISOString();
    localStorage.setItem(getStorageKey(), JSON.stringify(normalized));
    return normalized;
};

const persistEntryRemote = async (id, entry) => {
    if (!supabase || !currentUserId) return;

    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .upsert({
                user_id: currentUserId,
                achievement_id: id,
                progress: Number(entry.progress) || 0,
                unlocked_at: entry.unlockedAt || null,
                meta: entry.meta || {},
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,achievement_id'
            });

        if (error) throw error;
        lastSyncError = null;
        isRemoteSyncReady = true;
    } catch (error) {
        lastSyncError = error.message || 'Falha ao sincronizar conquista com Supabase.';
        console.warn('[Achievements] Falha ao sincronizar conquista:', lastSyncError);
        emitStateChanged(loadAchievementState(), null);
    }
};

const stateFromRemoteRows = (rows = []) => {
    const state = normalizeState({});

    rows.forEach((row) => {
        if (!state.achievements[row.achievement_id]) return;
        state.achievements[row.achievement_id] = {
            ...state.achievements[row.achievement_id],
            progress: Number(row.progress) || 0,
            unlockedAt: row.unlocked_at || null,
            meta: row.meta || {}
        };
    });

    return normalizeState(state);
};

export const syncAchievementsFromSupabase = async () => {
    if (!supabase || !currentUserId) {
        const state = loadAchievementState();
        emitStateChanged(state, null);
        return state;
    }

    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('achievement_id, progress, unlocked_at, meta, updated_at')
            .eq('user_id', currentUserId);

        if (error) throw error;

        const remoteState = stateFromRemoteRows(data || []);
        lastSyncError = null;
        isRemoteSyncReady = true;
        const saved = saveAchievementState(remoteState);
        emitStateChanged(saved, null);
        return saved;
    } catch (error) {
        lastSyncError = error.message || 'Não foi possível carregar conquistas do Supabase.';
        isRemoteSyncReady = false;
        console.warn('[Achievements] Usando cache local. Motivo:', lastSyncError);
        const state = loadAchievementState();
        emitStateChanged(state, null);
        return state;
    }
};

export const setAchievementSession = async (session) => {
    const nextUserId = session?.user?.id || null;

    if (!nextUserId) {
        currentUserId = null;
        lastSyncError = null;
        isRemoteSyncReady = false;
        const state = loadAchievementState();
        emitStateChanged(state, null);
        return state;
    }

    currentUserId = nextUserId;
    return syncAchievementsFromSupabase();
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
    if (!hasActiveAchievementUser()) {
        emitAuthRequired();
        return loadAchievementState();
    }

    const achievement = findAchievement(id);
    if (!achievement) return loadAchievementState();

    const state = loadAchievementState();
    const entry = cloneEntry(state.achievements[id]);

    if (entry.unlockedAt) return state;

    entry.progress = achievement.maxProgress;
    entry.unlockedAt = new Date().toISOString();
    entry.meta = { ...(entry.meta || {}), ...meta };
    state.achievements[id] = entry;

    const saved = saveAchievementState(state);
    persistEntryRemote(id, entry);
    emitStateChanged(saved, achievement);
    return saved;
};

export const setAchievementProgress = (id, progress, meta = {}) => {
    if (!hasActiveAchievementUser()) {
        emitAuthRequired();
        return loadAchievementState();
    }

    const achievement = findAchievement(id);
    if (!achievement) return loadAchievementState();

    const state = loadAchievementState();
    const entry = cloneEntry(state.achievements[id]);
    if (entry.unlockedAt) return state;

    entry.progress = Math.max(0, Math.min(Number(progress) || 0, achievement.maxProgress));
    entry.meta = { ...(entry.meta || {}), ...meta };
    state.achievements[id] = entry;

    if (entry.progress >= achievement.maxProgress) {
        const savedBeforeUnlock = saveAchievementState(state);
        persistEntryRemote(id, entry);
        return unlockAchievement(id, meta) || savedBeforeUnlock;
    }

    const saved = saveAchievementState(state);
    persistEntryRemote(id, entry);
    emitStateChanged(saved, null);
    return saved;
};

export const addAchievementProgress = (id, amount = 1, meta = {}) => {
    const state = loadAchievementState();
    const entry = getAchievementEntry(state, id);
    return setAchievementProgress(id, (Number(entry.progress) || 0) + amount, meta);
};

export const trackUniqueMetaItem = (id, metaKey, itemValue) => {
    if (!itemValue) return loadAchievementState();
    if (!hasActiveAchievementUser()) {
        emitAuthRequired();
        return loadAchievementState();
    }

    const achievement = findAchievement(id);
    if (!achievement) return loadAchievementState();

    const state = loadAchievementState();
    const entry = cloneEntry(state.achievements[id]);
    const existing = Array.isArray(entry.meta?.[metaKey]) ? [...entry.meta[metaKey]] : [];

    if (!existing.includes(itemValue)) {
        existing.push(itemValue);
    }

    return setAchievementProgress(id, existing.length, {
        ...(entry.meta || {}),
        [metaKey]: existing
    });
};

export const resetAchievementsLocal = () => {
    localStorage.removeItem(getStorageKey());
    const state = loadAchievementState();
    emitStateChanged(state, null);
    return state;
};
