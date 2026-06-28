import { z } from 'zod';

export const SettingsSchema = z.object({
  // Theme
  theme: z.enum(['dark', 'light', 'system']).default('system'),
  
  // Notifications
  notificationsEnabled: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  
  // Calendar sync
  googleCalendarSync: z.boolean().default(false),
  outlookCalendarSync: z.boolean().default(false),
  appleCalendarSync: z.boolean().default(false),
  
  // Language
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  
  // Display
  defaultView: z.enum(['day', 'week', 'month']).default('day'),
  compactMode: z.boolean().default(false),
  
  // Reminders
  reminderDefaultMinutes: z.number().int().min(0).max(1440).default(15),
  
  // Privacy
  shareUsageData: z.boolean().default(true),
  
  // User preferences (stored as JSONB on server, but we use a structured object)
  preferences: z.record(z.any()).optional(),
});

export type Settings = z.infer<typeof SettingsSchema>;