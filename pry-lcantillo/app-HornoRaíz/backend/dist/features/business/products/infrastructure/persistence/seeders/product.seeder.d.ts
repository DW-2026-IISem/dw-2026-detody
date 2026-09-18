import { type IProductRepository } from '../../../domain/interfaces/product.repository.js';
export declare class ProductSeeder {
    private readonly repository;
    private readonly logger;
    constructor(repository: IProductRepository);
    seed(): Promise<void>;
}
