import { Module } from '@nestjs/common';
import { EnvironmentModule } from './config/environment/index.js';
import { SequelizeModule } from './infrastructure/database/sequelize/sequelize.module.js';
import { HealthController } from './health/health.controller.js';
import { ClientsModule } from './features/business/clients/clients.module.js';
import { ProductTypesModule } from './features/business/product-types/product-types.module.js';
import { ProductsModule } from './features/business/products/products.module.js';
import { SalesModule } from './features/business/sales/sales.module.js';
import { MainSeeder } from './infrastructure/database/sequelize/seeders/main.seeder.js';
import { UserModel } from './features/auth/infrastructure/models/user.model';
import { RoleModel } from './features/auth/infrastructure/models/role.model';
import { ResourceModel } from './features/auth/infrastructure/models/resource.model';
import { RoleUserModel } from './features/auth/infrastructure/models/role-user.model';
import { ResourceRoleModel } from './features/auth/infrastructure/models/resource-role.model';
import { RefreshTokenModel } from './features/auth/infrastructure/models/refresh-token.model';

// Asegúrate de agregarlos al array de models de SequelizeModule:
// models: [..., UserModel, RoleModel, ResourceModel, RoleUserModel, ResourceRoleModel, RefreshTokenModel],

@Module({
  imports: [
    EnvironmentModule,
    SequelizeModule,
    ClientsModule,
    ProductTypesModule,
    ProductsModule,
    SalesModule,
  ],
  controllers: [HealthController],
  providers: [MainSeeder],
})
export class AppModule {}
