"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUseCase = void 0;
class LogoutUseCase {
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    async execute(token) {
        return this.authRepo.logout(token);
    }
}
exports.LogoutUseCase = LogoutUseCase;
//# sourceMappingURL=LogoutUseCase.js.map