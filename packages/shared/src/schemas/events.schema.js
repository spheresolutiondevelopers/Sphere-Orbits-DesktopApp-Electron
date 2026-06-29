import { z } from 'zod';
export const EventSchema = z.object({
    eventID: z.string().uuid(),
    userID: z.string().uuid(),
    categoryID: z.string().uuid().optional().nullable(),
    taskID: z.string().uuid().optional().nullable(),
    name: z.string().min(1).max(255),
    format: z.string().max(500).optional().nullable(),
    planningNotes: z.string().optional().nullable(),
    startDateTime: z.string().datetime({ offset: true }).optional().nullable(),
    endDateTime: z.string().datetime({ offset: true }).optional().nullable(),
    status: z.enum(['planned', 'ongoing', 'completed', 'cancelled']).default('planned'),
    isRecurring: z.boolean().default(false),
    recurrencePattern: z.string().max(100).optional().nullable(),
    isDeleted: z.boolean().default(false),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
});
