import { Module } from '@nestjs/common';
import { ResourceRolesModule } from '../resource-roles/resource-roles.module.js';
import { UserService } from './application/user.service.js';
import { UserController } from './infrastructure/user.controller.js';
import { UserRepository } from './infrastructure/user.repository.js';

@Module({
  imports: [ResourceRolesModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
