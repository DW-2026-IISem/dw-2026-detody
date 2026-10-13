import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ResourceRepository } from '../infrastructure/resource.repository';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';
import { normalizePath } from '../../../../shared/auth/resource-match.util';

@Injectable()
export class ResourceService {
  constructor(private readonly resourceRepository: ResourceRepository) {}

  async findAll() {
    return this.resourceRepository.findAll();
  }

  async findById(id: number) {
    const resource = await this.resourceRepository.findById(id);
    if (!resource) {
      throw new NotFoundException(`Recurso con ID ${id} no encontrado`);
    }
    return resource;
  }

  async create(dto: CreateResourceDto) {
    const normalizedPath = normalizePath(dto.path);
    const existing = await this.resourceRepository.findByMethodAndPath(dto.method, normalizedPath);
    if (existing) {
      throw new ConflictException(`El recurso ${dto.method} ${normalizedPath} ya está registrado`);
    }
    return this.resourceRepository.create({ ...dto, path: normalizedPath });
  }

  async update(id: number, dto: UpdateResourceDto) {
    await this.findById(id);
    const updateData = { ...dto };
    if (updateData.path) {
      updateData.path = normalizePath(updateData.path);
    }
    await this.resourceRepository.update(id, updateData);
    return this.findById(id);
  }
}
