"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
class Settings {
    constructor(theme, notificationsEnabled, pushNotifications, emailNotifications, googleCalendarSync, outlookCalendarSync, appleCalendarSync, language, timezone, defaultView, compactMode, reminderDefaultMinutes, shareUsageData, preferences) {
        this.theme = theme;
        this.notificationsEnabled = notificationsEnabled;
        this.pushNotifications = pushNotifications;
        this.emailNotifications = emailNotifications;
        this.googleCalendarSync = googleCalendarSync;
        this.outlookCalendarSync = outlookCalendarSync;
        this.appleCalendarSync = appleCalendarSync;
        this.language = language;
        this.timezone = timezone;
        this.defaultView = defaultView;
        this.compactMode = compactMode;
        this.reminderDefaultMinutes = reminderDefaultMinutes;
        this.shareUsageData = shareUsageData;
        this.preferences = preferences;
    }
    /**
     * Factory method to create Settings from a DTO.
     */
    static fromDTO(dto) {
        return new Settings(dto.theme, dto.notificationsEnabled, dto.pushNotifications, dto.emailNotifications, dto.googleCalendarSync, dto.outlookCalendarSync, dto.appleCalendarSync, dto.language, dto.timezone, dto.defaultView, dto.compactMode, dto.reminderDefaultMinutes, dto.shareUsageData, dto.preferences);
    }
    /**
     * Converts this Settings to a DTO.
     */
    toDTO() {
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
    update(updates) {
        Object.assign(this, updates);
    }
    /**
     * Gets a preference value by key.
     */
    getPreference(key, defaultValue) {
        if (!this.preferences)
            return defaultValue;
        return this.preferences[key] ?? defaultValue;
    }
    /**
     * Sets a preference value.
     */
    setPreference(key, value) {
        if (!this.preferences) {
            this.preferences = {};
        }
        this.preferences[key] = value;
    }
}
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map