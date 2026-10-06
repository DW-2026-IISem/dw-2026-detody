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
exports.ProductTypeModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let ProductTypeModel = class ProductTypeModel extends sequelize_typescript_1.Model {
};
exports.ProductTypeModel = ProductTypeModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], ProductTypeModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false, unique: true }),
    __metadata("design:type", String)
], ProductTypeModel.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: true }),
    __metadata("design:type", Object)
], ProductTypeModel.prototype, "description", void 0);
exports.ProductTypeModel = ProductTypeModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'product_types', timestamps: true })
], ProductTypeModel);
//# sourceMappingURL=product-type.model.js.map