import React from 'react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-900 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-extrabold text-white sm:text-7xl md:text-8xl">PromptMesh</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300 sm:text-xl">
          Crea, personaliza y explora. Tu mundo, tus reglas.
        </p>
        <button
          onClick={onEnter}
          className="mt-8 rounded-full bg-gradient-to-r from-blue-900 to-indigo-900 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-900/40"
        >
          Entrar al Multiverso
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
