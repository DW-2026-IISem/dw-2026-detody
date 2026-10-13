import { Injectable } from '@nestjs/common';
import { ResourceRoleModel } from '../../infrastructure/models/resource-role.model';
import { RoleModel } from '../../infrastructure/models/role.model';
import { ResourceModel } from '../../infrastructure/models/resource.model';
import { GrantPermissionDto } from '../dto/grant-permission.dto';

@Injectable()
export class ResourceRoleRepository {
  async findAll(): Promise<ResourceRoleModel[]> {
    return ResourceRoleModel.findAll({
      where: { status: 'active' },
      include: [
        { model: RoleModel, as: 'role', attributes: ['id', 'name'] },
        { model: ResourceModel, as: 'resource', attributes: ['id', 'method', 'path', 'description'] },
      ],
    });
  }
  async findByRoleAndResource(role_id: number, resource_id: number): Promise<ResourceRoleModel | null> {
    return ResourceRoleModel.findOne({ where: { role_id, resource_id } });
  }
  async create(dto: GrantPermissionDto): Promise<ResourceRoleModel> {
    return ResourceRoleModel.create({ role_id: dto.role_id, resource_id: dto.resource_id, status: dto.status || 'active' });
  }
  async updateStatus(id: number, status: 'active' | 'inactive'): Promise<[number]> {
    return ResourceRoleModel.update({ status }, { where: { id } });
  }
}
