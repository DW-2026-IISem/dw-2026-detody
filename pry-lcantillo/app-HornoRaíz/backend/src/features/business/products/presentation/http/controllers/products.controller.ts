import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PRODUCT_REPOSITORY, type IProductRepository } from '../../../domain/interfaces/product.repository.js';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../../../application/dto/create-product.dto.js';
import { ProductMapper } from '../../../application/mappers/product.mapper.js';
import { CreateProductUseCase } from '../../../application/use-cases/create-product.use-case.js';
import { GetProductByIdUseCase } from '../../../application/use-cases/get-product-by-id.use-case.js';
import { ListProductsUseCase } from '../../../application/use-cases/list-products.use-case.js';

@ApiTags('products')
@Controller(['products', 'productos'])
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductByIdUseCase,
    @Inject(PRODUCT_REPOSITORY) private readonly repository: any,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateProductDto) {
    const item = await this.createProduct.execute(dto);
    return ProductMapper.toResponse(item);
  }

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.listProducts.execute(Number(page), Number(limit));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.getProduct.execute(id);
    return ProductMapper.toResponse(item);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    const product = await this.repository.update(id, {
      ...dto,
      productTypeId: dto.productTypeId ?? dto.product_type_id,
      stock: dto.stock ?? dto.quantity,
    });
    return product ? ProductMapper.toResponse(product) : null;
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const product = await this.repository.deactivate(id);
    return product ? ProductMapper.toResponse(product) : null;
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.repository.delete(id);
    return { success: true };
  }
}