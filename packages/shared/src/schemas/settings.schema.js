"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsSchema = void 0;
const zod_1 = require("zod");
exports.SettingsSchema = zod_1.z.object({
    // Theme
    theme: zod_1.z.enum(['dark', 'light', 'system']).default('system'),
    // Notifications
    notificationsEnabled: zod_1.z.boolean().default(true),
    pushNotifications: zod_1.z.boolean().default(true),
    emailNotifications: zod_1.z.boolean().default(true),
    // Calendar sync
    googleCalendarSync: zod_1.z.boolean().default(false),
    outlookCalendarSync: zod_1.z.boolean().default(false),
    appleCalendarSync: zod_1.z.boolean().default(false),
    // Language
    language: zod_1.z.string().default('en'),
    timezone: zod_1.z.string().default('UTC'),
    // Display
    defaultView: zod_1.z.enum(['day', 'week', 'month']).default('day'),
    compactMode: zod_1.z.boolean().default(false),
    // Reminders
    reminderDefaultMinutes: zod_1.z.number().int().min(0).max(1440).default(15),
    // Privacy
    shareUsageData: zod_1.z.boolean().default(true),
    // User preferences (stored as JSONB on server, but we use a structured object)
    preferences: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
//# sourceMappingURL=settings.schema.js.map