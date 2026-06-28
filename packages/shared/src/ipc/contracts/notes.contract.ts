import { z } from 'zod';
import { NoteSchema } from '../../schemas';

export const GetNotesRequestSchema = z.object({
  filters: z.object({
    entityType: z.enum(['task', 'event', 'appointment', 'meeting']).optional(),
    entityID: z.string().uuid().optional(),
    search: z.string().optional(),
  }).optional(),
  pagination: z.object({
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
  }).optional(),
});

export const GetNotesResponseSchema = z.object({
  notes: z.array(NoteSchema),
  total: z.number().int(),
});

export const CreateNoteRequestSchema = NoteSchema.omit({
  noteID: true,
  userID: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});

export const UpdateNoteRequestSchema = z.object({
  noteID: z.string().uuid(),
  updates: CreateNoteRequestSchema.partial(),
});

export const DeleteNoteRequestSchema = z.object({
  noteID: z.string().uuid(),
});

export const NoteConflictResponseSchema = z.object({
  status: z.literal('conflict'),
  serverEntity: NoteSchema,
  clientEntity: NoteSchema,
});

export type GetNotesRequest = z.infer<typeof GetNotesRequestSchema>;
export type GetNotesResponse = z.infer<typeof GetNotesResponseSchema>;
export type CreateNoteRequest = z.infer<typeof CreateNoteRequestSchema>;
export type UpdateNoteRequest = z.infer<typeof UpdateNoteRequestSchema>;
export type DeleteNoteRequest = z.infer<typeof DeleteNoteRequestSchema>;
export type NoteConflictResponse = z.infer<typeof NoteConflictResponseSchema>;