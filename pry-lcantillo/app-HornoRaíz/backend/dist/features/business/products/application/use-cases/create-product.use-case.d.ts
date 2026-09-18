import { Product } from '../../domain/entities/product.entity.js';
import { type IProductRepository } from '../../domain/interfaces/product.repository.js';
import { type IProductTypeRepository } from '../../../product-types/domain/interfaces/product-type.repository.js';
import { CreateProductDto } from '../dto/create-product.dto.js';
export declare class CreateProductUseCase {
    private readonly repository;
    private readonly productTypeRepository;
    constructor(repository: IProductRepository, productTypeRepository: IProductTypeRepository);
    execute(dto: CreateProductDto): Promise<Product>;
}
