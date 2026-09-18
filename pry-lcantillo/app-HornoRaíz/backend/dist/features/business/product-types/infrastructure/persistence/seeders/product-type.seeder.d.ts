import { type IProductTypeRepository } from '../../../domain/interfaces/product-type.repository.js';
export declare class ProductTypeSeeder {
    private readonly repository;
    private readonly logger;
    constructor(repository: IProductTypeRepository);
    seed(): Promise<void>;
}
