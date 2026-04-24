// ============================================
// T.A.R.D.I.S. — HAND TRACKING (MediaPipe)
// ============================================
import { ROTATION_SPEED, MEDIAPIPE_ENABLED, MEDIAPIPE_CAMERA_RES } from '../config.js';

let isGrabbing = false;
let lastHandPos = { x: 0, y: 0 };
let frameCount = 0;

export let isScanning = false;

// Callbacks set by main.js
let callbacks = {
    onMove: null,      // (dx, dy)
    onScan: null,      // ()
    onZoomIn: null,    // ()
    onZoomOut: null,   // ()
    onNeutral: null,   // ()
    onNoHand: null     // ()
};

export function setHandCallbacks(cbs) {
    callbacks = { ...callbacks, ...cbs };
}

function isFingerFolded(lm, tipIdx, pipIdx) {
    const wrist = lm[0]; const tip = lm[tipIdx]; const pip = lm[pipIdx];
    return Math.hypot(tip.x - wrist.x, tip.y - wrist.y) < Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
}

function setMode(text, color) {
    const modeLabel = document.getElementById('current-mode');
    const modeDot = document.getElementById('mode-dot');
    if (modeLabel) {
        modeLabel.innerText = text;
        modeLabel.style.color = color;
    }
    if (modeDot) modeDot.style.background = color;
}

export function initHandTracking() {
    // --- MOBILE GUARD ---
    // MediaPipe Hands consumes 30-50% CPU (ML model per camera frame).
    // On mobile this alone drops FPS from 60 → 15. Disable entirely.
    if (!MEDIAPIPE_ENABLED) {
        const loadingScreen = document.getElementById('loading');
        if (loadingScreen) loadingScreen.style.display = 'none';
        console.log('[T.A.R.D.I.S.] Hand tracking DISABLED (mobile device detected)');
        setMode('TOUCH MODE', '#22c55e');
        return;
    }

    const skeletonCanvasEl = document.getElementById('skeleton_canvas');
    const sCtx = skeletonCanvasEl.getContext('2d');
    skeletonCanvasEl.width = window.innerWidth;
    skeletonCanvasEl.height = window.innerHeight;

    const uiLayer = document.getElementById('ui-layer');
    const loadingScreen = document.getElementById('loading');

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
    });

    hands.onResults((results) => {
        loadingScreen.style.display = 'none';
        sCtx.clearRect(0, 0, skeletonCanvasEl.width, skeletonCanvasEl.height);

        frameCount++;
        if (frameCount % 2 !== 0 && results.multiHandLandmarks?.length > 0) {
            const lm = results.multiHandLandmarks[0];
            drawConnectors(sCtx, lm, HAND_CONNECTIONS, { color: '#0095FF', lineWidth: 2 });
            drawLandmarks(sCtx, lm, { color: '#fff', lineWidth: 1, radius: 2 });
            return;
        }

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const lm = results.multiHandLandmarks[0];
            drawConnectors(sCtx, lm, HAND_CONNECTIONS, { color: '#0095FF', lineWidth: 2 });
            drawLandmarks(sCtx, lm, { color: '#fff', lineWidth: 1, radius: 2 });

            const hX = (1 - lm[9].x) * window.innerWidth;
            const hY = lm[9].y * window.innerHeight;

            const indexFolded = isFingerFolded(lm, 8, 6);
            const middleFolded = isFingerFolded(lm, 12, 10);
            const ringFolded = isFingerFolded(lm, 16, 14);
            const pinkyFolded = isFingerFolded(lm, 20, 18);

            // FIST - Move
            if (indexFolded && middleFolded && ringFolded && pinkyFolded) {
                setMode('MOVER ✊', 'yellow');
                uiLayer.classList.remove('scanning');
                isScanning = false;

                if (!isGrabbing) {
                    isGrabbing = true;
                    lastHandPos = { x: hX, y: hY };
                } else {
                    const dx = (hX - lastHandPos.x) * ROTATION_SPEED;
                    const dy = (hY - lastHandPos.y) * ROTATION_SPEED;
                    if (callbacks.onMove) callbacks.onMove(dx, dy);
                    lastHandPos = { x: hX, y: hY };
                }
            }
            // PALM - Scan
            else if (!indexFolded && !middleFolded && !ringFolded && !pinkyFolded) {
                isGrabbing = false;
                isScanning = true;
                uiLayer.classList.add('scanning');
                setMode('ESCANEAR ✋', '#0095FF');
                if (callbacks.onScan) callbacks.onScan();
            }
            // PEACE - Zoom In
            else if (!indexFolded && !middleFolded && ringFolded && pinkyFolded) {
                isGrabbing = false;
                isScanning = false;
                uiLayer.classList.remove('scanning');
                setMode('ZOOM + ✌️', '#22c55e');
                if (callbacks.onZoomIn) callbacks.onZoomIn();
            }
            // INDEX ONLY - Zoom Out
            else if (!indexFolded && middleFolded && ringFolded && pinkyFolded) {
                isGrabbing = false;
                isScanning = false;
                uiLayer.classList.remove('scanning');
                setMode('ZOOM - ☝️', '#f97316');
                if (callbacks.onZoomOut) callbacks.onZoomOut();
            }
            // NEUTRAL
            else {
                isGrabbing = false;
                isScanning = false;
                uiLayer.classList.remove('scanning');
                setMode('NEUTRO', '#555');
                if (callbacks.onNeutral) callbacks.onNeutral();
            }
        } else {
            uiLayer.classList.remove('scanning');
            isScanning = false;
            isGrabbing = false;
            setMode('SEM MÃO', '#888');
            if (callbacks.onNoHand) callbacks.onNoHand();
        }
    });

    // Start camera with configured resolution
    const cam = new Camera(document.getElementById('input_video'), {
        onFrame: async () => {
            await hands.send({ image: document.getElementById('input_video') });
        },
        width: MEDIAPIPE_CAMERA_RES.width,
        height: MEDIAPIPE_CAMERA_RES.height
    });
    cam.start();

    // Resize skeleton canvas on window resize
    window.addEventListener('resize', () => {
        skeletonCanvasEl.width = window.innerWidth;
        skeletonCanvasEl.height = window.innerHeight;
    });
}
