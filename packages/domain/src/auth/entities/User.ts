import { User as UserDTO } from '@sphere/shared';

export class User {
  constructor(
    public readonly userID: string,
    public email: string,
    public displayName: string,
    public accountType: 'free' | 'premium' | 'enterprise' | 'admin',
    public isActive: boolean,
    public username?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public phoneNumber?: string | null,
    public avatarUrl?: string | null,
    public dateOfBirth?: string | null,
    public createdAt: string = new Date().toISOString(),
    public updatedAt: string = new Date().toISOString(),
    public isDeleted: boolean = false
  ) {}

  /**
   * Factory method to create a User from a DTO.
   */
  static fromDTO(dto: UserDTO): User {
    return new User(
      dto.userID,
      dto.email,
      dto.displayName,
      dto.accountType,
      dto.isActive,
      dto.username,
      dto.firstName,
      dto.lastName,
      dto.phoneNumber,
      dto.avatarUrl,
      dto.dateOfBirth,
      dto.createdAt,
      dto.updatedAt,
      dto.isDeleted
    );
  }

  /**
   * Converts this User to a DTO.
   */
  toDTO(): UserDTO {
    return {
      userID: this.userID,
      email: this.email,
      username: this.username,
      displayName: this.displayName,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      avatarUrl: this.avatarUrl,
      dateOfBirth: this.dateOfBirth,
      accountType: this.accountType,
      isActive: this.isActive,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Updates the user's profile. Only non‑null fields are updated.
   */
  updateProfile(updates: Partial<Omit<User, 'userID' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
  }
}