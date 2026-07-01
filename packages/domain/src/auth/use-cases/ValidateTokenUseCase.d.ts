import { Result } from '@sphere/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';
export declare class ValidateTokenUseCase {
    private readonly authRepo;
    constructor(authRepo: IAuthRepository);
    execute(token: string): Promise<Result<User, Error>>;
}
//# sourceMappingURL=ValidateTokenUseCase.d.ts.map