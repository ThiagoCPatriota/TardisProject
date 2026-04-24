// ============================================
// T.A.R.D.I.S. — COMETS (Performance-Optimized)
// ============================================
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { solarSystemGroup } from './setup.js';
import { COMET_COUNT, COMET_TAIL_PARTICLES } from '../config.js';

const comets = [];

// Pre-allocated vector — reused every frame instead of .clone().normalize()
const _cometDir = new THREE.Vector3();
const _cometLookAt = new THREE.Vector3();

function createComet() {
    const group = new THREE.Group();

    // Comet head (bright nucleus)
    const headGeo = new THREE.SphereGeometry(0.3, 12, 12);
    const headMat = new THREE.MeshBasicMaterial({
        color: 0xccddff,
        transparent: true,
        opacity: 0.95
    });
    const head = new THREE.Mesh(headGeo, headMat);
    group.add(head);

    // Inner glow (coma)
    const comaGeo = new THREE.SphereGeometry(0.6, 12, 12);
    const comaMat = new THREE.MeshBasicMaterial({
        color: 0x88bbff,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const coma = new THREE.Mesh(comaGeo, comaMat);
    group.add(coma);

    // Dust tail (particle trail) — count from config (mobile: 80, desktop: 200)
    const tailParticleCount = COMET_TAIL_PARTICLES;
    const tailPositions = new Float32Array(tailParticleCount * 3);
    const tailColors = new Float32Array(tailParticleCount * 3);
    const tailSizes = new Float32Array(tailParticleCount);

    for (let i = 0; i < tailParticleCount; i++) {
        const t = i / tailParticleCount;
        tailPositions[i * 3] = t * 25 + Math.random() * 1.5 * t;
        tailPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.5 * t;
        tailPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5 * t;
        tailSizes[i] = (1 - t) * 1.5 + 0.2;
        tailColors[i * 3] = 0.7 + (1 - t) * 0.3;
        tailColors[i * 3 + 1] = 0.8 + (1 - t) * 0.2;
        tailColors[i * 3 + 2] = 1.0;
    }

    const tailGeo = new THREE.BufferGeometry();
    tailGeo.setAttribute('position', new THREE.Float32BufferAttribute(tailPositions, 3));
    tailGeo.setAttribute('color', new THREE.Float32BufferAttribute(tailColors, 3));
    tailGeo.setAttribute('size', new THREE.Float32BufferAttribute(tailSizes, 1));

    const tailMat = new THREE.PointsMaterial({
        size: 0.6,
        transparent: true,
        opacity: 0.4,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const tail = new THREE.Points(tailGeo, tailMat);
    group.add(tail);

    // Ion tail
    const ionCount = 60;
    const ionPositions = new Float32Array(ionCount * 3);
    for (let i = 0; i < ionCount; i++) {
        const t = i / ionCount;
        ionPositions[i * 3] = t * 30;
        ionPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.3 * t;
        ionPositions[i * 3 + 2] = t * 5 + (Math.random() - 0.5) * 0.3 * t;
    }
    const ionGeo = new THREE.BufferGeometry();
    ionGeo.setAttribute('position', new THREE.Float32BufferAttribute(ionPositions, 3));
    const ionMat = new THREE.PointsMaterial({
        color: 0x4488ff,
        size: 0.3,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const ionTail = new THREE.Points(ionGeo, ionMat);
    group.add(ionTail);

    // Orbit parameters
    const rng = Math.random;
    const orbitData = {
        semiMajor: 70 + rng() * 80,
        semiMinor: 30 + rng() * 50,
        inclination: (rng() - 0.5) * Math.PI * 0.5,
        rotationY: rng() * Math.PI * 2,
        speed: 0.0003 + rng() * 0.0006,
        phase: rng() * Math.PI * 2
    };

    solarSystemGroup.add(group);
    comets.push({ group, head, coma, tail, tailMat, orbitData });
}

export function createAllComets() {
    // COMET_COUNT is 2 on mobile, 5 on desktop (from config.js)
    for (let i = 0; i < COMET_COUNT; i++) {
        createComet();
    }
}

export function animateComets(time) {
    comets.forEach(comet => {
        const od = comet.orbitData;
        const angle = time * od.speed + od.phase;

        const x = Math.cos(angle) * od.semiMajor;
        const z = Math.sin(angle) * od.semiMinor;
        const y = Math.sin(angle) * Math.sin(od.inclination) * od.semiMinor * 0.3;

        const cosR = Math.cos(od.rotationY);
        const sinR = Math.sin(od.rotationY);
        comet.group.position.set(
            x * cosR - z * sinR,
            y,
            x * sinR + z * cosR
        );

        // OPTIMIZED: reuse pre-allocated vectors instead of .clone().normalize()
        _cometDir.copy(comet.group.position).normalize();
        _cometLookAt.set(
            comet.group.position.x + _cometDir.x,
            comet.group.position.y + _cometDir.y,
            comet.group.position.z + _cometDir.z
        );
        comet.group.lookAt(_cometLookAt);

        const dist = comet.group.position.length();
        const brightness = Math.min(1, 50 / dist);
        comet.tailMat.opacity = brightness * 0.4;
        comet.coma.material.opacity = brightness * 0.3;
        comet.head.material.opacity = 0.6 + brightness * 0.4;

        const pulse = 1 + Math.sin(time * 3 + od.phase) * 0.15;
        comet.coma.scale.set(pulse, pulse, pulse);
    });
}
