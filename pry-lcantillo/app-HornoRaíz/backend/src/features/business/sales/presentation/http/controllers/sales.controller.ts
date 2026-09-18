import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSaleDto } from '../../../application/dto/create-sale.dto.js';
import { SaleMapper } from '../../../application/mappers/sale.mapper.js';
import { CreateSaleUseCase } from '../../../application/use-cases/create-sale.use-case.js';
import { GetSaleByIdUseCase } from '../../../application/use-cases/get-sale-by-id.use-case.js';
import { ListSalesUseCase } from '../../../application/use-cases/list-sales.use-case.js';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(
    private readonly createSale: CreateSaleUseCase,
    private readonly listSales: ListSalesUseCase,
    private readonly getSale: GetSaleByIdUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateSaleDto) {
    const sale = await this.createSale.execute(dto);
    return SaleMapper.toResponse(sale);
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
