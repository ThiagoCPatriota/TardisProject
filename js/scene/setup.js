// ============================================
// T.A.R.D.I.S. — THREE.JS SCENE SETUP
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLOBE_SEGMENTS, IS_MOBILE } from '../config.js';

// --- SCENE ---
export const scene = new THREE.Scene();

// --- CAMERA ---
export const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);
camera.position.set(0, 30, 80);
camera.lookAt(0, 0, 0);

// --- RENDERER ---
// Mobile: disable antialias (huge perf gain on Adreno/Mali GPUs)
// Mobile: pixelRatio 1 to avoid rendering 4-9x more pixels than needed
export const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('output_canvas'),
    alpha: true,
    antialias: !IS_MOBILE,
    powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(IS_MOBILE ? 1 : Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// --- GROUPS ---
export const solarSystemGroup = new THREE.Group();
scene.add(solarSystemGroup);

export const planetSurfaceGroup = new THREE.Group();
planetSurfaceGroup.visible = false;
scene.add(planetSurfaceGroup);

// --- SHARED GEOMETRY ---
export const sharedSphereGeo = new THREE.SphereGeometry(1, GLOBE_SEGMENTS, GLOBE_SEGMENTS);

// --- TEXTURE LOADER ---
export const texLoader = new THREE.TextureLoader();
texLoader.setCrossOrigin('anonymous');

// --- LIGHTING ---
const sunLight = new THREE.PointLight(0xffffff, 2, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x111122, 0.3);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0x334466, 0x060612, 0.2);
scene.add(hemisphereLight);

// --- RESIZE HANDLER ---
export function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Keep pixel ratio consistent after resize
    renderer.setPixelRatio(IS_MOBILE ? 1 : Math.min(window.devicePixelRatio, 2));
}
