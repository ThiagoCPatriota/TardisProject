// ============================================
// T.A.R.D.I.S. — STARFIELD (Performance-Optimized)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { scene } from './setup.js';
import { STAR_COUNT } from '../config.js';

export function createStarfield() {
    // STAR_COUNT is 1500 on mobile, 3000 on desktop (from config.js)
    const starCount = STAR_COUNT;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
        const r = 400 + Math.random() * 600;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        sizes[i] = 0.5 + Math.random() * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);
    return stars;
}
