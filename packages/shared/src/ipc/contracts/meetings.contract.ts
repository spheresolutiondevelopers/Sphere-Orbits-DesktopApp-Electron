import { z } from 'zod';
import { MeetingSchema } from '../../schemas';

export const GetMeetingsRequestSchema = z.object({
  filters: z.object({
    status: z.enum(['scheduled', 'live', 'ended', 'cancelled']).optional(),
    startDateFrom: z.string().datetime().optional(),
    startDateTo: z.string().datetime().optional(),
    search: z.string().optional(),
  }).optional(),
  pagination: z.object({
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
  }).optional(),
});

export const GetMeetingsResponseSchema = z.object({
  meetings: z.array(MeetingSchema),
  total: z.number().int(),
});

export const CreateMeetingRequestSchema = MeetingSchema.omit({
  meetingID: true,
  organizerUserID: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});

export const UpdateMeetingRequestSchema = z.object({
  meetingID: z.string().uuid(),
  updates: CreateMeetingRequestSchema.partial(),
});

export const DeleteMeetingRequestSchema = z.object({
  meetingID: z.string().uuid(),
});

export const JoinMeetingRequestSchema = z.object({
  meetingID: z.string().uuid(),
});

export const MeetingConflictResponseSchema = z.object({
  status: z.literal('conflict'),
  serverEntity: MeetingSchema,
  clientEntity: MeetingSchema,
});

export type GetMeetingsRequest = z.infer<typeof GetMeetingsRequestSchema>;
export type GetMeetingsResponse = z.infer<typeof GetMeetingsResponseSchema>;
export type CreateMeetingRequest = z.infer<typeof CreateMeetingRequestSchema>;
export type UpdateMeetingRequest = z.infer<typeof UpdateMeetingRequestSchema>;
export type DeleteMeetingRequest = z.infer<typeof DeleteMeetingRequestSchema>;
export type JoinMeetingRequest = z.infer<typeof JoinMeetingRequestSchema>;
export type MeetingConflictResponse = z.infer<typeof MeetingConflictResponseSchema>;