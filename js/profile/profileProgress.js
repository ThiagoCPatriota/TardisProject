// ============================================
// T.A.R.D.I.S. — Profile Progress Sync
// Sincroniza Nome de Explorador, Pontos de Exploração e Fragmentos Estelares.
// ============================================
import { supabase, getCurrentSession, onAuthStateChange } from '../auth/authService.js';
import { loadAchievementState, getUnlockedCount } from '../achievements/achievementStore.js';

let syncTimer = null;
let isSyncing = false;
let lastUserId = null;
let lastKnownPoints = 0;
let lastKnownFragments = 0;
let lastKnownAvatar = null;
let lastKnownEquippedCosmetics = {};

const cleanExplorerName = (name = '') => String(name).trim().replace(/\s+/g, ' ');

const getExplorerName = (user) => {
    const metadata = user?.user_metadata || {};
    return cleanExplorerName(
        metadata.explorer_name ||
        metadata.display_name ||
        metadata.full_name ||
        ''
    ) || 'Explorador';
};

const getUserAvatar = (user) => {
    const metadata = user?.user_metadata || {};
    return metadata.avatar && typeof metadata.avatar === 'object' ? metadata.avatar : null;
};

const emitProfilePoints = (detail = {}) => {
    window.dispatchEvent(new CustomEvent('tardis:profile-points-updated', {
        detail: {
            explorationPoints: lastKnownPoints,
            starFragments: lastKnownFragments,
            ...detail
        }
    }));
};

const ensureProfileRow = async (session) => {
    if (!supabase || !session?.user) return null;

    const baseProfile = {
        id: session.user.id,
        user_id: session.user.id,
        explorer_name: getExplorerName(session.user),
        avatar: getUserAvatar(session.user),
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('profiles')
        .upsert(baseProfile, {
            onConflict: 'id',
            ignoreDuplicates: false
        });

    if (error) throw error;

    const { data, error: selectError } = await supabase
        .from('profiles')
        .select('id, user_id, explorer_name, exploration_points, star_fragments, avatar, equipped_cosmetics')
        .eq('id', session.user.id)
        .maybeSingle();

    if (selectError) throw selectError;
    return data;
};

const syncProfileProgressNow = async (state = loadAchievementState()) => {
    if (!supabase || isSyncing) return null;

    const session = await getCurrentSession();
    if (!session?.user) {
        lastUserId = null;
        lastKnownPoints = 0;
        lastKnownFragments = 0;
        lastKnownAvatar = null;
        lastKnownEquippedCosmetics = {};
        emitProfilePoints({ userId: null, avatar: null, equippedCosmetics: {} });
        return null;
    }

    isSyncing = true;

    try {
        const currentProfile = await ensureProfileRow(session);
        const earnedPoints = Number(state.totalAchievementPoints || 0);
        const previousPoints = Number(currentProfile?.exploration_points || 0);
        const currentFragments = Number(currentProfile?.star_fragments || 0);
        const delta = Math.max(0, earnedPoints - previousPoints);
        const nextPoints = Math.max(previousPoints, earnedPoints);
        const nextFragments = currentFragments + delta;

        const { data, error } = await supabase
            .from('profiles')
            .update({
                explorer_name: getExplorerName(session.user),
                avatar: getUserAvatar(session.user) || currentProfile?.avatar || {},
                exploration_points: nextPoints,
                star_fragments: nextFragments,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id)
.select('exploration_points, star_fragments, explorer_name, avatar, equipped_cosmetics')
            .maybeSingle();

        if (error) throw error;

        lastUserId = session.user.id;
        lastKnownPoints = Number(data?.exploration_points || nextPoints || 0);
        lastKnownFragments = Number(data?.star_fragments || nextFragments || 0);
        lastKnownAvatar = data?.avatar || getUserAvatar(session.user) || null;
        lastKnownEquippedCosmetics = data?.equipped_cosmetics || {};

        emitProfilePoints({
            userId: session.user.id,
            explorerName: data?.explorer_name || getExplorerName(session.user),
            avatar: data?.avatar || getUserAvatar(session.user),
            equippedCosmetics: data?.equipped_cosmetics || {},
            unlockedCount: getUnlockedCount(state)
        });

        return data;
    } catch (error) {
        console.warn('[ProfileProgress] Não foi possível sincronizar perfil/pontos:', error?.message || error);
        return null;
    } finally {
        isSyncing = false;
    }
};

const scheduleProfileProgressSync = (state) => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncProfileProgressNow(state), 250);
};

const initProfileProgress = async () => {
    const session = await getCurrentSession();
    if (session?.user) {
        await syncProfileProgressNow(loadAchievementState());
    }

    onAuthStateChange(async (_event, sessionData) => {
        if (!sessionData?.user) {
            lastUserId = null;
            lastKnownPoints = 0;
            lastKnownFragments = 0;
            lastKnownAvatar = null;
            lastKnownEquippedCosmetics = {};
            emitProfilePoints({ userId: null, avatar: null, equippedCosmetics: {} });
            return;
        }

        await syncProfileProgressNow(loadAchievementState());
    });

    window.addEventListener('tardis:auth-success', () => {
        scheduleProfileProgressSync(loadAchievementState());
    });

    window.addEventListener('tardis:achievements-updated', (event) => {
        scheduleProfileProgressSync(event.detail?.state || loadAchievementState());
    });

    window.TardisProfileProgress = {
        sync: syncProfileProgressNow,
        getSnapshot: () => ({
            userId: lastUserId,
            explorationPoints: lastKnownPoints,
            starFragments: lastKnownFragments,
            avatar: lastKnownAvatar,
            equippedCosmetics: lastKnownEquippedCosmetics
        })
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileProgress, { once: true });
} else {
    initProfileProgress();
}
