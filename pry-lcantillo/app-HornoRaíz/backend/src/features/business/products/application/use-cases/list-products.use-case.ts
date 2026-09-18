import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product.repository.js';
import { ProductMapper } from '../mappers/product.mapper.js';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: IProductRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.repository.findAll(page, limit);
    return {
      items: items.map(ProductMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
