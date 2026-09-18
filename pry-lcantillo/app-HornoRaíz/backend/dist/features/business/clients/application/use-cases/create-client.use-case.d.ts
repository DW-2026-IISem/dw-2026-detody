import { Client } from '../../domain/entities/client.entity.js';
import { type IClientRepository } from '../../domain/interfaces/client.repository.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
export declare class CreateClientUseCase {
    private readonly clientRepository;
    constructor(clientRepository: IClientRepository);
    execute(dto: CreateClientDto): Promise<Client>;
}
