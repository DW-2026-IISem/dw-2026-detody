import { Model } from 'sequelize-typescript';
export declare class RoleUserModel extends Model {
    user_id: number;
    role_id: number;
    status: 'active' | 'inactive';
}
