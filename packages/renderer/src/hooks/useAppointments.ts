import { useState, useEffect } from 'react';
import { Appointment } from '@sphere/domain';

export function useAppointments(userID: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getAppointments(userID);
      if (result.success) {
        setAppointments(result.data.items || []);
      } else {
        setError(result.error || 'Failed to fetch appointments');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createAppointment = async (appointmentData: any) => {
    try {
      const result = await window.electronAPI.createAppointment(appointmentData);
      if (result.success) {
        setAppointments((prev) => [result.data, ...prev]);
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateAppointment = async (appointmentID: string, updates: Partial<Appointment>) => {
    try {
      const result = await window.electronAPI.updateAppointment(appointmentID, updates);
      if (result.success) {
        setAppointments((prev) => prev.map((a) => (a.appointmentID === appointmentID ? result.data : a)));
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAppointment = async (appointmentID: string) => {
    try {
      const result = await window.electronAPI.deleteAppointment(appointmentID, userID);
      if (result.success) {
        setAppointments((prev) => prev.filter((a) => a.appointmentID !== appointmentID));
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const checkConflicts = async (startDateTime: string, endDateTime: string, excludeID?: string) => {
    try {
      const result = await window.electronAPI.checkAppointmentConflicts(userID, startDateTime, endDateTime, excludeID);
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userID]);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    checkConflicts,
  };
}