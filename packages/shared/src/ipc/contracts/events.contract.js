import { z } from 'zod';
import { EventSchema } from '../../schemas';
export const GetEventsRequestSchema = z.object({
    filters: z.object({
        status: z.enum(['planned', 'ongoing', 'completed', 'cancelled']).optional(),
        categoryID: z.string().uuid().optional(),
        startDateFrom: z.string().datetime().optional(),
        startDateTo: z.string().datetime().optional(),
        search: z.string().optional(),
    }).optional(),
    pagination: z.object({
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
    }).optional(),
});
export const GetEventsResponseSchema = z.object({
    events: z.array(EventSchema),
    total: z.number().int(),
});
export const CreateEventRequestSchema = EventSchema.omit({
    eventID: true,
    userID: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
});
export const UpdateEventRequestSchema = z.object({
    eventID: z.string().uuid(),
    updates: CreateEventRequestSchema.partial(),
});
export const DeleteEventRequestSchema = z.object({
    eventID: z.string().uuid(),
});
export const EventConflictResponseSchema = z.object({
    status: z.literal('conflict'),
    serverEntity: EventSchema,
    clientEntity: EventSchema,
});
