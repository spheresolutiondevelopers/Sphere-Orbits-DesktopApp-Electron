import React from 'react';

interface FilterBarProps {
  filters: { status: string; priority: string };
  onFilterChange: (filters: any) => void;
}

export function TaskFilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={filters.status}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        className="bg-sphere-panel border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select
        value={filters.priority}
        onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
        className="bg-sphere-panel border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white"
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  );
}