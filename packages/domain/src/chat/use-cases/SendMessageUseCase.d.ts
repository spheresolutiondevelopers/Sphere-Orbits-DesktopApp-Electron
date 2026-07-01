import { type Result } from '@sphere/shared';
import { IChatRepository } from '../repositories/IChatRepository';
import { Message } from '../entities/Message';
export interface SendMessageInput {
    conversationID: string;
    senderUserID: string;
    content: string;
}
export declare class SendMessageUseCase {
    private readonly chatRepo;
    constructor(chatRepo: IChatRepository);
    execute(input: SendMessageInput): Promise<Result<Message, Error>>;
}
//# sourceMappingURL=SendMessageUseCase.d.ts.map