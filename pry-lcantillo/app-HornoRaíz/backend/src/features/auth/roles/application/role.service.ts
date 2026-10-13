import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RoleRepository } from '../infrastructure/role.repository';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async findAll() {
    return this.roleRepository.findAll();
  }

  async findById(id: number) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return role;
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.roleRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException(`El rol ${dto.name} ya existe`);
    }
    return this.roleRepository.create(dto);
  }

  async update(id: number, dto: UpdateRoleDto) {
    await this.findById(id);
    await this.roleRepository.update(id, dto);
    return this.findById(id);
  }
}
