import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { UserModel } from '../../infrastructure/models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
  async findAll(): Promise<UserModel[]> {
    return UserModel.findAll({
      attributes: { exclude: ['password'] },
    });
  }

  async findById(id: number): Promise<UserModel | null> {
    return UserModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<UserModel | null> {
    return UserModel.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
  }

  async create(dto: CreateUserDto): Promise<UserModel> {
    return UserModel.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      avatar: dto.avatar,
      status: dto.status || 'active',
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<[number]> {
    return UserModel.update(dto, { where: { id } });
  }

  async updatePassword(id: number, hashedNewPassword: string): Promise<[number]> {
    return UserModel.update({ password: hashedNewPassword }, { where: { id } });
  }
}
