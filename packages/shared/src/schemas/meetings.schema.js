import { z } from 'zod';
export const MeetingSchema = z.object({
    meetingID: z.string().uuid(),
    taskID: z.string().uuid(),
    organizerUserID: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().max(4000).optional().nullable(),
    startDateTime: z.string().datetime({ offset: true }),
    endDateTime: z.string().datetime({ offset: true }),
    meetingLink: z.string().url().max(500).optional().nullable(),
    meetingPlatform: z.string().max(50).optional().nullable(),
    isRecurring: z.boolean().default(false),
    recurrencePattern: z.string().max(100).optional().nullable(),
    status: z.enum(['scheduled', 'live', 'ended', 'cancelled']).default('scheduled'),
    isDeleted: z.boolean().default(false),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
});
