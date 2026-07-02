import React from 'react';
import { CalendarEvent } from '@sphere/domain';

interface AgendaViewProps {
  events: CalendarEvent[];
}

export function AgendaView({ events }: AgendaViewProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );

  return (
    <div className="bg-sphere-panel rounded-xl border border-white/5 p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Agenda</h3>
      {sortedEvents.length === 0 ? (
        <div className="text-gray-400 text-sm">No events scheduled</div>
      ) : (
        <div className="space-y-3">
          {sortedEvents.map((e) => (
            <div key={e.id} className="flex gap-4 border-b border-white/5 pb-3">
              <div className="min-w-[80px] text-sm text-gray-400">
                {new Date(e.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div>
                <div className="font-medium text-white">{e.title}</div>
                {e.description && <div className="text-sm text-gray-400">{e.description}</div>}
                {e.location && <div className="text-xs text-gray-500 mt-1">📍 {e.location}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}