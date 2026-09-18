import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
import { Sale, SaleItem } from '../../../domain/entities/sale.entity.js';
import { ISaleRepository } from '../../../domain/interfaces/sale.repository.js';
import { SaleItemModel } from '../models/sale-item.model.js';
import { SaleModel } from '../models/sale.model.js';

@Injectable()
export class SaleRepository implements ISaleRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get saleRepo() {
    return this.sequelize.getRepository(SaleModel);
  }

  private get itemRepo() {
    return this.sequelize.getRepository(SaleItemModel);
  }

  private get productRepo() {
    return this.sequelize.getRepository(ProductModel);
  }

  async create(sale: Sale): Promise<Sale> {
    const transaction = await this.sequelize.transaction();
    try {
      const createdSale = await this.saleRepo.create(
        {
          clientId: sale.clientId,
          totalAmount: sale.totalAmount,
          status: sale.status,
        },
        { transaction },
      );

      const itemsToCreate = sale.items.map((item) => ({
        saleId: createdSale.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      }));

      await this.itemRepo.bulkCreate(itemsToCreate, { transaction });

      // Descontar Stock
      for (const item of sale.items) {
        await this.productRepo.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId },
          transaction,
        });
      }

      await transaction.commit();
      return (await this.findById(createdSale.id))!;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(page: number, limit: number): Promise<{ items: Sale[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.saleRepo.findAndCountAll({
      limit,
      offset,
      include: [SaleItemModel],
    });
    return {
      items: rows.map((m) => this.toDomain(m)),
      total: count,
    };
  }

  async findById(id: number): Promise<Sale | null> {
    const model = await this.saleRepo.findByPk(id, { include: [SaleItemModel] });
    return model ? this.toDomain(model) : null;
  }

  private toDomain(m: SaleModel): Sale {
    const items = (m.items ?? []).map(
      (i) =>
        new SaleItem({
          id: i.id,
          saleId: i.saleId,
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
          subtotal: Number(i.subtotal),
        }),
    );

    return new Sale({
      id: m.id,
      clientId: m.clientId,
      totalAmount: Number(m.totalAmount),
      status: (m.status as 'completed' | 'cancelled') ?? 'completed',
      items,
    });
  }
}
