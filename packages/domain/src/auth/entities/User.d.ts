import { User as UserDTO } from '@sphere/shared';
export declare class User {
    readonly userID: string;
    email: string;
    displayName: string;
    accountType: 'free' | 'premium' | 'enterprise' | 'admin';
    isActive: boolean;
    username?: string | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    phoneNumber?: string | null | undefined;
    avatarUrl?: string | null | undefined;
    dateOfBirth?: string | null | undefined;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    constructor(userID: string, email: string, displayName: string, accountType: 'free' | 'premium' | 'enterprise' | 'admin', isActive: boolean, username?: string | undefined, firstName?: string | null | undefined, lastName?: string | null | undefined, phoneNumber?: string | null | undefined, avatarUrl?: string | null | undefined, dateOfBirth?: string | null | undefined, createdAt?: string, updatedAt?: string, isDeleted?: boolean);
    /**
     * Factory method to create a User from a DTO.
     */
    static fromDTO(dto: UserDTO): User;
    /**
     * Converts this User to a DTO.
     */
    toDTO(): UserDTO;
    /**
     * Updates the user's profile. Only non‑null fields are updated.
     */
    updateProfile(updates: Partial<Omit<User, 'userID' | 'createdAt'>>): void;
}
//# sourceMappingURL=User.d.ts.map