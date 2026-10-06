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
var ProductSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSeeder = void 0;
const common_1 = require("@nestjs/common");
const product_entity_js_1 = require("../../../domain/entities/product.entity.js");
const product_repository_js_1 = require("../../../domain/interfaces/product.repository.js");
let ProductSeeder = ProductSeeder_1 = class ProductSeeder {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(ProductSeeder_1.name);
    }
    async seed() {
        const productName = 'Pan Baguette Masa Madre';
        const exists = await this.repository.findByName(productName);
        if (!exists) {
            await this.repository.create(new product_entity_js_1.Product({
                name: productName,
                description: 'Baguette crocante tradicional 300g',
                price: 8500,
                stock: 30,
                productTypeId: 1,
                status: 'active',
            }));
            this.logger.log(`Seeder products: producto "${productName}" creado`);
        }
    }
};
exports.ProductSeeder = ProductSeeder;
exports.ProductSeeder = ProductSeeder = ProductSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(product_repository_js_1.PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProductSeeder);
//# sourceMappingURL=product.seeder.js.map