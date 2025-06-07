/**
 * Types for the AutoCheck AI application
 */

/**
 * Car damage photo angles
 */
export type PhotoAngle = 'front' | 'back' | 'left' | 'right' | 'damage_closeup';

/**
 * Uploaded photo information
 */
export interface UploadedPhoto {
  id: string;
  angle: PhotoAngle;
  url: string;
}

/**
 * Upload response from the API
 */
export interface UploadResponse {
  sessionId: string;
  uploadedPhotos: UploadedPhoto[];
}

/**
 * Damage types
 */
export type DamageType = 'scratch' | 'dent' | 'crack' | 'other';

/**
 * Damage severity levels
 */
export type DamageSeverity = 'light' | 'moderate' | 'severe';

/**
 * Damage coordinates on the image
 */
export interface DamageCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Detected damage information
 */
export interface Damage {
  id: string;
  part: string;
  type: DamageType;
  severity: DamageSeverity;
  coordinates: DamageCoordinates;
}

/**
 * Analysis response from the API
 */
export interface AnalysisResponse {
  analysisId: string;
  damages: Damage[];
}

/**
 * Repair information
 */
export interface Repair {
  damageId: string;
  part: string;
  work: string;
  cost: number;
}

/**
 * Repair cost estimate response from the API
 */
export interface RepairCostEstimateResponse {
  estimateId: string;
  region: string;
  currency: string;
  repairs: Repair[];
  totalCost: number;
}

/**
 * Error response from the API
 */
export interface ApiError {
  code: string;
  message: string;
}
