import React, { useEffect, useState } from 'react';
import { ArrowLeft, Wand2, Loader2, Check } from 'lucide-react';
import { useGenerateImages } from '../hooks/txt2img';

interface AvatarGenerationProps {
  onAvatarGenerated: (description: string, selectedImage: string) => void;
  onBack: () => void;
}

const AvatarGeneration: React.FC<AvatarGenerationProps> = ({ onAvatarGenerated, onBack }) => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { mutate, data } = useGenerateImages();

  const generateAvatars = async () => {
    setIsGenerating(true);
    mutate(description);
  };

  const handleGenerate = () => {
    if (description.trim()) {
      generateAvatars();
    }
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleGenerateAvatar3D = async () => {
    if (selectedImageIndex !== null) {
      onAvatarGenerated(description, generatedImages[selectedImageIndex]);
    }
  };

  useEffect(() => {
    if (data) {
      setGeneratedImages(data);
      setIsGenerating(false);
    }
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold text-white">Crear Avatar con IA</h1>
        <div className="w-20"></div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Description Input */}
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Describe tu Avatar Ideal</h2>
              <p className="text-gray-400">
                Utiliza lenguaje natural para describir cómo quieres que sea tu avatar
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ejemplo: Quiero un avatar alto, con cabello largo y rizado de color castaño, ojos verdes, piel morena, con una sonrisa amigable y vestido de forma casual pero elegante..."
                className="w-full h-32 bg-gray-800/50 border border-gray-700/50 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 resize-none"
                maxLength={500}
              />

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  {description.length}/500 caracteres
                </span>

                <button
                  onClick={handleGenerate}
                  disabled={!description.trim() || isGenerating}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generar Avatares</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Images */}
          {isGenerating && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                <span className="text-xl font-semibold text-white">Generando tu avatar...</span>
              </div>
              <p className="text-gray-400">
                La IA está creando 4 variaciones basadas en tu descripción
              </p>
            </div>
          )}

          {generatedImages.length > 0 && !isGenerating && (
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Selecciona tu avatar favorito
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {generatedImages.map((image, index) => (
                  <div key={index} className="relative group cursor-pointer" onClick={() => handleImageSelect(index)}>
                    <div className={`aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 ${selectedImageIndex === index
                      ? 'border-gray-500 scale-105'
                      : 'border-gray-700/50 hover:border-gray-600/50'
                      }`}>
                      <img
                        src={image}
                        alt={`Avatar ${index + 1}`}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    </div>

                    {selectedImageIndex === index && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedImageIndex !== null && (
                <div className="text-center">
                  <button
                    onClick={handleGenerateAvatar3D}
                    className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold rounded-full hover:from-gray-600 hover:to-gray-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Generar Avatar 3D
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AvatarGeneration;