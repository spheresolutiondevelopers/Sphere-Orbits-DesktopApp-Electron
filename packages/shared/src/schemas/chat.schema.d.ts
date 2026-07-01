import { z } from 'zod';
export declare const MessageSchema: z.ZodObject<{
    messageID: z.ZodString;
    conversationID: z.ZodString;
    senderUserID: z.ZodString;
    content: z.ZodString;
    sentAt: z.ZodString;
    isRead: z.ZodDefault<z.ZodBoolean>;
    readAt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    messageID: string;
    conversationID: string;
    senderUserID: string;
    sentAt: string;
    isRead: boolean;
    readAt?: string | null | undefined;
}, {
    content: string;
    messageID: string;
    conversationID: string;
    senderUserID: string;
    sentAt: string;
    isRead?: boolean | undefined;
    readAt?: string | null | undefined;
}>;
export declare const ConversationSchema: z.ZodObject<{
    conversationID: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["direct", "group"]>>;
    name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "direct" | "group";
    conversationID: string;
    created_at: string;
    updated_at: string;
    name?: string | null | undefined;
}, {
    conversationID: string;
    created_at: string;
    updated_at: string;
    type?: "direct" | "group" | undefined;
    name?: string | null | undefined;
}>;
export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;
//# sourceMappingURL=chat.schema.d.ts.map