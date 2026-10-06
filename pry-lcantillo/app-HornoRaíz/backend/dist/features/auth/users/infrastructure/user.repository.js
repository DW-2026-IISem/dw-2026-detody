"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const user_model_1 = require("../../infrastructure/models/user.model");
let UserRepository = class UserRepository {
    async findAll() {
        return user_model_1.UserModel.findAll({
            attributes: { exclude: ['password'] },
        });
    }
    async findById(id) {
        return user_model_1.UserModel.findByPk(id, {
            attributes: { exclude: ['password'] },
        });
    }
    async findByUsernameOrEmail(username, email) {
        return user_model_1.UserModel.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username }, { email }],
            },
        });
    }
    async create(dto) {
        return user_model_1.UserModel.create({
            username: dto.username,
            email: dto.email,
            password: dto.password,
            avatar: dto.avatar,
            status: dto.status || 'active',
        });
    }
    async update(id, dto) {
        return user_model_1.UserModel.update(dto, { where: { id } });
    }
    async updatePassword(id, hashedNewPassword) {
        return user_model_1.UserModel.update({ password: hashedNewPassword }, { where: { id } });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)()
], UserRepository);
//# sourceMappingURL=user.repository.js.map