import { Client } from '../../domain/entities/client.entity.js';
import { CreateClientDto } from '../dto/create-client.dto.js';
export declare class ClientMapper {
    static toEntity(dto: CreateClientDto): Client;
    static toResponse(client: Client): {
        id: number | null;
        name: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        status: import("../../domain/entities/client.entity.js").ClientStatus;
    };
}
