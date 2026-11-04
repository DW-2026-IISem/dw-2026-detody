import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../access/jwt-auth.guard.js';
import { RbacGuard } from '../../access/rbac.guard.js';
import { ResourceService } from '../application/resource.service';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';

@Controller(['recursos', 'resources'])
@UseGuards(JwtAuthGuard, RbacGuard)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async findAll() {
    const resources = await this.resourceService.findAll();
    return { resources, data: resources };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const resource = await this.resourceService.findById(id);
    return { resource, data: resource };
  }

  @Post()
  async create(@Body() dto: CreateResourceDto) {
    const resource = await this.resourceService.create(dto);
    return { resource, data: resource };
  }

  @Put(':id')
  async updatePut(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateResourceDto) {
    const resource = await this.resourceService.update(id, dto);
    return { resource, data: resource };
  }

  @Patch(':id')
  async updatePatch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateResourceDto) {
    const resource = await this.resourceService.update(id, dto);
    return { resource, data: resource };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.deactivate(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.delete(id);
  }
}
