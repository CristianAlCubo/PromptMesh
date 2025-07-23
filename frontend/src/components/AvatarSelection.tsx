import React, { useMemo, useState, useEffect, useCallback } from 'react'; // Importa useCallback
import { ArrowLeft, Sparkles, UserCheck } from 'lucide-react';
import type { Avatar } from '../App';
import { useCustomAvatar } from '../hooks/useCustomAvatar';

interface AvatarSelectionProps {
  onAvatarSelect: (avatar: Avatar) => void;
  onCreateCustomAvatar: () => void;
  customAvatars: Avatar[];
  onBackToLanding: () => void;
  onUploadCustomAvatar: () => void;
}

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
  onAvatarSelect,
  onCreateCustomAvatar,
  customAvatars,
  onBackToLanding,
  onUploadCustomAvatar
}) => {
  const { avatar: customAvatar, isLoading } = useCustomAvatar();
  const [hasEntered, setHasEntered] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // Nuevo estado para controlar la animación de salida

  // Efecto para la animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Función para manejar el clic en el botón "Volver"
  const handleBack = useCallback(() => {
    setIsExiting(true); // Activa la animación de salida
    // El tiempo debe ser igual o un poco mayor que la duración de la transición de salida
    setTimeout(() => {
      onBackToLanding(); // Llama a la función para volver a la LandingPage
    }, 700); // Coincide con la duración de la transición CSS (700ms)
  }, [onBackToLanding]);

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

  const customAvatarForSelection = useMemo((): Avatar[] => {
    if (customAvatar) {
      return [{
        id: 'custom-glb',
        name: 'Mi Avatar GLB',
        image: '/vite.svg',
        type: 'custom-glb',
        rotationY: customAvatar.rotationY,
        glb: customAvatar.glb,
      }];
    }
    return [];
  }, [customAvatar]);

  const allAvatars = [...predefinedAvatars, ...customAvatars, ...customAvatarForSelection];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

      {/* Contenedor principal del contenido con animación de entrada y salida */}
      <div
        className={`flex-1 relative z-10 px-6 pb-6 transition-all duration-700 ease-out ${
          hasEntered && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <button
            onClick={handleBack} // Usar la nueva función handleBack
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <h1 className="text-2xl font-bold text-white">Selecciona tu Avatar</h1>
          <div className="w-20"></div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Custom Avatar Generation Card */}
            <button
              onClick={onCreateCustomAvatar}
              className="group relative w-full bg-gray-900/30 backdrop-blur-sm border-2 border-dashed border-gray-700/50 rounded-3xl p-8 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Generar Avatar con IA
                  </h3>
                  <p className="text-gray-400">
                    Describe tu avatar y nuestra IA lo creará para ti
                  </p>
                </div>
              </div>
            </button>

            {/* Custom GLB Uploader Card */}
            <button
              onClick={onUploadCustomAvatar}
              className="group relative w-full bg-gray-900/30 backdrop-blur-sm border-2 border-dashed border-gray-700/50 rounded-3xl p-8 hover:border-gray-600/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Subir Avatar .glb
                  </h3>
                  <p className="text-gray-400">
                    Importa tu propio modelo 3D personalizado
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Avatar Grid */}
          <h2 className="text-2xl font-semibold text-white mb-4">O selecciona uno predefinido</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading && <p className="text-gray-400 col-span-full text-center">Cargando avatar personalizado...</p>}
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
                        <span className="text-xs text-gray-300">Personalizado IA</span>
                      </div>
                    )}
                    {avatar.type === 'custom-glb' && (
                      <div className="flex items-center justify-center space-x-1">
                        <UserCheck className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-400">Personalizado GLB</span>
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