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
exports.ListSalesUseCase = void 0;
const common_1 = require("@nestjs/common");
const sale_repository_js_1 = require("../../domain/interfaces/sale.repository.js");
const sale_mapper_js_1 = require("../mappers/sale.mapper.js");
let ListSalesUseCase = class ListSalesUseCase {
    constructor(saleRepository) {
        this.saleRepository = saleRepository;
    }
    async execute(page, limit) {
        const { items, total } = await this.saleRepository.findAll(page, limit);
        return {
            items: items.map(sale_mapper_js_1.SaleMapper.toResponse),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
};
exports.ListSalesUseCase = ListSalesUseCase;
exports.ListSalesUseCase = ListSalesUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(sale_repository_js_1.SALE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ListSalesUseCase);
//# sourceMappingURL=list-sales.use-case.js.map