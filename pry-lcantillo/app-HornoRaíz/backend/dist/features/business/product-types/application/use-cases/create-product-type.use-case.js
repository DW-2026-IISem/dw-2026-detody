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
import { ProductTypeNameAlreadyExistsException } from '../../domain/exceptions/product-type.exceptions.js';
import { PRODUCT_TYPE_REPOSITORY } from '../../domain/interfaces/product-type.repository.js';
import { ProductTypeMapper } from '../mappers/product-type.mapper.js';
let CreateProductTypeUseCase = class CreateProductTypeUseCase {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute(dto) {
        const existing = await this.repository.findByName(dto.name);
        if (existing) {
            throw new ProductTypeNameAlreadyExistsException(dto.name);
        }
        return this.repository.create(ProductTypeMapper.toEntity(dto));
    }
};
CreateProductTypeUseCase = __decorate([
    Injectable(),
    __param(0, Inject(PRODUCT_TYPE_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreateProductTypeUseCase);
export { CreateProductTypeUseCase };
//# sourceMappingURL=create-product-type.use-case.js.map