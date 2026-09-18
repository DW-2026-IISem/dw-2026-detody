import { CreateProductTypeDto } from '../../../application/dto/create-product-type.dto.js';
import { CreateProductTypeUseCase } from '../../../application/use-cases/create-product-type.use-case.js';
import { GetProductTypeByIdUseCase } from '../../../application/use-cases/get-product-type-by-id.use-case.js';
import { ListProductTypesUseCase } from '../../../application/use-cases/list-product-types.use-case.js';
export declare class ProductTypesController {
    private readonly createProductType;
    private readonly listProductTypes;
    private readonly getProductType;
    constructor(createProductType: CreateProductTypeUseCase, listProductTypes: ListProductTypesUseCase, getProductType: GetProductTypeByIdUseCase);
    create(dto: CreateProductTypeDto): Promise<{
        id: number | null;
        name: string;
        description: string | null;
    }>;
    list(page?: string, limit?: string): Promise<{
        items: {
            id: number | null;
            name: string;
            description: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        id: number | null;
        name: string;
        description: string | null;
    }>;
}
