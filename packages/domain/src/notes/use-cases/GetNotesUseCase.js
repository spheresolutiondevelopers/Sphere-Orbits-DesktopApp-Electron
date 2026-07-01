"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNotesUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetNotesUseCase {
    constructor(notesRepo) {
        this.notesRepo = notesRepo;
    }
    async execute(userID, filters, pagination) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        return this.notesRepo.getNotes(userID, filters, pagination);
    }
}
exports.GetNotesUseCase = GetNotesUseCase;
//# sourceMappingURL=GetNotesUseCase.js.map