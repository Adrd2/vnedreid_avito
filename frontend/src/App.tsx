import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { 
  NotFoundPage,
  VinEntryPage,
  CarParametersPage
} from './pages';
import PhotoInstructionsPage from './pages/PhotoInstructionsPage';
import PhotoUploadPage from './pages/PhotoUploadPage';
import AnalyzingPage from './pages/AnalyzingPage';
import AnalysisResultsPage from './pages/AnalysisResultsPage';
import { ErrorProvider } from './components/UI';
import { AnalysisProvider } from './context/AnalysisContext';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <VinEntryPage />,
  },
  {
    path: '/car-parameters/:analyseId',
    element: <CarParametersPage />,
  },
  {
    path: '/photo-instructions/:analyseId',
    element: <PhotoInstructionsPage />,
  },
  {
    path: '/upload-photos/:analyseId',
    element: <PhotoUploadPage />,
  },
  {
    path: '/analyzing/:analyseId',
    element: <AnalyzingPage />,
  },
  {
    path: '/analysis-results/:analyseId',
    element: <AnalysisResultsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
], {
  basename: '/'
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <AnalysisProvider>
          <RouterProvider router={router} />
        </AnalysisProvider>
      </ErrorProvider>
    </QueryClientProvider>
  );
}

export default App;
