import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { 
  CarParameters, 
  PhotoPosition,
  AnalysisResponse
} from '../types/api.types';
import { mockCarParameters } from '../data/mockData';

interface AnalysisContextType {
  analyseId: number | null;
  setAnalyseId: (id: number | null) => void;
  carParams: CarParameters | null;
  setCarParams: (params: CarParameters | null) => void;
  photos: Record<PhotoPosition, File | null>;
  setPhotos: (photos: Record<PhotoPosition, File | null>) => void;
  analysisResult: AnalysisResponse | null;
  setAnalysisResult: (result: AnalysisResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [analyseId, setAnalyseId] = useState<number | null>(null);
  const [carParams, setCarParams] = useState<CarParameters | null>(mockCarParameters);
  const [photos, setPhotos] = useState<Record<PhotoPosition, File | null>>({
    front: null,
    rear: null,
    left: null,
    right: null,
    other: null
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider
      value={{
        analyseId,
        setAnalyseId,
        carParams,
        setCarParams,
        photos,
        setPhotos,
        analysisResult,
        setAnalysisResult,
        isLoading,
        setIsLoading,
        error,
        setError
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider');
  }
  return context;
};

export default AnalysisContext;
