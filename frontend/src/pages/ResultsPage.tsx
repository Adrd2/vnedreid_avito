import { type FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { Button, useError, PageTransition, containerVariants, itemVariants } from '../components/UI';
import type { Damage, RepairCostEstimateResponse } from '../types/api.types';

const ResultsPage: FC = () => {
  const [searchParams] = useSearchParams();
  const analysisId = searchParams.get('analysisId');
  const navigate = useNavigate();
  const { showError } = useError();
  
  const [damages, setDamages] = useState<Damage[]>([]);
  const [repairEstimate, setRepairEstimate] = useState<RepairCostEstimateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState('Москва');
  const [isGeneratingEstimate, setIsGeneratingEstimate] = useState(false);

  useEffect(() => {
    if (!analysisId) {
      navigate('/upload');
      return;
    }
    
    // Mock data for damages since we don't have a real API yet
    const mockDamages: Damage[] = [
      {
        id: '1',
        part: 'Задняя правая дверь',
        type: 'scratch',
        severity: 'light',
        coordinates: { x: 300, y: 150, width: 50, height: 70 }
      },
      {
        id: '2',
        part: 'Заднее правое крыло',
        type: 'dent',
        severity: 'moderate',
        coordinates: { x: 350, y: 200, width: 80, height: 60 }
      },
      {
        id: '3',
        part: 'Задний бампер',
        type: 'scratch',
        severity: 'light',
        coordinates: { x: 400, y: 250, width: 100, height: 40 }
      }
    ];
    
    setDamages(mockDamages);
    setIsLoading(false);
  }, [analysisId, navigate]);

  const handleGetRepairEstimate = async () => {
    if (!analysisId) return;
    
    setIsGeneratingEstimate(true);
    
    try {
      // In a real application, this would call the API
      // const response = await apiService.getRepairCostEstimate(analysisId, region);
      // setRepairEstimate(response.data);
      
      // Mock data for repair estimate
      const mockRepairEstimate: RepairCostEstimateResponse = {
        estimateId: '123',
        region,
        currency: 'RUB',
        repairs: [
          {
            damageId: '1',
            part: 'Левое крыло (вмятина)',
            work: 'Рихтовка и покраска',
            cost: 7000
          },
          {
            damageId: '2',
            part: 'Левое крыло (вмятина)',
            work: 'Рихтовка и покраска',
            cost: 7000
          },
          {
            damageId: '3',
            part: 'Левое крыло (вмятина)',
            work: 'Рихтовка и покраска',
            cost: 7000
          },
          {
            damageId: '4',
            part: 'Левое крыло (вмятина)',
            work: 'Рихтовка и покраска',
            cost: 7000
          },
          {
            damageId: '5',
            part: 'Левое крыло (вмятина)',
            work: 'Рихтовка и покраска',
            cost: 7000
          },
          {
            damageId: '6',
            part: 'Левое крыло (вмятина)',
            work: 'Рихтовка и покраска',
            cost: 7000
          },
          {
            damageId: '7',
            part: 'Левое крыло (вмятина)',
            work: 'Рихтовка и покраска',
            cost: 7000
          }
        ],
        totalCost: 49000
      };
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setRepairEstimate(mockRepairEstimate);    } catch (error) {
      console.error('Error getting repair estimate:', error);
      showError('Произошла ошибка при получении оценки стоимости ремонта. Пожалуйста, попробуйте снова.');
    } finally {
      setIsGeneratingEstimate(false);
    }
  };
  const handleDownloadPDF = () => {
    // In a real application, this would download a PDF report
    showError('Загрузка PDF отчета. Функция будет реализована в будущей версии.');
  };

  const handleShare = () => {
    // In a real application, this would share the report
    showError('Функция поделиться отчетом будет реализована в будущей версии.');
  };

  const handleFindRepairShop = () => {
    // In a real application, this would navigate to a page with repair shops
    showError('Функция поиска СТО будет реализована в будущей версии.');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <motion.div 
            animate={{ 
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"
          ></motion.div>
        </div>
      </Layout>
    );
  }

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
              Результаты анализа
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-600 mb-6">
              Наш ИИ определил следующие повреждения автомобиля
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Фото с отмеченными повреждениями</h2>
                <div className="relative border border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/assets/car-damage-results.jpg" 
                    alt="Автомобиль с отмеченными повреждениями" 
                    className="w-full h-64 object-cover"
                  />
                  
                  {/* Damage markers */}
                  {damages.map((damage) => (
                    <motion.div
                      key={damage.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + parseInt(damage.id) * 0.2 }}
                      style={{
                        position: 'absolute',
                        left: `${damage.coordinates.x}px`,
                        top: `${damage.coordinates.y}px`,
                        width: `${damage.coordinates.width}px`,
                        height: `${damage.coordinates.height}px`,
                        border: '2px solid',
                        borderColor: damage.severity === 'light' ? 'rgba(246, 173, 85, 0.8)' : 
                                    damage.severity === 'moderate' ? 'rgba(239, 68, 68, 0.8)' : 
                                    'rgba(220, 38, 38, 0.8)',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Обнаруженные повреждения</h2>
                <div className="space-y-3">
                  {damages.map((damage) => (
                    <motion.div 
                      key={damage.id}
                      variants={itemVariants}
                      className="flex items-start p-3 border border-gray-200 rounded-md"
                    >
                      <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${
                        damage.severity === 'light' ? 'bg-yellow-400' : 
                        damage.severity === 'moderate' ? 'bg-orange-500' : 
                        'bg-red-600'
                      }`} />
                      <div className="ml-3">
                        <p className="font-medium">{damage.part}</p>
                        <p className="text-sm text-gray-600">
                          {damage.type === 'scratch' ? 'Царапина' : 
                           damage.type === 'dent' ? 'Вмятина' : 'Повреждение'} - 
                          {damage.severity === 'light' ? ' легкое' : 
                           damage.severity === 'moderate' ? ' среднее' : ' сильное'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-white rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Оценка стоимости ремонта</h2>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                  Регион
                </label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option>Москва</option>
                  <option>Санкт-Петербург</option>
                  <option>Екатеринбург</option>
                  <option>Новосибирск</option>
                  <option>Казань</option>
                </select>
              </div>
              
              <Button
                onClick={handleGetRepairEstimate}
                isLoading={isGeneratingEstimate}
                className="mt-4 sm:mt-0"
              >
                Рассчитать стоимость
              </Button>
            </div>
            
            <AnimatePresence>
              {repairEstimate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-3">Список работ</h3>
                    <div className="max-h-60 overflow-y-auto mb-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Деталь
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Вид работы
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Стоимость
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {repairEstimate.repairs.map((repair, index) => (
                            <motion.tr 
                              key={repair.damageId}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {repair.part}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {repair.work}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                                {repair.cost.toLocaleString()} ₽
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <span className="text-lg font-semibold">Итого:</span>
                      <span className="text-xl font-bold text-primary-600">
                        {repairEstimate.totalCost.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6 gap-4">
                    <Button variant="outline" onClick={handleDownloadPDF}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Скачать PDF
                    </Button>
                    
                    <Button variant="outline" onClick={handleShare}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Поделиться
                    </Button>
                    
                    <Button variant="primary" onClick={handleFindRepairShop}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Найти СТО
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default ResultsPage;
