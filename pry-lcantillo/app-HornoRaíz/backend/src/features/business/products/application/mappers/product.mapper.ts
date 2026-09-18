import { Product } from '../../domain/entities/product.entity.js';
import { CreateProductDto } from '../dto/create-product.dto.js';

export class ProductMapper {
  static toEntity(dto: CreateProductDto): Product {
    return new Product({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
      productTypeId: dto.productTypeId,
      status: 'active',
    });
  }

  static toResponse(product: Product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      productTypeId: product.productTypeId,
      status: product.status,
    };
  }
}
