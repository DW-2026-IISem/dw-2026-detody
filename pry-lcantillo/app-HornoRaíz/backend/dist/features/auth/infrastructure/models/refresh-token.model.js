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
exports.RefreshTokenModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
let RefreshTokenModel = class RefreshTokenModel extends sequelize_typescript_1.Model {
};
exports.RefreshTokenModel = RefreshTokenModel;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.UserModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], RefreshTokenModel.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Unique)('uq_refresh_tokens_token_hash'),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "token_hash", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "family_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500), allowNull: true }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "device_info", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], RefreshTokenModel.prototype, "expires_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('active', 'inactive'), defaultValue: 'active', allowNull: false }),
    __metadata("design:type", String)
], RefreshTokenModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.UserModel),
    __metadata("design:type", user_model_1.UserModel)
], RefreshTokenModel.prototype, "user", void 0);
exports.RefreshTokenModel = RefreshTokenModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'refresh_tokens', timestamps: true })
], RefreshTokenModel);
//# sourceMappingURL=refresh-token.model.js.map