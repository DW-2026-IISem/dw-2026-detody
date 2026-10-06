import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../infrastructure/models/user.model';
import { UserController } from './infrastructure/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './infrastructure/user.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UsersModule {}
