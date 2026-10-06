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
exports.SaleModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const client_model_js_1 = require("../../../../clients/infrastructure/persistence/models/client.model.js");
const sale_item_model_js_1 = require("./sale-item.model.js");
let SaleModel = class SaleModel extends sequelize_typescript_1.Model {
};
exports.SaleModel = SaleModel;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], SaleModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => client_model_js_1.ClientModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], SaleModel.prototype, "clientId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], SaleModel.prototype, "totalAmount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('completed', 'cancelled'), defaultValue: 'completed' }),
    __metadata("design:type", String)
], SaleModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => sale_item_model_js_1.SaleItemModel),
    __metadata("design:type", Array)
], SaleModel.prototype, "items", void 0);
exports.SaleModel = SaleModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'sales', timestamps: true })
], SaleModel);
//# sourceMappingURL=sale.model.js.map