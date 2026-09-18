import { type IClientRepository } from '../../../clients/domain/interfaces/client.repository.js';
import { type IProductRepository } from '../../../products/domain/interfaces/product.repository.js';
import { Sale } from '../../domain/entities/sale.entity.js';
import { type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
import { CreateSaleDto } from '../dto/create-sale.dto.js';
export declare class CreateSaleUseCase {
    private readonly saleRepository;
    private readonly clientRepository;
    private readonly productRepository;
    constructor(saleRepository: ISaleRepository, clientRepository: IClientRepository, productRepository: IProductRepository);
    execute(dto: CreateSaleDto): Promise<Sale>;
}
