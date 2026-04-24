// ============================================
// T.A.R.D.I.S. — GUIDED TOUR (Doctor Who Mode)
// ============================================
import { PLANETS_DATA } from '../data/planetsData.js';
import { GUIDED_TOUR_DATA } from '../data/guidedTourData.js';
import { PLANET_DETAILS_DATA } from '../data/planetDetails.js';
import { navigateToPlanet } from '../camera/cameraController.js';
import { showPlanetInfo, hideInfoPanel } from './infoPanel.js';
import { highlightPlanetSelector, hidePlanetSelector, showPlanetSelector } from './planetSelector.js';

// --- Tour state ---
var guidedModeActive = false;
var currentTourStep = 0;
var tourPanel = null;
var tourBtn = null;
var hasAnsweredCorrectly = false;

// Callbacks set by main.js for planet entry
var onTourEnterPlanet = null;
var onTourExitToSolar = null;

/**
 * Initialize the guided tour UI: button + panel.
 * @param {object} callbacks - { enterPlanet: fn(pData), exitPlanet: fn() }
 */
export function initGuidedTour(callbacks) {
    if (callbacks) {
        onTourEnterPlanet = callbacks.enterPlanet || null;
        onTourExitToSolar = callbacks.exitPlanet || null;
    }

    // Create the adventure button in the header
    createTourButton();

    // Create the Doctor panel (hidden by default)
    createTourPanel();
}

/**
 * Returns true if the guided tour is currently active.
 */
export function isGuidedModeActive() {
    return guidedModeActive;
}

// =============================================
// DOM CREATION
// =============================================

/**
 * Create the "MODO AVENTURA" button and append to the header bar.
 */
function createTourButton() {
    tourBtn = document.createElement('button');
    tourBtn.id = 'guided-tour-btn';
    tourBtn.className = 'guided-tour-btn';
    tourBtn.innerHTML = '🌀 MODO AVENTURA';
    tourBtn.title = 'Iniciar viagem guiada pelo Sistema Solar';

    tourBtn.addEventListener('click', function () {
        if (guidedModeActive) {
            endGuidedTour();
        } else {
            startGuidedTour();
        }
    });

    // Insert into header bar
    var headerBar = document.querySelector('.header-bar');
    if (headerBar) {
        headerBar.appendChild(tourBtn);
    }
}

/**
 * Create the Doctor Who guide panel.
 */
function createTourPanel() {
    tourPanel = document.createElement('div');
    tourPanel.id = 'guided-tour-panel';

    tourPanel.innerHTML = buildPanelHTML();

    document.getElementById('ui-layer').appendChild(tourPanel);

    // Wire up close button
    var closeBtn = document.getElementById('tour-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            endGuidedTour();
        });
    }

    // Wire up next button
    var nextBtn = document.getElementById('tour-next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            if (hasAnsweredCorrectly) {
                advanceToNextPlanet();
            }
        });
    }
}

/**
 * Build the panel's inner HTML.
 */
function buildPanelHTML() {
    return '' +
        '<div class="tour-panel-inner">' +
            '<div class="tour-header">' +
                '<div class="tour-header-left">' +
                    '<div class="doctor-avatar">🧥</div>' +
                    '<div class="tour-header-info">' +
                        '<div class="tour-header-title">O DOUTOR</div>' +
                        '<div class="tour-header-sub">Guia Temporal</div>' +
                    '</div>' +
                '</div>' +
                '<div class="tour-header-right">' +
                    '<div class="tour-progress-text" id="tour-progress-text">0/9</div>' +
                    '<button class="tour-close" id="tour-close-btn" title="Encerrar Aventura">✕</button>' +
                '</div>' +
            '</div>' +

            '<div class="tour-progress-bar">' +
                '<div class="tour-progress-fill" id="tour-progress-fill"></div>' +
            '</div>' +

            '<div class="tour-body">' +
                '<div class="tour-dialogue" id="tour-dialogue">' +
                    'Preparado para uma aventura pelo Sistema Solar?' +
                '</div>' +

                '<div class="tour-planet-badge" id="tour-planet-badge" style="display:none;">' +
                    '<span class="tour-planet-icon" id="tour-planet-icon">🪐</span>' +
                    '<span class="tour-planet-name" id="tour-planet-name">--</span>' +
                '</div>' +

                '<div class="tour-question-area" id="tour-question-area" style="display:none;">' +
                    '<div class="tour-question" id="tour-question">--</div>' +
                    '<div class="tour-options" id="tour-options"></div>' +
                '</div>' +

                '<div class="tour-feedback" id="tour-feedback" style="display:none;"></div>' +

                '<div class="tour-actions">' +
                    '<button class="tour-next-btn" id="tour-next-btn" style="display:none;">PRÓXIMO PLANETA →</button>' +
                '</div>' +
            '</div>' +
        '</div>';
}

