import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarGLBProps {
    url: string;
    animation: string;
    onAnimations: (names: string[]) => void;
    rotationY?: number;
    normalizeScale?: boolean;
}

export const AvatarGLB: React.FC<AvatarGLBProps> = ({ url, animation, onAnimations, rotationY = 0, normalizeScale = false }) => {
    const { scene: originalScene, animations } = useGLTF(url);

    const scene = useMemo(() => {
        const clonedScene = originalScene.clone();
        clonedScene.traverse(child => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
            }
        });
        return clonedScene;
    }, [originalScene]);

    const group = useRef<THREE.Group>(null!);
    const { actions, names } = useAnimations(animations, group);

    useLayoutEffect(() => {
        const sceneNode = group.current;
        if (sceneNode && normalizeScale) {
            console.log('Normalizing scale for custom avatar...');
            const box = new THREE.Box3().setFromObject(sceneNode);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            console.log('Original size:', { x: size.x, y: size.y, z: size.z });

            if (size.y === 0) {
                console.warn("Avatar model has a height of 0, cannot normalize scale.");
                return;
            }

            const desiredHeight = 1.8;
            const scale = desiredHeight / size.y;

            console.log('Calculated scale:', scale);

            sceneNode.scale.set(scale, scale, scale);
            sceneNode.position.y = (size.y / 2 - center.y) * scale;
        }
    }, [scene, normalizeScale]);

    useEffect(() => {
        if (group.current) {
            group.current.rotation.y = rotationY;
        }
    }, [rotationY]);

    useEffect(() => {
        if (names && names.length > 0) onAnimations(names);
    }, [names, onAnimations]);

    useEffect(() => {
        if (actions && animation && actions[animation]) {
            actions[animation]?.reset().fadeIn(0.2).play();
            return () => {
                if (actions[animation]) {
                    actions[animation]?.fadeOut(0.2);
                }
            };
        }
    }, [actions, animation]);

    return <primitive ref={group} object={scene} />;
};
