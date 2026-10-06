import { UserModel } from '../../infrastructure/models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UserRepository {
    findAll(): Promise<UserModel[]>;
    findById(id: number): Promise<UserModel | null>;
    findByUsernameOrEmail(username: string, email: string): Promise<UserModel | null>;
    create(dto: CreateUserDto): Promise<UserModel>;
    update(id: number, dto: UpdateUserDto): Promise<[number]>;
    updatePassword(id: number, hashedNewPassword: string): Promise<[number]>;
}
