import { Module } from '@nestjs/common';
import { ResourceRoleController } from './infrastructure/resource-role.controller.js';
import { ResourceRoleService } from './application/resource-role.service.js';
import { ResourceRoleRepository } from './infrastructure/resource-role.repository.js';

@Module({
  controllers: [ResourceRoleController],
  providers: [ResourceRoleService, ResourceRoleRepository],
  exports: [ResourceRoleService], // <-- INDISPENSABLE para que el Guard lo pueda inyectar
})
export class ResourceRolesModule {}
