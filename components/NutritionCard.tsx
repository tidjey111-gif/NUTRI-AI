import React from 'react';
import { NutritionData } from '../types';
import { PlusCircle, Info } from 'lucide-react';

interface NutritionCardProps {
  data: NutritionData;
  onAdd: () => void;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ data, onAdd }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{data.name}</h2>
            <p className="text-gray-500 text-sm">{data.description || `${data.weight_g}г`}</p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle size={20} />
            <span>Добавить</span>
          </button>
        </div>

        <div className="border-t-4 border-black my-2"></div>
        
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-3xl font-black text-gray-900">Калории</span>
          <span className="text-4xl font-black text-gray-900">{data.calories}</span>
        </div>

        <div className="border-t border-gray-300 my-2"></div>

        <div className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Белки
            </span>
            <span className="font-mono font-medium">{data.protein}г</span>
          </div>
          <div className="border-t border-gray-100"></div>
          
          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              Жиры
            </span>
            <span className="font-mono font-medium">{data.fat}г</span>
          </div>
          <div className="border-t border-gray-100"></div>

          <div className="flex justify-between items-center py-1">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Углеводы
            </span>
            <span className="font-mono font-medium">{data.carbs}г</span>
          </div>
        </div>
        
        <div className="border-t-4 border-black mt-4 mb-2"></div>
        
        <div className="flex items-start gap-2 text-xs text-gray-400 mt-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>Значения являются приблизительными и основаны на оценке ИИ. Проверяйте информацию для медицинских целей.</p>
        </div>
      </div>
    </div>
  );
};