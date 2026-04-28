// ============================================
// T.A.R.D.I.S. — Avatar Data
// Avatar principal: DiceBear Avataaars.
// Avatar local continua como fallback técnico.
// ============================================

export const DEFAULT_LOCAL_AVATAR = Object.freeze({
    avatarProvider: 'local',
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

export const DEFAULT_AVATAR = Object.freeze({
    ...DEFAULT_LOCAL_AVATAR,
    avatarProvider: 'dicebear',
    dicebearStyle: 'avataaars',
    seed: 'tardis-explorer',
    preset: 'balanced',
    skinColor: 'edb98a',
    top: 'longButNotTooLong',
    hairColor: '724133',
    clothing: 'shirtCrewNeck',
    clothesColor: 'ffffb1',
    accessories: null,
    accessoriesColor: '65c9ff',
    accessoriesProbability: 0,
    facialHair: null,
    facialHairColor: '724133',
    facialHairProbability: 0,
    eyes: 'default',
    eyebrows: 'default',
    mouth: 'smile',
    style: 'circle',
    backgroundColor: '0f172a',
    aura: null,
    frame: null,
    title: null
});

const dicebearPatch = (patch) => ({ patch });

export const AVATAR_OPTIONS = Object.freeze({
    preset: [
        {
            id: 'balanced',
            label: 'Neutro',
            ...dicebearPatch({
                top: 'longButNotTooLong',
                mouth: 'smile',
                eyes: 'default',
                facialHair: null,
                facialHairProbability: 0,
                accessories: null,
                accessoriesProbability: 0
            })
        },
        {
            id: 'short_hair',
            label: 'Cabelo curto',
            ...dicebearPatch({
                top: 'shortRound',
                mouth: 'smile',
                eyes: 'default',
                facialHair: null,
                facialHairProbability: 0
            })
        },
        {
            id: 'long_hair',
            label: 'Cabelo longo',
            ...dicebearPatch({
                top: 'straight02',
                mouth: 'smile',
                eyes: 'happy',
                facialHair: null,
                facialHairProbability: 0
            })
        },
        {
            id: 'doctorish',
            label: 'Viajante',
            ...dicebearPatch({
                top: 'shaggy',
                clothing: 'blazerAndShirt',
                clothesColor: '25557c',
                mouth: 'twinkle',
                eyes: 'default',
                accessories: null,
                accessoriesProbability: 0
            })
        }
    ],
    skinColor: [
        { id: 'ffdbb4', label: 'Claro', color: '#ffdbb4' },
        { id: 'edb98a', label: 'Pêssego', color: '#edb98a' },
        { id: 'd08b5b', label: 'Dourado', color: '#d08b5b' },
        { id: 'ae5d29', label: 'Médio', color: '#ae5d29' },
        { id: '614335', label: 'Escuro', color: '#614335' }
    ],
    top: [
        { id: 'shortRound', label: 'Curto' },
        { id: 'shortWaved', label: 'Ondulado' },
        { id: 'shaggy', label: 'Bagunçado' },
        { id: 'bob', label: 'Médio' },
        { id: 'straight02', label: 'Longo' },
        { id: 'curly', label: 'Cacheado' },
        { id: 'fro', label: 'Afro' },
        { id: 'hat', label: 'Boné' },
        { id: 'winterHat1', label: 'Gorro' },
        { id: 'hijab', label: 'Lenço' }
    ],
    hairColor: [
        { id: '2c1b18', label: 'Preto', color: '#2c1b18' },
        { id: '4a312c', label: 'Castanho escuro', color: '#4a312c' },
        { id: '724133', label: 'Castanho', color: '#724133' },
        { id: 'b58143', label: 'Mel', color: '#b58143' },
        { id: 'd6b370', label: 'Loiro', color: '#d6b370' },
        { id: 'e8e1e1', label: 'Prateado', color: '#e8e1e1' },
        { id: 'f59797', label: 'Rosa', color: '#f59797' }
    ],
    clothing: [
        { id: 'shirtCrewNeck', label: 'Camiseta' },
        { id: 'hoodie', label: 'Moletom' },
        { id: 'overall', label: 'Macacão' },
        { id: 'collarAndSweater', label: 'Suéter' },
        { id: 'blazerAndShirt', label: 'Blazer' },
        { id: 'graphicShirt', label: 'Camiseta ícone' }
    ],
    clothesColor: [
        { id: '25557c', label: 'Azul T.A.R.D.I.S.', color: '#25557c' },
        { id: '65c9ff', label: 'Azul claro', color: '#65c9ff' },
        { id: '3c4f5c', label: 'Verde escuro', color: '#3c4f5c' },
        { id: 'ff5c5c', label: 'Vermelho', color: '#ff5c5c' },
        { id: 'ff488e', label: 'Rosa', color: '#ff488e' },
        { id: 'ffffb1', label: 'Amarelo', color: '#ffffb1' },
        { id: 'ffffff', label: 'Branco', color: '#ffffff' },
        { id: '262e33', label: 'Preto espacial', color: '#262e33' }
    ],
    accessories: [
        { id: null, label: 'Sem óculos', patch: { accessoriesProbability: 0 } },
        { id: 'round', label: 'Óculos redondo', patch: { accessoriesProbability: 100 } },
        { id: 'prescription01', label: 'Óculos leve', patch: { accessoriesProbability: 100 } },
        { id: 'wayfarers', label: 'Óculos escuro', patch: { accessoriesProbability: 100 } },
        { id: 'sunglasses', label: 'Óculos solar', patch: { accessoriesProbability: 100 } }
    ],
    mouth: [
        { id: 'smile', label: 'Sorriso' },
        { id: 'twinkle', label: 'Confiante' },
        { id: 'default', label: 'Calmo' },
        { id: 'grimace', label: 'Animado' },
        { id: 'serious', label: 'Sério' }
    ],
    eyes: [
        { id: 'default', label: 'Normal' },
        { id: 'happy', label: 'Feliz' },
        { id: 'wink', label: 'Piscando' },
        { id: 'squint', label: 'Focado' },
        { id: 'surprised', label: 'Surpreso' }
    ],
    facialHair: [
        { id: null, label: 'Sem barba', patch: { facialHairProbability: 0 } },
        { id: 'beardLight', label: 'Barba leve', patch: { facialHairProbability: 100 } },
        { id: 'beardMedium', label: 'Barba média', patch: { facialHairProbability: 100 } },
        { id: 'moustacheFancy', label: 'Bigode', patch: { facialHairProbability: 100 } }
    ],
    // Opções antigas mantidas para compatibilidade com avatares locais já salvos.
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

export const normalizeAvatar = (avatar = {}) => {
    const source = avatar && typeof avatar === 'object' ? avatar : {};
    const provider = source.avatarProvider || source.provider || DEFAULT_AVATAR.avatarProvider;
    const base = provider === 'local' ? DEFAULT_LOCAL_AVATAR : DEFAULT_AVATAR;

    return {
        ...base,
        ...source,
        avatarProvider: provider,
        dicebearStyle: source.dicebearStyle || source.styleName || base.dicebearStyle || 'avataaars',
        style: source.style || base.style || 'circle',
        accessory: Object.prototype.hasOwnProperty.call(source, 'accessory') ? source.accessory : base.accessory,
        accessories: Object.prototype.hasOwnProperty.call(source, 'accessories') ? source.accessories : base.accessories,
        facialHair: Object.prototype.hasOwnProperty.call(source, 'facialHair') ? source.facialHair : base.facialHair,
        accessoriesProbability: Number(source.accessoriesProbability ?? base.accessoriesProbability ?? 0),
        facialHairProbability: Number(source.facialHairProbability ?? base.facialHairProbability ?? 0),
        aura: Object.prototype.hasOwnProperty.call(source, 'aura') ? source.aura : base.aura,
        frame: Object.prototype.hasOwnProperty.call(source, 'frame') ? source.frame : base.frame,
        title: Object.prototype.hasOwnProperty.call(source, 'title') ? source.title : base.title
    };
};
