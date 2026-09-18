import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { IProductRepository } from '../../../domain/interfaces/product.repository.js';
import { ProductModel } from '../models/product.model.js';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(ProductModel);
  }

  async create(product: Product): Promise<Product> {
    const created = await this.repo.create({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      productTypeId: product.productTypeId,
      status: product.status,
    });
    return this.toDomain(created);
  }

  async findAll(page: number, limit: number): Promise<{ items: Product[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.repo.findAndCountAll({ limit, offset });
    return {
      items: rows.map((m) => this.toDomain(m)),
      total: count,
    };
  }

  async findById(id: number): Promise<Product | null> {
    const model = await this.repo.findByPk(id);
    return model ? this.toDomain(model) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const model = await this.repo.findOne({ where: { name } });
    return model ? this.toDomain(model) : null;
  }

  private toDomain(m: ProductModel): Product {
    return new Product({
      id: m.id,
      name: m.name,
      description: m.description ?? null,
      price: Number(m.price),
      stock: m.stock,
      productTypeId: m.productTypeId,
      status: (m.status as 'active' | 'inactive') ?? 'active',
    });
  }
}
