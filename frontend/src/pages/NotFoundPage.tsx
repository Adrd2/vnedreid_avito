import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Button, PageTransition, itemVariants } from '../components/UI';

const NotFoundPage: FC = () => {
  return (
    <Layout>
      <PageTransition>
        <div className="max-w-md mx-auto text-center py-12">
          <motion.div
            variants={itemVariants}
            className="bg-white p-8 rounded-lg shadow-sm"
          >
            <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Страница не найдена</h2>
            <p className="text-gray-600 mb-8">
              Извините, запрашиваемая вами страница не существует или была перемещена.
            </p>
            <Link to="/">
              <Button size="large">
                Вернуться на главную
              </Button>
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default NotFoundPage;
