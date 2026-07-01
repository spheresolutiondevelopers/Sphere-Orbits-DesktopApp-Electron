"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSettingsUseCase = void 0;
const shared_1 = require("@sphere/shared");
class UpdateSettingsUseCase {
    constructor(settingsRepo) {
        this.settingsRepo = settingsRepo;
    }
    async execute(userID, updates) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (!updates || Object.keys(updates).length === 0) {
            return (0, shared_1.err)(new Error('At least one setting must be provided'));
        }
        // Validate individual settings
        if (updates.theme && !['dark', 'light', 'system'].includes(updates.theme)) {
            return (0, shared_1.err)(new Error('Invalid theme value'));
        }
        if (updates.defaultView && !['day', 'week', 'month'].includes(updates.defaultView)) {
            return (0, shared_1.err)(new Error('Invalid defaultView value'));
        }
        if (updates.reminderDefaultMinutes !== undefined &&
            (updates.reminderDefaultMinutes < 0 || updates.reminderDefaultMinutes > 1440)) {
            return (0, shared_1.err)(new Error('reminderDefaultMinutes must be between 0 and 1440'));
        }
        if (updates.language && updates.language.length > 10) {
            return (0, shared_1.err)(new Error('Language code cannot exceed 10 characters'));
        }
        if (updates.timezone && updates.timezone.length > 50) {
            return (0, shared_1.err)(new Error('Timezone cannot exceed 50 characters'));
        }
        return this.settingsRepo.updateSettings(userID, updates);
    }
}
exports.UpdateSettingsUseCase = UpdateSettingsUseCase;
//# sourceMappingURL=UpdateSettingsUseCase.js.map