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
var MainSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainSeeder = void 0;
const common_1 = require("@nestjs/common");
const client_seeder_js_1 = require("../../../../features/business/clients/infrastructure/persistence/seeders/client.seeder.js");
const product_type_seeder_js_1 = require("../../../../features/business/product-types/infrastructure/persistence/seeders/product-type.seeder.js");
const product_seeder_js_1 = require("../../../../features/business/products/infrastructure/persistence/seeders/product.seeder.js");
const sale_seeder_js_1 = require("../../../../features/business/sales/infrastructure/persistence/seeders/sale.seeder.js");
let MainSeeder = MainSeeder_1 = class MainSeeder {
    constructor(clientSeeder, productTypeSeeder, productSeeder, saleSeeder) {
        this.clientSeeder = clientSeeder;
        this.productTypeSeeder = productTypeSeeder;
        this.productSeeder = productSeeder;
        this.saleSeeder = saleSeeder;
        this.logger = new common_1.Logger(MainSeeder_1.name);
    }
    async run() {
        this.logger.log('Iniciando proceso de seeding global...');
        await this.clientSeeder.seed();
        await this.productTypeSeeder.seed();
        await this.productSeeder.seed();
        await this.saleSeeder.seed();
        this.logger.log('Seeding global finalizado exitosamente.');
    }
};
exports.MainSeeder = MainSeeder;
exports.MainSeeder = MainSeeder = MainSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_seeder_js_1.ClientSeeder,
        product_type_seeder_js_1.ProductTypeSeeder,
        product_seeder_js_1.ProductSeeder,
        sale_seeder_js_1.SaleSeeder])
], MainSeeder);
//# sourceMappingURL=main.seeder.js.map