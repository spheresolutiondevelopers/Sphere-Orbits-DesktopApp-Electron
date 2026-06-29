import { z } from 'zod';
import { SettingsSchema } from '../../schemas';
export const GetSettingsRequestSchema = z.object({});
export const GetSettingsResponseSchema = z.object({
    settings: SettingsSchema,
});
export const UpdateSettingsRequestSchema = z.object({
    updates: SettingsSchema.partial(),
});
export const UpdateSettingsResponseSchema = z.object({
    settings: SettingsSchema,
});
