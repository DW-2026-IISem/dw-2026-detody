import { Model } from 'sequelize-typescript';
export declare class ResourceRoleModel extends Model {
    role_id: number;
    resource_id: number;
    status: 'active' | 'inactive';
}
