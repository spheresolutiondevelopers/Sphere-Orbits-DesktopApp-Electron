"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentsUseCase = void 0;
const shared_1 = require("@sphere/shared");
class GetAppointmentsUseCase {
    constructor(appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }
    async execute(userID, filters, pagination) {
        if (!userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        return this.appointmentRepo.getAppointments(userID, filters, pagination);
    }
}
exports.GetAppointmentsUseCase = GetAppointmentsUseCase;
//# sourceMappingURL=GetAppointmentsUseCase.js.map