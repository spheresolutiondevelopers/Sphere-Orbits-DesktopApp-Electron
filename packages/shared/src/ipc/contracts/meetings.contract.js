"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingConflictResponseSchema = exports.JoinMeetingRequestSchema = exports.DeleteMeetingRequestSchema = exports.UpdateMeetingRequestSchema = exports.CreateMeetingRequestSchema = exports.GetMeetingsResponseSchema = exports.GetMeetingsRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
exports.GetMeetingsRequestSchema = zod_1.z.object({
    filters: zod_1.z.object({
        status: zod_1.z.enum(['scheduled', 'live', 'ended', 'cancelled']).optional(),
        startDateFrom: zod_1.z.string().datetime().optional(),
        startDateTo: zod_1.z.string().datetime().optional(),
        search: zod_1.z.string().optional(),
    }).optional(),
    pagination: zod_1.z.object({
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        offset: zod_1.z.number().int().min(0).default(0),
    }).optional(),
});
exports.GetMeetingsResponseSchema = zod_1.z.object({
    meetings: zod_1.z.array(schemas_1.MeetingSchema),
    total: zod_1.z.number().int(),
});
exports.CreateMeetingRequestSchema = schemas_1.MeetingSchema.omit({
    meetingID: true,
    organizerUserID: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
});
exports.UpdateMeetingRequestSchema = zod_1.z.object({
    meetingID: zod_1.z.string().uuid(),
    updates: exports.CreateMeetingRequestSchema.partial(),
});
exports.DeleteMeetingRequestSchema = zod_1.z.object({
    meetingID: zod_1.z.string().uuid(),
});
exports.JoinMeetingRequestSchema = zod_1.z.object({
    meetingID: zod_1.z.string().uuid(),
});
exports.MeetingConflictResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('conflict'),
    serverEntity: schemas_1.MeetingSchema,
    clientEntity: schemas_1.MeetingSchema,
});
//# sourceMappingURL=meetings.contract.js.map