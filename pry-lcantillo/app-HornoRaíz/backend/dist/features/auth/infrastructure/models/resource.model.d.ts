import { Model } from 'sequelize-typescript';
import { RoleModel } from './role.model';
export declare class ResourceModel extends Model {
    method: string;
    path: string;
    description?: string;
    status: 'active' | 'inactive';
    roles: RoleModel[];
    static normalizeMethodAndPath(instance: ResourceModel): void;
}
