import { useState, useEffect } from 'react';
import { Event } from '@sphere/domain';

export function useEvents(userID: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getEvents(userID);
      if (result.success) {
        setEvents(result.data.items || []);
      } else {
        setError(result.error || 'Failed to fetch events');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const result = await window.electronAPI.createEvent(eventData);
      if (result.success) {
        setEvents((prev) => [result.data, ...prev]);
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateEvent = async (eventID: string, updates: Partial<Event>) => {
    try {
      const result = await window.electronAPI.updateEvent(eventID, updates);
      if (result.success) {
        setEvents((prev) => prev.map((e) => (e.eventID === eventID ? result.data : e)));
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteEvent = async (eventID: string) => {
    try {
      const result = await window.electronAPI.deleteEvent(eventID, userID);
      if (result.success) {
        setEvents((prev) => prev.filter((e) => e.eventID !== eventID));
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userID]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}