import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Button } from '../components/UI';
import HeroImage from '/assets/Hero.png';

const HomePage: FC = () => {
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Оценка повреждений авто по фото
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Загрузите фотографии автомобиля и получите автоматическую оценку характера и степени повреждений всего за 30 секунд.
            </p>
            <Link to="/upload">
              <Button size="large" className="px-8">
                Загрузить фото автомобиля
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >            <img
              src={HeroImage}
              alt="Car damage analysis"
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 rounded-xl my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Как это работает</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Наш сервис использует передовые алгоритмы компьютерного зрения для анализа повреждений автомобиля.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              title: 'Загрузка фото',
              description: 'Загрузите фотографии автомобиля с разных ракурсов',
              icon: '📸',
            },
            {
              title: 'ИИ-анализ',
              description: 'Наша нейросеть обрабатывает фото и выявляет повреждения',
              icon: '🤖',
            },
            {
              title: 'Оценка повреждений',
              description: 'Получите детальный отчет о типе и степени повреждений',
              icon: '📊',
            },
            {
              title: 'Стоимость ремонта',
              description: 'Узнайте приблизительную стоимость ремонта в вашем регионе',
              icon: '💰',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AutoCheck AI использует передовые технологии искусственного интеллекта для точной оценки повреждений.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Высокая точность',
              description: 'Наши алгоритмы обеспечивают точность определения повреждений до 92%',
              value: '92%',
            },
            {
              title: 'Быстрый анализ',
              description: 'Среднее время обработки всех фотографий составляет всего 18 секунд',
              value: '18 сек',
            },
            {
              title: 'Обширная база данных',
              description: 'ИИ-модель обучена на более чем 50 000 реальных случаев повреждений',
              value: '50 000+',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="text-primary-500 font-bold text-4xl mb-4">{item.value}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-primary-500 text-white rounded-xl my-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Начните использовать AutoCheck AI прямо сейчас</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Загрузите фотографии вашего автомобиля и получите детальный отчет о повреждениях за считанные секунды.
          </p>
          <Link to="/upload">
            <Button
              variant="secondary"
              size="large"
              className="px-8 bg-white text-primary-500 hover:bg-gray-100"
            >
              Оценить повреждения
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
