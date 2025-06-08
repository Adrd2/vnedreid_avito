import { useState, useEffect, useMemo } from 'react';
import type { CarPartType, CarParts } from '../types/api.types';

/**
 * Interface for car part with position and hover state
 */
interface CarPartWithState {
  id: CarPartType;
  svgPath: string;
  isHovered: boolean;
  hasDamage: boolean;
  damageDescription?: string;
}

/**
 * Custom hook for car visualization
 */
export const useCarVisualization = (carPartsData?: CarParts) => {
  const [hoveredPart, setHoveredPart] = useState<CarPartType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allCarParts, setAllCarParts] = useState<CarPartType[]>([]);

  // Load all available car parts on mount
  useEffect(() => {
    const loadCarParts = async () => {
      setIsLoading(true);
      try {
        // List all SVG files in the model_parts directory
        const parts: CarPartType[] = [
          'Back-windshield',
          'Front-bumper',
          'Grille',
          'Hood',
          'Left-Back-door',
          'Left-Back-wheel',
          'Left-Back-window',
          'Left-Fender',
          'Left-Front-door',
          'Left-Front-wheel',
          'Left-Front-window',
          'Left-Headlight',
          'Left-Quarter-panel',
          'Left-Tail-light',
          'Right-Back-door',
          'Right-Back-wheel',
          'Right-Back-window',
          'Right-Fender',
          'Right-Front-door',
          'Right-Front-wheel',
          'Right-Front-window',
          'Right-Headlight',
          'Right-Quarter-panel',
          'Right-Tail-light',
          'Roof',
          'Trunk'
        ];
        
        setAllCarParts(parts);
      } catch (error) {
        console.error('Error loading car parts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCarParts();
  }, []);

  // Get damaged parts from mock data
  const damagedParts = useMemo(() => {
    return carPartsData || {};
  }, []);

  // Create car parts list with hover state
  const carParts = useMemo(() => {
    return allCarParts.map(partId => {
      const damage = damagedParts[partId];
      return {
        id: partId,
        svgPath: `/assets/model_parts/${partId}.svg`,
        isHovered: hoveredPart === partId,
        hasDamage: !!damage,
        damageDescription: damage?.detailed?.join(', '),
        damageSeverity: damage?.quality ?
          damage.quality < 1 ? 'Легкие' :
          damage.quality < 2 ? 'Средние' :
          damage.quality < 3 ? 'Серьезные' : 'Критические' :
          'Нет повреждений'
      };
    });
  }, [allCarParts, hoveredPart, damagedParts]);

  /**
   * Handle mouse enter on car part
   * @param partId - The car part ID being hovered
   */
  const handlePartMouseEnter = (partId: CarPartType) => {
    setHoveredPart(partId);
  };

  /**
   * Handle mouse leave on car part
   */
  const handlePartMouseLeave = () => {
    setHoveredPart(null);
  };

  return {
    carParts,
    isLoading,
    hoveredPart,
    handlePartMouseEnter,
    handlePartMouseLeave,
    damagedParts
  };
};

export default useCarVisualization;
