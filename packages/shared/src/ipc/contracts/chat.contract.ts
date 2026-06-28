import { z } from 'zod';
import { MessageSchema } from '../../schemas';

export const SendMessageRequestSchema = z.object({
  conversationID: z.string().uuid(),
  content: z.string().min(1).max(4000),
});

export const SendMessageResponseSchema = z.object({
  message: MessageSchema,
});

export const GetMessagesRequestSchema = z.object({
  conversationID: z.string().uuid(),
  limit: z.number().int().min(1).max(100).default(50),
  before: z.string().datetime().optional(),
});

export const GetMessagesResponseSchema = z.object({
  messages: z.array(MessageSchema),
  hasMore: z.boolean(),
});

export const ObserveMessagesRequestSchema = z.object({
  conversationID: z.string().uuid(),
});

export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;
export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;
export type GetMessagesRequest = z.infer<typeof GetMessagesRequestSchema>;
export type GetMessagesResponse = z.infer<typeof GetMessagesResponseSchema>;
export type ObserveMessagesRequest = z.infer<typeof ObserveMessagesRequestSchema>;