import { Settings as SettingsDTO } from '@sphere/shared';

export class Settings {
  constructor(
    public theme: 'dark' | 'light' | 'system',
    public notificationsEnabled: boolean,
    public pushNotifications: boolean,
    public emailNotifications: boolean,
    public googleCalendarSync: boolean,
    public outlookCalendarSync: boolean,
    public appleCalendarSync: boolean,
    public language: string,
    public timezone: string,
    public defaultView: 'day' | 'week' | 'month',
    public compactMode: boolean,
    public reminderDefaultMinutes: number,
    public shareUsageData: boolean,
    public preferences?: Record<string, any>
  ) {}

  /**
   * Factory method to create Settings from a DTO.
   */
  static fromDTO(dto: SettingsDTO): Settings {
    return new Settings(
      dto.theme,
      dto.notificationsEnabled,
      dto.pushNotifications,
      dto.emailNotifications,
      dto.googleCalendarSync,
      dto.outlookCalendarSync,
      dto.appleCalendarSync,
      dto.language,
      dto.timezone,
      dto.defaultView,
      dto.compactMode,
      dto.reminderDefaultMinutes,
      dto.shareUsageData,
      dto.preferences
    );
  }

  /**
   * Converts this Settings to a DTO.
   */
  toDTO(): SettingsDTO {
    return {
      theme: this.theme,
      notificationsEnabled: this.notificationsEnabled,
      pushNotifications: this.pushNotifications,
      emailNotifications: this.emailNotifications,
      googleCalendarSync: this.googleCalendarSync,
      outlookCalendarSync: this.outlookCalendarSync,
      appleCalendarSync: this.appleCalendarSync,
      language: this.language,
      timezone: this.timezone,
      defaultView: this.defaultView,
      compactMode: this.compactMode,
      reminderDefaultMinutes: this.reminderDefaultMinutes,
      shareUsageData: this.shareUsageData,
      preferences: this.preferences,
    };
  }

  /**
   * Updates the settings. Only defined fields are updated.
   */
  update(updates: Partial<Omit<Settings, 'preferences'>> & { preferences?: Record<string, any> }): void {
    Object.assign(this, updates);
  }

  /**
   * Gets a preference value by key.
   */
  getPreference<T>(key: string, defaultValue: T): T {
    if (!this.preferences) return defaultValue;
    return (this.preferences[key] as T) ?? defaultValue;
  }

  /**
   * Sets a preference value.
   */
  setPreference(key: string, value: any): void {
    if (!this.preferences) {
      this.preferences = {};
    }
    this.preferences[key] = value;
  }
}