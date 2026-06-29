import { z } from 'zod';
import { AppointmentSchema } from '../../schemas';
export const GetAppointmentsRequestSchema = z.object({
    filters: z.object({
        status: z.enum(['scheduled', 'confirmed', 'cancelled', 'completed', 'rescheduled']).optional(),
        appointmentType: z.enum(['general', 'doctor', 'business', 'personal']).optional(),
        startDateFrom: z.string().datetime().optional(),
        startDateTo: z.string().datetime().optional(),
        search: z.string().optional(),
    }).optional(),
    pagination: z.object({
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
    }).optional(),
});
export const GetAppointmentsResponseSchema = z.object({
    appointments: z.array(AppointmentSchema),
    total: z.number().int(),
});
export const CreateAppointmentRequestSchema = AppointmentSchema.omit({
    appointmentID: true,
    userID: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
});
export const UpdateAppointmentRequestSchema = z.object({
    appointmentID: z.string().uuid(),
    updates: CreateAppointmentRequestSchema.partial(),
});
export const DeleteAppointmentRequestSchema = z.object({
    appointmentID: z.string().uuid(),
});
export const AppointmentConflictResponseSchema = z.object({
    status: z.literal('conflict'),
    serverEntity: AppointmentSchema,
    clientEntity: AppointmentSchema,
});
