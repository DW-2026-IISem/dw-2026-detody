import { Inject, Injectable, Logger } from '@nestjs/common';
import { Sale } from '../../../domain/entities/sale.entity.js';
import { SALE_REPOSITORY, type ISaleRepository } from '../../../domain/interfaces/sale.repository.js';

@Injectable()
export class SaleSeeder {
  private readonly logger = new Logger(SaleSeeder.name);

  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly repository: ISaleRepository,
  ) {}

  async seed(): Promise<void> {
    const existing = await this.repository.findById(1);
    if (!existing) {
      await this.repository.create(
        new Sale({
          clientId: 1,
          items: [{ productId: 1, quantity: 2, unitPrice: 8500, subtotal: 17000 }],
          status: 'completed',
        }),
      );
      this.logger.log('Seeder sales: venta inicial creada con éxito');
    }
  }
}
