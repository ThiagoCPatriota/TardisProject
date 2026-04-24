// ============================================
// T.A.R.D.I.S. — CAMERA CONTROLLER (navegação livre)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { camera } from '../scene/setup.js';
import { planetMeshes } from '../scene/solarSystem.js';
import { PLANETS_DATA } from '../data/planetsData.js';

// --- Pre-allocated vectors (ZERO garbage collection in the render loop) ---
// These are reused every frame instead of creating new objects.
const _targetCamPos = new THREE.Vector3();
const _focusPos = new THREE.Vector3();

// --- Camera State ---
export let cameraTargetIndex = 0; // Index into PLANETS_DATA — the planet the camera focuses on
export let solarRotY = 0;
export let solarRotX = 0.4;
export let solarDistance = 80;

// The 3D position the camera orbits around (smoothed)
let cameraFocusTarget = new THREE.Vector3(0, 0, 0);
let cameraFocusActual = new THREE.Vector3(0, 0, 0);

/**
 * Gets the current world position of the focused planet.
 * OPTIMIZED: Reuses _focusPos instead of allocating new Vector3 each frame.
 */
export function getFocusedPlanetPosition() {
    if (cameraTargetIndex < 0 || cameraTargetIndex >= planetMeshes.length) {
        _focusPos.set(0, 0, 0);
        return _focusPos;
    }
    const mesh = planetMeshes[cameraTargetIndex];
    if (!mesh) {
        _focusPos.set(0, 0, 0);
        return _focusPos;
    }
    _focusPos.setFromMatrixPosition(mesh.matrixWorld);
    return _focusPos;
}

/**
 * Navigate camera to focus on a specific planet by index.
 */
export function navigateToPlanet(index) {
    if (index < 0) index = 0;
    if (index >= PLANETS_DATA.length) index = PLANETS_DATA.length - 1;
    cameraTargetIndex = index;

    // Adjust zoom to a comfortable distance based on planet radius
    const pData = PLANETS_DATA[index];
    const baseDistance = pData.isStar ? 25 : (pData.radius * 15 + 10);
    solarDistance = Math.max(baseDistance, Math.min(120, baseDistance));
}

/**
 * Get the current focused planet data.
 */
export function getFocusedPlanetData() {
    return PLANETS_DATA[cameraTargetIndex] || PLANETS_DATA[0];
}

/**
 * Updates camera position based on orbital parameters.
 * Called every frame from animate loop.
 * OPTIMIZED: Uses pre-allocated _targetCamPos instead of new THREE.Vector3().
 */
export function updateSolarCamera() {
    // Smoothly move focus target to selected planet position
    cameraFocusTarget.copy(getFocusedPlanetPosition());
    cameraFocusActual.lerp(cameraFocusTarget, 0.04);

    // Calculate orbital camera position around focus point
    const camX = cameraFocusActual.x + Math.sin(solarRotY) * solarDistance * Math.cos(solarRotX);
    const camY = cameraFocusActual.y + Math.sin(solarRotX) * solarDistance * 0.5;
    const camZ = cameraFocusActual.z + Math.cos(solarRotY) * solarDistance * Math.cos(solarRotX);

    // Reuse pre-allocated vector instead of new THREE.Vector3(camX, camY, camZ)
    _targetCamPos.set(camX, camY, camZ);
    camera.position.lerp(_targetCamPos, 0.06);
    camera.lookAt(cameraFocusActual);
}

/**
 * Navigate to next planet.
 */
export function navigateNext() {
    navigateToPlanet(Math.min(PLANETS_DATA.length - 1, cameraTargetIndex + 1));
    return cameraTargetIndex;
}

/**
 * Navigate to previous planet.
 */
export function navigatePrev() {
    navigateToPlanet(Math.max(0, cameraTargetIndex - 1));
    return cameraTargetIndex;
}

/**
 * Zoom in.
 */
export function zoomIn(amount = 0.6) {
    solarDistance = Math.max(5, solarDistance - amount);
}

/**
 * Zoom out.
 */
export function zoomOut(amount = 0.6) {
    solarDistance = Math.min(200, solarDistance + amount);
}

/**
 * Rotate camera orbit.
 */
export function rotateSolarCamera(dx, dy) {
    solarRotY += dx;
    solarRotX += dy;
    solarRotX = Math.max(-0.8, Math.min(1.2, solarRotX));
}

// Surface camera state
export let surfaceRotY = 4.7;
export let surfaceRotX = 0.2;
export let surfaceScale = 1;
export let targetSurfaceScale = 1;

export function rotateSurfaceCamera(dx, dy) {
    surfaceRotY += dx;
    surfaceRotX += dy;
    surfaceRotX = Math.max(-1.0, Math.min(1.0, surfaceRotX));
}

export function zoomSurfaceIn(amount = 0.03) {
    targetSurfaceScale = Math.min(3.5, targetSurfaceScale + amount);
}

export function zoomSurfaceOut(amount = 0.03) {
    targetSurfaceScale = Math.max(0.3, targetSurfaceScale - amount);
}

export function resetSurfaceCamera() {
    surfaceRotY = 4.7;
    surfaceRotX = 0.2;
    targetSurfaceScale = 1;
    surfaceScale = 0.3;
}

export function updateSurfaceScale() {
    surfaceScale += (targetSurfaceScale - surfaceScale) * 0.08;
    return surfaceScale;
}

export function resetSolarCamera() {
    solarDistance = 80;
    camera.position.set(0, 30, 80);
}
