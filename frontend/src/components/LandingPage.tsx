import React from 'react';
import { Sparkles, Users, Zap } from 'lucide-react';

interface LandingPageProps {
  onStartClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-900 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight mt-12">
            Crea tu
            <span className="bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
              {' '}Avatar{' '}
            </span>
            Perfecto
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Diseña avatares únicos con inteligencia artificial y sumérgete en un mundo virtual 
            donde podrás socializar y vivir experiencias extraordinarias.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-gray-200" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">IA Avanzada</h3>
            <p className="text-gray-400 text-sm">
              Describe tu avatar ideal y nuestra IA lo creará en segundos
            </p>
          </div>

          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Users className="w-6 h-6 text-gray-200" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Mundo Social</h3>
            <p className="text-gray-400 text-sm">
              Conecta con personas de todo el mundo en espacios virtuales únicos
            </p>
          </div>

          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-gray-200" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Experiencia Inmersiva</h3>
            <p className="text-gray-400 text-sm">
              Vive aventuras únicas en un mundo 3D completamente interactivo
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStartClick}
          className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-700 rounded-full hover:from-gray-700 hover:to-gray-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-gray-900/50 border border-gray-600"
        >
          <span className="relative z-10">Empezar Ahora</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
        </button>

        <p className="text-gray-500 text-sm mt-6">
          ✨ Sin registro necesario • 🎮 Gratis para siempre
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
