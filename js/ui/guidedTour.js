// ============================================
// T.A.R.D.I.S. — GUIDED TOUR (Fullscreen Quiz)
// Gamified fullscreen quiz with dynamic questions,
// badge achievements, and Doctor character container
// ============================================
import { PLANETS_DATA } from '../data/planetsData.js';
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { navigateToPlanet } from '../camera/cameraController.js';
import { showPlanetInfo, hideInfoPanel } from './infoPanel.js';
import { highlightPlanetSelector, hidePlanetSelector, showPlanetSelector } from './planetSelector.js';
import { generateDailyQuestions, PLANET_ICONS } from './questionGenerator.js';

// --- STATE ---
let guidedModeActive = false;
let currentStep = 0;
let totalSteps = 0;
let score = 0;
let questions = [];
let hasAnswered = false;
let badgesEarned = 0;
let overlay = null;
let adventureBtn = null;

// Callbacks
let onTourEnterPlanet = null;
let onTourExitToSolar = null;

// --- BADGES ---
const BADGE_DEFINITIONS = [
    { id: 'explorer', name: 'Explorador Solar', desc: 'Completou o quiz do Sistema Solar', icon: '🌟', threshold: 5 },
    { id: 'master', name: 'Mestre Cósmico', desc: 'Acertou todas as perguntas', icon: '👑', threshold: 9 },
    { id: 'scholar', name: 'Estudioso Estelar', desc: 'Acertou mais de 7 perguntas', icon: '📚', threshold: 7 }
];

// --- PUBLIC API ---
export const initGuidedTour = (callbacks) => {
    onTourEnterPlanet = callbacks?.enterPlanet || null;
    onTourExitToSolar = callbacks?.exitPlanet || null;

    // Adventure button is now in the HTML navbar
    adventureBtn = document.getElementById('guided-tour-btn');
    if (adventureBtn) {
        adventureBtn.addEventListener('click', () => {
            guidedModeActive ? endTour() : startTour();
        });
    }

    createOverlay();
};

export const isGuidedModeActive = () => guidedModeActive;

// =============================================
// FULLSCREEN OVERLAY — DOM CREATION
// =============================================

const createOverlay = () => {
    overlay = document.createElement('div');
    overlay.id = 'quiz-overlay';
    overlay.className = 'quiz-overlay';
    overlay.innerHTML = `
        <div class="quiz-container">
            <!-- Progress Bar -->
            <div class="quiz-progress">
                <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
                <div class="quiz-progress-planets" id="quiz-progress-planets"></div>
            </div>

            <!-- Header -->
            <div class="quiz-header">
                <div class="quiz-header-left">
                    <div class="quiz-score-display">
                        <span class="quiz-score-label">PONTUAÇÃO</span>
                        <span class="quiz-score-value" id="quiz-score">0</span>
                    </div>
                    <div class="quiz-step-display">
                        <span class="quiz-step-label">PERGUNTA</span>
                        <span class="quiz-step-value" id="quiz-step">1/9</span>
                    </div>
                </div>
                <button class="quiz-close" id="quiz-close" title="Encerrar Quiz">✕</button>
            </div>

            <!-- Doctor Speech Container (prepared for future character) -->
            <div class="quiz-doctor-container" id="quiz-doctor-container">
                <div class="quiz-doctor-avatar">🧥</div>
                <div class="quiz-doctor-speech" id="quiz-doctor-speech">
                    <div class="quiz-doctor-text" id="quiz-doctor-text">
                        Preparado para uma aventura pelo Sistema Solar?
                    </div>
                    <div class="quiz-doctor-tail"></div>
                </div>
            </div>

            <!-- Planet Badge -->
            <div class="quiz-planet-badge" id="quiz-planet-badge">
                <span class="quiz-planet-icon" id="quiz-planet-icon">🪐</span>
                <span class="quiz-planet-name" id="quiz-planet-name">--</span>
            </div>

            <!-- Question Area -->
            <div class="quiz-question-area" id="quiz-question-area">
                <div class="quiz-question-text" id="quiz-question-text">--</div>
                <div class="quiz-options" id="quiz-options"></div>
            </div>

            <!-- Hint -->
            <div class="quiz-hint" id="quiz-hint" style="display:none;">
                <span class="quiz-hint-icon">💡</span>
                <span class="quiz-hint-text" id="quiz-hint-text"></span>
            </div>

            <!-- Feedback -->
            <div class="quiz-feedback" id="quiz-feedback" style="display:none;"></div>

            <!-- Action Button -->
            <button class="quiz-action-btn" id="quiz-action-btn" style="display:none;">
                PRÓXIMO PLANETA →
            </button>
        </div>
    `;

    document.getElementById('ui-layer').appendChild(overlay);

    // Wire events
    document.getElementById('quiz-close').addEventListener('click', endTour);
    document.getElementById('quiz-action-btn').addEventListener('click', advanceStep);

    // Build progress planet dots
    buildProgressPlanets();
};

