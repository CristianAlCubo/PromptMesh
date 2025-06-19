import React from 'react';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';
import type { Avatar } from '../App';

interface AvatarSelectionProps {
  onAvatarSelect: (avatar: Avatar) => void;
  onCreateCustomAvatar: () => void;
  customAvatars: Avatar[];
  onBackToLanding: () => void;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
  onAvatarSelect,
  onCreateCustomAvatar,
  customAvatars,
  onBackToLanding
}) => {
  const predefinedAvatars: Avatar[] = [
    {
      id: 'preset-1',
      name: 'Esqueleto',
      image: '/esqueleto.jpeg',
      type: 'predefined'
    },
    {
      id: 'preset-2',
      name: 'Gato Soldado',
      image: '/gato.jpeg',
      type: 'predefined'
    },
    {
      id: 'preset-3',
      name: 'Marciano',
      image: '/Marciano.jpeg',
      type: 'predefined'
    },
    {
      id: 'preset-4',
      name: 'Ogro',
      image: '/Ogro.jpeg',
      type: 'predefined'
    },
    {
      id: 'preset-5',
      name: 'Ogro con Sombrero',
      image: '/ogrosombrero.jpeg',
      type: 'predefined'
    },
    {
      id: 'preset-6',
      name: 'Orco',
      image: '/orco.jpeg',
      type: 'predefined'
    }
  ];

  const allAvatars = [...predefinedAvatars, ...customAvatars];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold text-white">Selecciona tu Avatar</h1>
        <div className="w-20"></div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Custom Avatar Creation Card */}
          <div className="mb-8">
            <button
              onClick={onCreateCustomAvatar}
              className="group relative w-full bg-gray-900/30 backdrop-blur-sm border-2 border-dashed border-gray-700/50 rounded-3xl p-8 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5 text-gray-300" />
                    <span>Generar Mi Propio Avatar</span>
                  </h3>
                  <p className="text-gray-400">
                    Describe tu avatar ideal y nuestra IA lo creará para ti
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allAvatars.map((avatar) => (
              <div key={avatar.id} className="group cursor-pointer" onClick={() => onAvatarSelect(avatar)}>
                <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 hover:scale-105">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4">
                    <img
                      src={avatar.image}
                      alt={avatar.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 grayscale hover:grayscale-0"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-semibold mb-1">{avatar.name}</h3>
                    {avatar.type === 'custom' && (
                      <div className="flex items-center justify-center space-x-1">
                        <Sparkles className="w-3 h-3 text-gray-300" />
                        <span className="text-xs text-gray-300">Personalizado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {customAvatars.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500">
                ¿No encuentras el avatar perfecto?
                <button
                  onClick={onCreateCustomAvatar}
                  className="text-gray-300 hover:text-white ml-1 underline"
                >
                  Crea uno personalizado
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarSelection;