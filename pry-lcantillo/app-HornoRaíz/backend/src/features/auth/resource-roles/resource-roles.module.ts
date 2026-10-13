import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResourceRoleModel } from '../infrastructure/models/resource-role.model';
import { ResourceRoleController } from './infrastructure/resource-role.controller';
import { ResourceRoleService } from './application/resource-role.service';
import { ResourceRoleRepository } from './infrastructure/resource-role.repository';

@Module({
  imports: [SequelizeModule.forFeature([ResourceRoleModel])],
  controllers: [ResourceRoleController],
  providers: [ResourceRoleService, ResourceRoleRepository],
  exports: [ResourceRoleService],
})
export class ResourceRolesModule {}
