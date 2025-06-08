import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useFakeAnalysisProcess } from '../hooks/useFakeAnalysisProcess';
import { useAnalysisProcess } from '../hooks/useAnalysisProcess';
import AnalyzingImage from '/assets/Analyzing.png';
import { useNavigate } from 'react-router-dom';

const AnalyzingPage: React.FC = () => {
  const { analyseId } = useParams<{ analyseId: string }>();
  // @ts-ignore
  const { progress, status, startAnalysis } = useFakeAnalysisProcess(
    analyseId ? parseInt(analyseId, 10) : null
  );
  const { getAnalysisResults, setAnalyseId } = useAnalysisProcess(analyseId);
  const navigate = useNavigate();

  // Start the analysis when component mounts
  useEffect(() => {
    startAnalysis();

    console.log('Starting analysis for ID:', analyseId);

    if (analyseId) {
      setAnalyseId(parseInt(analyseId, 10));

      console.log('Starting analysis for ID:', analyseId);
      
      getAnalysisResults().then((response => {
        console.log('Analysis response:', response);
        navigate(`/analysis-results/${analyseId}`, {
          state: {
            response: response,
          }
        });
      }));
    }
  }, []);

  // Analysis steps
  const steps = [
    { id: 1, name: 'Распознавание ракурсов', active: progress >= 15 },
    { id: 2, name: 'Поиск повреждений', active: progress >= 40 },
    { id: 3, name: 'Классификация по типу', active: progress >= 65 },
    { id: 4, name: 'Формирование отчета', active: progress >= 90 }
  ];

  // Analysis stats
  const stats = [
    { label: 'Алгоритм точности свыше', value: '70%' },
    { label: 'Модель обучена на 50 000+ реальных случаев', value: '' },
    { label: 'Среднее время обработки:', value: '10 секунд' }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Анализируем фото
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Обработка фото нейросетью
        </motion.p>

        {/* Analysis steps */}
        <motion.div
          className="flex items-center justify-between mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Progress line */}
          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-4 z-0"></div>
          
          {/* Active progress line */}
          <div 
            className="absolute h-1 bg-blue-500 left-0 top-4 z-0 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>

          {/* @ts-ignore */}
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="z-10 flex flex-col items-center"
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
                  ${step.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {step.active ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className={`text-sm ${step.active ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Analyzing image */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img 
            src={AnalyzingImage} 
            alt="Анализ автомобиля" 
            className="max-w-md mx-auto"
          />
        </motion.div>

        {/* Progress bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right font-semibold text-blue-600">
            {progress} %
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="p-6 border border-gray-100 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              {index === 0 && (
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
              )}
              {index === 1 && (
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              )}
              {index === 2 && (
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              )}
              <p className="text-sm text-gray-500">{stat.label}</p>
              {stat.value && <p className="font-semibold mt-1">{stat.value}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AnalyzingPage;
