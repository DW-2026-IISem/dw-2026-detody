import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleModel } from '../infrastructure/models/role.model';
import { RoleController } from './infrastructure/role.controller';
import { RoleService } from './application/role.service';
import { RoleRepository } from './infrastructure/role.repository';

@Module({
  imports: [SequelizeModule.forFeature([RoleModel])],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RolesModule {}
