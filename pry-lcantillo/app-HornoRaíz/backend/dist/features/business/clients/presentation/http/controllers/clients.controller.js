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
import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '../../../application/dto/create-client.dto.js';
import { ClientMapper } from '../../../application/mappers/client.mapper.js';
import { CreateClientUseCase } from '../../../application/use-cases/create-client.use-case.js';
import { GetClientByIdUseCase } from '../../../application/use-cases/get-client-by-id.use-case.js';
import { ListClientsUseCase } from '../../../application/use-cases/list-clients.use-case.js';
let ClientsController = class ClientsController {
    createClient;
    listClients;
    getClient;
    constructor(createClient, listClients, getClient) {
        this.createClient = createClient;
        this.listClients = listClients;
        this.getClient = getClient;
    }
    async create(dto) {
        const client = await this.createClient.execute(dto);
        return ClientMapper.toResponse(client);
    }
    async list(page = '1', limit = '10') {
        return this.listClients.execute(Number(page), Number(limit));
    }
    async findOne(id) {
        const client = await this.getClient.execute(id);
        return ClientMapper.toResponse(client);
    }
};
__decorate([
    Post(),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findOne", null);
ClientsController = __decorate([
    ApiTags('clients'),
    Controller('clients'),
    __metadata("design:paramtypes", [CreateClientUseCase,
        ListClientsUseCase,
        GetClientByIdUseCase])
], ClientsController);
export { ClientsController };
//# sourceMappingURL=clients.controller.js.map