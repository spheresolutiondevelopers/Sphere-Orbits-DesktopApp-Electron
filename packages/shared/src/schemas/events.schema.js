"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = void 0;
const zod_1 = require("zod");
exports.EventSchema = zod_1.z.object({
    eventID: zod_1.z.string().uuid(),
    userID: zod_1.z.string().uuid(),
    categoryID: zod_1.z.string().uuid().optional().nullable(),
    taskID: zod_1.z.string().uuid().optional().nullable(),
    name: zod_1.z.string().min(1).max(255),
    format: zod_1.z.string().max(500).optional().nullable(),
    planningNotes: zod_1.z.string().optional().nullable(),
    startDateTime: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
    endDateTime: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
    status: zod_1.z.enum(['planned', 'ongoing', 'completed', 'cancelled']).default('planned'),
    isRecurring: zod_1.z.boolean().default(false),
    recurrencePattern: zod_1.z.string().max(100).optional().nullable(),
    isDeleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=events.schema.js.map