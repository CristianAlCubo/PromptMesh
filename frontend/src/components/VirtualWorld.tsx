import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import type { Avatar } from '../App';
import { Park } from './Park';
import { AvatarGLB } from './AvatarGLB';
import { AnimationSelector } from './AnimationSelector';
import { ChatInterface, type ChatMessage } from './ChatInterface';

interface Props {
  selectedAvatar: Avatar | null;
  onBack: () => void;
}

const VirtualWorld: React.FC<Props> = ({ selectedAvatar, onBack }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [animationNames, setAnimationNames] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState('');
  const avatarModelUrl = '/models/Walking.glb';
  const onlineUsers = 47;

  useEffect(() => {
    if (animationNames.length && !currentAnimation) {
      setCurrentAnimation(animationNames[0]);
    }
  }, [animationNames]);

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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 60 }}>
          <Sky sunPosition={[10, 10, 10]} turbidity={6} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />
          <Park />
          {selectedAvatar && (
            <AvatarGLB
              url={avatarModelUrl}
              animation={currentAnimation}
              onAnimations={setAnimationNames}
            />
          )}
          <OrbitControls target={[0, 1, 0]} />
        </Canvas>
      </div>

      {animationNames.length > 0 && (
        <AnimationSelector
          animationNames={animationNames}
          current={currentAnimation}
          setCurrent={setCurrentAnimation}
        />
      )}

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
  );
};

export default VirtualWorld;
