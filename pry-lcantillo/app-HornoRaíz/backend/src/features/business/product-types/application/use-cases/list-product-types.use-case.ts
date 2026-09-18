import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';
import { ProductTypeMapper } from '../mappers/product-type.mapper.js';

@Injectable()
export class ListProductTypesUseCase {
  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly repository: IProductTypeRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.repository.findAll(page, limit);
    return {
      items: items.map(ProductTypeMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
