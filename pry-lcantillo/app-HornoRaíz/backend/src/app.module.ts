import { Module } from '@nestjs/common';
import { EnvironmentModule } from './config/environment/index.js';
import { SequelizeModule } from './infrastructure/database/sequelize/sequelize.module.js';
import { HealthController } from './health/health.controller.js';
import { ClientsModule } from './features/business/clients/clients.module.js';
import { ProductTypesModule } from './features/business/product-types/product-types.module.js';
import { ProductsModule } from './features/business/products/products.module.js';
import { SalesModule } from './features/business/sales/sales.module.js';
import { MainSeeder } from './infrastructure/database/sequelize/seeders/main.seeder.js';

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
