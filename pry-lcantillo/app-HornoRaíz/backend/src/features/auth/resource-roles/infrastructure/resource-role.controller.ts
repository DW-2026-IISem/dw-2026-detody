import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../access/jwt-auth.guard.js';
import { RbacGuard } from '../../access/rbac.guard.js';
import { ResourceRoleService } from '../application/resource-role.service';
import { ResourceRoleRepository } from './resource-role.repository';
import { GrantPermissionDto } from '../dto/grant-permission.dto';

@Controller(['concesiones-rol', 'resource-roles'])
@UseGuards(JwtAuthGuard, RbacGuard)
export class ResourceRoleController {
  constructor(
    private readonly resourceRoleService: ResourceRoleService,
    private readonly resourceRoleRepository: ResourceRoleRepository,
  ) {}

  @Get()
  async findAll(
    @Query('role_id') role_id?: string,
    @Query('resource_id') resource_id?: string,
  ) {
    const filters: any = {};
    if (role_id) filters.role_id = parseInt(role_id, 10);
    if (resource_id) filters.resource_id = parseInt(resource_id, 10);
    const grants = await this.resourceRoleRepository.findAll(filters);
    return { grants, data: grants };
  }

  @Post()
  async grantPermission(@Body() dto: GrantPermissionDto) {
    const grant = await this.resourceRoleService.grantPermission(dto);
    return { message: 'Permiso concedido exitosamente', grant, data: grant };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    await this.resourceRoleRepository.updateStatus(id, 'inactive');
    return { message: 'Concesión desactivada exitosamente' };
  }

  @Patch(':id/reactivate')
  async reactivate(@Param('id', ParseIntPipe) id: number) {
    await this.resourceRoleRepository.updateStatus(id, 'active');
    return { message: 'Concesión reactivada exitosamente' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.resourceRoleRepository.delete(id);
    return { message: 'Concesión eliminada exitosamente' };
  }

  @Delete()
  async revokePermission(
    @Query('role_id', ParseIntPipe) role_id: number,
    @Query('resource_id', ParseIntPipe) resource_id: number,
  ) {
    return this.resourceRoleService.revokePermission(role_id, resource_id);
  }
}
