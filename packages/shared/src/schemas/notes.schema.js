"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteSchema = void 0;
const zod_1 = require("zod");
exports.NoteSchema = zod_1.z.object({
    noteID: zod_1.z.string().uuid(),
    userID: zod_1.z.string().uuid(),
    title: zod_1.z.string().max(255).optional().nullable(),
    content: zod_1.z.string().min(1),
    taskID: zod_1.z.string().uuid().optional().nullable(),
    eventID: zod_1.z.string().uuid().optional().nullable(),
    appointmentID: zod_1.z.string().uuid().optional().nullable(),
    meetingID: zod_1.z.string().uuid().optional().nullable(),
    isDeleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=notes.schema.js.map