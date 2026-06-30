import { ok, err, type Result, SettingsSchema } from '@sphere/shared';
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
      const settings = this.settingsStore.getSettings(userID);
      if (!settings) {
        // Return default settings if not found
        return ok(this.getDefaultSettings());
      }
      return ok(settings);
    } catch (error: any) {
      return err(error);
    }
  }

  async updateSettings(userID: string, updates: Partial<Settings>): Promise<Result<Settings, Error>> {
    try {
      // Validate partial updates
      const validation = SettingsSchema.partial().safeParse(updates);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      const currentResult = await this.getSettings(userID);
      if (currentResult.isFailure()) {
        return err(currentResult.error);
      }

      // Merge current settings with updates
      const current = currentResult.value;
      const merged = {
        theme: updates.theme || current.theme,
        notificationsEnabled: updates.notificationsEnabled ?? current.notificationsEnabled,
        pushNotifications: updates.pushNotifications ?? current.pushNotifications,
        emailNotifications: updates.emailNotifications ?? current.emailNotifications,
        googleCalendarSync: updates.googleCalendarSync ?? current.googleCalendarSync,
        outlookCalendarSync: updates.outlookCalendarSync ?? current.outlookCalendarSync,
        appleCalendarSync: updates.appleCalendarSync ?? current.appleCalendarSync,
        language: updates.language || current.language,
        timezone: updates.timezone || current.timezone,
        defaultView: updates.defaultView || current.defaultView,
        compactMode: updates.compactMode ?? current.compactMode,
        reminderDefaultMinutes: updates.reminderDefaultMinutes ?? current.reminderDefaultMinutes,
        shareUsageData: updates.shareUsageData ?? current.shareUsageData,
        preferences: updates.preferences ? { ...current.preferences, ...updates.preferences } : current.preferences,
      };

      const saved = this.settingsStore.saveSettings(userID, merged);
      return ok(saved);
    } catch (error: any) {
      return err(error);
    }
  }

  async resetSettings(userID: string): Promise<Result<Settings, Error>> {
    try {
      const defaultSettings = this.getDefaultSettings();
      const saved = this.settingsStore.saveSettings(userID, defaultSettings);
      return ok(saved);
    } catch (error: any) {
      return err(error);
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
    } as Settings;
  }
}