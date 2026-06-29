import React, { useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useCalendar } from '../features/calendar/hooks/useCalendar';
import { MonthView } from '../features/calendar/components/MonthView';
import { WeekView } from '../features/calendar/components/WeekView';
import { AgendaView } from '../features/calendar/components/AgendaView';
import { Button } from '../components/ui/Button';

type ViewType = 'month' | 'week' | 'agenda';

export function CalendarPage() {
  const { user } = useAuth();
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events, isLoading } = useCalendar(user?.userID || '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <p className="text-sm text-gray-400 mt-1">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate((d) => new Date(d.setMonth(d.getMonth() - 1)))}>
            ←
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate((d) => new Date(d.setMonth(d.getMonth() + 1)))}>
            →
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/10 pb-2">
        {(['month', 'week', 'agenda'] as ViewType[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              view === v ? 'bg-sphere-purple text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-gray-400">Loading calendar...</div>
      ) : (
        <>
          {view === 'month' && <MonthView date={currentDate} events={events || []} />}
          {view === 'week' && <WeekView date={currentDate} events={events || []} />}
          {view === 'agenda' && <AgendaView events={events || []} />}
        </>
      )}
    </div>
  );
}