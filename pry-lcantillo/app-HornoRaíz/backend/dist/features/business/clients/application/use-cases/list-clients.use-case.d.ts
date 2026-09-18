import { type IClientRepository } from '../../domain/interfaces/client.repository.js';
export declare class ListClientsUseCase {
    private readonly clientRepository;
    constructor(clientRepository: IClientRepository);
    execute(page: number, limit: number): Promise<{
        items: {
            id: number | null;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            status: import("../../domain/entities/client.entity.js").ClientStatus;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
