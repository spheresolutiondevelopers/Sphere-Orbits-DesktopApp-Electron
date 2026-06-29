import { useState, useEffect } from 'react';
import { Settings } from '@sphere/domain';

export function useSettings(userID: string) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getSettings(userID);
      if (result.success) {
        setSettings(result.data);
      } else {
        setError(result.error || 'Failed to fetch settings');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const result = await window.electronAPI.updateSettings(userID, updates);
      if (result.success) {
        setSettings(result.data);
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [userID]);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings,
  };
}