import React from 'react';
import { ArrowLeft, Users, Settings } from 'lucide-react';

interface Props {
    onBack: () => void;
    onlineUsers: number;
}

const TopBar: React.FC<Props> = ({ onBack, onlineUsers }) => (
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
);

export default TopBar;