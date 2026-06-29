import { useState, useEffect } from 'react';
import { CalendarEvent } from '@sphere/domain';

export function useCalendar(userID: string) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (startDate: string, endDate: string) => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getCalendarEvents(userID, startDate, endDate);
      if (result.success) {
        setEvents(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch calendar events');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const syncCalendar = async (source: 'google' | 'outlook' | 'apple', startDate: string, endDate: string) => {
    try {
      const result = await window.electronAPI.syncCalendar(userID, source, startDate, endDate);
      if (result.success) {
        await fetchEvents(startDate, endDate);
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    fetchEvents(start, end);
  }, [userID]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    syncCalendar,
  };
}