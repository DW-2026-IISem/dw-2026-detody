import { Sale } from '../../domain/entities/sale.entity.js';
import { type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
export declare class GetSaleByIdUseCase {
    private readonly saleRepository;
    constructor(saleRepository: ISaleRepository);
    execute(id: number): Promise<Sale>;
}
