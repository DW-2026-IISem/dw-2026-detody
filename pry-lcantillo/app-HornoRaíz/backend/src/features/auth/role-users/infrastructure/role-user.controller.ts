import { Controller, Get, Post, Delete, Body, Query, ParseIntPipe } from '@nestjs/common';
import { RoleUserService } from '../application/role-user.service';
import { CreateRoleUserDto } from '../dto/create-role-user.dto';

@Controller('api/asignaciones-rol')
export class RoleUserController {
  constructor(private readonly roleUserService: RoleUserService) {}
  @Get() async findAll() { return this.roleUserService.findAll(); }
  @Post() async assignRole(@Body() dto: CreateRoleUserDto) { return this.roleUserService.assignRole(dto); }
  @Delete() async revokeRole(@Query('user_id', ParseIntPipe) user_id: number, @Query('role_id', ParseIntPipe) role_id: number) {
    return this.roleUserService.revokeRole(user_id, role_id);
  }
}
