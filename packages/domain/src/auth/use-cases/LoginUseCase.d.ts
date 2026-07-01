import { type Result } from '@sphere/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';
export interface LoginUseCaseInput {
    email: string;
    password: string;
}
export interface LoginUseCaseOutput {
    user: User;
    token: string;
    refreshToken?: string;
}
export declare class LoginUseCase {
    private readonly authRepo;
    constructor(authRepo: IAuthRepository);
    execute(input: LoginUseCaseInput): Promise<Result<LoginUseCaseOutput, Error>>;
}
//# sourceMappingURL=LoginUseCase.d.ts.map