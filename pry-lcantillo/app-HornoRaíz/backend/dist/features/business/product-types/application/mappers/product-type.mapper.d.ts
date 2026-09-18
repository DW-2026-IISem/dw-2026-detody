import { ProductType } from '../../domain/entities/product-type.entity.js';
import { CreateProductTypeDto } from '../dto/create-product-type.dto.js';
export declare class ProductTypeMapper {
    static toEntity(dto: CreateProductTypeDto): ProductType;
    static toResponse(productType: ProductType): {
        id: number | null;
        name: string;
        description: string | null;
    };
}
