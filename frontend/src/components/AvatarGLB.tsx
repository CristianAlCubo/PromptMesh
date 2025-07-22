import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarGLBProps {
    url: string;
    animation: string;
    onAnimations: (names: string[]) => void;
}

export const AvatarGLB: React.FC<AvatarGLBProps> = ({ url, animation, onAnimations }) => {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF(url);
    const { actions, names } = useAnimations(animations, group);

    useEffect(() => {
        if (names.length > 0) onAnimations(names);
    }, [names, onAnimations]);

    useEffect(() => {
        if (actions[animation]) {
            actions[animation]?.reset().fadeIn(0.2).play();
            return () => {
                actions[animation]?.fadeOut(0.2);
            };
        }
    }, [actions, animation]);

    return <primitive ref={group} object={scene} />;
};
