"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteConflictResponseSchema = exports.DeleteNoteRequestSchema = exports.UpdateNoteRequestSchema = exports.CreateNoteRequestSchema = exports.GetNotesResponseSchema = exports.GetNotesRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
exports.GetNotesRequestSchema = zod_1.z.object({
    filters: zod_1.z.object({
        entityType: zod_1.z.enum(['task', 'event', 'appointment', 'meeting']).optional(),
        entityID: zod_1.z.string().uuid().optional(),
        search: zod_1.z.string().optional(),
    }).optional(),
    pagination: zod_1.z.object({
        limit: zod_1.z.number().int().min(1).max(100).default(20),
        offset: zod_1.z.number().int().min(0).default(0),
    }).optional(),
});
exports.GetNotesResponseSchema = zod_1.z.object({
    notes: zod_1.z.array(schemas_1.NoteSchema),
    total: zod_1.z.number().int(),
});
exports.CreateNoteRequestSchema = schemas_1.NoteSchema.omit({
    noteID: true,
    userID: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
});
exports.UpdateNoteRequestSchema = zod_1.z.object({
    noteID: zod_1.z.string().uuid(),
    updates: exports.CreateNoteRequestSchema.partial(),
});
exports.DeleteNoteRequestSchema = zod_1.z.object({
    noteID: zod_1.z.string().uuid(),
});
exports.NoteConflictResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('conflict'),
    serverEntity: schemas_1.NoteSchema,
    clientEntity: schemas_1.NoteSchema,
});
//# sourceMappingURL=notes.contract.js.map