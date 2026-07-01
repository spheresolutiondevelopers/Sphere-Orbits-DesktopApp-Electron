import { z } from 'zod';
export declare const SettingsSchema: z.ZodObject<{
    theme: z.ZodDefault<z.ZodEnum<["dark", "light", "system"]>>;
    notificationsEnabled: z.ZodDefault<z.ZodBoolean>;
    pushNotifications: z.ZodDefault<z.ZodBoolean>;
    emailNotifications: z.ZodDefault<z.ZodBoolean>;
    googleCalendarSync: z.ZodDefault<z.ZodBoolean>;
    outlookCalendarSync: z.ZodDefault<z.ZodBoolean>;
    appleCalendarSync: z.ZodDefault<z.ZodBoolean>;
    language: z.ZodDefault<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    defaultView: z.ZodDefault<z.ZodEnum<["day", "week", "month"]>>;
    compactMode: z.ZodDefault<z.ZodBoolean>;
    reminderDefaultMinutes: z.ZodDefault<z.ZodNumber>;
    shareUsageData: z.ZodDefault<z.ZodBoolean>;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    theme: "dark" | "light" | "system";
    notificationsEnabled: boolean;
    pushNotifications: boolean;
    emailNotifications: boolean;
    googleCalendarSync: boolean;
    outlookCalendarSync: boolean;
    appleCalendarSync: boolean;
    language: string;
    timezone: string;
    defaultView: "day" | "week" | "month";
    compactMode: boolean;
    reminderDefaultMinutes: number;
    shareUsageData: boolean;
    preferences?: Record<string, unknown> | undefined;
}, {
    theme?: "dark" | "light" | "system" | undefined;
    notificationsEnabled?: boolean | undefined;
    pushNotifications?: boolean | undefined;
    emailNotifications?: boolean | undefined;
    googleCalendarSync?: boolean | undefined;
    outlookCalendarSync?: boolean | undefined;
    appleCalendarSync?: boolean | undefined;
    language?: string | undefined;
    timezone?: string | undefined;
    defaultView?: "day" | "week" | "month" | undefined;
    compactMode?: boolean | undefined;
    reminderDefaultMinutes?: number | undefined;
    shareUsageData?: boolean | undefined;
    preferences?: Record<string, unknown> | undefined;
}>;
export type Settings = z.infer<typeof SettingsSchema>;
//# sourceMappingURL=settings.schema.d.ts.map