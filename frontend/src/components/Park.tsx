import { Canvas } from '@react-three/fiber'

function Ground() {
    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            {/* Grass */}
            <mesh receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#6abe4f" flatShading />
            </mesh>
        </group>
    )
}

function Tree({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 2, 6]} />
                <meshStandardMaterial color="#8b5a2b" flatShading />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 2.5, 0]} castShadow>
                <coneGeometry args={[1, 2.5, 6]} />
                <meshStandardMaterial color="#379237" flatShading />
            </mesh>
        </group>
    )
}

function Bench({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Seat */}
            <mesh castShadow>
                <boxGeometry args={[2, 0.2, 0.5]} />
                <meshStandardMaterial color="#555" flatShading />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.9, -0.6, 0]}>
                <boxGeometry args={[0.2, 1, 0.2]} />
                <meshStandardMaterial color="#555" flatShading />
            </mesh>
            <mesh position={[0.9, -0.6, 0]}>
                <boxGeometry args={[0.2, 1, 0.2]} />
                <meshStandardMaterial color="#555" flatShading />
            </mesh>
        </group>
    )
}

function Fountain({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            {/* Base */}
            <mesh castShadow>
                <cylinderGeometry args={[1.5, 1.5, 0.5, 12]} />
                <meshStandardMaterial color="#cccccc" flatShading />
            </mesh>
            {/* Water */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[1.2, 1.2, 0.1, 12]} />
                <meshStandardMaterial color="#4fc3f7" transparent opacity={0.8} flatShading />
            </mesh>
        </group>
    )
}

export function Park() {
    return (
        <>
            <Ground />

            {/* Trees */}
            {[
                [-5, 0, -5],
                [-3, 0, 6],
                [4, 0, -4],
                [6, 0, 5],
            ].map((pos, i) => (
                <Tree key={i} position={pos as [number, number, number]} />
            ))}

            {/* Benches */}
            <Bench position={[2, 0.1, -2]} />
            <Bench position={[-2, 0.1, 2]} />

            {/* Fountain */}
            <Fountain position={[0, 0.25, 0]} />
        </>
    )
}

export default function ParkScene() {
    return (
        <Canvas
            shadows
            camera={{ position: [10, 10, 10], fov: 50 }}
        >
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={0.8}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />

            <Park />
        </Canvas>
    )
}
