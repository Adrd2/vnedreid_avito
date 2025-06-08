import type { 
  CarParameters, 
  CreateAnalysisResponse, 
  AnalysisResponse, 
  CarPartType,
  DamageType
} from '../types/api.types';

/**
 * Available car brands and models for selection
 */
export const availableCarModels: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X6'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Highlander'],
  'Nissan': ['Altima', 'X-Trail', 'Qashqai', 'Juke', 'Pathfinder'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Polo', 'Touareg'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
  'Ford': ['Focus', 'Fiesta', 'Kuga', 'Explorer', 'Mustang'],
  'Hyundai': ['Solaris', 'Creta', 'Tucson', 'Santa Fe', 'i30'],
  'Kia': ['Rio', 'Sportage', 'Cerato', 'Sorento', 'K5']
};

/**
 * Mock car parameters for VIN entry result
 */
export const mockCarParameters: CarParameters = {
  brand: 'Nissan',
  model: 'X-Trail',
  year: 2023,
  transmission: 'Автоматическая',
  drive_type: 'Полный',
  color: 'Белый',
  wheel_side: 'Левый',
  engine_volume: 2.5,
  engine_type: 'Гибридный',
  body_type: 'Внедорожник'
};

/**
 * Mock create analysis response
 */
export const mockCreateAnalysisResponse: CreateAnalysisResponse = {
  analyse_id: 12345,
  car_params: mockCarParameters
};

/**
 * Damage severity levels
 */
export type DamageSeverity = 'Легкие' | 'Средние' | 'Серьезные';

/**
 * Mock damage data structure for visualization
 */
export interface DamageInfo {
  part: CarPartType;
  type: DamageType[];
  severity: DamageSeverity;
  description: string;
}

/**
 * Mock damages for display
 */
export const mockDamages: DamageInfo[] = [
  {
    part: 'Right-Back-door',
    type: ['Scratch'],
    severity: 'Легкие',
    description: 'Царапина/Скол'
  },
  {
    part: 'Right-Quarter-panel',
    type: ['Dent', 'Paint chip'],
    severity: 'Легкие',
    description: 'Царапина/Вмятина'
  },
  {
    part: 'Back-bumper',
    type: ['Scratch', 'Dent'],
    severity: 'Легкие',
    description: 'Царапина/Скол'
  }
];

/**
 * Mock analysis response
 */
export const mockAnalysisResponse: AnalysisResponse = {
  success: true,
  details_analize: {
    quality: 0.87,
    car_parts: {
      'Right-Back-door': {
        quantity: 1,
        defects: ['Scratch'],
        detailed: ['Царапина/Скол']
      },
      'Right-Quarter-panel': {
        quantity: 1,
        defects: ['Dent', 'Paint chip'],
        detailed: ['Царапина/Вмятина']
      },
      'Back-bumper': {
        quantity: 1,
        defects: ['Scratch', 'Dent'],
        detailed: ['Царапина/Скол']
      }
    },
    created_at: new Date().toISOString()
  }
};

/**
 * Overall assessment based on damages
 */
export interface OverallAssessment {
  severity: DamageSeverity;
  creditEligible: boolean;
}

/**
 * Get mock overall assessment
 */
export const mockOverallAssessment: OverallAssessment = {
  severity: 'Легкие',
  creditEligible: true
};