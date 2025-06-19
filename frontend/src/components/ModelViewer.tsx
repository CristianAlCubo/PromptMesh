import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useLoadModel } from "../hooks/img2mesh";
import { useState } from "react";
import type { EulerOrder } from "three";

interface ModelViewerProps {
    objUrl: string | null;
}

type AxisOrientation = "y-up" | "z-up";
type Rotation = [x: number, y: number, z: number, order?: EulerOrder];

const ModelViewer = ({ objUrl }: ModelViewerProps) => {
    const obj = useLoadModel(objUrl);
    const [orientation, setOrientation] = useState<AxisOrientation>("y-up");

    // Rotación basada en la orientación seleccionada
    const modelRotation: Rotation =
        orientation === "y-up" ? [0, 0, 0] : [-Math.PI / 2, 0, 0];

    return (
        <div
            style={{
                width: "100%",
                height: "500px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#0A0A0F",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "12px",
                    zIndex: 10,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(4px)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        background: "rgba(30, 30, 40, 0.6)",
                        borderRadius: "8px",
                        padding: "4px",
                    }}
                >
                    <button
                        onClick={() => setOrientation("y-up")}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: orientation === "y-up" ? "#3a7bd5" : "transparent",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 600,
                            transition: "all 0.2s ease",
                        }}
                    >
                        Y-Up
                    </button>
                    <button
                        onClick={() => setOrientation("z-up")}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: orientation === "z-up" ? "#3a7bd5" : "transparent",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 600,
                            transition: "all 0.2s ease",
                        }}
                    >
                        Z-Up
                    </button>
                </div>
            </div>

            <div
                style={{
                    flex: 1,
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                <Canvas
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    camera={{
                        position: [5, 5, 5],
                        fov: 50,
                        near: 0.1,
                        far: 1000,
                    }}
                    shadows
                >
                    <ambientLight intensity={0.6} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.3}
                        penumbra={0.8}
                        intensity={1}
                        castShadow
                    />
                    <directionalLight
                        position={[-5, 5, -5]}
                        intensity={0.5}
                    />

                    <Environment preset="city" />

                    <Grid
                        infiniteGrid
                        fadeDistance={30}
                        fadeStrength={1}
                        cellSize={1}
                        sectionSize={2}
                        cellColor="#6f6f6f"
                        sectionColor="#9d9d9d"
                    />

                    {obj && (
                        <primitive
                            object={obj}
                            scale={1}
                            rotation={modelRotation}
                            castShadow
                            receiveShadow
                        />
                    )}
                    <OrbitControls
                        enableDamping
                        dampingFactor={0.05}
                        minDistance={2}
                        maxDistance={20}
                    />
                </Canvas>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    background: "rgba(0, 0, 0, 0.5)",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    color: "rgba(255, 255, 255, 0.7)",
                    fontSize: "12px",
                    fontStyle: "italic"
                }}
            >
                Arrastra para rotar • Scroll para zoom
            </div>
        </div>
    );
};

export default ModelViewer;
