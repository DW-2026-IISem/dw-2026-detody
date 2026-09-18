var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { ProductModel } from '../../../../products/infrastructure/persistence/models/product.model.js';
import { Sale, SaleItem } from '../../../domain/entities/sale.entity.js';
import { SaleItemModel } from '../models/sale-item.model.js';
import { SaleModel } from '../models/sale.model.js';
let SaleRepository = class SaleRepository {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get saleRepo() {
        return this.sequelize.getRepository(SaleModel);
    }
    get itemRepo() {
        return this.sequelize.getRepository(SaleItemModel);
    }
    get productRepo() {
        return this.sequelize.getRepository(ProductModel);
    }
    async create(sale) {
        const transaction = await this.sequelize.transaction();
        try {
            const createdSale = await this.saleRepo.create({
                clientId: sale.clientId,
                totalAmount: sale.totalAmount,
                status: sale.status,
            }, { transaction });
            const itemsToCreate = sale.items.map((item) => ({
                saleId: createdSale.id,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal,
            }));
            await this.itemRepo.bulkCreate(itemsToCreate, { transaction });
            for (const item of sale.items) {
                await this.productRepo.decrement('stock', {
                    by: item.quantity,
                    where: { id: item.productId },
                    transaction,
                });
            }
            await transaction.commit();
            return (await this.findById(createdSale.id));
        }
        catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async findAll(page, limit) {
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
    async findById(id) {
        const model = await this.saleRepo.findByPk(id, { include: [SaleItemModel] });
        return model ? this.toDomain(model) : null;
    }
    toDomain(m) {
        const items = (m.items ?? []).map((i) => new SaleItem({
            id: i.id,
            saleId: i.saleId,
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
            subtotal: Number(i.subtotal),
        }));
        return new Sale({
            id: m.id,
            clientId: m.clientId,
            totalAmount: Number(m.totalAmount),
            status: m.status ?? 'completed',
            items,
        });
    }
};
SaleRepository = __decorate([
    Injectable(),
    __param(0, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [Sequelize])
], SaleRepository);
export { SaleRepository };
//# sourceMappingURL=sale.repository.js.map