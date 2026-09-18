var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { ClientModel } from '../../../../clients/infrastructure/persistence/models/client.model.js';
import { SaleItemModel } from './sale-item.model.js';
let SaleModel = class SaleModel extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], SaleModel.prototype, "id", void 0);
__decorate([
    ForeignKey(() => ClientModel),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], SaleModel.prototype, "clientId", void 0);
__decorate([
    Column({ type: DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], SaleModel.prototype, "totalAmount", void 0);
__decorate([
    Column({ type: DataType.ENUM('completed', 'cancelled'), defaultValue: 'completed' }),
    __metadata("design:type", String)
], SaleModel.prototype, "status", void 0);
__decorate([
    HasMany(() => SaleItemModel),
    __metadata("design:type", Array)
], SaleModel.prototype, "items", void 0);
SaleModel = __decorate([
    Table({ tableName: 'sales', timestamps: true })
], SaleModel);
export { SaleModel };
//# sourceMappingURL=sale.model.js.map