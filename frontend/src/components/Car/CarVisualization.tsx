import React, { useState, useEffect } from 'react';
import { useCarVisualization } from '../../hooks/useCarVisualization';
import type { CarPartType, CarParts } from '../../types/api.types';

interface CarVisualizationProps {
  highlightedPart?: CarPartType | null;
  onPartHover?: (part: CarPartType | null) => void;
  selectedView?: 'front' | 'rear' | 'left' | 'right' | 'top';
  damages?: CarParts;
}

const CarVisualization: React.FC<CarVisualizationProps> = ({
  highlightedPart,
  onPartHover,
  selectedView = 'top',
  damages = {}
}) => {
  const { 
    carParts, 
    isLoading,
    handlePartMouseEnter: defaultHandlePartMouseEnter, 
    handlePartMouseLeave: defaultHandlePartMouseLeave 
  } = useCarVisualization(damages);
  
  const [svgElements, setSvgElements] = useState<Record<string, React.ReactNode>>({});

  // Load SVG elements on mount
  useEffect(() => {
    const loadSvgElements = async () => {
      const loadedElements: Record<string, React.ReactNode> = {};
      
      for (const part of carParts) {
        try {
          // Dynamic import of SVG files
          const svgModule = await import(`../../../public/assets/model_parts/${part.id}.svg`);
          const svgUrl = svgModule.default;
          
          loadedElements[part.id] = (
            <img 
              src={svgUrl} 
              alt={part.id} 
              className="absolute top-0 left-0 w-full h-full object-contain" 
            />
          );
        } catch (err) {
          console.error(`Failed to load SVG for ${part.id}:`, err);
        }
      }
      
      setSvgElements(loadedElements);
    };
    
    if (!isLoading && carParts.length > 0) {
      loadSvgElements();
    }
  }, [carParts, isLoading]);

  // Use provided handlers if available, otherwise use default ones
  const handlePartMouseEnter = (part: CarPartType) => {
    if (onPartHover) {
      onPartHover(part);
    } else {
      defaultHandlePartMouseEnter(part);
    }
  };

  const handlePartMouseLeave = () => {
    if (onPartHover) {
      onPartHover(null);
    } else {
      defaultHandlePartMouseLeave();
    }
  };

  // Determine if a part has damage
  const getPartDamage = (partId: CarPartType) => {
    // return mockDamages.find(d => d.part === partId);
  };

  // Get color based on damage severity
  const getPartColor = (partId: CarPartType): string => {
    const damage = getPartDamage(partId);
    if (!damage) return 'border-gray-300';
    
    switch (damage.severity) {
      case 'Легкие':
        return 'border-yellow-400';
      case 'Средние':
        return 'border-orange-400';
      case 'Серьезные':
        return 'border-red-500';
      default:
        return 'border-gray-300';
    }
  };  // Views configuration
  const viewConfiguration: Record<string, { title: string, viewBox: string, parts: CarPartType[] }> = {
    top: {
      title: "Вид сверху",
      viewBox: "0 0 800 400",
      parts: [
        'Roof', 'Hood', 'Trunk', 'Left-Front-door', 'Left-Back-door', 
        'Right-Front-door', 'Right-Back-door', 'Left-Quarter-panel', 'Right-Quarter-panel'
      ] as CarPartType[]
    },    front: {
      title: "Вид спереди",
      viewBox: "0 0 800 400",
      parts: [
        'Front-bumper', 'Hood', 'Grille', 'Left-Headlight', 'Right-Headlight',
        'Left-Front-wheel', 'Right-Front-wheel', 'Left-Fender', 'Right-Fender'
      ] as CarPartType[]
    },
    rear: {
      title: "Вид сзади",
      viewBox: "0 0 800 400",
      parts: [
        'Back-bumper', 'Trunk', 'Left-Tail-light', 'Right-Tail-light',
        'Left-Back-wheel', 'Right-Back-wheel', 'Left-Quarter-panel', 'Right-Quarter-panel'
      ] as CarPartType[]
    },
    left: {
      title: "Вид слева",
      viewBox: "0 0 800 400",
      parts: [
        'Left-Front-door', 'Left-Back-door', 'Left-Front-wheel', 'Left-Back-wheel',
        'Left-Fender', 'Left-Quarter-panel', 'Left-Headlight', 'Left-Tail-light'
      ] as CarPartType[]
    },
    right: {
      title: "Вид справа",
      viewBox: "0 0 800 400", 
      parts: [
        'Right-Front-door', 'Right-Back-door', 'Right-Front-wheel', 'Right-Back-wheel',
        'Right-Fender', 'Right-Quarter-panel', 'Right-Headlight', 'Right-Tail-light'
      ] as CarPartType[]
    }
  };
  // Get the current view configuration
  const currentView = viewConfiguration[selectedView as keyof typeof viewConfiguration];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="car-visualization">
      <h3 className="text-lg font-medium mb-4">{currentView.title}</h3>
      
      <div className="relative border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {/* Car silhouette */}
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <img 
            src={`../../../public/assets/wireframes/${selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}.png`} 
            alt={`${selectedView} view wireframe`}
            className="opacity-10 max-h-full"
          />
        </div>
        
        {/* Car parts */}
        {carParts
          .filter(part => currentView.parts.includes(part.id))
          .map(part => {
            const damage = getPartDamage(part.id);
            
            return (
              <div
                key={part.id}
                className={`absolute inset-0 transition-all duration-300 cursor-pointer ${
                  highlightedPart && highlightedPart !== part.id
                    ? 'opacity-30'
                    : damage
                    ? 'opacity-100'
                    : 'opacity-80'
                } hover:opacity-100`}
                onMouseEnter={() => handlePartMouseEnter(part.id)}
                onMouseLeave={handlePartMouseLeave}
              >
                {svgElements[part.id]}
                
                {/* Damage indicator overlay */}
                {damage && (
                  <div className={`absolute inset-0 border-2 ${getPartColor(part.id)} rounded-md animate-pulse pointer-events-none`} />
                )}
              </div>
            );
          })}
          
        {/* Legend or tooltip for hovered part */}
        {highlightedPart && (
          <div className="absolute bottom-2 right-2 bg-white px-3 py-2 rounded-md shadow-lg text-sm">
            <strong>{highlightedPart.replace(/-/g, ' ')}</strong>
            {getPartDamage(highlightedPart) && (
              <div className="text-xs text-red-500 mt-1">
                {getPartDamage(highlightedPart)?.description}
              </div>
            )}
          </div>
        )}
      </div>

      {/* View selector */}
      <div className="flex justify-center mt-4 space-x-2">
        {Object.keys(viewConfiguration).map(view => (
          <button
            key={view}
            className={`px-3 py-1 rounded ${selectedView === view ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}
            onClick={() => window.location.hash = `#${view}`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarVisualization;
