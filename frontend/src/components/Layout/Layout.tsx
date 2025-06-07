import { type FC, type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoImage from '/assets/Logo.png';

interface LayoutProps extends PropsWithChildren {
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout: FC<LayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && (
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-sm py-4"
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoImage} alt="AutoCheck AI" className="h-8" />
              <span className="text-xl font-semibold text-primary-500">AutoCheck AI</span>
            </Link>
            <nav className="flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">О сервисе</Link>
              <Link to="/how-it-works" className="text-gray-600 hover:text-primary-500 transition-colors duration-200">Как это работает</Link>
              <Link to="/upload" className="text-primary-500 font-medium hover:text-primary-600 transition-colors duration-200">Начать анализ</Link>
            </nav>
          </div>
        </motion.header>
      )}
      
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-6"
        >
          {children}
        </motion.div>
      </main>

      {showFooter && (
        <motion.footer 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-100 py-6"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-2">
                <img src={LogoImage} alt="AutoCheck AI" className="h-6" />
                <span className="text-sm text-gray-600">© {new Date().getFullYear()} AutoCheck AI</span>
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
};

export default Layout;
