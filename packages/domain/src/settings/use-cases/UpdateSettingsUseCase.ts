import { Result } from '@sphere/shared';
import { ISettingsRepository } from '../repositories/ISettingsRepository';
import { Settings } from '../entities/Settings';

export class UpdateSettingsUseCase {
  constructor(private readonly settingsRepo: ISettingsRepository) {}

  async execute(userID: string, updates: Partial<Settings>): Promise<Result<Settings, Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    if (!updates || Object.keys(updates).length === 0) {
      return Result.err(new Error('At least one setting must be provided'));
    }

    // Validate individual settings
    if (updates.theme && !['dark', 'light', 'system'].includes(updates.theme)) {
      return Result.err(new Error('Invalid theme value'));
    }
    if (updates.defaultView && !['day', 'week', 'month'].includes(updates.defaultView)) {
      return Result.err(new Error('Invalid defaultView value'));
    }
    if (
      updates.reminderDefaultMinutes !== undefined &&
      (updates.reminderDefaultMinutes < 0 || updates.reminderDefaultMinutes > 1440)
    ) {
      return Result.err(new Error('reminderDefaultMinutes must be between 0 and 1440'));
    }
    if (updates.language && updates.language.length > 10) {
      return Result.err(new Error('Language code cannot exceed 10 characters'));
    }
    if (updates.timezone && updates.timezone.length > 50) {
      return Result.err(new Error('Timezone cannot exceed 50 characters'));
    }

    return this.settingsRepo.updateSettings(userID, updates);
  }
}