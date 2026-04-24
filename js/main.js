// ============================================
// T.A.R.D.I.S. — MAIN ENTRY POINT (Performance-Optimized)
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
import { initHandTracking, setHandCallbacks, isScanning } from './input/handTracking.js';
import { initKeyboardControls, setKeyboardCallbacks } from './input/keyboard.js';
import { initMouseControls, setMouseCallbacks } from './input/mouseControls.js';
import { initTouchControls, setTouchCallbacks } from './input/touchControls.js';

// --- MOUSE ZOOM ---
const MOUSE_ZOOM_STEP = 2.0;

// --- APP STATE ---
let currentState = SceneState.SOLAR_SYSTEM;
let selectedPlanet = null;
let selectedPlanetIndex = -1;
let isTransitioning = false;

// --- DOM ---
const loadingScreen = document.getElementById('loading');
const loadingStatus = document.getElementById('loading-status');
const gpsData = document.getElementById('gps-data');
const bcSolar = document.getElementById('bc-solar');
const bcPlanet = document.getElementById('bc-planet');
const bcSurface = document.getElementById('bc-surface');
const transitionOverlay = document.getElementById('transition-overlay');

// --- PRE-ALLOCATED VECTORS (Zero GC in render loop) ---
// These are reused every frame instead of creating new objects.
const _tempVec = new THREE.Vector3();
const _frustum = new THREE.Frustum();
const _projScreenMatrix = new THREE.Matrix4();
const _boundingSphere = new THREE.Sphere();

// --- STARFIELD ---
const starfield = createStarfield();

// --- TRANSITIONS ---
function enterPlanet(pData) {
    if (isTransitioning) return;
    isTransitioning = true;
    selectedPlanet = pData;

    transitionOverlay.classList.add('active');
    updateBreadcrumb(SceneState.PLANET_SURFACE);
    hidePlanetSelector();

    setTimeout(() => {
        currentState = SceneState.PLANET_SURFACE;
        solarSystemGroup.visible = false;
        planetSurfaceGroup.visible = true;

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
}

function exitPlanet() {
    if (isTransitioning) return;
    isTransitioning = true;

    transitionOverlay.classList.add('active');
    updateBreadcrumb(SceneState.SOLAR_SYSTEM);

    setTimeout(() => {
        currentState = SceneState.SOLAR_SYSTEM;
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
        showPlanetSelector();

        setTimeout(() => {
            transitionOverlay.classList.remove('active');
            isTransitioning = false;
        }, 600);
    }, 800);
}

function updateBreadcrumb(state) {
    bcSolar.classList.toggle('active', state === SceneState.SOLAR_SYSTEM);
    bcPlanet.classList.toggle('active', false);
    bcSurface.classList.toggle('active', state === SceneState.PLANET_SURFACE);
}

// --- SCANNING ---
// OPTIMIZED: Reuses _tempVec instead of creating new THREE.Vector3() each frame
function findNearestPlanetToCamera() {
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
}

function getCoordinatesFromRotation(rY, rX) {
    let lon = -((rY % (Math.PI * 2)) / Math.PI) * 180;
    lon = (lon % 360);
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    lon -= 90;
    if (lon < -180) lon += 360;
    let lat = (rX / (Math.PI / 2)) * 90;
    return { lat, lon };
}

// --- WIRE UP HAND CALLBACKS ---
setHandCallbacks({
    onMove: (dx, dy) => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            rotateSolarCamera(dx, dy);
        } else {
            rotateSurfaceCamera(dx, dy);
        }
    },
    onZoomIn: () => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomIn();
        } else {
            zoomSurfaceIn();
        }
    },
    onZoomOut: () => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomOut();
        } else {
            zoomSurfaceOut();
            if (targetSurfaceScale <= 0.35) {
                exitPlanet();
            }
        }
    }
});

// --- WIRE UP KEYBOARD CALLBACKS ---
setKeyboardCallbacks({
    onNavigateNext: () => {
        if (isTransitioning) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            const newIndex = navigateNext();
            selectedPlanetIndex = newIndex;
            selectedPlanet = PLANETS_DATA[newIndex];
            showPlanetInfo(selectedPlanet);
            highlightPlanetSelector(newIndex);
        }
    },
    onNavigatePrev: () => {
        if (isTransitioning) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            const newIndex = navigatePrev();
            selectedPlanetIndex = newIndex;
            selectedPlanet = PLANETS_DATA[newIndex];
            showPlanetInfo(selectedPlanet);
            highlightPlanetSelector(newIndex);
        }
    },
    onEnterPlanet: () => {
        if (isTransitioning) return;
        if (currentState === SceneState.SOLAR_SYSTEM && selectedPlanet) {
            enterPlanet(selectedPlanet);
        }
    },
    onExitPlanet: () => {
        if (isTransitioning) return;
        if (currentState === SceneState.PLANET_SURFACE) {
            exitPlanet();
        }
    }
});

