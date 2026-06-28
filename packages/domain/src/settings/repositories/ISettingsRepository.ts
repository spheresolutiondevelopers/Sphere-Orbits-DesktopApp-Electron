import { Result } from '@sphere/shared';
import { Settings } from '../entities/Settings';

export interface ISettingsRepository {
  /**
   * Gets the settings for a user.
   */
  getSettings(userID: string): Promise<Result<Settings, Error>>;

  /**
   * Updates the settings for a user.
   */
  updateSettings(userID: string, updates: Partial<Settings>): Promise<Result<Settings, Error>>;

  /**
   * Resets the settings to default values.
   */
  resetSettings(userID: string): Promise<Result<Settings, Error>>;
}