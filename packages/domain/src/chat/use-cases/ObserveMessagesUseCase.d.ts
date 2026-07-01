import { type Result } from '@sphere/shared';
import { IChatRepository } from '../repositories/IChatRepository';
import { Message } from '../entities/Message';
export declare class ObserveMessagesUseCase {
    private readonly chatRepo;
    constructor(chatRepo: IChatRepository);
    /**
     * Starts observing new messages in a conversation.
     * @param conversationID - The conversation to observe
     * @param onMessage - Callback for each new message
     * @returns A Result containing a cleanup function to stop observing
     */
    execute(conversationID: string, onMessage: (message: Message) => void): Promise<Result<() => void, Error>>;
}
//# sourceMappingURL=ObserveMessagesUseCase.d.ts.map