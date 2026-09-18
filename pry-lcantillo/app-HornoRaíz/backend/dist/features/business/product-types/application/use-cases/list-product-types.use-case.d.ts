import { type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';
export declare class ListProductTypesUseCase {
    private readonly repository;
    constructor(repository: IProductTypeRepository);
    execute(page: number, limit: number): Promise<{
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
}
