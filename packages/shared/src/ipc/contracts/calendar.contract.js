"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCalendarEventsResponseSchema = exports.GetCalendarEventsRequestSchema = exports.SyncCalendarResponseSchema = exports.SyncCalendarRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas"); // We'll export this later
exports.SyncCalendarRequestSchema = zod_1.z.object({
    source: zod_1.z.enum(['google', 'outlook', 'apple']),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
});
exports.SyncCalendarResponseSchema = zod_1.z.object({
    events: zod_1.z.array(schemas_1.CalendarEventSchema),
    syncedCount: zod_1.z.number().int(),
    errors: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.GetCalendarEventsRequestSchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    source: zod_1.z.enum(['google', 'outlook', 'apple', 'all']).default('all'),
});
exports.GetCalendarEventsResponseSchema = zod_1.z.object({
    events: zod_1.z.array(schemas_1.CalendarEventSchema),
});
//# sourceMappingURL=calendar.contract.js.map