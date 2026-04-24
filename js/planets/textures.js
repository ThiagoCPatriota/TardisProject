// ============================================
// T.A.R.D.I.S. â€” TEXTURE LOADING (Solar System Scope)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { texLoader } from '../scene/setup.js';

/**
 * Loads a texture from URL with fallback to a solid color.
 * @param {string} url - Texture URL
 * @param {number} fallbackColor - Hex color for fallback
 * @returns {THREE.Texture}
 */
export function loadTexture(url, fallbackColor = 0x888888) {
    const tex = texLoader.load(
        url,
        (loaded) => {
            console.log(`âœ“ Texture loaded: ${url.split('/').pop()}`);
        },
        undefined,
        (err) => {
            console.warn(`âœ— Texture failed: ${url.split('/').pop()}`);
        }
    );
    tex.encoding = THREE.sRGBEncoding;
    return tex;
}

/**
 * Creates material for a planet using textures.
 * @param {Object} pData - Planet data from PLANETS_DATA
 * @param {boolean} useHQ - If true, use HQ (8K) textures for surface view
 * @returns {THREE.Material}
 */
export function createPlanetMaterial(pData, useHQ = false) {
    const textureUrl = (useHQ && pData.textureHQ) ? pData.textureHQ : pData.texture;

    if (pData.isStar) {
        // Sun â€” emissive material with texture
        const sunTex = loadTexture(textureUrl);
        return new THREE.MeshBasicMaterial({
            map: sunTex,
            transparent: true,
            opacity: 0.98
        });
    }

    // Regular planet with texture
    const tex = loadTexture(textureUrl, pData.color);
    const materialConfig = {
        map: tex,
        shininess: 15,
        specular: new THREE.Color(0x222222)
    };

    // Bump/Normal map
    const bumpUrl = (useHQ && pData.bumpMapHQ) ? pData.bumpMapHQ : pData.bumpMap;
    if (bumpUrl) {
        materialConfig.bumpMap = loadTexture(bumpUrl);
        materialConfig.bumpScale = 0.04;
    }

    // Specular map (Earth)
    const specUrl = (useHQ && pData.specularMapHQ) ? pData.specularMapHQ : pData.specularMap;
    if (specUrl) {
        materialConfig.specularMap = loadTexture(specUrl);
        materialConfig.specular = new THREE.Color(0x333333);
        materialConfig.shininess = 25;
    }

    return new THREE.MeshPhongMaterial(materialConfig);
}

/**
 * Creates a cloud layer mesh for a planet.
 * @param {Object} pData - Planet data
 * @param {number} radius - Radius of the cloud sphere
 * @param {THREE.BufferGeometry} sphereGeo - Shared sphere geometry
 * @param {boolean} useHQ - If true, use HQ (8K) texture
 * @returns {THREE.Mesh|null}
 */
export function createCloudMesh(pData, radius, sphereGeo, useHQ = false) {
    const cloudUrl = (useHQ && pData.cloudTextureHQ) ? pData.cloudTextureHQ : pData.cloudTexture;
    if (!cloudUrl) return null;

    const cloudTex = loadTexture(cloudUrl);
    const cloudMesh = new THREE.Mesh(
        sphereGeo.clone(),
        new THREE.MeshPhongMaterial({
            map: cloudTex,
            transparent: true,
            opacity: pData.planetType === 'venus' ? 0.7 : 0.4,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );
    const cloudScale = radius * (pData.planetType === 'venus' ? 1.04 : 1.02);
    cloudMesh.scale.set(cloudScale, cloudScale, cloudScale);
    return cloudMesh;
}

/**
 * Creates Saturn's ring from texture.
 * @param {Object} pData - Planet data with ringTexture
 * @param {number} radius - Planet radius
 * @param {boolean} useHQ - If true, use HQ (8K) texture
 * @returns {THREE.Mesh|null}
 */
export function createRingMesh(pData, radius, useHQ = false) {
    const ringUrl = (useHQ && pData.ringTextureHQ) ? pData.ringTextureHQ : pData.ringTexture;
    if (!ringUrl) return null;

    const ringTex = loadTexture(ringUrl);
    const ringGeo = new THREE.RingGeometry(radius * 1.3, radius * 2.3, 128);

    // UV mapping for ring texture
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        const dist = Math.sqrt(px * px + py * py);
        const t = (dist - radius * 1.3) / (radius * 2.3 - radius * 1.3);
        uv.setXY(i, t, 0.5);
    }

    const ringMat = new THREE.MeshBasicMaterial({
        map: ringTex,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    return ring;
}

