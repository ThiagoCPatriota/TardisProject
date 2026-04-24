// ============================================
// T.A.R.D.I.S. — DADOS DOS PLANETAS
// ============================================
import { TEXTURES, TEXTURES_HQ } from '../config.js';

export const PLANETS_DATA = [
    {
        name: 'Sol', nameEN: 'Sun', radius: 3.0, distance: 0, speed: 0, isStar: true,
        color: 0xffaa00, planetType: 'sun',
        texture: TEXTURES.sun,
        textureHQ: TEXTURES_HQ.sun,
        atmosphereColor: 0xff6600, atmosphereScale: 1.15, atmosphereOpacity: 0.08,
        desc: 'O Sol é a estrela no centro do Sistema Solar. Contém 99.86% de toda a massa do sistema. Temperatura superficial: ~5,500°C.'
    },
    {
        name: 'Mercúrio', nameEN: 'Mercury', radius: 0.25, distance: 7, speed: 0.008,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0x8c7e6d, planetType: 'mercury',
        texture: TEXTURES.mercury,
        textureHQ: TEXTURES_HQ.mercury,
        desc: 'Menor planeta do Sistema Solar e mais próximo do Sol. Sem atmosfera significativa. Temperatura varia de -180°C a 430°C.'
    },
    {
        name: 'Vênus', nameEN: 'Venus', radius: 0.5, distance: 10, speed: 0.006,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0xe8cda0, planetType: 'venus',
        texture: TEXTURES.venus_surface,
        textureHQ: TEXTURES_HQ.venus_surface,
        cloudTexture: TEXTURES.venus_atmosphere,
        cloudTextureHQ: TEXTURES_HQ.venus_atmosphere,
        atmosphereColor: 0xffcc88, atmosphereScale: 1.08, atmosphereOpacity: 0.12,
        desc: 'Segundo planeta do Sol. Atmosfera densa de CO₂ cria efeito estufa extremo. Superfície mais quente que Mercúrio: ~465°C.'
    },
    {
        name: 'Terra', nameEN: 'Earth', radius: 0.55, distance: 14, speed: 0.005,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0x4488ff, planetType: 'earth',
        texture: TEXTURES.earth_daymap,
        textureHQ: TEXTURES_HQ.earth_daymap,
        cloudTexture: TEXTURES.earth_clouds,
        cloudTextureHQ: TEXTURES_HQ.earth_clouds,
        nightMap: TEXTURES.earth_nightmap,
        nightMapHQ: TEXTURES_HQ.earth_nightmap,
        atmosphereColor: 0x4488ff, atmosphereScale: 1.06, atmosphereOpacity: 0.1,
        desc: 'Único planeta conhecido a abrigar vida. 71% de superfície coberta por oceanos. Atmosfera protetora de N₂ e O₂.',
        hasLandmarks: true
    },
    {
        name: 'Marte', nameEN: 'Mars', radius: 0.35, distance: 19, speed: 0.004,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0xcc4422, planetType: 'mars',
        texture: TEXTURES.mars,
        textureHQ: TEXTURES_HQ.mars,
        atmosphereColor: 0xcc6644, atmosphereScale: 1.04, atmosphereOpacity: 0.05,
        desc: 'Planeta vermelho. Possui o maior vulcão do sistema solar (Olympus Mons, 21km). Rover Perseverance ativo desde 2021.'
    },
    {
        name: 'Júpiter', nameEN: 'Jupiter', radius: 1.6, distance: 28, speed: 0.002,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0xc8a050, planetType: 'jupiter',
        texture: TEXTURES.jupiter,
        textureHQ: TEXTURES_HQ.jupiter,
        atmosphereColor: 0xddaa55, atmosphereScale: 1.05, atmosphereOpacity: 0.06,
        desc: 'Maior planeta do Sistema Solar — 1,300 Terras caberiam dentro. Grande Mancha Vermelha é uma tempestade ativa há séculos.'
    },
    {
        name: 'Saturno', nameEN: 'Saturn', radius: 1.3, distance: 38, speed: 0.0015,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0xd4b86a, planetType: 'saturn',
        texture: TEXTURES.saturn,
        textureHQ: TEXTURES_HQ.saturn,
        ringTexture: TEXTURES.saturn_ring,
        ringTextureHQ: TEXTURES_HQ.saturn_ring,
        hasRing: true,
        atmosphereColor: 0xddcc88, atmosphereScale: 1.05, atmosphereOpacity: 0.05,
        desc: 'Famoso por seus anéis de gelo e rocha. Menos denso que a água. 146 luas confirmadas, incluindo Titã com atmosfera.'
    },
    {
        name: 'Urano', nameEN: 'Uranus', radius: 0.85, distance: 48, speed: 0.001,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0x66cccc, planetType: 'uranus',
        texture: TEXTURES.uranus,
        textureHQ: TEXTURES_HQ.uranus,
        atmosphereColor: 0x88dddd, atmosphereScale: 1.06, atmosphereOpacity: 0.08,
        tilt: Math.PI * 98 / 180,
        desc: 'Gigante de gelo com eixo rotacional inclinado a 98°. Orbita o Sol "de lado". Visitado apenas pela Voyager 2 em 1986.'
    },
    {
        name: 'Netuno', nameEN: 'Neptune', radius: 0.8, distance: 56, speed: 0.0008,
        orbitOffset: Math.random() * Math.PI * 2,
        color: 0x3366ff, planetType: 'neptune',
        texture: TEXTURES.neptune,
        textureHQ: TEXTURES_HQ.neptune,
        atmosphereColor: 0x4477ff, atmosphereScale: 1.06, atmosphereOpacity: 0.09,
        desc: 'Planeta mais distante do Sol. Ventos mais rápidos do sistema solar (2,100 km/h). 14 luas conhecidas, incluindo Tritão.'
    }
];
