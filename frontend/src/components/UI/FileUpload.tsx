import { type FC, useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  label?: string;
  hint?: string;
  uploadProgress?: number;
  showProgress?: boolean;
  showCamera?: boolean;
}

const FileUpload: FC<FileUploadProps> = ({
  onFilesAccepted,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
  },
  maxFiles = 5,
  label = 'Перетащите сюда фото',
  hint = 'или',
  uploadProgress = 0,
  showProgress = false,
  showCamera = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCameraView, setShowCameraView] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Clean up camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    maxFiles,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setShowCameraView(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Не удалось получить доступ к камере. Пожалуйста, проверьте настройки разрешений.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraView(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onFilesAccepted([file]);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {showCameraView ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative bg-black rounded-md overflow-hidden"
          >
            <video 
              ref={videoRef}
              className="w-full h-64 object-cover" 
              autoPlay 
              playsInline
              muted
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {/* Visual wireframe overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-white border-opacity-60 rounded-lg w-4/5 h-48 flex items-center justify-center">
                <div className="text-white text-opacity-80 text-sm font-medium">
                  Расположите автомобиль в рамке
                </div>
              </div>
            </div>
            
            {/* Camera controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4 bg-black bg-opacity-50">
              <button
                type="button"
                onClick={capturePhoto}
                className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Сделать снимок"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <circle cx="12" cy="12" r="8" fill="currentColor" />
                </svg>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="p-3 bg-red-500 rounded-full shadow-md hover:bg-red-600 transition-colors"
                aria-label="Закрыть камеру"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors"
              style={{
                borderColor: isDragging ? '#0066ff' : '#e5e7eb',
                backgroundColor: isDragging ? 'rgba(0, 102, 255, 0.05)' : 'transparent',
              }}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              
              <div className="flex flex-col items-center justify-center text-center">
                <svg
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-1 text-sm text-gray-500">
                  {isDragActive ? 'Перетащите файл сюда...' : label}
                </p>
                <p className="text-xs text-gray-500">{hint}</p>
              </div>
              
              <div className="flex gap-3 mt-4">
                {/* File selection button with proper ref handling */}
                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  Выберите файлы
                </button>
                
                {/* Camera button */}
                {showCamera && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary-500 border border-primary-500 rounded-md text-sm font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center gap-1 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Использовать камеру
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ ease: "easeInOut" }}
                className="bg-primary-500 h-2.5 rounded-full flex items-center justify-end overflow-hidden"
              >
                {uploadProgress > 15 && (
                  <span className="text-xs text-white px-2">
                    {uploadProgress}%
                  </span>
                )}
              </motion.div>
            </div>
            {uploadProgress <= 15 && (
              <p className="text-xs text-gray-500 mt-1 text-right">
                {uploadProgress}%
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
