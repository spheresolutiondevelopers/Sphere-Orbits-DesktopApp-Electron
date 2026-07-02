import React from 'react';

interface BarChartProps {
  data: { date: string; tasks: number; focus: number }[];
}

export function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.tasks, d.focus)), 1);

  return (
    <div className="flex items-end gap-2 h-48 mt-4">
      {data.map((day, i) => {
        const tasksHeight = (day.tasks / maxValue) * 100;
        const focusHeight = (day.focus / maxValue) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex gap-1 w-full justify-center">
              <div className="relative flex flex-col items-center w-4">
                <div
                  className="w-3 bg-sphere-purple/70 rounded-t transition-all duration-500"
                  style={{ height: `${Math.max(tasksHeight, 2)}%` }}
                />
                <span className="text-[8px] text-gray-400 mt-1">T</span>
              </div>
              <div className="relative flex flex-col items-center w-4">
                <div
                  className="w-3 bg-sphere-teal/70 rounded-t transition-all duration-500"
                  style={{ height: `${Math.max(focusHeight, 2)}%` }}
                />
                <span className="text-[8px] text-gray-400 mt-1">F</span>
              </div>
            </div>
            <span className="text-[10px] text-gray-400 truncate max-w-[40px]">
              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        );
      })}
    </div>
  );
}