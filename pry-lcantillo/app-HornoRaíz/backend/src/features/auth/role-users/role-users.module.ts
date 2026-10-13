import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleUserModel } from '../infrastructure/models/role-user.model';
import { RoleUserController } from './infrastructure/role-user.controller';
import { RoleUserService } from './application/role-user.service';
import { RoleUserRepository } from './infrastructure/role-user.repository';

@Module({
  imports: [SequelizeModule.forFeature([RoleUserModel])],
  controllers: [RoleUserController],
  providers: [RoleUserService, RoleUserRepository],
  exports: [RoleUserService],
})
export class RoleUsersModule {}
