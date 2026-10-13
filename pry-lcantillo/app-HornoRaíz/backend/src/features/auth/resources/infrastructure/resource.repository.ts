import { Injectable } from '@nestjs/common';
import { ResourceModel } from '../../infrastructure/models/resource.model';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';

@Injectable()
export class ResourceRepository {
  async findAll(): Promise<ResourceModel[]> {
    return ResourceModel.findAll();
  }

  async findById(id: number): Promise<ResourceModel | null> {
    return ResourceModel.findByPk(id);
  }

  async findByMethodAndPath(method: string, path: string): Promise<ResourceModel | null> {
    return ResourceModel.findOne({
      where: {
        method: method.toUpperCase(),
        path,
      },
    });
  }

  async create(dto: CreateResourceDto): Promise<ResourceModel> {
    return ResourceModel.create({
      method: dto.method,
      path: dto.path,
      description: dto.description,
      status: dto.status || 'active',
    });
  }

  async update(id: number, dto: UpdateResourceDto): Promise<[number]> {
    return ResourceModel.update(dto, { where: { id } });
  }
}
