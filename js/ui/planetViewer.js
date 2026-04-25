// ============================================
// T.A.R.D.I.S. — PLANET VIEWER (Inline 3D)
// Isolated Three.js mini-scene for the quiz
// overlay. Creates its own renderer, camera,
// lighting and planet mesh on a dedicated canvas.
// Lazy-loaded only when Adventure Mode starts.
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { PLANETS_DATA } from '../data/planetsData.js';

// --- INTERNAL STATE ---
let viewerScene = null;
let viewerCamera = null;
let viewerRenderer = null;
let viewerPlanet = null;
let viewerClouds = null;
let viewerRing = null;
let viewerAnimId = null;
let viewerCanvas = null;
let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let autoRotateSpeed = 0.003;
let targetRotY = 0;
let targetRotX = 0;

// Texture loader (shared)
const texLoader = new THREE.TextureLoader();
texLoader.setCrossOrigin('anonymous');

/**
 * Initialize the planet viewer inside a given container element.
 * Creates a dedicated WebGL canvas inside that container.
 * @param {HTMLElement} container — DOM element to render into
 */
export const initPlanetViewer = (container) => {
    if (viewerRenderer) return; // Already initialized

    viewerCanvas = document.createElement('canvas');
    viewerCanvas.className = 'quiz-planet-canvas';
    container.appendChild(viewerCanvas);

    // Scene
    viewerScene = new THREE.Scene();

    // Camera
    viewerCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    viewerCamera.position.set(0, 0, 4);
    viewerCamera.lookAt(0, 0, 0);

    // Renderer
    viewerRenderer = new THREE.WebGLRenderer({
        canvas: viewerCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
    });
    viewerRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    viewerRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    viewerRenderer.toneMappingExposure = 1.3;

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 2, 4);
    viewerScene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6688cc, 0.3);
    fillLight.position.set(-2, -1, -2);
    viewerScene.add(fillLight);

    const ambient = new THREE.AmbientLight(0x222244, 0.4);
    viewerScene.add(ambient);

    const rimLight = new THREE.PointLight(0xa855f7, 0.6, 20);
    rimLight.position.set(-3, 1, -2);
    viewerScene.add(rimLight);

    // Mouse interaction for rotation
    viewerCanvas.addEventListener('pointerdown', (e) => {
        isDragging = true;
        prevMouse.x = e.clientX;
        prevMouse.y = e.clientY;
        viewerCanvas.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = (e.clientX - prevMouse.x) * 0.006;
        const dy = (e.clientY - prevMouse.y) * 0.006;
        targetRotY += dx;
        targetRotX += dy;
        targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX));
        prevMouse.x = e.clientX;
        prevMouse.y = e.clientY;
    });

    window.addEventListener('pointerup', () => {
        isDragging = false;
        if (viewerCanvas) viewerCanvas.style.cursor = 'grab';
    });

    // Resize observer
    const ro = new ResizeObserver(() => resizeViewer(container));
    ro.observe(container);

    resizeViewer(container);
};

