import { z } from 'zod';
export declare const SendMessageRequestSchema: z.ZodObject<{
    conversationID: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    conversationID: string;
}, {
    content: string;
    conversationID: string;
}>;
export declare const SendMessageResponseSchema: z.ZodObject<{
    message: z.ZodObject<{
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
}, "strip", z.ZodTypeAny, {
    message: {
        content: string;
        messageID: string;
        conversationID: string;
        senderUserID: string;
        sentAt: string;
        isRead: boolean;
        readAt?: string | null | undefined;
    };
}, {
    message: {
        content: string;
        messageID: string;
        conversationID: string;
        senderUserID: string;
        sentAt: string;
        isRead?: boolean | undefined;
        readAt?: string | null | undefined;
    };
}>;
export declare const GetMessagesRequestSchema: z.ZodObject<{
    conversationID: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
    before: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    conversationID: string;
    limit: number;
    before?: string | undefined;
}, {
    conversationID: string;
    limit?: number | undefined;
    before?: string | undefined;
}>;
export declare const GetMessagesResponseSchema: z.ZodObject<{
    messages: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
    hasMore: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    messages: {
        content: string;
        messageID: string;
        conversationID: string;
        senderUserID: string;
        sentAt: string;
        isRead: boolean;
        readAt?: string | null | undefined;
    }[];
    hasMore: boolean;
}, {
    messages: {
        content: string;
        messageID: string;
        conversationID: string;
        senderUserID: string;
        sentAt: string;
        isRead?: boolean | undefined;
        readAt?: string | null | undefined;
    }[];
    hasMore: boolean;
}>;
export declare const ObserveMessagesRequestSchema: z.ZodObject<{
    conversationID: z.ZodString;
}, "strip", z.ZodTypeAny, {
    conversationID: string;
}, {
    conversationID: string;
}>;
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
export type GetMessagesRequest = z.infer<typeof GetMessagesRequestSchema>;
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;
export type ObserveMessagesRequest = z.infer<typeof ObserveMessagesRequestSchema>;
//# sourceMappingURL=chat.contract.d.ts.map