// --- WIRE UP MOUSE CALLBACKS ---
setMouseCallbacks({
    onMove: (dx, dy) => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            rotateSolarCamera(dx, dy);
        } else {
            rotateSurfaceCamera(dx, dy);
        }
    },
    onZoomIn: () => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomIn(MOUSE_ZOOM_STEP);
        } else {
            zoomSurfaceIn(0.05);
        }
    },
    onZoomOut: () => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomOut(MOUSE_ZOOM_STEP);
        } else {
            zoomSurfaceOut(0.05);
            if (targetSurfaceScale <= 0.35) {
                exitPlanet();
            }
        }
    }
});

// --- WIRE UP TOUCH CALLBACKS ---
setTouchCallbacks({
    onMove: (dx, dy) => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            rotateSolarCamera(dx, dy);
        } else {
            rotateSurfaceCamera(dx, dy);
        }
    },
    onZoomIn: () => {
        if (currentState === SceneState.SOLAR_SYSTEM) {
            zoomIn(MOUSE_ZOOM_STEP);
        } else {
            zoomSurfaceIn(0.05);
        }
    },
    onZoomOut: () => {
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
        // Tap on mobile = try to select a planet or enter it
        if (isTransitioning) return;
        if (currentState === SceneState.SOLAR_SYSTEM) {
            // Raycast to find tapped planet
            const rect = renderer.domElement.getBoundingClientRect();
            _tempVec.set(
                ((x - rect.left) / rect.width) * 2 - 1,
                -((y - rect.top) / rect.height) * 2 + 1,
                0.5
            );
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(_tempVec, camera);
            const intersects = raycaster.intersectObjects(planetMeshes, false);
            if (intersects.length > 0) {
                const hit = intersects[0].object;
                const pData = hit.userData.planetData;
                const pIndex = hit.userData.planetIndex;
                if (pData) {
                    selectedPlanet = pData;
                    selectedPlanetIndex = pIndex;
                    navigateToPlanet(pIndex);
                    showPlanetInfo(pData);
                    highlightPlanetSelector(pIndex);
                    // Enter planet on tap
                    enterPlanet(pData);
                }
            }
        }
    }
});

// --- ANIMATION LOOP ---
let prevTime = performance.now();

function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const delta = (now - prevTime) / 1000;
    prevTime = now;

    if (currentState === SceneState.SOLAR_SYSTEM) {
        animateSolarSystem(delta);
    } else if (currentState === SceneState.PLANET_SURFACE) {
        animatePlanetSurface(delta);
    }

    renderer.render(scene, camera);
}

