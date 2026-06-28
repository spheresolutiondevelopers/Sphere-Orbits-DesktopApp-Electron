import { z } from 'zod';

export const NoteSchema = z.object({
  noteID: z.string().uuid(),
  userID: z.string().uuid(),
  title: z.string().max(255).optional().nullable(),
  content: z.string().min(1),
  taskID: z.string().uuid().optional().nullable(),
  eventID: z.string().uuid().optional().nullable(),
  appointmentID: z.string().uuid().optional().nullable(),
  meetingID: z.string().uuid().optional().nullable(),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type Note = z.infer<typeof NoteSchema>;