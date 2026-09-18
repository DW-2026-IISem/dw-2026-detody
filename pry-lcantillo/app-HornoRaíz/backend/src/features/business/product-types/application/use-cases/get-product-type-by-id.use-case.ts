import { Inject, Injectable } from '@nestjs/common';
import { ProductType } from '../../domain/entities/product-type.entity.js';
import { ProductTypeNotFoundException } from '../../domain/exceptions/product-type.exceptions.js';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';

@Injectable()
export class GetProductTypeByIdUseCase {
  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly repository: IProductTypeRepository,
  ) {}

  async execute(id: number): Promise<ProductType> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new ProductTypeNotFoundException(id);
    }
    return item;
  }
}
