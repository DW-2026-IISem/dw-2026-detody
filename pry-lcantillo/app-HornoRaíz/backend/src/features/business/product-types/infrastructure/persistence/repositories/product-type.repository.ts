import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { ProductType } from '../../../domain/entities/product-type.entity.js';
import { IProductTypeRepository } from '../../../domain/interfaces/product-type.repository.js';
import { ProductTypeModel } from '../models/product-type.model.js';

@Injectable()
export class ProductTypeRepository implements IProductTypeRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(ProductTypeModel);
  }

  async create(productType: ProductType): Promise<ProductType> {
    const created = await this.repo.create({
      name: productType.name,
      description: productType.description,
    });
    return this.toDomain(created);
  }

  async findAll(page: number, limit: number): Promise<{ items: ProductType[]; total: number }> {
    const offset = (page - 1) * limit;
    const { rows, count } = await this.repo.findAndCountAll({ limit, offset });
    return {
      items: rows.map((m) => this.toDomain(m)),
      total: count,
    };
  }

  async findById(id: number): Promise<ProductType | null> {
    const model = await this.repo.findByPk(id);
    return model ? this.toDomain(model) : null;
  }

  async findByName(name: string): Promise<ProductType | null> {
    const model = await this.repo.findOne({ where: { name } });
    return model ? this.toDomain(model) : null;
  }

  private toDomain(m: ProductTypeModel): ProductType {
    return new ProductType({
      id: m.id,
      name: m.name,
      description: m.description ?? null,
    });
  }
}
