import { CreateProductDto } from '../../../application/dto/create-product.dto.js';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case.js';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case.js';
export declare class ProductsController {
    private readonly createProduct;
    private readonly listProducts;
    private readonly getProduct;
    constructor(createProduct: CreateProductUseCase, listProducts: ListProductsUseCase, getProduct: GetProductByIdUseCase);
    create(dto: CreateProductDto): Promise<{
        id: number | null;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        productTypeId: number;
        status: "active" | "inactive";
    }>;
    list(page?: string, limit?: string): Promise<{
        items: {
            id: number | null;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            productTypeId: number;
            status: "active" | "inactive";
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
        price: number;
        stock: number;
        productTypeId: number;
        status: "active" | "inactive";
    }>;
}
