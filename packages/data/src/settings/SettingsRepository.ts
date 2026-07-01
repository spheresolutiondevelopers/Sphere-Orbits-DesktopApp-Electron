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
        return ok(this.getDefaultSettings());
      }
      return ok(settings);
    } catch (error: any) {
      return err(error);
    }
  }

  async updateSettings(userID: string, updates: Partial<Settings>): Promise<Result<Settings, Error>> {
    try {
      const validation = SettingsSchema.partial().safeParse(updates);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      const currentResult = await this.getSettings(userID);
      if (currentResult.isFailure()) {
        return err(currentResult.error);
      }

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

      // Create a Settings instance using the constructor
      const settingsInstance = new Settings(
        merged.theme,
        merged.notificationsEnabled,
        merged.pushNotifications,
        merged.emailNotifications,
        merged.googleCalendarSync,
        merged.outlookCalendarSync,
        merged.appleCalendarSync,
        merged.language,
        merged.timezone,
        merged.defaultView,
        merged.compactMode,
        merged.reminderDefaultMinutes,
        merged.shareUsageData,
        merged.preferences
      );

      const saved = this.settingsStore.saveSettings(userID, settingsInstance);
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
    return new Settings(
      'system',                          // theme
      true,                              // notificationsEnabled
      true,                              // pushNotifications
      true,                              // emailNotifications
      false,                             // googleCalendarSync
      false,                             // outlookCalendarSync
      false,                             // appleCalendarSync
      'en',                              // language
      'UTC',                             // timezone
      'day',                             // defaultView
      false,                             // compactMode
      15,                                // reminderDefaultMinutes
      true,                              // shareUsageData
      {}                                 // preferences
    );
  }
}