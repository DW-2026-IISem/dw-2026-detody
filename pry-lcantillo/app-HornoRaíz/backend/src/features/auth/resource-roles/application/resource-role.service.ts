import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ResourceRoleRepository } from '../infrastructure/resource-role.repository';
import { GrantPermissionDto } from '../dto/grant-permission.dto';

@Injectable()
export class ResourceRoleService {
  constructor(private readonly resourceRoleRepository: ResourceRoleRepository) {}
  async findAll() { return this.resourceRoleRepository.findAll(); }
  async grantPermission(dto: GrantPermissionDto) {
    const existing = await this.resourceRoleRepository.findByRoleAndResource(dto.role_id, dto.resource_id);
    if (existing) {
      if (existing.status === 'active') throw new ConflictException('El rol ya tiene concedido este recurso activamente');
      await this.resourceRoleRepository.updateStatus(existing.id, dto.status || 'active');
      return this.resourceRoleRepository.findByRoleAndResource(dto.role_id, dto.resource_id);
    }
    return this.resourceRoleRepository.create(dto);
  }
  async revokePermission(role_id: number, resource_id: number) {
    const existing = await this.resourceRoleRepository.findByRoleAndResource(role_id, resource_id);
    if (!existing) throw new NotFoundException('La concesión de este recurso al rol no existe');
    await this.resourceRoleRepository.updateStatus(existing.id, 'inactive');
    return { message: 'Permiso revocado exitosamente' };
  }
}
