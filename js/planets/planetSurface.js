// ============================================
// T.A.R.D.I.S. — PLANET SURFACE VIEW (Performance-Optimized)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLOBE_RADIUS, EFFECTIVE_SEGMENTS, USE_HQ_TEXTURES, IS_MOBILE, ATMOSPHERE_ENABLED } from '../config.js';
import { planetSurfaceGroup } from '../scene/setup.js';
import { createPlanetMaterial, createRingMesh, loadTexture } from './textures.js';
import { loadEarthBorders, createLandmarks } from './earthFeatures.js';

export let surfaceEarth = null;
export let surfaceGroup = null;

/**
 * Deep-dispose a Three.js object and all children.
 * Frees GPU memory for textures, geometries, and materials.
 */
function deepDispose(obj) {
    if (!obj) return;

    // Recurse children
    while (obj.children && obj.children.length > 0) {
        deepDispose(obj.children[0]);
        obj.remove(obj.children[0]);
    }

    // Dispose geometry
    if (obj.geometry) {
        obj.geometry.dispose();
    }

    // Dispose material(s)
    if (obj.material) {
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach(mat => {
            // Dispose all texture maps
            const texProps = ['map', 'bumpMap', 'normalMap', 'specularMap', 'emissiveMap', 'envMap', 'alphaMap', 'aoMap', 'lightMap'];
            texProps.forEach(prop => {
                if (mat[prop]) {
                    mat[prop].dispose();
                    mat[prop] = null;
                }
            });
            mat.dispose();
        });
    }

    // Dispose sprite textures
    if (obj.isSprite && obj.material?.map) {
        obj.material.map.dispose();
        obj.material.dispose();
    }
}

export function createPlanetSurface(pData) {
    // Deep-dispose previous surface to free GPU memory
    if (planetSurfaceGroup.children.length > 0) {
        while (planetSurfaceGroup.children.length > 0) {
            deepDispose(planetSurfaceGroup.children[0]);
            planetSurfaceGroup.remove(planetSurfaceGroup.children[0]);
        }
    }

    surfaceGroup = new THREE.Group();

    // === USE HQ TEXTURES ONLY ON CAPABLE DEVICES ===
    const useHQ = USE_HQ_TEXTURES;
    const segments = EFFECTIVE_SEGMENTS;

    console.log(`[T.A.R.D.I.S.] Surface: ${pData.nameEN} | HQ: ${useHQ} | Segments: ${segments} | Mobile: ${IS_MOBILE}`);

    const material = createPlanetMaterial(pData, useHQ);

    surfaceEarth = new THREE.Mesh(
        new THREE.SphereGeometry(GLOBE_RADIUS, segments, segments),
        material
    );
    surfaceGroup.add(surfaceEarth);

    // Cloud layer
    const cloudUrl = useHQ
        ? (pData.cloudTextureHQ || pData.cloudTexture)
        : pData.cloudTexture;
    if (cloudUrl) {
        const cloudTex = loadTexture(cloudUrl);
        const clouds = new THREE.Mesh(
            new THREE.SphereGeometry(GLOBE_RADIUS + 0.04, segments, segments),
            new THREE.MeshPhongMaterial({
                map: cloudTex,
                transparent: true,
                opacity: pData.planetType === 'venus' ? 0.7 : 0.5,
                // MOBILE: NormalBlending (cheaper) instead of AdditiveBlending (overdraw killer)
                blending: IS_MOBILE ? THREE.NormalBlending : THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );

        // On mobile, reduce cloud opacity to compensate for NormalBlending look
        if (IS_MOBILE) {
            clouds.material.opacity = Math.min(clouds.material.opacity, 0.35);
        }

        surfaceGroup.add(clouds);
        surfaceGroup.userData.clouds = clouds;
    }

    // Atmosphere glow — SKIPPED on mobile to reduce overdraw
    if (pData.atmosphereColor && !pData.isStar && ATMOSPHERE_ENABLED) {
        // Reduced segments on atmosphere sphere (24 vs 48 — invisible difference)
        const atmoSegments = IS_MOBILE ? 24 : 48;
        const atmoScale = pData.atmosphereScale || 1.06;
        const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * atmoScale, atmoSegments, atmoSegments);
        const atmoMat = new THREE.MeshBasicMaterial({
            color: pData.atmosphereColor,
            transparent: true,
            opacity: (pData.atmosphereOpacity || 0.08) * 1.5,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
        surfaceGroup.add(atmosphere);
    }

    // Earth-specific features
    if (pData.planetType === 'earth') {
        loadEarthBorders(surfaceGroup);
    }
    if (pData.hasLandmarks) {
        createLandmarks(surfaceGroup);
    }

    // Saturn ring
    if (pData.hasRing) {
        const ring = createRingMesh(pData, GLOBE_RADIUS, useHQ);
        if (ring) surfaceGroup.add(ring);
    }

    // Axial tilt
    if (pData.tilt) {
        surfaceGroup.rotation.z = pData.tilt;
    }

    // Surface lighting
    const surfaceLight = new THREE.DirectionalLight(0xffffff, 1.5);
    surfaceLight.position.set(5, 3, 8);
    surfaceGroup.add(surfaceLight);
    surfaceGroup.add(new THREE.AmbientLight(0x222233, 0.5));

    planetSurfaceGroup.add(surfaceGroup);
}

/**
 * Exported deep dispose for use by main.js during planet transitions.
 */
export { deepDispose };
