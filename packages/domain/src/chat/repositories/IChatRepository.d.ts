import { Result } from '@sphere/shared';
import { Message } from '../entities/Message';
export interface IChatRepository {
    /**
     * Sends a message to a conversation.
     * @param conversationID - The conversation ID
     * @param senderUserID - The user sending the message
     * @param content - The message content
     * @returns Result containing the created Message
     */
    sendMessage(conversationID: string, senderUserID: string, content: string): Promise<Result<Message, Error>>;
    /**
     * Gets messages from a conversation with pagination.
     * @param conversationID - The conversation ID
     * @param limit - Max number of messages
     * @param before - Optional timestamp to get messages before (for pagination)
     * @returns Result containing the messages and a flag indicating if there are more
     */
    getMessages(conversationID: string, limit: number, before?: string): Promise<Result<{
        messages: Message[];
        hasMore: boolean;
    }, Error>>;
    /**
     * Observes new messages in a conversation (real‑time).
     * @param conversationID - The conversation ID
     * @param callback - Function called when a new message arrives
     * @returns A cleanup function to stop observing
     */
    observeMessages(conversationID: string, callback: (message: Message) => void): Promise<Result<() => void, Error>>;
    /**
     * Marks all messages in a conversation as read for a user.
     * @param conversationID - The conversation ID
     * @param userID - The user marking messages as read
     * @returns Result<void>
     */
    markAsRead(conversationID: string, userID: string): Promise<Result<void, Error>>;
}
//# sourceMappingURL=IChatRepository.d.ts.map