// ============================================
// T.A.R.D.I.S. — Avatar Data
// Opções base para o explorador inicial.
// ============================================

export const DEFAULT_AVATAR = Object.freeze({
    base: 'explorer_01',
    skin: 'tone_02',
    hair: 'short_01',
    hairColor: 'brown',
    suit: 'basic_blue',
    accessory: null,
    aura: null,
    frame: null,
    title: null
});

export const AVATAR_OPTIONS = Object.freeze({
    skin: [
        { id: 'tone_01', label: 'Claro', color: '#f6d7bd' },
        { id: 'tone_02', label: 'Médio', color: '#d6a06f' },
        { id: 'tone_03', label: 'Escuro', color: '#8d5524' },
        { id: 'tone_04', label: 'Cósmico', color: '#7dd3fc' }
    ],
    hair: [
        { id: 'short_01', label: 'Curto' },
        { id: 'curly_01', label: 'Cacheado' },
        { id: 'bob_01', label: 'Lateral' },
        { id: 'none', label: 'Capacete limpo' }
    ],
    hairColor: [
        { id: 'black', label: 'Preto', color: '#111827' },
        { id: 'brown', label: 'Castanho', color: '#6b3f24' },
        { id: 'blonde', label: 'Dourado', color: '#facc15' },
        { id: 'blue', label: 'Azul', color: '#38bdf8' },
        { id: 'purple', label: 'Roxo', color: '#a855f7' }
    ],
    suit: [
        { id: 'basic_blue', label: 'Azul T.A.R.D.I.S.', color: '#0f5ea8', accent: '#38bdf8' },
        { id: 'basic_purple', label: 'Roxo Vórtice', color: '#6d28d9', accent: '#c084fc' },
        { id: 'basic_orange', label: 'Marte', color: '#c2410c', accent: '#fb923c' },
        { id: 'basic_green', label: 'Aurora', color: '#047857', accent: '#34d399' }
    ],
    accessory: [
        { id: null, label: 'Sem acessório' },
        { id: 'star_pin', label: 'Insígnia estrela' },
        { id: 'visor', label: 'Visor simples' },
        { id: 'scarf', label: 'Cachecol curto' }
    ]
});

export const getAvatarOption = (group, id) => {
    const options = AVATAR_OPTIONS[group] || [];
    return options.find((option) => option.id === id) || options[0] || null;
};

export const normalizeAvatar = (avatar = {}) => ({
    ...DEFAULT_AVATAR,
    ...avatar,
    accessory: Object.prototype.hasOwnProperty.call(avatar, 'accessory') ? avatar.accessory : DEFAULT_AVATAR.accessory,
    aura: Object.prototype.hasOwnProperty.call(avatar, 'aura') ? avatar.aura : DEFAULT_AVATAR.aura,
    frame: Object.prototype.hasOwnProperty.call(avatar, 'frame') ? avatar.frame : DEFAULT_AVATAR.frame,
    title: Object.prototype.hasOwnProperty.call(avatar, 'title') ? avatar.title : DEFAULT_AVATAR.title
});
