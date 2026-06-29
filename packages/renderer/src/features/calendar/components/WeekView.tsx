import React from 'react';
import { CalendarEvent } from '@sphere/domain';

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
}

export function WeekView({ date, events }: WeekViewProps) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (day: Date, hour: number) => {
    const dayStr = day.toISOString().split('T')[0];
    const hourStr = String(hour).padStart(2, '0');
    return events.filter((e) => {
      const eventDate = e.startDateTime.split('T')[0];
      const eventHour = parseInt(e.startDateTime.split('T')[1].split(':')[0]);
      return eventDate === dayStr && eventHour === hour;
    });
  };

  return (
    <div className="bg-sphere-panel rounded-xl border border-white/5 overflow-hidden">
      <div className="grid grid-cols-8 border-b border-white/5">
        <div className="py-2 px-2 text-xs text-gray-400">Time</div>
        {days.map((d, i) => (
          <div key={i} className="py-2 px-2 text-center text-xs text-gray-300">
            {d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
          </div>
        ))}
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-white/5 min-h-[50px]">
            <div className="py-1 px-2 text-xs text-gray-400 text-right">
              {String(hour).padStart(2, '0')}:00
            </div>
            {days.map((day, i) => {
              const dayEvents = getEventsForHour(day, hour);
              return (
                <div key={i} className="py-1 px-1 border-l border-white/5 min-h-[50px]">
                  {dayEvents.map((e) => (
                    <div
                      key={e.id}
                      className="text-[10px] px-1 py-0.5 rounded bg-sphere-purple/20 text-sphere-purple truncate"
                      title={e.title}
                    >
                      {e.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}