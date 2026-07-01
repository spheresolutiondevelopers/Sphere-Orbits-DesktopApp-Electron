"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = require("zod");
exports.UserSchema = zod_1.z.object({
    userID: zod_1.z.string().uuid(),
    email: zod_1.z.string().email().max(255),
    username: zod_1.z.string().min(3).max(100).optional(),
    password_hash: zod_1.z.string().optional(),
    password_salt: zod_1.z.string().optional(),
    displayName: zod_1.z.string().min(1).max(100),
    firstName: zod_1.z.string().max(50).optional().nullable(),
    lastName: zod_1.z.string().max(50).optional().nullable(),
    phoneNumber: zod_1.z.string().max(20).optional().nullable(),
    avatarUrl: zod_1.z.string().url().max(500).optional().nullable(),
    dateOfBirth: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
    accountType: zod_1.z.enum(['free', 'premium', 'enterprise', 'admin']).default('free'),
    isActive: zod_1.z.boolean().default(true),
    isDeleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.string().datetime({ offset: true }),
    updatedAt: zod_1.z.string().datetime({ offset: true }),
});
//# sourceMappingURL=auth.schema.js.map