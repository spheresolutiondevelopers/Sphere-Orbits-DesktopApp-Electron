import { IpcMain } from 'electron';
import { AnalyticsRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerAnalyticsHandlers(ipcMain: IpcMain, analyticsRepo: AnalyticsRepository): void {
  // Generate report
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GENERATE, async (_, userID: string, options: any) => {
    const result = await analyticsRepo.generateReport(userID, options);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Get productivity score
  ipcMain.handle(IPC_CHANNELS.ANALYTICS_GET_SCORE, async (_, userID: string, date?: string) => {
    const result = await analyticsRepo.getProductivityScore(userID, date);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });
}