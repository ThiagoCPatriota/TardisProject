// ============================================
// T.A.R.D.I.S. — GUIDED TOUR (Fullscreen Quiz)
// Immersive Doctor Who quiz experience with:
//   - Unified Doctor header + speech bubble
//   - Inline 3D planet viewer (lazy-loaded)
//   - Typewriter text engine
//   - localStorage persistence
//   - Main render loop pause for performance
// ============================================
import { PLANETS_DATA } from '../data/planetsData.js';
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { navigateToPlanet } from '../camera/cameraController.js';
import { showPlanetInfo, hideInfoPanel } from './infoPanel.js';
import { highlightPlanetSelector, hidePlanetSelector, showPlanetSelector } from './planetSelector.js';
import { PLANET_ICONS } from './questionGenerator.js';
import {
    pickGeneralDoctorLine,
    pickCorrectDoctorLine,
    pickWrongDoctorLine,
    pickPlanetDoctorLine
} from '../data/doctorDialogue.js';
import {
    addCorrectPoints,
    applyWrongPenalty,
    formatAdventureScore,
    formatPenalty,
    getAdventureScorePercent,
    getBadgeScoreUnits,
    getMaxAdventureScore
} from './adventureScore.js';

// --- STATE ---
let guidedModeActive = false;
let currentStep = 0;
let totalSteps = 0;
let score = 0;
let questions = [];
let hasAnswered = false;
let badgesEarned = 0;
let progressHistory = [];
let overlay = null;
let adventureBtn = null;
let typewriterTimer = null;

const emitAchievementEvent = (type, detail = {}) => {
    window.dispatchEvent(new CustomEvent(`tardis:${type}`, { detail }));
};

// Lazy-loaded modules
let planetViewer = null;
let questionGenerator = null;

// Callbacks
let onTourEnterPlanet = null;
let onTourExitToSolar = null;
let onPauseMainRender = null;
let onResumeMainRender = null;

// --- BADGES ---
const BADGE_DEFINITIONS = [
    { id: 'explorer', name: 'Explorador Solar', desc: 'Completou o quiz do Sistema Solar', icon: '🌟', threshold: 5 },
    { id: 'master', name: 'Mestre Cósmico', desc: 'Acertou todas as perguntas', icon: '👑', threshold: 9 },
    { id: 'scholar', name: 'Estudioso Estelar', desc: 'Acertou mais de 7 perguntas', icon: '📚', threshold: 7 }
];

// --- DOCTOR DIALOGUE ---
// As falas agora ficam em js/data/doctorDialogue.js para facilitar expansão.
// Aqui mantemos apenas a integração do Modo Aventura com esse banco de frases.

// --- PUBLIC API ---
export const initGuidedTour = (callbacks) => {
    onTourEnterPlanet = callbacks?.enterPlanet || null;
    onTourExitToSolar = callbacks?.exitPlanet || null;
    onPauseMainRender = callbacks?.pauseRender || null;
    onResumeMainRender = callbacks?.resumeRender || null;

    adventureBtn = document.getElementById('guided-tour-btn');
    if (adventureBtn) {
        adventureBtn.addEventListener('click', async () => {
            guidedModeActive ? endTour() : await startTour();
        });
    }

    createOverlay();
};

export const isGuidedModeActive = () => guidedModeActive;

// =============================================
// TYPEWRITER ENGINE
// =============================================

const typewriterEffect = (element, text, speed = 28, callback = null) => {
    if (typewriterTimer) {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
    }

    element.textContent = '';
    element.classList.add('typing');
    let charIndex = 0;

    typewriterEffect._skipFn = () => {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
        element.textContent = text;
        element.classList.remove('typing');
        typewriterEffect._skipFn = null;
        if (callback) callback();
    };

    typewriterTimer = setInterval(() => {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typewriterTimer);
            typewriterTimer = null;
            element.classList.remove('typing');
            typewriterEffect._skipFn = null;
            if (callback) callback();
        }
    }, speed);
};

