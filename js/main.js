// ============================================
// T.A.R.D.I.S. — MAIN ENTRY POINT (Refactored)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { SceneState, IS_MOBILE, ATMOSPHERE_ENABLED } from './config.js';
import { PLANETS_DATA } from './data/planetsData.js';
import { scene, camera, renderer, solarSystemGroup, planetSurfaceGroup, handleResize } from './scene/setup.js';
import { createStarfield } from './scene/starfield.js';
import { createSolarSystem, planetMeshes } from './scene/solarSystem.js';
import { animateComets } from './scene/comets.js';
import { createPlanetSurface, deepDispose } from './planets/planetSurface.js';
import { countryLabelSprites, landmarkMeshes, findNearestLocation, findNearestLandmark, COUNTRY_DB } from './planets/earthFeatures.js';
import {
    navigateToPlanet, navigateNext, navigatePrev,
    zoomIn, zoomOut, rotateSolarCamera, updateSolarCamera,
    rotateSurfaceCamera, zoomSurfaceIn, zoomSurfaceOut,
    resetSurfaceCamera, updateSurfaceScale, resetSolarCamera,
    cameraTargetIndex, solarDistance, surfaceRotY, surfaceRotX, targetSurfaceScale
} from './camera/cameraController.js';
import { showPlanetInfo, hideInfoPanel, showLandmarkInfo } from './ui/infoPanel.js';
import { initPlanetDetailEvents } from './ui/planetDetail.js';
import { createPlanetSelector, highlightPlanetSelector, showPlanetSelector, hidePlanetSelector } from './ui/planetSelector.js';
import { initAPODWidget } from './ui/apodWidget.js';
import { fetchNASAImage } from './api/nasaApi.js';
import { initKeyboardControls, setKeyboardCallbacks } from './input/keyboard.js';
import { initMouseControls, setMouseCallbacks } from './input/mouseControls.js';
import { initTouchControls, setTouchCallbacks } from './input/touchControls.js';
import { initGuidedTour, isGuidedModeActive } from './ui/guidedTour.js';
import { initFPSMonitor, updateFPS } from './ui/fpsMonitor.js';
import { unloadSolarSystemDetails, reloadSolarSystemDetails } from './scene/renderOptimizer.js';

// --- CONSTANTS ---
const MOUSE_ZOOM_STEP = 2.0;

// --- APP STATE ---
let currentState = SceneState.SOLAR_SYSTEM;
let selectedPlanet = null;
let selectedPlanetIndex = -1;
let isTransitioning = false;

// --- DOM CACHE ---
const loadingScreen = document.getElementById('loading');
const loadingStatus = document.getElementById('loading-status');
const bcSolar = document.getElementById('bc-solar');
const bcPlanet = document.getElementById('bc-planet');
const transitionOverlay = document.getElementById('transition-overlay');
const modeLabel = document.getElementById('current-mode');
const modeDot = document.getElementById('mode-dot');

// --- PRE-ALLOCATED VECTORS (Zero GC in render loop) ---
const _tempVec = new THREE.Vector3();
const _frustum = new THREE.Frustum();
const _projScreenMatrix = new THREE.Matrix4();
const _boundingSphere = new THREE.Sphere();
const _raycaster = new THREE.Raycaster();

// --- STARFIELD ---
const starfield = createStarfield();

// --- HELPER: SET UI MODE ---
const setMode = (text, color) => {
    if (modeLabel) {
        modeLabel.innerText = text;
        modeLabel.style.color = color;
    }
    if (modeDot) modeDot.style.background = color;
};

// --- TRANSITIONS ---
const enterPlanet = (pData) => {
    if (isTransitioning) return;
    isTransitioning = true;
    selectedPlanet = pData;

    const enterPlanetIndex = PLANETS_DATA.findIndex(p => p.nameEN === pData.nameEN);

    transitionOverlay.classList.add('active');
    updateBreadcrumb('PLANET');
    hidePlanetSelector();
    setMode(pData.name?.toUpperCase() || 'PLANETA', '#22c55e');

    setTimeout(() => {
        currentState = SceneState.PLANET_SURFACE;
        solarSystemGroup.visible = false;
        planetSurfaceGroup.visible = true;

        unloadSolarSystemDetails(enterPlanetIndex);
        createPlanetSurface(pData);
        resetSurfaceCamera();

        camera.position.set(0, 0, 14);
        camera.lookAt(0, 0, 0);

        showPlanetInfo(pData);
        fetchNASAImage(pData.nameEN);

        setTimeout(() => {
            transitionOverlay.classList.remove('active');
            isTransitioning = false;
        }, 600);
    }, 800);
};

