import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Button } from '../components/UI';
import CarRightImage from '/assets/CarRight.png';
import CarLeftImage from '/assets/CarLeft.png';
import CarFrontImage from '/assets/CarFront.png';
import CarBackImage from '/assets/CarBack.png';

const HowItWorksPage: FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Как это работает
        </motion.h1>

        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div className="order-2 md:order-1">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">Шаг 1</span>
                <h2 className="text-2xl font-bold mb-4">Загрузите фотографии автомобиля</h2>
                <p className="text-gray-600 mb-6">
                  Добавьте фотографии вашего автомобиля с разных ракурсов: спереди, сзади, с обеих сторон и крупные планы повреждений. Чем больше фотографий вы загрузите, тем точнее будет анализ.
                </p>
                <p className="text-gray-600 mb-6">
                  Рекомендуем делать фотографии в хорошо освещенном месте, чтобы все детали были хорошо видны.
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Максимальный размер файла: 10 МБ</li>
                  <li>Поддерживаемые форматы: JPG, PNG</li>
                  <li>Рекомендуемое разрешение: не менее 1280x720 пикселей</li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src={CarRightImage} 
                  alt="Upload photos" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div>
                <img 
                  src={CarLeftImage} 
                  alt="AI analysis" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">Шаг 2</span>
                <h2 className="text-2xl font-bold mb-4">ИИ анализирует повреждения</h2>
                <p className="text-gray-600 mb-6">
                  Наша система на основе искусственного интеллекта обрабатывает загруженные вами фотографии и автоматически определяет все видимые повреждения на автомобиле.
                </p>
                <p className="text-gray-600 mb-6">
                  Алгоритм выполняет следующие задачи:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Распознает ракурс и положение автомобиля</li>
                  <li>Находит повреждения на кузове и других элементах</li>
                  <li>Классифицирует тип повреждений (царапины, вмятины, сколы и т.д.)</li>
                  <li>Оценивает степень тяжести каждого повреждения</li>
                </ul>
                <p className="text-gray-600">
                  Весь процесс анализа занимает всего около 18 секунд.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
              <div className="order-2 md:order-1">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">Шаг 3</span>
                <h2 className="text-2xl font-bold mb-4">Получите детальный отчет</h2>
                <p className="text-gray-600 mb-6">
                  После завершения анализа вы получите подробный отчет обо всех обнаруженных повреждениях. Отчет включает:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Схематичное изображение автомобиля с отмеченными зонами повреждений</li>
                  <li>Список всех повреждений с указанием их типа и степени тяжести</li>
                  <li>Фотографические доказательства каждого повреждения</li>
                </ul>
                <p className="text-gray-600">
                  Вы можете сохранить отчет в формате PDF или поделиться им с другими людьми.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src={CarFrontImage} 
                  alt="Damage report" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src={CarBackImage} 
                  alt="Repair estimate" 
                  className="rounded-lg shadow-lg" 
                />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">Шаг 4</span>
                <h2 className="text-2xl font-bold mb-4">Узнайте стоимость ремонта</h2>
                <p className="text-gray-600 mb-6">
                  Выберите свой регион, и система автоматически рассчитает ориентировочную стоимость ремонта всех обнаруженных повреждений.
                </p>
                <p className="text-gray-600 mb-6">
                  Расчет стоимости основан на текущих рыночных ценах в вашем регионе и включает:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Стоимость запчастей, если требуется замена</li>
                  <li>Стоимость работ по ремонту (рихтовка, покраска и т.д.)</li>
                  <li>Общую сумму ремонта всех повреждений</li>
                </ul>
                <p className="text-gray-600">
                  После получения оценки вы можете легко найти ближайшие автосервисы, готовые выполнить ремонт.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-primary-500 text-white rounded-xl p-8 text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Технология искусственного интеллекта</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-primary-600 bg-opacity-30 p-6 rounded-lg">
              <div className="text-xl font-bold mb-2">50 000+</div>
              <p>Реальных случаев в обучающей выборке</p>
            </div>
            <div className="bg-primary-600 bg-opacity-30 p-6 rounded-lg">
              <div className="text-xl font-bold mb-2">92%</div>
              <p>Точность определения повреждений</p>
            </div>
            <div className="bg-primary-600 bg-opacity-30 p-6 rounded-lg">
              <div className="text-xl font-bold mb-2">18 сек</div>
              <p>Среднее время обработки</p>
            </div>
          </div>          <p className="mb-6">
            Наша система постоянно обучается и становится точнее с каждым новым случаем.
          </p>
          <Link to="/upload">
            <Button
              variant="secondary"
              size="large"
              className="px-8 bg-white text-primary-500 hover:bg-gray-100"
            >
              Начать анализ
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
};

export default HowItWorksPage;
