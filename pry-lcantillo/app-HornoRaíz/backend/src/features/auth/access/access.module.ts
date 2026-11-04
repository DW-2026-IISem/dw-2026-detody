import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { RbacGuard } from './rbac.guard.js';
import { UsersModule } from '../users/users.module.js';
import { ResourceRolesModule } from '../resource-roles/resource-roles.module.js';

@Global() // <-- ESTA ES LA MAGIA: Disponible en toda la aplicación
@Module({
  imports: [UsersModule, ResourceRolesModule], // Importa de dónde vienen los servicios
  providers: [JwtAuthGuard, RbacGuard],
  exports: [JwtAuthGuard, RbacGuard, UsersModule, ResourceRolesModule], // Los exporta para que los guards funcionen en cualquier controlador
})
export class AccessModule {}
