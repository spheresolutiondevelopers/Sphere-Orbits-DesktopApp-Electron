"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEventSchema = void 0;
const zod_1 = require("zod");
// This is used for external calendar events (Google, Outlook, Apple)
exports.CalendarEventSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(), // might be external ID, but we map to our own
    source: zod_1.z.enum(['google', 'outlook', 'apple']),
    externalID: zod_1.z.string(),
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().optional().nullable(),
    startDateTime: zod_1.z.string().datetime({ offset: true }),
    endDateTime: zod_1.z.string().datetime({ offset: true }),
    allDayEvent: zod_1.z.boolean().default(false),
    location: zod_1.z.string().optional().nullable(),
    meetingLink: zod_1.z.string().url().optional().nullable(),
    color: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    organizer: zod_1.z.string().email().optional(),
    attendees: zod_1.z.array(zod_1.z.string().email()).optional(),
    status: zod_1.z.enum(['confirmed', 'tentative', 'cancelled']).default('confirmed'),
    recurrenceRule: zod_1.z.string().optional().nullable(),
    isRecurring: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=calendar.schema.js.map