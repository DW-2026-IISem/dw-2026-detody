import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../access/jwt-auth.guard.js';
import { ResourceRoleService } from '../application/resource-role.service.js';

@Controller(['permisos', 'permissions'])
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly resourceRoleService: ResourceRoleService) {}

  @Get()
  async getMyPermissions(@Req() req: any) {
    const raw = await this.resourceRoleService.findEffectiveForUser(req.auth.id);
    const permissions = (raw || []).map((item: any) => ({
      resource_id: item.resource_id,
      method: (item.resource?.method || item.method || 'GET').toUpperCase(),
      path: item.resource?.path || item.path || '',
      description: item.resource?.description || item.description || null,
      role_id: item.role_id,
      role_name: item.role?.name || 'ADMIN',
    }));
    return { permissions };
  }

  @Get('usuarios/:id/permisos')
  async getUserPermissions(@Param('id', ParseIntPipe) id: number) {
    const raw = await this.resourceRoleService.findEffectiveForUser(id);
    const permissions = (raw || []).map((item: any) => ({
      resource_id: item.resource_id,
      method: (item.resource?.method || item.method || 'GET').toUpperCase(),
      path: item.resource?.path || item.path || '',
      description: item.resource?.description || item.description || null,
      role_id: item.role_id,
      role_name: item.role?.name || 'ADMIN',
    }));
    return { permissions };
  }
}
