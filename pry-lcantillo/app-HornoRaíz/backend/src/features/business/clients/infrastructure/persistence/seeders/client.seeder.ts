import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from '../../../domain/entities/client.entity.js';
import { CLIENT_REPOSITORY, type IClientRepository } from '../../../domain/interfaces/client.repository.js';

@Injectable()
export class ClientSeeder {
  private readonly logger = new Logger(ClientSeeder.name);

  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async seed(): Promise<void> {
    const email = 'cliente.demo@hornoraiz.com';
    const existing = await this.clientRepository.findByEmail(email);
    if (existing) {
      this.logger.log('Seeder clients: ya existía el cliente demo');
      return;
    }
    await this.clientRepository.create(new Client({
      name: 'Cliente HornoRaíz Demo',
      email,
      phone: '3009876543',
      address: 'Riohacha, La Guajira',
      status: 'active',
    }));
    this.logger.log('Seeder clients: cliente demo creado con éxito');
  }
}
