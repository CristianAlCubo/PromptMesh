import type React from "react"
import { useRef, useMemo, useState, useEffect, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import type * as THREE from "three"

interface LandingPageProps {
  onEnter: () => void;
  onMount: () => void; // Nueva prop para indicar que se ha montado y está listo para la entrada
  isReturning: boolean; // Nueva prop para indicar si se está regresando a esta página
}

// Componente de partículas flotantes
function FloatingParticles() {
  const ref = useRef<THREE.Points>(null!)
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3)
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05
      ref.current.rotation.y = state.clock.elapsedTime * 0.075
    }
  })

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00ffff" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  )
}

// Componente de geometría animada
function AnimatedGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[3, 0, -5]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.3} />
    </mesh>
  )
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onMount, isReturning }) => {
  const [hasEntered, setHasEntered] = useState(false); // Controla la entrada inicial/regreso
  const [isExiting, setIsExiting] = useState(false); // Controla la salida

  // Efecto para la animación de entrada al montar o al regresar
  useEffect(() => {
    // Si la página se está montando por primera vez o estamos regresando a ella, animar la entrada
    if (isReturning || !hasEntered) {
      const timer = setTimeout(() => {
        setHasEntered(true);
        // Llama a onMount solo si es la primera carga o si necesitas notificar al padre
        if (isReturning) {
          // Si estamos regresando, resetea el estado de retorno en el padre si es necesario
          // onMount(); // Podrías tener una función en App.tsx para resetear isReturning
        }
      }, 100); // Pequeño retraso para la transición de entrada

      return () => clearTimeout(timer);
    }
  }, [isReturning, hasEntered, onMount]); // Dependencias para re-ejecutar el efecto

  const handleEnterClick = useCallback(() => {
    setIsExiting(true); // Activa la animación de salida
    setTimeout(() => {
      onEnter(); // Llama a onEnter después de la duración de la transición
    }, 1000); // Ajusta este tiempo para que coincida con la duración de tu transición CSS (1000ms = 1s)
  }, [onEnter]);

  return (
    // Agrega clases de transición al contenedor principal
    <div
      className={`relative h-screen w-full overflow-hidden bg-black transition-opacity duration-1000 ease-in-out ${
        (hasEntered && !isExiting) ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Canvas de Three.js para efectos 3D */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <FloatingParticles />
          <AnimatedGeometry />
        </Canvas>
      </div>

      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 z-10">
        {/* Gradientes animados */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-pulse"></div>

        {/* Círculos con efecto neon */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border-2 border-cyan-400/30 animate-spin-slow shadow-[0_0_50px_#00ffff40]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border-2 border-pink-400/30 animate-spin-reverse shadow-[0_0_40px_#ff00ff40]"></div>

        {/* Líneas de energía */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
        <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-pulse delay-1000"></div>
      </div>

      {/* Grid futurista */}
      <div className="absolute inset-0 z-20 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Logo/Título con efecto holográfico */}
        <div className="relative mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            PromptMesh
          </h1>
          <div className="absolute inset-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-cyan-400/20 blur-sm animate-pulse delay-500">
            PromptMesh
          </div>

          {/* Efectos de brillo */}
          <div className="absolute -top-4 -left-4 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-1000"></div>
        </div>

        {/* Subtítulo con efecto typewriter */}
        <div className="relative mb-12">
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 font-light tracking-wide max-w-4xl leading-relaxed">
            <span className="text-cyan-400 font-semibold">Crea</span>,
            <span className="text-purple-400 font-semibold"> personaliza</span> y
            <span className="text-pink-400 font-semibold"> explora</span>
            <br />
            <span className="text-white">Tu mundo, tus reglas.</span>
          </p>

          {/* Línea decorativa */}
          <div className="mt-6 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>

        {/* Botón futurista */}
        <div className="relative group transition-transform duration-300 hover:scale-105">
          <button
            onClick={handleEnterClick}
            className="relative px-12 py-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full border border-cyan-400/50 shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] active:scale-95"
          >
            <span className="relative z-10">Entrar al Multiverso</span>

            {/* Efecto de ondas */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 animate-pulse"></div>

            {/* Partículas del botón */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-500"></div>
          </button>

          {/* Anillo exterior del botón */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 scale-110 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        {/* Indicadores de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2">
          <div className="w-px h-16 bg-gradient-to-b from-cyan-400/50 to-transparent animate-pulse"></div>
          <div className="w-2 h-2 border border-cyan-400/50 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Efectos de esquinas */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-400/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-purple-400/30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-pink-400/30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-400/30"></div>

      {/* Overlay de ruido para textura */}
      <div
        className="absolute inset-0 z-40 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  )
}

export default LandingPage