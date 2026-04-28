// ============================================
// T.A.R.D.I.S. — Profile Progress Sync
// Mantém Pontos de Exploração e Fragmentos Estelares em public.profiles.
// ============================================
import { supabase, getCurrentSession, onAuthStateChange } from '../auth/authService.js';
import { loadAchievementState, getUnlockedCount } from '../achievements/achievementStore.js';
import { DEFAULT_AVATAR, normalizeAvatar } from '../avatar/avatarData.js';

const DEFAULT_COSMETICS = {
    head: null,
    outfit: null,
    accessory: null,
    aura: null,
    frame: null,
    title: null
};

let syncTimer = null;
let isSyncing = false;
let lastUserId = null;
let lastKnownPoints = 0;
let lastKnownFragments = 0;
let lastKnownAvatar = DEFAULT_AVATAR;
let lastKnownCosmetics = DEFAULT_COSMETICS;

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

    const metadataAvatar = session.user.user_metadata?.avatar
        ? normalizeAvatar(session.user.user_metadata.avatar)
        : DEFAULT_AVATAR;

    const { data: existingProfile, error: readError } = await supabase
        .from('profiles')
        .select('id, user_id, explorer_name, exploration_points, star_fragments, avatar, equipped_cosmetics')
        .eq('id', session.user.id)
        .maybeSingle();

    if (readError) throw readError;

    const nextProfile = {
        id: session.user.id,
        user_id: session.user.id,
        explorer_name: getExplorerName(session.user),
        exploration_points: Number(existingProfile?.exploration_points || 0),
        star_fragments: Number(existingProfile?.star_fragments || 0),
        avatar: existingProfile?.avatar ? normalizeAvatar(existingProfile.avatar) : metadataAvatar,
        equipped_cosmetics: existingProfile?.equipped_cosmetics || DEFAULT_COSMETICS,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('profiles')
        .upsert(nextProfile, {
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
        lastKnownAvatar = DEFAULT_AVATAR;
        lastKnownCosmetics = DEFAULT_COSMETICS;
        emitProfilePoints({ userId: null, avatar: DEFAULT_AVATAR, equippedCosmetics: DEFAULT_COSMETICS });
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
        lastKnownAvatar = data?.avatar ? normalizeAvatar(data.avatar) : DEFAULT_AVATAR;
        lastKnownCosmetics = data?.equipped_cosmetics || DEFAULT_COSMETICS;

        emitProfilePoints({
            userId: session.user.id,
            explorerName: data?.explorer_name || getExplorerName(session.user),
            unlockedCount: getUnlockedCount(state),
            avatar: lastKnownAvatar,
            equippedCosmetics: lastKnownCosmetics
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
            lastKnownAvatar = DEFAULT_AVATAR;
            lastKnownCosmetics = DEFAULT_COSMETICS;
            emitProfilePoints({ userId: null, avatar: DEFAULT_AVATAR, equippedCosmetics: DEFAULT_COSMETICS });
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
            equippedCosmetics: lastKnownCosmetics
        })
    };
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileProgress, { once: true });
} else {
    initProfileProgress();
}
