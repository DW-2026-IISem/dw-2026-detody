import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RbacGuard } from './rbac.guard';
import { UsersModule } from '../users/users.module';
import { ResourceRolesModule } from '../resource-roles/resource-roles.module';

@Global()
@Module({
  imports: [UsersModule, ResourceRolesModule],
  providers: [JwtAuthGuard, RbacGuard],
  exports: [JwtAuthGuard, RbacGuard],
})
export class AccessModule {}
