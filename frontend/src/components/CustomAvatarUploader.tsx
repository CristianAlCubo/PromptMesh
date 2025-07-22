import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, Upload, RotateCw, Trash2 } from 'lucide-react';
import { useCustomAvatar } from '../hooks/useCustomAvatar';
import { GLBViewer } from './GLBViewer';

interface Props {
    onBack: () => void;
}

export const CustomAvatarUploader: React.FC<Props> = ({ onBack }) => {
    const { avatar, saveAvatar, deleteAvatar, isLoading } = useCustomAvatar();
    const [file, setFile] = useState<File | null>(null);
    const [rotationY, setRotationY] = useState(avatar?.rotationY || 0);

    const previewUrl = useMemo(() => {
        if (file) return URL.createObjectURL(file);
        if (avatar) return URL.createObjectURL(avatar.glb);
        return null;
    }, [file, avatar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (file) {
            await saveAvatar(file, rotationY);
            onBack();
        }
    };

    const handleDelete = async () => {
        await deleteAvatar();
        setFile(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-black text-white p-6">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white">
                    <ArrowLeft /> <span>Volver</span>
                </button>
                <h1 className="text-2xl font-bold">Tu Avatar Personalizado</h1>
                <div className="w-20"></div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-900/50 rounded-3xl border border-gray-800/50 flex items-center justify-center">
                    {isLoading ? (
                        <p>Cargando avatar...</p>
                    ) : previewUrl ? (
                        <GLBViewer url={previewUrl} rotationY={rotationY} />
                    ) : (
                        <div className="text-center">
                            <Upload className="w-16 h-16 mx-auto text-gray-600" />
                            <p className="mt-4 text-gray-400">Sube un archivo .glb para previsualizarlo</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800/50 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Controles</h2>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="file-upload" className="w-full px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700/50 transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer">
                                    <Upload className="w-5 h-5" />
                                    <span>{file ? 'Cambiar archivo' : 'Seleccionar archivo .glb'}</span>
                                </label>
                                <input id="file-upload" type="file" accept=".glb" className="hidden" onChange={handleFileChange} />
                            </div>

                            {previewUrl && (
                                <>
                                    <div>
                                        <label htmlFor="rotation-slider" className="flex items-center gap-2 mb-2 text-gray-300">
                                            <RotateCw className="w-5 h-5" /> Rotación Vertical
                                        </label>
                                        <input
                                            id="rotation-slider"
                                            type="range"
                                            min="0"
                                            max={Math.PI * 2}
                                            step="0.01"
                                            value={rotationY}
                                            onChange={(e) => setRotationY(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    {avatar && (
                                        <button onClick={handleDelete} className="w-full px-6 py-3 bg-red-800/70 hover:bg-red-700/70 text-white font-medium rounded-xl border border-red-700/30 transition-colors duration-300 flex items-center justify-center gap-2">
                                            <Trash2 className="w-5 h-5" />
                                            <span>Eliminar Avatar Guardado</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <button onClick={handleSave} disabled={!file} className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Check className="w-5 h-5" />
                        <span>Guardar Avatar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}; 