// ============================================
// T.A.R.D.I.S. — Avatar Data
// DiceBear Avataaars leve, usado apenas no cadastro e ranking.
// ============================================

export const AVATAR_PROVIDER = 'dicebear';
export const AVATAR_STYLE = 'avataaars';
export const DICEBEAR_BASE_URL = 'https://api.dicebear.com/9.x/avataaars/svg';

export const DEFAULT_AVATAR = Object.freeze({
    provider: AVATAR_PROVIDER,
    style: AVATAR_STYLE,
    seed: '',
    skinColor: 'edb98a',
    top: 'shortFlat',
    hairColor: '4a312c',
    clothing: 'hoodie',
    clothesColor: '25557c',
    accessories: null,
    eyes: 'happy',
    eyebrows: 'default',
    mouth: 'smile',
    facialHair: null,
    facialHairColor: '4a312c',
    backgroundColor: '0f172a',
    radius: 50,
    scale: 92,
    title: null
});

export const AVATAR_OPTIONS = Object.freeze({
    skinColor: [
        { id: 'ffdbb4', label: 'Claro', color: '#ffdbb4' },
        { id: 'edb98a', label: 'Médio', color: '#edb98a' },
        { id: 'd08b5b', label: 'Bronze', color: '#d08b5b' },
        { id: 'ae5d29', label: 'Escuro', color: '#ae5d29' },
        { id: '614335', label: 'Profundo', color: '#614335' },
        { id: 'f8d25c', label: 'Solar', color: '#f8d25c' }
    ],
    top: [
        { id: 'shortFlat', label: 'Curto' },
        { id: 'shortWaved', label: 'Ondulado' },
        { id: 'shortCurly', label: 'Cacheado' },
        { id: 'bob', label: 'Bob' },
        { id: 'curly', label: 'Volume' },
        { id: 'straight01', label: 'Liso' },
        { id: 'fro', label: 'Black' },
        { id: 'shaggy', label: 'Bagunçado' },
        { id: 'hat', label: 'Boné' },
        { id: 'winterHat1', label: 'Gorro' }
    ],
    hairColor: [
        { id: '2c1b18', label: 'Preto', color: '#2c1b18' },
        { id: '4a312c', label: 'Castanho', color: '#4a312c' },
        { id: '724133', label: 'Marrom', color: '#724133' },
        { id: 'd6b370', label: 'Loiro', color: '#d6b370' },
        { id: 'e8e1e1', label: 'Prata', color: '#e8e1e1' },
        { id: 'f59797', label: 'Rosa', color: '#f59797' }
    ],
    clothing: [
        { id: 'hoodie', label: 'Moletom' },
        { id: 'overall', label: 'Macacão' },
        { id: 'blazerAndShirt', label: 'Blazer' },
        { id: 'blazerAndSweater', label: 'Blazer quente' },
        { id: 'collarAndSweater', label: 'Suéter' },
        { id: 'shirtCrewNeck', label: 'Camiseta' },
        { id: 'graphicShirt', label: 'Estampa' }
    ],
    clothesColor: [
        { id: '25557c', label: 'Azul T.A.R.D.I.S.', color: '#25557c' },
        { id: '5199e4', label: 'Azul claro', color: '#5199e4' },
        { id: '65c9ff', label: 'Ciano', color: '#65c9ff' },
        { id: '3c4f5c', label: 'Escuro', color: '#3c4f5c' },
        { id: 'ff5c5c', label: 'Marte', color: '#ff5c5c' },
        { id: 'ff488e', label: 'Nebulosa', color: '#ff488e' },
        { id: 'a7ffc4', label: 'Aurora', color: '#a7ffc4' }
    ],
    accessories: [
        { id: null, label: 'Sem óculos' },
        { id: 'prescription01', label: 'Óculos 1' },
        { id: 'prescription02', label: 'Óculos 2' },
        { id: 'round', label: 'Redondo' },
        { id: 'wayfarers', label: 'Wayfarer' },
        { id: 'sunglasses', label: 'Óculos escuros' }
    ],
    eyes: [
        { id: 'happy', label: 'Feliz' },
        { id: 'default', label: 'Normal' },
        { id: 'side', label: 'De lado' },
        { id: 'squint', label: 'Confiante' },
        { id: 'surprised', label: 'Surpreso' },
        { id: 'wink', label: 'Piscadinha' }
    ],
    mouth: [
        { id: 'smile', label: 'Sorriso' },
        { id: 'default', label: 'Normal' },
        { id: 'twinkle', label: 'Animado' },
        { id: 'serious', label: 'Sério' },
        { id: 'concerned', label: 'Preocupado' }
    ],
    facialHair: [
        { id: null, label: 'Sem barba' },
        { id: 'beardLight', label: 'Barba leve' },
        { id: 'beardMedium', label: 'Barba média' },
        { id: 'moustacheFancy', label: 'Bigode' },
        { id: 'moustacheMagnum', label: 'Bigode forte' }
    ]
});

