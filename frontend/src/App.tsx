import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { 
  HomePage, 
  HowItWorksPage, 
  UploadPage, 
  AnalyzingPage, 
  ResultsPage,
  NotFoundPage
} from './pages';
import { ErrorProvider } from './components/UI';
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
    element: <HomePage />,
  },
  {
    path: '/how-it-works',
    element: <HowItWorksPage />,
  },
  {
    path: '/upload',
    element: <UploadPage />,
  },
  {
    path: '/analyzing',
    element: <AnalyzingPage />,
  },
  {
    path: '/results',
    element: <ResultsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
], {
  basename: '/vnedraid-frontend'
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <RouterProvider router={router} />
      </ErrorProvider>
    </QueryClientProvider>
  );
}

export default App;
