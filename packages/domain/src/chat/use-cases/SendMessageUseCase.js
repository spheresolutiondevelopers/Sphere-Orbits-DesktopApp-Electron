"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageUseCase = void 0;
const shared_1 = require("@sphere/shared");
class SendMessageUseCase {
    constructor(chatRepo) {
        this.chatRepo = chatRepo;
    }
    async execute(input) {
        // Validate required fields
        if (!input.conversationID) {
            return (0, shared_1.err)(new Error('conversationID is required'));
        }
        if (!input.senderUserID) {
            return (0, shared_1.err)(new Error('senderUserID is required'));
        }
        if (!input.content || input.content.trim().length === 0) {
            return (0, shared_1.err)(new Error('Message content cannot be empty'));
        }
        if (input.content.length > 4000) {
            return (0, shared_1.err)(new Error('Message cannot exceed 4000 characters'));
        }
        return this.chatRepo.sendMessage(input.conversationID, input.senderUserID, input.content.trim());
    }
}
exports.SendMessageUseCase = SendMessageUseCase;
//# sourceMappingURL=SendMessageUseCase.js.map