import { Inject, Injectable } from '@nestjs/common';
import { ProductType } from '../../domain/entities/product-type.entity.js';
import { ProductTypeNameAlreadyExistsException } from '../../domain/exceptions/product-type.exceptions.js';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';
import { CreateProductTypeDto } from '../dto/create-product-type.dto.js';
import { ProductTypeMapper } from '../mappers/product-type.mapper.js';

@Injectable()
export class CreateProductTypeUseCase {
  constructor(
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly repository: IProductTypeRepository,
  ) {}

  async execute(dto: CreateProductTypeDto): Promise<ProductType> {
    const existing = await this.repository.findByName(dto.name);
    if (existing) {
      throw new ProductTypeNameAlreadyExistsException(dto.name);
    }
    return this.repository.create(ProductTypeMapper.toEntity(dto));
  }
}
