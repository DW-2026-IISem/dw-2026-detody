import { AccessModule } from './features/auth/access/access.module';
import { ProductSeeder } from './features/business/products/infrastructure/persistence/seeders/product.seeder';
import { ProductTypeSeeder } from './features/business/product-types/infrastructure/persistence/seeders/product-type.seeder';
import { ClientSeeder } from './features/business/clients/infrastructure/persistence/seeders/client.seeder';
import { SaleSeeder } from './features/business/sales/infrastructure/persistence/seeders/sale.seeder';
import { MainSeeder } from './infrastructure/database/sequelize/seeders/main.seeder';
import { Module } from '@nestjs/common';
import { EnvironmentModule } from './config/environment/environment.module';
import { SequelizeModule } from './infrastructure/database/sequelize/sequelize.module';
import { ClientsModule } from './features/business/clients/clients.module';
import { ProductTypesModule } from './features/business/product-types/product-types.module';
import { ProductsModule } from './features/business/products/products.module';
import { SalesModule } from './features/business/sales/sales.module';
import { UsersModule } from './features/auth/users/users.module';
import { RolesModule } from './features/auth/roles/roles.module';
import { ResourcesModule } from './features/auth/resources/resources.module';
import { RoleUsersModule } from './features/auth/role-users/role-users.module';
import { ResourceRolesModule } from './features/auth/resource-roles/resource-roles.module';

@Module({
  providers: [ProductSeeder, ProductTypeSeeder, ClientSeeder, SaleSeeder, MainSeeder],
  imports: [
    AccessModule,
    EnvironmentModule,
    SequelizeModule,
    ClientsModule,
    ProductTypesModule,
    ProductsModule,
    SalesModule,
    UsersModule,
    RolesModule,
    ResourcesModule,
    RoleUsersModule,
    ResourceRolesModule,
  ],
})
export class AppModule {}
