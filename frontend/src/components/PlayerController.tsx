import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, OrbitControls } from "@react-three/drei";
import { CapsuleCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useRef, useMemo, useState } from "react";
import { AvatarGLB } from "./AvatarGLB";
import type { Avatar } from '../App';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const MOVE_SPEED = 5;
const JUMP_FORCE = 10;

interface PlayerControllerProps {
    selectedAvatar: Avatar | null;
    animation: string;
    onAnimations: (names: string[]) => void;
}

export function PlayerController({ selectedAvatar, animation, onAnimations }: PlayerControllerProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = useRef<any>(null);
    const character = useRef<THREE.Group>(null);
    const controls = useRef<OrbitControlsImpl>(null);
    const [animationState, setAnimationState] = useState('Idle');
    const [canJump, setCanJump] = useState(true);

    const [, getKeys] = useKeyboardControls();
    const { rapier, world } = useRapier();
    
    const avatarModelUrl = useMemo(() => selectedAvatar?.type === 'custom-glb' && selectedAvatar.glb
        ? URL.createObjectURL(selectedAvatar.glb)
        : '/models/Walking.glb', [selectedAvatar]);

    useFrame((state, delta) => {
        if (!body.current || !character.current || !controls.current) return;

        const { forward, backward, left, right, jump } = getKeys();

        // Ground check
        const origin = body.current.translation();
        origin.y -= 1.2; // Start ray from just above the character's feet
        const dir = { x: 0, y: -1, z: 0 };
        const ray = new rapier.Ray(origin, dir);
        const playerCollider = body.current.collider(0);
        // Cast a ray downwards for 0.3 units, ignore the player's own collider
        const hit = world.castRay(ray, 0.3, true, undefined, undefined, playerCollider);
        
        const isGrounded = hit !== null;

        if (jump) {
            console.log('Jump attempt:', {
                isGrounded,
                origin_y: origin.y,
                body_y: body.current.translation().y,
                hit_toi: hit?.timeOfImpact,
            });
        }

        const velocity = body.current.linvel();

        // Movement
        const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
        const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);
        const direction = new THREE.Vector3()
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(MOVE_SPEED)
            .applyEuler(state.camera.rotation);

        body.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

        // Animation control
        if (direction.length() > 0.1) {
            setAnimationState(animation);
        } else {
            setAnimationState('Idle');
        }

        // Rotation
        if (direction.length() > 0.1) {
            const angle = Math.atan2(direction.x, direction.z);
            const targetRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, 0));
            character.current.quaternion.slerp(targetRotation, delta * 15);
        }

        // Jumping
        if (canJump && jump) {
            body.current.applyImpulse({ x: 0, y: JUMP_FORCE, z: 0 }, true);
            setCanJump(false);
            setTimeout(() => setCanJump(true), 1000); // 1-second cooldown
        }
        
        // Camera
        const bodyPosition = body.current.translation();
        const cameraTarget = new THREE.Vector3(bodyPosition.x, bodyPosition.y + 1, bodyPosition.z);
        controls.current.target.lerp(cameraTarget, delta * 8);
        controls.current.update();
    });

    return (
        <>
            <OrbitControls 
                ref={controls} 
                maxPolarAngle={Math.PI / 2 - 0.1} 
                minPolarAngle={Math.PI / 4} 
                enablePan={false} 
            />
            <RigidBody ref={body} colliders={false} mass={1} type="dynamic" enabledRotations={[false, false, false]}>
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.3, 0]} />
                <group ref={character}>
                    {selectedAvatar && (
                        <AvatarGLB
                            url={avatarModelUrl}
                            animation={animationState}
                            onAnimations={(names) => {
                                if (!names.includes('Idle')) {
                                    names.unshift('Idle');
                                }
                                onAnimations(names);
                            }}
                            normalizeScale={selectedAvatar.type === 'custom-glb'}
                        />
                    )}
                </group>
            </RigidBody>
        </>
    );
} 