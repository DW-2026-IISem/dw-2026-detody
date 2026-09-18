import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProductType } from '../../../domain/entities/product-type.entity.js';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../../domain/interfaces/product-type.repository.js';

@Injectable()
export class ProductTypeSeeder {
  private readonly logger = new Logger(ProductTypeSeeder.name);

  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly repository: IProductTypeRepository,
  ) {}

  async seed(): Promise<void> {
    const initialTypes = [
      { name: 'Panadería Tradicional', description: 'Panes de uso diario, mogollas y aliñados' },
      { name: 'Pastelería y Repostería', description: 'Tortas, ponqués y postres fríos' },
      { name: 'Bebidas e Infusiones', description: 'Cafés, jugos e infusiones naturales' },
    ];

    for (const t of initialTypes) {
      const exists = await this.repository.findByName(t.name);
      if (!exists) {
        await this.repository.create(new ProductType(t));
        this.logger.log(`Seeder product-types: tipo "${t.name}" creado`);
      }
    }
  }
}
