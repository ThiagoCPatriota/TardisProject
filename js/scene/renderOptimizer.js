// ============================================
// T.A.R.D.I.S. — RENDER OPTIMIZER
// Culling + Descarregamento de Recursos GPU
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { solarSystemGroup, renderer } from './setup.js';
import { planetMeshes, orbitLines } from './solarSystem.js';
import { createPlanetMaterial, createCloudMesh } from '../planets/textures.js';
import { MAX_GLOW_LAYERS, ATMOSPHERE_ENABLED, IS_MOBILE } from '../config.js';

// Track stored materials for restoration
var storedMaterials = [];
var isUnloaded = false;

/**
 * Dispose a single material and all its texture maps.
 */
function disposeMaterial(material) {
    if (!material) return;
    var texProps = ['map', 'bumpMap', 'normalMap', 'specularMap', 'emissiveMap', 'envMap', 'alphaMap', 'aoMap', 'lightMap'];
    for (var i = 0; i < texProps.length; i++) {
        var prop = texProps[i];
        if (material[prop]) {
            material[prop].dispose();
            material[prop] = null;
        }
    }
    material.dispose();
}

/**
 * Dispose a mesh's material, geometry data, and children's visual resources.
 * Does NOT remove the mesh from the scene — just frees GPU memory.
 */
function disposeVisualResources(mesh) {
    if (!mesh) return;

    // Dispose material
    if (mesh.material) {
        disposeMaterial(mesh.material);
    }

    // Dispose children's materials (atmosphere, clouds, rings, labels)
    for (var i = 0; i < mesh.children.length; i++) {
        var child = mesh.children[i];
        if (child.material) {
            disposeMaterial(child.material);
        }
        if (child.geometry) {
            child.geometry.dispose();
        }
        // Sprites (labels)
        if (child.isSprite && child.material && child.material.map) {
            child.material.map.dispose();
            child.material.dispose();
        }
    }
}

/**
 * Unload solar system visual details when entering planet surface.
 * This frees significant VRAM by disposing textures and materials
 * of all planets that are not currently being viewed.
 *
 * @param {number} activePlanetIndex - The index of the planet being viewed (skip disposal for this one)
 */
export function unloadSolarSystemDetails(activePlanetIndex) {
    if (isUnloaded) return;

    console.log('[T.A.R.D.I.S. Optimizer] Descarregando recursos do Sistema Solar...');

    var beforeGeometries = renderer.info.memory.geometries;
    var beforeTextures = renderer.info.memory.textures;

    storedMaterials = [];

    // 1. Hide and dispose non-active planet meshes
    for (var i = 0; i < planetMeshes.length; i++) {
        var mesh = planetMeshes[i];

        // Store reference info for rebuilding
        storedMaterials.push({
            index: i,
            wasVisible: mesh.visible
        });

        // Hide all planets (the surface group handles rendering)
        mesh.visible = false;

        // Dispose visual resources of non-active planets to free VRAM
        if (i !== activePlanetIndex) {
            disposeVisualResources(mesh);
        }

        // Hide glow layers
        if (mesh.userData.glows) {
            for (var g = 0; g < mesh.userData.glows.length; g++) {
                mesh.userData.glows[g].visible = false;
            }
        }
    }

    // 2. Hide orbit lines
    for (var j = 0; j < orbitLines.length; j++) {
        orbitLines[j].visible = false;
    }

    // 3. Hide comets and other solar system children
    for (var k = 0; k < solarSystemGroup.children.length; k++) {
        var child = solarSystemGroup.children[k];
        child.visible = false;
    }

    isUnloaded = true;

    var afterGeometries = renderer.info.memory.geometries;
    var afterTextures = renderer.info.memory.textures;

    console.log(
        '[T.A.R.D.I.S. Optimizer] Recursos liberados! ' +
        'Geometrias: ' + beforeGeometries + ' → ' + afterGeometries + ' | ' +
        'Texturas: ' + beforeTextures + ' → ' + afterTextures
    );
}

/**
 * Reload solar system visual details when exiting planet surface.
 * Rebuilds materials with 2K textures for the overview.
 */
