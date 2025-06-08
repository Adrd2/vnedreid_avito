import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { PhotoUploadWidget } from '../components/PhotoUpload';
import { useAnalysisProcess } from '../hooks/useAnalysisProcess';
import type { PhotoPosition } from '../types/api.types';

// Import wireframe images
import FrontWireframe from '/assets/wireframes/Front.png';
import BackWireframe from '/assets/wireframes/Back.png';
import LeftWireframe from '/assets/wireframes/Left.png';
import RightWireframe from '/assets/wireframes/Right.png';

interface PhotoUploadZone {
  id: 'front' | 'rear' | 'left' | 'right';
  title: string;
  wireframe: string;
}

const uploadZones: PhotoUploadZone[] = [
  { id: 'front', title: 'Вид спереди', wireframe: FrontWireframe },
  { id: 'rear', title: 'Вид сзади', wireframe: BackWireframe },
  { id: 'left', title: 'Вид слева', wireframe: LeftWireframe },
  { id: 'right', title: 'Вид справа', wireframe: RightWireframe }
];

const PhotoUploadPage: React.FC = () => {
  const { analyseId } = useParams<{ analyseId: string }>();
  const navigate = useNavigate();
  const { uploadPhotos, isLoading, error } = useAnalysisProcess();
  
  const [photos, setPhotos] = useState<Record<'front' | 'rear' | 'left' | 'right', File | null>>({
    front: null,
    rear: null,
    left: null,
    right: null
  });
  
  const [previews, setPreviews] = useState<Record<'front' | 'rear' | 'left' | 'right', string>>({
    front: '',
    rear: '',
    left: '',
    right: ''
  });

  const handleFileSelect = (position: 'front' | 'rear' | 'left' | 'right', file: File) => {
    // Update photos state
    setPhotos(prev => ({ ...prev, [position]: file }));

    // Create and set preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [position]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (position: 'front' | 'rear' | 'left' | 'right') => {
    setPhotos(prev => ({ ...prev, [position]: null }));
    setPreviews(prev => ({ ...prev, [position]: '' }));
  };
  const handleAnalyze = async () => {
    const uploadedPhotos = Object.entries(photos)
      .filter(([_, file]) => file !== null)
      .map(([_, file]) => file as File);
    
    const positions = Object.entries(photos)
      .filter(([_, file]) => file !== null)
      .map(([pos, _]) => pos as PhotoPosition);

    if (uploadedPhotos.length < 4) {
      alert('Пожалуйста, загрузите все 4 фото автомобиля');
      return;
    }

    const result = await uploadPhotos(uploadedPhotos, positions);
    if (result && analyseId) {
      navigate(`/analyzing/${analyseId}`);
    }
  };

  // Check if all 4 photos are uploaded
  const allPhotosUploaded = Object.values(photos).every(photo => photo !== null);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Загрузка фото автомобиля</h1>
          <p className="text-gray-600 text-lg">
            Поддерживаются изображения (.jpg, .png, .heif)<br />
            Максимальный размер файла: 10 МБ
          </p>
        </motion.div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {uploadZones.map((zone) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PhotoUploadWidget
                title={zone.title}
                wireframe={zone.wireframe}
                preview={previews[zone.id]}
                onFileSelect={(file) => handleFileSelect(zone.id, file)}
                onDelete={() => handleDeletePhoto(zone.id)}
              />
            </motion.div>
          ))}
        </div>
          <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >          <button
            onClick={handleAnalyze}
            disabled={isLoading || !allPhotosUploaded}
            className="bg-blue-500 text-white py-3 px-8 rounded-lg flex items-center justify-center hover:bg-blue-600 focus:outline-none disabled:opacity-50 font-medium text-lg"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.523 19 3.732 16.057 2.458 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
            Анализировать фото
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PhotoUploadPage;
