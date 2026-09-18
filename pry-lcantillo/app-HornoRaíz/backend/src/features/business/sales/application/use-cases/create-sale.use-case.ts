import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY, type IClientRepository } from '../../../clients/domain/interfaces/client.repository.js';
import { ClientNotFoundException } from '../../../clients/domain/exceptions/client.exceptions.js';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../../products/domain/interfaces/product.repository.js';
import { ProductNotFoundException } from '../../../products/domain/exceptions/product.exceptions.js';
import { Sale, SaleItemProps } from '../../domain/entities/sale.entity.js';
import { EmptySaleItemsException, InsufficientStockException } from '../../domain/exceptions/sale.exceptions.js';
import { SALE_REPOSITORY, type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
import { CreateSaleDto } from '../dto/create-sale.dto.js';

@Injectable()
export class CreateSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateSaleDto): Promise<Sale> {
    if (!dto.items || dto.items.length === 0) {
      throw new EmptySaleItemsException();
    }

    const clientExists = await this.clientRepository.findById(dto.clientId);
    if (!clientExists) {
      throw new ClientNotFoundException(dto.clientId);
    }

    const preparedItems: SaleItemProps[] = [];

    for (const itemDto of dto.items) {
      const product = await this.productRepository.findById(itemDto.productId);
      if (!product) {
        throw new ProductNotFoundException(itemDto.productId);
      }
      if (product.stock < itemDto.quantity) {
        throw new InsufficientStockException(product.name, product.stock, itemDto.quantity);
      }

      preparedItems.push({
        productId: product.id!,
        quantity: itemDto.quantity,
        unitPrice: product.price,
        subtotal: product.price * itemDto.quantity,
      });
    }

    const newSale = new Sale({
      clientId: dto.clientId,
      items: preparedItems,
      status: 'completed',
    });

    return this.saleRepository.create(newSale);
  }
}
