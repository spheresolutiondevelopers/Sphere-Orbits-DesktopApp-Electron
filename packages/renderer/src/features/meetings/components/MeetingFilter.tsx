import React, { useState } from 'react';

export function MeetingFilter() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="flex gap-2 flex-wrap">
      {['all', 'scheduled', 'live', 'ended', 'cancelled'].map((status) => (
        <button
          key={status}
          onClick={() => setFilter(status)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            filter === status
              ? 'bg-sphere-purple text-white'
              : 'bg-sphere-panel text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
}