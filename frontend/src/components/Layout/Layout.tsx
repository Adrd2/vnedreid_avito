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
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-4"
        >
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={LogoImage} alt="Авито авто" className="h-8" />
            </Link>
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
          className="bg-white py-6"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-2">
                <img src={LogoImage} alt="Авито авто" className="h-6" />
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </div>
  );
};

export default Layout;
