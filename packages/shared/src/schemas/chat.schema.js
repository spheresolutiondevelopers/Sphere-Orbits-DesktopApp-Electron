"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSchema = exports.MessageSchema = void 0;
const zod_1 = require("zod");
exports.MessageSchema = zod_1.z.object({
    messageID: zod_1.z.string().uuid(),
    conversationID: zod_1.z.string().uuid(),
    senderUserID: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(4000),
    sentAt: zod_1.z.string().datetime({ offset: true }),
    isRead: zod_1.z.boolean().default(false),
    readAt: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
});
exports.ConversationSchema = zod_1.z.object({
    conversationID: zod_1.z.string().uuid(),
    type: zod_1.z.enum(['direct', 'group']).default('direct'),
    name: zod_1.z.string().max(255).optional().nullable(),
    created_at: zod_1.z.string().datetime({ offset: true }),
    updated_at: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=chat.schema.js.map