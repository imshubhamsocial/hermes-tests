import { connectWebSocket, sendInput, sendShoot, getLocalState } from './net/socket_sync.js';
import { VoxelWorld } from './engine/voxel_world.js';
import { CameraFPS } from './engine/camera_fps.js';
import { Paintball } from './engine/paintball.js';
import * as THREE from 'three';

let scene, renderer;
let lastTime = 0;
let keys = {};
let animationFrameId;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    const canvas = document.getElementById('gameCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    VoxelWorld.init();
    VoxelWorld.getMesh().matrixAutoUpdate = false;
    
    CameraFPS.constructor(CameraFPS.camera, CameraFPS.controls, VoxelWorld);
    Paintball.init();

    connectWebSocket();

    document.addEventListener('keydown', (e) => { keys[e.code] = true; });
    document.addEventListener('keyup', (e) => { keys[e.code] = false; });
    
    document.querySelectorAll('.hotbar-slot').forEach(slot => {
        slot.addEventListener('click', () => {
            const weapon = parseInt(slot.dataset.weapon);
            const state = getLocalState();
            const origin = state.pos;
            const direction = [0, 1, 0];
            const color = '#F538A0';
            sendShoot(origin, direction, color, weapon);
        });
    });

    animate(0);
}

function animate(time) {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    CameraFPS.update(delta);
    Paintball.update(delta);

    renderer.render(scene, CameraFPS.camera);

    if (time % 33 < 1) {
        sendInput(keys);
    }

    animationFrameId = requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    CameraFPS.camera.aspect = window.innerWidth / window.innerHeight;
    CameraFPS.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();