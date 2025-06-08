import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useAnalysisProcess } from '../hooks/useAnalysisProcess';
import { availableCarModels, mockCarParameters } from '../data/mockData';
import type { CarParameters } from '../types/api.types';
import HeroImage from '/assets/Hero.png';

const CarParametersPage: React.FC = () => {
  const { analyseId } = useParams<{ analyseId: string }>();
  const navigate = useNavigate();
  const { carParams, updateCarParameters, setAnalyseId, isLoading, error } = useAnalysisProcess();  const [localCarParams, setLocalCarParams] = useState<CarParameters | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [vinNumber] = useState<string>("693285732835932875");

  // Set the analyseId on component mount
  useEffect(() => {
    if (analyseId) {
      setAnalyseId(parseInt(analyseId, 10));
    } else {
      navigate('/');
    }
  }, [analyseId, setAnalyseId, navigate]);

  // Initialize local car parameters from the fetched ones or use mock data after timeout
  useEffect(() => {
    if (carParams) {
      setLocalCarParams(carParams);
      
      // Set available models for the selected brand
      if (carParams.brand && availableCarModels[carParams.brand]) {
        setAvailableModels(availableCarModels[carParams.brand]);
      }
    } else {
      // Set a timeout to use mock data if no real data is provided within 10 seconds
      const timeout = setTimeout(() => {
        if (!localCarParams) {
          console.log('No car parameters received within 10 seconds, using mock data');
          setLocalCarParams(mockCarParameters);
          
          if (mockCarParameters.brand && availableCarModels[mockCarParameters.brand]) {
            setAvailableModels(availableCarModels[mockCarParameters.brand]);
          }
        }
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [carParams, localCarParams]);

  // Handle brand change to update available models
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    
    if (!localCarParams) return;
    
    setLocalCarParams({
      ...localCarParams,
      brand,
      model: availableCarModels[brand][0] // Select first model by default
    });
    
    // Update available models
    setAvailableModels(availableCarModels[brand] || []);
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: keyof CarParameters
  ) => {
    if (!localCarParams) return;
    
    // Handle numeric fields
    if (field === 'year' || field === 'engine_volume') {
      setLocalCarParams({
        ...localCarParams,
        [field]: parseFloat(e.target.value)
      });
    } else {
      setLocalCarParams({
        ...localCarParams,
        [field]: e.target.value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localCarParams) return;
    
    await updateCarParameters(localCarParams);
  };

  if (!localCarParams) {
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
          <div className="mb-8">
            <motion.div
              className="max-w-2xl text-left"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                className="flex mx-auto rounded-xl overflow-hidden bg-blue-500"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <input
                  type="text"
                  value={vinNumber}
                  placeholder="Введите VIN номер"
                  className="flex-1 py-2 px-6 text-l border-none focus:outline-none bg-white text-gray-400 mx-1 my-1 rounded-xl"
                  disabled={true}
                />
                <button
                  type="submit"
                  disabled={true}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-l transition-colors duration-200 flex items-center gap-3 disabled:opacity-50"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Проверить
                </button>
              </motion.form>
            </motion.div>
            <div className="border-b border-gray-300 my-8"></div>
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-1 text-left">Информация об автомобиле</h2>
              <p className="text-gray-500 text-sm mb-4 text-left">Проверьте актуальность данных</p>
            </motion.div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    {/* Brand */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Марка</label>
                      <div className="relative">
                        <select
                          value={localCarParams.brand}
                          onChange={handleBrandChange}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          {Object.keys(availableCarModels).map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Color */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Цвет</label>
                      <div className="relative">
                        <select
                          value={localCarParams.color}
                          onChange={(e) => handleChange(e, 'color')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          <option value="Белый">Белый</option>
                          <option value="Черный">Черный</option>
                          <option value="Серебристый">Серебристый</option>
                          <option value="Серый">Серый</option>
                          <option value="Красный">Красный</option>
                          <option value="Синий">Синий</option>
                          <option value="Зеленый">Зеленый</option>
                          <option value="Желтый">Желтый</option>
                          <option value="Коричневый">Коричневый</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Model */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Модель</label>
                      <div className="relative">
                        <select
                          value={localCarParams.model}
                          onChange={(e) => handleChange(e, 'model')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          {availableModels.map(model => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Wheel side */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Руль</label>
                      <div className="relative">
                        <select
                          value={localCarParams.wheel_side}
                          onChange={(e) => handleChange(e, 'wheel_side')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          <option value="Левый">Левый</option>
                          <option value="Правый">Правый</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Year */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Год выпуска</label>
                      <div className="relative">
                        <select
                          value={localCarParams.year}
                          onChange={(e) => handleChange(e, 'year')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year} г.</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Engine volume */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Объем двигателя</label>
                      <div className="relative">
                        <select
                          value={localCarParams.engine_volume}
                          onChange={(e) => handleChange(e, 'engine_volume')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          {[1.0, 1.2, 1.4, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0].map(volume => (
                            <option key={volume} value={volume}>{volume} л</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    {/* Transmission */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Коробка передач</label>
                      <div className="relative">
                        <select
                          value={localCarParams.transmission}
                          onChange={(e) => handleChange(e, 'transmission')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          <option value="Автоматическая">Автомат</option>
                          <option value="Ручная">Механика</option>
                          <option value="Полуавтоматическая">Полуавтомат</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Engine type */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Тип двигателя</label>
                      <div className="relative">
                        <select
                          value={localCarParams.engine_type}
                          onChange={(e) => handleChange(e, 'engine_type')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          <option value="Бензиновый">Бензиновый</option>
                          <option value="Дизельный">Дизельный</option>
                          <option value="Гибридный">Гибрид</option>
                          <option value="Электрический">Электрический</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Drive type */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Привод</label>
                      <div className="relative">
                        <select
                          value={localCarParams.drive_type}
                          onChange={(e) => handleChange(e, 'drive_type')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          <option value="Передний">Передний</option>
                          <option value="Задний">Задний</option>
                          <option value="Полный">Полный</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Body type */}
                    <div className="flex justify-between items-center">
                      <label className="block text-sm text-gray-600 mb-1">Тип кузова</label>
                      <div className="relative">
                        <select
                          value={localCarParams.body_type}
                          onChange={(e) => handleChange(e, 'body_type')}
                          className="block border-none rounded-lg bg-gray-100 text-sm appearance-none focus:outline-none"
                        >
                          <option value="Седан">Седан</option>
                          <option value="Хэтчбек">Хэтчбек</option>
                          <option value="Универсал">Универсал</option>
                          <option value="Купе">Купе</option>
                          <option value="Кроссовер">Кроссовер</option>
                          <option value="Внедорожник">Внедорожник 5-дв.</option>
                          <option value="Пикап">Пикап</option>
                        </select>
                      </div>
                    </div>
                  </div>
                
                  <div className="flex justify-start mt-6">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-8 rounded-md flex items-center justify-center hover:bg-blue-600 focus:outline-none"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      ) : (
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      Подтверждаю
                    </button>
                  </div>
                </div>
                
                <div className="lg:w-1/2 flex justify-center items-center">
                  <motion.div 
                    className="flex justify-center"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div className="relative w-full h-auto max-w-md">
                      <div className="absolute bottom-0 w-full h-1/2 bg-blue-100 rounded-full opacity-50 blur-2xl z-0"></div>
                      <img 
                        src={HeroImage} 
                        alt="Автомобиль" 
                        className="relative z-10 w-full h-auto"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </form>
          </div>
        </div>
    </Layout>
  );
};

export default CarParametersPage;