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

export type GetSettingsRequest = z.infer<typeof GetSettingsRequestSchema>;
export type GetSettingsResponse = z.infer<typeof GetSettingsResponseSchema>;
export type UpdateSettingsRequest = z.infer<typeof UpdateSettingsRequestSchema>;
export type UpdateSettingsResponse = z.infer<typeof UpdateSettingsResponseSchema>;