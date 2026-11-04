import { Module } from '@nestjs/common';
import { UserService } from './application/user.service.js';
import { UserController } from './infrastructure/user.controller.js';
import { UserRepository } from './infrastructure/user.repository.js';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService], // <-- This is the crucial addition
})
export class UsersModule {}