const exitPlanet = () => {
    if (isTransitioning) return;
    isTransitioning = true;

    transitionOverlay.classList.add('active');
    updateBreadcrumb('SOLAR');
    setMode('SISTEMA SOLAR', '#0095FF');

    setTimeout(() => {
        currentState = SceneState.SOLAR_SYSTEM;

        reloadSolarSystemDetails();

        solarSystemGroup.visible = true;
        planetSurfaceGroup.visible = false;

        // Dispose surface resources (prevents WebGL memory leak)
        while (planetSurfaceGroup.children.length > 0) {
            const child = planetSurfaceGroup.children[0];
            deepDispose(child);
            planetSurfaceGroup.remove(child);
        }
        COUNTRY_DB.length = 0;

        resetSolarCamera();
        hideInfoPanel();
        document.getElementById('landmark-info').style.display = 'none';

        selectedPlanetIndex = -1;
        selectedPlanet = null;
        highlightPlanetSelector(-1);

        if (!isGuidedModeActive()) {
            showPlanetSelector();
        }

        setTimeout(() => {
            transitionOverlay.classList.remove('active');
            isTransitioning = false;
        }, 600);
    }, 800);
};

const updateBreadcrumb = (state) => {
    bcSolar.classList.toggle('active', state === 'SOLAR');
    bcPlanet.classList.toggle('active', state === 'PLANET');
};

// --- PLANET DETECTION (replaces hand scanning) ---
const findNearestPlanetToCamera = () => {
    let closest = null;
    let minDist = Infinity;

    planetMeshes.forEach(mesh => {
        _tempVec.setFromMatrixPosition(mesh.matrixWorld);
        _tempVec.project(camera);
        if (_tempVec.z > 1) return;
        const dist = Math.sqrt(_tempVec.x * _tempVec.x + _tempVec.y * _tempVec.y);
        if (dist < minDist) {
            minDist = dist;
            closest = mesh;
        }
    });

    return minDist < 0.8 ? closest : null;
};

// --- RAYCAST CLICK DETECTION ---
const raycastPlanetAt = (screenX, screenY) => {
    const rect = renderer.domElement.getBoundingClientRect();
    _tempVec.set(
        ((screenX - rect.left) / rect.width) * 2 - 1,
        -((screenY - rect.top) / rect.height) * 2 + 1,
        0.5
    );
    _raycaster.setFromCamera(_tempVec, camera);
    const intersects = _raycaster.intersectObjects(planetMeshes, false);
    if (intersects.length > 0) {
        const { planetData, planetIndex } = intersects[0].object.userData;
        if (planetData) return { planetData, planetIndex };
    }
    return null;
};

const getCoordinatesFromRotation = (rY, rX) => {
    let lon = -((rY % (Math.PI * 2)) / Math.PI) * 180;
    lon = lon % 360;
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    lon -= 90;
    if (lon < -180) lon += 360;
    const lat = (rX / (Math.PI / 2)) * 90;
    return { lat, lon };
};

// --- WIRE UP KEYBOARD CALLBACKS ---
setKeyboardCallbacks({
    onNavigateNext: () => {
        if (isTransitioning || isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            const newIndex = navigateNext();
            selectedPlanetIndex = newIndex;
            selectedPlanet = PLANETS_DATA[newIndex];
            showPlanetInfo(selectedPlanet);
            highlightPlanetSelector(newIndex);
        }
    },
    onNavigatePrev: () => {
        if (isTransitioning || isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            const newIndex = navigatePrev();
            selectedPlanetIndex = newIndex;
            selectedPlanet = PLANETS_DATA[newIndex];
            showPlanetInfo(selectedPlanet);
            highlightPlanetSelector(newIndex);
        }
    },
    onEnterPlanet: () => {
        if (isTransitioning || isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM && selectedPlanet) {
            enterPlanet(selectedPlanet);
        }
    },
    onExitPlanet: () => {
        if (isTransitioning || isGuidedModeActive()) return;
        if (currentState === SceneState.PLANET_SURFACE) {
            exitPlanet();
        }
    }
});