const resizeViewer = (container) => {
    if (!viewerRenderer || !container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    viewerRenderer.setSize(w, h);
    viewerCamera.aspect = w / h;
    viewerCamera.updateProjectionMatrix();
};

/**
 * Load a specific planet into the viewer.
 * Disposes the previous planet and creates a new one.
 * @param {string} planetNameEN — English name (e.g. "Mercury")
 */
export const showPlanetInViewer = (planetNameEN) => {
    if (!viewerScene) return;

    // Find planet data
    const pData = PLANETS_DATA.find(p => p.nameEN === planetNameEN);
    if (!pData) return;

    // Dispose previous planet
    disposePlanetMesh();

    // Create planet sphere
    const segments = 48;
    const geometry = new THREE.SphereGeometry(1, segments, segments);

    // Load texture
    const textureUrl = pData.texture;
    const tex = texLoader.load(textureUrl);
    tex.encoding = THREE.sRGBEncoding;

    let material;
    if (pData.isStar) {
        material = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0.98
        });
    } else {
        const matConfig = {
            map: tex,
            shininess: 20,
            specular: new THREE.Color(0x333333)
        };

        // Bump map
        if (pData.bumpMap) {
            matConfig.bumpMap = texLoader.load(pData.bumpMap);
            matConfig.bumpScale = 0.05;
        }

        material = new THREE.MeshPhongMaterial(matConfig);
    }

    viewerPlanet = new THREE.Mesh(geometry, material);

    // Apply tilt
    if (pData.tilt) viewerPlanet.rotation.z = pData.tilt;

    viewerScene.add(viewerPlanet);

    // Cloud layer
    if (pData.cloudTexture) {
        const cloudTex = texLoader.load(pData.cloudTexture);
        viewerClouds = new THREE.Mesh(
            new THREE.SphereGeometry(1.02, segments, segments),
            new THREE.MeshPhongMaterial({
                map: cloudTex,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        viewerPlanet.add(viewerClouds);
    }

    // Saturn ring
    if (pData.ringTexture) {
        const ringTex = texLoader.load(pData.ringTexture);
        const ringGeo = new THREE.RingGeometry(1.3, 2.3, 96);

        // UV remap for ring texture
        const pos = ringGeo.attributes.position;
        const uv = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
            const px = pos.getX(i);
            const py = pos.getY(i);
            const dist = Math.sqrt(px * px + py * py);
            const t = (dist - 1.3) / (2.3 - 1.3);
            uv.setXY(i, t, 0.5);
        }

        viewerRing = new THREE.Mesh(
            ringGeo,
            new THREE.MeshBasicMaterial({
                map: ringTex,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        viewerRing.rotation.x = Math.PI / 2.5;
        viewerPlanet.add(viewerRing);
    }

    // Sun: add emissive glow
    if (pData.isStar) {
        const glowGeo = new THREE.SphereGeometry(1.15, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        viewerPlanet.add(glow);
    }

    // Reset rotation
    targetRotY = 0;
    targetRotX = 0;

    // Adjust camera distance based on planet type
    const camDist = pData.hasRing ? 5.5 : (pData.isStar ? 4.5 : 3.8);
    viewerCamera.position.set(0, 0.3, camDist);
    viewerCamera.lookAt(0, 0, 0);
};

const disposePlanetMesh = () => {
    if (viewerPlanet) {
        // Dispose planet and all children recursively
        viewerPlanet.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (child.material.map) child.material.map.dispose();
                if (child.material.bumpMap) child.material.bumpMap.dispose();
                child.material.dispose();
            }
        });
        viewerScene.remove(viewerPlanet);
        viewerPlanet = null;
        viewerClouds = null;
        viewerRing = null;
    }
};

/**
 * Start the viewer animation loop.
 */
export const startViewerLoop = () => {
    if (viewerAnimId) return;

    const tick = () => {
        viewerAnimId = requestAnimationFrame(tick);
        if (!viewerPlanet) return;

        // Auto-rotate + user drag
        if (!isDragging) {
            targetRotY += autoRotateSpeed;
        }

        viewerPlanet.rotation.y += (targetRotY - viewerPlanet.rotation.y) * 0.08;
        // Only apply vertical rotation for non-tilted planets
        if (!viewerPlanet.rotation.z) {
            viewerPlanet.rotation.x += (targetRotX - viewerPlanet.rotation.x) * 0.08;
        }

        // Clouds counter-rotate
        if (viewerClouds) {
            viewerClouds.rotation.y += 0.001;
        }

        viewerRenderer.render(viewerScene, viewerCamera);
    };

    tick();
};

/**
 * Stop the viewer animation loop and free resources.
 */
export const stopViewerLoop = () => {
    if (viewerAnimId) {
        cancelAnimationFrame(viewerAnimId);
        viewerAnimId = null;
    }
};

/**
 * Fully destroy the viewer — dispose GL context and remove canvas.
 */
export const destroyPlanetViewer = () => {
    stopViewerLoop();
    disposePlanetMesh();

    if (viewerRenderer) {
        viewerRenderer.dispose();
        viewerRenderer.forceContextLoss();
        viewerRenderer = null;
    }

    if (viewerCanvas && viewerCanvas.parentNode) {
        viewerCanvas.parentNode.removeChild(viewerCanvas);
        viewerCanvas = null;
    }

    viewerScene = null;
    viewerCamera = null;
};
