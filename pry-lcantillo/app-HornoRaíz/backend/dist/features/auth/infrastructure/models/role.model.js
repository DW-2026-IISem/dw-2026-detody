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
exports.RoleModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const user_model_1 = require("./user.model");
const role_user_model_1 = require("./role-user.model");
const resource_model_1 = require("./resource.model");
const resource_role_model_1 = require("./resource-role.model");
let RoleModel = class RoleModel extends sequelize_typescript_1.Model {
    static uppercaseName(instance) {
        if (instance.name)
            instance.name = instance.name.trim().toUpperCase();
    }
};
exports.RoleModel = RoleModel;
__decorate([
    (0, sequelize_typescript_1.Unique)('uq_roles_name'),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(80), allowNull: false }),
    __metadata("design:type", String)
], RoleModel.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", String)
], RoleModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false }),
    __metadata("design:type", String)
], RoleModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => user_model_1.UserModel, () => role_user_model_1.RoleUserModel),
    __metadata("design:type", Array)
], RoleModel.prototype, "users", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => resource_model_1.ResourceModel, () => resource_role_model_1.ResourceRoleModel),
    __metadata("design:type", Array)
], RoleModel.prototype, "resources", void 0);
__decorate([
    sequelize_typescript_1.BeforeValidate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RoleModel]),
    __metadata("design:returntype", void 0)
], RoleModel, "uppercaseName", null);
exports.RoleModel = RoleModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'roles', timestamps: true })
], RoleModel);
//# sourceMappingURL=role.model.js.map