import { UserService } from '../application/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<import("../../infrastructure/models/user.model").UserModel[]>;
    findById(id: number): Promise<import("../../infrastructure/models/user.model").UserModel>;
    create(dto: CreateUserDto): Promise<import("../../infrastructure/models/user.model").UserModel>;
    update(id: number, dto: UpdateUserDto): Promise<import("../../infrastructure/models/user.model").UserModel>;
    changePassword(id: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