export function reloadSolarSystemDetails() {
    if (!isUnloaded) return;

    console.log('[T.A.R.D.I.S. Optimizer] Reconstruindo Sistema Solar...');

    // 1. Rebuild planet materials and restore visibility
    for (var i = 0; i < planetMeshes.length; i++) {
        var mesh = planetMeshes[i];
        var pData = mesh.userData.planetData;

        // Rebuild material (2K textures for overview)
        var newMaterial = createPlanetMaterial(pData, false);
        mesh.material = newMaterial;

        // Rebuild children materials (atmosphere, clouds, etc.)
        for (var c = 0; c < mesh.children.length; c++) {
            var child = mesh.children[c];

            // Rebuild atmosphere
            if (child === mesh.userData.atmosphere && pData.atmosphereColor && ATMOSPHERE_ENABLED) {
                child.material = new THREE.MeshBasicMaterial({
                    color: pData.atmosphereColor,
                    transparent: true,
                    opacity: pData.atmosphereOpacity || 0.08,
                    side: THREE.BackSide
                });
            }

            // Rebuild cloud material
            if (child === mesh.userData.clouds && child.geometry) {
                var cloudUrl = pData.cloudTexture;
                if (cloudUrl) {
                    var loader = new THREE.TextureLoader();
                    loader.setCrossOrigin('anonymous');
                    var cloudTex = loader.load(cloudUrl);
                    child.material = new THREE.MeshPhongMaterial({
                        map: cloudTex,
                        transparent: true,
                        opacity: IS_MOBILE ? 0.3 : 0.4,
                        blending: IS_MOBILE ? THREE.NormalBlending : THREE.AdditiveBlending,
                        depthWrite: false
                    });
                }
            }

            // Rebuild label sprites
            if (child.isSprite && !child.material.map) {
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = 512;
                canvas.height = 128;
                ctx.font = 'bold 48px "Orbitron", "Segoe UI", sans-serif';
                ctx.fillStyle = '#00f2fe';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                ctx.shadowBlur = 8;
                ctx.fillText(pData.name, canvas.width / 2, canvas.height / 2);
                var texture = new THREE.CanvasTexture(canvas);
                child.material = new THREE.SpriteMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0.85,
                    depthWrite: false
                });
            }
        }

        // Restore visibility
        mesh.visible = true;

        // Restore glow layers
        if (mesh.userData.glows) {
            for (var g = 0; g < mesh.userData.glows.length; g++) {
                mesh.userData.glows[g].visible = true;
                // Rebuild glow material
                var glowConfigs = [
                    { color: 0xffcc44, opacity: 0.12 },
                    { color: 0xff8800, opacity: 0.06 },
                    { color: 0xff4400, opacity: 0.03 }
                ];
                if (g < glowConfigs.length) {
                    mesh.userData.glows[g].material = new THREE.MeshBasicMaterial({
                        color: glowConfigs[g].color,
                        transparent: true,
                        opacity: glowConfigs[g].opacity,
                        side: THREE.BackSide
                    });
                }
            }
        }
    }

    // 2. Restore orbit lines
    for (var j = 0; j < orbitLines.length; j++) {
        orbitLines[j].visible = true;
    }

    // 3. Restore all solar system children visibility
    for (var k = 0; k < solarSystemGroup.children.length; k++) {
        solarSystemGroup.children[k].visible = true;
    }

    isUnloaded = false;
    storedMaterials = [];

    console.log('[T.A.R.D.I.S. Optimizer] Sistema Solar reconstruído com sucesso!');
}

/**
 * Get current memory statistics from the renderer.
 */
export function getMemoryStats() {
    if (!renderer || !renderer.info) {
        return { geometries: 0, textures: 0, drawCalls: 0, triangles: 0 };
    }
    return {
        geometries: renderer.info.memory.geometries || 0,
        textures: renderer.info.memory.textures || 0,
        drawCalls: renderer.info.render.calls || 0,
        triangles: renderer.info.render.triangles || 0
    };
}

/**
 * Check if the solar system is currently unloaded.
 */
export function isSolarSystemUnloaded() {
    return isUnloaded;
}
