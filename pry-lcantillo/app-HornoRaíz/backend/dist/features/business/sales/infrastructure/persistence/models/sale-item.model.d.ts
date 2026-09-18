import { Model } from 'sequelize-typescript';
export declare class SaleItemModel extends Model {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}