// =============================================
// TOUR LIFECYCLE
// =============================================

/**
 * Start the guided tour from planet 0 (Sun).
 */
function startGuidedTour() {
    guidedModeActive = true;
    currentTourStep = 0;
    hasAnsweredCorrectly = false;

    // Update button
    tourBtn.innerHTML = '⏹ PARAR AVENTURA';
    tourBtn.classList.add('active');

    // Hide planet selector
    hidePlanetSelector();

    // Show tour panel
    tourPanel.classList.add('active');

    // If we're on a planet surface, exit first
    if (onTourExitToSolar) {
        onTourExitToSolar();
    }

    // Start the first step after a brief delay
    setTimeout(function () {
        showTourStep(0);
    }, 600);
}

/**
 * End the guided tour and restore normal navigation.
 */
function endGuidedTour() {
    guidedModeActive = false;
    currentTourStep = 0;
    hasAnsweredCorrectly = false;

    // Update button
    tourBtn.innerHTML = '🌀 MODO AVENTURA';
    tourBtn.classList.remove('active');

    // Hide tour panel
    tourPanel.classList.remove('active');

    // Show planet selector again
    showPlanetSelector();

    // Hide info panel
    hideInfoPanel();
}

/**
 * Show a specific tour step (planet + question).
 */
function showTourStep(stepIndex) {
    if (stepIndex >= GUIDED_TOUR_DATA.length) {
        showTourComplete();
        return;
    }

    currentTourStep = stepIndex;
    hasAnsweredCorrectly = false;

    var tourData = GUIDED_TOUR_DATA[stepIndex];
    var planetIndex = findPlanetIndexByName(tourData.planetNameEN);

    // Update progress
    updateProgress(stepIndex);

    // Navigate camera to planet
    if (planetIndex >= 0) {
        navigateToPlanet(planetIndex);

        // Show planet info
        var pData = PLANETS_DATA[planetIndex];
        showPlanetInfo(pData);
        highlightPlanetSelector(planetIndex);
    }

    // Planet icons mapping
    var planetIcons = {
        'Sun': '☀️', 'Mercury': '⚫', 'Venus': '🟡', 'Earth': '🌍',
        'Mars': '🔴', 'Jupiter': '🟠', 'Saturn': '🪐', 'Uranus': '🔵', 'Neptune': '🔵'
    };

    // Show planet badge
    var badgeEl = document.getElementById('tour-planet-badge');
    badgeEl.style.display = 'flex';
    document.getElementById('tour-planet-icon').textContent = planetIcons[tourData.planetNameEN] || '🪐';
    document.getElementById('tour-planet-name').textContent = tourData.planetNameEN;

    // Show Doctor's intro
    var dialogueEl = document.getElementById('tour-dialogue');
    dialogueEl.textContent = tourData.doctorIntro;
    dialogueEl.className = 'tour-dialogue tour-dialogue-animate';

    // Hide feedback and next button
    document.getElementById('tour-feedback').style.display = 'none';
    document.getElementById('tour-next-btn').style.display = 'none';

    // Show question after a short delay (let user read intro)
    setTimeout(function () {
        showQuestion(tourData);
    }, 2000);
}

/**
 * Show the question and options for the current step.
 */
function showQuestion(tourData) {
    var questionArea = document.getElementById('tour-question-area');
    questionArea.style.display = 'block';

    document.getElementById('tour-question').textContent = tourData.question;

    var optionsContainer = document.getElementById('tour-options');
    optionsContainer.innerHTML = '';

    for (var i = 0; i < tourData.options.length; i++) {
        var optBtn = document.createElement('button');
        optBtn.className = 'tour-option';
        optBtn.textContent = tourData.options[i];
        optBtn.dataset.index = i;

        optBtn.addEventListener('click', function () {
            var selectedIndex = parseInt(this.dataset.index, 10);
            checkAnswer(selectedIndex);
        });

        optionsContainer.appendChild(optBtn);
    }
}

/**
 * Check if the selected answer is correct.
 */
