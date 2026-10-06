"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_module_js_1 = require("../../../../../../infrastructure/database/sequelize/sequelize.module.js");
const product_entity_js_1 = require("../../../domain/entities/product.entity.js");
const product_model_js_1 = require("../models/product.model.js");
let ProductRepository = class ProductRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    get repo() {
        return this.sequelize.getRepository(product_model_js_1.ProductModel);
    }
    async create(product) {
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
        return new product_entity_js_1.Product({
            id: m.id,
            name: m.name,
            description: m.description ?? null,
            price: Number(m.price),
            stock: m.stock,
            productTypeId: m.productTypeId,
            status: m.status ?? 'active',
        });
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(sequelize_module_js_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map