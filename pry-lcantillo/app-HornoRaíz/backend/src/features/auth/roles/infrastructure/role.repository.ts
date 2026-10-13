import { Injectable } from '@nestjs/common';
import { RoleModel } from '../../infrastructure/models/role.model';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleRepository {
  async findAll(): Promise<RoleModel[]> {
    return RoleModel.findAll();
  }

  async findById(id: number): Promise<RoleModel | null> {
    return RoleModel.findByPk(id);
  }

  async findByName(name: string): Promise<RoleModel | null> {
    return RoleModel.findOne({ where: { name: name.toUpperCase() } });
  }

  async create(dto: CreateRoleDto): Promise<RoleModel> {
    return RoleModel.create({
      name: dto.name,
      description: dto.description,
      status: dto.status || 'active',
    });
  }

  async update(id: number, dto: UpdateRoleDto): Promise<[number]> {
    return RoleModel.update(dto, { where: { id } });
  }
}
