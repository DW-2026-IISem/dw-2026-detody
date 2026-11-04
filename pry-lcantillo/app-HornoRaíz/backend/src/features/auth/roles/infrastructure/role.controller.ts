import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../access/jwt-auth.guard.js';
import { RbacGuard } from '../../access/rbac.guard.js';
import { RoleService } from '../application/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, RbacGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async findAll() {
    const roles = await this.roleService.findAll();
    return { roles, data: roles };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findById(id);
    return { role, data: role };
  }

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const role = await this.roleService.create(dto);
    return { role, data: role };
  }

  @Put(':id')
  async updatePut(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    const role = await this.roleService.update(id, dto);
    return { role, data: role };
  }

  @Patch(':id')
  async updatePatch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    const role = await this.roleService.update(id, dto);
    return { role, data: role };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.deactivate(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id);
  }
}
