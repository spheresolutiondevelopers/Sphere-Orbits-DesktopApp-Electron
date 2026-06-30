import { ok, type Result } from '@sphere/shared';
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

export class LoginUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(input: LoginUseCaseInput): Promise<Result<LoginUseCaseOutput, Error>> {
    const result = await this.authRepo.login(input.email, input.password);
    if (result.isFailure()) {
      return result as any; // propagate error
    }
    const { user, token, refreshToken } = result.value;
    return ok({ user, token, refreshToken });
  }
}