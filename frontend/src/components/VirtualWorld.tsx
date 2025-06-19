import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Users, MessageCircle, Smile, Settings } from 'lucide-react';
import type { Avatar } from '../App';

interface VirtualWorldProps {
  selectedAvatar: Avatar | null;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

const VirtualWorld: React.FC<VirtualWorldProps> = ({ selectedAvatar, onBack }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Elena',
      message: '¡Hola! Bienvenido al mundo virtual 😊',
      timestamp: new Date(),
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: '2',
      user: 'Marco',
      message: '¿Alguien quiere explorar el bosque encantado?',
      timestamp: new Date(),
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ]);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [onlineUsers] = useState(47);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Simple 3D world simulation with dark theme
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      // Clear canvas with dark gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#111827');
      gradient.addColorStop(0.5, '#1F2937');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating islands with dark theme
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 6) * (i + 1) + Math.sin(time + i) * 20;
        const y = canvas.height * 0.6 + Math.cos(time + i * 0.5) * 30;

        // Island
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.ellipse(x, y, 60, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Floating crystal
        ctx.fillStyle = '#6B7280';
        ctx.beginPath();
        ctx.ellipse(x, y - 30, 8, 15, time + i, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw avatar (simplified)
      if (selectedAvatar) {
        const avatarX = canvas.width / 2 + Math.sin(time * 0.5) * 5;
        const avatarY = canvas.height * 0.7;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(avatarX, avatarY + 40, 20, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#4B5563';
        ctx.fillRect(avatarX - 10, avatarY - 20, 20, 40);

        // Head
        ctx.fillStyle = '#D1D5DB';
        ctx.beginPath();
        ctx.arc(avatarX, avatarY - 35, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Floating particles
      for (let i = 0; i < 20; i++) {
        const x = (canvas.width / 20) * i + Math.sin(time + i * 0.3) * 50;
        const y = Math.sin(time + i * 0.1) * 100 + canvas.height * 0.3;

        ctx.fillStyle = `hsla(${220 + i * 5}, 20%, 60%, 0.4)`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      time += 0.02;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedAvatar]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        user: selectedAvatar?.name || 'Tú',
        message: chatMessage,
        timestamp: new Date(),
        avatar: selectedAvatar?.image || ''
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D World Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 pointer-events-auto">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm text-white rounded-full hover:bg-gray-800/60 transition-colors duration-200 border border-gray-700/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Salir</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/60 backdrop-blur-sm text-white rounded-full border border-gray-700/30">
              <Users className="w-4 h-4" />
              <span>{onlineUsers} en línea</span>
            </div>

            <button className="p-2 bg-gray-900/60 backdrop-blur-sm text-white rounded-full hover:bg-gray-800/60 transition-colors duration-200 border border-gray-700/30">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Interface */}
        <div className={`absolute bottom-4 right-4 w-80 pointer-events-auto transition-all duration-300 ${isChatOpen ? 'translate-y-0' : 'translate-y-full'
          }`}>
          <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-gray-300" />
                <span className="font-semibold text-white">Chat Global</span>
              </div>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start space-x-3">
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    className="w-8 h-8 rounded-full object-cover grayscale"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-white">{msg.user}</span>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{msg.message}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors duration-200">
                  <Smile className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim()}
                  className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Toggle Button (when chat is closed) */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="absolute bottom-4 right-4 p-4 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors duration-200 pointer-events-auto border border-gray-600/50"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VirtualWorld;