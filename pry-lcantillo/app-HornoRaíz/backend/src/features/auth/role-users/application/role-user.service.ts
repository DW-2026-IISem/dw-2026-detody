import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RoleUserRepository } from '../infrastructure/role-user.repository';
import { CreateRoleUserDto } from '../dto/create-role-user.dto';

@Injectable()
export class RoleUserService {
  constructor(private readonly roleUserRepository: RoleUserRepository) {}
  async findAll() { return this.roleUserRepository.findAll(); }
  async assignRole(dto: CreateRoleUserDto) {
    const existing = await this.roleUserRepository.findByUserAndRole(dto.user_id, dto.role_id);
    if (existing) {
      if (existing.status === 'active') throw new ConflictException('El usuario ya tiene asignado este rol activamente');
      await this.roleUserRepository.updateStatus(existing.id, dto.status || 'active');
      return this.roleUserRepository.findByUserAndRole(dto.user_id, dto.role_id);
    }
    return this.roleUserRepository.create(dto);
  }
  async revokeRole(user_id: number, role_id: number) {
    const existing = await this.roleUserRepository.findByUserAndRole(user_id, role_id);
    if (!existing) throw new NotFoundException('La asignación de este rol al usuario no existe');
    await this.roleUserRepository.updateStatus(existing.id, 'inactive');
    return { message: 'Rol revocado exitosamente' };
  }
}
