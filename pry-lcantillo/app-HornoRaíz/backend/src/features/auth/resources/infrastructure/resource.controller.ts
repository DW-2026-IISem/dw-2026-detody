import { Controller, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ResourceService } from '../application/resource.service';
import { CreateResourceDto } from '../dto/create-resource.dto';
import { UpdateResourceDto } from '../dto/update-resource.dto';

@Controller('api/resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  async findAll() {
    return this.resourceService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.resourceService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create(dto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateResourceDto) {
    return this.resourceService.update(id, dto);
  }
}
