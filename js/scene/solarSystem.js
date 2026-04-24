// ============================================
// T.A.R.D.I.S. — SOLAR SYSTEM BUILDER (Performance-Optimized)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { solarSystemGroup, sharedSphereGeo } from './setup.js';
import { PLANETS_DATA } from '../data/planetsData.js';
import { MAX_GLOW_LAYERS, ATMOSPHERE_ENABLED, IS_MOBILE } from '../config.js';
import { createPlanetMaterial, createCloudMesh, createRingMesh } from '../planets/textures.js';
import { createAllComets } from './comets.js';

export const planetMeshes = [];
export const orbitLines = [];

function createLabelSprite(text, scale = 0.15, color = '#00f2fe') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    ctx.font = 'bold 48px "Orbitron", "Segoe UI", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
    }));
    sprite.scale.set(scale * 4, scale, 1);
    return sprite;
}

export { createLabelSprite };

export function createSolarSystem() {
    const loadingStatus = document.getElementById('loading-status');
    if (loadingStatus) loadingStatus.textContent = 'CONSTRUINDO SISTEMA SOLAR...';

    // All glow layer configs — we'll use only MAX_GLOW_LAYERS of them on mobile
    const glowLayerConfigs = [
        { scale: 1.15, color: 0xffcc44, opacity: 0.12 },
        { scale: 1.35, color: 0xff8800, opacity: 0.06 },
        { scale: 1.6, color: 0xff4400, opacity: 0.03 }
    ];

    PLANETS_DATA.forEach((pData, index) => {
        const mesh = new THREE.Mesh(sharedSphereGeo.clone());
        mesh.scale.set(pData.radius, pData.radius, pData.radius);

        // Material from textures
        const material = createPlanetMaterial(pData);
        mesh.material = material;

        if (pData.isStar) {
            // Sun — multi-layer glow (reduced on mobile to cut overdraw)
            const glows = [];
            const layerCount = Math.min(MAX_GLOW_LAYERS, glowLayerConfigs.length);
            for (let i = 0; i < layerCount; i++) {
                const gl = glowLayerConfigs[i];
                const glowMesh = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 32, 32),
                    new THREE.MeshBasicMaterial({
                        color: gl.color,
                        transparent: true,
                        opacity: gl.opacity,
                        side: THREE.BackSide
                    })
                );
                glowMesh.scale.set(
                    pData.radius * gl.scale,
                    pData.radius * gl.scale,
                    pData.radius * gl.scale
                );
                solarSystemGroup.add(glowMesh);
                glows.push(glowMesh);
            }
            mesh.userData.glows = glows;
            mesh.userData.glow = glows[0];

        } else {
            // --- ATMOSPHERE GLOW (skipped on mobile to eliminate overdraw) ---
            if (pData.atmosphereColor && ATMOSPHERE_ENABLED) {
                const atmoScale = pData.atmosphereScale || 1.06;
                const atmoGeo = new THREE.SphereGeometry(1, 32, 32);
                const atmoMat = new THREE.MeshBasicMaterial({
                    color: pData.atmosphereColor,
                    transparent: true,
                    opacity: pData.atmosphereOpacity || 0.08,
                    side: THREE.BackSide
                });
                const atmosphere = new THREE.Mesh(atmoGeo, atmoMat);
                atmosphere.scale.set(
                    pData.radius * atmoScale,
                    pData.radius * atmoScale,
                    pData.radius * atmoScale
                );
                mesh.add(atmosphere);
                mesh.userData.atmosphere = atmosphere;
            }

            // --- CLOUDS (from textures) ---
            // On mobile: use NormalBlending to reduce overdraw cost
            const cloudMesh = createCloudMesh(pData, pData.radius, sharedSphereGeo);
            if (cloudMesh) {
                if (IS_MOBILE) {
                    cloudMesh.material.blending = THREE.NormalBlending;
                    cloudMesh.material.opacity = Math.min(cloudMesh.material.opacity, 0.3);
                }
                mesh.add(cloudMesh);
                mesh.userData.clouds = cloudMesh;
            }

            // --- SATURN RING ---
            if (pData.hasRing) {
                const ring = createRingMesh(pData, pData.radius);
                if (ring) {
                    mesh.add(ring);
                }
                // Ring shadow
                const shadowRingGeo = new THREE.RingGeometry(pData.radius * 1.3, pData.radius * 2.3, 64);
                const shadowRingMat = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.15,
                    side: THREE.DoubleSide
                });
                const shadowRing = new THREE.Mesh(shadowRingGeo, shadowRingMat);
                shadowRing.rotation.x = Math.PI / 2.5;
                shadowRing.position.y = -0.05;
                mesh.add(shadowRing);
            }

            // --- AXIAL TILT ---
            if (pData.tilt) {
                mesh.rotation.z = pData.tilt;
            }

            // Orbit line
            const orbitPoints = [];
            for (let a = 0; a <= Math.PI * 2; a += 0.02) {
                orbitPoints.push(new THREE.Vector3(
                    Math.cos(a) * pData.distance,
                    0,
                    Math.sin(a) * pData.distance
                ));
            }
            const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitLine = new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({
                color: 0x334466,
                transparent: true,
                opacity: 0.2
            }));
            solarSystemGroup.add(orbitLine);
            orbitLines.push(orbitLine);
        }

        // Label
        const label = createLabelSprite(pData.name, pData.radius * 0.3 + 0.15);
        label.position.y = pData.radius + 0.5;
        mesh.add(label);

        mesh.userData.planetData = pData;
        mesh.userData.planetIndex = index;
        solarSystemGroup.add(mesh);
        planetMeshes.push(mesh);
    });

    // Create comets
    createAllComets();
}
