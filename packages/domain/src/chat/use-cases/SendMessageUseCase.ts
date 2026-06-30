import { err, type Result } from '@sphere/shared';
import { IChatRepository } from '../repositories/IChatRepository';
import { Message } from '../entities/Message';

export interface SendMessageInput {
  conversationID: string;
  senderUserID: string;
  content: string;
}

export class SendMessageUseCase {
  constructor(private readonly chatRepo: IChatRepository) {}

  async execute(input: SendMessageInput): Promise<Result<Message, Error>> {
    // Validate required fields
    if (!input.conversationID) {
      return err(new Error('conversationID is required'));
    }
    if (!input.senderUserID) {
      return err(new Error('senderUserID is required'));
    }
    if (!input.content || input.content.trim().length === 0) {
      return err(new Error('Message content cannot be empty'));
    }
    if (input.content.length > 4000) {
      return err(new Error('Message cannot exceed 4000 characters'));
    }

    return this.chatRepo.sendMessage(
      input.conversationID,
      input.senderUserID,
      input.content.trim()
    );
  }
}