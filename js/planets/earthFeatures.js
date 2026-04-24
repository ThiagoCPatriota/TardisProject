// ============================================
// T.A.R.D.I.S. — EARTH FEATURES (borders, landmarks)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLOBE_RADIUS } from '../config.js';
import { NASA_LANDMARKS } from '../data/landmarks.js';
import { createLabelSprite } from '../scene/solarSystem.js';

// --- GEODATA ---
export const COUNTRY_DB = [];
export let countryLabelSprites = [];
export let landmarkMeshes = [];

export function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return new THREE.Vector3(x, y, z);
}

function createCountryLabelSprite(name, scale = 0.04, color = '#88ccff') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 96;
    ctx.font = 'bold 28px "Inter", "Segoe UI", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 6;
    ctx.fillText(name.substring(0, 20), canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        sizeAttenuation: true
    }));
    sprite.scale.set(scale * 6, scale * 1.2, 1);
    return sprite;
}

export async function loadEarthBorders(group) {
    try {
        const loadingStatus = document.getElementById('loading-status');
        if (loadingStatus) loadingStatus.textContent = 'CARREGANDO FRONTEIRAS...';

        const res = await fetch("https://cdn.jsdelivr.net/gh/holtzy/D3-graph-gallery@master/DATA/world.geojson");
        if (!res.ok) throw new Error("Erro ao baixar mapa mundi");
        const geojson = await res.json();

        const borderMaterial = new THREE.LineBasicMaterial({
            color: 0x003B6F,
            transparent: true,
            opacity: 0.5
        });

        countryLabelSprites = [];

        geojson.features.forEach(feat => {
            if (!feat.geometry) return;
            const props = feat.properties || {};
            const originalName = (props.name || props.admin || "Unknown").toString();
            const geom = feat.geometry;
            const allCoords = [];

            function processRing(ring) {
                const vertices = [];
                ring.forEach(coord => {
                    const lon = coord[0]; const lat = coord[1];
                    allCoords.push({ lat, lon });
                    const v = latLonToVector3(lat, lon, GLOBE_RADIUS + 0.04);
                    vertices.push(v.x, v.y, v.z);
                });
                if (vertices.length >= 6) {
                    const g = new THREE.BufferGeometry();
                    g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                    group.add(new THREE.Line(g, borderMaterial));
                }
            }
            if (geom.type === "Polygon") geom.coordinates.forEach(processRing);
            else if (geom.type === "MultiPolygon") geom.coordinates.forEach(poly => poly.forEach(processRing));

            if (allCoords.length > 0) {
                let sumLat = 0, sumLon = 0;
                allCoords.forEach(c => { sumLat += c.lat; sumLon += c.lon; });
                const centerLat = sumLat / allCoords.length;
                const centerLon = sumLon / allCoords.length;

                const displayName = originalName.toUpperCase();
                COUNTRY_DB.push({ name: displayName, lat: centerLat, lon: centerLon });

                const labelPos = latLonToVector3(centerLat, centerLon, GLOBE_RADIUS + 0.08);
                const label = createCountryLabelSprite(originalName, 0.04, '#88ddff');
                label.position.copy(labelPos);
                label.visible = false;
                group.add(label);
                countryLabelSprites.push(label);
            }
        });
    } catch (err) { console.error("Erro no mapa mundi:", err); }
}

export function createLandmarks(group) {
    landmarkMeshes = [];
    NASA_LANDMARKS.forEach(lm => {
        const pos = latLonToVector3(lm.lat, lm.lon, GLOBE_RADIUS + 0.06);

        const markerGeo = new THREE.SphereGeometry(0.04, 12, 12);
        const markerMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.copy(pos);

        const ringGeo = new THREE.RingGeometry(0.05, 0.08, 24);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xf97316,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(0, 0, 0);

        const label = createLabelSprite(lm.icon + ' ' + lm.name.substring(0, 15), 0.06, '#f97316');
        label.position.copy(latLonToVector3(lm.lat, lm.lon, GLOBE_RADIUS + 0.15));

        marker.userData.landmark = lm;
        ring.userData.landmark = lm;

        group.add(marker);
        group.add(ring);
        group.add(label);

        landmarkMeshes.push({ marker, ring, label, data: lm });
    });
}

export function findNearestLocation(lat, lon) {
    if (!COUNTRY_DB.length) return null;
    let closest = null;
    let minDist = 10000;
    COUNTRY_DB.forEach(loc => {
        const dist = Math.sqrt((loc.lat - lat) ** 2 + (loc.lon - lon) ** 2);
        if (dist < minDist) { minDist = dist; closest = loc; }
    });
    return minDist < 20 ? closest : null;
}

export function findNearestLandmark(lat, lon) {
    let closest = null;
    let minDist = 10000;
    NASA_LANDMARKS.forEach(lm => {
        const dist = Math.sqrt((lm.lat - lat) ** 2 + (lm.lon - lon) ** 2);
        if (dist < minDist) { minDist = dist; closest = lm; }
    });
    return minDist < 8 ? closest : null;
}
