import { type Result } from '@sphere/shared';
import { ISettingsRepository } from '../repositories/ISettingsRepository';
import { Settings } from '../entities/Settings';
export declare class GetSettingsUseCase {
    private readonly settingsRepo;
    constructor(settingsRepo: ISettingsRepository);
    execute(userID: string): Promise<Result<Settings, Error>>;
}
//# sourceMappingURL=GetSettingsUseCase.d.ts.map