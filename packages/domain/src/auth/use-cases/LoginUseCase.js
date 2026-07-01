"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const shared_1 = require("@sphere/shared");
class LoginUseCase {
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    async execute(input) {
        const result = await this.authRepo.login(input.email, input.password);
        if (result.isFailure()) {
            return result; // propagate error
        }
        const { user, token, refreshToken } = result.value;
        return (0, shared_1.ok)({ user, token, refreshToken });
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=LoginUseCase.js.map