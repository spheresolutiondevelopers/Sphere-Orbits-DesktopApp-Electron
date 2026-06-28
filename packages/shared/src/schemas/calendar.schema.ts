import { z } from 'zod';

// This is used for external calendar events (Google, Outlook, Apple)
export const CalendarEventSchema = z.object({
  id: z.string().uuid(), // might be external ID, but we map to our own
  source: z.enum(['google', 'outlook', 'apple']),
  externalID: z.string(),
  title: z.string().min(1).max(255),
  description: z.string().optional().nullable(),
  startDateTime: z.string().datetime({ offset: true }),
  endDateTime: z.string().datetime({ offset: true }),
  allDayEvent: z.boolean().default(false),
  location: z.string().optional().nullable(),
  meetingLink: z.string().url().optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  organizer: z.string().email().optional(),
  attendees: z.array(z.string().email()).optional(),
  status: z.enum(['confirmed', 'tentative', 'cancelled']).default('confirmed'),
  recurrenceRule: z.string().optional().nullable(),
  isRecurring: z.boolean().default(false),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;