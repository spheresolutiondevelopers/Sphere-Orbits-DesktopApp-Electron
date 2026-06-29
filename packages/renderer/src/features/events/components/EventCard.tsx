import React from 'react';
import { Event } from '@sphere/domain';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const statusColor = {
    planned: 'bg-yellow-400/20 text-yellow-400',
    ongoing: 'bg-green-400/20 text-green-400',
    completed: 'bg-gray-400/20 text-gray-400',
    cancelled: 'bg-red-400/20 text-red-400',
  }[event.status];

  return (
    <div className="bg-sphere-panel rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-white">{event.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
          {event.status}
        </span>
      </div>

      {event.planningNotes && (
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{event.planningNotes}</p>
      )}

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
        {event.startDateTime && (
          <span>
            📅 {new Date(event.startDateTime).toLocaleDateString()} at{' '}
            {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        {event.format && <span>📋 {event.format}</span>}
        {event.categoryID && <span>🏷️ Category</span>}
      </div>
    </div>
  );
}