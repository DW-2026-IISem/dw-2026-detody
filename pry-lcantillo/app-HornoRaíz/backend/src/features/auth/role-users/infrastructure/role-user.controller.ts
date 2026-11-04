import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../access/jwt-auth.guard.js';
import { RbacGuard } from '../../access/rbac.guard.js';
import { RoleUserService } from '../application/role-user.service';
import { RoleUserRepository } from './role-user.repository';
import { CreateRoleUserDto } from '../dto/create-role-user.dto';

@Controller(['asignaciones-rol', 'role-users'])
@UseGuards(JwtAuthGuard, RbacGuard)
export class RoleUserController {
  constructor(
    private readonly roleUserService: RoleUserService,
    private readonly roleUserRepository: RoleUserRepository,
  ) {}

  @Get()
  async findAll() {
    const assignments = await this.roleUserService.findAll();
    return { assignments, data: assignments };
  }

  @Post()
  async assignRole(@Body() dto: CreateRoleUserDto) {
    const assignment = await this.roleUserService.assignRole(dto);
    return { assignment, data: assignment };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    await this.roleUserRepository.updateStatus(id, 'inactive');
    return { message: 'Asignación desactivada exitosamente' };
  }

  @Patch(':id/reactivate')
  async reactivate(@Param('id', ParseIntPipe) id: number) {
    await this.roleUserRepository.updateStatus(id, 'active');
    return { message: 'Asignación reactivada exitosamente' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.roleUserRepository.delete(id);
    return { message: 'Asignación eliminada exitosamente' };
  }

  @Delete()
  async revokeRole(
    @Query('user_id', ParseIntPipe) user_id: number,
    @Query('role_id', ParseIntPipe) role_id: number,
  ) {
    return this.roleUserService.revokeRole(user_id, role_id);
  }
}
