import { Result, SettingsSchema } from '@sphere/shared';
import { Settings, ISettingsRepository } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { SettingsStore } from './datastore/SettingsStore';

export class SettingsRepository implements ISettingsRepository {
  private settingsStore: SettingsStore;

  constructor(db: DatabaseClient) {
    this.settingsStore = new SettingsStore(db);
  }

  async getSettings(userID: string): Promise<Result<Settings, Error>> {
    try {
      const settings = await this.settingsStore.getSettings(userID);
      if (!settings) {
        // Return default settings if not found
        return Result.ok(this.getDefaultSettings());
      }
      return Result.ok(settings);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async updateSettings(userID: string, updates: Partial<Settings>): Promise<Result<Settings, Error>> {
    try {
      // Validate partial updates
      const validation = SettingsSchema.partial().safeParse(updates);
      if (!validation.success) {
        return Result.err(new Error(validation.error.message));
      }

      const currentSettings = await this.getSettings(userID);
      if (currentSettings.isFailure()) {
        return Result.err(currentSettings.error);
      }

      const merged = { ...currentSettings.value, ...updates };
      const saved = await this.settingsStore.saveSettings(userID, merged);
      return Result.ok(saved);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async resetSettings(userID: string): Promise<Result<Settings, Error>> {
    try {
      const defaultSettings = this.getDefaultSettings();
      const saved = await this.settingsStore.saveSettings(userID, defaultSettings);
      return Result.ok(saved);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  private getDefaultSettings(): Settings {
    return {
      theme: 'system',
      notificationsEnabled: true,
      pushNotifications: true,
      emailNotifications: true,
      googleCalendarSync: false,
      outlookCalendarSync: false,
      appleCalendarSync: false,
      language: 'en',
      timezone: 'UTC',
      defaultView: 'day',
      compactMode: false,
      reminderDefaultMinutes: 15,
      shareUsageData: true,
      preferences: {},
    };
  }
}