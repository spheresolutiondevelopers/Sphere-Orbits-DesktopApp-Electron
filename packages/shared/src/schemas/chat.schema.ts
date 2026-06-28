import { z } from 'zod';

export const MessageSchema = z.object({
  messageID: z.string().uuid(),
  conversationID: z.string().uuid(),
  senderUserID: z.string().uuid(),
  content: z.string().min(1).max(4000),
  sentAt: z.string().datetime({ offset: true }),
  isRead: z.boolean().default(false),
  readAt: z.string().datetime({ offset: true }).optional().nullable(),
});

export const ConversationSchema = z.object({
  conversationID: z.string().uuid(),
  type: z.enum(['direct', 'group']).default('direct'),
  name: z.string().max(255).optional().nullable(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type Message = z.infer<typeof MessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;