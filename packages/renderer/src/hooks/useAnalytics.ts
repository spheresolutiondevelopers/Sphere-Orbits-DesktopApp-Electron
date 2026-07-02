import { useState, useEffect } from 'react';
import { AnalyticsData } from '@sphere/domain';

export function useAnalytics(userID: string, startDate: string, endDate: string) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!userID) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.getAnalyticsData(userID, startDate, endDate);
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Failed to fetch analytics');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (format: 'json' | 'pdf' | 'csv') => {
    try {
      const result = await window.electronAPI.generateReport(userID, {
        type: 'custom',
        startDate,
        endDate,
        format,
      });
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getProductivityScore = async (date?: string) => {
    try {
      const result = await window.electronAPI.getProductivityScore(userID, date);
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
    fetchAnalytics();
  }, [userID, startDate, endDate]);

  return {
    data,
    isLoading,
    error,
    fetchAnalytics,
    generateReport,
    getProductivityScore,
  };
}