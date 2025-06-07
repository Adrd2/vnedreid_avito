import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import config from '../config/config';

/**
 * API Service for interacting with the backend
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Any status codes outside the range of 2xx
        if (config.debug) {
          console.error('API Error:', error.response);
        }
        return Promise.reject(error);
      }
    );
  }
  /**
   * Upload car photos
   * @param files - The car photo files to upload
   * @param onUploadProgress - Callback for tracking upload progress
   */
  async uploadPhotos(
    files: File[],
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`photo_${index}`, file);
    });

    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    };

    return this.api.post('/upload', formData, options);
  }

  /**
   * Analyze car damage
   * @param sessionId - Session ID from the upload response
   */
  async analyzeDamage(sessionId: string): Promise<AxiosResponse> {
    return this.api.post('/analyze', { sessionId });
  }

  /**
   * Get repair cost estimate
   * @param analysisId - Analysis ID from the analysis response
   * @param region - Region for the cost estimate
   */
  async getRepairCostEstimate(
    analysisId: string,
    region: string
  ): Promise<AxiosResponse> {
    return this.api.post('/repairs', { analysisId, region });
  }
}

// Export a singleton instance
export const apiService = new ApiService();

export default apiService;
