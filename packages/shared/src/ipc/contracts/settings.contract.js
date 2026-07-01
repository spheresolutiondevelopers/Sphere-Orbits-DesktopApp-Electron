"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSettingsResponseSchema = exports.UpdateSettingsRequestSchema = exports.GetSettingsResponseSchema = exports.GetSettingsRequestSchema = void 0;
const zod_1 = require("zod");
const schemas_1 = require("../../schemas");
exports.GetSettingsRequestSchema = zod_1.z.object({});
exports.GetSettingsResponseSchema = zod_1.z.object({
    settings: schemas_1.SettingsSchema,
});
exports.UpdateSettingsRequestSchema = zod_1.z.object({
    updates: schemas_1.SettingsSchema.partial(),
});
exports.UpdateSettingsResponseSchema = zod_1.z.object({
    settings: schemas_1.SettingsSchema,
});
//# sourceMappingURL=settings.contract.js.map