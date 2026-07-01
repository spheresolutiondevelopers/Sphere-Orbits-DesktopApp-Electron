"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTasksUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetTasksUseCase {
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    async execute(userID, filters, pagination) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        return this.taskRepo.getTasks(userID, filters, pagination);
    }
}
exports.GetTasksUseCase = GetTasksUseCase;
//# sourceMappingURL=GetTasksUseCase.js.map