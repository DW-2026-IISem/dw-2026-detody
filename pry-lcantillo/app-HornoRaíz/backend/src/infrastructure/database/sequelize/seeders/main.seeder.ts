import { Injectable, Logger } from '@nestjs/common';
import { ClientSeeder } from '../../../../features/business/clients/infrastructure/persistence/seeders/client.seeder.js';
import { ProductTypeSeeder } from '../../../../features/business/product-types/infrastructure/persistence/seeders/product-type.seeder.js';
import { ProductSeeder } from '../../../../features/business/products/infrastructure/persistence/seeders/product.seeder.js';
import { SaleSeeder } from '../../../../features/business/sales/infrastructure/persistence/seeders/sale.seeder.js';

@Injectable()
export class MainSeeder {
  private readonly logger = new Logger(MainSeeder.name);

  constructor(
    private readonly clientSeeder: ClientSeeder,
    private readonly productTypeSeeder: ProductTypeSeeder,
    private readonly productSeeder: ProductSeeder,
    private readonly saleSeeder: SaleSeeder,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Iniciando proceso de seeding global...');
    await this.clientSeeder.seed();
    await this.productTypeSeeder.seed();
    await this.productSeeder.seed();
    await this.saleSeeder.seed();
    this.logger.log('Seeding global finalizado exitosamente.');
  }
}
