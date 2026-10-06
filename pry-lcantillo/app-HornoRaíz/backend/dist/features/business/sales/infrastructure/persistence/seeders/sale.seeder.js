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
var SaleSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleSeeder = void 0;
const common_1 = require("@nestjs/common");
const sale_entity_js_1 = require("../../../domain/entities/sale.entity.js");
const sale_repository_js_1 = require("../../../domain/interfaces/sale.repository.js");
let SaleSeeder = SaleSeeder_1 = class SaleSeeder {
    constructor(repository) {
        this.repository = repository;
        this.logger = new common_1.Logger(SaleSeeder_1.name);
    }
    async seed() {
        const existing = await this.repository.findById(1);
        if (!existing) {
            await this.repository.create(new sale_entity_js_1.Sale({
                clientId: 1,
                items: [{ productId: 1, quantity: 2, unitPrice: 8500, subtotal: 17000 }],
                status: 'completed',
            }));
            this.logger.log('Seeder sales: venta inicial creada con éxito');
        }
    }
};
exports.SaleSeeder = SaleSeeder;
exports.SaleSeeder = SaleSeeder = SaleSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(sale_repository_js_1.SALE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], SaleSeeder);
//# sourceMappingURL=sale.seeder.js.map