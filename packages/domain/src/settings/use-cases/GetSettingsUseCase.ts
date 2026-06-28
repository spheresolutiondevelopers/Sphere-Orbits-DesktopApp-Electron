import { Result } from '@sphere/shared';
import { ISettingsRepository } from '../repositories/ISettingsRepository';
import { Settings } from '../entities/Settings';

export class GetSettingsUseCase {
  constructor(private readonly settingsRepo: ISettingsRepository) {}

  async execute(userID: string): Promise<Result<Settings, Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    return this.settingsRepo.getSettings(userID);
  }
}