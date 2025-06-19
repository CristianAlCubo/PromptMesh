import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AvatarSelection from './components/AvatarSelection';
import AvatarGeneration from './components/AvatarGeneration';
import Avatar3DPreview from './components/Avatar3DPreview';
import VirtualWorld from './components/VirtualWorld';
import { useGenerateMesh } from './hooks/img2mesh';

export type AppState = 'landing' | 'avatar-selection' | 'avatar-generation' | 'avatar-preview' | 'virtual-world';

export interface Avatar {
  id: string;
  name: string;
  image: string;
  type: 'predefined' | 'custom';
  description?: string;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [customAvatars, setCustomAvatars] = useState<Avatar[]>([]);
  const [generatedAvatarData, setGeneratedAvatarData] = useState<{
    description: string;
    selectedImage: string;
  } | null>(null);
  const { mutate: generateMesh, data: meshUrl, isPending: meshIsLoading } = useGenerateMesh();

  const handleStartClick = () => {
    setCurrentState('avatar-selection');
  };

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setCurrentState('virtual-world');
  };

  const handleCreateCustomAvatar = () => {
    setCurrentState('avatar-generation');
  };

  const handleAvatarGenerated = async (description: string, selectedImage: string) => {
    setGeneratedAvatarData({ description, selectedImage });
    setCurrentState('avatar-preview');
    const imgUrl = selectedImage;

    // Generar blob de la imagen
    const imgBlob = await fetch(imgUrl).then(res => res.blob());
    generateMesh(imgBlob);
  };

  const handleAvatarConfirmed = () => {
    if (generatedAvatarData) {
      const newAvatar: Avatar = {
        id: `custom-${Date.now()}`,
        name: 'Mi Avatar Personalizado',
        image: generatedAvatarData.selectedImage,
        type: 'custom',
        description: generatedAvatarData.description
      };
      setCustomAvatars(prev => [...prev, newAvatar]);
      setCurrentState('avatar-selection');
    }
  };

  const handleBackToSelection = () => {
    setCurrentState('avatar-selection');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
    setSelectedAvatar(null);
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'landing':
        return <LandingPage onStartClick={handleStartClick} />;
      case 'avatar-selection':
        return (
          <AvatarSelection
            onAvatarSelect={handleAvatarSelect}
            onCreateCustomAvatar={handleCreateCustomAvatar}
            customAvatars={customAvatars}
            onBackToLanding={handleBackToLanding}
          />
        );
      case 'avatar-generation':
        return (
          <AvatarGeneration
            onAvatarGenerated={handleAvatarGenerated}
            onBack={handleBackToSelection}
          />
        );
      case 'avatar-preview':
        return (
          <Avatar3DPreview
            avatarData={generatedAvatarData}
            onConfirm={handleAvatarConfirmed}
            onBack={() => setCurrentState('avatar-generation')}
            meshUrl={meshUrl || null}
            meshIsLoading={meshIsLoading}
          />
        );
      case 'virtual-world':
        return (
          <VirtualWorld
            selectedAvatar={selectedAvatar}
            onBack={handleBackToSelection}
          />
        );
      default:
        return <LandingPage onStartClick={handleStartClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderCurrentState()}
    </div>
  );
}

export default App;