import { Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { ResourceModel } from './resource.model';
export declare class RoleModel extends Model {
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    users: UserModel[];
    resources: ResourceModel[];
    static uppercaseName(instance: RoleModel): void;
}
