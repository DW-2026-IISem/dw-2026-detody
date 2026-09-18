import { Sequelize } from 'sequelize-typescript';
import { Client } from '../../../domain/entities/client.entity.js';
import { IClientRepository } from '../../../domain/interfaces/client.repository.js';
export declare class ClientRepository implements IClientRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    create(client: Client): Promise<Client>;
    findAll(page: number, limit: number): Promise<{
        items: Client[];
        total: number;
    }>;
    findById(id: number): Promise<Client | null>;
    findByEmail(email: string): Promise<Client | null>;
    count(): Promise<number>;
    private toDomain;
}
