import { Message as MessageDTO } from '@sphere/shared';

export class Message {
  constructor(
    public readonly messageID: string,
    public conversationID: string,
    public senderUserID: string,
    public content: string,
    public sentAt: string,
    public isRead: boolean,
    public readAt?: string | null
  ) {}

  /**
   * Factory method to create a Message from a DTO.
   */
  static fromDTO(dto: MessageDTO): Message {
    return new Message(
      dto.messageID,
      dto.conversationID,
      dto.senderUserID,
      dto.content,
      dto.sentAt,
      dto.isRead,
      dto.readAt
    );
  }

  /**
   * Converts this Message to a DTO.
   */
  toDTO(): MessageDTO {
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
  markAsRead(): void {
    if (!this.isRead) {
      this.isRead = true;
      this.readAt = new Date().toISOString();
    }
  }

  /**
   * Updates the message content (for editing).
   */
  updateContent(newContent: string): void {
    if (!newContent || newContent.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
    if (newContent.length > 4000) {
      throw new Error('Message content cannot exceed 4000 characters');
    }
    this.content = newContent;
  }
}