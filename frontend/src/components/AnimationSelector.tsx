import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AnimationItem {
  name: string;
  naturalName: string;
}

interface AnimationSelectorProps {
  animationNames: AnimationItem[];
  current: string;
  setCurrent: (name: string) => void;
}

const toNaturalName = (name: string): string => {
  const lowerName = name.toLowerCase();
  
  const mapping: { [key: string]: string[] } = {
    'Caminar': ['walk', 'walking'],
    'Correr': ['run', 'running'],
    'Saltar': ['jump', 'jumping'],
    'Reposo': ['idle', 't-pose', 'tpose', 'static', 'rest'],
    'Bailar': ['dance', 'dancing', 'samba'],
    'Atrás': ['backward'],
    'Izquierda': ['left'],
    'Derecha': ['right'],
  };

  for (const natural in mapping) {
    if (mapping[natural].some(keyword => lowerName.includes(keyword))) {
      return natural;
    }
  }

  // If no mapping found, clean up the name itself.
  let cleanName = name.split('|').pop() || name; 
  cleanName = cleanName.replace(/_/g, ' ');
  cleanName = cleanName.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  if (cleanName.toLowerCase() !== name.toLowerCase() && cleanName.length > 1) {
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
  
  if (lowerName.includes('armature') || lowerName.includes('mixamo')) {
    return 'Animación Genérica';
  }
  
  return name;
};


export const AnimationSelector: React.FC<AnimationSelectorProps> = ({ animationNames, current, setCurrent }) => {
  return (
    <div className="absolute bottom-4 left-4 p-2 bg-gray-900/60 rounded-lg text-white max-w-xs pointer-events-auto">
      <h3 className="text-sm font-bold mb-2 px-2">Animaciones</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {animationNames.length > 0 ? (
            animationNames.map(({ name, naturalName }) => (
              <motion.button
                key={name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCurrent(name)}
                className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                  current === name ? 'bg-blue-600' : 'hover:bg-gray-700/80'
                }`}
              >
                {naturalName}
              </motion.button>
            ))
          ) : (
            <div className="px-3 py-1.5 text-sm text-gray-400">
              Animaciones no disponibles
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { toNaturalName };

