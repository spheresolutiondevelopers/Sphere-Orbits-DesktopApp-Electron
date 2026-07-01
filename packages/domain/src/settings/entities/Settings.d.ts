import { Settings as SettingsDTO } from '@sphere/shared';
export declare class Settings {
    theme: 'dark' | 'light' | 'system';
    notificationsEnabled: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    googleCalendarSync: boolean;
    outlookCalendarSync: boolean;
    appleCalendarSync: boolean;
    language: string;
    timezone: string;
    defaultView: 'day' | 'week' | 'month';
    compactMode: boolean;
    reminderDefaultMinutes: number;
    shareUsageData: boolean;
    preferences?: Record<string, any> | undefined;
    constructor(theme: 'dark' | 'light' | 'system', notificationsEnabled: boolean, pushNotifications: boolean, emailNotifications: boolean, googleCalendarSync: boolean, outlookCalendarSync: boolean, appleCalendarSync: boolean, language: string, timezone: string, defaultView: 'day' | 'week' | 'month', compactMode: boolean, reminderDefaultMinutes: number, shareUsageData: boolean, preferences?: Record<string, any> | undefined);
    /**
     * Factory method to create Settings from a DTO.
     */
    static fromDTO(dto: SettingsDTO): Settings;
    /**
     * Converts this Settings to a DTO.
     */
    toDTO(): SettingsDTO;
    /**
     * Updates the settings. Only defined fields are updated.
     */
    update(updates: Partial<Omit<Settings, 'preferences'>> & {
        preferences?: Record<string, any>;
    }): void;
    /**
     * Gets a preference value by key.
     */
    getPreference<T>(key: string, defaultValue: T): T;
    /**
     * Sets a preference value.
     */
    setPreference(key: string, value: any): void;
}
//# sourceMappingURL=Settings.d.ts.map