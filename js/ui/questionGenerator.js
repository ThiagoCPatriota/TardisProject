// ============================================
// T.A.R.D.I.S. — DYNAMIC QUESTION GENERATOR
// Generates quiz questions from planetDetails.js + missionDetails.js data
// Uses daily seed for "question of the day" consistency
// ============================================
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { PLANETS_DATA } from '../data/planetsData.js';
import { MISSION_DETAILS_DATA } from '../data/missionDetails.js';

// --- API FETCH & CACHE ---
const CACHE_KEY = 'tardis_api_cache';
const CACHE_DATE_KEY = 'tardis_api_cache_date';

const fetchSolarSystemData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);

    if (cachedDate === today) {
        try {
            const data = localStorage.getItem(CACHE_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse cached API data', e);
        }
    }

    try {
        const res = await fetch('https://api.le-systeme-solaire.net/rest/bodies/');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();

        const bodies = data.bodies.filter(b => b.isPlanet || b.id === 'soleil');
        const apiMap = {};

        const nameMap = {
            'soleil': 'Sun', 'mercure': 'Mercury', 'vénus': 'Venus',
            'terre': 'Earth', 'mars': 'Mars', 'jupiter': 'Jupiter',
            'saturne': 'Saturn', 'uranus': 'Uranus', 'neptune': 'Neptune'
        };

        bodies.forEach(b => {
            const enName = nameMap[b.id] || b.englishName;
            apiMap[enName] = b;
        });

        localStorage.setItem(CACHE_KEY, JSON.stringify(apiMap));
        localStorage.setItem(CACHE_DATE_KEY, today);
        return apiMap;
    } catch (err) {
        console.warn('API le-systeme-solaire falhou, usando fallback local.', err);
        return null;
    }
};

// --- DAILY SEED ---
const getDailySeed = () => {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
};

// Seeded pseudo-random (deterministic for same day)
const seededRandom = (seed) => {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0x7fffffff;
        return s / 0x7fffffff;
    };
};

// --- HELPERS ---
const pickRandom = (arr, rng) => arr[Math.floor(rng() * arr.length)];

const normalizeText = (value = '') => String(value).replace(/\s+/g, ' ').trim();

