import React, { useRef, useEffect } from 'react';
import { MessageCircle, Send, Smile } from 'lucide-react';

export interface ChatMessage {
    id: string;
    user: string;
    message: string;
    timestamp: Date;
    avatar: string;
}

interface ChatProps {
    isChatOpen: boolean;
    toggleChat: () => void;
    chatMessages: ChatMessage[];
    chatMessage: string;
    setChatMessage: (value: string) => void;
    onSend: () => void;
}

export const ChatInterface: React.FC<ChatProps> = ({
    isChatOpen,
    toggleChat,
    chatMessages,
    chatMessage,
    setChatMessage,
    onSend
}) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <>
            <div className={`absolute bottom-4 right-4 w-80 pointer-events-auto transition-all duration-300 ${isChatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="w-5 h-5 text-gray-300" />
                            <span className="font-semibold text-white">Chat Global</span>
                        </div>
                        <button onClick={toggleChat} className="text-gray-400 hover:text-white transition-colors duration-200">
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-64 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg) => (
                            <div key={msg.id} className="flex items-start space-x-3">
                                <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full object-cover grayscale" />
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

                    {/* Input */}
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
                                onClick={onSend}
                                disabled={!chatMessage.trim()}
                                className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {!isChatOpen && (
                <button onClick={toggleChat} className="absolute bottom-4 right-4 p-4 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors pointer-events-auto border border-gray-600/50">
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}
        </>
    );
};
