import { type IProductRepository } from '../../domain/interfaces/product.repository.js';
export declare class ListProductsUseCase {
    private readonly repository;
    constructor(repository: IProductRepository);
    execute(page: number, limit: number): Promise<{
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
}
