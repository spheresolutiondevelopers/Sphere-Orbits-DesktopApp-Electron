import { Result } from '@sphere/shared';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { User } from '../entities/User';

export class ValidateTokenUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(token: string): Promise<Result<User, Error>> {
    return this.authRepo.validateToken(token);
  }
}