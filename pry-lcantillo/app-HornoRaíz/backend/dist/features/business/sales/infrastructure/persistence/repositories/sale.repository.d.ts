import { Sequelize } from 'sequelize-typescript';
import { Sale } from '../../../domain/entities/sale.entity.js';
import { ISaleRepository } from '../../../domain/interfaces/sale.repository.js';
export declare class SaleRepository implements ISaleRepository {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    private get saleRepo();
    private get itemRepo();
    private get productRepo();
    create(sale: Sale): Promise<Sale>;
    findAll(page: number, limit: number): Promise<{
        items: Sale[];
        total: number;
    }>;
    findById(id: number): Promise<Sale | null>;
    private toDomain;
}
