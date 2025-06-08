import React from 'react';
import type { CarPart } from '../../types/api.types';


interface DamageCardProps {
  partId: string;
  damage: CarPart;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const DamageCard: React.FC<DamageCardProps> = ({
  partId,
  damage,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  const getDamageGradient = (quality: number): string => {
    // Create gradient from gray to yellow to red based on damage quality
    if (quality < 1) {
      // Severe damage - red gradient
      return 'border-red-200 text-red-800';
    } else if (quality < 2) {
      // Moderate damage - orange gradient
      return 'border-orange-200 text-orange-800';
    } else if (quality < 3) {
      // Light damage - yellow gradient
      return 'border-yellow-200 text-yellow-800';
    } else {
      // No significant damage - gray gradient
      return 'border-gray-200 text-gray-800';
    }
  };

  const getDamageIcon = (quality: number): string => {
    // Return icon class based on damage quality
    if (quality < 1) {
      return 'bg-red-500';
    } else if (quality < 2) {
      return 'bg-orange-500';
    } else if (quality < 3) {
      return 'bg-yellow-500';
    } else {
      return 'bg-gray-500';
    }
  };

  const getDefectText = (defect: string): string => {
    const defectMap: Record<string, string> = {
      'Dent': 'Вмятина',
      'Scratch': 'Царапина',
      'Cracked': 'Трещина',
      'Flaking': 'Отслоение',
      'Broken part': 'Сломанная деталь',
      'Paint chip': 'Отсутствие краски',
      'Missing part': 'Отсутствующая деталь',
      'Corrosion': 'Коррозия',
    };
    return defectMap[defect] || defect;
  }

  const getPartText = (partId: string): string => {
    const partsMap: Record<string, string> = {
      'Windshield': 'Лобовое стекло',
      'Back-windshield': 'Заднее стекло',
      'Left-Front-window': 'Левое переднее окно',
      'Left-Back-window': 'Левое заднее окно',
      'Left-Front-door': 'Левая передняя дверь',
      'Left-Back-door': 'Левая задняя дверь',
      'Left-Front-wheel': 'Левое переднее колесо',
      'Left-Back-wheel': 'Левое заднее колесо',
      'Right-Front-window': 'Правое переднее окно',
      'Right-Back-window': 'Правое заднее окно',
      'Right-Front-door': 'Правая передняя дверь',
      'Right-Back-door': 'Правая задняя дверь',
      'Right-Front-wheel': 'Правое переднее колесо',
      'Right-Back-wheel': 'Правое заднее колесо',
      'Front-bumper': 'Передний бампер',
      'Back-bumper': 'Задний бампер',
      'Left-Headlight': 'Левая фара',
      'Left-Tail-light': 'Левый задний фонарь',
      'Right-Headlight': 'Правая фара',
      'Right-Tail-light': 'Правый задний фонарь',
      'Hood': 'Капот',
      'Trunk': 'Багажник',
      'License-plate': 'Номерной знак',
      'Left-Mirror': 'Левое зеркало',
      'Right-Mirror': 'Правое зеркало',
      'Roof': 'Крыша',
      'Grille': 'Решётка радиатора',
      'Left-Rocker-panel': 'Левая пороговая панель',
      'Left-Quarter-panel': 'Левое заднее крыло',
      'Left-Fender': 'Левое переднее крыло',
      'Right-Rocker-panel': 'Правая пороговая панель',
      'Right-Quarter-panel': 'Правое заднее крыло',
      'Right-Fender': 'Правое переднее крыло',
    };
    return partsMap[partId] || partId.replace(/-/g, ' ');
  }

  console.log('DamageCard rendered for part:', partId, 'with damage:', damage);

  return (
    <div 
      className={`bg-white border rounded-lg p-4 transition-all duration-300 ${
        isHovered ? 'shadow-md' : 'shadow-sm'
      } ${getDamageGradient(damage.quality)}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-start">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${getDamageIcon(damage.quality)}`}>
          {index + 1}
        </div>
        <div className="ml-3">
          <h4 className="font-medium capitalize text-left">{getPartText(partId)}</h4>
          <p className="text-sm mt-1 text-left">{damage.defects.map(defect => getDefectText(defect)).join(' / ')}</p>
          <p className="text-sm mt-2 text-left">
            {damage.quality >= 3 ? 'Лёгкие повреждения' : 'Серьёзные повреждения'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DamageCard;
