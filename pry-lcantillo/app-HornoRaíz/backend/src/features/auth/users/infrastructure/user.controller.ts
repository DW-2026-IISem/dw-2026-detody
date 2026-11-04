import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../access/jwt-auth.guard.js';
import { RbacGuard } from '../../access/rbac.guard.js';
import { UserService } from '../application/user.service';
import { ResourceRoleService } from '../../resource-roles/application/resource-role.service.js';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller(['usuarios', 'users'])
@UseGuards(JwtAuthGuard, RbacGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly resourceRoleService: ResourceRoleService,
  ) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return { users, data: users };
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    return { user, data: user };
  }

  @Get(':id/permisos')
  async getPermissions(@Param('id', ParseIntPipe) id: number) {
    const raw = await this.resourceRoleService.findEffectiveForUser(id);
    const permissions = (raw || []).map((item: any) => ({
      resource_id: item.resource_id,
      method: (item.resource?.method || item.method || 'GET').toUpperCase(),
      path: item.resource?.path || item.path || '',
      description: item.resource?.description || item.description || null,
      role_id: item.role_id,
      role_name: item.role?.name || 'ADMIN',
    }));
    return { permissions, data: permissions };
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return { user, data: user };
  }

  @Put(':id')
  async updatePut(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);
    return { user, data: user };
  }

  @Patch(':id')
  async updatePatch(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);
    return { user, data: user };
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deactivate(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }

  @Patch(':id/password')
  async changePasswordPatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.userService.changePassword(id, dto);
  }

  @Put(':id/password')
  async changePasswordPut(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: any
  ) {
    return this.userService.changePassword(id, dto);
  }
}
