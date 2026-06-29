import { IpcMain } from 'electron';
import { SettingsRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerSettingsHandlers(ipcMain: IpcMain, settingsRepo: SettingsRepository): void {
  // Get settings
  ipcMain.handle(IPC_CHANNELS.SETTINGS_GET, async (_, userID: string) => {
    const result = await settingsRepo.getSettings(userID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Update settings
  ipcMain.handle(IPC_CHANNELS.SETTINGS_UPDATE, async (_, userID: string, updates: any) => {
    const result = await settingsRepo.updateSettings(userID, updates);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });
}