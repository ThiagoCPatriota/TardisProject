// ============================================
// T.A.R.D.I.S. — KEYBOARD CONTROLS
// ============================================

let callbacks = {
    onNavigateNext: null,
    onNavigatePrev: null,
    onEnterPlanet: null,
    onExitPlanet: null
};

function isEditableTarget(target) {
    if (!target) return false;

    return Boolean(
        target.closest?.('input, textarea, select, [contenteditable="true"], [contenteditable=""]')
    );
}

export function setKeyboardCallbacks(cbs) {
    callbacks = { ...callbacks, ...cbs };
}

export function initKeyboardControls() {
    window.addEventListener('keydown', (e) => {
        // Quando o usuário está digitando em formulários (login, cadastro,
        // nome de explorador, senha, continha etc.), o teclado precisa se
        // comportar como teclado normal. Sem isso, Backspace/Enter/Setas
        // poderiam ser capturados pelos controles globais da T.A.R.D.I.S.
        if (isEditableTarget(e.target)) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (callbacks.onNavigateNext) callbacks.onNavigateNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (callbacks.onNavigatePrev) callbacks.onNavigatePrev();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (callbacks.onEnterPlanet) callbacks.onEnterPlanet();
        } else if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            if (callbacks.onExitPlanet) callbacks.onExitPlanet();
        }
    });
}
