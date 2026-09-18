import { CreateClientDto } from '../../../application/dto/create-client.dto.js';
import { CreateClientUseCase } from '../../../application/use-cases/create-client.use-case.js';
import { GetClientByIdUseCase } from '../../../application/use-cases/get-client-by-id.use-case.js';
import { ListClientsUseCase } from '../../../application/use-cases/list-clients.use-case.js';
export declare class ClientsController {
    private readonly createClient;
    private readonly listClients;
    private readonly getClient;
    constructor(createClient: CreateClientUseCase, listClients: ListClientsUseCase, getClient: GetClientByIdUseCase);
    create(dto: CreateClientDto): Promise<{
        id: number | null;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        status: import("../../../domain/entities/client.entity.js").ClientStatus;
    }>;
    list(page?: string, limit?: string): Promise<{
        items: {
            id: number | null;
            name: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            status: import("../../../domain/entities/client.entity.js").ClientStatus;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        id: number | null;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        status: import("../../../domain/entities/client.entity.js").ClientStatus;
    }>;
}
