import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY, type ISaleRepository } from '../../domain/interfaces/sale.repository.js';
import { SaleMapper } from '../mappers/sale.mapper.js';

@Injectable()
export class ListSalesUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.saleRepository.findAll(page, limit);
    return {
      items: items.map(SaleMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
