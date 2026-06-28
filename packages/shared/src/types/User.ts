export interface User {
  userID: string;
  email: string;
  username?: string;
  password_hash?: string;
  password_salt?: string;
  displayName: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  dateOfBirth?: string | null; // YYYY-MM-DD
  accountType: 'free' | 'premium' | 'enterprise' | 'admin';
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}