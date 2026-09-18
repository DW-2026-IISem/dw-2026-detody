import { Sequelize } from 'sequelize-typescript';
import { ProductType } from '../../../domain/entities/product-type.entity.js';
import { IProductTypeRepository } from '../../../domain/interfaces/product-type.repository.js';
export declare class ProductTypeRepository implements IProductTypeRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get repo();
    create(productType: ProductType): Promise<ProductType>;
    findAll(page: number, limit: number): Promise<{
        items: ProductType[];
        total: number;
    }>;
    findById(id: number): Promise<ProductType | null>;
    findByName(name: string): Promise<ProductType | null>;
    private toDomain;
}
