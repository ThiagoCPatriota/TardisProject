// ============================================
// T.A.R.D.I.S. — DYNAMIC QUESTION GENERATOR
// Generates quiz questions from planetDetails.js data
// Uses daily seed for "question of the day" consistency
// ============================================
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { PLANETS_DATA } from '../data/planetsData.js';

// --- QUESTION TEMPLATES ---
// Each template knows how to extract data and build a question
const QUESTION_TEMPLATES = [
    {
        id: 'stat_value',
        build: (planet, details) => {
            const stats = details.stats;
            if (!stats || stats.length === 0) return null;

            const stat = pickRandom(stats);
            const question = `Qual é ${articleFor(stat.label)} ${stat.label.toLowerCase()} de ${planet.name}?`;

            const correct = `${stat.value} ${stat.unit}`.trim();
            const distractors = generateNumericDistractors(stat.value, stat.unit, 3);

            return buildQuestion(planet, question, correct, distractors);
        }
    },
    {
        id: 'curiosity_true_false',
        build: (planet, details) => {
            const curiosities = details.curiosities;
            if (!curiosities || curiosities.length === 0) return null;

            const fact = pickRandom(curiosities);
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
        build: (planet, details) => {
            const missions = details.missions;
            if (!missions || missions.length < 2) return null;

            const mission = pickRandom(missions);
            if (mission.year.includes('s') || mission.year.includes('proposta')) return null;

            const question = `Em que ano a missão "${mission.name}" foi lançada para estudar ${planet.name}?`;
            const correct = mission.year;
            const distractors = generateYearDistractors(parseInt(correct), 3);

            return buildQuestion(planet, question, correct, distractors.map(String));
        }
    },
    {
        id: 'comparison',
        build: (planet, details) => {
            const stats = details.stats;
            if (!stats) return null;

            const gravStat = stats.find(s => s.label.toLowerCase().includes('gravidade'));
            if (!gravStat) return null;

            const grav = parseFloat(gravStat.value.replace(',', '.'));
            if (isNaN(grav)) return null;

            const earthGrav = 9.81;
            const ratio = (grav / earthGrav).toFixed(1);
            const isStronger = grav > earthGrav;

            const question = `A gravidade de ${planet.name} é ${isStronger ? 'mais forte' : 'mais fraca'} que a da Terra. Qual é aproximadamente o valor?`;
            const correct = `${gravStat.value} m/s²`;
            const distractors = generateNumericDistractors(gravStat.value, 'm/s²', 3);

            return buildQuestion(planet, question, correct, distractors);
        }
    },
    {
        id: 'moon_count',
        build: (planet, details) => {
            const moonStat = details.stats?.find(s => s.label.toLowerCase().includes('lua'));
            if (!moonStat) return null;

            const question = `Quantas luas conhecidas ${planet.name} possui?`;
            const correct = `${moonStat.value} ${moonStat.unit}`.trim();
            const distractors = generateMoonDistractors(moonStat.value, 3);

            return buildQuestion(planet, question, correct, distractors);
        }
    },
    {
        id: 'orbit_period',
        build: (planet, details) => {
            const orbitStat = details.stats?.find(s => s.label.toLowerCase().includes('órbita'));
            if (!orbitStat) return null;

            const question = `Quanto tempo ${planet.name} leva para completar uma órbita ao redor do Sol?`;
            const correct = `${orbitStat.value} ${orbitStat.unit}`.trim();
            const distractors = generateNumericDistractors(orbitStat.value, orbitStat.unit, 3);

            return buildQuestion(planet, question, correct, distractors);
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
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const buildQuestion = (planet, question, correct, distractors) => {
    const options = shuffleArray([correct, ...distractors]);
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

const generateNumericDistractors = (valueStr, unit, count) => {
    const numStr = valueStr.replace(/[^\d.,]/g, '').replace(',', '.');
    const num = parseFloat(numStr);
    if (isNaN(num)) {
        return Array.from({ length: count }, (_, i) => `${valueStr}${i + 1} ${unit}`.trim());
    }

    const distractors = new Set();
    const multipliers = [0.4, 0.6, 0.75, 1.3, 1.5, 1.8, 2.2, 0.3, 2.5];
    let attempts = 0;

    while (distractors.size < count && attempts < 20) {
        const mult = multipliers[attempts % multipliers.length] + (attempts * 0.05);
        let val = num * mult;
        
        if (Number.isInteger(num)) {
            val = Math.round(val);
        } else {
            val = parseFloat(val.toFixed(2));
        }

        // Format like original
        let formatted;
        if (valueStr.includes('.') && !valueStr.includes(',')) {
            formatted = val.toLocaleString('pt-BR');
        } else if (valueStr.includes(',')) {
            formatted = val.toLocaleString('pt-BR');
        } else {
            formatted = val.toLocaleString('pt-BR');
        }

        const option = `${formatted} ${unit}`.trim();
        if (option !== `${valueStr} ${unit}`.trim()) {
            distractors.add(option);
        }
        attempts++;
    }

    return [...distractors].slice(0, count);
};

const generateYearDistractors = (year, count) => {
    const offsets = [-15, -8, -3, 3, 7, 12, 18, -20, 5];
    const distractors = new Set();
    let i = 0;
    while (distractors.size < count && i < offsets.length) {
        const y = year + offsets[i];
        if (y > 1950 && y !== year) distractors.add(y);
        i++;
    }
    return [...distractors].slice(0, count);
};

const generateMoonDistractors = (valueStr, count) => {
    const clean = valueStr.replace('+', '').trim();
    const num = parseInt(clean);
    if (isNaN(num)) return ['0', '1', '2'];
    
    const distractors = new Set();
    const offsets = [-3, 2, -1, 5, -5, 10, -10, 15];
    let i = 0;
    while (distractors.size < count && i < offsets.length) {
        const val = Math.max(0, num + offsets[i]);
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
export const generateDailyQuestions = () => {
    const seed = getDailySeed();
    const rng = seededRandom(seed);
    const questions = [];

    // Planets in order (skip Sun for quiz purposes, or include it)
    const planetNames = Object.keys(PLANET_DETAILS_DATA);

    planetNames.forEach((nameEN, planetIdx) => {
        const details = PLANET_DETAILS_DATA[nameEN];
        const planet = PLANETS_DATA.find(p => p.nameEN === nameEN) || { name: nameEN, nameEN };

        // Use daily seed to pick a template for this planet
        const templateIdx = Math.floor(rng() * QUESTION_TEMPLATES.length);
        
        // Try templates in order from the seeded index
        for (let attempt = 0; attempt < QUESTION_TEMPLATES.length; attempt++) {
            const idx = (templateIdx + attempt) % QUESTION_TEMPLATES.length;
            const template = QUESTION_TEMPLATES[idx];
            const question = template.build(planet, details);
            
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
