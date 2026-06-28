import { z } from 'zod';
import { CalendarEventSchema } from '../../schemas';  // We'll export this later

export const SyncCalendarRequestSchema = z.object({
  source: z.enum(['google', 'outlook', 'apple']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const SyncCalendarResponseSchema = z.object({
  events: z.array(CalendarEventSchema),
  syncedCount: z.number().int(),
  errors: z.array(z.string()).optional(),
});

export const GetCalendarEventsRequestSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  source: z.enum(['google', 'outlook', 'apple', 'all']).default('all'),
});

export const GetCalendarEventsResponseSchema = z.object({
  events: z.array(CalendarEventSchema),
});

export type SyncCalendarRequest = z.infer<typeof SyncCalendarRequestSchema>;
export type SyncCalendarResponse = z.infer<typeof SyncCalendarResponseSchema>;
export type GetCalendarEventsRequest = z.infer<typeof GetCalendarEventsRequestSchema>;
export type GetCalendarEventsResponse = z.infer<typeof GetCalendarEventsResponseSchema>;