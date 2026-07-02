import React from 'react';
import { CalendarEvent } from '@sphere/domain';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
}

export function MonthView({ date, events }: MonthViewProps) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cells: (number | null)[] = [];

  // Previous month days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(prevMonthDays - i);
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push(i);
  }

  // Next month days
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push(i);
  }

  const getEventsForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.startDateTime.startsWith(dateStr));
  };

  return (
    <div className="bg-sphere-panel rounded-xl border border-white/5 overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-white/5">
        {days.map((d) => (
          <div key={d} className="text-center py-2 text-xs font-medium text-gray-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-white/5">
        {cells.map((day, i) => {
          const isCurrentMonth = i >= firstDay && i < firstDay + daysInMonth;
          const isToday =
            day === todayDate &&
            month === todayMonth &&
            year === todayYear &&
            isCurrentMonth;
          const dayEvents = getEventsForDay(day as number, isCurrentMonth);

          return (
            <div
              key={i}
              className={`min-h-[80px] p-1 bg-sphere-panel ${
                !isCurrentMonth ? 'opacity-40' : ''
              } ${isToday ? 'bg-sphere-purple/10' : ''}`}
            >
              <div className={`text-xs font-medium ${isToday ? 'text-sphere-purple' : 'text-gray-300'}`}>
                {day}
              </div>
              <div className="mt-1 flex flex-col gap-0.5">
                {dayEvents.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="text-[10px] px-1 py-0.5 rounded bg-sphere-purple/20 text-sphere-purple truncate"
                    title={e.title}
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-gray-400">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}