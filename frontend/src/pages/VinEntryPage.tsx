import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useAnalysisProcess } from '../hooks/useAnalysisProcess';

const VinEntryPage: React.FC = () => {
  const [vin, setVin] = useState('');
  const { createAnalysis, isLoading, error } = useAnalysisProcess();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vin.trim().length < 1) {
      alert('Пожалуйста, введите корректный VIN номер');
      return;
    }
    await createAnalysis(vin);
  };
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Проверка авто по VIN-номеру
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 mb-8 text-l leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Наш сервис собирает и анализирует историю автомобиля из тысяч
            источников: государственных, открытых и закрытых коммерческих
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit}
            className="flex max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden bg-blue-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              placeholder="Введите VIN номер"
                  className="flex-1 py-2 px-6 text-l border-none focus:outline-none bg-white text-gray-400 mx-1 my-1 rounded-xl"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-l transition-colors duration-200 flex items-center gap-3 disabled:opacity-50"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Проверить
            </button>
          </motion.form>
          
          {error && (
            <motion.div 
              className="mt-8 text-red-600 text-center text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VinEntryPage;