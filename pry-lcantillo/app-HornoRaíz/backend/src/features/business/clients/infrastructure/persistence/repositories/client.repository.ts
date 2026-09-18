import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { Client, ClientStatus } from '../../../domain/entities/client.entity.js';
import { IClientRepository } from '../../../domain/interfaces/client.repository.js';
import { ClientModel } from '../models/client.model.js';

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(ClientModel);
  }

  async create(client: Client): Promise<Client> {
    const created = await this.repo.create({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      status: client.status,
    });
    return this.toDomain(created);
  }

  async findAll(page: number, limit: number): Promise<{ items: Client[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.repo.findAndCountAll({ limit, offset });
    return {
      items: rows.map((m) => this.toDomain(m)),
      total: count,
    };
  }

  async findById(id: number): Promise<Client | null> {
    const model = await this.repo.findByPk(id);
    return model ? this.toDomain(model) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const model = await this.repo.findOne({ where: { email } });
    return model ? this.toDomain(model) : null;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  private toDomain(m: ClientModel): Client {
    return new Client({
      id: m.id,
      name: m.name,
      email: m.email ?? null,
      phone: m.phone ?? null,
      address: m.address ?? null,
      status: (m.status as ClientStatus) ?? 'active',
    });
  }
}
