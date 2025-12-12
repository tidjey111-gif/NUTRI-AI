import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionData } from '../types';

interface MacroChartProps {
  data: NutritionData;
}

export const MacroChart: React.FC<MacroChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Белки', value: data.protein, color: '#3b82f6' }, // blue-500
    { name: 'Жиры', value: data.fat, color: '#eab308' },    // yellow-500
    { name: 'Углеводы', value: data.carbs, color: '#22c55e' } // green-500
  ].filter(item => item.value > 0);

  // Calculate percentages for tooltip
  const total = data.protein + data.fat + data.carbs;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="font-bold" style={{ color: item.color }}>{item.name}</p>
          <p className="text-gray-600">{item.value}г ({percent}%)</p>
        </div>
      );
    }
    return null;
  };

  if (total === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};