// ============================================
// T.A.R.D.I.S. — CONFIGURAÇÃO GLOBAL
// ============================================

// --- API KEY ---
let apiKey = 'DEMO_KEY';
if (typeof NASA_API_KEY !== 'undefined') {
    apiKey = NASA_API_KEY;
} else if (import.meta.env && import.meta.env.VITE_NASA_KEY) {
    apiKey = import.meta.env.VITE_NASA_KEY;
}

// --- CONSTANTES ---
export const GLOBE_RADIUS = 2.5;
export const GLOBE_SEGMENTS = 64;
export const ROTATION_SPEED = 0.004;

// --- APIs ---
export const NASA_IMAGE_API = 'https://images-api.nasa.gov/search';
export const NASA_APOD_API = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

// --- TEXTURAS — Solar System Scope ---
// images.weserv.nl é um proxy de imagens gratuito com suporte CORS
export const TEXTURE_BASE = 'https://images.weserv.nl/?url=www.solarsystemscope.com/textures/download/';

// 2K — Carregamento rápido para visão do Sistema Solar (planetas pequenos)
export const TEXTURES = {
    sun:             `${TEXTURE_BASE}2k_sun.jpg`,
    mercury:         `${TEXTURE_BASE}2k_mercury.jpg`,
    venus_surface:   `${TEXTURE_BASE}2k_venus_surface.jpg`,
    venus_atmosphere:`${TEXTURE_BASE}2k_venus_atmosphere.jpg`,
    earth_daymap:    `${TEXTURE_BASE}2k_earth_daymap.jpg`,
    earth_clouds:    `${TEXTURE_BASE}2k_earth_clouds.jpg`,
    earth_nightmap:  `${TEXTURE_BASE}2k_earth_nightmap.jpg`,
    mars:            `${TEXTURE_BASE}2k_mars.jpg`,
    jupiter:         `${TEXTURE_BASE}2k_jupiter.jpg`,
    saturn:          `${TEXTURE_BASE}2k_saturn.jpg`,
    saturn_ring:     `${TEXTURE_BASE}2k_saturn_ring_alpha.png`,
    uranus:          `${TEXTURE_BASE}2k_uranus.jpg`,
    neptune:         `${TEXTURE_BASE}2k_neptune.jpg`,
    stars_milky_way: `${TEXTURE_BASE}2k_stars_milky_way.jpg`,
};

// 8K — Alta resolução para visão de Superfície (carregado sob demanda)
export const TEXTURES_HQ = {
    sun:             `${TEXTURE_BASE}8k_sun.jpg`,
    mercury:         `${TEXTURE_BASE}8k_mercury.jpg`,
    venus_surface:   `${TEXTURE_BASE}8k_venus_surface.jpg`,
    venus_atmosphere:`${TEXTURE_BASE}8k_venus_atmosphere.jpg`,
    earth_daymap:    `${TEXTURE_BASE}8k_earth_daymap.jpg`,
    earth_clouds:    `${TEXTURE_BASE}8k_earth_clouds.jpg`,
    earth_nightmap:  `${TEXTURE_BASE}8k_earth_nightmap.jpg`,
    mars:            `${TEXTURE_BASE}8k_mars.jpg`,
    jupiter:         `${TEXTURE_BASE}8k_jupiter.jpg`,
    saturn:          `${TEXTURE_BASE}8k_saturn.jpg`,
    saturn_ring:     `${TEXTURE_BASE}8k_saturn_ring_alpha.png`,
    uranus:          `${TEXTURE_BASE}2k_uranus.jpg`,
    neptune:         `${TEXTURE_BASE}2k_neptune.jpg`,
    stars_milky_way: `${TEXTURE_BASE}8k_stars_milky_way.jpg`,
};

// --- SCENE STATES ---
export const SceneState = {
    SOLAR_SYSTEM: 'SOLAR_SYSTEM',
    PLANET_SURFACE: 'PLANET_SURFACE'
};

// --- DEVICE DETECTION ---
function isMobileDevice() {
    // Check user agent
    const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check screen dimensions
    const smallScreen = window.innerWidth <= 768 || window.innerHeight <= 600;

    // Check touch capability
    const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Check WebGL max texture size (low-end GPUs cap at 4096)
    let lowGPU = false;
    try {
        const c = document.createElement('canvas');
        const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
        if (gl) {
            const maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            lowGPU = maxTexSize < 8192;
            // Also check available memory via WEBGL_debug_renderer_info
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                console.log('[T.A.R.D.I.S.] GPU:', renderer, '| Max Texture:', maxTexSize);
            }
            c.remove();
        }
    } catch (e) { /* ignore */ }

    return (mobileUA && hasTouch) || (smallScreen && hasTouch) || lowGPU;
}

export const IS_MOBILE = isMobileDevice();
export const USE_HQ_TEXTURES = !IS_MOBILE;

// Log detection result
console.log(`[T.A.R.D.I.S.] Device: ${IS_MOBILE ? 'MOBILE' : 'DESKTOP'} | HQ Textures: ${USE_HQ_TEXTURES ? 'ON' : 'OFF'}`);

// --- PERFORMANCE ---
export const GLOBE_SEGMENTS_MOBILE = 32;
export const EFFECTIVE_SEGMENTS = IS_MOBILE ? GLOBE_SEGMENTS_MOBILE : GLOBE_SEGMENTS;

// --- MOBILE PERFORMANCE TUNING ---
// Max glow layers on the Sun (desktop: 3, mobile: 1 to reduce overdraw)
export const MAX_GLOW_LAYERS = IS_MOBILE ? 1 : 3;
// Atmosphere shells on planets (disabled on mobile to cut fill-rate)
export const ATMOSPHERE_ENABLED = !IS_MOBILE;
// Comet count (desktop: 5, mobile: 2)
export const COMET_COUNT = IS_MOBILE ? 2 : 5;
// Tail particle count per comet (desktop: 200, mobile: 80)
export const COMET_TAIL_PARTICLES = IS_MOBILE ? 80 : 200;
// Star count (desktop: 3000, mobile: 1500)
export const STAR_COUNT = IS_MOBILE ? 1500 : 3000;
// MediaPipe hand tracking on mobile (disabled — saves 30-50% CPU)
export const MEDIAPIPE_ENABLED = !IS_MOBILE;
// Camera resolution for MediaPipe (lower on mobile if ever re-enabled)
export const MEDIAPIPE_CAMERA_RES = IS_MOBILE
    ? { width: 640, height: 480 }
    : { width: 1280, height: 720 };