const shorten = (value = '', max = 118) => {
    const clean = normalizeText(value);
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 70 ? lastSpace : cut.length).trim()}…`;
};

const unique = (items = []) => {
    const seen = new Set();
    return items.filter(item => {
        const clean = normalizeText(item);
        if (!clean || seen.has(clean)) return false;
        seen.add(clean);
        return true;
    });
};

const articleFor = (label) => {
    const lower = label.toLowerCase();
    if (lower.startsWith('temp') || lower.startsWith('tipo')) return 'a';
    if (lower.startsWith('diâ') || lower.startsWith('dis')) return 'o';
    if (lower.startsWith('massa') || lower.startsWith('grav')) return 'a';
    if (lower.startsWith('comp') || lower.startsWith('lum')) return 'a';
    if (lower.startsWith('pressão') || lower.startsWith('atmosfera')) return 'a';
    if (lower.startsWith('lua')) return 'o número de';
    return 'o/a';
};

const shuffleArray = (arr, rng) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const buildQuestion = (planet, question, correct, distractors, rng, extra = {}) => {
    const cleanCorrect = normalizeText(correct);
    const cleanDistractors = unique(distractors)
        .map(normalizeText)
        .filter(option => option && option !== cleanCorrect)
        .slice(0, 3);

    if (!cleanCorrect || cleanDistractors.length < 3) return null;

    const options = shuffleArray([cleanCorrect, ...cleanDistractors], rng);
    const correctIndex = options.indexOf(cleanCorrect);

    return {
        planetNameEN: planet.nameEN,
        planetName: planet.name,
        question,
        options,
        correctIndex,
        hint: extra.hint || `Explore os detalhes de ${planet.name} para encontrar a resposta!`,
        category: extra.category || 'data',
        source: extra.source || 'planet-details'
    };
};

const getPlanetByEnglishName = (nameEN) => PLANETS_DATA.find(p => p.nameEN === nameEN) || { name: nameEN, nameEN };

const getMissionEntries = (planetNameEN, details) => {
    const missionDetails = MISSION_DETAILS_DATA?.[planetNameEN] || {};
    return (details.missions || []).map(mission => ({
        ...mission,
        detail: missionDetails[mission.name] || {}
    }));
};

const getAllMissionEntries = () => Object.entries(PLANET_DETAILS_DATA).flatMap(([planetNameEN, details]) => {
    const planet = getPlanetByEnglishName(planetNameEN);
    return getMissionEntries(planetNameEN, details).map(mission => ({
        ...mission,
        planetNameEN,
        planetName: planet.name
    }));
});

const getMissionField = (mission, fieldName, fallback = '') => normalizeText(mission.detail?.[fieldName] || mission[fieldName] || fallback);

const optionPoolFromMissions = (fieldName, currentMission, maxLength = 118) => {
    const current = getMissionField(currentMission, fieldName);
    return unique(getAllMissionEntries()
        .filter(mission => mission.name !== currentMission.name)
        .map(mission => shorten(getMissionField(mission, fieldName), maxLength))
        .filter(option => option && option !== shorten(current, maxLength)));
};

const generateTextDistractors = (correct, pool, count, rng, fallback = []) => {
    const cleanCorrect = normalizeText(correct);
    const candidates = unique([...pool, ...fallback])
        .map(normalizeText)
        .filter(option => option && option !== cleanCorrect);

    const shuffled = shuffleArray(candidates, rng);
    return shuffled.slice(0, count);
};

const missionFactPool = (currentMission) => {
    return unique(getAllMissionEntries().flatMap(mission => {
        if (mission.name === currentMission.name) return [];
        return [
            ...(mission.detail?.highlights || []),
            ...(mission.detail?.results || []),
            mission.detail?.funFact || '',
            mission.desc || ''
        ].map(item => shorten(item, 120));
    }));
};

const genericAgencies = [
    'NASA', 'ESA', 'ESA / NASA', 'JAXA', 'NASA / ESA / ASI',
    'Programa espacial soviético', 'NASA / ESA / CSA', 'Conceito científico'
];

const genericStatuses = [
    'Concluída', 'Ativa', 'Operação prolongada', 'Em rota / missão ativa',
    'Proposta/conceito', 'Ativa em operação prolongada'
];

const genericTargets = [
    'Sol', 'Mercúrio', 'Vênus', 'Terra', 'Marte', 'Júpiter',
    'Saturno', 'Urano', 'Netuno', 'Luas e anéis', 'Atmosfera planetária'
];

const genericTypes = [
    'Sonda de sobrevoo', 'Orbitador planetário', 'Módulo de pouso',
    'Rover', 'Observatório espacial', 'Missão orbital', 'Sonda atmosférica'
];

const generateNumericDistractors = (valueStr, unit, count, rng) => {
    const numStr = String(valueStr).replace(/[^\d.,-]/g, '').replace(',', '.');
    const num = parseFloat(numStr);
    if (isNaN(num)) {
        return Array.from({ length: count }, (_, i) => `${valueStr} ${i + 2} ${unit}`.trim());
    }

    const distractors = new Set();
    const multipliers = [0.4, 0.6, 0.75, 1.3, 1.5, 1.8, 2.2, 0.3, 2.5];
    const offset = Math.floor(rng() * multipliers.length);
    let attempts = 0;

    while (distractors.size < count && attempts < 24) {
        const jitter = 1 + (rng() - 0.5) * 0.18;
        const mult = multipliers[(attempts + offset) % multipliers.length] * jitter;
        let val = num * mult;

        if (Number.isInteger(num) && !String(valueStr).includes(',') && !String(valueStr).includes('.')) {
            val = Math.round(val);
        } else {
            val = parseFloat(val.toFixed(2));
        }

        const formatted = val.toLocaleString('pt-BR');
        const option = `${formatted} ${unit}`.trim();
        if (option !== `${valueStr} ${unit}`.trim()) distractors.add(option);
        attempts++;
    }

    while (distractors.size < count) {
        const val = Math.max(1, Math.round(num * (2 + rng() * 3)));
        distractors.add(`${val.toLocaleString('pt-BR')} ${unit}`.trim());
    }

    return [...distractors].slice(0, count);
};

const generateYearDistractors = (year, count, rng) => {
    const offsets = [-15, -8, -3, 3, 7, 12, 18, -20, 5, 22, -27];
    const distractors = new Set();
    const offsetStart = Math.floor(rng() * offsets.length);

    let i = 0;
    while (distractors.size < count && i < offsets.length) {
        const y = year + offsets[(i + offsetStart) % offsets.length];
        if (y > 1950 && y !== year) distractors.add(String(y));
        i++;
    }
    return [...distractors].slice(0, count);
};

const generateMoonDistractors = (valueStr, count, rng) => {
    const clean = String(valueStr).replace('+', '').trim();
    const num = parseInt(clean, 10);
    if (isNaN(num)) return ['0', '1', '2'];

    const distractors = new Set();
    const offsets = [-3, 2, -1, 5, -5, 10, -10, 15, 3, 7, 12, 1];
    const offsetStart = Math.floor(rng() * offsets.length);

    let i = 0;
    while (distractors.size < count && i < offsets.length) {
        const val = Math.max(0, num + offsets[(i + offsetStart) % offsets.length]);
        const str = String(valueStr).includes('+') ? `${val}+` : `${val}`;
        if (str !== valueStr) distractors.add(str);
        i++;
    }
    return [...distractors].slice(0, count);
};

// --- QUESTION TEMPLATES ---
const QUESTION_TEMPLATES = [
    {
        id: 'stat_value',
        build: (planet, details, apiData, rng) => {
            const stats = details.stats;
            if (!stats || stats.length === 0) return null;

            const stat = pickRandom(stats, rng);
            const question = `Qual é ${articleFor(stat.label)} ${stat.label.toLowerCase()} de ${planet.name}?`;
            const correct = `${stat.value} ${stat.unit}`.trim();
            const distractors = generateNumericDistractors(stat.value, stat.unit, 3, rng);
            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Esse dado aparece no painel técnico de ${planet.name}.`,
                category: 'planet-data'
            });
        }
    },
    {
        id: 'curiosity_true_false',
        build: (planet, details, apiData, rng) => {
            const curiosities = details.curiosities;
            if (!curiosities || curiosities.length === 0) return null;

            const fact = pickRandom(curiosities, rng);
            const question = `Sobre ${planet.name}: "${fact.text}" — Isso é verdade?`;

            return {
                planetNameEN: planet.nameEN,
                planetName: planet.name,
                question,
                options: ['Sim, é verdade!', 'Não, é falso!'],
                correctIndex: 0,
                hint: `Revise as curiosidades de ${planet.name} para confirmar!`,
                category: 'curiosity',
                source: 'planet-curiosity'
            };
        }
    },
    {
        id: 'mission_year',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details);
            if (!missions || missions.length < 2) return null;

            const mission = pickRandom(missions, rng);
            const year = parseInt(mission.year, 10);
            if (Number.isNaN(year)) return null;

            const question = `Em que ano a missão "${mission.name}" aparece na linha do tempo de ${planet.name}?`;
            const correct = String(year);
            const distractors = generateYearDistractors(year, 3, rng);

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Abra o dossiê da missão ${mission.name} para revisar o ano.`,
                category: 'mission',
                source: 'mission-year'
            });
        }
    },
    {
        id: 'mission_agency',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details).filter(m => getMissionField(m, 'agency'));
            if (!missions.length) return null;

            const mission = pickRandom(missions, rng);
            const correct = getMissionField(mission, 'agency');
            const distractors = generateTextDistractors(correct, optionPoolFromMissions('agency', mission), 3, rng, genericAgencies);
            const question = `Qual agência ou parceria conduziu a missão "${mission.name}"?`;

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `O dossiê da missão mostra a agência responsável por ${mission.name}.`,
                category: 'mission',
                source: 'mission-agency'
            });
        }
    },
    {
        id: 'mission_target',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details).filter(m => getMissionField(m, 'target'));
            if (!missions.length) return null;

            const mission = pickRandom(missions, rng);
            const correct = getMissionField(mission, 'target');
            const distractors = generateTextDistractors(correct, optionPoolFromMissions('target', mission), 3, rng, genericTargets);
            const question = `Qual era o principal alvo científico da missão "${mission.name}"?`;

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Veja o campo “Alvo” no dossiê da missão.`,
                category: 'mission',
                source: 'mission-target'
            });
        }
    },
    {
        id: 'mission_status',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details).filter(m => getMissionField(m, 'status'));
            if (!missions.length) return null;

            const mission = pickRandom(missions, rng);
            const correct = getMissionField(mission, 'status');
            const distractors = generateTextDistractors(correct, optionPoolFromMissions('status', mission), 3, rng, genericStatuses);
            const question = `No dossiê, qual é o status da missão "${mission.name}"?`;

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `O status aparece no topo do dossiê da missão.`,
                category: 'mission',
                source: 'mission-status'
            });
        }
    },
    {
        id: 'mission_type',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details).filter(m => getMissionField(m, 'type'));
            if (!missions.length) return null;

            const mission = pickRandom(missions, rng);
            const correct = getMissionField(mission, 'type');
            const distractors = generateTextDistractors(correct, optionPoolFromMissions('type', mission), 3, rng, genericTypes);
            const question = `Que tipo de missão foi "${mission.name}"?`;

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `O tipo da missão aparece no cabeçalho do dossiê.`,
                category: 'mission',
                source: 'mission-type'
            });
        }
    },
    {
        id: 'mission_objective',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details).filter(m => getMissionField(m, 'objective'));
            if (!missions.length) return null;

            const mission = pickRandom(missions, rng);
            const correct = shorten(getMissionField(mission, 'objective'), 120);
            const pool = optionPoolFromMissions('objective', mission, 120);
            const distractors = generateTextDistractors(correct, pool, 3, rng);
            const question = `Qual era o objetivo principal da missão "${mission.name}"?`;

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Leia a seção “Objetivo da missão” no dossiê.`,
                category: 'mission',
                source: 'mission-objective'
            });
        }
    },
    {
        id: 'mission_discovery',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details)
                .filter(m => (m.detail?.results?.length || 0) + (m.detail?.highlights?.length || 0) > 0);
            if (!missions.length) return null;

            const mission = pickRandom(missions, rng);
            const correctPool = [...(mission.detail?.results || []), ...(mission.detail?.highlights || [])].map(item => shorten(item, 120));
            const correct = pickRandom(unique(correctPool), rng);
            const distractors = generateTextDistractors(correct, missionFactPool(mission), 3, rng);
            const question = `Qual destas afirmações combina com a missão "${mission.name}"?`;

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Procure “Destaques” e “Resultados” no dossiê da missão.`,
                category: 'mission',
                source: 'mission-discovery'
            });
        }
    },
    {
        id: 'mission_name_from_clue',
        build: (planet, details, apiData, rng) => {
            const missions = getMissionEntries(planet.nameEN, details).filter(m => m.detail?.highlights?.length || m.detail?.results?.length || m.desc);
            if (missions.length < 2) return null;

            const mission = pickRandom(missions, rng);
            const cluePool = unique([
                ...(mission.detail?.highlights || []),
                ...(mission.detail?.results || []),
                mission.desc || ''
            ].map(item => shorten(item, 125)));
            if (!cluePool.length) return null;

            const clue = pickRandom(cluePool, rng);
            const correct = mission.name;
            const distractors = generateTextDistractors(correct, missions.map(m => m.name), 3, rng, getAllMissionEntries().map(m => m.name));
            const question = `Qual missão relacionada a ${planet.name} tem esta pista: "${clue}"?`;

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Compare a pista com os dossiês das missões de ${planet.name}.`,
                category: 'mission',
                source: 'mission-clue'
            });
        }
    },
    {
        id: 'comparison',
        build: (planet, details, apiData, rng) => {
            let grav;
            if (apiData && apiData.gravity) {
                grav = apiData.gravity;
            } else {
                const gravStat = details.stats?.find(s => s.label.toLowerCase().includes('gravidade'));
                if (!gravStat) return null;
                grav = parseFloat(String(gravStat.value).replace(',', '.'));
                if (Number.isNaN(grav)) return null;
            }

            const earthGrav = 9.81;
            const isStronger = grav > earthGrav;
            const question = `A gravidade de ${planet.name} é ${isStronger ? 'mais forte' : 'mais fraca'} que a da Terra. Qual é aproximadamente o valor?`;
            const formatGrav = grav.toLocaleString('pt-BR');
            const correct = `${formatGrav} m/s²`;
            const distractors = generateNumericDistractors(formatGrav, 'm/s²', 3, rng);

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Compare a gravidade de ${planet.name} com os 9,81 m/s² da Terra.`,
                category: 'planet-data'
            });
        }
    },
    {
        id: 'moon_count',
        build: (planet, details, apiData, rng) => {
            let moonCountStr;

            if (apiData) {
                moonCountStr = apiData.moons ? apiData.moons.length.toString() : '0';
            } else {
                const moonStat = details.stats?.find(s => s.label.toLowerCase().includes('lua'));
                if (!moonStat) return null;
                moonCountStr = moonStat.value.toString();
            }

            const question = `Quantas luas conhecidas ${planet.name} possui?`;
            const correct = moonCountStr;
            const distractors = generateMoonDistractors(moonCountStr, 3, rng);

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Esse número aparece nos dados técnicos de ${planet.name}.`,
                category: 'planet-data'
            });
        }
    },
    {
        id: 'orbit_period',
        build: (planet, details, apiData, rng) => {
            let orbitStr, orbitUnit;

            if (apiData && apiData.sideralOrbit) {
                const days = apiData.sideralOrbit;
                if (days > 365) {
                    const years = (days / 365.25).toFixed(1);
                    orbitStr = years.replace('.', ',');
                    orbitUnit = 'anos';
                } else {
                    orbitStr = Math.round(days).toString();
                    orbitUnit = 'dias';
                }
            } else {
                const orbitStat = details.stats?.find(s => s.label.toLowerCase().includes('órbita'));
                if (!orbitStat) return null;
                orbitStr = orbitStat.value;
                orbitUnit = orbitStat.unit;
            }

            const question = `Quanto tempo ${planet.name} leva para completar uma órbita ao redor do Sol?`;
            const correct = `${orbitStr} ${orbitUnit}`.trim();
            const distractors = generateNumericDistractors(orbitStr, orbitUnit, 3, rng);

            return buildQuestion(planet, question, correct, distractors, rng, {
                hint: `Procure o período de órbita nos dados de ${planet.name}.`,
                category: 'planet-data'
            });
        }
    }
];

// --- PUBLIC API ---

/**
 * Generate a set of daily questions for the quiz.
 * Returns one question per planet/star, deterministic for each day.
 */
export const generateDailyQuestions = async () => {
    const seed = getDailySeed();
    const rng = seededRandom(seed);
    const questions = [];

    const apiDataMap = await fetchSolarSystemData();
    const planetNames = Object.keys(PLANET_DETAILS_DATA);

    planetNames.forEach((nameEN, planetOrder) => {
        const details = PLANET_DETAILS_DATA[nameEN];
        const planet = getPlanetByEnglishName(nameEN);
        const planetApiData = apiDataMap ? apiDataMap[nameEN] : null;

        // Mistura os templates de forma determinística por dia e por astro.
        const templateStart = Math.floor(rng() * QUESTION_TEMPLATES.length);
        const templateStride = 1 + ((seed + planetOrder) % 5);

        for (let attempt = 0; attempt < QUESTION_TEMPLATES.length; attempt++) {
            const idx = (templateStart + attempt * templateStride) % QUESTION_TEMPLATES.length;
            const template = QUESTION_TEMPLATES[idx];
            const question = template.build(planet, details, planetApiData, rng);

            if (question) {
                questions.push(question);
                break;
            }
        }
    });

    return questions;
};

/**
 * Planet icons for UI display
 */
export const PLANET_ICONS = {
    Sun: '☀️', Mercury: '⚫', Venus: '🟡', Earth: '🌍',
    Mars: '🔴', Jupiter: '🟠', Saturn: '🪐', Uranus: '🔵', Neptune: '🔵'
};
