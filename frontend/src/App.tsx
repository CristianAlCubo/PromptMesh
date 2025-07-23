import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AvatarSelection from './components/AvatarSelection';
import AvatarGeneration from './components/AvatarGeneration';
import Avatar3DPreview from './components/Avatar3DPreview';
import VirtualWorld from './components/VirtualWorld';
import { CustomAvatarUploader } from './components/CustomAvatarUploader';
import "./global.css"


export type Avatar = {
  id: string;
  name: string;
  image: string;
  type: 'predefined' | 'custom' | 'custom-glb';
  rotationY?: number;
  glb?: Blob;
  modelUrl?: string;
};

export type AvatarGenerationData = {
  description: string;
  selectedImage: string;
};

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [customAvatars, setCustomAvatars] = useState<Avatar[]>([]);
  const [avatarGenData, setAvatarGenData] = useState<AvatarGenerationData | null>(null);
  const [meshUrl, setMeshUrl] = useState<string | null>(null);
  const [meshIsLoading, setMeshIsLoading] = useState(false);

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setCurrentView('virtualWorld');
  };

  const handleCreateCustomAvatar = () => {
    setCurrentView('avatarGeneration');
  };

  const handleBackToSelection = () => {
    setAvatarGenData(null);
    setMeshUrl(null);
    setCurrentView('avatarSelection');
  };

  const handleGenerate3D = (data: AvatarGenerationData) => {
    setAvatarGenData(data);
    setMeshIsLoading(true);

    setTimeout(() => {
      setMeshUrl('/models/Walking.glb');
      setMeshIsLoading(false);
    }, 2000);

    setCurrentView('avatar3DPreview');
  };

  const handleConfirmAvatar = () => {
    if (avatarGenData && meshUrl) {
      const newAvatar: Avatar = {
        id: `custom-${Date.now()}`,
        name: avatarGenData.description.substring(0, 15),
        image: avatarGenData.selectedImage,
        type: 'custom',
        modelUrl: meshUrl,
      };
      setCustomAvatars([...customAvatars, newAvatar]);
      handleBackToSelection();
    }
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleEnterApp = () => {
    setCurrentView('avatarSelection');
  };

  const handleUploadCustomAvatar = () => {
    setCurrentView('customAvatarUploader');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onEnter={handleEnterApp} />;
      case 'avatarSelection':
        return (
          <AvatarSelection
            onAvatarSelect={handleAvatarSelect}
            onCreateCustomAvatar={handleCreateCustomAvatar}
            onUploadCustomAvatar={handleUploadCustomAvatar}
            customAvatars={customAvatars}
            onBackToLanding={handleBackToLanding}
          />
        );
      case 'avatarGeneration':
        return <AvatarGeneration onGenerate3D={handleGenerate3D} onBack={handleBackToSelection} />;
      case 'avatar3DPreview':
        return (
          <Avatar3DPreview
            avatarData={avatarGenData}
            onConfirm={handleConfirmAvatar}
            onBack={handleBackToSelection}
            meshUrl={meshUrl}
            meshIsLoading={meshIsLoading}
          />
        );
      case 'virtualWorld':
        return <VirtualWorld selectedAvatar={selectedAvatar} onBack={handleBackToSelection} />;
      case 'customAvatarUploader':
        return <CustomAvatarUploader onBack={handleBackToSelection} />;
      default:
        return <LandingPage onEnter={handleEnterApp} />;
    }
  };

  return <div className="bg-black">{renderContent()}</div>;
}

export default App;