import { type FC, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Button } from '../components/UI';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

const PricingPage: FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Базовый',
      description: 'Для индивидуального использования',
      price: billingPeriod === 'monthly' ? 1490 : 14900,
      features: [
        'До 10 анализов в месяц',
        'Оценка повреждений',
        'Расчет стоимости ремонта',
        'Экспорт отчетов в PDF',
      ],
    },
    {
      id: 'professional',
      name: 'Профессиональный',
      description: 'Для автосервисов и страховых агентов',
      price: billingPeriod === 'monthly' ? 4990 : 49900,
      features: [
        'До 100 анализов в месяц',
        'Оценка повреждений',
        'Расчет стоимости ремонта',
        'Экспорт отчетов в PDF',
        'Брендирование отчетов',
        'API для интеграции',
        'Приоритетная поддержка',
      ],
      recommended: true,
    },
    {
      id: 'enterprise',
      name: 'Корпоративный',
      description: 'Для крупных компаний и страховых',
      price: billingPeriod === 'monthly' ? 19990 : 199900,
      features: [
        'Неограниченное количество анализов',
        'Все функции Профессионального тарифа',
        'Обучение персонала',
        'Выделенный менеджер поддержки',
        'SLA на обслуживание',
        'Возможность установки на серверах клиента',
      ],
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Тарифы и цены</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Выберите подходящий тариф для оценки повреждений автомобилей с помощью искусственного интеллекта
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                billingPeriod === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Ежемесячно
            </button>
            <button
              className={`px-4 py-2 rounded-md transition-all ${
                billingPeriod === 'annual' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
              onClick={() => setBillingPeriod('annual')}
            >
              Ежегодно
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`bg-white rounded-xl overflow-hidden shadow-sm border ${
                plan.recommended ? 'border-primary-500' : 'border-gray-200'
              } relative`}
            >
              {plan.recommended && (
                <div className="bg-primary-500 text-white text-sm font-medium py-1 px-3 absolute top-0 right-0 rounded-bl-lg">
                  Рекомендуемый
                </div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price.toLocaleString()} ₽</span>
                  <span className="text-gray-500">/{billingPeriod === 'monthly' ? 'месяц' : 'год'}</span>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-semibold mb-3 text-gray-900">Что включено:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button
                  variant={plan.recommended ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  Выбрать тариф
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-8 border border-gray-200"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Нужен индивидуальный тариф?</h2>
              <p className="text-gray-600 mb-6">
                Для крупных компаний и корпораций мы предлагаем индивидуальные условия сотрудничества, 
                включая интеграцию с вашими системами и разработку дополнительного функционала.
              </p>
              <Button variant="outline" className="mb-4">
                Связаться с нами
              </Button>
              <p className="text-sm text-gray-500">
                Наши специалисты свяжутся с вами в течение 24 часов для обсуждения деталей.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-primary-500 mb-2">Страховые компании</div>
                <p className="text-gray-600 text-sm">
                  Автоматизация процесса оценки повреждений для страховых случаев
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-primary-500 mb-2">Автодилеры</div>
                <p className="text-gray-600 text-sm">
                  Оценка состояния автомобилей при выкупе и trade-in
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-primary-500 mb-2">Лизинговые компании</div>
                <p className="text-gray-600 text-sm">
                  Проверка состояния автомобилей при возврате из лизинга
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-xl font-bold text-primary-500 mb-2">Каршеринг</div>
                <p className="text-gray-600 text-sm">
                  Автоматический контроль состояния автомобилей автопарка
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Остались вопросы?</h2>
          <p className="text-gray-600 mb-8">
            Наша команда всегда готова ответить на любые вопросы о наших тарифах и услугах.
          </p>
          <div className="inline-flex gap-4">
            <Button variant="outline">Часто задаваемые вопросы</Button>
            <Button>Связаться с поддержкой</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
