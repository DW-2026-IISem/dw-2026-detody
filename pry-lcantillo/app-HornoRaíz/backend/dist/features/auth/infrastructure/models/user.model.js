"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const password_util_1 = require("../../../../shared/auth/password.util");
const role_model_1 = require("./role.model");
const role_user_model_1 = require("./role-user.model");
const refresh_token_model_1 = require("./refresh-token.model");
let UserModel = class UserModel extends sequelize_typescript_1.Model {
    static async hashUserPassword(instance) {
        if (instance.changed('password')) {
            instance.password = await (0, password_util_1.hashPassword)(instance.password);
        }
    }
    static normalizeFields(instance) {
        if (instance.username)
            instance.username = instance.username.trim().toLowerCase();
        if (instance.email)
            instance.email = instance.email.trim().toLowerCase();
    }
};
exports.UserModel = UserModel;
__decorate([
    (0, sequelize_typescript_1.Unique)('uq_users_username'),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(80), allowNull: false }),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Unique)('uq_users_email'),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(150), allowNull: false }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: true }),
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false }),
    __metadata("design:type", String)
], UserModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => role_model_1.RoleModel, () => role_user_model_1.RoleUserModel),
    __metadata("design:type", Array)
], UserModel.prototype, "roles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => refresh_token_model_1.RefreshTokenModel),
    __metadata("design:type", Array)
], UserModel.prototype, "refreshTokens", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserModel]),
    __metadata("design:returntype", Promise)
], UserModel, "hashUserPassword", null);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserModel]),
    __metadata("design:returntype", void 0)
], UserModel, "normalizeFields", null);
exports.UserModel = UserModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'users', timestamps: true })
], UserModel);
//# sourceMappingURL=user.model.js.map