import { z } from 'zod';
export declare const GetSettingsRequestSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const GetSettingsResponseSchema: z.ZodObject<{
    settings: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    settings: {
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
    };
}, {
    settings: {
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
    };
}>;
export declare const UpdateSettingsRequestSchema: z.ZodObject<{
    updates: z.ZodObject<{
        theme: z.ZodOptional<z.ZodDefault<z.ZodEnum<["dark", "light", "system"]>>>;
        notificationsEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        pushNotifications: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        emailNotifications: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        googleCalendarSync: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        outlookCalendarSync: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        appleCalendarSync: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        language: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        timezone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        defaultView: z.ZodOptional<z.ZodDefault<z.ZodEnum<["day", "week", "month"]>>>;
        compactMode: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        reminderDefaultMinutes: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        shareUsageData: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
        preferences: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, "strip", z.ZodTypeAny, {
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
}, "strip", z.ZodTypeAny, {
    updates: {
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
    };
}, {
    updates: {
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
    };
}>;
export declare const UpdateSettingsResponseSchema: z.ZodObject<{
    settings: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    settings: {
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
    };
}, {
    settings: {
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
    };
}>;
export type GetSettingsRequest = z.infer<typeof GetSettingsRequestSchema>;
export type GetSettingsResponse = z.infer<typeof GetSettingsResponseSchema>;
export type UpdateSettingsRequest = z.infer<typeof UpdateSettingsRequestSchema>;
export type UpdateSettingsResponse = z.infer<typeof UpdateSettingsResponseSchema>;
//# sourceMappingURL=settings.contract.d.ts.map