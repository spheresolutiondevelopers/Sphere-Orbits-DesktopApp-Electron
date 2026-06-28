import { z } from 'zod';
import { TaskSchema } from '../../schemas';

export const GetTasksRequestSchema = z.object({
  filters: z.object({
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'deferred']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    taskType: z.enum(['general', 'meeting', 'reminder', 'deadline', 'event']).optional(),
    dueDateFrom: z.string().datetime().optional(),
    dueDateTo: z.string().datetime().optional(),
    search: z.string().optional(),
  }).optional(),
  pagination: z.object({
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).default(0),
  }).optional(),
});

export const GetTasksResponseSchema = z.object({
  tasks: z.array(TaskSchema),
  total: z.number().int(),
});

export const CreateTaskRequestSchema = TaskSchema.omit({
  taskID: true,
  userID: true,
  createdAt: true,
  updatedAt: true,
  isDeleted: true,
});

export const UpdateTaskRequestSchema = z.object({
  taskID: z.string().uuid(),
  updates: CreateTaskRequestSchema.partial(),
});

export const DeleteTaskRequestSchema = z.object({
  taskID: z.string().uuid(),
});

export const CompleteTaskRequestSchema = z.object({
  taskID: z.string().uuid(),
  completionPercentage: z.number().int().min(0).max(100),
});

export const TaskConflictResponseSchema = z.object({
  status: z.literal('conflict'),
  serverEntity: TaskSchema,
  clientEntity: TaskSchema,
});

export type GetTasksRequest = z.infer<typeof GetTasksRequestSchema>;
export type GetTasksResponse = z.infer<typeof GetTasksResponseSchema>;
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;
export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;
export type DeleteTaskRequest = z.infer<typeof DeleteTaskRequestSchema>;
export type CompleteTaskRequest = z.infer<typeof CompleteTaskRequestSchema>;
export type TaskConflictResponse = z.infer<typeof TaskConflictResponseSchema>;