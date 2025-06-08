import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Button } from '../components/UI';

// Import instruction images
import Step1Image from '/assets/instructions/Step1.png';
import Step2Image from '/assets/instructions/Step2.png';
import Step3Image from '/assets/instructions/Step3.png';
import Step4Image from '/assets/instructions/Step4.png';
import Step5Image from '/assets/instructions/Step5.png';
import Step6Image from '/assets/instructions/Step6.png';

interface InstructionStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

const instructionSteps: InstructionStep[] = [
  {
    id: '01',
    title: 'Пространное место съемки',
    description: 'Автомобиль должен свободно помещаться в кадр. Вам не должны мешать никакие препятствия.',
    image: Step1Image
  },
  {
    id: '02',
    title: 'Чистота и освещение',
    description: 'Автомобиль должен быть чистым, без сильных загрязнений, наклеек и снега, а также хорошо освещен.',
    image: Step2Image
  },
  {
    id: '03',
    title: '«Без фильтров»',
    description: 'Не используйте эффекты, фильтры и художественные приемы при съемке.',
    image: Step3Image
  },
  {
    id: '04',
    title: 'Закрывайте двери',
    description: 'Убедитесь, что все двери, окна, капот и багажник закрыты.',
    image: Step4Image
  },
  {
    id: '05',
    title: 'Ракурсы',
    description: 'Используйте правильные ракурсы для фото: спереди, сзади, с левого и правого бока.',
    image: Step5Image
  },
  {
    id: '06',
    title: 'Видимость деталей',
    description: 'Все детали кузова автомобиля должны быть полностью помещены в кадр.',
    image: Step6Image
  }
];

const PhotoInstructionsPage: React.FC = () => {
  const { analyseId } = useParams<{ analyseId: string }>();
  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate(`/upload-photos/${analyseId}`);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Инструкция по загрузке фото автомобиля</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instructionSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative rounded-full w-48 h-48 mx-auto my-4 border-2 border-gray-100 flex items-center justify-center">
                <img src={step.image} alt={step.title} className="max-w-full max-h-full p-4" />
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
              
              <div className="bg-blue-50 text-blue-700 text-5xl font-bold p-4 text-center opacity-20">
                {step.id}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button size="large" onClick={handleNextClick}>
            Загрузить фото
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PhotoInstructionsPage;
