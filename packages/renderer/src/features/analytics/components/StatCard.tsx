import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export function StatCard({ label, value, color = 'blue' }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}