// ============================================
// T.A.R.D.I.S. — MOUSE CONTROLS
// ============================================

// Sensitivity settings
const MOUSE_ROTATION_SPEED = 0.003;
const MOUSE_ZOOM_SPEED = 2.0;

let isDragging = false;
let lastMousePos = { x: 0, y: 0 };

// Callbacks set by main.js
let callbacks = {
    onMove: null,      // (dx, dy)
    onZoomIn: null,    // ()
    onZoomOut: null    // ()
};

export function setMouseCallbacks(cbs) {
    callbacks = { ...callbacks, ...cbs };
}

export function initMouseControls() {
    const canvas = document.getElementById('output_canvas');

    // --- DRAG TO ROTATE ---
    window.addEventListener('mousedown', (e) => {
        // Only start drag on left button, and ignore clicks on UI elements
        if (e.button !== 0) return;
        if (e.target.closest('#controls-summary, #info-panel, #planet-detail-modal, #apod-widget, #planet-selector, button, .pdm-close')) return;

        isDragging = true;
        lastMousePos = { x: e.clientX, y: e.clientY };

        // Change cursor to grabbing
        document.body.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = (e.clientX - lastMousePos.x) * MOUSE_ROTATION_SPEED;
        const dy = (e.clientY - lastMousePos.y) * MOUSE_ROTATION_SPEED;

        if (callbacks.onMove) callbacks.onMove(dx, dy);

        lastMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button !== 0) return;
        isDragging = false;
        document.body.style.cursor = '';
    });

    // Reset drag if mouse leaves window
    window.addEventListener('mouseleave', () => {
        isDragging = false;
        document.body.style.cursor = '';
    });

    // --- SCROLL TO ZOOM ---
    window.addEventListener('wheel', (e) => {
        // Ignore scroll on UI panels
        if (e.target.closest('#info-panel, #planet-detail-modal, #apod-widget, .pdm-body, .info-desc')) return;

        e.preventDefault();

        if (e.deltaY > 0) {
            // Scroll down = zoom out
            if (callbacks.onZoomOut) {
                // Apply proportional zoom based on scroll intensity
                const steps = Math.ceil(Math.abs(e.deltaY) / 50);
                for (let i = 0; i < steps; i++) {
                    callbacks.onZoomOut();
                }
            }
        } else if (e.deltaY < 0) {
            // Scroll up = zoom in
            if (callbacks.onZoomIn) {
                const steps = Math.ceil(Math.abs(e.deltaY) / 50);
                for (let i = 0; i < steps; i++) {
                    callbacks.onZoomIn();
                }
            }
        }
    }, { passive: false });

    // Prevent context menu on right-click over canvas
    window.addEventListener('contextmenu', (e) => {
        if (e.target === canvas || e.target.tagName === 'CANVAS') {
            e.preventDefault();
        }
    });
}
