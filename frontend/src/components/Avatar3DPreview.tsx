import React from 'react';
import { ArrowLeft, Check, Loader2, RotateCw } from 'lucide-react';
import { GLBViewer } from './GLBViewer';

interface Avatar3DPreviewProps {
  avatarData: { description: string; selectedImage: string } | null;
  onConfirm: () => void;
  onBack: () => void;
  meshUrl: string | null;
  meshIsLoading: boolean;
}

const Avatar3DPreview: React.FC<Avatar3DPreviewProps> = ({ avatarData, onConfirm, onBack, meshUrl, meshIsLoading }) => {
  if (!avatarData) return null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-80"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-gradient-to-b from-black to-transparent">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <h1 className="text-2xl font-bold text-white">Vista Previa 3D</h1>
        <div className="w-20"></div>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto h-full">
          <div className="flex flex-col lg:flex-row h-full gap-6">
            {/* 3D Preview - Ahora más grande y prominente */}
            <div className="lg:w-2/3 bg-gray-900/30 backdrop-blur-lg rounded-3xl border border-gray-800/50 flex flex-col overflow-hidden">
              <div className="px-6 py-4 bg-black/40 border-b border-gray-800/50">
                <h2 className="text-xl font-bold text-white">Tu Avatar 3D</h2>
              </div>

              <div className="flex-1 relative">
                {meshIsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400">Generando modelo 3D...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    {meshUrl && <GLBViewer url={meshUrl} />}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar con información y controles */}
            <div className="lg:w-1/3 space-y-6 flex flex-col">
              <div className="bg-gray-900/30 backdrop-blur-lg rounded-3xl border border-gray-800/50 overflow-hidden">
                <div className="px-6 py-4 bg-black/40 border-b border-gray-800/50">
                  <h3 className="text-lg font-semibold text-white">Imagen de referencia</h3>
                </div>
                <div className="p-6">
                  <div className="rounded-xl overflow-hidden shadow-xl">
                    <img
                      src={avatarData.selectedImage}
                      alt="Imagen de referencia"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/30 backdrop-blur-lg rounded-3xl border border-gray-800/50 overflow-hidden">
                <div className="px-6 py-4 bg-black/40 border-b border-gray-800/50">
                  <h3 className="text-lg font-semibold text-white">Descripción</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 leading-relaxed">{avatarData.description}</p>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={onBack}
                  className="w-full px-6 py-4 bg-gray-800/70 hover:bg-gray-700/70 text-white font-medium rounded-xl border border-gray-700/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-5 h-5" />
                  <span>Regenerar Avatar</span>
                </button>

                <button
                  onClick={onConfirm}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                >
                  <Check className="w-5 h-5" />
                  <span>Confirmar Avatar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar3DPreview;