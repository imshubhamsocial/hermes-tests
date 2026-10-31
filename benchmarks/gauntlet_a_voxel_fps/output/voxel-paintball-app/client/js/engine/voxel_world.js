import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.164.1/three.module.js';

// Constants based on requirement
const WORLD_SIZE_X = 32;
const WORLD_SIZE_Y = 16;
const WORLD_SIZE_Z = 32;
const VOXEL_SIZE = 1.0;
const MAX_VOXELS = WORLD_SIZE_X * WORLD_SIZE_Y * WORLD_SIZE_Z;

let voxelMesh;
let instanceCount = 0;
let instanceMatrix = new THREE.Matrix4();
let instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(MAX_VOXELS * 3), 3);

// Voxel data: 0=air, 1=ground/solid, 2=bunker
const voxelData = new Uint8Array(MAX_VOXELS).fill(0);

/**
 * Initializes the 32x16x32 voxel arena with cover bunkers using THREE.InstancedMesh.
 */
function initializeWorld() {
    // 1. Fill ground layer (Y=0)
    for (let x = 0; x < WORLD_SIZE_X; x++) {
        for (let z = 0; z < WORLD_SIZE_Z; z++) {
            const index = x + z * WORLD_SIZE_X;
            const y_index = index + 0 * WORLD_SIZE_X * WORLD_SIZE_Z;
            voxelData[y_index] = 1; // Solid ground
        }
    }

    // 2. Add simple cover bunkers
    const bunkerPositions = [
        { x: 10, z: 12, y: 1 },
        { x: 20, z: 22, y: 1 }
    ];
    bunkerPositions.forEach(pos => {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                const x = pos.x + dx;
                const z = pos.z + dz;
                if (x >= 0 && x < WORLD_SIZE_X && z >= 0 && z < WORLD_SIZE_Z) {
                    const index = x + z * WORLD_SIZE_X;
                    const y_index = index + 1 * WORLD_SIZE_X * WORLD_SIZE_Z;
                    voxelData[y_index] = 2; // Bunker
                }
            }
        }
    });

    // 3. Build InstancedMesh
    const boxGeometry = new THREE.BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
    const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    
    voxelMesh = new THREE.InstancedMesh(boxGeometry, material, MAX_VOXELS);
    voxelMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    voxelMesh.instanceColor = instanceColor;
    
    // Populate instances
    for (let i = 0; i < MAX_VOXELS; i++) {
        if (voxelData[i] !== 0) {
            instanceCount++;
            const x = i % WORLD_SIZE_X;
            const z = Math.floor(i / WORLD_SIZE_X);
            const y = Math.floor(i / (WORLD_SIZE_X * WORLD_SIZE_Z));

            // Calculate world position (center of voxel)
            const position = new THREE.Vector3(x * VOXEL_SIZE + VOXEL_SIZE / 2, y * VOXEL_SIZE + VOXEL_SIZE / 2, z * VOXEL_SIZE + VOXEL_SIZE / 2);
            
            instanceMatrix.setPosition(position.x, position.y, position.z);
            voxelMesh.setMatrixAt(instanceCount - 1, instanceMatrix);

            // Set initial color
            let hexColor = 0x888888; 
            if (voxelData[i] === 2) {
                hexColor = 0x555555; // Bunker color
            }
            
            // Convert hex to RGB array
            const r = (hexColor >> 16) & 0xFF / 255;
            const g = (hexColor >> 8) & 0xFF / 255;
            const b = hexColor & 0xFF / 255;
            
            instanceColor.setXYZ(instanceCount - 1, r, g, b);
        }
    }

    voxelMesh.instanceMatrix.needsUpdate = true;
    voxelMesh.instanceColor.needsUpdate = true;
    console.log(`Voxel World initialized with ${instanceCount} instances.`);
}

/**
 * Updates the color of a specific voxel instance (splat decal).
 * @param {number} instanceId - The 1-based ID of the voxel instance.
 * @param {string} hexColor - Hex color string (e.g., "#F538A0").
 */
function splatVoxel(instanceId, hexColor) {
    if (instanceId < 1 || instanceId > instanceCount) {
        console.error("Invalid instance ID for splatVoxel.");
        return;
    }

    // Parse hex color
    const hex = parseInt(hexColor.replace('#', ''), 16);
    const r = (hex >> 16) & 0xFF / 255;
    const g = (hex >> 8) & 0xFF / 255;
    const b = hex & 0xFF / 255;

    // Update the color attribute
    instanceColor.setXYZ(instanceId - 1, r, g, b);
    
    // Signal Three.js that the color data has changed
    instanceColor.needsUpdate = true;
}

export { initializeWorld, splatVoxel, voxelMesh, WORLD_SIZE_X, WORLD_SIZE_Y, WORLD_SIZE_Z };