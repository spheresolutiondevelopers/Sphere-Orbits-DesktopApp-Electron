export interface Settings {
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
  preferences?: Record<string, any>;
}