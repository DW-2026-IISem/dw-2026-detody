import { Model } from 'sequelize-typescript';
import { UserModel } from './user.model';
export declare class RefreshTokenModel extends Model {
    user_id: number;
    token_hash: string;
    family_id: string;
    device_info?: string;
    expires_at: Date;
    status: 'active' | 'inactive';
    user: UserModel;
}
