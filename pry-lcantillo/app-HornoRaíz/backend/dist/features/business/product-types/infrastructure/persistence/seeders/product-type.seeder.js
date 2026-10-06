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
var ProductTypeSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductTypeSeeder = void 0;
const common_1 = require("@nestjs/common");
const product_type_entity_js_1 = require("../../../domain/entities/product-type.entity.js");
const product_type_repository_js_1 = require("../../../domain/interfaces/product-type.repository.js");
let ProductTypeSeeder = ProductTypeSeeder_1 = class ProductTypeSeeder {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(ProductTypeSeeder_1.name);
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
                await this.repository.create(new product_type_entity_js_1.ProductType(t));
                this.logger.log(`Seeder product-types: tipo "${t.name}" creado`);
            }
        }
    }
};
exports.ProductTypeSeeder = ProductTypeSeeder;
exports.ProductTypeSeeder = ProductTypeSeeder = ProductTypeSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(product_type_repository_js_1.PRODUCT_TYPE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProductTypeSeeder);
//# sourceMappingURL=product-type.seeder.js.map