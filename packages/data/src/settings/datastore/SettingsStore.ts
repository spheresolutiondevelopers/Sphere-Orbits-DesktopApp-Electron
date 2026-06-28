import { DatabaseClient } from '../../database/DatabaseClient';
import { Settings } from '@sphere/domain';

export class SettingsStore {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Gets settings for a user from the database.
   */
  getSettings(userID: string): Settings | null {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        theme, notifications_enabled, push_notifications,
        email_notifications, google_calendar_sync, outlook_calendar_sync,
        apple_calendar_sync, language, timezone, default_view,
        compact_mode, reminder_default_minutes, share_usage_data, preferences
      FROM user_settings
      WHERE user_id = ?
    `);
    const row = stmt.get(userID) as any;
    if (!row) return null;

    return {
      theme: row.theme,
      notificationsEnabled: row.notifications_enabled === 1,
      pushNotifications: row.push_notifications === 1,
      emailNotifications: row.email_notifications === 1,
      googleCalendarSync: row.google_calendar_sync === 1,
      outlookCalendarSync: row.outlook_calendar_sync === 1,
      appleCalendarSync: row.apple_calendar_sync === 1,
      language: row.language,
      timezone: row.timezone,
      defaultView: row.default_view,
      compactMode: row.compact_mode === 1,
      reminderDefaultMinutes: row.reminder_default_minutes,
      shareUsageData: row.share_usage_data === 1,
      preferences: row.preferences ? JSON.parse(row.preferences) : {},
    };
  }

  /**
   * Saves settings for a user (upsert).
   */
  saveSettings(userID: string, settings: Settings): Settings {
    const db = this.db.getDB();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO user_settings (
        user_id, theme, notifications_enabled, push_notifications,
        email_notifications, google_calendar_sync, outlook_calendar_sync,
        apple_calendar_sync, language, timezone, default_view,
        compact_mode, reminder_default_minutes, share_usage_data, preferences,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      userID,
      settings.theme,
      settings.notificationsEnabled ? 1 : 0,
      settings.pushNotifications ? 1 : 0,
      settings.emailNotifications ? 1 : 0,
      settings.googleCalendarSync ? 1 : 0,
      settings.outlookCalendarSync ? 1 : 0,
      settings.appleCalendarSync ? 1 : 0,
      settings.language,
      settings.timezone,
      settings.defaultView,
      settings.compactMode ? 1 : 0,
      settings.reminderDefaultMinutes,
      settings.shareUsageData ? 1 : 0,
      settings.preferences ? JSON.stringify(settings.preferences) : '{}',
      now
    );

    return settings;
  }
}