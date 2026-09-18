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
import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductTypeDto } from '../../../application/dto/create-product-type.dto.js';
import { ProductTypeMapper } from '../../../application/mappers/product-type.mapper.js';
import { CreateProductTypeUseCase } from '../../../application/use-cases/create-product-type.use-case.js';
import { GetProductTypeByIdUseCase } from '../../../application/use-cases/get-product-type-by-id.use-case.js';
import { ListProductTypesUseCase } from '../../../application/use-cases/list-product-types.use-case.js';
let ProductTypesController = class ProductTypesController {
    createProductType;
    listProductTypes;
    getProductType;
    constructor(createProductType, listProductTypes, getProductType) {
        this.createProductType = createProductType;
        this.listProductTypes = listProductTypes;
        this.getProductType = getProductType;
    }
    async create(dto) {
        const item = await this.createProductType.execute(dto);
        return ProductTypeMapper.toResponse(item);
    }
    async list(page = '1', limit = '10') {
        return this.listProductTypes.execute(Number(page), Number(limit));
    }
    async findOne(id) {
        const item = await this.getProductType.execute(id);
        return ProductTypeMapper.toResponse(item);
    }
};
__decorate([
    Post(),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProductTypeDto]),
    __metadata("design:returntype", Promise)
], ProductTypesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query('page')),
    __param(1, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductTypesController.prototype, "list", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductTypesController.prototype, "findOne", null);
ProductTypesController = __decorate([
    ApiTags('product-types'),
    Controller('product-types'),
    __metadata("design:paramtypes", [CreateProductTypeUseCase,
        ListProductTypesUseCase,
        GetProductTypeByIdUseCase])
], ProductTypesController);
export { ProductTypesController };
//# sourceMappingURL=product-types.controller.js.map