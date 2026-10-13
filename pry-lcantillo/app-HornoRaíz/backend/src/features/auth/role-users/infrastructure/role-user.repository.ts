import { Injectable } from '@nestjs/common';
import { RoleUserModel } from '../../infrastructure/models/role-user.model';
import { UserModel } from '../../infrastructure/models/user.model';
import { RoleModel } from '../../infrastructure/models/role.model';
import { CreateRoleUserDto } from '../dto/create-role-user.dto';

@Injectable()
export class RoleUserRepository {
  async findAll(): Promise<RoleUserModel[]> {
    return RoleUserModel.findAll({
      where: { status: 'active' },
      include: [
        { model: UserModel, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: RoleModel, as: 'role', attributes: ['id', 'name'] },
      ],
    });
  }

  async findByUserAndRole(user_id: number, role_id: number): Promise<RoleUserModel | null> {
    return RoleUserModel.findOne({ where: { user_id, role_id } });
  }

  async create(dto: CreateRoleUserDto): Promise<RoleUserModel> {
    return RoleUserModel.create({
      user_id: dto.user_id,
      role_id: dto.role_id,
      status: dto.status || 'active',
    });
  }

  async updateStatus(id: number, status: 'active' | 'inactive'): Promise<[number]> {
    return RoleUserModel.update({ status }, { where: { id } });
  }
}
