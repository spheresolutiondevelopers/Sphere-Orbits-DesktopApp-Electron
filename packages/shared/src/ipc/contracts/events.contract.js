"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventConflictResponseSchema = exports.DeleteEventRequestSchema = exports.UpdateEventRequestSchema = exports.CreateEventRequestSchema = exports.GetEventsResponseSchema = exports.GetEventsRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
exports.GetEventsRequestSchema = zod_1.z.object({
    filters: zod_1.z.object({
        status: zod_1.z.enum(['planned', 'ongoing', 'completed', 'cancelled']).optional(),
        categoryID: zod_1.z.string().uuid().optional(),
        startDateFrom: zod_1.z.string().datetime().optional(),
        startDateTo: zod_1.z.string().datetime().optional(),
        search: zod_1.z.string().optional(),
    }).optional(),
    pagination: zod_1.z.object({
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        offset: zod_1.z.number().int().min(0).default(0),
    }).optional(),
});
exports.GetEventsResponseSchema = zod_1.z.object({
    events: zod_1.z.array(schemas_1.EventSchema),
    total: zod_1.z.number().int(),
});
exports.CreateEventRequestSchema = schemas_1.EventSchema.omit({
    eventID: true,
    userID: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
});
exports.UpdateEventRequestSchema = zod_1.z.object({
    eventID: zod_1.z.string().uuid(),
    updates: exports.CreateEventRequestSchema.partial(),
});
exports.DeleteEventRequestSchema = zod_1.z.object({
    eventID: zod_1.z.string().uuid(),
});
exports.EventConflictResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('conflict'),
    serverEntity: schemas_1.EventSchema,
    clientEntity: schemas_1.EventSchema,
});
//# sourceMappingURL=events.contract.js.map