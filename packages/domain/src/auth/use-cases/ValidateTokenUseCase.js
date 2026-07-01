"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateTokenUseCase = void 0;
class ValidateTokenUseCase {
    constructor(authRepo) {
        this.authRepo = authRepo;
    }
    async execute(token) {
        return this.authRepo.validateToken(token);
    }
}
exports.ValidateTokenUseCase = ValidateTokenUseCase;
//# sourceMappingURL=ValidateTokenUseCase.js.map