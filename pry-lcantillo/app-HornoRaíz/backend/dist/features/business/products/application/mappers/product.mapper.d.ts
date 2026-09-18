import { Product } from '../../domain/entities/product.entity.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
export declare class ProductMapper {
    static toEntity(dto: CreateProductDto): Product;
    static toResponse(product: Product): {
        id: number | null;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        productTypeId: number;
        status: "active" | "inactive";
    };
}
