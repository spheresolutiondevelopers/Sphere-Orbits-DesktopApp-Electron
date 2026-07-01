"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingSchema = void 0;
const zod_1 = require("zod");
exports.MeetingSchema = zod_1.z.object({
    meetingID: zod_1.z.string().uuid(),
    taskID: zod_1.z.string().uuid(),
    organizerUserID: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(4000).optional().nullable(),
    startDateTime: zod_1.z.string().datetime({ offset: true }),
    endDateTime: zod_1.z.string().datetime({ offset: true }),
    meetingLink: zod_1.z.string().url().max(500).optional().nullable(),
    meetingPlatform: zod_1.z.string().max(50).optional().nullable(),
    isRecurring: zod_1.z.boolean().default(false),
    recurrencePattern: zod_1.z.string().max(100).optional().nullable(),
    status: zod_1.z.enum(['scheduled', 'live', 'ended', 'cancelled']).default('scheduled'),
    isDeleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=meetings.schema.js.map