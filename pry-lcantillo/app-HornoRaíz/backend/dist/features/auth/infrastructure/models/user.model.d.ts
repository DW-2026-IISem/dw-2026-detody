import { Model } from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { RefreshTokenModel } from './refresh-token.model';
export declare class UserModel extends Model {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    status: 'active' | 'inactive';
    roles: RoleModel[];
    refreshTokens: RefreshTokenModel[];
    static hashUserPassword(instance: UserModel): Promise<void>;
    static normalizeFields(instance: UserModel): void;
}
