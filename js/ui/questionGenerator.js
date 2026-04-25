// ============================================
// T.A.R.D.I.S. — DYNAMIC QUESTION GENERATOR
// Generates quiz questions from planetDetails.js data
// Uses daily seed for "question of the day" consistency
// ============================================
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { PLANETS_DATA } from '../data/planetsData.js';

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
        
        // Filter planets + sun
        const bodies = data.bodies.filter(b => b.isPlanet || b.id === 'soleil');
        const apiMap = {};
        
        // Map by english name to match our internal IDs
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

// --- QUESTION TEMPLATES ---
// Each template knows how to extract data and build a question
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

            return buildQuestion(planet, question, correct, distractors, rng);
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
                category: 'curiosity'
            };
        }
    },
    {
        id: 'mission_year',
        build: (planet, details, apiData, rng) => {
            const missions = details.missions;
            if (!missions || missions.length < 2) return null;

            const mission = pickRandom(missions, rng);
            if (mission.year.includes('s') || mission.year.includes('proposta')) return null;

            const question = `Em que ano a missão "${mission.name}" foi lançada para estudar ${planet.name}?`;
            const correct = mission.year;
            const distractors = generateYearDistractors(parseInt(correct), 3, rng);

            return buildQuestion(planet, question, correct, distractors.map(String), rng);
        }
    },
    {
        id: 'comparison',
        build: (planet, details, apiData, rng) => {
            // Use API data if available, fallback to local details
            let grav;
            if (apiData && apiData.gravity) {
                grav = apiData.gravity;
            } else {
                const gravStat = details.stats?.find(s => s.label.toLowerCase().includes('gravidade'));
                if (!gravStat) return null;
                grav = parseFloat(gravStat.value.replace(',', '.'));
                if (isNaN(grav)) return null;
            }

            const earthGrav = 9.81;
            const isStronger = grav > earthGrav;

            const question = `A gravidade de ${planet.name} é ${isStronger ? 'mais forte' : 'mais fraca'} que a da Terra. Qual é aproximadamente o valor?`;
            
            const formatGrav = grav.toLocaleString('pt-BR');
            const correct = `${formatGrav} m/s²`;
            const distractors = generateNumericDistractors(formatGrav, 'm/s²', 3, rng);

            return buildQuestion(planet, question, correct, distractors, rng);
        }
    },
    {
        id: 'moon_count',
        build: (planet, details, apiData, rng) => {
            let moonCountStr;
            
            if (apiData) {
                // api.le-systeme-solaire.net provides moons array
                moonCountStr = apiData.moons ? apiData.moons.length.toString() : '0';
            } else {
                const moonStat = details.stats?.find(s => s.label.toLowerCase().includes('lua'));
                if (!moonStat) return null;
                moonCountStr = moonStat.value.toString();
            }

            const question = `Quantas luas conhecidas ${planet.name} possui?`;
            const correct = moonCountStr;
            const distractors = generateMoonDistractors(moonCountStr, 3, rng);

            return buildQuestion(planet, question, correct, distractors, rng);
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

            return buildQuestion(planet, question, correct, distractors, rng);
        }
    }
];

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

const buildQuestion = (planet, question, correct, distractors, rng) => {
    const options = shuffleArray([correct, ...distractors], rng);
    const correctIndex = options.indexOf(correct);

    return {
        planetNameEN: planet.nameEN,
        planetName: planet.name,
        question,
        options,
        correctIndex,
        hint: `Explore os detalhes de ${planet.name} para encontrar a resposta!`,
        category: 'data'
    };
};

const generateNumericDistractors = (valueStr, unit, count, rng) => {
    const numStr = valueStr.replace(/[^\d.,]/g, '').replace(',', '.');
    const num = parseFloat(numStr);
    if (isNaN(num)) {
        return Array.from({ length: count }, (_, i) => `${valueStr}${i + 1} ${unit}`.trim());
    }

    const distractors = new Set();
    const multipliers = [0.4, 0.6, 0.75, 1.3, 1.5, 1.8, 2.2, 0.3, 2.5];
    
    // Start at a random offset determined by rng
    const offset = Math.floor(rng() * multipliers.length);
    let attempts = 0;

    while (distractors.size < count && attempts < 20) {
        const mult = multipliers[(attempts + offset) % multipliers.length] + (attempts * 0.05);
        let val = num * mult;
        
        if (Number.isInteger(num) && !valueStr.includes(',') && !valueStr.includes('.')) {
            val = Math.round(val);
        } else {
            val = parseFloat(val.toFixed(2));
        }

        let formatted = val.toLocaleString('pt-BR');
        
        const option = `${formatted} ${unit}`.trim();
        if (option !== `${valueStr} ${unit}`.trim()) {
            distractors.add(option);
        }
        attempts++;
    }

    // Add extra generic ones if needed
    while (distractors.size < count) {
        distractors.add(`${Math.round(num * (3 + Math.random()))} ${unit}`.trim());
    }

    return [...distractors].slice(0, count);
};

const generateYearDistractors = (year, count, rng) => {
    const offsets = [-15, -8, -3, 3, 7, 12, 18, -20, 5];
    const distractors = new Set();
    const offsetStart = Math.floor(rng() * offsets.length);
    
    let i = 0;
    while (distractors.size < count && i < offsets.length) {
        const y = year + offsets[(i + offsetStart) % offsets.length];
        if (y > 1950 && y !== year) distractors.add(y);
        i++;
    }
    return [...distractors].slice(0, count);
};

const generateMoonDistractors = (valueStr, count, rng) => {
    const clean = valueStr.replace('+', '').trim();
    const num = parseInt(clean);
    if (isNaN(num)) return ['0', '1', '2'];
    
    const distractors = new Set();
    const offsets = [-3, 2, -1, 5, -5, 10, -10, 15, 3, 7, 12, 1];
    const offsetStart = Math.floor(rng() * offsets.length);
    
    let i = 0;
    while (distractors.size < count && i < offsets.length) {
        const val = Math.max(0, num + offsets[(i + offsetStart) % offsets.length]);
        const str = valueStr.includes('+') ? `${val}+` : `${val}`;
        if (str !== valueStr) distractors.add(str);
        i++;
    }
    return [...distractors].slice(0, count);
};

// --- PUBLIC API ---

/**
 * Generate a set of daily questions for the quiz.
 * Returns one question per planet, deterministic for each day.
 */
export const generateDailyQuestions = async () => {
    const seed = getDailySeed();
    const rng = seededRandom(seed);
    const questions = [];

    // Fetch API Data
    const apiDataMap = await fetchSolarSystemData();

    // Planets in order
    const planetNames = Object.keys(PLANET_DETAILS_DATA);

    planetNames.forEach((nameEN) => {
        const details = PLANET_DETAILS_DATA[nameEN];
        const planet = PLANETS_DATA.find(p => p.nameEN === nameEN) || { name: nameEN, nameEN };
        const planetApiData = apiDataMap ? apiDataMap[nameEN] : null;

        // Use daily seed to pick a template for this planet
        const templateIdx = Math.floor(rng() * QUESTION_TEMPLATES.length);
        
        // Try templates in order from the seeded index
        for (let attempt = 0; attempt < QUESTION_TEMPLATES.length; attempt++) {
            const idx = (templateIdx + attempt) % QUESTION_TEMPLATES.length;
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
