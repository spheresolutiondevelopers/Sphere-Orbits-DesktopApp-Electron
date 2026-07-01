"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObserveMessagesRequestSchema = exports.GetMessagesResponseSchema = exports.GetMessagesRequestSchema = exports.SendMessageResponseSchema = exports.SendMessageRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
exports.SendMessageRequestSchema = zod_1.z.object({
    conversationID: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(4000),
});
exports.SendMessageResponseSchema = zod_1.z.object({
    message: schemas_1.MessageSchema,
});
exports.GetMessagesRequestSchema = zod_1.z.object({
    conversationID: zod_1.z.string().uuid(),
    limit: zod_1.z.number().int().min(1).max(100).default(50),
    before: zod_1.z.string().datetime().optional(),
});
exports.GetMessagesResponseSchema = zod_1.z.object({
    messages: zod_1.z.array(schemas_1.MessageSchema),
    hasMore: zod_1.z.boolean(),
});
exports.ObserveMessagesRequestSchema = zod_1.z.object({
    conversationID: zod_1.z.string().uuid(),
});
//# sourceMappingURL=chat.contract.js.map