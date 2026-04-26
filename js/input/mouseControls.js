// ============================================
// T.A.R.D.I.S. — MOUSE CONTROLS (Refactored)
// ============================================

const MOUSE_ROTATION_SPEED = 0.003;
const CLICK_THRESHOLD_PX = 5;    // Max pixel movement to register as click
const CLICK_THRESHOLD_MS = 300;  // Max duration for a click gesture

let isDragging = false;
let lastMousePos = { x: 0, y: 0 };
let mouseDownPos = { x: 0, y: 0 };
let mouseDownTime = 0;

// Callbacks set by main.js
let callbacks = {
    onMove: null,      // (dx, dy)
    onZoomIn: null,    // ()
    onZoomOut: null,   // ()
    onClick: null      // (x, y) — screen coordinates of click
};

export const setMouseCallbacks = (cbs) => {
    callbacks = { ...callbacks, ...cbs };
};

// UI elements that should not trigger 3D interaction
const UI_SELECTORS = '#info-panel, #planet-detail-modal, #apod-widget, #planet-selector, #guided-tour-panel, #fps-monitor, #controls-summary, #achievements-page, #auth-modal, #mission-detail-modal, button, .pdm-close, .mdm-close';

export const initMouseControls = () => {
    const canvas = document.getElementById('output_canvas');

    // --- DRAG TO ROTATE ---
    window.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest(UI_SELECTORS)) return;

        isDragging = true;
        lastMousePos = { x: e.clientX, y: e.clientY };
        mouseDownPos = { x: e.clientX, y: e.clientY };
        mouseDownTime = performance.now();

        document.body.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = (e.clientX - lastMousePos.x) * MOUSE_ROTATION_SPEED;
        const dy = (e.clientY - lastMousePos.y) * MOUSE_ROTATION_SPEED;

        callbacks.onMove?.(dx, dy);

        lastMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button !== 0) return;
        if (!isDragging) return;

        isDragging = false;
        document.body.style.cursor = '';

        // Detect click (short press + no significant movement)
        const elapsed = performance.now() - mouseDownTime;
        const movedX = Math.abs(e.clientX - mouseDownPos.x);
        const movedY = Math.abs(e.clientY - mouseDownPos.y);

        if (elapsed < CLICK_THRESHOLD_MS && movedX < CLICK_THRESHOLD_PX && movedY < CLICK_THRESHOLD_PX) {
            callbacks.onClick?.(e.clientX, e.clientY);
        }
    });

    // Reset drag if mouse leaves window
    window.addEventListener('mouseleave', () => {
        isDragging = false;
        document.body.style.cursor = '';
    });

    // --- SCROLL TO ZOOM ---
    window.addEventListener('wheel', (e) => {
        if (e.target.closest('#info-panel, #planet-detail-modal, #mission-detail-modal, #apod-widget, .pdm-body, .mdm-body, .info-desc, #guided-tour-panel, #achievements-page, #auth-modal')) return;

        e.preventDefault();

        const steps = Math.ceil(Math.abs(e.deltaY) / 50);
        const zoomFn = e.deltaY > 0 ? callbacks.onZoomOut : callbacks.onZoomIn;

        if (zoomFn) {
            for (let i = 0; i < steps; i++) zoomFn();
        }
    }, { passive: false });

    // Prevent context menu on right-click over canvas
    window.addEventListener('contextmenu', (e) => {
        if (e.target === canvas || e.target.tagName === 'CANVAS') {
            e.preventDefault();
        }
    });
};
