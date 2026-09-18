import { ProductType } from '../../domain/entities/product-type.entity.js';
export class ProductTypeMapper {
    static toEntity(dto) {
        return new ProductType({
            name: dto.name,
            description: dto.description ?? null,
        });
    }
    static toResponse(productType) {
        return {
            id: productType.id,
            name: productType.name,
            description: productType.description,
        };
    }
}
//# sourceMappingURL=product-type.mapper.js.map