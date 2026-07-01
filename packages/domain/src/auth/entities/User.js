"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(userID, email, displayName, accountType, isActive, username, firstName, lastName, phoneNumber, avatarUrl, dateOfBirth, createdAt = new Date().toISOString(), updatedAt = new Date().toISOString(), isDeleted = false) {
        this.userID = userID;
        this.email = email;
        this.displayName = displayName;
        this.accountType = accountType;
        this.isActive = isActive;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.avatarUrl = avatarUrl;
        this.dateOfBirth = dateOfBirth;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isDeleted = isDeleted;
    }
    /**
     * Factory method to create a User from a DTO.
     */
    static fromDTO(dto) {
        return new User(dto.userID, dto.email, dto.displayName, dto.accountType, dto.isActive, dto.username, dto.firstName, dto.lastName, dto.phoneNumber, dto.avatarUrl, dto.dateOfBirth, dto.createdAt, dto.updatedAt, dto.isDeleted);
    }
    /**
     * Converts this User to a DTO.
     */
    toDTO() {
        return {
            userID: this.userID,
            email: this.email,
            username: this.username,
            displayName: this.displayName,
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            avatarUrl: this.avatarUrl,
            dateOfBirth: this.dateOfBirth,
            accountType: this.accountType,
            isActive: this.isActive,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    /**
     * Updates the user's profile. Only non‑null fields are updated.
     */
    updateProfile(updates) {
        Object.assign(this, updates);
        this.updatedAt = new Date().toISOString();
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map