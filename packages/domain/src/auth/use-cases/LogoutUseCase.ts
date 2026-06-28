import { Result } from '@sphere/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';

export class LogoutUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(token: string): Promise<Result<void, Error>> {
    return this.authRepo.logout(token);
  }
}