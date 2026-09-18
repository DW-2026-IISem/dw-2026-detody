import { Model } from 'sequelize-typescript';
import { SaleItemModel } from './sale-item.model.js';
export declare class SaleModel extends Model {
    id: number;
    clientId: number;
    totalAmount: number;
    status: string;
    items: SaleItemModel[];
}
