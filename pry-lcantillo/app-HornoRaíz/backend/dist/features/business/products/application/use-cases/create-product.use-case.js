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
import { ProductNameAlreadyExistsException } from '../../domain/exceptions/product.exceptions.js';
import { PRODUCT_REPOSITORY } from '../../domain/interfaces/product.repository.js';
import { PRODUCT_TYPE_REPOSITORY } from '../../../product-types/domain/interfaces/product-type.repository.js';
import { ProductTypeNotFoundException } from '../../../product-types/domain/exceptions/product-type.exceptions.js';
import { ProductMapper } from '../mappers/product.mapper.js';
let CreateProductUseCase = class CreateProductUseCase {
    repository;
    productTypeRepository;
    constructor(repository, productTypeRepository) {
        this.repository = repository;
        this.productTypeRepository = productTypeRepository;
    }
    async execute(dto) {
        const typeExists = await this.productTypeRepository.findById(dto.productTypeId);
        if (!typeExists) {
            throw new ProductTypeNotFoundException(dto.productTypeId);
        }
        const existingName = await this.repository.findByName(dto.name);
        if (existingName) {
            throw new ProductNameAlreadyExistsException(dto.name);
        }
        return this.repository.create(ProductMapper.toEntity(dto));
    }
};
CreateProductUseCase = __decorate([
    Injectable(),
    __param(0, Inject(PRODUCT_REPOSITORY)),
    __param(1, Inject(PRODUCT_TYPE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object])
], CreateProductUseCase);
export { CreateProductUseCase };
//# sourceMappingURL=create-product.use-case.js.map