import React from 'react';
import { cn } from '../../utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export function StatCard({ title, value, icon, color = 'blue', trend, trendValue }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border p-4', colorMap[color])}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        {trend && trendValue && (
          <span
            className={cn(
              'text-xs font-medium',
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
            )}
          >
            {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}