// ==========================================================
// T.A.R.D.I.S. — Mobile Viewport Helper
// Mantém variáveis CSS atualizadas em celulares e tablets,
// especialmente após rotação de tela e mudanças na viewport.
// ==========================================================

const root = document.documentElement;
let orientationTimer = null;
let viewportTimer = null;

const hasCoarsePointer = () => window.matchMedia?.('(pointer: coarse)').matches ?? false;
const isLandscape = () => window.innerWidth > window.innerHeight;
const isPortrait = () => window.innerHeight >= window.innerWidth;
const isCompactDevice = () => Math.min(window.innerWidth, window.innerHeight) <= 950 || hasCoarsePointer();

const updateViewportState = () => {
  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width || window.innerWidth);
  const height = Math.round(viewport?.height || window.innerHeight);
  const mobile = isCompactDevice();
  const landscape = isLandscape();
  const portrait = isPortrait();

  root.style.setProperty('--app-width', `${width}px`);
  root.style.setProperty('--app-height', `${height}px`);
  root.dataset.orientation = landscape ? 'landscape' : 'portrait';
  root.dataset.mobileLandscape = mobile && landscape ? 'true' : 'false';
  root.dataset.mobilePortrait = mobile && portrait ? 'true' : 'false';

  document.body?.classList.toggle('is-mobile-landscape', mobile && landscape);
  document.body?.classList.toggle('is-mobile-portrait', mobile && portrait);
};

const updateAndNudgeRenderer = () => {
  updateViewportState();

  // Dá tempo para o navegador recalcular a viewport antes de avisar o Three.js.
  window.clearTimeout(orientationTimer);
  orientationTimer = window.setTimeout(() => {
    updateViewportState();
    window.dispatchEvent(new Event('resize'));
  }, 280);
};

updateViewportState();
window.addEventListener('load', updateAndNudgeRenderer, { once: true });
window.addEventListener('resize', updateViewportState, { passive: true });
window.addEventListener('orientationchange', updateAndNudgeRenderer, { passive: true });

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    window.clearTimeout(viewportTimer);
    viewportTimer = window.setTimeout(updateViewportState, 80);
  }, { passive: true });
}
