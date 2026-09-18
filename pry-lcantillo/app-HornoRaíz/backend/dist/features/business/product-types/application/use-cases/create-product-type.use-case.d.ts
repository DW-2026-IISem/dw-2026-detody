import { ProductType } from '../../domain/entities/product-type.entity.js';
import { type IProductTypeRepository } from '../../domain/interfaces/product-type.repository.js';
import { CreateProductTypeDto } from '../dto/create-product-type.dto.js';
export declare class CreateProductTypeUseCase {
    private readonly repository;
    constructor(repository: IProductTypeRepository);
    execute(dto: CreateProductTypeDto): Promise<ProductType>;
}