const buildProgressPlanets = () => {
    const container = document.getElementById('quiz-progress-planets');
    const planets = Object.keys(PLANET_DETAILS_DATA);
    container.innerHTML = planets.map((name, i) => `
        <div class="quiz-pp" data-index="${i}" title="${name}">
            <span>${PLANET_ICONS[name] || '🪐'}</span>
        </div>
    `).join('');
};

// =============================================
// TOUR LIFECYCLE
// =============================================

const startTour = () => {
    // Generate daily questions
    questions = generateDailyQuestions();
    totalSteps = questions.length;
    currentStep = 0;
    score = 0;
    hasAnswered = false;

    guidedModeActive = true;

    // Update button
    if (adventureBtn) {
        adventureBtn.querySelector('.nav-adventure-text').textContent = 'PARAR QUIZ';
        adventureBtn.classList.add('active');
    }

    hidePlanetSelector();

    // Return to solar system first
    if (onTourExitToSolar) onTourExitToSolar();

    // Show overlay with animation
    overlay.classList.add('active');
    document.body.classList.add('quiz-active');

    setTimeout(() => showStep(0), 500);
};

const endTour = () => {
    guidedModeActive = false;

    // Update button
    if (adventureBtn) {
        adventureBtn.querySelector('.nav-adventure-text').textContent = 'MODO AVENTURA';
        adventureBtn.classList.remove('active');
    }

    // Hide overlay
    overlay.classList.remove('active');
    document.body.classList.remove('quiz-active');

    showPlanetSelector();
    hideInfoPanel();
};

const showStep = (stepIndex) => {
    if (stepIndex >= totalSteps) {
        showCompletion();
        return;
    }

    currentStep = stepIndex;
    hasAnswered = false;

    const q = questions[stepIndex];
    const planetIndex = PLANETS_DATA.findIndex(p => p.nameEN === q.planetNameEN);

    // Update progress
    updateProgress(stepIndex);

    // Navigate camera to planet
    if (planetIndex >= 0) {
        navigateToPlanet(planetIndex);
        showPlanetInfo(PLANETS_DATA[planetIndex]);
        highlightPlanetSelector(planetIndex);
    }

    // Update UI
    document.getElementById('quiz-score').textContent = score;
    document.getElementById('quiz-step').textContent = `${stepIndex + 1}/${totalSteps}`;

    // Planet badge
    document.getElementById('quiz-planet-icon').textContent = PLANET_ICONS[q.planetNameEN] || '🪐';
    document.getElementById('quiz-planet-name').textContent = q.planetName || q.planetNameEN;

    // Doctor speech
    const doctorText = document.getElementById('quiz-doctor-text');
    const details = PLANET_DETAILS_DATA[q.planetNameEN];
    const intro = details?.curiosities?.[0]?.text || `Vamos explorar ${q.planetName}!`;
    doctorText.textContent = `Sobre ${q.planetName}: ${intro.substring(0, 120)}... Pronto para o desafio?`;
    doctorText.classList.add('quiz-text-animate');
    setTimeout(() => doctorText.classList.remove('quiz-text-animate'), 600);

    // Question
    document.getElementById('quiz-question-text').textContent = q.question;

    // Options
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.dataset.index = i;
        btn.addEventListener('click', () => checkAnswer(i));
        optionsContainer.appendChild(btn);
    });

    // Hide feedback/action
    document.getElementById('quiz-feedback').style.display = 'none';
    document.getElementById('quiz-action-btn').style.display = 'none';

    // Show hint
    const hintEl = document.getElementById('quiz-hint');
    hintEl.style.display = 'flex';
    document.getElementById('quiz-hint-text').textContent = q.hint;
};

