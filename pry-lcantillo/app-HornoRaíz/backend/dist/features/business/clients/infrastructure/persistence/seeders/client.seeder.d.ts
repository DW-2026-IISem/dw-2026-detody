import { type IClientRepository } from '../../../domain/interfaces/client.repository.js';
export declare class ClientSeeder {
    private readonly clientRepository;
    private readonly logger;
    constructor(clientRepository: IClientRepository);
    seed(): Promise<void>;
}
