import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity.js';
import { ProductNameAlreadyExistsException } from '../../domain/exceptions/product.exceptions.js';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../domain/interfaces/product.repository.js';
import { PRODUCT_TYPE_REPOSITORY, type IProductTypeRepository } from '../../../product-types/domain/interfaces/product-type.repository.js';
import { ProductTypeNotFoundException } from '../../../product-types/domain/exceptions/product-type.exceptions.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
import { ProductMapper } from '../mappers/product.mapper.js';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: IProductRepository,
    @Inject(PRODUCT_TYPE_REPOSITORY)
    private readonly productTypeRepository: IProductTypeRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const typeExists = await this.productTypeRepository.findById(dto.productTypeId);
    if (!typeExists) {
      throw new ProductTypeNotFoundException(dto.productTypeId);
    }

    const existingName = await this.repository.findByName(dto.name);
    if (existingName) {
      throw new ProductNameAlreadyExistsException(dto.name);
    }

    return this.repository.create(ProductMapper.toEntity(dto));
  }
}
