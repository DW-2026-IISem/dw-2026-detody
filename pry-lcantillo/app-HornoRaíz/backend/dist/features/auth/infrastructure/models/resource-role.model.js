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
exports.ResourceRoleModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const role_model_1 = require("./role.model");
const resource_model_1 = require("./resource.model");
let ResourceRoleModel = class ResourceRoleModel extends sequelize_typescript_1.Model {
};
exports.ResourceRoleModel = ResourceRoleModel;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => role_model_1.RoleModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ResourceRoleModel.prototype, "role_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => resource_model_1.ResourceModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ResourceRoleModel.prototype, "resource_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('active', 'inactive'), defaultValue: 'inactive', allowNull: false }),
    __metadata("design:type", String)
], ResourceRoleModel.prototype, "status", void 0);
exports.ResourceRoleModel = ResourceRoleModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'resource_roles', timestamps: true })
], ResourceRoleModel);
//# sourceMappingURL=resource-role.model.js.map