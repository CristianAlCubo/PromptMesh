import React, { useState, useEffect } from 'react';
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const onlineUsers = 47;

  useEffect(() => {
    if (selectedAvatar) {
      if (selectedAvatar.type === 'custom-glb' && selectedAvatar.glb) {
        const url = URL.createObjectURL(selectedAvatar.glb);
        setAvatarUrl(url);
        return () => URL.revokeObjectURL(url);
      } else if (selectedAvatar.type === 'predefined') {
        // Asignar un modelo predeterminado basado en el avatar seleccionado
        // Esto es un ejemplo, ajusta las rutas según tus archivos
        switch (selectedAvatar.id) {
          case 'preset-1':
            setAvatarUrl('/models/esqueleto.glb');
            break;
          case 'preset-2':
            setAvatarUrl('/models/gato.glb');
            break;
          case 'preset-3':
            setAvatarUrl('/models/marciano.glb');
            break;
          case 'preset-4':
            setAvatarUrl('/models/ogro.glb');
            break;
          case 'preset-5':
            setAvatarUrl('/models/ogrosombrero.glb');
            break;
          case 'preset-6':
            setAvatarUrl('/models/orco.glb');
            break;
          default:
            setAvatarUrl('/models/Walking.glb');
        }
      } else {
        // Fallback para avatares generados por IA u otros casos
        setAvatarUrl('/models/Walking.glb');
      }
    }
  }, [selectedAvatar]);

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
        <div className="absolute inset-0 w-full h-full">
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
                avatarUrl={avatarUrl}
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
        </div>

        <AnimationSelector
          animationNames={animationNames}
          current={currentAnimation}
          setCurrent={setCurrentAnimation}
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="flex items-center justify-between p-4 pointer-events-auto">
            <button onClick={onBack} className="flex items-center space-x-2 px-4 py-2 bg-gray-900/60 text-white rounded-full hover:bg-gray-800/60 border border-gray-700/30">
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
