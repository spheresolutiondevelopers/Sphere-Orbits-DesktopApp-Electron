import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useAnalytics } from '../features/analytics/hooks/useAnalytics';
import { StatCard } from '../features/analytics/components/StatCard';
import { BarChart } from '../features/analytics/components/BarChart';
import { ReportExport } from '../features/analytics/components/ReportExport';

export function AnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({ start: '2026-06-01', end: '2026-06-28' });
  const { data, isLoading } = useAnalytics(user?.userID || '', dateRange.start, dateRange.end);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Track your productivity and insights</p>
      </div>

      <div className="flex gap-4 items-center">
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange((d) => ({ ...d, start: e.target.value }))}
          className="bg-sphere-panel border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange((d) => ({ ...d, end: e.target.value }))}
          className="bg-sphere-panel border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
        />
        <ReportExport data={data} />
      </div>

      {isLoading ? (
        <div className="text-gray-400">Loading analytics...</div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Productivity Score" value={`${data.productivityScore}%`} color="green" />
            <StatCard label="Tasks Completed" value={data.tasksCompleted} color="blue" />
            <StatCard label="Completion Rate" value={`${data.completionRate.toFixed(1)}%`} color="purple" />
            <StatCard label="Focus Hours" value={data.totalFocusHours.toFixed(1)} color="orange" />
          </div>

          <div className="bg-sphere-panel rounded-xl p-4 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Activity</h3>
            <BarChart
              data={data.dailyActivity.map((day) => ({
                date: day.date,
                tasks: day.tasksCompleted,
                focus: day.focusHours,
              }))}
            />
          </div>

          <div className="bg-sphere-panel rounded-xl p-4 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(data.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-300">{category}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-400">No data available</div>
      )}
    </div>
  );
}