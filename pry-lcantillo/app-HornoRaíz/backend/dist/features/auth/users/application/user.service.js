"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../infrastructure/user.repository");
const password_util_1 = require("../../../../shared/auth/password.util");
const user_model_1 = require("../../infrastructure/models/user.model");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll() {
        return this.userRepository.findAll();
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }
    async create(dto) {
        const existing = await this.userRepository.findByUsernameOrEmail(dto.username, dto.email);
        if (existing) {
            throw new common_1.ConflictException('El nombre de usuario o correo electrónico ya están registrados');
        }
        return this.userRepository.create(dto);
    }
    async update(id, dto) {
        await this.findById(id);
        await this.userRepository.update(id, dto);
        return this.findById(id);
    }
    async changePassword(userId, dto) {
        const user = await user_model_1.UserModel.findByPk(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const isMatch = await (0, password_util_1.comparePassword)(dto.currentPassword, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        }
        const hashedNew = await (0, password_util_1.hashPassword)(dto.newPassword);
        await this.userRepository.updatePassword(userId, hashedNew);
        return { message: 'Contraseña actualizada exitosamente' };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map