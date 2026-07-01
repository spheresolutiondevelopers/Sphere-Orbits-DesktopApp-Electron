"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSettingsUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetSettingsUseCase {
    constructor(settingsRepo) {
        this.settingsRepo = settingsRepo;
    }
    async execute(userID) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        return this.settingsRepo.getSettings(userID);
    }
}
exports.GetSettingsUseCase = GetSettingsUseCase;
//# sourceMappingURL=GetSettingsUseCase.js.map