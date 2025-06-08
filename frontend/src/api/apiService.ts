import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import config from '../config/config';
import type { 
  CreateAnalysisRequest,
  CarParameters,
  CreateAnalysisResponse,
  PhotoPosition,
  AnalysisResponse
} from '../types/api.types';

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
   * Create analyse for a VIN number
   * @param vin - Vehicle Identification Number
   * @returns Analysis ID and car parameters
   */
  async createAnalyse(vin: string): Promise<AxiosResponse<CreateAnalysisResponse>> {
    const data: CreateAnalysisRequest = { vin };
    return this.api.post('/create_analyse', data);
  }

  /**
   * Change analyse parameters
   * @param analyseId - Analysis ID
   * @param carParams - Updated car parameters
   */
  async changeParams(analyseId: number, carParams: CarParameters): Promise<AxiosResponse> {
    return this.api.post(`/change_params?analyse_id=${analyseId}`, carParams);
  }

  /**
   * Upload car photos
   * @param analyseId - Analysis ID
   * @param files - The car photo files to upload
   * @param positions - Array of positions for each photo
   * @param onUploadProgress - Callback for tracking upload progress
   */
  async uploadPhotos(
    analyseId: number,
    files: File[],
    positions: PhotoPosition[],
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse> {
    const formData = new FormData();


    files.forEach((file) => {
      formData.append('photos', file);
    });

    positions.forEach((position) => {
      formData.append('positions', position);
    });

    const options: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    };

    return this.api.post(`/upload?analyse_id=${analyseId}`, formData, options);
  }

  /**
   * Get analysis results
   * @param analyseId - Analysis ID
   */
  async getAnalyse(analyseId: number): Promise<AxiosResponse<AnalysisResponse>> {
    return this.api.get(`/analyse?analyse_id=${analyseId}`);
  }
}

// Export a singleton instance
export const apiService = new ApiService();

export default apiService;
