import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ResourceRepository } from '../infrastructure/resource.repository';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';

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
    const existing = await this.resourceRepository.findByMethodAndPath(dto.method, dto.path);
    if (existing) {
      throw new ConflictException(`El recurso ${dto.method} ${dto.path} ya existe`);
    }
    return this.resourceRepository.create(dto);
  }

  async update(id: number, dto: UpdateResourceDto) {
    await this.findById(id);
    await this.resourceRepository.update(id, dto);
    return this.findById(id);
  }

  async deactivate(id: number) {
    await this.findById(id);
    await this.resourceRepository.updateStatus(id, 'inactive');
    return { message: 'Recurso desactivado exitosamente' };
  }

  async delete(id: number) {
    await this.findById(id);
    await this.resourceRepository.delete(id);
    return { message: 'Recurso eliminado exitosamente' };
  }
}
