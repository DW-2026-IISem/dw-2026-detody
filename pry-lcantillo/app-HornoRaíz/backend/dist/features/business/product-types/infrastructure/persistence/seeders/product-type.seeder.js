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
var ProductTypeSeeder_1;
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProductType } from '../../../domain/entities/product-type.entity.js';
import { PRODUCT_TYPE_REPOSITORY } from '../../../domain/interfaces/product-type.repository.js';
let ProductTypeSeeder = ProductTypeSeeder_1 = class ProductTypeSeeder {
    repository;
    logger = new Logger(ProductTypeSeeder_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async seed() {
        const initialTypes = [
            { name: 'Panadería Tradicional', description: 'Panes de uso diario, mogollas y aliñados' },
            { name: 'Pastelería y Repostería', description: 'Tortas, ponqués y postres fríos' },
            { name: 'Bebidas e Infusiones', description: 'Cafés, jugos e infusiones naturales' },
        ];
        for (const t of initialTypes) {
            const exists = await this.repository.findByName(t.name);
            if (!exists) {
                await this.repository.create(new ProductType(t));
                this.logger.log(`Seeder product-types: tipo "${t.name}" creado`);
            }
        }
    }
};
ProductTypeSeeder = ProductTypeSeeder_1 = __decorate([
    Injectable(),
    __param(0, Inject(PRODUCT_TYPE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProductTypeSeeder);
export { ProductTypeSeeder };
//# sourceMappingURL=product-type.seeder.js.map