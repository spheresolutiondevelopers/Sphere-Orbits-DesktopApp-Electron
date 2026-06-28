import { z } from 'zod';
import { UserSchema } from '../../schemas';

// Request / Response DTOs
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
  refreshToken: z.string().optional(),
});

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(100),
  displayName: z.string().min(1).max(100),
});

export const ValidateTokenRequestSchema = z.object({
  token: z.string(),
});

export const ValidateTokenResponseSchema = z.object({
  valid: z.boolean(),
  user: UserSchema.optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type ValidateTokenRequest = z.infer<typeof ValidateTokenRequestSchema>;
export type ValidateTokenResponse = z.infer<typeof ValidateTokenResponseSchema>;