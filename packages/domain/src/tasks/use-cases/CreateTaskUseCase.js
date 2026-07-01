"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteTaskUseCase = void 0;
const shared_1 = require("@sphere/shared");
class CompleteTaskUseCase {
    constructor(taskRepo) {
        this.taskRepo = taskRepo;
    }
    async execute(taskID, userID, completionPercentage = 100) {
        if (!taskID) {
            return (0, shared_1.err)(new Error('taskID is required'));
        }
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (completionPercentage < 0 || completionPercentage > 100) {
            return (0, shared_1.err)(new Error('completionPercentage must be between 0 and 100'));
        }
        // First, fetch the task to ensure it exists and belongs to the user
        const taskResult = await this.taskRepo.getTaskById(taskID, userID);
        if (taskResult.isFailure()) {
            return taskResult;
        }
        const task = taskResult.value;
        task.complete(completionPercentage);
        return this.taskRepo.updateTask(taskID, task);
    }
}
exports.CompleteTaskUseCase = CompleteTaskUseCase;
//# sourceMappingURL=CreateTaskUseCase.js.map