const checkAnswer = (selectedIndex) => {
    if (hasAnswered) return;

    const q = questions[currentStep];
    const feedbackEl = document.getElementById('quiz-feedback');
    const doctorText = document.getElementById('quiz-doctor-text');
    const optionBtns = document.querySelectorAll('.quiz-option');

    if (selectedIndex === q.correctIndex) {
        // CORRECT
        hasAnswered = true;
        score += 10;
        document.getElementById('quiz-score').textContent = score;

        feedbackEl.style.display = 'block';
        feedbackEl.className = 'quiz-feedback quiz-feedback-correct';
        feedbackEl.innerHTML = '✅ <strong>CORRETO!</strong> +10 pontos';

        doctorText.textContent = `Fantástico! Você realmente conhece ${q.planetName}! Allons-y!`;

        optionBtns.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correctIndex) btn.classList.add('correct');
        });

        // Update progress dot
        markProgressDot(currentStep, 'correct');

        // Show next button
        const actionBtn = document.getElementById('quiz-action-btn');
        actionBtn.textContent = currentStep >= totalSteps - 1
            ? '🏆 VER RESULTADO'
            : `PRÓXIMO: ${questions[currentStep + 1]?.planetName || 'RESULTADO'} →`;
        actionBtn.style.display = 'block';

    } else {
        // WRONG
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'quiz-feedback quiz-feedback-wrong';
        feedbackEl.innerHTML = '❌ Tente novamente!';

        doctorText.textContent = `Hmm, não é essa. ${q.hint}`;

        optionBtns.forEach((btn) => {
            if (parseInt(btn.dataset.index) === selectedIndex) {
                btn.classList.add('wrong');
                btn.disabled = true;
            }
        });
    }
};

const advanceStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep >= totalSteps) {
        showCompletion();
    } else {
        showStep(nextStep);
    }
};

const showCompletion = () => {
    const maxScore = totalSteps * 10;
    const pct = Math.round((score / maxScore) * 100);

    // Check badges earned
    const earned = BADGE_DEFINITIONS.filter(b => score / 10 >= b.threshold);

    // Update UI
    document.getElementById('quiz-planet-badge').style.display = 'none';
    document.getElementById('quiz-question-area').style.display = 'none';
    document.getElementById('quiz-hint').style.display = 'none';
    document.getElementById('quiz-feedback').style.display = 'none';

    const doctorText = document.getElementById('quiz-doctor-text');
    doctorText.textContent = pct >= 80
        ? `Brilhante! ${pct}% de acertos! Você seria um excelente companheiro da TARDIS. Geronimo! 🌌`
        : pct >= 50
            ? `Nada mal! ${pct}% de acertos. Continue explorando e tente novamente amanhã!`
            : `Hmm, ${pct}% de acertos. Leia os detalhes dos planetas com mais atenção e volte amanhã!`;

    document.getElementById('quiz-step').textContent = 'FIM';

    // Show completion content
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    document.getElementById('quiz-question-area').style.display = 'block';
    document.getElementById('quiz-question-text').innerHTML = `
        <div class="quiz-completion">
            <div class="quiz-completion-trophy">🏆</div>
            <div class="quiz-completion-title">QUIZ COMPLETO!</div>
            <div class="quiz-completion-score">${score}/${maxScore} PONTOS (${pct}%)</div>
            ${earned.length > 0 ? `
                <div class="quiz-completion-badges">
                    ${earned.map(b => `
                        <div class="quiz-completion-badge">
                            <span class="qcb-icon">${b.icon}</span>
                            <span class="qcb-name">${b.name}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="quiz-completion-hint">As perguntas mudam diariamente! Volte amanhã para novos desafios.</div>
        </div>
    `;

    // Show badges animation
    if (earned.length > 0) {
        badgesEarned += earned.length;
        updateBadgeCount();
        showBadgeAchievement(earned[0]);
    }

    // Close button
    const actionBtn = document.getElementById('quiz-action-btn');
    actionBtn.textContent = '🌟 ENCERRAR AVENTURA';
    actionBtn.style.display = 'block';
    actionBtn.onclick = () => endTour();

    // Mark all progress dots
    updateProgress(totalSteps - 1);
};

// =============================================
// PROGRESS & BADGES
// =============================================

const updateProgress = (stepIndex) => {
    const fill = document.getElementById('quiz-progress-fill');
    const pct = ((stepIndex + 1) / totalSteps) * 100;
    fill.style.width = `${pct}%`;
};

const markProgressDot = (stepIndex, status) => {
    const dots = document.querySelectorAll('.quiz-pp');
    if (dots[stepIndex]) {
        dots[stepIndex].classList.add(status);
    }
};

const updateBadgeCount = () => {
    const countEl = document.getElementById('badges-count');
    if (countEl) countEl.textContent = badgesEarned;
};

const showBadgeAchievement = (badge) => {
    const el = document.getElementById('badge-achievement');
    document.getElementById('badge-achievement-icon').textContent = badge.icon;
    document.getElementById('badge-achievement-name').textContent = badge.name;
    document.getElementById('badge-achievement-desc').textContent = badge.desc;

    el.classList.add('active');

    setTimeout(() => {
        el.classList.remove('active');
    }, 4000);
};
