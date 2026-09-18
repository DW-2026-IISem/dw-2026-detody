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
import { Inject, Injectable } from '@nestjs/common';
import { ClientEmailAlreadyExistsException } from '../../domain/exceptions/client.exceptions.js';
import { CLIENT_REPOSITORY } from '../../domain/interfaces/client.repository.js';
import { ClientMapper } from '../mappers/client.mapper.js';
let CreateClientUseCase = class CreateClientUseCase {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async execute(dto) {
        if (dto.email) {
            const existing = await this.clientRepository.findByEmail(dto.email);
            if (existing) {
                throw new ClientEmailAlreadyExistsException(dto.email);
            }
        }
        return this.clientRepository.create(ClientMapper.toEntity(dto));
    }
};
CreateClientUseCase = __decorate([
    Injectable(),
    __param(0, Inject(CLIENT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateClientUseCase);
export { CreateClientUseCase };
//# sourceMappingURL=create-client.use-case.js.map