function checkAnswer(selectedIndex) {
    var tourData = GUIDED_TOUR_DATA[currentTourStep];
    var feedbackEl = document.getElementById('tour-feedback');
    var dialogueEl = document.getElementById('tour-dialogue');
    var optionBtns = document.querySelectorAll('.tour-option');

    if (selectedIndex === tourData.correctIndex) {
        // CORRECT
        hasAnsweredCorrectly = true;
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'tour-feedback tour-feedback-correct';
        feedbackEl.textContent = '✅ CORRETO!';

        dialogueEl.textContent = tourData.doctorCorrect;
        dialogueEl.className = 'tour-dialogue tour-dialogue-animate';

        // Highlight correct option
        for (var i = 0; i < optionBtns.length; i++) {
            optionBtns[i].disabled = true;
            if (i === tourData.correctIndex) {
                optionBtns[i].classList.add('correct');
            }
        }

        // Show next button (or finish)
        var nextBtn = document.getElementById('tour-next-btn');
        if (currentTourStep >= GUIDED_TOUR_DATA.length - 1) {
            nextBtn.textContent = '🏆 CONCLUIR AVENTURA';
        } else {
            nextBtn.textContent = 'PRÓXIMO PLANETA →';
        }
        nextBtn.style.display = 'block';

    } else {
        // WRONG
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'tour-feedback tour-feedback-wrong';
        feedbackEl.textContent = '❌ Tente novamente!';

        dialogueEl.textContent = tourData.doctorWrong;
        dialogueEl.className = 'tour-dialogue tour-dialogue-animate';

        // Highlight wrong option
        for (var j = 0; j < optionBtns.length; j++) {
            if (parseInt(optionBtns[j].dataset.index, 10) === selectedIndex) {
                optionBtns[j].classList.add('wrong');
                optionBtns[j].disabled = true;
            }
        }
    }
}

/**
 * Advance to the next planet in the tour.
 */
function advanceToNextPlanet() {
    var nextStep = currentTourStep + 1;

    // Hide question area
    document.getElementById('tour-question-area').style.display = 'none';
    document.getElementById('tour-feedback').style.display = 'none';
    document.getElementById('tour-next-btn').style.display = 'none';

    if (nextStep >= GUIDED_TOUR_DATA.length) {
        showTourComplete();
    } else {
        showTourStep(nextStep);
    }
}

/**
 * Show the tour completion screen.
 */
function showTourComplete() {
    var dialogueEl = document.getElementById('tour-dialogue');
    dialogueEl.textContent =
        'Fantástico! Você completou a viagem por todo o Sistema Solar! ' +
        'De Mercúrio a Netuno, passando por tempestades, vulcões e diamantes. ' +
        'Você seria um excelente companheiro da TARDIS. Até a próxima aventura... Allons-y! 🌌';
    dialogueEl.className = 'tour-dialogue tour-dialogue-animate';

    document.getElementById('tour-question-area').style.display = 'none';
    document.getElementById('tour-feedback').style.display = 'none';

    var nextBtn = document.getElementById('tour-next-btn');
    nextBtn.textContent = '🌟 ENCERRAR AVENTURA';
    nextBtn.style.display = 'block';

    // Override click for final button
    nextBtn.onclick = function () {
        endGuidedTour();
    };

    // Update progress to 100%
    document.getElementById('tour-progress-text').textContent = '9/9';
    document.getElementById('tour-progress-fill').style.width = '100%';

    // Show completion badge
    var badgeEl = document.getElementById('tour-planet-badge');
    badgeEl.style.display = 'flex';
    document.getElementById('tour-planet-icon').textContent = '🏆';
    document.getElementById('tour-planet-name').textContent = 'MISSÃO COMPLETA';
}

// =============================================
// HELPERS
// =============================================

/**
 * Find the index of a planet by its English name.
 */
function findPlanetIndexByName(nameEN) {
    for (var i = 0; i < PLANETS_DATA.length; i++) {
        if (PLANETS_DATA[i].nameEN === nameEN) {
            return i;
        }
    }
    return -1;
}

/**
 * Update the progress indicator.
 */
function updateProgress(stepIndex) {
    var total = GUIDED_TOUR_DATA.length;
    var progressText = document.getElementById('tour-progress-text');
    var progressFill = document.getElementById('tour-progress-fill');

    if (progressText) {
        progressText.textContent = (stepIndex + 1) + '/' + total;
    }
    if (progressFill) {
        var percent = ((stepIndex + 1) / total) * 100;
        progressFill.style.width = percent + '%';
    }
}
