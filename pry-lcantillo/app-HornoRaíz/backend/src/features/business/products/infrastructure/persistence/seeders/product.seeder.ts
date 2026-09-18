import { Inject, Injectable, Logger } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity.js';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../../domain/interfaces/product.repository.js';

@Injectable()
export class ProductSeeder {
  private readonly logger = new Logger(ProductSeeder.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: IProductRepository,
  ) {}

  async seed(): Promise<void> {
    const productName = 'Pan Baguette Masa Madre';
    const exists = await this.repository.findByName(productName);
    if (!exists) {
      await this.repository.create(new Product({
        name: productName,
        description: 'Baguette crocante tradicional 300g',
        price: 8500,
        stock: 30,
        productTypeId: 1,
        status: 'active',
      }));
      this.logger.log(`Seeder products: producto "${productName}" creado`);
    }
  }
}
