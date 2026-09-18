import { Client } from '../../domain/entities/client.entity.js';
import { type IClientRepository } from '../../domain/interfaces/client.repository.js';
export declare class GetClientByIdUseCase {
    private readonly clientRepository;
    constructor(clientRepository: IClientRepository);
    execute(id: number): Promise<Client>;
}
