// ============================================
// T.A.R.D.I.S. — KEYBOARD CONTROLS
// ============================================

let callbacks = {
    onNavigateNext: null,
    onNavigatePrev: null,
    onEnterPlanet: null,
    onExitPlanet: null
};

export function setKeyboardCallbacks(cbs) {
    callbacks = { ...callbacks, ...cbs };
}

export function initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (callbacks.onNavigateNext) callbacks.onNavigateNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (callbacks.onNavigatePrev) callbacks.onNavigatePrev();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (callbacks.onEnterPlanet) callbacks.onEnterPlanet();
        } else if (e.key === 'Escape' || e.key === 'Backspace') {
            e.preventDefault();
            if (callbacks.onExitPlanet) callbacks.onExitPlanet();
        }
    });
}
