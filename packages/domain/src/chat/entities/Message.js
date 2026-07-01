"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    constructor(messageID, conversationID, senderUserID, content, sentAt, isRead, readAt) {
        this.messageID = messageID;
        this.conversationID = conversationID;
        this.senderUserID = senderUserID;
        this.content = content;
        this.sentAt = sentAt;
        this.isRead = isRead;
        this.readAt = readAt;
    }
    /**
     * Factory method to create a Message from a DTO.
     */
    static fromDTO(dto) {
        return new Message(dto.messageID, dto.conversationID, dto.senderUserID, dto.content, dto.sentAt, dto.isRead, dto.readAt);
    }
    /**
     * Converts this Message to a DTO.
     */
    toDTO() {
        return {
            messageID: this.messageID,
            conversationID: this.conversationID,
            senderUserID: this.senderUserID,
            content: this.content,
            sentAt: this.sentAt,
            isRead: this.isRead,
            readAt: this.readAt,
        };
    }
    /**
     * Marks the message as read.
     */
    markAsRead() {
        if (!this.isRead) {
            this.isRead = true;
            this.readAt = new Date().toISOString();
        }
    }
    /**
     * Updates the message content (for editing).
     */
    updateContent(newContent) {
        if (!newContent || newContent.trim().length === 0) {
            throw new Error('Message content cannot be empty');
        }
        if (newContent.length > 4000) {
            throw new Error('Message content cannot exceed 4000 characters');
        }
        this.content = newContent;
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map