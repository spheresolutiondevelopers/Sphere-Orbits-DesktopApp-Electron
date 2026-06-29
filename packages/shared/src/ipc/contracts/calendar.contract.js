import { z } from 'zod';
import { CalendarEventSchema } from '../../schemas'; // We'll export this later
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
