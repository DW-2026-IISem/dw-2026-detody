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
import { ProductType } from '../../../domain/entities/product-type.entity.js';
import { ProductTypeModel } from '../models/product-type.model.js';
let ProductTypeRepository = class ProductTypeRepository {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get repo() {
        return this.sequelize.getRepository(ProductTypeModel);
    }
    async create(productType) {
        const created = await this.repo.create({
            name: productType.name,
            description: productType.description,
        });
        return this.toDomain(created);
    }
    async findAll(page, limit) {
        const offset = (page - 1) * limit;
        const { rows, count } = await this.repo.findAndCountAll({ limit, offset });
        return {
            items: rows.map((m) => this.toDomain(m)),
            total: count,
        };
    }
    async findById(id) {
        const model = await this.repo.findByPk(id);
        return model ? this.toDomain(model) : null;
    }
    async findByName(name) {
        const model = await this.repo.findOne({ where: { name } });
        return model ? this.toDomain(model) : null;
    }
    toDomain(m) {
        return new ProductType({
            id: m.id,
            name: m.name,
            description: m.description ?? null,
        });
    }
};
ProductTypeRepository = __decorate([
    Injectable(),
    __param(0, Inject(SEQUELIZE)),
    __metadata("design:paramtypes", [Sequelize])
], ProductTypeRepository);
export { ProductTypeRepository };
//# sourceMappingURL=product-type.repository.js.map