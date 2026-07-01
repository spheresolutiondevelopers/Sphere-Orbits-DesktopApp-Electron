import { Result } from '@sphere/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';
export declare class LogoutUseCase {
    private readonly authRepo;
    constructor(authRepo: IAuthRepository);
    execute(token: string): Promise<Result<void, Error>>;
}
//# sourceMappingURL=LogoutUseCase.d.ts.map