function animateSolarSystem(delta) {
    const time = performance.now() * 0.001;

    // --- FRUSTUM CULLING SETUP ---
    // Build the view frustum from the camera's projection + world matrices.
    // Objects outside this frustum are invisible — skip their visual updates.
    _projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_projScreenMatrix);

    planetMeshes.forEach(mesh => {
        const pData = mesh.userData.planetData;

        if (pData.isStar) {
            // Sun is always at origin and always visible
            mesh.rotation.y += 0.001;
            if (mesh.userData.glows) {
                mesh.userData.glows.forEach((glow, i) => {
                    const layerSpeed = 1.5 + i * 0.7;
                    const layerAmp = 0.04 + i * 0.02;
                    const pulse = 1 + Math.sin(time * layerSpeed + i) * layerAmp;
                    const baseScale = [1.15, 1.35, 1.6][i] || 1.2;
                    glow.scale.set(
                        pData.radius * baseScale * pulse,
                        pData.radius * baseScale * pulse,
                        pData.radius * baseScale * pulse
                    );
                });
            }
        } else {
            // --- ORBITAL POSITION (always update, needed for navigation) ---
            const angle = time * pData.speed + (pData.orbitOffset || 0);
            mesh.position.x = Math.cos(angle) * pData.distance;
            mesh.position.z = Math.sin(angle) * pData.distance;

            // --- FRUSTUM CULLING CHECK ---
            // Build a bounding sphere for this planet and test against the frustum.
            // If the planet is outside the view, skip all visual updates (rotation,
            // clouds, atmosphere shimmer). The position update above is still needed
            // so the orbit is correct when the planet scrolls back into view.
            _boundingSphere.center.copy(mesh.position);
            _boundingSphere.radius = pData.radius * 3; // generous margin
            if (!_frustum.intersectsSphere(_boundingSphere)) {
                mesh.visible = false;
                return; // Skip all visual work for this planet
            }
            mesh.visible = true;

            // --- VISUAL UPDATES (only for visible planets) ---
            if (pData.tilt) mesh.rotation.z = pData.tilt;
            mesh.rotation.y += 0.005;

            if (mesh.userData.clouds) mesh.userData.clouds.rotation.y += 0.002;

            // Atmosphere shimmer — only on desktop (ATMOSPHERE_ENABLED)
            if (mesh.userData.atmosphere && ATMOSPHERE_ENABLED) {
                const shimmer = 1 + Math.sin(time * 1.5 + pData.distance) * 0.015;
                const atmoScale = (pData.atmosphereScale || 1.06) * shimmer;
                mesh.userData.atmosphere.scale.set(
                    pData.radius * atmoScale,
                    pData.radius * atmoScale,
                    pData.radius * atmoScale
                );
            }
        }
    });

    animateComets(time);
    updateSolarCamera();

    // Scanning
    if (isScanning) {
        const nearest = findNearestPlanetToCamera();
        if (nearest) {
            selectedPlanet = nearest.userData.planetData;
            selectedPlanetIndex = nearest.userData.planetIndex;
            showPlanetInfo(selectedPlanet);
            highlightPlanetSelector(selectedPlanetIndex);
        } else {
            hideInfoPanel();
            selectedPlanet = null;
            selectedPlanetIndex = -1;
            highlightPlanetSelector(-1);
        }
    } else {
        if (!isTransitioning && selectedPlanetIndex === -1) {
            hideInfoPanel();
        }
    }

    starfield.rotation.y += 0.00005;
}

function animatePlanetSurface(delta) {
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

    // GPS
    const coords = getCoordinatesFromRotation(sg.rotation.y, sg.rotation.x);
    gpsData.innerText = `LAT: ${coords.lat.toFixed(1)} | LON: ${coords.lon.toFixed(1)}`;

    if (isScanning && selectedPlanet?.planetType === 'earth') {
        const landmark = findNearestLandmark(coords.lat, coords.lon);
        if (landmark) {
            showLandmarkInfo(landmark, selectedPlanet);
        } else {
            document.getElementById('landmark-info').style.display = 'none';
            const loc = findNearestLocation(coords.lat, coords.lon);
            if (loc) {
                document.getElementById('info-badge').textContent = 'PAÍS';
                document.getElementById('geo-name').textContent = loc.name;
                document.getElementById('geo-coord').textContent = `${coords.lat.toFixed(1)}°, ${coords.lon.toFixed(1)}°`;
                document.getElementById('info-panel').classList.add('active');
            }
        }
    } else if (isScanning && selectedPlanet) {
        showPlanetInfo(selectedPlanet);
    }

    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);
}

// --- INIT ---
async function init() {
    loadingStatus.textContent = 'INICIALIZANDO CÂMERA...';

    createSolarSystem();

    // Planet selector with navigation callback
    createPlanetSelector((pData, index) => {
        if (isTransitioning) return;
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

    // Init input — all three input methods coexist seamlessly
    initHandTracking();     // Disabled on mobile via MEDIAPIPE_ENABLED flag
    initKeyboardControls(); // Always active (external keyboards on tablets)
    initMouseControls();    // Active on desktop
    initTouchControls();    // Active on touch devices

    // Set initial breadcrumb
    updateBreadcrumb(SceneState.SOLAR_SYSTEM);

    // Log device info
    console.log(`[T.A.R.D.I.S.] Device: ${IS_MOBILE ? 'MOBILE' : 'DESKTOP'} | Touch: ${initTouchControls ? 'ENABLED' : 'DISABLED'}`);

    // Loading timeout
    setTimeout(() => {
        if (loadingScreen.style.display !== 'none') {
            loadingStatus.textContent = 'AGUARDANDO CÂMERA...';
        }
    }, 5000);
}

// --- RESIZE ---
window.addEventListener('resize', handleResize);

// --- START ---
init();
animate();
