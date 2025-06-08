/**
 * Types for the AutoCheck AI application
 */

/**
 * Create analysis request parameters
 */
export interface CreateAnalysisRequest {
  vin: string;
}

/**
 * Car parameters
 */
export interface CarParameters {
  brand: string;
  model: string;
  year: number;
  transmission: 'Ручная' | 'Автоматическая' | 'Полуавтоматическая';
  drive_type: 'Передний' | 'Задний' | 'Полный';
  color: string;
  wheel_side: 'Левый' | 'Правый';
  engine_volume: number;
  engine_type: 'Бензиновый' | 'Дизельный' | 'Гибридный' | 'Электрический';
  body_type: 'Седан' | 'Хэтчбек' | 'Универсал' | 'Купе' | 'Кроссовер' | 'Внедорожник' | 'Пикап';
}

/**
 * Create analysis response
 */
export interface CreateAnalysisResponse {
  analyse_id: number;
  car_params: CarParameters;
}

/**
 * Car damage photo positions
 */
export type PhotoPosition = 'front' | 'rear' | 'left' | 'right' | 'other';

/**
 * Upload request to the API
 */
export interface UploadRequest {
  photos: File[];
  positions: PhotoPosition[];
  onUploadProgress?: (progressEvent: any) => void;
}

/**
 * Damage types
 */
export type DamageType = 'Dent' | 'Cracked' | 'Scratch' | 'Flaking' | 'Broken part' | 'Paint chip' | 'Missing part' | 'Corrosion';

/**
 * Car part information
 */
export interface CarPart {
  quantity: number;
  metadata?: any[];
  defects: DamageType[];
  detailed: string[];
}

/**
 * Car part types
 */
export type CarPartType = 
  | 'Windshield'
  | 'Back-windshield'
  | 'Left-Front-window'
  | 'Left-Back-window'
  | 'Left-Front-door'
  | 'Left-Back-door'
  | 'Left-Front-wheel'
  | 'Left-Back-wheel'
  | 'Right-Front-window'
  | 'Right-Back-window'
  | 'Right-Front-door'
  | 'Right-Back-door'
  | 'Right-Front-wheel'
  | 'Right-Back-wheel'
  | 'Front-bumper'
  | 'Back-bumper'
  | 'Left-Headlight'
  | 'Left-Tail-light'
  | 'Right-Headlight'
  | 'Right-Tail-light'
  | 'Hood'
  | 'Trunk'
  | 'License-plate'
  | 'Left-Mirror'
  | 'Right-Mirror'
  | 'Roof'
  | 'Grille'
  | 'Left-Rocker-panel'
  | 'Left-Quarter-panel'
  | 'Left-Fender'
  | 'Right-Rocker-panel'
  | 'Right-Quarter-panel'
  | 'Right-Fender';

/**
 * Car part information
 */
export interface CarParts {
  [key: string]: CarPart;
}

/**
 * Parameters for car analysis
 */
export interface Analysis {
  quality: number;
  car_parts: CarParts;
  created_at: string;
}

/**
 * Analysis response from the API
 */
export interface AnalysisResponse {
  success: boolean;
  details_analize: Analysis;
}

/**
 * Error response from the API
 */
export interface ApiError {
  code: string;
  message: string;
}
