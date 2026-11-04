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

  async findById(id: number): Promise<RoleUserModel | null> {
    return RoleUserModel.findByPk(id, {
      include: [
        { model: UserModel, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: RoleModel, as: 'role', attributes: ['id', 'name'] },
      ],
    });
  }

  async findByUserAndRole(user_id: number, role_id: number): Promise<RoleUserModel | null> {
    return RoleUserModel.findOne({
      where: { user_id, role_id },
      include: [
        { model: UserModel, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: RoleModel, as: 'role', attributes: ['id', 'name'] },
      ],
    });
  }

  async create(dto: CreateRoleUserDto): Promise<RoleUserModel> {
    const created = await RoleUserModel.create({
      user_id: dto.user_id,
      role_id: dto.role_id,
      status: dto.status || 'active',
    });
    return this.findById(created.id) as Promise<RoleUserModel>;
  }

  async updateStatus(id: number, status: 'active' | 'inactive'): Promise<[number]> {
    return RoleUserModel.update({ status }, { where: { id } });
  }

  async delete(id: number): Promise<number> {
    return RoleUserModel.destroy({ where: { id } });
  }
}