const LEGACY_MAP = Object.freeze({
    skin: {
        tone_01: 'ffdbb4',
        tone_02: 'edb98a',
        tone_03: 'ae5d29',
        tone_04: '65c9ff'
    },
    hair: {
        short_01: 'shortFlat',
        curly_01: 'shortCurly',
        bob_01: 'bob',
        none: 'hat'
    },
    hairColor: {
        black: '2c1b18',
        brown: '4a312c',
        blonde: 'd6b370',
        blue: '65c9ff',
        purple: 'ff488e'
    },
    suit: {
        basic_blue: '25557c',
        basic_purple: 'ff488e',
        basic_orange: 'ff5c5c',
        basic_green: 'a7ffc4'
    },
    accessory: {
        star_pin: null,
        visor: 'sunglasses',
        scarf: 'wayfarers'
    }
});

export const getAvatarOption = (group, id) => {
    const options = AVATAR_OPTIONS[group] || [];
    return options.find((option) => option.id === id) || options[0] || null;
};

const normalizeNullable = (value) => {
    if (value === undefined || value === null || value === '' || value === 'none') return null;
    return value;
};

const pickValid = (group, value, fallback) => {
    const normalized = normalizeNullable(value);
    const options = AVATAR_OPTIONS[group] || [];
    if (normalized === null && options.some((option) => option.id === null)) return null;
    return options.some((option) => option.id === normalized) ? normalized : fallback;
};

export const getAvatarSeed = (avatar = {}, fallback = '') => String(
    avatar.seed || fallback || avatar.explorerName || avatar.email || 'tardis-explorer'
).trim() || 'tardis-explorer';

export const normalizeAvatar = (avatar = {}) => {
    const source = avatar && typeof avatar === 'object' ? avatar : {};

    const normalized = {
        ...DEFAULT_AVATAR,
        ...source,
        provider: AVATAR_PROVIDER,
        style: AVATAR_STYLE,
        seed: getAvatarSeed(source)
    };

    // Compatibilidade com o avatar local antigo.
    if (source.skin && !source.skinColor) normalized.skinColor = LEGACY_MAP.skin[source.skin] || DEFAULT_AVATAR.skinColor;
    if (source.hair && !source.top) normalized.top = LEGACY_MAP.hair[source.hair] || DEFAULT_AVATAR.top;
    if (source.suit && !source.clothesColor) normalized.clothesColor = LEGACY_MAP.suit[source.suit] || DEFAULT_AVATAR.clothesColor;
    if (source.accessory && !source.accessories) normalized.accessories = LEGACY_MAP.accessory[source.accessory] ?? DEFAULT_AVATAR.accessories;

    normalized.skinColor = pickValid('skinColor', normalized.skinColor, DEFAULT_AVATAR.skinColor);
    normalized.top = pickValid('top', normalized.top, DEFAULT_AVATAR.top);
    normalized.hairColor = pickValid('hairColor', normalized.hairColor || LEGACY_MAP.hairColor[source.hairColor], DEFAULT_AVATAR.hairColor);
    normalized.clothing = pickValid('clothing', normalized.clothing, DEFAULT_AVATAR.clothing);
    normalized.clothesColor = pickValid('clothesColor', normalized.clothesColor, DEFAULT_AVATAR.clothesColor);
    normalized.accessories = pickValid('accessories', normalized.accessories, DEFAULT_AVATAR.accessories);
    normalized.eyes = pickValid('eyes', normalized.eyes, DEFAULT_AVATAR.eyes);
    normalized.mouth = pickValid('mouth', normalized.mouth, DEFAULT_AVATAR.mouth);
    normalized.facialHair = pickValid('facialHair', normalized.facialHair, DEFAULT_AVATAR.facialHair);
    normalized.facialHairColor = normalized.facialHair ? (normalized.facialHairColor || normalized.hairColor) : DEFAULT_AVATAR.facialHairColor;
    normalized.backgroundColor = String(normalized.backgroundColor || DEFAULT_AVATAR.backgroundColor).replace('#', '');
    normalized.radius = Number.isFinite(Number(normalized.radius)) ? Number(normalized.radius) : DEFAULT_AVATAR.radius;
    normalized.scale = Number.isFinite(Number(normalized.scale)) ? Number(normalized.scale) : DEFAULT_AVATAR.scale;

    return normalized;
};
