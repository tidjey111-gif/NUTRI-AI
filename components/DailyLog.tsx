import React from 'react';
import { LogEntry } from '../types';
import { Trash2, Utensils } from 'lucide-react';

interface DailyLogProps {
  log: LogEntry[];
  onRemove: (id: string) => void;
}

export const DailyLog: React.FC<DailyLogProps> = ({ log, onRemove }) => {
  const totals = log.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
      carbs: acc.carbs + item.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  if (log.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed">
        <Utensils size={48} className="mx-auto mb-4 opacity-20" />
        <p>Ваш журнал питания пуст.</p>
        <p className="text-sm">Добавьте продукты, чтобы увидеть статистику за день.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h3 className="font-semibold text-gray-700">Итого за сегодня</h3>
        <div className="grid grid-cols-4 gap-2 mt-2 text-center">
          <div className="bg-white p-2 rounded shadow-sm">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Ккал</div>
            <div className="font-bold text-gray-900">{Math.round(totals.calories)}</div>
          </div>
          <div className="bg-blue-50 p-2 rounded shadow-sm border border-blue-100">
            <div className="text-xs text-blue-600 uppercase tracking-wide">Белки</div>
            <div className="font-bold text-blue-900">{Math.round(totals.protein)}</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded shadow-sm border border-yellow-100">
            <div className="text-xs text-yellow-600 uppercase tracking-wide">Жиры</div>
            <div className="font-bold text-yellow-900">{Math.round(totals.fat)}</div>
          </div>
          <div className="bg-green-50 p-2 rounded shadow-sm border border-green-100">
            <div className="text-xs text-green-600 uppercase tracking-wide">Угли</div>
            <div className="font-bold text-green-900">{Math.round(totals.carbs)}</div>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {log.slice().reverse().map((entry) => (
          <div key={entry.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors group">
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-sm font-medium text-gray-900 truncate capitalize">{entry.name}</h4>
              <p className="text-xs text-gray-500">
                {entry.calories} ккал • Б:{entry.protein} Ж:{entry.fat} У:{entry.carbs}
              </p>
            </div>
            <button
              onClick={() => onRemove(entry.id)}
              className="text-gray-300 hover:text-red-500 p-2 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Удалить"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};