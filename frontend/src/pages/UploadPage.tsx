import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { Button, FileUpload, useError, PageTransition, containerVariants, itemVariants } from '../components/UI';
import apiService from '../api/apiService';

interface UploadedFile {
  file: File;
  angle: string;
  preview: string;
  id?: string;
}

const UploadPage: FC = () => {
  const navigate = useNavigate();
  const { showError } = useError();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [otherPhotos, setOtherPhotos] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (angle: string, files: File[]) => {
    if (files.length > 0) {
      if (angle === 'other_photos') {
        // Handle multiple files for other photos
        const newPhotos = files.map(file => ({
          file,
          angle: 'other_photos',
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        
        setOtherPhotos(prev => [...prev, ...newPhotos]);
      } else {
        // Handle single file for main angles
        const file = files[0];
        const preview = URL.createObjectURL(file);
        
        setUploadedFiles((prev) => ({
          ...prev,
          [angle]: { file, angle, preview },
        }));
      }
    }
  };

  const handleRemoveFile = (angle: string, id?: string) => {
    if (angle === 'other_photos' && id) {
      // Remove specific other photo by id
      const photoToRemove = otherPhotos.find(photo => photo.id === id);
      if (photoToRemove?.preview) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      
      setOtherPhotos(prev => prev.filter(photo => photo.id !== id));
    } else if (uploadedFiles[angle]?.preview) {
      // Remove main angle photo
      URL.revokeObjectURL(uploadedFiles[angle]!.preview);
      
      setUploadedFiles((prev) => ({
        ...prev,
        [angle]: null,
      }));
    }
  };
  const handleAnalyzePhotos = async () => {
    // Check if at least one photo is uploaded
    const hasAtLeastOnePhoto = Object.values(uploadedFiles).some((file) => file !== null) || otherPhotos.length > 0;
    if (!hasAtLeastOnePhoto) {
      showError('Пожалуйста, загрузите хотя бы одну фотографию автомобиля');
      return;
    }

    try {
      setIsUploading(true);
      
      // Prepare files for upload
      const mainFiles = Object.entries(uploadedFiles)
        .filter(([_, file]) => file !== null)
        .map(([_, file]) => file!.file);
      
      const otherFiles = otherPhotos.map(photo => photo.file);
      
      const filesToUpload = [...mainFiles, ...otherFiles];
      
      // Upload photos with progress tracking
      const response = await apiService.uploadPhotos(filesToUpload, (event) => {
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      });

      // Navigate to analysis page with session ID
      navigate(`/analyzing?sessionId=${response.data.sessionId}`);
    } catch (error) {
      console.error('Error uploading photos:', error);
      showError('Произошла ошибка при загрузке фотографий. Пожалуйста, попробуйте снова.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-2">
              Загрузка фото автомобиля
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-600 mb-6">
              Добавьте фото с разных ракурсов: спереди, сзади, сбоку и крупным планом поврежденных зон.
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg p-8 shadow-sm text-center"
              >
                <h2 className="text-xl font-semibold mb-4">Загружаем фотографии...</h2>
                <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "easeInOut" }}
                    className="bg-primary-500 h-6 rounded-full flex items-center justify-end"
                  >
                    <span className="text-xs text-white px-2">{uploadProgress}%</span>
                  </motion.div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Пожалуйста, не закрывайте страницу</p>
              </motion.div>
            ) : (
              <motion.div
                key="upload-form"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div>
                  <h2 className="text-lg font-medium mb-3">Вид спереди</h2>
                  {uploadedFiles.front ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={uploadedFiles.front.preview}
                        alt="Фото спереди"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('front')}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (                    <FileUpload
                      onFilesAccepted={(files: File[]) => handleFileChange('front', files)}
                      maxFiles={1}
                      label="Перетащите сюда фото"
                      hint="или"
                      showCamera={true}
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-3">Вид сзади</h2>
                  {uploadedFiles.back ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={uploadedFiles.back.preview}
                        alt="Фото сзади"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('back')}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (                    <FileUpload
                      onFilesAccepted={(files: File[]) => handleFileChange('back', files)}
                      maxFiles={1}
                      label="Перетащите сюда фото"
                      hint="или"
                      showCamera={true}
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-3">Вид слева</h2>
                  {uploadedFiles.left ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={uploadedFiles.left.preview}
                        alt="Фото слева"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('left')}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (                    <FileUpload
                      onFilesAccepted={(files: File[]) => handleFileChange('left', files)}
                      maxFiles={1}
                      label="Перетащите сюда фото"
                      hint="или"
                      showCamera={true}
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-3">Вид справа</h2>
                  {uploadedFiles.right ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={uploadedFiles.right.preview}
                        alt="Фото справа"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('right')}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (                    <FileUpload
                      onFilesAccepted={(files: File[]) => handleFileChange('right', files)}
                      maxFiles={1}
                      label="Перетащите сюда фото"
                      hint="или"
                      showCamera={true}
                    />
                  )}
                </div>                <div className="md:col-span-2">
                  <h2 className="text-lg font-medium mb-3">Другие фото</h2>
                  
                  {otherPhotos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {otherPhotos.map((photo) => (
                        <div key={photo.id} className="relative rounded-lg overflow-hidden border border-gray-300">
                          <img
                            src={photo.preview}
                            alt="Дополнительное фото"
                            className="w-full h-48 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile('other_photos', photo.id)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                    <FileUpload
                    onFilesAccepted={(files: File[]) => handleFileChange('other_photos', files)}
                    maxFiles={5}
                    label="Перетащите сюда фото"
                    hint="или"
                    showCamera={true}
                  />
                </div>

                <motion.div variants={itemVariants} className="md:col-span-2 mt-4 flex justify-center">
                  <Button
                    size="large"
                    onClick={handleAnalyzePhotos}
                    className="px-10"
                  >
                    Анализировать фото
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default UploadPage;
