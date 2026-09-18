import { Product } from '../../domain/entities/product.entity.js';
export class ProductMapper {
    static toEntity(dto) {
        return new Product({
            name: dto.name,
            description: dto.description ?? null,
            price: dto.price,
            stock: dto.stock,
            productTypeId: dto.productTypeId,
            status: 'active',
        });
    }
    static toResponse(product) {
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
//# sourceMappingURL=product.mapper.js.map