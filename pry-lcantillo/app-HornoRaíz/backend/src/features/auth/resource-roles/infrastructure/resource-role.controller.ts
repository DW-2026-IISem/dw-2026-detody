import { Controller, Get, Post, Delete, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ResourceRoleService } from '../application/resource-role.service';
import { GrantPermissionDto } from '../dto/grant-permission.dto';

@Controller('api/concesiones-rol')
export class ResourceRoleController {
  constructor(private readonly resourceRoleService: ResourceRoleService) {}
  @Get() async findAll() { return this.resourceRoleService.findAll(); }
  @Post() async grantPermission(@Body() dto: GrantPermissionDto) { return this.resourceRoleService.grantPermission(dto); }
  @Delete() async revokePermission(@Query('role_id', ParseIntPipe) role_id: number, @Query('resource_id', ParseIntPipe) resource_id: number) {
    return this.resourceRoleService.revokePermission(role_id, resource_id);
  }
}
