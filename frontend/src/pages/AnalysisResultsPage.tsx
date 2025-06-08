import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Button } from '../components/UI';
// import { CarVisualization } from '../components/Car';
import { DamageCard } from '../components/DamageCard';
import { useAnalysisProcess } from '../hooks/useAnalysisProcess';
import { mockAnalysisResponse, mockOverallAssessment } from '../data/mockData';
import type { CarPartType } from '../types/api.types';

const AnalysisResultsPage: React.FC = () => {
  const { analyseId } = useParams<{ analyseId: string }>();
  const navigate = useNavigate();
  const { getAnalysisResults, setAnalyseId, isLoading, error } = useAnalysisProcess();
  const [hoveredPart, setHoveredPart] = useState<CarPartType | string | null>(null);
  const [overall] = useState(mockOverallAssessment);
  // @ts-ignore
  const [selectedView, setSelectedView] = useState<'front' | 'rear' | 'left' | 'right' | 'top'>('top');

  // Set the analyseId on component mount
  useEffect(() => {
    if (analyseId) {
      setAnalyseId(parseInt(analyseId, 10));
    } else {
      navigate('/');
    }
  }, [analyseId]);

  // Get analysis results
  useEffect(() => {
    if (analyseId) {
      getAnalysisResults();
    }
  }, [analyseId]);

  // Listen for hash changes to change the view
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['front', 'rear', 'left', 'right', 'top'].includes(hash)) {
        setSelectedView(hash as any);
      }
    };

    // Set initial view from hash if available
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Group damaged parts by severity
  const damages = overall.car_parts || mockAnalysisResponse.car_parts;

  const goToAd = () => {
    window.location.replace("https://www.avito.ru/profile")
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Результаты анализа повреждений
        </motion.h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Car visualization */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
            {/* <CarVisualization 
              highlightedPart={hoveredPart} 
              onPartHover={setHoveredPart}
              selectedView={selectedView}
              damages={damages}
            /> */}
          </div>

          {/* Assessment and damages */}
          <div className="md:col-span-1">
            {/* System assessment */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-l font-semibold mb-2 text-left">Оценка системы</h2>
              
              <div className={`flex flex-row border-2 rounded-lg p-4 ${overall.quality < 3 ? 'border-red-200' : 'border-green-200'}`}>
                {overall.quality < 3 ? (
                  <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                )}
                <div className="flex flex-col mb-2">
                  <span className={`font-medium text-left ${overall.quality < 3 ? 'text-red-500' : 'text-green-500'}`}>{overall.quality >= 3 ? 'Повреждения лёгкие' : 'Повреждения серьезные'}</span>
                  <p className={`text-sm text-left ${overall.quality < 3 ? 'text-red-500' : 'text-green-500'}`}>{overall.quality >= 3 ? 'Возможна покупка в кредит' : 'Возможность кредитования отсутствует'}</p>
                </div>
              </div>
            </div>
              {/* Damages list */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-l font-semibold mb-2 text-left">Обнаруженные повреждения</h2>
              <div className="space-y-4">
                {Object.entries(damages).sort(([, a], [, b]) => a.quality - b.quality).map(([partId, damage], index) => (
                  <DamageCard
                    key={partId}
                    partId={partId}
                    damage={damage}
                    index={index}
                    isHovered={hoveredPart === partId}
                    onMouseEnter={() => setHoveredPart(partId)}
                    onMouseLeave={() => setHoveredPart(null)}
                  />
                ))}
              </div>
              
              <div className="mt-6 text-sm text-gray-600">
                Если вы не согласны, обратитесь в <a href="https://support.avito.ru/" className="text-blue-500 hover:underline">поддержку</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button size="large" onClick={goToAd}>
            К объявлению
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AnalysisResultsPage;
