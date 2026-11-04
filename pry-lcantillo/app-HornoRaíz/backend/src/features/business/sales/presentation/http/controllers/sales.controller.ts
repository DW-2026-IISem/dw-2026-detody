import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../../domain/interfaces/sale.repository.js';
import { ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from '../../../application/dto/create-sale.dto.js';
import { SaleMapper } from '../../../application/mappers/sale.mapper.js';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case.js';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales.use-case.js';

@ApiTags('sales')
@Controller(['sales', 'ventas'])
export class SalesController {
  constructor(
    private readonly createSale: CreateSaleUseCase,
    private readonly listSales: ListSalesUseCase,
    private readonly getSale: GetSaleByIdUseCase,
    @Inject(SALE_REPOSITORY) private readonly repository: any,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() body: any) {
    const clientId = Number(body.clientId ?? body.client_id);
    const rawItems = body.items ?? [];
    const items = rawItems.map((i: any) => ({
      productId: Number(i.productId ?? i.product_id),
      quantity: Number(i.quantity),
    }));
    const sale = await this.createSale.execute({ clientId, items });
    return SaleMapper.toResponse(sale);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const sale = await this.repository.deactivate(id);
    return sale ? SaleMapper.toResponse(sale) : null;
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.repository.delete(id);
    return { success: true };
  }

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.listSales.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sale = await this.getSale.execute(id);
    return SaleMapper.toResponse(sale);
  }
}
