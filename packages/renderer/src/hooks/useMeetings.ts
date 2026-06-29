import { useState, useEffect } from 'react';
import { Meeting } from '@sphere/domain';

export function useMeetings(userID: string) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getMeetings(userID);
      if (result.success) {
        setMeetings(result.data.items || []);
      } else {
        setError(result.error || 'Failed to fetch meetings');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createMeeting = async (meetingData: any) => {
    try {
      const result = await window.electronAPI.createMeeting(meetingData);
      if (result.success) {
        setMeetings((prev) => [result.data, ...prev]);
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateMeeting = async (meetingID: string, updates: Partial<Meeting>) => {
    try {
      const result = await window.electronAPI.updateMeeting(meetingID, updates);
      if (result.success) {
        setMeetings((prev) => prev.map((m) => (m.meetingID === meetingID ? result.data : m)));
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteMeeting = async (meetingID: string) => {
    try {
      const result = await window.electronAPI.deleteMeeting(meetingID, userID);
      if (result.success) {
        setMeetings((prev) => prev.filter((m) => m.meetingID !== meetingID));
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const joinMeeting = async (meetingID: string, email: string, name: string) => {
    try {
      const result = await window.electronAPI.joinMeeting(meetingID, userID, email, name);
      if (result.success) {
        return result.data.meetingLink;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [userID]);

  return {
    meetings,
    isLoading,
    error,
    fetchMeetings,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    joinMeeting,
  };
}