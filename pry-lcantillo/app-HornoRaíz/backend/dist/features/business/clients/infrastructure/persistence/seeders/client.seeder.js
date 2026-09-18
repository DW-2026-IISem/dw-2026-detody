var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ClientSeeder_1;
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from '../../../domain/entities/client.entity.js';
import { CLIENT_REPOSITORY } from '../../../domain/interfaces/client.repository.js';
let ClientSeeder = ClientSeeder_1 = class ClientSeeder {
    clientRepository;
    logger = new Logger(ClientSeeder_1.name);
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async seed() {
        const email = 'cliente.demo@hornoraiz.com';
        const existing = await this.clientRepository.findByEmail(email);
        if (existing) {
            this.logger.log('Seeder clients: ya existía el cliente demo');
            return;
        }
        await this.clientRepository.create(new Client({
            name: 'Cliente HornoRaíz Demo',
            email,
            phone: '3009876543',
            address: 'Riohacha, La Guajira',
            status: 'active',
        }));
        this.logger.log('Seeder clients: cliente demo creado con éxito');
    }
};
ClientSeeder = ClientSeeder_1 = __decorate([
    Injectable(),
    __param(0, Inject(CLIENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ClientSeeder);
export { ClientSeeder };
//# sourceMappingURL=client.seeder.js.map