const skipTypewriter = () => {
    if (typewriterEffect._skipFn) typewriterEffect._skipFn();
};

// =============================================
// FULLSCREEN OVERLAY — DOM CREATION
// =============================================

const createOverlay = () => {
    overlay = document.createElement('div');
    overlay.id = 'quiz-overlay';
    overlay.className = 'quiz-overlay';
    overlay.innerHTML = `
        <div class="quiz-container">
            <!-- SECTION 1: Doctor Header + Speech Bubble -->
            <div class="quiz-top-header">
                <div class="quiz-doctor-block">
                    <img
                        class="quiz-doctor-sprite"
                        src="sprites/Doctorwho.png"
                        alt="The Doctor"
                    />
                    <div class="quiz-doctor-nametag">THE DOCTOR</div>
                </div>
                <div class="quiz-speech-bubble" id="quiz-speech-bubble">
                    <div class="quiz-speech-text" id="quiz-speech-text">
                        Preparado para uma aventura pelo Sistema Solar?
                    </div>
                    <div class="quiz-speech-tail"></div>
                </div>
            </div>

            <!-- SECTION 2: Status Bar (Progress + Score + Close) -->
            <div class="quiz-status-bar">
                <div class="quiz-progress">
                    <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
                    <div class="quiz-progress-planets" id="quiz-progress-planets"></div>
                </div>
                <div class="quiz-status-stats">
                    <div class="quiz-score-display">
                        <span class="quiz-score-label">PONTUAÇÃO</span>
                        <span class="quiz-score-value" id="quiz-score">0</span>
                    </div>
                    <div class="quiz-step-display">
                        <span class="quiz-step-label">PERGUNTA</span>
                        <span class="quiz-step-value" id="quiz-step">1/9</span>
                    </div>
                    <button class="quiz-close" id="quiz-close" title="Encerrar Quiz">✕</button>
                </div>
            </div>

            <!-- SECTION 3: 3D Planet Viewer -->
            <div class="quiz-planet-viewer" id="quiz-planet-viewer">
                <div class="quiz-planet-overlay-badge" id="quiz-planet-badge">
                    <span class="quiz-planet-icon" id="quiz-planet-icon">🪐</span>
                    <span class="quiz-planet-name" id="quiz-planet-name">--</span>
                </div>
                <div class="quiz-viewer-hint">🖱️ ARRASTAR PARA GIRAR</div>
            </div>

            <!-- SECTION 4: Question + Options -->
            <div class="quiz-bottom-section" id="quiz-bottom-section">
                <div class="quiz-question-area" id="quiz-question-area">
                    <div class="quiz-question-text" id="quiz-question-text">--</div>
                    <div class="quiz-options" id="quiz-options"></div>
                </div>

                <div class="quiz-hint" id="quiz-hint" style="display:none;">
                    <span class="quiz-hint-icon">💡</span>
                    <span class="quiz-hint-text" id="quiz-hint-text"></span>
                </div>

                <div class="quiz-feedback" id="quiz-feedback" style="display:none;"></div>

                <button class="quiz-action-btn" id="quiz-action-btn" style="display:none;">
                    PRÓXIMO PLANETA →
                </button>
            </div>
        </div>
    `;

    document.getElementById('ui-layer').appendChild(overlay);

    // Wire events
    document.getElementById('quiz-close').addEventListener('click', endTour);
    document.getElementById('quiz-action-btn').addEventListener('click', advanceStep);
    document.getElementById('quiz-speech-bubble').addEventListener('click', skipTypewriter);

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
// LAZY LOADING
// =============================================

const lazyLoadModules = async () => {
    // Dynamically import planet viewer and question generator
    const [viewerModule, genModule] = await Promise.all([
        import('./planetViewer.js'),
        import('./questionGenerator.js')
    ]);

    planetViewer = viewerModule;
    questionGenerator = genModule;

    // Initialize the 3D viewer canvas
    const viewerContainer = document.getElementById('quiz-planet-viewer');
    planetViewer.initPlanetViewer(viewerContainer);
};

// =============================================
// TOUR LIFECYCLE
// =============================================

const startTour = async () => {
    // Loading state
    if (adventureBtn) {
        adventureBtn.querySelector('.nav-adventure-text').textContent = 'CARREGANDO...';
    }

    // Lazy load on first use
    if (!planetViewer || !questionGenerator) {
        await lazyLoadModules();
    }

    // Generate daily questions
    questions = await questionGenerator.generateDailyQuestions();
    if (!questions || questions.length === 0) {
        if (adventureBtn) {
            adventureBtn.querySelector('.nav-adventure-text').textContent = 'MODO AVENTURA';
        }
        return;
    }

    totalSteps = questions.length;
    currentStep = 0;
    score = 0;
    hasAnswered = false;
    progressHistory = [];

    // Restore progress from localStorage
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('tardis_quiz_date');
    if (savedDate === today) {
        try {
            const savedState = JSON.parse(localStorage.getItem('tardis_quiz_state'));
            if (savedState) {
                currentStep = savedState.step || 0;
                score = Number(savedState.score) || 0;
                hasAnswered = savedState.answered || false;
                progressHistory = savedState.history || [];
            }
        } catch (e) {
            console.warn('Failed to restore quiz progress');
        }
    }

    guidedModeActive = true;
    emitAchievementEvent('adventure-started', { totalQuestions: totalSteps });

    // Update button
    if (adventureBtn) {
        adventureBtn.querySelector('.nav-adventure-text').textContent = 'PARAR QUIZ';
        adventureBtn.classList.add('active');
    }

    hidePlanetSelector();

    // Return to solar system first
    if (onTourExitToSolar) onTourExitToSolar();

    // Pause main render loop for performance
    if (onPauseMainRender) onPauseMainRender();

    // Reset visibility
    document.getElementById('quiz-planet-badge').style.display = '';
    document.getElementById('quiz-question-area').style.display = '';
    document.getElementById('quiz-hint').style.display = '';
    document.getElementById('quiz-planet-viewer').style.display = '';

    // Show overlay
    overlay.classList.add('active');
    document.body.classList.add('quiz-active');

    // Restore progress dots
    progressHistory.forEach((status, idx) => {
        markProgressDot(idx, status);
    });

    // Start planet viewer render loop
    planetViewer.startViewerLoop();

    // Doctor intro with typewriter
    const speechText = document.getElementById('quiz-speech-text');
    typewriterEffect(speechText, pickGeneralDoctorLine(), 30, () => {
        setTimeout(() => showStep(currentStep), 500);
    });
};

const endTour = () => {
    guidedModeActive = false;

    // Clear typewriter
    if (typewriterTimer) {
        clearInterval(typewriterTimer);
        typewriterTimer = null;
    }

    // Stop planet viewer
    if (planetViewer) {
        planetViewer.stopViewerLoop();
    }

    // Update button
    if (adventureBtn) {
        adventureBtn.querySelector('.nav-adventure-text').textContent = 'MODO AVENTURA';
        adventureBtn.classList.remove('active');
    }

    // Hide overlay
    overlay.classList.remove('active');
    document.body.classList.remove('quiz-active');

    // Resume main render loop
    if (onResumeMainRender) onResumeMainRender();

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

    // Mobile landscape: ao trocar de pergunta, remove o estado de resposta
    // para a área inferior voltar ao layout normal.
    const quizContainer = document.querySelector('.quiz-container');
    quizContainer?.classList.remove('quiz-has-answer', 'quiz-completed');
    overlay?.classList.remove('quiz-has-answer', 'quiz-completed');

    const q = questions[stepIndex];
    const planetIndex = PLANETS_DATA.findIndex(p => p.nameEN === q.planetNameEN);

    // Update progress
    updateProgress(stepIndex);

    // Load planet into 3D viewer
    if (planetViewer) {
        planetViewer.showPlanetInViewer(q.planetNameEN);
    }

    // Also navigate background camera (subtle parallax behind blur)
    if (planetIndex >= 0) {
        navigateToPlanet(planetIndex);
    }

    // Update UI
    document.getElementById('quiz-score').textContent = formatAdventureScore(score);
    document.getElementById('quiz-step').textContent = `${stepIndex + 1}/${totalSteps}`;

    // Planet badge
    document.getElementById('quiz-planet-badge').style.display = '';
    document.getElementById('quiz-planet-icon').textContent = PLANET_ICONS[q.planetNameEN] || '🪐';
    document.getElementById('quiz-planet-name').textContent = q.planetName || q.planetNameEN;

    // Doctor speech — planet intro with typewriter
    const speechText = document.getElementById('quiz-speech-text');
    const details = PLANET_DETAILS_DATA[q.planetNameEN];
    const fact = details?.curiosities?.[0]?.text?.substring(0, 100) || `Um lugar fascinante!`;
    typewriterEffect(speechText, pickPlanetDoctorLine(q.planetNameEN, q.planetName, fact + '...'), 22);

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

    // Ensure area is visible
    document.getElementById('quiz-question-area').style.display = '';
    document.getElementById('quiz-planet-viewer').style.display = '';

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
    const speechText = document.getElementById('quiz-speech-text');
    const optionBtns = document.querySelectorAll('.quiz-option');

    if (selectedIndex === q.correctIndex) {
        // CORRECT
        hasAnswered = true;
        score = addCorrectPoints(score);
        document.getElementById('quiz-score').textContent = formatAdventureScore(score);

        feedbackEl.style.display = 'block';
        feedbackEl.className = 'quiz-feedback quiz-feedback-correct';
        feedbackEl.innerHTML = '✅ <strong>CORRETO!</strong> +10 pontos';

        typewriterEffect(speechText, pickCorrectDoctorLine(q.planetName), 22);

        optionBtns.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correctIndex) btn.classList.add('correct');
        });

        markProgressDot(currentStep, 'correct');
        progressHistory[currentStep] = 'correct';
        saveProgress();
        emitAchievementEvent('question-answered', {
            correct: true,
            planetName: q.planetName,
            planetNameEN: q.planetNameEN,
            currentScore: score,
            questionIndex: currentStep
        });

        const actionBtn = document.getElementById('quiz-action-btn');
        actionBtn.textContent = currentStep >= totalSteps - 1
            ? '🏆 VER RESULTADO'
            : `PRÓXIMO: ${questions[currentStep + 1]?.planetName || 'RESULTADO'} →`;
        actionBtn.style.display = 'block';

        // Mobile landscape: garante que o botão de avanço fique acessível
        // mesmo quando a altura da tela for pequena.
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer?.classList.add('quiz-has-answer');
        overlay?.classList.add('quiz-has-answer');
        requestAnimationFrame(() => {
            actionBtn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        });

    } else {
        // WRONG
        score = applyWrongPenalty(score);
        document.getElementById('quiz-score').textContent = formatAdventureScore(score);

        feedbackEl.style.display = 'block';
        feedbackEl.className = 'quiz-feedback quiz-feedback-wrong';
        feedbackEl.innerHTML = `❌ <strong>Tente novamente!</strong> -${formatPenalty()} pontos`;

        typewriterEffect(speechText, pickWrongDoctorLine(q.hint), 22);

        optionBtns.forEach((btn) => {
            if (parseInt(btn.dataset.index) === selectedIndex) {
                btn.classList.add('wrong');
                btn.disabled = true;
            }
        });

        progressHistory[currentStep] = 'wrong';
        saveProgress();
        emitAchievementEvent('question-answered', {
            correct: false,
            planetName: q.planetName,
            planetNameEN: q.planetNameEN,
            currentScore: score,
            questionIndex: currentStep
        });
    }
};

const saveProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('tardis_quiz_date', today);
    localStorage.setItem('tardis_quiz_state', JSON.stringify({
        step: currentStep,
        score: score,
        answered: hasAnswered,
        history: progressHistory
    }));
};

const advanceStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep >= totalSteps) {
        showCompletion();
    } else {
        // Save the new step index BEFORE showing it
        currentStep = nextStep;
        hasAnswered = false;
        saveProgress();
        showStep(nextStep);
    }
};

const showCompletion = () => {
    localStorage.removeItem('tardis_quiz_date');
    localStorage.removeItem('tardis_quiz_state');

    const maxScore = getMaxAdventureScore(totalSteps);
    const pct = getAdventureScorePercent(score, totalSteps);
    const earned = BADGE_DEFINITIONS.filter(b => getBadgeScoreUnits(score) >= b.threshold);

    emitAchievementEvent('adventure-completed', {
        score,
        maxScore,
        percent: pct,
        totalQuestions: totalSteps,
        perfect: progressHistory.length === totalSteps && progressHistory.every(status => status === 'correct')
    });

    // Hide planet viewer in completion
    document.getElementById('quiz-planet-badge').style.display = 'none';
    document.getElementById('quiz-planet-viewer').style.display = 'none';
    document.getElementById('quiz-hint').style.display = 'none';
    document.getElementById('quiz-feedback').style.display = 'none';

    // Doctor completion speech
    const speechText = document.getElementById('quiz-speech-text');
    const completionSpeech = pct >= 80
        ? `Brilhante! ${pct}% de desempenho! Você seria um excelente companheiro da TARDIS. Geronimo! 🌌`
        : pct >= 50
            ? `Nada mal! ${pct}% de desempenho. Continue explorando e tente novamente amanhã!`
            : `Hmm, ${pct}% de desempenho. Leia os detalhes dos planetas e volte amanhã!`;

    typewriterEffect(speechText, completionSpeech, 18);

    document.getElementById('quiz-step').textContent = 'FIM';

    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    document.getElementById('quiz-question-area').style.display = 'block';
    document.getElementById('quiz-question-text').innerHTML = `
        <div class="quiz-completion">
            <div class="quiz-completion-trophy">🏆</div>
            <div class="quiz-completion-title">QUIZ COMPLETO!</div>
            <div class="quiz-completion-score">${formatAdventureScore(score)}/${formatAdventureScore(maxScore)} PONTOS (${pct}%)</div>
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

    if (earned.length > 0) {
        badgesEarned += earned.length;
        updateBadgeCount();
        showBadgeAchievement(earned[0]);
    }

    const actionBtn = document.getElementById('quiz-action-btn');
    actionBtn.textContent = '🌟 ENCERRAR AVENTURA';
    actionBtn.style.display = 'block';
    actionBtn.onclick = () => endTour();

    const quizContainer = document.querySelector('.quiz-container');
    quizContainer?.classList.add('quiz-has-answer', 'quiz-completed');
    overlay?.classList.add('quiz-has-answer', 'quiz-completed');
    requestAnimationFrame(() => {
        actionBtn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    });

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
        dots[stepIndex].classList.remove('correct', 'wrong');
        dots[stepIndex].classList.add(status);
    }
};

const updateBadgeCount = () => {
    if (window.TardisAchievements) return;
    const countEl = document.getElementById('badges-count');
    if (countEl) countEl.textContent = badgesEarned;
};

const showBadgeAchievement = (badge) => {
    const el = document.getElementById('badge-achievement');
    document.getElementById('badge-achievement-icon').textContent = badge.icon;
    document.getElementById('badge-achievement-name').textContent = badge.name;
    document.getElementById('badge-achievement-desc').textContent = badge.desc;

    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 4000);
};
