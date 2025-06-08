import React, { useRef, useState } from 'react';

interface PhotoUploadWidgetProps {
  id: string;
  title: string;
  wireframe: string;
  preview: string;
  onFileSelect: (file: File) => void;
  onDelete: () => void;
}

const PhotoUploadWidget: React.FC<PhotoUploadWidgetProps> = ({
  id,
  title,
  wireframe,
  preview,
  onFileSelect,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      // Check if file type is supported
      if (file.type.match(/^image\/(jpeg|jpg|png|heif)$/)) {
        onFileSelect(file);
      } else {
        alert('Поддерживаются только файлы .jpg, .png, .heif');
      }
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 relative overflow-hidden transition-colors ${
        isDragOver 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-blue-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      
      <div 
        className={`h-64 cursor-pointer rounded-lg transition-colors overflow-hidden ${
          preview ? '' : 'flex flex-col items-center justify-center'
        }`}
        onClick={handleFileInput}
      >
        {preview ? (
          <img 
            src={preview} 
            alt={`${title} фото`}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <>
            <img 
              src={wireframe} 
              alt={`${title} wireframe`}
              className="max-h-32 max-w-32 object-contain opacity-40 mb-2"
            />
            <p className="text-center text-gray-600 font-medium mb-2">Перетащите сюда фото</p>
            <p className="text-center text-gray-500 mb-2">или</p>
            <button
              type="button"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Выберите файл
            </button>
          </>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.heif"
        onChange={handleFileChange}
      />
      
      {/* Delete button */}
      {preview && (
        <button
          type="button"
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PhotoUploadWidget;
