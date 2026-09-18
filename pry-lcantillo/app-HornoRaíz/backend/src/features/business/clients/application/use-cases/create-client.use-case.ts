import { Inject, Injectable } from '@nestjs/common';
import { Client } from '../../domain/entities/client.entity.js';
import { ClientEmailAlreadyExistsException } from '../../domain/exceptions/client.exceptions.js';
import { CLIENT_REPOSITORY, type IClientRepository } from '../../domain/interfaces/client.repository.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
import { ClientMapper } from '../mappers/client.mapper.js';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(dto: CreateClientDto): Promise<Client> {
    if (dto.email) {
      const existing = await this.clientRepository.findByEmail(dto.email);
      if (existing) {
        throw new ClientEmailAlreadyExistsException(dto.email);
      }
    }
    return this.clientRepository.create(ClientMapper.toEntity(dto));
  }
}