// --- WIRE UP MOUSE CALLBACKS ---
setMouseCallbacks({
    onMove: (dx, dy) => {
        if (isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            rotateSolarCamera(dx, dy);
        } else {
            rotateSurfaceCamera(dx, dy);
        }
    },
    onZoomIn: () => {
        if (isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomIn(MOUSE_ZOOM_STEP);
        } else {
            zoomSurfaceIn(0.05);
        }
    },
    onZoomOut: () => {
        if (isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomOut(MOUSE_ZOOM_STEP);
        } else {
            zoomSurfaceOut(0.05);
            if (targetSurfaceScale <= 0.35) {
                exitPlanet();
            }
        }
    },
    onClick: (x, y) => {
        if (isTransitioning || isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            const hit = raycastPlanetAt(x, y);
            if (hit) {
                const { planetData, planetIndex } = hit;
                selectedPlanet = planetData;
                selectedPlanetIndex = planetIndex;
                navigateToPlanet(planetIndex);
                showPlanetInfo(planetData);
                highlightPlanetSelector(planetIndex);
                enterPlanet(planetData);
            }
        }
    }
});

// --- WIRE UP TOUCH CALLBACKS ---
setTouchCallbacks({
    onMove: (dx, dy) => {
        if (isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            rotateSolarCamera(dx, dy);
        } else {
            rotateSurfaceCamera(dx, dy);
        }
    },
    onZoomIn: () => {
        if (isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomIn(MOUSE_ZOOM_STEP);
        } else {
            zoomSurfaceIn(0.05);
        }
    },
    onZoomOut: () => {
        if (isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomOut(MOUSE_ZOOM_STEP);
        } else {
            zoomSurfaceOut(0.05);
            if (targetSurfaceScale <= 0.35) {
                exitPlanet();
            }
        }
    },
    onTap: (x, y) => {
        if (isTransitioning || isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            const hit = raycastPlanetAt(x, y);
            if (hit) {
                const { planetData, planetIndex } = hit;
                selectedPlanet = planetData;
                selectedPlanetIndex = planetIndex;
                navigateToPlanet(planetIndex);
                showPlanetInfo(planetData);
                highlightPlanetSelector(planetIndex);
                enterPlanet(planetData);
            }
        }
    }
});

// --- ANIMATION LOOP ---
let prevTime = performance.now();

const animate = () => {
    requestAnimationFrame(animate);
    const now = performance.now();
    const delta = (now - prevTime) / 1000;
    prevTime = now;

    updateFPS(delta);

    if (currentState === SceneState.SOLAR_SYSTEM) {
        animateSolarSystem(delta);
    } else if (currentState === SceneState.PLANET_SURFACE) {
        animatePlanetSurface(delta);
    }

    renderer.render(scene, camera);
};

