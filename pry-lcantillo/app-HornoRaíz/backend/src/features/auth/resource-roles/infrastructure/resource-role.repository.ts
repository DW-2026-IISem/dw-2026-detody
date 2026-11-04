import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { ResourceRoleModel } from '../../infrastructure/models/resource-role.model.js';
import { RoleUserModel } from '../../infrastructure/models/role-user.model.js';
import { ResourceModel } from '../../infrastructure/models/resource.model.js';
import { RoleModel } from '../../infrastructure/models/role.model.js';

@Injectable()
export class ResourceRoleRepository {
  async findAll() {
    return ResourceRoleModel.findAll({
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
    // 1. Obtener los roles del usuario desde la tabla pivote role_users
    const userRoles = await RoleUserModel.findAll({
      where: { user_id: userId },
    });

    const roleIds = userRoles.map((ur: any) => ur.role_id);
    if (roleIds.length === 0) return [];

    // 2. Traer las concesiones de esos roles junto con el recurso y el rol
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
    return ResourceRoleModel.create(data);
  }

  async updateStatus(id: number, status: string) {
    return ResourceRoleModel.update({ status }, { where: { id } });
  }
}
