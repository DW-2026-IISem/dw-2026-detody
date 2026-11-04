import { Module } from '@nestjs/common';
import { ResourceRoleController } from './infrastructure/resource-role.controller.js';
import { PermissionsController } from './infrastructure/permissions.controller.js';
import { ResourceRoleService } from './application/resource-role.service.js';
import { ResourceRoleRepository } from './infrastructure/resource-role.repository.js';

@Module({
  controllers: [ResourceRoleController, PermissionsController],
  providers: [ResourceRoleService, ResourceRoleRepository],
  exports: [ResourceRoleService],
})
export class ResourceRolesModule {}
