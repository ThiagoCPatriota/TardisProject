// ============================================
// T.A.R.D.I.S. — Achievement Events
// Camada única para emitir eventos internos de conquistas.
// ============================================

const EVENT_PREFIX = 'tardis:';

const createEventId = (type) => {
    const randomPart = Math.random().toString(36).slice(2, 9);
    return `${type}-${Date.now()}-${randomPart}`;
};

const normalizeEventNames = (type, aliases = []) => {
    return [type, ...aliases]
        .filter(Boolean)
        .map((name) => String(name).trim())
        .filter((name, index, list) => name && list.indexOf(name) === index);
};

export const emitAchievementEvent = (type, detail = {}, aliases = []) => {
    if (typeof window === 'undefined' || !type) return null;

    const achievementEventId = detail.achievementEventId || createEventId(type);
    const payload = {
        ...detail,
        achievementEventId,
        achievementEventType: type,
        emittedAt: new Date().toISOString()
    };

    normalizeEventNames(type, aliases).forEach((eventName) => {
        window.dispatchEvent(new CustomEvent(`${EVENT_PREFIX}${eventName}`, {
            detail: {
                ...payload,
                achievementEventName: eventName
            }
        }));
    });

    return achievementEventId;
};

export const getTardisEventName = (type) => `${EVENT_PREFIX}${type}`;
