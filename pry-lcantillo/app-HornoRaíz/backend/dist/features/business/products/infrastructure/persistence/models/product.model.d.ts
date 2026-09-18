import { Model } from 'sequelize-typescript';
export declare class ProductModel extends Model {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    productTypeId: number;
    status: string;
}
