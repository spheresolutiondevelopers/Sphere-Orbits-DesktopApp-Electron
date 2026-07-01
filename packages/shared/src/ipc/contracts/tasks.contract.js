"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskConflictResponseSchema = exports.CompleteTaskRequestSchema = exports.DeleteTaskRequestSchema = exports.UpdateTaskRequestSchema = exports.CreateTaskRequestSchema = exports.GetTasksResponseSchema = exports.GetTasksRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
exports.GetTasksRequestSchema = zod_1.z.object({
    filters: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'deferred']).optional(),
        priority: zod_1.z.enum(['low', 'medium', 'high', 'critical']).optional(),
        taskType: zod_1.z.enum(['general', 'meeting', 'reminder', 'deadline', 'event']).optional(),
        dueDateFrom: zod_1.z.string().datetime().optional(),
        dueDateTo: zod_1.z.string().datetime().optional(),
        search: zod_1.z.string().optional(),
    }).optional(),
    pagination: zod_1.z.object({
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        offset: zod_1.z.number().int().min(0).default(0),
    }).optional(),
});
exports.GetTasksResponseSchema = zod_1.z.object({
    tasks: zod_1.z.array(schemas_1.TaskSchema),
    total: zod_1.z.number().int(),
});
exports.CreateTaskRequestSchema = schemas_1.TaskSchema.omit({
    taskID: true,
    userID: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
});
exports.UpdateTaskRequestSchema = zod_1.z.object({
    taskID: zod_1.z.string().uuid(),
    updates: exports.CreateTaskRequestSchema.partial(),
});
exports.DeleteTaskRequestSchema = zod_1.z.object({
    taskID: zod_1.z.string().uuid(),
});
exports.CompleteTaskRequestSchema = zod_1.z.object({
    taskID: zod_1.z.string().uuid(),
    completionPercentage: zod_1.z.number().int().min(0).max(100),
});
exports.TaskConflictResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('conflict'),
    serverEntity: schemas_1.TaskSchema,
    clientEntity: schemas_1.TaskSchema,
});
//# sourceMappingURL=tasks.contract.js.map