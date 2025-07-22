import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js';

interface AvatarGLBProps {
    url: string;
    animation: string;
    onAnimations: (names: string[]) => void;
    rotationY?: number;
    normalizeScale?: boolean;
}

export const AvatarGLB: React.FC<AvatarGLBProps> = ({
    url,
    animation,
    onAnimations,
    rotationY = 0,
    normalizeScale = false
}) => {
    const { scene: originalScene, animations } = useGLTF(url);

    const scene = useMemo(() => {
        const clonedScene = cloneSkeleton(originalScene);
        clonedScene.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
            }
        });
        return clonedScene;
    }, [originalScene]);

    const group = useRef<THREE.Group>(null!);
    const { actions, names } = useAnimations(animations, group);

    useLayoutEffect(() => {
        if (!normalizeScale || !group.current) return;

        const box = new THREE.Box3().setFromObject(group.current);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        if (size.y === 0) {
            console.warn('No se puede normalizar: altura cero');
            return;
        }

        const desiredHeight = 1.8;
        const scale = desiredHeight / size.y;

        group.current.scale.setScalar(scale);
        group.current.position.y = (size.y / 2 - center.y) * scale;
    }, [normalizeScale]);

    useEffect(() => {
        if (group.current) group.current.rotation.y = rotationY;
    }, [rotationY]);

    useEffect(() => {
        if (names.length > 0) onAnimations(names);
    }, [names, onAnimations]);

    useEffect(() => {
        const action = actions[animation];
        if (!action) return;

        action.reset().fadeIn(0.2).play();
        action.clampWhenFinished = true;
        action.loop = THREE.LoopRepeat;

        return () => {
            action.fadeOut(0.2);
        };
    }, [actions, animation]);

    return (
        <group ref={group}>
            <primitive object={scene} />
        </group>
    );
};
