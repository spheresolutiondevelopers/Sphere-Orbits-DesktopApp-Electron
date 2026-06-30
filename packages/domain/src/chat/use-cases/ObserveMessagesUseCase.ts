import { err, type Result } from '@sphere/shared';
import { IChatRepository } from '../repositories/IChatRepository';
import { Message } from '../entities/Message';

export class ObserveMessagesUseCase {
  constructor(private readonly chatRepo: IChatRepository) {}

  /**
   * Starts observing new messages in a conversation.
   * @param conversationID - The conversation to observe
   * @param onMessage - Callback for each new message
   * @returns A Result containing a cleanup function to stop observing
   */
  async execute(
    conversationID: string,
    onMessage: (message: Message) => void
  ): Promise<Result<() => void, Error>> {
    if (!conversationID) {
      return err(new Error('conversationID is required'));
    }
    if (!onMessage || typeof onMessage !== 'function') {
      return err(new Error('onMessage callback is required'));
    }

    return this.chatRepo.observeMessages(conversationID, onMessage);
  }
}