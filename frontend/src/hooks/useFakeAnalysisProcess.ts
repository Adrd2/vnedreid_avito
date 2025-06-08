import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
import { mockAnalysisResponse } from '../data/mockData';

/**
 * Hook for handling fake analysis process
 * @param analyseId - Analysis ID
 */
export const useFakeAnalysisProcess = (analyseId: number | null) => {
  // const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Start the fake analysis process
  const startAnalysis = () => {
    if (!analyseId) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    setStatus('loading');
    
    // Simulate the analysis process with a minimum of 10 seconds
    // const startTime = Date.now();
    // const targetDuration = 10000; // 10 seconds minimum
    
    // First progress from 0 to 95% over 8 seconds
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (95 - prev) * 0.1;
        if (newProgress >= 95) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 95;
        }
        return Math.min(Math.floor(newProgress), 95);
      });
    }, 500);
  };

  return {
    progress,
    status,
    isAnalyzing,
    startAnalysis,
    analysisResult: mockAnalysisResponse
  };
};

export default useFakeAnalysisProcess;
