import { type Result } from '@sphere/shared';
import { ISettingsRepository } from '../repositories/ISettingsRepository';
import { Settings } from '../entities/Settings';
export declare class UpdateSettingsUseCase {
    private readonly settingsRepo;
    constructor(settingsRepo: ISettingsRepository);
    execute(userID: string, updates: Partial<Settings>): Promise<Result<Settings, Error>>;
}
//# sourceMappingURL=UpdateSettingsUseCase.d.ts.map