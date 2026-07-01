import { z } from 'zod';
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const LoginResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        userID: z.ZodString;
        email: z.ZodString;
        username: z.ZodOptional<z.ZodString>;
        password_hash: z.ZodOptional<z.ZodString>;
        password_salt: z.ZodOptional<z.ZodString>;
        displayName: z.ZodString;
        firstName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        phoneNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        dateOfBirth: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        accountType: z.ZodDefault<z.ZodEnum<["free", "premium", "enterprise", "admin"]>>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        email: string;
        displayName: string;
        accountType: "free" | "premium" | "enterprise" | "admin";
        isActive: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
    }, {
        userID: string;
        email: string;
        displayName: string;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
        accountType?: "free" | "premium" | "enterprise" | "admin" | undefined;
        isActive?: boolean | undefined;
        isDeleted?: boolean | undefined;
    }>;
    token: z.ZodString;
    refreshToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    user: {
        userID: string;
        email: string;
        displayName: string;
        accountType: "free" | "premium" | "enterprise" | "admin";
        isActive: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
    };
    token: string;
    refreshToken?: string | undefined;
}, {
    user: {
        userID: string;
        email: string;
        displayName: string;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
        accountType?: "free" | "premium" | "enterprise" | "admin" | undefined;
        isActive?: boolean | undefined;
        isDeleted?: boolean | undefined;
    };
    token: string;
    refreshToken?: string | undefined;
}>;
export declare const SignupRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    username: z.ZodString;
    displayName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    username: string;
    displayName: string;
    password: string;
}, {
    email: string;
    username: string;
    displayName: string;
    password: string;
}>;
export declare const ValidateTokenRequestSchema: z.ZodObject<{
    token: z.ZodString;
}, "strip", z.ZodTypeAny, {
    token: string;
}, {
    token: string;
}>;
export declare const ValidateTokenResponseSchema: z.ZodObject<{
    valid: z.ZodBoolean;
    user: z.ZodOptional<z.ZodObject<{
        userID: z.ZodString;
        email: z.ZodString;
        username: z.ZodOptional<z.ZodString>;
        password_hash: z.ZodOptional<z.ZodString>;
        password_salt: z.ZodOptional<z.ZodString>;
        displayName: z.ZodString;
        firstName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        lastName: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        phoneNumber: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        dateOfBirth: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        accountType: z.ZodDefault<z.ZodEnum<["free", "premium", "enterprise", "admin"]>>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        isDeleted: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userID: string;
        email: string;
        displayName: string;
        accountType: "free" | "premium" | "enterprise" | "admin";
        isActive: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
    }, {
        userID: string;
        email: string;
        displayName: string;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
        accountType?: "free" | "premium" | "enterprise" | "admin" | undefined;
        isActive?: boolean | undefined;
        isDeleted?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    valid: boolean;
    user?: {
        userID: string;
        email: string;
        displayName: string;
        accountType: "free" | "premium" | "enterprise" | "admin";
        isActive: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
    } | undefined;
}, {
    valid: boolean;
    user?: {
        userID: string;
        email: string;
        displayName: string;
        createdAt: string;
        updatedAt: string;
        username?: string | undefined;
        password_hash?: string | undefined;
        password_salt?: string | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        phoneNumber?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        dateOfBirth?: string | null | undefined;
        accountType?: "free" | "premium" | "enterprise" | "admin" | undefined;
        isActive?: boolean | undefined;
        isDeleted?: boolean | undefined;
    } | undefined;
}>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type ValidateTokenRequest = z.infer<typeof ValidateTokenRequestSchema>;
export type ValidateTokenResponse = z.infer<typeof ValidateTokenResponseSchema>;
//# sourceMappingURL=auth.contract.d.ts.map