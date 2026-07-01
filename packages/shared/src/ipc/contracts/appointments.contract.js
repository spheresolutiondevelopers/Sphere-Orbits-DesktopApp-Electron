"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentConflictResponseSchema = exports.DeleteAppointmentRequestSchema = exports.UpdateAppointmentRequestSchema = exports.CreateAppointmentRequestSchema = exports.GetAppointmentsResponseSchema = exports.GetAppointmentsRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
exports.GetAppointmentsRequestSchema = zod_1.z.object({
    filters: zod_1.z.object({
        status: zod_1.z.enum(['scheduled', 'confirmed', 'cancelled', 'completed', 'rescheduled']).optional(),
        appointmentType: zod_1.z.enum(['general', 'doctor', 'business', 'personal']).optional(),
        startDateFrom: zod_1.z.string().datetime().optional(),
        startDateTo: zod_1.z.string().datetime().optional(),
        search: zod_1.z.string().optional(),
    }).optional(),
    pagination: zod_1.z.object({
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        offset: zod_1.z.number().int().min(0).default(0),
    }).optional(),
});
exports.GetAppointmentsResponseSchema = zod_1.z.object({
    appointments: zod_1.z.array(schemas_1.AppointmentSchema),
    total: zod_1.z.number().int(),
});
exports.CreateAppointmentRequestSchema = schemas_1.AppointmentSchema.omit({
    appointmentID: true,
    userID: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
});
exports.UpdateAppointmentRequestSchema = zod_1.z.object({
    appointmentID: zod_1.z.string().uuid(),
    updates: exports.CreateAppointmentRequestSchema.partial(),
});
exports.DeleteAppointmentRequestSchema = zod_1.z.object({
    appointmentID: zod_1.z.string().uuid(),
});
exports.AppointmentConflictResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('conflict'),
    serverEntity: schemas_1.AppointmentSchema,
    clientEntity: schemas_1.AppointmentSchema,
});
//# sourceMappingURL=appointments.contract.js.map