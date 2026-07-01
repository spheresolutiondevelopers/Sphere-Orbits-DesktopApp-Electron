"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTokenResponseSchema = exports.ValidateTokenRequestSchema = exports.SignupRequestSchema = exports.LoginResponseSchema = exports.LoginRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
// Request / Response DTOs
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.LoginResponseSchema = zod_1.z.object({
    user: schemas_1.UserSchema,
    token: zod_1.z.string(),
    refreshToken: zod_1.z.string().optional(),
});
exports.SignupRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    username: zod_1.z.string().min(3).max(100),
    displayName: zod_1.z.string().min(1).max(100),
});
exports.ValidateTokenRequestSchema = zod_1.z.object({
    token: zod_1.z.string(),
});
exports.ValidateTokenResponseSchema = zod_1.z.object({
    valid: zod_1.z.boolean(),
    user: schemas_1.UserSchema.optional(),
});
//# sourceMappingURL=auth.contract.js.map