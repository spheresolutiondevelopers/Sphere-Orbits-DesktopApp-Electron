import { z } from 'zod';
export const UserSchema = z.object({
    userID: z.string().uuid(),
    email: z.string().email().max(255),
    username: z.string().min(3).max(100).optional(),
    password_hash: z.string().optional(),
    password_salt: z.string().optional(),
    displayName: z.string().min(1).max(100),
    firstName: z.string().max(50).optional().nullable(),
    lastName: z.string().max(50).optional().nullable(),
    phoneNumber: z.string().max(20).optional().nullable(),
    avatarUrl: z.string().url().max(500).optional().nullable(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
    accountType: z.enum(['free', 'premium', 'enterprise', 'admin']).default('free'),
    isActive: z.boolean().default(true),
    isDeleted: z.boolean().default(false),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
});
