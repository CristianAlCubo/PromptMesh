import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface GLBViewerProps {
    url: string;
    rotationY?: number;
}

const Model: React.FC<GLBViewerProps> = ({ url, rotationY = 0 }) => {
    const { scene } = useGLTF(url);

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;

            scene.scale.set(scale, scale, scale);
            scene.position.sub(center.multiplyScalar(scale));

            scene.traverse(child => {
                if ((child as THREE.Mesh).isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
        }
    }, [scene]);

    useEffect(() => {
        if (scene) {
            scene.rotation.y = rotationY;
        }
    }, [rotationY, scene]);

    return <primitive object={scene} />;
};

export const GLBViewer: React.FC<GLBViewerProps> = ({ url, rotationY }) => {
    return (
        <Canvas shadows camera={{ position: [0, 1, 3], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1.0}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <Model url={url} rotationY={rotationY} />
            <OrbitControls target={[0, 1, 0]} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="grey" />
            </mesh>
        </Canvas>
    );
}; 