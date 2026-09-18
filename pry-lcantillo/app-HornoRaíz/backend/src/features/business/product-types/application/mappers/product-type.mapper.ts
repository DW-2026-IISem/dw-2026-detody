import { ProductType } from '../../domain/entities/product-type.entity.js';
import { CreateProductTypeDto } from '../dto/create-product-type.dto.js';

export class ProductTypeMapper {
  static toEntity(dto: CreateProductTypeDto): ProductType {
    return new ProductType({
      name: dto.name,
      description: dto.description ?? null,
    });
  }

  static toResponse(productType: ProductType) {
    return {
      id: productType.id,
      name: productType.name,
      description: productType.description,
    };
  }
}
