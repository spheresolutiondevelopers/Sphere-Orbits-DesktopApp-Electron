import { Message as MessageDTO } from '@sphere/shared';
export declare class Message {
    readonly messageID: string;
    conversationID: string;
    senderUserID: string;
    content: string;
    sentAt: string;
    isRead: boolean;
    readAt?: string | null | undefined;
    constructor(messageID: string, conversationID: string, senderUserID: string, content: string, sentAt: string, isRead: boolean, readAt?: string | null | undefined);
    /**
     * Factory method to create a Message from a DTO.
     */
    static fromDTO(dto: MessageDTO): Message;
    /**
     * Converts this Message to a DTO.
     */
    toDTO(): MessageDTO;
    /**
     * Marks the message as read.
     */
    markAsRead(): void;
    /**
     * Updates the message content (for editing).
     */
    updateContent(newContent: string): void;
}
//# sourceMappingURL=Message.d.ts.map