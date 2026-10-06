import { UserRepository } from '../infrastructure/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserModel } from '../../infrastructure/models/user.model';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findAll(): Promise<UserModel[]>;
    findById(id: number): Promise<UserModel>;
    create(dto: CreateUserDto): Promise<UserModel>;
    update(id: number, dto: UpdateUserDto): Promise<UserModel>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
