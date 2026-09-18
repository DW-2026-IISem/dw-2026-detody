import { Model } from 'sequelize-typescript';
export declare class ClientModel extends Model {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: string;
}
