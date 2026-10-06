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
exports.ResourceModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const resource_match_util_1 = require("../../../../shared/auth/resource-match.util");
const role_model_1 = require("./role.model");
const resource_role_model_1 = require("./resource-role.model");
let ResourceModel = class ResourceModel extends sequelize_typescript_1.Model {
    static normalizeMethodAndPath(instance) {
        if (instance.method)
            instance.method = instance.method.trim().toUpperCase();
        if (instance.path)
            instance.path = (0, resource_match_util_1.normalizePath)(instance.path.trim());
    }
};
exports.ResourceModel = ResourceModel;
__decorate([
    (0, sequelize_typescript_1.Index)({ name: 'uq_resources_method_path', unique: true }),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10), allowNull: false }),
    __metadata("design:type", String)
], ResourceModel.prototype, "method", void 0);
__decorate([
    (0, sequelize_typescript_1.Index)({ name: 'uq_resources_method_path', unique: true }),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], ResourceModel.prototype, "path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", String)
], ResourceModel.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false }),
    __metadata("design:type", String)
], ResourceModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => role_model_1.RoleModel, () => resource_role_model_1.ResourceRoleModel),
    __metadata("design:type", Array)
], ResourceModel.prototype, "roles", void 0);
__decorate([
    sequelize_typescript_1.BeforeValidate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResourceModel]),
    __metadata("design:returntype", void 0)
], ResourceModel, "normalizeMethodAndPath", null);
exports.ResourceModel = ResourceModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'resources', timestamps: true })
], ResourceModel);
//# sourceMappingURL=resource.model.js.map