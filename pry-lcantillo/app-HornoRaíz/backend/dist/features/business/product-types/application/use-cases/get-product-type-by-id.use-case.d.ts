import { ProductType } from '../../domain/entities/product-type.entity.js';
import { type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';
export declare class GetProductTypeByIdUseCase {
    private readonly repository;
    constructor(repository: IProductTypeRepository);
    execute(id: number): Promise<ProductType>;
}
