import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Sky, KeyboardControls } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import type { Avatar } from '../App';
import { Park } from './Park';
import { PlayerController } from './PlayerController';
import { AnimationSelector, toNaturalName, type AnimationItem } from './AnimationSelector';
import { ChatInterface, type ChatMessage } from './ChatInterface';

interface Props {
  selectedAvatar: Avatar | null;
  onBack: () => void;
}

const VirtualWorld: React.FC<Props> = ({ selectedAvatar, onBack }) => {
  const [chatMessage, setChatMessage] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = React.useState(true);
  const [animationNames, setAnimationNames] = useState<AnimationItem[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState('');

  // Nuevos estados para las transiciones
  const [hasEntered, setHasEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showChatUI, setShowChatUI] = useState(false); // Controla la visibilidad del ChatInterface

  const onlineUsers = 47;

  // Efecto para la animación de entrada y control de visibilidad del chat
  useEffect(() => {
    // Retraso para que el "mundo" principal aparezca primero (duración de la transición de entrada)
    const worldEnterTimer = setTimeout(() => {
      setHasEntered(true);
    }, 10); // Un pequeño retraso para asegurar que las clases iniciales se apliquen

    // Después de que el mundo haya entrado completamente, mostramos el chat
    const chatShowTimer = setTimeout(() => {
      setShowChatUI(true);
    }, 700); // Coincide con la duración de la transición del mundo (700ms)

    return () => {
      clearTimeout(worldEnterTimer);
      clearTimeout(chatShowTimer);
    };
  }, []);

  const handleSetAnimationNames = (names: string[]) => {
    const naturalNames = names.map(name => ({ name, naturalName: toNaturalName(name) }));
    setAnimationNames(naturalNames);
  };

  useEffect(() => {
    if (animationNames.length > 0 && !currentAnimation) {
      setCurrentAnimation(animationNames[0].name);
    }
  }, [animationNames, currentAnimation]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          user: selectedAvatar?.name || 'Tú',
          message: chatMessage,
          timestamp: new Date(),
          avatar: selectedAvatar?.image || ''
        }
      ]);
      setChatMessage('');
    }
  };

  // Función para manejar el clic en el botón "Salir"
  const handleBackClick = useCallback(() => {
    setShowChatUI(false); // Oculta el chat primero
    // Retrasa la activación de la transición de salida del mundo
    const chatHideTimer = setTimeout(() => {
      setIsExiting(true); // Activa la animación de salida del mundo
    }, 100); // Pequeño retraso para que el chat empiece a desaparecer un poco antes

    // Retrasa la llamada a onBack para que la transición de salida del mundo se complete
    const backTimer = setTimeout(() => {
      onBack();
    }, 700); // Coincide con la duración de la transición de salida del mundo (700ms)

    return () => {
      clearTimeout(chatHideTimer);
      clearTimeout(backTimer);
    };
  }, [onBack]);

  const map = [
    { name: "forward", keys: ["ArrowUp", "w", "W"] },
    { name: "backward", keys: ["ArrowDown", "s", "S"] },
    { name: "left", keys: ["ArrowLeft", "a", "A"] },
    { name: "right", keys: ["ArrowRight", "d", "D"] },
    { name: "jump", keys: ["Space"] },
  ];

  return (
    <KeyboardControls map={map}>
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {/* El fondo se mantiene estático o puede tener su propia animación si se desea */}
        <div className="absolute inset-0 w-full h-full bg-black z-0"></div>

        {/* Contenedor principal del mundo 3D y UI superior, con transición */}
        <div
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${hasEntered && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <Canvas shadows camera={{ fov: 60 }}>
            <Sky sunPosition={[10, 10, 10]} turbidity={6} />
            <ambientLight intensity={0.6} />
            <hemisphereLight intensity={0.6} groundColor="black" />
            <directionalLight
              position={[10, 15, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Physics>
              <RigidBody type="fixed">
                <CuboidCollider args={[25, 0.1, 25]} position={[0, -0.1, 0]} />
              </RigidBody>
              <PlayerController
                selectedAvatar={selectedAvatar}
                animation={currentAnimation}
                onAnimations={handleSetAnimationNames}
              />
            </Physics>
            <Park />
            <EffectComposer>
              <SSAO radius={0.05} intensity={20} luminanceInfluence={0.5} />
              <Bloom intensity={0.5} mipmapBlur />
            </EffectComposer>
          </Canvas>

          {/* UI superior (Botones, Usuarios en línea) */}
          <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
            <div className="flex items-center justify-between pointer-events-auto">
              <button onClick={handleBackClick} className="flex items-center space-x-2 px-4 py-2 bg-gray-900/60 text-white rounded-full hover:bg-gray-800/60 border border-gray-700/30">
                <ArrowLeft className="w-4 h-4" />
                <span>Salir</span>
              </button>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/60 text-white rounded-full border border-gray-700/30">
                  <Users className="w-4 h-4" />
                  <span>{onlineUsers} en línea</span>
                </div>
                <button className="p-2 bg-gray-900/60 text-white rounded-full hover:bg-gray-800/60 border border-gray-700/30">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Selector de Animación */}
          {animationNames.length > 0 && (
            <AnimationSelector
              animationNames={animationNames}
              current={currentAnimation}
              setCurrent={setCurrentAnimation}
            />
          )}
        </div>

        {/* Interfaz de Chat con su propia transición, dependiente de showChatUI */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 pointer-events-none z-20 transition-all duration-500 ease-out ${showChatUI ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
            }`}
        >
          <ChatInterface
            isChatOpen={isChatOpen}
            toggleChat={() => setIsChatOpen(!isChatOpen)}
            chatMessages={chatMessages}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </KeyboardControls>
  );
};

export default VirtualWorld;