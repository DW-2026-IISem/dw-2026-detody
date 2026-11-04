import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResourceRoleModel } from '../../infrastructure/models/resource-role.model.js';
import { RoleUserModel } from '../../infrastructure/models/role-user.model.js';
import { ResourceModel } from '../../infrastructure/models/resource.model.js';
import { RoleModel } from '../../infrastructure/models/role.model.js';

@Injectable()
export class ResourceRoleRepository {
  async findAll(filters?: { role_id?: number; resource_id?: number }) {
    const where: any = {};
    if (filters?.role_id) where.role_id = filters.role_id;
    if (filters?.resource_id) where.resource_id = filters.resource_id;

    return ResourceRoleModel.findAll({
      where,
      include: [
        { model: ResourceModel, as: 'resource' },
        { model: RoleModel, as: 'role' },
      ],
    });
  }

  async findById(id: number) {
    return ResourceRoleModel.findByPk(id, {
      include: [
        { model: ResourceModel, as: 'resource' },
        { model: RoleModel, as: 'role' },
      ],
    });
  }

  async findByRoleId(roleId: number) {
    return ResourceRoleModel.findAll({
      where: { role_id: roleId },
      include: [
        { model: ResourceModel, as: 'resource' },
        { model: RoleModel, as: 'role' },
      ],
    });
  }

  async findByUserId(userId: number) {
    const userRoles = await RoleUserModel.findAll({
      where: { user_id: userId, status: 'active' },
    });

    const roleIds = userRoles.map((ur: any) => ur.role_id);
    if (roleIds.length === 0) return [];

    return ResourceRoleModel.findAll({
      where: {
        role_id: { [Op.in]: roleIds },
        status: 'active',
      },
      include: [
        { model: ResourceModel, as: 'resource' },
        { model: RoleModel, as: 'role' },
      ],
    });
  }

  async findByRoleAndResource(role_id: number, resource_id: number) {
    return ResourceRoleModel.findOne({
      where: { role_id, resource_id },
      include: [
        { model: ResourceModel, as: 'resource' },
        { model: RoleModel, as: 'role' },
      ],
    });
  }

  async create(data: any) {
    const created = await ResourceRoleModel.create(data);
    return this.findById(created.id);
  }

  async updateStatus(id: number, status: string) {
    return ResourceRoleModel.update({ status }, { where: { id } });
  }

  async delete(id: number) {
    return ResourceRoleModel.destroy({ where: { id } });
  }
}
