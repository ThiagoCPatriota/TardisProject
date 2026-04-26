// ============================================
// T.A.R.D.I.S. — FPS MONITOR (Performance Panel)
// ============================================
import { renderer } from '../scene/setup.js';

var fpsContainer = null;
var fpsValueEl = null;
var fpsBarChart = null;
var fpsDrawCalls = null;
var fpsTriangles = null;
var fpsGeometries = null;
var fpsTextures = null;

var frameCount = 0;
var lastFPSUpdate = 0;
var currentFPS = 0;
var fpsHistory = [];
var FPS_HISTORY_LENGTH = 60;
var FPS_UPDATE_INTERVAL = 500; // ms
var isVisible = true;

/**
 * Create the FPS monitor DOM elements and keyboard toggle.
 */
export function initFPSMonitor() {
    // Container
    fpsContainer = document.createElement('div');
    fpsContainer.id = 'fps-monitor';
    fpsContainer.innerHTML = buildMonitorHTML();
    document.getElementById('ui-layer').appendChild(fpsContainer);

    // Cache references
    fpsValueEl = document.getElementById('fps-value');
    fpsBarChart = document.getElementById('fps-bar-chart');
    fpsDrawCalls = document.getElementById('fps-draw-calls');
    fpsTriangles = document.getElementById('fps-triangles');
    fpsGeometries = document.getElementById('fps-geometries');
    fpsTextures = document.getElementById('fps-textures');

    // Initialize history
    for (var i = 0; i < FPS_HISTORY_LENGTH; i++) {
        fpsHistory.push(0);
    }

    // Toggle with F key
    document.addEventListener('keydown', function (e) {
        if (e.target?.closest?.('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) return;

        if (e.key === 'f' || e.key === 'F') {
            if (document.getElementById('planet-detail-modal').classList.contains('active')) return;
            if (document.getElementById('guided-tour-panel')) {
                var panel = document.getElementById('guided-tour-panel');
                if (panel.classList.contains('active')) return;
            }
            toggleFPSMonitor();
        }
    });

    // Click to toggle details
    fpsContainer.addEventListener('click', function () {
        fpsContainer.classList.toggle('expanded');
    });

    lastFPSUpdate = performance.now();
}

/**
 * Build the HTML string for the monitor.
 */
function buildMonitorHTML() {
    return '' +
        '<div class="fps-header">' +
            '<span class="fps-label">FPS</span>' +
            '<span class="fps-value" id="fps-value">--</span>' +
        '</div>' +
        '<div class="fps-chart-container">' +
            '<canvas id="fps-bar-chart" width="120" height="32"></canvas>' +
        '</div>' +
        '<div class="fps-details">' +
            '<div class="fps-stat"><span class="fps-stat-label">DRAW CALLS</span><span class="fps-stat-val" id="fps-draw-calls">0</span></div>' +
            '<div class="fps-stat"><span class="fps-stat-label">TRIÂNGULOS</span><span class="fps-stat-val" id="fps-triangles">0</span></div>' +
            '<div class="fps-stat"><span class="fps-stat-label">GEOMETRIAS</span><span class="fps-stat-val" id="fps-geometries">0</span></div>' +
            '<div class="fps-stat"><span class="fps-stat-label">TEXTURAS</span><span class="fps-stat-val" id="fps-textures">0</span></div>' +
        '</div>';
}

/**
 * Toggle visibility of the FPS monitor.
 */
function toggleFPSMonitor() {
    isVisible = !isVisible;
    if (fpsContainer) {
        fpsContainer.style.display = isVisible ? 'block' : 'none';
    }
}

/**
 * Update the FPS counter. Called every frame from animate().
 */
export function updateFPS(delta) {
    frameCount++;

    var now = performance.now();
    var elapsed = now - lastFPSUpdate;

    if (elapsed >= FPS_UPDATE_INTERVAL) {
        currentFPS = Math.round((frameCount * 1000) / elapsed);
        frameCount = 0;
        lastFPSUpdate = now;

        // Update history
        fpsHistory.push(currentFPS);
        if (fpsHistory.length > FPS_HISTORY_LENGTH) {
            fpsHistory.shift();
        }

        // Update DOM
        if (fpsValueEl) {
            fpsValueEl.textContent = currentFPS;

            // Color coding
            if (currentFPS >= 55) {
                fpsValueEl.className = 'fps-value fps-good';
            } else if (currentFPS >= 30) {
                fpsValueEl.className = 'fps-value fps-warn';
            } else {
                fpsValueEl.className = 'fps-value fps-bad';
            }
        }

        // Update bar chart
        renderBarChart();

        // Update renderer stats
        if (renderer && renderer.info) {
            if (fpsDrawCalls) fpsDrawCalls.textContent = renderer.info.render.calls || 0;
            if (fpsTriangles) fpsTriangles.textContent = formatNumber(renderer.info.render.triangles || 0);
            if (fpsGeometries) fpsGeometries.textContent = renderer.info.memory.geometries || 0;
            if (fpsTextures) fpsTextures.textContent = renderer.info.memory.textures || 0;
        }
    }
}

/**
 * Render the mini bar chart using Canvas 2D.
 */
function renderBarChart() {
    if (!fpsBarChart) return;

    var ctx = fpsBarChart.getContext('2d');
    var w = fpsBarChart.width;
    var h = fpsBarChart.height;

    ctx.clearRect(0, 0, w, h);

    var barWidth = w / FPS_HISTORY_LENGTH;
    var maxFPS = 80; // scale reference

    for (var i = 0; i < fpsHistory.length; i++) {
        var val = fpsHistory[i];
        var barH = Math.min((val / maxFPS) * h, h);
        var x = i * barWidth;
        var y = h - barH;

        // Color based on FPS value
        if (val >= 55) {
            ctx.fillStyle = 'rgba(0, 255, 136, 0.7)';
        } else if (val >= 30) {
            ctx.fillStyle = 'rgba(255, 200, 0, 0.7)';
        } else {
            ctx.fillStyle = 'rgba(255, 60, 60, 0.7)';
        }

        ctx.fillRect(x, y, barWidth - 1, barH);
    }

    // Reference line at 60 FPS
    var refY = h - (60 / maxFPS) * h;
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, refY);
    ctx.lineTo(w, refY);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Format large numbers with K/M suffix.
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return String(num);
}
