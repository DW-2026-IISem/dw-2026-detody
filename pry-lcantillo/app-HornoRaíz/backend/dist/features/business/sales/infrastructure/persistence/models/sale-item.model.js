var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
import { SaleModel } from './sale.model.js';
let SaleItemModel = class SaleItemModel extends Model {
};
__decorate([
    Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true }),
    __metadata("design:type", Number)
], SaleItemModel.prototype, "id", void 0);
__decorate([
    ForeignKey(() => SaleModel),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], SaleItemModel.prototype, "saleId", void 0);
__decorate([
    ForeignKey(() => ProductModel),
    Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], SaleItemModel.prototype, "productId", void 0);
__decorate([
    Column({ type: DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], SaleItemModel.prototype, "quantity", void 0);
__decorate([
    Column({ type: DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], SaleItemModel.prototype, "unitPrice", void 0);
__decorate([
    Column({ type: DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", Number)
], SaleItemModel.prototype, "subtotal", void 0);
SaleItemModel = __decorate([
    Table({ tableName: 'sale_items', timestamps: true })
], SaleItemModel);
export { SaleItemModel };
//# sourceMappingURL=sale-item.model.js.map