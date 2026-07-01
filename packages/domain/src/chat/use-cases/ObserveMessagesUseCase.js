"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObserveMessagesUseCase = void 0;
const shared_1 = require("@sphere/shared");
class ObserveMessagesUseCase {
    constructor(chatRepo) {
        this.chatRepo = chatRepo;
    }
    /**
     * Starts observing new messages in a conversation.
     * @param conversationID - The conversation to observe
     * @param onMessage - Callback for each new message
     * @returns A Result containing a cleanup function to stop observing
     */
    async execute(conversationID, onMessage) {
        if (!conversationID) {
            return (0, shared_1.err)(new Error('conversationID is required'));
        }
        if (!onMessage || typeof onMessage !== 'function') {
            return (0, shared_1.err)(new Error('onMessage callback is required'));
        }
        return this.chatRepo.observeMessages(conversationID, onMessage);
    }
}
exports.ObserveMessagesUseCase = ObserveMessagesUseCase;
//# sourceMappingURL=ObserveMessagesUseCase.js.map