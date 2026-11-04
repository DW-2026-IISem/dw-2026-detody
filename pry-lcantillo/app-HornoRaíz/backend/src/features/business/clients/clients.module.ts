import { Module } from '@nestjs/common';
import { ClientsController } from './presentation/http/controllers/clients.controller.js';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case.js';
import { GetClientByIdUseCase } from './application/use-cases/get-client-by-id.use-case.js';
import { ListClientsUseCase } from './application/use-cases/list-clients.use-case.js';
import { ClientRepository } from './infrastructure/persistence/repositories/client.repository.js';
import { ClientSeeder } from './infrastructure/persistence/seeders/client.seeder.js';
import { UsersModule } from '../../auth/users/users.module.js';

@Module({
  imports: [UsersModule],
  controllers: [ClientsController],
  providers: [
    CreateClientUseCase,
    GetClientByIdUseCase,
    ListClientsUseCase,
    ClientRepository,
    ClientSeeder,
    {
      provide: 'IClientRepository',
      useClass: ClientRepository,
    },
  ],
  exports: [
    ClientSeeder,
    'IClientRepository', // <-- ¡LA CLAVE ESTÁ AQUÍ! Esto permite que SalesModule lo inyecte
  ],
})
export class ClientsModule {}
