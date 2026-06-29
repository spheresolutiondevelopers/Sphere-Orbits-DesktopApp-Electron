import { useCallback } from 'react';

export function useIpc() {
  const invoke = useCallback(async <T = any>(channel: string, ...args: any[]): Promise<{ success: boolean; data?: T; error?: string }> => {
    try {
      const result = await window.electronAPI[channel](...args);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  return { invoke };
}