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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_sale_dto_js_1 = require("../../../application/dto/create-sale.dto.js");
const sale_mapper_js_1 = require("../../../application/mappers/sale.mapper.js");
const create_sale_use_case_js_1 = require("../../../application/use-cases/create-sale.use-case.js");
const get_sale_by_id_use_case_js_1 = require("../../../application/use-cases/get-sale-by-id.use-case.js");
const list_sales_use_case_js_1 = require("../../../application/use-cases/list-sales.use-case.js");
let SalesController = class SalesController {
    constructor(createSale, listSales, getSale) {
        this.createSale = createSale;
        this.listSales = listSales;
        this.getSale = getSale;
    }
    async create(dto) {
        const sale = await this.createSale.execute(dto);
        return sale_mapper_js_1.SaleMapper.toResponse(sale);
    }
    async list(page = '1', limit = '10') {
        return this.listSales.execute(Number(page), Number(limit));
    }
    async findOne(id) {
        const sale = await this.getSale.execute(id);
        return sale_mapper_js_1.SaleMapper.toResponse(sale);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_js_1.CreateSaleDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "findOne", null);
exports.SalesController = SalesController = __decorate([
    (0, swagger_1.ApiTags)('sales'),
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [create_sale_use_case_js_1.CreateSaleUseCase,
        list_sales_use_case_js_1.ListSalesUseCase,
        get_sale_by_id_use_case_js_1.GetSaleByIdUseCase])
], SalesController);
//# sourceMappingURL=sales.controller.js.map