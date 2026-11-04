import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
import { SaleItemModel } from '../../../infrastructure/persistence/models/sale-item.model.js';
import { SaleModel } from '../../../infrastructure/persistence/models/sale.model.js';

@ApiTags('product-sales')
@Controller(['detalle-ventas', 'product-sales'])
export class ProductSalesController {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get itemRepo() {
    return this.sequelize.getRepository(SaleItemModel);
  }

  private get productRepo() {
    return this.sequelize.getRepository(ProductModel);
  }

  private get saleRepo() {
    return this.sequelize.getRepository(SaleModel);
  }

  @Get()
  async list(@Query('page') page = '1', @Query('limit') limit = '50') {
    const offset = (Number(page) - 1) * Number(limit);
    const { rows, count } = await this.itemRepo.findAndCountAll({
      limit: Number(limit),
      offset,
      order: [['id', 'DESC']],
    });

    const items = rows.map((m) => ({
      id: m.id,
      sale_id: m.saleId,
      saleId: m.saleId,
      product_id: m.productId,
      productId: m.productId,
      quantity: m.quantity,
      unit_price: Number(m.unitPrice),
      unitPrice: Number(m.unitPrice),
      subtotal: Number(m.subtotal),
      status: 'active',
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));

    return {
      items,
      meta: { page: Number(page), limit: Number(limit), total: count, totalPages: Math.ceil(count / Number(limit)) },
    };
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const m = await this.itemRepo.findByPk(id);
    if (!m) return null;
    return {
      id: m.id,
      sale_id: m.saleId,
      saleId: m.saleId,
      product_id: m.productId,
      productId: m.productId,
      quantity: m.quantity,
      unit_price: Number(m.unitPrice),
      unitPrice: Number(m.unitPrice),
      subtotal: Number(m.subtotal),
      status: 'active',
    };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() body: any) {
    const saleId = Number(body.sale_id ?? body.saleId);
    const productId = Number(body.product_id ?? body.productId);
    const quantity = Number(body.quantity ?? 1);

    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.productRepo.findByPk(productId, { transaction });
      if (!product) throw new Error('Product not found');

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;

      const created = await this.itemRepo.create(
        {
          saleId,
          productId,
          quantity,
          unitPrice,
          subtotal,
        },
        { transaction },
      );

      await this.productRepo.decrement('stock', {
        by: quantity,
        where: { id: productId },
        transaction,
      });

      // Recalcular venta
      await this.saleRepo.increment('totalAmount', {
        by: subtotal,
        where: { id: saleId },
        transaction,
      });

      await transaction.commit();

      return {
        id: created.id,
        sale_id: created.saleId,
        product_id: created.productId,
        quantity: created.quantity,
        unit_price: unitPrice,
        subtotal,
        status: 'active',
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const newQty = Number(body.quantity);
    const transaction = await this.sequelize.transaction();
    try {
      const item = await this.itemRepo.findByPk(id, { transaction });
      if (!item) throw new Error('Line not found');

      const oldQty = item.quantity;
      const diff = newQty - oldQty;

      const unitPrice = Number(item.unitPrice);
      const newSubtotal = unitPrice * newQty;
      const subtotalDiff = unitPrice * diff;

      await item.update({ quantity: newQty, subtotal: newSubtotal }, { transaction });

      if (diff > 0) {
        await this.productRepo.decrement('stock', {
          by: diff,
          where: { id: item.productId },
          transaction,
        });
      } else if (diff < 0) {
        await this.productRepo.increment('stock', {
          by: Math.abs(diff),
          where: { id: item.productId },
          transaction,
        });
      }

      await this.saleRepo.increment('totalAmount', {
        by: subtotalDiff,
        where: { id: item.saleId },
        transaction,
      });

      await transaction.commit();

      return {
        id: item.id,
        sale_id: item.saleId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: newSubtotal,
        status: 'active',
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    const transaction = await this.sequelize.transaction();
    try {
      const item = await this.itemRepo.findByPk(id, { transaction });
      if (!item) throw new Error('Line not found');

      await this.productRepo.increment('stock', {
        by: item.quantity,
        where: { id: item.productId },
        transaction,
      });

      await this.saleRepo.decrement('totalAmount', {
        by: Number(item.subtotal),
        where: { id: item.saleId },
        transaction,
      });

      await item.destroy({ transaction });
      await transaction.commit();

      return { success: true };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.deactivate(id);
  }
}
