"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentSchema = void 0;
const zod_1 = require("zod");
exports.AppointmentSchema = zod_1.z.object({
    appointmentID: zod_1.z.string().uuid(),
    userID: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().max(4000).optional().nullable(),
    appointmentType: zod_1.z.enum(['general', 'doctor', 'business', 'personal']).default('general'),
    startDateTime: zod_1.z.string().datetime({ offset: true }),
    endDateTime: zod_1.z.string().datetime({ offset: true }),
    allDayEvent: zod_1.z.boolean().default(false),
    location: zod_1.z.string().max(500).optional().nullable(),
    isVirtual: zod_1.z.boolean().default(false),
    meetingLink: zod_1.z.string().url().max(500).optional().nullable(),
    meetingPlatform: zod_1.z.string().max(50).optional().nullable(),
    status: zod_1.z.enum(['scheduled', 'confirmed', 'cancelled', 'completed', 'rescheduled']).default('scheduled'),
    reminderMinutesBefore: zod_1.z.number().int().min(0).max(1440).default(15),
    isRecurring: zod_1.z.boolean().default(false),
    recurrencePattern: zod_1.z.string().max(100).optional().nullable(),
    calendarColor: zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#2196F3'),
    externalEventID: zod_1.z.string().max(255).optional().nullable(),
    externalSyncStatus: zod_1.z.enum(['not_synced', 'synced', 'failed']).default('not_synced'),
    notes: zod_1.z.string().max(4000).optional().nullable(),
    isDeleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=appointments.schema.js.map