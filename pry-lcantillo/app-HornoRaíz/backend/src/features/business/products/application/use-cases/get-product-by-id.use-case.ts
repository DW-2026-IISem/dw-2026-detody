import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity.js';
import { ProductNotFoundException } from '../../domain/exceptions/product.exceptions.js';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product.repository.js';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: number): Promise<Product> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new ProductNotFoundException(id);
    }
    return item;
  }
}