const animateSolarSystem = (delta) => {
    const time = performance.now() * 0.001;

    // Frustum culling setup
    _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_projScreenMatrix);

    planetMeshes.forEach(mesh => {
        const { planetData: pData } = mesh.userData;

        if (pData.isStar) {
            mesh.rotation.y += 0.001;
            mesh.userData.glows?.forEach((glow, i) => {
                const layerSpeed = 1.5 + i * 0.7;
                const layerAmp = 0.04 + i * 0.02;
                const pulse = 1 + Math.sin(time * layerSpeed + i) * layerAmp;
                const baseScale = [1.15, 1.35, 1.6][i] || 1.2;
                const s = pData.radius * baseScale * pulse;
                glow.scale.set(s, s, s);
            });
        } else {
            // Orbital position (always update)
            const angle = time * pData.speed + (pData.orbitOffset || 0);
            mesh.position.x = Math.cos(angle) * pData.distance;
            mesh.position.z = Math.sin(angle) * pData.distance;

            // Frustum culling check
            _boundingSphere.center.copy(mesh.position);
            _boundingSphere.radius = pData.radius * 3;
            if (!_frustum.intersectsSphere(_boundingSphere)) {
                mesh.visible = false;
                return;
            }
            mesh.visible = true;

            // Visual updates (only for visible planets)
            if (pData.tilt) mesh.rotation.z = pData.tilt;
            mesh.rotation.y += 0.005;

            if (mesh.userData.clouds) mesh.userData.clouds.rotation.y += 0.002;

            if (mesh.userData.atmosphere && ATMOSPHERE_ENABLED) {
                const shimmer = 1 + Math.sin(time * 1.5 + pData.distance) * 0.015;
                const atmoScale = (pData.atmosphereScale || 1.06) * shimmer;
                const s = pData.radius * atmoScale;
                mesh.userData.atmosphere.scale.set(s, s, s);
            }
        }
    });

    animateComets(time);
    updateSolarCamera();

    // Auto-detect nearest planet to camera center (no scanning needed)
    if (!isTransitioning && selectedPlanetIndex !== -1) {
        // Keep showing info for selected planet
    } else if (!isTransitioning) {
        hideInfoPanel();
    }

    starfield.rotation.y += 0.00005;
};

const animatePlanetSurface = (delta) => {
    const sg = planetSurfaceGroup.children[0];
    if (!sg) return;

    // Smooth rotation
    sg.rotation.y += (surfaceRotY - sg.rotation.y) * 0.1;
    sg.rotation.x += (surfaceRotX - sg.rotation.x) * 0.1;
    sg.rotation.x = Math.max(-1.0, Math.min(1.0, sg.rotation.x));

    // Smooth scale
    const scale = updateSurfaceScale();
    sg.scale.set(scale, scale, scale);

    // Clouds rotation
    if (sg.userData.clouds) {
        sg.userData.clouds.rotation.y += 0.0003;
    }

    // Country labels
    if (selectedPlanet?.planetType === 'earth' && countryLabelSprites.length > 0) {
        const showLabels = scale >= 0.8;
        countryLabelSprites.forEach(label => { label.visible = showLabels; });
    }

    // Landmark pulsing
    const time = performance.now() * 0.001;
    landmarkMeshes.forEach(lm => {
        const pulse = 1 + Math.sin(time * 3) * 0.3;
        lm.ring.scale.set(pulse, pulse, pulse);
        lm.marker.scale.set(pulse * 0.8, pulse * 0.8, pulse * 0.8);
    });

    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);
};

// --- INIT ---
const init = async () => {
    loadingStatus.textContent = 'INICIALIZANDO...';

    createSolarSystem();

    // Planet selector with navigation callback
    createPlanetSelector((pData, index) => {
        if (isTransitioning || isGuidedModeActive()) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            selectedPlanetIndex = index;
            selectedPlanet = pData;
            navigateToPlanet(index);
            showPlanetInfo(pData);
            highlightPlanetSelector(index);
            enterPlanet(pData);
        }
    });

    // Init UI modules
    initPlanetDetailEvents();
    initAPODWidget();

    // Init Guided Tour (Doctor Who Mode)
    initGuidedTour({
        enterPlanet: (pData) => enterPlanet(pData),
        exitPlanet: () => {
            if (currentState === SceneState.PLANET_SURFACE) exitPlanet();
        }
    });

    // Init FPS Monitor
    initFPSMonitor();

    // Init input — mouse, keyboard, and touch coexist seamlessly
    initKeyboardControls();
    initMouseControls();
    initTouchControls();

    // Set initial breadcrumb and mode
    updateBreadcrumb('SOLAR');
    setMode('SISTEMA SOLAR', '#0095FF');

    // Hide loading screen
    loadingScreen.style.display = 'none';

    console.log(`[T.A.R.D.I.S.] Device: ${IS_MOBILE ? 'MOBILE' : 'DESKTOP'} | Input: MOUSE + KEYBOARD + TOUCH`);
};

// --- RESIZE ---
window.addEventListener('resize', handleResize);

// --- START ---
init();
animate();
