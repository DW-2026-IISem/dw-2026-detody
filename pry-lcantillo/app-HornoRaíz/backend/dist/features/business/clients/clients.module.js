var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case.js';
import { GetClientByIdUseCase } from './application/use-cases/get-client-by-id.use-case.js';
import { ListClientsUseCase } from './application/use-cases/list-clients.use-case.js';
import { CLIENT_REPOSITORY } from './domain/interfaces/client.repository.js';
import { ClientRepository } from './infrastructure/persistence/repositories/client.repository.js';
import { ClientSeeder } from './infrastructure/persistence/seeders/client.seeder.js';
import { ClientsController } from './presentation/http/controllers/clients.controller.js';
let ClientsModule = class ClientsModule {
};
ClientsModule = __decorate([
    Module({
        controllers: [ClientsController],
        providers: [
            CreateClientUseCase,
            ListClientsUseCase,
            GetClientByIdUseCase,
            ClientSeeder,
            { provide: CLIENT_REPOSITORY, useClass: ClientRepository },
        ],
        exports: [CLIENT_REPOSITORY, ClientSeeder],
    })
], ClientsModule);
export { ClientsModule };
//# sourceMappingURL=clients.module.js.map