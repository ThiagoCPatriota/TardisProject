// ============================================
// T.A.R.D.I.S. — TOUCH CONTROLS (Mobile)
// ============================================
// Implements swipe-to-orbit (1 finger) and pinch-to-zoom (2 fingers).
// Follows the same callback pattern as mouseControls.js.

const TOUCH_ROTATION_SPEED = 0.005;
const TOUCH_ZOOM_SPEED = 0.015;
const PINCH_THRESHOLD = 2;     // Min pixel delta to register pinch
const TAP_THRESHOLD_MS = 250;  // Max duration for a tap gesture
const TAP_THRESHOLD_PX = 10;   // Max pixel movement for a tap gesture

// --- STATE ---
let isTouchDragging = false;
let isPinching = false;
let lastTouchPos = { x: 0, y: 0 };
let lastPinchDist = 0;
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };

// --- CALLBACKS (set by main.js) ---
let callbacks = {
    onMove: null,      // (dx, dy)
    onZoomIn: null,    // ()
    onZoomOut: null,   // ()
    onTap: null        // (x, y) — screen coordinates of tap
};

export function setTouchCallbacks(cbs) {
    callbacks = { ...callbacks, ...cbs };
}

/**
 * Calculate the distance between two touch points.
 */
function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get the midpoint between two touches (unused for now, ready for pan).
 */
function getPinchCenter(touches) {
    return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
    };
}

/**
 * Check if the touch target is a UI element that should be ignored.
 */
function isUIElement(target) {
    return target.closest(
        '#controls-summary, #info-panel, #planet-detail-modal, ' +
        '#apod-widget, #planet-selector, #achievements-page, #auth-modal, #mission-detail-modal, button, .pdm-close, .mdm-close, .pdm-body, .mdm-body'
    );
}

export function initTouchControls() {
    // --- TOUCH START ---
    window.addEventListener('touchstart', (e) => {
        if (isUIElement(e.target)) return;

        if (e.touches.length === 1) {
            // Single finger — prepare for drag or tap
            isTouchDragging = true;
            isPinching = false;
            lastTouchPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            touchStartTime = performance.now();
            touchStartPos = { ...lastTouchPos };

        } else if (e.touches.length === 2) {
            // Two fingers — pinch mode
            isTouchDragging = false;
            isPinching = true;
            lastPinchDist = getPinchDistance(e.touches);
        }
    }, { passive: true });

    // --- TOUCH MOVE ---
    window.addEventListener('touchmove', (e) => {
        if (isUIElement(e.target)) return;

        // Prevent browser scroll/zoom while interacting with the 3D scene
        e.preventDefault();

        if (e.touches.length === 1 && isTouchDragging && !isPinching) {
            // Single finger drag → orbit rotation
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;

            const dx = (currentX - lastTouchPos.x) * TOUCH_ROTATION_SPEED;
            const dy = (currentY - lastTouchPos.y) * TOUCH_ROTATION_SPEED;

            if (callbacks.onMove) callbacks.onMove(dx, dy);

            lastTouchPos = { x: currentX, y: currentY };

        } else if (e.touches.length === 2 && isPinching) {
            // Two finger pinch → zoom
            const currentDist = getPinchDistance(e.touches);
            const delta = currentDist - lastPinchDist;

            if (Math.abs(delta) > PINCH_THRESHOLD) {
                // Calculate proportional zoom steps based on pinch magnitude
                const steps = Math.max(1, Math.floor(Math.abs(delta) * TOUCH_ZOOM_SPEED));

                if (delta > 0) {
                    // Fingers spreading apart → zoom in
                    for (let i = 0; i < steps; i++) {
                        if (callbacks.onZoomIn) callbacks.onZoomIn();
                    }
                } else {
                    // Fingers pinching together → zoom out
                    for (let i = 0; i < steps; i++) {
                        if (callbacks.onZoomOut) callbacks.onZoomOut();
                    }
                }
            }

            lastPinchDist = currentDist;
        }
    }, { passive: false }); // passive: false required for preventDefault

    // --- TOUCH END ---
    window.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
            // Detect tap (short press + no significant movement)
            const elapsed = performance.now() - touchStartTime;
            if (isTouchDragging && elapsed < TAP_THRESHOLD_MS) {
                const movedX = Math.abs(lastTouchPos.x - touchStartPos.x);
                const movedY = Math.abs(lastTouchPos.y - touchStartPos.y);
                if (movedX < TAP_THRESHOLD_PX && movedY < TAP_THRESHOLD_PX) {
                    if (callbacks.onTap) {
                        callbacks.onTap(touchStartPos.x, touchStartPos.y);
                    }
                }
            }
            isTouchDragging = false;
            isPinching = false;

        } else if (e.touches.length === 1) {
            // Went from 2 fingers to 1 — switch back to drag mode
            isPinching = false;
            isTouchDragging = true;
            lastTouchPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
    }, { passive: true });

    // --- TOUCH CANCEL ---
    window.addEventListener('touchcancel', () => {
        isTouchDragging = false;
        isPinching = false;
    }, { passive: true });
}
