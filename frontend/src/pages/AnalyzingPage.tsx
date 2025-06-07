import { type FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { PageTransition, containerVariants, itemVariants, useError } from '../components/UI';
import apiService from '../api/apiService';

const stages = [
  {
    id: 'recognize',
    label: 'Распознавание ракурсов',
    duration: 2000,
  },
  {
    id: 'detect',
    label: 'Поиск повреждений',
    duration: 3000,
  },
  {
    id: 'classify',
    label: 'Классификация по типу',
    duration: 2000,
  },
  {
    id: 'report',
    label: 'Формирование отчета',
    duration: 1000,
  },
];

const AnalyzingPage: FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const navigate = useNavigate();
  const { showError } = useError();
  
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!sessionId) {
      navigate('/upload');
      return;
    }
    
    // Simulate analysis stages
    const runAnalysis = async () => {
      // Sequentially progress through stages
      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(i);
        await new Promise((resolve) => setTimeout(resolve, stages[i].duration));
      }
      
      // When all stages are complete, call the API
      try {
        const response = await apiService.analyzeDamage(sessionId);
        setIsComplete(true);
        
        // Navigate to results page
        setTimeout(() => {
          navigate(`/results?analysisId=${response.data.analysisId}`);
        }, 1000);
      } catch (error) {
        console.error('Error analyzing damage:', error);
        showError('Произошла ошибка при анализе повреждений. Пожалуйста, попробуйте снова.');
        navigate('/upload');
      }
    };
    
    runAnalysis();
  }, [sessionId, navigate, showError]);

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-2xl mx-auto text-center py-12">
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-bold mb-8"
          >
            Анализируем фото
          </motion.h1>
          
          <motion.div 
            variants={itemVariants}
            className="mb-8 text-lg text-gray-600"
          >
            <p className="mb-2">Обработка фото нейросетью</p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            className="mb-12"
          >
            {stages.map((stage, index) => {
              // Determine stage status
              const isActive = currentStage === index;
              const isCompleted = currentStage > index;
              
              return (
                <motion.div 
                  key={stage.id} 
                  variants={itemVariants}
                  className="mb-6"
                >
                  <div className="flex items-center mb-2">
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span className={`${
                      isActive ? 'text-primary-500 font-medium' : 
                      isCompleted ? 'text-green-500 font-medium' : 'text-gray-500'
                    }`}>
                      {stage.label}
                    </span>
                    
                    {isActive && (
                      <motion.div 
                        className="ml-2 w-4 h-4 rounded-full bg-primary-500"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1] 
                        }}
                        transition={{ 
                          repeat: Infinity,
                          duration: 1.5
                        }}
                      />
                    )}
                  </div>
                  
                  {isActive && (
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: stage.duration / 1000 }}
                      className="h-1 bg-primary-500 rounded-full ml-9"
                    />
                  )}
                </motion.div>
              );
            })}          </motion.div>
          
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-green-500 font-medium"
            >
              Анализ завершен! Переход к результатам...
            </motion.div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
};

export default AnalyzingPage;
