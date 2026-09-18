import { Module } from '@nestjs/common';
import { EnvironmentModule } from './config/environment/index.js';
import { SequelizeModule } from './infrastructure/database/sequelize/sequelize.module.js';
import { HealthController } from './health/health.controller.js';
import { ClientsModule } from './features/business/clients/clients.module.js';

@Module({
  imports: [EnvironmentModule, SequelizeModule, ClientsModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
