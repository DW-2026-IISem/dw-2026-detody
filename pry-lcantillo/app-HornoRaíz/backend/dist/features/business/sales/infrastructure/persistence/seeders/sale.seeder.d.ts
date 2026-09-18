import { type ISaleRepository } from '../../../domain/interfaces/sale.repository.js';
export declare class SaleSeeder {
    private readonly repository;
    private readonly logger;
    constructor(repository: ISaleRepository);
    seed(): Promise<void>;
}
